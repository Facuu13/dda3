// src/Dashboard.js
import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { Line } from 'react-chartjs-2';
import 'chart.js/auto';

const Dashboard = () => {
    const [temperatureData, setTemperatureData] = useState([]);
    const [humidityData, setHumidityData] = useState([]);

    useEffect(() => {
        const fetchData = async () => {
            try {
                const tempResponse = await axios.get('/api/mediciones/temperaturas');
                const humResponse = await axios.get('/api/mediciones/humedades');

                setTemperatureData(tempResponse.data);
                setHumidityData(humResponse.data);
            } catch (error) {
                console.error('Error fetching data:', error);
            }
        };

        fetchData();
    }, []);

    const formatChartData = (data, label) => ({
        labels: data.map(item => new Date(item.timestamp).toLocaleString()),
        datasets: [
            {
                label,
                data: data.map(item => label === 'Temperatura' ? item.temperature : item.humidity),
                fill: false,
                backgroundColor: label === 'Temperatura' ? 'rgba(75,192,192,0.4)' : 'rgba(153,102,255,0.4)',
                borderColor: label === 'Temperatura' ? 'rgba(75,192,192,1)' : 'rgba(153,102,255,1)',
            }
        ]
    });

    return (
        <div>
            <h2>Dashboard de Sensores</h2>
            <div>
                <h3>Temperatura</h3>
                <Line data={formatChartData(temperatureData, 'Temperatura')} />
            </div>
            <div>
                <h3>Humedad</h3>
                <Line data={formatChartData(humidityData, 'Humedad')} />
            </div>
        </div>
    );
};

export default Dashboard;
