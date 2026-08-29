import React, { useState } from 'react';
import { api } from '../utils/apiSimulator';
import { CloudRain, Sun, Droplet, WifiOff, Sprout, ShieldAlert, ChevronDown, ChevronUp, Database } from 'lucide-react';

export default function DemoSimulationPanel({ dbState }) {
    // This floating panel will only be visible when toggled
    const [minimized, setMinimized] = useState(false);

    const applySimulation = (field, value) => {
        // Direct hack for presentation speed without full network wait
        if (window.__USFP_STATE__) {
            if (field.includes('.')) {
                // If it's farm.* we must mutate the active farmer's field zero for demo purposes
                if (field.startsWith('farm.')) {
                    const key = field.split('.')[1];
                    const activeUserId = window.__USFP_STATE__.activeFarmerId || window.__USFP_STATE__.registeredFarmers[0].id;
                    const farmerIndex = window.__USFP_STATE__.registeredFarmers.findIndex(f => f.id === activeUserId);
                    const fields = [...window.__USFP_STATE__.registeredFarmers[farmerIndex].fields];
                    fields[0] = { ...fields[0], [key]: value };
                    window.__USFP_STATE__.registeredFarmers[farmerIndex].fields = fields;
                } else {
                    const [obj, key] = field.split('.');
                    window.__USFP_STATE__[obj] = { ...window.__USFP_STATE__[obj], [key]: value };
                }
            } else {
                window.__USFP_STATE__[field] = value;
            }
            api._notifySubscribers && api._notifySubscribers();
            // Force re-run AI recommendation
            api.getFarmData();
        }
    };

    const activeUserId = dbState?.activeFarmerId || dbState?.registeredFarmers?.[0]?.id;
    const activeFarmer = dbState?.registeredFarmers?.find(f => f.id === activeUserId) || dbState?.registeredFarmers?.[0];
    const activeField = activeFarmer?.fields?.[0] || {};

    return (
        <div className={`hidden md:block fixed top-24 right-4 md:right-8 w-80 bg-slate-900/95 backdrop-blur-xl rounded-2xl shadow-2xl border-2 border-indigo-500/50 z-[99999] overflow-hidden text-slate-300 transform transition-all duration-300 ${minimized ? 'translate-x-[75%] opacity-80 hover:opacity-100 hover:translate-x-0' : 'animate-in slide-in-from-right'}`}>
            <div
                className="bg-gradient-to-r from-blue-900 to-indigo-900 p-3 border-b border-indigo-500/30 flex justify-between items-center cursor-pointer select-none"
                onClick={() => setMinimized(!minimized)}
            >
                <div className="flex items-center gap-2">
                    <span className="text-[10px] bg-red-600 text-white px-2 py-0.5 rounded-full font-mono font-bold animate-pulse">LIVE</span>
                    <span className="font-bold text-sm text-white flex items-center gap-2">
                        <span>⚡</span> {!minimized && <span>SIMULATION PANEL</span>}
                    </span>
                </div>
                <button className="text-white hover:text-indigo-200 transition-colors">
                    {minimized ? <ChevronDown size={18} /> : <ChevronUp size={18} />}
                </button>
            </div>

            {!minimized && (
                <div className="p-4 flex flex-col gap-4 max-h-[75vh] overflow-y-auto custom-scrollbar">
                    <p className="text-[11px] text-slate-400 leading-tight border-b border-slate-700/50 pb-3">Clicking these buttons instantly mutates farm telemetry, allowing you to watch the dashboard react in real-time.</p>

                    {/* Simple AI Flow Visual */}
                    <div className="bg-slate-800/80 p-3 rounded-xl border border-indigo-500/30 text-center">
                        <span className="text-[10px] font-bold text-indigo-400 uppercase tracking-widest flex items-center justify-center gap-1 mb-2">
                            <Database size={12} /> AI DECISION ENGINE
                        </span>
                        <div className="bg-slate-900 border border-slate-700 rounded py-1 px-2 text-xs flex justify-between tracking-wide font-mono mb-2">
                            <span>Soil: {activeField.soilMoisture || 40}%</span>
                            <span className="text-indigo-400">+</span>
                            <span>Rain: {dbState?.weather?.rainProbability || 20}%</span>
                        </div>
                        <div className="bg-emerald-900/40 border border-emerald-500/40 text-emerald-400 font-bold px-3 py-1.5 rounded text-xs w-full">
                            {activeField.soilMoisture > 50 ? 'IRRIGATION NOT REQ.' : (dbState?.weather?.rainProbability > 50 ? 'POSTPONE: RAIN' : 'IRRIGATE NOW')}
                        </div>
                    </div>

                    {/* Weather Simulation */}
                    <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50 mt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">☀️ Weather Control</span>
                        <div className="grid grid-cols-2 gap-2">
                            <button onClick={() => { applySimulation('weather.rainProbability', 95); applySimulation('weather.temp', 22); }} className="flex flex-col items-center gap-1 bg-slate-900 p-2 rounded-lg hover:bg-blue-900/50 hover:border-blue-500/50 border border-slate-700 text-xs active:scale-[0.98] transition-all">
                                <CloudRain size={16} className="text-blue-400" />
                                <span className="font-bold">Force Rain</span>
                            </button>
                            <button onClick={() => { applySimulation('weather.rainProbability', 5); applySimulation('weather.temp', 42); applySimulation('farm.soilMoisture', 15); }} className="flex flex-col items-center gap-1 bg-slate-900 p-2 rounded-lg hover:bg-orange-900/50 hover:border-orange-500/50 border border-slate-700 text-xs active:scale-[0.98] transition-all">
                                <Sun size={16} className="text-orange-400" />
                                <span className="font-bold">Force Heatwave</span>
                            </button>
                        </div>
                    </div>

                    {/* Soil Simulation */}
                    <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50 mt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">💧 Soil Moisture</span>
                        <div className="flex gap-2">
                            <button onClick={() => applySimulation('farm.soilMoisture', 10)} className="flex-1 bg-slate-900 p-2 rounded-lg hover:bg-red-900/50 text-xs text-red-500 font-bold border border-slate-700 hover:border-red-500/50 active:scale-[0.98] transition-all">10% Dry</button>
                            <button onClick={() => applySimulation('farm.soilMoisture', 60)} className="flex-1 bg-slate-900 p-2 rounded-lg hover:bg-emerald-900/50 text-xs text-emerald-500 font-bold border border-slate-700 hover:border-emerald-500/50 active:scale-[0.98] transition-all">60% Good</button>
                        </div>
                        <button onClick={() => applySimulation('farm.irrigationMode', 'AUTO')} className="w-full mt-2 bg-indigo-900/40 text-indigo-300 font-bold text-xs p-2 rounded-lg hover:bg-indigo-800/60 active:scale-[0.98] transition-all border border-indigo-500/30">
                            Reset IoT to AUTO Mode
                        </button>
                    </div>

                    {/* IoT Hardware Simulation */}
                    <div className="bg-slate-800/80 p-2 rounded-xl border border-slate-700/50 mt-1">
                        <span className="text-[10px] font-bold text-slate-500 uppercase tracking-widest block mb-2 px-1">🚨 Inject Scenarios</span>
                        <button onClick={() => applySimulation('networkStatus', '🔴 OFFLINE')} className="w-full flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-700 hover:border-slate-500 hover:bg-slate-800 text-xs mb-2 active:scale-[0.98] transition-all font-bold">
                            <span className="flex items-center gap-2"><WifiOff size={14} className="text-slate-400" /> Simulate Network Offline</span>
                        </button>
                        <button onClick={() => applySimulation('farm.waterReservoirLevel', 5)} className="w-full flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-700 hover:border-blue-500 hover:bg-slate-800 text-xs mb-2 active:scale-[0.98] transition-all font-bold">
                            <span className="flex items-center gap-2"><Droplet size={14} className="text-blue-500" /> Empty Water Tank</span>
                        </button>
                        <button onClick={() => { applySimulation('farm.cropHealth', 'ATTENTION: Late Blight Detected'); applySimulation('activeTab', 'crophealth'); }} className="w-full flex justify-between items-center bg-slate-900 p-2.5 rounded-lg border border-slate-700 hover:border-yellow-500 hover:bg-slate-800 text-xs active:scale-[0.98] transition-all font-bold">
                            <span className="flex items-center gap-2"><ShieldAlert size={14} className="text-yellow-500" /> Trigger Disease Alert</span>
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
