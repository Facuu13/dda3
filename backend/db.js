const mysql = require('mysql2');

const db = mysql.createConnection({
    host: 'localhost',
    user: 'facuu13', // Reemplaza con tu usuario MySQL
    password: 'talleres13', // Reemplaza con tu contraseña MySQL
    database: 'sensor_data'
});

db.connect(err => {
    if (err) {
        console.error('Error al conectar a MySQL:', err);
    } else {
        console.log('Conectado a MySQL');
    }
});

module.exports = db;
