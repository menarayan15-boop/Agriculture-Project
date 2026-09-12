import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';
import { getCropDisplayName } from '../../data/constants';

const CATEGORIES = ['All', 'Cereal', 'Pulses', 'Oilseeds', 'Cash Crop', 'Vegetable', 'Fruit'];
const STATES = ['All States', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan',
  'Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Gujarat', 'West Bengal',
  'Tamil Nadu', 'Bihar', 'Himachal Pradesh'];

const CAT_COLORS = {
  'Cereal': '#D97706', 'Pulses': '#15803D', 'Oilseeds': '#EA580C',
  'Cash Crop': '#0284C7', 'Vegetable': '#7C3AED', 'Fruit': '#DB2777'
};

function catColor(c) { return CAT_COLORS[c] || '#0284C7'; }

// ── Price Change Badge ────────────────────────────────────────────────────────
function ChangeBadge({ pct }) {
  if (pct === null || pct === undefined) return null;
  const up = pct >= 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      padding: '2px 8px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 800,
      background: up ? '#DCFCE7' : '#FEE2E2',
      color: up ? '#166534' : '#DC2626'
    }}>
      <i className={`fa-solid fa-arrow-${up ? 'up' : 'down'}`} style={{ fontSize: '0.65rem' }} />
      {Math.abs(pct).toFixed(2)}%
    </span>
  );
}

// ── MSP Comparison Bar ────────────────────────────────────────────────────────
function MspBar({ modal, msp }) {
  if (!msp) return null;
  const pct = ((modal - msp) / msp * 100).toFixed(1);
  const above = modal >= msp;
  return (
    <div style={{ marginTop: '8px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.72rem', marginBottom: '4px', color: '#6B7280', fontWeight: 600 }}>
        <span>vs MSP ₹{msp.toLocaleString()}</span>
        <span style={{ color: above ? '#15803D' : '#DC2626', fontWeight: 800 }}>
          {above ? '+' : ''}{pct}%
        </span>
      </div>
      <div style={{ height: '5px', borderRadius: '4px', background: '#E5E7EB', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${Math.min(100, Math.max(5, (modal / msp) * 50))}%`,
          background: above ? '#15803D' : '#EF4444',
          borderRadius: '4px', transition: 'width 0.8s ease'
        }} />
      </div>
    </div>
  );
}

// ── Single Mandi Rate Card ────────────────────────────────────────────────────
function MandiCard({ rate, onSell }) {
  const { lang } = useApp();
  const color = catColor(rate.category);
  const localizedCrop = getCropDisplayName(rate.crop, lang);
  return (
    <div style={{
      background: '#FFFFFF', border: `1px solid #E5E7EB`,
      borderTop: `3px solid ${color}`, borderRadius: '16px', padding: '1.2rem',
      transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '8px',
      boxShadow: '0 2px 8px rgba(0,0,0,0.02)'
    }}
      onMouseEnter={e => {
        e.currentTarget.style.transform = 'translateY(-2px)';
        e.currentTarget.style.boxShadow = '0 6px 16px rgba(0,0,0,0.06)';
      }}
      onMouseLeave={e => {
        e.currentTarget.style.transform = 'translateY(0)';
        e.currentTarget.style.boxShadow = '0 2px 8px rgba(0,0,0,0.02)';
      }}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <span style={{ fontSize: '1.6rem' }}>{rate.icon}</span>
          <div>
            <div style={{ fontWeight: 800, fontSize: '0.96rem', color: '#17211B' }}>{rate.crop}</div>
            <div style={{ fontSize: '0.75rem', color: '#6B7280', fontWeight: 600 }}>{localizedCrop || rate.crop_hi}</div>
          </div>
        </div>
        <ChangeBadge pct={rate.change_pct} />
      </div>

      {/* Mandi Name */}
      <div style={{ fontSize: '0.78rem', color: '#4B5563', display: 'flex', alignItems: 'center', gap: '4px', fontWeight: 600 }}>
        <i className="fa-solid fa-location-dot" style={{ color, fontSize: '0.75rem' }} />
        {rate.mandi}, <span style={{ color: '#6B7280' }}>{rate.state}</span>
      </div>

      {/* Prices */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
        <div style={{ flex: 1, background: '#F8FAF9', borderRadius: '10px', padding: '8px 10px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 700, marginBottom: '2px' }}>MIN</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>₹{rate.min_price.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1.3, background: `${color}12`, border: `1px solid ${color}35`, borderRadius: '10px', padding: '8px 10px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: color, fontWeight: 800, marginBottom: '2px' }}>MODAL ★</div>
          <div style={{ fontSize: '1.05rem', fontWeight: 900, color }}> ₹{rate.modal_price.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, background: '#F8FAF9', borderRadius: '10px', padding: '8px 10px', textAlign: 'center', border: '1px solid #E5E7EB' }}>
          <div style={{ fontSize: '0.65rem', color: '#6B7280', fontWeight: 700, marginBottom: '2px' }}>MAX</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 700, color: '#374151' }}>₹{rate.max_price.toLocaleString()}</div>
        </div>
      </div>

      {/* Unit */}
      <div style={{ fontSize: '0.72rem', color: '#9CA3AF', textAlign: 'right', fontWeight: 500 }}>{rate.unit}</div>

      {/* MSP Bar */}
      <MspBar modal={rate.modal_price} msp={rate.msp} />

      {/* Sell Button */}
      <button onClick={() => onSell(rate)} style={{
        marginTop: '8px', width: '100%', padding: '10px', borderRadius: '10px', border: 'none',
        background: '#15803D',
        color: '#fff', fontWeight: 700, fontSize: '0.84rem', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        transition: 'all 0.2s',
        boxShadow: '0 2px 6px rgba(21, 128, 61, 0.2)'
      }}
        onMouseEnter={e => e.currentTarget.style.background = '#166534'}
        onMouseLeave={e => e.currentTarget.style.background = '#15803D'}
      >
        <i className="fa-solid fa-handshake" /> Sell My Produce Here
      </button>
    </div>
  );
}

// ── Sell Modal ────────────────────────────────────────────────────────────────
function SellModal({ rate, onClose }) {
  const [form, setForm] = useState({ name: '', phone: '', quantity: 10, quality: 'FAQ' });
  const [submitted, setSubmitted] = useState(false);

  if (!rate) return null;
  const color = catColor(rate.category);

  const handleSubmit = (e) => {
    e.preventDefault();
    setSubmitted(true);
  };

  return (
    <div style={{
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.6)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem',
      backdropFilter: 'blur(4px)'
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: '#FFFFFF', border: `1px solid #E5E7EB`,
        borderRadius: '20px', padding: '2rem', maxWidth: '460px', width: '100%',
        boxShadow: `0 20px 40px rgba(0,0,0,0.15)`
      }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>✅</div>
            <h3 style={{ color: '#15803D', marginBottom: '8px', fontWeight: 800 }}>Request Submitted!</h3>
            <p style={{ color: '#4B5563', fontSize: '0.9rem', lineHeight: 1.6 }}>
              Your produce enquiry for <strong style={{ color }}>{rate.crop}</strong> at <strong>{rate.mandi}</strong> has been logged.<br />
              The mandi officer / trader will contact you on your registered number.
            </p>
            <div style={{ marginTop: '1.2rem', background: '#F0FDF4', border: `1px solid #86EFAC`, borderRadius: '12px', padding: '14px' }}>
              <div style={{ fontSize: '0.78rem', color: '#166534', fontWeight: 700, marginBottom: '4px' }}>Today's Modal Rate</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 900, color: '#15803D' }}>₹{rate.modal_price.toLocaleString()} / qtl</div>
            </div>
            <button onClick={onClose} style={{
              marginTop: '1.2rem', width: '100%', padding: '10px', borderRadius: '10px',
              background: '#15803D', color: '#fff', border: 'none', fontWeight: 700, cursor: 'pointer'
            }}>Done</button>
          </div>
        ) : (
          <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '14px' }}>
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div>
                <h3 style={{ margin: 0, fontSize: '1.2rem', fontWeight: 800, color: '#17211B' }}>Sell Produce at Mandi</h3>
                <div style={{ fontSize: '0.82rem', color: '#6B7280', marginTop: '2px' }}>{rate.crop} · {rate.mandi}, {rate.state}</div>
              </div>
              <button type="button" onClick={onClose} style={{ background: 'none', border: 'none', fontSize: '1.3rem', cursor: 'pointer', color: '#9CA3AF' }}>&times;</button>
            </div>

            <div style={{ background: `${color}12`, border: `1px solid ${color}35`, borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <span style={{ fontSize: '0.85rem', fontWeight: 600, color: '#374151' }}>Modal Rate Today:</span>
              <span style={{ fontSize: '1.1rem', fontWeight: 900, color }}>₹{rate.modal_price.toLocaleString()} / {rate.unit}</span>
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Farmer Name / किसान का नाम</label>
              <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                placeholder="e.g. Ramesh Kumar"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E5E7EB', background: '#F8FAF9', color: '#17211B', fontSize: '0.9rem', boxSizing: 'border-box' }} />
            </div>

            <div>
              <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Mobile Number / फोन नंबर</label>
              <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                placeholder="10-digit mobile number"
                style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E5E7EB', background: '#F8FAF9', color: '#17211B', fontSize: '0.9rem', boxSizing: 'border-box' }} />
            </div>

            <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Quantity (Quintals)</label>
                <input required type="number" min="1" max="1000" value={form.quantity} onChange={e => setForm({ ...form, quantity: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E5E7EB', background: '#F8FAF9', color: '#17211B', fontSize: '0.9rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.82rem', fontWeight: 700, color: '#374151', display: 'block', marginBottom: '4px' }}>Quality Grade</label>
                <select value={form.quality} onChange={e => setForm({ ...form, quality: e.target.value })}
                  style={{ width: '100%', padding: '10px 12px', borderRadius: '8px', border: '1.5px solid #E5E7EB', background: '#F8FAF9', color: '#17211B', fontSize: '0.9rem', boxSizing: 'border-box' }}>
                  <option value="FAQ">FAQ (Standard)</option>
                  <option value="Grade A">Grade A (Premium)</option>
                  <option value="Below FAQ">Below FAQ</option>
                </select>
              </div>
            </div>

            <button type="submit" style={{
              width: '100%', padding: '12px', borderRadius: '10px', border: 'none',
              background: '#15803D', color: '#fff', fontWeight: 800, fontSize: '0.95rem',
              cursor: 'pointer', marginTop: '6px', boxShadow: '0 4px 12px rgba(21, 128, 61, 0.25)'
            }}>Submit Produce Enquiry</button>
          </form>
        )}
      </div>
    </div>
  );
}

// ── Main MandiTab ─────────────────────────────────────────────────────────────
export function MandiTab() {
  const { farmerProfile } = useApp();
  const [rates, setRates] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('All');
  const [state, setState] = useState('All States');
  const [sortBy, setSortBy] = useState('default');
  const [asOf, setAsOf] = useState('');
  const [sellRate, setSellRate] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  // Sync state filter with farmer profile location state
  useEffect(() => {
    if (farmerProfile?.state) {
      const matched = STATES.find(s => s.toLowerCase() === farmerProfile.state.toLowerCase());
      if (matched) {
        setState(matched);
      }
    }
  }, [farmerProfile]);

  const fetchRates = useCallback(async () => {
    setLoading(true); setError('');
    try {
      const params = new URLSearchParams({
        search,
        state: state === 'All States' ? 'all' : state,
        crop: category === 'All' ? 'all' : category
      });
      const res = await fetch(`/api/mandi?${params}`);
      const json = await res.json();
      if (json.success) {
        setRates(json.rates);
        setAsOf(json.as_of);
        setLastRefresh(new Date().toLocaleTimeString());
      } else {
        setError('Could not load mandi rates.');
      }
    } catch {
      setError('Backend server is offline. Please start the server to view live mandi rates.');
    }
    setLoading(false);
  }, [search, state, category]);

  useEffect(() => { fetchRates(); }, [fetchRates]);

  // Sort
  const sortedRates = [...rates].sort((a, b) => {
    if (sortBy === 'price_high') return b.modal_price - a.modal_price;
    if (sortBy === 'price_low') return a.modal_price - b.modal_price;
    if (sortBy === 'gain') return b.change_pct - a.change_pct;
    if (sortBy === 'loss') return a.change_pct - b.change_pct;
    if (sortBy === 'msp_diff') return (b.vs_msp_pct || -999) - (a.vs_msp_pct || -999);
    return 0;
  });

  // Summary stats
  const gainers = rates.filter(r => r.change_pct > 0).length;
  const losers = rates.filter(r => r.change_pct < 0).length;
  const aboveMsp = rates.filter(r => r.vs_msp_pct !== null && r.vs_msp_pct >= 0).length;

  return (
    <div className="tab-panel active" style={{ display: 'flex', flexDirection: 'column', gap: '1.2rem' }}>

      {/* ── Header Banner ──────────────────────────────────────────────── */}
      <div style={{
        background: '#FFFFFF',
        border: '1.5px solid #E5E7EB', borderRadius: '18px', padding: '1.5rem',
        boxShadow: '0 2px 10px rgba(0,0,0,0.03)'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px', fontSize: '1.4rem', fontWeight: 800, color: '#17211B' }}>
              <i className="fa-solid fa-chart-line" style={{ color: '#15803D', marginRight: '10px' }} />
              Live Mandi Rates — भाव देखें
            </h2>
            <p style={{ margin: 0, color: '#4B5563', fontSize: '0.88rem' }}>
              Today's wholesale prices from 30+ APMC Mandis across India · Updated: {asOf || '—'}
            </p>
          </div>
          <button onClick={fetchRates} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: '#F0FDF4', border: '1px solid #86EFAC',
            color: '#15803D', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontSize: '0.85rem', fontWeight: 700
          }}>
            <i className={`fa-solid fa-rotate${loading ? ' fa-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Rates'}
          </button>
        </div>

        {/* Summary Pills */}
        {!loading && rates.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', marginTop: '1.2rem' }}>
            {[
              { icon: '📊', label: 'Mandis Listed', val: rates.length, c: '#0284C7', bg: '#EFF6FF', border: '#BFDBFE' },
              { icon: '📈', label: 'Gainers Today', val: gainers, c: '#15803D', bg: '#F0FDF4', border: '#86EFAC' },
              { icon: '📉', label: 'Losers Today', val: losers, c: '#DC2626', bg: '#FEF2F2', border: '#FECACA' },
              { icon: '✅', label: 'Above MSP', val: aboveMsp, c: '#D97706', bg: '#FFFBEB', border: '#FDE68A' },
            ].map(s => (
              <div key={s.label} style={{
                background: s.bg, border: `1px solid ${s.border}`, borderRadius: '12px',
                padding: '8px 16px', display: 'flex', alignItems: 'center', gap: '10px'
              }}>
                <span style={{ fontSize: '1.2rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '1.1rem', fontWeight: 900, color: s.c, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '0.72rem', color: '#4B5563', fontWeight: 600 }}>{s.label}</div>
                </div>
              </div>
            ))}
            {lastRefresh && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.75rem', color: '#6B7280', fontWeight: 500 }}>
                <i className="fa-solid fa-clock" /> Last refreshed: {lastRefresh}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '10px', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '1', minWidth: '220px' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: '12px', top: '50%', transform: 'translateY(-50%)', color: '#9CA3AF', fontSize: '0.85rem' }} />
          <input placeholder="Search crop / mandi..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '34px', padding: '10px 14px 10px 34px', borderRadius: '10px', background: '#FFFFFF', border: '1.5px solid #E5E7EB', color: '#17211B', fontSize: '0.88rem', width: '100%', boxSizing: 'border-box' }} />
        </div>

        {/* State dropdown */}
        <select value={state} onChange={e => setState(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '10px', background: '#FFFFFF', border: '1.5px solid #E5E7EB', color: '#17211B', fontSize: '0.88rem', cursor: 'pointer', fontWeight: 600 }}>
          {STATES.map(s => <option key={s}>{s}</option>)}
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ padding: '10px 14px', borderRadius: '10px', background: '#FFFFFF', border: '1.5px solid #E5E7EB', color: '#17211B', fontSize: '0.88rem', cursor: 'pointer', fontWeight: 600 }}>
          <option value="default">Sort: Default</option>
          <option value="price_high">Price: High → Low</option>
          <option value="price_low">Price: Low → High</option>
          <option value="gain">Top Gainers First</option>
          <option value="loss">Top Losers First</option>
          <option value="msp_diff">Best vs MSP</option>
        </select>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px' }}>
        {CATEGORIES.map(cat => {
          const color = cat === 'All' ? '#15803D' : catColor(cat);
          const active = category === cat;
          return (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: '6px 16px', borderRadius: '20px', border: `1.5px solid ${active ? color : '#E5E7EB'}`,
              background: active ? (cat === 'All' ? '#15803D' : color) : '#FFFFFF',
              color: active ? '#FFFFFF' : '#374151',
              fontSize: '0.82rem', fontWeight: 700, cursor: 'pointer',
              transition: 'all 0.15s',
              boxShadow: active ? '0 2px 6px rgba(0,0,0,0.1)' : 'none'
            }}>
              {cat}
            </button>
          );
        })}
      </div>

      {/* ── Rates Grid ─────────────────────────────────────────────────── */}
      {loading ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#15803D' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', marginBottom: '12px' }} />
          <div style={{ color: '#4B5563', fontSize: '0.9rem' }}>Fetching live mandi rates...</div>
        </div>
      ) : error ? (
        <div style={{
          background: '#FEF2F2', border: '1px solid #FECACA',
          borderRadius: '14px', padding: '1.5rem', textAlign: 'center', color: '#DC2626'
        }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ fontSize: '1.5rem', marginBottom: '8px' }} />
          <div>{error}</div>
        </div>
      ) : sortedRates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: '#6B7280', background: '#FFFFFF', borderRadius: '16px', border: '1.5px solid #E5E7EB' }}>
          <i className="fa-solid fa-store-slash" style={{ fontSize: '2rem', marginBottom: '8px' }} />
          <div>No mandi rates match your filters. Try selecting a different category or state.</div>
        </div>
      ) : (
        <div style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))',
          gap: '14px'
        }}>
          {sortedRates.map(rate => (
            <MandiCard key={rate.id} rate={rate} onSell={r => setSellRate(r)} />
          ))}
        </div>
      )}

      {/* Sell Modal */}
      {sellRate && <SellModal rate={sellRate} onClose={() => setSellRate(null)} />}
    </div>
  );
}

export default MandiTab;
