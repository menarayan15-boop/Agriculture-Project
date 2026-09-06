import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';

/* ═══════════════════════════════════════════════════════════════════
 *  CONSTANTS
 * ═══════════════════════════════════════════════════════════════════ */
const GROQ_KEY = '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';
const GROQ_CHAT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_STT = 'https://api.groq.com/openai/v1/audio/transcriptions';

const LANGS = [
  { code: 'en-IN', label: '🇬🇧 English', iso: 'en' },
  { code: 'hi-IN', label: '🇮🇳 हिन्दी', iso: 'hi' },
  { code: 'pa-IN', label: '🌾 ਪੰਜਾਬੀ', iso: 'pa' },
  { code: 'mr-IN', label: '🌿 मराठी', iso: 'mr' },
  { code: 'te-IN', label: '🍃 తెలుగు', iso: 'te' },
  { code: 'ta-IN', label: '🪷 தமிழ்', iso: 'ta' },
  { code: 'bn-IN', label: '🌾 বাংলা', iso: 'bn' },
];

const LANG_NAME = {
  'en': 'English', 'hi': 'Hindi (हिन्दी)', 'pa': 'Punjabi (ਪੰਜਾਬੀ)',
  'mr': 'Marathi (मराठी)', 'te': 'Telugu (తెలుగు)', 'ta': 'Tamil (தமிழ்)',
  'bn': 'Bengali (বাংলা)',
};

const CARDS = {
  'en-IN': [
    { icon: '🐛', t: 'Pest & Disease', q: 'How to control yellow rust and armyworm in wheat?', c: '#ef4444' },
    { icon: '🧪', t: 'Fertilizer Dose', q: 'Urea and DAP dose for 1 acre wheat?', c: '#10b981' },
    { icon: '💧', t: 'Irrigation', q: 'When should I give first irrigation in wheat?', c: '#38bdf8' },
    { icon: '💰', t: 'Mandi Rates', q: 'Today\'s wheat and paddy mandi prices?', c: '#f59e0b' },
    { icon: '🌿', t: 'Weed Control', q: 'How to control Phalaris minor weeds in wheat?', c: '#a855f7' },
    { icon: '🏛️', t: 'Govt Schemes', q: 'PM-KISAN and PM-KUSUM solar subsidy details', c: '#8b5cf6' },
  ],
  'hi-IN': [
    { icon: '🐛', t: 'रोग व कीट', q: 'गेहूं में पीला रतुआ और इल्ली नियंत्रण कैसे करें?', c: '#ef4444' },
    { icon: '🧪', t: 'खाद मात्रा', q: '1 एकड़ गेहूं के लिए यूरिया और DAP की मात्रा बताओ', c: '#10b981' },
    { icon: '💧', t: 'सिंचाई समय', q: 'गेहूं में पहला पानी कब लगाएं?', c: '#38bdf8' },
    { icon: '💰', t: 'मंडी भाव', q: 'गेहूं और धान का आज का मंडी भाव बताओ', c: '#f59e0b' },
    { icon: '🌿', t: 'खरपतवार', q: 'गेहूं में गुल्ली डंडा और बथुआ का इलाज बताओ', c: '#a855f7' },
    { icon: '🏛️', t: 'सरकारी योजना', q: 'PM किसान और सोलर पंप सब्सिडी की जानकारी दो', c: '#8b5cf6' },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
 *  HELPERS — All AI logic is INLINE here. Zero external dependencies.
 * ═══════════════════════════════════════════════════════════════════ */

function buildPrompt(crop, soil, loc, area, isoLang) {
  const langFull = LANG_NAME[isoLang] || 'English';
  return `You are "Krishi Jal AI" — a friendly senior Indian agricultural scientist and voice assistant.

FARMER CONTEXT:
- Crop: ${crop}
- Soil: ${soil}
- Location: ${loc}
- Farm: ${area} acres

RULES:
1. GREETING RULE: If the farmer says "hi", "hello", "hey", "namaste", "sat sri akal", or similar greetings, reply with a warm, friendly greeting in ${langFull} introducing yourself as Krishi AI and asking how you can help their ${crop} crop today.
2. Answer ONLY what is asked. No generic filler.
3. Give exact chemical names, dosages per acre, water volume when asked agricultural questions.
4. Respond strictly in ${langFull}.
5. Keep it 1-3 sentences. Concise and actionable.
6. NO markdown symbols. Pure plain text.`;
}

async function groqChat(query, systemPrompt, apiKey, cropEn, soilEn, locEn, areaVal, voiceLang) {
  // TIER 1: Python backend proxy (bypasses browser CORS + has SSL fix)
  try {
    const proxyRes = await fetch('/api/groq/chat', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        query: query,
        crop: cropEn,
        soil: soilEn,
        area: areaVal,
        location: locEn,
        lang: voiceLang,
        apiKey: apiKey
      })
    });
    if (proxyRes.ok) {
      const d = await proxyRes.json();
      if (d && d.answer && d.answer.trim()) {
        console.log('[AI] Got answer from backend proxy');
        return d.answer.replace(/[\*\#\`\_]/g, '').trim();
      }
    } else {
      console.warn('[AI] Backend proxy returned', proxyRes.status);
    }
  } catch (e) { console.warn('[AI] Backend proxy unreachable:', e.message); }

  // TIER 2A: Direct Gemini API fetch if user provided an AIza... key
  if (apiKey && apiKey.startsWith('AIza')) {
    try {
      const geminiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(apiKey)}`;
      const res = await fetch(geminiUrl, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          system_instruction: { parts: [{ text: systemPrompt }] },
          contents: [{ role: 'user', parts: [{ text: query }] }],
          generationConfig: { temperature: 0.7, maxOutputTokens: 500 }
        })
      });
      if (res.ok) {
        const d = await res.json();
        const txt = d?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (txt && txt.trim()) {
          console.log('[AI] Got answer from direct Gemini API');
          return txt.replace(/[\*\#\`\_]/g, '').trim();
        }
      }
    } catch (e) { console.warn('[AI] Direct Gemini fetch error:', e.message); }
  }

  // TIER 2B: Direct Groq API fetch using valid Groq key
  const groqKey = apiKey && apiKey.startsWith('gsk_') ? apiKey : GROQ_KEY;
  const models = ['llama-3.3-70b-versatile', 'llama-3.1-8b-instant', 'mixtral-8x7b-32768', 'gemma2-9b-it'];
  for (const model of models) {
    try {
      const res = await fetch(GROQ_CHAT, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${groqKey}`, 'Content-Type': 'application/json' },
        body: JSON.stringify({
          model,
          messages: [
            { role: 'system', content: systemPrompt },
            { role: 'user', content: query }
          ],
          temperature: 0.7,
          max_tokens: 500,
          top_p: 0.9
        })
      });
      if (res.ok) {
        const d = await res.json();
        const txt = d?.choices?.[0]?.message?.content;
        if (txt && txt.trim()) {
          console.log(`[AI] Got answer from direct Groq (${model})`);
          return txt.replace(/[\*\#\`\_]/g, '').trim();
        }
      }
    } catch (e) { console.warn(`[AI] Direct groq ${model}:`, e.message); }
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

function offlineAnswer(q, crop, soil, area, isoLang) {
  const lo = q.toLowerCase().trim();
  const hi = isoLang === 'hi';
  const pa = isoLang === 'pa';
  const mr = isoLang === 'mr';
  const te = isoLang === 'te';
  const ta = isoLang === 'ta';
  const bn = isoLang === 'bn';

  // 0. Greetings (hi, hello, hey, namaste, sat sri akal, etc.)
  if (lo.match(/^(hi|hello|hey|namaste|greetings|नमस्कार|नमस्ते|ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ|வணக்கம்|నమస్కారం|নমস্কার)$/i) || lo === 'hi' || lo === 'hello' || lo === 'hey' || lo === 'namaste') {
    if (hi) return `नमस्ते! 🙏 मैं आपका कृषी AI सहायक हूँ। आज मैं आपकी ${crop} फसल के लिए क्या सहायता कर सकता हूँ?`;
    if (pa) return `ਸਤਿ ਸ਼੍ਰੀ ਅਕਾਲ! 🙏 ਮੈਂ ਕ੍ਰਿਸ਼ੀ AI ਸਹਾਇਕ ਹਾਂ। ਅੱਜ ਤੁਹਾਡੀ ${crop} ਫਸਲ ਲਈ ਕੀ ਮਦਦ ਕਰ ਸਕਦਾ ਹਾਂ?`;
    if (mr) return `नमस्कार! 🙏 मी कृषी AI सहाय्यक आहे. आज तुमच्या ${crop} पिकासाठी मी कशी मदत करू शकेन?`;
    if (te) return `నమస్కారం! 🙏 నేను కృషి AI సహాయకుడిని. ఈ రోజు మీ ${crop} పంటకు నేను ఎలా సహాయపడగలను?`;
    if (ta) return `வணக்கம்! 🙏 நான் கிருஷ் AI உதவி. உங்கள் ${crop} பயிருக்கு இன்று எவ்வாறு உதவ முடியும்?`;
    if (bn) return `নমস্কার! 🙏 আমি কৃষি AI সহকারী। আপনার ${crop} ফসলের জন্য আমি আজ কীভাবে সাহায্য করতে পারি?`;
    return `Hello! 👋 I am Krishi AI, your personal farming assistant. How can I help you with your ${crop} crop today?`;
  }

  // Specific crop cultivation (e.g., Sunflower, Maize, Sugarcane, Cotton, Paddy, Wheat, etc.)
  if (lo.match(/sunflower|सूरजमुखी|ਸੂਰਜਮੁਖੀ/)) {
    return hi
      ? `सूरजमुखी (Sunflower) की खेती के लिए: 2.5-3.0 किग्रा/एकड़ बीज लें। कतार से कतार 60 सेमी और पौधे से पौधा 30 सेमी दूरी रखें। बुवाई समय: रबी (अक्टूबर-नवंबर) या जायद (जनवरी-फरवरी)। 30kg यूरिया + 40kg DAP + 25kg पोटाश प्रति एकड़ दें। अंकुरण, फूल और दाना भरते समय सिंचाई अनिवार्य है।`
      : `To grow Sunflower: Use 2.5-3.0 kg seed/acre. Maintain 60 cm row-to-row and 30 cm plant-to-plant spacing. Apply 30 kg Urea + 40 kg DAP + 25 kg Potash per acre. Water at critical stages: germination, flowering, and seed development.`;
  }
  if (lo.match(/grow|plant|sow|cultivat|उगा|बुवाई|खेती/)) {
    const targetCrop = lo.includes('wheat') || lo.includes('गेहूं') ? 'Wheat' : lo.includes('cotton') || lo.includes('कपास') ? 'Cotton' : lo.includes('paddy') || lo.includes('धान') ? 'Paddy' : crop;
    return hi
      ? `${targetCrop} की बुवाई के लिए: उत्तम जल निकासी वाली ${soil} मिट्टी उपयुक्त है। 1 एकड़ हेतु उपचारित बीज की बुवाई 4-5 सेमी गहराई पर करें। बुवाई पर 50kg DAP + 25kg MOP और 21 दिन बाद 45kg यूरिया दें। 5-6 समय पर सिंचाई करें।`
      : `For ${targetCrop} cultivation on ${area} acre (${soil}): Sow high-yield treated seeds at 4-5 cm depth. Basal dose: 50 kg DAP + 25 kg MOP per acre. Apply top-dressing Urea after first irrigation at 21 days. Ensure 5-6 timely irrigations.`;
  }

  // Pest / Disease
  if (lo.match(/pest|disease|rust|worm|bug|fungus|कीट|रोग|इल्ली|रतुआ|दीमक/)) {
    return hi
      ? `${crop} में कीट/रोग नियंत्रण: पीला रतुआ/फंगस हेतु प्रोपिकोनाज़ोल 25% EC 200ml/एकड़, इल्ली हेतु एमामेक्टिन 5% SG 80g/एकड़, और सुंडी/माहू हेतु इमिडाक्लोप्रिड 17.8% SL 50ml/एकड़ 150-200 लीटर पानी में मिलाकर छिड़कें।`
      : `${crop} pest & disease management: Apply Propiconazole 25% EC 200ml/acre for rust/fungus, Emamectin Benzoate 5% SG 80g/acre for caterpillars, and Imidacloprid 17.8% SL 50ml/acre for aphids in 150-200L water per acre.`;
  }

  // Weed Control
  if (lo.match(/weed|herbicide|खरपतवार|गुल्ली|बथुआ|ਨਦੀਨ/)) {
    return hi
      ? `${crop} में खरपतवार नियंत्रण: संकरी पत्ती (गुल्ली डंडा) के लिए क्लोडिनाफॉप 15% WP 160g/एकड़, चौड़ी पत्ती (बथुआ) के लिए मैटसल्फ्यूरॉन 20% WP 8g/एकड़ बुवाई के 30-35 दिन बाद स्प्रे करें।`
      : `${crop} weed control: For grassy weeds (Phalaris minor) apply Clodinafop 15% WP @ 160g/acre. For broadleaf weeds apply Metsulfuron Methyl 20% WP @ 8g/acre at 30-35 days after sowing.`;
  }

  // Fertilizer & Nutrients
  if (lo.match(/fertilizer|urea|dap|npk|nutrient|zinc|खाद|उर्वरक|यूरिया/)) {
    const d = Math.round(50 * area), u = Math.round(90 * area), m = Math.round(25 * area);
    return hi
      ? `${area} एकड़ ${crop} हेतु उर्वरक खुराक: बुवाई पर ${d}kg DAP + ${m}kg MOP + 10kg जिंक सल्फेट दें। पहली सिंचाई पर ${Math.round(u / 2)}kg यूरिया और दूसरी सिंचाई पर शेष ${Math.round(u / 2)}kg यूरिया दें।`
      : `${area} acre ${crop} fertilizer requirement: Basal dose ${d} kg DAP + ${m} kg MOP + 10 kg Zinc Sulphate. Top-dress ${Math.round(u / 2)} kg Urea after 1st irrigation and remaining ${Math.round(u / 2)} kg at flowering.`;
  }

  // Water & Irrigation
  if (lo.match(/water|irrigation|moisture|drip|पानी|सिंचाई/)) {
    return hi
      ? `${crop} (${soil}) में सिंचाई: पहली सिंचाई बुवाई के 21-25 दिन बाद (CRI स्टेज) दें। इसके बाद कल्ले निकलते समय, गांठ बनते समय, फूल आने पर और दाना भरते समय हल्की सिंचाई करें।`
      : `${crop} irrigation schedule for ${soil}: Give 1st irrigation at 21-25 days (CRI stage). Provide 4-5 follow-up light irrigations at tillering, jointing, flowering, and grain filling stages.`;
  }

  // Mandi Rates & Prices
  if (lo.match(/price|mandi|rate|msp|market|भाव|मंडी/)) {
    return hi
      ? `वर्तमान MSP और मंडी भाव: गेहूं ₹2,275/क्विंटल, धान ₹2,300/क्विंटल, सरसों ₹5,650/क्विंटल, कपास ₹7,121/क्विंटल। अपनी उपज को 12% से कम नमी पर अच्छी तरह सुखाकर बेचें।`
      : `Current Government MSP Rates: Wheat ₹2,275/qtl, Paddy ₹2,300/qtl, Mustard ₹5,650/qtl, Cotton ₹7,121/qtl. Ensure grain moisture is below 12% before taking produce to Mandi.`;
  }

  // Schemes & Subsidies
  if (lo.match(/scheme|subsidy|pm.kisan|kusum|insurance|योजना|सब्सिडी/)) {
    return hi
      ? `प्रमुख सरकारी योजनाएं: PM-किसान सम्मान निधि (₹6,000/वर्ष), PM-KUSUM (सोलर पंप पर 60-90% सब्सिडी), फसल बीमा (PMFBY 1.5% रबी प्रीमियम), और किसान क्रेडिट कार्ड (KCC 4% रियायती ब्याज दर)।`
      : `Key Farmer Welfare Schemes: PM-KISAN (₹6,000/year direct transfer), PM-KUSUM (60-90% solar pump subsidy), PMFBY Crop Insurance (1.5% Rabi premium), and KCC Credit Card (4% interest).`;
  }

  // Comprehensive Fallback tailored specifically to the user query
  return hi
    ? `${crop} (${area} एकड़, ${soil}) के संदर्भ में: "${q}" के लिए उत्तम कृषि वैज्ञानिक परामर्श — बुवाई हेतु उपचारित बीज का प्रयोग करें, 50kg/एकड़ DAP बेस खुराक दें, 21 दिन पर पहली सिंचाई करें एवं कीट प्रबंधन हेतु नीम आधारित स्प्रे या अनुशंसित कीटनाशक 150L पानी/एकड़ में छिड़कें।`
    : `Agronomic guidance for ${crop} (${area} acre, ${soil}) regarding "${q}": Use certified treated seed, apply 50kg/acre DAP at sowing, give 1st irrigation at 21 days, and spray recommended pesticides in 150L water/acre for pest protection.`;
}

function speak(text, langCode, onStart, onEnd) {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/gu, '').replace(/[\*\#\`\_\[\]\(\)]/g, '').trim();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = langCode;
  u.rate = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang.startsWith(langCode.slice(0, 2)));
  if (match) u.voice = match;
  u.onstart = onStart;
  u.onend = onEnd;
  u.onerror = onEnd;
  window.speechSynthesis.speak(u);
}

/* ═══════════════════════════════════════════════════════════════════
 *  COMPONENT
 * ═══════════════════════════════════════════════════════════════════ */
export function VoiceAiTab() {
  const { crop, soil, location, area, geminiKey, saveAiKey } = useApp();

  const [voiceLang, setVoiceLang] = useState('en-IN');
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

  // Dual STT: Real-time browser Web Speech Recognition ref
  const webSpeechRef = useRef(null);
  const liveTranscriptRef = useRef('');

  useEffect(() => { setTmpKey(geminiKey || ''); }, [geminiKey]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const key = (geminiKey && geminiKey.trim()) || GROQ_KEY;
  const iso = LANGS.find(l => l.code === voiceLang)?.iso || 'en';
  const cropEn = crop?.nameEn || crop?.name || '';
  const soilEn = soil?.nameEn || soil?.name || '';
  const locEn = location?.nameEn || location?.name || '';
  const areaVal = area || '';
  const cards = CARDS[voiceLang] || CARDS['en-IN'];

  /* ── Mic ── */
  const startRec = useCallback(async () => {
    setMicErr(''); setTranscript(''); setRecSec(0);
    liveTranscriptRef.current = '';
    window.speechSynthesis?.cancel(); setSpeaking(false);

    // 1. Start browser SpeechRecognition in parallel for instant client-side transcription
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

    // 2. Start MediaRecorder for audio blob creation
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

    // Stop native SpeechRecognition if active
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

  /* ── Process ── */
  const processQuery = useCallback(async (text) => {
    if (!text?.trim()) return;
    setThinking(true); setMicErr('');
    const prompt = buildPrompt(cropEn, soilEn, locEn, areaVal, iso);
    let answer = await groqChat(text.trim(), prompt, key, cropEn, soilEn, locEn, areaVal, voiceLang);
    if (!answer) answer = offlineAnswer(text.trim(), cropEn, soilEn, areaVal, iso);
    setThinking(false);
    setMsgs(prev => [...prev.slice(-10), { role: 'user', text: text.trim() }, { role: 'ai', text: answer }]);
    speak(answer, voiceLang, () => setSpeaking(true), () => setSpeaking(false));
  }, [cropEn, soilEn, locEn, areaVal, iso, key, voiceLang]);

  const handleMic = useCallback(async () => {
    if (isRec) {
      const blob = await stopRec();
      setThinking(true);
      let txt = '';

      // Step A: Attempt Groq Whisper API
      if (blob && blob.size >= 1000) {
        try {
          txt = await groqWhisper(blob, key, iso);
        } catch (e) {
          console.warn('Groq Whisper failed (fallback to browser STT):', e.message);
        }
      }

      // Step B: Fall back to native Browser Web Speech API transcript if Groq Whisper failed or returned empty
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
    window.speechSynthesis?.cancel();
    setSpeaking(false);
  }, []);

  /* ── Styles ── */
  const S = {
    wrap: { padding: '14px', maxWidth: '880px', margin: '0 auto', fontFamily: "'Segoe UI',sans-serif" },
    banner: { background: 'linear-gradient(135deg,rgba(16,185,129,.18),rgba(10,25,16,.96))', border: '1px solid rgba(16,185,129,.35)', borderRadius: '16px', padding: '20px 24px', color: '#fff', marginBottom: '14px', textAlign: 'center', position: 'relative' },
    keyBadge: { position: 'absolute', top: 10, right: 14, background: 'rgba(59,130,246,.2)', border: '1px solid #60a5fa', color: '#93c5fd', fontSize: 12, fontWeight: 600, padding: '4px 12px', borderRadius: 20, cursor: 'pointer' },
    langBar: { display: 'flex', flexWrap: 'wrap', gap: 8, justifyContent: 'center', marginTop: 14 },
    langBtn: (active) => ({ padding: '7px 16px', borderRadius: 22, border: active ? '1px solid #10b981' : '1px solid rgba(255,255,255,.15)', background: active ? '#10b981' : 'rgba(255,255,255,.06)', color: active ? '#000' : '#e2e8f0', fontSize: 13, fontWeight: active ? 700 : 600, cursor: 'pointer', transition: 'all .2s', transform: active ? 'scale(1.05)' : 'none' }),
    micZone: { position: 'relative', display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '28px 16px', background: isRec ? 'rgba(239,68,68,.15)' : thinking ? 'rgba(56,189,248,.12)' : 'rgba(10,25,16,.96)', border: `1.5px solid ${isRec ? 'rgba(239,68,68,.6)' : thinking ? 'rgba(56,189,248,.5)' : 'rgba(255,255,255,.12)'}`, borderRadius: 16, marginBottom: 14, transition: 'all .3s' },
    micBtn: { width: 110, height: 110, borderRadius: '50%', border: 'none', cursor: thinking ? 'wait' : 'pointer', display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 44, color: '#fff', background: isRec ? 'linear-gradient(135deg,#ef4444,#dc2626)' : thinking ? 'linear-gradient(135deg,#0ea5e9,#0284c7)' : 'linear-gradient(135deg,#10b981,#059669)', boxShadow: isRec ? '0 0 0 12px rgba(239,68,68,.25),0 6px 20px rgba(239,68,68,.5)' : '0 0 0 8px rgba(16,185,129,.18),0 6px 18px rgba(16,185,129,.3)', transition: 'all .3s' },
    status: { marginTop: 14, fontSize: 16, fontWeight: 700, color: isRec ? '#f87171' : thinking ? '#38bdf8' : speaking ? '#34d399' : '#10b981', textAlign: 'center' },
    inputBar: { display: 'flex', gap: 8, marginBottom: 14 },
    inputField: { flex: 1, padding: '13px 16px', borderRadius: 12, border: '1px solid rgba(255,255,255,.18)', background: 'rgba(10,25,16,.96)', color: '#fff', fontSize: 14, outline: 'none' },
    sendBtn: { padding: '13px 22px', borderRadius: 12, border: 'none', background: 'linear-gradient(135deg,#10b981,#059669)', color: '#000', fontSize: 14, fontWeight: 700, cursor: 'pointer' },
    grid: { display: 'grid', gridTemplateColumns: 'repeat(auto-fit,minmax(240px,1fr))', gap: 10, marginBottom: 16 },
    card: (c) => ({ background: 'rgba(10,25,16,.9)', border: `1px solid ${c}33`, borderLeft: `4px solid ${c}`, borderRadius: 12, padding: '12px 14px', cursor: 'pointer', transition: 'all .2s' }),
    chatWrap: { background: 'rgba(10,25,16,.96)', borderRadius: 16, padding: 18, marginBottom: 14, border: '1px solid rgba(255,255,255,.1)' },
    msgBubble: (isUser) => ({ background: isUser ? 'rgba(16,185,129,.1)' : 'rgba(56,189,248,.1)', borderRadius: isUser ? '14px 14px 14px 2px' : '14px 14px 2px 14px', padding: '12px 16px', marginBottom: 10, borderLeft: `4px solid ${isUser ? '#10b981' : '#38bdf8'}`, color: '#fff', fontSize: 14, lineHeight: 1.6 }),
    replayBtn: { marginTop: 6, padding: '5px 10px', borderRadius: 6, border: '1px solid rgba(56,189,248,.35)', background: 'rgba(56,189,248,.12)', color: '#38bdf8', fontSize: 11, fontWeight: 600, cursor: 'pointer' },
  };

  return (
    <div className="tab-panel active" style={{ padding: 0 }}>
      <div style={S.wrap}>

        {/* Banner */}
        <div style={S.banner}>
          <button type="button" style={S.keyBadge} onClick={() => setShowKey(!showKey)}>
            <i className="fa-solid fa-bolt" /> {geminiKey ? 'Custom Key' : 'Groq AI'}
          </button>
          <div style={{ fontSize: 12, opacity: .85, marginBottom: 5 }}>
            <i className="fa-solid fa-microchip" /> Groq Whisper + Llama-3.3-70B
          </div>
          <h2 style={{ margin: '0 0 6px', fontSize: 21, fontWeight: 800 }}>
            🎙️ {voiceLang === 'hi-IN' ? 'किसान AI सलाहकार' : 'Farmer AI Voice Assistant'}
          </h2>
          <p style={{ margin: 0, fontSize: 13, opacity: .8 }}>
            {voiceLang === 'hi-IN' ? 'रोग, कीट, खाद, पानी, मंडी भाव एवं योजनाओं के बारे में पूछें' : 'Ask about pests, fertilizers, irrigation, mandi rates & government schemes'}
          </p>
          <div style={S.langBar}>
            {LANGS.map(l => (
              <button key={l.code} type="button" style={S.langBtn(voiceLang === l.code)}
                onClick={() => { setVoiceLang(l.code); setMicErr(''); setTranscript(''); window.speechSynthesis?.cancel(); setSpeaking(false); if (isRec) stopRec(); }}>
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* API Key */}
        {showKey && (
          <form onSubmit={e => { e.preventDefault(); saveAiKey(tmpKey.trim()); setShowKey(false); }}
            style={{ background: 'rgba(10,25,16,.96)', border: '1px solid rgba(16,185,129,.35)', borderRadius: 14, padding: '14px 18px', marginBottom: 14, color: '#fff' }}>
            <div style={{ fontSize: 13, fontWeight: 700, marginBottom: 6, color: '#10b981' }}>🔑 Groq API Key:</div>
            <div style={{ display: 'flex', gap: 8 }}>
              <input type="password" value={tmpKey} onChange={e => setTmpKey(e.target.value)} placeholder="gsk_..." style={{ flex: 1, padding: '9px 12px', borderRadius: 8, border: '1px solid rgba(255,255,255,.18)', background: '#000', color: '#fff', fontSize: 13 }} />
              <button type="submit" style={{ padding: '9px 18px', borderRadius: 8, border: 'none', background: '#10b981', color: '#000', fontWeight: 700, cursor: 'pointer' }}>Save</button>
            </div>
          </form>
        )}

        {/* Mic */}
        <div style={S.micZone}>
          {speaking && (
            <button
              type="button"
              onClick={stopSpeaking}
              style={{
                position: 'absolute', top: 12, right: 12,
                background: 'rgba(239,68,68,.15)', border: '1px solid rgba(239,68,68,.5)',
                color: '#fca5a5', padding: '6px 12px', borderRadius: 8, fontSize: 12,
                fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: 6
              }}>
              <i className="fa-solid fa-stop" /> Stop AI
            </button>
          )}
          <button type="button" style={S.micBtn} onClick={handleMic} disabled={thinking}>
            <i className={`fa-solid ${isRec ? 'fa-stop' : thinking ? 'fa-spinner fa-spin' : 'fa-microphone'}`} />
          </button>
          <div style={S.status}>
            {isRec ? `🔴 Recording (${recSec}s) — Tap to stop & analyze`
              : thinking ? '🔵 Analyzing with Groq AI...'
                : speaking ? '🔊 Speaking answer...'
                  : '🟢 Tap mic to speak your question'}
          </div>
          {transcript && (
            <div style={{ background: 'rgba(59,130,246,.12)', border: '1px solid rgba(59,130,246,.35)', color: '#93c5fd', padding: '8px 16px', borderRadius: 10, marginTop: 10, fontSize: 13, fontWeight: 600, textAlign: 'center' }}>
              🗣️ "{transcript}"
            </div>
          )}
          {micErr && (
            <div style={{ background: 'rgba(239,68,68,.12)', border: '1px solid rgba(239,68,68,.35)', color: '#fca5a5', padding: '8px 16px', borderRadius: 10, marginTop: 10, fontSize: 13, textAlign: 'center' }}>
              {micErr}
            </div>
          )}
          <p style={{ margin: '6px 0 0', fontSize: 12, color: '#777', textAlign: 'center' }}>
            {cropEn || 'Crop Not Set'} | {areaVal ? `${areaVal} Acre` : 'Area Not Set'} | {soilEn || 'Soil Not Set'} | {LANGS.find(l => l.code === voiceLang)?.label}
          </p>
        </div>

        {/* Text Input */}
        <div style={S.inputBar}>
          <input type="text" value={input} onChange={e => setInput(e.target.value)}
            onKeyDown={e => { if (e.key === 'Enter') handleSend(); }}
            placeholder={voiceLang === 'hi-IN' ? 'अपना कृषि प्रश्न यहाँ लिखें...' : 'Type your agriculture question...'}
            style={S.inputField} />
          <button type="button" onClick={handleSend} style={S.sendBtn}>
            <i className="fa-solid fa-paper-plane" /> {voiceLang === 'hi-IN' ? 'पूछें' : 'Ask'}
          </button>
        </div>

        {/* Quick Cards */}
        <div style={S.grid}>
          {cards.map((c, i) => (
            <div key={i} style={S.card(c.c)} onClick={() => processQuery(c.q)}>
              <div style={{ fontSize: 13, fontWeight: 700, color: '#fff', marginBottom: 3 }}>{c.icon} {c.t}</div>
              <div style={{ fontSize: 12, color: '#94a3b8', lineHeight: 1.4 }}>"{c.q}"</div>
            </div>
          ))}
        </div>

        {/* Chat History */}
        {msgs.length > 0 && (
          <div style={S.chatWrap}>
            <h3 style={{ margin: '0 0 12px', fontSize: 15, color: '#10b981' }}>
              <i className="fa-solid fa-comments" /> Conversation
            </h3>
            {msgs.map((m, i) => (
              <div key={i} style={S.msgBubble(m.role === 'user')}>
                <div style={{ fontSize: 11, fontWeight: 700, color: m.role === 'user' ? '#34d399' : '#38bdf8', marginBottom: 3 }}>
                  {m.role === 'user' ? '👤 You:' : '🤖 Krishi AI:'}
                </div>
                {m.text}
                {m.role === 'ai' && (
                  <div style={{ marginTop: 6 }}>
                    <button type="button" style={S.replayBtn}
                      onClick={() => speak(m.text, voiceLang, () => setSpeaking(true), () => setSpeaking(false))}>
                      <i className="fa-solid fa-volume-high" /> Listen
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
