import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LOCATIONS, SOILS, CROPS, getText } from '../data/constants';

export function Sidebar() {
  const {
    location, setLocation,
    soil, setSoil,
    crop, setCrop,
    stage, setStage,
    area, setArea,
    sowingDate, setSowingDate,
    preference, setPreference,
    lang,
    loading,
    handleGeneratePlan,
    explicitProfile,
    setShowOnboarding
  } = useApp();

  const [locationInput, setLocationInput] = useState(location?.nameEn || '');
  const [soilInput, setSoilInput] = useState(soil ? (soil.name || soil.nameEn || getText(soil.nameKey, lang) || soil.id) : '');
  const [cropInput, setCropInput] = useState(crop ? (crop.name || crop.nameEn || getText(crop.nameKey, lang) || crop.id) : '');
  const [stageInput, setStageInput] = useState(stage || 'Vegetative Growth');

  // Sync state if context changes externally
  useEffect(() => {
    if (location) {
      setLocationInput(location.nameEn || location.id || '');
    }
  }, [location]);

  useEffect(() => {
    if (soil) {
      const name = soil.name || soil.nameEn || getText(soil.nameKey, lang) || soil.id;
      setSoilInput(name || '');
    }
  }, [soil, lang]);

  useEffect(() => {
    if (crop) {
      const name = crop.name || crop.nameEn || getText(crop.nameKey, lang) || crop.id;
      setCropInput(name || '');
    }
  }, [crop, lang]);

  const handleLocationChange = (val) => {
    setLocationInput(val);
    const found = LOCATIONS.find(l => 
      l.nameEn.toLowerCase() === val.toLowerCase() || 
      l.id.toLowerCase() === val.toLowerCase() ||
      (l.nameHi && l.nameHi.toLowerCase() === val.toLowerCase())
    );
    if (found) {
      setLocation(found);
      if (found.defaultSoil) {
        const matchingSoil = SOILS.find(s => s.id === found.defaultSoil);
        if (matchingSoil) {
          setSoil(matchingSoil);
        }
      }
    }
  };

  const handleSoilChange = (val) => {
    setSoilInput(val);
    const found = SOILS.find(s => 
      (s.name && s.name.toLowerCase() === val.toLowerCase()) ||
      (s.nameEn && s.nameEn.toLowerCase() === val.toLowerCase()) ||
      getText(s.nameKey, lang).toLowerCase() === val.toLowerCase() ||
      s.id.toLowerCase() === val.toLowerCase()
    );
    if (found) {
      setSoil(found);
    }
  };

  const handleCropChange = (val) => {
    setCropInput(val);
    const found = CROPS.find(c => 
      (c.name && c.name.toLowerCase() === val.toLowerCase()) ||
      (c.nameEn && c.nameEn.toLowerCase() === val.toLowerCase()) ||
      getText(c.nameKey, lang).toLowerCase() === val.toLowerCase() ||
      c.id.toLowerCase() === val.toLowerCase()
    );
    if (found) {
      setCrop(found);
    }
  };

  const handleStageChange = (val) => {
    setStageInput(val);
    setStage(val);
  };

  const stageOptions = [
    { value: "Initial / Germination", label: getText('stage-initial', lang) },
    { value: "Vegetative Growth", label: getText('stage-veg', lang) },
    { value: "Flowering & Yielding", label: getText('stage-flowering', lang) },
    { value: "Ripening & Harvest", label: getText('stage-harvest', lang) }
  ];

  return (
    <aside style={{
      width: '320px',
      minWidth: '300px',
      maxWidth: '340px',
      height: 'calc(100vh - 80px)',
      position: 'sticky',
      top: '80px',
      overflowY: 'auto',
      background: 'rgba(14, 31, 23, 0.88)',
      backdropFilter: 'blur(16px)',
      WebkitBackdropFilter: 'blur(16px)',
      borderRight: '1px solid rgba(255, 255, 255, 0.1)',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      color: '#e6f3ec',
      scrollbarWidth: 'thin',
      scrollbarColor: 'rgba(40, 199, 111, 0.4) transparent',
      zIndex: 80
    }}>
      {/* Sidebar Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '32px',
            height: '32px',
            borderRadius: '8px',
            background: 'rgba(40, 199, 111, 0.15)',
            color: '#28c76f',
            fontSize: '16px'
          }}>
            <i className="fa-solid fa-sliders"></i>
          </span>
          <h2 style={{
            fontSize: '1.25rem',
            fontWeight: 700,
            margin: 0,
            color: '#ffffff',
            letterSpacing: '-0.02em',
            fontFamily: "'Outfit', sans-serif"
          }}>
            {getText('sidebar-title', lang)}
          </h2>
        </div>
        <p style={{
          fontSize: '0.85rem',
          color: '#a3c2b2',
          margin: '2px 0 0 0',
          lineHeight: '1.4'
        }}>
          {getText('sidebar-subtitle', lang)}
        </p>
      </div>

      <div style={{ height: '1px', background: 'rgba(255, 255, 255, 0.08)' }} />

      {/* Form Fields */}
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '18px' }}>
        
        {/* Location / Region */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#ffffff'
          }}>
            <i className="fa-solid fa-map-location-dot" style={{ color: '#28c76f', fontSize: '14px' }}></i>
            <span>{getText('sidebar-location', lang)}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              list="location-options"
              value={locationInput}
              onChange={(e) => handleLocationChange(e.target.value)}
              placeholder={getText('sidebar-location-ph', lang)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(10, 24, 18, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#28c76f';
                e.target.style.boxShadow = '0 0 10px rgba(40, 199, 111, 0.25)';
              }}
              onBlur={async (e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                const val = e.target.value;
                const found = LOCATIONS.find(l => 
                  l.nameEn.toLowerCase() === val.toLowerCase() || 
                  (l.nameHi && l.nameHi.toLowerCase() === val.toLowerCase())
                );
                if (!found && val.trim() && val !== location?.nameEn) {
                  try {
                    const geoRes = await fetch(`https://geocoding-api.open-meteo.com/v1/search?name=${encodeURIComponent(val.trim())}&count=1&language=en&format=json`);
                    const geoData = await geoRes.json();
                    if (geoData && geoData.results && geoData.results.length > 0) {
                      const res = geoData.results[0];
                      const formattedName = `${res.admin1 || res.name}${res.name !== res.admin1 ? ' (' + res.name + ')' : ''}, ${res.country || 'India'}`;
                      setLocation({
                        id: res.name.toLowerCase().replace(/\s+/g, '-'),
                        nameEn: formattedName,
                        nameHi: formattedName,
                        lat: res.latitude,
                        lon: res.longitude,
                        defaultSoil: 'loamy'
                      });
                    }
                  } catch (err) {
                    console.warn('Sidebar geocoding lookup failed:', err);
                  }
                }
              }}
            />
            <datalist id="location-options">
              {LOCATIONS.map(loc => (
                <option key={loc.id} value={lang === 'hi' && loc.nameHi ? loc.nameHi : loc.nameEn} />
              ))}
            </datalist>
          </div>
          <div style={{
            fontSize: '0.78rem',
            color: '#6e9481',
            paddingLeft: '2px',
            fontFamily: 'monospace',
            letterSpacing: '0.02em'
          }}>
            Lat: {location?.lat?.toFixed(2) || '30.90'} | Lon: {location?.lon?.toFixed(2) || '75.85'}
          </div>
        </div>

        {/* Soil Texture / Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#ffffff'
          }}>
            <i className="fa-solid fa-mountain" style={{ color: '#28c76f', fontSize: '14px' }}></i>
            <span>{getText('sidebar-soil', lang)}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              list="soil-options"
              value={soilInput}
              onChange={(e) => handleSoilChange(e.target.value)}
              placeholder={getText('sidebar-soil-ph', lang)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(10, 24, 18, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#28c76f';
                e.target.style.boxShadow = '0 0 10px rgba(40, 199, 111, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                const val = e.target.value;
                const found = SOILS.find(s => 
                  (s.nameEn && s.nameEn.toLowerCase() === val.toLowerCase()) ||
                  getText(s.nameKey, lang).toLowerCase() === val.toLowerCase()
                );
                if (!found && val.trim() && val !== soil?.name) {
                  setSoil({
                    id: val.toLowerCase().replace(/\s+/g, '-'),
                    nameKey: val,
                    name: val,
                    retention: 70,
                    drainage: 40,
                    color: '#594331',
                    descKey: val
                  });
                }
              }}
            />
            <datalist id="soil-options">
              {SOILS.map(s => (
                <option key={s.id} value={s.nameEn || (s.nameKey ? getText(s.nameKey, lang) : s.id)} />
              ))}
              <option value="Clayey Loam" />
              <option value="Black Cotton Soil" />
              <option value="Alluvial Soil" />
              <option value="Sandy Loam" />
              <option value="Red Laterite" />
            </datalist>
          </div>
          <div style={{
            fontSize: '0.78rem',
            color: '#6e9481',
            paddingLeft: '2px',
            lineHeight: '1.3'
          }}>
            {getText('sidebar-soil-help', lang)}
          </div>
        </div>

        {/* Crop Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#ffffff'
          }}>
            <i className="fa-solid fa-seedling" style={{ color: '#28c76f', fontSize: '14px' }}></i>
            <span>{getText('sidebar-crop', lang)}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="text"
              list="crop-options"
              value={cropInput}
              onChange={(e) => handleCropChange(e.target.value)}
              placeholder={getText('sidebar-crop-ph', lang)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(10, 24, 18, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#28c76f';
                e.target.style.boxShadow = '0 0 10px rgba(40, 199, 111, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
                const val = e.target.value;
                const found = CROPS.find(c => 
                  (c.nameEn && c.nameEn.toLowerCase() === val.toLowerCase()) ||
                  getText(c.nameKey, lang).toLowerCase() === val.toLowerCase()
                );
                if (!found && val.trim() && val !== crop?.name) {
                  setCrop({
                    id: val.toLowerCase().replace(/\s+/g, '-'),
                    nameKey: val,
                    name: val,
                    baseWater: 5.0,
                    tempMin: 15,
                    tempMax: 35,
                    durationDays: 120
                  });
                }
              }}
            />
            <datalist id="crop-options">
              {CROPS.map(c => (
                <option key={c.id} value={c.nameEn || (c.nameKey ? getText(c.nameKey, lang) : c.id)} />
              ))}
              <option value="Rice / Paddy" />
              <option value="Wheat (गेहूं)" />
              <option value="Cotton (कपास)" />
              <option value="Sugarcane (गन्ना)" />
              <option value="Mustard (सरसों)" />
              <option value="Tomato (टमाटर)" />
              <option value="Maize (मक्का)" />
              <option value="Soybean (सोयाबीन)" />
              <option value="Potato (आलू)" />
            </datalist>
          </div>
        </div>

        {/* Growth Stage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#ffffff'
          }}>
            <i className="fa-solid fa-chart-line" style={{ color: '#28c76f', fontSize: '14px' }}></i>
            <span>{getText('sidebar-stage', lang)}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={stageInput}
              onChange={(e) => handleStageChange(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(10, 24, 18, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#28c76f';
                e.target.style.boxShadow = '0 0 10px rgba(40, 199, 111, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
              }}
            >
              {stageOptions.map(opt => (
                <option key={opt.value} value={opt.value} style={{ background: '#0d1e15', color: '#ffffff' }}>
                  {opt.label}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Sowing Date */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#ffffff'
          }}>
            <i className="fa-solid fa-calendar-days" style={{ color: '#28c76f', fontSize: '14px' }}></i>
            <span>{lang === 'hi' ? 'बुआई की तारीख (Sowing Date)' : 'Sowing Date'}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={sowingDate || ''}
              onChange={(e) => setSowingDate(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(10, 24, 18, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#28c76f';
                e.target.style.boxShadow = '0 0 10px rgba(40, 199, 111, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
              }}
            />
          </div>
        </div>

        {/* Farm Area */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#ffffff'
          }}>
            <i className="fa-solid fa-ruler-combined" style={{ color: '#28c76f', fontSize: '14px' }}></i>
            <span>{getText('sidebar-area', lang)}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={area}
              min="0.1"
              max="1000"
              step="0.5"
              onChange={(e) => setArea(parseFloat(e.target.value) || 1.0)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(10, 24, 18, 0.75)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#28c76f';
                e.target.style.boxShadow = '0 0 10px rgba(40, 199, 111, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
              }}
            />
          </div>
          <div style={{
            fontSize: '0.78rem',
            color: '#6e9481',
            paddingLeft: '2px',
            lineHeight: '1.3'
          }}>
            {getText('sidebar-area-help', lang)}
          </div>
        </div>

        {/* Input Practice Preference */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.88rem',
            fontWeight: 600,
            color: '#ffffff'
          }}>
            <i className="fa-solid fa-sliders" style={{ color: '#28c76f', fontSize: '14px' }}></i>
            <span>{getText('sidebar-pref', lang)}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              style={{
                width: '100%',
                padding: '11px 14px',
                borderRadius: '10px',
                background: 'rgba(10, 24, 18, 0.95)',
                border: '1px solid rgba(255, 255, 255, 0.15)',
                color: '#ffffff',
                fontSize: '0.92rem',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'inset 0 2px 4px rgba(0,0,0,0.2)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = '#28c76f';
                e.target.style.boxShadow = '0 0 10px rgba(40, 199, 111, 0.25)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'rgba(255, 255, 255, 0.15)';
                e.target.style.boxShadow = 'inset 0 2px 4px rgba(0,0,0,0.2)';
              }}
            >
              <option value="balanced" style={{ background: '#0d1e15', color: '#ffffff' }}>{getText('sidebar-pref-bal', lang)}</option>
              <option value="organic" style={{ background: '#0d1e15', color: '#ffffff' }}>{getText('sidebar-pref-org', lang)}</option>
              <option value="synthetic" style={{ background: '#0d1e15', color: '#ffffff' }}>{getText('sidebar-pref-syn', lang)}</option>
            </select>
          </div>
        </div>

        {/* Generate Plan Button */}
        <button
          type="button"
          onClick={handleGeneratePlan}
          disabled={loading}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '13px 18px',
            borderRadius: '12px',
            background: 'linear-gradient(135deg, #28c76f 0%, #1a9e52 100%)',
            border: 'none',
            color: '#ffffff',
            fontSize: '0.95rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: '0 8px 20px -4px rgba(40, 199, 111, 0.45)',
            transition: 'all 0.25s ease',
            opacity: loading ? 0.7 : 1,
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.transform = 'translateY(-2px)';
              e.currentTarget.style.boxShadow = '0 12px 24px -4px rgba(40, 199, 111, 0.6)';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.transform = 'translateY(0)';
            e.currentTarget.style.boxShadow = '0 8px 20px -4px rgba(40, 199, 111, 0.45)';
          }}
        >
          <i className={`fa-solid ${loading ? 'fa-spinner fa-spin' : 'fa-wand-magic-sparkles'}`}></i>
          <span>{loading ? getText('sidebar-btn-loading', lang) : getText('sidebar-btn', lang)}</span>
        </button>
      </form>

      {/* Explicit Farmer Profile Summary */}
      {explicitProfile && (
        <>
          <div style={{ height: '1px', background: 'var(--border-color)', margin: '16px 0' }} />
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <h3 style={{ fontSize: '0.9rem', margin: 0, color: 'var(--primary)', fontWeight: 600, fontFamily: "'Fraunces', serif" }}>Farmer Profile</h3>
              <button 
                onClick={() => setShowOnboarding(true)}
                style={{ 
                  background: 'none', border: 'none', color: 'var(--highlight)', 
                  cursor: 'pointer', fontSize: '0.8rem', textDecoration: 'underline',
                  fontWeight: 600
                }}
              >
                Retake Profiling
              </button>
            </div>
            <div style={{ 
              background: 'var(--card-bg)', border: '1px solid var(--border-color)', 
              borderLeft: '3px solid var(--secondary)',
              borderRadius: 'var(--border-radius-sm)', padding: '12px', fontSize: '0.85rem', color: 'var(--text-primary)',
              lineHeight: '1.5'
            }}>
              <div style={{ fontWeight: 'bold', textTransform: 'capitalize', color: '#fff', marginBottom: '4px' }}>
                {explicitProfile.farmScale} Farmer
              </div>
              <div style={{ color: 'var(--text-secondary)' }}>
                📍 {explicitProfile.state}<br/>
                💼 {explicitProfile.experienceLevel} (Exp)<br/>
                🎯 {explicitProfile.goals?.length || 0} Goals Focus
              </div>
            </div>
          </div>
        </>
      )}
    </aside>
  );
}
