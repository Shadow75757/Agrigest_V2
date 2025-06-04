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

const FADE_DURATION = 500; // ms

const Dashboard = () => {
  const location = useLocation();
  const [showOverlay, setShowOverlay] = useState(
    location.state && location.state.showOverlay
  );
  const [fadeOut, setFadeOut] = useState(false);

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

  // Filters state
  const [country, setCountry] = useState('portugal');
  const [city, setCity] = useState('');
  const [crop, setCrop] = useState('vine');
  const [date, setDate] = useState('');

  // Get updateLocation from WeatherContext
  const { updateLocation } = useContext(WeatherContext);
  const debounceTimeout = useRef(null);

  // Try to get user's city on mount
  useEffect(() => {
    if (!city && navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(async (position) => {
        const { latitude, longitude } = position.coords;
        try {
          const response = await fetch(
            `https://nominatim.openstreetmap.org/reverse?format=json&lat=${latitude}&lon=${longitude}`
          );
          const data = await response.json();
          if (data.address && data.address.city) {
            setCity(data.address.city);
          } else if (data.address && data.address.town) {
            setCity(data.address.town);
          } else if (data.address && data.address.village) {
            setCity(data.address.village);
          }
        } catch (err) {
          // If geolocation or fetch fails, do nothing (city stays empty)
        }
      });
    }
  }, [city]);

  // Debounced update for city input
  useEffect(() => {
    if (!city) return;
    if (debounceTimeout.current) clearTimeout(debounceTimeout.current);

    debounceTimeout.current = setTimeout(() => {
      updateLocation({ city });
    }, 600); // 600ms after user stops typing

    return () => clearTimeout(debounceTimeout.current);
  }, [city, updateLocation]);

  const handleCountryChange = (e) => {
    setCountry(e.target.value);
  };

  const handleCityChange = (e) => {
    setCity(e.target.value);
  };

  const handleCropChange = (e) => {
    setCrop(e.target.value);
  };

  const handleDateChange = (e) => {
    setDate(e.target.value);
  };

  useEffect(() => {
    if (showOverlay) {
      const timer = setTimeout(() => setFadeOut(true), 500); // Wait before fade out
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
            <div className="nav-item">
              <i className="fas fa-cog"></i>
              <span>Configurações</span>
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
              <select id="country" value={country} onChange={handleCountryChange}>
                <option value="portugal">Portugal</option>
                <option value="brazil">Brasil</option>
                <option value="spain">Espanha</option>
                <option value="france">França</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="city">Cidade</label>
              <input
                id="city"
                type="text"
                value={city}
                onChange={handleCityChange}
                placeholder="Digite a cidade"
              />
            </div>
            <div className="filter-group">
              <label htmlFor="crop">Cultura</label>
              <select id="crop" value={crop} onChange={handleCropChange}>
                <option value="vine">Videira</option>
                <option value="olive">Oliveira</option>
                <option value="corn">Milho</option>
                <option value="tomato">Tomate</option>
              </select>
            </div>
            <div className="filter-group">
              <label htmlFor="date">Data</label>
              <input type="date" id="date" value={date} onChange={handleDateChange} />
            </div>
            <div style={{ margin: '1em 0', color: '#0077cc', fontWeight: 'bold' }}>
              Cidade digitada: {city}
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
              <TemperatureChart city={city} />
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