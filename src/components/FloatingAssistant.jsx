import { useState, useEffect, useRef } from 'react';

const helpItems = [
  { icon: '🌾', label: 'फसल सलाह', sub: 'Crop Advice', color: '#10b981', tab: 'voice' },
  { icon: '🌦️', label: 'मौसम जानें', sub: 'Check Weather', color: '#38bdf8', tab: 'weather' },
  { icon: '💰', label: 'मंडी भाव', sub: 'Mandi Prices', color: '#fbbf24', tab: 'mandi' },
  { icon: '🧪', label: 'मिट्टी जाँच', sub: 'Soil Test', color: '#a78bfa', tab: 'soil' },
  { icon: '📞', label: 'किसान हेल्पलाइन', sub: '1800-180-1551 (Free)', color: '#f87171', isHelpline: true },
];

export default function FloatingAssistant({ onTabChange }) {
  const [open, setOpen] = useState(false);
  const [pulsing, setPulsing] = useState(true);
  const panelRef = useRef(null);

  useEffect(() => { if (open) setPulsing(false); }, [open]);

  useEffect(() => {
    const handler = (e) => {
      if (panelRef.current && !panelRef.current.contains(e.target)) setOpen(false);
    };
    if (open) document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, [open]);

  const handleItem = (item) => {
    if (item.isHelpline) { window.open('tel:18001801551'); return; }
    if (onTabChange && item.tab) onTabChange(item.tab);
    setOpen(false);
  };

  return (
    <div ref={panelRef} style={{
      position: 'fixed', bottom: '24px', right: '24px', zIndex: 9999,
      fontFamily: "'Segoe UI', Tahoma, sans-serif",
    }}>
      {/* Expanded Panel */}
      {open && (
        <div style={{
          position: 'absolute', bottom: '76px', right: 0, width: '248px',
          background: 'rgba(10, 25, 16, 0.97)',
          border: '1px solid rgba(16, 185, 129, 0.35)',
          borderRadius: '20px',
          boxShadow: '0 20px 50px rgba(0,0,0,0.7)',
          overflow: 'hidden',
          animation: 'floatFadeIn 0.25s ease-out',
        }}>
          {/* Panel Header */}
          <div style={{
            background: 'linear-gradient(135deg, rgba(16,185,129,0.18) 0%, rgba(10,25,16,0.95) 100%)',
            borderBottom: '1px solid rgba(16,185,129,0.2)',
            padding: '14px 16px',
            display: 'flex', alignItems: 'center', gap: '10px',
          }}>
            <span style={{ fontSize: '22px' }}>🌱</span>
            <div>
              <div style={{ color: '#4ade80', fontWeight: 800, fontSize: '14px' }}>किसान सहायक</div>
              <div style={{ color: '#94a3b8', fontSize: '11px' }}>Farmer Assistant · 24×7</div>
            </div>
            <div style={{
              marginLeft: 'auto', width: '8px', height: '8px', borderRadius: '50%',
              background: '#4ade80', boxShadow: '0 0 6px #4ade80',
              animation: 'liveDot 1.5s ease-in-out infinite',
            }} />
          </div>

          {/* Menu Items */}
          <div style={{ padding: '8px' }}>
            {helpItems.map((item, i) => (
              <button key={i} onClick={() => handleItem(item)} style={{
                width: '100%', display: 'flex', alignItems: 'center', gap: '12px',
                padding: '10px 12px', background: 'transparent', border: 'none',
                borderRadius: '12px', cursor: 'pointer', transition: 'background 0.2s', textAlign: 'left',
              }}
              onMouseEnter={e => e.currentTarget.style.background = 'rgba(255,255,255,0.05)'}
              onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                <span style={{
                  width: '38px', height: '38px',
                  background: `${item.color}22`, border: `1px solid ${item.color}55`,
                  borderRadius: '10px', display: 'flex', alignItems: 'center',
                  justifyContent: 'center', fontSize: '18px', flexShrink: 0,
                }}>{item.icon}</span>
                <div>
                  <div style={{ color: '#fff', fontWeight: 700, fontSize: '13px' }}>{item.label}</div>
                  <div style={{ color: '#94a3b8', fontSize: '11px' }}>{item.sub}</div>
                </div>
                {!item.isHelpline && (
                  <span style={{ marginLeft: 'auto', color: '#4ade80', fontSize: '16px' }}>›</span>
                )}
              </button>
            ))}
          </div>

          {/* Footer */}
          <div style={{
            borderTop: '1px solid rgba(255,255,255,0.06)', padding: '10px 16px',
            textAlign: 'center', color: '#64748b', fontSize: '11px',
          }}>
            🔒 Powered by Krishi-Jal AI · Free service
          </div>
        </div>
      )}

      {/* FAB Button */}
      <button
        onClick={() => setOpen(o => !o)}
        title="किसान सहायक – Farmer Assistant"
        style={{
          width: '60px', height: '60px', borderRadius: '50%', border: 'none', cursor: 'pointer',
          background: open
            ? 'linear-gradient(135deg, #059669, #047857)'
            : 'linear-gradient(135deg, #10b981, #059669)',
          color: '#fff', fontSize: open ? '22px' : '28px',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          boxShadow: pulsing ? '0 0 0 0 rgba(16,185,129,0.6)' : '0 8px 28px rgba(16,185,129,0.5)',
          animation: pulsing ? 'fabPulse 2s ease-in-out infinite' : 'none',
          transition: 'all 0.3s ease', position: 'relative',
        }}
      >
        {open ? '✕' : '🌱'}
        {!open && (
          <span style={{
            position: 'absolute', top: '2px', right: '2px',
            width: '14px', height: '14px', borderRadius: '50%',
            background: '#4ade80', border: '2px solid rgba(10,25,16,0.9)',
            boxShadow: '0 0 6px #4ade80',
            animation: 'liveDot 1.5s ease-in-out infinite',
          }} />
        )}
      </button>

      <style>{`
        @keyframes fabPulse {
          0%   { box-shadow: 0 0 0 0 rgba(16,185,129,0.55); }
          70%  { box-shadow: 0 0 0 18px rgba(16,185,129,0); }
          100% { box-shadow: 0 0 0 0 rgba(16,185,129,0); }
        }
        @keyframes floatFadeIn {
          from { opacity: 0; transform: translateY(12px) scale(0.96); }
          to   { opacity: 1; transform: translateY(0) scale(1); }
        }
        @keyframes liveDot {
          0%, 100% { opacity: 1; }
          50%       { opacity: 0.3; }
        }
      `}</style>
    </div>
  );
}
