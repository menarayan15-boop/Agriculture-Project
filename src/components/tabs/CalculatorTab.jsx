import React, { useState, useEffect, useCallback, useRef } from 'react';
import { useApp } from '../../context/AppContext';
import {
  UNIT_TO_ACRE, UNIT_NAMES, CROP_DATA as DEFAULT_CROP_DATA, FERTILIZER_DATA as DEFAULT_FERTILIZER_DATA,
  LABOUR_ACTIVITIES, MACHINERY_DATA as DEFAULT_MACHINERY_DATA, STORAGE_TYPES,
  toAcres, fmt,
  calcSeed, calcFertilizer, calcIrrigation, calcSpray,
  calcLabour, calcMachinery, calcLoan, calcStorage, calcROI
} from '../../utils/farmingCalc';

// ── i18n Dictionary for Calculator ──────────────────────────────────────────
const CALC_LANG = {
  en: {
    reset: "Reset",
    calculate: "Calculate",
    save: "Save",
    history: "History",
    settings: "Admin Settings",
    dashboard: "Farm Dashboard",
    recommendations: "Smart Insights",
    disclaimer: "Disclaimer: All calculations are estimates based on standard references. Actual values may vary with soil conditions, microclimate, and local practices.",
    voiceActive: "Listening...",
    voiceHint: "Click mic and say a number",
    loadCalculated: "Load calculated values",
    formula: "Formula used:",
    successSave: "Calculation saved successfully!"
  },
  hi: {
    reset: "रीसेट करें",
    calculate: "गणना करें",
    save: "सुरक्षित करें",
    history: "इतिहास",
    settings: "व्यवस्थापक सेटिंग्स",
    dashboard: "फार्म डैशबोर्ड",
    recommendations: "स्मार्ट सुझाव",
    disclaimer: "अस्वीकरण: सभी गणनाएँ संदर्भों पर आधारित अनुमान हैं। वास्तविक परिणाम मिट्टी और स्थानीय प्रथाओं के अनुसार भिन्न हो सकते हैं।",
    voiceActive: "सुन रहा है...",
    voiceHint: "माइक दबाकर संख्या बोलें",
    loadCalculated: "परिकलित मान लोड करें",
    formula: "प्रयुक्त सूत्र:",
    successSave: "गणना सफलतापूर्वक सहेज ली गई!"
  },
  kn: {
    reset: "ಮರುಹೊಂದಿಸಿ",
    calculate: "ಲೆಕ್ಕ ಹಾಕಿ",
    save: "ಉಳಿಸಿ",
    history: "ಇತಿಹಾಸ",
    settings: "ನಿರ್ವಾಹಕ ಸೆಟ್ಟಿಂಗ್ಸ್",
    dashboard: "ಫಾರ್ಮ್ ಡ್ಯಾಶ್‌ಬೋರ್ಡ್",
    recommendations: "ಸ್ಮಾರ್ಟ್ ಸಲಹೆಗಳು",
    disclaimer: "ಹಕ್ಕುತ್ಯಾಗ: ಎಲ್ಲಾ ಲೆಕ್ಕಾಚಾರಗಳು ಸಾಮಾನ್ಯ ಅಂದಾಜುಗಳಾಗಿವೆ. ಮಣ್ಣು ಮತ್ತು ಪ್ರಾದೇಶಿಕ ಪದ್ಧತಿಗಳಿಗೆ ಅನುಗುಣವಾಗಿ ನೈಜ ಫಲಿತಾಂಶಗಳು ಬದಲಾಗಬಹುದು.",
    voiceActive: "ಕೇಳಿಸಿಕೊಳ್ಳುತ್ತಿದೆ...",
    voiceHint: "ಮೈಕ್ ಒತ್ತಿ ಸಂಖ್ಯೆ ಹೇಳಿ",
    loadCalculated: "ಲೆಕ್ಕಾಚಾರದ ಮೌಲ್ಯಗಳನ್ನು ಲೋಡ್ ಮಾಡಿ",
    formula: "ಬಳಸಿದ ಸೂತ್ರ:",
    successSave: "ಲೆಕ್ಕಾಚಾರವನ್ನು ಯಶಸ್ವಿಯಾಗಿ ಉಳಿಸಲಾಗಿದೆ!"
  }
};

const C = {
  green: 'var(--primary-light)', blue: '#60a5fa', amber: '#f59e0b',
  red: '#ef4444', purple: '#a855f7', cyan: '#06b6d4', rose: '#f43f5e'
};

const NAV = [
  { id: 'dashboard',    icon: '📊', label: 'Dashboard',       group: 'overview' },
  { id: 'area',         icon: '📐', label: 'Area',            group: 'basics'   },
  { id: 'seed',         icon: '🌱', label: 'Seed',            group: 'basics'   },
  { id: 'fertilizer',   icon: '🧪', label: 'Fertilizer',      group: 'basics'   },
  { id: 'irrigation',   icon: '💧', label: 'Irrigation',      group: 'resources'},
  { id: 'spray',        icon: '🔫', label: 'Pesticide/Spray', group: 'resources'},
  { id: 'labour',       icon: '👷', label: 'Labour',          group: 'operations'},
  { id: 'machinery',    icon: '🚜', label: 'Machinery',       group: 'operations'},
  { id: 'farmcost',     icon: '🧾', label: 'Farm Cost',       group: 'economics'},
  { id: 'profit',       icon: '💰', label: 'Profit',          group: 'economics'},
  { id: 'breakeven',    icon: '⚖️', label: 'Break-Even',      group: 'economics'},
  { id: 'loan',         icon: '🏦', label: 'Loan / EMI',      group: 'economics'},
  { id: 'roi',          icon: '📈', label: 'ROI',             group: 'economics'},
  { id: 'crop_compare', icon: '🆚', label: 'Crop Comparison', group: 'advanced' },
  { id: 'mandi_profit', icon: '🏪', label: 'Mandi Profit',    group: 'advanced' },
  { id: 'storage',      icon: '🏗️', label: 'Storage',         group: 'advanced' },
  { id: 'multicrop',    icon: '🗺️', label: 'Multi-Crop Farm', group: 'advanced' },
  { id: 'settings',     icon: '⚙️', label: 'Admin Settings',  group: 'settings'  },
  { id: 'history',      icon: '🕐', label: 'Saved Calcs',     group: 'history'  },
];

const GROUP_LABELS = {
  overview: { label: 'Overview', color: C.cyan },
  basics:   { label: '🌾 Farm Basics', color: C.green },
  resources:{ label: '💧 Resources', color: C.blue },
  operations:{ label: '⚙️ Operations', color: C.amber },
  economics:{ label: '💰 Economics', color: C.purple },
  advanced: { label: '📊 Advanced', color: C.rose },
  settings: { label: '⚙️ Config', color: '#94a3b8' },
  history:  { label: '🕐 History', color: '#64748b' },
};

// ── Shared UI Components ──────────────────────────────────────────────────────

function Label({ children, hint, lang = 'en' }) {
  return (
    <div style={{ marginBottom: 4 }}>
      <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.7)', fontWeight: 600 }}>{children}</span>
      {hint && <span style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginLeft: 6 }}>({hint})</span>}
    </div>
  );
}

// Voice enabled input field
function InputWithVoice({ value, onChange, type = 'number', min = '0', step = '0.1', placeholder, style, label, hint, resetValue, lang = 'en' }) {
  const [listening, setListening] = useState(false);
  const recognitionRef = useRef(null);

  const startVoiceInput = () => {
    const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
    if (!SpeechRecognition) {
      alert("Speech Recognition not supported in this browser. Please use Chrome/Edge.");
      return;
    }
    
    setListening(true);
    const rec = new SpeechRecognition();
    rec.lang = lang === 'hi' ? 'hi-IN' : lang === 'kn' ? 'kn-IN' : 'en-IN';
    rec.interimResults = false;
    rec.maxAlternatives = 1;

    rec.onresult = (e) => {
      const text = e.results[0][0].transcript;
      const num = text.replace(/[^0-9.]/g, '');
      if (num) {
        onChange(parseFloat(num));
      } else {
        console.warn("Could not extract digits from voice input:", text);
      }
      setListening(false);
    };

    rec.onerror = () => setListening(false);
    rec.onend = () => setListening(false);
    
    recognitionRef.current = rec;
    rec.start();
  };

  const warnClass = value < 0 ? C.red : (value > 5000000 ? C.amber : 'transparent');

  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Label hint={hint} lang={lang}>{label}</Label>
        <div style={{ display: 'flex', gap: 6 }}>
          {resetValue !== undefined && (
            <button 
              onClick={() => onChange(resetValue)} 
              title={CALC_LANG[lang].reset} 
              style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.72rem' }}
            >
              🔄
            </button>
          )}
          <button
            onClick={startVoiceInput}
            title={listening ? CALC_LANG[lang].voiceActive : CALC_LANG[lang].voiceHint}
            style={{
              background: listening ? C.red : 'rgba(255,255,255,0.06)',
              border: listening ? 'none' : '1px solid rgba(255,255,255,0.12)',
              borderRadius: 6, width: 22, height: 22, display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: '#fff', fontSize: '0.7rem'
            }}
          >
            🎙️
          </button>
        </div>
      </div>
      <div style={{ position: 'relative' }}>
        <input
          type={type} value={value} onChange={e => {
            const v = type === 'number' ? Math.max(0, parseFloat(e.target.value) || 0) : e.target.value;
            onChange(v);
          }}
          min={min} step={step} placeholder={placeholder}
          style={{
            width: '100%', padding: '10px 12px', borderRadius: 10,
            background: 'rgba(255,255,255,0.06)', 
            border: `1px solid ${warnClass !== 'transparent' ? warnClass : 'rgba(255,255,255,0.12)'}`,
            color: '#fff', fontSize: '0.92rem', boxSizing: 'border-box', ...style
          }}
        />
        {listening && (
          <span style={{ position: 'absolute', right: 10, top: 10, fontSize: '0.7rem', color: C.red, animation: 'pulse 1s infinite' }}>
            ● Rec
          </span>
        )}
      </div>
      {value > 1000000 && (
        <span style={{ fontSize: '0.68rem', color: C.amber }}>⚠️ Unusually high value entered. Please double check.</span>
      )}
    </div>
  );
}

function Select({ value, onChange, children, style }) {
  return (
    <select value={value} onChange={e => onChange(e.target.value)}
      style={{
        width: '100%', padding: '10px 12px', borderRadius: 10,
        background: 'rgba(20,28,22,0.98)', border: '1px solid rgba(255,255,255,0.12)',
        color: '#fff', fontSize: '0.92rem', boxSizing: 'border-box', cursor: 'pointer', ...style
      }}>
      {children}
    </select>
  );
}

function CropSelect({ value, onChange, cropData }) {
  return (
    <Select value={value} onChange={onChange}>
      {Object.entries(cropData).map(([k, v]) => (
        <option key={k} value={k}>{v.icon} {v.name} ({v.nameHi})</option>
      ))}
    </Select>
  );
}

function UnitSelect({ value, onChange }) {
  return (
    <Select value={value} onChange={onChange}>
      {Object.entries(UNIT_NAMES).map(([k, v]) => (
        <option key={k} value={k}>{v}</option>
      ))}
    </Select>
  );
}

function FormRow({ label, hint, children, onReset }) {
  return (
    <div style={{ marginBottom: 14 }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <Label hint={hint}>{label}</Label>
        {onReset && (
          <button onClick={onReset} style={{ background: 'none', border: 'none', color: 'rgba(255,255,255,0.3)', cursor: 'pointer', fontSize: '0.72rem' }}>
            🔄
          </button>
        )}
      </div>
      {children}
    </div>
  );
}

function ResultCard({ label, value, sub, color = C.green, icon }) {
  return (
    <div style={{
      background: `${color}12`, border: `1px solid ${color}28`,
      borderRadius: 12, padding: '12px 16px', textAlign: 'center',
      transition: 'transform 0.2s', position: 'relative', overflow: 'hidden'
    }}>
      <div style={{ position: 'absolute', right: -6, top: -6, fontSize: '2.5rem', opacity: 0.05 }}>{icon}</div>
      {icon && <div style={{ fontSize: '1.4rem', marginBottom: 2 }}>{icon}</div>}
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: 4, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: '1.25rem', fontWeight: 800, color }}>{value}</div>
      {sub && <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)', marginTop: 3 }}>{sub}</div>}
    </div>
  );
}

function BigResult({ label, value, color = C.green, sub }) {
  return (
    <div style={{
      background: `${color}12`, border: `1px solid ${color}30`,
      borderRadius: 14, padding: '16px 20px', marginBottom: 12
    }}>
      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)', marginBottom: 6, textTransform: 'uppercase', letterSpacing: '0.06em' }}>{label}</div>
      <div style={{ fontSize: '2rem', fontWeight: 900, color }}>{value}</div>
      {sub && <div style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)', marginTop: 4 }}>{sub}</div>}
    </div>
  );
}

function PanelHeader({ icon, title, subtitle }) {
  return (
    <div style={{ marginBottom: '1.2rem', borderBottom: '1px solid rgba(255,255,255,0.08)', paddingBottom: '0.8rem' }}>
      <h3 style={{ margin: 0, fontSize: '1.15rem', display: 'flex', alignItems: 'center', gap: 8 }}>
        <span style={{ fontSize: '1.4rem' }}>{icon}</span> {title}
      </h3>
      {subtitle && <p style={{ margin: '4px 0 0', fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>{subtitle}</p>}
    </div>
  );
}

function Disclaimer({ text, lang = 'en' }) {
  return (
    <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.2)', borderRadius: 10, padding: '8px 12px', marginTop: 12 }}>
      <p style={{ margin: 0, fontSize: '0.72rem', color: '#fbbf24', lineHeight: 1.6 }}>
        ⚠️ {text || CALC_LANG[lang].disclaimer}
      </p>
    </div>
  );
}

function Grid({ cols = 2, children, style }) {
  return (
    <div style={{ display: 'grid', gridTemplateColumns: `repeat(${cols}, 1fr)`, gap: 10, ...style }}>
      {children}
    </div>
  );
}

// ── CALCULATOR SUB-PANELS ─────────────────────────────────────────────────────

// 1. Dashboard
function DashboardPanel({ gs, cropData }) {
  const acres = toAcres(gs.area, gs.unit);
  const crop  = cropData[gs.crop] || cropData.wheat;
  const seed  = calcSeed(gs.crop, acres, 0, 0);
  const fert  = calcFertilizer(gs.crop, acres, 'balanced', 'medium');
  const irrig = calcIrrigation(gs.crop, acres, 'drip', null);
  const expectedRevenue = crop.yieldQtlAcre * acres * (crop.msp || 2000);
  const totalCost = crop.typicalCostAcre * acres;
  const { profit, roi } = calcROI(totalCost, expectedRevenue);

  const cards = [
    { icon: '📐', label: 'Land Area',         value: `${gs.area} ${gs.unit}`, sub: `= ${fmt(acres, 2)} acres`, color: C.cyan },
    { icon: '🌱', label: 'Seed Required',      value: seed.qty < 1 ? `${fmt(seed.qty * 1000)} g` : `${fmt(seed.qty, 1)} kg`, sub: crop.name, color: C.green },
    { icon: '🧪', label: 'Fertilizer (Urea)',  value: `${fert.ureaBags} bags`, sub: `+ ${fert.dapBags} DAP + ${fert.mopBags} MOP`, color: C.amber },
    { icon: '💧', label: 'Water Required',     value: `${fmt(irrig.totalLit / 1000)} KL`, sub: `${irrig.cycles} irrigations`, color: C.blue },
    { icon: '💰', label: 'Typical Farm Cost',  value: `₹${fmt(totalCost)}`, sub: `₹${fmt(crop.typicalCostAcre)}/acre`, color: C.purple },
    { icon: '📦', label: 'Expected Yield',     value: `${fmt(crop.yieldQtlAcre * acres, 1)} qtl`, sub: `${crop.yieldQtlAcre} qtl/acre`, color: C.green },
    { icon: '📈', label: 'Expected Revenue',   value: `₹${fmt(expectedRevenue)}`, sub: crop.msp ? `@MSP ₹${crop.msp}/qtl` : 'At typical price', color: C.cyan },
    { icon: '💵', label: 'Expected Profit',    value: `₹${fmt(profit)}`, sub: profit >= 0 ? '🟢 Profitable' : '🔴 Loss', color: profit >= 0 ? C.green : C.red },
    { icon: '📊', label: 'Estimated ROI',      value: `${fmt(roi, 1)}%`, sub: roi >= 20 ? '🌟 Good return' : 'Moderate', color: roi >= 20 ? C.green : C.amber },
  ];

  return (
    <div>
      <PanelHeader icon="📊" title="Farming Dashboard & Overview" subtitle={`Quick estimation summary for ${crop.icon} ${crop.name} on ${gs.area} ${gs.unit}`} />
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(200px, 1fr))', gap: 10 }}>
        {cards.map(c => <ResultCard key={c.label} icon={c.icon} label={c.label} value={c.value} sub={c.sub} color={c.color} />)}
      </div>
      <div style={{ marginTop: 16 }}>
        <h4 style={{ color: C.green, marginBottom: 8, fontSize: '0.9rem' }}>💡 Smart Suggestions & Insights</h4>
        <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 14, fontSize: '0.82rem', lineHeight: 1.7 }}>
          <ul style={{ margin: 0, paddingLeft: 16, display: 'flex', flexDirection: 'column', gap: 6 }}>
            <li>Based on your land size, seed rate calculation indicates you will need approximately <strong>{seed.qty.toFixed(1)} kg</strong> of seed.</li>
            <li>Recommended base fertilizer expense sits at around <strong>₹{fert.totalCost.toLocaleString('en-IN')}</strong> using balanced application.</li>
            <li>Expected break-even market price for this yield and cost structure is approximately <strong>₹{(totalCost / (crop.yieldQtlAcre * acres || 1)).toFixed(0)}/Quintal</strong>.</li>
            <li>Machinery rental is estimated to be cheaper than outright purchasing machinery for this land size of {gs.area} {gs.unit}.</li>
          </ul>
        </div>
      </div>
    </div>
  );
}

// 2. Area Calculator
function AreaPanel({ gs, setGs, lang }) {
  const [len, setLen] = useState(100);
  const [wid, setWid] = useState(100);
  const [dimUnit, setDimUnit] = useState('feet');
  const [useDimensions, setUseDimensions] = useState(true);

  // Conversion rates (sq ft to other units)
  const conversionRates = {
    sqft: 1,
    sqm: 10.7639,
    acre: 43560,
    hectare: 107639,
    guntha: 1089,
    bigha_pucca: 27225,
    bigha_kacha: 9075
  };

  let sqFt = 0;
  if (useDimensions) {
    const rawArea = len * wid;
    if (dimUnit === 'feet') sqFt = rawArea;
    else if (dimUnit === 'meters') sqFt = rawArea * 10.7639;
    else if (dimUnit === 'gaj') sqFt = rawArea * 9;
    else if (dimUnit === 'karam') sqFt = rawArea * 30.25; // 1 karam x 1 karam = 5.5 x 5.5 = 30.25 sq ft
  } else {
    sqFt = gs.area * (conversionRates[gs.unit] || 43560);
  }

  const acres = sqFt / 43560;
  const hectares = sqFt / 107639;
  const sqMeters = sqFt / 10.7639;
  const gunthas = sqFt / 1089;
  const bighaPucca = sqFt / 27225;
  const bighaKacha = sqFt / 9075;

  const handleApply = () => {
    setGs(p => ({ ...p, area: parseFloat(acres.toFixed(2)), unit: 'acre' }));
  };

  return (
    <div>
      <PanelHeader icon="📐" title="Crop Area Calculator" subtitle="Calculate field area and convert between regional units" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <div style={{ display: 'flex', gap: 10, marginBottom: 16 }}>
            <button 
              onClick={() => setUseDimensions(true)} 
              style={{
                flex: 1, padding: 8, borderRadius: 8, border: 'none',
                background: useDimensions ? C.green : 'rgba(255,255,255,0.05)',
                color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'
              }}
            >
              📏 Enter Dimensions
            </button>
            <button 
              onClick={() => setUseDimensions(false)} 
              style={{
                flex: 1, padding: 8, borderRadius: 8, border: 'none',
                background: !useDimensions ? C.green : 'rgba(255,255,255,0.05)',
                color: '#fff', cursor: 'pointer', fontWeight: 600, fontSize: '0.8rem'
              }}
            >
              📍 Enter Direct Area
            </button>
          </div>

          {useDimensions ? (
            <>
              <InputWithVoice label="Land Length" value={len} onChange={setLen} resetValue={100} lang={lang} />
              <InputWithVoice label="Land Width" value={wid} onChange={setWid} resetValue={100} lang={lang} />
              <FormRow label="Dimension Unit">
                <Select value={dimUnit} onChange={setDimUnit}>
                  <option value="feet">Feet (फुट)</option>
                  <option value="meters">Meters (मीटर)</option>
                  <option value="gaj">Gaj/Yards (गज)</option>
                  <option value="karam">Karam (करम)</option>
                </Select>
              </FormRow>
            </>
          ) : (
            <>
              <InputWithVoice label="Direct Land Area" value={gs.area} onChange={v => setGs(p => ({ ...p, area: v }))} resetValue={1} lang={lang} />
              <FormRow label="Area Unit">
                <UnitSelect value={gs.unit} onChange={v => setGs(p => ({ ...p, unit: v }))} />
              </FormRow>
            </>
          )}

          {useDimensions && (
            <button 
              onClick={handleApply} 
              style={{
                width: '100%', padding: '10px 14px', background: C.green,
                color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
                fontWeight: 700, fontSize: '0.85rem', marginTop: 10
              }}
            >
              Apply to Global State ({acres.toFixed(2)} Acres)
            </button>
          )}
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
          <ResultCard label="Total Area (Acres)" value={`${acres.toFixed(3)} acres`} color={C.green} />
          <ResultCard label="Hectares" value={`${hectares.toFixed(3)} ha`} color={C.blue} />
          <ResultCard label="Square Meters" value={`${fmt(sqMeters)} sq m`} color={C.cyan} />
          <ResultCard label="Square Feet" value={`${fmt(sqFt)} sq ft`} color={C.amber} />
          <ResultCard label="Guntha" value={`${gunthas.toFixed(2)} gunthas`} color={C.purple} />
          <Grid cols={2}>
            <ResultCard label="Bigha (Pucca)" value={`${bighaPucca.toFixed(2)}`} color={C.rose} />
            <ResultCard label="Bigha (Kacha)" value={`${bighaKacha.toFixed(2)}`} color={C.rose} />
          </Grid>
        </div>
      </div>
    </div>
  );
}

// 3. Seed Requirement Calculator
function SeedPanel({ gs, setGs, cropData, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [customRate, setCustomRate] = useState('');
  const [priceKg, setPriceKg] = useState(90);

  const acres = toAcres(area, unit);
  const cropInfo = cropData[crop] || cropData.wheat;
  const recommendedRate = customRate ? parseFloat(customRate) : cropInfo.seedRateKgAcre;
  const totalSeed = recommendedRate * acres;
  const totalCost = totalSeed * priceKg;

  // Sync to global context on save
  const handleApply = () => {
    setGs(p => ({ ...p, crop, area: parseFloat(area), unit }));
  };

  return (
    <div>
      <PanelHeader icon="🌱" title="Seed Requirement Calculator" subtitle="Determine optimal seed quantities and costs based on acreage" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
          <FormRow label="Land Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <InputWithVoice 
            label="Recommended Seed Rate (kg/acre)" 
            hint={`Default: ${cropInfo.seedRateKgAcre} kg`} 
            value={customRate || cropInfo.seedRateKgAcre} 
            onChange={setCustomRate} 
            resetValue={cropInfo.seedRateKgAcre} 
            lang={lang} 
          />
          <InputWithVoice label="Seed Price (₹/kg)" value={priceKg} onChange={setPriceKg} resetValue={90} lang={lang} />
          <button 
            onClick={handleApply} 
            style={{
              width: '100%', padding: '10px 14px', background: 'rgba(255, 255, 255, 0.08)',
              color: '#fff', border: '1px solid rgba(255, 255, 255, 0.15)', borderRadius: 10,
              cursor: 'pointer', fontWeight: 700, fontSize: '0.85rem', marginTop: 10
            }}
          >
            Apply to Global Farm State
          </button>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Seed Required" value={`${totalSeed.toFixed(1)} kg`} color={C.green} sub={`Rate per unit: ${recommendedRate} kg/acre`} />
          <BigResult label="Estimated Seed Cost" value={`₹${fmt(totalCost)}`} color={C.amber} />
          <ResultCard label="Formula Used" value="Seed Rate × Acres" sub="Rounded up for safety margin" color={C.blue} />
          <Disclaimer text="Ensure seed has a germination rate of 85%+. Adjust seed rates if using broadcasting vs. line-sowing methods." />
        </div>
      </div>
    </div>
  );
}

// 4. Fertilizer Panel
function FertilizerPanel({ gs, fertilizerData, cropData, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [soilType, setSoilType] = useState('medium');
  const [growthStage, setGrowthStage] = useState('vegetative');
  const [fertilizerType, setFertilizerType] = useState('urea_dap_mop');

  const acres = toAcres(area, unit);
  const cropInfo = cropData[crop] || cropData.wheat;

  // Modifiers based on stage and soil type
  const soilModifier = { sandy: 1.2, loamy: 1.0, medium: 1.0, clay: 0.85, black: 0.8 }[soilType] || 1.0;
  const stageModifier = { sowing: 0.4, vegetative: 1.0, flowering: 0.6, maturity: 0.1 }[growthStage] || 1.0;

  const nReq = cropInfo.npkAcre.N * acres * soilModifier * stageModifier;
  const pReq = cropInfo.npkAcre.P * acres * soilModifier * stageModifier;
  const kReq = cropInfo.npkAcre.K * acres * soilModifier * stageModifier;

  let qtyMessage = "";
  let estCost = 0;

  if (fertilizerType === 'urea_dap_mop') {
    const ureaBags = Math.ceil(nReq / 23); // 46% of 50kg bag
    const dapBags = Math.ceil(pReq / 23);  // 46% of 50kg bag
    const mopBags = Math.ceil(kReq / 30);  // 60% of 50kg bag
    estCost = (ureaBags * fertilizerData.urea.pricePerBag) + (dapBags * fertilizerData.dap.pricePerBag) + (mopBags * fertilizerData.mop.pricePerBag);
    qtyMessage = `${ureaBags} Bags Urea + ${dapBags} Bags DAP + ${mopBags} Bags MOP`;
  } else if (fertilizerType === 'ssp_urea') {
    const sspBags = Math.ceil(pReq / 8); // 16% of 50kg bag
    const ureaBags = Math.ceil(nReq / 23);
    estCost = (sspBags * fertilizerData.ssp.pricePerBag) + (ureaBags * fertilizerData.urea.pricePerBag);
    qtyMessage = `${sspBags} Bags SSP + ${ureaBags} Bags Urea`;
  } else {
    // NPK Mixture
    const npkBags = Math.ceil(Math.max(nReq, pReq, kReq) / 16);
    estCost = npkBags * fertilizerData.npk_mix.pricePerBag;
    qtyMessage = `${npkBags} Bags NPK 12-32-16 Mixture`;
  }

  return (
    <div>
      <PanelHeader icon="🧪" title="Fertilizer Requirement Calculator" subtitle="Determine standard NPK weights and corresponding fertilizer bags" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
          <FormRow label="Land Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <FormRow label="Soil Type">
            <Select value={soilType} onChange={setSoilType}>
              <option value="sandy">Sandy (ಮರಳು ಮಣ್ಣು / रेतीली)</option>
              <option value="loamy">Loamy (ಜೀವೋಡ ಮಣ್ಣು / दोमट)</option>
              <option value="medium">Medium (ಮಧ್ಯಮ ಮಣ್ಣು / मध्यम)</option>
              <option value="clay">Clay (ಜೇಡಿಮಣ್ಣು / चिकनी)</option>
              <option value="black">Black Soil (ಕರಿ ಮಣ್ಣು / काली मिट्टी)</option>
            </Select>
          </FormRow>
          <FormRow label="Growth Stage">
            <Select value={growthStage} onChange={setGrowthStage}>
              <option value="sowing">Sowing / Basal (ಬಿತ್ತನೆ ಸಮಯ)</option>
              <option value="vegetative">Vegetative (ಬೆಳವಣಿಗೆಯ ಹಂತ)</option>
              <option value="flowering">Flowering (ಹೂಬಿಡುವ ಹಂತ)</option>
              <option value="maturity">Maturity (ಪಕ್ವ ಹಂತ)</option>
            </Select>
          </FormRow>
          <FormRow label="Available Fertilizer Type">
            <Select value={fertilizerType} onChange={setFertilizerType}>
              <option value="urea_dap_mop">Urea + DAP + MOP Combination</option>
              <option value="ssp_urea">SSP + Urea (Alternative)</option>
              <option value="npk_mix">NPK 12-32-16 Mixture</option>
            </Select>
          </FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Quantity of Fertilizer Required" value={qtyMessage} color={C.green} />
          <BigResult label="Estimated Fertilizer Cost" value={`₹${fmt(estCost)}`} color={C.amber} />
          <div style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: 12 }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.5)', marginBottom: 6, textTransform: 'uppercase' }}>NPK Requirement Breakdown</div>
            <Grid cols={3}>
              <ResultCard label="N (Nitrogen)" value={`${nReq.toFixed(1)} kg`} color={C.green} />
              <ResultCard label="P (Phosphorus)" value={`${pReq.toFixed(1)} kg`} color={C.blue} />
              <ResultCard label="K (Potash)" value={`${kReq.toFixed(1)} kg`} color={C.amber} />
            </Grid>
          </div>
          <Disclaimer text="NPK targets are estimates. For optimal health and soil conservation, verify with a government soil health card." />
        </div>
      </div>
    </div>
  );
}

// 5. Irrigation Calculator
function IrrigationPanel({ gs, cropData, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [method, setMethod] = useState('drip');
  const [cycles, setCycles] = useState(6);
  const [soilType, setSoilType] = useState('medium');

  const acres = toAcres(area, unit);
  const cropInfo = cropData[crop] || cropData.wheat;

  const soilFactor = { sandy: 1.3, loamy: 1.0, medium: 1.0, clay: 0.8 }[soilType] || 1.0;
  const methodFactor = { drip: 0.5, sprinkler: 0.7, flood: 1.0 }[method] || 1.0;

  const totalWater = cropInfo.waterLitAcre * acres * soilFactor * methodFactor;
  const perIrrigation = totalWater / (parseFloat(cycles) || 6);
  const irrigationCost = acres * (parseFloat(cycles) || 6) * { drip: 200, sprinkler: 300, flood: 500 }[method];

  return (
    <div>
      <PanelHeader icon="💧" title="Irrigation & Water Calculator" subtitle="Estimate water volume and electricity/pump expenses for the season" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
          <FormRow label="Land Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <FormRow label="Irrigation Method">
            <Select value={method} onChange={setMethod}>
              <option value="drip">Drip Irrigation (ಉದಕ ಪದ್ಧತಿ / ड्रिप)</option>
              <option value="sprinkler">Sprinkler (ತುಂತುರು ನೀರಾವರಿ / स्प्रिंकलर)</option>
              <option value="flood">Flood (ಹರಿ ನೀರಾವರಿ / बाढ़)</option>
            </Select>
          </FormRow>
          <FormRow label="Soil Type">
            <Select value={soilType} onChange={setSoilType}>
              <option value="sandy">Sandy (ಮರಳು ಮಣ್ಣು)</option>
              <option value="medium">Loamy/Medium (ಸಾಮಾನ್ಯ ಮಣ್ಣು)</option>
              <option value="clay">Clay (ಜೀವೋಡ ಮಣ್ಣು)</option>
            </Select>
          </FormRow>
          <InputWithVoice label="Number of Irrigation Cycles" value={cycles} onChange={setCycles} resetValue={6} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Seasonal Water Requirement" value={`${fmt(totalWater / 1000)} KL`} color={C.blue} sub={`(${fmt(totalWater)} Liters)`} />
          <BigResult label="Water Required Per Irrigation" value={`${fmt(perIrrigation / 1000)} KL`} color={C.cyan} />
          <BigResult label="Approximate Seasonal Cost" value={`₹${fmt(irrigationCost)}`} color={C.purple} />
          <Disclaimer text="Estimates are based on average evaporation rates. Adjust cycles according to real-time local rainfall forecasts." />
        </div>
      </div>
    </div>
  );
}

// 6. Pesticide & Spray Calculator
function SprayPanel({ gs, cropData, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [pest, setPest] = useState('aphids');
  const [dosage, setDosage] = useState(2.0); // ml or g per liter
  const [waterPerAcre, setWaterPerAcre] = useState(150); // Liters
  const [pesticidePrice, setPesticidePrice] = useState(800); // ₹ per liter/kg
  const [tankSize, setTankSize] = useState(15); // L

  const acres = toAcres(area, unit);
  const totalWater = waterPerAcre * acres;
  const pesticideQty = (totalWater * dosage) / 1000; // in Liters or Kg
  const totalTanks = Math.ceil(totalWater / tankSize);
  const totalCost = pesticideQty * pesticidePrice;
  const costPerSpray = totalCost / (totalTanks || 1);

  return (
    <div>
      <PanelHeader icon="🔫" title="Pesticide & Spray Calculator" subtitle="Determine pesticide concentrates and water requirements" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
          <FormRow label="Land Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <FormRow label="Pest/Disease Type">
            <Select value={pest} onChange={setPest}>
              <option value="aphids">Sucking Pests (Aphids, Thrips, Whiteflies)</option>
              <option value="caterpillars">Chewing Pests (Caterpillars, Bollworms)</option>
              <option value="fungal">Fungal Diseases (Blight, Mildew, Blasts)</option>
              <option value="weeds">Weeds (Herbicides)</option>
            </Select>
          </FormRow>
          <InputWithVoice label="Recommended Dosage (ml or g per Liter of water)" value={dosage} onChange={setDosage} resetValue={2.0} lang={lang} />
          <InputWithVoice label="Water Requirement (Liters per Acre)" value={waterPerAcre} onChange={setWaterPerAcre} resetValue={150} lang={lang} />
          <InputWithVoice label="Pesticide Price (₹ per Liter/Kg)" value={pesticidePrice} onChange={setPesticidePrice} resetValue={800} lang={lang} />
          <FormRow label="Spray Tank Capacity (Liters)">
            <Select value={tankSize} onChange={setTankSize}>
              <option value="15">15 L Battery Sprayer</option>
              <option value="16">16 L Standard Tank</option>
              <option value="20">20 L Manual Sprayer</option>
              <option value="200">200 L Tractor Boom Sprayer</option>
            </Select>
          </FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Pesticide Quantity Required" value={`${pesticideQty.toFixed(2)} Liters/Kg`} color={C.rose} />
          <BigResult label="Total Water Required" value={`${totalWater.toFixed(0)} Liters`} color={C.blue} />
          <Grid cols={2}>
            <ResultCard label="No. of Spray Tanks" value={`${totalTanks} Tanks`} color={C.amber} />
            <ResultCard label="Cost per Spray Tank" value={`₹${costPerSpray.toFixed(0)}`} color={C.purple} />
          </Grid>
          <BigResult label="Total Spraying Cost" value={`₹${totalCost.toFixed(0)}`} color={C.red} />
          <Disclaimer text="Always follow pesticide product labels strictly. Wear safety masks and gloves. Do not spray during strong winds." />
        </div>
      </div>
    </div>
  );
}

// 7. Farming Cost Calculator
function FarmCostPanel({ gs, cropData, lang, onSaveCalculatedCosts }) {
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [expenses, setExpenses] = useState({
    landPrep: 4000,
    seeds: 2500,
    fertilizers: 3500,
    pesticides: 1500,
    labour: 6000,
    machinery: 5000,
    irrigation: 2000,
    fuel: 1500,
    transport: 1800,
    harvesting: 4500,
    storage: 1000,
    other: 1000
  });
  const [yieldExpected, setYieldExpected] = useState(25); // quintals per acre

  const acres = toAcres(area, unit);
  const totalCost = Object.values(expenses).reduce((a, b) => parseFloat(a || 0) + parseFloat(b || 0), 0);
  const costPerAcre = totalCost / (acres || 1);
  const costPerHectare = costPerAcre * 2.47105;
  const totalProductionKg = yieldExpected * acres * 100; // 1 quintal = 100 kg
  const costPerKg = totalProductionKg > 0 ? totalCost / totalProductionKg : 0;

  // Auto load calculated values from other modules
  const handleLoadCalculations = () => {
    const cropInfo = cropData[gs.crop] || cropData.wheat;
    const seedResult = calcSeed(gs.crop, acres, 0, 90);
    const fertResult = calcFertilizer(gs.crop, acres, 'balanced', 'medium');
    const irrigResult = calcIrrigation(gs.crop, acres, 'drip', null);
    
    setExpenses(p => ({
      ...p,
      seeds: Math.round(seedResult.cost),
      fertilizers: Math.round(fertResult.totalCost),
      irrigation: Math.round(irrigResult.totalCost),
      machinery: Math.round(acres * 2500), // estimated standard
      labour: Math.round(acres * 3000),
      landPrep: Math.round(acres * 2000)
    }));
  };

  const handleSaveToProfit = () => {
    if (onSaveCalculatedCosts) {
      onSaveCalculatedCosts(totalCost, yieldExpected);
      alert("Costs successfully loaded into the Crop Profit Calculator!");
    }
  };

  return (
    <div>
      <PanelHeader icon="🧾" title="Farming Cost Calculator" subtitle="Estimate itemized expenses to calculate overall cost parameters" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <button 
            onClick={handleLoadCalculations}
            style={{
              width: '100%', padding: '10px 14px', background: C.cyan,
              color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontWeight: 700, fontSize: '0.85rem', marginBottom: 16
            }}
          >
            🔄 Load Estimated Values From Other Calculators
          </button>
          
          <Grid cols={2}>
            <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
            <FormRow label="Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          </Grid>

          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px' }}>
            <InputWithVoice label="Land Preparation (₹)" value={expenses.landPrep} onChange={v => setExpenses(p => ({ ...p, landPrep: v }))} resetValue={4000} lang={lang} />
            <InputWithVoice label="Seeds (₹)" value={expenses.seeds} onChange={v => setExpenses(p => ({ ...p, seeds: v }))} resetValue={2500} lang={lang} />
            <InputWithVoice label="Fertilizers (₹)" value={expenses.fertilizers} onChange={v => setExpenses(p => ({ ...p, fertilizers: v }))} resetValue={3500} lang={lang} />
            <InputWithVoice label="Pesticides (₹)" value={expenses.pesticides} onChange={v => setExpenses(p => ({ ...p, pesticides: v }))} resetValue={1500} lang={lang} />
            <InputWithVoice label="Labour Costs (₹)" value={expenses.labour} onChange={v => setExpenses(p => ({ ...p, labour: v }))} resetValue={6000} lang={lang} />
            <InputWithVoice label="Machinery Rental (₹)" value={expenses.machinery} onChange={v => setExpenses(p => ({ ...p, machinery: v }))} resetValue={5000} lang={lang} />
            <InputWithVoice label="Irrigation (₹)" value={expenses.irrigation} onChange={v => setExpenses(p => ({ ...p, irrigation: v }))} resetValue={2000} lang={lang} />
            <InputWithVoice label="Electricity/Fuel (₹)" value={expenses.fuel} onChange={v => setExpenses(p => ({ ...p, fuel: v }))} resetValue={1500} lang={lang} />
            <InputWithVoice label="Transportation (₹)" value={expenses.transport} onChange={setExpenses} resetValue={1800} lang={lang} />
            <InputWithVoice label="Harvesting (₹)" value={expenses.harvesting} onChange={v => setExpenses(p => ({ ...p, harvesting: v }))} resetValue={4500} lang={lang} />
            <InputWithVoice label="Storage Fee (₹)" value={expenses.storage} onChange={v => setExpenses(p => ({ ...p, storage: v }))} resetValue={1000} lang={lang} />
            <InputWithVoice label="Other Expenses (₹)" value={expenses.other} onChange={v => setExpenses(p => ({ ...p, other: v }))} resetValue={1000} lang={lang} />
          </div>

          <InputWithVoice label="Expected Yield (Quintals/Acre)" value={yieldExpected} onChange={setYieldExpected} resetValue={25} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Farming Cost" value={`₹${fmt(totalCost)}`} color={C.rose} />
          <Grid cols={3}>
            <ResultCard label="Cost per Acre" value={`₹${fmt(costPerAcre)}`} color={C.green} />
            <ResultCard label="Cost per Hectare" value={`₹${fmt(costPerHectare)}`} color={C.blue} />
            <ResultCard label="Cost per Kg" value={`₹${costPerKg.toFixed(2)}/kg`} color={C.purple} />
          </Grid>
          <button 
            onClick={handleSaveToProfit}
            style={{
              width: '100%', padding: '12px', background: C.green,
              color: '#fff', border: 'none', borderRadius: 10, cursor: 'pointer',
              fontWeight: 700, fontSize: '0.85rem', marginTop: 10
            }}
          >
            💰 Push Total Cost to Crop Profit Calculator
          </button>
          <div style={{ background: 'rgba(255, 255, 255, 0.03)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 12, padding: 12, marginTop: 10 }}>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255, 255, 255, 0.5)', marginBottom: 6 }}>COST SHEET PERCENTAGE SHARE</div>
            {Object.entries(expenses).map(([key, val]) => {
              const share = totalCost > 0 ? (val / totalCost) * 100 : 0;
              return (
                <div key={key} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.75rem', marginBottom: 4 }}>
                  <span style={{ color: 'rgba(255,255,255,0.6)' }}>{key}</span>
                  <span>{share.toFixed(1)}% (₹{fmt(val)})</span>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}

// 8. Crop Profit Calculator
function ProfitPanel({ gs, cropData, calculatedCosts, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [expectedYield, setExpectedYield] = useState(calculatedCosts.yieldExpected || 25);
  const [marketPrice, setMarketPrice] = useState(CROP_DATA[gs.crop]?.msp || 2000);
  const [totalCost, setTotalCost] = useState(calculatedCosts.totalCost || 25000);

  const acres = toAcres(area, unit);
  const expectedProduction = expectedYield * acres; // In Quintals
  const expectedRevenue = expectedProduction * marketPrice;
  const netProfit = expectedRevenue - totalCost;
  const profitPerAcre = netProfit / (acres || 1);
  const margin = expectedRevenue > 0 ? (netProfit / expectedRevenue) * 100 : 0;
  const breakEven = expectedProduction > 0 ? totalCost / expectedProduction : 0;

  // Sync state if calculatedCosts changes
  useEffect(() => {
    if (calculatedCosts.totalCost) {
      setTotalCost(calculatedCosts.totalCost);
      setExpectedYield(calculatedCosts.yieldExpected);
    }
  }, [calculatedCosts]);

  return (
    <div>
      <PanelHeader icon="💰" title="Crop Profit Calculator" subtitle="Determine net profitability margins and revenue calculations" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
          <FormRow label="Land Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <InputWithVoice label="Expected Yield (Quintals/Acre)" value={expectedYield} onChange={setExpectedYield} resetValue={25} lang={lang} />
          <InputWithVoice label="Expected Market Price (₹/Quintal)" value={marketPrice} onChange={setMarketPrice} resetValue={2000} lang={lang} />
          <InputWithVoice label="Total Farming Expenses (₹)" value={totalCost} onChange={setTotalCost} resetValue={25000} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <div style={{ background: 'rgba(255, 255, 255, 0.04)', border: '1px solid rgba(255, 255, 255, 0.08)', borderRadius: 14, padding: 16 }}>
            <h4 style={{ color: C.green, margin: '0 0 12px', fontSize: '0.9rem' }}>Financial Formula Summary</h4>
            <div style={{ fontSize: '0.85rem', display: 'flex', flexDirection: 'column', gap: 8 }}>
              <div style={{ display: 'flex', justifyContent: 'space-between' }}>
                <span>📈 Expected Revenue ({expectedProduction.toFixed(1)} Qtl × ₹{marketPrice})</span>
                <span style={{ color: C.blue, fontWeight: 700 }}>₹{fmt(expectedRevenue)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', borderBottom: '1px solid rgba(255,255,255,0.1)', paddingBottom: 8 }}>
                <span>📉 Total Farming Cost</span>
                <span style={{ color: C.rose, fontWeight: 700 }}>- ₹{fmt(totalCost)}</span>
              </div>
              <div style={{ display: 'flex', justifyContent: 'space-between', paddingTop: 8, fontSize: '1.1rem', fontWeight: 800 }}>
                <span style={{ color: netProfit >= 0 ? C.green : C.red }}>💵 Expected Net Profit</span>
                <span style={{ color: netProfit >= 0 ? C.green : C.red }}>₹{fmt(netProfit)}</span>
              </div>
            </div>
          </div>

          <Grid cols={2}>
            <ResultCard label="Profit Margin" value={`${margin.toFixed(1)}%`} color={netProfit >= 0 ? C.green : C.red} />
            <ResultCard label="Profit Per Acre" value={`₹${fmt(profitPerAcre)}`} color={netProfit >= 0 ? C.green : C.red} />
          </Grid>
          <BigResult label="Break-Even selling price" value={`₹${breakEven.toFixed(0)}/Quintal`} color={C.amber} sub={`Equivalent to ₹${(breakEven / 100).toFixed(2)}/kg`} />
        </div>
      </div>
    </div>
  );
}

// 9. Break-Even Calculator
function BreakEvenPanel({ lang }) {
  const [totalCost, setTotalCost] = useState(30000);
  const [expectedQty, setExpectedQty] = useState(25); // In Quintals

  const qtyKg = expectedQty * 100;
  const qtyTon = expectedQty / 10;
  const breakEvenKg = totalCost / (qtyKg || 1);
  const breakEvenQtl = totalCost / (expectedQty || 1);
  const breakEvenTon = totalCost / (qtyTon || 1);

  return (
    <div>
      <PanelHeader icon="⚖️" title="Break-Even Calculator" subtitle="Minimum selling price per unit required to recover farming costs" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <InputWithVoice label="Total Farming Cost (₹)" value={totalCost} onChange={setTotalCost} resetValue={30000} lang={lang} />
          <InputWithVoice label="Expected Production (Quintals)" value={expectedQty} onChange={setExpectedQty} resetValue={25} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Break-Even Price per Kg" value={`₹${breakEvenKg.toFixed(2)}/kg`} color={C.green} />
          <BigResult label="Break-Even Price per Quintal" value={`₹${breakEvenQtl.toFixed(0)}/qtl`} color={C.amber} />
          <BigResult label="Break-Even Price per Ton" value={`₹${breakEvenTon.toFixed(0)}/ton`} color={C.blue} />
          <Disclaimer text="Ensure your market selling price exceeds these values to avoid net agricultural losses." />
        </div>
      </div>
    </div>
  );
}

// 10. Labour Calculator
function LabourPanel({ gs, lang }) {
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [activity, setActivity] = useState('harvesting');
  const [workers, setWorkers] = useState(5);
  const [hours, setHours] = useState(8);
  const [costPerWorker, setCostPerWorker] = useState(400); // Daily rate

  const acres = toAcres(area, unit);
  const baseLabourDays = (LABOUR_ACTIVITIES[activity]?.pdAcre || 5) * acres;
  const totalLabourHours = baseLabourDays * 8; // standard 8 hours day
  const estimatedCompletionTime = totalLabourHours / (workers * hours || 1);
  const totalLabourCost = baseLabourDays * costPerWorker;

  return (
    <div>
      <PanelHeader icon="👷" title="Labour Requirement Calculator" subtitle="Estimate overall labour hours, costs, and timeline required for activities" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
          <FormRow label="Land Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
          <FormRow label="Farming Activity">
            <Select value={activity} onChange={setActivity}>
              {Object.entries(LABOUR_ACTIVITIES).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.name}</option>
              ))}
            </Select>
          </FormRow>
          <InputWithVoice label="Number of Active Workers" value={workers} onChange={setWorkers} resetValue={5} lang={lang} />
          <InputWithVoice label="Working Hours per Day" value={hours} onChange={setHours} resetValue={8} lang={lang} />
          <InputWithVoice label="Labour Cost per Worker per Day (₹)" value={costPerWorker} onChange={setCostPerWorker} resetValue={400} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Estimated Labour Cost" value={`₹${fmt(totalLabourCost)}`} color={C.green} />
          <BigResult label="Total Labour Hours" value={`${totalLabourHours.toFixed(0)} hours`} color={C.blue} />
          <BigResult label="Estimated Completion Time" value={`${estimatedCompletionTime.toFixed(1)} days`} color={C.amber} />
          <Disclaimer text="Labour estimates vary with field terrain and worker experience. Standard calculations assume standard field conditions." />
        </div>
      </div>
    </div>
  );
}

// 11. Machinery Cost Calculator
function MachineryPanel({ gs, setActiveCalc, lang }) {
  const [machine, setMachine] = useState('tractor');
  const [rentalRate, setRentalRate] = useState(600); // Per hour
  const [workingHours, setWorkingHours] = useState(4);
  const [fuelCost, setFuelCost] = useState(100); // fuel cost per hour
  const [operatorCost, setOperatorCost] = useState(150); // operator hourly cost
  const [area, setArea] = useState(gs.area);

  const totalMachineCost = (rentalRate + fuelCost + operatorCost) * workingHours;
  const costPerAcre = totalMachineCost / (parseFloat(area) || 1);

  const handleMachineChange = (mKey) => {
    setMachine(mKey);
    const m = DEFAULT_MACHINERY_DATA[mKey];
    if (m) {
      setRentalRate(m.rateHr);
      setFuelCost(m.fuelHr * 10); // estimate based on standard fuel rate
    }
  };

  return (
    <div>
      <PanelHeader icon="🚜" title="Machinery Cost Calculator" subtitle="Estimate machinery usage expenses and link directly to local rentals" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Machine Type">
            <Select value={machine} onChange={handleMachineChange}>
              {Object.entries(DEFAULT_MACHINERY_DATA).map(([k, v]) => (
                <option key={k} value={k}>{v.icon} {v.name}</option>
              ))}
            </Select>
          </FormRow>
          <InputWithVoice label="Rental Price (₹ per Hour)" value={rentalRate} onChange={setRentalRate} resetValue={600} lang={lang} />
          <InputWithVoice label="Working Hours Required" value={workingHours} onChange={setWorkingHours} resetValue={4} lang={lang} />
          <InputWithVoice label="Hourly Fuel Cost (₹)" value={fuelCost} onChange={setFuelCost} resetValue={100} lang={lang} />
          <InputWithVoice label="Hourly Operator Cost (₹)" value={operatorCost} onChange={setOperatorCost} resetValue={150} lang={lang} />
          <InputWithVoice label="Land Area Coverage (Acres)" value={area} onChange={setArea} resetValue={1} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Total Machine Cost" value={`₹${fmt(totalMachineCost)}`} color={C.green} />
          <BigResult label="Cost per Acre" value={`₹${fmt(costPerAcre)}`} color={C.blue} />
          <BigResult label="Estimated Duration" value={`${workingHours} Hours`} color={C.amber} />
          
          <button
            onClick={() => setActiveCalc('rentals')}
            style={{
              padding: '12px', background: C.green, color: '#fff',
              border: 'none', borderRadius: 10, cursor: 'pointer',
              fontWeight: 700, fontSize: '0.85rem', marginTop: 10
            }}
          >
            🚜 Find Machinery to Rent Near You
          </button>
        </div>
      </div>
    </div>
  );
}

// 12. Crop Comparison Calculator
function CropComparePanel({ gs, cropData, lang }) {
  const [cropList, setCropList] = useState(['wheat', 'rice', 'cotton']);
  const [area, setArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);

  const acres = toAcres(area, unit);

  const comparisons = cropList.map(cropKey => {
    const cropInfo = cropData[cropKey] || cropData.wheat;
    const cost = cropInfo.typicalCostAcre * acres;
    const yieldExpected = cropInfo.yieldQtlAcre * acres;
    const revenue = yieldExpected * (cropInfo.msp || 2000);
    const profit = revenue - cost;
    const breakeven = yieldExpected > 0 ? cost / yieldExpected : 0;
    return {
      cropKey,
      name: cropInfo.name,
      icon: cropInfo.icon,
      cost,
      yieldExpected,
      revenue,
      profit,
      breakeven
    };
  });

  const lowestInvestment = [...comparisons].sort((a, b) => a.cost - b.cost)[0];
  const highestProfit = [...comparisons].sort((a, b) => b.profit - a.profit)[0];
  const highestYield = [...comparisons].sort((a, b) => b.yieldExpected - a.yieldExpected)[0];
  const lowestBreakeven = [...comparisons].sort((a, b) => a.breakeven - b.breakeven)[0];

  return (
    <div>
      <PanelHeader icon="🆚" title="Crop Comparison Calculator" subtitle="Compare expected financial returns of up to 4 crops side-by-side" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 14 }}>
        <InputWithVoice label="Land Area" value={area} onChange={setArea} resetValue={1.0} lang={lang} />
        <FormRow label="Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: 10, marginBottom: 14 }}>
        {cropList.map((cKey, idx) => (
          <div key={idx}>
            <Label>Select Crop {idx + 1}</Label>
            <Select value={cKey} onChange={v => setCropList(p => {
              const next = [...p];
              next[idx] = v;
              return next;
            })}>
              {Object.entries(cropData).map(([k, d]) => (
                <option key={k} value={k}>{d.icon} {d.name}</option>
              ))}
            </Select>
          </div>
        ))}
      </div>

      <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.85rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Metric</th>
              {comparisons.map((c, i) => <th key={i} style={{ textAlign: 'right', padding: 8 }}>{c.icon} {c.name}</th>)}
            </tr>
          </thead>
          <tbody>
            <tr>
              <td style={{ padding: 8, color: 'rgba(255,255,255,0.6)' }}>Total Investment</td>
              {comparisons.map((c, i) => <td key={i} style={{ textAlign: 'right', padding: 8 }}>₹{fmt(c.cost)}</td>)}
            </tr>
            <tr>
              <td style={{ padding: 8, color: 'rgba(255,255,255,0.6)' }}>Expected Yield (Qtl)</td>
              {comparisons.map((c, i) => <td key={i} style={{ textAlign: 'right', padding: 8 }}>{c.yieldExpected.toFixed(1)} Qtl</td>)}
            </tr>
            <tr>
              <td style={{ padding: 8, color: 'rgba(255,255,255,0.6)' }}>Expected Revenue</td>
              {comparisons.map((c, i) => <td key={i} style={{ textAlign: 'right', padding: 8 }}>₹{fmt(c.revenue)}</td>)}
            </tr>
            <tr style={{ borderTop: '1px solid rgba(255,255,255,0.08)', fontWeight: 700 }}>
              <td style={{ padding: 8, color: C.green }}>Expected Profit</td>
              {comparisons.map((c, i) => <td key={i} style={{ textAlign: 'right', padding: 8, color: c.profit >= 0 ? C.green : C.red }}>₹{fmt(c.profit)}</td>)}
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
        <ResultCard label="Lowest Investment Needed" value={`${lowestInvestment?.icon} ${lowestInvestment?.name}`} sub={`₹${fmt(lowestInvestment?.cost)}`} color={C.blue} />
        <ResultCard label="Highest Expected Profit" value={`${highestProfit?.icon} ${highestProfit?.name}`} sub={`₹${fmt(highestProfit?.profit)}`} color={C.green} />
        <ResultCard label="Highest Expected Yield" value={`${highestYield?.icon} ${highestYield?.name}`} sub={`${highestYield?.yieldExpected.toFixed(1)} Qtl`} color={C.cyan} />
        <ResultCard label="Lowest Break-Even selling price" value={`${lowestBreakeven?.icon} ${lowestBreakeven?.name}`} sub={`₹${lowestBreakeven?.breakeven.toFixed(0)}/Qtl`} color={C.amber} />
      </div>
    </div>
  );
}

// 13. Mandi Price & Profit Calculator
function MandiProfitPanel({ gs, cropData, lang }) {
  const [crop, setCrop] = useState(gs.crop);
  const [qty, setQty] = useState(50); // Quintals
  const [mandiPrice, setMandiPrice] = useState(CROP_DATA[gs.crop]?.msp || 2000);
  const [transport, setTransport] = useState(1200);
  const [commission, setCommission] = useState(500);
  const [otherSelling, setOtherSelling] = useState(300);

  const grossVal = qty * mandiPrice;
  const totalSellingExpenses = parseFloat(transport) + parseFloat(commission) + parseFloat(otherSelling);
  const netIncome = grossVal - totalSellingExpenses;
  const expectedProfit = netIncome - (cropData[crop]?.typicalCostAcre * toAcres(gs.area, gs.unit));

  return (
    <div>
      <PanelHeader icon="🏪" title="Mandi Price & Profit Calculator" subtitle="Deduct transportation and commissions from market rates" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Production Quantity (Quintals)" value={qty} onChange={setQty} resetValue={50} lang={lang} />
          <InputWithVoice label="Current Mandi Market Price (₹/Quintal)" value={mandiPrice} onChange={setMandiPrice} resetValue={2000} lang={lang} />
          <InputWithVoice label="Transportation Cost (₹)" value={transport} onChange={setTransport} resetValue={1200} lang={lang} />
          <InputWithVoice label="Commission/Market Charges (₹)" value={commission} onChange={setCommission} resetValue={500} lang={lang} />
          <InputWithVoice label="Other Selling Expenses (₹)" value={otherSelling} onChange={setOtherSelling} resetValue={300} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Gross Selling Value" value={`₹${fmt(grossVal)}`} color={C.blue} />
          <BigResult label="Total Selling Expenses" value={`₹${fmt(totalSellingExpenses)}`} color={C.rose} />
          <BigResult label="Net Mandi Income" value={`₹${fmt(netIncome)}`} color={C.green} />
          <BigResult label="Net Expected Profit" value={`₹${fmt(expectedProfit)}`} color={expectedProfit >= 0 ? C.green : C.red} />
        </div>
      </div>
    </div>
  );
}

// 14. Storage Calculator
function StoragePanel({ cropData, lang }) {
  const [crop, setCrop] = useState('wheat');
  const [qty, setQty] = useState(50); // In Quintals
  const [duration, setDuration] = useState(3); // Months
  const [storageType, setStorageType] = useState('warehouse');

  const stInfo = STORAGE_TYPES[storageType] || STORAGE_TYPES.warehouse;
  const capacityRequired = qty * 1.5; // conversion factor estimate
  const monthlyCost = qty * stInfo.rateQtlMo;
  const totalCost = monthlyCost * duration;

  return (
    <div>
      <PanelHeader icon="🏗️" title="Storage Calculator" subtitle="Estimate monthly and seasonal storage fees for your harvested yields" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <FormRow label="Crop"><CropSelect cropData={cropData} value={crop} onChange={setCrop} /></FormRow>
          <InputWithVoice label="Quantity Produced (Quintals)" value={qty} onChange={setQty} resetValue={50} lang={lang} />
          <InputWithVoice label="Storage Duration (Months)" value={duration} onChange={setDuration} resetValue={3} lang={lang} />
          <FormRow label="Storage Facility Type">
            <Select value={storageType} onChange={setStorageType}>
              <option value="warehouse">Village Warehouse/Godown (₹25/qtl/mo)</option>
              <option value="cold_storage">Cold Storage (₹65/qtl/mo)</option>
              <option value="farm_silo">On-Farm Grain Silo (₹8/qtl/mo)</option>
              <option value="wrs">WRS WDRA Regulated Warehouse (₹30/qtl/mo)</option>
            </Select>
          </FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Required Capacity Estimate" value={`${capacityRequired.toFixed(0)} Cubic Feet`} color={C.blue} sub={`Equates to ${qty} Quintals of grain storage`} />
          <BigResult label="Approximate Storage Cost Per Month" value={`₹${fmt(monthlyCost)}`} color={C.amber} />
          <BigResult label="Total Seasonal Storage Expense" value={`₹${fmt(totalCost)}`} color={C.purple} />
        </div>
      </div>
    </div>
  );
}

// 15. Loan Calculator
function LoanPanel({ lang }) {
  const [loanAmount, setLoanAmount] = useState(100000);
  const [interestRate, setInterestRate] = useState(7);
  const [duration, setDuration] = useState(12); // Months
  const [frequency, setFrequency] = useState('monthly');

  const annualRateFraction = interestRate / 100;
  let emi = 0;
  let totalRepayment = 0;
  let totalInterest = 0;

  if (frequency === 'monthly') {
    const monthlyRate = annualRateFraction / 12;
    emi = loanAmount * monthlyRate * Math.pow(1 + monthlyRate, duration) / (Math.pow(1 + monthlyRate, duration) - 1);
    totalRepayment = emi * duration;
    totalInterest = totalRepayment - loanAmount;
  } else {
    // Annual Repayment
    const years = duration / 12;
    totalInterest = loanAmount * annualRateFraction * years;
    totalRepayment = loanAmount + totalInterest;
    emi = totalRepayment / years;
  }

  return (
    <div>
      <PanelHeader icon="🏦" title="Loan / Farming Investment Calculator" subtitle="Estimate repayments and overall interest details for farm financing" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <InputWithVoice label="Loan Amount (₹)" value={loanAmount} onChange={setLoanAmount} resetValue={100000} lang={lang} />
          <InputWithVoice label="Annual Interest Rate (%)" value={interestRate} onChange={setInterestRate} resetValue={7} lang={lang} />
          <InputWithVoice label="Loan Duration (Months)" value={duration} onChange={setDuration} resetValue={12} lang={lang} />
          <FormRow label="Repayment Frequency">
            <Select value={frequency} onChange={setFrequency}>
              <option value="monthly">Monthly Instalments (EMIs)</option>
              <option value="annual">Annual Lump Sum</option>
            </Select>
          </FormRow>
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label={frequency === 'monthly' ? "Estimated Monthly EMI" : "Estimated Annual Payment"} value={`₹${emi.toFixed(0)}`} color={C.green} />
          <BigResult label="Total Interest Owed" value={`₹${totalInterest.toFixed(0)}`} color={C.rose} />
          <BigResult label="Total Repayment Amount" value={`₹${totalRepayment.toFixed(0)}`} color={C.blue} />
        </div>
      </div>
    </div>
  );
}

// 16. ROI Calculator
function ROIPanel({ lang }) {
  const [investment, setInvestment] = useState(40000);
  const [revenue, setRevenue] = useState(65000);

  const profit = revenue - investment;
  const roi = investment > 0 ? (profit / investment) * 100 : 0;

  return (
    <div>
      <PanelHeader icon="📈" title="ROI Calculator" subtitle="Evaluate overall investment efficiency and return percentage" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '1rem' }}>
        <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
          <InputWithVoice label="Total Investment (₹)" value={investment} onChange={setInvestment} resetValue={40000} lang={lang} />
          <InputWithVoice label="Total Revenue Generated (₹)" value={revenue} onChange={setRevenue} resetValue={65000} lang={lang} />
        </div>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          <BigResult label="Net Return On Investment (ROI)" value={`${roi.toFixed(1)}%`} color={roi >= 0 ? C.green : C.red} />
          <BigResult label="Net Profit" value={`₹${fmt(profit)}`} color={profit >= 0 ? C.green : C.red} />
          <Grid cols={2}>
            <ResultCard label="Total Investment" value={`₹${fmt(investment)}`} color={C.rose} />
            <ResultCard label="Total Revenue" value={`₹${fmt(revenue)}`} color={C.blue} />
          </Grid>
        </div>
      </div>
    </div>
  );
}

// 17. Multi-Crop Farm Calculator
function MultiCropPanel({ gs, cropData, lang }) {
  const [totalArea, setTotalArea] = useState(gs.area);
  const [unit, setUnit] = useState(gs.unit);
  const [allocations, setAllocations] = useState([
    { crop: 'wheat', pct: 40 },
    { crop: 'maize', pct: 30 },
    { crop: 'soybean', pct: 20 },
    { crop: 'vegetables', pct: 10 }
  ]);

  const acres = toAcres(totalArea, unit);
  const totalAllocPct = allocations.reduce((a, b) => a + parseFloat(b.pct || 0), 0);

  const cropSummaries = allocations.map(item => {
    const cropAcres = acres * (item.pct / 100);
    const cropInfo = cropData[item.crop] || cropData.wheat;
    const inv = cropInfo.typicalCostAcre * cropAcres;
    const prod = cropInfo.yieldQtlAcre * cropAcres;
    const rev = prod * (cropInfo.msp || 2000);
    const prof = rev - inv;
    return {
      ...item,
      name: cropInfo.name,
      icon: cropInfo.icon,
      cropAcres,
      inv,
      prod,
      rev,
      prof
    };
  });

  const aggregateInv = cropSummaries.reduce((a, b) => a + b.inv, 0);
  const aggregateRev = cropSummaries.reduce((a, b) => a + b.rev, 0);
  const aggregateProf = aggregateRev - aggregateInv;
  const aggregateRoi = aggregateInv > 0 ? (aggregateProf / aggregateInv) * 100 : 0;

  return (
    <div>
      <PanelHeader icon="🗺️" title="Multi-Crop Farm Calculator" subtitle="Distribute land area among different crops and view cumulative returns" />
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '8px', marginBottom: 14 }}>
        <InputWithVoice label="Total Land Area" value={totalArea} onChange={setTotalArea} resetValue={10.0} lang={lang} />
        <FormRow label="Unit"><UnitSelect value={unit} onChange={setUnit} /></FormRow>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(4, 1fr)', gap: 10, marginBottom: 14 }}>
        {allocations.map((item, idx) => (
          <div key={idx} style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 10 }}>
            <FormRow label={`Crop ${idx + 1}`}>
              <Select value={item.crop} onChange={v => setAllocations(p => {
                const next = [...p];
                next[idx].crop = v;
                return next;
              })}>
                {Object.entries(cropData).map(([k, d]) => <option key={k} value={k}>{d.icon} {d.name}</option>)}
              </Select>
            </FormRow>
            <InputWithVoice label="Acreage Share %" value={item.pct} onChange={v => setAllocations(p => {
              const next = [...p];
              next[idx].pct = v;
              return next;
            })} resetValue={25} lang={lang} />
          </div>
        ))}
      </div>

      {totalAllocPct !== 100 && (
        <div style={{ padding: 10, background: 'rgba(239, 68, 68, 0.1)', color: C.red, borderRadius: 8, marginBottom: 12, fontSize: '0.8rem' }}>
          ⚠️ Warning: Land allocation percentages sum to {totalAllocPct}%. Adjust them to total exactly 100%.
        </div>
      )}

      <div style={{ overflowX: 'auto', background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 12, padding: 12 }}>
        <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.82rem' }}>
          <thead>
            <tr style={{ borderBottom: '1px solid rgba(255,255,255,0.1)' }}>
              <th style={{ textAlign: 'left', padding: 8 }}>Allocated Crop</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Area (Acres)</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Investment</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Revenue</th>
              <th style={{ textAlign: 'right', padding: 8 }}>Expected Profit</th>
            </tr>
          </thead>
          <tbody>
            {cropSummaries.map((c, i) => (
              <tr key={i} style={{ borderBottom: '1px solid rgba(255,255,255,0.05)' }}>
                <td style={{ padding: 8 }}>{c.icon} {c.name}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>{c.cropAcres.toFixed(1)} ac</td>
                <td style={{ textAlign: 'right', padding: 8 }}>₹{fmt(c.inv)}</td>
                <td style={{ textAlign: 'right', padding: 8 }}>₹{fmt(c.rev)}</td>
                <td style={{ textAlign: 'right', padding: 8, color: c.prof >= 0 ? C.green : C.red }}>₹{fmt(c.prof)}</td>
              </tr>
            ))}
            <tr style={{ fontWeight: 700, borderTop: '2px solid rgba(255,255,255,0.15)' }}>
              <td style={{ padding: 8 }}>Total Farm Planner</td>
              <td style={{ textAlign: 'right', padding: 8 }}>{acres.toFixed(1)} ac</td>
              <td style={{ textAlign: 'right', padding: 8 }}>₹{fmt(aggregateInv)}</td>
              <td style={{ textAlign: 'right', padding: 8 }}>₹{fmt(aggregateRev)}</td>
              <td style={{ textAlign: 'right', padding: 8, color: aggregateProf >= 0 ? C.green : C.red }}>₹{fmt(aggregateProf)}</td>
            </tr>
          </tbody>
        </table>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginTop: 14 }}>
        <BigResult label="Cumulative Net Profit" value={`₹${fmt(aggregateProf)}`} color={aggregateProf >= 0 ? C.green : C.red} />
        <BigResult label="Overall Expected ROI" value={`${aggregateRoi.toFixed(1)}%`} color={aggregateRoi >= 0 ? C.green : C.red} />
      </div>
    </div>
  );
}

// 17. Admin Config / Settings Panel
function SettingsPanel({ cropData, setCropData, fertilizerData, setFertilizerData, lang }) {
  const [selectedCrop, setSelectedCrop] = useState('wheat');
  const [seedRate, setSeedRate] = useState(20);
  const [typicalCost, setTypicalCost] = useState(15000);
  const [yieldVal, setYieldVal] = useState(20);

  useEffect(() => {
    const c = cropData[selectedCrop];
    if (c) {
      setSeedRate(c.seedRateKgAcre);
      setTypicalCost(c.typicalCostAcre);
      setYieldVal(c.yieldQtlAcre);
    }
  }, [selectedCrop, cropData]);

  const handleUpdate = () => {
    setCropData(prev => ({
      ...prev,
      [selectedCrop]: {
        ...prev[selectedCrop],
        seedRateKgAcre: parseFloat(seedRate),
        typicalCostAcre: parseFloat(typicalCost),
        yieldQtlAcre: parseFloat(yieldVal)
      }
    }));
    alert("Administrative baseline configuration parameters successfully updated!");
  };

  return (
    <div>
      <PanelHeader icon="⚙️" title="Administrator Config & Baselines" subtitle="Customize default crop rates, yield targets, and baseline expenses" />
      <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: 14, padding: '1.2rem' }}>
        <FormRow label="Select Crop Template to Modify">
          <Select value={selectedCrop} onChange={setSelectedCrop}>
            {Object.entries(cropData).map(([k, d]) => <option key={k} value={k}>{d.icon} {d.name}</option>)}
          </Select>
        </FormRow>
        <InputWithVoice label="Baseline Seed Rate (kg/acre)" value={seedRate} onChange={setSeedRate} resetValue={20} lang={lang} />
        <InputWithVoice label="Baseline Production Cost (₹/acre)" value={typicalCost} onChange={setTypicalCost} resetValue={15000} lang={lang} />
        <InputWithVoice label="Baseline Expected Yield (Quintals/acre)" value={yieldVal} onChange={setYieldVal} resetValue={20} lang={lang} />
        
        <button
          onClick={handleUpdate}
          style={{
            width: '100%', padding: '12px', background: C.green, color: '#fff',
            border: 'none', borderRadius: 10, cursor: 'pointer',
            fontWeight: 700, fontSize: '0.85rem', marginTop: 14
          }}
        >
          Save Configurations Globally
        </button>
      </div>
    </div>
  );
}

// History Panel
function HistoryPanel({ saved, onLoad, onDelete }) {
  if (saved.length === 0) return (
    <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.35)' }}>
      <div style={{ fontSize: '3rem', marginBottom: 12 }}>🕐</div>
      <p>No saved calculations yet.</p>
    </div>
  );
  return (
    <div>
      <PanelHeader icon="🕐" title="Saved Calculations" subtitle="View and edit historical farm calculation projections" />
      <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
        {saved.map(s => (
          <div key={s.id} style={{ background: 'rgba(255,255,255,0.04)', border: '1px solid rgba(255,255,255,0.1)', borderRadius: 12, padding: '12px 16px', display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
            <div>
              <div style={{ fontWeight: 700, color: C.green, fontSize: '0.92rem' }}>{s.name}</div>
              <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)', marginTop: 2 }}>{s.date} · Crop: {s.crop} · Area: {s.area} {s.unit}</div>
            </div>
            <div style={{ display: 'flex', gap: 8 }}>
              <button onClick={() => onLoad(s)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: C.green, cursor: 'pointer', fontSize: '0.8rem', fontWeight: 600 }}>Restore</button>
              <button onClick={() => onDelete(s.id)} style={{ padding: '6px 12px', borderRadius: 8, background: 'rgba(239,68,68,0.1)', border: '1px solid rgba(239,68,68,0.25)', color: C.red, cursor: 'pointer', fontSize: '0.8rem' }}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── MAIN HUB COMPONENT ────────────────────────────────────────────────────────
export function CalculatorTab() {
  const { lang, setActiveTab } = useApp();

  // Settings baselines loaded from localstorage or defaulting
  const [cropData, setCropData] = useState(() => {
    const local = localStorage.getItem('krishi_config_crops');
    return local ? JSON.parse(local) : DEFAULT_CROP_DATA;
  });
  const [fertilizerData, setFertilizerData] = useState(() => {
    const local = localStorage.getItem('krishi_config_fertilizers');
    return local ? JSON.parse(local) : DEFAULT_FERTILIZER_DATA;
  });

  // Save to local storage when configured
  useEffect(() => {
    localStorage.setItem('krishi_config_crops', JSON.stringify(cropData));
  }, [cropData]);
  useEffect(() => {
    localStorage.setItem('krishi_config_fertilizers', JSON.stringify(fertilizerData));
  }, [fertilizerData]);

  // Global integrated calculator state
  const [activeCalc, setActiveCalcRaw] = useState('dashboard');
  const [gs, setGs] = useState({ crop: 'wheat', area: 1.0, unit: 'acre' });
  const [saved, setSaved] = useState(() => JSON.parse(localStorage.getItem('krishi_saved_calcs') || '[]'));
  const [saveModal, setSaveModal] = useState(false);
  const [saveName, setSaveName] = useState('');
  const [sidebarOpen, setSidebarOpen] = useState(true);

  // Dynamic shared cost channel
  const [calculatedCosts, setCalculatedCosts] = useState({ totalCost: 0, yieldExpected: 25 });

  const handleSaveCalculatedCosts = (totalCost, yieldExpected) => {
    setCalculatedCosts({ totalCost, yieldExpected });
  };

  const setActiveCalc = (id) => {
    if (id === 'rentals_tab_proxy') { setActiveTab('rentals'); return; }
    setActiveCalcRaw(id);
  };

  const saveCalc = () => {
    const newSave = {
      id: Date.now(), name: saveName || `Calc ${saved.length + 1}`,
      date: new Date().toLocaleDateString('en-IN'), ...gs
    };
    const updated = [newSave, ...saved];
    setSaved(updated);
    localStorage.setItem('krishi_saved_calcs', JSON.stringify(updated));
    setSaveModal(false); setSaveName('');
  };

  const deleteCalc = (id) => {
    const updated = saved.filter(s => s.id !== id);
    setSaved(updated);
    localStorage.setItem('krishi_saved_calcs', JSON.stringify(updated));
  };

  const loadCalc = (s) => {
    setGs({ crop: s.crop, area: s.area, unit: s.unit });
    setActiveCalcRaw('dashboard');
  };

  // Group nav items
  const groups = [...new Set(NAV.map(n => n.group))];

  return (
    <div className="tab-panel active" style={{ display: 'flex', flexDirection: 'column', gap: 0 }}>
      {/* ── Global Header Info Bar ── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(34,197,94,0.1), rgba(96,165,250,0.07))',
        border: '1px solid rgba(34,197,94,0.18)', borderRadius: 16, padding: '14px 18px',
        marginBottom: 14, display: 'flex', flexWrap: 'wrap', gap: 12, alignItems: 'center'
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: 8, flex: '1 0 auto' }}>
          <span style={{ fontSize: '1.6rem' }}>🧮</span>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.1rem' }}>Integrated Farming Calculator</h2>
            <p style={{ margin: 0, fontSize: '0.75rem', color: 'rgba(255,255,255,0.45)' }}>
              Estimate seed quantity, fertilizer NPK dosages, spraying expenses, machinery rentals, and total ROI.
            </p>
          </div>
        </div>

        {/* Global shared context controls */}
        <div style={{ display: 'flex', gap: 12, flexWrap: 'wrap', alignItems: 'center' }}>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Crop:</span>
            <CropSelect cropData={cropData} value={gs.crop} onChange={v => setGs(p => ({ ...p, crop: v }))} />
          </div>
          <div style={{ display: 'flex', gap: 6, alignItems: 'center' }}>
            <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.5)' }}>Area:</span>
            <input 
              type="number" value={gs.area} onChange={e => {
                const val = Math.max(0, parseFloat(e.target.value) || 0);
                setGs(p => ({ ...p, area: val }));
              }} 
              style={{
                width: 60, padding: 6, background: 'rgba(255,255,255,0.08)',
                border: '1px solid rgba(255,255,255,0.15)', borderRadius: 8, color: '#fff', fontSize: '0.85rem'
              }}
            />
            <UnitSelect value={gs.unit} onChange={v => setGs(p => ({ ...p, unit: v }))} />
          </div>
        </div>

        <div style={{ display: 'flex', gap: 8 }}>
          <button onClick={() => setSaveModal(true)} style={{
            padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(96,165,250,0.3)',
            background: 'rgba(96,165,250,0.12)', color: C.blue, cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600
          }}>💾 Save</button>
          <button onClick={() => setActiveCalcRaw('history')} style={{
            padding: '8px 14px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.12)',
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.6)', cursor: 'pointer', fontSize: '0.82rem'
          }}>🕐 History</button>
        </div>
      </div>

      {/* ── Main Layout Workspace ── */}
      <div style={{ display: 'flex', gap: 14, minHeight: '70vh' }}>
        {/* Sidebar Nav */}
        <div style={{
          width: sidebarOpen ? 210 : 52, flexShrink: 0, transition: 'width 0.2s',
          background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)',
          borderRadius: 14, padding: '8px 6px', overflowY: 'auto', overflowX: 'hidden'
        }}>
          <button onClick={() => setSidebarOpen(v => !v)} style={{
            width: '100%', padding: '6px 8px', borderRadius: 8, border: 'none',
            background: 'rgba(255,255,255,0.05)', color: 'rgba(255,255,255,0.5)',
            cursor: 'pointer', marginBottom: 10, fontSize: '0.8rem',
            display: 'flex', alignItems: 'center', gap: 6
          }}>
            {sidebarOpen ? '◀' : '▶'}
            {sidebarOpen && <span>Calculators</span>}
          </button>

          {groups.map(group => {
            const gl = GROUP_LABELS[group];
            const groupItems = NAV.filter(n => n.group === group);
            return (
              <div key={group} style={{ marginBottom: 8 }}>
                {sidebarOpen && (
                  <div style={{ fontSize: '0.62rem', fontWeight: 700, letterSpacing: '0.08em', color: gl.color, textTransform: 'uppercase', padding: '4px 8px', marginBottom: 2 }}>
                    {gl.label}
                  </div>
                )}
                {groupItems.map(item => (
                  <button key={item.id} onClick={() => setActiveCalc(item.id)} style={{
                    width: '100%', padding: sidebarOpen ? '8px 10px' : '8px',
                    borderRadius: 8, border: 'none', marginBottom: 2, cursor: 'pointer',
                    background: activeCalc === item.id ? `${gl.color}20` : 'transparent',
                    borderLeft: activeCalc === item.id ? `3px solid ${gl.color}` : '3px solid transparent',
                    display: 'flex', alignItems: 'center', gap: 8, transition: 'all 0.15s',
                    color: activeCalc === item.id ? gl.color : 'rgba(255,255,255,0.5)',
                    fontSize: '0.82rem', fontWeight: activeCalc === item.id ? 700 : 400,
                    textAlign: 'left', whiteSpace: 'nowrap'
                  }}>
                    <span style={{ fontSize: '1rem', flexShrink: 0 }}>{item.icon}</span>
                    {sidebarOpen && <span>{item.label}</span>}
                  </button>
                ))}
              </div>
            );
          })}
        </div>

        {/* Workspace Display */}
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.02)', border: '1px solid rgba(255,255,255,0.07)', borderRadius: 14, padding: '1.2rem', overflowY: 'auto' }}>
          {activeCalc === 'dashboard'    && <DashboardPanel gs={gs} cropData={cropData} />}
          {activeCalc === 'area'         && <AreaPanel gs={gs} setGs={setGs} lang={lang} />}
          {activeCalc === 'seed'         && <SeedPanel gs={gs} setGs={setGs} cropData={cropData} lang={lang} />}
          {activeCalc === 'fertilizer'   && <FertilizerPanel gs={gs} fertilizerData={fertilizerData} cropData={cropData} lang={lang} />}
          {activeCalc === 'irrigation'   && <IrrigationPanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'spray'        && <SprayPanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'labour'       && <LabourPanel gs={gs} lang={lang} />}
          {activeCalc === 'machinery'    && <MachineryPanel gs={gs} setActiveCalc={setActiveCalc} lang={lang} />}
          {activeCalc === 'farmcost'     && <FarmCostPanel gs={gs} cropData={cropData} lang={lang} onSaveCalculatedCosts={handleSaveCalculatedCosts} />}
          {activeCalc === 'profit'       && <ProfitPanel gs={gs} cropData={cropData} calculatedCosts={calculatedCosts} lang={lang} />}
          {activeCalc === 'breakeven'    && <BreakEvenPanel lang={lang} />}
          {activeCalc === 'loan'         && <LoanPanel lang={lang} />}
          {activeCalc === 'roi'          && <ROIPanel lang={lang} />}
          {activeCalc === 'crop_compare' && <CropComparePanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'mandi_profit' && <MandiProfitPanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'storage'      && <StoragePanel cropData={cropData} lang={lang} />}
          {activeCalc === 'multicrop'    && <MultiCropPanel gs={gs} cropData={cropData} lang={lang} />}
          {activeCalc === 'settings'     && <SettingsPanel cropData={cropData} setCropData={setCropData} fertilizerData={fertilizerData} setFertilizerData={setFertilizerData} lang={lang} />}
          {activeCalc === 'history'      && <HistoryPanel saved={saved} onLoad={loadCalc} onDelete={deleteCalc} />}
        </div>
      </div>

      {/* Save Modal */}
      {saveModal && (
        <div style={{ position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.75)', display: 'flex', alignItems: 'center', justifyContent: 'center', zIndex: 2000 }}
          onClick={e => e.target === e.currentTarget && setSaveModal(false)}>
          <div style={{ background: 'linear-gradient(135deg,#1a1a2e,#16213e)', border: '1px solid rgba(96,165,250,0.3)', borderRadius: 18, padding: '1.8rem', maxWidth: 400, width: '90%' }}>
            <h3 style={{ margin: '0 0 16px', color: C.blue }}>💾 Save Calculation</h3>
            <Label>Give this calculation a name</Label>
            <input 
              type="text" value={saveName} onChange={e => setSaveName(e.target.value)} 
              placeholder={`e.g. Wheat Kharif 2026`} 
              style={{
                width: '100%', padding: '10px 12px', borderRadius: 10,
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: '#fff', fontSize: '0.92rem', boxSizing: 'border-box', marginBottom: 16
              }}
            />
            <div style={{ display: 'flex', gap: 10 }}>
              <button onClick={() => setSaveModal(false)} style={{ flex: 1, padding: '10px', borderRadius: 10, border: '1px solid rgba(255,255,255,0.15)', background: 'transparent', color: 'rgba(255,255,255,0.5)', cursor: 'pointer' }}>Cancel</button>
              <button onClick={saveCalc} style={{ flex: 1, padding: '10px', borderRadius: 10, border: 'none', background: `linear-gradient(135deg, ${C.blue}, #2563eb)`, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>Save</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
