import React, { useState } from 'react';
import { Smartphone, Shield, Phone } from 'lucide-react';

export default function USSDSimulator({ dbState }) {
    const [ussdCode, setUssdCode] = useState('');
    const [sessionActive, setSessionActive] = useState(false);
    const [screenText, setScreenText] = useState('');
    const [menuStack, setMenuStack] = useState([]);

    const farmer = dbState?.registeredFarmers?.find(f => f.id === dbState?.activeFarmerId) || dbState?.registeredFarmers?.[0];
    const field = farmer?.fields?.[0] || dbState?.farm || {};

    const MAIN_MENU = `SmartFarm USSD
━━━━━━━━━━━━━━
1. Farm Status
2. Weather
3. Start Pump
4. Stop Pump
5. Health & Safety
6. Market Price
7. SOS Emergency
0. Exit

Reply:`;

    const HEALTH_MENU = `Health & Safety
━━━━━━━━━━━━━━
1. Heat Risk Check
2. Air Quality (AQI)
3. Hydration Alert
4. Pesticide Safety
5. Nearest Hospital
9. Back to Main

Reply:`;

    const handleDial = (e) => {
        e.preventDefault();
        if (ussdCode === '*123#' || ussdCode === '*123*5#') {
            setSessionActive(true);
            setScreenText(MAIN_MENU);
            setMenuStack(['main']);
            setUssdCode('');
        } else {
            setScreenText('Connection problem\nor invalid MMI code.');
            setSessionActive(true);
            setTimeout(() => setSessionActive(false), 2000);
        }
    };

    const handleReply = (e) => {
        e.preventDefault();
        const choice = ussdCode.trim();
        setUssdCode('');

        const currentMenu = menuStack[menuStack.length - 1] || 'main';

        if (currentMenu === 'main') {
            switch (choice) {
                case '1':
                    setScreenText(`Farm Status
━━━━━━━━━━━━━━
Crop: ${field.crop || dbState?.farm?.cropName || 'N/A'}
Moisture: ${field.soilMoisture || dbState?.farm?.soilMoisture || 0}%
Pump: ${field.valveState || dbState?.farm?.valveState || 'OFF'}
Health: ${field.cropHealth || 'GOOD'}

0. Back`);
                    break;
                case '2':
                    setScreenText(`Weather Report
━━━━━━━━━━━━━━
Temp: ${dbState?.weather?.temp || 29}°C
Rain: ${dbState?.weather?.rainProbability || 20}%
${dbState?.weather?.condition || 'Clear'}
Wind: ${dbState?.weather?.windSpeed || 12}km/h

0. Back`);
                    break;
                case '3':
                    import('../utils/apiSimulator').then(({ api }) => api.togglePump('ON', 'USSD'));
                    setScreenText(`✓ Command Sent
━━━━━━━━━━━━━━
Pump will turn ON
shortly.

SMS confirmation
will follow.

0. Back`);
                    break;
                case '4':
                    import('../utils/apiSimulator').then(({ api }) => api.togglePump('OFF', 'USSD'));
                    setScreenText(`✓ Command Sent
━━━━━━━━━━━━━━
Pump will turn OFF
shortly.

0. Back`);
                    break;
                case '5':
                    setScreenText(HEALTH_MENU);
                    setMenuStack([...menuStack, 'health']);
                    break;
                case '6':
                    setScreenText(`Market Prices
━━━━━━━━━━━━━━
Rice: ₹2,180/qtl
Wheat: ₹2,275/qtl
Tomato: ₹35/kg
Groundnut: ₹5,900/qtl

Last updated: Today

0. Back`);
                    break;
                case '7':
                    setScreenText(`🆘 SOS ACTIVATED
━━━━━━━━━━━━━━
Emergency contacts
notified.

Location shared
with nearest PHC.

Helpline:
112 (Emergency)
1800-419-5888

0. Back`);
                    break;
                case '0':
                    setSessionActive(false);
                    setMenuStack([]);
                    break;
                default:
                    setScreenText(`Invalid choice.\n\n${MAIN_MENU}`);
            }
        } else if (currentMenu === 'health') {
            switch (choice) {
                case '1': {
                    const activeFarmer = dbState.registeredFarmers.find(f => f.id === dbState.activeFarmerId);
                    const temp = activeFarmer?.weather?.temp || dbState?.weather?.temp || 29;
                    let risk = 'LOW';
                    let advice = 'Safe to work outdoors.';
                    if (temp > 40) { risk = '🔴 VERY HIGH'; advice = 'STOP outdoor work!\nSeek shade immediately.'; }
                    else if (temp >= 36) { risk = '🟠 HIGH'; advice = 'Take breaks every\n30 minutes. Hydrate.'; }
                    else if (temp >= 32) { risk = '🟡 MODERATE'; advice = 'Drink water regularly.\nWear a hat.'; }
                    else { risk = '🟢 LOW'; advice = 'Safe to work outdoors.'; }
                    setScreenText(`Heat Risk: ${risk}
━━━━━━━━━━━━━━
Temp: ${temp}°C
Humidity: ${activeFarmer?.weather?.humidity || dbState?.weather?.humidity || 68}%

${advice}

9. Back  0. Exit`);
                    break;
                }
                case '2': {
                    const activeFarmer = dbState.registeredFarmers.find(f => f.id === dbState.activeFarmerId);
                    const aqi = activeFarmer?.airQuality?.aqi || dbState?.airQuality?.aqi || 120;
                    let status = 'Good';
                    if (aqi >= 200) status = '🔴 HAZARDOUS';
                    else if (aqi >= 150) status = '🟠 UNHEALTHY';
                    else if (aqi >= 100) status = '🟡 MODERATE';
                    else status = '🟢 GOOD';
                    setScreenText(`Air Quality
━━━━━━━━━━━━━━
AQI: ${aqi}
Status: ${status}
PM2.5: ${activeFarmer?.airQuality?.pm25 || dbState?.airQuality?.pm25 || 45}

${aqi >= 150 ? 'Wear mask outdoors!' : 'Safe to breathe.'}

9. Back  0. Exit`);
                    break;
                }
                case '3': {
                    const activeFarmer = dbState.registeredFarmers.find(f => f.id === dbState.activeFarmerId);
                    const hydration = activeFarmer?.farmerHealth?.hydration || dbState?.farmerHealth?.hydration || 80;
                    setScreenText(`Hydration Check
━━━━━━━━━━━━━━
Level: ${hydration}%
Status: ${hydration < 50 ? '🔴 DEHYDRATED' : hydration < 70 ? '🟡 DRINK MORE' : '🟢 OK'}

${hydration < 50 ? 'DRINK WATER NOW!\nCarry a bottle.' : 'Keep drinking water\nevery 30 minutes.'}

9. Back  0. Exit`);
                    break;
                }
                case '4':
                    setScreenText(`Pesticide Safety
━━━━━━━━━━━━━━
Last spray logged:
Mancozeb 75%

Re-entry interval:
24 hours

DO NOT enter field
without PPE before
interval expires.

9. Back  0. Exit`);
                    break;
                case '5':
                    setScreenText(`Nearest Hospital
━━━━━━━━━━━━━━
Karnal Govt. PHC
Distance: 6.2 km
Time: ~14 mins

Emergency: 112
Ambulance: 108

9. Back  0. Exit`);
                    break;
                case '9':
                    setScreenText(MAIN_MENU);
                    setMenuStack(menuStack.slice(0, -1));
                    break;
                case '0':
                    setSessionActive(false);
                    setMenuStack([]);
                    break;
                default:
                    setScreenText(`Invalid choice.\n\n${HEALTH_MENU}`);
            }
        }

        // Handle global back navigation
        if (choice === '0' && currentMenu !== 'main') {
            // Already handled above
        }
    };

    const keypadPress = (val) => {
        setUssdCode(prev => prev + val);
    };

    return (
        <div className="phone-mockup-wrapper ussd-mode">
            <div className="classic-keypad-phone ussd-theme">
                <div className="phone-earpiece"></div>
                <div className="phone-screen-border">
                    <div className="classic-phone-screen" style={{ background: '#c5cba3', color: '#2a3000' }}>
                        {/* Nokia-style monochrome header */}
                        <div className="flex justify-between items-center px-2 py-1 text-[9px] font-mono border-b border-[#9aa378]" style={{ color: '#4a5500' }}>
                            <span>📶 2G</span>
                            <span className="font-bold">SmartFarm</span>
                            <span>🔋</span>
                        </div>

                        {!sessionActive ? (
                            <div className="flex flex-col items-center justify-center h-full gap-3 p-3">
                                <div className="text-center">
                                    <div className="text-lg font-bold font-mono" style={{ color: '#2a3000' }}>📱 USSD</div>
                                    <div className="text-[10px] font-mono mt-1" style={{ color: '#4a5500' }}>Dial *123# to start</div>
                                    <div className="text-[9px] font-mono mt-2 px-2" style={{ color: '#6a7500' }}>Works on 2G • No internet needed • Zero balance OK</div>
                                </div>
                                <div className="w-full bg-[#b5bb93] rounded p-2 mt-2">
                                    <div className="font-mono text-sm text-center font-bold" style={{ color: '#2a3000', minHeight: '20px' }}>
                                        {ussdCode || ''}
                                        <span className="animate-pulse">▌</span>
                                    </div>
                                </div>
                            </div>
                        ) : (
                            <div className="flex flex-col h-full">
                                <div className="flex-1 overflow-y-auto p-2">
                                    <pre className="font-mono text-[10px] whitespace-pre-wrap leading-relaxed" style={{ color: '#2a3000' }}>
                                        {screenText}
                                    </pre>
                                </div>
                                <div className="p-2 border-t border-[#9aa378]">
                                    <div className="bg-[#b5bb93] rounded px-2 py-1 font-mono text-sm text-center font-bold" style={{ color: '#2a3000', minHeight: '18px' }}>
                                        {ussdCode || ''}
                                        <span className="animate-pulse">▌</span>
                                    </div>
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Physical Keypad */}
                <div className="phone-keypad ivr-keypad">
                    {/* Soft keys */}
                    <div className="dpad-row">
                        {!sessionActive ?
                            <button className="key-btn action-key" onClick={(e) => { e.preventDefault(); handleDial(e); }}>Call</button>
                            :
                            <button className="key-btn action-key" onClick={(e) => { e.preventDefault(); handleReply(e); }}>Send</button>
                        }
                        <button className="key-btn center-dpad">⚪</button>
                        <button className="key-btn action-key" onClick={() => { setSessionActive(false); setUssdCode(''); setMenuStack([]); }}>
                            {sessionActive ? 'Cancel' : 'Clear'}
                        </button>
                    </div>

                    {/* Number grid */}
                    {[['1', '2', '3'], ['4', '5', '6'], ['7', '8', '9'], ['*', '0', '#']].map((row, ri) => (
                        <div key={ri} className="key-row" style={ri === 0 ? { marginTop: '0.5rem' } : {}}>
                            {row.map(key => (
                                <button key={key} className="key-btn" onClick={() => keypadPress(key)}>
                                    <div className="num">{key}</div>
                                </button>
                            ))}
                        </div>
                    ))}
                </div>
            </div>

            <div className="interface-instruction-card">
                <h4 className="flex items-center gap-2 text-sm font-bold">
                    <Shield size={16} className="text-emerald-500" /> USSD Gateway — Zero Internet
                </h4>
                <p className="text-xs text-slate-400 mt-1">Works on 2G networks without any data plan. Dial <strong>*123#</strong> → navigate with number keys.
                    Option 5 opens the <strong>Health & Safety</strong> menu for heat risk, AQI, hydration, pesticide safety, and hospital routing.</p>
            </div>
        </div>
    );
}
