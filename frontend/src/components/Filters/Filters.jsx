import React, { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import './Filters.css';

// Component responsible for rendering location and crop filters
const Filters = () => {
  // Access location state and update function from WeatherContext
  const { location, updateLocation } = useContext(WeatherContext);

  // Handle changes in filter inputs and update location context accordingly
  const handleChange = (e) => {
    const { name, value } = e.target;
    updateLocation({ [name]: value });
  };

  // Render filter dropdowns for country, city, crop and a date input
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
          <option value="portugal" selected>Portugal</option>
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
        <label htmlFor="crop">Cultivo</label>
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

/**
 * Filters component responsible for rendering and handling user input for location and crop selection.
 * 
 * This component consumes the WeatherContext to retrieve and update the current location state.
 * It renders dropdown menus for selecting country, city, and crop type, and a date input field.
 * User interactions with these inputs trigger updates to the context state to reflect the selected filters.
 * 
 * :return: JSX.Element representing the filters UI
 */

