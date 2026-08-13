import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';
import { CENTRAL_SCHEMES, STATE_SCHEMES, MSP_TABLE_2025_26 } from '../../data/constants';

// ── Category pill colours ──────────────────────────────────────────────────────
const CATEGORY_COLORS = {
  'Direct Income Support': '#22c55e',
  'Crop Insurance': '#3b82f6',
  'Life Insurance': '#3b82f6',
  'Renewable Energy & Solar': '#f59e0b',
  'Energy Security': '#f59e0b',
  'Solar & Water Lift': '#f59e0b',
  'Farm Machinery & Tools': '#8b5cf6',
  'Agricultural Credit': '#06b6d4',
  'Credit & Finance': '#06b6d4',
  'Organic Farming': '#84cc16',
  'Soil Health & Water': '#84cc16',
  'Soil Testing & Health': '#84cc16',
  'Micro Irrigation': '#06b6d4',
  'Water Harvesting': '#06b6d4',
  'Farmer Training': '#f97316',
  'Farmer Education': '#f97316',
  'Farmer Welfare': '#f97316',
  'Animal Husbandry': '#ec4899',
  'Beekeeping & Honey': '#f59e0b',
  'Agro-Processing & MSME': '#8b5cf6',
  'Digital Market Linkage': '#a855f7',
  'Direct Marketing': '#a855f7',
  'Storage & Warehousing': '#64748b',
  'Crop Production Boost': '#22c55e',
  'Agriculture Development': '#22c55e',
  'Tribal Horticulture': '#84cc16',
  'Farmer Producer Organisations': '#06b6d4',
  'Sugarcane Development': '#84cc16',
  'Crop Registration': '#3b82f6',
  'Price Deficiency Support': '#f59e0b',
  'Debt Relief': '#ef4444',
  'Power & Solar': '#f59e0b',
};

function getCategoryColor(cat) {
  return CATEGORY_COLORS[cat] || '#a855f7';
}

// ── Scheme Card Component ─────────────────────────────────────────────────────
function SchemeCard({ scheme }) {
  const [expanded, setExpanded] = useState(false);
  const color = getCategoryColor(scheme.category);

  return (
    <div style={{
      background: 'rgba(255,255,255,0.04)',
      border: `1px solid rgba(255,255,255,0.08)`,
      borderLeft: `4px solid ${color}`,
      borderRadius: '16px',
      padding: '1.1rem 1.2rem',
      transition: 'all 0.25s',
      cursor: 'pointer',
    }}
      onClick={() => setExpanded(v => !v)}
      onMouseEnter={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.07)'; e.currentTarget.style.transform = 'translateY(-2px)'; }}
      onMouseLeave={e => { e.currentTarget.style.background = 'rgba(255,255,255,0.04)'; e.currentTarget.style.transform = 'translateY(0)'; }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', gap: '10px' }}>
        <div style={{
          width: 40, height: 40, borderRadius: '10px', flexShrink: 0,
          background: `${color}20`, display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.3rem', border: `1px solid ${color}30`
        }}>
          {scheme.icon || '📋'}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '8px' }}>
            <h3 style={{ margin: 0, fontSize: '0.92rem', lineHeight: 1.4, color: 'rgba(255,255,255,0.92)' }}>
              {scheme.title}
            </h3>
            <i className={`fa-solid fa-chevron-${expanded ? 'up' : 'down'}`} style={{ color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem', marginTop: '3px', flexShrink: 0 }} />
          </div>
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '5px', marginTop: '6px' }}>
            <span style={{
              background: `${color}20`, border: `1px solid ${color}40`,
              color, borderRadius: '20px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 600
            }}>{scheme.category}</span>
            <span style={{
              background: 'rgba(251,191,36,0.15)', border: '1px solid rgba(251,191,36,0.3)',
              color: '#fbbf24', borderRadius: '20px', padding: '2px 8px', fontSize: '0.72rem', fontWeight: 700
            }}>🎁 {scheme.subsidy}</span>
            {scheme.stateName && (
              <span style={{
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.12)',
                color: 'rgba(255,255,255,0.5)', borderRadius: '20px', padding: '2px 8px', fontSize: '0.72rem'
              }}>📍 {scheme.stateName}</span>
            )}
          </div>
        </div>
      </div>

      {/* Expandable Detail */}
      {expanded && (
        <div style={{ marginTop: '12px', paddingTop: '12px', borderTop: '1px solid rgba(255,255,255,0.07)' }}>
          <p style={{ margin: '0 0 10px', fontSize: '0.85rem', color: 'rgba(255,255,255,0.75)', lineHeight: 1.65 }}>
            {scheme.details}
          </p>
          {scheme.ministry && (
            <p style={{ margin: '0 0 10px', fontSize: '0.75rem', color: 'rgba(255,255,255,0.4)' }}>
              🏛️ {scheme.ministry}
            </p>
          )}
          <a
            href={scheme.link} target="_blank" rel="noreferrer"
            onClick={e => e.stopPropagation()}
            style={{
              display: 'inline-flex', alignItems: 'center', gap: '6px',
              background: `${color}20`, border: `1px solid ${color}40`,
              color, borderRadius: '8px', padding: '7px 14px', fontSize: '0.8rem', fontWeight: 600,
              textDecoration: 'none', transition: 'all 0.2s'
            }}
          >
            Apply / View on Portal <i className="fa-solid fa-up-right-from-square" style={{ fontSize: '0.75rem' }} />
          </a>
        </div>
      )}
    </div>
  );
}

// ── Stats Bar ─────────────────────────────────────────────────────────────────
function StatPill({ icon, label, value, color }) {
  return (
    <div style={{
      background: `${color}15`, border: `1px solid ${color}30`,
      borderRadius: '12px', padding: '10px 16px', textAlign: 'center', flex: 1, minWidth: '120px'
    }}>
      <div style={{ fontSize: '1.2rem', marginBottom: '2px' }}>{icon}</div>
      <div style={{ fontSize: '1.1rem', fontWeight: 800, color }}>{value}</div>
      <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.45)', marginTop: '2px' }}>{label}</div>
    </div>
  );
}

// ── Main SchemesTab ───────────────────────────────────────────────────────────
export function SchemesTab() {
  const { lang, location, farmerProfile } = useApp();
  const [subTab, setSubTab] = useState('central');
  const [search, setSearch] = useState('');
  const [activeCategory, setActiveCategory] = useState('All');
  const [selectedStateFilter, setSelectedStateFilter] = useState('All');

  // Sync state filter with farmer profile location state
  React.useEffect(() => {
    if (farmerProfile?.state) {
      setSelectedStateFilter(farmerProfile.state);
    }
  }, [farmerProfile]);

  const getFilteredSchemes = () => {
    let list = subTab === 'central' ? CENTRAL_SCHEMES : STATE_SCHEMES;
    
    if (subTab === 'state' && selectedStateFilter !== 'All') {
      list = list.filter(s => s.stateName.toLowerCase() === selectedStateFilter.toLowerCase());
    }

    if (search.trim()) {
      const q = search.toLowerCase();
      list = list.filter(s =>
        s.title.toLowerCase().includes(q) ||
        s.category.toLowerCase().includes(q) ||
        s.details.toLowerCase().includes(q) ||
        (s.stateName && s.stateName.toLowerCase().includes(q))
      );
    }
    if (activeCategory !== 'All') {
      list = list.filter(s => s.category === activeCategory);
    }
    return list;
  };

  const currentList = subTab === 'central' ? CENTRAL_SCHEMES : STATE_SCHEMES;
  const allCategories = ['All', ...Array.from(new Set(currentList.map(s => s.category)))];
  const filtered = getFilteredSchemes();

  // MSP stats
  const maxMSP = Math.max(...MSP_TABLE_2025_26.map(m => m.msp));
  const kharifCount = MSP_TABLE_2025_26.filter(m => m.season === 'Kharif').length;
  const rabiCount = MSP_TABLE_2025_26.filter(m => m.season === 'Rabi').length;

  return (
    <div className="tab-panel active" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

      {/* ── Header ─────────────────────────────────────────────────────── */}
      <div style={{
        background: 'linear-gradient(135deg, rgba(96,165,250,0.12), rgba(168,85,247,0.08))',
        border: '1px solid rgba(96,165,250,0.2)', borderRadius: '18px', padding: '1.5rem'
      }}>
        <h2 style={{ margin: '0 0 4px' }}>
          <i className="fa-solid fa-building-columns" style={{ color: '#60a5fa', marginRight: '10px' }} />
          Government Agricultural Schemes &amp; Subsidies
        </h2>
        <p style={{ margin: 0, color: 'rgba(255,255,255,0.55)', fontSize: '0.88rem' }}>
          Explore 40+ central &amp; state government schemes — subsidies, insurance, credit, MSP rates, and more.
        </p>
        {/* Stats */}
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1rem' }}>
          <StatPill icon="🏛️" label="Central Schemes" value={CENTRAL_SCHEMES.length} color="#60a5fa" />
          <StatPill icon="📍" label="State Schemes" value={STATE_SCHEMES.length} color="#a855f7" />
          <StatPill icon="🌾" label="MSP Crops Covered" value={MSP_TABLE_2025_26.length} color="#22c55e" />
          <StatPill icon="💰" label="Max MSP (₹/qtl)" value={`₹${maxMSP.toLocaleString()}`} color="#f59e0b" />
        </div>
      </div>

      {/* ── Sub-Tab Navigation ─────────────────────────────────────────── */}
      <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap', alignItems: 'center' }}>
        {[
          { id: 'central', icon: '🏛️', label: `Central Schemes (${CENTRAL_SCHEMES.length})` },
          { id: 'state', icon: '📍', label: `State Schemes (${STATE_SCHEMES.length})` },
          { id: 'msp', icon: '📊', label: `MSP Rates 2025–26 (${MSP_TABLE_2025_26.length})` }
        ].map(t => (
          <button key={t.id} onClick={() => { setSubTab(t.id); setSearch(''); setActiveCategory('All'); }} style={{
            padding: '9px 16px', borderRadius: '10px', border: 'none', cursor: 'pointer',
            fontWeight: 600, fontSize: '0.85rem', transition: 'all 0.2s',
            background: subTab === t.id ? 'linear-gradient(135deg,#3b82f6,#2563eb)' : 'rgba(255,255,255,0.06)',
            color: subTab === t.id ? '#fff' : 'rgba(255,255,255,0.55)',
            boxShadow: subTab === t.id ? '0 4px 12px rgba(59,130,246,0.3)' : 'none'
          }}>
            {t.icon} {t.label}
          </button>
        ))}

        {/* State Filter for State Schemes */}
        {subTab === 'state' && (
          <div style={{ display: 'inline-flex', alignItems: 'center', gap: '8px', marginLeft: '8px' }}>
            <span style={{ fontSize: '0.82rem', color: 'rgba(255,255,255,0.45)' }}>State:</span>
            <select
              value={selectedStateFilter}
              onChange={e => setSelectedStateFilter(e.target.value)}
              style={{
                background: 'rgba(255,255,255,0.06)',
                border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff',
                padding: '6px 12px',
                borderRadius: '8px',
                fontSize: '0.82rem',
                outline: 'none',
                cursor: 'pointer'
              }}
            >
              <option value="All">All States</option>
              {Array.from(new Set(STATE_SCHEMES.map(s => s.stateName))).sort().map(st => (
                <option key={st} value={st}>{st}</option>
              ))}
            </select>
          </div>
        )}

        {/* Search */}
        {subTab !== 'msp' && (
          <div style={{ marginLeft: 'auto', position: 'relative' }}>
            <i className="fa-solid fa-search" style={{ position: 'absolute', left: '11px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }} />
            <input
              type="text"
              placeholder="Search scheme..."
              value={search}
              onChange={e => setSearch(e.target.value)}
              style={{
                padding: '8px 12px 8px 32px', borderRadius: '10px',
                background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)',
                color: '#fff', fontSize: '0.85rem', width: '200px'
              }}
            />
          </div>
        )}
      </div>

      {/* ── MSP Table ──────────────────────────────────────────────────── */}
      {subTab === 'msp' && (
        <div>
          <div style={{ display: 'flex', gap: '10px', flexWrap: 'wrap', marginBottom: '1rem' }}>
            <span style={{ background: 'rgba(34,197,94,0.12)', border: '1px solid rgba(34,197,94,0.25)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.8rem', color: '#4ade80' }}>
              🌱 Kharif: {kharifCount} crops
            </span>
            <span style={{ background: 'rgba(96,165,250,0.12)', border: '1px solid rgba(96,165,250,0.25)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.8rem', color: '#93c5fd' }}>
              ❄️ Rabi: {rabiCount} crops
            </span>
            <span style={{ background: 'rgba(251,191,36,0.12)', border: '1px solid rgba(251,191,36,0.25)', borderRadius: '8px', padding: '6px 12px', fontSize: '0.8rem', color: '#fbbf24' }}>
              📅 Annual: {MSP_TABLE_2025_26.filter(m => m.season === 'Annual').length} crops
            </span>
          </div>
          <div style={{ background: 'rgba(255,255,255,0.03)', border: '1px solid rgba(255,255,255,0.08)', borderRadius: '16px', overflow: 'hidden' }}>
            <table style={{ width: '100%', borderCollapse: 'collapse', fontSize: '0.88rem' }}>
              <thead>
                <tr style={{ background: 'rgba(255,255,255,0.06)' }}>
                  {['Crop Name', 'Season', 'MSP Rate (₹/qtl)', 'Hike 2025-26', 'Status'].map(h => (
                    <th key={h} style={{ padding: '12px 16px', textAlign: 'left', color: 'rgba(255,255,255,0.6)', fontSize: '0.78rem', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.05em', whiteSpace: 'nowrap' }}>{h}</th>
                  ))}
                </tr>
              </thead>
              <tbody>
                {MSP_TABLE_2025_26.map((item, idx) => (
                  <tr key={idx} style={{ borderTop: '1px solid rgba(255,255,255,0.05)', transition: 'background 0.15s' }}
                    onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.04)'}
                    onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
                  >
                    <td style={{ padding: '11px 16px', fontWeight: 600, color: 'rgba(255,255,255,0.9)' }}>{item.icon} {item.crop}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{
                        padding: '3px 8px', borderRadius: '6px', fontSize: '0.75rem', fontWeight: 600,
                        background: item.season === 'Kharif' ? 'rgba(34,197,94,0.15)' : item.season === 'Rabi' ? 'rgba(96,165,250,0.15)' : 'rgba(251,191,36,0.15)',
                        color: item.season === 'Kharif' ? '#4ade80' : item.season === 'Rabi' ? '#93c5fd' : '#fbbf24'
                      }}>{item.season}</span>
                    </td>
                    <td style={{ padding: '11px 16px', color: '#4ade80', fontWeight: 700, fontSize: '0.95rem' }}>₹{item.msp.toLocaleString()}</td>
                    <td style={{ padding: '11px 16px', color: '#facc15', fontWeight: 600 }}>{item.change}</td>
                    <td style={{ padding: '11px 16px' }}>
                      <span style={{ background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', borderRadius: '6px', padding: '3px 8px', fontSize: '0.73rem', fontWeight: 600 }}>GoI Floor Price</span>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* ── Scheme Cards ───────────────────────────────────────────────── */}
      {subTab !== 'msp' && (
        <div>
          {/* Category Filter Pills */}
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px', marginBottom: '1rem' }}>
            {allCategories.map(cat => {
              const color = cat === 'All' ? '#60a5fa' : getCategoryColor(cat);
              return (
                <button key={cat} onClick={() => setActiveCategory(cat)} style={{
                  padding: '5px 12px', borderRadius: '20px', border: `1px solid ${activeCategory === cat ? color : 'rgba(255,255,255,0.1)'}`,
                  background: activeCategory === cat ? `${color}22` : 'transparent',
                  color: activeCategory === cat ? color : 'rgba(255,255,255,0.45)',
                  fontSize: '0.75rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s', whiteSpace: 'nowrap'
                }}>
                  {cat}
                </button>
              );
            })}
          </div>

          {/* Results count */}
          <div style={{ marginBottom: '0.8rem', fontSize: '0.8rem', color: 'rgba(255,255,255,0.4)' }}>
            Showing <strong style={{ color: '#60a5fa' }}>{filtered.length}</strong> of <strong>{currentList.length}</strong> schemes
            {activeCategory !== 'All' && <span> in <strong style={{ color: getCategoryColor(activeCategory) }}>{activeCategory}</strong></span>}
          </div>

          {/* Scheme Cards Grid */}
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(340px, 1fr))', gap: '0.8rem' }}>
            {filtered.length > 0 ? filtered.map(scheme => (
              <SchemeCard key={scheme.id} scheme={scheme} />
            )) : (
              <div style={{ gridColumn: '1/-1', textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.35)' }}>
                <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
                <p>No schemes found for "<strong>{search || activeCategory}</strong>"</p>
                <button onClick={() => { setSearch(''); setActiveCategory('All'); }} style={{ marginTop: '10px', background: 'rgba(96,165,250,0.15)', border: '1px solid rgba(96,165,250,0.3)', color: '#60a5fa', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
                  Clear Filters
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
