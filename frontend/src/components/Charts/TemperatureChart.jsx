import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const weekDays = ['Dom', 'Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb'];

function generateWeekData(todayValue, min = 7, max = 7) {
  // todayValue: the value for today
  // min/max: how much up/down the random values can go
  const today = new Date();
  const todayIdx = today.getDay(); // 0 (Sun) - 6 (Sat)
  const arr = [];
  for (let i = 0; i < 7; i++) {
    if (i === todayIdx) {
      arr.push(todayValue);
    } else {
      // plausible random value
      const rand = todayValue + (Math.random() - 0.5) * 2 * (Math.floor(Math.random() * (max - min + 1)) + min);
      arr.push(Math.round(rand * 10) / 10);
    }
  }
  return arr;
}

const TemperatureChart = ({ city, todayTemperature }) => {
  const [temps, setTemps] = useState(generateWeekData(22));
  const [labels, setLabels] = useState(weekDays);

  useEffect(() => {
    if (!city || typeof todayTemperature !== 'number') return;
    // Generate plausible week data with today's value in the right spot
    setTemps(generateWeekData(todayTemperature, 3, 7));
    setLabels(weekDays);
  }, [city, todayTemperature]);

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

  const options = {
    responsive: true,
    plugins: {
      legend: {
        position: 'top',
      },
    },
  };

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