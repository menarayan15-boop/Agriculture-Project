import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getText } from '../data/constants';

export function LandingPage({ onStartKrishiJal, onOpenDirectTab }) {
  const { lang, setLang } = useApp();
  const [hoveredCard, setHoveredCard] = useState(null);

  const isHindi = lang === 'hi';

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'linear-gradient(180deg, #F8FAF9 0%, #F0FDF4 100%)',
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
            style={{ width: '40px', height: '40px', filter: 'drop-shadow(0 2px 6px rgba(21, 128, 61, 0.25))' }} 
          />
          <span style={{ fontSize: '1.25rem', fontWeight: 900, color: '#15803D', letterSpacing: '-0.02em' }}>
            KRISHI JAL
          </span>
        </div>

        {/* Language selector */}
        <div
          style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#FFFFFF',
            border: '1.5px solid #E5E7EB',
            borderRadius: '10px',
            padding: '6px 12px',
            boxShadow: '0 2px 8px rgba(0, 0, 0, 0.04)'
          }}
        >
          <span style={{ fontSize: '1rem' }}>🌐</span>
          <select
            value={lang}
            onChange={(e) => setLang(e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              color: '#17211B',
              fontSize: '0.85rem',
              fontWeight: 700,
              cursor: 'pointer',
              outline: 'none',
              fontFamily: 'inherit'
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
      </div>

      {/* ── HERO BANNER ── */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '820px',
          marginTop: '60px',
          marginBottom: '36px'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            backgroundColor: '#DCFCE7',
            border: '1.5px solid #86EFAC',
            color: '#166534',
            fontSize: '0.85rem',
            fontWeight: 800,
            padding: '6px 16px',
            borderRadius: '20px',
            marginBottom: '18px',
            boxShadow: '0 2px 6px rgba(21, 128, 61, 0.08)'
          }}
        >
          <span>🌱</span>
          <span>{isHindi ? 'स्मार्ट एआई कृषि सलाहकार व किसान मंच' : 'SMART AI PRECISION AGRICULTURE PLATFORM'}</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.2rem, 4.5vw, 3.5rem)',
            fontWeight: 900,
            lineHeight: '1.15',
            letterSpacing: '-0.03em',
            margin: '0 0 16px 0',
            color: '#17211B'
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
            color: '#4B5563',
            maxWidth: '680px',
            lineHeight: '1.6',
            margin: '0 auto'
          }}
        >
          {isHindi 
            ? 'जेमिनी एआई फसल सलाहकार, डिजिटल सॉइल लैब, ट्रैक्टर व कृषि मशीनरी रेंटल, लाइव मंडी भाव व मौसम आधारित सिंचाई।'
            : 'Real-time AI crop diagnostics, digital soil laboratory, farm machinery rental marketplace, live mandi commodity prices & custom precision irrigation roadmaps.'}
        </p>
      </div>

      {/* ── MAIN ACTION CARD ── */}
      <div
        style={{
          width: '100%',
          maxWidth: '760px',
          backgroundColor: '#FFFFFF',
          border: '1.5px solid #E5E7EB',
          borderRadius: '20px',
          padding: '32px',
          boxShadow: '0 20px 40px -15px rgba(21, 128, 61, 0.1), 0 0 1px rgba(0,0,0,0.1)',
          marginBottom: '36px'
        }}
      >
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(210px, 1fr))', gap: '14px', marginBottom: '28px' }}>
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
                gap: '12px',
                padding: '14px 16px',
                backgroundColor: '#F8FAF9',
                border: '1px solid #E5E7EB',
                borderRadius: '14px',
                cursor: 'pointer',
                transition: 'all 0.2s cubic-bezier(0.4, 0, 0.2, 1)'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.backgroundColor = '#F0FDF4';
                e.currentTarget.style.borderColor = '#86EFAC';
                e.currentTarget.style.transform = 'translateY(-2px)';
                e.currentTarget.style.boxShadow = '0 6px 16px rgba(21, 128, 61, 0.08)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.backgroundColor = '#F8FAF9';
                e.currentTarget.style.borderColor = '#E5E7EB';
                e.currentTarget.style.transform = 'translateY(0)';
                e.currentTarget.style.boxShadow = 'none';
              }}
            >
              <span style={{ fontSize: '1.5rem' }}>{f.icon}</span>
              <span style={{ fontSize: '0.9rem', fontWeight: 700, color: '#17211B' }}>{f.title}</span>
            </div>
          ))}
        </div>

        {/* Big Launch Button */}
        <button
          onClick={onStartKrishiJal}
          style={{
            width: '100%',
            background: '#15803D',
            color: '#ffffff',
            border: 'none',
            borderRadius: '14px',
            padding: '18px 24px',
            fontSize: '1.15rem',
            fontWeight: 800,
            cursor: 'pointer',
            boxShadow: '0 8px 20px rgba(21, 128, 61, 0.3)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '12px',
            transition: 'all 0.2s ease'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.background = '#166534';
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.boxShadow = '0 12px 26px rgba(21, 128, 61, 0.4)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.background = '#15803D';
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px rgba(21, 128, 61, 0.3)';
          }}
        >
          <span>{isHindi ? 'खेत डैशबोर्ड में प्रवेश करें' : 'ENTER KRISHI JAL DASHBOARD'}</span>
          <span style={{ fontSize: '1.3rem' }}>→</span>
        </button>
      </div>

      {/* Direct Module Shortcuts */}
      <div style={{ display: 'flex', flexWrap: 'wrap', justifyContent: 'center', gap: '10px', maxWidth: '760px' }}>
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
              backgroundColor: '#FFFFFF',
              border: '1px solid #E5E7EB',
              color: '#374151',
              padding: '8px 18px',
              borderRadius: '20px',
              fontSize: '0.84rem',
              fontWeight: 600,
              cursor: 'pointer',
              boxShadow: '0 2px 6px rgba(0,0,0,0.03)',
              transition: 'all 0.15s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.backgroundColor = '#F0FDF4';
              e.currentTarget.style.borderColor = '#86EFAC';
              e.currentTarget.style.color = '#15803D';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.backgroundColor = '#FFFFFF';
              e.currentTarget.style.borderColor = '#E5E7EB';
              e.currentTarget.style.color = '#374151';
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
