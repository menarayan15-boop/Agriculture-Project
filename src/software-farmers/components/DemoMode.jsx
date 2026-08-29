import React, { useState } from 'react';
import { api } from '../utils/apiSimulator';
import { Play, Square, CheckCircle, ChevronRight, Hash } from 'lucide-react';

export default function DemoMode({ dbState }) {
    const isDemo = dbState.demoMode;
    const step = dbState.demoStep || 0;

    const steps = [
        "Farmer Registration & Field Creation",
        "Sensors & Digital Twin Online",
        "Explainable AI Crop Recommendation",
        "Dry Spell Detection (Moisture drops)",
        "IoT Auto-Irrigation Trigger",
        "Rain Forecast Detection",
        "Smart Irrigation Postponement",
        "Language & Device Independent Access (IVR/SMS/Kiosk)",
        "Disease Modules & Impact Metrics"
    ];

    const toggleDemo = () => api.toggleDemoMode(!isDemo);
    const advance = () => api.advanceDemoStep();

    return (
        <div className="demo-mode-panel">
            <div className="demo-header">
                <div>
                    <h2>🏆 SIH Final Presentation Simulator</h2>
                    <p>Walkthrough demo mode to showcase all multi-device integrations & closed-loop logic</p>
                </div>
                <button className={`demo-toggle-btn ${isDemo ? 'active' : ''}`} onClick={toggleDemo}>
                    {isDemo ? <Square size={16} /> : <Play size={16} />}
                    {isDemo ? 'End Demo Mode' : 'Start SIH Demo'}
                </button>
            </div>

            {isDemo ? (
                <div className="demo-workspace">
                    <div className="demo-sidebar">
                        <h3>Demo Script Checklist</h3>
                        <div className="demo-checklist">
                            {steps.map((s, i) => {
                                const stepNum = i + 1;
                                // Rough mapping of the 17 micro-steps to these 9 macro steps
                                const isDone = step > (stepNum * 1.8);
                                const isCurrent = !isDone && step > ((stepNum - 1) * 1.8);
                                return (
                                    <div key={i} className={`demo-chk-item ${isDone ? 'done' : isCurrent ? 'current' : ''}`}>
                                        <div className="dci-icon">{isDone ? <CheckCircle size={16} /> : <Hash size={14} />}</div>
                                        <div className="dci-text">{s}</div>
                                    </div>
                                )
                            })}
                        </div>
                    </div>

                    <div className="demo-main">
                        <div className="demo-current-action">
                            <span className="dca-badge">Step {step} of 17</span>
                            <h3>{
                                step === 0 ? "Ready to begin presentation." :
                                    step === 4 || step === 8 || step === 11 ? "🚨 Triggering Environmental Event..." :
                                        step >= 17 ? "Demo Complete!" : "Executing System Actions..."
                            }</h3>
                        </div>

                        <div className="demo-controls">
                            <button className="demo-advance-btn" onClick={advance} disabled={step >= 17}>
                                Execute Next Demo Action <ChevronRight size={18} />
                            </button>
                        </div>

                        <div className="demo-instruction">
                            <p><strong>Note for Judges:</strong> This demo injects simulated sensor inputs and time-dilated weather forecasts to demonstrate the AI decision engine in real-time, bypassing the need for physical hardware delays.</p>
                        </div>
                    </div>
                </div>
            ) : (
                <div className="demo-idle">
                    <p>Demo mode is disabled. The system is operating in normal simulator state.</p>
                </div>
            )}
        </div>
    );
}
