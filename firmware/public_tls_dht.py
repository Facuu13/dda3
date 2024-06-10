from umqtt.simple import MQTTClient
import time
import network
import dht
import machine
import ujson

# Pin de datos del sensor
d = dht.DHT11(machine.Pin(32))

# Configuración de la red WiFi
ssid = "quepasapatejode"
password = "losvilla08"

# Conexión a la red WiFi
def conectar_wifi(ssid, password):
    s = network.WLAN(network.STA_IF)
    s.active(True)
    s.connect(ssid, password)
    while not s.isconnected():
        time.sleep(1)
    print("Conectado a:", ssid)
    print("Dirección IP:", s.ifconfig()[0])
    return s

# Configuración del cliente MQTT
cliente_id = 'dispositivo2'
mqtt_broker = '192.168.1.11'
puerto = 8883  # Puerto para TLS
usuario_mqtt = 'facuu'
contrasena_mqtt = 'talleres13'

# Lectura de certificados
with open('ca.crt', 'rb') as f:
    ca_cert = f.read()
with open('client.crt', 'rb') as f:
    client_cert = f.read()
with open('client.key', 'rb') as f:
    client_key = f.read()


# Conexión al broker MQTT con TLS y certificados
def conectar_mqtt(cliente_id, mqtt_broker, puerto, usuario, contrasena):
    cliente = MQTTClient(
        client_id=cliente_id,
        server=mqtt_broker,
        port=puerto,
        user=usuario,
        password=contrasena,
        ssl=True,  # Activar TLS
        ssl_params={'key': client_key, 'cert': client_cert}
    )
    try:
        cliente.connect()
        print("Conectado al broker MQTT con TLS")
    except Exception as e:
        print(f"Error al conectar al broker MQTT: {e}")
    return cliente

# Publicar datos en el broker MQTT
def publicar_datos(cliente, tema_temp, tema_hum):
    try:
        d.measure()
        temperatura = d.temperature()
        humedad = d.humidity()

        payload_temp = ujson.dumps({"id": cliente_id, "value": temperatura})
        payload_hum = ujson.dumps({"id": cliente_id, "value": humedad})

        cliente.publish(tema_temp, payload_temp)
        cliente.publish(tema_hum, payload_hum)

        print(f"Temperatura: {temperatura}°C")
        print(f"Humedad: {humedad}%")
    except Exception as e:
        print(f"Error al medir o publicar datos: {e}")
        try:
            cliente.connect()
            print("Conectado al broker MQTT")
        except Exception as e:
            print(f"Error al reconectar al broker MQTT: {e}")

# Conectar a WiFi
s = conectar_wifi(ssid, password)

# Conectar al broker MQTT
cliente = conectar_mqtt(cliente_id, mqtt_broker, puerto, usuario_mqtt, contrasena_mqtt)

# Configuración de topics para la temperatura y humedad
tema_temp = b'casaFacu/temp'
tema_hum = b'casaFacu/hum'

# Bucle principal
while True:
    publicar_datos(cliente, tema_temp, tema_hum)
    time.sleep(15)

