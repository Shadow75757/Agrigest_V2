import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

const Sidebar = () => {
  return (
    <div className="sidebar">
      <div className="logo">
        <i className="fas fa-leaf"></i>
        <h2>AgroSmart</h2>
      </div>
      
      <div className="nav-menu">
        <NavLink to="/" className="nav-item" activeClassName="active" exact>
          <i className="fas fa-tachometer-alt"></i>
          <span>Dashboard</span>
        </NavLink>
        <NavLink to="/locations" className="nav-item" activeClassName="active">
          <i className="fas fa-map-marker-alt"></i>
          <span>Localizações</span>
        </NavLink>
        <NavLink to="/analytics" className="nav-item" activeClassName="active">
          <i className="fas fa-chart-line"></i>
          <span>Análises</span>
        </NavLink>
        <NavLink to="/history" className="nav-item" activeClassName="active">
          <i className="fas fa-history"></i>
          <span>Histórico</span>
        </NavLink>
        <NavLink to="/settings" className="nav-item" activeClassName="active">
          <i className="fas fa-cog"></i>
          <span>Configurações</span>
        </NavLink>
      </div>
    </div>
  );
};

export default Sidebar;