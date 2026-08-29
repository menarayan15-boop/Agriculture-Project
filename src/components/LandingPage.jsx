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
        color: 'var(--text-primary)',
        overflowX: 'hidden'
      }}
    >
      {/* Dark earthy overlay for text readability */}
      <div 
        style={{
          position: 'absolute',
          top: 0, left: 0, right: 0, bottom: 0,
          background: 'linear-gradient(to bottom, rgba(17, 24, 39, 0.6) 0%, rgba(26, 46, 34, 0.9) 100%)',
          zIndex: 1
        }}
      />

      {/* Language Selector */}
      <div style={{
        position: 'absolute',
        top: '24px', right: '32px',
        zIndex: 10,
        display: 'flex', alignItems: 'center', gap: '12px'
      }}>
        <i className="fa-solid fa-language" style={{ fontSize: '1.2rem', color: 'var(--highlight)' }}></i>
        <select 
          value={lang} 
          onChange={(e) => setLang(e.target.value)}
          style={{
            background: 'rgba(255, 255, 255, 0.05)',
            border: '1px solid var(--border-color)',
            color: '#fff',
            padding: '8px 12px',
            borderRadius: 'var(--border-radius-sm)',
            fontSize: '0.9rem',
            fontWeight: '500',
            cursor: 'pointer',
            outline: 'none',
            backdropFilter: 'blur(10px)'
          }}
        >
          <option value="en" style={{background: 'var(--monsoon-dark)'}}>English</option>
          <option value="hi" style={{background: 'var(--monsoon-dark)'}}>हिन्दी (Hindi)</option>
          {/* Other languages omitted for brevity but standard */}
        </select>
      </div>

      {/* Main Hero Content */}
      <div
        style={{
          position: 'relative',
          zIndex: 5,
          padding: '40px 20px',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          textAlign: 'center',
          maxWidth: '800px',
          width: '90%',
          marginTop: '-40px' // Lift slightly
        }}
      >
        <img 
          src="/logo.svg" 
          alt="Krishi Jal Logo" 
          style={{ width: '84px', height: '84px', marginBottom: '24px', filter: 'drop-shadow(0 6px 16px rgba(16, 185, 129, 0.5))' }} 
        />
        
        <h1 style={{
          fontSize: 'clamp(2.5rem, 5vw, 4rem)',
          fontWeight: 700,
          margin: '0 0 24px 0',
          lineHeight: '1.1',
          color: '#ffffff',
          textShadow: '0 4px 12px rgba(0,0,0,0.5)'
        }}>
          {lang === 'hi' 
            ? 'जानें कब पानी देना है, आप किन योजनाओं के योग्य हैं, और आपकी फसल पर क्या हमला कर रहा है।' 
            : 'Know when to water, what schemes you qualify for, and what\'s attacking your crop.'}
        </h1>

        <p style={{
          fontSize: 'clamp(1.1rem, 2vw, 1.4rem)',
          fontWeight: 400,
          color: 'var(--text-secondary)',
          marginBottom: '48px',
          maxWidth: '600px',
          lineHeight: '1.5'
        }}>
          {lang === 'hi' 
            ? 'कृषि जल आपके खेत, मिट्टी और लक्ष्यों के अनुसार मौसम, बाजार और फसल की सलाह को जोड़ता है।' 
            : 'Krishi Jal combines weather, market, and crop advice tailored strictly to your field, soil, and goals.'}
        </p>

        <button
          onClick={onStart}
          style={{
            background: 'var(--primary)',
            color: '#ffffff',
            border: 'none',
            padding: '18px 48px',
            fontSize: '1.25rem',
            fontWeight: 600,
            borderRadius: 'var(--border-radius-lg)',
            cursor: 'pointer',
            boxShadow: 'var(--shadow-md)',
            transition: 'all 0.3s ease',
            display: 'flex',
            alignItems: 'center',
            gap: '12px'
          }}
          onMouseEnter={(e) => {
            e.currentTarget.style.transform = 'translateY(-2px)';
            e.currentTarget.style.background = 'var(--primary-light)';
            e.currentTarget.style.color = 'var(--primary-dark)';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.background = 'var(--primary)';
            e.currentTarget.style.color = '#ffffff';
          }}
        >
          <span>{lang === 'hi' ? 'मेरा खेत सेट करें' : 'Set up my farm'}</span>
          <i className="fa-solid fa-arrow-right"></i>
        </button>
      </div>

      {/* Quiet Bottom Feature Strip */}
      <div style={{
        position: 'absolute',
        bottom: '40px',
        left: '0',
        right: '0',
        zIndex: 5,
        display: 'flex',
        justifyContent: 'center',
        gap: '32px',
        flexWrap: 'wrap',
        padding: '0 20px',
        opacity: 0.8
      }}>
        {[
          { icon: 'fa-robot', title: lang === 'hi' ? 'एआई सलाहकार' : 'AI Advisor' },
          { icon: 'fa-microphone-lines', title: lang === 'hi' ? 'वॉयस एआई' : 'Voice AI' },
          { icon: 'fa-store', title: lang === 'hi' ? 'मंडी बाजार' : 'Marketplace' },
          { icon: 'fa-cloud-sun-rain', title: lang === 'hi' ? 'स्थानीय मौसम' : 'Local Weather' }
        ].map((feature, idx) => (
          <div key={idx} style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            color: 'var(--text-secondary)',
            fontSize: '0.95rem',
            fontWeight: 500
          }}>
            <i className={`fa-solid ${feature.icon}`} style={{ color: 'var(--highlight)' }}></i>
            <span>{feature.title}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
