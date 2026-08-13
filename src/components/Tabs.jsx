import React from 'react';
import { useApp } from '../context/AppContext';
import { getText } from '../data/constants';

export function Tabs() {
  const { activeTab, setActiveTab, lang } = useApp();

  const tabs = [
    { id: 'dashboard',   icon: 'fa-gauge-high',        label: getText('tab-dashboard', lang) },
    { id: 'voice-ai',    icon: 'fa-microphone-lines',   label: getText('tab-voice-ai', lang) },
    { id: 'advisor',     icon: 'fa-robot',              label: getText('tab-advisor', lang) },
    { id: 'soillab',     icon: 'fa-flask-vial',         label: getText('tab-soillab', lang) },
    { id: 'planner',     icon: 'fa-calendar-days',      label: getText('tab-planner', lang) },
    { id: 'weather',     icon: 'fa-cloud-sun-rain',     label: getText('tab-weather', lang) },
    { id: 'rentals',     icon: 'fa-tractor',            label: getText('tab-rentals', lang) },
    { id: 'marketplace', icon: 'fa-store',              label: getText('tab-marketplace', lang) },
    { id: 'calculator',  icon: 'fa-calculator',         label: getText('tab-calculator', lang) },
    { id: 'schemes',     icon: 'fa-building-columns',   label: getText('tab-schemes', lang) },
    { id: 'education',   icon: 'fa-book-open-reader',   label: getText('tab-education', lang) },
  ];

  return (
    <nav
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '10px',
        padding: '12px 14px',
        background: 'rgba(6, 18, 10, 0.92)',
        borderRadius: '16px',
        border: '1px solid rgba(255,255,255,0.1)',
        boxShadow: '0 4px 18px rgba(0,0,0,0.5)',
      }}
    >
      {tabs.map((tab) => {
        const isActive = activeTab === tab.id;
        return (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            title={tab.label}
            style={{
              display: 'flex',
              alignItems: 'center',
              gap: '10px',
              flexShrink: 0,
              whiteSpace: 'nowrap',
              background: isActive
                ? 'linear-gradient(135deg, #15803d 0%, #166534 100%)'
                : 'transparent',
              border: isActive
                ? '1.5px solid rgba(74, 222, 128, 0.6)'
                : '1.5px solid transparent',
              borderRadius: '12px',
              color: isActive ? '#ffffff' : '#94a3b8',
              padding: '12px 20px',
              fontSize: '1.05rem',
              fontWeight: isActive ? '700' : '500',
              fontFamily: "'Outfit', sans-serif",
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              boxShadow: isActive ? '0 0 12px rgba(74, 222, 128, 0.3)' : 'none',
              outline: 'none',
              minHeight: '48px',
            }}
            onMouseEnter={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'rgba(255,255,255,0.07)';
                e.currentTarget.style.color = '#e2e8f0';
              }
            }}
            onMouseLeave={(e) => {
              if (!isActive) {
                e.currentTarget.style.background = 'transparent';
                e.currentTarget.style.color = '#94a3b8';
              }
            }}
          >
            <i
              className={`fa-solid ${tab.icon}`}
              style={{
                fontSize: '1.15rem',
                color: isActive ? '#86efac' : '#64748b',
                flexShrink: 0,
              }}
            />
            <span>{tab.label}</span>
          </button>
        );
      })}
    </nav>
  );
}
