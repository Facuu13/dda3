import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NodeInfo = () => {
    const [dispositivos, setDispositivos] = useState([]);

  useEffect(() => {
    axios.get('/api/dispositivos')
      .then(response => {
        const dispositivos = response.data;
        setDispositivos(dispositivos);
      })
      .catch(error => {
        console.error('Error fetching devices:', error);
      });
  }, []);

  const [mediciones, setMediciones] = useState({});

  useEffect(() => {
    dispositivos.forEach(dispositivo => {
      axios.get(`/api/mediciones/${dispositivo}`)
        .then(response => {
          const medidasDispositivo = response.data;
          if (medidasDispositivo.length > 0) {
            const ultimaMedida = medidasDispositivo[medidasDispositivo.length - 1];
            setMediciones(prevState => ({
              ...prevState,
              [dispositivo]: ultimaMedida
            }));
          } else {
            setMediciones(prevState => ({
              ...prevState,
              [dispositivo]: null
            }));
          }
        })
        .catch(error => {
          console.error(`Error fetching measurements for device ${dispositivo}:`, error);
        });
    });
  }, [dispositivos]);

  if (dispositivos.length === 0) {
    return <div>Loading...</div>;
  }

  return (
    <div>
      <h2>Información de Nodos</h2>
      {dispositivos.map((dispositivo, index) => (
        <div key={index}>
          <h3>ID del Nodo: {dispositivo}</h3>
          {mediciones[dispositivo] ? (
            <div>
              <p>Última Temperatura: {mediciones[dispositivo].temperature}°C</p>
              <p>Última Humedad: {mediciones[dispositivo].humidity}%</p>
              <p>Última Medición: {new Date(mediciones[dispositivo].timestamp).toLocaleString()}</p>
            </div>
          ) : (
            <div>
              <p>No hay mediciones para este dispositivo</p>
            </div>
          )}
          <hr />
        </div>
      ))}
    </div>
  );
};

export default NodeInfo;
