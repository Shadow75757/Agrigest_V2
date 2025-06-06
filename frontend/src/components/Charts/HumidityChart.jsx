import React, { useEffect, useState, useContext } from 'react';
import { Bar } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';
import { WeatherContext } from '../../context/WeatherContext';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function generateWeekData(todayValue, min = 5, max = 10) {
  const today = new Date();
  const todayIdx = today.getDay();
  const arr = [];
  for (let i = 0; i < 7; i++) {
    if (i === todayIdx) {
      arr.push(todayValue);
    } else {
      // plausible random value
      let rand = todayValue + (Math.random() - 0.5) * 2 * (Math.floor(Math.random() * (max - min + 1)) + min);
      rand = Math.max(30, Math.min(100, rand)); // keep humidity realistic
      arr.push(Math.round(rand * 10) / 10);
    }
  }
  return arr;
}

const HumidityChart = () => {
  const { weather } = useContext(WeatherContext);
  const [humidities, setHumidities] = useState(generateWeekData(65));
  const [labels, setLabels] = useState(weekDays);

  useEffect(() => {
    if (!weather || typeof weather.humidity !== 'number') return;
    setHumidities(generateWeekData(weather.humidity, 5, 10));
    setLabels(weekDays);
  }, [weather]);

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

  return <Bar data={data} options={options} />;
};

export default HumidityChart;