import React, { useState, useEffect } from 'react';
import axios from 'axios';

const NodeInfo = () => {
    const [dispositivos, setDispositivos] = useState([]);
    const [mediciones, setMediciones] = useState({});
    const [selectedDevice, setSelectedDevice] = useState(null);

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

    useEffect(() => {
        if (selectedDevice) {
            axios.get(`/api/mediciones/${selectedDevice}`)
                .then(response => {
                    const medidasDispositivo = response.data;
                    if (medidasDispositivo.length > 0) {
                        const ultimaMedida = medidasDispositivo[medidasDispositivo.length - 1];
                        setMediciones(prevState => ({
                            ...prevState,
                            [selectedDevice]: ultimaMedida
                        }));
                    } else {
                        setMediciones(prevState => ({
                            ...prevState,
                            [selectedDevice]: null
                        }));
                    }
                })
                .catch(error => {
                    console.error(`Error fetching measurements for device ${selectedDevice}:`, error);
                });
        }
    }, [selectedDevice]);

    if (dispositivos.length === 0) {
        return <div>Loading...</div>;
    }

    const handleDeviceClick = (dispositivo) => {
        setSelectedDevice(dispositivo);
    };

    return (
        <div>
            <h2>Información de Nodos</h2>
            {dispositivos.map((dispositivo, index) => (
                <div key={index}>
                    <h3 onClick={() => handleDeviceClick(dispositivo)}>ID del Nodo: {dispositivo}</h3>
                    {selectedDevice === dispositivo && mediciones[dispositivo] && (
                        <div>
                            <p>Última Temperatura: {mediciones[dispositivo].temperature}°C</p>
                            <p>Última Humedad: {mediciones[dispositivo].humidity}%</p>
                            <p>Última Medición: {new Date(mediciones[dispositivo].timestamp).toLocaleString()}</p>
                        </div>
                    )}
                    {selectedDevice === dispositivo && mediciones[dispositivo] === null && (
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

