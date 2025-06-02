import React, { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import './Suggestions.css';

const Suggestions = () => {
  const { suggestions, loading } = useContext(WeatherContext);

  if (loading || !suggestions || suggestions.length === 0) {
    return <div className="loading">Carregando sugestões...</div>;
  }

  const getPriorityClass = (priority) => {
    switch (priority) {
      case 'high':
        return 'priority-high';
      case 'medium':
        return 'priority-medium';
      case 'low':
        return 'priority-low';
      default:
        return '';
    }
  };

  const getIcon = (type) => {
    switch (type) {
      case 'irrigation':
        return 'fas fa-tint';
      case 'fertilization':
        return 'fas fa-spray-can';
      case 'pest_control':
        return 'fas fa-bug';
      case 'sun_exposure':
        return 'fas fa-sun';
      default:
        return 'fas fa-info-circle';
    }
  };

  return (
    <div className="suggestions">
      <div className="suggestions-header">
        <div className="suggestions-title">Sugestões Agrícolas</div>
        <div className="last-update">Atualizado agora</div>
      </div>
      
      {suggestions.map((suggestion, index) => (
        <div className="suggestion-item" key={index}>
          <div className="suggestion-icon">
            <i className={getIcon(suggestion.type)}></i>
          </div>
          <div className="suggestion-text">
            <div className="suggestion-title">{suggestion.title}</div>
            <div className="suggestion-desc">{suggestion.description}</div>
          </div>
          <div className={`suggestion-priority ${getPriorityClass(suggestion.priority)}`}>
            {suggestion.priority === 'high' ? 'Alta' : 
             suggestion.priority === 'medium' ? 'Média' : 'Baixa'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Suggestions;