import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeatherContext } from '../../context/WeatherContext';
import './Login.css';
import logo from '../images/agrigest_logo-noBG-text.png';

const FADE_DURATION = 500; // ms

const Login = () => {
  // Get the login function from context
  const { login } = useContext(WeatherContext);
  const navigate = useNavigate();

  // Base states
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Splash overlay states (initial load)
  const [showSplash, setShowSplash] = useState(true);
  const [splashFadeIn, setSplashFadeIn] = useState(false);
  const [splashFadeOut, setSplashFadeOut] = useState(false);

  // Login overlay states (after login)
  const [showOverlay, setShowOverlay] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Splash screen effect on mount: fade in, then fade out, then hide
  useEffect(() => {
    setSplashFadeIn(true); // Start fade-in
    const fadeOutTimer = setTimeout(() => setSplashFadeOut(true), 1000); // ms
    const hideTimer = setTimeout(() => setShowSplash(false), 1000 + FADE_DURATION); // Add FADE_DURATION to garentee fade-out completes
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Show loading overlay and navigate after fade-in
  // for context, we didn't get to make a fully working overlay effect, as a work arround, after a successful login,
  // we show the fade in animation still on the login page
  // once the website loads the dashboard it initiates the page with the fade out animation
  // this way the transition is seamless ;)
  const showLoadingOverlayAndNavigate = (to) => {
    setShowOverlay(true); // Show overlay
    setFadeIn(false); // Reset fade-in
    setTimeout(() => setFadeIn(true), 10); // Trigger fade-in quickly
    setTimeout(() => {
      navigate(to, { state: { showOverlay: true } }); // Navigate after fade-in
    }, FADE_DURATION); // Wait for fade-in to finish
  };

  // Handle login form submit
  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(credentials); // Try login with credentials
    setLoading(false);
    if (!success) {
      setError('Credenciais inválidas'); // Show error if login fails
    } else {
      setError('');
      // Guess gender based on username ending (for avatar)
      const gender = credentials.username.toLowerCase().endsWith('a') ? 'female' : 'male';
      // Pick a random avatar number
      const randomNum = Math.floor(Math.random() * 99) + 1;
      // Store user info in localStorage
      localStorage.setItem('username', credentials.username);
      localStorage.setItem('gender', gender);
      localStorage.setItem('userImgNum', randomNum);
      // Show overlay and navigate to dashboard
      showLoadingOverlayAndNavigate('/dashboard');
    }
  };

  // Handle guest login button
  const handleGuestLogin = async () => {
    setLoading(true);
    const success = await login({ username: 'guest', password: '' }); // Login as guest
    setLoading(false);
    if (!success) {
      setError('Não foi possível logar como convidado'); // Show error if fails
    } else {
      setError('');
      // Store guest info in localStorage
      localStorage.setItem('username', 'guest');
      localStorage.setItem('gender', 'none');
      localStorage.setItem('userImgNum', 'guest');
      // Show overlay and navigate to dashboard
      showLoadingOverlayAndNavigate('/dashboard');
    }
  };

  // Handle input changes for username/password
  const handleChange = (field) => (e) => {
    setCredentials({ ...credentials, [field]: e.target.value });
    if (error) setError(''); // Clear error on change
  };

  return (
    <>
      {/* Splash overlay on initial load */}
      {showSplash && (
        <div className={`loading-overlay${splashFadeIn ? ' fade-in' : ''}${splashFadeOut ? ' fade-out' : ''}`}>
          <img src={logo} alt="Logo" className="loading-logo" />
        </div>
      )}
      {/* Loading overlay after login/guest login */}
      {showOverlay && (
        <div className={`loading-overlay${fadeIn ? ' fade-in' : ''}`}>
          <img src={logo} alt="Logo" className="loading-logo" />
        </div>
      )}
      {/* Login form (always rendered) */}
      <div className={`login-container${showSplash ? ' splash-active' : ''}`}>
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
          {/* Show error message if present */}
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Utilizador:</label>
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
          {/* Login button */}
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'A entrar...' : 'Entrar'}
          </button>
          {/* Guest login button */}
          <button
            onClick={handleGuestLogin}
            className="guest-button"
            disabled={loading}
            style={{ marginTop: '10px' }}
          >
            Entrar como guest
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;