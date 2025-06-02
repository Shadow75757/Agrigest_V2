import React from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate } from 'react-router-dom';
import { WeatherProvider, WeatherContext } from './context/WeatherContext';
import Login from './components/Auth/Login';
import Dashboard from './components/Dashboard/Dashboard';

const PrivateRoute = ({ children }) => {
  const { user } = React.useContext(WeatherContext);
  return user ? children : <Navigate to="/login" replace />;
};

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

export default App;