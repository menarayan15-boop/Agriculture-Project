import React, { useState } from 'react';
import { useApp } from '../context/AppContext';

export function FloatingVoiceMic({ onOpenVoiceTab }) {
  const { setActiveTab } = useApp();
  const [isOpen, setIsOpen] = useState(false);
  const [isRecording, setIsRecording] = useState(false);

  const handleClickMic = () => {
    setIsOpen(true);
    setIsRecording(!isRecording);
  };

  return (
    <div className={`floating-voice-widget ${isRecording ? 'state-listening' : 'state-idle'}`}>
      {isOpen && (
        <div className="floating-voice-popover">
          <div className="floating-popover-header">
            <div className="popover-status-badge">
              <span className="status-dot"></span>
              <span>{isRecording ? 'Listening...' : 'Ready to Listen'}</span>
            </div>
            <button type="button" className="btn-popover-close" onClick={() => setIsOpen(false)}>&times;</button>
          </div>
          <div className="floating-popover-body">
            <div className="floating-transcript-text">
              {isRecording ? 'Listening to your voice... Speak now' : 'Tap microphone to ask questions in Hindi, English, Punjabi, etc.'}
            </div>
          </div>
          <div className="floating-popover-actions">
            <button type="button" className="btn-floating-tab-link" onClick={() => { setActiveTab('voice-ai'); setIsOpen(false); }}>
              <i className="fa-solid fa-up-right-from-square"></i> Open Full Voice Studio
            </button>
          </div>
        </div>
      )}

      <div className="floating-pulse-rings">
        <div className="pulse-ring pr1"></div>
        <div className="pulse-ring pr2"></div>
        <div className="pulse-ring pr3"></div>
      </div>

      <button type="button" className="btn-floating-mic" onClick={handleClickMic} title="Voice AI Assistant">
        <div className="floating-mic-inner">
          <i className="fa-solid fa-microphone floating-mic-icon"></i>
        </div>
        <div className="floating-mic-tooltip">Ask Krishi Voice AI</div>
      </button>
    </div>
  );
}
