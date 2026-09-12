import React, { useState } from 'react';
import { useApp } from '../../context/AppContext';

export function GeminiKeyModal({ onClose }) {
  const { geminiKey, saveAiKey } = useApp();
  const [inputKey, setInputKey] = useState(geminiKey || '');

  const handleSave = () => {
    saveAiKey(inputKey.trim());
    onClose();
  };

  const handleClear = () => {
    setInputKey('');
    saveAiKey('');
    onClose();
  };

  const isGroq = inputKey.startsWith('gsk_');
  const isGemini = inputKey.startsWith('AIza');

  return (
    <div className="modal-backdrop">
      <div className="modal-content card" style={{ maxWidth: '520px', width: '92%', padding: '1.75rem', background: '#FFFFFF', border: '1px solid #E5E7EB', borderRadius: 18, boxShadow: '0 20px 25px -5px rgba(0,0,0,0.1)' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
          <h3 style={{ margin: 0, fontSize: '1.15rem', color: '#17211B', fontWeight: 800, display: 'flex', alignItems: 'center', gap: 8 }}>
            <span>⚡</span> Connect AI Engine (Groq / Gemini)
          </h3>
          <button className="btn-close" onClick={onClose} style={{ background: 'none', border: 'none', color: '#6B7280', fontSize: '1.4rem', cursor: 'pointer', lineHeight: 1 }}>&times;</button>
        </div>
        
        <p style={{ fontSize: '0.84rem', color: '#4B5563', marginBottom: '1rem', lineHeight: 1.5 }}>
          Connect your <strong>Groq API Key (Recommended for high-speed voice AI)</strong> or Google Gemini API Key for real-time agronomic reasoning and voice answers.
        </p>

        <div style={{ background: '#F0FDF4', border: '1px solid #BBF7D0', padding: '10px 14px', borderRadius: 10, marginBottom: '1.2rem', fontSize: '0.8rem', color: '#166534' }}>
          <strong>💡 Free Groq Key:</strong> Get your free instant key at{' '}
          <a href="https://console.groq.com/keys" target="_blank" rel="noopener noreferrer" style={{ color: '#15803D', fontWeight: 700, textDecoration: 'underline' }}>
            console.groq.com/keys
          </a>
        </div>

        <div className="form-group" style={{ marginBottom: '1.2rem' }}>
          <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: 6 }}>
            <label style={{ fontSize: '0.82rem', fontWeight: 600, color: '#374151' }}>
              API Key (Groq `gsk_...` or Gemini `AIza...`):
            </label>
            {isGroq && <span style={{ fontSize: '0.72rem', background: '#DCFCE7', color: '#15803D', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>⚡ Groq Detected</span>}
            {isGemini && <span style={{ fontSize: '0.72rem', background: '#DBEAFE', color: '#1D4ED8', padding: '2px 8px', borderRadius: 12, fontWeight: 700 }}>🌟 Gemini Detected</span>}
          </div>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="Paste gsk_... or AIzaSy..."
            className="form-control"
            style={{ width: '100%', padding: '10px 12px', borderRadius: 10, border: '1px solid #E5E7EB', background: '#FFFFFF', color: '#17211B', fontSize: '0.9rem', boxSizing: 'border-box' }}
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

