import React from 'react';
import { useApp } from '../context/AppContext';
import { getText } from '../data/constants';
import { pageReader } from '../services/ai/pageNarrationService';
import { ttsEngine } from '../services/ai/ttsService';

export function MobileBottomNav({ onOpenDrawer, isDrawerOpen }) {
  const { activeTab, setActiveTab, lang, report } = useApp();

  const handleTabClick = (tabId) => {
    try {
      pageReader.stop(false);
      ttsEngine.stop();
    } catch (e) {}

    if (tabId === 'more') {
      onOpenDrawer(true);
    } else {
      setActiveTab(tabId);
      if (isDrawerOpen) onOpenDrawer(false);
    }
  };

  // Localized bottom nav labels
  const LABELS = {
    dashboard: { en: 'Home', hi: 'होम', te: 'హోమ్', ta: 'முகப்பு', kn: 'ಮುಖಪುಟ', pa: 'ਮੁੱਖ', mr: 'मुख्य', bn: 'হোম', gu: 'હોમ', or: 'ମୁଖ୍ୟ' },
    advisor: { en: 'Crop AI', hi: 'फसल', te: 'పంట', ta: 'பயிர்', kn: 'ಬೆಳೆ', pa: 'ਫ਼ਸਲ', mr: 'पीक', bn: 'ফসল', gu: 'પાક', or: 'ଫସଲ' },
    planner: { en: 'Irrigation', hi: 'सिंचाई', te: 'నీటిపారుదల', ta: 'பாசனம்', kn: 'ನೀರಾವರಿ', pa: 'ਸਿੰਚਾਈ', mr: 'सिंचन', bn: 'সেচ', gu: 'સિંચાઈ', or: 'ଜଳସେଚନ' },
    marketplace: { en: 'Market', hi: 'बाज़ार', te: 'మార్కెట్', ta: 'சந்தை', kn: 'ಮಾರುಕಟ್ಟೆ', pa: 'ਮੰਡੀ', mr: 'बाजार', bn: 'বাজার', gu: 'બજાર', or: 'ବଜାର' },
    more: { en: 'Menu', hi: 'मेनू', te: 'మెనూ', ta: 'மெனு', kn: 'ಮೆನು', pa: 'ਮੇਨੂ', mr: 'मेनू', bn: 'মেনু', gu: 'મેનૂ', or: 'ମେନୁ' }
  };

  const navItems = [
    {
      id: 'dashboard',
      icon: 'fa-solid fa-house-chimney-crack',
      altIcon: 'fa-solid fa-gauge-high',
      label: LABELS.dashboard[lang] || LABELS.dashboard.en,
      active: activeTab === 'dashboard' && !isDrawerOpen
    },
    {
      id: 'advisor',
      icon: 'fa-solid fa-leaf',
      label: LABELS.advisor[lang] || LABELS.advisor.en,
      active: activeTab === 'advisor' && !isDrawerOpen,
      badge: report?.riskLevel === 'HIGH' ? '!' : null
    },
    {
      id: 'planner',
      icon: 'fa-solid fa-droplet',
      label: LABELS.planner[lang] || LABELS.planner.en,
      active: activeTab === 'planner' && !isDrawerOpen
    },
    {
      id: 'marketplace',
      icon: 'fa-solid fa-store',
      label: LABELS.marketplace[lang] || LABELS.marketplace.en,
      active: (activeTab === 'marketplace' || activeTab === 'mandi' || activeTab === 'rentals') && !isDrawerOpen
    },
    {
      id: 'more',
      icon: 'fa-solid fa-grip',
      label: LABELS.more[lang] || LABELS.more.en,
      active: isDrawerOpen
    }
  ];

  return (
    <nav className="mobile-bottom-nav" aria-label="Mobile Navigation">
      <div className="mobile-nav-items">
        {navItems.map((item) => {
          return (
            <button
              key={item.id}
              type="button"
              className={`mobile-nav-btn ${item.active ? 'active' : ''}`}
              onClick={() => handleTabClick(item.id)}
              aria-label={item.label}
              aria-current={item.active ? 'page' : undefined}
            >
              <div className="mobile-nav-icon-wrapper">
                <i className={`${item.icon} mobile-nav-icon`}></i>
                {item.badge && <span className="mobile-nav-badge">{item.badge}</span>}
              </div>
              <span className="mobile-nav-label">{item.label}</span>
              {item.active && <span className="mobile-nav-active-pill" />}
            </button>
          );
        })}
      </div>
    </nav>
  );
}

export default MobileBottomNav;
