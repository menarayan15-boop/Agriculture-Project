import React, { useState } from 'react';
import { api } from '../utils/apiSimulator';
import { useLang } from '../i18n/LanguageContext';
import { Play, Database, Check, SignalHigh, WifiOff, Sun, CloudRain, Wind, HeartPulse } from 'lucide-react';

export default function CommandCenter({ dbState }) {
    const { lang } = useLang();
    const STR = {
        title: { en: 'USFP Master Command Center', hi: 'मुख्य नियंत्रण केंद्र', te: 'ప్రాధాన కమాండ్ సెంటర్' },
        subtitle: { en: 'Developer tools: Inject test scenarios and trigger live alerts across the platform', hi: 'डेवलपर उपकरण: परीक्षण और अलर्ट', te: 'డెవలపర్ సాధనాలు' },
        btnNormal: { en: 'Normal Day', hi: 'सामान्य दिन', te: 'సాధారణ రోజు' },
        btnHeat: { en: 'Heat Wave', hi: 'लू', te: 'వడగాలి' },
        btnPollution: { en: 'Pollution Event', hi: 'प्रदूषण', te: 'కాలుష్యం' },
        btnFlood: { en: 'Flood Warning', hi: 'बाढ़ की चेतावनी', te: 'వరద హెచ్చరిక' },
        btnOffline: { en: 'Offline Mode', hi: 'ऑफ़लाइन मोड', te: 'ఆఫ్‌లైన్ మోడ్' },
        btnSync: { en: 'Simulate API Sync', hi: 'API सिमुलेशन', te: 'API అనుకరణ' },
        dbState: { en: 'Database DB_STATE Inspector', hi: 'डेटाबेस स्टेट', te: 'డేటాబేస్ స్టేట్' }
    };
    const s = (k) => (STR[k] && STR[k][lang]) || (STR[k] && STR[k]['en']) || k;

    const [activeScenario, setActiveScenario] = useState('normal');

    const applyScenario = (id, changes) => {
        setActiveScenario(id);
        if (window.__USFP_STATE__) {
            Object.keys(changes).forEach(mainKey => {
                const subObj = changes[mainKey];
                if (typeof subObj === 'object' && !Array.isArray(subObj)) {
                    window.__USFP_STATE__[mainKey] = { ...window.__USFP_STATE__[mainKey], ...subObj };
                } else {
                    window.__USFP_STATE__[mainKey] = subObj;
                }
            });
            api._notifySubscribers && api._notifySubscribers();
            api.getFarmData();
        }
    };

    const scenarios = [
        {
            id: 'normal',
            title: 'Scenario 1 — Normal Day',
            icon: <Check size={20} className="text-emerald-400" />,
            changes: {
                weather: { temp: 26, humidity: 45, rainProbability: 10, condition: "Clear" },
                airQuality: { aqi: 45, pm25: 12, status: "🟢 GOOD" },
                farmerHealth: { heartRate: 72, bodyTemp: 36.6, spo2: 98, heatRisk: "Low", status: "🟢 SAFE", workRecommendation: "🟢 CONDITIONS OK", explanation: "Temperature and humidity are within comfortable ranges." },
                disasterAlerts: [],
                networkStatus: '🟢 ONLINE'
            }
        },
        {
            id: 'heat',
            title: 'Scenario 2 — Heat Wave',
            icon: <Sun size={20} className="text-orange-400" />,
            changes: {
                weather: { temp: 44, humidity: 30, rainProbability: 0, condition: "Extreme Heat" },
                airQuality: { aqi: 110, status: "🟡 MODERATE" },
                farmerHealth: { heartRate: 98, bodyTemp: 37.8, spo2: 96, heatRisk: "High", status: "🟠 WARNING", workRecommendation: "🟠 TAKE MORE BREAKS", explanation: "High temperature + prolonged outdoor activity detected. Heat risk increased." },
                disasterAlerts: []
            }
        },
        {
            id: 'pollution',
            title: 'Scenario 3 — Pollution Event',
            icon: <Wind size={20} className="text-amber-400" />,
            changes: {
                weather: { temp: 28, humidity: 55 },
                airQuality: { aqi: 345, pm25: 280, status: "🔴 SEVERE HAZARDOUS", recommendation: "Air quality is dangerously poor. Avoid all outdoor activity." },
                farmerHealth: { spo2: 92, heartRate: 85, heatRisk: "Low", status: "🔴 CAUTION", workRecommendation: "🔴 AVOID NON-ESSENTIAL OUTDOOR WORK", explanation: "PM2.5 particles are critically high causing acute respiratory stress." }
            }
        },
        {
            id: 'flood',
            title: 'Scenario 4 — Flood Warning',
            icon: <CloudRain size={20} className="text-blue-400" />,
            changes: {
                weather: { temp: 22, rainProbability: 100, condition: "Torrential Rain" },
                farmerHealth: { workRecommendation: "🔴 SEEK HIGH GROUND", explanation: "Severe regional flooding reported by IMD.", heatRisk: "Low" },
                disasterAlerts: [{ type: "🚨 FLOOD RISK", message: "Heavy rainfall expanding. Risk of flash floods in your registered farm district." }]
            }
        },
        {
            id: 'offline',
            title: 'Scenario 5 — Offline Mode',
            icon: <WifiOff size={20} className="text-rose-400" />,
            changes: {
                networkStatus: '🔴 OFFLINE',
                farmerHealth: { workRecommendation: "🟠 TAKE MORE BREAKS", explanation: "Using offline local AI model based on last known device telemetry." }
            }
        }
    ];

    return (
        <div className="w-full max-w-6xl mx-auto p-4 flex flex-col gap-6 animate-in fade-in pb-24">

            {/* Header / Impact */}
            <div className="flex flex-col md:flex-row gap-6">
                <div className="flex-[2] bg-slate-900 border border-slate-700 p-8 rounded-2xl shadow-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4 opacity-20"><Database size={120} /></div>
                    <h1 className="text-4xl font-display font-bold text-white mb-2 relative z-10">🎬 SIH DEMO SCENARIOS</h1>
                    <p className="text-slate-400 text-lg relative z-10">Instantly simulate environmental and health events for the judging panel.</p>
                </div>
                <div className="flex-1 bg-slate-900 border border-indigo-500/50 p-6 rounded-2xl shadow-xl flex flex-col justify-center text-center">
                    <span className="text-[10px] uppercase font-bold text-indigo-400 tracking-widest block mb-4">DEMO METRICS ONLY</span>
                    <div className="flex justify-around">
                        <div><span className="block text-3xl font-display font-bold text-white">41.2k</span><span className="text-xs text-slate-400">Farmers Protected</span></div>
                        <div><span className="block text-3xl font-display font-bold text-white">&lt;2s</span><span className="text-xs text-slate-400">Offline Alert Time</span></div>
                    </div>
                </div>
            </div>

            {/* JSON State Inspector */}
            <div className="bg-slate-900 rounded-xl border border-slate-800 overflow-hidden shadow-xl">
                <div className="bg-slate-800 px-4 py-2 border-b border-slate-700 flex justify-between items-center">
                    <h3 className="font-bold text-slate-300 font-mono text-sm">{s('dbState')}</h3>
                </div>
            </div>

            {/* Wow Dashboard */}
            <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl relative text-center flex flex-col items-center">
                <div className="mb-6 border-b border-slate-800 pb-4">
                    <h2 className="text-2xl font-bold font-display text-white flex items-center gap-2">
                        <Database size={24} className="text-indigo-400" />
                        {s('title')}
                    </h2>
                    <p className="text-slate-400 mt-1">{s('subtitle')}</p>
                </div>

                <div className="flex gap-4 w-full max-w-4xl justify-center mb-8">
                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <span className="text-xs font-bold text-slate-400 block mb-2">🌍 SOIL</span>
                        <span className="text-2xl font-bold block text-white">{dbState?.farm?.soilMoisture}%</span>
                        <span className="text-xs font-bold text-emerald-400">🟢 GOOD</span>
                    </div>
                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <span className="text-xs font-bold text-slate-400 block mb-2">🌦️ WEATHER</span>
                        <span className="text-2xl font-bold block text-white">{dbState?.weather?.temp}°C</span>
                        <span className={`text-xs font-bold ${dbState?.weather?.temp > 38 ? 'text-orange-400' : 'text-emerald-400'}`}>
                            {dbState?.weather?.temp > 38 ? '🟠 CAUTION' : '🟢 NORMAL'}
                        </span>
                    </div>
                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <span className="text-xs font-bold text-slate-400 block mb-2">🌫️ AIR</span>
                        <span className="text-2xl font-bold block text-white">AQI {dbState?.airQuality?.aqi}</span>
                        <span className={`text-xs font-bold ${dbState?.airQuality?.aqi > 200 ? 'text-rose-400' : 'text-emerald-400'}`}>
                            {dbState?.airQuality?.status}
                        </span>
                    </div>
                </div>

                <div className="flex gap-4 w-full max-w-4xl justify-center mb-8">
                    <div className="flex-[1.5] bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <span className="text-xs font-bold text-slate-400 block mb-2">❤️ HEALTH</span>
                        <span className="text-2xl font-bold block text-white">{dbState?.farmerHealth?.heartRate} BPM</span>
                        <span className={`text-xs font-bold ${dbState?.farmerHealth?.bodyTemp > 37.5 ? 'text-orange-400' : 'text-emerald-400'}`}>
                            {dbState?.farmerHealth?.bodyTemp}°C Temp
                        </span>
                    </div>
                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <span className="text-xs font-bold text-slate-400 block mb-2">☀️ HEAT</span>
                        <span className="text-2xl font-bold block text-white">{dbState?.farmerHealth?.heatRisk}</span>
                    </div>
                    <div className="flex-1 bg-slate-800 border border-slate-700 rounded-xl p-4">
                        <span className="text-xs font-bold text-slate-400 block mb-2">📡 SENSORS</span>
                        <span className="text-2xl font-bold block text-white">{dbState?.sensorsOnline || 0}/{dbState?.sensorsTotal || 5}</span>
                        <span className="text-xs font-bold text-blue-400">ONLINE</span>
                    </div>
                </div>

                <div className="flex flex-col items-center mb-4">
                    <span className="text-slate-500 mb-2">↓ Data flowing to local engine</span>
                    <div className="bg-indigo-900/50 border-2 border-indigo-500 px-8 py-3 rounded-2xl flex items-center gap-3">
                        <span className="animate-pulse">🧠</span>
                        <span className="font-bold text-indigo-100 tracking-widest text-lg">SMARTFARM AI</span>
                    </div>
                    <span className="text-slate-500 mt-2 mb-2">↓ Analysis generated</span>
                </div>

                <div className={`px-12 py-4 rounded-xl border-4 max-w-sm w-full mx-auto shadow-2xl ${dbState?.farmerHealth?.heatRisk === 'High' ? 'bg-orange-950/50 border-orange-500' :
                    dbState?.airQuality?.aqi > 200 ? 'bg-rose-950/50 border-rose-500' :
                        dbState?.disasterAlerts?.length > 0 ? 'bg-blue-950/50 border-blue-500' :
                            'bg-emerald-950/50 border-emerald-500'
                    }`}>
                    <span className={`block font-bold text-lg mb-1 ${dbState?.farmerHealth?.heatRisk === 'High' ? 'text-orange-400' :
                        dbState?.airQuality?.aqi > 200 ? 'text-rose-400' :
                            dbState?.disasterAlerts?.length > 0 ? 'text-blue-400' :
                                'text-emerald-400'
                        }`}>
                        {dbState?.farmerHealth?.heatRisk === 'High' ? '🟠 HEAT RISK DETECTED' :
                            dbState?.airQuality?.aqi > 200 ? '🔴 RESPIRATORY RISK' :
                                dbState?.disasterAlerts?.length > 0 ? '🚨 DISASTER WARNING' :
                                    '🟢 ACTION NOT REQUIRED'}
                    </span>
                    <span className="text-white font-bold block">
                        Recommended action:<br />
                        {dbState?.farmerHealth?.workRecommendation}
                    </span>
                </div>
            </div>

            {/* Engine Scenarios Config */}
            <div className="grid grid-cols-1 md:grid-cols-5 gap-4">
                {scenarios.map(sc => (
                    <button
                        key={sc.id}
                        onClick={() => applyScenario(sc.id, sc.changes)}
                        className={`flex flex-col items-center text-center p-4 rounded-2xl transition-all h-full border ${activeScenario === sc.id ? 'bg-indigo-900/40 border-indigo-400 scale-105 shadow-[0_0_20px_rgba(99,102,241,0.3)]' : 'bg-slate-900 border-slate-700 hover:bg-slate-800'
                            }`}
                    >
                        <div className="bg-slate-800 p-3 rounded-full mb-3">{sc.icon}</div>
                        <span className="font-bold text-slate-200 text-sm leading-tight">{sc.title}</span>
                    </button>
                ))}
            </div>
            <div className="text-center">
                <span className="text-slate-500 text-xs uppercase tracking-widest font-bold">Judges can run the entire system flow in under 2 minutes.</span>
            </div>
        </div>
    );
}
