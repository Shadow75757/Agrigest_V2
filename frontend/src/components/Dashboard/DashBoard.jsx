import React from 'react';
import WeatherCards from '../WeatherCards/WeatherCards';
import Suggestions from '../Suggestions/Suggestions';
import { TemperatureChart, HumidityChart } from '../Charts';
import HistoryTable from '../History/HistoryTable';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="main-content">
      <div className="header">
        <h1>Gestão Agrícola Inteligente</h1>
        <div className="user-info">
          <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
          <span>Maria Silva</span>
        </div>
      </div>
      
      <WeatherCards />
      <Suggestions />
      
      <div className="charts-container">
        <div className="chart-card">
          <h3>Temperatura (Últimos 7 dias)</h3>
          <TemperatureChart />
        </div>
        <div className="chart-card">
          <h3>Umidade do Solo (Últimos 7 dias)</h3>
          <HumidityChart />
        </div>
      </div>
      
      <HistoryTable />
    </div>
  );
};

export default Dashboard;