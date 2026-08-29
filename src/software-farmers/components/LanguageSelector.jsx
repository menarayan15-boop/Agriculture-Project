// src/components/LanguageSelector.jsx
import React, { useState } from 'react';
import { LANGUAGES } from '../i18n/translations';
import { useLang } from '../i18n/LanguageContext';

export default function LanguageSelector({ compact = false }) {
    const { lang, setLang } = useLang();
    const [open, setOpen] = useState(false);
    const current = LANGUAGES.find(l => l.code === lang) || LANGUAGES[0];

    return (
        <div className="relative">
            {/* Trigger button */}
            <button
                onClick={() => setOpen(o => !o)}
                className="flex items-center gap-1.5 px-2.5 py-1.5 rounded-lg bg-slate-800 border border-slate-700 hover:border-slate-500 transition-all text-sm font-medium text-slate-300 hover:text-white"
                title="Change Language"
                aria-label="Select Language"
            >
                <span className="text-base leading-none">{current.flag}</span>
                {!compact && (
                    <span className="hidden sm:inline text-xs font-bold tracking-wide">
                        {current.native}
                    </span>
                )}
                <svg className={`w-3 h-3 transition-transform ${open ? 'rotate-180' : ''}`} fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
                </svg>
            </button>

            {/* Dropdown panel */}
            {open && (
                <>
                    {/* Backdrop */}
                    <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />

                    <div className="absolute right-0 top-full mt-2 z-50 w-56 max-h-80 overflow-y-auto rounded-xl bg-slate-900 border border-slate-700 shadow-2xl shadow-black/50 backdrop-blur-md">
                        {/* Search hint */}
                        <div className="px-3 pt-2 pb-1 border-b border-slate-800">
                            <p className="text-[10px] text-slate-500 uppercase tracking-widest font-bold">
                                🌐 Select Language / भाषा / భాష
                            </p>
                        </div>

                        {/* Separator: Indian Languages */}
                        <div className="px-3 py-1">
                            <p className="text-[9px] text-emerald-500/70 uppercase tracking-widest font-bold mt-1">🇮🇳 Indian Languages</p>
                        </div>
                        {LANGUAGES.filter(l => l.flag === '🇮🇳').map(l => (
                            <button
                                key={l.code}
                                onClick={() => { setLang(l.code); setOpen(false); }}
                                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-slate-800 transition-colors ${lang === l.code ? 'bg-emerald-500/10 text-emerald-400 font-bold' : 'text-slate-300'
                                    }`}
                            >
                                <span className="text-base w-5">{l.flag}</span>
                                <span className="flex-1">{l.native}</span>
                                <span className="text-[10px] text-slate-500">{l.name}</span>
                                {lang === l.code && <span className="text-emerald-400 text-xs">✓</span>}
                            </button>
                        ))}

                        {/* Separator: International */}
                        <div className="px-3 py-1 border-t border-slate-800">
                            <p className="text-[9px] text-blue-500/70 uppercase tracking-widest font-bold mt-1">🌍 International</p>
                        </div>
                        {LANGUAGES.filter(l => l.flag !== '🇮🇳').map(l => (
                            <button
                                key={l.code}
                                onClick={() => { setLang(l.code); setOpen(false); }}
                                className={`w-full text-left flex items-center gap-2.5 px-3 py-2 text-sm hover:bg-slate-800 transition-colors ${lang === l.code ? 'bg-blue-500/10 text-blue-400 font-bold' : 'text-slate-300'
                                    }`}
                            >
                                <span className="text-base w-5">{l.flag}</span>
                                <span className="flex-1">{l.native}</span>
                                <span className="text-[10px] text-slate-500">{l.name}</span>
                                {lang === l.code && <span className="text-blue-400 text-xs">✓</span>}
                            </button>
                        ))}
                    </div>
                </>
            )}
        </div>
    );
}
