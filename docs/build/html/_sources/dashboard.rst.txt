Dashboard.jsx
===================

Overview
--------
The ``Dashboard`` component is the main user interface for the Agrigest application. It integrates weather information, user profile display, geolocation-based city detection, dark mode, country/city/crop selection, and data visualization (weather cards, suggestions, charts, and history).

This component relies heavily on context (`WeatherContext`) and browser/localStorage APIs to manage user settings and geolocation data.

Main Functionalities
--------------------
- Display and update weather, humidity, and temperature data.
- Fetch and allow selection of country, city, and crop.
- Display user profile image (custom or default).
- Geolocation-based automatic city detection.
- Dark mode toggle with persistent storage in localStorage.
- Display historical weather data using charts and tables.

State Variables
---------------
- ``showOverlay``: Boolean – Controls whether to display the initial overlay (e.g. intro screen).
- ``fadeOut``: Boolean – Manages fade-out transition animation of overlay.
- ``settingsOpen``: Boolean – Controls whether the settings dropdown is open.
- ``darkMode``: Boolean – Toggles dark mode appearance.
- ``countries``: Array – Stores list of countries fetched from API.
- ``citySuggestions``: Array – Holds suggested cities from user input.
- ``suggestionDebounce``: Ref – Timeout ref to throttle API calls for suggestions.

Context Usage
-------------
- ``WeatherContext`` provides:
  - ``location``: Object – Holds current location, country, city, date, and crop.
  - ``updateLocation``: Function – Updates location fields in the context.
  - ``weather``: Object – Contains the fetched weather data.

Effects
-------
- Toggle dark mode (adds/removes `.dark-mode` class on ``<body>``).
- Fetch list of countries from `restcountries.com` on mount.
- Auto-detect user city via Geolocation and OpenStreetMap Nominatim.
- Overlay fade-out timing (500ms delay before hiding).

Event Handlers
--------------
- ``toggleDarkMode()``: Toggles between dark and light UI themes.
- ``handleCityChange(e)``: Updates city in location and triggers suggestion API call.
- ``handleCountryChange(e)``: Sets selected country and clears city.
- ``handleCropChange(e)``: Sets selected crop in location.
- ``handleDateChange(e)``: Sets selected date in location.
- ``handleSuggestionClick(suggestion)``: Selects a suggested city.

APIs Used
---------
- `restcountries.com`: For retrieving countries and their codes.
- `Nominatim (OpenStreetMap)`: For reverse geolocation (lat/lon to city).
- `GeoDB Cities`: For city autocomplete suggestions.

Assets
------
- ``agrigest_logo-noBG-text.png``: Logo.
- ``default-user-icon.png``: Placeholder icon for guests.

Components Used
---------------
- ``WeatherCards``: Displays weather conditions.
- ``Suggestions``: Shows city suggestions.
- ``TemperatureChart`` and ``HumidityChart``: Displays charts for weather data.
- ``HistoryTable``: Displays a table of historical data.

Crop Options
------------
A large predefined list of common crop types in Portuguese (e.g., Videira, Tomate, Trigo), sorted alphabetically.

User Info
---------
Retrieved from ``localStorage``:
- ``username``: Fallback to 'Utilizador'
- ``gender``: male/female (used to determine profile image)
- ``userImgNum``: Used with `randomuser.me` to generate unique avatar images

Styling
-------
CSS files imported:
- ``Login.css``
- ``Dashboard.css``

Third-Party Libraries
---------------------
- ``axios``: Used for HTTP requests.
- ``Modal`` (from `react-modal`): Used for modal rendering.
- ``react-router-dom``: `useLocation` for route state.
- ``WeatherContext``: Provides location and weather context.
- ``randomuser.me``: For profile image avatars.

Usage
-----
This component is typically used as the landing dashboard after user login. It assumes the presence of context, proper route setup, and required assets and child components.

``Dashboard`` does not accept props and is fully context-driven.

