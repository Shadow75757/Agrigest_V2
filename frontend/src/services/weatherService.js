// Simulação de chamada à API OpenWeatherMap
export const fetchWeatherData = async (city) => {
  // Em uma aplicação real, isso seria uma chamada à API
  // Aqui estamos simulando dados
  return new Promise((resolve) => {
    setTimeout(() => {
      const weatherData = {
        temperature: 24,
        temp_max: 28,
        temp_min: 18,
        humidity: 65,
        soil_humidity: 72,
        precipitation: 5,
        wind_speed: 12,
        wind_direction: 'NE',
        historical: [
          { date: '01/06', temp_avg: 22, temp_max: 26, temp_min: 18, soil_humidity: 68, precipitation: 0 },
          { date: '02/06', temp_avg: 23, temp_max: 27, temp_min: 19, soil_humidity: 65, precipitation: 0 },
          { date: '03/06', temp_avg: 21, temp_max: 25, temp_min: 17, soil_humidity: 70, precipitation: 2 },
          { date: '04/06', temp_avg: 20, temp_max: 24, temp_min: 16, soil_humidity: 75, precipitation: 5 },
          { date: '05/06', temp_avg: 22, temp_max: 26, temp_min: 18, soil_humidity: 72, precipitation: 1 },
          { date: '06/06', temp_avg: 25, temp_max: 29, temp_min: 21, soil_humidity: 68, precipitation: 0 },
          { date: '07/06', temp_avg: 24, temp_max: 28, temp_min: 20, soil_humidity: 70, precipitation: 0 }
        ]
      };
      resolve(weatherData);
    }, 500);
  });
};

// Simulação de WebSocket para atualizações em tempo real
export const setupWeatherWebSocket = (onUpdate) => {
  // Em uma aplicação real, isso seria uma conexão WebSocket
  const interval = setInterval(() => {
    const randomVariation = Math.random() * 2 - 1; // -1 a 1
    onUpdate({
      temperature: 24 + randomVariation,
      humidity: 65 + randomVariation * 2
    });
  }, 30000); // Atualiza a cada 30 segundos

  return () => clearInterval(interval);
};