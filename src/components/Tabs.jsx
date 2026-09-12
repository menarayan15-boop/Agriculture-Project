import React from 'react';
import { useApp } from '../context/AppContext';
import { getText } from '../data/constants';
import { pageReader } from '../services/ai/pageNarrationService';
import { ttsEngine } from '../services/ai/ttsService';

const TAB_GROUPS = {
  dashboard: 'Plan', planner: 'Plan', calculator: 'Plan',
  weather: 'Monitor', soillab: 'Monitor',
  advisor: 'Grow & Protect', 'voice-ai': 'Grow & Protect', education: 'Grow & Protect',
  rentals: 'Market & Support', marketplace: 'Market & Support', schemes: 'Market & Support', mandi: 'Market & Support'
};

export function Tabs() {
  const { activeTab, setActiveTab, lang, farmerInsights } = useApp();

  const allTabs = [
    { id: 'dashboard', icon: 'fa-gauge-high', label: getText('tab-dashboard', lang) },
    { id: 'planner', icon: 'fa-calendar-days', label: getText('tab-planner', lang) },
    { id: 'calculator', icon: 'fa-calculator', label: getText('tab-calculator', lang) },
    { id: 'weather', icon: 'fa-cloud-sun-rain', label: getText('tab-weather', lang) },
    { id: 'soillab', icon: 'fa-flask-vial', label: getText('tab-soillab', lang) },
    { id: 'advisor', icon: 'fa-robot', label: getText('tab-advisor', lang) },
    { id: 'voice-ai', icon: 'fa-microphone-lines', label: getText('tab-voice-ai', lang) },
    { id: 'education', icon: 'fa-book-open-reader', label: getText('tab-education', lang) },
    { id: 'rentals', icon: 'fa-tractor', label: getText('tab-rentals', lang) },
    { id: 'marketplace', icon: 'fa-store', label: getText('tab-marketplace', lang) },
    { id: 'schemes', icon: 'fa-building-columns', label: getText('tab-schemes', lang) },
  ];

  let orderedTabs = allTabs;
  let recommendedSet = new Set();

  if (farmerInsights && farmerInsights.priorityTabs) {
    orderedTabs = farmerInsights.priorityTabs
      .map(id => allTabs.find(t => t.id === id))
      .filter(Boolean);

    const missing = allTabs.filter(t => !farmerInsights.priorityTabs.includes(t.id));
    orderedTabs = [...orderedTabs, ...missing];

    if (farmerInsights.recommendedTabs) {
      recommendedSet = farmerInsights.recommendedTabs;
    }
  }

  // Group the ordered tabs
  const groups = [];
  const groupMap = new Map();

  orderedTabs.forEach(tab => {
    const groupName = TAB_GROUPS[tab.id] || 'Other';
    if (!groupMap.has(groupName)) {
      groupMap.set(groupName, []);
      groups.push(groupName); // Preserves priority order
    }
    groupMap.get(groupName).push(tab);
  });

  return (
    <nav
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'nowrap',
        alignItems: 'center',
        gap: '12px',
        padding: '10px 14px',
        background: '#FFFFFF',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-xs)',
        overflowX: 'auto',
        scrollbarWidth: 'none',
        WebkitOverflowScrolling: 'touch'
      }}
    >
      {groups.map((groupName, groupIndex) => (
        <React.Fragment key={groupName}>
          <div style={{ display: 'flex', gap: '6px', alignItems: 'center', flexShrink: 0 }}>
            {groupMap.get(groupName).map((tab) => {
              const isActive = activeTab === tab.id;
              const isRecommended = recommendedSet.has(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => {
                    pageReader.stop(false);
                    ttsEngine.stop();
                    setActiveTab(tab.id);
                  }}
                  title={tab.label}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    background: isActive ? 'var(--primary)' : 'transparent',
                    border: isActive ? '1px solid var(--primary)' : '1px solid transparent',
                    borderRadius: 'var(--border-radius-md)',
                    color: isActive ? '#FFFFFF' : 'var(--text-secondary)',
                    padding: '9px 15px',
                    fontSize: '0.9rem',
                    fontWeight: isActive ? '700' : '500',
                    fontFamily: "'Inter', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? 'var(--shadow-green)' : 'none',
                    outline: 'none',
                    minHeight: '42px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'var(--very-light-green)';
                      e.currentTarget.style.color = 'var(--primary)';
                    }
                  }}
                  onMouseLeave={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = 'var(--text-secondary)';
                    }
                  }}
                >
                  {isRecommended && (
                    <span style={{
                      position: 'absolute',
                      top: '-5px',
                      right: '-5px',
                      background: 'var(--highlight)',
                      color: '#FFFFFF',
                      fontSize: '0.62rem',
                      fontWeight: 700,
                      padding: '2px 6px',
                      borderRadius: '10px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.15)',
                      zIndex: 1,
                    }}>
                      <i className="fa-solid fa-star" style={{ marginRight: '3px', fontSize: '0.55rem' }}></i>
                      {getText('badge-recommended', lang)}
                    </span>
                  )}
                  <i
                    className={`fa-solid ${tab.icon}`}
                    style={{
                      fontSize: '0.95rem',
                      color: isActive ? '#FFFFFF' : 'var(--text-muted)',
                      flexShrink: 0,
                    }}
                  />
                  <span>{tab.label}</span>
                </button>
              );
            })}
          </div>
          {/* Subtle Visual Separator between groups */}
          {groupIndex < groups.length - 1 && (
            <div style={{ width: '1px', height: '24px', background: 'var(--border-color)', flexShrink: 0, margin: '0 4px' }} />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}

export default Tabs;
