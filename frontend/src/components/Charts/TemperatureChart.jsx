import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

// Array of weekday abbreviations for chart labels
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * Generate temperature data for a week based on today's temperature.
 *
 * Produces an array of 7 values, with today's temperature fixed at the current weekday index.
 * Other days get plausible random temperatures within given bounds.
 *
 * @param {number} todayValue - Temperature value for today
 * @param {number} min - Minimum deviation range for random temperature
 * @param {number} max - Maximum deviation range for random temperature
 * @returns {number[]} Array of 7 temperature values for the week
 */
function generateWeekData(todayValue, min = 7, max = 7) {
  const today = new Date();
  const todayIdx = today.getDay(); // 0 (Sun) to 6 (Sat)
  const arr = [];
  for (let i = 0; i < 7; i++) {
    if (i === todayIdx) {
      arr.push(todayValue);
    } else {
      // Generate plausible random temperature around todayValue
      const rand = todayValue + (Math.random() - 0.5) * 2 * (Math.floor(Math.random() * (max - min + 1)) + min);
      arr.push(Math.round(rand * 10) / 10);
    }
  }
  return arr;
}

/**
 * TemperatureChart component
 *
 * Displays a line chart showing temperature data over a week.
 * Uses props for city name and today's temperature, generating plausible weekly data.
 *
 * @param {Object} props - Component props
 * @param {string} props.city - Name of the city for display
 * @param {number} props.todayTemperature - Temperature value for today
 * @component
 * @returns {JSX.Element} A line chart with weekly temperature data and city label
 */
const TemperatureChart = ({ city, todayTemperature }) => {
  // State for temperature data and labels
  const [temps, setTemps] = useState(generateWeekData(22));
  const [labels, setLabels] = useState(weekDays);

  // Update temperatures when city or today's temperature changes
  useEffect(() => {
    if (!city || typeof todayTemperature !== 'number') return;
    setTemps(generateWeekData(todayTemperature, 3, 7));
    setLabels(weekDays);
  }, [city, todayTemperature]);

  // Chart.js data configuration
  const data = {
    labels,
    datasets: [
      {
        label: 'Temperatura (°C)',
        data: temps,
        borderColor: 'rgb(255, 99, 132)',
        backgroundColor: 'rgba(255, 99, 132, 0.5)',
        tension: 0.1
      }
    ]
  };

  // Chart.js options configuration
  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

  // Render city label and line chart
  return (
    <div>
      <div style={{ color: '#0077cc', fontSize: '0.9em' }}>
        (Cidade: {city})
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default TemperatureChart;
