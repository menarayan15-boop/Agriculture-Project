import React, { useState, useMemo } from 'react';
import { useApp } from '../../context/AppContext';
import { CROP_SEASONS_DATA, SOIL_TYPES_CATALOG } from '../../data/cropDetailsData';
import { getText } from '../../data/constants';

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
        background: '#FFFFFF',
        border: '1px solid #E5E7EB', borderRadius: '16px',
        padding: '24px 26px', marginBottom: '1.5rem',
        display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '16px',
        boxShadow: '0 4px 20px rgba(0, 0, 0, 0.04)'
      }}>
        <div>
          <h2 style={{ fontSize: '1.5rem', fontWeight: 'bold', margin: '0 0 6px 0', color: '#17211B', display: 'flex', alignItems: 'center', gap: '10px' }}>
            <i className="fa-solid fa-calendar-days" style={{ color: '#15803D' }}></i>
            Crop Sowing Calendar &amp; Rotation Engine
          </h2>
          <p style={{ margin: 0, color: '#4B5563', fontSize: '0.9rem' }}>
            Plan multi-crop rotations with detailed agronomic schedules, seed rates, fertilizer dosages, and pest defense protocols.
          </p>
        </div>

        {/* View Toggle Buttons */}
        <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap' }}>
          <button type="button" onClick={() => setActivePlanView('calendar')} style={{
            padding: '9px 16px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 'bold',
            border: activePlanView === 'calendar' ? '1.5px solid #15803D' : '1px solid #E5E7EB', cursor: 'pointer',
            background: activePlanView === 'calendar' ? '#15803D' : '#F8FAF9',
            color: activePlanView === 'calendar' ? '#FFFFFF' : '#17211B',
            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <i className="fa-solid fa-calendar-days"></i> Seasonal Crops
          </button>
          <button type="button" onClick={() => setActivePlanView('soils')} style={{
            padding: '9px 16px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 'bold',
            border: activePlanView === 'soils' ? '1.5px solid #15803D' : '1px solid #E5E7EB', cursor: 'pointer',
            background: activePlanView === 'soils' ? '#15803D' : '#F8FAF9',
            color: activePlanView === 'soils' ? '#FFFFFF' : '#17211B',
            transition: 'all 0.2s ease', display: 'flex', alignItems: 'center', gap: '6px'
          }}>
            <i className="fa-solid fa-mountain"></i> Soil Types Guide
          </button>
          <button type="button" onClick={() => setActivePlanView('rotation')} style={{
            padding: '9px 16px', borderRadius: '10px', fontSize: '0.86rem', fontWeight: 'bold',
            border: activePlanView === 'rotation' ? '1.5px solid #15803D' : '1px solid #E5E7EB', cursor: 'pointer',
            background: activePlanView === 'rotation' ? '#15803D' : '#F8FAF9',
            color: activePlanView === 'rotation' ? '#FFFFFF' : '#17211B',
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
                  background: selectedSeason === s.id ? '#15803D' : '#FFFFFF',
                  color: selectedSeason === s.id ? '#FFFFFF' : '#17211B',
                  border: selectedSeason === s.id ? '2px solid #15803D' : '1px solid #E5E7EB',
                  boxShadow: selectedSeason === s.id ? '0 4px 14px rgba(21, 128, 61, 0.25)' : '0 2px 6px rgba(0,0,0,0.02)',
                  transform: selectedSeason === s.id ? 'translateY(-2px)' : 'none',
                  transition: 'all 0.25s ease'
                }}>
                <i className={`fa-solid ${s.icon}`}></i> {s.name} ({s.crops.length} Crops)
              </button>
            ))}
          </div>

          {/* Month Timeline Bar */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #E5E7EB',
            borderRadius: '16px', padding: '18px 22px', marginBottom: '1.5rem',
            boxShadow: '0 4px 20px rgba(0,0,0,0.04)'
          }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '8px', marginBottom: '6px' }}>
              <h4 style={{ margin: 0, color: '#15803D', fontWeight: 'bold', fontSize: '1.05rem', display: 'flex', alignItems: 'center', gap: '8px' }}>
                <i className={`fa-solid ${season.icon}`}></i>
                {season.name} — Sowing: {season.sowing} | Harvest: {season.harvest}
              </h4>
              <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
                <span style={{ background: '#DCFCE7', color: '#15803D', padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 'bold' }}>Sowing Window</span>
                <span style={{ background: '#EFF6FF', color: '#1D4ED8', padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 'bold' }}>Active Growth</span>
                <span style={{ background: '#FEF3C7', color: '#B45309', padding: '3px 10px', borderRadius: '6px', fontSize: '0.72rem', fontWeight: 'bold' }}>Harvest Window</span>
              </div>
            </div>
            <p style={{ margin: '0 0 10px 0', fontSize: '0.85rem', color: '#6B7280' }}>
              {season.description}
            </p>
            <MonthBar season={season} />
          </div>

          {/* Search & Filter Bar */}
          <div style={{
            background: '#FFFFFF', border: '1px solid #E5E7EB',
            borderRadius: '14px', padding: '14px 18px', marginBottom: '1.5rem',
            display: 'flex', gap: '12px', flexWrap: 'wrap', alignItems: 'center',
            boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
          }}>
            {/* Search input */}
            <div style={{ flex: '2', minWidth: '220px', position: 'relative' }}>
              <i className="fa-solid fa-magnifying-glass" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#15803D' }}></i>
              <input
                type="text"
                value={searchQuery}
                onChange={e => setSearchQuery(e.target.value)}
                placeholder="Search crop, soil (e.g. Clay, Sandy-Loam), or climate..."
                style={{
                  width: '100%', padding: '9px 12px 9px 36px', borderRadius: '8px',
                  background: '#F8FAF9', border: '1px solid #E5E7EB',
                  color: '#17211B', fontSize: '0.88rem', outline: 'none'
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
                  background: '#F8FAF9', border: '1px solid #E5E7EB',
                  color: '#17211B', fontSize: '0.85rem', outline: 'none', cursor: 'pointer'
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
                  background: '#F8FAF9', border: '1px solid #E5E7EB',
                  color: '#17211B', fontSize: '0.85rem', outline: 'none', cursor: 'pointer'
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
                  background: '#F8FAF9', border: '1px solid #E5E7EB',
                  color: '#17211B', fontSize: '0.85rem', outline: 'none', cursor: 'pointer'
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
                  padding: '9px 14px', borderRadius: '8px', background: '#FEF2F2',
                  color: '#DC2626', border: '1px solid #FCA5A5', fontSize: '0.82rem',
                  cursor: 'pointer', fontWeight: 'bold'
                }}>
                <i className="fa-solid fa-xmark"></i> Clear
              </button>
            )}
          </div>

          {/* Results Count */}
          <div style={{ marginBottom: '1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
            <span style={{ fontSize: '0.9rem', color: '#6B7280' }}>
              Showing <strong style={{ color: '#17211B' }}>{filteredCrops.length}</strong> crop(s) for <strong style={{ color: '#15803D' }}>{season.name}</strong>
            </span>
            <span style={{ fontSize: '0.8rem', color: '#6B7280' }}>
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
                    background: '#FFFFFF',
                    border: `1.5px solid ${isSelected ? '#15803D' : '#E5E7EB'}`,
                    borderRadius: '16px', padding: '20px',
                    cursor: 'pointer', transition: 'all 0.35s cubic-bezier(0.4, 0, 0.2, 1)',
                    boxShadow: isSelected ? '0 8px 30px rgba(21, 128, 61, 0.12)' : '0 4px 15px rgba(0,0,0,0.03)',
                    position: 'relative', overflow: 'hidden'
                  }}>

                  {/* Category Pill */}
                  {crop.category && (
                    <div style={{
                      position: 'absolute', top: '16px', right: '42px',
                      background: '#F0FDF4', color: '#15803D',
                      padding: '3px 10px', borderRadius: '12px', fontSize: '0.68rem',
                      fontWeight: '700', letterSpacing: '0.5px', textTransform: 'uppercase'
                    }}>
                      {crop.category}
                    </div>
                  )}

                  {/* Top Row: Crop Name & Chevron */}
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                    <div>
                      <h3 style={{ margin: 0, fontSize: '1.15rem', fontWeight: 'bold', color: '#17211B', display: 'flex', alignItems: 'center', gap: '8px' }}>
                        <i className="fa-solid fa-seedling" style={{ color: '#15803D' }}></i>
                        {getText(crop.nameKey || `crop-${crop.id}`, lang) !== `crop-${crop.id}`
                          ? getText(crop.nameKey || `crop-${crop.id}`, lang)
                          : (lang === 'hi' && crop.hindiName ? crop.hindiName : crop.name)}
                      </h3>
                      {crop.hindiName && lang === 'en' && (
                        <div style={{ fontSize: '0.82rem', color: '#15803D', marginTop: '2px', fontWeight: 600 }}>
                          {crop.hindiName}
                        </div>
                      )}
                    </div>
                    <div style={{
                      width: '28px', height: '28px', borderRadius: '50%',
                      background: isSelected ? '#15803D' : '#F8FAF9',
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      color: isSelected ? '#FFFFFF' : '#6B7280',
                      fontSize: '0.8rem', transition: 'all 0.2s ease', flexShrink: 0
                    }}>
                      <i className="fa-solid fa-chevron-down" style={{ transform: isSelected ? 'rotate(180deg)' : 'rotate(0deg)', transition: 'transform 0.35s ease' }}></i>
                    </div>
                  </div>

                  {/* Summary Badges */}
                  <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', marginBottom: '10px' }}>
                    <span style={{ background: '#F8FAF9', border: '1px solid #E5E7EB', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#4B5563' }}>
                      <i className="fa-solid fa-clock" style={{ marginRight: '4px' }}></i>{crop.duration}
                    </span>
                    <span style={{
                      background: '#EFF6FF',
                      padding: '4px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#1D4ED8',
                      display: 'flex', alignItems: 'center', gap: '5px', fontWeight: 600
                    }}>
                      <i className="fa-solid fa-droplet"></i> Water: {crop.water}
                    </span>
                    {yieldBench && (
                      <span style={{ background: '#F3E8FF', padding: '3px 10px', borderRadius: '20px', fontSize: '0.75rem', color: '#7E22CE', fontWeight: 600 }}>
                        <i className="fa-solid fa-wheat-awn" style={{ marginRight: '4px' }}></i>Yield: {yieldBench}
                      </span>
                    )}
                  </div>

                  <p style={{ margin: 0, fontSize: '0.82rem', color: '#4B5563', lineHeight: 1.4 }}>
                    <i className="fa-solid fa-mountain" style={{ marginRight: '6px', color: '#15803D' }}></i>
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
                      <div style={{ marginTop: '14px', paddingTop: '14px', borderTop: '1px solid #E5E7EB', display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '12px' }}>

                        {/* Seed & Spacing Info */}
                        {(seedRate || spacing) && (
                          <div style={{ background: '#F8FAF9', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem', border: '1px solid #E5E7EB' }}>
                            {seedRate && (
                              <div style={{ marginBottom: '4px', color: '#17211B' }}>
                                <strong style={{ color: '#B45309' }}>🌱 Seed Rate:</strong> {seedRate}
                              </div>
                            )}
                            {spacing && (
                              <div style={{ color: '#17211B' }}>
                                <strong style={{ color: '#1D4ED8' }}>📏 Spacing:</strong> {spacing}
                              </div>
                            )}
                          </div>
                        )}

                        {/* Nutrient Dosage */}
                        {nutrientInfo && (
                          <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                            <strong style={{ color: '#15803D', display: 'block', marginBottom: '2px' }}>🧪 NPK Fertilizer Dosage:</strong>
                            <span style={{ color: '#166534', fontWeight: 600 }}>{nutrientInfo}</span>
                          </div>
                        )}

                        {/* Critical Irrigation Stages */}
                        {waterPhases && (
                          <div style={{ background: '#EFF6FF', border: '1px solid #BFDBFE', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                            <strong style={{ color: '#1D4ED8', display: 'block', marginBottom: '2px' }}>💧 Critical Water Stages:</strong>
                            <span style={{ color: '#1E40AF' }}>{waterPhases}</span>
                          </div>
                        )}

                        {/* Rotation Benefit */}
                        {rotBenefit && (
                          <div style={{ background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                            <strong style={{ color: '#B45309', display: 'block', marginBottom: '2px' }}>🔄 Rotation Agronomic Benefit:</strong>
                            <span style={{ color: '#92400E' }}>{rotBenefit}</span>
                          </div>
                        )}

                        {/* Pest Alert & Prevention */}
                        {pestInfo && (
                          <div style={{ background: '#FEF2F2', border: '1px solid #FECACA', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                            <strong style={{ color: '#DC2626', display: 'block', marginBottom: '2px' }}>⚠️ Major Pests &amp; Defense:</strong>
                            <span style={{ color: '#991B1B' }}>{pestInfo}</span>
                          </div>
                        )}

                        {/* Harvest Indicator */}
                        {harvestSign && (
                          <div style={{ background: '#F3E8FF', border: '1px solid #E9D5FF', borderRadius: '10px', padding: '10px 12px', fontSize: '0.82rem' }}>
                            <strong style={{ color: '#7E22CE', display: 'block', marginBottom: '2px' }}>🌾 Harvest Readiness Sign:</strong>
                            <span style={{ color: '#581C87' }}>{harvestSign}</span>
                          </div>
                        )}

                        {/* Rotation Sequence */}
                        {rotationSeq && (
                          <div style={{ background: '#F8FAF9', borderRadius: '10px', padding: '10px 12px', gridColumn: '1 / -1', border: '1px solid #E5E7EB' }}>
                            <p style={{ margin: '0 0 4px 0', fontWeight: 'bold', color: '#15803D', fontSize: '0.82rem' }}>
                              <i className="fa-solid fa-arrows-rotate" style={{ marginRight: '6px' }}></i>Recommended Rotation Sequence:
                            </p>
                            <p style={{ margin: 0, fontSize: '0.85rem', color: '#374151', lineHeight: '1.4' }}>
                              {rotationSeq}
                            </p>
                          </div>
                        )}

                        <div style={{ display: 'flex', gap: '8px', gridColumn: '1 / -1' }}>
                          <div style={{ flex: 1, background: '#F0FDF4', border: '1px solid #BBF7D0', borderRadius: '8px', padding: '8px', textAlign: 'center', fontSize: '0.78rem' }}>
                            <div style={{ color: '#15803D', fontWeight: 'bold', marginBottom: '2px' }}>{season.sowing}</div>
                            <div style={{ color: '#4B5563' }}>Sowing Window</div>
                          </div>
                          <div style={{ flex: 1, background: '#FEF3C7', border: '1px solid #FDE68A', borderRadius: '8px', padding: '8px', textAlign: 'center', fontSize: '0.78rem' }}>
                            <div style={{ color: '#B45309', fontWeight: 'bold', marginBottom: '2px' }}>{season.harvest}</div>
                            <div style={{ color: '#4B5563' }}>Harvest Window</div>
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
            <h3 style={{ fontSize: '1.3rem', color: '#17211B', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-mountain" style={{ color: '#15803D' }}></i>
              Comprehensive Soil Catalog: Best Soil for Every Indian Crop
            </h3>
            <p style={{ margin: 0, color: '#4B5563', fontSize: '0.9rem' }}>
              Understand soil texture, pH parameters, water retention capabilities, and which crops thrive most profitably in each soil type.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {SOIL_TYPES_CATALOG.map((soil, idx) => (
              <div key={idx} style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '16px', padding: '22px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}>
                <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '12px' }}>
                  <div>
                    <h4 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 'bold', color: '#17211B' }}>
                      {soil.name}
                    </h4>
                    <div style={{ color: '#15803D', fontSize: '0.85rem', fontWeight: '600' }}>
                      {soil.nameHi}
                    </div>
                  </div>
                  <span style={{
                    background: '#DCFCE7', color: '#15803D',
                    border: '1px solid #BBF7D0', padding: '4px 10px',
                    borderRadius: '20px', fontSize: '0.75rem', fontWeight: 'bold'
                  }}>
                    pH {soil.ph}
                  </span>
                </div>

                <p style={{ margin: '0 0 14px 0', fontSize: '0.88rem', color: '#4B5563', lineHeight: '1.6' }}>
                  {soil.description}
                </p>

                <div style={{ background: '#F8FAF9', borderRadius: '10px', padding: '12px', marginBottom: '14px', border: '1px solid #E5E7EB' }}>
                  <div style={{ fontSize: '0.8rem', color: '#6B7280', marginBottom: '4px' }}>
                    <i className="fa-solid fa-droplet" style={{ color: '#2563EB', marginRight: '6px' }}></i>
                    <strong>Water Holding Capacity:</strong> <span style={{ color: '#17211B', fontWeight: 600 }}>{soil.waterRetention}</span>
                  </div>
                </div>

                <div>
                  <div style={{ fontSize: '0.82rem', fontWeight: 'bold', color: '#15803D', marginBottom: '8px', display: 'flex', alignItems: 'center', gap: '6px' }}>
                    <i className="fa-solid fa-wheat-awn"></i> Recommended High-Yield Crops:
                  </div>
                  <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
                    {soil.bestCrops.map((c, ci) => (
                      <span key={ci} style={{
                        background: '#F8FAF9', border: '1px solid #E5E7EB',
                        color: '#17211B', padding: '4px 10px', borderRadius: '8px', fontSize: '0.78rem',
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
            <h3 style={{ fontSize: '1.3rem', color: '#17211B', margin: '0 0 6px 0', display: 'flex', alignItems: 'center', gap: '10px' }}>
              <i className="fa-solid fa-arrows-rotate" style={{ color: '#15803D' }}></i>
              Proven Scientific Crop Rotation Blueprints
            </h3>
            <p style={{ margin: 0, color: '#4B5563', fontSize: '0.9rem' }}>
              Strategic rotations that naturally fix atmospheric nitrogen, disrupt pest life cycles, and maximize farm profitability.
            </p>
          </div>

          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(340px, 1fr))', gap: '20px' }}>
            {[
              {
                title: 'North India — Wheat-Paddy-Pulse Belt',
                icon: 'fa-wheat-awn', color: '#D97706',
                steps: [
                  { season: 'Kharif', crop: 'Paddy (Rice)', months: 'Jun – Oct', detail: 'Transplanting in puddled soil; requires 1200mm water & Zinc Sulphate application.', icon: 'fa-seedling', color: '#15803D' },
                  { season: 'Rabi', crop: 'Wheat', months: 'Nov – Apr', detail: 'Sown at 22.5cm row spacing; critical 1st irrigation at Crown Root Initiation (21d).', icon: 'fa-seedling', color: '#2563EB' },
                  { season: 'Zaid', crop: 'Moong / Green Gram', months: 'Apr – Jun', detail: 'Short 60-day summer pulse fixing 35-45 kg N/ha into soil before next monsoon.', icon: 'fa-seedling', color: '#D97706' }
                ],
                benefit: 'Classic Indo-Gangetic rotation. Maintains soil organic matter. Incorporating Moong in Zaid reduces subsequent Wheat nitrogen fertilizer requirement by 25%.'
              },
              {
                title: 'Central India — Cotton-Wheat & Soybean Belt',
                icon: 'fa-circle-nodes', color: '#7C3AED',
                steps: [
                  { season: 'Kharif', crop: 'Cotton / Soybean', months: 'Jun – Nov', detail: 'Black cotton soil moisture retention; Soybean inoculates Rhizobium japonicum.', icon: 'fa-seedling', color: '#15803D' },
                  { season: 'Rabi', crop: 'Wheat / Chickpea', months: 'Nov – Mar', detail: 'Wheat following leguminous Soybean gets organic N boost from foliage decay.', icon: 'fa-seedling', color: '#2563EB' },
                  { season: 'Zaid', crop: 'Sunflower / Fallow', months: 'Mar – Jun', detail: 'Deep taproot breaks hard soil pans and disrupts soil-borne nematode cycles.', icon: 'fa-seedling', color: '#D97706' }
                ],
                benefit: 'Reduces Pink Bollworm pressure. Soybean fixes 80–120 kg N/ha. Sunflower breaks weed and disease cycles effectively.'
              },
              {
                title: 'South India — Rice-Rice-Pulse System',
                icon: 'fa-layer-group', color: '#059669',
                steps: [
                  { season: 'Kharif I', crop: 'Paddy (Samba)', months: 'Jun – Oct', detail: 'Main monsoon rice crop in river deltas.', icon: 'fa-seedling', color: '#15803D' },
                  { season: 'Rabi', crop: 'Paddy (Thaladi / Rabi)', months: 'Nov – Feb', detail: 'Winter irrigated rice crop.', icon: 'fa-seedling', color: '#2563EB' },
                  { season: 'Zaid', crop: 'Black Gram / Cowpea', months: 'Feb – May', detail: 'Residual moisture pulse crop fixing nitrogen.', icon: 'fa-seedling', color: '#D97706' }
                ],
                benefit: 'Cauvery & Krishna delta rotation. Pulses grown on rice stubble fix natural nitrogen, saving ₹2,500/acre in fertilizer expenses.'
              },
              {
                title: 'Vegetable Farmer — Intensive Year-Round',
                icon: 'fa-carrot', color: '#DC2626',
                steps: [
                  { season: 'Kharif', crop: 'Tomato / Chilli / Okra', months: 'Jun – Sep', detail: 'Staked Solanaceous crops with high market return per acre.', icon: 'fa-seedling', color: '#15803D' },
                  { season: 'Rabi', crop: 'Potato / Cauliflower / Peas', months: 'Oct – Feb', detail: 'Cool season root and brassica crops with heavy organic residue.', icon: 'fa-seedling', color: '#2563EB' },
                  { season: 'Zaid', crop: 'Watermelon / Cucumber', months: 'Mar – Jun', detail: 'Silver mulch cucurbits yielding high Brix sugar melons in summer.', icon: 'fa-seedling', color: '#D97706' }
                ],
                benefit: 'High-yield commercial rotation for peri-urban farmers. Multi-family crop switching prevents host-specific pest outbreaks.'
              },
              {
                title: 'Western Semi-Arid — Arid Cereal & Cash Spice Belt',
                icon: 'fa-sun', color: '#D97706',
                steps: [
                  { season: 'Kharif', crop: 'Pearl Millet (Bajra) / Guar', months: 'Jul – Oct', detail: 'Drought-hardy coarse cereal with Guar fixing atmospheric nitrogen in sandy soil.', icon: 'fa-seedling', color: '#15803D' },
                  { season: 'Rabi', crop: 'Mustard / Cumin (Jeera) / Methi', months: 'Oct – Mar', detail: 'High-value export spice and oilseed demanding low water and dry sunny winter.', icon: 'fa-seedling', color: '#2563EB' },
                  { season: 'Zaid', crop: 'Summer Moong / Tinda / Fallow', months: 'Mar – Jun', detail: 'Short 60-day summer pulse conserving subsoil moisture and adding humus.', icon: 'fa-seedling', color: '#D97706' }
                ],
                benefit: 'Ideal for Rajasthan, Gujarat & Southern Haryana. Minimizes irrigation water requirement while generating ₹80,000–₹1,20,000 net profit per acre through Cumin & Mustard.'
              },
              {
                title: 'Eastern India — Rice-Potato-Jute / Sweet Corn System',
                icon: 'fa-water', color: '#0891B2',
                steps: [
                  { season: 'Kharif', crop: 'Aman Paddy (Rice)', months: 'Jun – Nov', detail: 'Rainfed and canal irrigated monsoon paddy on rich alluvial Gangetic loam.', icon: 'fa-seedling', color: '#15803D' },
                  { season: 'Rabi', crop: 'Potato / Masoor (Lentil)', months: 'Nov – Feb', detail: 'High-yielding tuber or pink lentil grown on residual soil moisture after paddy harvest.', icon: 'fa-seedling', color: '#2563EB' },
                  { season: 'Zaid', crop: 'Sweet Corn / Jute / Summer Moong', months: 'Mar – Jun', detail: 'Fast 75-day commercial Sweet Corn or Jute fibre before next monsoon flood arrival.', icon: 'fa-seedling', color: '#D97706' }
                ],
                benefit: 'Common in Bihar, Bengal, Assam & Eastern UP. 300% cropping intensity maximizes annual gross revenue and generates steady cash flow across all 3 seasons.'
              },
              {
                title: 'Sugar Belt — Sugarcane Ratoon & Green Manure Cycle',
                icon: 'fa-cubes-stacked', color: '#15803D',
                steps: [
                  { season: 'Year 1–2', crop: 'Sugarcane (Plant + 1 Ratoon)', months: 'Feb – Next Feb', detail: 'High biomass cash crop with intercropped potato/onion in first 60 days.', icon: 'fa-seedling', color: '#15803D' },
                  { season: 'Rabi Year 2', crop: 'Wheat / Mustard', months: 'Nov – Apr', detail: 'Sown immediately after ratoon cane clearing; breaks monoculture fatigue.', icon: 'fa-seedling', color: '#2563EB' },
                  { season: 'Pre-Kharif', crop: 'Daincha (Green Manure)', months: 'Apr – Jun', detail: 'Incorporate 10 tonnes fresh green biomass to restore organic carbon before next cane planting.', icon: 'fa-seedling', color: '#D97706' }
                ],
                benefit: 'Restores soil physical structure in intensive sugarcane zones. Green manuring with Daincha saves 40% chemical nitrogen fertilizer and prevents ratoon decline.'
              },
              {
                title: 'Dairy Integrated — High-Protein Year-Round Green Fodder',
                icon: 'fa-cow', color: '#65A30D',
                steps: [
                  { season: 'Kharif', crop: 'Maize + Cowpea (Mixed)', months: 'Jun – Sep', detail: 'Balanced carbohydrate and protein ratio; succulent green fodder for high milk fat.', icon: 'fa-seedling', color: '#15803D' },
                  { season: 'Rabi', crop: 'Oats (Jai) + Berseem (Multi-cut)', months: 'Oct – Mar', detail: 'Provides 4–5 continuous winter green forage cuttings high in calcium and vitamins.', icon: 'fa-seedling', color: '#2563EB' },
                  { season: 'Zaid', crop: 'Multi-cut Fodder Sorghum / Napier', months: 'Apr – Jun', detail: 'Drought-tolerant summer green chop sustaining dairy cattle in 40°C+ heat.', icon: 'fa-seedling', color: '#D97706' }
                ],
                benefit: 'Provides 365 days continuous nutritious green fodder for livestock farmers, boosting average daily milk yield by 2.0–2.5 litres per milch animal while reducing commercial feed cost by 35%.'
              },
              {
                title: 'Commercial Horticulture & Nematode Purge Cycle',
                icon: 'fa-disease', color: '#DB2777',
                steps: [
                  { season: 'Kharif', crop: 'Staked Tomato / Chilli', months: 'Jun – Oct', detail: 'High-density trellis vegetables with drip fertigation and silver mulch.', icon: 'fa-seedling', color: '#15803D' },
                  { season: 'Rabi', crop: 'Cauliflower / Garlic / Radish', months: 'Nov – Feb', detail: 'Brassica & Allium root exudates naturally fumigate soil against soil-borne fungi.', icon: 'fa-seedling', color: '#2563EB' },
                  { season: 'Zaid', crop: 'African Marigold / Bitter Gourd', months: 'Mar – Jun', detail: 'Marigold root α-terthienyl compounds kill 95%+ parasitic root-knot nematodes in soil!', icon: 'fa-seedling', color: '#D97706' }
                ],
                benefit: 'Natural biological soil sterilization. Rotating Solanaceous vegetables with Alliums, Brassicas, and Marigold purges nematode populations without dangerous synthetic chemicals.'
              }
            ].map((plan, idx) => (
              <div key={idx} style={{
                background: '#FFFFFF',
                border: '1px solid #E5E7EB',
                borderRadius: '16px', padding: '22px',
                boxShadow: '0 4px 16px rgba(0,0,0,0.03)'
              }}>
                <h3 style={{ margin: '0 0 16px 0', fontSize: '1.1rem', fontWeight: 'bold', color: '#17211B', display: 'flex', alignItems: 'center', gap: '10px' }}>
                  <i className={`fa-solid ${plan.icon}`} style={{ color: plan.color }}></i>
                  {plan.title}
                </h3>

                <div style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '16px' }}>
                  {plan.steps.map((step, si) => (
                    <div key={si} style={{ display: 'flex', flexDirection: 'column', gap: '4px', background: '#F8FAF9', borderRadius: '10px', padding: '12px 14px', borderLeft: `3px solid ${step.color}`, border: '1px solid #E5E7EB' }}>
                      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                        <div style={{ fontWeight: 'bold', fontSize: '0.92rem', color: '#17211B' }}>{step.crop}</div>
                        <span style={{ fontSize: '0.74rem', background: '#FFFFFF', color: step.color, border: '1px solid #E5E7EB', padding: '2px 8px', borderRadius: '6px', fontWeight: 700 }}>
                          {step.season} ({step.months})
                        </span>
                      </div>
                      <div style={{ fontSize: '0.8rem', color: '#4B5563', lineHeight: 1.35 }}>
                        {step.detail}
                      </div>
                    </div>
                  ))}
                </div>

                <div style={{ background: '#F0FDF4', borderRadius: '10px', padding: '14px', borderLeft: `3px solid ${plan.color}`, border: '1px solid #BBF7D0' }}>
                  <p style={{ margin: 0, fontSize: '0.84rem', color: '#166534', lineHeight: '1.5' }}>
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
