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

// Lista de cultivos ordenada alfabeticamente pelo label
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

const Dashboard = () => {
  const routerLocation = useLocation();
  const { location, updateLocation, weather } = useContext(WeatherContext);
  const [showOverlay, setShowOverlay] = useState(
    routerLocation.state && routerLocation.state.showOverlay
  );
  const [fadeOut, setFadeOut] = useState(false);

  // Dark mode & settings dropdown
  const [settingsOpen, setSettingsOpen] = useState(false);
  const [darkMode, setDarkMode] = useState(() => {
    return localStorage.getItem('darkMode') === 'true';
  });

  useEffect(() => {
    if (darkMode) {
      document.body.classList.add('dark-mode');
    } else {
      document.body.classList.remove('dark-mode');
    }
    localStorage.setItem('darkMode', darkMode);
  }, [darkMode]);

  const toggleDarkMode = () => setDarkMode((prev) => !prev);

  // User info from localStorage
  const username = localStorage.getItem('username') || 'Utilizador';
  const gender = localStorage.getItem('gender') || 'male';
  const randomNum = localStorage.getItem('userImgNum') || 1;
  let userImg;
  if (username === 'guest') {
    userImg = defaultUserIcon;
  } else {
    userImg = `https://randomuser.me/api/portraits/${gender === 'male' ? 'men' : 'women'}/${randomNum}.jpg`;
  }

  // Países e sugestões de cidades
  const [countries, setCountries] = useState([]);
  const [citySuggestions, setCitySuggestions] = useState([]);
  const suggestionDebounce = useRef(null);

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
          // Se falhar, não faz nada
        }
      });
    }
    // eslint-disable-next-line
  }, []);

  // Debounce para sugestões de cidades
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

  const handleCountryChange = (e) => {
    const selected = countries.find(c => c.name === e.target.value);
    updateLocation({
      country: selected ? selected.name : e.target.value,
      city: ''
    });
    setCitySuggestions([]);
  };

  const handleCropChange = (e) => {
    updateLocation({ crop: e.target.value });
  };

  const handleDateChange = (e) => {
    updateLocation({ date: e.target.value });
  };

  const handleSuggestionClick = (suggestion) => {
    updateLocation({ city: suggestion });
    setCitySuggestions([]);
  };

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
      {showOverlay && (
        <div className={`loading-overlay fade-in${fadeOut ? ' fade-out' : ''}`}>
          <img src={logo} alt="Logo" className="loading-logo" />
        </div>
      )}
      <div className="dashboard">
        {/* Sidebar */}
        <div className="sidebar">
          <div className="logo">
            <i className="fas fa-leaf"></i>
            <h2>Agrigest</h2>
          </div>
          <div className="nav-menu">
            <div className="nav-item active">
              <i className="fas fa-tachometer-alt"></i>
              <span>Dashboard</span>
            </div>
            <div className="nav-item">
              <i className="fas fa-map-marker-alt"></i>
              <span>Localizações</span>
            </div>
            <div className="nav-item">
              <i className="fas fa-chart-line"></i>
              <span>Análises</span>
            </div>
            <div className="nav-item">
              <i className="fas fa-history"></i>
              <span>Histórico</span>
            </div>
            <div
              className="nav-item"
              onClick={() => setSettingsOpen((v) => !v)}
              style={{ cursor: 'pointer', position: 'relative' }}
            >
              <i className="fas fa-cog"></i>
              <span>Configurações</span>
              <span
                className={`arrow-icon${settingsOpen ? ' open' : ''}`}
                style={{ marginLeft: 8 }}
              >
                ▼
              </span>
              <div className={`settings-dropdown${settingsOpen ? ' open' : ''}`}>
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

        {/* Main Content */}
        <div className="main-content">
          <div className="header">
            <h1>Gestão Agrícola Inteligente</h1>
            <div className="user-info">
              <img src={userImg} alt="User" />
              <span>{username}</span>
            </div>
          </div>

          {/* Filters */}
          <div className="filters">
            <div className="filter-group">
              <label htmlFor="country">País</label>
              <select
                id="country"
                value={location.country}
                onChange={handleCountryChange}
              >
                {countries.map((c) => (
                  <option key={c.code} value={c.name}>{c.name}</option>
                ))}
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="city">Cidade</label>
              <input
                id="city"
                type="text"
                value={location.city}
                onChange={handleCityChange}
                placeholder="Digite a cidade"
              />
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
            <div className="filter-group">
              <label htmlFor="crop">Cultivo</label>
              <select
                id="crop"
                value={location.crop}
                onChange={handleCropChange}
              >
                {cropOptions.map(opt => (
                  <option key={opt.value} value={opt.value}>{opt.label}</option>
                ))}
              </select>
            </div>
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

          {/* Dashboard Cards */}
          <WeatherCards />

          {/* Suggestions */}
          <Suggestions />

          {/* Charts */}
          <div className="charts">
            <div className="chart-container">
              <div className="chart-title">Temperatura (Últimos 7 dias)</div>
              <TemperatureChart city={location.city} todayTemperature={weather?.temperature} />
            </div>
            <div className="chart-container">
              <div className="chart-title">Humidade do Solo (Últimos 7 dias)</div>
              <HumidityChart />
            </div>
          </div>

          {/* History */}
          <div className="history">
            <div className="history-header">
              <div className="history-title">Histórico de Ações</div>
              <div className="view-all">Ver Tudo</div>
            </div>
            <HistoryTable />
          </div>
        </div>
      </div>
    </>
  );
};

export default Dashboard;