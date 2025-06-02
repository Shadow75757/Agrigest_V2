import React, { useState, useContext } from 'react';
import { useNavigate } from 'react-router-dom';  // <-- IMPORT
import { WeatherContext } from '../../context/WeatherContext';
import './Login.css';

const Login = () => {
  const { login } = useContext(WeatherContext);
  const navigate = useNavigate();  // <-- HOOK
  const [credentials, setCredentials] = useState({
    username: '',
    password: ''
  });
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    const success = await login(credentials);
    setLoading(false);
    if (!success) {
      setError('Credenciais inválidas');
    } else {
      setError('');
      navigate('/dashboard');  // <-- redireciona aqui
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
      navigate('/dashboard');  // <-- redireciona aqui também
    }
  };

  const handleChange = (field) => (e) => {
    setCredentials({ ...credentials, [field]: e.target.value });
    if (error) setError('');
  };

  return (
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
  );
};

export default Login;
