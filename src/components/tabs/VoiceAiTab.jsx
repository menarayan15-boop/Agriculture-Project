import React, { useState, useEffect, useRef } from 'react';
import { useApp } from '../../context/AppContext';

export function VoiceAiTab() {
  const { lang, crop, soil, location, area } = useApp();
  const [isRecording, setIsRecording] = useState(false);
  const [isThinking, setIsThinking] = useState(false);
  const [isSpeaking, setIsSpeaking] = useState(false);
  const [autoPlay, setAutoPlay] = useState(true);
  const [voiceLang, setVoiceLang] = useState('hi-IN');
  const [voiceSpeed, setVoiceSpeed] = useState('1.0');
  const [userTranscript, setUserTranscript] = useState('');
  const [aiResponse, setAiResponse] = useState('');
  const [history, setHistory] = useState([]);
  const [customInputText, setCustomInputText] = useState('');
  const recognitionRef = useRef(null);

  useEffect(() => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (SpeechRecognition) {
      try {
        const recognition = new SpeechRecognition();
        recognition.continuous = false;
        recognition.interimResults = true;
        recognition.onstart = () => setIsRecording(true);
        recognition.onresult = (event) => {
          let finalTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; ++i) {
            if (event.results[i].isFinal) finalTranscript += event.results[i][0].transcript;
          }
          if (finalTranscript) {
            handleProcessQuery(finalTranscript.trim(), voiceLang);
          }
        };
        recognition.onend = () => setIsRecording(false);
        recognitionRef.current = recognition;
      } catch (e) {
        console.warn('Speech recognition init error:', e);
      }
    }
  }, [voiceLang]);

  const toggleRecording = () => {
    if (isSpeaking) {
      window.speechSynthesis?.cancel();
      setIsSpeaking(false);
    }
    if (isRecording) {
      recognitionRef.current?.stop();
      setIsRecording(false);
    } else {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.lang = voiceLang;
          recognitionRef.current.start();
          return;
        } catch (e) {}
      }
      // Fallback simulation
      setIsRecording(true);
      setTimeout(() => {
        setIsRecording(false);
        const sampleQueries = {
          'en-IN': 'When should I apply the first irrigation for Wheat?',
          'hi-IN': 'गेहूं में पहला पानी कब लगाना चाहिए?',
          'pa-IN': 'ਕਣਕ ਨੂੰ ਪਹਿਲਾ ਪਾਣੀ ਕਦੋਂ ਲਾਉਣਾ ਚਾਹੀਦਾ ਹੈ?'
        };
        handleProcessQuery(sampleQueries[voiceLang] || sampleQueries['hi-IN'], voiceLang);
      }, 3000);
    }
  };

  const handleProcessQuery = (query, selectedLang = 'hi-IN') => {
    setIsRecording(false);
    setIsThinking(true);
    setUserTranscript(query);

    setTimeout(() => {
      let answer = '';
      const q = query.toLowerCase();
      const cropName = crop?.nameEn || 'Wheat';
      const soilName = soil?.nameEn || 'Sandy Loam';
      const fieldArea = area || 1.0;

      if (window.KrishiVoiceAI && typeof window.KrishiVoiceAI.generateAgronomicVoiceResponse === 'function') {
        answer = window.KrishiVoiceAI.generateAgronomicVoiceResponse(query, selectedLang);
      } else if (q.includes('water') || q.includes('irrigation') || q.includes('पानी') || q.includes('सिंचाई') || q.includes('பாசனம்')) {
        answer = `${cropName} फसल के लिए ${soilName} मिट्टी में, पहली सिंचाई बुवाई के 20-25 दिन बाद करें। हल्की नमी बनाए रखें, पानी खड़ा न होने दें। For ${cropName} on ${soilName} soil, first irrigation at 20-25 days after sowing.`;
      } else if (q.includes('fertilizer') || q.includes('urea') || q.includes('dap') || q.includes('खाद') || q.includes('खत') || q.includes('உரம்')) {
        answer = `${fieldArea} एकड़ ${cropName} के लिए 40 kg यूरिया और 25 kg DAP डालें। सिंचाई के तुरंत बाद यूरिया दें। Apply 40 kg Urea + 25 kg DAP per acre after irrigation.`;
      } else if (q.includes('disease') || q.includes('pest') || q.includes('rust') || q.includes('blight') || q.includes('रोग') || q.includes('कीट')) {
        answer = `${cropName} में पीला रतुआ/फफूंद दिखे तो तुरंत Propiconazole 25 EC (1ml/लीटर पानी) का छिड़काव करें। 15 दिन बाद दोबारा करें। Spray Propiconazole 25 EC (1ml/L water) immediately, repeat after 15 days.`;
      } else if (q.includes('price') || q.includes('mandi') || q.includes('market') || q.includes('भाव') || q.includes('मंडी') || q.includes('दाम')) {
        answer = `आज की मंडी दर: गेहूं ₹2,275/क्विंटल, सरसों ₹5,450/क्विंटल, धान ₹2,183/क्विंटल (MSP)। Today's rates: Wheat ₹2,275, Mustard ₹5,450, Paddy ₹2,183 per quintal.`;
      } else if (q.includes('scheme') || q.includes('subsidy') || q.includes('pm-kisan') || q.includes('योजना') || q.includes('सब्सिडी')) {
        answer = `PM-किसान 20वीं किस्त ₹6,000/वर्ष। सोलर पंप पर 80% सब्सिडी। PM-KISAN ₹6,000/year. Solar pump 80% subsidy available. Apply at pmkisan.gov.in`;
      } else if (q.includes('tractor') || q.includes('machinery') || q.includes('rental') || q.includes('ट्रैक्टर') || q.includes('किराया')) {
        answer = `नजदीकी सेवा केंद्र: 45HP ट्रैक्टर ₹450/घंटा, रोटावेटर ₹350/घंटा। Tractor 45HP ₹450/hr, Rotavator ₹350/hr available nearby.`;
      } else {
        answer = `${cropName} फसल के लिए मौसम अनुकूल है। सिंचाई योजना का पालन करें। Conditions are favorable for ${cropName}. Follow recommended irrigation plan.`;
      }

      setAiResponse(answer);
      setIsThinking(false);

      const newItem = { query, response: answer, lang: selectedLang, time: new Date().toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }) };
      setHistory(prev => [newItem, ...prev.slice(0, 7)]);

      if (autoPlay) {
        speakResponse(answer, selectedLang);
      }
    }, 1200);
  };

  const speakResponse = (text, langCode) => {
    if (!window.speechSynthesis) return;
    window.speechSynthesis.cancel();
    const utterance = new SpeechSynthesisUtterance(text);
    utterance.lang = langCode || voiceLang;
    utterance.rate = parseFloat(voiceSpeed) || 1.0;
    utterance.onstart = () => setIsSpeaking(true);
    utterance.onend = () => setIsSpeaking(false);
    utterance.onerror = () => setIsSpeaking(false);
    window.speechSynthesis.speak(utterance);
  };

  const stopSpeaking = () => {
    window.speechSynthesis?.cancel();
    setIsSpeaking(false);
  };

  /* ─── STYLES ─── */
  const containerStyle = {
    padding: '16px',
    maxWidth: '900px',
    margin: '0 auto',
    fontFamily: "'Segoe UI', Tahoma, sans-serif",
  };

  const bannerStyle = {
    background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(10, 25, 16, 0.95) 100%)',
    border: '1px solid rgba(16, 185, 129, 0.3)',
    borderRadius: '16px',
    padding: '20px 24px',
    color: '#fff',
    marginBottom: '16px',
    textAlign: 'center',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  };

  const langBarStyle = {
    display: 'flex',
    flexWrap: 'wrap',
    gap: '8px',
    justifyContent: 'center',
    marginTop: '14px',
  };

  const langBtnBase = {
    padding: '10px 18px',
    borderRadius: '24px',
    border: '1px solid rgba(255,255,255,0.12)',
    background: 'rgba(255,255,255,0.06)',
    color: '#fff',
    fontSize: '15px',
    fontWeight: 600,
    cursor: 'pointer',
    transition: 'all 0.2s',
  };

  const langBtnActive = {
    ...langBtnBase,
    background: '#10b981',
    color: 'black',
    border: '1px solid #10b981',
    boxShadow: '0 2px 8px rgba(16,185,129,0.3)',
  };

  /* ─── MIC AREA ─── */
  const micSectionStyle = {
    display: 'flex',
    flexDirection: 'column',
    alignItems: 'center',
    padding: '28px 16px',
    background: isRecording ? 'rgba(239,68,68,0.1)' : isThinking ? 'rgba(56,189,248,0.1)' : 'rgba(10, 25, 16, 0.95)',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    borderRadius: '16px',
    marginBottom: '16px',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
    transition: 'background 0.3s',
  };

  const micBtnStyle = {
    width: '120px',
    height: '120px',
    borderRadius: '50%',
    border: 'none',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    fontSize: '48px',
    color: '#fff',
    background: isRecording
      ? 'linear-gradient(135deg, #e53935, #d32f2f)'
      : 'linear-gradient(135deg, #10b981, #059669)',
    boxShadow: isRecording
      ? '0 0 0 12px rgba(229,57,53,0.25), 0 4px 20px rgba(229,57,53,0.4)'
      : '0 0 0 8px rgba(16,185,129,0.2), 0 4px 16px rgba(16,185,129,0.3)',
    transition: 'all 0.3s',
    animation: isRecording ? 'pulse 1.2s infinite' : 'none',
  };

  const statusTextStyle = {
    marginTop: '14px',
    fontSize: '18px',
    fontWeight: 700,
    color: isRecording ? '#f87171' : isThinking ? '#38bdf8' : '#4ade80',
    textAlign: 'center',
  };

  /* ─── TEXT INPUT ─── */
  const inputBarStyle = {
    display: 'flex',
    gap: '8px',
    marginBottom: '16px',
  };

  const inputFieldStyle = {
    flex: 1,
    padding: '14px 16px',
    borderRadius: '12px',
    border: '1px solid rgba(255, 255, 255, 0.15)',
    background: 'rgba(10, 25, 16, 0.95)',
    color: '#fff',
    fontSize: '16px',
    outline: 'none',
    fontFamily: 'inherit',
  };

  const sendBtnStyle = {
    padding: '14px 22px',
    borderRadius: '12px',
    border: 'none',
    background: 'linear-gradient(135deg, #10b981 0%, #059669 100%)',
    color: 'black',
    fontSize: '16px',
    fontWeight: 700,
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    gap: '6px',
  };

  /* ─── CHAT BUBBLES ─── */
  const chatBoxStyle = {
    background: 'rgba(10, 25, 16, 0.95)',
    borderRadius: '16px',
    padding: '16px',
    marginBottom: '16px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  };

  const userBubbleStyle = {
    background: 'rgba(16, 185, 129, 0.12)',
    borderRadius: '14px 14px 14px 2px',
    padding: '14px 18px',
    marginBottom: '12px',
    fontSize: '15px',
    lineHeight: 1.5,
    color: '#fff',
    borderLeft: '4px solid #10b981',
  };

  const aiBubbleStyle = {
    background: 'rgba(56, 189, 248, 0.1)',
    borderRadius: '14px 14px 2px 14px',
    padding: '14px 18px',
    fontSize: '15px',
    lineHeight: 1.6,
    color: '#fff',
    borderLeft: '4px solid #38bdf8',
  };

  const audioBtnStyle = {
    padding: '10px 18px',
    borderRadius: '10px',
    border: 'none',
    fontSize: '14px',
    fontWeight: 600,
    cursor: 'pointer',
    display: 'inline-flex',
    alignItems: 'center',
    gap: '6px',
    marginRight: '8px',
    marginTop: '10px',
  };

  /* ─── QUICK ASK CARDS ─── */
  const cardsHeadingStyle = {
    fontSize: '18px',
    fontWeight: 700,
    color: '#fff',
    marginBottom: '12px',
    display: 'flex',
    alignItems: 'center',
    gap: '8px',
  };

  const cardsGridStyle = {
    display: 'grid',
    gridTemplateColumns: 'repeat(auto-fill, minmax(250px, 1fr))',
    gap: '12px',
    marginBottom: '16px',
  };

  const quickCards = [
    { icon: '💧', title: 'पानी / Irrigation', titleEn: 'When to water?', query: 'When should I apply the first irrigation for Wheat?', border: '#38bdf8' },
    { icon: '🧪', title: 'खाद / Fertilizer', titleEn: 'How much Urea/DAP?', query: 'How much Urea and DAP fertilizer is required for 2 acres?', border: '#10b981' },
    { icon: '🐛', title: 'रोग / Disease', titleEn: 'Pest & disease cure', query: 'How to treat Yellow Rust and fungal disease in Wheat?', border: '#fbbf24' },
    { icon: '💰', title: 'मंडी भाव / Prices', titleEn: 'Today\'s market rate', query: 'What is today\'s Mandi price for Wheat, Paddy and Mustard?', border: '#f472b6' },
    { icon: '🏛️', title: 'योजना / Schemes', titleEn: 'Govt subsidies', query: 'Tell me about PM-Kisan and solar pump subsidy scheme', border: '#a78bfa' },
    { icon: '🚜', title: 'ट्रैक्टर / Machinery', titleEn: 'Equipment rental', query: 'How to book Tractor and Rotavator rental nearby?', border: '#fb923c' },
  ];

  const cardStyle = (card) => ({
    background: 'rgba(10, 25, 16, 0.95)',
    borderRadius: '14px',
    padding: '16px',
    cursor: 'pointer',
    border: '1px solid rgba(255, 255, 255, 0.1)',
    borderLeft: `5px solid ${card.border}`,
    transition: 'transform 0.2s, box-shadow 0.2s',
    display: 'flex',
    alignItems: 'center',
    gap: '12px',
    boxShadow: '0 4px 15px rgba(0,0,0,0.3)',
  });

  /* ─── HISTORY ─── */
  const historyBoxStyle = {
    background: 'rgba(10, 25, 16, 0.95)',
    borderRadius: '14px',
    padding: '14px',
    border: '1px solid rgba(255, 255, 255, 0.12)',
    boxShadow: '0 10px 25px rgba(0, 0, 0, 0.5)',
  };

  const histItemStyle = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '10px 12px',
    borderBottom: '1px solid rgba(255,255,255,0.06)',
    fontSize: '14px',
    color: '#fff',
  };

  const replayBtnStyle = {
    width: '36px',
    height: '36px',
    borderRadius: '50%',
    border: 'none',
    background: 'rgba(16,185,129,0.2)',
    color: '#4ade80',
    fontSize: '16px',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'center',
    flexShrink: 0,
  };

  // Keyframe injection for pulse animation
  useEffect(() => {
    const styleId = 'voice-ai-pulse-anim';
    if (!document.getElementById(styleId)) {
      const style = document.createElement('style');
      style.id = styleId;
      style.textContent = `
        @keyframes pulse {
          0% { transform: scale(1); }
          50% { transform: scale(1.08); }
          100% { transform: scale(1); }
        }
        @keyframes blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.4; }
        }
      `;
      document.head.appendChild(style);
    }
  }, []);

  const languages = [
    { code: 'hi-IN', label: '🇮🇳 हिन्दी' },
    { code: 'en-IN', label: '🇬🇧 English' },
    { code: 'pa-IN', label: '🌾 ਪੰਜਾਬੀ' },
    { code: 'mr-IN', label: '🌿 मराठी' },
    { code: 'te-IN', label: '🍃 తెలుగు' },
    { code: 'ta-IN', label: '🪷 தமிழ்' },
    { code: 'bn-IN', label: '🌾 বাংলা' },
  ];

  return (
    <div className="tab-panel active" style={{ padding: 0 }}>
      <div style={containerStyle}>

        {/* ─── GREEN BANNER ─── */}
        <div style={bannerStyle}>
          <div style={{ fontSize: '14px', opacity: 0.9, marginBottom: '6px' }}>
            <i className="fa-solid fa-seedling"></i> Krishi Voice AI — 24×7 Available
          </div>
          <h2 style={{ margin: '0 0 8px', fontSize: '22px', fontWeight: 800 }}>
            🎙️ किसान AI सहायक — Farmer AI Helper
          </h2>
          <p style={{ margin: 0, fontSize: '14px', opacity: 0.85, lineHeight: 1.5 }}>
            बोलकर या लिखकर पूछें — पानी, खाद, रोग, मंडी भाव, योजनाएं<br />
            Ask by voice or text — Irrigation, Fertilizer, Disease, Prices, Schemes
          </p>

          {/* Language Selector */}
          <div style={langBarStyle}>
            {languages.map(l => (
              <button
                key={l.code}
                type="button"
                style={voiceLang === l.code ? langBtnActive : langBtnBase}
                onClick={() => setVoiceLang(l.code)}
              >
                {l.label}
              </button>
            ))}
          </div>
        </div>

        {/* ─── MIC SECTION ─── */}
        <div style={micSectionStyle}>
          <button type="button" style={micBtnStyle} onClick={toggleRecording}>
            <i className={`fa-solid ${isRecording ? 'fa-stop' : 'fa-microphone'}`}></i>
          </button>
          <div style={statusTextStyle}>
            {isRecording
              ? '🔴 सुन रहा है... बोलिए! — Listening... Speak now!'
              : isThinking
                ? '🔵 सोच रहा है... — Thinking...'
                : isSpeaking
                  ? '🔊 जवाब सुनिए... — Speaking answer...'
                  : '🟢 माइक दबाकर बोलें — Tap mic to speak'}
          </div>
          <p style={{ margin: '8px 0 0', fontSize: '13px', color: '#666', textAlign: 'center' }}>
            बड़ा बटन दबाएं और अपना सवाल बोलें — Press the big button and speak your question
          </p>
        </div>

        {/* ─── TEXT INPUT BAR ─── */}
        <div style={inputBarStyle}>
          <input
            type="text"
            value={customInputText}
            onChange={(e) => setCustomInputText(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === 'Enter' && customInputText.trim()) {
                e.preventDefault();
                handleProcessQuery(customInputText.trim(), voiceLang);
                setCustomInputText('');
              }
            }}
            style={inputFieldStyle}
            placeholder="💬 यहाँ लिखकर पूछें / Type your question here..."
            autoComplete="off"
          />
          <button
            type="button"
            style={sendBtnStyle}
            onClick={() => {
              if (customInputText.trim()) {
                handleProcessQuery(customInputText.trim(), voiceLang);
                setCustomInputText('');
              }
            }}
          >
            <i className="fa-solid fa-paper-plane"></i> पूछें
          </button>
        </div>

        {/* ─── CHAT / RESPONSE ─── */}
        {(userTranscript || aiResponse) && (
          <div style={chatBoxStyle}>
            <div style={{ fontSize: '14px', fontWeight: 700, color: '#666', marginBottom: '10px' }}>
              <i className="fa-solid fa-comments"></i> बातचीत / Conversation
            </div>

            {userTranscript && (
              <div style={userBubbleStyle}>
                <strong>🧑‍🌾 आपका सवाल:</strong>
                <div style={{ marginTop: '4px' }}>"{userTranscript}"</div>
              </div>
            )}

            {isThinking && (
              <div style={{ ...aiBubbleStyle, background: '#fff9c4', borderColor: '#ffb300', color: '#f57f17' }}>
                <i className="fa-solid fa-spinner fa-spin"></i> &nbsp;जवाब तैयार हो रहा है... Generating answer...
              </div>
            )}

            {aiResponse && !isThinking && (
              <div style={aiBubbleStyle}>
                <strong>🤖 AI जवाब:</strong>
                <div style={{ marginTop: '6px' }}>{aiResponse}</div>

                <div>
                  <button
                    type="button"
                    style={{ ...audioBtnStyle, background: '#2e7d32', color: '#fff' }}
                    onClick={() => speakResponse(aiResponse, voiceLang)}
                  >
                    <i className="fa-solid fa-volume-high"></i>
                    {isSpeaking ? 'बोल रहा है...' : '🔊 फिर से सुनें / Replay'}
                  </button>
                  {isSpeaking && (
                    <button
                      type="button"
                      style={{ ...audioBtnStyle, background: '#c62828', color: '#fff' }}
                      onClick={stopSpeaking}
                    >
                      <i className="fa-solid fa-stop"></i> रुकें / Stop
                    </button>
                  )}
                </div>
              </div>
            )}
          </div>
        )}

        {/* ─── QUICK ASK CARDS ─── */}
        <div style={cardsHeadingStyle}>
          <i className="fa-solid fa-hand-pointer" style={{ color: '#ff9800' }}></i>
          <span>👇 एक टैप में पूछें — Tap to ask instantly</span>
        </div>
        <div style={cardsGridStyle}>
          {quickCards.map((card, idx) => (
            <div
              key={idx}
              style={cardStyle(card)}
              onClick={() => handleProcessQuery(card.query, voiceLang)}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translateY(-3px)';
                e.currentTarget.style.boxShadow = '0 6px 20px rgba(0,0,0,0.12)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <div style={{ fontSize: '36px', flexShrink: 0 }}>{card.icon}</div>
              <div>
                <div style={{ fontSize: '16px', fontWeight: 700, color: card.color }}>{card.title}</div>
                <div style={{ fontSize: '13px', color: '#555', marginTop: '2px' }}>{card.titleEn}</div>
              </div>
            </div>
          ))}
        </div>

        {/* ─── AUTO-PLAY + SPEED TOGGLE ─── */}
        <div style={{
          display: 'flex', alignItems: 'center', gap: '16px', padding: '12px 16px',
          background: '#f5f5f5', borderRadius: '12px', marginBottom: '16px', flexWrap: 'wrap', fontSize: '14px',
        }}>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', cursor: 'pointer', fontWeight: 600 }}>
            <input type="checkbox" checked={autoPlay} onChange={(e) => setAutoPlay(e.target.checked)} />
            🔊 ऑटो बोलें / Auto-Speak
          </label>
          <label style={{ display: 'flex', alignItems: 'center', gap: '6px', fontWeight: 600 }}>
            ⚡ Speed:
            <select
              value={voiceSpeed}
              onChange={(e) => setVoiceSpeed(e.target.value)}
              style={{ padding: '6px 10px', borderRadius: '8px', border: '1px solid #ccc', fontSize: '14px' }}
            >
              <option value="0.85">धीमा / Slow</option>
              <option value="1.0">सामान्य / Normal</option>
              <option value="1.15">तेज़ / Fast</option>
            </select>
          </label>
        </div>

        {/* ─── HISTORY ─── */}
        {history.length > 0 && (
          <div style={historyBoxStyle}>
            <div style={{ fontSize: '15px', fontWeight: 700, color: '#555', marginBottom: '10px' }}>
              <i className="fa-solid fa-clock-rotate-left"></i> पुराने सवाल / Recent Questions
            </div>
            {history.map((h, i) => (
              <div key={i} style={histItemStyle}>
                <div style={{ display: 'flex', flexDirection: 'column', minWidth: 0, flex: 1 }}>
                  <span style={{ color: '#999', fontSize: '12px' }}>{h.time}</span>
                  <span style={{ color: '#333', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>"{h.query}"</span>
                </div>
                <button type="button" style={replayBtnStyle} onClick={() => speakResponse(h.response, h.lang)} title="फिर से सुनें / Replay">
                  <i className="fa-solid fa-volume-high"></i>
                </button>
              </div>
            ))}
          </div>
        )}

      </div>
    </div>
  );
}
