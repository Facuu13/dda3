const express = require('express');
const router = express.Router();
const mysql = require('mysql2');

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

// Endpoint para obtener todas las mediciones
router.get('/mediciones', (req, res) => {
    const query = 'SELECT * FROM mediciones';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener los datos:', err);
            res.status(500).send('Error al obtener los datos');
        } else {
            res.json(results);
        }
    });
});

// Endpoint para obtener solo las temperaturas
router.get('/mediciones/temperaturas', (req, res) => {
    const query = 'SELECT sensor_id, temperature, timestamp FROM mediciones WHERE temperature IS NOT NULL';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las temperaturas:', err);
            res.status(500).send('Error al obtener las temperaturas');
        } else {
            res.json(results);
        }
    });
});

// Endpoint para obtener solo las humedades
router.get('/mediciones/humedades', (req, res) => {
    const query = 'SELECT sensor_id, humidity, timestamp FROM mediciones WHERE humidity IS NOT NULL';
    db.query(query, (err, results) => {
        if (err) {
            console.error('Error al obtener las humedades:', err);
            res.status(500).send('Error al obtener las humedades');
        } else {
            res.json(results);
        }
    });
});

module.exports = router;
