import React, { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import './WeatherCards.css';

const WeatherCards = () => {
  const { weather, loading } = useContext(WeatherContext);

  if (loading || !weather) {
    return <div className="loading">Carregando dados meteorológicos...</div>;
  }

  return (
    <div className="dashboard-cards">
      <div className="card">
        <div className="card-header">
          <div className="card-title">Temperatura</div>
          <div className="card-icon temperature">
            <i className="fas fa-thermometer-half"></i>
          </div>
        </div>
        <div className="card-value">{weather.temperature}°C</div>
        <div className="card-footer">Máx: {weather.temp_max}°C | Mín: {weather.temp_min}°C</div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <div className="card-title">Humidade</div>
          <div className="card-icon humidity">
            <i className="fas fa-tint"></i>
          </div>
        </div>
        <div className="card-value">{weather.humidity}%</div>
        <div className="card-footer">Ar: {weather.humidity}% | Solo: {weather.soil_humidity}%</div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <div className="card-title">Precipitação</div>
          <div className="card-icon rain">
            <i className="fas fa-cloud-rain"></i>
          </div>
        </div>
        <div className="card-value">{weather.precipitation}mm</div>
        <div className="card-footer">Últimas 24h</div>
      </div>
      
      <div className="card">
        <div className="card-header">
          <div className="card-title">Velocidade do Vento</div>
          <div className="card-icon wind">
            <i className="fas fa-wind"></i>
          </div>
        </div>
        <div className="card-value">{weather.wind_speed} km/h</div>
        <div className="card-footer">Direção: {weather.wind_direction}</div>
      </div>
    </div>
  );
};

export default WeatherCards;