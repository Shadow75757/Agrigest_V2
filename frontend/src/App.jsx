import React from 'react';
import { WeatherProvider } from './context/WeatherContext';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  return (
    <WeatherProvider>
      <div className="app">
        <Dashboard />
      </div>
    </WeatherProvider>
  );
}

export default App;