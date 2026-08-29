import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getText } from '../data/constants';
import GoogleTranslate from './GoogleTranslate';

export function Header({ onOpenAiModal }) {
  const { lang, setLang, geminiKey, setShowOnboarding } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);

  return (
    <header className="app-header">
      <div className="header-logo">
        <img 
          src="/logo.svg" 
          alt="Krishi Jal Logo" 
          style={{ width: '44px', height: '44px', objectFit: 'contain', filter: 'drop-shadow(0 2px 8px rgba(16, 185, 129, 0.4))' }} 
        />
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

        {/* Google Translate Language Selector */}
        <div className="lang-selector-wrapper">
          <i className="fa-solid fa-language lang-icon"></i>
          <GoogleTranslate />
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

      </div>
    </header>
  );
}
