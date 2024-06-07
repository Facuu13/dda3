const mqtt = require('mqtt');
const express = require('express');
const mysql = require('mysql2');
const routes = require('./routes');

const app = express();
const port = 3000;

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'facuu13', // Reemplaza con tu usuario MySQL
    password: 'talleres13', // Reemplaza con tu contraseña MySQL
    database: 'sensor_data'
});

// Conectar a MySQL
db.connect(err => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

// Conexión al broker Mosquitto con autenticación
const brokerUrl = 'mqtt://localhost:1883';
const options = {
    username: 'facuu',
    password: 'talleres13'
};
const client = mqtt.connect(brokerUrl, options);

// Estado intermedio para almacenar los datos del sensor
const sensorData = {};

// Manejar la conexión al broker
client.on('connect', () => {
    console.log('Conectado al broker MQTT');

    // Suscribirse a los tópicos casaFacu/temp y casaFacu/hum
    const topics = ['casaFacu/temp', 'casaFacu/hum'];
    client.subscribe(topics, (err) => {
        if (err) {
            console.error('Error al suscribirse a los tópicos', err);
        } else {
            console.log(`Suscrito a los tópicos: ${topics.join(', ')}`);
        }
    });
});

// Manejar los mensajes recibidos
client.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        const { id, value } = data;

        // Inicializa el estado del sensor si no existe
        if (!sensorData[id]) {
            sensorData[id] = {};
        }

        // Almacena la temperatura o humedad temporalmente
        if (topic === 'casaFacu/temp') {
            sensorData[id].temperature = value;
        } else if (topic === 'casaFacu/hum') {
            sensorData[id].humidity = value;
        }

        // Inserta en la base de datos solo si ambos valores están presentes
        if (sensorData[id].temperature !== undefined && sensorData[id].humidity !== undefined) {
            const query = 'INSERT INTO mediciones (sensor_id, temperature, humidity) VALUES (?, ?, ?)';
            db.query(query, [id, sensorData[id].temperature, sensorData[id].humidity], (err, result) => {
                if (err) {
                    console.error('Error al insertar datos:', err);
                } else {
                    console.log(`Datos guardados: ID: ${id}, Temperatura: ${sensorData[id].temperature}, Humedad: ${sensorData[id].humidity}`);
                    // Limpia los datos del sensor una vez insertados
                    delete sensorData[id];
                }
            });
        }
    } catch (error) {
        console.error('Error al procesar el mensaje:', error);
    }
});

// Endpoint para verificar que el servidor está funcionando
app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

// Usar el router para las rutas que comienzan con /api
app.use('/api', routes);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
