// Simulates an API call to OpenWeatherMap providing weather data for a given city
export const fetchWeatherData = async (city) => {
  // In a real application, this would be an actual API request.
  // Here, it returns simulated weather data after a delay.
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

// Simulates a WebSocket connection for real-time weather updates
export const setupWeatherWebSocket = (onUpdate) => {
  // In a real application, this would open a WebSocket connection.
  // Here, it triggers periodic updates via a timer.
  const interval = setInterval(() => {
    const randomVariation = Math.random() * 2 - 1; // generates a random number between -1 and 1
    onUpdate({
      temperature: 24 + randomVariation,
      humidity: 65 + randomVariation * 2
    });
  }, 30000); // Updates every 30 seconds

  // Returns a cleanup function to stop updates
  return () => clearInterval(interval);
};

/**
 * Simulates an API call to fetch weather data for a specific city.
 *
 * This function imitates the behavior of calling the OpenWeatherMap API,
 * but instead returns hardcoded weather data after a short delay. The
 * returned data includes current conditions and a week-long historical record.
 *
 * :param city: The name of the city for which to fetch weather data.
 * :return: A Promise resolving to an object containing weather details.
 */

/**
 * Simulates a WebSocket connection for real-time weather updates.
 *
 * Instead of a real WebSocket, this function uses a timer to periodically
 * invoke the provided callback with slight random variations in temperature
 * and humidity to mimic live data updates. It returns a function that can
 * be called to stop the updates and clean up resources.
 *
 * :param onUpdate: Callback function to handle incoming weather updates.
 * :return: A function that clears the interval and stops updates when called.
 */
