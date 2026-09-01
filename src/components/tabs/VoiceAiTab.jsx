import React, { useState, useEffect, useRef, useCallback } from 'react';
import { useApp } from '../../context/AppContext';

/* ═══════════════════════════════════════════════════════════════════
 *  CONSTANTS
 * ═══════════════════════════════════════════════════════════════════ */
const GROQ_KEY = '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';
const GROQ_CHAT = 'https://api.groq.com/openai/v1/chat/completions';
const GROQ_STT  = 'https://api.groq.com/openai/v1/audio/transcriptions';

const LANGS = [
  { code: 'en-IN', label: '🇬🇧 English',  iso: 'en' },
  { code: 'hi-IN', label: '🇮🇳 हिन्दी',    iso: 'hi' },
  { code: 'pa-IN', label: '🌾 ਪੰਜਾਬੀ',   iso: 'pa' },
  { code: 'mr-IN', label: '🌿 मराठी',     iso: 'mr' },
  { code: 'te-IN', label: '🍃 తెలుగు',   iso: 'te' },
  { code: 'ta-IN', label: '🪷 தமிழ்',    iso: 'ta' },
  { code: 'bn-IN', label: '🌾 বাংলা',     iso: 'bn' },
];

const LANG_NAME = {
  'en': 'English', 'hi': 'Hindi (हिन्दी)', 'pa': 'Punjabi (ਪੰਜਾਬੀ)',
  'mr': 'Marathi (मराठी)', 'te': 'Telugu (తెలుగు)', 'ta': 'Tamil (தமிழ்)',
  'bn': 'Bengali (বাংলা)',
};

const CARDS = {
  'en-IN': [
    { icon: '🐛', t: 'Pest & Disease',  q: 'How to control yellow rust and armyworm in wheat?', c: '#ef4444' },
    { icon: '🧪', t: 'Fertilizer Dose', q: 'Urea and DAP dose for 1 acre wheat?', c: '#10b981' },
    { icon: '💧', t: 'Irrigation',      q: 'When should I give first irrigation in wheat?', c: '#38bdf8' },
    { icon: '💰', t: 'Mandi Rates',     q: 'Today\'s wheat and paddy mandi prices?', c: '#f59e0b' },
    { icon: '🌿', t: 'Weed Control',    q: 'How to control Phalaris minor weeds in wheat?', c: '#a855f7' },
    { icon: '🏛️', t: 'Govt Schemes',    q: 'PM-KISAN and PM-KUSUM solar subsidy details', c: '#8b5cf6' },
  ],
  'hi-IN': [
    { icon: '🐛', t: 'रोग व कीट',    q: 'गेहूं में पीला रतुआ और इल्ली नियंत्रण कैसे करें?', c: '#ef4444' },
    { icon: '🧪', t: 'खाद मात्रा',   q: '1 एकड़ गेहूं के लिए यूरिया और DAP की मात्रा बताओ', c: '#10b981' },
    { icon: '💧', t: 'सिंचाई समय',   q: 'गेहूं में पहला पानी कब लगाएं?', c: '#38bdf8' },
    { icon: '💰', t: 'मंडी भाव',    q: 'गेहूं और धान का आज का मंडी भाव बताओ', c: '#f59e0b' },
    { icon: '🌿', t: 'खरपतवार',    q: 'गेहूं में गुल्ली डंडा और बथुआ का इलाज बताओ', c: '#a855f7' },
    { icon: '🏛️', t: 'सरकारी योजना', q: 'PM किसान और सोलर पंप सब्सिडी की जानकारी दो', c: '#8b5cf6' },
  ],
};

/* ═══════════════════════════════════════════════════════════════════
 *  HELPERS — All AI logic is INLINE here. Zero external dependencies.
 * ═══════════════════════════════════════════════════════════════════ */

function buildPrompt(crop, soil, loc, area, isoLang) {
  const langFull = LANG_NAME[isoLang] || 'English';
  return `You are "Krishi Jal AI" — a senior Indian agricultural scientist.

FARMER CONTEXT:
- Crop: ${crop}
- Soil: ${soil}
- Location: ${loc}
- Farm: ${area} acres

RULES:
1. Answer ONLY what is asked. No generic filler.
2. Give exact chemical names, dosages per acre, water volume.
3. For fertilizers, calculate exact kg for ${area} acres.
4. Respond strictly in ${langFull}.
5. Keep it 3-5 sentences. Concise and actionable.
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

  // TIER 2: Direct browser fetch (may fail due to CORS on some browsers)
  const models = ['qwen/qwen3.8-27b', 'openai/gpt-oss-120b', 'qwen/qwen3.6-27b'];
  for (const model of models) {
    try {
      const res = await fetch(GROQ_CHAT, {
        method: 'POST',
        headers: { 'Authorization': `Bearer ${apiKey}`, 'Content-Type': 'application/json' },
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
  const lo = q.toLowerCase();
  const hi = isoLang === 'hi';
  if (lo.match(/pest|disease|rust|worm|कीट|रोग|इल्ली|रतुआ/)) {
    return hi
      ? `${crop} में कीट/रोग नियंत्रण: प्रोपिकोनाज़ोल 25% EC 200 मिली/एकड़ (रतुआ), एमामेक्टिन बेंजोएट 5% SG 80 ग्राम/एकड़ (इल्ली), इमिडाक्लोप्रिड 17.8% SL 50 मिली/एकड़ (माहू) — 150-200 लीटर पानी/एकड़ में छिड़कें।`
      : `${crop} pest/disease control: Propiconazole 25% EC 200ml/acre (rust), Emamectin Benzoate 5% SG 80g/acre (caterpillar), Imidacloprid 17.8% SL 50ml/acre (aphids) — in 150-200L water per acre.`;
  }
  if (lo.match(/weed|खरपतवार|गुल्ली|बथुआ|ਨਦੀਨ/)) {
    return hi
      ? `${crop} में गुल्ली डंडा: क्लोडिनाफॉप 15% WP 160 ग्राम/एकड़। बथुआ: मैटसल्फ्यूरॉन 20% WP 8 ग्राम/एकड़, बुवाई के 30-35 दिन बाद।`
      : `${crop} weeds: Clodinafop 15% WP 160g/acre (Phalaris minor), Metsulfuron Methyl 20% WP 8g/acre (broadleaf), apply 30-35 DAS.`;
  }
  if (lo.match(/fertilizer|urea|dap|npk|खाद|उर्वरक|ਯੂਰੀਆ/)) {
    const d = Math.round(50*area), u = Math.round(90*area), m = Math.round(25*area);
    return hi
      ? `${area} एकड़ ${crop}: बुवाई पर ${d}kg DAP + ${m}kg MOP + 10kg जिंक। पहली सिंचाई बाद ${Math.round(u/2)}kg यूरिया टॉप ड्रेसिंग।`
      : `${area} acre ${crop}: Basal ${d}kg DAP + ${m}kg MOP + 10kg Zinc. Top-dress ${Math.round(u/2)}kg Urea after 1st irrigation.`;
  }
  if (lo.match(/water|irrigation|पानी|सिंचाई|ਪਾਣੀ/)) {
    return hi
      ? `${crop} में पहली सिंचाई 21-25 दिन (CRI) पर दें। कुल 5-6 सिंचाइयां: CRI, तिलरिंग, जॉइंटिंग, फ्लॉवरिंग, दाना भरना।`
      : `${crop}: First irrigation at 21-25 days (CRI). Total 5-6 irrigations: CRI, Tillering, Jointing, Flowering, Grain filling.`;
  }
  if (lo.match(/price|mandi|rate|msp|भाव|मंडी|ਭਾਅ/)) {
    return hi
      ? `MSP: गेहूं ₹2,275/क्विंटल, सरसों ₹5,650, धान ₹2,300, कपास ₹7,121। नमी 12% से कम रखें।`
      : `MSP: Wheat ₹2,275/qtl, Mustard ₹5,650, Paddy ₹2,300, Cotton ₹7,121. Keep moisture below 12%.`;
  }
  if (lo.match(/scheme|subsidy|योजना|सब्सिडी|pm.kisan|kusum/)) {
    return hi
      ? `PM-किसान: ₹6,000/वर्ष। PM-KUSUM: सोलर पंप 60-90% सब्सिडी। PMFBY: रबी प्रीमियम 1.5%। KCC: 4% ब्याज।`
      : `PM-KISAN: ₹6,000/year. PM-KUSUM: 60-90% solar pump subsidy. PMFBY: 1.5% Rabi premium. KCC: 4% interest.`;
  }
  return hi
    ? `${crop} (${area} एकड़, ${soil}) के लिए सही खाद, पानी एवं कीट नियंत्रण जानने हेतु विशेष प्रश्न पूछें — जैसे "गेहूं में रतुआ का इलाज", "1 एकड़ में यूरिया कितना लगेगा"।`
    : `For ${crop} (${area} acres, ${soil}): Ask a specific question about pests, fertilizers, irrigation, or prices for targeted advice.`;
}

function speak(text, langCode, onStart, onEnd) {
  if (!window.speechSynthesis || !text) return;
  window.speechSynthesis.cancel();
  const clean = text.replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}]/gu, '').replace(/[\*\#\`\_\[\]\(\)]/g, '').trim();
  const u = new SpeechSynthesisUtterance(clean);
  u.lang = langCode;
  u.rate = 1.0;
  const voices = window.speechSynthesis.getVoices();
  const match = voices.find(v => v.lang.startsWith(langCode.slice(0,2)));
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
  const [isRec, setIsRec]         = useState(false);
  const [recSec, setRecSec]       = useState(0);
  const [thinking, setThinking]   = useState(false);
  const [speaking, setSpeaking]   = useState(false);
  const [transcript, setTranscript] = useState('');
  const [micErr, setMicErr]       = useState('');
  const [input, setInput]         = useState('');
  const [msgs, setMsgs]           = useState([]);
  const [showKey, setShowKey]     = useState(false);
  const [tmpKey, setTmpKey]       = useState(geminiKey || '');

  const recRef  = useRef(null);
  const chunks  = useRef([]);
  const timer   = useRef(null);
  const chatEnd = useRef(null);

  useEffect(() => { setTmpKey(geminiKey || ''); }, [geminiKey]);
  useEffect(() => { chatEnd.current?.scrollIntoView({ behavior: 'smooth' }); }, [msgs]);

  const key = (geminiKey && geminiKey.trim()) || GROQ_KEY;
  const iso = LANGS.find(l => l.code === voiceLang)?.iso || 'en';
  const cropEn = crop?.nameEn || 'Wheat';
  const soilEn = soil?.nameEn || 'Sandy Loam';
  const locEn  = location?.nameEn || 'Punjab, India';
  const areaVal = area || 1;
  const cards = CARDS[voiceLang] || CARDS['en-IN'];

  /* ── Mic ── */
  const startRec = useCallback(async () => {
    setMicErr(''); setTranscript(''); setRecSec(0);
    window.speechSynthesis?.cancel(); setSpeaking(false);
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
  }, []);

  const stopRec = useCallback(async () => {
    clearInterval(timer.current);
    if (!recRef.current) { setIsRec(false); return; }
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
      if (!blob || blob.size < 1000) { setMicErr('ℹ️ No speech detected. Try again.'); return; }
      setThinking(true);
      try {
        const txt = await groqWhisper(blob, key, iso);
        if (txt) { setTranscript(txt); await processQuery(txt); }
        else { setThinking(false); setMicErr('ℹ️ Could not understand speech. Try again.'); }
      } catch (e) { setThinking(false); setMicErr(`⚠️ ${e.message}`); }
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
            {cropEn} | {areaVal} Acre | {soilEn} | {LANGS.find(l => l.code === voiceLang)?.label}
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
