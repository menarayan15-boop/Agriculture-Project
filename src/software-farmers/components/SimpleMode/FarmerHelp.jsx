import React from 'react';
import { Phone, Volume2, Sprout, Droplets, HeartPulse, MapPin } from 'lucide-react';

export default function FarmerHelp() {
    return (
        <div className="flex flex-col gap-4 animate-in fade-in pb-8">
            <h1 className="text-3xl font-bold text-slate-800 mb-2">❓ Need Help?</h1>

            <div className="flex flex-col gap-5 mb-6">
                <button className="btn-smart btn-theme-crop w-full p-[22px] rounded-[24px] flex items-center justify-start gap-4 group">
                    <div className="bg-white/20 p-3 rounded-full icon-anim-crop">
                        <Phone size={32} className="text-white" />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-[22px] font-bold font-display tracking-wide text-white">Call for Help</span>
                        <span className="text-sm font-normal text-emerald-100 opacity-90 text-left">Speak with an advisor instantly</span>
                    </div>
                </button>

                <button className="btn-smart btn-theme-ai w-full p-[22px] rounded-[24px] flex items-center justify-start gap-4 group">
                    <div className="bg-white/20 p-3 rounded-full icon-anim-ai">
                        <Volume2 size={32} className="text-white" />
                    </div>
                    <div className="flex flex-col text-left">
                        <span className="text-[22px] font-bold font-display tracking-wide text-white">Hear Instructions</span>
                        <span className="text-sm font-normal text-indigo-100 opacity-90">Listen to voice guidance</span>
                    </div>
                </button>
            </div>

            <h2 className="text-3xl font-bold text-slate-800 mb-6 mt-4 font-display">Learn Farming</h2>

            <div className="grid grid-cols-2 gap-6 sm:gap-8 lg:gap-10">
                <button className="btn-smart btn-glass-crop w-full p-6 rounded-[24px] flex flex-col items-center gap-3 group text-center">
                    <Sprout size={40} className="icon-anim-crop" />
                    <div className="flex flex-col text-center">
                        <span className="font-bold text-lg font-display">Crop</span>
                        <span className="text-xs opacity-80 mt-1">Get crop tips</span>
                    </div>
                </button>

                <button className="btn-smart btn-glass-water w-full p-6 rounded-[24px] flex flex-col items-center gap-3 group text-center">
                    <Droplets size={40} className="icon-anim-water" />
                    <div className="flex flex-col text-center">
                        <span className="font-bold text-lg font-display">Water</span>
                        <span className="text-xs opacity-80 mt-1">Irrigation info</span>
                    </div>
                </button>

                <button className="btn-smart btn-glass-sensor w-full p-6 rounded-[24px] flex flex-col items-center gap-3 group text-center text-indigo-800 border-indigo-100 hover:border-indigo-400">
                    <HeartPulse size={40} className="icon-anim-help" />
                    <div className="flex flex-col text-center">
                        <span className="font-bold text-lg font-display">Health</span>
                        <span className="text-xs opacity-80 mt-1">Plant disease care</span>
                    </div>
                </button>

                <button className="btn-smart btn-glass-soil w-full p-6 rounded-[24px] flex flex-col items-center gap-3 group text-center">
                    <MapPin size={40} className="icon-anim-soil" />
                    <div className="flex flex-col text-center">
                        <span className="font-bold text-lg font-display">Nearby</span>
                        <span className="text-xs opacity-80 mt-1">Find local support</span>
                    </div>
                </button>
            </div>

            <div className="mt-8 bg-green-50 p-6 rounded-[28px] border-2 border-green-200">
                <h3 className="text-xl font-bold text-green-900 mb-2 flex items-center gap-3 font-display">
                    <Volume2 size={24} className="text-green-500" />
                    Why should I avoid overwatering?
                </h3>
                <p className="text-green-800 text-lg leading-relaxed">
                    Too much water can waste water and may harm some crops.
                </p>
            </div>
        </div>
    );
}
