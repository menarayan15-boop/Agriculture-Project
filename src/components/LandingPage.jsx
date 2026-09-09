import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getText } from '../data/constants';

export function LandingPage({ onStartKrishiJal, onOpenDirectTab }) {
  const { lang, setLang } = useApp();
  const [hoveredCard, setHoveredCard] = useState(null);

  const isHindi = lang === 'hi';

  const colors = {
    bg: '#0a0f0d',
    text: '#f8fafc',
    subtext: '#94a3b8',
    border: '#166534',
    shadow: '#042f1b',
    itemBg: 'rgba(255, 255, 255, 0.04)',
    itemBorder: 'rgba(255, 255, 255, 0.08)'
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(135deg, #0d1e15 0%, #111827 50%, #0d1e15 100%)',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        padding: '40px 20px',
        boxSizing: 'border-box',
        fontFamily: "'Inter', sans-serif",
        overflowX: 'hidden'
      }}
    >
      {/* ── TOP BAR: LOGO & LANGUAGE SELECTOR ── */}
      <div
        style={{
          position: 'absolute',
          top: '24px',
          left: '24px',
          right: '24px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          zIndex: 10
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <img 
            src="/logo.svg" 
            alt="Krishi Jal" 
            style={{ width: '40px', height: '40px', filter: 'drop-shadow(0 2px 8px rgba(34, 197, 94, 0.4))' }} 
          />
          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#22c55e', letterSpacing: '-0.02em' }}>
            KRISHI JAL
          </span>
        </div>

        {/* Language selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(255, 255, 255, 0.06)',
            border: '1.5px solid rgba(34, 197, 94, 0.3)',
            borderRadius: '8px',
            padding: '4px 10px'
          }}
        >
          <span style={{ fontSize: '1rem' }}>🌐</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#ffffff',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'inherit'
            }}
          >
            <option value="en" style={{ background: '#0d1e15', color: '#fff' }}>English</option>
            <option value="hi" style={{ background: '#0d1e15', color: '#fff' }}>हिन्दी (Hindi)</option>
            <option value="te" style={{ background: '#0d1e15', color: '#fff' }}>తెలుగు (Telugu)</option>
            <option value="ta" style={{ background: '#0d1e15', color: '#fff' }}>தமிழ் (Tamil)</option>
            <option value="kn" style={{ background: '#0d1e15', color: '#fff' }}>ಕನ್ನಡ (Kannada)</option>
            <option value="pa" style={{ background: '#0d1e15', color: '#fff' }}>ਪੰਜਾਬੀ (Punjabi)</option>
            <option value="mr" style={{ background: '#0d1e15', color: '#fff' }}>मराठी (Marathi)</option>
            <option value="bn" style={{ background: '#0d1e15', color: '#fff' }}>বাংলা (Bengali)</option>
          </select>
        </div>
      </div>

      {/* ── HERO BANNER ── */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '780px',
          marginTop: '60px',
          marginBottom: '36px'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: 'rgba(34, 197, 94, 0.15)',
            border: '1.5px solid #22c55e',
            color: '#4ade80',
            fontSize: '0.85rem',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '20px',
            marginBottom: '18px'
          }}
        >
          <span>🌱</span>
          <span>{isHindi ? 'स्मार्ट एआई कृषि सलाहकार व किसान मंच' : 'SMART AI FARMING PLATFORM'}</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: '1.15',
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0',
            color: '#ffffff'
          }}
        >
          {isHindi 
            ? 'कृषि जल — आपका सम्पूर्ण स्मार्ट कृषि समाधान' 
            : 'KRISHI JAL — AI SMART IRRIGATION & CROP ADVISOR'}
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            fontWeight: 500,
            color: colors.subtext,
            maxWidth: '650px',
            lineHeight: '1.6',
            margin: '0 auto'
          }}
        >
          {isHindi 
            ? 'जेमिनी एआई फसल सलाहकार, डिजिटल सॉइल लैब, ट्रैक्टर व कृषि मशीनरी रेंटल, लाइव मंडी भाव व मौसम आधारित सिंचाई।'
            : 'Real-time AI crop diagnostics, digital soil laboratory, farm machinery rental marketplace, live mandi commodity prices & custom irrigation roadmaps.'}
        </p>
      </div>

      {/* ── MAIN ACTION CARD ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '720px',
          backgroundColor: 'rgba(18, 26, 21, 0.95)',
          border: '2px solid rgba(34, 197, 94, 0.4)',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.6), 0 0 30px rgba(34, 197, 94, 0.15)',
          marginBottom: '36px'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))', gap: '12px', marginBottom: '28px' }}>
          {[
            { icon: '🤖', title: isHindi ? 'जेमिनी एआई वॉयस डॉक्टर' : 'Gemini AI Voice Doctor', tab: 'voice-ai' },
            { icon: '🧪', title: isHindi ? 'सॉइल डायग्नोस्टिक लैब' : 'Soil Diagnostic Lab', tab: 'soillab' },
            { icon: '🚜', title: isHindi ? 'मशीनरी रेंटल मार्केट' : 'Machinery Rental Market', tab: 'rentals' },
            { icon: '📈', title: isHindi ? 'लाइव मंडी कमोडिटी भाव' : 'Live Mandi Commodity Prices', tab: 'mandi' },
            { icon: '🌦️', title: isHindi ? 'स्मार्ट वेदर व सिंचाई' : 'Weather & Irrigation', tab: 'weather' },
            { icon: '🏛️', title: isHindi ? 'सरकारी योजनाएं व सब्सिडी' : 'Govt Schemes & Subsidies', tab: 'schemes' }
          ].map((f, idx) => (
            <div
              key={idx}
              onClick={() => onOpenDirectTab && onOpenDirectTab('app', f.tab)}
              style={{
                display: 'flex',
                alignItems: 'center',
                gap: '10px',
                padding: '12px 14px',
                backgroundColor: 'rgba(255, 255, 255, 0.04)',
                border: '1px solid rgba(255, 255, 255, 0.08)',
                borderRadius: '12px',
                cursor: 'pointer',
                transition: 'all 0.2s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.12)';
                e.currentTarget.style.borderColor = '#22c55e';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.04)';
                e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.08)';
              }}
            >
              <span style={{ fontSize: '1.4rem' }}>{f.icon}</span>
              <span style={{ fontSize: '0.88rem', fontWeight: 600, color: '#e2e8f0' }}>{f.title}</span>
            </div>
          ))}
        </div>

        {/* Big Launch Button */}
        <button
          onClick={onStartKrishiJal}
          style={{
            width: '100%',
            background: 'linear-gradient(135deg, #15803d 0%, #22c55e 100%)',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            padding: '18px 24px',
            fontSize: '1.2rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(34, 197, 94, 0.4)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(34, 197, 94, 0.6)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(34, 197, 94, 0.4)';
          }}
        >
          <span>{isHindi ? 'खेत डैशबोर्ड में प्रवेश करें' : 'ENTER KRISHI JAL DASHBOARD'}</span>
          <span style={{ fontSize: '1.3rem' }}>→</span>
        </button>
      </div>

      {/* Direct Module Shortcuts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', maxWidth: '720px' }}>
        {[
          { label: '🤖 AI Voice Advisor', tab: 'voice-ai' },
          { label: '🚜 Equipment Rentals', tab: 'rentals' },
          { label: '🧪 Soil Diagnostic Lab', tab: 'soillab' },
          { label: '🌾 Mandi Rates', tab: 'mandi' },
          { label: '📅 Crop Irrigation Planner', tab: 'planner' },
          { label: '🏛️ Govt Schemes', tab: 'schemes' }
        ].map((item, idx) => (
          <button
            key={idx}
            onClick={() => onOpenDirectTab && onOpenDirectTab('app', item.tab)}
            style={{
              backgroundColor: 'rgba(255, 255, 255, 0.06)',
              border: '1px solid rgba(255, 255, 255, 0.15)',
              color: '#e2e8f0',
              padding: '8px 16px',
              borderRadius: '20px',
              fontSize: '0.82rem',
              fontWeight: 600,
              cursor: 'pointer',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(34, 197, 94, 0.2)';
              e.currentTarget.style.borderColor = '#22c55e';
              e.currentTarget.style.color = '#4ade80';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = 'rgba(255, 255, 255, 0.06)';
              e.currentTarget.style.borderColor = 'rgba(255, 255, 255, 0.15)';
              e.currentTarget.style.color = '#e2e8f0';
            }}
          >
            {item.label}
          </button>
        ))}
      </div>
    </div>
  );
}

export default LandingPage;
