import React, { useState } from 'react';
import { CROPS, SOILS, getText } from '../../data/constants';
import { useApp } from '../../context/AppContext';

export function EducationTab() {
  const { lang } = useApp();
  const [selectedCropId, setSelectedCropId] = useState('wheat');
  const [selectedSoilId, setSelectedSoilId] = useState('alluvial');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState('all');

  const selectedCrop = CROPS.find(c => c.id === selectedCropId) || CROPS[0];
  const selectedSoil = SOILS.find(s => s.id === selectedSoilId) || SOILS[0];

  const handleSpeakProfile = () => {
    const cropName = selectedCrop.name || getText(selectedCrop.nameKey, lang);
    const desc = selectedCrop.desc || getText(selectedCrop.descKey, lang);
    const speechText = `${cropName}. ${desc}. Recommended water demand is ${selectedCrop.waterReqMm || 500} millimeters per season. Expected yield is ${selectedCrop.avgYieldQuintalsPerAcre || 20} quintals per acre.`;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(speechText);
      ut.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(ut);
    }
  };

  // Filter crops based on category & season selection
  const filteredCrops = CROPS.filter(c => {
    const matchCategory = selectedCategory === 'all' || c.category === selectedCategory;
    const matchSeason = selectedSeasonFilter === 'all' || (c.season && c.season.toLowerCase() === selectedSeasonFilter.toLowerCase());
    return matchCategory && matchSeason;
  });

  // Group filtered crops into 4 seasonal columns
  const kharifCrops = filteredCrops.filter(c => c.season === 'Kharif');
  const rabiCrops = filteredCrops.filter(c => c.season === 'Rabi');
  const zaidCrops = filteredCrops.filter(c => c.season === 'Zaid');
  const perennialCrops = filteredCrops.filter(c => c.season === 'Perennial' || c.season === 'Annual');

  const seasonalColumns = [
    {
      id: 'kharif',
      title: 'Kharif Season (Monsoon)',
      subtitle: 'Sown: June–July | Harvest: Oct–Nov',
      borderColor: 'rgba(52, 211, 153, 0.4)',
      headerBg: 'rgba(16, 185, 129, 0.15)',
      badgeBg: '#10b981',
      crops: kharifCrops
    },
    {
      id: 'rabi',
      title: 'Rabi Season (Winter)',
      subtitle: 'Sown: Oct–Nov | Harvest: March–April',
      borderColor: 'rgba(56, 189, 248, 0.4)',
      headerBg: 'rgba(14, 165, 233, 0.15)',
      badgeBg: '#0ea5e9',
      crops: rabiCrops
    },
    {
      id: 'zaid',
      title: 'Zaid Season (Summer)',
      subtitle: 'Sown: March–April | Harvest: May–June',
      borderColor: 'rgba(251, 191, 36, 0.4)',
      headerBg: 'rgba(245, 158, 11, 0.15)',
      badgeBg: '#f59e0b',
      crops: zaidCrops
    },
    {
      id: 'perennial',
      title: 'Perennial / All-Season',
      subtitle: 'Year-Round / Long-Term Crops',
      borderColor: 'rgba(168, 85, 247, 0.4)',
      headerBg: 'rgba(147, 51, 234, 0.15)',
      badgeBg: '#9333ea',
      crops: perennialCrops
    }
  ];

  return (
    <div className="tab-panel active">
      <div className="card" style={{ padding: '1.5rem', background: 'rgba(22, 21, 20, 0.85)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              Agri Guide: Crop Agricultural Profiles
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
              Comprehensive seasonal agronomic catalog with fertilizer schedules, water demands, and expected mandi yields.
            </p>
          </div>
          <button type="button" className="edu-tts-btn" onClick={handleSpeakProfile}>
            <i className="fa-solid fa-volume-high" style={{ marginRight: '6px' }}></i> Read Profile Aloud
          </button>
        </div>

        {/* Filter Controls: Season & Category Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
          
          {/* Season Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', minWidth: '95px' }}>Filter Season:</span>
            <div className="edu-category-bar" style={{ margin: 0 }}>
              <button type="button" className={`edu-cat-btn ${selectedSeasonFilter === 'all' ? 'active' : ''}`} onClick={() => setSelectedSeasonFilter('all')}>All Seasons ({CROPS.length})</button>
              <button type="button" className={`edu-cat-btn ${selectedSeasonFilter === 'kharif' ? 'active' : ''}`} onClick={() => setSelectedSeasonFilter('kharif')}>Kharif (Monsoon)</button>
              <button type="button" className={`edu-cat-btn ${selectedSeasonFilter === 'rabi' ? 'active' : ''}`} onClick={() => setSelectedSeasonFilter('rabi')}>Rabi (Winter)</button>
              <button type="button" className={`edu-cat-btn ${selectedSeasonFilter === 'zaid' ? 'active' : ''}`} onClick={() => setSelectedSeasonFilter('zaid')}>Zaid (Summer)</button>
              <button type="button" className={`edu-cat-btn ${selectedSeasonFilter === 'perennial' ? 'active' : ''}`} onClick={() => setSelectedSeasonFilter('perennial')}>Perennial / Annual</button>
            </div>
          </div>

          {/* Category Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#94a3b8', minWidth: '95px' }}>Filter Category:</span>
            <div className="edu-category-bar" style={{ margin: 0 }}>
              <button type="button" className={`edu-cat-btn ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')}>All Categories</button>
              <button type="button" className={`edu-cat-btn ${selectedCategory === 'cereals' ? 'active' : ''}`} onClick={() => setSelectedCategory('cereals')}>Cereals &amp; Grains</button>
              <button type="button" className={`edu-cat-btn ${selectedCategory === 'pulses' ? 'active' : ''}`} onClick={() => setSelectedCategory('pulses')}>Pulses &amp; Legumes</button>
              <button type="button" className={`edu-cat-btn ${selectedCategory === 'oilseeds' ? 'active' : ''}`} onClick={() => setSelectedCategory('oilseeds')}>Oilseeds</button>
              <button type="button" className={`edu-cat-btn ${selectedCategory === 'cash' ? 'active' : ''}`} onClick={() => setSelectedCategory('cash')}>Cash Crops &amp; Fiber</button>
              <button type="button" className={`edu-cat-btn ${selectedCategory === 'vegetables' ? 'active' : ''}`} onClick={() => setSelectedCategory('vegetables')}>Vegetables &amp; Fruits</button>
            </div>
          </div>

        </div>

        {/* ─── SEASONAL COLUMNS GRID ─── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(250px, 1fr))',
          gap: '14px',
          marginBottom: '1.8rem'
        }}>
          {seasonalColumns.map(col => (
            <div
              key={col.id}
              style={{
                background: 'rgba(15, 23, 42, 0.75)',
                border: `1.5px solid ${col.borderColor}`,
                borderRadius: '14px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column'
              }}
            >
              {/* Seasonal Column Header */}
              <div style={{
                background: col.headerBg,
                border: `1px solid ${col.borderColor}`,
                borderRadius: '10px',
                padding: '10px 12px',
                marginBottom: '10px',
                display: 'flex',
                justify: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#fff' }}>
                    {col.title}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#cbd5e1', display: 'block', marginTop: '2px' }}>
                    {col.subtitle}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.76rem',
                  background: col.badgeBg,
                  color: '#fff',
                  padding: '3px 9px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  whiteSpace: 'nowrap'
                }}>
                  {col.crops.length} Crops
                </span>
              </div>

              {/* Crop Cards List within Seasonal Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '310px', overflowY: 'auto', paddingRight: '4px' }}>
                {col.crops.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: '#64748b', textAlign: 'center', padding: '16px 8px', fontStyle: 'italic' }}>
                    No crops match current filter
                  </div>
                ) : (
                  col.crops.map(crop => {
                    const isActive = crop.id === selectedCropId;
                    return (
                      <div
                        key={crop.id}
                        onClick={() => setSelectedCropId(crop.id)}
                        style={{
                          background: isActive ? 'rgba(74, 222, 128, 0.15)' : 'rgba(255,255,255,0.04)',
                          border: isActive ? '1.5px solid var(--primary-light)' : '1px solid rgba(255,255,255,0.08)',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          justify: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isActive ? 'var(--primary-light)' : '#fff' }}>
                            {crop.name || getText(crop.nameKey, lang)}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#94a3b8', marginTop: '2px' }}>
                            {crop.categoryLabel || crop.category}
                          </div>
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          background: isActive ? 'var(--primary-light)' : 'rgba(255,255,255,0.08)',
                          color: isActive ? '#000' : '#cbd5e1',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: 700
                        }}>
                          {crop.season ? crop.season.toUpperCase() : 'KHARIF'}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ─── MAIN GRID: SELECTED CROP PROFILE & SOIL CATALOG ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Left Column: Detailed Selected Crop Profile Card */}
          <div className="card" style={{ background: 'rgba(20, 35, 25, 0.85)', border: '1.5px solid rgba(74, 222, 128, 0.3)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#94a3b8', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                  {selectedCrop.categoryLabel || selectedCrop.category.toUpperCase()}
                </span>
                <h3 style={{ fontSize: '1.45rem', fontWeight: 800, color: 'var(--primary-light)', margin: 0 }}>
                  {selectedCrop.name || getText(selectedCrop.nameKey, lang)}
                </h3>
              </div>
              <span style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 12px', borderRadius: '14px', fontWeight: 700 }}>
                {selectedCrop.season ? selectedCrop.season.toUpperCase() : 'KHARIF'}
              </span>
            </div>

            <p style={{ fontSize: '0.92rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1.2rem' }}>
              {selectedCrop.desc || getText(selectedCrop.descKey, lang)}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '1.2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Temperature Range</span>
                <strong style={{ color: '#facc15', fontSize: '0.95rem' }}>{selectedCrop.tempMin || 15}°C - {selectedCrop.tempMax || 30}°C</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Water Requirement</span>
                <strong style={{ color: '#38bdf8', fontSize: '0.95rem' }}>~ {selectedCrop.waterReqMm || 500} mm</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Expected Yield</span>
                <strong style={{ color: '#a78bfa', fontSize: '0.95rem' }}>{selectedCrop.avgYieldQuintalsPerAcre || 20} Qtl / Acre</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px 12px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block', marginBottom: '2px' }}>Mandi Rate</span>
                <strong style={{ color: 'var(--primary-light)', fontSize: '0.95rem' }}>₹{(selectedCrop.mandiPricePerQuintal || 2200).toLocaleString('en-IN')}/Qtl</strong>
              </div>
            </div>

            {selectedCrop.seedTreatment && (
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.3)', marginBottom: '12px' }}>
                <h5 style={{ margin: '0 0 4px 0', color: '#60a5fa', fontSize: '0.88rem', fontWeight: 700 }}>Seed Treatment &amp; Defense:</h5>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#e2e8f0', lineHeight: 1.4 }}>{selectedCrop.seedTreatment}</p>
              </div>
            )}

            {selectedCrop.fertilizers && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '12px' }}>
                <h5 style={{ margin: '0 0 6px 0', color: '#34d399', fontSize: '0.88rem', fontWeight: 700 }}>Fertilizer Schedule (per Acre):</h5>
                <div style={{ display: 'flex', gap: '12px', flexWrap: 'wrap', fontSize: '0.84rem', fontWeight: 700, color: '#fff' }}>
                  <span>Urea: {selectedCrop.fertilizers.ureaKgPerAcre} kg</span> |
                  <span>DAP: {selectedCrop.fertilizers.dapKgPerAcre} kg</span> |
                  <span>MOP: {selectedCrop.fertilizers.mopKgPerAcre} kg</span>
                </div>
              </div>
            )}

            <div style={{ background: 'rgba(45, 212, 191, 0.08)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(45, 212, 191, 0.25)' }}>
              <h5 style={{ margin: '0 0 4px 0', color: '#2dd4bf', fontSize: '0.88rem', fontWeight: 700 }}>Agronomic Field Advice:</h5>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#e2e8f0', fontStyle: 'italic', lineHeight: 1.4 }}>{selectedCrop.tips || getText(selectedCrop.tipsKey, lang)}</p>
            </div>
          </div>

          {/* Right Column: Soil Characteristics Guide */}
          <div className="card" style={{ background: 'rgba(22, 21, 20, 0.75)', border: '1.5px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8', margin: '0 0 12px 0' }}>
              Soil Drainage &amp; Retention Catalog
            </h3>

            {/* Clickable Soil Pills (Icon-free) */}
            <div className="edu-soil-pills-container">
              {SOILS.map(soil => (
                <button
                  key={soil.id}
                  type="button"
                  className={`edu-soil-pill ${soil.id === selectedSoilId ? 'active' : ''}`}
                  onClick={() => setSelectedSoilId(soil.id)}
                >
                  {soil.name || getText(soil.nameKey, lang)}
                </button>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '14px' }}>
              <h4 style={{ color: '#38bdf8', margin: '0 0 6px 0', fontSize: '1.1rem' }}>{selectedSoil.name || getText(selectedSoil.nameKey, lang)}</h4>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 12px 0' }}>{selectedSoil.desc || getText(selectedSoil.descKey, lang)}</p>

              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '12px' }}>
                <div style={{ background: 'rgba(56, 189, 248, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(56, 189, 248, 0.25)' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block' }}>Water Retention</span>
                  <strong style={{ color: '#38bdf8', fontSize: '1.1rem' }}>{selectedSoil.retention}%</strong>
                </div>
                <div style={{ background: 'rgba(74, 222, 128, 0.1)', padding: '10px', borderRadius: '8px', border: '1px solid rgba(74, 222, 128, 0.25)' }}>
                  <span style={{ fontSize: '0.74rem', color: '#94a3b8', display: 'block' }}>Drainage Rate</span>
                  <strong style={{ color: 'var(--primary-light)', fontSize: '1.1rem' }}>{selectedSoil.drainage}%</strong>
                </div>
              </div>

              {selectedSoil.particles && (
                <div style={{ background: 'rgba(0,0,0,0.3)', padding: '10px 12px', borderRadius: '8px', display: 'flex', justifyContent: 'space-between', fontSize: '0.82rem', color: '#fff' }}>
                  <span>Sand: <strong>{selectedSoil.particles.sand}%</strong></span>
                  <span>Silt: <strong>{100 - selectedSoil.particles.sand - selectedSoil.particles.clay}%</strong></span>
                  <span>Clay: <strong>{selectedSoil.particles.clay}%</strong></span>
                </div>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
