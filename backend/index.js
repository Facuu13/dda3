const express = require('express');
const routes = require('./routes');
const client = require('./mqttHandler');  // Importar el manejador de MQTT

const app = express();
const port = 3000;

app.use(express.json());

app.get('/', (req, res) => {
    res.send('Servidor funcionando');
});

app.use('/api', routes);

app.listen(port, () => {
    console.log(`Servidor escuchando en http://localhost:${port}`);
});
