import React from 'react';
import WeatherCards from '../WeatherCards/WeatherCards';
import Suggestions from '../Suggestions/Suggestions';
import { TemperatureChart, HumidityChart } from '../Charts';
import HistoryTable from '../History/HistoryTable';
import './Dashboard.css';

const Dashboard = () => {
  return (
    <div className="dashboard">
      {/* Sidebar */}
      <div className="sidebar">
        <div className="logo">
          <i className="fas fa-leaf"></i>
          <h2>AgroSmart</h2>
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
            <img src="https://randomuser.me/api/portraits/women/44.jpg" alt="User" />
            <span>Maria Silva</span>
          </div>
        </div>

        {/* Filters */}
        <div className="filters">
          <div className="filter-group">
            <label htmlFor="country">País</label>
            <select id="country">
              <option value="portugal">Portugal</option>
              <option value="brazil">Brasil</option>
              <option value="spain">Espanha</option>
              <option value="france">França</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="city">Cidade</label>
            <select id="city">
              <option value="lisbon">Lisboa</option>
              <option value="porto">Porto</option>
              <option value="coimbra">Coimbra</option>
              <option value="faro">Faro</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="crop">Cultura</label>
            <select id="crop">
              <option value="vine">Videira</option>
              <option value="olive">Oliveira</option>
              <option value="corn">Milho</option>
              <option value="tomato">Tomate</option>
            </select>
          </div>
          <div className="filter-group">
            <label htmlFor="date">Data</label>
            <input type="date" id="date" />
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
            <TemperatureChart />
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
  );
};

export default Dashboard;