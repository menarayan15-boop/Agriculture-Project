import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CROP_SEASONS_DATA, SOIL_TYPES_CATALOG } from '../../data/cropDetailsData';

const MONTHS = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];



function MonthBar({ season }) {
  return (
    <div style={{ display: 'flex', gap: '3px', marginTop: '12px', flexWrap: 'nowrap', overflowX: 'auto', paddingBottom: '4px' }}>
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
            flex: '1', minWidth: '32px', textAlign: 'center', padding: '7px 2px',
            borderRadius: '6px', background: bg, color: textColor,
            fontSize: '0.65rem', fontWeight: 'bold', flexShrink: 0,
            transition: 'all 0.2s ease'
          }}>
            <div>{m}</div>
            {label && <div style={{ fontSize: '0.55rem', opacity: 0.95, marginTop: '2px' }}>{label}</div>}
          </div>
        );
      })}
    </div>
  );
}

export function PlannerTab() {
  const { lang } = useApp();
  const [selectedSeason, setSelectedSeason] = useState('kharif');
  const [selectedCropId, setSelectedCropId] = useState(null);
  const [activePlanView, setActivePlanView] = useState('calendar'); // 'calendar' | 'rotation' | 'soils'

  // Search & Filters
  const [searchQuery, setSearchQuery] = useState('');
  const [filterSoil, setFilterSoil] = useState('all');
  const [filterWater, setFilterWater] = useState('all');
  const [filterCategory, setFilterCategory] = useState('all');

  const season = CROP_SEASONS_DATA.find(s => s.id === selectedSeason) || CROP_SEASONS_DATA[0];

  // Filter crops based on search and dropdown filters
  const filteredCrops = useMemo(() => {
    if (!season || !season.crops) return [];
    return season.crops.filter(crop => {
      const name = crop.name || '';
      const hindiName = crop.hindiName || '';
      const soil = crop.soil || '';
      const climateType = crop.climate?.climateType || '';

      const matchSearch = !searchQuery.trim() ||
        name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        hindiName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        soil.toLowerCase().includes(searchQuery.toLowerCase()) ||
        climateType.toLowerCase().includes(searchQuery.toLowerCase());

      const matchSoil = filterSoil === 'all' ||
        soil.toLowerCase().includes(filterSoil.toLowerCase());

      const matchWater = filterWater === 'all' ||
        (crop.water && crop.water.toLowerCase().includes(filterWater.toLowerCase()));

      const matchCategory = filterCategory === 'all' ||
        (crop.category && crop.category.toLowerCase().includes(filterCategory.toLowerCase()));

      return matchSearch && matchSoil && matchWater && matchCategory;
    });
  }, [season, searchQuery, filterSoil, filterWater, filterCategory]);

  return (
    <div className="tab-panel active" style={{ animation: 'fadeIn 0.3s ease' }}>

      {/* Header Banner */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(16, 185, 129, 0.15) 0%, rgba(10, 24, 17, 0.95) 100%)',
        border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '18px',
        padding: '24px 26px', marginBottom: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.25)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 6px 0', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-calendar-days" style={{ color: '#38bdf8' }}></i>
            Crop Sowing Calendar &amp; Rotation Engine
          </h2>
          <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            Plan multi-crop rotations with detailed agronomic schedules, seed rates, fertilizer dosages, and pest defense protocols.
          </p>
        </div>

        {/* View Toggle Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setActivePlanView('calendar')} style={{
            padding: '9px 16px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 'bold',
            border: '1.5px solid #10b981', cursor: 'pointer',
            background: activePlanView === 'calendar' ? '#10b981' : 'transparent',
            color: activePlanView === 'calendar' ? '#000' : '#10b981',
            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <i className="fa-solid fa-calendar-days"></i> Seasonal Crops
          </button>
          <button type="button" onClick={() => setActivePlanView('soils')} style={{
            padding: '9px 16px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 'bold',
            border: '1.5px solid #a78bfa', cursor: 'pointer',
            background: activePlanView === 'soils' ? '#a78bfa' : 'transparent',
            color: activePlanView === 'soils' ? '#000' : '#a78bfa',
            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <i className="fa-solid fa-mountain"></i> Soil Types Guide
          </button>
          <button type="button" onClick={() => setActivePlanView('rotation')} style={{
            padding: '9px 16px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 'bold',
            border: '1.5px solid #38bdf8', cursor: 'pointer',
            background: activePlanView === 'rotation' ? '#38bdf8' : 'transparent',
            color: activePlanView === 'rotation' ? '#000' : '#38bdf8',
            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <i className="fa-solid fa-arrows-rotate"></i> Rotation Engine
          </button>
        </div>
      </div>

      {/* VIEW 1: SEASONAL CROPS CALENDAR */}
      {activePlanView === 'calendar' && (
        <>
          {/* Season Switcher Tabs */}
          <div style={{ display: 'flex', gap: '12px', marginBottom: '1.25rem', flexWrap: 'wrap' }}>
            {CROP_SEASONS_DATA.map(s => (
              <button key={s.id} type="button"
                onClick={() => { setSelectedSeason(s.id); setSelectedCropId(null); }}
                style={{
                  padding: '12px 22px', borderRadius: '14px', fontSize: '0.95rem', fontWeight: 'bold',
                  cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '10px',
                  background: selectedSeason === s.id ? s.color : 'rgba(10, 24, 17, 0.7)',
                  color: selectedSeason === s.id ? '#000000' : s.color,
                  border: `2px solid ${s.color}`,
                  boxShadow: selectedSeason === s.id ? `0 6px 22px ${s.color}66` : 'none',
                  transform: selectedSeason === s.id ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.25s ease'
                }}>
                <i className={`fa-solid ${s.icon}`}></i> {s.name} ({s.crops.length} Crops)
              </button>
            ))}
          </div>

          {/* Month Timeline Bar */}
          <div style={{
            background: 'rgba(10, 24, 17, 0.95)', border: `1.5px solid ${season.border}`,
            borderRadius: '16px', padding: '18px 22px', marginBottom: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
              <h4 style={{ margin: 0, color: season.color, fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className={`fa-solid ${season.icon}`}></i>
                {season.name} — Sowing: {season.sowing} | Harvest: {season.harvest}
              </h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ background: season.color, color: '#000', padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 'bold' }}>Sowing Window</span>
                <span style={{ background: 'rgba(74,222,128,0.3)', color: 'var(--primary-light)', padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 'bold' }}>Active Growth</span>
                <span style={{ background: '#f97316', color: '#000', padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 'bold' }}>Harvest Window</span>
              </div>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#94a3b8' }}>
              {season.description}
            </p>
            <MonthBar season={season} />
          </div>

          {/* Search & Filter Bar */}
          <div style={{
            background: 'rgba(15, 23, 42, 0.65)', border: '1px solid rgba(255, 255, 255, 0.1)',
            borderRadius: '14px', padding: '14px 18px', marginBottom: '1.5rem',
            display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center'
          }}>
            {/* Search input */}
            <div style={{ flex: '2', minWidth: '220px', position: 'relative' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#64748b' }}></i>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search crop, soil (e.g. Clay, Sandy-Loam), or climate..."
                style={{
                  width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white', fontSize: '0.88rem', outline: 'none'
                }}
              />
            </div>

            {/* Soil Filter */}
            <div style={{ flex: '1', minWidth: '150px' }}>
              <select
                value={filterSoil}
                onChange={e => setFilterSoil(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white', fontSize: '0.85rem', outline: 'none', cursor: 'pointer'
                }}>
                <option value="all">🏔️ All Soil Types</option>
                <option value="clay">Clay &amp; Clay-Loam</option>
                <option value="loam">Loamy Soil</option>
                <option value="sandy">Sandy &amp; Sandy-Loam</option>
                <option value="black">Black Cotton Soil</option>
                <option value="alluvial">Alluvial Soil</option>
                <option value="red">Red Soil</option>
              </select>
            </div>

            {/* Water Filter */}
            <div style={{ flex: '1', minWidth: '140px' }}>
              <select
                value={filterWater}
                onChange={e => setFilterWater(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white', fontSize: '0.85rem', outline: 'none', cursor: 'pointer'
                }}>
                <option value="all">💧 All Water Levels</option>
                <option value="low">Low Water</option>
                <option value="medium">Medium Water</option>
                <option value="high">High Water</option>
                <option value="very high">Very High Water</option>
              </select>
            </div>

            {/* Category Filter */}
            <div style={{ flex: '1', minWidth: '140px' }}>
              <select
                value={filterCategory}
                onChange={e => setFilterCategory(e.target.value)}
                style={{
                  width: '100%', padding: '9px 12px', borderRadius: '8px',
                  background: 'rgba(0, 0, 0, 0.4)', border: '1px solid rgba(255, 255, 255, 0.15)',
                  color: 'white', fontSize: '0.85rem', outline: 'none', cursor: 'pointer'
                }}>
                <option value="all">🌾 All Crop Categories</option>
                <option value="cereal">Cereals &amp; Millets</option>
                <option value="pulse">Pulses &amp; Legumes</option>
                <option value="oilseed">Oilseeds</option>
                <option value="vegetable">Vegetables</option>
                <option value="cucurbit">Gourds &amp; Melons</option>
                <option value="spice">Spices</option>
                <option value="cash">Cash &amp; Commercial</option>
              </select>
            </div>

            {(searchQuery || filterSoil !== 'all' || filterWater !== 'all' || filterCategory !== 'all') && (
              <button
                type="button"
                onClick={() => { setSearchQuery(''); setFilterSoil('all'); setFilterWater('all'); setFilterCategory('all'); }}
                style={{
                  padding: '9px 14px', borderRadius: '8px', background: 'rgba(239, 68, 68, 0.15)',
                  color: '#f87171', border: '1px solid rgba(239, 68, 68, 0.3)', fontSize: '0.82rem',
                  cursor: 'pointer', fontWeight: 'bold'
                }}>
                <i className="fa-solid fa-xmark"></i> Clear
              </button>
            )}
          </div>

          {/* Results Count */}
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#94a3b8' }}>
              Showing <strong style={{ color: 'white' }}>{filteredCrops.length}</strong> crop(s) for <strong style={{ color: season.color }}>{season.name}</strong>
            </span>
            <span style={{ fontSize: '0.8rem', color: '#64748b' }}>
              💡 Click any crop card to view in-depth soil, climate, irrigation, NPK &amp; yield metrics
            </span>
          </div>

          {/* Crop Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(320px, 1fr))', gap: '16px', alignItems: 'start' }}>
            {filteredCrops.map((crop, idx) => {
              const cropId = crop.id || `crop-${idx}`;
              const isSelected = selectedCropId === cropId;

              const seedRate = crop.agronomy?.seedRate || crop.seedRate;
              const spacing = crop.agronomy?.spacing || crop.spacing;
              const yieldBench = crop.agronomy?.expectedYield || crop.yieldBenchmark;
              const nutrientInfo = crop.nutrients?.npk || crop.nutrientReq;
              const waterPhases = crop.irrigation?.criticalStages || crop.irrigationPhases;
              const rotationSeq = crop.agronomy?.rotation || crop.rotation;
              const rotBenefit = crop.rotationBenefit || (crop.agronomy?.companion ? `Companion: ${crop.agronomy.companion}` : null);
              const pestInfo = crop.pestAlert || (crop.pestsAndDiseases ? `${crop.pestsAndDiseases.pests} — ${crop.pestsAndDiseases.management}` : null);
              const harvestSign = crop.harvestIndicator;

              return (
                <div key={cropId}
                  onClick={() => setSelectedCropId(isSelected ? null : cropId)}
                  style={{
                    gridColumn: isSelected ? '1 / -1' : 'auto',
                    alignSelf: 'start',
                    background: isSelected ? 'rgba(15, 30, 22, 0.95)' : 'rgba(10, 24, 17, 0.85)',
                    border: `1.5px solid ${isSelected ? season.color : 'rgba(255,255,255,0.12)'}`,
                    borderRadius: '16px', padding: '20px',
                    cursor: 'pointer', transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected ? `0 8px 30px ${season.color}33` : '0 4px 15px rgba(0,0,0,0.2)',
                    position: 'relative', overflow: 'hidden'
                  }}>

                  {/* Category Pill */}
                  {crop.category && (
                    <div style={{
                      position: 'absolute', top: '16px', right: '42px',
                      background: 'rgba(255,255,255,0.08)', color: '#cbd5e1',
                      padding: '2px 9px', borderRadius: '12px', fontSize: '0.68rem',
                      fontWeight: '600', letterSpacing: '0.5px', textTransform: 'uppercase'
                    }}>
                      {crop.category}
                    </div>
                  )}

                  {/* Top Row: Crop Name & Chevron */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-seedling" style={{ color: season.color }}></i>
                        {crop.name}
                      </h3>
                      {crop.hindiName && (
                        <div style={{ fontSize: '0.82rem', color: '#a7f3d0', marginTop: '2px' }}>
                          {crop.hindiName}
                        </div>
                      )}
                    </div>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: isSelected ? season.color : 'rgba(255,255,255,0.06)',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isSelected ? '#000' : 'var(--text-secondary)',
                      fontSize: '0.8rem', transition: 'all 0.2s ease', flexShrink: 0
                    }}>
                      <i className="fa-solid fa-chevron-down" style={{ transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.35s ease' }}></i>
                    </div>
                  </div>

                  {/* Summary Badges */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span style={{ background: 'rgba(255,255,255,0.08)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#94a3b8' }}>
                      <i className="fa-solid fa-clock" style={{ marginRight: '4px' }}></i>{crop.duration}
                    </span>
                    <span style={{
                      background: crop.water === 'High' || crop.water === 'Very High' ? 'rgba(56,189,248,0.2)' : 'rgba(56,189,248,0.1)',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#38bdf8',
                      display: 'flex', alignItems: 'center', gap: '5px'
                    }}>
                      <i className="fa-solid fa-droplet"></i> Water: {crop.water}
                    </span>
                    {yieldBench && (
                      <span style={{ background: 'rgba(168,85,247,0.15)', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#c084fc' }}>
                        <i className="fa-solid fa-wheat-awn" style={{ marginRight: '4px' }}></i>Yield: {yieldBench}
                      </span>
                    )}
                  </div>

                  <p style={{ margin: 0, fontSize: '0.82rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
                    <i className="fa-solid fa-mountain" style={{ marginRight: '6px', color: '#a78bfa' }}></i>
                    <strong>Soil:</strong> {crop.soilDetails?.bestType || crop.soil}
                  </p>

                  {/* Smooth Accordion Dropdown Container */}
                  <div style={{
                    display: 'grid',
                    gridTemplateRows: isSelected ? '1fr' : '0fr',
                    transition: 'grid-template-rows 0.35s cubic-bezier(0.4, 0, 0.2, 1), opacity 0.3s ease',
                    opacity: isSelected ? 1 : 0
                  }}>
                    <div style={{ overflow: 'hidden' }}>
                      <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: `1px solid ${season.color}44`, display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>

                        {/* Seed & Spacing Info */}
                        {(seedRate || spacing) && (
                          <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                            {seedRate && (
                              <div style={{ marginBottom: '4px', color: '#e2e8f0' }}>
                                <strong style={{ color: '#facc15' }}>🌱 Seed Rate:</strong> {seedRate}
                              </div>
                            )}
                            {spacing && (
                              <div style={{ color: '#e2e8f0' }}>
                                <strong style={{ color: '#38bdf8' }}>📏 Spacing:</strong> {spacing}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Nutrient Dosage */}
                        {nutrientInfo && (
                          <div style={{ background: 'rgba(16, 185, 129, 0.1)', border: '1px solid rgba(16, 185, 129, 0.3)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                            <strong style={{ color: '#34d399', display: 'block', marginBottom: '2px' }}>🧪 NPK Fertilizer Dosage:</strong>
                            <span style={{ color: '#fff' }}>{nutrientInfo}</span>
                          </div>
                        )}

                        {/* Critical Irrigation Stages */}
                        {waterPhases && (
                          <div style={{ background: 'rgba(56, 189, 248, 0.08)', border: '1px solid rgba(56, 189, 248, 0.25)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                            <strong style={{ color: '#38bdf8', display: 'block', marginBottom: '2px' }}>💧 Critical Water Stages:</strong>
                            <span style={{ color: '#cbd5e1' }}>{waterPhases}</span>
                          </div>
                        )}

                        {/* Rotation Benefit */}
                        {rotBenefit && (
                          <div style={{ background: 'rgba(250, 204, 21, 0.08)', border: '1px solid rgba(250, 204, 21, 0.25)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                            <strong style={{ color: '#facc15', display: 'block', marginBottom: '2px' }}>🔄 Rotation Agronomic Benefit:</strong>
                            <span style={{ color: '#fef08a' }}>{rotBenefit}</span>
                          </div>
                        )}

                        {/* Pest Alert & Prevention */}
                        {pestInfo && (
                          <div style={{ background: 'rgba(244, 63, 94, 0.1)', border: '1px solid rgba(244, 63, 94, 0.3)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                            <strong style={{ color: '#fb7185', display: 'block', marginBottom: '2px' }}>⚠️ Major Pests &amp; Defense:</strong>
                            <span style={{ color: '#ffe4e6' }}>{pestInfo}</span>
                          </div>
                        )}

                        {/* Harvest Indicator */}
                        {harvestSign && (
                          <div style={{ background: 'rgba(168, 85, 247, 0.1)', border: '1px solid rgba(168, 85, 247, 0.3)', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                            <strong style={{ color: '#c084fc', display: 'block', marginBottom: '2px' }}>🌾 Harvest Readiness Sign:</strong>
                            <span style={{ color: '#e9d5ff' }}>{harvestSign}</span>
                          </div>
                        )}

                        {/* Rotation Sequence */}
                        {rotationSeq && (
                          <div style={{ background: 'rgba(255,255,255,0.05)', borderRadius: '10px', padding: '10px 12px', gridColumn: '1 / -1' }}>
                            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: season.color, fontSize: '0.82rem' }}>
                              <i className="fa-solid fa-arrows-rotate" style={{ marginRight: '6px' }}></i>Recommended Rotation Sequence:
                            </p>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#e2e8f0', lineHeight: '1.4' }}>
                              {rotationSeq}
                            </p>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px', gridColumn: '1 / -1' }}>
                          <div style={{ flex: 1, background: 'rgba(16,185,129,0.1)', border: '1px solid rgba(16,185,129,0.3)', borderRadius: '8px', padding: '8px', textAlign: 'center', fontSize: '0.78rem' }}>
                            <div style={{ color: 'var(--primary-light)', fontWeight: 'bold', marginBottom: '2px' }}>{season.sowing}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Sowing Window</div>
                          </div>
                          <div style={{ flex: 1, background: 'rgba(249,115,22,0.1)', border: '1px solid rgba(249,115,22,0.3)', borderRadius: '8px', padding: '8px', textAlign: 'center', fontSize: '0.78rem' }}>
                            <div style={{ color: '#fb923c', fontWeight: 'bold', marginBottom: '2px' }}>{season.harvest}</div>
                            <div style={{ color: 'var(--text-secondary)' }}>Harvest Window</div>
                          </div>
                        </div>

                      </div>
                    </div>
                  </div>

                </div>
              );
            })}
          </div>
        </>
      )}

      {/* VIEW 2: SOIL TYPES GUIDE */}
      {activePlanView === 'soils' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'white', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-mountain" style={{ color: '#a78bfa' }}></i>
              Comprehensive Soil Catalog: Best Soil for Every Indian Crop
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Understand soil texture, pH parameters, water retention capabilities, and which crops thrive most profitably in each soil type.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {SOIL_TYPES_CATALOG.map((soil, idx) => (
              <div key={idx} style={{
                background: 'rgba(10, 24, 17, 0.9)',
                border: `1.5px solid ${soil.color}55`,
                borderRadius: '16px', padding: '22px',
                boxShadow: `0 6px 25px ${soil.color}22`
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: 'white' }}>
                      {soil.name}
                    </h4>
                    <div style={{ color: soil.color, fontSize: '0.85rem', fontWeight: '600' }}>
                      {soil.nameHi}
                    </div>
                  </div>
                  <span style={{
                    background: `${soil.color}22`, color: soil.color,
                    border: `1px solid ${soil.color}55`, padding: '4px 10px',
                    borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold'
                  }}>
                    pH {soil.ph}
                  </span>
                </div>

                <p style={{ margin: '0 0 14px 0', fontSize: '0.88rem', color: '#cbd5e1', lineHeight: '1.6' }}>
                  {soil.description}
                </p>

                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px', marginBottom: '14px' }}>
                  <div style={{ fontSize: '0.8rem', color: '#94a3b8', marginBottom: '4px' }}>
                    <i className="fa-solid fa-droplet" style={{ color: '#38bdf8', marginRight: '6px' }}></i>
                    <strong>Water Holding Capacity:</strong> <span style={{ color: '#e2e8f0' }}>{soil.waterRetention}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: soil.color, marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-wheat-awn"></i> Recommended High-Yield Crops:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {soil.bestCrops.map((c, ci) => (
                      <span key={ci} style={{
                        background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.15)',
                        color: '#f1f5f9', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem',
                        fontWeight: '500'
                      }}>
                        {c}
                      </span>
                    ))}
                  </div>
                </div>

              </div>
            ))}
          </div>
        </div>
      )}

      {/* VIEW 3: CROP ROTATION ENGINE */}
      {activePlanView === 'rotation' && (
        <div style={{ animation: 'fadeIn 0.3s ease' }}>
          <div style={{ marginBottom: '1.5rem' }}>
            <h3 style={{ fontSize: '1.3rem', color: 'white', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-arrows-rotate" style={{ color: '#38bdf8' }}></i>
              Proven Scientific Crop Rotation Blueprints
            </h3>
            <p style={{ margin: 0, color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
              Strategic rotations that naturally fix atmospheric nitrogen, disrupt pest life cycles, and maximize farm profitability.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              {
                title: 'North India — Wheat-Paddy-Pulse Belt',
                icon: 'fa-wheat-awn', color: '#fbbf24',
                steps: [
                  { season: 'Kharif', crop: 'Paddy (Rice)', months: 'Jun – Oct', detail: 'Transplanting in puddled soil; requires 1200mm water & Zinc Sulphate application.', icon: 'fa-seedling', color: '#10b981' },
                  { season: 'Rabi', crop: 'Wheat', months: 'Nov – Apr', detail: 'Sown at 22.5cm row spacing; critical 1st irrigation at Crown Root Initiation (21d).', icon: 'fa-seedling', color: '#38bdf8' },
                  { season: 'Zaid', crop: 'Moong / Green Gram', months: 'Apr – Jun', detail: 'Short 60-day summer pulse fixing 35-45 kg N/ha into soil before next monsoon.', icon: 'fa-seedling', color: '#fbbf24' }
                ],
                benefit: 'Classic Indo-Gangetic rotation. Maintains soil organic matter. Incorporating Moong in Zaid reduces subsequent Wheat nitrogen fertilizer requirement by 25%.'
              },
              {
                title: 'Central India — Cotton-Wheat & Soybean Belt',
                icon: 'fa-circle-nodes', color: '#a78bfa',
                steps: [
                  { season: 'Kharif', crop: 'Cotton / Soybean', months: 'Jun – Nov', detail: 'Black cotton soil moisture retention; Soybean inoculates Rhizobium japonicum.', icon: 'fa-seedling', color: '#10b981' },
                  { season: 'Rabi', crop: 'Wheat / Chickpea', months: 'Nov – Mar', detail: 'Wheat following leguminous Soybean gets organic N boost from foliage decay.', icon: 'fa-seedling', color: '#38bdf8' },
                  { season: 'Zaid', crop: 'Sunflower / Fallow', months: 'Mar – Jun', detail: 'Deep taproot breaks hard soil pans and disrupts soil-borne nematode cycles.', icon: 'fa-seedling', color: '#fbbf24' }
                ],
                benefit: 'Reduces Pink Bollworm pressure. Soybean fixes 80–120 kg N/ha. Sunflower breaks weed and disease cycles effectively.'
              },
              {
                title: 'South India — Rice-Rice-Pulse System',
                icon: 'fa-layer-group', color: '#34d399',
                steps: [
                  { season: 'Kharif I', crop: 'Paddy (Samba)', months: 'Jun – Oct', detail: 'Main monsoon rice crop in river deltas.', icon: 'fa-seedling', color: '#10b981' },
                  { season: 'Rabi', crop: 'Paddy (Thaladi / Rabi)', months: 'Nov – Feb', detail: 'Winter irrigated rice crop.', icon: 'fa-seedling', color: '#38bdf8' },
                  { season: 'Zaid', crop: 'Black Gram / Cowpea', months: 'Feb – May', detail: 'Residual moisture pulse crop fixing nitrogen.', icon: 'fa-seedling', color: '#fbbf24' }
                ],
                benefit: 'Cauvery & Krishna delta rotation. Pulses grown on rice stubble fix natural nitrogen, saving ₹2,500/acre in fertilizer expenses.'
              },
              {
                title: 'Vegetable Farmer — Intensive Year-Round',
                icon: 'fa-carrot', color: '#f87171',
                steps: [
                  { season: 'Kharif', crop: 'Tomato / Chilli / Okra', months: 'Jun – Sep', detail: 'Staked Solanaceous crops with high market return per acre.', icon: 'fa-seedling', color: '#10b981' },
                  { season: 'Rabi', crop: 'Potato / Cauliflower / Peas', months: 'Oct – Feb', detail: 'Cool season root and brassica crops with heavy organic residue.', icon: 'fa-seedling', color: '#38bdf8' },
                  { season: 'Zaid', crop: 'Watermelon / Cucumber', months: 'Mar – Jun', detail: 'Silver mulch cucurbits yielding high Brix sugar melons in summer.', icon: 'fa-seedling', color: '#fbbf24' }
                ],
                benefit: 'High-yield commercial rotation for peri-urban farmers. Multi-family crop switching prevents host-specific pest outbreaks.'
              }
            ].map((plan, idx) => (
              <div key={idx} style={{
                background: 'rgba(10, 24, 17, 0.9)',
                border: `1.5px solid rgba(255,255,255,0.12)`,
                borderRadius: '16px', padding: '22px',
                boxShadow: '0 4px 20px rgba(0,0,0,0.2)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 'bold', color: 'white', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className={`fa-solid ${plan.icon}`} style={{ color: plan.color }}></i>
                  {plan.title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {plan.steps.map((step, si) => (
                    <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '12px 14px', borderLeft: `3px solid ${step.color}` }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.92rem', color: 'white' }}>{step.crop}</div>
                        <span style={{ fontSize: '0.74rem', background: 'rgba(255,255,255,0.08)', color: step.color, padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                          {step.season} ({step.months})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#cbd5e1', lineHeight: 1.35 }}>
                        {step.detail}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: '10px', padding: '14px', borderLeft: `3px solid ${plan.color}` }}>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#cbd5e1', lineHeight: '1.5' }}>
                    <i className="fa-solid fa-circle-info" style={{ color: plan.color, marginRight: '6px' }}></i>
                    <strong>Agronomic Rotation Benefit:</strong> {plan.benefit}
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
