import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { getText } from '../data/constants';
import { pageReader } from '../services/ai/pageNarrationService';
import { ttsEngine } from '../services/ai/ttsService';

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
  // Stops reading previous page and, if unmuted, narrates newly opened page
  useEffect(() => {
    pageReader.handlePageChange(activeTab, lang, { crop, soil, location, area, report });
  }, [activeTab, lang]);

  // Handle Play/Listen Toggle
  const handleListenClick = () => {
    if (readerState.isReading) {
      pageReader.stop();
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
    hi: { play: 'किसान साथी', reading: 'मार्गदर्शन जारी...' },
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
          style={{ width: '40px', height: '40px', objectFit: 'contain' }} 
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
        <div className="lang-selector-wrapper">
          <i className="fa-solid fa-language lang-icon"></i>
          <select
            id="krishi-lang-select"
            className="lang-select"
            value={lang}
            onChange={(e) => {
              pageReader.stop(false);
              ttsEngine.stop();
              setLang(e.target.value);
            }}
          >
            <option value="en">English</option>
            <option value="hi">हिन्दी (Hindi)</option>
            <option value="te">తెలుగు (Telugu)</option>
            <option value="ta">தமிழ் (Tamil)</option>
            <option value="kn">ಕನ್ನಡ (Kannada)</option>
            <option value="pa">ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="mr">मराठी (Marathi)</option>
            <option value="bn">বাংলা (Bengali)</option>
            <option value="gu">ગુજરાતી (Gujarati)</option>
            <option value="or">ଓଡ଼ିଆ (Odia)</option>
          </select>
        </div>

        {/* ── AUDIO PAGE READER & MUTE BUTTONS ── */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          {/* 1. Listen / Read Page Button */}
          <button
            id="btn-page-reader-play"
            onClick={handleListenClick}
            title={readerState.isReading ? "Reading this page aloud" : "Read this entire page aloud in chosen language"}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '7px',
              padding: '8px 14px',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '0.86rem',
              fontWeight: 700,
              cursor: 'pointer',
              border: readerState.isReading 
                ? '1px solid #15803D' 
                : '1px solid var(--border-color)',
              background: readerState.isReading
                ? 'var(--primary)'
                : '#FFFFFF',
              color: readerState.isReading ? '#FFFFFF' : 'var(--text-primary)',
              boxShadow: readerState.isReading 
                ? '0 4px 14px rgba(21, 128, 61, 0.3)' 
                : 'var(--shadow-xs)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              if (!readerState.isReading) {
                e.currentTarget.style.background = 'var(--very-light-green)';
                e.currentTarget.style.borderColor = 'var(--primary)';
              }
            }}
            onMouseLeave={(e) => {
              if (!readerState.isReading) {
                e.currentTarget.style.background = '#FFFFFF';
                e.currentTarget.style.borderColor = 'var(--border-color)';
              }
            }}
          >
            <i 
              className={`fa-solid ${readerState.isReading ? 'fa-volume-high' : 'fa-volume-low'}`}
              style={{
                color: readerState.isReading ? '#FFFFFF' : 'var(--primary)',
                fontSize: '0.92rem'
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
                background: '#FFFFFF',
                display: 'inline-block',
                boxShadow: '0 0 6px #FFFFFF'
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
              gap: '6px',
              padding: '8px 12px',
              borderRadius: 'var(--border-radius-md)',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              border: readerState.isMuted
                ? '1px solid #FECACA'
                : '1px solid var(--border-color)',
              background: readerState.isMuted
                ? '#FEF2F2'
                : '#FFFFFF',
              color: readerState.isMuted ? '#DC2626' : 'var(--text-secondary)',
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = '#FEE2E2';
              e.currentTarget.style.color = '#DC2626';
              e.currentTarget.style.borderColor = '#FCA5A5';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = readerState.isMuted ? '#FEF2F2' : '#FFFFFF';
              e.currentTarget.style.color = readerState.isMuted ? '#DC2626' : 'var(--text-secondary)';
              e.currentTarget.style.borderColor = readerState.isMuted ? '#FECACA' : 'var(--border-color)';
            }}
          >
            <i 
              className="fa-solid fa-volume-xmark" 
              style={{ color: readerState.isMuted ? '#DC2626' : 'inherit' }}
            ></i>
            <span>{currentMuteLabel}</span>
          </button>
        </div>

        {/* Profile Dropdown */}
        <div style={{ position: 'relative' }}>
          <button 
            onClick={() => setProfileOpen(!profileOpen)}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-color)',
              color: 'var(--text-primary)',
              padding: '7px 12px',
              borderRadius: 'var(--border-radius-md)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              gap: '8px',
              fontSize: '0.88rem',
              fontWeight: 600,
              boxShadow: 'var(--shadow-xs)',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <i className="fa-solid fa-user-circle" style={{ color: 'var(--primary)', fontSize: '1.2rem' }}></i>
            <i className="fa-solid fa-chevron-down" style={{ fontSize: '0.7rem', color: 'var(--text-secondary)' }}></i>
          </button>
          
          {profileOpen && (
            <div style={{
              position: 'absolute',
              top: 'calc(100% + 8px)',
              right: 0,
              background: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: 'var(--border-radius-md)',
              padding: '6px',
              minWidth: '190px',
              boxShadow: 'var(--shadow-md)',
              zIndex: 100
            }}>
              <button 
                onClick={() => {
                  setProfileOpen(false);
                  setShowOnboarding(true);
                }}
                style={{
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  color: 'var(--text-primary)',
                  padding: '9px 12px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--very-light-green)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <i className="fa-solid fa-pen-to-square" style={{ color: 'var(--primary)' }}></i> Edit Farm Profile
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
                  width: '100%',
                  background: 'transparent',
                  border: 'none',
                  textAlign: 'left',
                  color: 'var(--text-primary)',
                  padding: '9px 12px',
                  cursor: 'pointer',
                  borderRadius: '6px',
                  fontSize: '0.88rem',
                  fontWeight: 500,
                  display: 'flex',
                  alignItems: 'center',
                  gap: '10px'
                }}
                onMouseEnter={(e) => e.currentTarget.style.background = 'var(--very-light-green)'}
                onMouseLeave={(e) => e.currentTarget.style.background = 'transparent'}
              >
                <i className="fa-solid fa-key" style={{ color: 'var(--primary)' }}></i> Gemini API Key
              </button>
            </div>
          )}
        </div>
      </div>
    </header>
  );
}

export default Header;
