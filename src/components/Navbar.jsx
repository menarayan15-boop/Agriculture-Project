import React from 'react';
import { useApp } from '../context/AppContext';

export function Navbar({ onOpenAiModal }) {
  const { lang, setLang, serverOnline, geminiKey, farmerProfile, updateProfile } = useApp();

  return (
    <nav className="main-nav">
      <div className="nav-container">
        <div className="brand-logo" style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img src="/logo.svg" alt="Krishi Jal Logo" style={{ width: '38px', height: '38px', objectFit: 'contain', filter: 'drop-shadow(0 2px 6px rgba(16, 185, 129, 0.4))' }} />
          <div>
            <h1 className="brand-title">Krishi Jal <span className="brand-badge">AI 3.5</span></h1>
            <p className="brand-sub">Smart Agricultural Irrigation &amp; Yield Advisor</p>
          </div>
        </div>

        <div className="nav-controls">
          <div className={`status-pill ${serverOnline ? 'online' : 'offline'}`}>
            <span className="status-dot"></span>
            <span>{serverOnline ? 'SQLite Backend Online' : 'Offline / Standalone'}</span>
          </div>

          <button className="btn btn-ai-key" onClick={onOpenAiModal}>
            <i className="fa-solid fa-key"></i>
            <span>{geminiKey ? 'Gemini Connected' : 'Connect Gemini AI'}</span>
          </button>

          <button 
            className="btn btn-profile" 
            onClick={() => updateProfile({ ...farmerProfile, completed: 0 })}
            style={{ 
              display: 'inline-flex', 
              alignItems: 'center', 
              gap: '6px', 
              padding: '6px 12px', 
              border: '1px solid var(--border-color)', 
              borderRadius: '20px', 
              background: 'rgba(34, 197, 94, 0.1)', 
              color: '#4ade80', 
              fontSize: '0.8rem', 
              cursor: 'pointer',
              marginLeft: '8px'
            }}
          >
            <i className="fa-solid fa-user-gear"></i>
            <span>{farmerProfile?.completed ? `${farmerProfile.state} (${farmerProfile.district})` : 'Setup Profile'}</span>
          </button>

          <div className="lang-picker">
            <i className="fa-solid fa-language lang-icon"></i>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              className="lang-select"
            >
              <option value="en">English</option>
              <option value="hi">हिंदी (Hindi)</option>
              <option value="te">తెలుగు (Telugu)</option>
              <option value="ta">தமிழ் (Tamil)</option>
              <option value="mr">मराठी (Marathi)</option>
              <option value="bn">বাংলা (Bengali)</option>
              <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
              <option value="gu">ગુજરાતી (Gujarati)</option>
              <option value="kn">ಕನ್ನಡ (Kannada)</option>
              <option value="ml">മലയാളം (Malayalam)</option>
              <option value="or">ଓଡ଼ିଆ (Odia)</option>
            </select>
          </div>
        </div>
      </div>
    </nav>
  );
}
