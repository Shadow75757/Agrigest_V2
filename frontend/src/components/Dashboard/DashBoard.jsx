import React, { useEffect, useState, useContext, useRef } from 'react';
import { useLocation } from 'react-router-dom';
import WeatherCards from '../WeatherCards/WeatherCards';
import Suggestions from '../Suggestions/Suggestions';
import { TemperatureChart, HumidityChart } from '../Charts';
import HistoryTable from '../History/HistoryTable';
import logo from '../images/agrigest_logo-noBG-text.png';
import '../Auth/Login.css';
import './Dashboard.css';
import defaultUserIcon from '../images/default-user-icon.png';
import { WeatherContext } from '../../context/WeatherContext';
import axios from 'axios';
import Modal from 'react-modal';

const FADE_DURATION = 500; // ms

// alphabetical list of crops
const cropOptions = [
  { value: "vine", label: "Videira" },
  { value: "olive", label: "Oliveira" },
  { value: "corn", label: "Milho" },
  { value: "tomato", label: "Tomate" },
  { value: "rice", label: "Arroz" },
  { value: "wheat", label: "Trigo" },
  { value: "potato", label: "Batata" },
  { value: "lettuce", label: "Alface" },
  { value: "carrot", label: "Cenoura" },
  { value: "onion", label: "Cebola" },
  { value: "cabbage", label: "Couve" },
  { value: "strawberry", label: "Morango" },
  { value: "melon", label: "Melão" },
  { value: "watermelon", label: "Melancia" },
  { value: "beans", label: "Feijão" },
  { value: "soy", label: "Soja" },
  { value: "sunflower", label: "Girassol" },
  { value: "peanut", label: "Amendoim" },
  { value: "garlic", label: "Alho" },
  { value: "pepper", label: "Pimentão" },
  { value: "eggplant", label: "Berinjela" },
  { value: "spinach", label: "Espinafre" },
  { value: "broccoli", label: "Brócolis" },
  { value: "pumpkin", label: "Abóbora" },
  { value: "cucumber", label: "Pepino" },
  { value: "peas", label: "Ervilha" },
  { value: "chickpea", label: "Grão-de-bico" },
  { value: "barley", label: "Cevada" },
  { value: "oat", label: "Aveia" },
  { value: "sorghum", label: "Sorgo" },
  { value: "cassava", label: "Mandioca" },
  { value: "sweetpotato", label: "Batata-doce" },
  { value: "yam", label: "Inhame" },
  { value: "apple", label: "Maçã" },
  { value: "pear", label: "Pêra" },
  { value: "peach", label: "Pêssego" },
  { value: "plum", label: "Ameixa" },
  { value: "orange", label: "Laranja" },
  { value: "lemon", label: "Limão" },
  { value: "banana", label: "Banana" },
  { value: "pineapple", label: "Abacaxi" },
  { value: "grape", label: "Uva" },
  { value: "mango", label: "Manga" },
  { value: "papaya", label: "Mamão" },
  { value: "avocado", label: "Abacate" }
].sort((a, b) => a.label.localeCompare(b.label));

/**
 * Dashboard component responsible for rendering the main user interface,
 * handling dark mode toggle, user information display, location and weather context,
 * and managing countries and city suggestions.
 */
const Dashboard = () => {
  // Get current location from react-router
  const routerLocation = useLocation();

  // Extract location, updateLocation function and weather data from WeatherContext
  const { location, updateLocation, weather } = useContext(WeatherContext);

  // State to control if an overlay should be shown, initial value derived from router state
  const [showOverlay, setShowOverlay] = useState(
    routerLocation.state && routerLocation.state.showOverlay
  );

  // State to control fade out animation
  const [fadeOut, setFadeOut] = useState(false);

  // State for whether settings dropdown is open (dark mode & other settings)
  const [settingsOpen, setSettingsOpen] = useState(false);

  // State for dark mode enabled/disabled, initialized from localStorage
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  /**
   * Side effect that applies or removes dark mode CSS class on <body>,
   * and persists the dark mode state in localStorage.
   */
  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  /**
   * Toggles the dark mode state between true and false.
   */
  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // Retrieve user information from localStorage or provide defaults
  const username = localStorage.getItem('username') || 'Utilizador';
  const gender = localStorage.getItem('gender') || 'male';
  const randomNum = localStorage.getItem('userImgNum') || 1;

  // Determine the user image URL based on username and gender
  let userImg;
  if (username === 'guest') {
    userImg = defaultUserIcon; // Use a default icon for guest users
  } else {
    userImg = `https://randomuser.me/api/portraits/${gender === 'male' ? 'men' : 'women'}/${randomNum}.jpg`;
  }

  // State to store the list of countries fetched from an API
  const [countries, setCountries] = useState([]);

  // State to hold city suggestions for user input
  const [citySuggestions, setCitySuggestions] = useState([]);

  // Ref to hold a debounce timer ID for throttling suggestion fetches
  const suggestionDebounce = useRef(null);

  /**
   * Effect that fetches the list of countries from restcountries.com API once on mount.
   * It maps and sorts countries by their Portuguese common name or fallback to default name.
   * On error, it logs to the console.
   */
  useEffect(() => {
    const fetchCountries = async () => {
      try {
        const response = await axios.get('https://restcountries.com/v3.1/all');
        const sortedCountries = response.data
          .map(c => ({
            name: c.translations?.por?.common || c.name.common,
            code: c.cca2
          }))
          .sort((a, b) => a.name.localeCompare(b.name));
        setCountries(sortedCountries);
      } catch (error) {
        console.error('Erro ao buscar países:', error);
      }
    };
    fetchCountries();
  }, []);

  /**
   * Effect to get user's current city using browser geolocation API on component mount.
   * If location.city is not set and geolocation is available,
   * it retrieves latitude and longitude, then reverse geocodes using OpenStreetMap Nominatim API.
   * Updates location with city, town or village if found.
   * Silent failure if any error occurs.
   */
  useEffect(() => {
    if (!location.city && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.address && data.address.city) {
            updateLocation({ city: data.address.city });
          } else if (data.address && data.address.town) {
            updateLocation({ city: data.address.town });
          } else if (data.address && data.address.village) {
            updateLocation({ city: data.address.village });
          }
        } catch (err) {
          // Do nothing on failure
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  /**
   * Handler for city input field changes.
   * Updates location.city and debounces API calls for city suggestions.
   * Clears suggestions if input is empty or too short (<2 chars).
   */
  const handleCityChange = (e) => {
    const input = e.target.value;
    updateLocation({ city: input });

    if (suggestionDebounce.current) clearTimeout(suggestionDebounce.current);
    if (!input || input.length < 2) {
      setCitySuggestions([]);
      return;
    }
    suggestionDebounce.current = setTimeout(() => {
      fetchCitySuggestions(input);
    }, 600);
  };

  /**
   * Fetches city suggestions from GeoDB Cities API based on user input.
   * Filters by selected country or defaults to Portugal ('PT').
   * Limits to 5 cities sorted by descending population.
   * On success, updates citySuggestions state with city names.
   * On error, clears citySuggestions.
   */
  const fetchCitySuggestions = async (input) => {
    try {
      const response = await axios.get(`https://wft-geo-db.p.rapidapi.com/v1/geo/cities`, {
        params: {
          countryIds: countries.find(c => c.name === location.country)?.code || 'PT',
          namePrefix: input,
          limit: 5,
          sort: '-population'
        },
        headers: {
          'X-RapidAPI-Key': '0b494e92f4msh996ce1b2f132302p1e9f07jsn49afc1e214b7',
          'X-RapidAPI-Host': 'wft-geo-db.p.rapidapi.com'
        }
      });
      const cities = response.data.data.map(c => c.name);
      setCitySuggestions(cities);
    } catch (error) {
      setCitySuggestions([]);
    }
  };

  /**
   * Handler for country selection change.
   * Updates location with selected country and resets city to empty.
   * Clears city suggestions.
   */
  const handleCountryChange = (e) => {
    const selected = countries.find(c => c.name === e.target.value);
    updateLocation({
      country: selected ? selected.name : e.target.value,
      city: ''
    });
    setCitySuggestions([]);
  };

  /**
   * Handler for crop input changes.
   * Updates location.crop with new value.
   */
  const handleCropChange = (e) => {
    updateLocation({ crop: e.target.value });
  };

  /**
   * Handler for date input changes.
   * Updates location.date with new value.
   */
  const handleDateChange = (e) => {
    updateLocation({ date: e.target.value });
  };

  /**
   * Handler when user clicks on a city suggestion.
   * Updates location.city with the selected suggestion and clears suggestions list.
   */
  const handleSuggestionClick = (suggestion) => {
    updateLocation({ city: suggestion });
    setCitySuggestions([]);
  };

  /**
   * Effect to control overlay visibility and fade out animation.
   * When showOverlay is true, triggers fade out after 500ms,
   * then hides overlay after fade out duration.
   * Cleans up timers on unmount or showOverlay change.
   */
  useEffect(() => {
    if (showOverlay) {
      const timer = setTimeout(() => setFadeOut(true), 500);
      const removeTimer = setTimeout(() => setShowOverlay(false), 500 + FADE_DURATION);
      return () => {
        clearTimeout(timer);
        clearTimeout(removeTimer);
      };
    }
  }, [showOverlay]);

  return (
    <>
      {/* Overlay loading screen shown if showOverlay is true */}
      {showOverlay && (
        <div className={`loading-overlay fade-in${fadeOut ? ' fade-out' : ''}`}>
          <img src={logo} alt="Logo" className="loading-logo" />
        </div>
      )}

      {/* Dashboard wrapper container */}
      <div className="dashboard">

        {/* Sidebar navigation panel */}
        <div className="sidebar">

          {/* App logo section */}
          <div className="logo">
            <i className="fas fa-leaf"></i>
            <h2>Agrigest</h2>
          </div>

          {/* Navigation menu items */}
          <div className="nav-menu">

            {/* Dashboard item - marked as active */}
            <div className="nav-item active">
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </div>

            {/* Locations navigation item */}
            <div className="nav-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>Localizações</span>
            </div>

            {/* Analytics navigation item */}
            <div className="nav-item">
              <i className="fas fa-chart-line"></i>
              <span>Análises</span>
            </div>

            {/* History navigation item */}
            <div className="nav-item">
              <i className="fas fa-history"></i>
              <span>Histórico</span>
            </div>

            {/* Settings dropdown item with toggleable sub-options */}
            <div
              className="nav-item"
              onClick={() => setSettingsOpen((v) => !v)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <i className="fas fa-cog"></i>
              <span>Configurações</span>

              {/* Arrow indicator for dropdown */}
              <span
                className={`arrow-icon${settingsOpen ? ' open' : ''}`}
                style={{ marginLeft: 8 }}
              >
                ▼
              </span>

              {/* Settings dropdown panel */}
              <div className={`settings-dropdown${settingsOpen ? ' open' : ''}`}>

                {/* Dark mode toggle option */}
                <div
                  className="settings-option"
                  onClick={toggleDarkMode}
                >
                  {darkMode ? 'Desativar Dark Mode' : 'Ativar Dark Mode'}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main content area of the dashboard */}
        <div className="main-content">

          {/* Header section with title and user info */}
          <div className="header">
            <h1>Gestão Agrícola Inteligente</h1>

            {/* User profile display */}
            <div className="user-info">
              <img src={userImg} alt="User" />
              <span>{username}</span>
            </div>
          </div>

          {/* Filters section for selecting parameters like country, city, crop, and date */}
          <div className="filters">

            {/* Country filter dropdown */}
            <div className="filter-group">
              <label htmlFor="country">País</label>
              <select
                id="country"
                value={location.country}
                onChange={handleCountryChange}
              >
                {/* Render each country as an option */}
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>

            {/* City input field with autocomplete suggestions */}
            <div className="filter-group">
              <label htmlFor="city">Cidade</label>
              <input
                id="city"
                type="text"
                value={location.city}
                onChange={handleCityChange}
                placeholder="Digite a cidade"
              />

              {/* City suggestions dropdown list (only top 3) */}
              {citySuggestions.length > 0 && (
                <ul className="city-suggestions">
                  {citySuggestions.slice(0, 3).map((suggestion, index) => (
                    <li key={index} onClick={() => handleSuggestionClick(suggestion)}>
                      {suggestion}
                    </li>
                  ))}
                </ul>
              )}
            </div>

            {/* Crop type dropdown selector */}
            <div className="filter-group">
              <label htmlFor="crop">Cultivo</label>
              <select
                id="crop"
                value={location.crop}
                onChange={handleCropChange}
              >
                {/* Render crop options dynamically */}
                {cropOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>

            {/* Date input field */}
            <div className="filter-group">
              <label htmlFor="date">Data</label>
              <input
                type="date"
                id="date"
                value={location.date || ''}
                onChange={handleDateChange}
              />
            </div>
          </div>

          {/* Dashboard weather information cards */}
          <WeatherCards />

          {/* Suggested actions or tips section */}
          <Suggestions />

          {/* Charts section */}
          <div className="charts">
            {/* Temperature chart for the past 7 days */}
            <div className="chart-container">
              <div className="chart-title">Temperatura (Últimos 7 dias)</div>
              <TemperatureChart city={location.city} todayTemperature={weather?.temperature} />
            </div>

            {/* Soil humidity chart for the past 7 days */}
            <div className="chart-container">
              <div className="chart-title">Humidade do Solo (Últimos 7 dias)</div>
              <HumidityChart />
            </div>
          </div>

          {/* History section */}
          <div className="history">
            <div className="history-header">
              <div className="history-title">Histórico de Ações</div>

              {/* "View All" link for full history */}
              <div className="view-all">Ver Tudo</div>
            </div>

            {/* Table displaying action history */}
            <HistoryTable />
          </div>

        </div>
      </div>
    </>
  );
};

export default Dashboard;