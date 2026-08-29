import React, { useState } from 'react';
import { api } from '../utils/apiSimulator';
import { Droplet, Thermometer, WifiOff, FileText, CheckCircle, Database, Smartphone } from 'lucide-react';

export default function MobilePWA({ dbState }) {
    const farm = dbState?.farm || {};
    const aiRecommendations = dbState?.aiRecommendations || [];
    const activeUserId = dbState?.activeFarmerId || dbState?.registeredFarmers?.[0]?.id;
    const activeField = dbState?.registeredFarmers?.find(f => f.id === activeUserId)?.fields?.[0] || dbState?.farm || {};
    const [activeSubTab, setActiveSubTab] = useState('telemetry'); // 'telemetry', 'ai', 'offline'
    const [updating, setUpdating] = useState(false);

    const togglePumpPWA = async () => {
        setUpdating(true);
        const nextState = activeField.valveState === "ON" ? "OFF" : "ON";
        await api.updateIrrigationMode("MANUAL", "PWA_MOBILE");
        await api.togglePump(nextState, "PWA_MOBILE");
        setUpdating(false);
    };

    const setPWAMode = async (mode) => {
        setUpdating(true);
        await api.updateIrrigationMode(mode, "PWA_MOBILE");
        setUpdating(false);
    };

    return (
        <div className="phone-mockup-wrapper">
            {/* Modern Smartphone Mockup */}
            <div className="modern-smartphone">
                <div className="phone-camera-notch">
                    <div className="lens"></div>
                    <div className="speaker-slot"></div>
                </div>

                <div className="smartphone-screen">
                    {/* StatusBar */}
                    <div className="phone-status-bar flex justify-between px-4 pt-1 text-[10px] text-white">
                        <span>12:04</span>
                        <div className="flex gap-1 items-center">
                            <span>📶 LTE</span>
                            <span>🔋 94%</span>
                        </div>
                    </div>

                    {/* PWA App Body */}
                    <div className="pwa-app-container flex flex-col justify-between h-full">

                        {/* App Nav Header */}
                        <div className="pwa-app-header px-3 py-2 bg-green-800 text-white flex justify-between items-center">
                            <div className="logo-section flex items-center gap-1">
                                <span className="text-sm font-bold tracking-tight">USFP Mobile</span>
                                <span className="pwa-badge">PWA</span>
                            </div>
                            <div className="offline-synced flex items-center gap-1" title="Offline-ready Service Worker Active">
                                <Database size={10} className="text-green-400" />
                                <span className="text-[9px] text-green-300">Synced</span>
                            </div>
                        </div>

                        {/* Scrollable Viewport */}
                        <div className="pwa-screen-scroller flex-grow">

                            {/* Service worker header alert */}
                            <div className="pwa-offline-notification flex items-center gap-1 bg-teal-50 border-b border-teal-100 px-3 py-1.5">
                                <CheckCircle size={10} className="text-teal-600" />
                                <span className="text-[10px] text-teal-800 font-medium">Offline mode ready (Cache loaded)</span>
                            </div>

                            {activeSubTab === 'telemetry' && (
                                <div className="pwa-tab-view p-3 flex flex-col gap-3">

                                    {/* Metric Cards Carousel */}
                                    <div className="pwa-card bg-white shadow-xl shadow-teal-500/10 p-4 rounded-2xl border border-teal-100 relative overflow-hidden transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border-t-4 border-t-teal-400 group">
                                        <div className="absolute -right-6 -bottom-6 opacity-10 group-hover:scale-150 transition-transform duration-700">
                                            <Droplet size={80} />
                                        </div>
                                        <div className="flex justify-between items-center relative z-10">
                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Soil Moisture</span>
                                            <div className="bg-teal-50 p-2 rounded-full"><Droplet size={14} className="text-teal-600 animate-bounce" /></div>
                                        </div>
                                        <div className="flex justify-between items-baseline mt-4 relative z-10">
                                            <span className="text-4xl font-black text-teal-600 font-sans tracking-tighter">{activeField?.soilMoisture || 40}<span className="text-xl text-teal-400 font-normal">%</span></span>
                                            <span className={`text-[10px] px-2 py-1 rounded-full font-bold tracking-widest uppercase transition-colors duration-300 ${activeField?.soilMoisture < 30 ? 'bg-red-500 text-white animate-pulse' : 'bg-teal-100 text-teal-700'}`}>
                                                {activeField?.soilMoisture < 30 ? 'CRITICAL DRY' : 'ADEQUATE'}
                                            </span>
                                        </div>

                                        {/* Animated Liquid Bar */}
                                        <div className="w-full bg-slate-100 h-2 mt-4 rounded-full overflow-hidden">
                                            <div className="h-full bg-gradient-to-r from-teal-400 to-blue-500 rounded-full transition-all duration-1000 ease-out relative" style={{ width: `${activeField?.soilMoisture || 40}%` }}>
                                                <div className="absolute inset-0 bg-white/20 w-4 rounded-full -skew-x-12 animate-[slide_1s_ease-in-out_infinite_alternate]"></div>
                                            </div>
                                        </div>
                                    </div>

                                    <div className="pwa-card bg-white shadow-xl shadow-orange-500/10 p-4 rounded-2xl border border-orange-100 transition-all duration-500 hover:shadow-2xl hover:scale-[1.02] border-t-4 border-t-orange-400 group mt-2">
                                        <div className="flex justify-between items-center relative z-10">
                                            <span className="text-xs text-gray-400 font-bold uppercase tracking-widest">Root Zone Temp</span>
                                            <div className="bg-orange-50 p-2 rounded-full"><Thermometer size={14} className="text-orange-500" /></div>
                                        </div>
                                        <div className="flex justify-between items-end mt-4">
                                            <span className="text-4xl font-black text-orange-500 tracking-tighter">{activeField?.soilTemp || 0}<span className="text-xl font-normal text-orange-300">°C</span></span>
                                            <span className="text-[10px] text-gray-400 font-mono bg-gray-100 px-2 py-1 rounded">Target: 28°C</span>
                                        </div>
                                    </div>

                                    {/* Controller Switch Board */}
                                    <div className="pwa-card bg-white shadow-xl p-5 rounded-2xl border border-gray-100 mt-2 bg-gradient-to-b from-white to-gray-50/50">
                                        <h4 className="text-[10px] font-bold text-gray-400 uppercase tracking-widest mb-4 flex items-center gap-2">
                                            Sprinkler Matrix <div className="flex-1 h-px bg-gray-200"></div>
                                        </h4>
                                        <div className="flex flex-col gap-4">
                                            <div className="flex justify-between items-center text-xs font-bold text-gray-600">
                                                <span>Current State</span>
                                                <span className={`px-3 py-1 rounded-full text-white font-mono tracking-widest text-[10px] transition-all duration-500 ${activeField?.valveState === "ON" ? "bg-blue-500 shadow-[0_0_10px_rgba(59,130,246,0.6)] font-bold animate-pulse" : "bg-gray-400"}`}>
                                                    {activeField?.valveState || "OFF"}
                                                </span>
                                            </div>

                                            <div className="grid grid-cols-2 gap-3 mt-2">
                                                <button
                                                    disabled={updating || activeField?.irrigationMode === "AUTO"}
                                                    onClick={togglePumpPWA}
                                                    className={`relative overflow-hidden p-3 rounded-xl font-bold text-xs uppercase tracking-widest transition-all duration-300 transform active:scale-95 flex justify-center items-center gap-2 ${activeField?.irrigationMode === "AUTO" ? 'bg-gray-100 text-gray-400 cursor-not-allowed' :
                                                        activeField?.valveState === "ON" ? 'bg-rose-500 text-white shadow-[0_4px_15px_rgba(244,63,94,0.4)]' : 'bg-blue-500 text-white shadow-[0_4px_15px_rgba(59,130,246,0.4)] hover:bg-blue-600'
                                                        }`}
                                                >
                                                    {updating ? <span className="animate-spin inline-block border-2 border-white/40 border-t-white rounded-full w-4 h-4"></span> :
                                                        activeField?.valveState === "ON" ? 'STOP PUMP' : 'START PUMP'}
                                                </button>

                                                <div className="flex rounded-xl overflow-hidden shadow-sm border border-gray-200 text-[10px] font-bold uppercase tracking-widest">
                                                    <button
                                                        onClick={() => setPWAMode("AUTO")}
                                                        className={`flex-1 transition-all duration-300 ${activeField?.irrigationMode === "AUTO" ? 'bg-indigo-600 text-white shadow-inner' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                                    >
                                                        Auto
                                                    </button>
                                                    <button
                                                        onClick={() => setPWAMode("MANUAL")}
                                                        className={`flex-1 transition-all duration-300 ${activeField?.irrigationMode === "MANUAL" ? 'bg-slate-700 text-white shadow-inner' : 'bg-white text-gray-500 hover:bg-gray-50'}`}
                                                    >
                                                        Manual
                                                    </button>
                                                </div>
                                            </div>
                                        </div>
                                    </div>
                                </div>
                            )}

                            {activeSubTab === 'ai' && (
                                <div className="pwa-tab-view p-3 flex flex-col gap-3">
                                    <div className="bg-indigo-600 p-6 rounded-2xl text-white shadow-xl shadow-indigo-600/30 bg-[url('https://www.transparenttextures.com/patterns/cubes.png')] relative overflow-hidden group">
                                        <div className="absolute inset-0 bg-gradient-to-br from-white/10 to-transparent"></div>
                                        <div className="absolute right-0 top-0 w-24 h-24 bg-white/10 rounded-full blur-2xl transform translate-x-1/2 -translate-y-1/2 group-hover:scale-150 transition-transform duration-700"></div>
                                        <h3 className="font-bold mb-1 font-display text-2xl relative z-10 flex items-center gap-2"><Database className="animate-pulse" size={20} /> AI Agent</h3>
                                        <p className="text-[11px] text-indigo-200 font-medium relative z-10">SmartFarm Intelligence Layer</p>
                                    </div>

                                    {aiRecommendations.map((rec, i) => (
                                        <div key={i} className="pwa-card bg-white shadow-lg shadow-gray-200/50 p-4 rounded-xl border border-gray-100 transition-all hover:scale-[1.02] transform duration-300" style={{ animationDelay: `${i * 100}ms` }}>
                                            <div className="flex justify-between items-start mb-2">
                                                <span className={`text-[9px] font-bold uppercase tracking-widest px-2 py-1 rounded-md ${rec.category === 'irrigation' ? 'bg-blue-50 text-blue-600' : 'bg-emerald-50 text-emerald-600'}`}>
                                                    {rec.category}
                                                </span>
                                                <span className="text-[9px] text-gray-400 font-mono bg-gray-50 px-1 py-0.5 rounded">{rec.timestamp}</span>
                                            </div>
                                            <h4 className="text-sm font-bold text-gray-800 leading-tight mb-2 tracking-tight">{rec.title}</h4>
                                            <p className="text-xs text-gray-600 leading-snug">{rec.message}</p>
                                        </div>
                                    ))}
                                </div>
                            )}

                            {activeSubTab === 'offline' && (
                                <div className="pwa-tab-view p-3 flex flex-col gap-3 text-center">
                                    <div className="p-3 bg-teal-50 rounded-full w-12 h-12 flex items-center justify-center mx-auto text-teal-600">
                                        <Database size={24} />
                                    </div>
                                    <h4 className="text-sm font-bold text-gray-700">Offline-First Service Worker</h4>
                                    <p className="text-xs text-gray-600 leading-normal">
                                        This PWA is fully offline-capable. In field zones with poor telemetry or no connection, data can be cached on device via local indexDB storing, and synced back automatically when network returns.
                                    </p>
                                    <div className="offline-parameters bg-white p-2.5 rounded border border-gray-150 text-left text-xs font-mono">
                                        <div>ServiceWorker: ACTIVE</div>
                                        <div>Cache Ver: 1.0.3 (Fresh)</div>
                                        <div>IndexedDB queue size: 0 (Synced)</div>
                                    </div>
                                </div>
                            )}

                        </div>

                        {/* Bottom App Nav Tabs */}
                        <div className="pwa-app-nav flex bg-gray-100 border-t border-gray-200">
                            <button
                                className={`pwa-nav-tab ${activeSubTab === 'telemetry' ? 'active' : ''}`}
                                onClick={() => setActiveSubTab('telemetry')}
                            >
                                Telemetry
                            </button>
                            <button
                                className={`pwa-nav-tab ${activeSubTab === 'ai' ? 'active' : ''}`}
                                onClick={() => setActiveSubTab('ai')}
                            >
                                AI Advice
                            </button>
                            <button
                                className={`pwa-nav-tab ${activeSubTab === 'offline' ? 'active' : ''}`}
                                onClick={() => setActiveSubTab('offline')}
                            >
                                Offline Config
                            </button>
                        </div>

                    </div>
                </div>

                {/* Home Indicating Line */}
                <div className="phone-home-line"></div>
            </div>

            <div className="interface-instruction-card">
                <h4 className="flex items-center gap-1"><Smartphone size={16} /> Mobile-responsive PWA</h4>
                <p>A touch-optimized progressive mobile application designed for farmers with smartphones. Utilizes caching to perform completely offline during connectivity dropouts, synchronizing details later.</p>
            </div>
        </div>
    );
}
