const mqtt = require('mqtt');
const db = require('./db'); // Importar la conexión a MySQL

const brokerUrl = 'mqtt://localhost:1883';
const options = {
    username: 'facuu',
    password: 'talleres13'
};
const client = mqtt.connect(brokerUrl, options);

client.on('connect', () => {
    console.log('Conectado al broker MQTT');
    const topics = ['casaFacu/pieza']; // Cambiado el topic a uno solo
    client.subscribe(topics, (err) => {
        if (err) {
            console.error('Error al suscribirse al tópico', err);
        } else {
            console.log(`Suscrito al tópico: ${topics}`);
        }
    });
});

client.on('message', (topic, message) => {
    try {
        const data = JSON.parse(message.toString());
        const { id, temperatura, humedad } = data; // Cambiando los campos a temperatura y humedad

        const query = 'INSERT INTO mediciones (sensor_id, temperature, humidity) VALUES (?, ?, ?)';
        db.query(query, [id, temperatura, humedad], (err, result) => {
            if (err) {
                console.error('Error al insertar datos:', err);
            } else {
                console.log(`Datos guardados: ID: ${id}, Temperatura: ${temperatura}, Humedad: ${humedad}`);
            }
        });
    } catch (error) {
        console.error('Error al procesar el mensaje:', error);
    }
});

module.exports = client;
