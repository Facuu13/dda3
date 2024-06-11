# Trabajo Pratico 

## Firmware

Este proyecto utiliza MicroPython y ESP-IDF para controlar un microcontrolador ESP32 y un sensor DHT11.

### Tecnologías Utilizadas

- **MicroPython**: Versión 1.22.2
  - [Repositorio de MicroPython](https://github.com/micropython/micropython)
- **ESP-IDF**: Versión 5.0.4
  - Clonar el repositorio: 
    ```bash
    git clone -b v5.0.4 --recursive https://github.com/espressif/esp-idf.git
    ```

### Componentes

- **Microcontrolador**: ESP32
- **Sensor**: DHT11

### Conexión al Broker

Nos conectamos al broker de Mosquitto mediante certificados TLS para asegurar la comunicación. 

## Backend

Utilizamos Node.js y Express para el desarrollo del backend, y también nos conectamos al broker Mosquitto mediante certificados TLS para asegurar la comunicación.

### Tecnologías Utilizadas

- **Node.js**
- **Express**
- **Mosquitto**
- **MySQL**


## Frontend

El frontend de este proyecto fue desarrollado utilizando React.

### Tecnologías Utilizadas

- **React**

