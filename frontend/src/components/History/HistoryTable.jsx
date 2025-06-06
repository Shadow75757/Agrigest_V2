import React, { useContext } from 'react';
import { WeatherContext } from '../../context/WeatherContext';
import './HistoryTable.css';

const HistoryTable = () => {
  const { history } = useContext(WeatherContext);

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

  const data = history.length > 0 ? history : sampleData;

  const getStatusClass = (status) => {
    return status === 'completed' ? 'status-completed' : 'status-pending';
  };

  const getStatusText = (status) => {
    return status === 'completed' ? 'Concluído' : 'Pendente';
  };
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