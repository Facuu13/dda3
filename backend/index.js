const express = require('express');
const mysql = require('mysql2');
const routes = require('./routes');
const client = require('./mqttHandler');  // Importar el manejador de MQTT

const app = express();
const port = 3000;

// Middleware para parsear JSON
app.use(express.json());

// Configuración de la conexión a MySQL
const db = mysql.createConnection({
    host: 'localhost',
    user: 'facuu13',
    password: 'talleres13',
    database: 'sensor_data'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
