import React, { useState, useEffect } from 'react';
import { api } from '../utils/apiSimulator';
import { useLang } from '../i18n/LanguageContext';
import { ToggleLeft, ToggleRight, Wifi, Thermometer, Droplet, Battery, HelpCircle } from 'lucide-react';

export default function IoTController({ dbState }) {
    const { lang } = useLang();
    const STR = {
        title: { en: 'HEC-IP67 INDUSTRIAL IOT FIELD CONTROLLER', hi: 'औद्योगिक IoT क्षेत्रीय नियंत्रक', te: 'పారిశ్రామిక IoT ఫీల్డ్ కంట్రోలర్' },
        sys: { en: 'SYS PWR', hi: 'विद्युत', te: 'సిస్టమ్ పవర్' },
        mode: { en: 'MODE AUTO/MAN', hi: 'मशीनी/मैनुअल', te: 'ఆటో/మాన్యువల్ మోడ్' },
        valve: { en: 'VALVE OVERRIDE', hi: 'वाल्व नियंत्रण', te: 'వాల్వ్ ఓవర్రైడ్' },
        env: { en: 'Field Environment Simulator (Inputs)', hi: 'पर्यावरण सिम्युलेटर', te: 'పర్యావరణ సిమ్యులేటర్' }
    };
    const s = (k) => (STR[k] && STR[k][lang]) || (STR[k] && STR[k]['en']) || k;

    const { soilMoisture, soilTemp, valveState, irrigationMode, batteryLevel, signalStrength } = dbState.farm;

    // Local state for interactive sliders (so UI is responsive, then sends API calls)
    const [localMoisture, setLocalMoisture] = useState(soilMoisture);
    const [localTemp, setLocalTemp] = useState(soilTemp);
    const [txBlinking, setTxBlinking] = useState(false);

    // Sync sliders if dbState changes from other interfaces (e.g. SMS commands, Kiosk actions)
    useEffect(() => {
        setLocalMoisture(soilMoisture);
    }, [soilMoisture]);

    useEffect(() => {
        setLocalTemp(soilTemp);
    }, [soilTemp]);

    // Transmit telemetry to backend API
    const transmitTelemetry = async (moisture, temp) => {
        setTxBlinking(true);
        setTimeout(() => setTxBlinking(false), 300);
        await api.sendTelemetry({
            soilMoisture: moisture,
            soilTemp: temp,
            batteryLevel: batteryLevel
        });
    };

    const handleMoistureChange = (e) => {
        const val = Number(e.target.value);
        setLocalMoisture(val);
        transmitTelemetry(val, localTemp);
    };

    const handleTempChange = (e) => {
        const val = Number(e.target.value);
        setLocalTemp(val);
        transmitTelemetry(localMoisture, val);
    };

    const simulateRain = () => {
        setLocalMoisture(85);
        transmitTelemetry(85, localTemp - 2);
    };

    const simulateDrySpell = () => {
        setLocalMoisture(15);
        transmitTelemetry(15, localTemp + 4);
    };

    const toggleLocalValve = async () => {
        const nextState = valveState === "ON" ? "OFF" : "ON";
        // Toggling pump on hardware overrides auto mode to MANUAL to reflect physical override action
        await api.updateIrrigationMode("MANUAL", "IOT_CONTROLLER");
        await api.togglePump(nextState, "IOT_CONTROLLER");
    };

    const toggleLocalMode = async () => {
        const nextMode = irrigationMode === "AUTO" ? "MANUAL" : "AUTO";
        await api.updateIrrigationMode(nextMode, "IOT_CONTROLLER");
    };

    return (
        <div className="iot-device-box">
            {/* Casing Header */}
            <div className="iot-case-header">
                <div className="screw spacer-top-left"></div>
                <div className="screw spacer-top-right"></div>
                <div className="brand-logo">{s('title')}</div>
                <div className="mesh-indicator">USFP Node #01</div>
            </div>

            {/* Internal Hardware Pane */}
            <div className="iot-inner-panel">

                {/* LED Lights Panel */}
                <div className="hardware-leds">
                    <div className="led-group">
                        <div className="led led-green active"></div>
                        <span>{s('sys')}</span>
                    </div>
                    <div className="led-group">
                        <div className={`led led-orange ${txBlinking ? 'active-blink' : ''}`}></div>
                        <span>RF TX</span>
                    </div>
                    <div className="led-group">
                        <div className={`led led-blue ${valveState === 'ON' ? 'active-blink' : ''}`}></div>
                        <span>VALVE RELAY</span>
                    </div>
                    <div className="led-group">
                        <div className={`led led-yellow ${irrigationMode === 'AUTO' ? 'active' : ''}`}></div>
                        <span>AUTO MODE</span>
                    </div>
                </div>

                {/* Liquid Crystal Display Screen */}
                <div className="lcd-display font-mono">
                    <div className="lcd-header flex justify-between">
                        <span>USFP-NODE-01</span>
                        <span className="flex items-center gap-1">
                            <Wifi size={12} />
                            {Array(signalStrength).fill('I').join('')}
                        </span>
                    </div>
                    <div className="lcd-main">
                        <div>MOISTURE: {soilMoisture}%  ({soilMoisture < 30 ? 'CRITICAL' : 'OK'})</div>
                        <div>TEMP:     {soilTemp}°C</div>
                        <div>VALVE:    {valveState === 'ON' ? '>> VALVE OPEN <<' : '>> VALVE CLOSED <<'}</div>
                        <div>CTRL MODE: {irrigationMode}</div>
                    </div>
                    <div className="lcd-footer flex justify-between">
                        <span>BATTERY: {batteryLevel}%</span>
                        <span>LORA 868Mhz</span>
                    </div>
                </div>

                {/* Physical Toggle Hardware Switches */}
                <div className="physical-switches">
                    <div className="switch-card">
                        <span>{s('mode')}</span>
                        <button className="hdw-switch-btn" onClick={toggleLocalMode}>
                            {irrigationMode === "AUTO" ? (
                                <ToggleRight size={38} className="switch-icon text-green" />
                            ) : (
                                <ToggleLeft size={38} className="switch-icon text-gray" />
                            )}
                        </button>
                        <div className="switch-label">{irrigationMode}</div>
                    </div>

                    <div className="switch-card">
                        <span>{s('valve')}</span>
                        <button className="hdw-switch-btn" onClick={toggleLocalValve}>
                            {valveState === "ON" ? (
                                <ToggleRight size={38} className="switch-icon text-blue" />
                            ) : (
                                <ToggleLeft size={38} className="switch-icon text-gray" />
                            )}
                        </button>
                        <div className="switch-label">{valveState}</div>
                    </div>
                </div>

                {/* Sensor Simulators */}
                <div className="sensor-simulators">
                    <div className="sim-title">{s('env')}</div>

                    <div className="simulator-control">
                        <label className="flex justify-between text-xs">
                            <span className="flex items-center gap-1"><Droplet size={12} /> Soil Moisture (%)</span>
                            <span className="font-bold">{localMoisture}%</span>
                        </label>
                        <input
                            type="range"
                            min="0"
                            max="100"
                            value={localMoisture}
                            onChange={handleMoistureChange}
                            className="range-input moisture-slider"
                        />
                    </div>

                    <div className="simulator-control">
                        <label className="flex justify-between text-xs">
                            <span className="flex items-center gap-1"><Thermometer size={12} /> Temperature (°C)</span>
                            <span className="font-bold">{localTemp}°C</span>
                        </label>
                        <input
                            type="range"
                            min="10"
                            max="50"
                            value={localTemp}
                            onChange={handleTempChange}
                            className="range-input temp-slider"
                        />
                    </div>

                    <div className="sim-button-row">
                        <button className="sim-btn rain-btn" onClick={simulateRain}>
                            💧 Simulate Torrential Rain (85%)
                        </button>
                        <button className="sim-btn drought-btn" onClick={simulateDrySpell}>
                            🔥 Simulate Drought/Dry Soil (15%)
                        </button>
                    </div>
                </div>

            </div>

            {/* Casing Footer */}
            <div className="iot-case-footer">
                <div className="screw spacer-bottom-left"></div>
                <div className="screw spacer-bottom-right"></div>
                <div className="casing-info">IP67 Waterproof • Solar Powered Controller Box</div>
            </div>
        </div>
    );
}
