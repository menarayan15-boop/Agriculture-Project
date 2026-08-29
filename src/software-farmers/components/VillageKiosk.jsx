import React, { useState } from 'react';
import { api } from '../utils/apiSimulator';
import { useLang } from '../i18n/LanguageContext';
import { Volume2, VolumeX, HelpCircle, Globe, Droplet, Sprout, Sun, FileText, Lock } from 'lucide-react';

const TRANSLATIONS = {
    English: {
        welcome: "Village Community Kiosk Platform",
        subWelcome: "Digital Agri-Centre • Free farmer services",
        langSelect: "Select language",
        statusBtn: "Check Soil & Crop Status",
        irrigateBtn: "Control Irrigation Valves",
        fertilizerBtn: "Get AI Fertilizer Recommendations",
        governmentBtn: "Government Agri-Schemes (2026)",
        moisture: "Soil Moisture",
        temp: "Soil Temperature",
        crop: "Active Crop",
        irrigationStatus: "Sprinkler Valve Status",
        valveOn: "OPEN (SPRINKLING)",
        valveOff: "CLOSED (IDLE)",
        goBack: "Go Back",
        speakStatus: "Your soil moisture is {moisture} percent, crop is {crop}, and irrigation valve is {valve}."
    },
    Hindi: {
        welcome: "ग्राम सामुदायिक कियोस्क सेवा",
        subWelcome: "डिजिटल कृषि केंद्र • किसानों के लिए निशुल्क सेवा",
        langSelect: "भाषा चुनें",
        statusBtn: "मिट्टी और फसल की स्थिति जांचें",
        irrigateBtn: "सिंचाई वाल्व नियंत्रित करें",
        fertilizerBtn: "कृत्रिम बुद्धिमत्ता (AI) खाद सलाह",
        governmentBtn: "सरकारी कृषि सब्सिडी योजनाएं (2026)",
        moisture: "मिट्टी की नमी",
        temp: "मिट्टी का तापमान",
        crop: "सक्रिय फसल",
        irrigationStatus: "फव्वारा वाल्व स्थिति",
        valveOn: "चालू (पानी चल रहा है)",
        valveOff: "बंद (शांत है)",
        goBack: "पीछे जाएं",
        speakStatus: "प्रणाम किसान भाई। आपकी मिट्टी की नमी {moisture} प्रतिशत है, फसल {crop} है, और सिंचाई वाल्व अभी {valve} है।"
    },
    Telugu: {
        welcome: "గ్రామ సముదాయ కియోస్క్ వేదిక",
        subWelcome: "డిజిటల్ వ్యవసాయ కేంద్రం • ఉచిత సేవలు",
        langSelect: "భాషను ఎంచుకోండి",
        statusBtn: "నేల మరియు పంట స్థితి తనిఖీ",
        irrigateBtn: "నీటి పంపు కంట్రోల్",
        fertilizerBtn: "AI ఎరువుల సిఫార్సులు",
        governmentBtn: "ప్రభుత్వ వ్యవసాయ పథకాలు (2026)",
        moisture: "నేల తేమ",
        temp: "నేల ఉష్ణోగ్రత",
        crop: "ప్రస్తుత పంట",
        irrigationStatus: "నీటి వాల్వ్ స్థితి",
        valveOn: "ఆన్ (నీరు పారుతోంది)",
        valveOff: "ఆఫ్ (ఆగిపోయింది)",
        goBack: "వెనుకకు వెళ్ళండి",
        speakStatus: "నమస్కారం రైతు సోదరా. మీ నేల తేమ {moisture} శాతం ఉంది, పంట {crop}, మరియు నీటి వాల్వ్ {valve} లో ఉంది."
    }
};

export default function VillageKiosk({ dbState }) {
    const { lang: globalLang, setLang: setGlobalLang } = useLang();
    const isoToKiosk = { 'en': 'English', 'hi': 'Hindi', 'te': 'Telugu' };
    const kioskToIso = { 'English': 'en', 'Hindi': 'hi', 'Telugu': 'te' };

    // Fallback unmapped Kiosk interactions to English if language isn't directly supported by Kiosk
    const lang = isoToKiosk[globalLang] || 'English';
    const setLang = (l) => setGlobalLang(kioskToIso[l] || 'en');

    const [activeScreen, setActiveScreen] = useState('menu'); // 'menu', 'status', 'irrigate', 'ai', 'schemes'
    const [ttsEnabled, setTtsEnabled] = useState(true);

    const t = TRANSLATIONS[lang] || TRANSLATIONS.English;
    const { soilMoisture, soilTemp, valveState, cropName, irrigationMode } = dbState.farm;

    const speakText = (text) => {
        if (!ttsEnabled || !window.speechSynthesis) return;

        // Stop any ongoing speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        const voices = window.speechSynthesis.getVoices();

        // Jarvis logic
        if (!/[\u0900-\u097F]/.test(text)) {
            const jarvisVoice = voices.find(v =>
                v.name.includes('Google UK English Male') ||
                v.name.includes('George') ||
                v.name.includes('Daniel') ||
                v.name.includes('UK English Male')
            );
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

        utterance.rate = 0.9;
        window.speechSynthesis.speak(utterance);
    };

    const handleScreenChange = (screen) => {
        setActiveScreen(screen);

        // Auto-narration based on selected screen description
        if (screen === 'menu') {
            speakText(t.welcome + ". " + t.subWelcome);
        } else if (screen === 'status') {
            const vText = valveState === 'ON' ? (lang === 'Hindi' ? 'चालू' : lang === 'Telugu' ? 'ఆన్' : 'Open') : (lang === 'Hindi' ? 'बंद' : lang === 'Telugu' ? 'ఆఫ్' : 'Closed');
            const cropText = cropName === 'Basmati Rice' ? (lang === 'Hindi' ? 'बासमती चावल' : lang === 'Telugu' ? 'బాస్మతి బియ్యం' : 'Basmati Rice') : (lang === 'Hindi' ? 'गेहूं' : lang === 'Telugu' ? 'గోధుమ' : 'Wheat');
            const speech = t.speakStatus
                .replace('{moisture}', soilMoisture)
                .replace('{crop}', cropText)
                .replace('{valve}', vText);
            speakText(speech);
        } else if (screen === 'irrigate') {
            speakText(lang === 'Hindi'
                ? "सिंचाई वाल्व नियंत्रण कक्ष। आप बटन दबाकर पंप शुरू या बंद कर सकते हैं।"
                : lang === 'Telugu'
                    ? "నీటి పంపు కంట్రోల్ రూమ్. మీరు ఇక్కడ నుండి పంపు ఆన్ లేదా ఆఫ్ చేయవచ్చు."
                    : "Irrigation valve control room. Toggle physical pump or automation state here."
            );
        } else if (screen === 'ai') {
            const recs = api.getCropRecommendations(dbState.activeFarmerId);
            const topCropName = recs[0]?.name || "Groundnut";
            let topCropLoc = topCropName;
            if (lang === 'Hindi') {
                if (topCropName === 'Groundnut') topCropLoc = 'मूंगफली';
                if (topCropName === 'Tomato') topCropLoc = 'टमाटर';
                if (topCropName === 'Maize') topCropLoc = 'मक्का';
                if (topCropName === 'Basmati Rice') topCropLoc = 'बासमती धान';
                if (topCropName === 'Wheat') topCropLoc = 'गेहूं';
                if (topCropName === 'Chickpea') topCropLoc = 'चना';
            } else if (lang === 'Telugu') {
                if (topCropName === 'Groundnut') topCropLoc = 'వేరుశనగ';
                if (topCropName === 'Tomato') topCropLoc = 'టమోటా';
                if (topCropName === 'Maize') topCropLoc = 'మొక్కజొన్న';
                if (topCropName === 'Basmati Rice') topCropLoc = 'బాస్మతి వరి';
                if (topCropName === 'Wheat') topCropLoc = 'గోధుమ';
                if (topCropName === 'Chickpea') topCropLoc = 'శనగలు';
            }
            speakText(lang === 'Hindi'
                ? `कृत्रिम बुद्धिमत्ता सलाहगार। आपके खेत के लिए सर्वोत्तम फसल सुझाव ${topCropLoc} है। मिट्टी में नाइट्रोजन का स्तर कम है, जैविक खाद डालें।`
                : lang === 'Telugu'
                    ? `AI వ్యవసాయ సలహాదారు. మీ పొలానికి అత్యంత అనుకూలమైన పంట ${topCropLoc}. నేలలో నత్రజని లోపం కూడా ఉంది, సేంద్రియ ఎరువులు వాడండి.`
                    : `AI agronomy advisor. Your top recommended crop is ${topCropLoc}. NPK sensor detects low nitrogen levels in the root zone.`
            );
        } else if (screen === 'schemes') {
            speakText(lang === 'Hindi'
                ? "निशुल्क सरकारी योजनाएं। किसान मानधन योजना और सौर पंप योजना के बारे में जानकारी।"
                : lang === 'Telugu'
                    ? "ప్రభుత్వ సబ్సిడీ పథకాలు. కిసాన్ పెన్షన్ మరియు రైతు సబ్సిడీ వివరాలు."
                    : "Free agricultural schemes. View crop insurance, solar pumps subsidies and fertilizer cards."
            );
        }
    };

    const toggleKioskVvalve = async (state) => {
        // Audit log generated on API
        await api.updateIrrigationMode("MANUAL", `KIOSK_${lang.toUpperCase()}`);
        await api.togglePump(state, `KIOSK_${lang.toUpperCase()}`);

        speakText(lang === 'Hindi'
            ? `वाल्व को सफलतापूर्वक ${state === 'ON' ? 'चालू' : 'बंद'} कर दिया गया है`
            : lang === 'Telugu'
                ? `నీటి పంపు విజయవంతంగా ${state === 'ON' ? 'ఆన్' : 'ఆఫ్'} చేయబడింది`
                : `Sprinkler valve successfully toggled ${state}`
        );
    };

    const toggleKioskMode = async (mode) => {
        await api.updateIrrigationMode(mode, `KIOSK_${lang.toUpperCase()}`);
    };

    return (
        <div className="kiosk-container">
            {/* Kiosk Metallic Frame Header */}
            <div className="kiosk-metal-header">
                <div className="flex items-center gap-3">
                    <Globe size={20} className="kiosk-icon text-yellow-500 animate-spin-slow" />
                    <h2 className="title">{t.welcome}</h2>
                </div>
                <div className="flex items-center gap-4">
                    {/* TTS Toggle */}
                    <button
                        className={`kiosk-tts-toggle ${ttsEnabled ? 'active' : ''}`}
                        onClick={() => {
                            setTtsEnabled(!ttsEnabled);
                            if (ttsEnabled && window.speechSynthesis) window.speechSynthesis.cancel();
                        }}
                    >
                        {ttsEnabled ? <Volume2 size={18} /> : <VolumeX size={18} />}
                        <span>{ttsEnabled ? '🔊 Audio ON' : '🔇 Mute Narration'}</span>
                    </button>

                    {/* Language Selector */}
                    <div className="lang-buttons flex gap-1">
                        {['English', 'Hindi', 'Telugu'].map((l) => (
                            <button
                                key={l}
                                onClick={() => { setLang(l); speakText("Language changed to " + l); }}
                                className={`lang-select-btn ${lang === l ? 'selected' : ''}`}
                            >
                                {l === 'English' ? '🇬🇧 EN' : l === 'Hindi' ? '🇮🇳 हिन्दी' : '🇮🇳 తెలుగు'}
                            </button>
                        ))}
                    </div>
                </div>
            </div>

            {/* Screen Area */}
            <div className="kiosk-screen-content">

                {activeScreen === 'menu' && (
                    <div className="kiosk-main-menu grid grid-cols-2 gap-4">

                        <button className="kiosk-menu-btn" onClick={() => handleScreenChange('status')}>
                            <Droplet size={36} className="color-icon text-teal" />
                            <div className="text-wrapper">
                                <h3>{t.statusBtn}</h3>
                                <p>{lang === 'Hindi' ? 'फसल नमी और मिट्टी स्वास्थ्य देखें' : lang === 'Telugu' ? 'తేమ మరియు నేల ఆరోగ్యం' : 'View soil moisture & telemetry values'}</p>
                            </div>
                        </button>

                        <button className="kiosk-menu-btn" onClick={() => handleScreenChange('irrigate')}>
                            <Lock size={36} className="color-icon text-blue" />
                            <div className="text-wrapper">
                                <h3>{t.irrigateBtn}</h3>
                                <p>{lang === 'Hindi' ? 'पंप को चालू/बंद करें' : lang === 'Telugu' ? 'పంపు ఆన్/ఆఫ్ చేయండి' : 'Manually actuate field water valves'}</p>
                            </div>
                        </button>

                        <button className="kiosk-menu-btn" onClick={() => handleScreenChange('ai')}>
                            <Sprout size={36} className="color-icon text-green" />
                            <div className="text-wrapper">
                                <h3>{t.fertilizerBtn}</h3>
                                <p>{lang === 'Hindi' ? 'फसल उर्वरक सुझाव' : lang === 'Telugu' ? 'సమతుల్య ఎరువుల మోతాదు' : 'Agri-AI Advisory crop diagnostic health'}</p>
                            </div>
                        </button>

                        <button className="kiosk-menu-btn" onClick={() => handleScreenChange('schemes')}>
                            <FileText size={36} className="color-icon text-orange" />
                            <div className="text-wrapper">
                                <h3>{t.governmentBtn}</h3>
                                <p>{lang === 'Hindi' ? 'योजनाएं और कृषि विकास वित्तीय लाभ' : lang === 'Telugu' ? 'సబ్సిడీలు మరియు కిసాన్ క్రెడిట్ కార్డ్' : 'Check subsidies, insurance, credit status'}</p>
                            </div>
                        </button>

                    </div>
                )}

                {activeScreen === 'status' && (
                    <div className="kiosk-subscreen">
                        <div className="kiosk-subscreen-header flex justify-between items-center">
                            <h3>📈 {t.statusBtn}</h3>
                            <button className="kiosk-back-btn" onClick={() => handleScreenChange('menu')}>← {t.goBack}</button>
                        </div>

                        <div className="kiosk-details-grid grid grid-cols-2 gap-4">
                            <div className="kiosk-data-card">
                                <span className="label">{t.moisture}</span>
                                <span className="value text-teal">{soilMoisture}%</span>
                                <p className="desc">{soilMoisture < 30 ? (lang === 'Hindi' ? 'चेतावनी: मिट्टी बहुत सूखी है!' : lang === 'Telugu' ? 'ఉష్ణోగ్రత పెరిగి తేమ తగ్గింది.' : 'Critical! Below threshold.') : (lang === 'Hindi' ? 'नमी पर्याप्त है।' : lang === 'Telugu' ? 'తేమ సరిగ్గా ఉంది.' : 'Moisture is optimal.')}</p>
                            </div>
                            <div className="kiosk-data-card">
                                <span className="label">{t.temp}</span>
                                <span className="value text-orange">{soilTemp}°C</span>
                                <p className="desc">{lang === 'Hindi' ? 'मिट्टी का तापमान अनुकूल है।' : lang === 'Telugu' ? 'ఉష్ణోగ్రత సాధారణము.' : 'Standard root temperature.'}</p>
                            </div>
                            <div className="kiosk-data-card">
                                <span className="label">{t.crop}</span>
                                <span className="value text-green">{cropName}</span>
                                <p className="desc">{dbState.farm.cropStage}</p>
                            </div>
                            <div className="kiosk-data-card">
                                <span className="label">{t.irrigationStatus}</span>
                                <span className={`value ${valveState === 'ON' ? 'text-blue' : 'text-gray-500'}`}>
                                    {valveState === 'ON' ? t.valveOn : t.valveOff}
                                </span>
                                <p className="desc">Mode: {irrigationMode}</p>
                            </div>
                        </div>
                    </div>
                )}

                {activeScreen === 'irrigate' && (
                    <div className="kiosk-subscreen">
                        <div className="kiosk-subscreen-header flex justify-between items-center">
                            <h3>🎛️ {t.irrigateBtn}</h3>
                            <button className="kiosk-back-btn" onClick={() => handleScreenChange('menu')}>← {t.goBack}</button>
                        </div>

                        <div className="kiosk-irrigation-panel flex flex-col items-center gap-6">
                            <div className="status-banner text-center">
                                <div className="text-sm uppercase tracking-wider">{t.irrigationStatus}</div>
                                <div className={`valve-indicator-bubble ${valveState === 'ON' ? 'open' : 'closed'}`}>
                                    {valveState === 'ON' ? t.valveOn : t.valveOff}
                                </div>
                                <div className="text-xs mt-2 opacity-65">Current System Mode: <strong>{irrigationMode}</strong></div>
                            </div>

                            <div className="flex gap-4">
                                <button
                                    className={`kiosk-action-btn btn-danger ${valveState === 'OFF' ? 'disabled' : ''}`}
                                    onClick={() => toggleKioskVvalve('OFF')}
                                    disabled={valveState === 'OFF'}
                                >
                                    🔴 {lang === 'Hindi' ? 'पंप बंद करें' : lang === 'Telugu' ? 'పంపు ఆఫ్ చేయండి' : 'TURN PUMP OFF'}
                                </button>
                                <button
                                    className={`kiosk-action-btn btn-success ${valveState === 'ON' ? 'disabled' : ''}`}
                                    onClick={() => toggleKioskVvalve('ON')}
                                    disabled={valveState === 'ON'}
                                >
                                    🟢 {lang === 'Hindi' ? 'पंप चालू करें' : lang === 'Telugu' ? 'పంపు ఆన్ చేయండి' : 'TURN PUMP ON'}
                                </button>
                            </div>

                            <div className="border-t border-gray-700 w-full pt-4 text-center">
                                <p className="text-xs mb-2">{lang === 'Hindi' ? 'स्वचालित सिंचाई (कृत्रिम बुद्धि) नियंत्रण' : lang === 'Telugu' ? 'ఆటోమేటిక్ కంట్రోల్' : 'Automatic AI Sprinkler Routine'}</p>
                                <div className="flex justify-center gap-2">
                                    <button
                                        onClick={() => toggleKioskMode('AUTO')}
                                        className={`kiosk-mode-btn ${irrigationMode === 'AUTO' ? 'active' : ''}`}
                                    >
                                        Set to AUTO Mode
                                    </button>
                                    <button
                                        onClick={() => toggleKioskMode('MANUAL')}
                                        className={`kiosk-mode-btn ${irrigationMode === 'MANUAL' ? 'active' : ''}`}
                                    >
                                        Set to MANUAL Mode
                                    </button>
                                </div>
                            </div>
                        </div>
                    </div>
                )}

                {activeScreen === 'ai' && (() => {
                    const recs = api.getCropRecommendations(dbState.activeFarmerId);

                    const getLocalizedCrop = (cName) => {
                        if (lang === 'Hindi') {
                            if (cName === 'Groundnut') return 'मूंगफली';
                            if (cName === 'Tomato') return 'टमाटर';
                            if (cName === 'Maize') return 'मक्का';
                            if (cName === 'Basmati Rice') return 'बासमती धान';
                            if (cName === 'Wheat') return 'गेहूं';
                            if (cName === 'Chickpea') return 'चना / छोले';
                        } else if (lang === 'Telugu') {
                            if (cName === 'Groundnut') return 'వేరుశనగ';
                            if (cName === 'Tomato') return 'టమోటా';
                            if (cName === 'Maize') return 'మొక్కజొన్న';
                            if (cName === 'Basmati Rice') return 'బాస్మతి వరి';
                            if (cName === 'Wheat') return 'గోధుమ';
                            if (cName === 'Chickpea') return 'శనగలు';
                        }
                        return cName;
                    };

                    const getLocalizedRotation = (rDesc) => {
                        if (lang === 'Hindi') {
                            if (rDesc.includes('Excellent')) return 'उत्कृष्ट (नाइट्रोजन वृद्धि चक्र)';
                            if (rDesc.includes('Avoid')) return 'बचें (एक ही फसल उगाने का जोखिम)';
                            return 'सामान्य फसल चक्र';
                        } else if (lang === 'Telugu') {
                            if (rDesc.includes('Excellent')) return 'అత్యుత్తమమైనది (నత్రజని పెరుగుదల)';
                            if (rDesc.includes('Avoid')) return 'నివారించండి (కీటకాల ముప్పు)';
                            return 'సాధారణ పంట మార్పిడి';
                        }
                        return rDesc;
                    };

                    return (
                        <div className="kiosk-subscreen">
                            <div className="kiosk-subscreen-header flex justify-between items-center mb-4">
                                <h3>🌾 {t.fertilizerBtn}</h3>
                                <button className="kiosk-back-btn" onClick={() => handleScreenChange('menu')}>← {t.goBack}</button>
                            </div>

                            <div className="kiosk-ai-layout grid grid-cols-2 gap-4">
                                {/* Left Column: Diagnostics */}
                                <div className="flex flex-col gap-3">
                                    <div className="kiosk-alert-box alert-warning">
                                        <h4>⚠️ {lang === 'Hindi' ? 'नाइट्रोजन की कमी पाई गई' : lang === 'Telugu' ? 'నత్రజని లోపం కన్పించింది' : 'Nutrient Warning: Nitrogen Level Low'}</h4>
                                        <p>{lang === 'Hindi' ? 'मिट्टी में नाइट्रोजन का स्तर 42 mg/kg पाया गया है जो लक्ष्य स्तर 50 mg/kg से कम है।' : lang === 'Telugu' ? 'నత్రజని ప్రస్తుతం 42 mg/kg గా ఉంది. లక్ష్యం 50 mg/kg.' : 'NPK Sensor telemetry detects Nitrogen at 42 mg/kg, which is below the optimal rice crop value of 50 mg/kg.'}</p>
                                    </div>

                                    <div className="kiosk-alert-box alert-info">
                                        <h4>💡 {lang === 'Hindi' ? 'सलाह: जैविक खाद का उपयोग करें' : lang === 'Telugu' ? 'సలహా: సేంద్రియ ఎరువులు వాడండి' : 'Recommendation: Apply Neem-Coated Urea'}</h4>
                                        <p>{lang === 'Hindi' ? '1. खेत से अवांछित घास हटाएँ।\n2. प्रति एकड़ 20 किलोग्राम जैविक यूरिया का छिड़काव करें।' : lang === 'Telugu' ? '1. కలుపు మొక్కలను తొలగించండి.\n2. ఎకరానికి 20 కిలోల వేప పిండి లేదా యూరియా వేయండి.' : '1. Schedule manual weeding beforehand.\n2. Top-dress with 20kg neem-coated urea per acre.'}</p>
                                    </div>
                                </div>

                                {/* Right Column: Suitability Advisor */}
                                <div className="kiosk-crop-recs-panel bg-slate-900/60 p-4 rounded-xl border border-slate-700/50 flex flex-col gap-3 text-white">
                                    <h4 className="text-yellow-400 text-sm font-bold border-b border-slate-700 pb-1.5 uppercase">
                                        🔮 {lang === 'Hindi' ? 'प्री-सोइंग फसल सुझाव' : lang === 'Telugu' ? 'పంట సిఫార్సుల సలహా' : 'Top Pre-Sowing Crop Suitability'}
                                    </h4>

                                    <div className="flex flex-col gap-2.5">
                                        {recs.map((crop) => (
                                            <div key={crop.name} className="kiosk-rec-card bg-slate-800/40 p-2.5 rounded-lg border border-slate-700">
                                                <div className="flex justify-between items-center">
                                                    <span className="font-bold text-[13px]">{getLocalizedCrop(crop.name)}</span>
                                                    <span className="text-[11px] font-mono text-teal-400 font-bold bg-teal-950/80 px-2 py-0.5 rounded border border-teal-900">
                                                        {crop.score}% {lang === 'Hindi' ? 'उपयुक्त' : lang === 'Telugu' ? 'అనుకూలం' : 'suitability'}
                                                    </span>
                                                </div>
                                                <p className="text-[10px] text-slate-300 leading-tight mt-1">
                                                    {lang === 'Hindi' ? 'मिट्टी प्रकार और कम पानी की आवश्यकता के कारण उत्कृष्ट।' : lang === 'Telugu' ? 'తేమ మరియు ప్రత్యామ్నాయ రకాలకు శ్రేష్టం.' : crop.description}
                                                </p>
                                                <div className="grid grid-cols-2 gap-x-2 gap-y-0.5 mt-2 pt-1.5 border-t border-slate-700/40 text-[9px] font-mono text-slate-400">
                                                    <div>🌱 {lang === 'Hindi' ? 'मिट्टी' : lang === 'Telugu' ? 'నేల' : 'Soil'}: <span className="text-emerald-400">{crop.soilSuitability}</span></div>
                                                    <div>💧 {lang === 'Hindi' ? 'जल आवश्यकता' : lang === 'Telugu' ? 'నీరు' : 'Water'}: <span className="text-blue-300">{crop.waterRequirement}</span></div>
                                                    <div className="col-span-2 text-teal-400 mt-0.5">
                                                        🔄 {lang === 'Hindi' ? 'चक्र' : lang === 'Telugu' ? 'మార్పిడి' : 'Rotation'}: {getLocalizedRotation(crop.rotationMatch)}
                                                    </div>
                                                </div>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            </div>
                        </div>
                    );
                })()}

                {activeScreen === 'schemes' && (
                    <div className="kiosk-subscreen">
                        <div className="kiosk-subscreen-header flex justify-between items-center">
                            <h3>📜 {t.governmentBtn}</h3>
                            <button className="kiosk-back-btn" onClick={() => handleScreenChange('menu')}>← {t.goBack}</button>
                        </div>

                        <div className="schemes-list grid grid-cols-2 gap-4">
                            <div className="scheme-card bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-green-700">1. Pradhan Mantri Krishi Sinchayee Yojana</h4>
                                <p className="text-xs mt-1 text-gray-700">Get up to 80% subsidy on installation of micro-drip and sprinkler irrigation equipment. Simple application with land documentation.</p>
                            </div>
                            <div className="scheme-card bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-green-700">2. PM-KUSUM Solar Pump Scheme</h4>
                                <p className="text-xs mt-1 text-gray-700">Replace electric pumps with off-grid solar-powered agricultural pumps. Government finances 60% of original pump cost.</p>
                            </div>
                            <div className="scheme-card bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-green-700">3. Soil Health Card Mission</h4>
                                <p className="text-xs mt-1 text-gray-700">Submit soil samples at your nearest Taluka Soil Laboratory for free comprehensive chemical nutrient profiles every 2 years.</p>
                            </div>
                            <div className="scheme-card bg-gray-50 p-4 rounded-lg">
                                <h4 className="font-bold text-green-700">4. Pradhan Mantri Fasal Bima Yojana</h4>
                                <p className="text-xs mt-1 text-gray-700">Low-cost crop insurance shield protecting against natural storms, droughts, local pests, floods, and unseasonal rainfall damages.</p>
                            </div>
                        </div>
                    </div>
                )}

            </div>

            {/* Kiosk Under-Bar */}
            <div className="kiosk-footer-status">
                <span>📍 Rural e-Choupal Centre #402 - Karnal Hub</span>
                <span>🖥️ High-Contrast Kiosk Mode (Offline Enabled)</span>
            </div>
        </div>
    );
}
