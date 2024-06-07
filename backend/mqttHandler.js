const mqtt = require('mqtt');
const db = require('./db'); // Importar la conexión a MySQL

const brokerUrl = 'mqtt://localhost:1883';
const options = {
    username: 'facuu',
    password: 'talleres13'
};
const client = mqtt.connect(brokerUrl, options);

const sensorData = {};

client.on('connect', () => {
    console.log('Conectado al broker MQTT');
    const topics = ['casaFacu/temp', 'casaFacu/hum'];
    client.subscribe(topics, (err) => {
        if (err) {
            console.error('Error al suscribirse a los tópicos', err);
        } else {
            console.log(`Suscrito a los tópicos: ${topics.join(', ')}`);
        }
    });
});

client.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        const { id, value } = data;

        if (!sensorData[id]) {
            sensorData[id] = {};
        }

        if (topic === 'casaFacu/temp') {
            sensorData[id].temperature = value;
        } else if (topic === 'casaFacu/hum') {
            sensorData[id].humidity = value;
        }

        if (sensorData[id].temperature !== undefined && sensorData[id].humidity !== undefined) {
            const query = 'INSERT INTO mediciones (sensor_id, temperature, humidity) VALUES (?, ?, ?)';
            db.query(query, [id, sensorData[id].temperature, sensorData[id].humidity], (err, result) => {
                if (err) {
                    console.error('Error al insertar datos:', err);
                } else {
                    console.log(`Datos guardados: ID: ${id}, Temperatura: ${sensorData[id].temperature}, Humedad: ${sensorData[id].humidity}`);
                    delete sensorData[id];
                }
            });
        }
    } catch (error) {
        console.error('Error al procesar el mensaje:', error);
    }
});

module.exports = client;
