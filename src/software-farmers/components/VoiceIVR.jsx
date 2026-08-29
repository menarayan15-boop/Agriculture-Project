import React, { useState, useEffect } from 'react';
import { api } from '../utils/apiSimulator';
import { Phone, PhoneOff, Volume2, VolumeX, Radio, Disc } from 'lucide-react';

export default function VoiceIVR({ dbState }) {
    const [callActive, setCallActive] = useState(false);
    const [callDuration, setCallDuration] = useState(0);
    const [dialogueText, setDialogueText] = useState('');
    const [ttsPrompt, setTtsPrompt] = useState('');
    const [speakAudio, setSpeakAudio] = useState(true);
    const [loading, setLoading] = useState(false);

    // Interval for call duration
    useEffect(() => {
        let timer;
        if (callActive) {
            timer = setInterval(() => {
                setCallDuration(prev => prev + 1);
            }, 1000);
        } else {
            setCallDuration(0);
        }
        return () => clearInterval(timer);
    }, [callActive]);

    // Cancel speech on unmount
    useEffect(() => {
        return () => {
            if (window.speechSynthesis) {
                window.speechSynthesis.cancel();
            }
        };
    }, []);

    const speakText = (text) => {
        if (!speakAudio || !window.speechSynthesis) return;

        // Cancel prior speech
        window.speechSynthesis.cancel();

        const utterance = new SpeechSynthesisUtterance(text);
        // Find a suitable voice (prefer Hindi voice for Hindi prompt if browser supports it)
        const voices = window.speechSynthesis.getVoices();
        const isHindi = /[\u0900-\u097F]/.test(text); // Basic regex to test if text has Hindi characters

        if (isHindi) {
            const hiVoice = voices.find(v => v.lang.includes('IN') || v.lang.startsWith('hi'));
            if (hiVoice) utterance.voice = hiVoice;
            utterance.lang = 'hi-IN';
            utterance.rate = 0.85; // slightly slower for rural farmers
        } else {
            // JARVIS VOICE PREFERENCE (UK Male / Deep)
            const jarvisVoice = voices.find(v =>
                v.name.includes('Google UK English Male') ||
                v.name.includes('George') ||
                v.name.includes('Daniel') ||
                v.name.includes('UK English Male')
            );
            if (jarvisVoice) {
                utterance.voice = jarvisVoice;
                utterance.lang = 'en-GB';
                utterance.pitch = 0.8;
                utterance.rate = 1.0;
            } else {
                const enVoice = voices.find(v => v.lang.includes('IN') || v.lang.startsWith('en'));
                if (enVoice) utterance.voice = enVoice;
                utterance.lang = 'en-IN';
                utterance.rate = 0.9;
            }
        }

        window.speechSynthesis.speak(utterance);
    };

    const activePhone = dbState?.farmer?.phone || dbState?.registeredFarmers?.find(f => f.id === dbState?.activeFarmerId)?.phone || "+91 94420 12345";

    const startCall = async () => {
        setLoading(true);
        setCallActive(true);
        const response = await api.processIVRAction(activePhone, 'init');
        setDialogueText(response.dialogueText);
        setTtsPrompt(response.ttsPrompt);
        setLoading(false);
        speakText(response.ttsPrompt);
    };

    const endCall = () => {
        if (window.speechSynthesis) {
            window.speechSynthesis.cancel();
        }
        setCallActive(false);
        setDialogueText('');
        setTtsPrompt('');
    };

    const handleKeyPress = async (key) => {
        if (!callActive) return;
        setLoading(true);

        // Stop speaking currently
        if (window.speechSynthesis) window.speechSynthesis.cancel();

        const response = await api.processIVRAction(activePhone, key);
        setDialogueText(response.dialogueText);
        setTtsPrompt(response.ttsPrompt);
        setLoading(false);
        speakText(response.ttsPrompt);
    };

    const formatDuration = (sec) => {
        const mins = Math.floor(sec / 60);
        const secs = sec % 60;
        return `${mins}:${secs < 10 ? '0' : ''}${secs}`;
    };

    return (
        <div className="phone-mockup-wrapper">
            <div className="classic-keypad-phone voice-ivr-phone">
                <div className="phone-earpiece"></div>
                <div className="phone-screen-border">
                    <div className="classic-phone-screen voice-screen">
                        {callActive ? (
                            <div className="ivr-call-active-ui flex flex-col justify-between h-full">
                                {/* Header */}
                                <div className="ivr-hdr flex justify-between items-center text-xs">
                                    <span className="flex items-center gap-1"><Radio size={10} className="pulse-slow" /> VoLTE</span>
                                    <span>Toll-Free IVR</span>
                                    <span>{formatDuration(callDuration)}</span>
                                </div>

                                {/* Subtitle */}
                                <div className="ivr-title-pane text-center">
                                    <div className="dialed-number">1800-419-5888</div>
                                    <div className="call-status">Gramin Farmer Helpdesk</div>
                                </div>

                                {/* Audio Waveform Simulator */}
                                <div className="waveform-box flex items-center justify-center gap-1">
                                    <div className="bar bar-1"></div>
                                    <div className="bar bar-2"></div>
                                    <div className="bar bar-3"></div>
                                    <div className="bar bar-4"></div>
                                    <div className="bar bar-5"></div>
                                    <div className="bar bar-6"></div>
                                </div>

                                {/* Dialog Display Box */}
                                <div className="dialogue-box">
                                    <div className="dialogue-scroll">
                                        {loading ? (
                                            <span className="text-xs italic opacity-60">Synthesizing speech response...</span>
                                        ) : (
                                            dialogueText.split('\n').map((line, idx) => (
                                                <div key={idx} className="dialogue-line">{line}</div>
                                            ))
                                        )}
                                    </div>
                                </div>

                                {/* Speaker Control & Hangup Button */}
                                <div className="ivr-call-controls flex justify-between items-center px-2 py-1 bg-black-20">
                                    <button
                                        className={`speaker-btn ${speakAudio ? 'active' : ''}`}
                                        onClick={() => {
                                            setSpeakAudio(!speakAudio);
                                            if (speakAudio && window.speechSynthesis) window.speechSynthesis.cancel();
                                        }}
                                        title={speakAudio ? "Silence Voice" : "Enable Read Aloud"}
                                    >
                                        {speakAudio ? <Volume2 size={14} /> : <VolumeX size={14} />}
                                        <span className="text-[10px] ml-1">{speakAudio ? 'Mute' : 'Speak'}</span>
                                    </button>

                                    <button className="hangup-action-btn" onClick={endCall}>
                                        <PhoneOff size={12} /> Hang Up
                                    </button>
                                </div>
                            </div>
                        ) : (
                            <div className="ivr-dial-screen flex flex-col justify-center items-center h-full gap-4">
                                <div className="bell-icon">📞</div>
                                <div className="dial-header text-center">
                                    <h4>Gramin Voice Helpdesk</h4>
                                    <p className="text-xs opacity-75">Toll-Free IVR Service</p>
                                    <p className="text-[11px] text-green-500 font-semibold mt-1">1800-419-5888</p>
                                </div>
                                <button className="dial-action-btn flex items-center gap-2" onClick={startCall}>
                                    <Phone size={14} /> Call Local Gateway
                                </button>
                                <div className="text-[10px] text-center opacity-60 px-4">
                                    Runs standard interactive voice prompt. Uses browser Speech Synthesis to talk out loud.
                                </div>
                            </div>
                        )}
                    </div>
                </div>

                {/* Feature Phone Plastic Buttons (Enabled only when call active) */}
                <div className="phone-keypad ivr-keypad">
                    <div className="dpad-row">
                        <button className="key-btn action-key" disabled={!callActive}>Menu</button>
                        <button className="key-btn center-dpad">⚪</button>
                        <button className="key-btn action-key" disabled={!callActive} onClick={endCall}>
                            {callActive ? <PhoneOff size={12} className="text-red-500" /> : 'Back'}
                        </button>
                    </div>

                    <div className="key-row mt-2">
                        <button className="key-btn" disabled={!callActive} onClick={() => handleKeyPress('1')}>
                            <div className="num">1</div><div className="letters text-[8px] mt-0.5">Advice</div>
                        </button>
                        <button className="key-btn" disabled={!callActive} onClick={() => handleKeyPress('2')}>
                            <div className="num">2</div><div className="letters text-[8px] mt-0.5">Soil/Water</div>
                        </button>
                        <button className="key-btn" disabled={!callActive} onClick={() => handleKeyPress('3')}>
                            <div className="num">3</div><div className="letters text-[8px] mt-0.5">Crop</div>
                        </button>
                    </div>

                    <div className="key-row">
                        <button className="key-btn" disabled={!callActive} onClick={() => handleKeyPress('4')}>
                            <div className="num">4</div><div className="letters text-[8px] mt-0.5">Weather</div>
                        </button>
                        <button className="key-btn" disabled={!callActive} onClick={() => handleKeyPress('5')}>
                            <div className="num">5</div><div className="letters text-[8px] mt-0.5">Irrigate</div>
                        </button>
                        <button className="key-btn" disabled={!callActive} onClick={() => handleKeyPress('6')}>
                            <div className="num">6</div><div className="letters text-[8px] mt-0.5" style={{ color: '#f43f5e' }}>Safety</div>
                        </button>
                    </div>

                    <div className="key-row">
                        <button className="key-btn" disabled={!callActive} onClick={() => handleKeyPress('7')}>
                            <div className="num">7</div><div className="letters text-[8px] mt-0.5">Summary</div>
                        </button>
                        <button className="key-btn" disabled={!callActive} onClick={() => handleKeyPress('8')}>
                            <div className="num">8</div><div className="letters text-[8px] mt-0.5">Language</div>
                        </button>
                        <button className="key-btn" disabled={!callActive} onClick={() => handleKeyPress('9')}>
                            <div className="num">9</div><div className="letters text-[8px] mt-0.5">Help</div>
                        </button>
                    </div>

                    <div className="key-row">
                        <button className="key-btn" disabled={!callActive}>
                            <div className="num">*</div><div className="letters text-[8px] mt-0.5">a/A</div>
                        </button>
                        <button className="key-btn" disabled={!callActive} onClick={() => handleKeyPress('0')}>
                            <div className="num">0</div><div className="letters text-[8px] mt-0.5">Menu</div>
                        </button>
                        <button className="key-btn" disabled={!callActive}>
                            <div className="num">#</div><div className="letters text-[8px] mt-0.5">⌕</div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="interface-instruction-card">
                <h4 className="flex items-center gap-1"><Volume2 size={16} /> IVR/Voice interface simulation</h4>
                <p>Accessible from any zero-data feature keypad phone. By dialing a toll-free number, farmers get local voice menus. Turn on your speakers to hear the automated voice prompts read out loud!</p>
            </div>
        </div>
    );
}
