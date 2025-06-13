import React, { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import './HistoryTable.css';


// Component that renders a history table of agricultural actions
const HistoryTable = () => {
  // Access the history array from WeatherContext
  const { history } = useContext(WeatherContext);

  // Sample data to display if no history is available
  const sampleData = [
    {
      date: '10/06/2023',
      action: 'Irrigação',
      crop: 'Videira',
      status: 'completed',
      details: '20mm aplicados'
    },
    {
      date: '08/06/2023',
      action: 'Fertilização',
      crop: 'Oliveira',
      status: 'completed',
      details: 'Fertilizante NPK 10-10-10'
    },
    {
      date: '05/06/2023',
      action: 'Controlo de Pragas',
      crop: 'Tomate',
      status: 'completed',
      details: 'Preventivo contra míldio'
    },
    {
      date: '01/06/2023',
      action: 'Colheita',
      crop: 'Milho',
      status: 'pending',
      details: 'Estimado 15 dias'
    }
  ];

  // Use actual history if available, otherwise use sample data
  const data = history.length > 0 ? history : sampleData;

  // Determine CSS class for status based on status value
  const getStatusClass = (status) => {
    return status === 'completed' ? 'status-completed' : 'status-pending';
  };

  // Determine display text for status based on status value
  const getStatusText = (status) => {
    return status === 'completed' ? 'Concluído' : 'Pendente';
  };

  // Render a table showing date, action, crop, status, and details for each item
  return (
    <table className="history-table">
      <thead>
        <tr>
          <th>Data</th>
          <th>Ação</th>
          <th>Cultivo</th>
          <th>Status</th>
          <th>Detalhes</th>
        </tr>
      </thead>
      <tbody>
        {data.map((item, index) => (
          <tr key={index}>
            <td>{item.date}</td>
            <td>{item.action}</td>
            <td>{item.crop}</td>
            <td>
              <span className={`status ${getStatusClass(item.status)}`}>
                {getStatusText(item.status)}
              </span>
            </td>
            <td>{item.details}</td>
          </tr>
        ))}
      </tbody>
    </table>
  );
};

export default HistoryTable;


/**
 * Component that renders a history table of agricultural actions.
 * 
 * This component retrieves historical data from the WeatherContext and displays it in a table format.
 * If no history data is available, it falls back to a predefined sample data set.
 * Each row shows the date, action performed, crop involved, status of the action, and additional details.
 * Status values are converted to CSS classes and display text for visual distinction.
 * 
 * @component
 * @returns {JSX.Element} A table element displaying the history of agricultural actions.
 */

/**
 * Retrieves the CSS class name for a given status.
 * 
 * Returns 'status-completed' if the status is 'completed', otherwise returns 'status-pending'.
 * This is used for styling the status text in the table.
 * 
 * @param {string} status - The status of the action.
 * @returns {string} The CSS class name corresponding to the status.
 */

/**
 * Retrieves the display text for a given status.
 * 
 * Returns 'Concluído' if the status is 'completed', otherwise returns 'Pendente'.
 * This is used as the visible label for the status in the table.
 * 
 * @param {string} status - The status of the action.
 * @returns {string} The text label corresponding to the status.
 */
