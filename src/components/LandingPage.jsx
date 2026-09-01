import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export function LandingPage({ onStartKrishiJal, onStartSoftwareFarmers, onOpenDirectTab }) {
  const { lang, setLang, theme, toggleTheme } = useApp();
  const [hoveredCard, setHoveredCard] = useState(null);

  const isDark = theme !== 'light';
  const isHindi = lang === 'hi';

  // Dynamic Neobrutalist Theme Styles
  const colors = isDark ? {
    bg: '#0d1117',
    text: '#f8fafc',
    subtext: '#94a3b8',
    cardBg: '#161b22',
    navBg: '#161b22',
    border: '#000000',
    cardBorder: '#30363d',
    shadow: '#000000',
    itemBg: '#1c2128',
    itemBorder: '#30363d',
    krishiHeader: '#064e3b',
    krishiBorder: '#22c55e',
    krishiText: '#4ade80',
    sfHeader: '#0c4a6e',
    sfBorder: '#38bdf8',
    sfText: '#38bdf8'
  } : {
    bg: '#fbf9f4',
    text: '#121212',
    subtext: '#4b5563',
    cardBg: '#ffffff',
    navBg: '#ffffff',
    border: '#121212',
    cardBorder: '#121212',
    shadow: '#121212',
    itemBg: '#f8fafc',
    itemBorder: '#121212',
    krishiHeader: '#dcfce7',
    krishiBorder: '#121212',
    krishiText: '#15803d',
    sfHeader: '#bae6fd',
    sfBorder: '#121212',
    sfText: '#0369a1'
  };

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        backgroundColor: colors.bg,
        color: colors.text,
        fontFamily: "'Inter', -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif",
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        position: 'relative',
        overflowX: 'hidden',
        padding: '24px 20px 60px 20px',
        boxSizing: 'border-box',
        transition: 'background-color 0.2s ease, color 0.2s ease'
      }}
    >
      {/* ── TOP NEOBRUTALIST NAVBAR ────────────────────────────────────────── */}
      <header
        style={{
          width: '100%',
          maxWidth: '1140px',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          marginBottom: '48px',
          padding: '12px 20px',
          backgroundColor: colors.navBg,
          border: `3px solid ${colors.border}`,
          borderRadius: '12px',
          boxShadow: `4px 4px 0px ${colors.shadow}`,
          transition: 'all 0.2s ease'
        }}
      >
        <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
          <div
            style={{
              width: '40px',
              height: '40px',
              borderRadius: '8px',
              backgroundColor: '#a3e635',
              border: `2px solid ${colors.border}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '20px',
              fontWeight: 800,
              boxShadow: `2px 2px 0px ${colors.shadow}`
            }}
          >
            🌾
          </div>
          <div>
            <div style={{ fontSize: '1.15rem', fontWeight: 900, letterSpacing: '-0.03em', color: colors.text }}>
              KRISHI<span style={{ backgroundColor: '#fef08a', color: '#121212', padding: '1px 6px', border: `1.5px solid ${colors.border}`, borderRadius: '4px', marginLeft: '4px' }}>HUB</span>
            </div>
            <div style={{ fontSize: '0.72rem', color: colors.subtext, fontWeight: 700, textTransform: 'uppercase', letterSpacing: '0.04em' }}>
              {isHindi ? 'एकीकृत कृषि सॉफ्टवेयर' : 'Unified Agriculture Suite'}
            </div>
          </div>
        </div>

        {/* Right Section: Theme Toggle, Status Pill & Language Selector */}
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          {/* Dark / Light Mode Switch */}
          <button
            onClick={toggleTheme}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: isDark ? '#fef08a' : '#1e293b',
              color: isDark ? '#121212' : '#f8fafc',
              border: `2px solid ${colors.border}`,
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: `2px 2px 0px ${colors.shadow}`,
              transition: 'all 0.1s ease',
              fontFamily: 'inherit'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(1px, 1px)';
              e.currentTarget.style.boxShadow = `1px 1px 0px ${colors.shadow}`;
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = `2px 2px 0px ${colors.shadow}`;
            }}
          >
            <span>{isDark ? '☀️ LIGHT' : '🌙 DARK'}</span>
          </button>

          {/* Status Badge */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '6px 12px',
              backgroundColor: isDark ? '#064e3b' : '#dcfce7',
              color: isDark ? '#4ade80' : '#15803d',
              border: `2px solid ${colors.border}`,
              borderRadius: '8px',
              fontSize: '0.75rem',
              fontWeight: 800,
              boxShadow: `2px 2px 0px ${colors.shadow}`
            }}
          >
            <span style={{ width: '8px', height: '8px', borderRadius: '50%', backgroundColor: '#22c55e' }}></span>
            <span>LIVE</span>
          </div>

          {/* Language Selector */}
          <div
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '6px',
              padding: '4px 8px',
              backgroundColor: colors.navBg,
              border: `2px solid ${colors.border}`,
              borderRadius: '8px',
              boxShadow: `2px 2px 0px ${colors.shadow}`
            }}
          >
            <span style={{ fontSize: '0.85rem' }}>🌐</span>
            <select
              value={lang}
              onChange={(e) => setLang(e.target.value)}
              style={{
                background: 'transparent',
                border: 'none',
                color: colors.text,
                fontSize: '0.85rem',
                fontWeight: 700,
                cursor: 'pointer',
                outline: 'none',
                fontFamily: 'inherit'
              }}
            >
              <option value="en" style={{ background: isDark ? '#161b22' : '#fff', color: isDark ? '#fff' : '#000' }}>English</option>
              <option value="hi" style={{ background: isDark ? '#161b22' : '#fff', color: isDark ? '#fff' : '#000' }}>हिन्दी (Hindi)</option>
              <option value="mr" style={{ background: isDark ? '#161b22' : '#fff', color: isDark ? '#fff' : '#000' }}>मराठी (Marathi)</option>
              <option value="bn" style={{ background: isDark ? '#161b22' : '#fff', color: isDark ? '#fff' : '#000' }}>বাংলা (Bengali)</option>
              <option value="ta" style={{ background: isDark ? '#161b22' : '#fff', color: isDark ? '#fff' : '#000' }}>தமிழ் (Tamil)</option>
              <option value="te" style={{ background: isDark ? '#161b22' : '#fff', color: isDark ? '#fff' : '#000' }}>తెలుగు (Telugu)</option>
            </select>
          </div>
        </div>
      </header>

      {/* ── HERO HEADER SECTION ────────────────────────────────────────────── */}
      <div
        style={{
          textAlign: 'center',
          maxWidth: '840px',
          marginBottom: '48px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center'
        }}
      >
        <div
          style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: '8px',
            padding: '6px 16px',
            backgroundColor: '#fef08a',
            border: `2.5px solid ${colors.border}`,
            borderRadius: '999px',
            color: '#121212',
            fontSize: '0.8rem',
            fontWeight: 800,
            textTransform: 'uppercase',
            letterSpacing: '0.04em',
            marginBottom: '20px',
            boxShadow: `3px 3px 0px ${colors.shadow}`
          }}
        >
          <span>⚡</span>
          <span>{isHindi ? '2 शक्तिशाली कृषि प्रणालियाँ' : '2 POWERFUL FARMING PORTALS'}</span>
        </div>

        <h1
          style={{
            fontSize: 'clamp(2.4rem, 5vw, 3.8rem)',
            fontWeight: 900,
            lineHeight: '1.08',
            letterSpacing: '-0.04em',
            margin: '0 0 16px 0',
            color: colors.text
          }}
        >
          {isHindi 
            ? 'अपनी कृषि सॉफ्टवेयर सेवा चुनें' 
            : 'CHOOSE YOUR FARMING PLATFORM.'}
        </h1>

        <p
          style={{
            fontSize: 'clamp(1rem, 1.8vw, 1.15rem)',
            fontWeight: 500,
            color: colors.subtext,
            maxWidth: '680px',
            lineHeight: '1.5',
            margin: 0
          }}
        >
          {isHindi 
            ? 'कृषि जल (AI सलाहकार, सॉइल लैब व मशीनरी रेंटल) अथवा सॉफ्टवेयर फार्मर्स (IoT जल नियंत्रण, ग्राम कियोस्क व SIH सिम्युलेटर) में प्रवेश करें।'
            : 'Select Krishi Jal for Gemini AI crop doctor, soil testing & equipment rentals, or Software Farmers for automated IoT water control & village kiosk.'}
        </p>
      </div>

      {/* ── DUAL NEOBRUTALIST CARDS ────────────────────────────────────────── */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 480px))',
          gap: '32px',
          width: '100%',
          maxWidth: '1060px',
          justifyContent: 'center',
          marginBottom: '54px'
        }}
      >
        {/* CARD 1: KRISHI JAL */}
        <div
          onMouseEnter={() => setHoveredCard('krishi')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            backgroundColor: isDark ? '#121a15' : '#ffffff',
            border: isDark ? '3px solid #22c55e' : `3.5px solid ${colors.border}`,
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: isDark 
              ? (hoveredCard === 'krishi' ? '8px 8px 0px #042f1b' : '5px 5px 0px #000000')
              : (hoveredCard === 'krishi' ? '8px 8px 0px #121212' : '5px 5px 0px #121212'),
            transform: hoveredCard === 'krishi' ? 'translate(-2px, -2px)' : 'translate(0, 0)',
            transition: 'all 0.15s ease'
          }}
        >
          {/* Card Header Banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.krishiHeader,
              border: `2px solid ${isDark ? '#22c55e' : colors.border}`,
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              boxShadow: `2px 2px 0px ${colors.shadow}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '26px' }}>🌾</span>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, color: isDark ? '#f8fafc' : '#121212', letterSpacing: '-0.02em' }}>
                  Krishi Jal
                </h2>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: colors.krishiText, textTransform: 'uppercase' }}>
                  AI Advisory & Rental
                </span>
              </div>
            </div>

            <span
              style={{
                backgroundColor: '#16a34a',
                color: '#ffffff',
                border: `1.5px solid ${colors.border}`,
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 900,
                letterSpacing: '0.04em'
              }}
            >
              AI SUITE
            </span>
          </div>

          <p style={{ fontSize: '0.92rem', color: colors.subtext, lineHeight: '1.5', margin: '0 0 20px 0', fontWeight: 500 }}>
            {isHindi 
              ? 'एआई वॉयस फसल डॉक्टर, सॉइल टेस्टिंग लैब, ट्रैक्टर व उपकरण किराये की बुकिंग एवं लाइव मंडी भाव।'
              : 'Gemini AI voice advisor, soil diagnostic lab, machinery rental booking & live mandi market trends.'}
          </p>

          {/* Feature List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
            {[
              { 
                icon: '🤖', 
                title: isHindi ? 'जेमिनी एआई वॉइस फसल सलाहकार' : 'Gemini AI Voice Crop Advisor', 
                tag: isHindi ? 'वॉइस एआई' : 'Voice AI' 
              },
              { 
                icon: '🧪', 
                title: isHindi ? 'सॉइल डायग्नोस्टिक लैब व रिपोर्ट' : 'Soil Diagnostic Lab & Reports', 
                tag: isHindi ? 'सॉइल लैब' : 'Soil Lab' 
              },
              { 
                icon: '🚜', 
                title: isHindi ? 'कृषि उपकरण रेंटल मार्केटप्लेस' : 'Farm Equipment Rental Marketplace', 
                tag: isHindi ? 'रेंटल' : 'Rentals' 
              },
              { 
                icon: '📈', 
                title: isHindi ? 'लाइव मंडी कमोडिटी भाव' : 'Live Mandi Commodity Prices', 
                tag: isHindi ? 'मंडी' : 'Mandi' 
              },
              { 
                icon: '🏛️', 
                title: isHindi ? 'सरकारी योजनाएं व सब्सिडी' : 'Government Schemes & Subsidies', 
                tag: isHindi ? 'योजनाएं' : 'Schemes' 
              }
            ].map((f, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: colors.itemBg,
                  border: `1.5px solid ${colors.itemBorder}`,
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 700, color: colors.text }}>
                  <span>{f.icon}</span>
                  <span>{f.title}</span>
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    backgroundColor: isDark ? '#064e3b' : '#dcfce7',
                    color: isDark ? '#4ade80' : '#15803d',
                    border: `1px solid ${isDark ? '#22c55e' : '#121212'}`,
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}
                >
                  {f.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={onStartKrishiJal}
            style={{
              width: '100%',
              backgroundColor: '#22c55e',
              color: '#052e16',
              border: `2.5px solid ${colors.border}`,
              borderRadius: '10px',
              padding: '14px 20px',
              fontSize: '1.05rem',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: `4px 4px 0px ${colors.shadow}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: 'auto',
              fontFamily: 'inherit',
              transition: 'all 0.1s ease'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = `2px 2px 0px ${colors.shadow}`;
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = `4px 4px 0px ${colors.shadow}`;
            }}
          >
            <span>{isHindi ? 'कृषि जल पोर्टल खोलें' : 'LAUNCH KRISHI JAL'}</span>
            <span style={{ fontSize: '1.2rem' }}>→</span>
          </button>
        </div>

        {/* CARD 2: SOFTWARE FARMERS */}
        <div
          onMouseEnter={() => setHoveredCard('software-farmers')}
          onMouseLeave={() => setHoveredCard(null)}
          style={{
            backgroundColor: isDark ? '#0e1724' : '#ffffff',
            border: isDark ? '3px solid #38bdf8' : `3.5px solid ${colors.border}`,
            borderRadius: '16px',
            padding: '28px',
            display: 'flex',
            flexDirection: 'column',
            position: 'relative',
            boxShadow: isDark 
              ? (hoveredCard === 'software-farmers' ? '8px 8px 0px #07273d' : '5px 5px 0px #000000')
              : (hoveredCard === 'software-farmers' ? '8px 8px 0px #121212' : '5px 5px 0px #121212'),
            transform: hoveredCard === 'software-farmers' ? 'translate(-2px, -2px)' : 'translate(0, 0)',
            transition: 'all 0.15s ease'
          }}
        >
          {/* Card Header Banner */}
          <div
            style={{
              display: 'flex',
              justifyContent: 'space-between',
              alignItems: 'center',
              backgroundColor: colors.sfHeader,
              border: `2px solid ${isDark ? '#38bdf8' : colors.border}`,
              borderRadius: '10px',
              padding: '12px 16px',
              marginBottom: '20px',
              boxShadow: `2px 2px 0px ${colors.shadow}`
            }}
          >
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
              <span style={{ fontSize: '26px' }}>💧</span>
              <div>
                <h2 style={{ fontSize: '1.35rem', fontWeight: 900, margin: 0, color: isDark ? '#f8fafc' : '#121212', letterSpacing: '-0.02em' }}>
                  Software Farmers
                </h2>
                <span style={{ fontSize: '0.72rem', fontWeight: 800, color: colors.sfText, textTransform: 'uppercase' }}>
                  IoT & SIH SmartFarm
                </span>
              </div>
            </div>

            <span
              style={{
                backgroundColor: '#0284c7',
                color: '#ffffff',
                border: `1.5px solid ${colors.border}`,
                padding: '3px 8px',
                borderRadius: '6px',
                fontSize: '0.7rem',
                fontWeight: 900,
                letterSpacing: '0.04em'
              }}
            >
              IOT AUTOMATION
            </span>
          </div>

          <p style={{ fontSize: '0.92rem', color: colors.subtext, lineHeight: '1.5', margin: '0 0 20px 0', fontWeight: 500 }}>
            {isHindi 
              ? 'स्मार्ट IoT पंप नियंत्रण, 2D डिजिटल ट्विन, बहुभाषी ग्राम कियोस्क व ऑफलाइन फोन सिम्युलेटर।'
              : 'Automated IoT pump & valve controls, 2D farm digital twin, village kiosk mode & SMS/IVR/USSD simulators.'}
          </p>

          {/* Feature List */}
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '28px' }}>
            {[
              { 
                icon: '🚰', 
                title: isHindi ? 'ऑटोमेटेड IoT पंप व वॉटर कंट्रोल' : 'Automated IoT Pump & Water Control', 
                tag: isHindi ? 'IoT कंट्रोल' : 'IoT Control' 
              },
              { 
                icon: '🌱', 
                title: isHindi ? '2D फील्ड व्यू व सॉइल डिजिटल ट्विन' : '2D Field View & Soil Digital Twin', 
                tag: isHindi ? 'डिजिटल ट्विन' : 'Digital Twin' 
              },
              { 
                icon: '🏛️', 
                title: isHindi ? 'बहुभाषी टच ग्राम कियोस्क' : 'Multi-Lingual Touch Village Kiosk', 
                tag: isHindi ? 'कियोस्क मोड' : 'Kiosk Mode' 
              },
              { 
                icon: '📱', 
                title: isHindi ? 'ऑफलाइन SMS, वॉयस IVR व USSD इंजन' : 'Offline SMS, Voice IVR & USSD Engine', 
                tag: isHindi ? 'ऑफलाइन सिम' : 'Offline Sim' 
              },
              { 
                icon: '📊', 
                title: isHindi ? 'एडमिन ऑफिसर कंट्रोल व SIH मेट्रिक्स' : 'Admin Officer Control & SIH Metrics', 
                tag: isHindi ? 'एडमिन कंट्रोल' : 'Admin Control' 
              }
            ].map((f, idx) => (
              <div
                key={idx}
                style={{
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'space-between',
                  padding: '8px 12px',
                  backgroundColor: colors.itemBg,
                  border: `1.5px solid ${colors.itemBorder}`,
                  borderRadius: '8px'
                }}
              >
                <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.86rem', fontWeight: 700, color: colors.text }}>
                  <span>{f.icon}</span>
                  <span>{f.title}</span>
                </div>
                <span
                  style={{
                    fontSize: '0.68rem',
                    fontWeight: 800,
                    backgroundColor: isDark ? '#0c4a6e' : '#bae6fd',
                    color: isDark ? '#38bdf8' : '#0369a1',
                    border: `1px solid ${isDark ? '#38bdf8' : '#121212'}`,
                    padding: '2px 6px',
                    borderRadius: '4px'
                  }}
                >
                  {f.tag}
                </span>
              </div>
            ))}
          </div>

          {/* Action Button */}
          <button
            onClick={onStartSoftwareFarmers}
            style={{
              width: '100%',
              backgroundColor: '#38bdf8',
              color: '#082f49',
              border: `2.5px solid ${colors.border}`,
              borderRadius: '10px',
              padding: '14px 20px',
              fontSize: '1.05rem',
              fontWeight: 900,
              cursor: 'pointer',
              boxShadow: `4px 4px 0px ${colors.shadow}`,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '8px',
              marginTop: 'auto',
              fontFamily: 'inherit',
              transition: 'all 0.1s ease'
            }}
            onMouseDown={(e) => {
              e.currentTarget.style.transform = 'translate(2px, 2px)';
              e.currentTarget.style.boxShadow = `2px 2px 0px ${colors.shadow}`;
            }}
            onMouseUp={(e) => {
              e.currentTarget.style.transform = 'translate(0, 0)';
              e.currentTarget.style.boxShadow = `4px 4px 0px ${colors.shadow}`;
            }}
          >
            <span>{isHindi ? 'सॉफ्टवेयर फार्मर्स खोलें' : 'LAUNCH SOFTWARE FARMERS'}</span>
            <span style={{ fontSize: '1.2rem' }}>→</span>
          </button>
        </div>
      </div>

      {/* ── 1-CLICK DIRECT MODULE SHORTCUTS ────────────────────────────────── */}
      <div
        style={{
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          gap: '14px',
          maxWidth: '920px',
          width: '100%'
        }}
      >
        <div
          style={{
            fontSize: '0.8rem',
            color: '#121212',
            fontWeight: 900,
            textTransform: 'uppercase',
            letterSpacing: '0.06em',
            backgroundColor: '#fed7aa',
            border: `2px solid ${colors.border}`,
            padding: '3px 12px',
            borderRadius: '6px',
            boxShadow: `2px 2px 0px ${colors.shadow}`
          }}
        >
          {isHindi ? '⚡ 1-क्लिक सीधा मॉड्यूल खोलें' : '⚡ 1-CLICK DIRECT MODULE SHORTCUTS'}
        </div>

        <div
          style={{
            display: 'flex',
            flexWrap: 'wrap',
            justifyContent: 'center',
            gap: '10px'
          }}
        >
          {[
            { label: '🤖 AI Voice Doctor', bg: '#fef08a', action: () => onOpenDirectTab('krishi-jal', 'voice-ai') },
            { label: '🚜 Equipment Rentals', bg: '#dcfce7', action: () => onOpenDirectTab('krishi-jal', 'rentals') },
            { label: '🧪 Soil Diagnostic Lab', bg: '#fbcfe8', action: () => onOpenDirectTab('krishi-jal', 'soillab') },
            { label: '💧 IoT Water Pumps', bg: '#bae6fd', action: () => onOpenDirectTab('software-farmers', 'iot') },
            { label: '🌱 Farm Digital Twin', bg: '#d9f99d', action: () => onOpenDirectTab('software-farmers', 'digitaltwin') },
            { label: '📊 Admin Control', bg: '#fed7aa', action: () => onOpenDirectTab('software-farmers', 'admin') },
            { label: '🏛️ Village Kiosk', bg: '#e9d5ff', action: () => onOpenDirectTab('software-farmers', 'kiosk') },
            { label: '🌍 SIH Impact Metrics', bg: '#fecdd3', action: () => onOpenDirectTab('software-farmers', 'impact') },
          ].map((item, idx) => (
            <button
              key={idx}
              onClick={item.action}
              style={{
                backgroundColor: item.bg,
                border: `2px solid ${colors.border}`,
                color: '#121212',
                padding: '8px 14px',
                borderRadius: '8px',
                fontSize: '0.85rem',
                fontWeight: 800,
                cursor: 'pointer',
                boxShadow: `3px 3px 0px ${colors.shadow}`,
                fontFamily: 'inherit',
                transition: 'all 0.1s ease'
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.transform = 'translate(-1px, -1px)';
                e.currentTarget.style.boxShadow = `4px 4px 0px ${colors.shadow}`;
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.transform = 'translate(0, 0)';
                e.currentTarget.style.boxShadow = `3px 3px 0px ${colors.shadow}`;
              }}
              onMouseDown={(e) => {
                e.currentTarget.style.transform = 'translate(2px, 2px)';
                e.currentTarget.style.boxShadow = `1px 1px 0px ${colors.shadow}`;
              }}
            >
              {item.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}

export default LandingPage;
