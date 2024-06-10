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
    //const topics = ['casaFacu/pieza']; // Cambiado el topic a uno solo
    const topics = ['casaFacu/pieza', 'casaFacu/cocina']; // Nuevos topics agregados
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
        const { id, temperatura, humedad, topic: mensajeTopic, estado_led, ubicacion, modelo } = data;

        const query = 'INSERT INTO mediciones (sensor_id, temperature, humidity, topic, rele, ubicacion, modelo) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [id, temperatura, humedad, mensajeTopic, estado_led,ubicacion, modelo], (err, result) => {
            if (err) {
                console.error('Error al insertar datos:', err);
            } else {
                console.log(`Datos guardados: ID: ${id}, Temperatura: ${temperatura}, Humedad: ${humedad}, Topic: ${mensajeTopic}, Estado LED: ${estado_led}, Ubicacion: ${ubicacion}, Modelo: ${modelo} `);
            }
        });
    } catch (error) {
        console.error('Error al procesar el mensaje:', error);
    }
});

module.exports = client;
