import React, { createContext, useState, useEffect } from 'react';
import { io } from 'socket.io-client';
import { saveToLocalStorage, loadFromLocalStorage } from '../services/storageService';

export const WeatherContext = createContext();

export const WeatherProvider = ({ children }) => {
  const [weather, setWeather] = useState(loadFromLocalStorage('weather') || null);
  const [suggestions, setSuggestions] = useState([]);
  const [history, setHistory] = useState(loadFromLocalStorage('history') || []);
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [socket, setSocket] = useState(null);
  const [location, setLocation] = useState({
    country: 'portugal',
    city: 'lisbon',
    crop: 'vine'
  });

  useEffect(() => {
    // Conectar ao WebSocket
    const newSocket = io('http://localhost:5000');
    setSocket(newSocket);

    newSocket.on('weather_update', (data) => {
      setWeather(data);
      saveToLocalStorage('weather', data);
    });

    return () => newSocket.close();
  }, []);

  useEffect(() => {
    const loadData = async () => {
      setLoading(true);
      try {
        // Buscar dados da API
        const response = await fetch(`http://localhost:5000/api/weather/${location.city}`);
        const weatherData = await response.json();
        
        if (socket) {
          socket.emit('subscribe_weather', { city: location.city });
        }

        setWeather(weatherData);
        saveToLocalStorage('weather', weatherData);
        
        // Gerar sugestões (agora no frontend)
        const farmingSuggestions = generateSuggestions(location.crop, weatherData);
        setSuggestions(farmingSuggestions);
        
        setLoading(false);
      } catch (error) {
        console.error("Error loading data:", error);
        setLoading(false);
      }
    };

    loadData();
  }, [location, socket]);

  const generateSuggestions = (crop, weatherData) => {
    // Lógica de sugestões movida para o frontend
    const baseSuggestions = [
      {
        type: 'irrigation',
        title: 'Irrigação',
        description: weatherData.precipitation < 5 ? 
          'Aumentar irrigação em 20% devido à baixa precipitação.' : 
          'Reduzir irrigação em 20% devido à previsão de chuva.',
        priority: weatherData.precipitation < 5 ? 'high' : 'medium'
      },
      // ... outras sugestões
    ];
    return baseSuggestions;
  };

  const updateLocation = (newLocation) => {
    setLocation(prev => ({ ...prev, ...newLocation }));
  };

  const login = async (credentials) => {
    try {
      const response = await fetch('http://localhost:5000/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials)
      });
      
      const data = await response.json();
      if (response.ok) {
        setUser(data.user);
        return true;
      }
      return false;
    } catch (error) {
      console.error("Login error:", error);
      return false;
    }
  };

  const logout = () => {
    setUser(null);
  };

  return (
    <WeatherContext.Provider 
      value={{ 
        weather, 
        suggestions, 
        history, 
        loading, 
        location, 
        user,
        updateLocation,
        login,
        logout
      }}
    >
      {children}
    </WeatherContext.Provider>
  );
};