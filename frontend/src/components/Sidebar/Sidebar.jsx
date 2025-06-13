import React from 'react';
import { NavLink } from 'react-router-dom';
import './Sidebar.css';

// Functional component rendering the sidebar navigation menu
const Sidebar = () => {
  return (
    <div className="sidebar">
      {/* Logo section with icon and title */}
      <div className="logo">
        <i className="fas fa-leaf"></i>
        <h2>AgroSmart</h2>
      </div>
      
      {/* Navigation menu with links to different app sections */}
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

/**
 * Sidebar functional component rendering the sidebar navigation menu.
 *
 * This component displays the application's logo and a vertical navigation menu.
 * The navigation menu contains links to different sections of the app such as Dashboard,
 * Localizações, Análises, Histórico, and Configurações. Each link includes an icon
 * and a label. The active link is visually highlighted.
 *
 * :return: JSX element representing the sidebar with logo and navigation links.
 */
