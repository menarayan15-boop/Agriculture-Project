import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getText } from '../data/constants';
import { pageReader } from '../services/ai/pageNarrationService';

export function Header({ onOpenAiModal }) {
  const { lang, setLang, setShowOnboarding, activeTab, crop, soil, location, area, report } = useApp();
  const [profileOpen, setProfileOpen] = useState(false);
  const [readerState, setReaderState] = useState({
    isReading: pageReader.isReading,
    isMuted: pageReader.isMuted
  });

  // Subscribe to page reader state updates (isReading, isMuted)
  useEffect(() => {
    const unsubscribe = pageReader.subscribe((state) => {
      setReaderState({
        isReading: state.isReading,
        isMuted: state.isMuted
      });
    });
    return unsubscribe;
  }, []);

  // When activeTab or language changes:
  // Immediately stops reading the previous page and, if not muted, reads the newly opened page!
  useEffect(() => {
    pageReader.handlePageChange(activeTab, lang, { crop, soil, location, area, report });
  }, [activeTab, lang, crop, soil, location, area, report]);

  // Handle Play/Listen Toggle
  const handleListenClick = () => {
    if (readerState.isReading) {
      // If currently speaking, re-read or pause
      pageReader.readPage(activeTab, lang, { crop, soil, location, area, report });
    } else {
      pageReader.unmuteAndRead(activeTab, lang, { crop, soil, location, area, report });
    }
  };

  // Handle Mute Button Click
  const handleMuteClick = () => {
    pageReader.mute();
  };

  // Localized button text for Farmer Voice Guide
  const LISTEN_LABELS = {
    en: { play: 'Farmer Guide', reading: 'Assisting...' },
    hi: { play: 'किसान साथी', reading: 'मदद कर रहा है...' },
    te: { play: 'రైతు మార్గదర్శి', reading: 'సహాయం చేస్తోంది...' },
    ta: { play: 'விவசாய வழிகாட்டி', reading: 'வழிகாட்டுகிறது...' },
    kn: { play: 'ರೈತ ಮಾರ್ಗದರ್ಶಿ', reading: 'ಸಹಾಯ ಮಾಡುತ್ತಿದೆ...' },
    pa: { play: 'ਕਿਸਾਨ ਸਾਥੀ', reading: 'ਅਗਵਾਈ ਕਰ ਰਿਹਾ...' },
    mr: { play: 'शेतकरी साथी', reading: 'मार्गदर्शन करत आहे...' },
    bn: { play: 'কৃষক সাথী', reading: 'সহায়তা করছে...' },
    gu: { play: 'ખેડૂત સાથી', reading: 'માર્ગદર્શન આપે છે...' },
    or: { play: 'କୃଷକ ସାଥୀ', reading: 'ସାହାଯ୍ୟ କରୁଛି...' }
  };

  const MUTE_LABELS = {
    en: 'Mute',
    hi: 'म्यूट',
    te: 'మ్యూట్',
    ta: 'ஒலியடக்கு',
    kn: 'ಮ್ಯೂಟ್',
    pa: 'ਮਿਊਟ',
    mr: 'म्यूट',
    bn: 'নিঃশব্দ',
    gu: 'મ્યૂટ',
    or: 'ମ୍ୟୁଟ୍'
  };

  const currentListenLabel = LISTEN_LABELS[lang] || LISTEN_LABELS.en;
  const currentMuteLabel = MUTE_LABELS[lang] || MUTE_LABELS.en;

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

        {/* ── AUDIO PAGE READER & MUTE BUTTONS (BESIDE LANGUAGE SELECTOR) ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          {/* 1. Listen / Read Page Button */}
          <button
            id="btn-page-reader-play"
            onClick={handleListenClick}
            title={readerState.isReading ? "Reading this page aloud" : "Read this entire page aloud in chosen language"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '0.83rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: readerState.isReading 
                ? '1.5px solid #22c55e' 
                : '1px solid rgba(255, 255, 255, 0.15)',
              background: readerState.isReading
                ? 'linear-gradient(135deg, rgba(21, 128, 61, 0.85) 0%, rgba(34, 197, 94, 0.95) 100%)'
                : 'rgba(255, 255, 255, 0.07)',
              color: '#ffffff',
              boxShadow: readerState.isReading 
                ? '0 0 14px rgba(34, 197, 94, 0.5)' 
                : 'none',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!readerState.isReading) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.14)';
                e.currentTarget.style.borderColor = 'rgba(34, 197, 94, 0.5)';
              }
            }}
            onMouseLeave={(e) => {
              if (!readerState.isReading) {
                e.currentTarget.style.background = 'rgba(255, 255, 255, 0.07)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              }
            }}
          >
            <i 
              className={`fa-solid ${readerState.isReading ? 'fa-volume-high' : 'fa-volume-low'}`}
              style={{
                color: readerState.isReading ? '#ffffff' : 'var(--highlight)',
                fontSize: '0.9rem',
                animation: readerState.isReading ? 'pulse 1.2s infinite' : 'none'
              }}
            ></i>
            <span>
              {readerState.isReading ? currentListenLabel.reading : currentListenLabel.play}
            </span>
            {readerState.isReading && (
              <span style={{
                width: '6px',
                height: '6px',
                borderRadius: '50%',
                background: '#ffffff',
                display: 'inline-block',
                boxShadow: '0 0 6px #ffffff'
              }} />
            )}
          </button>

          {/* 2. Mute / Stop Button */}
          <button
            id="btn-page-reader-mute"
            onClick={handleMuteClick}
            title="Stop and Mute Page Audio"
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '5px',
              padding: '6px 10px',
              borderRadius: 'var(--border-radius-sm)',
              fontSize: '0.83rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: readerState.isMuted
                ? '1px solid rgba(239, 68, 68, 0.4)'
                : '1px solid rgba(255, 255, 255, 0.15)',
              background: readerState.isMuted
                ? 'rgba(239, 68, 68, 0.12)'
                : 'rgba(255, 255, 255, 0.05)',
              color: readerState.isMuted ? '#fca5a5' : 'var(--text-secondary)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(239, 68, 68, 0.25)';
              e.currentTarget.style.color = '#ffffff';
              e.currentTarget.style.borderColor = 'rgba(239, 68, 68, 0.7)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = readerState.isMuted ? 'rgba(239, 68, 68, 0.12)' : 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.color = readerState.isMuted ? '#fca5a5' : 'var(--text-secondary)';
              e.currentTarget.style.borderColor = readerState.isMuted ? 'rgba(239, 68, 68, 0.4)' : 'rgba(255, 255, 255, 0.15)';
            }}
          >
            <i 
              className="fa-solid fa-volume-xmark" 
              style={{ color: readerState.isMuted ? '#ef4444' : 'inherit' }}
            ></i>
            <span>{currentMuteLabel}</span>
          </button>
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

              <button 
                onClick={() => {
                  setProfileOpen(false);
                  const key = prompt("Enter your Gemini API Key for AI features:", localStorage.getItem('krishi_gemini_key') || '');
                  if (key !== null) {
                    localStorage.setItem('krishi_gemini_key', key.trim());
                    alert("Gemini API Key saved successfully!");
                  }
                }}
                style={{
                  width: '100%', background: 'transparent', border: 'none', textAlign: 'left',
                  color: 'var(--text-primary)', padding: '8px 12px', cursor: 'pointer',
                  borderRadius: '4px', fontSize: '0.9rem', display: 'flex', alignItems: 'center', gap: '8px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'rgba(255,255,255,0.1)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <i className="fa-solid fa-key"></i> Gemini API Key
              </button>
            </div>
          )}
        </div>

      </div>
    </header>
  );
}

export default Header;
