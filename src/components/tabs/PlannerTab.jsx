import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

const SEASONS = [
  {
    id: 'kharif',
    name: 'Kharif (Monsoon)',
    icon: 'fa-cloud-showers-heavy',
    color: '#10b981',
    bg: 'rgba(16, 185, 129, 0.12)',
    border: 'rgba(16, 185, 129, 0.4)',
    sowing: 'June – July',
    harvest: 'September – October',
    sowMonths: [5, 6],
    growMonths: [7, 8],
    harvestMonths: [9, 10],
    crops: [
      { name: 'Rice / Paddy', duration: '90–150 days', water: 'High', soil: 'Clay, Clay-Loam', rotation: 'Wheat (Rabi) → Moong (Zaid)' },
      { name: 'Maize / Corn', duration: '85–100 days', water: 'Medium', soil: 'Loamy, Sandy-Loam', rotation: 'Mustard (Rabi) → Potato (Rabi)' },
      { name: 'Cotton', duration: '150–180 days', water: 'Medium', soil: 'Black Cotton Soil', rotation: 'Sunflower (Zaid) → Wheat (Rabi)' },
      { name: 'Groundnut / Peanut', duration: '90–120 days', water: 'Medium', soil: 'Sandy, Sandy-Loam', rotation: 'Wheat (Rabi) → Groundnut → Soybean' },
      { name: 'Soybean', duration: '90–110 days', water: 'Medium', soil: 'Loamy, Clay-Loam', rotation: 'Wheat (Rabi) → Soybean → Maize' },
      { name: 'Sugarcane', duration: '300–365 days', water: 'Very High', soil: 'Deep Loam, Alluvial', rotation: 'Ratoon crop or Pulse crop' },
      { name: 'Pearl Millet / Bajra', duration: '65–90 days', water: 'Low', soil: 'Sandy, Sandy-Loam', rotation: 'Mustard (Rabi) → Fallow (Zaid)' },
      { name: 'Sorghum / Jowar', duration: '90–120 days', water: 'Low', soil: 'Medium Black, Loam', rotation: 'Gram (Rabi) → Fallow (Zaid)' },
      { name: 'Moong / Green Gram', duration: '55–70 days', water: 'Low', soil: 'Sandy-Loam, Loam', rotation: 'Wheat (Rabi) → Moong → Rice (Kharif)' },
      { name: 'Urad / Black Gram', duration: '60–75 days', water: 'Low-Medium', soil: 'Loam, Clay-Loam', rotation: 'Wheat (Rabi) → Urad → Wheat' },
      { name: 'Pigeon Pea / Arhar', duration: '150–200 days', water: 'Low', soil: 'Sandy-Loam, Loam', rotation: 'Sorghum (Kharif intercrop) → Wheat (Rabi)' },
      { name: 'Sesame / Til', duration: '70–90 days', water: 'Low', soil: 'Sandy-Loam, Well-Drained', rotation: 'Chickpea (Rabi) → Sesame → Rice' },
      { name: 'Turmeric', duration: '240–270 days', water: 'High', soil: 'Loam, Clay-Loam, Rich Organic', rotation: 'Perennial / Rotation with Maize or Banana' },
      { name: 'Ginger', duration: '210–240 days', water: 'High', soil: 'Sandy-Loam, Well-Drained', rotation: 'Rotation every 3–4 years with Cereal crops' },
      { name: 'Castor', duration: '140–180 days', water: 'Low-Medium', soil: 'Sandy-Loam, Red Soil', rotation: 'Pulse (Rabi) → Castor → Groundnut' },
      { name: 'Cluster Bean / Guar', duration: '75–90 days', water: 'Low', soil: 'Sandy-Loam, Arid Soil', rotation: 'Barley (Rabi) → Guar → Wheat' },
      { name: 'Okra / Bhindi', duration: '45–65 days', water: 'Medium', soil: 'Loamy, Sandy-Loam', rotation: 'Potato (Rabi) → Okra → Peas (Rabi)' },
      { name: 'Chilli / Red Pepper', duration: '120–150 days', water: 'Medium', soil: 'Sandy-Loam, Loam', rotation: 'Onion (Rabi) → Chilli → Wheat' },
    ]
  },
  {
    id: 'rabi',
    name: 'Rabi (Winter)',
    icon: 'fa-snowflake',
    color: '#38bdf8',
    bg: 'rgba(56, 189, 248, 0.1)',
    border: 'rgba(56, 189, 248, 0.4)',
    sowing: 'October – November',
    harvest: 'February – April',
    sowMonths: [9, 10],
    growMonths: [11, 0],
    harvestMonths: [1, 2, 3],
    crops: [
      { name: 'Wheat', duration: '100–130 days', water: 'Medium', soil: 'Loamy, Clay-Loam', rotation: 'Rice (Kharif) → Wheat → Moong (Zaid)' },
      { name: 'Mustard / Rapeseed', duration: '90–110 days', water: 'Low', soil: 'Sandy-Loam, Loam', rotation: 'Pearl Millet (Kharif) → Mustard → Fallow' },
      { name: 'Gram / Chickpea', duration: '90–120 days', water: 'Low', soil: 'Sandy-Loam, Red Soil', rotation: 'Rice (Kharif) → Chickpea → Sesame' },
      { name: 'Barley', duration: '85–100 days', water: 'Low', soil: 'Sandy-Loam, Loam', rotation: 'Cluster Bean (Kharif) → Barley → Fallow' },
      { name: 'Peas / Field Peas', duration: '70–90 days', water: 'Low-Medium', soil: 'Loam, Sandy-Loam', rotation: 'Maize (Kharif) → Peas → Toria' },
      { name: 'Potato', duration: '70–90 days', water: 'Medium', soil: 'Sandy-Loam, Loam', rotation: 'Paddy (Kharif) → Potato → Sunflower (Zaid)' },
      { name: 'Lentil / Masoor Dal', duration: '90–110 days', water: 'Low', soil: 'Sandy-Loam, Loam', rotation: 'Sorghum (Kharif) → Lentil → Sesame (Zaid)' },
      { name: 'Sunflower (Rabi)', duration: '90–110 days', water: 'Low-Medium', soil: 'Any Well-Drained', rotation: 'Soybean (Kharif) → Sunflower → Mung Bean' },
      { name: 'Coriander / Dhania', duration: '60–90 days', water: 'Low-Medium', soil: 'Sandy-Loam, Loam', rotation: 'Sorghum (Kharif) → Coriander → Moong' },
      { name: 'Fenugreek / Methi', duration: '100–130 days', water: 'Low', soil: 'Sandy-Loam, Clay-Loam', rotation: 'Cotton (Kharif) → Methi → Okra' },
      { name: 'Onion (Rabi)', duration: '120–150 days', water: 'Medium', soil: 'Sandy-Loam, Loam', rotation: 'Rice (Kharif) → Onion → Watermelon (Zaid)' },
      { name: 'Garlic', duration: '120–150 days', water: 'Medium', soil: 'Sandy-Loam, Well-Drained', rotation: 'Soybean (Kharif) → Garlic → Cucumber (Zaid)' },
      { name: 'Cauliflower / Cabbage', duration: '60–90 days', water: 'Medium', soil: 'Loamy, Clay-Loam, Fertile', rotation: 'Maize (Kharif) → Cauliflower → Moong (Zaid)' },
      { name: 'Safflower', duration: '130–160 days', water: 'Very Low', soil: 'Deep Black, Clay-Loam', rotation: 'Sorghum (Kharif) → Safflower → Groundnut' },
      { name: 'Linseed / Flaxseed', duration: '110–130 days', water: 'Low', soil: 'Loam, Clay-Loam', rotation: 'Sorghum (Kharif) → Linseed → Moong (Zaid)' },
      { name: 'Toria / Rapeseed', duration: '70–85 days', water: 'Low', soil: 'Sandy-Loam, Loam', rotation: 'Early Kharif → Toria → Wheat (Late Rabi)' },
    ]
  },
  {
    id: 'zaid',
    name: 'Zaid (Summer)',
    icon: 'fa-sun',
    color: '#fbbf24',
    bg: 'rgba(251, 191, 36, 0.1)',
    border: 'rgba(251, 191, 36, 0.4)',
    sowing: 'March – April',
    harvest: 'May – June',
    sowMonths: [2, 3],
    growMonths: [4],
    harvestMonths: [5, 6],
    crops: [
      { name: 'Watermelon', duration: '60–90 days', water: 'Medium', soil: 'Sandy-Loam, Light Soil', rotation: 'Wheat (Rabi) → Watermelon → Maize (Kharif)' },
      { name: 'Cucumber', duration: '50–70 days', water: 'Medium', soil: 'Loam, Sandy-Loam', rotation: 'Wheat (Rabi) → Cucumber → Tomato (Kharif)' },
      { name: 'Sunflower (Zaid)', duration: '75–100 days', water: 'Medium', soil: 'Any Well-Drained', rotation: 'Gram (Rabi) → Sunflower → Soybean (Kharif)' },
      { name: 'Moong / Green Gram', duration: '55–70 days', water: 'Low', soil: 'Sandy-Loam, Loam', rotation: 'Wheat (Rabi) → Moong → Rice (Kharif)' },
      { name: 'Bitter Gourd / Karela', duration: '55–75 days', water: 'Medium', soil: 'Loam, Sandy-Loam', rotation: 'Wheat (Rabi) → Karela → Cabbage (Rabi)' },
      { name: 'Bottle Gourd / Lauki', duration: '50–70 days', water: 'Medium', soil: 'Loamy, Fertile', rotation: 'Potato (Rabi) → Lauki → Maize (Kharif)' },
      { name: 'Muskmelon / Kharbooza', duration: '70–90 days', water: 'Low-Medium', soil: 'Sandy-Loam', rotation: 'Wheat (Rabi) → Muskmelon → Paddy' },
      { name: 'Sponge Gourd / Tori', duration: '50–65 days', water: 'Medium', soil: 'Loam, Sandy-Loam', rotation: 'Wheat (Rabi) → Sponge Gourd → Okra (Kharif)' },
      { name: 'Pumpkin / Kaddu', duration: '60–80 days', water: 'Medium', soil: 'Loamy, Well-Drained', rotation: 'Rabi Crop → Pumpkin → Soybean (Kharif)' },
      { name: 'Cowpea / Lobia', duration: '60–75 days', water: 'Low-Medium', soil: 'Sandy-Loam, Loam', rotation: 'Wheat (Rabi) → Cowpea → Rice (Kharif)' },
      { name: 'Urad / Black Gram (Zaid)', duration: '60–75 days', water: 'Low', soil: 'Sandy-Loam, Loam', rotation: 'Wheat (Rabi) → Urad → Cotton (Kharif)' },
      { name: 'Marigold (Zaid)', duration: '60–90 days', water: 'Medium', soil: 'Sandy-Loam, Any Fertile', rotation: 'Vegetable → Marigold (Break Crop) → Vegetables' },
      { name: 'Sesame / Til', duration: '70–90 days', water: 'Low', soil: 'Sandy-Loam, Well-Drained', rotation: 'Chickpea (Rabi) → Sesame → Paddy (Kharif)' },
      { name: 'Fodder Sorghum / Napier', duration: '40–60 days', water: 'Medium', soil: 'Any Fertile Soil', rotation: 'Seasonal Fodder Rotation' },
    ]
  }
];

function MonthBar({ season }) {
  return (
    <div style={{ display: 'flex', gap: '3px', marginTop: '12px', flexWrap: 'nowrap', overflowX: 'auto' }}>
      {MONTHS.map((m, idx) => {
        const isSow = season.sowMonths.includes(idx);
        const isGrow = season.growMonths.includes(idx);
        const isHarvest = season.harvestMonths.includes(idx);
        let bg = 'rgba(255,255,255,0.05)';
        let label = '';
        let textColor = 'var(--text-secondary)';
        if (isSow) { bg = season.color; textColor = '#000'; label = 'Sow'; }
        else if (isHarvest) { bg = '#f97316'; textColor = '#000'; label = 'Harv'; }
        else if (isGrow) { bg = 'rgba(74, 222, 128, 0.3)'; textColor = 'var(--primary-light)'; label = 'Grow'; }

        return (
          <div key={m} style={{
            flex: '1', minWidth: '28px', textAlign: 'center', padding: '6px 2px',
            borderRadius: '6px', background: bg, color: textColor,
            fontSize: '0.62rem', fontWeight: 'bold', flexShrink: 0
          }}>
            <div>{m}</div>
            {label && <div style={{ fontSize: '0.55rem', opacity: 0.9 }}>{label}</div>}
          </div>
        );
      })}
    </div>
  );
}

export function PlannerTab() {
  const { crop: activeCrop, lang } = useApp();
  const [selectedSeason, setSelectedSeason] = useState('kharif');
  const [selectedCrop, setSelectedCrop] = useState(null);
  const [activePlanView, setActivePlanView] = useState('calendar'); // 'calendar' | 'rotation'

  const season = SEASONS.find(s => s.id === selectedSeason);

  return (
    <div className="tab-panel active">

      {/* Header */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(56, 189, 248, 0.12) 0%, rgba(10, 24, 17, 0.95) 100%)',
        border: '1px solid rgba(56, 189, 248, 0.3)', borderRadius: '16px',
        padding: '22px 24px', marginBottom: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '14px'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 6px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-calendar-days" style={{ color: '#38bdf8' }}></i>
            Seasonal Sowing Calendar &amp; Crop Rotation Engine
          </h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Plan multi-crop rotations to optimize nitrogen fixation and reduce pest vector risk.
          </p>
        </div>

        {/* View Toggle */}
        <div style={{ display: 'flex', gap: '8px' }}>
          <button type="button" onClick={() => setActivePlanView('calendar')} style={{
            padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 'bold',
            border: '1.5px solid', cursor: 'pointer',
            background: activePlanView === 'calendar' ? '#38bdf8' : 'transparent',
            color: activePlanView === 'calendar' ? '#000' : '#38bdf8',
            borderColor: '#38bdf8'
          }}>
            <i className="fa-solid fa-calendar" style={{ marginRight: '6px' }}></i>Calendar
          </button>
          <button type="button" onClick={() => setActivePlanView('rotation')} style={{
            padding: '8px 16px', borderRadius: '10px', fontSize: '0.85rem', fontWeight: 'bold',
            border: '1.5px solid', cursor: 'pointer',
            background: activePlanView === 'rotation' ? '#10b981' : 'transparent',
            color: activePlanView === 'rotation' ? '#000' : '#10b981',
            borderColor: '#10b981'
          }}>
            <i className="fa-solid fa-arrows-rotate" style={{ marginRight: '6px' }}></i>Rotation Plan
          </button>
        </div>
      </div>

      {activePlanView === 'calendar' && (
        <>
          {/* Season Tabs */}
          <div style={{ display: 'flex', gap: '10px', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
            {SEASONS.map(s => (
              <button key={s.id} type="button" onClick={() => { setSelectedSeason(s.id); setSelectedCrop(null); }}
                style={{
                  padding: '10px 20px', borderRadius: '12px', fontSize: '0.9rem', fontWeight: 'bold',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '8px',
                  background: selectedSeason === s.id ? s.color : 'rgba(255,255,255,0.05)',
                  color: selectedSeason === s.id ? '#000' : s.color,
                  border: `2px solid ${s.color}`,
                  boxShadow: selectedSeason === s.id ? `0 4px 16px ${s.color}55` : 'none',
                  transition: 'all 0.2s ease'
                }}>
                <i className={`fa-solid ${s.icon}`}></i> {s.name}
              </button>
            ))}
          </div>

          {/* Month Timeline Bar */}
          <div style={{
            background: 'rgba(10, 24, 17, 0.9)', border: `1px solid ${season.border}`,
            borderRadius: '14px', padding: '18px 20px', marginBottom: '1.5rem'
          }}>
            <h4 style={{ margin: '0 0 4px 0', color: season.color, fontWeight: 'bold' }}>
              <i className={`fa-solid ${season.icon}`} style={{ marginRight: '8px' }}></i>
              {season.name} — Sowing: {season.sowing} | Harvest: {season.harvest}
            </h4>
            <p style={{ margin: '0 0 8px 0', fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
              <span style={{ background: season.color, color: '#000', padding: '2px 8px', borderRadius: '6px', marginRight: '6px', fontSize: '0.7rem', fontWeight: 'bold' }}>Sowing</span>
              <span style={{ background: 'rgba(74,222,128,0.3)', color: 'var(--primary-light)', padding: '2px 8px', borderRadius: '6px', marginRight: '6px', fontSize: '0.7rem', fontWeight: 'bold' }}>Growing</span>
              <span style={{ background: '#f97316', color: '#000', padding: '2px 8px', borderRadius: '6px', fontSize: '0.7rem', fontWeight: 'bold' }}>Harvest</span>
            </p>
            <MonthBar season={season} />
          </div>

          {/* Crop Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(300px, 1fr))', gap: '16px' }}>
            {season.crops.map((crop, idx) => {
              const isSelected = selectedCrop === idx;
              return (
                <div key={idx}
                  onClick={() => setSelectedCrop(isSelected ? null : idx)}
                  style={{
                    background: isSelected ? season.bg : 'rgba(10, 24, 17, 0.85)',
                    border: `1.5px solid ${isSelected ? season.color : 'rgba(255,255,255,0.1)'}`,
                    borderRadius: '14px', padding: '18px',
                    cursor: 'pointer', transition: 'all 0.25s ease',
                    boxShadow: isSelected ? `0 6px 20px ${season.color}44` : 'none'
                  }}>
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '10px' }}>
                    <h3 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 'bold', color: 'white' }}>
                      <i className="fa-solid fa-seedling" style={{ color: season.color, marginRight: '8px' }}></i>
                      {crop.name}
                    </h3>
                    <i className={`fa-solid fa-chevron-${isSelected ? 'up' : 'down'}`} style={{ color: 'var(--text-secondary)', fontSize: '0.8rem' }}></i>
                  </div>

                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#94a3b8' }}>
                      <i className="fa-solid fa-clock" style={{ marginRight: '4px' }}></i>{crop.duration}
                    </span>
                    <span style={{ background: 'rgba(56,189,248,0.15)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#38bdf8' }}>
                      <i className="fa-solid fa-droplet" style={{ marginRight: '4px' }}></i>Water: {crop.water}
                    </span>
                  </div>

                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)' }}>
                    <i className="fa-solid fa-mountain" style={{ marginRight: '6px', color: '#a78bfa' }}></i>
                    Soil: {crop.soil}
                  </p>

                  {/* Expanded Details */}
                  {isSelected && (
                    <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${season.color}44` }}>
                      <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '12px' }}>
                        <p style={{ margin: '0 0 6px 0', fontWeight: 'bold', color: season.color, fontSize: '0.85rem' }}>
                          <i className="fa-solid fa-arrows-rotate" style={{ marginRight: '6px' }}></i>Recommended Rotation Sequence:
                        </p>
                        <p style={{ margin: 0, fontSize: '0.88rem', color: '#e2e8f0', lineHeight: '1.6' }}>
                          {crop.rotation}
                        </p>
                      </div>
                      <div style={{ marginTop: '10px', display: 'flex', gap: '8px' }}>
                        <div style={{ flex: 1, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '10px', textAlign: 'center', fontSize: '0.8rem' }}>
                          <div style={{ color: 'var(--primary-light)', fontWeight: 'bold', marginBottom: '2px' }}>{season.sowing}</div>
                          <div style={{ color: 'var(--text-secondary)' }}>Sowing Window</div>
                        </div>
                        <div style={{ flex: 1, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '8px', padding: '10px', textAlign: 'center', fontSize: '0.8rem' }}>
                          <div style={{ color: '#fb923c', fontWeight: 'bold', marginBottom: '2px' }}>{season.harvest}</div>
                          <div style={{ color: 'var(--text-secondary)' }}>Harvest Window</div>
                        </div>
                      </div>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </>
      )}

      {activePlanView === 'rotation' && (
        <div>
          {/* Rotation Plan View */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {/* Common Rotation Patterns */}
            {[
              {
                title: 'North India — Wheat-Paddy Belt',
                icon: 'fa-wheat-awn', color: '#fbbf24',
                steps: [
                  { season: 'Kharif', crop: 'Paddy (Rice)', months: 'Jun – Oct', icon: 'fa-seedling', color: '#10b981' },
                  { season: 'Rabi', crop: 'Wheat', months: 'Nov – Apr', icon: 'fa-seedling', color: '#38bdf8' },
                  { season: 'Zaid', crop: 'Moong / Fallow', months: 'Apr – Jun', icon: 'fa-seedling', color: '#fbbf24' }
                ],
                benefit: 'Classic Punjab/Haryana rotation. Maintains soil organic matter. Moong in Zaid adds 20–40 kg N/ha.'
              },
              {
                title: 'Central India — Cotton-Wheat Belt',
                icon: 'fa-circle-nodes', color: '#a78bfa',
                steps: [
                  { season: 'Kharif', crop: 'Cotton / Soybean', months: 'Jun – Nov', icon: 'fa-seedling', color: '#10b981' },
                  { season: 'Rabi', crop: 'Wheat / Gram', months: 'Nov – Mar', icon: 'fa-seedling', color: '#38bdf8' },
                  { season: 'Zaid', crop: 'Sunflower / Fallow', months: 'Mar – Jun', icon: 'fa-seedling', color: '#fbbf24' }
                ],
                benefit: 'Reduces Bollworm pressure. Soybean fixes 80–120 kg N/ha. Sunflower breaks pest cycles effectively.'
              },
              {
                title: 'South India — Rice-Rice-Pulse',
                icon: 'fa-layer-group', color: '#34d399',
                steps: [
                  { season: 'Kharif I', crop: 'Paddy (Samba)', months: 'Jun – Oct', icon: 'fa-seedling', color: '#10b981' },
                  { season: 'Rabi', crop: 'Paddy (Rabi)', months: 'Nov – Feb', icon: 'fa-seedling', color: '#38bdf8' },
                  { season: 'Zaid', crop: 'Black Gram / Cowpea', months: 'Feb – May', icon: 'fa-seedling', color: '#fbbf24' }
                ],
                benefit: 'Tamil Nadu / Andhra rotation. Pulse fixes N naturally reducing fertilizer cost by 30–40%.'
              },
              {
                title: 'Vegetable Farmer — Year-Round',
                icon: 'fa-carrot', color: '#f87171',
                steps: [
                  { season: 'Kharif', crop: 'Tomato / Chilli / Brinjal', months: 'Jun – Sep', icon: 'fa-seedling', color: '#10b981' },
                  { season: 'Rabi', crop: 'Potato / Cauliflower / Peas', months: 'Oct – Feb', icon: 'fa-seedling', color: '#38bdf8' },
                  { season: 'Zaid', crop: 'Cucumber / Bottle Gourd', months: 'Mar – Jun', icon: 'fa-seedling', color: '#fbbf24' }
                ],
                benefit: 'High-income rotation for market-gardening farmers. Crop diversity reduces soil pathogen buildup.'
              }
            ].map((plan, idx) => (
              <div key={idx} style={{
                background: 'rgba(10, 24, 17, 0.9)',
                border: `1.5px solid rgba(255,255,255,0.12)`,
                borderRadius: '16px', padding: '20px'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.05rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className={`fa-solid ${plan.icon}`} style={{ color: plan.color }}></i>
                  {plan.title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '16px' }}>
                  {plan.steps.map((step, si) => (
                    <div key={si} style={{ display: 'flex', alignItems: 'center', gap: '10px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 14px' }}>
                      <div style={{ width: '28px', height: '28px', borderRadius: '50%', background: step.color, display: 'flex', alignItems: 'center', justifyContent: 'center', flexShrink: 0 }}>
                        <i className={`fa-solid ${step.icon}`} style={{ color: '#000', fontSize: '0.75rem' }}></i>
                      </div>
                      <div style={{ flex: 1 }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.88rem', color: 'white' }}>{step.crop}</div>
                        <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{step.season} | {step.months}</div>
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', borderLeft: `3px solid ${plan.color}` }}>
                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    <i className="fa-solid fa-circle-info" style={{ color: plan.color, marginRight: '6px' }}></i>
                    {plan.benefit}
                  </p>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
