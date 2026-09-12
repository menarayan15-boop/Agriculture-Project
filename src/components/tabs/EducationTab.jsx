import React, { useState } from 'react';
import { CROPS, SOILS, getText, getCropDisplayName, getCategoryDisplayName } from '../../data/constants';
import { useApp } from '../../context/AppContext';
import { ttsEngine } from '../../services/ai/ttsService';

export function EducationTab() {
  const { lang } = useApp();
  const [selectedCropId, setSelectedCropId] = useState('wheat');
  const [selectedSoilId, setSelectedSoilId] = useState('alluvial');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedSeasonFilter, setSelectedSeasonFilter] = useState('all');

  const selectedCrop = CROPS.find(c => c.id === selectedCropId) || CROPS[0];
  const selectedSoil = SOILS.find(s => s.id === selectedSoilId) || SOILS[0];

  const handleSpeakProfile = () => {
    const cropName = getCropDisplayName(selectedCrop, lang);
    const desc = selectedCrop.desc || getText(selectedCrop.descKey, lang);
    const soilName = getText(selectedSoil.nameKey, lang) || selectedSoil.name;
    const soilDesc = getText(selectedSoil.descKey, lang) || selectedSoil.desc;
    const speechText = `${cropName}. ${desc}. ${getText('edu-param-duration', lang)}: ${selectedCrop.cropCycleDays || '110 days'}. ${getText('edu-param-water', lang)}: ${selectedCrop.waterReqMm || 500} mm. ${getText('edu-param-yield', lang)}: ${selectedCrop.avgYieldQuintalsPerAcre || 20}. ${getText('edu-param-soil-texture', lang)}: ${soilName}. ${soilDesc}`;
    ttsEngine.speak(speechText, lang);
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
      title: getText('season-kharif', lang),
      subtitle: getText('season-kharif-sown', lang),
      borderColor: 'rgba(52, 211, 153, 0.4)',
      headerBg: 'rgba(16, 185, 129, 0.15)',
      badgeBg: '#10b981',
      crops: kharifCrops
    },
    {
      id: 'rabi',
      title: getText('season-rabi', lang),
      subtitle: getText('season-rabi-sown', lang),
      borderColor: 'rgba(56, 189, 248, 0.4)',
      headerBg: 'rgba(14, 165, 233, 0.15)',
      badgeBg: '#0ea5e9',
      crops: rabiCrops
    },
    {
      id: 'zaid',
      title: getText('season-zaid', lang),
      subtitle: getText('season-zaid-sown', lang),
      borderColor: 'rgba(251, 191, 36, 0.4)',
      headerBg: 'rgba(245, 158, 11, 0.15)',
      badgeBg: '#f59e0b',
      crops: zaidCrops
    },
    {
      id: 'perennial',
      title: getText('season-perennial', lang),
      subtitle: getText('season-perennial-sown', lang),
      borderColor: 'rgba(168, 85, 247, 0.4)',
      headerBg: 'rgba(147, 51, 234, 0.15)',
      badgeBg: '#9333ea',
      crops: perennialCrops
    }
  ];

  return (
    <div className="tab-panel active">
      <div className="card" style={{ padding: '1.5rem', background: '#FFFFFF', borderRadius: '16px', border: '1px solid #E5E7EB', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.2rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#17211B', margin: 0 }}>
              {getText('planner-tab-crops', lang)} &amp; {getText('planner-tab-soils', lang)}
            </h2>
            <p style={{ color: '#6B7280', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
              {getText('planner-click-hint', lang)}
            </p>
          </div>
          <button type="button" className="edu-tts-btn" onClick={handleSpeakProfile} style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', color: '#15803D', fontWeight: 600, padding: '8px 16px', borderRadius: '10px', cursor: 'pointer', display: 'flex', alignItems: 'center' }}>
            <i className="fa-solid fa-volume-high" style={{ marginRight: '6px' }}></i> {getText('edu-read-guide', lang)}
          </button>
        </div>

        {/* Filter Controls: Season & Category Bars */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '1.5rem' }}>
          
          {/* Season Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6B7280', minWidth: '95px' }}>{getText('edu-filter-season', lang)}</span>
            <div className="edu-category-bar" style={{ margin: 0, display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button type="button" className={`edu-cat-btn ${selectedSeasonFilter === 'all' ? 'active' : ''}`} onClick={() => setSelectedSeasonFilter('all')} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #E5E7EB', background: selectedSeasonFilter === 'all' ? '#15803D' : '#F8FAF9', color: selectedSeasonFilter === 'all' ? '#FFFFFF' : '#17211B', fontWeight: 600, cursor: 'pointer' }}>{getText('edu-all-seasons', lang)} ({CROPS.length})</button>
              <button type="button" className={`edu-cat-btn ${selectedSeasonFilter === 'kharif' ? 'active' : ''}`} onClick={() => setSelectedSeasonFilter('kharif')} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #E5E7EB', background: selectedSeasonFilter === 'kharif' ? '#15803D' : '#F8FAF9', color: selectedSeasonFilter === 'kharif' ? '#FFFFFF' : '#17211B', fontWeight: 600, cursor: 'pointer' }}>{getText('season-kharif', lang)}</button>
              <button type="button" className={`edu-cat-btn ${selectedSeasonFilter === 'rabi' ? 'active' : ''}`} onClick={() => setSelectedSeasonFilter('rabi')} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #E5E7EB', background: selectedSeasonFilter === 'rabi' ? '#15803D' : '#F8FAF9', color: selectedSeasonFilter === 'rabi' ? '#FFFFFF' : '#17211B', fontWeight: 600, cursor: 'pointer' }}>{getText('season-rabi', lang)}</button>
              <button type="button" className={`edu-cat-btn ${selectedSeasonFilter === 'zaid' ? 'active' : ''}`} onClick={() => setSelectedSeasonFilter('zaid')} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #E5E7EB', background: selectedSeasonFilter === 'zaid' ? '#15803D' : '#F8FAF9', color: selectedSeasonFilter === 'zaid' ? '#FFFFFF' : '#17211B', fontWeight: 600, cursor: 'pointer' }}>{getText('season-zaid', lang)}</button>
              <button type="button" className={`edu-cat-btn ${selectedSeasonFilter === 'perennial' ? 'active' : ''}`} onClick={() => setSelectedSeasonFilter('perennial')} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #E5E7EB', background: selectedSeasonFilter === 'perennial' ? '#15803D' : '#F8FAF9', color: selectedSeasonFilter === 'perennial' ? '#FFFFFF' : '#17211B', fontWeight: 600, cursor: 'pointer' }}>{getText('season-perennial', lang)}</button>
            </div>
          </div>

          {/* Category Filter Bar */}
          <div style={{ display: 'flex', alignItems: 'center', gap: '8px', flexWrap: 'wrap' }}>
            <span style={{ fontSize: '0.82rem', fontWeight: 700, color: '#6B7280', minWidth: '95px' }}>{getText('edu-filter-category', lang)}</span>
            <div className="edu-category-bar" style={{ margin: 0, display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
              <button type="button" className={`edu-cat-btn ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #E5E7EB', background: selectedCategory === 'all' ? '#15803D' : '#F8FAF9', color: selectedCategory === 'all' ? '#FFFFFF' : '#17211B', fontWeight: 600, cursor: 'pointer' }}>{getText('edu-all-categories', lang)}</button>
              <button type="button" className={`edu-cat-btn ${selectedCategory === 'cereals' ? 'active' : ''}`} onClick={() => setSelectedCategory('cereals')} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #E5E7EB', background: selectedCategory === 'cereals' ? '#15803D' : '#F8FAF9', color: selectedCategory === 'cereals' ? '#FFFFFF' : '#17211B', fontWeight: 600, cursor: 'pointer' }}>{getText('edu-cat-cereals', lang)}</button>
              <button type="button" className={`edu-cat-btn ${selectedCategory === 'pulses' ? 'active' : ''}`} onClick={() => setSelectedCategory('pulses')} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #E5E7EB', background: selectedCategory === 'pulses' ? '#15803D' : '#F8FAF9', color: selectedCategory === 'pulses' ? '#FFFFFF' : '#17211B', fontWeight: 600, cursor: 'pointer' }}>{getText('edu-cat-pulses', lang)}</button>
              <button type="button" className={`edu-cat-btn ${selectedCategory === 'oilseeds' ? 'active' : ''}`} onClick={() => setSelectedCategory('oilseeds')} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #E5E7EB', background: selectedCategory === 'oilseeds' ? '#15803D' : '#F8FAF9', color: selectedCategory === 'oilseeds' ? '#FFFFFF' : '#17211B', fontWeight: 600, cursor: 'pointer' }}>{getText('edu-cat-oilseeds', lang)}</button>
              <button type="button" className={`edu-cat-btn ${selectedCategory === 'cash' ? 'active' : ''}`} onClick={() => setSelectedCategory('cash')} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #E5E7EB', background: selectedCategory === 'cash' ? '#15803D' : '#F8FAF9', color: selectedCategory === 'cash' ? '#FFFFFF' : '#17211B', fontWeight: 600, cursor: 'pointer' }}>{getText('edu-cat-cash', lang)}</button>
              <button type="button" className={`edu-cat-btn ${selectedCategory === 'vegetables' ? 'active' : ''}`} onClick={() => setSelectedCategory('vegetables')} style={{ padding: '6px 12px', borderRadius: '20px', fontSize: '0.82rem', border: '1px solid #E5E7EB', background: selectedCategory === 'vegetables' ? '#15803D' : '#F8FAF9', color: selectedCategory === 'vegetables' ? '#FFFFFF' : '#17211B', fontWeight: 600, cursor: 'pointer' }}>{getText('edu-cat-veg-fruits', lang)}</button>
            </div>
          </div>

        </div>

        {/* ─── SEASONAL COLUMNS CROP SELECTOR GRID ─── */}
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fit, minmax(240px, 1fr))',
          gap: '14px',
          marginBottom: '1.8rem'
        }}>
          {seasonalColumns.map(col => (
            <div
              key={col.id}
              style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '14px',
                padding: '12px',
                display: 'flex',
                flexDirection: 'column',
                boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
              }}
            >
              {/* Seasonal Column Header */}
              <div style={{
                background: '#F8FAF9',
                border: '1px solid #E5E7EB',
                borderRadius: '10px',
                padding: '10px 12px',
                marginBottom: '10px',
                display: 'flex',
                justifyContent: 'space-between',
                alignItems: 'center'
              }}>
                <div>
                  <h4 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 800, color: '#17211B' }}>
                    {col.title}
                  </h4>
                  <span style={{ fontSize: '0.72rem', color: '#6B7280', display: 'block', marginTop: '2px' }}>
                    {col.subtitle}
                  </span>
                </div>
                <span style={{
                  fontSize: '0.76rem',
                  background: '#DCFCE7',
                  color: '#15803D',
                  padding: '3px 9px',
                  borderRadius: '12px',
                  fontWeight: 800,
                  whiteSpace: 'nowrap'
                }}>
                  {col.crops.length} {getText('edu-crops-count', lang)}
                </span>
              </div>

              {/* Crop Cards List within Seasonal Column */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', maxHeight: '260px', overflowY: 'auto', paddingRight: '4px' }}>
                {col.crops.length === 0 ? (
                  <div style={{ fontSize: '0.8rem', color: '#9CA3AF', textAlign: 'center', padding: '16px 8px', fontStyle: 'italic' }}>
                    {getText('no-risks', lang)}
                  </div>
                ) : (
                  col.crops.map(crop => {
                    const isActive = crop.id === selectedCropId;
                    const cropDisplayName = getCropDisplayName(crop, lang);
                    const categoryDisplayName = getCategoryDisplayName(crop.categoryLabel || crop.category, lang);
                    const seasonKey = 'season-' + (crop.season || 'kharif').toLowerCase();
                    const seasonBadge = getText(seasonKey, lang);

                    return (
                      <div
                        key={crop.id}
                        onClick={() => setSelectedCropId(crop.id)}
                        style={{
                          background: isActive ? '#F0FDF4' : '#F8FAF9',
                          border: isActive ? '1.5px solid #15803D' : '1px solid #E5E7EB',
                          borderRadius: '10px',
                          padding: '10px 12px',
                          cursor: 'pointer',
                          transition: 'all 0.2s ease',
                          display: 'flex',
                          justifyContent: 'space-between',
                          alignItems: 'center'
                        }}
                      >
                        <div>
                          <div style={{ fontSize: '0.9rem', fontWeight: 700, color: isActive ? '#15803D' : '#17211B' }}>
                            {cropDisplayName}
                          </div>
                          <div style={{ fontSize: '0.74rem', color: '#6B7280', marginTop: '2px' }}>
                            {categoryDisplayName}
                          </div>
                        </div>
                        <span style={{
                          fontSize: '0.7rem',
                          background: isActive ? '#15803D' : '#E5E7EB',
                          color: isActive ? '#FFFFFF' : '#4B5563',
                          padding: '2px 8px',
                          borderRadius: '6px',
                          fontWeight: 700
                        }}>
                          {seasonBadge.toUpperCase()}
                        </span>
                      </div>
                    );
                  })
                )}
              </div>
            </div>
          ))}
        </div>

        {/* ─── MAIN DETAILED COMPARISON GRID: PLANT PROFILE vs SOIL CATALOG ─── */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(360px, 1fr))', gap: '1.5rem' }}>
          
          {/* LEFT: DETAILED CROP / PLANT AGRONOMIC PROFILE */}
          <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            
            {/* Header Title & Season Badge */}
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '8px', marginBottom: '12px' }}>
              <div>
                <span style={{ fontSize: '0.78rem', color: '#6B7280', textTransform: 'uppercase', letterSpacing: '0.5px', fontWeight: 700, display: 'block', marginBottom: '2px' }}>
                  {getText('edu-plant-profile', lang)}: {getCategoryDisplayName(selectedCrop.categoryLabel || selectedCrop.category, lang)}
                </span>
                <h3 style={{ fontSize: '1.5rem', fontWeight: 800, color: '#15803D', margin: 0 }}>
                  {getCropDisplayName(selectedCrop, lang)}
                </h3>
              </div>
              <span style={{ fontSize: '0.82rem', background: '#DCFCE7', color: '#15803D', border: '1px solid #BBF7D0', padding: '5px 14px', borderRadius: '16px', fontWeight: 800 }}>
                {getText('season-' + (selectedCrop.season || 'kharif').toLowerCase(), lang)}
              </span>
            </div>

            {/* Description */}
            <p style={{ fontSize: '0.92rem', color: '#4B5563', lineHeight: 1.5, marginBottom: '1.2rem' }}>
              {selectedCrop.desc || getText(selectedCrop.descKey, lang)}
            </p>

            {/* Growth & Duration Highlights */}
            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginBottom: '1.2rem' }}>
              {selectedCrop.cropCycleDays && (
                <span style={{ fontSize: '0.78rem', background: '#FEF3C7', color: '#B45309', border: '1px solid #FDE68A', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
                  {getText('edu-param-duration', lang)}: {selectedCrop.cropCycleDays}
                </span>
              )}
              {selectedCrop.sowingMonths && (
                <span style={{ fontSize: '0.78rem', background: '#EFF6FF', color: '#1D4ED8', border: '1px solid #BFDBFE', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
                  {getText('edu-param-sowing', lang)}: {selectedCrop.sowingMonths}
                </span>
              )}
              {selectedCrop.idealSoilPh && (
                <span style={{ fontSize: '0.78rem', background: '#F3E8FF', color: '#7E22CE', border: '1px solid #E9D5FF', padding: '4px 10px', borderRadius: '12px', fontWeight: 700 }}>
                  {getText('edu-param-ph', lang)}: {selectedCrop.idealSoilPh}
                </span>
              )}
            </div>

            {/* Key Growth Metrics Grid */}
            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(135px, 1fr))', gap: '10px', marginBottom: '1.2rem' }}>
              <div style={{ background: '#F8FAF9', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: '0.74rem', color: '#6B7280', display: 'block', marginBottom: '2px' }}>{getText('edu-param-temp', lang)}</span>
                <strong style={{ color: '#D97706', fontSize: '0.95rem' }}>{selectedCrop.tempMin || 18}°C - {selectedCrop.tempMax || 35}°C</strong>
              </div>
              <div style={{ background: '#F8FAF9', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: '0.74rem', color: '#6B7280', display: 'block', marginBottom: '2px' }}>{getText('edu-param-water', lang)}</span>
                <strong style={{ color: '#2563EB', fontSize: '0.95rem' }}>~ {selectedCrop.waterReqMm || 500} mm</strong>
              </div>
              <div style={{ background: '#F8FAF9', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: '0.74rem', color: '#6B7280', display: 'block', marginBottom: '2px' }}>{getText('edu-param-yield', lang)}</span>
                <strong style={{ color: '#7C3AED', fontSize: '0.95rem' }}>{selectedCrop.avgYieldQuintalsPerAcre || 20} Qtl / Acre</strong>
              </div>
              <div style={{ background: '#F8FAF9', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E5E7EB' }}>
                <span style={{ fontSize: '0.74rem', color: '#6B7280', display: 'block', marginBottom: '2px' }}>{getText('edu-param-mandi', lang)}</span>
                <strong style={{ color: '#15803D', fontSize: '0.95rem' }}>₹{(selectedCrop.mandiPricePerQuintal || 2200).toLocaleString('en-IN')}/Qtl</strong>
              </div>
            </div>

            {/* Recommended Soil Texture */}
            {selectedCrop.recommendedSoil && (
              <div style={{ background: '#F8FAF9', padding: '10px 12px', borderRadius: '10px', border: '1px solid #E5E7EB', marginBottom: '12px', fontSize: '0.84rem' }}>
                <span style={{ color: '#6B7280', fontWeight: 700 }}>{getText('edu-param-soil-texture', lang)}: </span>
                <span style={{ color: '#17211B', fontWeight: 600 }}>{selectedCrop.recommendedSoil}</span>
              </div>
            )}

            {/* Critical Growth & Irrigation Stages */}
            {selectedCrop.criticalStages && (
              <div style={{ background: '#EFF6FF', padding: '12px 14px', borderRadius: '12px', border: '1px solid #BFDBFE', marginBottom: '12px' }}>
                <h5 style={{ margin: '0 0 4px 0', color: '#1D4ED8', fontSize: '0.88rem', fontWeight: 700 }}>{getText('edu-sec-growth-stages', lang)}:</h5>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#1E3A8A', lineHeight: 1.45 }}>{selectedCrop.criticalStages}</p>
              </div>
            )}

            {/* Major Pests & Diseases Defense Plan */}
            {selectedCrop.majorPests && (
              <div style={{ background: '#FEF2F2', padding: '12px 14px', borderRadius: '12px', border: '1px solid #FECACA', marginBottom: '12px' }}>
                <h5 style={{ margin: '0 0 4px 0', color: '#DC2626', fontSize: '0.88rem', fontWeight: 700 }}>{getText('edu-sec-pests', lang)}:</h5>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#991B1B', lineHeight: 1.45 }}>{selectedCrop.majorPests}</p>
              </div>
            )}

            {/* Seed Treatment & Chemical Defense */}
            {selectedCrop.seedTreatment && (
              <div style={{ background: '#EFF6FF', padding: '12px 14px', borderRadius: '12px', border: '1px solid #BFDBFE', marginBottom: '12px' }}>
                <h5 style={{ margin: '0 0 4px 0', color: '#2563EB', fontSize: '0.88rem', fontWeight: 700 }}>{getText('edu-sec-seed-defense', lang)}:</h5>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#1E40AF', lineHeight: 1.4 }}>{selectedCrop.seedTreatment}</p>
              </div>
            )}

            {/* Fertilizer Dosage Schedule */}
            {selectedCrop.fertilizers && (
              <div style={{ background: '#F0FDF4', padding: '12px 14px', borderRadius: '12px', border: '1px solid #BBF7D0', marginBottom: '12px' }}>
                <h5 style={{ margin: '0 0 6px 0', color: '#15803D', fontSize: '0.88rem', fontWeight: 700 }}>{getText('edu-sec-fertilizer', lang)}:</h5>
                <div style={{ display: 'flex', gap: '14px', flexWrap: 'wrap', fontSize: '0.86rem', fontWeight: 700, color: '#166534' }}>
                  <span>Urea: <strong>{selectedCrop.fertilizers.ureaKgPerAcre} kg</strong></span> |
                  <span>DAP: <strong>{selectedCrop.fertilizers.dapKgPerAcre} kg</strong></span> |
                  <span>MOP: <strong>{selectedCrop.fertilizers.mopKgPerAcre} kg</strong></span>
                </div>
              </div>
            )}

            {/* Agronomic Advice & Harvest Strategy */}
            <div style={{ background: '#F8FAF9', padding: '12px 14px', borderRadius: '12px', border: '1px solid #E5E7EB', marginBottom: selectedCrop.harvestAdvice ? '12px' : 0 }}>
              <h5 style={{ margin: '0 0 4px 0', color: '#0F766E', fontSize: '0.88rem', fontWeight: 700 }}>{getText('edu-sec-agronomic', lang)}:</h5>
              <p style={{ margin: 0, fontSize: '0.84rem', color: '#374151', fontStyle: 'italic', lineHeight: 1.45 }}>{selectedCrop.tips || getText(selectedCrop.tipsKey, lang)}</p>
            </div>

            {/* Harvest & Storage Strategy */}
            {selectedCrop.harvestAdvice && (
              <div style={{ background: '#FEF3C7', padding: '12px 14px', borderRadius: '12px', border: '1px solid #FDE68A' }}>
                <h5 style={{ margin: '0 0 4px 0', color: '#B45309', fontSize: '0.88rem', fontWeight: 700 }}>{getText('edu-sec-harvest', lang)}:</h5>
                <p style={{ margin: 0, fontSize: '0.84rem', color: '#92400E', lineHeight: 1.45 }}>{selectedCrop.harvestAdvice}</p>
              </div>
            )}

          </div>

          {/* RIGHT: DETAILED SOIL CHARACTERISTICS & CATALOG */}
          <div className="card" style={{ background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: '16px', padding: '1.5rem', boxShadow: '0 4px 20px rgba(0,0,0,0.04)' }}>
            
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#15803D', margin: 0 }}>
                {getText('edu-soil-catalog-title', lang)}
              </h3>
              <span style={{ fontSize: '0.78rem', color: '#6B7280', fontWeight: 700 }}>{getText('edu-select-soil', lang)}</span>
            </div>

            {/* Clickable Soil Buttons Grid (Icon-free) */}
            <div className="edu-soil-pills-container" style={{ marginBottom: '1.2rem', display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
              {SOILS.map(soil => {
                const soilName = getText(soil.nameKey, lang) || soil.name;
                return (
                  <button
                    key={soil.id}
                    type="button"
                    className={`edu-soil-pill ${soil.id === selectedSoilId ? 'active' : ''}`}
                    onClick={() => setSelectedSoilId(soil.id)}
                    style={{
                      padding: '8px 14px',
                      borderRadius: '12px',
                      border: soil.id === selectedSoilId ? '1.5px solid #15803D' : '1px solid #E5E7EB',
                      background: soil.id === selectedSoilId ? '#15803D' : '#F8FAF9',
                      color: soil.id === selectedSoilId ? '#FFFFFF' : '#17211B',
                      fontWeight: 600,
                      cursor: 'pointer'
                    }}
                  >
                    {soilName}
                  </button>
                );
              })}
            </div>

            {/* Detailed Selected Soil Info Panel */}
            <div style={{ background: '#F8FAF9', padding: '1.2rem', borderRadius: '14px', border: '1px solid #E5E7EB' }}>
              
              {/* Soil Title & Color Badge */}
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '8px' }}>
                <h4 style={{ color: '#15803D', margin: 0, fontSize: '1.2rem', fontWeight: 800 }}>
                  {getText(selectedSoil.nameKey, lang) || selectedSoil.name}
                </h4>
                <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
                  <span style={{ width: '14px', height: '14px', borderRadius: '50%', background: selectedSoil.color || '#594331', border: '1px solid #D1D5DB', display: 'inline-block' }}></span>
                  <span style={{ fontSize: '0.74rem', color: '#6B7280', fontWeight: 700 }}>{getText('planner-soil', lang)}</span>
                </div>
              </div>

              {/* Soil Detailed Description */}
              <p style={{ fontSize: '0.88rem', color: '#4B5563', lineHeight: 1.5, margin: '0 0 1rem 0' }}>
                {getText(selectedSoil.descKey, lang) || selectedSoil.desc}
              </p>

              {/* Water Retention & Drainage Metrics */}
              <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '10px', marginBottom: '1rem' }}>
                <div style={{ background: '#EFF6FF', padding: '10px 12px', borderRadius: '10px', border: '1px solid #BFDBFE' }}>
                  <span style={{ fontSize: '0.74rem', color: '#1E40AF', display: 'block' }}>{getText('edu-water-retention', lang)}</span>
                  <strong style={{ color: '#1D4ED8', fontSize: '1.2rem' }}>{selectedSoil.retention}%</strong>
                </div>
                <div style={{ background: '#F0FDF4', padding: '10px 12px', borderRadius: '10px', border: '1px solid #BBF7D0' }}>
                  <span style={{ fontSize: '0.74rem', color: '#166534', display: 'block' }}>{getText('edu-drainage-rate', lang)}</span>
                  <strong style={{ color: '#15803D', fontSize: '1.2rem' }}>{selectedSoil.drainage}%</strong>
                </div>
              </div>

              {/* Soil Composition Breakdown (Sand %, Silt %, Clay %) */}
              {selectedSoil.particles && (
                <div style={{ background: '#FFFFFF', padding: '12px', borderRadius: '10px', marginBottom: '1rem', border: '1px solid #E5E7EB' }}>
                  <span style={{ fontSize: '0.76rem', color: '#6B7280', display: 'block', marginBottom: '6px', fontWeight: 700 }}>{getText('edu-soil-texture-comp', lang)}:</span>
                  <div style={{ display: 'flex', gap: '12px', justifyContent: 'space-between', fontSize: '0.84rem', color: '#17211B', fontWeight: 700 }}>
                    <span>{getText('edu-sand', lang)}: <strong style={{ color: '#D97706' }}>{selectedSoil.particles.sand}%</strong></span>
                    <span>{getText('edu-silt', lang)}: <strong style={{ color: '#2563EB' }}>{selectedSoil.particles.silt || (100 - selectedSoil.particles.sand - selectedSoil.particles.clay)}%</strong></span>
                    <span>{getText('edu-clay', lang)}: <strong style={{ color: '#E11D48' }}>{selectedSoil.particles.clay}%</strong></span>
                  </div>
                </div>
              )}

              {/* Target pH Range & Geographic Regions */}
              <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '1rem', fontSize: '0.84rem' }}>
                {selectedSoil.idealPh && (
                  <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <span style={{ color: '#6B7280', fontWeight: 700 }}>{getText('edu-ideal-ph', lang)}: </span>
                    <span style={{ color: '#D97706', fontWeight: 700 }}>{selectedSoil.idealPh}</span>
                  </div>
                )}
                {selectedSoil.majorRegions && (
                  <div style={{ background: '#FFFFFF', padding: '8px 12px', borderRadius: '8px', border: '1px solid #E5E7EB' }}>
                    <span style={{ color: '#6B7280', fontWeight: 700 }}>{getText('edu-major-regions', lang)}: </span>
                    <span style={{ color: '#374151' }}>{selectedSoil.majorRegions}</span>
                  </div>
                )}
                {selectedSoil.suitableCrops && (
                  <div style={{ background: '#F0FDF4', padding: '8px 12px', borderRadius: '8px', border: '1px solid #BBF7D0' }}>
                    <span style={{ color: '#15803D', fontWeight: 700 }}>{getText('edu-suitable-crops', lang)}: </span>
                    <span style={{ color: '#166534', fontWeight: 600 }}>{selectedSoil.suitableCrops}</span>
                  </div>
                )}
              </div>

              {/* Tillage & Field Management Advice */}
              {selectedSoil.managementAdvice && (
                <div style={{ background: '#EFF6FF', padding: '10px 12px', borderRadius: '8px', border: '1px solid #BFDBFE' }}>
                  <h5 style={{ margin: '0 0 4px 0', color: '#1D4ED8', fontSize: '0.84rem', fontWeight: 700 }}>{getText('edu-tillage-health', lang)}:</h5>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#1E3A8A', lineHeight: 1.4 }}>{selectedSoil.managementAdvice}</p>
                </div>
              )}

            </div>

          </div>

        </div>

      </div>
    </div>
  );
}
