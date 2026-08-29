import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getText } from '../data/constants';
import GoogleTranslate from './GoogleTranslate';

export function Header({ onOpenAiModal, onNavigate }) {
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
        {/* Hub / Home button */}
        <button
          onClick={() => onNavigate && onNavigate('landing')}
          title="Back to Landing Portal Hub"
          style={{
            background: 'rgba(255, 255, 255, 0.06)',
            border: '1px solid var(--border-color)',
            color: 'var(--text-primary)',
            padding: '7px 12px',
            borderRadius: 'var(--border-radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            fontSize: '0.85rem',
            fontWeight: '600',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.12)'}
          onMouseLeave={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
        >
          <i className="fa-solid fa-house" style={{ color: 'var(--highlight)' }}></i>
          <span>Hub</span>
        </button>

        {/* Switch to Software Farmers Portal */}
        <button
          onClick={() => onNavigate && onNavigate('software-farmers')}
          title="Switch to Software Farmers SmartFarm Suite"
          style={{
            background: 'linear-gradient(135deg, #0f5132 0%, #198754 100%)',
            border: '1px solid rgba(32, 201, 151, 0.4)',
            color: '#ffffff',
            padding: '7px 14px',
            borderRadius: 'var(--border-radius-sm)',
            cursor: 'pointer',
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.85rem',
            fontWeight: '700',
            boxShadow: '0 2px 8px rgba(25, 135, 84, 0.35)',
            transition: 'all 0.2s'
          }}
          onMouseEnter={(e) => e.currentTarget.style.transform = 'translateY(-1px)'}
          onMouseLeave={(e) => e.currentTarget.style.transform = 'translateY(0)'}
        >
          <i className="fa-solid fa-microchip" style={{ color: '#6ee7b7' }}></i>
          <span>Software Farmers</span>
          <i className="fa-solid fa-arrow-right" style={{ fontSize: '0.75rem', opacity: 0.8 }}></i>
        </button>

        {/* Unit Switcher */}
        <div className="unit-toggle-container">
          <span className="toggle-label">°C / mm</span>
          <label className="switch">
            <input type="checkbox" id="toggle-units" />
            <span className="slider round"></span>
          </label>
          <span className="toggle-label">°F / inches</span>
        </div>

        {/* Language Selector Dropdown */}
        <div 
          className="lang-selector-wrapper"
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '6px',
            background: 'rgba(255, 255, 255, 0.08)',
            border: '1px solid var(--border-color)',
            borderRadius: 'var(--border-radius-sm)',
            padding: '5px 10px'
          }}
        >
          <i className="fa-solid fa-language lang-icon" style={{ color: 'var(--highlight)', fontSize: '1rem' }}></i>
          <select
            id="krishi-lang-select"
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: 'var(--text-primary)',
              fontSize: '0.85rem',
              fontWeight: '600',
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          >
            <option value="en" style={{ background: '#0d1e15', color: '#ffffff' }}>English</option>
            <option value="hi" style={{ background: '#0d1e15', color: '#ffffff' }}>हिन्दी (Hindi)</option>
            <option value="te" style={{ background: '#0d1e15', color: '#ffffff' }}>తెలుగు (Telugu)</option>
            <option value="ta" style={{ background: '#0d1e15', color: '#ffffff' }}>தமிழ் (Tamil)</option>
            <option value="kn" style={{ background: '#0d1e15', color: '#ffffff' }}>ಕನ್ನಡ (Kannada)</option>
            <option value="pa" style={{ background: '#0d1e15', color: '#ffffff' }}>ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="mr" style={{ background: '#0d1e15', color: '#ffffff' }}>मराठी (Marathi)</option>
            <option value="bn" style={{ background: '#0d1e15', color: '#ffffff' }}>বাংলা (Bengali)</option>
            <option value="gu" style={{ background: '#0d1e15', color: '#ffffff' }}>ગુજરાતી (Gujarati)</option>
            <option value="or" style={{ background: '#0d1e15', color: '#ffffff' }}>ଓଡ଼ିଆ (Odia)</option>
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

      </div>
    </header>
  );
}
