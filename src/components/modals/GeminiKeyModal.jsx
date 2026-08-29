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
      <div className="modal-content card" style={{ maxWidth: '500px', width: '92%', padding: '1.75rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <button className="btn-close" onClick={onClose} style={{ background: 'none', border: 'none', color: '#fff', fontSize: '1.2rem', cursor: 'pointer' }}>&times;</button>
        </div>
        <div className="form-group">
          <label>Google Gemini API Key:</label>
          <input
            type="password"
            value={inputKey}
            onChange={(e) => setInputKey(e.target.value)}
            placeholder="AIzaSy..."
            className="form-control"
          />
        </div>

        <div style={{ display: 'flex', gap: '1rem', marginTop: '1.5rem' }}>
          <button className="btn btn-secondary" onClick={handleClear}>Clear Key</button>
          <button className="btn btn-primary" onClick={handleSave} style={{ marginLeft: 'auto' }}>Save &amp; Connect</button>
        </div>
      </div>
    </div>
  );
}
