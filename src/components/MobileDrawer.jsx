import React, { useState } from 'react';
import { useApp } from '../context/AppContext';
import { getText, LOCATIONS, SOILS, CROPS, getCropDisplayName } from '../data/constants';
import { pageReader } from '../services/ai/pageNarrationService';
import { ttsEngine } from '../services/ai/ttsService';

export function MobileDrawer({ isOpen, onClose, onOpenAiModal }) {
  const {
    activeTab,
    setActiveTab,
    lang,
    setLang,
    location,
    setLocation,
    soil,
    setSoil,
    crop,
    setCrop,
    stage,
    setStage,
    area,
    setArea,
    sowingDate,
    setSowingDate,
    loading,
    handleGeneratePlan,
    setShowOnboarding
  } = useApp();

  const [activeDrawerSection, setActiveDrawerSection] = useState('menu'); // 'menu' | 'farm-params'

  if (!isOpen) return null;

  const handleSelectTab = (tabId) => {
    try {
      pageReader.stop(false);
      ttsEngine.stop();
    } catch (e) {}
    setActiveTab(tabId);
    onClose();
  };

  const navCategories = [
    {
      title: lang === 'hi' ? 'कृषि योजना एवं एआई' : 'Plan & Advisory',
      items: [
        { id: 'dashboard', icon: 'fa-gauge-high', label: getText('tab-dashboard', lang) || 'Dashboard', badge: 'Live' },
        { id: 'advisor', icon: 'fa-robot', label: getText('tab-advisor', lang) || 'Crop Health AI', color: '#15803D' },
        { id: 'planner', icon: 'fa-droplet', label: getText('tab-planner', lang) || 'Irrigation & IoT', color: '#0284C7' },
        { id: 'calculator', icon: 'fa-calculator', label: getText('tab-calculator', lang) || 'Farm Calculator' },
        { id: 'voice-ai', icon: 'fa-microphone-lines', label: getText('tab-voice-ai', lang) || 'Voice AI Assistant', color: '#D97706' }
      ]
    },
    {
      title: lang === 'hi' ? 'निगरानी एवं परीक्षण' : 'Monitoring & Lab',
      items: [
        { id: 'weather', icon: 'fa-cloud-sun-rain', label: getText('tab-weather', lang) || 'Live Weather', color: '#0284C7' },
        { id: 'soillab', icon: 'fa-flask-vial', label: getText('tab-soillab', lang) || 'Soil Testing Lab', color: '#7C3AED' },
        { id: 'education', icon: 'fa-book-open-reader', label: getText('tab-education', lang) || 'Farmer Education' }
      ]
    },
    {
      title: lang === 'hi' ? 'बाज़ार एवं समर्थन' : 'Market & Schemes',
      items: [
        { id: 'mandi', icon: 'fa-chart-line', label: getText('tab-mandi', lang) || 'Mandi Live Rates', color: '#059669' },
        { id: 'rentals', icon: 'fa-tractor', label: getText('tab-rentals', lang) || 'Machinery Rentals', color: '#D97706' },
        { id: 'marketplace', icon: 'fa-store', label: getText('tab-marketplace', lang) || 'Agri Marketplace', color: '#15803D' },
        { id: 'schemes', icon: 'fa-building-columns', label: getText('tab-schemes', lang) || 'Government Schemes', color: '#4F46E5' }
      ]
    }
  ];

  return (
    <div className="mobile-drawer-overlay" onClick={onClose} role="dialog" aria-modal="true">
      <div className="mobile-drawer-sheet" onClick={(e) => e.stopPropagation()}>
        
        {/* Drawer Header */}
        <div className="mobile-drawer-header">
          <div className="mobile-drawer-brand">
            <img src="/logo.svg" alt="Krishi Jal" style={{ width: '32px', height: '32px' }} />
            <div>
              <h3 className="mobile-drawer-title">{getText('logo-title', lang)}</h3>
              <span className="mobile-drawer-subtitle">{location?.nameEn || 'All-in-one Smart Farming'}</span>
            </div>
          </div>
          <button 
            type="button" 
            className="mobile-drawer-close-btn" 
            onClick={onClose} 
            aria-label="Close menu"
          >
            <i className="fa-solid fa-xmark"></i>
          </button>
        </div>

        {/* Section Switcher Pill */}
        <div className="mobile-drawer-tabs-switch">
          <button
            type="button"
            className={`drawer-switch-btn ${activeDrawerSection === 'menu' ? 'active' : ''}`}
            onClick={() => setActiveDrawerSection('menu')}
          >
            <i className="fa-solid fa-list-check"></i>
            <span>{lang === 'hi' ? 'सभी सुविधाएं' : 'All Features'}</span>
          </button>
          <button
            type="button"
            className={`drawer-switch-btn ${activeDrawerSection === 'farm-params' ? 'active' : ''}`}
            onClick={() => setActiveDrawerSection('farm-params')}
          >
            <i className="fa-solid fa-sliders"></i>
            <span>{lang === 'hi' ? 'खेत सेटिंग्स' : 'Farm Settings'}</span>
          </button>
        </div>

        {/* Drawer Scrollable Body */}
        <div className="mobile-drawer-body">
          {activeDrawerSection === 'menu' ? (
            <div className="mobile-drawer-nav-list">
              
              {/* Active Farm Status Mini Banner */}
              <div className="mobile-drawer-farm-card" onClick={() => setActiveDrawerSection('farm-params')}>
                <div className="drawer-farm-info">
                  <span className="drawer-farm-badge">🌾 {crop ? getCropDisplayName(crop, lang) : (lang === 'hi' ? 'फसल चुनें' : 'Select Crop')}</span>
                  <span className="drawer-farm-location">📍 {location?.nameEn || (lang === 'hi' ? 'स्थान चुनें' : 'Select Location')}</span>
                </div>
                <button type="button" className="drawer-edit-pill">
                  {lang === 'hi' ? 'बदलें' : 'Edit'} <i className="fa-solid fa-chevron-right" style={{ fontSize: '0.7rem' }}></i>
                </button>
              </div>

              {/* Navigation Categories */}
              {navCategories.map((cat, idx) => (
                <div key={idx} className="mobile-drawer-category">
                  <h4 className="mobile-drawer-cat-title">{cat.title}</h4>
                  <div className="mobile-drawer-cat-grid">
                    {cat.items.map((item) => {
                      const isItemActive = activeTab === item.id;
                      return (
                        <button
                          key={item.id}
                          type="button"
                          className={`mobile-drawer-item-btn ${isItemActive ? 'active' : ''}`}
                          onClick={() => handleSelectTab(item.id)}
                        >
                          <div className="drawer-item-left">
                            <span 
                              className="drawer-item-icon" 
                              style={{ color: item.color || 'var(--primary)' }}
                            >
                              <i className={`fa-solid ${item.icon}`}></i>
                            </span>
                            <span className="drawer-item-name">{item.label}</span>
                          </div>
                          {item.badge && <span className="drawer-item-badge">{item.badge}</span>}
                          {isItemActive && <i className="fa-solid fa-check drawer-active-check"></i>}
                        </button>
                      );
                    })}
                  </div>
                </div>
              ))}

              {/* Utility Quick Actions */}
              <div className="mobile-drawer-category">
                <h4 className="mobile-drawer-cat-title">{lang === 'hi' ? 'त्वरित सेटिंग्स' : 'Quick Settings'}</h4>
                <div className="mobile-drawer-settings-list">
                  
                  {/* Language Selector */}
                  <div className="drawer-setting-row">
                    <div className="drawer-setting-label">
                      <i className="fa-solid fa-language" style={{ color: 'var(--primary)' }}></i>
                      <span>{lang === 'hi' ? 'भाषा (Language)' : 'Language'}</span>
                    </div>
                    <select
                      className="drawer-lang-select"
                      value={lang}
                      onChange={(e) => {
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

                  {/* Profile Edit Button */}
                  <button
                    type="button"
                    className="drawer-action-btn"
                    onClick={() => {
                      onClose();
                      setShowOnboarding(true);
                    }}
                  >
                    <i className="fa-solid fa-user-gear" style={{ color: 'var(--primary)' }}></i>
                    <span>{lang === 'hi' ? 'किसान प्रोफ़ाइल सेटअप' : 'Farmer Profile Setup'}</span>
                  </button>

                  {/* Gemini API Key */}
                  <button
                    type="button"
                    className="drawer-action-btn"
                    onClick={() => {
                      onClose();
                      if (onOpenAiModal) onOpenAiModal();
                    }}
                  >
                    <i className="fa-solid fa-key" style={{ color: '#D97706' }}></i>
                    <span>{lang === 'hi' ? 'Gemini AI कुंजी जोड़ें' : 'Gemini AI Key'}</span>
                  </button>
                </div>
              </div>

            </div>
          ) : (
            /* Farm Parameters Mobile Editor Form */
            <div className="mobile-drawer-farm-form">
              <div className="mobile-form-header">
                <h4>{getText('sidebar-title', lang) || 'Farm Parameters'}</h4>
                <p>{getText('sidebar-desc', lang) || 'Adjust farm details to update AI crop recommendations and irrigation schedules.'}</p>
              </div>

              {/* Location */}
              <div className="mobile-form-group">
                <label className="mobile-form-label">
                  <i className="fa-solid fa-location-dot"></i> {getText('param-location', lang) || 'Location'}
                </label>
                <select
                  className="mobile-form-select"
                  value={location?.id || ''}
                  onChange={(e) => {
                    const found = LOCATIONS.find(l => l.id === e.target.value);
                    if (found) {
                      setLocation(found);
                      if (found.defaultSoil) {
                        const s = SOILS.find(soilItem => soilItem.id === found.defaultSoil);
                        if (s) setSoil(s);
                      }
                    }
                  }}
                >
                  <option value="">-- {lang === 'hi' ? 'स्थान चुनें' : 'Select Location'} --</option>
                  {LOCATIONS.map(loc => (
                    <option key={loc.id} value={loc.id}>
                      {loc.nameEn} ({loc.state})
                    </option>
                  ))}
                </select>
              </div>

              {/* Soil Type */}
              <div className="mobile-form-group">
                <label className="mobile-form-label">
                  <i className="fa-solid fa-cubes-stacked"></i> {getText('param-soil', lang) || 'Soil Type'}
                </label>
                <select
                  className="mobile-form-select"
                  value={soil?.id || ''}
                  onChange={(e) => {
                    const found = SOILS.find(s => s.id === e.target.value);
                    if (found) setSoil(found);
                  }}
                >
                  <option value="">-- {lang === 'hi' ? 'मिट्टी चुनें' : 'Select Soil'} --</option>
                  {SOILS.map(s => (
                    <option key={s.id} value={s.id}>
                      {getText(s.nameKey, lang) || s.name || s.nameEn}
                    </option>
                  ))}
                </select>
              </div>

              {/* Crop */}
              <div className="mobile-form-group">
                <label className="mobile-form-label">
                  <i className="fa-solid fa-seedling"></i> {getText('param-crop', lang) || 'Crop'}
                </label>
                <select
                  className="mobile-form-select"
                  value={crop?.id || ''}
                  onChange={(e) => {
                    const found = CROPS.find(c => c.id === e.target.value);
                    if (found) setCrop(found);
                  }}
                >
                  <option value="">-- {lang === 'hi' ? 'फसल चुनें' : 'Select Crop'} --</option>
                  {CROPS.map(c => (
                    <option key={c.id} value={c.id}>
                      {getCropDisplayName(c, lang)}
                    </option>
                  ))}
                </select>
              </div>

              {/* Growth Stage */}
              <div className="mobile-form-group">
                <label className="mobile-form-label">
                  <i className="fa-solid fa-chart-line"></i> {getText('param-stage', lang) || 'Growth Stage'}
                </label>
                <select
                  className="mobile-form-select"
                  value={stage || ''}
                  onChange={(e) => setStage(e.target.value)}
                >
                  <option value="Initial / Germination">{lang === 'hi' ? 'अंकुरण (Germination)' : 'Initial / Germination'}</option>
                  <option value="Vegetative / Tillering">{lang === 'hi' ? 'वानस्पतिक विकास (Vegetative)' : 'Vegetative / Tillering'}</option>
                  <option value="Flowering / Reproductive">{lang === 'hi' ? 'फूल आना (Flowering)' : 'Flowering / Reproductive'}</option>
                  <option value="Maturity / Ripening">{lang === 'hi' ? 'परिपक्वता (Ripening)' : 'Maturity / Ripening'}</option>
                </select>
              </div>

              {/* Farm Area */}
              <div className="mobile-form-group">
                <label className="mobile-form-label">
                  <i className="fa-solid fa-ruler-combined"></i> {getText('param-area', lang) || 'Farm Area (Acres)'}
                </label>
                <input
                  type="number"
                  step="0.1"
                  min="0.1"
                  className="mobile-form-input"
                  value={area || ''}
                  onChange={(e) => setArea(parseFloat(e.target.value) || 1)}
                  placeholder="e.g. 2.5"
                />
              </div>

              {/* Sowing Date */}
              <div className="mobile-form-group">
                <label className="mobile-form-label">
                  <i className="fa-solid fa-calendar-day"></i> {getText('param-sowing-date', lang) || 'Sowing Date'}
                </label>
                <input
                  type="date"
                  className="mobile-form-input"
                  value={sowingDate || ''}
                  onChange={(e) => setSowingDate(e.target.value)}
                />
              </div>

              {/* Apply / Generate Plan Button */}
              <button
                type="button"
                className="mobile-generate-btn"
                disabled={loading}
                onClick={async (e) => {
                  if (handleGeneratePlan) {
                    await handleGeneratePlan(e);
                  }
                  onClose();
                }}
              >
                {loading ? (
                  <>
                    <i className="fa-solid fa-circle-notch fa-spin"></i>
                    <span>{getText('btn-generating', lang) || 'Analyzing Farm...'}</span>
                  </>
                ) : (
                  <>
                    <i className="fa-solid fa-wand-magic-sparkles"></i>
                    <span>{getText('btn-generate-plan', lang) || 'Update AI Advisory'}</span>
                  </>
                )}
              </button>
            </div>
          )}
        </div>
        
      </div>
    </div>
  );
}

export default MobileDrawer;
