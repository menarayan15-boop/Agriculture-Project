import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { ttsEngine } from '../../services/ai/ttsService';
import { getAiAnswerDetails } from '../../services/ai/aiReasoningService';
import { AGRICULTURAL_QUESTION_BANK, QUESTION_CATEGORIES } from '../../data/agriculturalQuestionBank';

/* ═══════════════════════════════════════════════════════════════════
 *  CONSTANTS & LANGUAGE CONFIG
 * ═══════════════════════════════════════════════════════════════════ */
const GROQ_KEY = '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';
const GROQ_STT = 'https://api.groq.com/openai/v1/audio/transcriptions';

const LANGS = [
  { code: 'en-IN', label: '🇬🇧 English', iso: 'en' },
  { code: 'hi-IN', label: '🇮🇳 हिन्दी', iso: 'hi' },
  { code: 'pa-IN', label: '🌾 ਪੰਜਾਬੀ', iso: 'pa' },
  { code: 'te-IN', label: '🍃 తెలుగు', iso: 'te' },
  { code: 'ta-IN', label: '🪷 தமிழ்', iso: 'ta' },
  { code: 'kn-IN', label: '🌱 ಕನ್ನಡ', iso: 'kn' },
  { code: 'mr-IN', label: '🌿 मराठी', iso: 'mr' },
  { code: 'bn-IN', label: '🌾 বাংলা', iso: 'bn' },
  { code: 'gu-IN', label: '🪴 ગુજરાતી', iso: 'gu' },
  { code: 'or-IN', label: '🌾 ଓଡ଼ିଆ', iso: 'or' },
];

const CATEGORY_TABS = [
  { id: 'all', labelEn: '🔥 Top Questions', labelHi: '🔥 मुख्य प्रश्न', icon: '🌟' },
  { id: QUESTION_CATEGORIES.GENERAL_VOICE_AI, labelEn: '🌱 Crop Cultivation', labelHi: '🌱 फसल बुवाई व खेती', icon: '🎋' },
  { id: QUESTION_CATEGORIES.FERTILIZERS, labelEn: '🧪 Fertilizers & NPK', labelHi: '🧪 खाद व पोषण', icon: '💊' },
  { id: QUESTION_CATEGORIES.GROWTH_PROBLEMS, labelEn: '🍂 Leaf & Growth Issues', labelHi: '🍂 पत्तियां व बढ़वार', icon: '🍁' },
  { id: QUESTION_CATEGORIES.PESTS_INSECTS, labelEn: '🐛 Pests & Insects', labelHi: '🐛 कीट व रोकथाम', icon: '🐞' },
  { id: QUESTION_CATEGORIES.CROP_DISEASES, labelEn: '🦠 Diseases & Blight', labelHi: '🦠 रोग व झुलसा', icon: '🍄' },
  { id: QUESTION_CATEGORIES.IRRIGATION, labelEn: '💧 Water & Irrigation', labelHi: '💧 पानी व सिंचाई', icon: '🌊' },
  { id: QUESTION_CATEGORIES.WEED_MANAGEMENT, labelEn: '🌿 Weed Control', labelHi: '🌿 खरपतवार नियंत्रण', icon: '🌾' },
  { id: QUESTION_CATEGORIES.SOIL_HEALTH, labelEn: '🗺️ Soil Testing', labelHi: '🗺️ मिट्टी जांच', icon: '🧪' },
  { id: QUESTION_CATEGORIES.MACHINERY_RENTAL, labelEn: '🚜 Machinery Rental', labelHi: '🚜 मशीनरी किराया', icon: '🚜' },
  { id: QUESTION_CATEGORIES.MANDI_SELLING, labelEn: '💰 Mandi & MSP', labelHi: '💰 मंडी भाव व बिक्री', icon: '📈' },
];

export function detectNavigationTab(text) {
  if (!text) return null;
  const q = text.toLowerCase();

  if (q.match(/मौसम|weather|rain|barsat|barish|बारिश|तापमान|forecast/)) {
    if (q.match(/open|show|go to|take me|खोलो|दिखाओ|जाना|ले चलो|चलो|बताओ|देखो|पेज/)) return 'weather';
  }
  if (q.match(/किराए|किराया|tractor|ट्रैक्टर|rent|machinery|rental|मशीन|harvest|कंबाइन/)) {
    if (q.match(/open|show|go to|book|rent|खोलो|दिखाओ|चाहिए|लेना|बुक|जाना|ले चलो|पेज/)) return 'rentals';
  }
  if (q.match(/calculator|कैलकुलेटर|खाद का हिसाब|fertilizer calc|कैलकुलेट/)) {
    if (q.match(/open|show|go to|खोलो|दिखाओ|जाना|ले चलो|हिसाब|पेज/)) return 'calculator';
  }
  if (q.match(/soil lab|soil test|मिट्टी जांच|मिट्टी परीक्षण|lab|लैब/)) {
    if (q.match(/open|show|go to|खोलो|दिखाओ|जाना|ले चलो|पेज/)) return 'soillab';
  }
  if (q.match(/mandi|मंडी भाव|मंडी रेट|bhav|market rate/)) {
    if (q.match(/open|show|go to|खोलो|दिखाओ|जाना|ले चलो|दिखा|पेज/)) return 'mandi';
  }
  if (q.match(/scheme|योजना|सब्सिडी|pm kisan|pm-kusum|kusum|बीमा/)) {
    if (q.match(/open|show|go to|खोलो|दिखाओ|जाना|ले चलो|देखनी|पेज/)) return 'schemes';
  }
  if (q.match(/doctor|advisor|डॉक्टर|सलाहकार|दवाई|स्प्रे/)) {
    if (q.match(/open|show|go to|खोलो|दिखाओ|जाना|ले चलो|पेज/)) return 'advisor';
  }
  if (q.match(/marketplace|मार्केट|फसल बेचना|बाजार|direct sell|खरीदार/)) {
    if (q.match(/open|show|go to|खोलो|दिखाओ|जाना|ले चलो|पेज/)) return 'marketplace';
  }
  if (q.match(/education|school|पाठशाला|वीडियो|video|खेती सीखें|ट्रेनिंग/)) {
    if (q.match(/open|show|go to|खोलो|दिखाओ|जाना|ले चलो|पेज/)) return 'education';
  }
  if (q.match(/planner|प्लानर|कैलेंडर|roadmap/)) {
    if (q.match(/open|show|go to|खोलो|दिखाओ|जाना|ले चलो|पेज/)) return 'planner';
  }
  if (q.match(/dashboard|डैशबोर्ड|होम|home|मुख्य पेज/)) {
    if (q.match(/open|show|go to|खोलो|दिखाओ|जाना|ले चलो|पेज/)) return 'dashboard';
  }

  return null;
}

async function groqWhisper(blob, apiKey, iso) {
  const fd = new FormData();
  fd.append('file', blob, 'rec.webm');
  fd.append('model', 'whisper-large-v3');
  fd.append('language', iso);
  const res = await fetch(GROQ_STT, {
    method: 'POST',
    headers: { 'Authorization': `Bearer ${apiKey}` },
    body: fd
  });
  if (!res.ok) throw new Error(`Whisper HTTP ${res.status}`);
  const d = await res.json();
  return d?.text?.trim() || '';
}

function speak(text, langCode, onStart, onEnd) {
  if (!text) return;
  ttsEngine.speak(text, langCode, 1.0, { onStart, onEnd });
}

export function VoiceAiTab() {
  const { lang, crop, soil, location, area, geminiKey, saveAiKey, setActiveTab } = useApp();

  const [voiceLang, setVoiceLang] = useState(() => {
    const match = LANGS.find(l => l.iso === lang);
    return match ? match.code : 'en-IN';
  });
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [isRec, setIsRec] = useState(false);
  const [recSec, setRecSec] = useState(0);
  const [thinking, setThinking] = useState(false);
  const [speaking, setSpeaking] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [micErr, setMicErr] = useState('');
  const [input, setInput] = useState('');
  const [msgs, setMsgs] = useState([]);
  const [showKey, setShowKey] = useState(false);
  const [tmpKey, setTmpKey] = useState(geminiKey || '');

  const recRef = useRef(null);
  const chunks = useRef([]);
  const timer = useRef(null);
  const chatEnd = useRef(null);

  const webSpeechRef = useRef(null);
  const liveTranscriptRef = useRef('');

  useEffect(() => { setTmpKey(geminiKey || ''); }, [geminiKey]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  useEffect(() => {
    const match = LANGS.find(l => l.iso === lang);
    if (match) setVoiceLang(match.code);
  }, [lang]);

  useEffect(() => {
    return () => {
      ttsEngine.stop();
    };
  }, []);

  const key = (geminiKey && geminiKey.trim()) || GROQ_KEY;
  const iso = LANGS.find(l => l.code === voiceLang)?.iso || 'en';
  const cropEn = crop?.nameEn || crop?.name || '';
  const soilEn = soil?.nameEn || soil?.name || '';
  const areaVal = area || '';
  const isHi = voiceLang === 'hi-IN';

  /* ── Mic Recording ── */
  const startRec = useCallback(async () => {
    setMicErr(''); setTranscript(''); setRecSec(0);
    liveTranscriptRef.current = '';
    ttsEngine.stop(); setSpeaking(false);

    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const sr = new SpeechRecognition();
        sr.lang = voiceLang;
        sr.interimResults = true;
        sr.continuous = true;
        sr.onresult = (e) => {
          let str = '';
          for (let i = 0; i < e.results.length; i++) {
            str += e.results[i][0].transcript + ' ';
          }
          const t = str.trim();
          if (t) {
            liveTranscriptRef.current = t;
            setTranscript(t);
          }
        };
        sr.start();
        webSpeechRef.current = sr;
      } catch (e) {
        console.warn('SpeechRecognition init:', e.message);
      }
    }

    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      chunks.current = [];
      let mime = 'audio/webm';
      if (!MediaRecorder.isTypeSupported(mime)) mime = MediaRecorder.isTypeSupported('audio/mp4') ? 'audio/mp4' : '';
      const mr = mime ? new MediaRecorder(stream, { mimeType: mime }) : new MediaRecorder(stream);
      mr.ondataavailable = e => { if (e.data?.size > 0) chunks.current.push(e.data); };
      mr.start(250);
      recRef.current = { mr, stream };
      setIsRec(true);
      timer.current = setInterval(() => setRecSec(s => s + 1), 1000);
    } catch (e) {
      setMicErr(e.name === 'NotAllowedError'
        ? '⚠️ Microphone blocked. Allow permission in browser address bar (🔒).'
        : `⚠️ Mic error: ${e.message}`);
    }
  }, [voiceLang]);

  const stopRec = useCallback(async () => {
    clearInterval(timer.current);

    if (webSpeechRef.current) {
      try { webSpeechRef.current.stop(); } catch (e) { }
      webSpeechRef.current = null;
    }

    if (!recRef.current) { setIsRec(false); return null; }
    const { mr, stream } = recRef.current;
    return new Promise(resolve => {
      mr.onstop = () => {
        stream.getTracks().forEach(t => t.stop());
        const blob = new Blob(chunks.current, { type: mr.mimeType || 'audio/webm' });
        recRef.current = null;
        setIsRec(false);
        resolve(blob);
      };
      if (mr.state !== 'inactive') mr.stop(); else { setIsRec(false); resolve(null); }
    });
  }, []);

  /* ── Query Processing ── */
  const processQuery = useCallback(async (text) => {
    if (!text?.trim() || thinking) return;
    const queryText = text.trim();
    setThinking(true); setMicErr('');

    const navTab = detectNavigationTab(queryText);
    if (navTab && setActiveTab) {
      const tabNamesHi = {
        weather: 'मौसम पूर्वानुमान', rentals: 'मशीनरी किराया', calculator: 'खाद कैलकुलेटर',
        soillab: 'मिट्टी जांच लैब', mandi: 'मंडी भाव', schemes: 'सरकारी योजनाएं',
        advisor: 'फसल डॉक्टर', marketplace: 'किसान बाजार', education: 'वीडियो पाठशाला',
        planner: 'फसल कैलेंडर', dashboard: 'मुख्य डैशबोर्ड'
      };
      const tabNamesEn = {
        weather: 'Weather Forecast', rentals: 'Machinery Rentals', calculator: 'Fertilizer Calculator',
        soillab: 'Soil Testing Lab', mandi: 'Live Mandi Rates', schemes: 'Government Schemes',
        advisor: 'Crop Doctor', marketplace: 'Farmers Marketplace', education: 'Farm Video School',
        planner: 'Crop Planner', dashboard: 'Farm Dashboard'
      };
      const navAnswer = isHi
        ? `जी किसान भाई, मैं आपको ${tabNamesHi[navTab] || 'पेज'} पर ले जा रहा हूँ।`
        : `Sure farmer friend! Opening ${tabNamesEn[navTab] || 'the requested page'}.`;

      setThinking(false);
      setMsgs(prev => [...prev.slice(-10), { role: 'user', text: queryText }, { role: 'ai', text: navAnswer, intent: 'navigation' }]);
      speak(navAnswer, voiceLang, () => setSpeaking(true), () => setSpeaking(false));
      setTimeout(() => { setActiveTab(navTab); }, 2000);
      return;
    }

    try {
      const result = await getAiAnswerDetails(queryText, {
        crop,
        soil,
        location,
        area,
        langCode: voiceLang,
        apiKey: key,
        chatHistory: msgs
      });

      setThinking(false);
      setMsgs(prev => [
        ...prev.slice(-10),
        { role: 'user', text: queryText },
        {
          role: 'ai',
          text: result.answer,
          crop: result.crop,
          intent: result.intent,
          missingContext: result.missingContext
        }
      ]);
      speak(result.answer, voiceLang, () => setSpeaking(true), () => setSpeaking(false));
    } catch (err) {
      console.error('AI processing error:', err);
      setThinking(false);
      setMicErr('⚠️ Could not process question. Please try again.');
    }
  }, [crop, soil, location, area, voiceLang, key, msgs, setActiveTab, isHi, thinking]);

  const handleMic = useCallback(async () => {
    if (isRec) {
      const blob = await stopRec();
      setThinking(true);
      let txt = '';

      if (blob && blob.size >= 1000) {
        try {
          txt = await groqWhisper(blob, key, iso);
        } catch (e) {
          console.warn('Groq Whisper failed (fallback to browser STT):', e.message);
        }
      }

      if (!txt || !txt.trim()) {
        txt = liveTranscriptRef.current.trim();
      }

      if (txt && txt.trim()) {
        setTranscript(txt);
        setMicErr('');
        await processQuery(txt);
      } else {
        setThinking(false);
        setMicErr('ℹ️ Could not hear speech clearly. Tap mic and speak again.');
      }
    } else {
      await startRec();
    }
  }, [isRec, stopRec, startRec, key, iso, processQuery]);

  const handleSend = useCallback(() => {
    if (input.trim()) { processQuery(input.trim()); setInput(''); }
  }, [input, processQuery]);

  const stopSpeaking = useCallback(() => {
    ttsEngine.stop();
    setSpeaking(false);
  }, []);

  // Filtered Question Bank Questions for Current Category
  const displayedQuestions = React.useMemo(() => {
    if (selectedCategory === 'all') {
      return [
        { q: isHi ? 'गन्ना की वैज्ञानिक खेती कैसे करें?' : 'How to grow sugarcane?', crop: 'Sugarcane', icon: '🎋', c: '#16a34a' },
        { q: isHi ? 'चना की बुवाई व खेती कैसे करें?' : 'How to grow chickpea?', crop: 'Chickpea', icon: '🌱', c: '#10b981' },
        { q: isHi ? 'धान की रोपाई व देखभाल कैसे करें?' : 'How to grow rice?', crop: 'Rice', icon: '🌾', c: '#0284c7' },
        { q: isHi ? 'गेहूं में पहली सिंचाई और खाद?' : 'How to grow wheat?', crop: 'Wheat', icon: '🌾', c: '#d97706' },
        { q: isHi ? 'कपास की पत्तियां लाल क्यों हो रही हैं?' : 'Why are cotton leaves turning red?', crop: 'Cotton', icon: '🍂', c: '#ef4444' },
        { q: isHi ? 'टमाटर के लिए सबसे अच्छी खाद कौन सी है?' : 'What fertilizer is suitable for tomato?', crop: 'Tomato', icon: '🧪', c: '#f59e0b' },
        { q: isHi ? 'काली मिट्टी में कौन सी फसल बोनी चाहिए?' : 'Which crop is suitable for black soil?', crop: 'Soil', icon: '🗺️', c: '#8b5cf6' },
        { q: isHi ? 'कपास में गुलाबी सुंडी का उपचार?' : 'Which pesticide is suitable for cotton bollworm?', crop: 'Cotton', icon: '🐛', c: '#ec4899' },
      ];
    }

    return AGRICULTURAL_QUESTION_BANK
      .filter(item => item.category === selectedCategory)
      .slice(0, 8)
      .map(item => ({
        q: item.question,
        crop: item.entities?.crop || 'Agri',
        icon: '🌾',
        c: '#15803D'
      }));
  }, [selectedCategory, isHi]);

  /* ── Styles ── */
  const S = {
    wrap: { padding: '14px', maxWidth: '880px', margin: '0 auto', fontFamily: "'Inter', sans-serif" },
    banner: { background: 'linear-gradient(135deg, #F0FDF4 0%, #DCFCE7 100%)', border: '1.5px solid #86EFAC', borderRadius: '16px', padding: '24px', color: '#17211B', marginBottom: '16px', textAlign: 'center', position: 'relative', boxShadow: '0 4px 16px rgba(21, 128, 61, 0.06)' },
    keyBadge: { position: 'absolute', top: 12, right: 14, background: '#EFF6FF', border: '1px solid #BFDBFE', color: '#1D4ED8', fontSize: 12, fontWeight: 700, padding: '4px 12px', borderRadius: 20, cursor: 'pointer' },
    langBar: { display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 14 },
    langBtn: (active) => ({ padding: '7px 16px', borderRadius: 22, border: active ? '1.5px solid #15803D' : '1px solid #E5E7EB', background: active ? '#15803D' : '#FFFFFF', color: active ? '#FFFFFF' : '#374151', fontSize: 13, fontWeight: active ? 700 : 600, cursor: 'pointer', transition: 'all .2s', transform: active ? 'scale(1.03)' : 'none', boxShadow: active ? '0 2px 8px rgba(21, 128, 61, 0.25)' : '0 1px 3px rgba(0,0,0,0.03)' }),
    micZone: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '32px 16px', background: isRec ? '#FEF2F2' : thinking ? '#F0F9FF' : '#FFFFFF', border: `1.5px solid ${isRec ? '#FCA5A5' : thinking ? '#BAE6FD' : '#E5E7EB'}`, borderRadius: 16, marginBottom: 16, transition: 'all .3s', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
    micBtn: { width: 110, height: 110, borderRadius: '50%', border: 'none', cursor: thinking ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, color: '#fff', background: isRec ? 'linear-gradient(135deg,#EF4444,#DC2626)' : thinking ? 'linear-gradient(135deg,#0284C7,#0369A1)' : 'linear-gradient(135deg,#15803D,#166534)', boxShadow: isRec ? '0 0 0 12px rgba(239,68,68,.18),0 6px 20px rgba(239,68,68,.35)' : '0 0 0 10px rgba(21,128,61,.15),0 6px 18px rgba(21,128,61,.25)', transition: 'all .3s' },
    status: { marginTop: 16, fontSize: 16, fontWeight: 800, color: isRec ? '#DC2626' : thinking ? '#0284C7' : speaking ? '#15803D' : '#15803D', textAlign: 'center' },
    categoryBar: { display: 'flex', gap: 8, overflowX: 'auto', paddingBottom: 10, marginBottom: 14, scrollbarWidth: 'thin' },
    categoryChip: (active) => ({ padding: '8px 14px', borderRadius: 20, whiteSpace: 'nowrap', border: active ? '1.5px solid #15803D' : '1px solid #E5E7EB', background: active ? '#DCFCE7' : '#FFFFFF', color: active ? '#166534' : '#4B5563', fontSize: 13, fontWeight: active ? 800 : 600, cursor: 'pointer', transition: 'all .2s' }),
    inputBar: { display: 'flex', gap: 8, marginBottom: 16 },
    inputField: { flex: 1, padding: '14px 18px', borderRadius: 12, border: '1.5px solid #E5E7EB', background: '#FFFFFF', color: '#17211B', fontSize: 14, outline: 'none', boxShadow: '0 1px 3px rgba(0,0,0,0.02)' },
    sendBtn: { padding: '14px 24px', borderRadius: 12, border: 'none', background: '#15803D', color: '#FFFFFF', fontSize: 14, fontWeight: 800, cursor: 'pointer', boxShadow: '0 2px 8px rgba(21, 128, 61, 0.25)' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 12, marginBottom: 16 },
    card: (c) => ({ background: '#FFFFFF', border: `1px solid #E5E7EB`, borderLeft: `4px solid ${c}`, borderRadius: 12, padding: '14px 16px', cursor: 'pointer', transition: 'all .2s', boxShadow: '0 2px 8px rgba(0,0,0,0.02)' }),
    chatWrap: { background: '#FFFFFF', borderRadius: 16, padding: 20, marginBottom: 16, border: '1.5px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.03)' },
    msgBubble: (isUser) => ({ background: isUser ? '#F0FDF4' : '#F0F9FF', borderRadius: isUser ? '14px 14px 14px 2px' : '14px 14px 2px 14px', padding: '14px 18px', marginBottom: 14, borderLeft: `4px solid ${isUser ? '#15803D' : '#0284C7'}`, color: '#17211B', fontSize: 14, lineHeight: 1.6, borderTop: '1px solid #E5E7EB', borderRight: '1px solid #E5E7EB', borderBottom: '1px solid #E5E7EB' }),
    replayBtn: { marginTop: 10, padding: '6px 14px', borderRadius: 8, border: '1px solid #BAE6FD', background: '#E0F2FE', color: '#0369A1', fontSize: 12, fontWeight: 700, cursor: 'pointer', display: 'inline-flex', alignItems: 'center', gap: 6 },
    badge: (bg, color) => ({ display: 'inline-flex', alignItems: 'center', gap: 4, padding: '3px 8px', borderRadius: 12, fontSize: 11, fontWeight: 700, background: bg, color: color, marginRight: 6, marginBottom: 6 })
  };

  return (
    <div className="tab-panel active" style={{ padding: 0 }}>
      <div style={S.wrap}>

        {/* Banner */}
        <div style={S.banner}>
          <button type="button" style={S.keyBadge} onClick={() => setShowKey(!showKey)}>
            <i className="fa-solid fa-bolt" /> {geminiKey ? (geminiKey.startsWith('gsk_') ? '⚡ Groq Connected' : '🔑 Custom Key') : '⚡ Connect Groq API'}
          </button>
          <div style={{ fontSize: 12, color: '#166534', fontWeight: 600, marginBottom: 5 }}>
            <i className="fa-solid fa-microchip" /> Voice AI + Precision Agronomic Question Bank
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 22, fontWeight: 900, color: '#17211B' }}>
            🎙️ {isHi ? 'कृषि AI ध्वनि सलाहकार व सम्पूर्ण प्रश्न बैंक' : 'Krishi AI Voice & Agricultural Question Bank'}
          </h2>
          <p style={{ margin: 0, fontSize: 14, color: '#4B5563', lineHeight: 1.5 }}>
            {isHi
              ? 'गन्ना, चना, धान, गेहूं, कपास, टमाटर या किसी भी फसल की वैज्ञानिक बुवाई, खाद, पानी और कीट सुरक्षा की सटीक सलाह'
              : 'Ask specific cultivation, fertilizer doses, pest remedies, and irrigation schedules for any crop'}
          </p>
          <div style={S.langBar}>
            {LANGS.map(l => (
              <button key={l.code} type="button" style={S.langBtn(voiceLang === l.code)}
                onClick={() => { setVoiceLang(l.code); setMicErr(''); setTranscript(''); ttsEngine.stop(); setSpeaking(false); if (isRec) stopRec(); }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* API Key Modal / Drawer */}
        {showKey && (
          <form onSubmit={e => { e.preventDefault(); saveAiKey(tmpKey.trim()); setShowKey(false); }}
            style={{ background: '#FFFFFF', border: '1.5px solid #86EFAC', borderRadius: 14, padding: '16px 20px', marginBottom: 16, color: '#17211B', boxShadow: '0 4px 12px rgba(0,0,0,0.04)' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
              <span style={{ fontSize: 13, fontWeight: 800, color: '#15803D' }}>⚡ Connect Groq API / Gemini Key</span>
              <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" style={{ fontSize: 12, color: '#166534', fontWeight: 700, textDecoration: 'underline' }}>
                Get Free Groq Key &rarr;
              </a>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="password" value={tmpKey} onChange={e => setTmpKey(e.target.value)} placeholder="Paste Groq Key (gsk_...) or Gemini (AIza...)" style={{ flex: 1, padding: '10px 14px', borderRadius: 8, border: '1.5px solid #E5E7EB', background: '#F8FAF9', color: '#17211B', fontSize: 13 }} />
              <button type="submit" style={{ padding: '10px 20px', borderRadius: 8, border: 'none', background: '#15803D', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>Connect</button>
            </div>
          </form>
        )}

        {/* Mic Interactive Zone */}
        <div style={S.micZone}>
          {speaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              style={{
                position: 'absolute', top: 14, right: 14,
                background: '#FEE2E2', border: '1px solid #FCA5A5',
                color: '#DC2626', padding: '6px 14px', borderRadius: 8, fontSize: 12,
                fontWeight: 700, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}>
              <i className="fa-solid fa-stop" /> Stop Speaking
            </button>
          )}
          <button type="button" style={S.micBtn} onClick={handleMic} disabled={thinking}>
            <i className={`fa-solid ${isRec ? 'fa-stop' : thinking ? 'fa-spinner fa-spin' : 'fa-microphone'}`} />
          </button>
          <div style={S.status}>
            {isRec ? `🔴 Recording (${recSec}s) — Tap to stop & ask`
              : thinking ? '🔵 Analyzing with Krishi AI...'
                : speaking ? '🔊 Speaking crop advice...'
                  : isHi ? '🟢 माइक दबाएं और अपना सवाल बोलें' : '🟢 Tap mic to speak your question'}
          </div>
          {transcript && (
            <div style={{ background: '#EFF6FF', border: '1.5px solid #BFDBFE', color: '#1D4ED8', padding: '10px 20px', borderRadius: 12, marginTop: 12, fontSize: 14, fontWeight: 700, textAlign: 'center' }}>
              🗣️ "{transcript}"
            </div>
          )}
          {micErr && (
            <div style={{ background: '#FEF2F2', border: '1.5px solid #FECACA', color: '#DC2626', padding: '10px 20px', borderRadius: 12, marginTop: 12, fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
              {micErr}
            </div>
          )}
          <p style={{ margin: '8px 0 0', fontSize: 12, color: '#6B7280', textAlign: 'center', fontWeight: 500 }}>
            {cropEn || 'Crop Not Set'} | {areaVal ? `${areaVal} Acre` : 'Area Not Set'} | {soilEn || 'Soil Not Set'} | {LANGS.find(l => l.code === voiceLang)?.label}
          </p>
        </div>

        {/* Text Input */}
        <div style={S.inputBar}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder={isHi ? 'अपना कृषि प्रश्न यहाँ लिखें (उदा. गन्ने की खेती, कपास की लाल पत्तियां, चना में सिंचाई)...' : 'Type your crop question (e.g., How to grow sugarcane, cotton leaves turning red, chickpea irrigation)...'}
            style={S.inputField} />
          <button type="button" onClick={handleSend} style={S.sendBtn} disabled={thinking}>
            <i className="fa-solid fa-paper-plane" /> {isHi ? 'पूछें' : 'Ask'}
          </button>
        </div>

        {/* Question Bank Category Tabs */}
        <div style={{ marginBottom: 8, fontSize: 13, fontWeight: 800, color: '#374151' }}>
          📚 {isHi ? 'कृषि प्रश्न बैंक श्रेणियां:' : 'Question Bank Categories:'}
        </div>
        <div style={S.categoryBar}>
          {CATEGORY_TABS.map(cat => (
            <button key={cat.id} type="button" style={S.categoryChip(selectedCategory === cat.id)}
              onClick={() => setSelectedCategory(cat.id)}>
              {cat.icon} {isHi ? cat.labelHi : cat.labelEn}
            </button>
          ))}
        </div>

        {/* Quick Suggestion Cards */}
        <div style={S.grid}>
          {displayedQuestions.map((c, i) => (
            <div key={i} style={S.card(c.c)} onClick={() => processQuery(c.q)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
              }}
            >
              <div style={{ fontSize: 13, fontWeight: 800, color: '#15803D', marginBottom: 4 }}>
                {c.icon} {c.crop}
              </div>
              <div style={{ fontSize: 13, color: '#17211B', fontWeight: 600, lineHeight: 1.4 }}>
                "{c.q}"
              </div>
            </div>
          ))}
        </div>

        {/* Chat History with Badges & Replay */}
        {msgs.length > 0 && (
          <div style={S.chatWrap}>
            <h3 style={{ margin: '0 0 14px', fontSize: 16, fontWeight: 800, color: '#15803D' }}>
              <i className="fa-solid fa-comments" /> {isHi ? 'संवाद इतिहास' : 'Agricultural Consultation'}
            </h3>
            {msgs.map((m, i) => (
              <div key={i} style={S.msgBubble(m.role === 'user')}>
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: 6 }}>
                  <div style={{ fontSize: 12, fontWeight: 800, color: m.role === 'user' ? '#15803D' : '#0284C7' }}>
                    {m.role === 'user' ? (isHi ? '👤 आप (किसान):' : '👤 You:') : '🤖 Krishi AI:'}
                  </div>
                  {m.role === 'ai' && m.crop && (
                    <div>
                      <span style={S.badge('#DCFCE7', '#166534')}>
                        🌾 {m.crop.nameEn || m.crop.name || 'Crop'}
                      </span>
                      {m.intent && (
                        <span style={S.badge('#E0F2FE', '#0369A1')}>
                          🎯 {m.intent.replace(/_/g, ' ')}
                        </span>
                      )}
                    </div>
                  )}
                </div>
                <div>{m.text}</div>
                {m.role === 'ai' && (
                  <div style={{ marginTop: 8 }}>
                    <button type="button" style={S.replayBtn}
                      onClick={() => speak(m.text, voiceLang, () => setSpeaking(true), () => setSpeaking(false))}>
                      <i className="fa-solid fa-volume-high" /> {isHi ? 'सुनें' : 'Listen'}
                    </button>
                  </div>
                )}
              </div>
            ))}
            <div ref={chatEnd} />
          </div>
        )}

      </div>
    </div>
  );
}

export default VoiceAiTab;
