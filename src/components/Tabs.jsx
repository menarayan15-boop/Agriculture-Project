import React from 'react';
import { useApp } from '../context/AppContext';
import { getText } from '../data/constants';

const TAB_GROUPS = {
  dashboard: 'Plan', planner: 'Plan', calculator: 'Plan',
  weather: 'Monitor', soillab: 'Monitor',
  advisor: 'Grow & Protect', 'voice-ai': 'Grow & Protect', education: 'Grow & Protect',
  rentals: 'Market & Support', marketplace: 'Market & Support', schemes: 'Market & Support', mandi: 'Market & Support'
};

export function Tabs() {
  const { activeTab, setActiveTab, lang, farmerInsights } = useApp();

  const allTabs = [
    { id: 'dashboard',   icon: 'fa-gauge-high',        label: getText('tab-dashboard', lang) },
    { id: 'planner',     icon: 'fa-calendar-days',      label: getText('tab-planner', lang) },
    { id: 'calculator',  icon: 'fa-calculator',         label: getText('tab-calculator', lang) },
    { id: 'weather',     icon: 'fa-cloud-sun-rain',     label: getText('tab-weather', lang) },
    { id: 'soillab',     icon: 'fa-flask-vial',         label: getText('tab-soillab', lang) },
    { id: 'advisor',     icon: 'fa-robot',              label: getText('tab-advisor', lang) },
    { id: 'voice-ai',    icon: 'fa-microphone-lines',   label: getText('tab-voice-ai', lang) },
    { id: 'education',   icon: 'fa-book-open-reader',   label: getText('tab-education', lang) },
    { id: 'rentals',     icon: 'fa-tractor',            label: getText('tab-rentals', lang) },
    { id: 'marketplace', icon: 'fa-store',              label: getText('tab-marketplace', lang) },
    { id: 'schemes',     icon: 'fa-building-columns',   label: getText('tab-schemes', lang) },
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
      groups.push(groupName); // This preserves the priority order of the groups!
    }
    groupMap.get(groupName).push(tab);
  });

  return (
    <nav
      style={{
        display: 'flex',
        flexDirection: 'row',
        flexWrap: 'wrap',
        justifyContent: 'center',
        gap: '24px', // Space between groups
        padding: '16px 20px',
        background: 'var(--card-bg)',
        borderRadius: 'var(--border-radius-lg)',
        border: '1px solid var(--border-color)',
        boxShadow: 'var(--shadow-md)',
      }}
    >
      {groups.map((groupName, groupIndex) => (
        <React.Fragment key={groupName}>
          <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
            {groupMap.get(groupName).map((tab) => {
              const isActive = activeTab === tab.id;
              const isRecommended = recommendedSet.has(tab.id);
              return (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id)}
                  title={tab.label}
                  style={{
                    position: 'relative',
                    display: 'flex',
                    alignItems: 'center',
                    gap: '10px',
                    flexShrink: 0,
                    whiteSpace: 'nowrap',
                    background: isActive ? 'var(--primary)' : 'transparent',
                    border: isActive ? '1px solid var(--primary-light)' : '1px solid transparent',
                    borderRadius: 'var(--border-radius-md)',
                    color: isActive ? '#ffffff' : 'var(--text-secondary)',
                    padding: '12px 16px',
                    fontSize: '1rem',
                    fontWeight: isActive ? '600' : '500',
                    fontFamily: "'Inter', sans-serif",
                    cursor: 'pointer',
                    transition: 'all 0.2s ease',
                    boxShadow: isActive ? 'var(--shadow-sm)' : 'none',
                    outline: 'none',
                    minHeight: '48px',
                  }}
                  onMouseEnter={(e) => {
                    if (!isActive) {
                      e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                      e.currentTarget.style.color = 'var(--text-primary)';
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
                      top: '-6px',
                      right: '-6px',
                      background: 'var(--highlight)',
                      color: '#111827',
                      fontSize: '0.65rem',
                      fontWeight: 700,
                      padding: '2px 8px',
                      borderRadius: '12px',
                      boxShadow: '0 2px 4px rgba(0,0,0,0.3)',
                      zIndex: 1,
                      border: '1px solid rgba(255,255,255,0.2)'
                    }}>
                      <i className="fa-solid fa-star" style={{ marginRight: '4px', fontSize: '0.55rem' }}></i>
                      {lang === 'hi' ? 'सुझावित' : 'Recommended'}
                    </span>
                  )}
                  <i
                    className={`fa-solid ${tab.icon}`}
                    style={{
                      fontSize: '1.1rem',
                      color: isActive ? '#fff' : 'var(--text-muted)',
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
            <div style={{ width: '1px', background: 'var(--border-color)', margin: '4px 0' }} />
          )}
        </React.Fragment>
      ))}
    </nav>
  );
}
