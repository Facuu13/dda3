const express = require('express');
const db = require('./db'); // Importar la conexión a MySQL
const router = express.Router();

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

module.exports = router;
