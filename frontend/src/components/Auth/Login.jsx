import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeatherContext } from '../../context/WeatherContext';
import './Login.css';
import logo from '../images/agrigest_logo-noBG-text.png';

const FADE_DURATION = 500; // Duration of fade animations in ms

// Main Login component
const Login = () => {
  // Get login function from global context
  const { login } = useContext(WeatherContext);
  const navigate = useNavigate();

  // Main states for form and UI control
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // States to control initial splash screen with fade animation
  const [showSplash, setShowSplash] = useState(true);
  const [splashFadeIn, setSplashFadeIn] = useState(false);
  const [splashFadeOut, setSplashFadeOut] = useState(false);

  // States for loading overlay after login with fade animation
  const [showOverlay, setShowOverlay] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Effect to control splash screen: fade in, wait, fade out and hide
  useEffect(() => {
    setSplashFadeIn(true); // Start splash fade-in
    const fadeOutTimer = setTimeout(() => setSplashFadeOut(true), 1000); // Start fade-out after 1s
    const hideTimer = setTimeout(() => setShowSplash(false), 1000 + FADE_DURATION); // Hide splash after fade-out
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  /**
   * Shows loading overlay with fade-in, then navigates to the given route.
   * Creates a smooth transition between login screen and dashboard.
   * @param {string} to - route to navigate to
   */
  const showLoadingOverlayAndNavigate = (to) => {
    setShowOverlay(true);    // Show overlay
    setFadeIn(false);        // Reset fade-in to allow restart of animation
    setTimeout(() => setFadeIn(true), 10); // Trigger fade-in almost instantly
    setTimeout(() => {
      navigate(to, { state: { showOverlay: true } }); // Navigate after animation
    }, FADE_DURATION);
  };

  /**
   * Handles form submission for login.
   * Attempts login via context, on success stores user data and navigates.
   * @param {Event} e - form submit event
   */
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(credentials);
    setLoading(false);

    if (!success) {
      setError('Invalid credentials'); // Show error if login fails
    } else {
      setError('');
      // Set gender by username ending (simple heuristic for avatar)
      const gender = credentials.username.toLowerCase().endsWith('a') ? 'female' : 'male';
      // Random number for avatar selection
      const randomNum = Math.floor(Math.random() * 99) + 1;
      // Save user info to localStorage for later use
      localStorage.setItem('username', credentials.username);
      localStorage.setItem('gender', gender);
      localStorage.setItem('userImgNum', randomNum);
      // Show overlay and navigate to dashboard
      showLoadingOverlayAndNavigate('/dashboard');
    }
  };

  /**
   * Logs in as guest without password.
   * Also saves user info and navigates.
   */
  const handleGuestLogin = async () => {
    setLoading(true);
    const success = await login({ username: 'guest', password: '' });
    setLoading(false);

    if (!success) {
      setError('Unable to login as guest');
    } else {
      setError('');
      localStorage.setItem('username', 'guest');
      localStorage.setItem('gender', 'none');
      localStorage.setItem('userImgNum', 'guest');
      showLoadingOverlayAndNavigate('/dashboard');
    }
  };

  /**
   * Updates input fields and clears error if any.
   * @param {string} field - "username" or "password"
   * @returns {Function} event handler for input change
   */
  const handleChange = (field) => (e) => {
    setCredentials({ ...credentials, [field]: e.target.value });
    if (error) setError('');
  };

  return (
    <>
      {/* Initial splash overlay with fade animation */}
      {showSplash && (
        <div className={`loading-overlay${splashFadeIn ? ' fade-in' : ''}${splashFadeOut ? ' fade-out' : ''}`}>
          <img src={logo} alt="Logo" className="loading-logo" />
        </div>
      )}
      {/* Loading overlay shown after login, also with fade */}
      {showOverlay && (
        <div className={`loading-overlay${fadeIn ? ' fade-in' : ''}`}>
          <img src={logo} alt="Logo" className="loading-logo" />
        </div>
      )}

      {/* Main login form */}
      <div className={`login-container${showSplash ? ' splash-active' : ''}`}>
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}

          <div className="form-group">
            <label htmlFor="username">Username:</label>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={handleChange('username')}
              required
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Password:</label>
            <input
              id="password"
              type="password"
              value={credentials.password}
              onChange={handleChange('password')}
              required
            />
          </div>

          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </button>

          <button
            onClick={handleGuestLogin}
            className="guest-button"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            Login as Guest
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;
