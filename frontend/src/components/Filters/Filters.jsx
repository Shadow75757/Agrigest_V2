import React, { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import './Filters.css';

const Filters = () => {
  const { location, updateLocation } = useContext(WeatherContext);

  const handleChange = (e) => {
    updateLocation({ [e.target.name]: e.target.value });
  };

  return (
    <div className="filters">
      <div className="filter-group">
        <label htmlFor="country">País</label>
        <select 
          id="country" 
          name="country"
          value={location.country}
          onChange={handleChange}
        >
          <option value="portugal">Portugal</option>
          <option value="brazil">Brasil</option>
          <option value="spain">Espanha</option>
          <option value="france">França</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="city">Cidade</label>
        <select 
          id="city" 
          name="city"
          value={location.city}
          onChange={handleChange}
        >
          <option value="lisbon">Lisboa</option>
          <option value="porto">Porto</option>
          <option value="coimbra">Coimbra</option>
          <option value="faro">Faro</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="crop">Cultura</label>
        <select 
          id="crop" 
          name="crop"
          value={location.crop}
          onChange={handleChange}
        >
          <option value="vine">Videira</option>
          <option value="olive">Oliveira</option>
          <option value="corn">Milho</option>
          <option value="tomato">Tomate</option>
        </select>
      </div>
      
      <div className="filter-group">
        <label htmlFor="date">Data</label>
        <input type="date" id="date" />
      </div>
    </div>
  );
};

export default Filters;