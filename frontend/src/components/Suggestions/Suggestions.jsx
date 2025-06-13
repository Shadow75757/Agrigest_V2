import React, { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import './Suggestions.css';

// Mapping of crop keys to their Portuguese labels
const cropLabels = {
  vine: 'Videira',
  olive: 'Oliveira',
  corn: 'Milho',
  tomato: 'Tomate',
  rice: 'Arroz',
  wheat: 'Trigo',
  potato: 'Batata',
  lettuce: 'Alface',
  carrot: 'Cenoura',
  onion: 'Cebola',
  cabbage: 'Couve',
  strawberry: 'Morango',
  melon: 'Melão',
  watermelon: 'Melancia',
  beans: 'Feijão',
  soy: 'Soja',
  sunflower: 'Girassol',
  peanut: 'Amendoim',
  garlic: 'Alho',
  pepper: 'Pimentão',
  eggplant: 'Berinjela',
  spinach: 'Espinafre',
  broccoli: 'Brócolis',
  pumpkin: 'Abóbora',
  cucumber: 'Pepino',
  peas: 'Ervilha',
  chickpea: 'Grão de Bico',
  barley: 'Cevada',
  oat: 'Aveia',
  sorghum: 'Sorgo',
  cassava: 'Mandioca',
  sweetpotato: 'Batata Doce',
  apple: 'Maçã',
  pear: 'Pêra',
  peach: 'Pêssego',
  plum: 'Ameixa',
  orange: 'Laranja',
  lemon: 'Limão',
  banana: 'Banana',
  pineapple: 'Abacaxi',
  grape: 'Uva',
  mango: 'Manga',
  papaya: 'Mamão',
  avocado: 'Abacate'
};

// Returns the CSS class name based on priority level
const getPriorityClass = (priority) => {
  switch (priority) {
    case 'high': return 'priority-high';
    case 'medium': return 'priority-medium';
    case 'low': return 'priority-low';
    default: return '';
  }
};

// Returns the Portuguese label for the priority level
const getPriorityLabel = (priority) => {
  switch (priority) {
    case 'high': return 'Alta';
    case 'medium': return 'Média';
    case 'low': return 'Baixa';
    default: return 'Desconhecida';
  }
};

// Returns the FontAwesome icon class based on suggestion type
const getIcon = (type) => {
  switch (type) {
    case 'irrigation': return 'fas fa-tint';
    case 'fertilization': return 'fas fa-spray-can';
    case 'pest_control': return 'fas fa-bug';
    case 'sun_exposure': return 'fas fa-sun';
    case 'disease': return 'fas fa-virus';
    case 'frost': return 'fas fa-snowflake';
    case 'wind': return 'fas fa-wind';
    case 'harvest': return 'fas fa-tractor';
    case 'heat': return 'fas fa-temperature-high';
    case 'cold': return 'fas fa-temperature-low';
    case 'humidity': return 'fas fa-water';
    default: return 'fas fa-info-circle';
  }
};

// React component to render agricultural suggestions based on weather context
const Suggestions = () => {
  const { suggestions, location, loading } = useContext(WeatherContext);

  // Show loading state if data is not ready or missing
  if (loading || !suggestions || suggestions.length === 0 || !location) {
    return <div className="loading">Carregando sugestões...</div>;
  }

  // Get the crop label from the mapping or fallback to the raw crop key
  const cropLabel = cropLabels[location.crop] || location.crop || 'Cultura';

  return (
    <div className="suggestions" role="region" aria-label="Sugestões agrícolas">
      <div className="suggestions-header">
        <h2 className="suggestions-title">
          Sugestões Agrícolas para {cropLabel}, {location.city || 'Localização'}
        </h2>
        <div className="last-update" aria-live="polite">Atualizado agora</div>
      </div>

      {/* Iterate over suggestions and render each item */}
      {suggestions.map((suggestion, index) => (
        <div className="suggestion-item" key={suggestion.id || index}>
          <div className="suggestion-icon" aria-hidden="true">
            <i className={getIcon(suggestion.type)} aria-label={suggestion.type}></i>
          </div>
          <div className="suggestion-text">
            <div className="suggestion-title">{suggestion.title}</div>
            <div className="suggestion-desc">{suggestion.description}</div>
          </div>
          <div className={`suggestion-priority ${getPriorityClass(suggestion.priority)}`}>
            {getPriorityLabel(suggestion.priority)}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Suggestions;

/**
 * @module Suggestions
 */

/**
 * Mapping of crop keys to their Portuguese labels.
 *
 * This object is used to translate crop identifiers into human-readable crop names in Portuguese.
 * It helps to display user-friendly crop names in the suggestions UI.
 */

/**
 * Returns the CSS class name based on priority level.
 *
 * This function maps the priority string ('high', 'medium', 'low') to corresponding CSS class names
 * that apply specific styling for visual priority indication.
 *
 * :param priority: The priority level string.
 * :return: The CSS class name for the priority.
 */

/**
 * Returns the Portuguese label for the priority level.
 *
 * This function converts the priority string into a human-readable label in Portuguese
 * to be displayed alongside the suggestion.
 *
 * :param priority: The priority level string.
 * :return: The Portuguese label for the priority.
 */

/**
 * Returns the FontAwesome icon class based on suggestion type.
 *
 * This function maps different suggestion types to corresponding FontAwesome icon classes,
 * allowing visual representation of the suggestion category.
 *
 * :param type: The type of suggestion (e.g., 'irrigation', 'pest_control').
 * :return: The FontAwesome icon class string.
 */

/**
 * React component to render agricultural suggestions based on weather context.
 *
 * This component consumes weather-related suggestions and location information from the
 * WeatherContext. It displays a list of suggestions, each with an icon, title, description,
 * and priority label. While data is loading or unavailable, it shows a loading indicator.
 *
 * :return: JSX element rendering the suggestions UI.
 */
