import React, { useState } from 'react';
import GamifiedOnboarding from './GamifiedOnboarding';
import DigitalFarmScene from './DigitalFarmScene';
import FarmerDashboard from './FarmerDashboard';
import FarmerIrrigation from './FarmerIrrigation';
import FarmerCropHealth from './FarmerCropHealth';
import FarmerHelp from './FarmerHelp';
import LanguageSelector from '../LanguageSelector';
import { useLang } from '../../i18n/LanguageContext';
import { t, LANGUAGES } from '../../i18n/translations';
import { Home, Sprout, Droplets, HeartPulse, HelpCircle, Volume2, CloudRain } from 'lucide-react';

export default function FarmerApp({ dbState }) {
    const { lang, setLang } = useLang();
    const [hasCompletedSetup, setHasCompletedSetup] = useState(localStorage.getItem('farmer_setup') === 'true');
    const [activeTab, setActiveTab] = useState('home');
    const [activeObject, setActiveObject] = useState(null);

    // Show language picker if no language chosen yet (first time)
    const [langChosen, setLangChosen] = useState(!!localStorage.getItem('sf_lang'));

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            if (!/[\u0900-\u097F]/.test(text)) {
                const jarvisVoice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('George') || v.name.includes('Daniel') || v.name.includes('UK English Male'));
                if (jarvisVoice) {
                    utterance.voice = jarvisVoice;
                    utterance.lang = 'en-GB';
                    utterance.pitch = 0.8;
                    utterance.rate = 1.0;
                }
            } else {
                const hiVoice = voices.find(v => v.lang.includes('IN') || v.lang.startsWith('hi'));
                if (hiVoice) utterance.voice = hiVoice;
                utterance.lang = 'hi-IN';
            }
            window.speechSynthesis.speak(utterance);
        }
    };

    if (!langChosen) {
        return (
            <div className="min-h-screen bg-gradient-to-b from-[#113420] to-[#04140b] flex flex-col items-center justify-center p-6 text-center">
                <h1 className="text-6xl mb-4 text-white">🌱</h1>
                <h2 className="text-3xl font-bold text-white mb-2">SmartFarm</h2>
                <p className="text-emerald-400 mb-8 font-medium">Choose your language / अपनी भाषा चुनें</p>
                <div className="flex flex-col w-full max-w-sm gap-3 max-h-[60vh] overflow-y-auto pb-8">
                    {LANGUAGES.map((l) => (
                        <button
                            key={l.code}
                            className="btn-smart bg-white/10 backdrop-blur-md border-2 border-white/20 text-white text-xl font-bold py-5 rounded-[24px] shadow-xl hover:bg-white/20 hover:border-white/40 flex items-center justify-center gap-3"
                            onClick={() => {
                                setLang(l.code);
                                setLangChosen(true);
                            }}
                        >
                            <span>{l.flag}</span>
                            <span>{l.native}</span>
                            <span className="text-white/50 text-sm font-normal">{l.name}</span>
                        </button>
                    ))}
                </div>
            </div>
        );
    }

    if (!hasCompletedSetup) {
        return <GamifiedOnboarding onFinish={() => {
            setHasCompletedSetup(true);
            localStorage.setItem('farmer_setup', 'true');
        }} />;
    }

    // Weather state integration
    const weatherCond = dbState?.weather?.rainProbability > 50 ? 'rainy' : 'sunny';

    const farmObjects = [
        { id: 'weather', emoji: '🌦️', x: '15%', y: '15%', title: 'Weather', desc: `${dbState?.weather?.forecastToday || 'Sunny'} - Rain: ${dbState?.weather?.rainProbability || 0}%`, status: '🟢 Good' },
        { id: 'crop', emoji: '🍅', x: '35%', y: '65%', title: 'Tomato Crop', desc: dbState?.farm?.cropHealth || 'Healthy', status: '🟢 Healthy' },
        { id: 'water', emoji: '💧', x: '80%', y: '60%', title: 'Water Tank', desc: `${dbState?.farm?.waterReservoirLevel || 100}% full`, status: '🟢 Available' },
        { id: 'soil', emoji: '🌍', x: '65%', y: '75%', title: 'Soil', desc: `Moisture: ${dbState?.farm?.soilMoisture || 40}%`, status: '🟢 Good' },
        { id: 'sensor', emoji: '📡', x: '20%', y: '85%', title: 'IoT Sensors', desc: 'Active & Connected', status: '🟢 Online' },
        { id: 'sprinkler', emoji: '🚿', x: '50%', y: '50%', title: 'Irrigation', desc: dbState?.farm?.irrigationMode || 'AUTO', status: '⚪ Off' }
    ];

    return (
        <div className="min-h-screen bg-black flex flex-col font-sans text-slate-800 relative">

            {/* The Living Farm Scene */}
            <DigitalFarmScene
                weather={weatherCond}
                objects={activeTab === 'home' ? farmObjects : []}
                onObjectClick={obj => setActiveObject(obj)}
            />

            {/* SmartFarm Glass Header */}
            <div className="absolute top-4 left-4 right-4 z-20 flex justify-between items-start pointer-events-none">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-xl flex items-center gap-3 pointer-events-auto">
                    <span className="text-2xl drop-shadow-md">🌱</span>
                    <div>
                        <h1 className="text-white font-bold text-lg leading-tight">SmartFarm</h1>
                        <p className="text-emerald-300 text-[10px] font-semibold uppercase tracking-widest">{t('nav_farm', lang)}</p>
                    </div>
                </div>

                <div className="flex flex-col items-end gap-2 pointer-events-auto">
                    <div className="flex items-center gap-2">
                        <LanguageSelector compact />
                        <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 px-3 rounded-xl shadow-xl text-white text-xs font-medium flex items-center gap-3">
                            <span className="flex items-center gap-1">🌦️ {dbState?.weather?.temp || 29}°C</span>
                            <span className="flex items-center gap-1">💧 {dbState?.farm?.soilMoisture || 40}%</span>
                            {!navigator.onLine && <span className="text-orange-400 font-bold bg-orange-900/40 px-2 rounded-full">{t('status_offline', lang)}</span>}
                        </div>
                    </div>

                    <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 px-3 rounded-xl shadow-xl flex flex-col gap-1 w-32">
                        <div className="flex justify-between text-white text-[10px] font-bold uppercase">
                            <span>Level 1</span>
                            <span className="text-emerald-300">100/100 XP</span>
                        </div>
                        <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                            <div className="bg-emerald-400 h-1.5 rounded-full w-full"></div>
                        </div>
                    </div>
                </div>
            </div>

            {/* Main Content Area / Floating Panels (replaces old solid tab panel) */}
            <main className="absolute inset-0 z-10 pt-24 pb-28 px-4 overflow-y-auto custom-scrollbar pointer-events-none">
                <div className="pointer-events-auto max-w-lg mx-auto h-full flex flex-col justify-end">

                    {activeTab === 'home' && (
                        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-[32px] shadow-2xl mb-4 pointer-events-auto">
                            <FarmerDashboard dbState={dbState} setActiveTab={setActiveTab} />
                        </div>
                    )}

                    {activeTab === 'crop' && (
                        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl mb-4">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2 border-b pb-2">🌱 My Crop</h2>
                            <FarmerCropHealth dbState={dbState} isEmbedded />
                        </div>
                    )}

                    {activeTab === 'water' && (
                        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl mb-4">
                            <h2 className="text-2xl font-bold text-slate-800 mb-2 border-b pb-2">💧 Smart Water</h2>
                            <FarmerIrrigation dbState={dbState} isEmbedded />
                        </div>
                    )}

                    {activeTab === 'help' && (
                        <div className="bg-white/95 backdrop-blur-xl p-6 rounded-3xl shadow-2xl mb-4">
                            <FarmerHelp isEmbedded />
                        </div>
                    )}
                </div>
            </main>

            {/* Interactive Object Floating Card */}
            {activeObject && (
                <div className="absolute inset-0 z-30 bg-black/40 backdrop-blur-sm flex items-center justify-center p-6 animate-in fade-in" onClick={() => setActiveObject(null)}>
                    <div className="bg-white/90 backdrop-blur-xl rounded-3xl p-6 w-full max-w-sm shadow-2xl animate-in zoom-in-95 border border-white/40" onClick={e => e.stopPropagation()}>
                        <div className="text-[60px] mb-2">{activeObject.emoji}</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-1">{activeObject.title}</h2>
                        <div className="font-bold text-emerald-600 mb-4">{activeObject.status}</div>
                        <p className="text-slate-600 text-lg mb-6">{activeObject.desc}</p>
                        <button onClick={() => setActiveObject(null)} className="w-full bg-slate-800 hover:bg-slate-700 active:scale-[0.98] transition-all duration-300 text-white font-bold py-[18px] rounded-[20px] shadow-lg font-display text-lg">Close</button>
                    </div>
                </div>
            )}

            {/* Floating Glass Navigation */}
            <nav className="absolute bottom-6 left-1/2 -translate-x-1/2 w-[90%] max-w-md bg-white/10 backdrop-blur-md border border-white/20 p-2 rounded-3xl shadow-[0_8px_32px_rgba(0,0,0,0.5)] z-20 flex justify-between px-4">
                <NavBtn id="home" icon={Home} label={t('nav_farm', lang)} active={activeTab} set={setActiveTab} />
                <NavBtn id="crop" icon={Sprout} label={t('nav_weather', lang).slice(0, 4)} active={activeTab} set={setActiveTab} />
                <NavBtn id="water" icon={Droplets} label={t('soil_moisture', lang).split(' ')[0]} active={activeTab} set={setActiveTab} />
                <NavBtn id="help" icon={HelpCircle} label={t('nav_help', lang)} active={activeTab} set={setActiveTab} />
            </nav>
        </div>
    );
}

function NavBtn({ id, icon: Icon, label, active, set }) {
    const isActive = active === id;
    return (
        <button
            onClick={() => set(id)}
            className={`flex flex-col items-center justify-center py-2.5 px-4 rounded-[20px] transition-all duration-300 active:scale-[0.85] ${isActive ? 'bg-gradient-to-t from-white/20 to-white/5 text-white shadow-[inset_0_1px_1px_rgba(255,255,255,0.2)] -translate-y-1' : 'text-white/60 hover:text-white/90 hover:-translate-y-0.5'}`}
        >
            <Icon size={isActive ? 28 : 24} className={`mb-1 transition-all duration-300 ${isActive ? 'stroke-[2.5px] drop-shadow-[0_0_8px_rgba(255,255,255,0.4)]' : 'stroke-2'}`} />
            <span className={`text-[11px] uppercase tracking-wider font-display ${isActive ? 'font-bold text-emerald-100' : 'font-medium'}`}>{label}</span>
        </button>
    );
}
