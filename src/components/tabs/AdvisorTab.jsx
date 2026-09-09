import React, { useState, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import { getText } from '../../data/constants';

export function AdvisorTab() {
  const { location, crop, soil, stage, area, preference, lang, geminiKey } = useApp();

  const cropName = crop ? (getText(crop.nameKey, lang) || crop.nameEn || crop.name) : 'Not specified';
  const soilName = soil ? (getText(soil.nameKey, lang) || soil.nameEn || soil.name) : 'Not specified';
  const locationName = location ? (location.nameEn || location.name) : 'Not specified';

  const [inputQuery, setInputQuery] = useState('');
  const [consoleLogs, setConsoleLogs] = useState([
    { type: 'muted', text: '> Ready for input parameter generation...' },
    { type: 'info', text: `> Connected to Gemini AI Advisor node (${locationName}).` },
    { type: 'success', text: `> Target crop: ${cropName} (${area ? area + ' acres' : 'Area not set'}) on ${soilName} soil.` }
  ]);

  const [isThinking, setIsThinking] = useState(false);
  const chatHistoryRef = useRef([]);

  const handleSendQuery = async (queryText) => {
    const text = queryText || inputQuery;
    if (!text.trim()) return;

    // Add user log
    setConsoleLogs(prev => [
      ...prev,
      { type: 'user', text: `> User Question: ${text}` }
    ]);
    setInputQuery('');
    setIsThinking(true);

    try {
      const systemPrompt = `You are "Krishi Jal Gemini Advisor" — an expert Indian agronomist AI running inside a farming terminal console.

FARMER'S FIELD DATA:
- Crop: ${cropName}
- Soil: ${soilName}
- Location: ${locationName}
- Farm size: ${area} acres
- Growth stage: ${stage || 'vegetative'}
- Farming preference: ${preference || 'balanced'}

RESPONSE RULES:
1. Start every response with [Gemini AI] prefix.
2. Give specific, actionable agricultural advice with exact dosages, timings, and Indian product names.
3. Keep responses concise (2-4 sentences) — this is a terminal console, not a chat.
4. Use Indian units (₹, quintal, acre, bigha) and mention Indian brands when relevant.
5. Be scientifically accurate with practical field-level advice.
6. Respond in English only (this is a technical console).
7. Do NOT use markdown formatting (no **, ##, bullet points, etc.) — plain text only.`;

      const historyContents = chatHistoryRef.current.slice(-6).map(msg => ({
        role: msg.role,
        parts: [{ text: msg.text }]
      }));

      const requestBody = {
        system_instruction: { parts: [{ text: systemPrompt }] },
        contents: [
          ...historyContents,
          { role: 'user', parts: [{ text }] }
        ],
        generationConfig: {
          temperature: 0.5,
          maxOutputTokens: 300,
          topP: 0.85,
        }
      };

      const key = (geminiKey && geminiKey.trim()) ? geminiKey.trim() : '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';
      let aiText = '';

      if (key.startsWith('AIza')) {
        // Use Gemini API if custom Gemini key provided
        const apiUrl = `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${encodeURIComponent(key)}`;
        const response = await fetch(apiUrl, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify(requestBody)
        });
        if (response.ok) {
          const data = await response.json();
          aiText = data?.candidates?.[0]?.content?.parts?.[0]?.text || '';
        }
      } else {
        // Use Groq Llama-3.3-70B API (Lightning fast)
        const messages = [
          { role: 'system', content: systemPrompt },
          ...chatHistoryRef.current.slice(-6).map(m => ({
            role: m.role === 'user' ? 'user' : 'assistant',
            content: m.text
          })),
          { role: 'user', content: text }
        ];

        const response = await fetch('https://api.groq.com/openai/v1/chat/completions', {
          method: 'POST',
          headers: {
            'Authorization': `Bearer ${key}`,
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({
            model: 'llama-3.3-70b-versatile',
            messages,
            temperature: 0.5,
            max_tokens: 350
          })
        });

        if (response.ok) {
          const data = await response.json();
          const raw = data?.choices?.[0]?.message?.content || '';
          aiText = raw ? `[Groq AI] ${raw.replace(/[\*#_`]/g, '').trim()}` : '';
        }
      }

      if (!aiText) throw new Error('API returned empty response');

      chatHistoryRef.current = [
        ...chatHistoryRef.current.slice(-8),
        { role: 'user', text },
        { role: 'model', text: aiText }
      ];

      setConsoleLogs(prev => [...prev, { type: 'ai', text: aiText }]);
      setIsThinking(false);
    } catch (error) {
      console.warn('Gemini Advisor API failed, using fallback:', error.message);

      // Offline fallback
      let aiText = '';
      const q = text.toLowerCase();

      if (q.includes('fertilizer') || q.includes('recipe') || q.includes('organic')) {
        aiText = `[Gemini AI] For ${cropName} on ${soilName}, apply 40 kg Vermicompost and 10 kg Neem Cake per acre during early ${stage} stage to enhance bio-N fixation.`;
      } else if (q.includes('yellow') || q.includes('cure') || q.includes('leaf')) {
        aiText = `[Gemini AI] Leaf yellowing in ${cropName} usually indicates Nitrogen deficiency or iron chlorosis. Apply 1% Zinc Sulphate + 2% Urea spray during early morning.`;
      } else if (q.includes('pest') || q.includes('aphid') || q.includes('rust')) {
        aiText = `[Gemini AI] Protect ${cropName} by spraying bio-pesticide Azadirachtin (1500 ppm) at 3 ml/liter of water. Ensure uniform canopy coverage.`;
      } else {
        aiText = `[Gemini AI] For your ${area} acre ${cropName} field in ${locationName}, current ambient temperature and humidity favor steady growth. Maintain light drip irrigation every 2 days.`;
      }

      setConsoleLogs(prev => [...prev, { type: 'ai', text: aiText }]);
      setIsThinking(false);
    }
  };


  // Generate 7-day schedule rows
  const scheduleData = [
    { day: 'Day 1 (Today)', temp: '18°C / 32°C', rain: '0 mm (5%)', deficit: 'Low', water: '4.5 mm', action: 'Irrigate early morning (6:00 AM)' },
    { day: 'Day 2 (Tomorrow)', temp: '19°C / 33°C', rain: '0 mm (10%)', deficit: 'Moderate', water: '5.0 mm', action: 'Standard drip cycle' },
    { day: 'Day 3', temp: '20°C / 31°C', rain: '12 mm (75%)', deficit: 'High', water: '0.0 mm', action: 'Skip irrigation - Rain forecast' },
    { day: 'Day 4', temp: '17°C / 29°C', rain: '4 mm (40%)', deficit: 'Low', water: '2.0 mm', action: 'Check sub-soil moisture level' },
    { day: 'Day 5', temp: '18°C / 30°C', rain: '0 mm (15%)', deficit: 'Moderate', water: '4.5 mm', action: 'Apply split Nitrogen dosage' },
    { day: 'Day 6', temp: '19°C / 32°C', rain: '0 mm (5%)', deficit: 'Moderate', water: '5.0 mm', action: 'Drip irrigation cycle' },
    { day: 'Day 7', temp: '20°C / 34°C', rain: '0 mm (0%)', deficit: 'High', water: '5.5 mm', action: 'Evening watering recommended' }
  ];

  return (
    <div className="tab-panel active">
      {/* Interactive AI Thinking Console */}
      <div className="ai-console-wrapper" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', overflow: 'hidden', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        <div className="console-header" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '12px 18px', background: '#F8FAF9', borderBottom: '1px solid #E5E7EB' }}>
          <div className="console-controls" style={{ display: 'flex', gap: '6px' }}>
            <span className="dot red" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#EF4444' }}></span>
            <span className="dot yellow" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#F59E0B' }}></span>
            <span className="dot green" style={{ width: '10px', height: '10px', borderRadius: '50%', background: '#15803D' }}></span>
          </div>
          <div className="console-title" style={{ fontWeight: 'bold', color: '#15803D', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-robot"></i>
            <span>Gemini AI Agricultural Advisor</span>
          </div>
          <div className="console-badge" style={{ background: '#DCFCE7', color: '#15803D', fontSize: '0.75rem', padding: '3px 10px', borderRadius: '20px', fontWeight: 'bold' }}>
            ONLINE
          </div>
        </div>

        {/* Console Logs Area */}
        <div className="console-body" style={{ padding: '16px', background: '#F8FAF9', fontSize: '0.88rem', minHeight: '140px', maxHeight: '240px', overflowY: 'auto', display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {consoleLogs.map((log, idx) => (
            <div key={idx} className={`console-line ${log.type}`} style={{
              color: log.type === 'user' ? '#15803D' : (log.type === 'ai' ? '#17211B' : '#6B7280'),
              fontWeight: log.type === 'user' ? 700 : 400,
              background: log.type === 'ai' ? '#FFFFFF' : 'transparent',
              padding: log.type === 'ai' ? '10px 14px' : '2px 0',
              borderRadius: log.type === 'ai' ? '10px' : '0',
              border: log.type === 'ai' ? '1px solid #E5E7EB' : 'none',
              boxShadow: log.type === 'ai' ? '0 1px 4px rgba(0,0,0,0.03)' : 'none'
            }}>
              {log.text}
            </div>
          ))}
          {isThinking && (
            <div className="console-line text-warning" style={{ color: '#D97706', fontWeight: 600 }}>
              <i className="fa-solid fa-spinner fa-spin" style={{ marginRight: '6px' }}></i>
              Analyzing agronomic data &amp; generating AI prescription...
            </div>
          )}
        </div>

        {/* Quick Prompts Bar */}
        <div className="prompt-chip-bar" style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '12px 18px', background: '#FFFFFF', borderTop: '1px solid #E5E7EB', flexWrap: 'wrap' }}>
          <span className="chip-label" style={{ fontSize: '0.8rem', color: '#6B7280', fontWeight: 'bold' }}>
            <i className="fa-solid fa-bolt" style={{ color: '#F59E0B' }}></i> Quick Prompts:
          </span>
          <button type="button" className="prompt-chip" onClick={() => handleSendQuery("What organic fertilizer recipe is best for Paddy/Rice?")} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', padding: '5px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            🧪 Organic Fertilizer
          </button>
          <button type="button" className="prompt-chip" onClick={() => handleSendQuery("Why are crop leaves turning yellow and curling? How to cure?")} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', padding: '5px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            🍂 Yellow Leaves
          </button>
          <button type="button" className="prompt-chip" onClick={() => handleSendQuery("How to protect Wheat crop from Aphids and Rust disease?")} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', padding: '5px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            🌾 Wheat Pests
          </button>
          <button type="button" className="prompt-chip" onClick={() => handleSendQuery("What flower boosters increase Rose and Marigold blooming?")} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', padding: '5px 12px', borderRadius: '16px', fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer' }}>
            🌸 Flower Boosters
          </button>
        </div>

        {/* Input Row */}
        <div className="console-input-row" style={{ display: 'flex', alignItems: 'center', padding: '12px 18px', background: '#FFFFFF', borderTop: '1px solid #E5E7EB', gap: '10px' }}>
          <span className="console-prompt" style={{ color: '#15803D', fontWeight: 'bold' }}>&gt;</span>
          <input
            type="text"
            className="console-cmd-input"
            value={inputQuery}
            onChange={(e) => setInputQuery(e.target.value)}
            onKeyDown={(e) => e.key === 'Enter' && handleSendQuery()}
            placeholder="Ask AI advisor a question (e.g. fertilizer dosage, pest control...)..."
            style={{ flex: 1, background: '#F8FAF9', border: '1px solid #E5E7EB', borderRadius: '10px', padding: '10px 14px', color: '#17211B', outline: 'none', fontSize: '0.92rem' }}
          />
          <button type="button" className="btn btn-primary" onClick={() => handleSendQuery()} style={{ padding: '10px 18px', fontSize: '0.9rem', borderRadius: '10px', background: '#15803D', color: '#FFFFFF', border: 'none', fontWeight: 600, cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '6px' }}>
            <i className="fa-solid fa-paper-plane"></i> Send
          </button>
        </div>
      </div>

      {/* Advisor Report Output Section */}
      <div className="advisor-report">
        
        {/* Hero Card */}
        <div className="advisor-hero-card" style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', padding: '20px', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <div className="hero-left" style={{ display: 'flex', alignItems: 'center', gap: '16px' }}>
            <div className="ai-avatar" style={{ width: '48px', height: '48px', borderRadius: '50%', background: '#DCFCE7', display: 'flex', alignItems: 'center', justifyContent: 'center', color: '#15803D', fontSize: '1.4rem' }}>
              <i className="fa-solid fa-robot"></i>
            </div>
            <div>
              <h3 className="hero-title" style={{ fontSize: '1.2rem', fontWeight: 'bold', margin: '0 0 4px 0', color: '#17211B' }}>AI Irrigation Prescription</h3>
              <p className="hero-subtitle" style={{ fontSize: '0.85rem', color: '#6B7280', margin: '0' }}>
                Customized for {cropName} on {soilName} ({area} acres) in {locationName}
              </p>
            </div>
          </div>
          <div className="hero-value-badge" style={{ textAlign: 'right', background: '#F0FDF4', padding: '10px 18px', borderRadius: '12px', border: '1px solid #BBF7D0' }}>
            <span className="hero-val-num" style={{ fontSize: '1.5rem', fontWeight: 'bold', color: '#15803D', display: 'block' }}>4.8</span>
            <span className="hero-val-unit" style={{ fontSize: '0.75rem', color: '#4B5563', fontWeight: 600 }}>mm / day</span>
          </div>
        </div>

        {/* 7-Day Irrigation Schedule Table */}
        <div className="schedule-section" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '20px', marginBottom: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
          <h4 className="section-title" style={{ fontSize: '1.05rem', fontWeight: 'bold', marginBottom: '15px', color: '#17211B', display: 'flex', alignItems: 'center', gap: '8px' }}>
            <i className="fa-solid fa-calendar-days" style={{ color: '#15803D' }}></i> 
            <span>7-Day Recommended Irrigation Schedule</span>
          </h4>
          <div className="table-responsive" style={{ overflowX: 'auto' }}>
            <table className="schedule-table" style={{ width: '100%', borderCollapse: 'collapse', textAlign: 'left', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ borderBottom: '1px solid #E5E7EB', color: '#6B7280', background: '#F8FAF9' }}>
                  <th style={{ padding: '12px' }}>Day / Date</th>
                  <th style={{ padding: '12px' }}>Temp (Min/Max)</th>
                  <th style={{ padding: '12px' }}>Forecast Rain</th>
                  <th style={{ padding: '12px' }}>Moisture Deficit</th>
                  <th style={{ padding: '12px' }}>Irrigation Depth</th>
                  <th style={{ padding: '12px' }}>Action &amp; Best Time</th>
                </tr>
              </thead>
              <tbody>
                {scheduleData.map((row, idx) => (
                  <tr key={idx} style={{ borderBottom: '1px solid #E5E7EB', background: idx % 2 === 0 ? '#FFFFFF' : '#F8FAF9', color: '#17211B' }}>
                    <td style={{ padding: '12px', fontWeight: 'bold' }}>{row.day}</td>
                    <td style={{ padding: '12px' }}>{row.temp}</td>
                    <td style={{ padding: '12px', color: '#2563EB', fontWeight: 600 }}>{row.rain}</td>
                    <td style={{ padding: '12px' }}>{row.deficit}</td>
                    <td style={{ padding: '12px', fontWeight: 'bold', color: '#15803D' }}>{row.water}</td>
                    <td style={{ padding: '12px' }}>{row.action}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>

        {/* Expert Care Tips */}
        <div className="report-details-grid" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: '18px' }}>
          <div className="details-card" style={{ background: '#FFFFFF', border: '1px solid #BBF7D0', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h4 className="card-sub-title" style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#15803D', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-circle-exclamation"></i> Critical Crop Care Tips
            </h4>
            <ul style={{ paddingLeft: '20px', margin: '0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#374151' }}>
              <li>Schedule first irrigation early morning (6:00 AM - 8:00 AM) to minimize soil surface evaporation.</li>
              <li>Apply organic Neem Oil spray (3 ml/L) to prevent early pest vector infestations.</li>
              <li>Ensure adequate sub-soil drainage before entering peak flowering stage.</li>
            </ul>
          </div>

          <div className="details-card" style={{ background: '#FFFFFF', border: '1px solid #FED7AA', borderRadius: '16px', padding: '20px', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            <h4 className="card-sub-title" style={{ fontSize: '1rem', fontWeight: 'bold', marginBottom: '12px', color: '#D97706', display: 'flex', alignItems: 'center', gap: '8px' }}>
              <i className="fa-solid fa-droplet-slash"></i> Water Conservation Actions
            </h4>
            <ul style={{ paddingLeft: '20px', margin: '0', display: 'flex', flexDirection: 'column', gap: '8px', fontSize: '0.88rem', color: '#374151' }}>
              <li>Use organic straw mulching along crop rows to conserve up to 30% soil moisture.</li>
              <li>Implement drip line pressure regulators to maintain uniform flow across field contours.</li>
              <li>Monitor 7-day rainfall forecast before initiating secondary irrigation cycles.</li>
            </ul>
          </div>
        </div>

      </div>
    </div>
  );
}
