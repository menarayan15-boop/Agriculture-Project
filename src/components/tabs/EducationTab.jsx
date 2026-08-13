import React, { useState } from 'react';
import { CROPS, SOILS, getText } from '../../data/constants';
import { useApp } from '../../context/AppContext';

const CROP_METADATA = {
  rice: { icon: "🌾", category: "cereals", seasonBadge: "KHARIF (MONSOON)", categoryLabel: "Cereal / Grain" },
  wheat: { icon: "🌾", category: "cereals", seasonBadge: "RABI (WINTER)", categoryLabel: "Cereal / Grain" },
  maize: { icon: "🌽", category: "cereals", seasonBadge: "KHARIF / RABI", categoryLabel: "Cereal / Grain" },
  cotton: { icon: "🌱", category: "cash", seasonBadge: "KHARIF (MONSOON)", categoryLabel: "Commercial Fiber" },
  sugarcane: { icon: "🎋", category: "cash", seasonBadge: "ANNUAL (12 MO)", categoryLabel: "Cash Crop" },
  potato: { icon: "🥔", category: "vegetables", seasonBadge: "RABI (WINTER)", categoryLabel: "Tuber Vegetable" },
  tomato: { icon: "🍅", category: "vegetables", seasonBadge: "ZAID / RABI", categoryLabel: "Horticulture" },
  onion: { icon: "🧅", category: "vegetables", seasonBadge: "RABI / KHARIF", categoryLabel: "Bulb Vegetable" },
  chilli: { icon: "🌶️", category: "vegetables", seasonBadge: "KHARIF / ZAID", categoryLabel: "Spices / Vegetable" },
  groundnut: { icon: "🥜", category: "oilseeds", seasonBadge: "KHARIF (MONSOON)", categoryLabel: "Oilseed Legume" },
  mustard: { icon: "🌻", category: "oilseeds", seasonBadge: "RABI (WINTER)", categoryLabel: "Oilseed" },
  soybean: { icon: "🫘", category: "oilseeds", seasonBadge: "KHARIF (MONSOON)", categoryLabel: "Protein Oilseed" },
  chickpea: { icon: "🍲", category: "oilseeds", seasonBadge: "RABI (WINTER)", categoryLabel: "Pulse / Legume" },
  banana: { icon: "🍌", category: "vegetables", seasonBadge: "ANNUAL", categoryLabel: "Fruit Crop" },
  mango: { icon: "🥭", category: "vegetables", seasonBadge: "PERENNIAL", categoryLabel: "Fruit Orchard" },
  apple: { icon: "🍎", category: "vegetables", seasonBadge: "TEMPERATE", categoryLabel: "Fruit Orchard" },
  marigold: { icon: "🌼", category: "cash", seasonBadge: "ROUND THE YEAR", categoryLabel: "Floriculture" },
  rose: { icon: "🌹", category: "cash", seasonBadge: "PERENNIAL", categoryLabel: "Floriculture" }
};

export function EducationTab() {
  const { lang } = useApp();
  const [selectedCropId, setSelectedCropId] = useState('wheat');
  const [selectedSoilId, setSelectedSoilId] = useState('alluvial');
  const [selectedCategory, setSelectedCategory] = useState('all');

  const selectedCrop = CROPS.find(c => c.id === selectedCropId) || CROPS[0];
  const selectedSoil = SOILS.find(s => s.id === selectedSoilId) || SOILS[0];
  const meta = CROP_METADATA[selectedCrop.id] || { icon: "🌾", seasonBadge: "KHARIF", category: "cereals" };

  const filteredCrops = CROPS.filter(c => {
    if (selectedCategory === 'all') return true;
    const cMeta = CROP_METADATA[c.id] || { category: 'cereals' };
    return cMeta.category === selectedCategory;
  });

  const handleSpeakProfile = () => {
    const cropName = getText(selectedCrop.nameKey, lang);
    const desc = getText(selectedCrop.descKey, lang);
    const speechText = `${cropName}. ${desc}. Recommended water demand is ${selectedCrop.waterReqMm || 500} millimeters.`;
    if ('speechSynthesis' in window) {
      window.speechSynthesis.cancel();
      const ut = new SpeechSynthesisUtterance(speechText);
      ut.lang = lang === 'hi' ? 'hi-IN' : 'en-US';
      window.speechSynthesis.speak(ut);
    }
  };

  return (
    <div className="tab-panel active">
      <div className="card" style={{ padding: '1.5rem', background: 'rgba(22, 21, 20, 0.85)', borderRadius: '20px', border: '1px solid var(--border-color)' }}>
        
        {/* Header Bar */}
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '12px', marginBottom: '1.5rem' }}>
          <div>
            <h2 style={{ fontSize: '1.6rem', fontWeight: 800, color: '#fff', margin: 0 }}>
              <i className="fa-solid fa-book-open-reader" style={{ color: 'var(--primary-light)', marginRight: '10px' }}></i>
              Agri Guide: Crop Agricultural Profiles
            </h2>
            <p style={{ color: '#94a3b8', fontSize: '0.9rem', margin: '4px 0 0 0' }}>
              Select any crop below to view comprehensive agronomic parameters, fertilizer schedules, and protection plans.
            </p>
          </div>
          <button type="button" className="edu-tts-btn" onClick={handleSpeakProfile}>
            <i className="fa-solid fa-volume-high"></i> Read Profile Aloud
          </button>
        </div>

        {/* Category Filter Pills */}
        <div className="edu-category-bar">
          <button type="button" className={`edu-cat-btn ${selectedCategory === 'all' ? 'active' : ''}`} onClick={() => setSelectedCategory('all')}>🌾 All Crops ({CROPS.length})</button>
          <button type="button" className={`edu-cat-btn ${selectedCategory === 'cereals' ? 'active' : ''}`} onClick={() => setSelectedCategory('cereals')}>🌽 Cereals &amp; Grains</button>
          <button type="button" className={`edu-cat-btn ${selectedCategory === 'cash' ? 'active' : ''}`} onClick={() => setSelectedCategory('cash')}>🌱 Cash &amp; Fiber</button>
          <button type="button" className={`edu-cat-btn ${selectedCategory === 'vegetables' ? 'active' : ''}`} onClick={() => setSelectedCategory('vegetables')}>🍅 Vegetables &amp; Fruits</button>
          <button type="button" className={`edu-cat-btn ${selectedCategory === 'oilseeds' ? 'active' : ''}`} onClick={() => setSelectedCategory('oilseeds')}>🌻 Oilseeds &amp; Pulses</button>
        </div>

        {/* Interactive Clickable Crop Cards Grid */}
        <div className="edu-crop-pills-container" style={{ maxHeight: '240px', marginBottom: '1.5rem' }}>
          {filteredCrops.map(crop => {
            const cMeta = CROP_METADATA[crop.id] || { icon: "🌾" };
            const isActive = crop.id === selectedCropId;
            return (
              <div
                key={crop.id}
                className={`edu-crop-pill ${isActive ? 'active' : ''}`}
                onClick={() => setSelectedCropId(crop.id)}
                title={`Click to view ${getText(crop.nameKey, lang)} profile`}
              >
                <span className="edu-crop-pill-icon">{cMeta.icon}</span>
                <span className="edu-crop-pill-title">{getText(crop.nameKey, lang)}</span>
                <span className="edu-crop-pill-tag">{crop.season ? crop.season.toUpperCase() : 'KHARIF'}</span>
              </div>
            );
          })}
        </div>

        {/* Main Grid: Selected Crop Detail Card & Soil Characteristics */}
        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(320px, 1fr))', gap: '1.5rem' }}>
          
          {/* Left: Detailed Selected Crop Profile */}
          <div className="card" style={{ background: 'rgba(20, 35, 25, 0.85)', border: '1.5px solid rgba(74, 222, 128, 0.3)', borderRadius: '16px', padding: '1.5rem' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '10px' }}>
              <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: 'var(--primary-light)', margin: 0 }}>
                {meta.icon} {getText(selectedCrop.nameKey, lang)}
              </h3>
              <span style={{ fontSize: '0.8rem', background: 'rgba(16, 185, 129, 0.2)', color: '#34d399', border: '1px solid rgba(16, 185, 129, 0.4)', padding: '4px 12px', borderRadius: '14px', fontWeight: 700 }}>
                {selectedCrop.season ? selectedCrop.season.toUpperCase() : 'KHARIF'}
              </span>
            </div>

            <p style={{ fontSize: '0.9rem', color: '#cbd5e1', lineHeight: 1.5, marginBottom: '1rem' }}>
              {getText(selectedCrop.descKey, lang)}
            </p>

            <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(130px, 1fr))', gap: '10px', marginBottom: '1.2rem' }}>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Temperature Range</span>
                <strong style={{ color: '#facc15', fontSize: '0.92rem' }}>{selectedCrop.tempMin}°C - {selectedCrop.tempMax}°C</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Water Requirement</span>
                <strong style={{ color: '#38bdf8', fontSize: '0.92rem' }}>~ {selectedCrop.waterReqMm || 500} mm</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Expected Yield</span>
                <strong style={{ color: '#a78bfa', fontSize: '0.92rem' }}>{selectedCrop.avgYieldQuintalsPerAcre || 20} Qtl / Acre</strong>
              </div>
              <div style={{ background: 'rgba(255,255,255,0.04)', padding: '10px', borderRadius: '10px', border: '1px solid var(--border-color)' }}>
                <span style={{ fontSize: '0.72rem', color: '#94a3b8', display: 'block' }}>Mandi Rate</span>
                <strong style={{ color: 'var(--primary-light)', fontSize: '0.92rem' }}>₹{(selectedCrop.mandiPricePerQuintal || 2200).toLocaleString('en-IN')}/Qtl</strong>
              </div>
            </div>

            {selectedCrop.seedTreatment && (
              <div style={{ background: 'rgba(59, 130, 246, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(59, 130, 246, 0.3)', marginBottom: '12px' }}>
                <h5 style={{ margin: '0 0 4px 0', color: '#60a5fa', fontSize: '0.88rem', fontWeight: 700 }}><i className="fa-solid fa-shield-halved"></i> Seed Treatment:</h5>
                <p style={{ margin: 0, fontSize: '0.82rem', color: '#e2e8f0' }}>{selectedCrop.seedTreatment}</p>
              </div>
            )}

            {selectedCrop.fertilizers && (
              <div style={{ background: 'rgba(16, 185, 129, 0.1)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(16, 185, 129, 0.3)', marginBottom: '12px' }}>
                <h5 style={{ margin: '0 0 6px 0', color: '#34d399', fontSize: '0.88rem', fontWeight: 700 }}><i className="fa-solid fa-seedling"></i> Fertilizer Dosage (per Acre):</h5>
                <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', fontSize: '0.82rem', fontWeight: 700, color: '#fff' }}>
                  <span>Urea: {selectedCrop.fertilizers.ureaKgPerAcre} kg</span> |
                  <span>DAP: {selectedCrop.fertilizers.dapKgPerAcre} kg</span> |
                  <span>MOP: {selectedCrop.fertilizers.mopKgPerAcre} kg</span>
                </div>
              </div>
            )}

            <div style={{ background: 'rgba(45, 212, 191, 0.08)', padding: '12px', borderRadius: '10px', border: '1px solid rgba(45, 212, 191, 0.25)' }}>
              <h5 style={{ margin: '0 0 4px 0', color: '#2dd4bf', fontSize: '0.88rem', fontWeight: 700 }}><i className="fa-solid fa-lightbulb"></i> Agronomic Advice:</h5>
              <p style={{ margin: 0, fontSize: '0.82rem', color: '#e2e8f0', fontStyle: 'italic' }}>{getText(selectedCrop.tipsKey, lang)}</p>
            </div>
          </div>

          {/* Right: Soil Characteristics Guide */}
          <div className="card" style={{ background: 'rgba(22, 21, 20, 0.75)', border: '1.5px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px', padding: '1.5rem' }}>
            <h3 style={{ fontSize: '1.35rem', fontWeight: 800, color: '#38bdf8', margin: '0 0 12px 0' }}>
              <i className="fa-solid fa-mountain"></i> Soil Drainage &amp; Retention Catalog
            </h3>

            {/* Clickable Soil Pills */}
            <div className="edu-soil-pills-container">
              {SOILS.map(soil => (
                <button
                  key={soil.id}
                  type="button"
                  className={`edu-soil-pill ${soil.id === selectedSoilId ? 'active' : ''}`}
                  onClick={() => setSelectedSoilId(soil.id)}
                >
                  ⛰️ {getText(soil.nameKey, lang)}
                </button>
              ))}
            </div>

            <div style={{ background: 'rgba(255,255,255,0.04)', padding: '14px', borderRadius: '12px', border: '1px solid var(--border-color)', marginTop: '14px' }}>
              <h4 style={{ color: '#38bdf8', margin: '0 0 6px 0', fontSize: '1.1rem' }}>{getText(selectedSoil.nameKey, lang)}</h4>
              <p style={{ fontSize: '0.86rem', color: '#cbd5e1', lineHeight: 1.5, margin: '0 0 12px 0' }}>{getText(selectedSoil.descKey, lang)}</p>

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
