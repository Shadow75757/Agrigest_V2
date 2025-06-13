// Importing required libraries and components
import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { WeatherProvider, WeatherContext } from './context/WeatherContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';

// PrivateRoute component checks if the user is authenticated
// If user is authenticated, it renders the given children (protected components)
// If not, it redirects to the login page
const PrivateRoute = ({ children }) => {
  const { user } = React.useContext(WeatherContext);
  return user ? children : <Navigate to="/login" replace />;
};

/**
 * PrivateRoute component for protected routing.
 *
 * Checks if the user is authenticated via context. If the user exists, it renders
 * the given children, which represent protected routes. If the user is not authenticated,
 * it redirects to the login page using the `Navigate` component.
 *
 * :param children: The child components (usually routes) to render if authenticated.
 * :return: The protected content or a redirect to the login page.
 */
 
// App component sets up context and routing for the entire application
// Wraps the app in WeatherProvider for context usage
// Defines routing for login and dashboard with protection on dashboard route
function App() {
  return (
    <WeatherProvider>
      <Router>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route 
            path="/*" 
            element={
              <PrivateRoute>
                <Dashboard />
              </PrivateRoute>
            } 
          />
        </Routes>
      </Router>
    </WeatherProvider>
  );
}

/**
 * App component initializes the application routing and context provider.
 *
 * This component wraps the entire application with the `WeatherProvider` context,
 * enabling global state access. It uses `react-router-dom` to define two main routes:
 * - `/login` renders the login page.
 * - All other routes are protected and render the dashboard inside `PrivateRoute`.
 *
 * :return: JSX representing the full application with routing and context.
 */

export default App;
