import React, { useEffect, useState } from 'react';
import { Line } from 'react-chartjs-2';
import { Chart as ChartJS } from 'chart.js/auto';

const TemperatureChart = ({ city }) => {
  const [temps, setTemps] = useState([22, 24, 23, 25, 26, 24, 23]); // fallback
  const [labels, setLabels] = useState(['Seg', 'Ter', 'Qua', 'Qui', 'Sex', 'Sáb', 'Dom']);

  useEffect(() => {
    if (!city) return;
    console.log("TemperatureChart API call for city:", city); // Debug line
    fetch(`/api/weather/temperature?city=${encodeURIComponent(city)}`)
      .then(res => res.json())
      .then(data => {
        if (data.temps && data.labels) {
          setTemps(data.temps);
          setLabels(data.labels);
        }
      })
      .catch(() => { });
  }, [city]);

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
        (API cidade: {city})
      </div>
      <Line data={data} options={options} />
    </div>
  );
};

export default TemperatureChart;