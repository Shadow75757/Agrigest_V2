Filters.jsx
===========

Filters Component
-----------------

- Renders filter dropdowns for selecting country, city, crop, and date.
- Uses WeatherContext to access and update location state.
- Handles user input changes and updates location data accordingly.

handleChange function
~~~~~~~~~~~~~~~~~~~~~

- Handles change events from filter inputs.
- Extracts the input's name and value.
- Calls `updateLocation` from context to update the location state with the changed value.

Usage
~~~~~

- Import and include `<Filters />` in a React component tree wrapped by `WeatherContext.Provider`.
- Used for filtering weather or crop data based on location and crop type.
