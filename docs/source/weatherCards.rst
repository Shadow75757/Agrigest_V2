WeatherCards.jsx
================

Module for displaying weather information cards using React and context.

Icon and Weather Mapping
------------------------
- Maps OpenWeatherMap icon codes to general weather types.
- Defines icon classes, colors, and labels for each weather type.

WeatherCards Component
----------------------
- Accesses weather data and loading state from `WeatherContext`.
- Displays loading message while data is unavailable.
- Maps weather icon code to a weather type.
- Renders multiple cards showing:
  - Current weather status with icon and description.
  - Temperature with max and min values.
  - Humidity percentage.
  - Precipitation amount.
  - Wind speed and direction.

Usage
-----
- This component expects `WeatherContext` to provide `weather` and `loading`.
- Integrates with CSS styles in `WeatherCards.css`.
