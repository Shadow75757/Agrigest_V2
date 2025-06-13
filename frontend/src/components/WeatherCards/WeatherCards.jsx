import React, { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import './WeatherCards.css';

// Map OpenWeatherMap icon codes to weather types
// This object matches weather icon codes to general weather categories.
const iconMap = {
  "01d": "Clear", "01n": "Clear",
  "02d": "Clouds", "02n": "Clouds",
  "03d": "Clouds", "03n": "Clouds",
  "04d": "Clouds", "04n": "Clouds",
  "09d": "Rain", "09n": "Rain",
  "10d": "Rain", "10n": "Rain",
  "11d": "Thunderstorm", "11n": "Thunderstorm",
  "13d": "Snow", "13n": "Snow",
  "50d": "Mist", "50n": "Mist"
};

// Define weather details for each general weather type
// This object contains icon classes, colors, and labels for UI display.
const weatherMap = {
  Clear: { icon: "fas fa-sun", color: "#FFD600", label: "Ensolarado" },
  Clouds: { icon: "fas fa-cloud", color: "#90A4AE", label: "Nublado" },
  Rain: { icon: "fas fa-cloud-showers-heavy", color: "#2196F3", label: "Chuva" },
  Drizzle: { icon: "fas fa-cloud-rain", color: "#64B5F6", label: "Garoa" },
  Thunderstorm: { icon: "fas fa-bolt", color: "#757575", label: "Trovoada" },
  Snow: { icon: "fas fa-snowflake", color: "#B3E5FC", label: "Neve" },
  Mist: { icon: "fas fa-smog", color: "#B0BEC5", label: "Névoa" }
};

const WeatherCards = () => {
  // Access weather data and loading state from context
  const { weather, loading } = useContext(WeatherContext);

  // Show loading message if data is not ready
  if (loading || !weather) {
    return <div className="loading">Carregando dados meteorológicos...</div>;
  }

  // Determine main weather type from icon code
  const mainWeather = iconMap[weather.icon] || "Clear";

  // Get weather info for UI or fallback if unknown
  const weatherInfo = weatherMap[mainWeather] || {
    icon: "fas fa-question",
    color: "#BDBDBD",
    label: weather.description || "Desconhecido"
  };

  // Render weather cards with weather details
  return (
    <div className="dashboard-cards">
      {/* Weather status card */}
      <div className="card" style={{ borderColor: weatherInfo.color }}>
        <div className="card-header">
          <div className="card-title">Tempo Atual</div>
          <div className="card-icon" style={{
            background: weatherInfo.color,
            color: "#fff",
            borderRadius: "50%",
            width: 40,
            height: 40,
            display: "flex",
            alignItems: "center",
            justifyContent: "center"
          }}>
            <i className={weatherInfo.icon}></i>
          </div>
        </div>
        <div className="card-value">{weatherInfo.label}</div>
        <div className="card-footer">{weather.description}</div>
      </div>

      {/* Temperature card */}
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

      {/* Humidity card */}
      <div className="card">
        <div className="card-header">
          <div className="card-title">Humidade</div>
          <div className="card-icon humidity">
            <i className="fas fa-tint"></i>
          </div>
        </div>
        <div className="card-value">{weather.humidity}%</div>
        <div className="card-footer">Últimas 24h</div>
      </div>

      {/* Precipitation card */}
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

      {/* Wind speed card */}
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

/**
 * WeatherCards component displays multiple weather information cards.
 * It shows current weather status, temperature, humidity, precipitation, and wind speed.
 *
 * Uses weather data from WeatherContext.
 * Maps weather icon codes to general weather types to determine display.
 * Applies corresponding icons, colors, and labels for each weather type.
 *
 * @component
 * @returns {JSX.Element} The rendered weather cards UI.
 */
