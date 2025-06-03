import React, { useEffect, useState } from 'react';
import { WeatherProvider } from './context/WeatherContext';
import Dashboard from './components/Dashboard/Dashboard';
import './App.css';

function App() {
  const [showSplash, setShowSplash] = useState(true);
  const [fade, setFade] = useState(false);

  useEffect(() => {
    const fadeTimer = setTimeout(() => setFade(true), 800);
    const hideTimer = setTimeout(() => setShowSplash(false), 1300);
    return () => {
      clearTimeout(fadeTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  return (
    <WeatherProvider>
      {showSplash && <SplashScreen fade={fade} />}
      <div className="app" style={{ display: showSplash ? 'none' : 'block' }}>
        <Dashboard />
      </div>
    </WeatherProvider>
  );
}

export default App;