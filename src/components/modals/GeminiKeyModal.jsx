import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export function GeminiKeyModal({ onClose }) {
  const { geminiKey, saveAiKey } = useApp();
  const [inputKey, setInputKey] = useState(geminiKey);

  const handleSave = () => {
    saveAiKey(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    saveAiKey('');
    onClose();
  };

  return (
    <div className="modal-backdrop">
      <div className="modal-content card" style={{ maxWidth: '480px', width: '92%', padding: '1.75rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 18, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#17211B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>🔑</span> Google Gemini API Key
          </h3>
          <button className="btn-close" onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
        </div>
        
        <p style={{ fontSize: '0.82rem', color: '#6B7280', marginBottom: '1.2rem', lineHeight: 1.5 }}>
          Connect your Google Gemini API Key to enable instant crop diagnosis, real-time agronomist reasoning, and voice responses. Keys are saved locally on your device only.
        </p>

        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
          <label style={{ display: 'block', fontSize: '0.82rem', fontWeight: 600, color: '#374151', marginBottom: 6 }}>
            API Key:
          </label>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="AIzaSy..."
            className="form-control"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#17211B', fontSize: '0.9rem' }}
          />
        </div>

        <div style={{ display: 'flex', gap: '0.75rem', marginTop: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={handleClear} style={{ padding: '8px 16px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#F3F4F6', color: '#4B5563', fontWeight: 600, cursor: 'pointer' }}>
            Clear Key
          </button>
          <button className="btn btn-primary" onClick={handleSave} style={{ marginLeft: 'auto', padding: '8px 18px', borderRadius: 10, border: 'none', background: '#15803D', color: '#FFFFFF', fontWeight: 700, cursor: 'pointer' }}>
            Save &amp; Connect
          </button>
        </div>
      </div>
    </div>
  );
}

