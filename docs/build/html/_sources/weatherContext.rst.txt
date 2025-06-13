WeatherContext
==============

The `WeatherContext` provides shared state and functions related to weather data,
user authentication, location, and suggestions for agricultural activities based
on weather conditions.

This context includes:

- **weather**: Current weather data object.
- **suggestions**: List of actionable recommendations based on weather and crop.
- **history**: Array of past weather queries or interactions.
- **loading**: Boolean flag indicating if data is being fetched.
- **location**: Object representing the current location (`country`, `city`, `crop`).
- **user**: Current logged-in user information or `null` if not logged in.

Functions provided:

- **updateLocation(newLocation)**: Updates the location state by merging new values (e.g., change city or crop).
- **login(credentials)**: Performs user login via API; returns `true` if successful, `false` otherwise.
- **logout()**: Logs out the current user by clearing the user state.

Usage
-----

Wrap your component tree with the `WeatherProvider` to provide this context:

.. code-block:: jsx

    <WeatherProvider>
      <YourAppComponents />
    </WeatherProvider>

Inside components, access context values with:

.. code-block:: jsx

    import { useContext } from 'react';
    import { WeatherContext } from './path/to/WeatherContext';

    const MyComponent = () => {
      const { weather, suggestions, user, login, logout } = useContext(WeatherContext);

      // Use these values and functions as needed
    };

This context helps centralize and manage weather-related data, user sessions,
and provides actionable insights for crop management.
