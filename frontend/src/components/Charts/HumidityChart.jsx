import React, { useEffect, useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { WeatherContext } from '../../context/WeatherContext';

// Array of weekday abbreviations
const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

/**
 * Generate mock humidity data for the week using today's humidity value.
 *
 * Uses today's humidity as a base and generates realistic variation
 * for the other days of the week. Ensures humidity values stay within
 * a realistic range (30–100%).
 *
 * @param {number} todayValue - Humidity value for today
 * @param {number} min - Minimum deviation factor
 * @param {number} max - Maximum deviation factor
 * @returns {number[]} Array of 7 humidity values (1 for each day)
 */
function generateWeekData(todayValue, min = 5, max = 10) {
  const today = new Date();
  const todayIdx = today.getDay();
  const arr = [];
  for (let i = 0; i < 7; i++) {
    if (i === todayIdx) {
      arr.push(todayValue);
    } else {
      // Generate a plausible random humidity around today's value
      let rand = todayValue + (Math.random() - 0.5) * 2 * (Math.floor(Math.random() * (max - min + 1)) + min);
      rand = Math.max(30, Math.min(100, rand)); // clamp to 30–100%
      arr.push(Math.round(rand * 10) / 10);
    }
  }
  return arr;
}

/**
 * HumidityChart component
 *
 * Displays a bar chart of humidity for each day of the week using Chart.js.
 * The data is generated based on today's actual humidity value from weather context.
 *
 * React hooks are used to update chart data dynamically when weather info updates.
 *
 * @component
 * @returns {JSX.Element} Bar chart showing weekly humidity levels
 */
const HumidityChart = () => {
  // Access weather data from context
  const { weather } = useContext(WeatherContext);

  // State for humidity values and corresponding weekday labels
  const [humidities, setHumidities] = useState(generateWeekData(65));
  const [labels, setLabels] = useState(weekDays);

  // Update humidity data when weather context updates
  useEffect(() => {
    if (!weather || typeof weather.humidity !== 'number') return;
    setHumidities(generateWeekData(weather.humidity, 5, 10));
    setLabels(weekDays);
  }, [weather]);

  // Chart.js data configuration
  const data = {
    labels,
    datasets: [
      {
        label: 'Umidade (%)',
        data: humidities,
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgb(54, 162, 235)',
        borderWidth: 1
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
    scales: {
      y: {
        beginAtZero: true,
        max: 100
      }
    }
  };

  // Render bar chart component
  return <Bar data={data} options={options} />;
};

export default HumidityChart;
