import React, { useState, useRef, useEffect } from 'react';
import { api } from '../utils/apiSimulator';
import { Send, Smartphone, MessageSquare } from 'lucide-react';

export default function SMSSimulator({ dbState }) {
    const [inputText, setInputText] = useState('');
    const chatContainerRef = useRef(null);
    const activePhone = dbState?.farmer?.phone || dbState?.registeredFarmers?.find(f => f.id === dbState?.activeFarmerId)?.phone || "+91 94420 12345";
    const smsInbox = dbState.smsLog.filter(msg => msg.sender === activePhone || msg.recipient === activePhone);

    const scrollToBottom = () => {
        if (chatContainerRef.current) {
            chatContainerRef.current.scrollTo({
                top: chatContainerRef.current.scrollHeight,
                behavior: 'smooth'
            });
        }
    };

    useEffect(() => {
        scrollToBottom();
    }, [smsInbox]);

    const handleSend = async (e) => {
        if (e) e.preventDefault();
        if (!inputText.trim()) return;
        const msg = inputText;
        setInputText('');
        await api.receiveSMS(activePhone, msg);
    };

    const handleQuickCommand = async (cmd) => {
        await api.receiveSMS(activePhone, cmd);
    };

    return (
        <div className="phone-mockup-wrapper">
            {/* Keypad Phone Shell */}
            <div className="classic-keypad-phone">
                <div className="phone-earpiece"></div>
                <div className="phone-screen-border">
                    <div className="classic-phone-screen">
                        {/* Screen Header */}
                        <div className="classic-screen-hdr flex justify-between items-center text-xs">
                            <span>📶 BSNL 2G</span>
                            <span className="font-bold">USFP SMS Server</span>
                            <span>🔋 89%</span>
                        </div>

                        {/* Chat Thread */}
                        <div className="classic-chat-thread" ref={chatContainerRef}>
                            {smsInbox.length === 0 ? (
                                <div className="text-center text-xs opacity-60 p-4">No messages. Send a message to get started.</div>
                            ) : (
                                smsInbox.map((msg, index) => (
                                    <div key={index} className={`sms-bubble ${msg.sender === 'System' ? 'sms-rec' : 'sms-sent'}`}>
                                        <div className="sms-sender-lbl">{msg.sender === 'System' ? '555-USFP (Central API)' : 'You'}</div>
                                        <div className="sms-text">{msg.text}</div>
                                        <div className="sms-time text-right">{msg.time}</div>
                                    </div>
                                ))
                            )}
                        </div>

                        {/* Input simulation on screen */}
                        <form onSubmit={handleSend} className="classic-screen-input-bar">
                            <input
                                type="text"
                                placeholder="Type command..."
                                value={inputText}
                                onChange={(e) => setInputText(e.target.value)}
                                className="classic-text-input font-mono"
                            />
                            <button type="submit" className="classic-send-btn">
                                <Send size={12} />
                            </button>
                        </form>
                    </div>
                </div>

                {/* Feature Phone Plastic Buttons */}
                <div className="phone-keypad">
                    <div className="dpad-row">
                        <button className="key-btn action-key" onClick={() => handleQuickCommand('STATUS')}>STATUS</button>
                        <button className="key-btn center-dpad">⚪</button>
                        <button className="key-btn action-key" onClick={() => handleQuickCommand('HELP')}>HELP</button>
                    </div>

                    <div className="key-row mt-2">
                        <button className="key-btn" onClick={() => handleQuickCommand('WEATHER')}>
                            <div className="num">1</div><div className="letters text-[7px] mt-0.5">WEATHER</div>
                        </button>
                        <button className="key-btn" onClick={() => handleQuickCommand('CROP')}>
                            <div className="num">2</div><div className="letters text-[7px] mt-0.5">CROP</div>
                        </button>
                        <button className="key-btn" onClick={() => handleQuickCommand('WATER')}>
                            <div className="num">3</div><div className="letters text-[7px] mt-0.5">WATER</div>
                        </button>
                    </div>

                    <div className="key-row">
                        <button className="key-btn" onClick={() => handleQuickCommand('HEALTH')} style={{ borderColor: '#f43f5e33' }}>
                            <div className="num" style={{ color: '#f43f5e' }}>4</div><div className="letters text-[7px] mt-0.5" style={{ color: '#f43f5e' }}>HEALTH</div>
                        </button>
                        <button className="key-btn" onClick={() => handleQuickCommand('AQI')} style={{ borderColor: '#8b5cf633' }}>
                            <div className="num" style={{ color: '#8b5cf6' }}>5</div><div className="letters text-[7px] mt-0.5" style={{ color: '#8b5cf6' }}>AQI</div>
                        </button>
                        <button className="key-btn" onClick={() => handleQuickCommand('HEAT')} style={{ borderColor: '#f97316aa' }}>
                            <div className="num" style={{ color: '#f97316' }}>6</div><div className="letters text-[7px] mt-0.5" style={{ color: '#f97316' }}>HEAT</div>
                        </button>
                    </div>

                    <div className="key-row">
                        <button className="key-btn" onClick={() => handleQuickCommand('SOS')} style={{ background: '#7f1d1d', borderColor: '#dc2626' }}>
                            <div className="num" style={{ color: '#fca5a5', fontSize: '11px', fontWeight: 'bold' }}>🆘</div><div className="letters text-[7px] mt-0.5" style={{ color: '#fca5a5' }}>SOS</div>
                        </button>
                        <button className="key-btn">
                            <div className="num">8</div><div className="letters">TUV</div>
                        </button>
                        <button className="key-btn">
                            <div className="num">9</div><div className="letters">WXYZ</div>
                        </button>
                    </div>

                    <div className="key-row">
                        <button className="key-btn">
                            <div className="num">*</div><div className="letters">a/A</div>
                        </button>
                        <button className="key-btn">
                            <div className="num">0</div><div className="letters">_</div>
                        </button>
                        <button className="key-btn">
                            <div className="num">#</div><div className="letters">⌕</div>
                        </button>
                    </div>
                </div>
            </div>

            <div className="interface-instruction-card">
                <h4 className="flex items-center gap-1"><MessageSquare size={16} /> SMS Gateway — Offline Health & Farm</h4>
                <p>No app required. Text commands: <strong>STATUS</strong>, <strong>WEATHER</strong>, <strong>CROP</strong>, <strong>WATER</strong> for farm data.
                    New: <strong>HEALTH</strong>, <strong>AQI</strong>, <strong>HEAT</strong>, <strong>SOS</strong> for safety intelligence. Works on any phone with SMS capability.</p>
            </div>
        </div>
    );
}
