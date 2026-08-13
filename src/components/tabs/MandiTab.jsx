import React, { useState, useEffect, useCallback } from 'react';
import { useApp } from '../../context/AppContext';

const CATEGORIES = ['All', 'Cereal', 'Pulses', 'Oilseeds', 'Cash Crop', 'Vegetable', 'Fruit'];
const STATES = ['All States', 'Punjab', 'Haryana', 'Uttar Pradesh', 'Madhya Pradesh', 'Rajasthan',
  'Maharashtra', 'Karnataka', 'Andhra Pradesh', 'Telangana', 'Gujarat', 'West Bengal',
  'Tamil Nadu', 'Bihar', 'Himachal Pradesh'];

const CAT_COLORS = {
  'Cereal': '#f59e0b', 'Pulses': '#22c55e', 'Oilseeds': '#f97316',
  'Cash Crop': '#3b82f6', 'Vegetable': '#a855f7', 'Fruit': '#ec4899'
};

function catColor(c) { return CAT_COLORS[c] || '#60a5fa'; }

// ── Price Change Badge ────────────────────────────────────────────────────────
function ChangeBadge({ pct }) {
  if (pct === null || pct === undefined) return null;
  const up = pct >= 0;
  return (
    <span style={{
      display: 'inline-flex', alignItems: 'center', gap: '3px',
      padding: '2px 7px', borderRadius: '8px', fontSize: '0.75rem', fontWeight: 700,
      background: up ? 'rgba(34,197,94,0.15)' : 'rgba(239,68,68,0.15)',
      color: up ? '#4ade80' : '#f87171'
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
    <div style={{ marginTop: '6px' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', marginBottom: '3px', color: 'rgba(255,255,255,0.45)' }}>
        <span>vs MSP ₹{msp.toLocaleString()}</span>
        <span style={{ color: above ? '#4ade80' : '#f87171', fontWeight: 700 }}>
          {above ? '+' : ''}{pct}%
        </span>
      </div>
      <div style={{ height: '4px', borderRadius: '4px', background: 'rgba(255,255,255,0.1)', overflow: 'hidden' }}>
        <div style={{
          height: '100%', width: `${Math.min(100, Math.max(5, (modal / msp) * 50))}%`,
          background: above ? 'linear-gradient(90deg,#22c55e,#4ade80)' : 'linear-gradient(90deg,#ef4444,#f87171)',
          borderRadius: '4px', transition: 'width 0.8s ease'
        }} />
      </div>
    </div>
  );
}

// ── Single Mandi Rate Card ────────────────────────────────────────────────────
function MandiCard({ rate, onSell }) {
  const color = catColor(rate.category);
  return (
    <div style={{
      background: 'rgba(255,255,255,0.03)', border: `1px solid rgba(255,255,255,0.08)`,
      borderTop: `3px solid ${color}`, borderRadius: '14px', padding: '1rem',
      transition: 'all 0.2s', display: 'flex', flexDirection: 'column', gap: '6px'
    }}
      onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.06)'}
      onMouseLeave={e => e.currentTarget.style.background = 'rgba(255,255,255,0.03)'}
    >
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', gap: '6px' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span style={{ fontSize: '1.5rem' }}>{rate.icon}</span>
          <div>
            <div style={{ fontWeight: 700, fontSize: '0.92rem', color: '#fff' }}>{rate.crop}</div>
            <div style={{ fontSize: '0.72rem', color: 'rgba(255,255,255,0.4)' }}>{rate.crop_hi}</div>
          </div>
        </div>
        <ChangeBadge pct={rate.change_pct} />
      </div>

      {/* Mandi Name */}
      <div style={{ fontSize: '0.75rem', color: 'rgba(255,255,255,0.5)', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <i className="fa-solid fa-location-dot" style={{ color, fontSize: '0.7rem' }} />
        {rate.mandi}, <span style={{ color: 'rgba(255,255,255,0.35)' }}>{rate.state}</span>
      </div>

      {/* Prices */}
      <div style={{ display: 'flex', gap: '6px', marginTop: '4px' }}>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '6px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1px' }}>MIN</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>₹{rate.min_price.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1.3, background: `${color}18`, border: `1px solid ${color}30`, borderRadius: '8px', padding: '6px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.5)', marginBottom: '1px' }}>MODAL ★</div>
          <div style={{ fontSize: '1rem', fontWeight: 800, color }}> ₹{rate.modal_price.toLocaleString()}</div>
        </div>
        <div style={{ flex: 1, background: 'rgba(255,255,255,0.04)', borderRadius: '8px', padding: '6px 8px', textAlign: 'center' }}>
          <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.35)', marginBottom: '1px' }}>MAX</div>
          <div style={{ fontSize: '0.85rem', fontWeight: 600, color: '#94a3b8' }}>₹{rate.max_price.toLocaleString()}</div>
        </div>
      </div>

      {/* Unit */}
      <div style={{ fontSize: '0.7rem', color: 'rgba(255,255,255,0.3)', textAlign: 'right' }}>{rate.unit}</div>

      {/* MSP Bar */}
      <MspBar modal={rate.modal_price} msp={rate.msp} />

      {/* Sell Button */}
      <button onClick={() => onSell(rate)} style={{
        marginTop: '6px', width: '100%', padding: '8px', borderRadius: '8px', border: 'none',
        background: `linear-gradient(135deg, ${color}cc, ${color}88)`,
        color: '#fff', fontWeight: 700, fontSize: '0.82rem', cursor: 'pointer',
        display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '6px',
        transition: 'opacity 0.2s'
      }}
        onMouseEnter={e => e.currentTarget.style.opacity = '0.85'}
        onMouseLeave={e => e.currentTarget.style.opacity = '1'}
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
      position: 'fixed', inset: 0, background: 'rgba(0,0,0,0.8)', display: 'flex',
      alignItems: 'center', justifyContent: 'center', zIndex: 2000, padding: '1rem'
    }} onClick={e => e.target === e.currentTarget && onClose()}>
      <div style={{
        background: 'linear-gradient(135deg,#1a1a2e,#16213e)', border: `1px solid ${color}33`,
        borderRadius: '20px', padding: '1.8rem', maxWidth: '440px', width: '100%',
        boxShadow: `0 24px 80px rgba(0,0,0,0.6), 0 0 0 1px ${color}22`
      }}>
        {submitted ? (
          <div style={{ textAlign: 'center', padding: '1rem 0' }}>
            <div style={{ fontSize: '3.5rem', marginBottom: '12px' }}>✅</div>
            <h3 style={{ color: '#4ade80', marginBottom: '8px' }}>Request Submitted!</h3>
            <p style={{ color: 'rgba(255,255,255,0.65)', fontSize: '0.88rem', lineHeight: 1.6 }}>
              Your produce enquiry for <strong style={{ color }}>{rate.crop}</strong> at <strong>{rate.mandi}</strong> has been logged.<br />
              The mandi officer / trader will contact you on your registered number.
            </p>
            <div style={{ marginTop: '1rem', background: `${color}15`, border: `1px solid ${color}30`, borderRadius: '12px', padding: '12px' }}>
              <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)', marginBottom: '4px' }}>Today's Modal Rate</div>
              <div style={{ fontSize: '1.5rem', fontWeight: 800, color }}>₹{rate.modal_price.toLocaleString()} / qtl</div>
            </div>
            <button onClick={onClose} style={{ marginTop: '1.2rem', width: '100%', padding: '11px', borderRadius: '10px', border: 'none', background: `linear-gradient(135deg,${color},${color}88)`, color: '#fff', fontWeight: 700, cursor: 'pointer' }}>
              Done
            </button>
          </div>
        ) : (
          <>
            <div style={{ display: 'flex', alignItems: 'center', gap: '10px', marginBottom: '1.2rem' }}>
              <span style={{ fontSize: '2rem' }}>{rate.icon}</span>
              <div>
                <h3 style={{ margin: 0 }}>Sell {rate.crop}</h3>
                <p style={{ margin: 0, fontSize: '0.78rem', color: 'rgba(255,255,255,0.5)' }}>
                  📍 {rate.mandi}, {rate.state}
                </p>
              </div>
              <button onClick={onClose} style={{ marginLeft: 'auto', background: 'rgba(255,255,255,0.08)', border: 'none', color: 'rgba(255,255,255,0.5)', borderRadius: '8px', padding: '6px 10px', cursor: 'pointer' }}>✕</button>
            </div>

            {/* Live Price Info */}
            <div style={{ display: 'flex', gap: '8px', marginBottom: '1.2rem' }}>
              {[
                { label: 'Min', val: rate.min_price, c: '#94a3b8' },
                { label: 'Modal', val: rate.modal_price, c: color },
                { label: 'Max', val: rate.max_price, c: '#94a3b8' }
              ].map(p => (
                <div key={p.label} style={{ flex: 1, textAlign: 'center', background: 'rgba(255,255,255,0.05)', borderRadius: '8px', padding: '8px' }}>
                  <div style={{ fontSize: '0.65rem', color: 'rgba(255,255,255,0.4)', marginBottom: '2px' }}>{p.label}</div>
                  <div style={{ fontWeight: 700, color: p.c, fontSize: '0.9rem' }}>₹{p.val.toLocaleString()}</div>
                </div>
              ))}
            </div>

            <form onSubmit={handleSubmit} style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Your Name (किसान का नाम)</label>
                <input required value={form.name} onChange={e => setForm({ ...form, name: e.target.value })}
                  placeholder="e.g. Rajesh Kumar"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>
              <div>
                <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Phone Number (फोन नंबर)</label>
                <input required type="tel" value={form.phone} onChange={e => setForm({ ...form, phone: e.target.value })}
                  placeholder="+91 98765 43210"
                  style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }} />
              </div>
              <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '10px' }}>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Quantity (Quintals)</label>
                  <input type="number" min="1" max="10000" value={form.quantity} onChange={e => setForm({ ...form, quantity: parseInt(e.target.value) })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(255,255,255,0.07)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }} />
                </div>
                <div>
                  <label style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.6)', display: 'block', marginBottom: '4px' }}>Quality Grade</label>
                  <select value={form.quality} onChange={e => setForm({ ...form, quality: e.target.value })}
                    style={{ width: '100%', padding: '9px 12px', borderRadius: '8px', background: 'rgba(30,30,50,0.95)', border: '1px solid rgba(255,255,255,0.12)', color: '#fff', fontSize: '0.88rem', boxSizing: 'border-box' }}>
                    <option>FAQ</option><option>Grade A</option><option>Premium</option><option>Organic</option>
                  </select>
                </div>
              </div>

              {/* Estimated Value */}
              <div style={{ background: `${color}12`, border: `1px solid ${color}30`, borderRadius: '10px', padding: '10px 14px', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                <span style={{ fontSize: '0.8rem', color: 'rgba(255,255,255,0.55)' }}>Estimated Revenue</span>
                <span style={{ fontWeight: 800, color, fontSize: '1.05rem' }}>
                  ₹{(rate.modal_price * (form.quantity || 0)).toLocaleString()}
                </span>
              </div>

              <button type="submit" style={{
                padding: '12px', borderRadius: '10px', border: 'none',
                background: `linear-gradient(135deg, ${color}, ${color}99)`,
                color: '#fff', fontWeight: 700, fontSize: '0.95rem', cursor: 'pointer',
                display: 'flex', alignItems: 'center', justifyContent: 'center', gap: '8px'
              }}>
                <i className="fa-solid fa-handshake" /> Submit Sell Enquiry
              </button>
            </form>
          </>
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
        background: 'linear-gradient(135deg, rgba(34,197,94,0.12), rgba(59,130,246,0.08))',
        border: '1px solid rgba(34,197,94,0.2)', borderRadius: '18px', padding: '1.4rem'
      }}>
        <div style={{ display: 'flex', alignItems: 'flex-start', justifyContent: 'space-between', flexWrap: 'wrap', gap: '10px' }}>
          <div>
            <h2 style={{ margin: '0 0 4px' }}>
              <i className="fa-solid fa-chart-line" style={{ color: '#22c55e', marginRight: '10px' }} />
              Live Mandi Rates — भाव देखें
            </h2>
            <p style={{ margin: 0, color: 'rgba(255,255,255,0.5)', fontSize: '0.85rem' }}>
              Today's wholesale prices from 30+ APMC Mandis across India · Updated: {asOf || '—'}
            </p>
          </div>
          <button onClick={fetchRates} style={{
            display: 'flex', alignItems: 'center', gap: '6px',
            background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)',
            color: '#4ade80', borderRadius: '10px', padding: '8px 14px', cursor: 'pointer', fontSize: '0.82rem', fontWeight: 600
          }}>
            <i className={`fa-solid fa-rotate${loading ? ' fa-spin' : ''}`} />
            {loading ? 'Refreshing...' : 'Refresh Rates'}
          </button>
        </div>

        {/* Summary Pills */}
        {!loading && rates.length > 0 && (
          <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', marginTop: '1rem' }}>
            {[
              { icon: '📊', label: 'Mandis Listed', val: rates.length, c: '#60a5fa' },
              { icon: '📈', label: 'Gainers Today', val: gainers, c: '#4ade80' },
              { icon: '📉', label: 'Losers Today', val: losers, c: '#f87171' },
              { icon: '✅', label: 'Above MSP', val: aboveMsp, c: '#fbbf24' },
            ].map(s => (
              <div key={s.label} style={{
                background: `${s.c}12`, border: `1px solid ${s.c}25`, borderRadius: '10px',
                padding: '8px 14px', display: 'flex', alignItems: 'center', gap: '8px'
              }}>
                <span style={{ fontSize: '1rem' }}>{s.icon}</span>
                <div>
                  <div style={{ fontSize: '1rem', fontWeight: 800, color: s.c, lineHeight: 1 }}>{s.val}</div>
                  <div style={{ fontSize: '0.68rem', color: 'rgba(255,255,255,0.4)' }}>{s.label}</div>
                </div>
              </div>
            ))}
            {lastRefresh && (
              <div style={{ marginLeft: 'auto', display: 'flex', alignItems: 'center', gap: '5px', fontSize: '0.72rem', color: 'rgba(255,255,255,0.3)' }}>
                <i className="fa-solid fa-clock" /> Last refreshed: {lastRefresh}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ── Filters ────────────────────────────────────────────────────── */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '8px', alignItems: 'center' }}>
        {/* Search */}
        <div style={{ position: 'relative', flex: '0 0 200px' }}>
          <i className="fa-solid fa-search" style={{ position: 'absolute', left: '10px', top: '50%', transform: 'translateY(-50%)', color: 'rgba(255,255,255,0.3)', fontSize: '0.8rem' }} />
          <input placeholder="Search crop / mandi..." value={search} onChange={e => setSearch(e.target.value)}
            style={{ paddingLeft: '30px', padding: '8px 12px 8px 30px', borderRadius: '10px', background: 'rgba(255,255,255,0.06)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', width: '100%', boxSizing: 'border-box' }} />
        </div>

        {/* State dropdown */}
        <select value={state} onChange={e => setState(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(30,30,50,0.95)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}>
          {STATES.map(s => <option key={s}>{s}</option>)}
        </select>

        {/* Sort */}
        <select value={sortBy} onChange={e => setSortBy(e.target.value)}
          style={{ padding: '8px 12px', borderRadius: '10px', background: 'rgba(30,30,50,0.95)', border: '1px solid rgba(255,255,255,0.1)', color: '#fff', fontSize: '0.85rem', cursor: 'pointer' }}>
          <option value="default">Sort: Default</option>
          <option value="price_high">Price: High → Low</option>
          <option value="price_low">Price: Low → High</option>
          <option value="gain">Top Gainers First</option>
          <option value="loss">Top Losers First</option>
          <option value="msp_diff">Best vs MSP</option>
        </select>
      </div>

      {/* Category Pills */}
      <div style={{ display: 'flex', flexWrap: 'wrap', gap: '6px' }}>
        {CATEGORIES.map(cat => {
          const color = cat === 'All' ? '#60a5fa' : catColor(cat);
          const active = category === cat;
          return (
            <button key={cat} onClick={() => setCategory(cat)} style={{
              padding: '5px 14px', borderRadius: '20px', border: `1px solid ${active ? color : 'rgba(255,255,255,0.1)'}`,
              background: active ? `${color}22` : 'transparent',
              color: active ? color : 'rgba(255,255,255,0.45)',
              fontSize: '0.8rem', fontWeight: 600, cursor: 'pointer', transition: 'all 0.2s'
            }}>{cat}</button>
          );
        })}
      </div>

      {/* ── Content ────────────────────────────────────────────────────── */}
      {error ? (
        <div style={{ background: 'rgba(239,68,68,0.08)', border: '1px solid rgba(239,68,68,0.2)', borderRadius: '14px', padding: '2rem', textAlign: 'center' }}>
          <div style={{ fontSize: '2.5rem', marginBottom: '10px' }}>⚠️</div>
          <p style={{ color: '#fca5a5', margin: 0 }}>{error}</p>
        </div>
      ) : loading ? (
        <div style={{ textAlign: 'center', padding: '4rem', color: 'rgba(255,255,255,0.4)' }}>
          <i className="fa-solid fa-spinner fa-spin" style={{ fontSize: '2rem', color: '#22c55e', marginBottom: '12px' }} />
          <p>Loading live mandi rates...</p>
        </div>
      ) : sortedRates.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '3rem', color: 'rgba(255,255,255,0.35)' }}>
          <div style={{ fontSize: '3rem', marginBottom: '12px' }}>🔍</div>
          <p>No mandi rates found for your filters.</p>
          <button onClick={() => { setSearch(''); setCategory('All'); setState('All States'); }}
            style={{ marginTop: '10px', background: 'rgba(34,197,94,0.15)', border: '1px solid rgba(34,197,94,0.3)', color: '#4ade80', padding: '8px 16px', borderRadius: '8px', cursor: 'pointer', fontSize: '0.85rem' }}>
            Clear All Filters
          </button>
        </div>
      ) : (
        <>
          <div style={{ fontSize: '0.78rem', color: 'rgba(255,255,255,0.35)', marginBottom: '-4px' }}>
            Showing <strong style={{ color: '#60a5fa' }}>{sortedRates.length}</strong> mandi rates
          </div>
          <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fill, minmax(270px, 1fr))', gap: '0.9rem' }}>
            {sortedRates.map(rate => (
              <MandiCard key={rate.id} rate={rate} onSell={setSellRate} />
            ))}
          </div>
        </>
      )}

      {/* Disclaimer */}
      <div style={{ background: 'rgba(251,191,36,0.06)', border: '1px solid rgba(251,191,36,0.15)', borderRadius: '12px', padding: '10px 14px' }}>
        <p style={{ margin: 0, fontSize: '0.74rem', color: 'rgba(255,255,255,0.4)', lineHeight: 1.6 }}>
          <i className="fa-solid fa-triangle-exclamation" style={{ color: '#fbbf24', marginRight: '6px' }} />
          <strong style={{ color: '#fbbf24' }}>Disclaimer:</strong> Prices shown are indicative and are based on Agmarknet/APMC historical data with daily simulation. Actual market prices may vary. Always confirm with your local mandi officer before transacting. Modal price (★) is the most traded price of the day.
        </p>
      </div>

      {/* Sell Modal */}
      {sellRate && <SellModal rate={sellRate} onClose={() => setSellRate(null)} />}
    </div>
  );
}
