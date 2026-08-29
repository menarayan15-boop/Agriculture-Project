import React from 'react';
import { CloudRain, Sun, Sprout, Wind, Droplets } from 'lucide-react';

export default function DigitalFarmScene({ weather = 'sunny', objects = [], onObjectClick }) {
    return (
        <div className="absolute inset-0 z-0 overflow-hidden bg-gradient-to-b from-[#0c1e14] to-[#040905]">
            {/* Sky Background */}
            <div className={`absolute top-0 left-0 w-full h-[60%] transition-colors duration-1000 ${weather === 'rainy' ? 'bg-gradient-to-b from-slate-900 to-[#0c1e14]' : 'bg-gradient-to-b from-[#113420] to-[#0c1e14]'}`}>
                {weather === 'sunny' && (
                    <div className="absolute top-10 right-10 w-24 h-24 bg-yellow-400/80 rounded-full blur-[2px] animate-pulse shadow-[0_0_60px_rgba(250,204,21,0.4)]" />
                )}
                <div className="absolute top-16 left-[10%] w-32 h-10 bg-white/5 rounded-full blur-xl animate-[pulse_8s_ease-in-out_infinite]" />
                <div className="absolute top-24 left-[40%] w-48 h-12 bg-white/5 rounded-full blur-xl animate-[pulse_12s_ease-in-out_infinite_delay-2s]" />

                {weather === 'rainy' && (
                    <div className="absolute inset-0 opacity-30" style={{ backgroundImage: 'linear-gradient(transparent, rgba(255,255,255,0.2) 1px, transparent 1px)', backgroundSize: '100% 4px', animation: 'rain 0.5s linear infinite' }} />
                )}
            </div>

            {/* Distant Hills */}
            <div className="absolute top-[35%] w-full h-[30%] bg-gradient-to-b from-[#0a1710] to-[#0d2018] rounded-t-[100%] scale-x-150" />
            <div className="absolute top-[40%] left-[-20%] w-[80%] h-[30%] bg-[#08130d] rounded-t-[100%]" />
            <div className="absolute top-[40%] right-[-20%] w-[80%] h-[30%] bg-[#08130d] rounded-t-[100%]" />

            {/* Farm Foreground (Field) */}
            <div className="absolute top-[50%] w-full h-[50%] bg-gradient-to-b from-[#0f281e] to-[#050e09]" style={{ perspective: '1000px' }}>
                <div className="w-full h-full border-t border-[#1b3d2b] opacity-30" style={{ transform: 'rotateX(60deg) scale(2)', backgroundImage: 'linear-gradient(to right, #1b3d2b 1px, transparent 1px), linear-gradient(to bottom, #1b3d2b 1px, transparent 1px)', backgroundSize: '40px 40px' }} />
            </div>

            {/* Interactive Objects Placed in Scene */}
            {objects.map((obj, i) => (
                <button
                    key={obj.id}
                    onClick={() => onObjectClick && onObjectClick(obj)}
                    className="absolute group transition-transform duration-300 hover:scale-110 focus:outline-none"
                    style={{ left: obj.x, top: obj.y, transform: `translate(-50%, -50%) ${obj.pulse ? 'scale(1.1)' : ''}` }}
                >
                    {/* Glow effect on hover/pulse */}
                    <div className={`absolute inset-0 bg-green-500/20 rounded-full blur-xl transition-all duration-300 group-hover:bg-green-400/40 ${obj.pulse ? 'animate-ping opacity-50' : 'opacity-0 group-hover:opacity-100'}`} />

                    {/* Floating container */}
                    <div className={`relative flex flex-col items-center animate-[bounce_4s_ease-in-out_infinite]`} style={{ animationDelay: `${i * 0.5}s` }}>
                        <div className="w-14 h-14 bg-white/10 backdrop-blur-md rounded-2xl border border-white/20 shadow-lg flex items-center justify-center text-2xl group-hover:border-white/40 group-hover:bg-white/20 transition-all text-white">
                            {obj.emoji}
                        </div>
                        <div className="mt-2 px-3 py-1 bg-black/60 backdrop-blur-sm rounded-full border border-white/10 text-white text-[10px] font-bold tracking-wider uppercase opacity-80 group-hover:opacity-100 whitespace-nowrap">
                            {obj.id}
                        </div>
                    </div>
                </button>
            ))}
            {/* CSS added globally instead of inline */}
        </div>
    );
}
