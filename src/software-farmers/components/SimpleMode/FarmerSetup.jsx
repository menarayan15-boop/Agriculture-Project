import React, { useState } from 'react';
import { Volume2 } from 'lucide-react';

export default function FarmerSetup({ onComplete }) {
    const [step, setStep] = useState(1);
    const [formData, setFormData] = useState({});

    const speak = (text) => {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(text);
            const voices = window.speechSynthesis.getVoices();
            if (!/[\u0900-\u097F]/.test(text)) {
                const jarvisVoice = voices.find(v => v.name.includes('Google UK English Male') || v.name.includes('George') || v.name.includes('Daniel') || v.name.includes('UK English Male'));
                if (jarvisVoice) {
                    utterance.voice = jarvisVoice;
                    utterance.lang = 'en-GB';
                    utterance.pitch = 0.8;
                    utterance.rate = 1.0;
                }
            } else {
                const hiVoice = voices.find(v => v.lang.includes('IN') || v.lang.startsWith('hi'));
                if (hiVoice) utterance.voice = hiVoice;
                utterance.lang = 'hi-IN';
            }
            window.speechSynthesis.speak(utterance);
        }
    };

    const nextStep = () => {
        if (step < 6) setStep(step + 1);
        else onComplete();
    };

    const handleInput = (key, val) => setFormData(prev => ({ ...prev, [key]: val }));

    const steps = [
        { id: 1, title: 'Your Name', emoji: '👨‍🌾', field: 'name', placeholder: 'Enter your name', type: 'text' },
        { id: 2, title: 'Your Village', emoji: '📍', field: 'village', placeholder: 'Enter your village', type: 'text' },
        { id: 3, title: 'Your Farm Size', emoji: '🌾', field: 'size', placeholder: 'e.g. 2 acres', type: 'text' },
        { id: 4, title: 'What are you growing?', emoji: '🌱', field: 'crop', placeholder: 'e.g. Tomato', type: 'text' },
        { id: 5, title: 'What water source do you have?', emoji: '💧', field: 'water', placeholder: 'e.g. Borewell / Canal', type: 'text' },
        { id: 6, title: 'Ready to connect!', emoji: '🌍', text: 'We will now connect your soil and weather information.' }
    ];

    const current = steps[step - 1];

    return (
        <div className="min-h-screen bg-green-50 flex flex-col p-6 items-center justify-center">
            <button className="absolute top-4 right-4 bg-green-200 p-3 rounded-full text-green-900" onClick={() => speak(current.title)}>
                <Volume2 size={32} />
            </button>
            <div className="w-full max-w-sm mb-6">
                <p className="text-center font-bold text-green-700 mb-2">Step {step} of 6</p>
                <div className="w-full bg-green-200 rounded-full h-2.5">
                    <div className="bg-green-600 h-2.5 rounded-full" style={{ width: `${(step / 6) * 100}%` }}></div>
                </div>
            </div>

            <div className="text-[80px] mb-6">{current.emoji}</div>
            <h2 className="text-3xl font-bold text-green-900 mb-8 text-center">{current.title}</h2>

            {current.field && (
                <input
                    type={current.type}
                    value={formData[current.field] || ''}
                    onChange={(e) => handleInput(current.field, e.target.value)}
                    placeholder={current.placeholder}
                    className="w-full max-w-sm text-2xl p-4 rounded-xl border-2 border-green-300 focus:border-green-600 outline-none mb-12 text-center"
                />
            )}

            {current.text && (
                <p className="text-xl text-green-800 text-center mb-12 leading-relaxed max-w-sm">{current.text}</p>
            )}

            <button
                className="w-full max-w-sm bg-green-600 text-white text-2xl py-4 rounded-xl font-bold shadow-lg"
                onClick={nextStep}
            >
                {step < 6 ? 'Next' : 'Finish Setup'}
            </button>
        </div>
    );
}
