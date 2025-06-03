import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';
import { WeatherContext } from '../../context/WeatherContext';
import './Login.css';
import logo from './logo.png';

const FADE_DURATION = 500; // ms

const Login = () => {
  const { login } = useContext(WeatherContext);
  const navigate = useNavigate();
  const [credentials, setCredentials] = useState({ username: '', password: '' });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  // Overlay states
  const [showOverlay, setShowOverlay] = useState(false);
  const [fadeIn, setFadeIn] = useState(false);

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
      showLoadingOverlayAndNavigate('/dashboard');
    }
  };

  const handleChange = (field) => (e) => {
    setCredentials({ ...credentials, [field]: e.target.value });
    if (error) setError('');
  };

  return (
    <>
      {showOverlay && (
        <div className={`loading-overlay${fadeIn ? ' fade-in' : ''}`}>
          <img src={logo} alt="Logo" className="loading-logo" />
        </div>
      )}
      <div className="login-container">
        <form onSubmit={handleSubmit} className="login-form">
          <h2>Login</h2>
          {error && <div className="error-message">{error}</div>}
          <div className="form-group">
            <label htmlFor="username">Usuário</label>
            <input
              id="username"
              type="text"
              value={credentials.username}
              onChange={handleChange('username')}
              required
            />
          </div>
          <div className="form-group">
            <label htmlFor="password">Senha</label>
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
            Entrar como convidado
          </button>
        </form>
      </div>
    </>
  );
};

export default Login;