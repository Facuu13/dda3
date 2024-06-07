import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NodeInfo = () => {
  const [nodeInfo, setNodeInfo] = useState(null);

  useEffect(() => {
    axios.get('/api/mediciones')
      .then(response => {
        const latestEntry = response.data[response.data.length - 1];
        setNodeInfo(latestEntry);
      })
      .catch(error => {
        console.error('Error fetching node info:', error);
      });
  }, []);

  if (!nodeInfo) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>ID del Nodo: {nodeInfo.sensor_id}</h2>
      <p>Última Temperatura: {nodeInfo.temperature}°C</p>
      <p>Última Humedad: {nodeInfo.humidity}%</p>
      <p>Última Medición: {new Date(nodeInfo.timestamp).toLocaleString()}</p>
    </div>
  );
};

export default NodeInfo;
