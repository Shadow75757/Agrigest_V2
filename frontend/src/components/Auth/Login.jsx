import React, { useState, useContext, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeatherContext } from '../../context/WeatherContext';
import './Login.css';
import logo from '../images/agrigest_logo-noBG-text.png';

const FADE_DURATION = 500; // ms

const Login = () => {
  const { login } = useContext(WeatherContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Splash overlay states
  const [showSplash, setShowSplash] = useState(true);
  const [splashFadeIn, setSplashFadeIn] = useState(false);
  const [splashFadeOut, setSplashFadeOut] = useState(false);

  // Login overlay states
  const [showOverlay, setShowOverlay] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

  // Splash screen effect on mount
  useEffect(() => {
    setSplashFadeIn(true);
    const fadeOutTimer = setTimeout(() => setSplashFadeOut(true), 1000);
    const hideTimer = setTimeout(() => setShowSplash(false), 1000 + FADE_DURATION);
    return () => {
      clearTimeout(fadeOutTimer);
      clearTimeout(hideTimer);
    };
  }, []);

  // Show overlay on login/guest login
  const showLoadingOverlayAndNavigate = (to) => {
    setShowOverlay(true);
    setFadeIn(false);
    setTimeout(() => setFadeIn(true), 10); // Fast fade-in
    setTimeout(() => {
      navigate(to, { state: { showOverlay: true } });
    }, FADE_DURATION); // Wait for fade-in to finish
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(credentials);
    setLoading(false);
    if (!success) {
      setError('Credenciais inválidas');
    } else {
      setError('');
      const gender = credentials.username.toLowerCase().endsWith('a') ? 'female' : 'male';
      const randomNum = Math.floor(Math.random() * 99) + 1;
      localStorage.setItem('username', credentials.username);
      localStorage.setItem('gender', gender);
      localStorage.setItem('userImgNum', randomNum);
      showLoadingOverlayAndNavigate('/dashboard');
    }
  };

  const handleGuestLogin = async () => {
    setLoading(true);
    const success = await login({ username: 'guest', password: '' });
    setLoading(false);
    if (!success) {
      setError('Não foi possível logar como convidado');
    } else {
      setError('');
      localStorage.setItem('username', 'guest');
      localStorage.setItem('gender', 'none');
      localStorage.setItem('userImgNum', 'guest');
      showLoadingOverlayAndNavigate('/dashboard');
    }
  };

  const handleChange = (field) => (e) => {
    setCredentials({ ...credentials, [field]: e.target.value });
    if (error) setError('');
  };

  return (
    <>
      {/* Splash overlay on initial load */}
      {showSplash && (
        <div className={`loading-overlay${splashFadeIn ? ' fade-in' : ''}${splashFadeOut ? ' fade-out' : ''}`}>
          <img src={logo} alt="Logo" className="loading-logo" />
        </div>
      )}
      {/* Login overlay on login */}
      {showOverlay && (
        <div className={`loading-overlay${fadeIn ? ' fade-in' : ''}`}>
          <img src={logo} alt="Logo" className="loading-logo" />
        </div>
      )}
      {/* Login form always rendered */}
      <div className={`login-container${showSplash ? ' splash-active' : ''}`}>
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
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
          <button type="submit" className="login-button" disabled={loading}>
            {loading ? 'Entrando...' : 'Entrar'}
          </button>
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