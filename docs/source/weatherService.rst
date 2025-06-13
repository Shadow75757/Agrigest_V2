=======================
WeatherService.js
=======================

Simulated weather data fetching and real-time update utilities.

---------------------------
Function: fetchWeatherData
---------------------------

- Simulates an asynchronous API call to fetch weather data for a city.
- Returns current weather stats including temperature, humidity, wind, and precipitation.
- Provides a historical record of weather data over a week.
- Introduces a 500ms artificial delay to mimic network latency.

---------------------------------
Function: setupWeatherWebSocket
---------------------------------

- Simulates a WebSocket connection providing live weather updates every 30 seconds.
- Calls the provided update handler with random variations in temperature and humidity.
- Returns a cleanup function that cancels the periodic updates.

