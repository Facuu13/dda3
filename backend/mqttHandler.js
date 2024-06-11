const mqtt = require('mqtt');
const fs = require('fs');
const db = require('./db'); // Módulo personalizado para interactuar con la base de datos

// Configuración de la conexión al broker MQTT
const brokerUrl = 'mqtts://192.168.1.11:8883'; // URL del broker MQTT
const caFilePath = '/home/facu/mosquitto_certs/ca.crt'; 
const certFilePath = '/home/facu/mosquitto_certs/client.crt';
const keyFilePath = '/home/facu/mosquitto_certs/client.key'; 

// Opciones de conexión al broker MQTT
const options = {
    username: 'facuu', // Nombre de usuario para autenticación
    password: 'talleres13', // Contraseña para autenticación
    ca: fs.readFileSync(caFilePath), // Leer certificados
    cert: fs.readFileSync(certFilePath),
    key: fs.readFileSync(keyFilePath), 
    rejectUnauthorized: false, 
};

// Tópicos a los que suscribirse
const topics = ['casaFacu/pieza', 'casaFacu/cocina'];

// Función para conectar al broker MQTT
function connectToBroker() {
    const client = mqtt.connect(brokerUrl, options); 

    // Manejar evento de conexión
    client.on('connect', () => {
        console.log('Conectado al broker MQTT');
        subscribeToTopics(client); // Suscribirse a los tópicos una vez conectado
    });

    // Manejar evento de mensaje recibido
    client.on('message', handleMessage);

    // Manejar evento de error
    client.on('error', (err) => {
        console.error('Error de conexión al broker MQTT:', err);
        setTimeout(connectToBroker, 5000);
    });

    return client; 
}

// Función para suscribirse a los tópicos
function subscribeToTopics(client) {
    client.subscribe(topics, (err) => {
        if (err) {
            console.error('Error al suscribirse a los tópicos', err);
        } else {
            console.log(`Suscrito a los tópicos: ${topics.join(', ')}`);
        }
    });
}

// Función para manejar los mensajes recibidos
function handleMessage(topic, message) {
    try {
        // Parsear el mensaje recibido como JSON
        const data = JSON.parse(message.toString());
        const { id, temperatura, humedad, topic: mensajeTopic, estado_led, ubicacion, modelo } = data;

        // Consultar para insertar los datos en la base de datos
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

// Iniciar la conexión al broker MQTT
const client = connectToBroker();

module.exports = client;
