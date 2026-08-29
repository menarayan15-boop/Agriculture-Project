import React from 'react';
import { api } from '../utils/apiSimulator';

export default function DigitalTwin({ dbState }) {
    const { farm, weather } = dbState;
    const isAuto = farm.irrigationMode === 'AUTO';
    const isPumpOn = farm.valveState === 'ON';

    // Calculate visual dimensions based on data
    const moistureHeight = `${farm.soilMoisture}%`;
    const moistureColor = farm.soilMoisture < 30 ? '#ef4444' : farm.soilMoisture > 70 ? '#3b82f6' : '#10b981';

    const cropHealthColor = farm.cropHealth === 'GOOD' ? '#10b981' : farm.cropHealth === 'EXCELLENT' ? '#4ade80' : '#fbbf24';

    return (
        <div className="digital-twin-wrapper">
            <div className="dt-header">
                <div className="dt-title-block">
                    <h2>🌱 Farm Digital Twin</h2>
                    <p>Live 2D Virtual Representation of Field 01</p>
                </div>
                <div className="dt-controls">
                    <button className={`dt-btn ${isAuto ? 'active' : ''}`} onClick={() => api.updateIrrigationMode('AUTO', 'TWIN')}>AUTO MODE</button>
                    <button className={`dt-btn ${!isAuto ? 'active' : ''}`} onClick={() => api.updateIrrigationMode('MANUAL', 'TWIN')}>MANUAL MODE</button>
                    {!isAuto && (
                        <button className={`dt-btn ${isPumpOn ? 'danger' : 'primary'}`} onClick={() => api.togglePump(isPumpOn ? 'OFF' : 'ON', 'TWIN')}>
                            {isPumpOn ? 'STOP PUMP' : 'START PUMP'}
                        </button>
                    )}
                </div>
            </div>

            <div className="dt-canvas-area">
                {/* Weather overlay */}
                <div className="dt-weather">
                    <div className="dtw-item">☀️ {weather.temp}°C</div>
                    <div className="dtw-item">💦 Hum: {weather.humidity}%</div>
                    <div className="dtw-item">💨 Wind: {weather.windSpeed}km/h</div>
                    {weather.rainProbability > 50 && <div className="dtw-item rain">🌧️ Rain Expected!</div>}
                </div>

                {/* The Farm visualization */}
                <div className="dt-field">
                    {/* Sky */}
                    <div className="dt-sky" style={{ background: weather.rainProbability > 60 ? 'linear-gradient(to bottom, #475569, #94a3b8)' : 'linear-gradient(to bottom, #dbeafe, #bae6fd)' }}>
                        <div className="dt-sun" style={{ opacity: weather.rainProbability > 50 ? 0.2 : 1 }}>☀️</div>
                    </div>

                    {/* The Crop Area */}
                    <div className="dt-crop-layer">
                        <div className="dt-crop-info-overlay" style={{ borderColor: cropHealthColor }}>
                            <strong>{farm.cropName}</strong>
                            <span>{farm.cropStage}</span>
                            <span style={{ color: cropHealthColor }}>Status: {farm.cropHealth}</span>
                        </div>
                        {/* Sprinklers visualization */}
                        <div className="dt-sprinklers">
                            {[1, 2, 3].map(i => (
                                <div key={i} className="dt-sprinkler-head">
                                    <div className="ds-stick"></div>
                                    <div className="ds-nozzle">
                                        {isPumpOn && <div className="ds-water-spray"></div>}
                                    </div>
                                </div>
                            ))}
                        </div>

                        {/* Crop visuals */}
                        <div className="dt-plants">
                            {[1, 2, 3, 4, 5, 6].map(i => (
                                <div key={i} className="dt-plant" style={{
                                    height: farm.cropName === 'Basmati Rice' ? '60px' : farm.cropName === 'Wheat' ? '40px' : '80px',
                                    backgroundColor: cropHealthColor,
                                    opacity: farm.soilMoisture < 20 ? 0.6 : 1
                                }}></div>
                            ))}
                        </div>
                    </div>

                    {/* Soil Layer */}
                    <div className="dt-soil-layer">
                        <div className="dt-soil-moisture-indicator" style={{ height: moistureHeight, backgroundColor: moistureColor, opacity: 0.4 }}></div>
                        <div className="dt-soil-text">
                            Soil Moisture: {farm.soilMoisture}% | Temp: {farm.soilTemp}°C
                        </div>

                        {/* Water Tank */}
                        <div className="dt-water-tank">
                            <div className="dwt-label">Tank</div>
                            <div className="dwt-fill" style={{ height: `${farm.waterReservoirLevel}%` }}></div>
                            <div className="dwt-pct">{farm.waterReservoirLevel}%</div>
                        </div>

                        {/* Pump */}
                        <div className={`dt-pump-box ${isPumpOn ? 'active' : ''}`}>
                            <div className="dpb-icon">⚙️</div>
                            <div className="dpb-label">PUMP {farm.valveState}</div>
                        </div>
                    </div>
                </div>
            </div>
            <div className="dt-footer">
                <p>Digital Twin instantly visualizes field state. Any interaction exactly mimics IoT Controller downlink operations.</p>
            </div>
        </div>
    );
}
