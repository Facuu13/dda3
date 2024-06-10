from umqtt.simple import MQTTClient
import time
import network
import dht
import machine
import ujson

# Pin de datos del sensor
d = dht.DHT11(machine.Pin(32))
# Pin del LED
pin_led = machine.Pin(2, machine.Pin.OUT)

ubicacion = 'pieza'
modelo = 'dht11'

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

# Función para manejar los mensajes entrantes
def manejar_mensaje(topic, msg):
    print("Mensaje recibido en el tema:", topic)
    print("Contenido del mensaje:", msg.decode())

    # Chequear si el mensaje es 'on' o 'off' y actuar en consecuencia
    if msg == b'on':
        print("Encendiendo LED")
        pin_led.on()
    elif msg == b'off':
        print("Apagando LED")
        pin_led.off()
    else:
        print("Mensaje no reconocido")

# Suscribirse a un tema para recibir mensajes
def suscribir_temas(cliente, topic):
    try:
        cliente.set_callback(manejar_mensaje)
        cliente.subscribe(topic)
        print("Suscripción exitosa al tema:", topic)
    except Exception as e:
        print(f"Error al suscribirse al tema: {e}")
        
# Publicar datos en el broker MQTT
def publicar_datos(cliente, tema_pieza):
    try:
        d.measure()
        temperatura = d.temperature()
        humedad = d.humidity()

        payload = ujson.dumps({
            "id": cliente_id, 
            "temperatura": temperatura, 
            "humedad": humedad, 
            "topic": tema_pieza, 
            "estado_led": pin_led.value(),
            "ubicacion": ubicacion,
            "modelo": modelo})

        cliente.publish(tema_pieza, payload)

        print(f"Temperatura: {temperatura}°C")
        print(f"Humedad: {humedad}%")
        print(f"Topic: {tema_pieza}")
        print(f"Estado del led: {pin_led.value()}")
        print(f"Ubicacion: {ubicacion}")
        print(f"Modelo: {modelo}")
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
tema_led = b'casaFacu/led'
tema_pieza = b'casaFacu/pieza'

# Suscribirse al tema para recibir mensajes de control del LED
suscribir_temas(cliente, tema_led)

# Bucle principal
while True:
    publicar_datos(cliente, tema_pieza)
    # Chequear mensajes entrantes
    cliente.check_msg()
    time.sleep(15)

#mosquitto_pub -h 192.168.1.11 -p 1883 -u facuu -P talleres13 -t casaFacu/led -m "off"