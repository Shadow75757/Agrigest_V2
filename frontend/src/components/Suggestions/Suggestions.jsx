import React, { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import './Suggestions.css';


// Mapeamento dos labels dos cultivos
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



const Suggestions = () => {
  const { suggestions, location, loading } = useContext(WeatherContext);

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
      case 'disease':
        return 'fas fa-virus';
      case 'frost':
        return 'fas fa-snowflake';
      case 'wind':
        return 'fas fa-wind';
      case 'harvest':
        return 'fas fa-tractor';
      case 'heat':
        return 'fas fa-temperature-high';
      case 'cold':
        return 'fas fa-temperature-low';
      case 'humidity':
        return 'fas fa-water';
      default:
        return 'fas fa-info-circle';
    }
  };

  return (
    <div className="suggestions">
      <div className="suggestions-header">
        <div className="suggestions-title">
          Sugestões Agrícolas para {cropLabels[location.crop] || location.crop}, {location.city}
        </div>
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
            {suggestion.priority === 'high'
              ? 'Alta'
              : suggestion.priority === 'medium'
                ? 'Média'
                : 'Baixa'}
          </div>
        </div>
      ))}
    </div>
  );
};

export default Suggestions;