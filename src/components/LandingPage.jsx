import React from 'react';
import { useApp } from '../context/AppContext';
import { getText } from '../data/constants';

export function LandingPage({ onStart }) {
  const { lang, setLang } = useApp();

  return (
    <div
      style={{
        minHeight: '100vh',
        width: '100vw',
        background: 'url(/landing-bg.png) center/cover no-repeat',
        position: 'relative',
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
        fontFamily: "'Outfit', sans-serif",
        color: '#ffffff',
        overflowX: 'hidden'
      }}
    >
      {/* Dark overlay for better text readability */}
      <div 
        style={{
          position: 'absolute',
          top: 0,
          left: 0,
          right: 0,
          bottom: 0,
          background: 'linear-gradient(to bottom, rgba(4, 15, 8, 0.4) 0%, rgba(4, 15, 8, 0.85) 100%)',
          zIndex: 1
        }}
      />

      {/* Language Selector in top right */}
      <div style={{
        position: 'absolute',
        top: '20px',
        right: '30px',
        zIndex: 10,
        display: 'flex',
        alignItems: 'center',
        gap: '12px'
      }}>
        <i className="fa-solid fa-language" style={{ fontSize: '1.2rem', color: '#86efac' }}></i>
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          style={{
            background: 'rgba(10, 24, 18, 0.7)',
            border: '1px solid rgba(255, 255, 255, 0.2)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: '8px',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            outline: 'none',
            backdropFilter: 'blur(10px)'
          }}
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
          <option value="or">ଓଡ଼ିଆ (Odia)</option>
        </select>
      </div>

      {/* Main Content Glassmorphism Container */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          background: 'rgba(10, 24, 18, 0.45)',
          backdropFilter: 'blur(16px)',
          WebkitBackdropFilter: 'blur(16px)',
          border: '1px solid rgba(255, 255, 255, 0.15)',
          borderRadius: '24px',
          padding: '50px 60px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '900px',
          width: '90%',
          boxShadow: '0 20px 50px rgba(0, 0, 0, 0.5)'
        }}
      >
        <div style={{
          display: 'flex',
          alignItems: 'center',
          gap: '15px',
          marginBottom: '20px'
        }}>
          <img src="/logo.svg" alt="Krishi Jal Logo" style={{ width: '60px', height: '60px' }} />
          <h1 style={{
            fontSize: '3.5rem',
            fontWeight: 800,
            margin: 0,
            background: 'linear-gradient(135deg, #4ade80 0%, #22c55e 100%)',
            WebkitBackgroundClip: 'text',
            WebkitTextFillColor: 'transparent',
            letterSpacing: '-1px'
          }}>
            {getText('logo-title', lang)}
          </h1>
        </div>

        <p style={{
          fontSize: '1.4rem',
          fontWeight: 400,
          color: '#e2e8f0',
          marginBottom: '40px',
          maxWidth: '600px',
          lineHeight: '1.5'
        }}>
          {getText('logo-subtitle', lang)}
        </p>

        <button
          onClick={onStart}
          style={{
            background: 'linear-gradient(135deg, #16a34a 0%, #15803d 100%)',
            color: '#ffffff',
            border: 'none',
            padding: '16px 40px',
            fontSize: '1.2rem',
            fontWeight: 700,
            borderRadius: '12px',
            cursor: 'pointer',
            boxShadow: '0 10px 25px rgba(22, 163, 74, 0.4)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '10px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-3px)';
            e.currentTarget.style.boxShadow = '0 15px 30px rgba(22, 163, 74, 0.5)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 10px 25px rgba(22, 163, 74, 0.4)';
          }}
        >
          <span>{lang === 'hi' ? 'शुरू करें' : 'Get Started'}</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>

        {/* Feature Highlights */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
          gap: '20px',
          marginTop: '50px',
          width: '100%'
        }}>
          {[
            { icon: 'fa-robot', title: getText('tab-advisor', lang) },
            { icon: 'fa-microphone-lines', title: getText('tab-voice-ai', lang) },
            { icon: 'fa-store', title: getText('tab-marketplace', lang) },
            { icon: 'fa-cloud-sun-rain', title: getText('tab-weather', lang) }
          ].map((feature, idx) => (
            <div key={idx} style={{
              background: 'rgba(255, 255, 255, 0.05)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
              borderRadius: '16px',
              padding: '20px',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '12px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.1)';
              e.currentTarget.style.transform = 'translateY(-5px)';
            }}
            onMouseLeave={(e) => {
              e.currentTarget.style.background = 'rgba(255, 255, 255, 0.05)';
              e.currentTarget.style.transform = 'translateY(0)';
            }}
            >
              <div style={{
                width: '50px',
                height: '50px',
                borderRadius: '50%',
                background: 'rgba(34, 197, 94, 0.2)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#4ade80',
                fontSize: '1.4rem'
              }}>
                <i className={`fa-solid ${feature.icon}`}></i>
              </div>
              <span style={{ fontSize: '0.95rem', fontWeight: 600, color: '#f8fafc' }}>
                {feature.title}
              </span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
