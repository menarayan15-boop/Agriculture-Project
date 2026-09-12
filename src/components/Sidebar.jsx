import React, { useState, useEffect } from 'react';
import { useApp } from '../context/AppContext';
import { LOCATIONS, SOILS, CROPS, getText, getCropDisplayName } from '../data/constants';

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
  const [stageInput, setStageInput] = useState(stage || '');

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

  const onGenerateClick = (e) => {
    if (e) e.preventDefault();
    let activeLoc = location;
    if (!activeLoc && locationInput) {
      activeLoc = LOCATIONS.find(l => 
        l.nameEn.toLowerCase() === locationInput.toLowerCase() || 
        l.id.toLowerCase() === locationInput.toLowerCase() ||
        (l.nameHi && l.nameHi.toLowerCase() === locationInput.toLowerCase())
      );
      if (activeLoc) setLocation(activeLoc);
    }
    let activeSoil = soil;
    if (!activeSoil && soilInput) {
      activeSoil = SOILS.find(s => 
        (s.name && s.name.toLowerCase() === soilInput.toLowerCase()) ||
        (s.nameEn && s.nameEn.toLowerCase() === soilInput.toLowerCase()) ||
        getText(s.nameKey, lang).toLowerCase() === soilInput.toLowerCase() ||
        s.id.toLowerCase() === soilInput.toLowerCase()
      );
      if (activeSoil) setSoil(activeSoil);
    }
    let activeCrop = crop;
    if (!activeCrop && cropInput) {
      activeCrop = CROPS.find(c => 
        (c.name && c.name.toLowerCase() === cropInput.toLowerCase()) ||
        (c.nameEn && c.nameEn.toLowerCase() === cropInput.toLowerCase()) ||
        getText(c.nameKey, lang).toLowerCase() === cropInput.toLowerCase() ||
        c.id.toLowerCase() === cropInput.toLowerCase()
      );
      if (activeCrop) setCrop(activeCrop);
    }

    handleGeneratePlan(activeCrop, activeSoil, activeLoc);
  };

  const stageOptions = [
    { value: "", label: getText('sidebar-stage-select', lang) },
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
      height: 'calc(100vh - 76px)',
      position: 'sticky',
      top: '76px',
      overflowY: 'auto',
      background: '#FFFFFF',
      borderRight: '1px solid var(--border-color)',
      padding: '24px 20px',
      display: 'flex',
      flexDirection: 'column',
      gap: '20px',
      color: 'var(--text-primary)',
      boxShadow: 'var(--shadow-xs)',
      zIndex: 80
    }}>
      {/* Sidebar Header */}
      <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            justifyContent: 'center',
            width: '34px',
            height: '34px',
            borderRadius: '8px',
            background: 'var(--very-light-green)',
            color: 'var(--primary)',
            fontSize: '15px',
            border: '1px solid var(--border-green)'
          }}>
            <i className="fa-solid fa-sliders"></i>
          </span>
          <h2 style={{
            fontSize: '1.2rem',
            fontWeight: 800,
            margin: 0,
            color: 'var(--primary-dark)',
            letterSpacing: '-0.02em',
            fontFamily: "'Inter', sans-serif"
          }}>
            {getText('sidebar-title', lang)}
          </h2>
        </div>
        <p style={{
          fontSize: '0.82rem',
          color: 'var(--text-secondary)',
          margin: '2px 0 0 0',
          lineHeight: '1.4'
        }}>
          {getText('sidebar-subtitle', lang)}
        </p>
      </div>

      <div style={{ height: '1px', background: 'var(--border-color)' }} />

      {/* Form Fields */}
      <form onSubmit={(e) => e.preventDefault()} style={{ display: 'flex', flexDirection: 'column', gap: '16px' }}>
        
        {/* Location / Region */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            <i className="fa-solid fa-map-location-dot" style={{ color: 'var(--primary)', fontSize: '14px' }}></i>
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
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-xs)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(21, 128, 61, 0.15)';
              }}
              onBlur={async (e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'var(--shadow-xs)';
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
            fontSize: '0.74rem',
            color: 'var(--text-secondary)',
            paddingLeft: '2px',
            fontFamily: 'monospace',
            letterSpacing: '0.02em'
          }}>
            Lat: {location?.lat ? location.lat.toFixed(2) : '--'} | Lon: {location?.lon ? location.lon.toFixed(2) : '--'}
          </div>
        </div>

        {/* Soil Texture / Type */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            <i className="fa-solid fa-mountain" style={{ color: 'var(--primary)', fontSize: '14px' }}></i>
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
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-xs)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(21, 128, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'var(--shadow-xs)';
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
                <option key={s.id} value={getText(s.nameKey, lang) || s.name} />
              ))}
            </datalist>
          </div>
          <div style={{
            fontSize: '0.74rem',
            color: 'var(--text-secondary)',
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
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            <i className="fa-solid fa-seedling" style={{ color: 'var(--primary)', fontSize: '14px' }}></i>
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
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-xs)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(21, 128, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'var(--shadow-xs)';
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
                <option key={c.id} value={getCropDisplayName(c, lang)} />
              ))}
            </datalist>
          </div>
        </div>

        {/* Growth Stage */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '6px' }}>
          <label style={{
            display: 'flex',
            alignItems: 'center',
            gap: '8px',
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            <i className="fa-solid fa-chart-line" style={{ color: 'var(--primary)', fontSize: '14px' }}></i>
            <span>{getText('sidebar-stage', lang)}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={stageInput}
              onChange={(e) => handleStageChange(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-xs)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(21, 128, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'var(--shadow-xs)';
              }}
            >
              {stageOptions.map(opt => (
                <option key={opt.value} value={opt.value}>
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
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            <i className="fa-solid fa-calendar-days" style={{ color: 'var(--primary)', fontSize: '14px' }}></i>
            <span>{getText('sidebar-sowing-date', lang)}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="date"
              value={sowingDate || ''}
              onChange={(e) => setSowingDate(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-xs)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(21, 128, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'var(--shadow-xs)';
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
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            <i className="fa-solid fa-ruler-combined" style={{ color: 'var(--primary)', fontSize: '14px' }}></i>
            <span>{getText('sidebar-area', lang)}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <input
              type="number"
              value={area !== null && area !== undefined ? area : ''}
              min="0.1"
              max="1000"
              step="0.5"
              placeholder={getText('sidebar-area-ph', lang)}
              onChange={(e) => setArea(e.target.value === '' ? '' : parseFloat(e.target.value))}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                outline: 'none',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-xs)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(21, 128, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'var(--shadow-xs)';
              }}
            />
          </div>
          <div style={{
            fontSize: '0.74rem',
            color: 'var(--text-secondary)',
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
            fontSize: '0.84rem',
            fontWeight: 600,
            color: 'var(--text-primary)'
          }}>
            <i className="fa-solid fa-sliders" style={{ color: 'var(--primary)', fontSize: '14px' }}></i>
            <span>{getText('sidebar-pref', lang)}</span>
          </label>
          <div style={{ position: 'relative' }}>
            <select
              value={preference}
              onChange={(e) => setPreference(e.target.value)}
              style={{
                width: '100%',
                padding: '10px 14px',
                borderRadius: '10px',
                background: '#FFFFFF',
                border: '1px solid var(--border-color)',
                color: 'var(--text-primary)',
                fontSize: '0.9rem',
                fontWeight: 500,
                outline: 'none',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                boxShadow: 'var(--shadow-xs)'
              }}
              onFocus={(e) => {
                e.target.style.borderColor = 'var(--primary)';
                e.target.style.boxShadow = '0 0 0 3px rgba(21, 128, 61, 0.15)';
              }}
              onBlur={(e) => {
                e.target.style.borderColor = 'var(--border-color)';
                e.target.style.boxShadow = 'var(--shadow-xs)';
              }}
            >
              <option value="balanced">{getText('sidebar-pref-bal', lang)}</option>
              <option value="organic">{getText('sidebar-pref-org', lang)}</option>
              <option value="synthetic">{getText('sidebar-pref-syn', lang)}</option>
            </select>
          </div>
        </div>

        {/* Generate Plan Button */}
        <button
          type="button"
          onClick={onGenerateClick}
          disabled={loading}
          style={{
            marginTop: '8px',
            width: '100%',
            padding: '12px 18px',
            borderRadius: '12px',
            background: 'var(--primary)',
            border: 'none',
            color: '#FFFFFF',
            fontSize: '0.92rem',
            fontWeight: 700,
            cursor: loading ? 'not-allowed' : 'pointer',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            gap: '10px',
            boxShadow: 'var(--shadow-green)',
            transition: 'all 0.2s ease',
            opacity: loading ? 0.7 : 1,
            transform: 'translateY(0)'
          }}
          onMouseEnter={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'var(--primary-dark)';
              e.currentTarget.style.transform = 'translateY(-1px)';
            }
          }}
          onMouseLeave={(e) => {
            if (!loading) {
              e.currentTarget.style.background = 'var(--primary)';
              e.currentTarget.style.transform = 'translateY(0)';
            }
          }}
        >
          {loading ? (
            <>
              <i className="fa-solid fa-circle-notch fa-spin" style={{ fontSize: '15px' }}></i>
              <span>{getText('sidebar-btn-loading', lang)}</span>
            </>
          ) : (
            <>
              <i className="fa-solid fa-wand-magic-sparkles" style={{ fontSize: '15px' }}></i>
              <span>{getText('sidebar-generate', lang)}</span>
            </>
          )}
        </button>

        {/* Onboarding / Setup Trigger */}
        <div style={{
          marginTop: '6px',
          padding: '12px 14px',
          borderRadius: '10px',
          background: 'var(--very-light-green)',
          border: '1px solid var(--border-green)',
          display: 'flex',
          flexDirection: 'column',
          gap: '8px'
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', fontSize: '0.82rem', fontWeight: 600, color: 'var(--primary-dark)' }}>
            <i className="fa-solid fa-user-check" style={{ color: 'var(--primary)' }}></i>
            <span>{explicitProfile ? getText('sidebar-profile-active', lang) : getText('sidebar-quick-setup', lang)}</span>
          </div>
          <button
            type="button"
            onClick={() => setShowOnboarding(true)}
            style={{
              background: '#FFFFFF',
              border: '1px solid var(--border-color)',
              borderRadius: '8px',
              padding: '7px 10px',
              fontSize: '0.78rem',
              fontWeight: 600,
              color: 'var(--primary)',
              cursor: 'pointer',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              gap: '6px',
              transition: 'all 0.2s ease'
            }}
            onMouseEnter={(e) => e.currentTarget.style.borderColor = 'var(--primary)'}
            onMouseLeave={(e) => e.currentTarget.style.borderColor = 'var(--border-color)'}
          >
            <i className="fa-solid fa-pen-to-square"></i>
            <span>{getText('sidebar-edit-profile', lang)}</span>
          </button>
        </div>

      </form>
    </aside>
  );
}
