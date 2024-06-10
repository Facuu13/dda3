import React, { useState, useEffect } from 'react';
import axios from 'axios';
import mqtt  from 'mqtt';

const NodeInfo = () => {
    const [dispositivos, setDispositivos] = useState([]);
    const [mediciones, setMediciones] = useState({});
    const [selectedDevice, setSelectedDevice] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [mqttClient, setMqttClient] = useState(null);

    const brokerUrl = 'mqtt://192.168.1.11:8080';
    const mqttOptions = {
        username: 'facuu',
        password: 'talleres13'
    };


    useEffect(() => {
        const client = mqtt.connect(brokerUrl, mqttOptions);
        setMqttClient(client);

        client.on('connect', () => {
            console.log('MQTT connected');
        });

        return () => {
            if (client) {
                client.end();
            }
        };
    }, []);

    useEffect(() => {
        axios.get('/api/dispositivos')
            .then(response => {
                const dispositivos = response.data;
                setDispositivos(dispositivos);
                setLoading(false);
            })
            .catch(error => {
                console.error('Error fetching devices:', error);
                setError('Error fetching devices. Please try again later.');
                setLoading(false);
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
                    setError(`Error fetching measurements for device ${selectedDevice}. Please try again later.`);
                });
        }
    }, [selectedDevice]);

    const handleDeviceClick = (dispositivo) => {
        if (dispositivo === selectedDevice) {
            setSelectedDevice(null); // Cerrar el dispositivo si se hace clic en él de nuevo
        } else {
            setSelectedDevice(dispositivo);
            setError(null); // Resetear el estado de error
        }
    };

    const toggleLed = (action) => {
        if (mqttClient) {
            const message = mqttClient.publish('casaFacu/led', action);
            if (!message) {
                console.error('Failed to publish MQTT message');
            }
        } else {
            console.error('MQTT client not connected');
        }
    };

    if (loading) {
        return <div>Loading...</div>;
    }

    if (error) {
        return <div>Error: {error}</div>;
    }

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
                            <p>Topic: {mediciones[dispositivo].topic}</p>
                            <p>Rele: {mediciones[dispositivo].rele}</p>
                            <p>Ubicacion: {mediciones[dispositivo].ubicacion}</p>
                            <p>Modelo: {mediciones[dispositivo].modelo}</p>
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
            <button onClick={() => toggleLed('on')}>Encender LED</button>
            <button onClick={() => toggleLed('off')}>Apagar LED</button>
        </div>
    );
};

export default NodeInfo;
