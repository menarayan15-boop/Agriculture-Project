import React, { useState } from 'react';
import { api } from '../utils/apiSimulator';
import { Cloud, Droplets, Map, Activity, ShieldPlus, ShieldAlert, Heart, Wind, Fingerprint, Settings, WifiOff, MapPin, Search } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

export default function FarmerHealthModule({ dbState }) {
    const { farmerHealth, airQuality, weather, disasterAlerts, privacyTokens, networkStatus, hardwareSensors } = dbState;
    const { lang, t, formatNum } = useLang();
    const [sosConfirm, setSosConfirm] = useState(false);
    const [showPrivacy, setShowPrivacy] = useState(false);
    const [showSafetyPlan, setShowSafetyPlan] = useState(false);

    const handleSOS = () => {
        if (!sosConfirm) {
            setSosConfirm(true);
            setTimeout(() => setSosConfirm(false), 5000);
            return;
        }
        setSosConfirm(false);
        api._notifySubscribers(); // Mock real trigger
        window.alert("🆘 SOS ACTIVATED - Emergency contacts notified with current location and health status.");
    };

    return (
        <div className="flex flex-col gap-6 p-4 max-w-5xl mx-auto pb-24 animate-in fade-in">
            {/* Header & Connectivity */}
            <div className="flex justify-between items-center bg-slate-900 border border-slate-700 p-4 rounded-2xl shadow-xl">
                <div>
                    <h1 className="text-3xl font-display font-bold text-white flex items-center gap-3">
                        <Heart className="text-rose-500 fill-rose-500/20" size={32} /> {t("My Health & Safety")}
                    </h1>
                    <p className="text-slate-400 text-sm mt-1">{t("AI-powered Personal Companion for Early Warning")}</p>
                </div>
                <div className="flex flex-col items-end">
                    <span className={`px-4 py-1.5 rounded-full font-bold text-sm border ${networkStatus === '🟢 ONLINE' ? 'bg-emerald-900/40 text-emerald-400 border-emerald-500/30' : 'bg-rose-900/40 text-rose-400 border-rose-500/30'}`}>
                        {networkStatus === '🟢 ONLINE' ? '☁️ Cloud Sync Active' : '📴 OFFLINE AI MODE'}
                    </span>
                    <span className="text-[10px] text-slate-500 mt-1 uppercase font-bold tracking-wider">
                        {networkStatus === '🟢 ONLINE' ? 'Last synchronized: Just now' : 'SMARTFARM CONTINUES LOCALLY'}
                    </span>
                </div>
            </div>

            {/* Disaster / Emergency Alerts (Conditional) */}
            {disasterAlerts && disasterAlerts.length > 0 && (
                <div className="bg-rose-950/40 border border-rose-500/50 p-6 rounded-2xl relative overflow-hidden">
                    <div className="absolute top-0 right-0 p-4">
                        <span className="bg-rose-600 text-white text-xs font-bold px-2 py-1 rounded animate-pulse">! EARLY WARNING</span>
                    </div>
                    <div className="flex items-start gap-4">
                        <ShieldAlert className="text-rose-500 mt-1" size={40} />
                        <div>
                            <h2 className="text-2xl font-bold text-rose-100 flex items-center gap-2 mb-2">
                                🚨 {t("DISASTER CENTER")}
                            </h2>
                            {disasterAlerts.map((alert, i) => (
                                <div key={i} className="mb-4">
                                    <h3 className="text-xl font-bold text-rose-400">{t(alert.type)}</h3>
                                    <p className="text-rose-200/80 mb-2">{t(alert.message)}</p>
                                </div>
                            ))}
                            <button onClick={() => setShowSafetyPlan(!showSafetyPlan)} className="bg-rose-600 hover:bg-rose-500 text-white px-6 py-2 rounded-xl font-bold transition-all shadow-[0_4px_16px_rgba(225,29,72,0.4)]">
                                {t("VIEW SAFETY PLAN")}
                            </button>

                            {showSafetyPlan && (
                                <div className="mt-6 bg-rose-950/60 p-5 rounded-xl border border-rose-500/40 animate-in slide-in-from-top-2">
                                    <h4 className="font-bold text-rose-200 mb-3 flex items-center gap-2">
                                        <ShieldPlus size={18} /> {t("Standard Operating Protocol")}
                                    </h4>
                                    <ul className="text-rose-100/90 text-sm list-disc pl-5 space-y-2">
                                        <li>{t("Evacuate immediately to designated higher grounds.")}</li>
                                        <li>{t("Untether livestock and open main farm gates.")}</li>
                                        <li>{t("Disconnect solar pumps and main electrical grid.")}</li>
                                        <li>{t("Keep emergency communication radio turned on at all times.")}</li>
                                    </ul>
                                </div>
                            )}
                        </div>
                    </div>
                </div>
            )}

            {/* Main Safety Status */}
            <div className={`p-8 rounded-2xl border flex flex-col md:flex-row justify-between items-center gap-8 ${farmerHealth.heatRisk === 'High' ? 'bg-orange-950/40 border-orange-500/40' :
                farmerHealth.heatRisk === 'Very High' ? 'bg-rose-950/40 border-rose-500/40' :
                    'bg-emerald-950/20 border-emerald-500/20'
                }`}>
                <div className="flex-1 flex flex-col justify-center">
                    <span className="text-slate-400 font-bold tracking-widest text-sm mb-2 uppercase">🧑‍🌾 {t("YOUR CURRENT SAFETY")}</span>
                    <h2 className={`text-4xl font-bold mb-4 font-display ${farmerHealth.heatRisk === 'High' ? 'text-orange-400' :
                        farmerHealth.heatRisk === 'Very High' ? 'text-rose-400' : 'text-emerald-400'
                        }`}>
                        {t(farmerHealth.workRecommendation)}
                    </h2>

                    <div className="bg-black/20 p-4 rounded-xl border border-white/5">
                        <h4 className="text-slate-300 font-bold text-sm mb-2 opacity-80 uppercase tracking-widest">{t("Why?")}</h4>
                        <p className="text-slate-200 text-lg leading-relaxed">{t(farmerHealth.explanation)}</p>
                    </div>
                </div>

                <div className="flex-none bg-slate-900 border border-slate-700 p-6 rounded-2xl shadow-xl w-full md:w-80">
                    <h4 className="text-slate-400 font-bold uppercase tracking-widest text-[10px] mb-4 text-center">🧠 {t("SMARTFARM AI DECISION")}</h4>
                    <div className="flex flex-col gap-3 font-mono text-sm">
                        <div className="flex justify-between text-slate-300"><span>🌡️ {t('Temp')}: {formatNum(weather.temp)}°C</span> <span className="text-indigo-400">+</span></div>
                        <div className="flex justify-between text-slate-300"><span>💧 {t('Humd')}: {formatNum(weather.humidity)}%</span> <span className="text-indigo-400">+</span></div>
                        <div className="flex justify-between text-slate-300"><span>❤️ {t('HR')}: {formatNum(farmerHealth.heartRate)} {t('bpm')}</span> <span className="text-indigo-400">+</span></div>
                        <div className="w-full h-px bg-slate-700 my-1"></div>
                        <div className="text-center bg-indigo-900/40 text-indigo-300 py-1.5 rounded-lg border border-indigo-700/50">
                            {t("RISK ASSESSMENT")}
                        </div>
                        <div className="flex justify-center text-xl my-1">↓</div>
                        <div className={`text-center py-2 rounded-lg font-bold border ${farmerHealth.heatRisk === 'High' ? 'bg-orange-500/20 text-orange-400 border-orange-500/40' : 'bg-emerald-500/20 text-emerald-400 border-emerald-500/40'}`}>
                            {farmerHealth.heatRisk === 'High' ? t('🟠 HIGH HEAT RISK') : t('🟢 LOW HEAT RISK')}
                        </div>
                    </div>
                </div>
            </div>

            {/* Biometrics & Air Quality & SOS Box */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">

                {/* Vitals */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-slate-300 font-bold text-sm uppercase tracking-widest mb-4 flex items-center justify-between">
                            {t("Health Indicators")} <Activity size={16} className="text-rose-400" />
                        </h3>
                        <div className="space-y-4">
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">❤️ {t('heart_rate')}</span>
                                <span className="text-white font-bold">{formatNum(farmerHealth.heartRate)} {t('bpm')}</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">🌡️ {t('body_temp')}</span>
                                <span className="text-white font-bold">{formatNum(farmerHealth.bodyTemp)}°C</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">🫁 {t('SpO₂')}</span>
                                <span className="text-white font-bold">{formatNum(farmerHealth.spo2)}%</span>
                            </div>
                            <div className="flex justify-between items-center">
                                <span className="text-slate-400 text-sm">💧 {t('hydration')}</span>
                                <span className="text-white font-bold">{formatNum(Math.round(farmerHealth.hydration))}%</span>
                            </div>
                        </div>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex justify-between">
                        <span>Data: ⌚ Connected Wearable</span>
                        <span>{hardwareSensors.healthWatch} • Just now</span>
                    </div>
                </div>

                {/* Pollution */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl flex flex-col justify-between">
                    <div>
                        <h3 className="text-slate-300 font-bold text-sm uppercase tracking-widest mb-4 flex items-center justify-between">
                            Air Quality <Wind size={16} className="text-blue-400" />
                        </h3>
                        <div className="text-center mb-6">
                            <div className="text-5xl font-display font-light text-white mb-2">{airQuality.aqi}</div>
                            <div className={`inline-block px-3 py-1 rounded-full text-xs font-bold ${airQuality.aqi > 150 ? 'bg-rose-900/40 text-rose-400' :
                                airQuality.aqi > 100 ? 'bg-orange-900/40 text-orange-400' :
                                    'bg-emerald-900/40 text-emerald-400'
                                }`}>
                                {airQuality.status}
                            </div>
                        </div>
                        <p className="text-slate-300 text-sm italic text-center">{airQuality.recommendation}</p>
                    </div>
                    <div className="mt-4 pt-4 border-t border-slate-800 text-[10px] text-slate-500 font-mono flex justify-between">
                        <span>Data: 📡 IMD Pollution API</span>
                        <span>🟢 Updated {airQuality.lastUpdated ? Math.round((Date.now() - airQuality.lastUpdated) / 60000) : 0}m ago</span>
                    </div>
                </div>

                {/* SOS & Privacy Actions */}
                <div className="flex flex-col gap-4">
                    <button
                        onClick={handleSOS}
                        className={`w-full flex-1 rounded-2xl flex flex-col items-center justify-center p-6 transition-all duration-300 border-2 shadow-2xl ${sosConfirm ? 'bg-rose-600 border-rose-500 scale-105' : 'bg-slate-900 border-rose-900/50 hover:bg-rose-950 hover:border-rose-700'}`}
                    >
                        <ShieldAlert size={48} className={sosConfirm ? 'text-white' : 'text-rose-500'} />
                        <span className={`font-display font-bold mt-2 text-2xl ${sosConfirm ? 'text-white' : 'text-rose-500'}`}>
                            {sosConfirm ? 'CONFIRM SOS' : 'SOS'}
                        </span>
                        <span className={`text-xs mt-1 ${sosConfirm ? 'text-rose-200' : 'text-rose-500/70'}`}>
                            {sosConfirm ? 'Tap again to activate' : 'Emergency Assistance'}
                        </span>
                    </button>

                    <div className="flex gap-4">
                        <button className="flex-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-xl p-3 flex flex-col items-center text-slate-300 transition-colors">
                            <MapPin size={24} className="mb-2 text-blue-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Safety Map</span>
                        </button>
                        <button onClick={() => setShowPrivacy(!showPrivacy)} className="flex-1 bg-slate-900 border border-slate-700 hover:bg-slate-800 rounded-xl p-3 flex flex-col items-center text-slate-300 transition-colors">
                            <Fingerprint size={24} className="mb-2 text-indigo-400" />
                            <span className="text-[10px] font-bold uppercase tracking-wider">Privacy</span>
                        </button>
                    </div>
                </div>

            </div>

            {/* Advanced Health Insights Grid */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

                {/* Timeline & Strain */}
                <div className="bg-slate-900 border border-slate-700 rounded-2xl p-6 shadow-xl">
                    <h3 className="text-slate-300 font-bold text-sm uppercase tracking-widest mb-6 flex items-center justify-between">
                        Risk Timeline <Activity size={16} className="text-indigo-400" />
                    </h3>
                    <div className="flex justify-between items-end border-b border-white/10 pb-4 mb-6">
                        {farmerHealth.riskTimeline && farmerHealth.riskTimeline.map((item, index) => {
                            const isNow = index === farmerHealth.riskTimeline.length - 1;
                            const colorClass = item.status === 'Danger' ? 'orange' : item.status === 'Caution' ? 'amber' : 'emerald';

                            return (
                                <div key={index} className="flex flex-col items-center flex-1">
                                    <span className={`text-[10px] text-slate-500 mb-2 ${isNow ? 'font-bold text-slate-300' : ''}`}>
                                        {item.time} {isNow ? '(Now)' : ''}
                                    </span>
                                    <div className={`w-16 ${isNow ? 'h-8 border-2' : 'h-2'} rounded-full mb-1 ${isNow
                                        ? `bg-${colorClass}-500/20 border-${colorClass}-500`
                                        : `bg-${colorClass}-500`
                                        }`}></div>
                                    <span className={`text-xs ${isNow ? 'font-bold text-white' : 'text-slate-300'}`}>
                                        {item.status}
                                    </span>
                                </div>
                            );
                        })}
                    </div>
                    <h3 className="text-slate-300 font-bold text-sm uppercase tracking-widest mb-4">
                        Physical Strain Dashboard
                    </h3>
                    <div className="grid grid-cols-2 gap-4">
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
                            <span className="text-slate-400 text-xs block mb-1">{t('calories', lang)}</span>
                            <span className="text-2xl font-bold text-white transition-all">{farmerHealth.caloriesBurnedStr || "1,420"}</span> <span className="text-xs text-slate-500">kcal</span>
                        </div>
                        <div className="bg-slate-800 p-4 rounded-xl border border-slate-700 relative overflow-hidden">
                            <span className="text-slate-400 text-xs block mb-1">{t('sun_exposure', lang)}</span>
                            <span className="text-2xl font-bold text-orange-400 transition-all">{farmerHealth.sunExposureHoursStr || "4.5"}</span> <span className="text-xs text-slate-500">hrs</span>
                        </div>
                    </div>
                </div>

                {/* Medical & Pesticide */}
                <div className="flex flex-col gap-6">
                    <div className="bg-slate-900 border border-slate-700 hover:border-blue-500 transition-colors rounded-2xl p-6 shadow-xl flex items-center justify-between">
                        <div>
                            <h3 className="text-slate-300 font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2">
                                Nearest Hospital <span className="bg-blue-600 text-white text-[10px] px-2 py-0.5 rounded-full font-bold">Auto-Routed</span>
                            </h3>
                            <p className="text-white font-display text-2xl font-bold">Karnal Govt. PHC</p>
                            <p className="text-slate-400 text-sm">6.2 km away • Approx 14 mins</p>
                        </div>
                        <div className="bg-blue-900/40 p-4 rounded-full">
                            <MapPin size={32} className="text-blue-400" />
                        </div>
                    </div>

                    <div className="bg-[#1a1a0f] border border-yellow-700/50 rounded-2xl p-6 shadow-xl relative overflow-hidden">
                        <div className="absolute top-0 right-0 p-4 opacity-10"><Wind size={80} /></div>
                        <h3 className="text-yellow-500 font-bold text-sm uppercase tracking-widest mb-2 flex items-center gap-2 relative z-10">
                            🧪 CHEMICAL EXPOSURE SAFETY
                        </h3>
                        <p className="text-slate-300 text-sm mb-4 relative z-10">You logged a pesticide spraying session yesterday at 4:30 PM (Mancozeb 75%).</p>
                        <div className="flex justify-between items-center bg-black/40 p-3 rounded-lg border border-yellow-900 relative z-10">
                            <span className="text-yellow-500 font-bold text-sm">Re-entry Interval (REI)</span>
                            <span className="text-white font-mono font-bold">24 Hrs</span>
                        </div>
                    </div>
                </div>

            </div>

            {/* Privacy Center Modal/Area */}
            {showPrivacy && (
                <div className="bg-slate-900 border border-indigo-500/30 p-8 rounded-2xl shadow-2xl animate-in slide-in-from-bottom flex flex-col md:flex-row gap-8">
                    <div className="flex-1">
                        <h2 className="text-2xl font-display font-bold text-white mb-2 flex items-center gap-2">
                            <Fingerprint className="text-indigo-400" /> PRIVACY CENTER
                        </h2>
                        <p className="text-slate-400 text-sm mb-6 leading-relaxed">
                            Your health information is strictly controlled by you.
                            Local on-device processing is used whenever possible.
                            Sensitive information is not automatically shared.
                        </p>
                        <div className="bg-slate-800 p-4 rounded-xl text-center">
                            <p className="text-[10px] uppercase font-bold text-slate-400 tracking-widest mb-1">SIH Demo Note</p>
                            <p className="text-indigo-300 text-sm">SmartFarm provides preventive safety information and is not a replacement for professional medical care.</p>
                        </div>
                    </div>
                    <div className="flex-1 flex flex-col gap-3">
                        <div className="flex justify-between items-center bg-slate-800 px-4 py-3 rounded-lg">
                            <span className="text-slate-200 font-bold text-sm">Health Data Collection</span>
                            <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 h-3 w-3 bg-white rounded-full"></div></div>
                        </div>
                        <div className="flex justify-between items-center bg-slate-800 px-4 py-3 rounded-lg">
                            <span className="text-slate-200 font-bold text-sm">Location Sharing</span>
                            <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 h-3 w-3 bg-white rounded-full"></div></div>
                        </div>
                        <div className="flex justify-between items-center bg-slate-800 px-4 py-3 rounded-lg">
                            <span className="text-slate-200 font-bold text-sm">Emergency Contact Sync</span>
                            <div className="w-10 h-5 bg-emerald-500 rounded-full relative"><div className="absolute right-1 top-1 h-3 w-3 bg-white rounded-full"></div></div>
                        </div>
                        <button className="mt-2 text-rose-400 border border-rose-900 bg-rose-950/20 hover:bg-rose-900/40 rounded-lg py-2 font-bold text-sm">
                            Delete My Health Data
                        </button>
                    </div>
                </div>
            )}
        </div>
    );
}
