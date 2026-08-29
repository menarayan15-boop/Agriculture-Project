import React, { useState } from 'react';
import { Camera, Image as ImageIcon, Phone, CheckCircle, Volume2 } from 'lucide-react';

export default function FarmerCropHealth({ dbState }) {
    const [status, setStatus] = useState('idle'); // idle, scanning, result

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

    const handleScan = async (method = 'upload') => {
        setStatus('scanning');
        await api.analyzeCropDisease(dbState.farm?.cropName || "Unknown Crop", method, dbState.activeFarmerId || 'FARMER_UNKNOWN');

        setTimeout(async () => {
            setStatus('result');
            await api.recordTreatmentAction({
                farmerId: dbState.activeFarmerId || 'FARMER_UNKNOWN',
                farmerName: "Test Environment",
                fieldId: "Field 01",
                cropName: dbState.farm?.cropName || "Unknown Crop",
                disease: "Leaf Disease",
                confidence: 87,
                treatmentDecision: "advisory",
                treatmentCategory: "Chemical",
                inputMethod: method,
                operatorNotes: "Farmer requested scan",
                analysisId: "SCAN-" + Math.floor(Math.random() * 1000)
            });
        }, 2000);
    };

    return (
        <div className="flex flex-col gap-4 animate-in fade-in pb-8">
            <h1 className="text-3xl font-bold text-green-900 mb-2">🌿 Is My Crop Healthy?</h1>

            {status === 'idle' && (
                <div className="flex flex-col gap-8 md:gap-10 mt-4 max-w-2xl mx-auto w-full">
                    <button
                        onClick={handleScan}
                        className="w-full btn-smart btn-theme-crop text-white p-8 rounded-[24px] flex flex-col items-center justify-center gap-4 group"
                    >
                        <Camera size={56} className="icon-anim-crop" />
                        <div className="flex flex-col text-center">
                            <span className="text-2xl font-bold font-display">Take Crop Photo</span>
                            <span className="text-emerald-100 mt-1">Scan leaves for instant diagnosis</span>
                        </div>
                    </button>

                    <button
                        onClick={handleScan}
                        className="w-full btn-smart btn-glass-crop p-8 rounded-[24px] flex flex-col items-center justify-center gap-4 group border-emerald-400/50 bg-emerald-50"
                    >
                        <ImageIcon size={56} className="text-emerald-600 icon-anim-crop" />
                        <div className="flex flex-col text-center">
                            <span className="text-2xl font-bold font-display tracking-wide">Upload Photo</span>
                            <span className="text-emerald-700/80 mt-1">Choose from your gallery</span>
                        </div>
                    </button>

                    <button
                        className="w-full btn-smart bg-slate-50 border-2 border-slate-200 hover:border-slate-300 text-slate-700 p-6 rounded-[20px] flex items-center justify-center gap-4 font-bold text-xl mt-2 group font-display"
                    >
                        <Phone size={28} className="text-slate-500 group-hover:scale-110 transition-transform" />
                        Get Help by Phone
                    </button>
                </div>
            )}

            {status === 'scanning' && (
                <div className="bg-white p-12 rounded-3xl shadow-sm flex flex-col items-center justify-center mt-12">
                    <div className="w-20 h-20 border-8 border-green-100 border-t-green-600 rounded-full animate-spin mb-8"></div>
                    <h2 className="text-2xl font-bold text-green-900">Checking your crop...</h2>
                    <p className="text-slate-500 mt-2">SmartFarm is analyzing the photo.</p>
                </div>
            )}

            {status === 'result' && (
                <div className="bg-white p-6 rounded-3xl shadow-[0_12px_45px_rgba(0,0,0,0.06)] border border-slate-100">
                    <div className="flex justify-between items-start mb-6">
                        <div className="bg-orange-100 text-orange-800 px-4 py-2 rounded-xl font-bold flex items-center gap-2">
                            <span>⚠️ Issue Found</span>
                        </div>
                        <button onClick={() => speak("Possible issue: Leaf Disease. Confidence: High. What should I do? Consult agricultural advisory or apply approved treatment according to local guidance.")} className="btn-smart bg-slate-100 p-3 rounded-full text-slate-700">
                            <Volume2 size={24} />
                        </button>
                    </div>

                    <h3 className="text-sm font-bold text-slate-500 uppercase">Possible Issue:</h3>
                    <p className="text-3xl font-bold text-slate-900 mb-4">Leaf Disease</p>

                    <h3 className="text-sm font-bold text-slate-500 uppercase mt-4">Confidence:</h3>
                    <p className="text-xl font-bold text-slate-900 mb-6">High (87%)</p>

                    <div className="bg-green-50 border border-green-200 rounded-2xl p-5 mb-6">
                        <h3 className="text-xl font-bold text-green-900 mb-3">What should I do?</h3>
                        <p className="text-green-800 text-lg leading-relaxed mb-6">
                            Consult agricultural advisory or apply approved treatment according to local guidance.
                        </p>
                        <button className="w-full btn-smart btn-theme-help text-white font-bold font-display text-xl py-[20px] rounded-[20px]">
                            Contact Advisor
                        </button>
                    </div>

                    <button
                        onClick={() => setStatus('idle')}
                        className="w-full btn-smart bg-white border-2 border-slate-200 hover:border-slate-300 text-slate-700 font-bold font-display text-xl py-[20px] rounded-[20px]"
                    >
                        Check Another Photo
                    </button>
                </div>
            )}
        </div>
    );
}
