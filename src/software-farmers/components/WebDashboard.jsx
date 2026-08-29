import React, { useState } from 'react';
import { api } from '../utils/apiSimulator';
import { Droplet, Thermometer, Sprout, Wind, Map, ShieldAlert, CheckCircle, RefreshCw, Smartphone, Play, Square, Settings, Calendar, Landmark, Info, CloudRain } from 'lucide-react';
import { useLang } from '../i18n/LanguageContext';

export default function WebDashboard({ dbState }) {
    const { lang, t, formatNum } = useLang();
    const { farm, weather, aiRecommendations } = dbState;
    const [updating, setUpdating] = useState(false);

    const activeFarmer = dbState.registeredFarmers?.find(f => f.id === dbState.activeFarmerId) || dbState.farmer;
    const fields = activeFarmer ? (activeFarmer.fields || []) : [];

    const handleModeChange = async (mode) => {
        setUpdating(true);
        await api.updateIrrigationMode(mode, "WEB_DASHBOARD");
        setUpdating(false);
    };

    const handlePumpToggle = async (state) => {
        setUpdating(true);
        await api.togglePump(state, "WEB_DASHBOARD");
        setUpdating(false);
    };

    const handleCropChange = async (e) => {
        setUpdating(true);
        await api.updateCropConfiguration(e.target.value, "WEB_DASHBOARD");
        setUpdating(false);
    };

    // Helper selectors for visual indicator panels
    const getMoistureStatus = (val) => {
        if (val < 25) return { text: t("CRITICALLY DRY"), color: "text-red-500 bg-red-950/30 border border-red-500/30 font-bold" };
        if (val < 32) return { text: t("DRY"), color: "text-orange-500 bg-orange-950/20 border border-orange-500/20" };
        if (val > 65) return { text: t("WET"), color: "text-blue-400 bg-blue-950/30 border border-blue-500/20" };
        return { text: t("NORMAL"), color: "text-emerald-400 bg-emerald-950/30 border border-emerald-500/20" };
    };

    const getIrrigationStatus = (valveState, moisture) => {
        if (valveState === "ON") return { text: t("ACTIVE"), color: "text-teal-400 bg-teal-950/30 border border-teal-500/40 animate-pulse font-bold" };
        if (moisture < 30) return { text: t("REQUIRED"), color: "text-red-400 bg-red-950/30 border border-red-500/30 font-bold" };
        return { text: t("NOT REQUIRED"), color: "text-slate-400 bg-slate-800/80 border border-slate-700" };
    };

    const getCropHealthStatus = (health) => {
        if (health?.includes("ATTENTION") || health?.includes("NEEDS")) {
            return { text: t(health), color: "text-yellow-400 bg-yellow-950/20 border border-yellow-500/20 font-bold" };
        }
        return { text: t(health || "GOOD"), color: "text-green-400 bg-emerald-950/20 border border-emerald-500/20" };
    };

    // SVG Chart points
    const moistureHistory = [48, 45, 42, 40, 38, 36, 35, farm.soilMoisture];
    const chartHeight = 80;
    const chartWidth = 320;
    const paddingRight = 10;
    const points = moistureHistory.map((val, idx) => {
        const x = (idx / (moistureHistory.length - 1)) * (chartWidth - paddingRight);
        const y = chartHeight - (val / 100) * chartHeight;
        return `${x},${y}`;
    }).join(' ');

    return (
        <div className="web-dashboard-view">
            {/* 1. Farm Overview Header Node (Mobile responsive layout banner) */}
            <div className="farm-overview-hud card-glass flex justify-between items-center mb-6 flex-wrap gap-4 p-4 border border-emerald-500/20 bg-emerald-950/5">
                <div className="flex items-center gap-3">
                    <div className="bg-emerald-900/30 p-2.5 rounded-lg border border-emerald-500/20">
                        <span className="text-xl">🏛️</span>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold text-emerald-400 uppercase tracking-wide">{t('loc_ctx')}</h4>
                        <h2 className="text-md font-bold text-white mt-0.5">
                            {activeFarmer.name} — {t(activeFarmer.village)}, {t(activeFarmer.state)}
                        </h2>
                        <p className="text-[11px] text-slate-400 flex flex-wrap items-center gap-x-2 gap-y-1 mt-1 font-mono">
                            <span>ID: {formatNum(activeFarmer.id)}</span>
                            <span>•</span>
                            <span>{t('Water:')} {t(activeFarmer.waterSource)}</span>
                            <span>•</span>
                            <span>{t('Soil:')} {t(activeFarmer.soilType)}</span>
                            <span>•</span>
                            <span>{t('Farm Location:')} {t(activeFarmer.farmLocation || activeFarmer.location)}</span>
                            <span>•</span>
                            <span>{t('Farm Size:')} {formatNum(activeFarmer.farmSize || (activeFarmer.fields ? activeFarmer.fields.reduce((acc, f) => acc + parseFloat(f.size || 0), 0) : 0))} {t('acres')}</span>
                            <span>•</span>
                            <span className="text-yellow-400">{t('Crops:')} {t(activeFarmer.cropsCultivated)}</span>
                        </p>
                    </div>
                </div>

                {/* Global Loading Spinner / Status Indicator */}
                <div className="flex items-center gap-3">
                    {updating && (
                        <div className="flex items-center gap-1.5 text-xs text-slate-400 bg-slate-900/60 px-2 py-1 rounded border border-slate-700">
                            <RefreshCw size={12} className="animate-spin text-emerald-400" />
                            <span>{t("Updating Sync Box...")}</span>
                        </div>
                    )}

                    <div className="text-xs bg-slate-800 border border-slate-700 px-3 py-1.5 rounded-lg text-slate-300 font-mono flex items-center gap-2">
                        <span className="h-2 w-2 rounded-full bg-emerald-500 animate-ping"></span>
                        <span>Channel: LoRa Gateway 433 MHz</span>
                    </div>
                </div>
            </div>

            {/* 2. Visual Indicators Grid (Responsive: 1-col mobile, 2-col tablet, 4-col desktop) */}
            <h3 className="section-title text-sm uppercase text-slate-400 tracking-wider mb-3">{t('vis_ind')}</h3>
            <div className="grid-responsive-hud mb-6">

                {/* Soil Moisture Card */}
                <div className="card-glass border border-slate-700/60 p-4 flex flex-col justify-between min-h-[145px] hover:border-teal-500/20 transition-all">
                    <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">{t('soil_moisture')}</span>
                        <Droplet size={18} className="text-teal-400 animate-pulse" />
                    </div>
                    <div>
                        <div className="text-3xl font-extrabold font-mono text-teal-400 mt-2">
                            {formatNum(farm.soilMoisture)}%
                        </div>
                        <div className="progress-bar-bg mt-2">
                            <div className="progress-bar-fill bg-teal" style={{ width: `${farm.soilMoisture}%` }}></div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${getMoistureStatus(farm.soilMoisture).color}`}>
                            {getMoistureStatus(farm.soilMoisture).text}
                        </span>
                    </div>
                </div>

                {/* Weather Indicator Card */}
                <div className="card-glass border border-slate-700/60 p-4 flex flex-col justify-between min-h-[145px] hover:border-blue-500/20 transition-all">
                    <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">{t('weather')}</span>
                        <CloudRain size={18} className="text-blue-400" />
                    </div>
                    <div className="mt-2">
                        <div className="text-3xl font-extrabold text-white font-mono">
                            {formatNum(weather.temp)}°C
                        </div>
                        <div className="text-[10px] text-gray-400 mt-1 font-mono">
                            {t("Humid:")} {formatNum(weather.humidity)}%
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="px-2 py-0.5 rounded text-[10px] font-mono bg-blue-950/20 border border-blue-500/20 text-blue-300">
                            {t("Rain probability")} {formatNum(weather.rainProbability)}%
                        </span>
                    </div>
                </div>

                {/* Irrigation Output Status */}
                <div className="card-glass border border-slate-700/60 p-4 flex flex-col justify-between min-h-[145px] hover:border-blue-500/20 transition-all">
                    <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">{t("Water Control")}</span>
                        <Map size={18} className={farm.valveState === 'ON' ? 'text-teal-400 animate-spin' : 'text-slate-500'} />
                    </div>
                    <div className="mt-2">
                        <div className="text-3xl font-extrabold text-white font-mono uppercase tracking-tight">
                            {farm.valveState === 'ON' ? t("ACTIVE") : t("OFF")}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-1">
                            {t("Valve:")} {t(farm.valveState)} | {t("Mode:")} {t(farm.irrigationMode)}
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${getIrrigationStatus(farm.valveState, farm.soilMoisture).color}`}>
                            {getIrrigationStatus(farm.valveState, farm.soilMoisture).text}
                        </span>
                    </div>
                </div>

                {/* Crop Health Card */}
                <div className="card-glass border border-slate-700/60 p-4 flex flex-col justify-between min-h-[145px] hover:border-emerald-500/20 transition-all">
                    <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">{t('nav_crophealth')}</span>
                        <Sprout size={18} className="text-emerald-400" />
                    </div>
                    <div className="mt-2">
                        <div className="text-3xl font-extrabold text-white font-mono">
                            {getCropHealthStatus(farm.cropHealth).text === 'GOOD' ? t('GOOD') : getCropHealthStatus(farm.cropHealth).text}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-1">
                            {t("Status check OK")}
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${getCropHealthStatus(farm.cropHealth).color}`}>
                            {getCropHealthStatus(farm.cropHealth).text}
                        </span>
                    </div>
                </div>

                {/* Current Crop Card */}
                <div className="card-glass border border-slate-700/60 p-4 flex flex-col justify-between min-h-[145px] hover:border-emerald-500/20 transition-all">
                    <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">{t('cur_crop')}</span>
                        <Landmark size={18} className="text-emerald-400" />
                    </div>
                    <div className="mt-2">
                        <div className="text-lg font-bold text-white truncate">
                            {t(farm.cropName)}
                        </div>
                        <div className="text-[10px] text-gray-400 font-mono mt-1 truncate">
                            {t("Stage:")} {t(farm.cropStage)}
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-emerald-950/20 border border-emerald-500/20 text-emerald-300">
                            {t("CULTIVATING")}
                        </span>
                    </div>
                </div>

                {/* Soil Temperature Card */}
                <div className="card-glass border border-slate-700/60 p-4 flex flex-col justify-between min-h-[145px] hover:border-orange-500/20 transition-all">
                    <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">{t('soil_t')}</span>
                        <Thermometer size={18} className="text-orange-400" />
                    </div>
                    <div className="mt-2">
                        <div className="text-3xl font-extrabold text-white font-mono">
                            {formatNum(farm.soilTemp)}°C
                        </div>
                        <div className="text-[11px] text-gray-400 mt-1 font-mono">
                            {t("Target Range:")} {formatNum(25)}-{formatNum(30)}°C
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className="px-2 py-0.5 rounded text-[10px] uppercase font-mono bg-orange-950/20 border border-orange-500/25 text-orange-400">
                            {t("OPTIMAL STATUS")}
                        </span>
                    </div>
                </div>

                {/* Weather Forecast Card */}
                <div className="card-glass border border-slate-700/60 p-4 flex flex-col justify-between min-h-[145px] hover:border-slate-500/20 transition-all">
                    <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">{t('forecast')}</span>
                        <Info size={16} className="text-slate-400" />
                    </div>
                    <div className="mt-2">
                        <p className="text-[11px] text-teal-300 font-sans italic leading-tight">
                            "{t(weather.forecastToday)}"
                        </p>
                    </div>
                    <div className="mt-3 text-[10px] text-slate-400 truncate">
                        {t("Next:")} {t(weather.forecastTomorrow)}
                    </div>
                </div>

                {/* Water Availability Card */}
                <div className="card-glass border border-slate-700/60 p-4 flex flex-col justify-between min-h-[145px] hover:border-blue-500/20 transition-all">
                    <div className="flex justify-between items-center">
                        <span className="text-xs uppercase font-extrabold text-slate-400 tracking-wider">{t('water_av')}</span>
                        <Droplet size={18} className="text-blue-400" />
                    </div>
                    <div>
                        <div className="text-3xl font-extrabold font-mono text-blue-400 mt-2">
                            {formatNum(farm.waterReservoirLevel)}%
                        </div>
                        <div className="progress-bar-bg mt-2">
                            <div className="progress-bar-fill bg-blue" style={{ width: `${farm.waterReservoirLevel}%` }}></div>
                        </div>
                    </div>
                    <div className="mt-3">
                        <span className={`px-2 py-0.5 rounded text-[10px] uppercase font-mono ${farm.waterReservoirLevel > 50 ? 'bg-blue-950/20 border border-blue-500/25 text-blue-300' : 'bg-red-950/20 border border-red-500/25 text-red-300'}`}>
                            {farm.waterReservoirLevel > 50 ? t('STABLE SUPPLY') : t('LOW SUPPLY')}
                        </span>
                    </div>
                </div>

            </div>

            {/* 3. Deep-Dive Controls & Layout charts */}
            <div className="web-dashboard-body-grid">

                {/* Left Control Column */}
                <div className="dashboard-column flex flex-col gap-4">

                    {/* Actuator control panel */}
                    <div className="dashboard-control-card card-glass p-5">
                        <h4 className="card-title text-sm uppercase text-slate-300 font-extrabold border-b border-gray-700 pb-2 mb-4 flex items-center justify-between">
                            <span>{t('sol_ctrl')}</span>
                            <Settings size={14} className="text-gray-400" />
                        </h4>

                        {/* Field selector */}
                        <div className="control-row mb-4">
                            <div>
                                <label className="row-label text-xs uppercase font-extrabold text-slate-400 select-none block">{t('str_selected_crop')}</label>
                                <span className="text-[10px] text-gray-400">{t('str_farmer_context')}</span>
                            </div>
                            <select
                                value={dbState.activeFieldId}
                                onChange={async (e) => {
                                    setUpdating(true);
                                    await api.selectActiveField(e.target.value);
                                    setUpdating(false);
                                }}
                                className="crop-selector-dropdown font-mono h-9"
                            >
                                {fields.map(f => (
                                    <option key={f.id} value={f.id}>{t(f.name)} ({formatNum(f.size)} — {t(f.crop)})</option>
                                ))}
                            </select>
                        </div>

                        {/* Flow Switch */}
                        <div className="control-row mb-4">
                            <label className="row-label text-xs uppercase font-extrabold text-slate-400 select-none block">{t('str_irrigation_logic')}</label>
                            <div className="segmented-control flex">
                                <button
                                    onClick={() => handleModeChange('AUTO')}
                                    className={`segment-btn ${farm.irrigationMode === 'AUTO' ? 'active' : ''}`}
                                >
                                    {t('str_ai_auto')}
                                </button>
                                <button
                                    onClick={() => handleModeChange('MANUAL')}
                                    className={`segment-btn ${farm.irrigationMode === 'MANUAL' ? 'active' : ''}`}
                                >
                                    {t('str_man_over')}
                                </button>
                            </div>
                        </div>

                        {/* Manual Override switch */}
                        <div className="control-row mb-4">
                            <label className="row-label text-xs uppercase font-extrabold text-slate-400 select-none block">{t('str_man_sol')}</label>
                            <div className="pump-toggles">
                                <button
                                    className={`pump-action-btn run ${farm.valveState === 'ON' ? 'active' : ''}`}
                                    onClick={() => handlePumpToggle('ON')}
                                >
                                    <Play size={12} fill="currentColor" /> {t('str_open_valve')}
                                </button>
                                <button
                                    className={`pump-action-btn stop ${farm.valveState === 'OFF' ? 'active' : ''}`}
                                    onClick={() => handlePumpToggle('OFF')}
                                >
                                    <Square size={12} fill="currentColor" /> {t('str_close_valve')}
                                </button>
                            </div>
                        </div>

                        {/* Change Crop Option */}
                        <div className="control-row">
                            <label className="row-label text-xs uppercase font-extrabold text-slate-400 select-none block font-sans">{t('str_crop_profile')}</label>
                            <select
                                value={farm.cropName}
                                onChange={handleCropChange}
                                className="crop-selector-dropdown font-mono h-9"
                            >
                                <option value="Basmati Rice">{t("Basmati Rice (High Water demand)")}</option>
                                <option value="Wheat">{t("Wheat (CRI routine)")}</option>
                                <option value="Tomato">{t("Tomato (Drip moisture target)")}</option>
                                <option value="Groundnut">{t("Groundnut (Sandy root zone)")}</option>
                            </select>
                        </div>

                    </div>

                    {/* AI Agronomist recommendations */}
                    <div className="ai-agronomist-card card-glass p-4 border border-emerald-900/40">
                        <h4 className="card-title text-emerald-400 text-xs font-extrabold uppercase tracking-wide flex items-center gap-2 mb-3">
                            <span>{t('ai_rec')}</span>
                        </h4>
                        <div className="recommendations-container">
                            {aiRecommendations.map((rec) => (
                                <div key={rec.id} className="rec-alert-item flex gap-3 p-2 bg-slate-900/50 rounded-lg">
                                    <div className={`alert-indicator ${rec.category === 'irrigation' ? 'irrigate' : 'fertilize'}`}></div>
                                    <div className="alert-content">
                                        <div className="flex justify-between items-center">
                                            <span className="rec-title font-bold text-xs text-slate-300">{t(rec.title)}</span>
                                            <span className="rec-time text-[9px] text-gray-500">{t(rec.timestamp)}</span>
                                        </div>
                                        <p className="rec-text text-[11px] text-slate-400 mt-1 leading-normal">{t(rec.message)}</p>
                                        {rec.actionNeeded && rec.actionStatus === 'POSTPONED' && (
                                            <span className="badge-applied mt-2 inline-flex items-center text-[10px] text-emerald-400 bg-emerald-950/20 px-2 py-0.5 rounded border border-emerald-500/20">
                                                <CheckCircle size={10} className="mr-1" /> {t("Action Applied: Postponed Irrigation")}
                                            </span>
                                        )}
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                    {/* AI Crop Suitability Recommendation Advisor */}
                    <div className="ai-crop-suitability-card card-glass p-5 border border-teal-500/20">
                        <h4 className="card-title text-teal-400 text-sm font-extrabold uppercase tracking-wide flex items-center gap-2 mb-3">
                            <span>{t('ai_pre')}</span>
                        </h4>
                        <p className="text-[11px] text-gray-400 mb-4 leading-normal">
                            {t("Multi-parameter suitability score generated based on soil structure, ambient temps, rainfall probability, legume rotation cycles, water availability, and farm acreage:")}
                        </p>
                        <div className="recommendations-container flex flex-col gap-3">
                            {api.getCropRecommendations(dbState.activeFarmerId).map((crop) => (
                                <div key={crop.name} className="rec-alert-item bg-slate-900/60 p-3 rounded-lg border border-slate-800">
                                    <div className="flex justify-between items-center mb-1">
                                        <span className="font-bold text-white text-sm">{t(crop.name)}</span>
                                        <span className="px-2 py-0.5 rounded text-xs font-mono font-bold bg-teal-950 text-teal-400 border border-teal-800">
                                            {formatNum(crop.score)}% {t("suitability")}
                                        </span>
                                    </div>
                                    <p className="text-[11px] text-slate-300 leading-tight mb-2">
                                        {t(crop.description)}
                                    </p>
                                    <div className="grid grid-cols-2 gap-x-3 gap-y-1 border-t border-slate-800 pt-2 text-[10px] font-mono text-gray-400">
                                        <div>🌱 {t("Soil Match:")} <span className={crop.soilSuitability === 'High' ? 'text-green' : 'text-orange'}>{t(crop.soilSuitability)}</span></div>
                                        <div>🌤️ {t("Weather:")} <span className={crop.weatherSuitability === 'High' ? 'text-green' : 'text-orange'}>{t(crop.weatherSuitability)}</span></div>
                                        <div>💧 {t("Water Need:")} <span className="text-blue-300">{t(crop.waterRequirement)}</span></div>
                                        <div>📅 {t("Season Match:")} <span className="text-green">{t("Suitable")}</span></div>
                                        <div className="col-span-2 mt-1 border-t border-slate-800 pt-1 text-teal-300 flex items-center gap-1.5 flex-wrap">
                                            <span>🔄 {t("Crop Rotation:")}</span>
                                            <span className="font-bold">{t(crop.rotationMatch)}</span>
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>

                </div>

                {/* Right Graphs & Maps Column */}
                <div className="dashboard-column flex flex-col gap-4">

                    {/* Trend Chart */}
                    <div className="trend-card card-glass p-5">
                        <h4 className="card-title text-sm uppercase text-slate-300 font-extrabold border-b border-gray-700 pb-2 mb-4">
                            {t('chart_t')}
                        </h4>
                        <div className="line-chart-container py-2 flex justify-center">
                            <svg className="mock-spark-line" height={chartHeight} width={chartWidth}>
                                <line x1="0" y1="20" x2={chartWidth} y2="20" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                <line x1="0" y1="40" x2={chartWidth} y2="40" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />
                                <line x1="0" y1="60" x2={chartWidth} y2="60" stroke="rgba(255,255,255,0.05)" strokeWidth="1" />

                                <line x1="0" y1={chartHeight - (30 / 100) * chartHeight} x2={chartWidth} y2={chartHeight - (30 / 100) * chartHeight} stroke="#ef4444" strokeDasharray="3,3" strokeWidth="1" />
                                <text x="5" y={chartHeight - (30 / 100) * chartHeight - 4} fill="#ef4444" fontSize="8" fontFamily="monospace">{t("Auto Valve Trigger (30%)")}</text>

                                <polyline fill="none" stroke="#14b8a6" strokeWidth="2" points={points} />

                                {moistureHistory.map((val, idx) => {
                                    const x = (idx / (moistureHistory.length - 1)) * (chartWidth - paddingRight);
                                    const y = chartHeight - (val / 100) * chartHeight;
                                    return (
                                        <circle
                                            key={idx}
                                            cx={x}
                                            cy={y}
                                            r={idx === moistureHistory.length - 1 ? 4 : 2}
                                            fill={idx === moistureHistory.length - 1 ? '#14b8a6' : '#2dd4bf'}
                                        />
                                    );
                                })}
                            </svg>
                        </div>
                        <div className="chart-legend flex justify-between text-[9px] font-mono text-gray-500 px-4 mt-2">
                            <span>{t("12h ago")}</span>
                            <span>{t("8h ago")}</span>
                            <span>{t("4h ago")}</span>
                            <span className="text-teal font-bold">{t("Now")} ({formatNum(farm.soilMoisture)}%)</span>
                        </div>
                    </div>

                    {/* Map display */}
                    <div className="field-map-card card-glass p-5">
                        <h4 className="card-title text-sm uppercase text-slate-300 font-extrabold border-b border-gray-700 pb-2 mb-4 flex justify-between items-center">
                            <span>{t('map_t')}</span>
                            <span className={`live-tag font-mono text-[9px] ${farm.valveState === 'ON' ? 'running' : 'idle'}`}>
                                {farm.valveState === 'ON' ? t('● SOLENOIDS SPRAYING') : t('● SOLENOIDS CLOSED')}
                            </span>
                        </h4>

                        <div className="farm-layout-grid-mesh">
                            <div className="field-block">
                                <span className="block-name text-[9px] uppercase tracking-wide">{t("Sector A (Acre-0.5)")}</span>
                                <div className={`nozzle-ring ${farm.valveState === 'ON' ? 'spraying' : ''}`}>
                                    <div className="sprinkler-core font-mono"></div>
                                    {farm.valveState === 'ON' && <div className="spray-particles"></div>}
                                </div>
                            </div>
                            <div className="field-block">
                                <span className="block-name text-[9px] uppercase tracking-wide">{t("Sector B (Acre-0.5)")}</span>
                                <div className={`nozzle-ring ${farm.valveState === 'ON' ? 'spraying' : ''}`}>
                                    <div className="sprinkler-core"></div>
                                    {farm.valveState === 'ON' && <div className="spray-particles"></div>}
                                </div>
                            </div>
                            <div className="field-block">
                                <span className="block-name text-[9px] uppercase tracking-wide">{t("Sector C (Acre-0.5)")}</span>
                                <div className={`nozzle-ring ${farm.valveState === 'ON' ? 'spraying' : ''}`}>
                                    <div className="sprinkler-core"></div>
                                    {farm.valveState === 'ON' && <div className="spray-particles"></div>}
                                </div>
                            </div>
                            <div className="field-block">
                                <span className="block-name text-[9px] uppercase tracking-wide">{t("Sector D (Buffer Area)")}</span>
                                <div className="nozzle-ring">
                                    <div className="sprinkler-core disabled"></div>
                                </div>
                            </div>
                        </div>

                        {/* Water Reservoir and Battery details */}
                        <div className="flex gap-4 mt-4 text-xs font-mono justify-between text-slate-400 bg-slate-900/40 p-2.5 rounded-lg border border-slate-700/40">
                            <div className="flex items-center gap-1">
                                <Calendar size={12} className="text-emerald-400" />
                                <span>{t('str_reservoir')}: {formatNum(farm.waterReservoirLevel)}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Thermometer size={12} className="text-orange-400" />
                                <span>{t('str_battery')}: {formatNum(farm.batteryLevel)}%</span>
                            </div>
                            <div className="flex items-center gap-1">
                                <Info size={12} className="text-blue-400" />
                                <span>{t('str_signal')}: {formatNum(farm.signalStrength)}/5 {t("bars")}</span>
                            </div>
                        </div>

                    </div>

                </div>

            </div>
        </div>
    );
}
