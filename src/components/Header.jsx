import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getText } from '../data/constants';

export function Header({ onOpenAiModal }) {
  const { lang, setLang, geminiKey, setShowOnboarding } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="header-logo">
        <div className="logo-icon">
          <svg viewBox="0 0 24 24" width="32" height="32" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
            <path d="M12 2v20M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6"></path>
          </svg>
        </div>
        <div className="logo-text">
          <h1 className="logo-title">{getText('logo-title', lang)}</h1>
          <span className="logo-subtitle">{getText('logo-subtitle', lang)}</span>
        </div>
      </div>

      {/* Global AI Smart Search Bar */}
      <div className="global-search-wrapper">
        <i className="fa-solid fa-magnifying-glass search-icon"></i>
        <input 
          type="text" 
          id="global-search-input" 
          className="global-search-input" 
          placeholder={getText('search-placeholder', lang)} 
          autoComplete="off" 
        />
      </div>

      <div className="header-actions">
        {/* Unit Switcher */}
        <div className="unit-toggle-container">
          <span className="toggle-label">°C / mm</span>
          <label className="switch">
            <input type="checkbox" id="toggle-units" />
            <span className="slider round"></span>
          </label>
          <span className="toggle-label">°F / inches</span>
        </div>

        {/* Language Selector */}
        <div className="lang-selector-wrapper">
          <i className="fa-solid fa-language lang-icon"></i>
          <select 
            value={lang} 
            onChange={(e) => setLang(e.target.value)} 
            className="lang-select"
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="ml">മലയാളം (Malayalam)</option>
            <option value="or">ଓଡ଼िਆ (Odia)</option>
          </select>
        </div>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              background: 'rgba(255, 255, 255, 0.05)', border: '1px solid var(--border-color)',
              color: 'var(--text-primary)', padding: '8px 12px', borderRadius: 'var(--border-radius-sm)',
              cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.9rem'
            }}
          >
            <i className="fa-solid fa-user-circle" style={{color: 'var(--highlight)', fontSize: '1.2rem'}}></i>
            <i className="fa-solid fa-chevron-down" style={{fontSize: '0.7rem', color: 'var(--text-secondary)'}}></i>
          </button>
          
          {profileOpen && (
            <div style={{
              position: 'absolute', top: 'calc(100% + 8px)', right: 0,
              background: 'var(--monsoon-green)', border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-sm)', padding: '8px', minWidth: '180px',
              boxShadow: 'var(--shadow-md)', zIndex: 100
            }}>
              <button 
                onClick={() => {
                  setProfileOpen(false);
                  setShowOnboarding(true);
                }}
                style={{
                  width: '100%', background: 'transparent', border: 'none', textAlign: 'left',
                  color: 'var(--text-primary)', padding: '8px 12px', cursor: 'pointer',
                  borderRadius: '4px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <i className="fa-solid fa-pen-to-square"></i> Edit Farm Profile
              </button>
            </div>
          )}
        </div>

        {/* Gemini AI Key Settings Button */}
        <button 
          type="button" 
          className="btn btn-outline-sm btn-ai-key-header" 
          onClick={onOpenAiModal}
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '6px',
            padding: '6px 12px',
            border: '1px solid var(--border-color)',
            borderRadius: '20px',
            background: 'rgba(59, 130, 246, 0.1)',
            color: '#93c5fd',
            fontSize: '0.8rem',
            cursor: 'pointer'
          }}
        >
          <i className="fa-solid fa-brain"></i> 
          <span>{geminiKey ? getText('gemini-connected', lang) : getText('gemini-key', lang)}</span>
        </button>
      </div>
    </header>
  );
}
