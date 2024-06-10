import React from 'react';
import './DeviceDetails.css'; // Importamos el archivo CSS

const DeviceDetails = ({ dispositivo, mediciones, toggleRELE }) => {
    if (!mediciones) {
        return (
            <div>
                <p>No hay mediciones para este dispositivo</p>
            </div>
        );
    }

    return (
        <div className="device-details">
            <ul className="device-details-list">
                <li><strong>Temperatura:</strong> {mediciones.temperature}°C</li>
                <li><strong>Humedad:</strong> {mediciones.humidity}%</li>
                <li><strong>Última Medición:</strong> {new Date(mediciones.timestamp).toLocaleString()}</li>
                <li><strong>Topic:</strong> {mediciones.topic}</li>
                <li><strong>Rele:</strong> {mediciones.rele}</li>
                <li><strong>Ubicación:</strong> {mediciones.ubicacion}</li>
                <li><strong>Modelo:</strong> {mediciones.modelo}</li>
            </ul>
            <button
                onClick={() => toggleRELE(mediciones.rele == '1' ? 'off' : 'on')}
                className={`rele-button ${mediciones.rele == '1' ? 'off' : 'on'}`}
            >
                {mediciones.rele == '1' ? 'Apagar Rele' : 'Encender Rele'}
            </button>
        </div>
    );
};

export default DeviceDetails;
