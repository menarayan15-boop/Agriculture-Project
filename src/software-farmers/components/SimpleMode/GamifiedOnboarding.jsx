import React, { useState, useEffect } from 'react';
import { Volume2, Trophy, ArrowRight, Play, CloudRain, Droplet, Sprout, Sun } from 'lucide-react';
import DigitalFarmScene from './DigitalFarmScene';

export default function GamifiedOnboarding({ onFinish }) {
    const [view, setView] = useState('welcome');
    const [xp, setXp] = useState(0);
    const [badges, setBadges] = useState([]);
    const [activeObject, setActiveObject] = useState(null);
    const [mapDiscovered, setMapDiscovered] = useState([]);

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

    const awardXp = (amount, badge) => {
        setXp(pxp => pxp + amount);
        if (badge && !badges.includes(badge)) {
            setBadges(b => [...b, badge]);
            speak(`Achievement unlocked! ${badge}`);
        }
    };

    const handleObjectClick = (obj) => {
        if (!mapDiscovered.includes(obj.id)) {
            setMapDiscovered([...mapDiscovered, obj.id]);
        }
        setActiveObject(obj);
        setView('interactive');
        speak(obj.title + '. ' + obj.text);
    };

    const closeInteractive = () => {
        setView('map');
    };

    // --- Sub-Components ---

    const WelcomeView = () => (
        <div className="min-h-screen bg-green-50 flex flex-col items-center justify-center p-6 text-center animate-in fade-in zoom-in duration-500">
            <h1 className="text-[120px] mb-4 animate-bounce">🌱</h1>
            <h1 className="text-4xl font-bold text-green-900 mb-2">WELCOME TO YOUR SMART FARM</h1>
            <p className="text-2xl text-green-700 mb-12">Your Digital Farming Assistant</p>
            <button
                onClick={() => { setView('map'); speak("Tap around your farm to discover SmartFarm."); }}
                className="btn-smart btn-theme-crop text-white text-2xl font-bold py-[22px] px-14 rounded-[28px] font-display tracking-widest uppercase group"
            >
                <div className="flex items-center gap-2 group-hover:gap-4 transition-all">
                    Let's Start <ArrowRight className="h-6 w-6" />
                </div>
            </button>
        </div>
    );

    const interactiveObjects = [
        { id: 'weather', emoji: '🌦️', title: 'Smart Weather', text: 'Weather helps us decide whether your crop needs water.', x: '50%', y: '10%' },
        { id: 'crop', emoji: '🌾', title: 'Smart Crop Advice', text: 'SmartFarm checks your soil, weather and water availability before suggesting a crop.', x: '20%', y: '40%' },
        { id: 'water', emoji: '💧', title: 'Smart Water', text: 'SmartFarm helps avoid unnecessary watering with smart tanks.', x: '80%', y: '40%' },
        { id: 'soil', emoji: '🌍', title: 'Your Soil', text: 'SmartFarm checks your soil to understand which crops can grow well.', x: '30%', y: '70%' },
        { id: 'sensor', emoji: '📡', title: 'Farm Sensors', text: 'These sensors continuously tell SmartFarm what is happening in your field.', x: '70%', y: '70%' },
        { id: 'sprinkler', emoji: '🚿', title: 'Smart Irrigation', text: 'SmartFarm can help decide when your crop needs water.', x: '50%', y: '50%' }
    ];

    const MapView = () => (
        <div className="min-h-screen bg-black flex flex-col relative animate-in fade-in">
            <DigitalFarmScene weather="sunny" objects={interactiveObjects.map(o => ({ ...o, pulse: !mapDiscovered.includes(o.id) }))} onObjectClick={handleObjectClick} />

            {/* Header / HUD */}
            <div className="absolute top-4 left-4 right-4 z-10 flex justify-between items-start pointer-events-none">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-3 rounded-2xl shadow-xl pointer-events-auto">
                    <p className="text-[10px] font-bold text-emerald-300 uppercase tracking-widest">🌱 Level 1</p>
                    <h2 className="text-white font-bold leading-tight">Smart Farmer</h2>
                </div>
                <div className="bg-white/10 backdrop-blur-md border border-white/20 p-2 px-3 rounded-xl shadow-xl flex flex-col gap-1 w-32 pointer-events-auto">
                    <div className="flex justify-between text-white text-[10px] font-bold uppercase">
                        <span>XP Progress</span>
                        <span className="text-emerald-300">{xp}/100</span>
                    </div>
                    <div className="w-full bg-black/40 rounded-full h-1.5 overflow-hidden">
                        <div className="bg-emerald-400 h-1.5 rounded-full transition-all duration-1000" style={{ width: `${Math.min(100, xp)}%` }}></div>
                    </div>
                </div>
            </div>

            <div className="absolute bottom-8 w-full flex flex-col items-center z-10 pointer-events-none px-4">
                <div className="bg-white/10 backdrop-blur-md border border-white/20 px-6 py-4 rounded-3xl shadow-xl mb-4 text-center">
                    <h1 className="text-white text-lg md:text-xl font-bold">👆 Tap around your farm to discover SmartFarm</h1>
                </div>
                {mapDiscovered.length >= 3 && mapDiscovered.length < 6 && (
                    <button onClick={() => setView('mission1')} className="pointer-events-auto btn-smart btn-theme-help text-white font-bold py-[18px] px-8 rounded-[20px] animate-pulse text-lg font-display">
                        Ready for Missions? →
                    </button>
                )}
                {mapDiscovered.length >= 6 && (
                    <button onClick={() => setView('mission1')} className="pointer-events-auto btn-smart btn-theme-crop text-white font-bold py-[22px] px-10 rounded-[24px] animate-bounce text-xl font-display uppercase tracking-wide">
                        🎮 Start Your First Farm Mission
                    </button>
                )}
            </div>

            {badges.length > 0 && (
                <div className="absolute bottom-4 left-4 flex gap-2 z-10">
                    {badges.map(b => (
                        <div key={b} className="bg-yellow-400 text-yellow-900 text-xs font-bold px-2 py-1 rounded-full shadow border-2 border-white flex items-center gap-1">
                            <Trophy size={12} /> {b}
                        </div>
                    ))}
                </div>
            )}
        </div>
    );

    const InteractiveOverlay = () => (
        <div className="fixed inset-0 bg-black/60 z-50 flex items-center justify-center p-6 animate-in fade-in">
            <div className="bg-white rounded-[2rem] p-8 max-w-sm w-full relative">
                <button onClick={() => speak(activeObject.title + ". " + activeObject.text)} className="absolute top-6 right-6 text-slate-400 bg-slate-100 p-3 rounded-full">
                    <Volume2 size={24} />
                </button>
                <div className="text-[100px] text-center mb-4">{activeObject.emoji}</div>
                <h2 className="text-3xl font-bold text-slate-800 mb-4">{activeObject.title}</h2>
                <p className="text-xl text-slate-600 leading-relaxed mb-8">{activeObject.text}</p>
                <button onClick={closeInteractive} className="w-full btn-smart btn-theme-crop text-white font-bold text-2xl py-[20px] rounded-[24px] font-display uppercase tracking-widest">
                    Got it!
                </button>
                <div className="mt-4 p-4 bg-green-50 rounded-xl flex items-start gap-3">
                    <span className="text-xl">💡</span>
                    <div>
                        <span className="font-bold text-green-900 block">Smart Tip</span>
                        <span className="text-green-800 text-sm">Tap more items to start missions.</span>
                    </div>
                </div>
            </div>
        </div>
    );

    // --- MISSION SCRIPTS ---
    const TopHUD = () => (
        <div className="w-full p-4 flex justify-between items-center bg-white shadow-sm border-b border-slate-100">
            <div className="font-bold text-green-600">🎮 MISSION {view.replace('mission', '')}</div>
            <div className="font-bold text-slate-700">{xp} XP</div>
        </div>
    );

    const Mission1 = () => (
        <div className="min-h-screen bg-orange-50 flex flex-col animate-in slide-in-from-right">
            <TopHUD />
            <div className="p-8 flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                <div className="text-[80px] mb-6">🌍</div>
                <h2 className="text-3xl font-bold text-orange-900 mb-4">KNOW YOUR SOIL</h2>
                <p className="text-xl text-orange-800 mb-8">What type of soil do you have?</p>

                <div className="flex flex-col gap-4">
                    {['🟤 Sandy', '🟫 Clay', '🌱 Loamy', '❓ I don\'t know'].map(opt => (
                        <button key={opt} onClick={() => {
                            awardXp(10, 'SOIL EXPLORER');
                            setView('mission2');
                            speak(opt === '❓ I don\'t know'
                                ? "No problem! SmartFarm can use available soil sensor information."
                                : "Excellent! We will customize advice for that soil type.");
                        }} className="bg-white border-2 border-orange-200 text-slate-800 text-xl py-4 px-6 rounded-2xl font-bold shadow-sm text-left hover:bg-orange-100 flex items-center gap-4">
                            {opt}
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const Mission2 = () => (
        <div className="min-h-screen bg-green-50 flex flex-col animate-in slide-in-from-right">
            <TopHUD />
            <div className="p-8 flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                <div className="text-[80px] mb-6">🌱</div>
                <h2 className="text-3xl font-bold text-green-900 mb-4">CHOOSE YOUR CROP</h2>
                <p className="text-xl text-green-800 mb-8">What are you growing?</p>

                <div className="grid grid-cols-2 gap-4">
                    {[{ e: '🍅', l: 'Tomato' }, { e: '🌾', l: 'Groundnut' }, { e: '🌽', l: 'Maize' }, { e: '🌶️', l: 'Chilli' }, { e: '🥜', l: 'Other' }].map(opt => (
                        <button key={opt.l} onClick={() => {
                            awardXp(10, 'CROP PLANNER');
                            setView('mission3_intro');
                            speak(`Great choice! SmartFarm will monitor this crop and provide advice based on its needs.`);
                        }} className="bg-white border-2 border-green-200 text-slate-800 text-xl py-6 px-4 rounded-3xl font-bold shadow-sm flex flex-col items-center gap-3">
                            <span className="text-4xl">{opt.e}</span>
                            <span>{opt.l}</span>
                        </button>
                    ))}
                </div>
            </div>
        </div>
    );

    const [m3Choice, setM3Choice] = useState(null);
    const Mission3 = () => (
        <div className="min-h-screen bg-blue-50 flex flex-col animate-in slide-in-from-right">
            <TopHUD />
            <div className="p-8 flex-1 flex flex-col justify-center max-w-md mx-auto w-full text-center">
                {!m3Choice ? (
                    <>
                        <div className="flex justify-center gap-4 text-5xl mb-8">
                            <span>🌱</span><span>☀️</span><span>💧</span>
                        </div>
                        <h2 className="text-3xl font-bold text-blue-900 mb-4">Your soil is dry.</h2>
                        <p className="text-2xl text-blue-800 mb-12">Should we water the crop?</p>
                        <div className="flex gap-4">
                            <button onClick={() => { setM3Choice('water'); speak('Let\'s see what happens. Rain arrived. Because rain was coming, waiting could have saved water.'); }} className="flex-1 bg-blue-600 text-white font-bold text-xl py-6 rounded-2xl shadow-lg">💧 WATER NOW</button>
                            <button onClick={() => { setM3Choice('wait'); awardXp(20, 'WATER SAVER'); speak('Excellent decision! Rain is expected in 4 hours. You avoided unnecessary irrigation.'); }} className="flex-1 bg-white border-2 border-blue-600 text-blue-800 font-bold text-xl py-6 rounded-2xl shadow-lg">⏳ WAIT</button>
                        </div>
                    </>
                ) : (
                    <div className="animate-in zoom-in">
                        <div className="text-[100px] mb-6">🌧️</div>
                        <h2 className="text-3xl font-bold text-blue-900 mb-4">Rain is expected in 4 hours.</h2>
                        {m3Choice === 'wait' ? (
                            <div className="bg-white p-6 rounded-2xl mb-8 border border-blue-200 shadow-sm">
                                <h3 className="text-2xl font-bold text-green-600 mb-2">🎉 Excellent decision!</h3>
                                <p className="text-lg text-slate-700">You avoided unnecessary irrigation.</p>
                            </div>
                        ) : (
                            <div className="bg-white p-6 rounded-2xl mb-8 border border-blue-200 shadow-sm">
                                <h3 className="text-2xl font-bold text-orange-600 mb-2">Let's see what happens.</h3>
                                <p className="text-lg text-slate-700">Because rain was coming, waiting could have saved water.</p>
                            </div>
                        )}
                        <button onClick={() => setView('mission4')} className="w-full bg-blue-600 text-white font-bold text-xl py-4 rounded-xl shadow-md">Next Mission →</button>
                    </div>
                )}
            </div>
        </div>
    );

    const [m4Choice, setM4Choice] = useState(null);
    const Mission4 = () => (
        <div className="min-h-screen bg-slate-100 flex flex-col animate-in slide-in-from-right">
            <TopHUD />
            <div className="p-8 flex-1 flex flex-col justify-center max-w-md mx-auto w-full">
                {!m4Choice ? (
                    <>
                        <h2 className="text-3xl font-bold text-slate-800 mb-8 text-center">WEATHER DETECTIVE</h2>
                        <div className="grid grid-cols-2 gap-4 mb-8">
                            <div className="bg-white p-4 rounded-2xl shadow text-center">
                                <span className="text-sm font-bold text-slate-500 uppercase">Today</span>
                                <div className="text-4xl mt-2 mb-2">☀️</div>
                                <span className="font-bold text-xl text-slate-800">29°C</span>
                                <div className="text-xs text-slate-500 mt-1">Rain: 20%</div>
                            </div>
                            <div className="bg-blue-50 p-4 rounded-2xl shadow text-center border border-blue-100">
                                <span className="text-sm font-bold text-blue-500 uppercase">Tomorrow</span>
                                <div className="text-4xl mt-2 mb-2">🌧️</div>
                                <span className="font-bold text-xl text-blue-900 border-b border-blue-200">80% Rain</span>
                            </div>
                        </div>
                        <h3 className="text-2xl font-bold text-slate-700 mb-6 text-center">When should we water?</h3>
                        <div className="flex flex-col gap-3">
                            <button onClick={() => { setM4Choice('A'); awardXp(10); speak('You chose Today. It is dry today, but tomorrow has heavy rain. It is often better to wait and save water.'); }} className="bg-white border-2 border-slate-200 text-slate-700 font-bold text-xl py-4 rounded-xl text-left pl-6">A. 💧 Today</button>
                            <button onClick={() => { setM4Choice('B'); awardXp(20, 'WEATHER WATCHER'); speak('You chose Tomorrow. Since it will rain tomorrow, you don\'t need to use your own water!'); }} className="bg-white border-2 border-slate-200 text-slate-700 font-bold text-xl py-4 rounded-xl text-left pl-6">B. 🌧️ Let the rain do it Tomorrow</button>
                            <button onClick={() => { setM4Choice('C'); awardXp(5); speak('You chose Both days. That would waste water and overwater the crop.'); }} className="bg-white border-2 border-slate-200 text-slate-700 font-bold text-xl py-4 rounded-xl text-left pl-6">C. 🚿 Both days</button>
                        </div>
                    </>
                ) : (
                    <div className="text-center animate-in zoom-in">
                        <div className="text-6xl mb-6">💡</div>
                        <h2 className="text-2xl font-bold text-slate-800 mb-4">SmartTip</h2>
                        <p className="text-lg text-slate-600 mb-8 bg-white p-6 rounded-2xl shadow-sm">
                            {m4Choice === 'B' ? "Since it will rain tomorrow, you don't need to use your own water! This saves electricity and water resources." : "Because tomorrow has an 80% chance of rain, it is best to let the rain water your crops instead of using the pump today."}
                        </p>
                        <button onClick={() => setView('mission5')} className="w-full bg-slate-800 text-white font-bold text-xl py-4 rounded-xl shadow-md">Next Mission →</button>
                    </div>
                )}
            </div>
        </div>
    );

    const [questionAnswered, setQA] = useState('');
    const Mission5 = () => (
        <div className="min-h-screen bg-green-50 flex flex-col animate-in slide-in-from-right">
            <TopHUD />
            <div className="p-8 flex-1 flex flex-col max-w-md mx-auto w-full">
                <div className="bg-white p-6 rounded-3xl shadow-sm border border-green-100 flex items-center gap-4 mb-8">
                    <div className="text-[60px] bg-green-100 rounded-full w-24 h-24 flex items-center justify-center border-4 border-white shadow">🧑‍🌾</div>
                    <div>
                        <h2 className="text-2xl font-bold text-green-900">Ask the Farm AI</h2>
                        <p className="text-green-700">I am here to help.</p>
                    </div>
                </div>

                {!questionAnswered ? (
                    <div className="flex flex-col gap-4 flex-1">
                        <button onClick={() => { setQA('Your soil type and current water levels make Groundnut extremely suitable (89%).'); speak('Your soil type and current water levels make Groundnut extremely suitable.'); awardXp(20, 'SMART FARMER'); }} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-left text-lg font-bold text-slate-700">🌱 Which crop should I grow?</button>
                        <button onClick={() => { setQA('Currently, your soil moisture is 31%. Irrigation is not required today.'); speak('Currently, your soil moisture is 31%. Irrigation is not required today.'); awardXp(20, 'SMART FARMER'); }} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-left text-lg font-bold text-slate-700">💧 Does my crop need water?</button>
                        <button onClick={() => { setQA('There is a 20% chance of rain today, and 80% tomorrow.'); speak('There is a 20% chance of rain today, and 80% tomorrow.'); awardXp(20, 'SMART FARMER'); }} className="bg-white p-4 rounded-2xl shadow-sm border border-slate-100 text-left text-lg font-bold text-slate-700">🌦️ Will it rain?</button>

                        <div className="mt-auto flex justify-center">
                            <button className="bg-green-600 text-white font-bold text-lg py-4 px-8 rounded-full shadow-lg flex items-center gap-3">
                                🎤 Ask by Voice
                            </button>
                        </div>
                    </div>
                ) : (
                    <div className="flex flex-col flex-1 animate-in slide-in-from-bottom">
                        <div className="bg-green-100 p-6 rounded-3xl rounded-tl-none mb-8 mt-4 shadow-sm relative">
                            <p className="text-xl text-green-900 font-medium leading-relaxed">{questionAnswered}</p>
                            <button onClick={() => speak(questionAnswered)} className="absolute -bottom-4 -right-4 bg-white p-4 rounded-full shadow-lg text-green-600">
                                <Volume2 size={24} />
                            </button>
                        </div>
                        <button onClick={() => setView('ready')} className="w-full bg-green-600 text-white font-bold text-xl py-5 rounded-2xl shadow-md mt-auto">Finish Onboarding 🎉</button>
                    </div>
                )}
            </div>
        </div>
    );

    const FinalReadyView = () => (
        <div className="min-h-screen bg-gradient-to-b from-blue-300 to-green-100 flex flex-col items-center p-8 animate-in fade-in duration-1000 relative overflow-hidden">
            {/* Confetti / celebration elements could go here */}

            <div className="text-[120px] mb-4 animate-bounce z-10">🎉</div>
            <h1 className="text-4xl font-extrabold text-green-900 mb-8 text-center z-10 w-full">Your Smart Farm is Ready!</h1>

            <div className="bg-white/90 backdrop-blur rounded-[2rem] p-6 w-full max-w-sm shadow-xl z-10 mb-8 divide-y divide-slate-100">
                <div className="py-3 flex justify-between items-center"><span className="text-slate-500 font-bold">🌱 Crop</span><span className="font-bold text-slate-800">Groundnut</span></div>
                <div className="py-3 flex justify-between items-center"><span className="text-slate-500 font-bold">🌍 Soil</span><span className="font-bold text-green-600">Connected</span></div>
                <div className="py-3 flex justify-between items-center"><span className="text-slate-500 font-bold">🌦️ Weather</span><span className="font-bold text-green-600">Connected</span></div>
                <div className="py-3 flex justify-between items-center"><span className="text-slate-500 font-bold">📡 Sensors</span><span className="font-bold text-green-600">2 Online</span></div>
                <div className="py-3 flex justify-between items-center"><span className="text-slate-500 font-bold">💧 Irrigation</span><span className="font-bold text-green-600">Ready</span></div>
            </div>

            <div className="bg-green-800 text-white w-full max-w-sm rounded-[2rem] p-6 shadow-2xl z-10 mb-8 text-center">
                <h3 className="text-green-300 text-sm font-bold uppercase tracking-widest mb-2">🧑‍🌾 Today's Advice</h3>
                <p className="text-xl font-bold leading-relaxed">Your farm is ready. We will help you monitor it.</p>
            </div>

            <div className="flex flex-col w-full max-w-sm gap-4 z-10">
                <button onClick={() => { speak('Entering farm'); onFinish(); }} className="w-full btn-smart btn-theme-help text-white font-extrabold text-[22px] py-[22px] rounded-[24px] font-display uppercase tracking-wider group">
                    🚜 <span className="group-hover:translate-x-2 transition-transform inline-block">ENTER MY FARM</span>
                </button>
                <button onClick={() => speak("Your crop is Groundnut. Soil and weather sensors are active. The irrigation system is ready to operate.")} className="w-full btn-smart bg-white hover:bg-green-50 text-green-800 font-bold text-xl py-5 rounded-[22px] shadow-sm flex items-center justify-center gap-3 font-display">
                    <Volume2 size={24} /> HEAR MY FARM STATUS
                </button>
            </div>

            {/* Background elements */}
            <div className="absolute bottom-0 left-0 w-full h-1/3 bg-green-500 rounded-t-[100%] opacity-20"></div>
            <div className="absolute bottom-[-10%] left-[-10%] w-[120%] h-1/2 bg-green-600 rounded-t-[100%] opacity-20"></div>
        </div>
    );

    switch (view) {
        case 'welcome': return <WelcomeView />;
        case 'interactive': return <><MapView /><InteractiveOverlay /></>;
        case 'mission1': return <Mission1 />;
        case 'mission2': return <Mission2 />;
        case 'mission3_intro': setView('mission3'); return null;
        case 'mission3': return <Mission3 />;
        case 'mission4': return <Mission4 />;
        case 'mission5': return <Mission5 />;
        case 'ready': return <FinalReadyView />;
        default: return <MapView />;
    }
}
