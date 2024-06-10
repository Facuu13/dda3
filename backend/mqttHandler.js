const mqtt = require('mqtt');
const fs = require('fs');
const db = require('./db'); 

const brokerUrl = 'mqtts://192.168.1.11:8883'; 
const caFilePath = '/home/facu/mosquitto_certs/ca.crt'; 
const certFilePath = '/home/facu/mosquitto_certs/client.crt'; 
const keyFilePath = '/home/facu/mosquitto_certs/client.key'; 

const options = {
    username: 'facuu',
    password: 'talleres13',
    ca: fs.readFileSync(caFilePath),
    cert: fs.readFileSync(certFilePath),
    key: fs.readFileSync(keyFilePath),
    rejectUnauthorized: false,
};

const topics = ['casaFacu/pieza', 'casaFacu/cocina'];

function connectToBroker() {
    const client = mqtt.connect(brokerUrl, options);

    client.on('connect', () => {
        console.log('Conectado al broker MQTT');
        subscribeToTopics(client);
    });

    client.on('message', handleMessage);

    client.on('error', (err) => {
        console.error('Error de conexión al broker MQTT:', err);
        // Intentar reconectar
        setTimeout(connectToBroker, 5000);
    });

    return client;
}

function subscribeToTopics(client) {
    client.subscribe(topics, (err) => {
        if (err) {
            console.error('Error al suscribirse a los tópicos', err);
        } else {
            console.log(`Suscrito a los tópicos: ${topics.join(', ')}`);
        }
    });
}

function handleMessage(topic, message) {
    try {
        const data = JSON.parse(message.toString());
        const { id, temperatura, humedad, topic: mensajeTopic, estado_led, ubicacion, modelo } = data;

        const query = 'INSERT INTO mediciones (sensor_id, temperature, humidity, topic, rele, ubicacion, modelo) VALUES (?, ?, ?, ?, ?, ?, ?)';
        db.query(query, [id, temperatura, humedad, mensajeTopic, estado_led, ubicacion, modelo], (err, result) => {
            if (err) {
                console.error('Error al insertar datos:', err);
            } else {
                console.log(`Datos guardados: ID: ${id}, Temperatura: ${temperatura}, Humedad: ${humedad}, Topic: ${mensajeTopic}, Estado LED: ${estado_led}, Ubicacion: ${ubicacion}, Modelo: ${modelo}`);
            }
        });
    } catch (error) {
        console.error('Error al procesar el mensaje:', error);
    }
}

const client = connectToBroker();

module.exports = client;
