// src/i18n/LanguageContext.jsx
import React, { createContext, useContext, useState, useEffect, useRef } from 'react';
import { detectLanguage, LANGUAGES, T } from './translations';

const LanguageContext = createContext({ lang: 'en', setLang: () => { }, t: (k) => k, formatNum: (n) => n });

export function LanguageProvider({ children }) {
    const [lang, setLangState] = useState(detectLanguage());
    const [dictCache, setDictCache] = useState(T);
    const requestedRef = useRef(new Set());

    const setLang = (code) => {
        setLangState(code);
        localStorage.setItem('sf_lang', code);
        const langObj = LANGUAGES.find(l => l.code === code);
        document.documentElement.dir = langObj?.dir || 'ltr';
        document.documentElement.lang = code;
    };

    useEffect(() => {
        const langObj = LANGUAGES.find(l => l.code === lang);
        document.documentElement.dir = langObj?.dir || 'ltr';
        document.documentElement.lang = lang;
    }, [lang]);

    const formatNum = (num, fallbackDecimals = 0) => {
        if (num === null || num === undefined) return '';
        if (isNaN(num)) return num;

        let localeId = 'en-IN';
        if (lang === 'hi') localeId = 'hi-IN';
        else if (lang === 'mr') localeId = 'mr-IN';
        else if (lang === 'bn') localeId = 'bn-IN';
        else if (lang === 'ta') localeId = 'ta-IN';
        else if (lang === 'te') localeId = 'te-IN';
        else if (lang === 'kn') localeId = 'kn-IN';
        else if (lang === 'gu') localeId = 'gu-IN';
        else if (lang === 'pa') localeId = 'pa-IN';
        else if (lang === 'or') localeId = 'or-IN';
        else if (lang === 'ml') localeId = 'ml-IN';
        else if (lang === 'ar') localeId = 'ar-SA';
        else if (lang === 'ur') localeId = 'ur-PK';
        else if (lang === 'as') localeId = 'as-IN';
        else if (lang === 'sa') localeId = 'sa-IN';
        else if (lang === 'mai') localeId = 'mai-IN';

        try {
            return new Intl.NumberFormat(localeId, { maximumFractionDigits: fallbackDecimals }).format(Number(num));
        } catch (e) {
            return num.toString();
        }
    };

    const t = (keyOrText) => {
        if (!keyOrText) return keyOrText;
        if (lang === 'en') return dictCache[keyOrText]?.['en'] || keyOrText;

        if (dictCache[keyOrText] && dictCache[keyOrText][lang]) {
            return dictCache[keyOrText][lang];
        }

        const fallbackEngText = dictCache[keyOrText]?.['en'] || keyOrText;

        const cacheKey = `${lang}_${keyOrText}`;
        if (!requestedRef.current.has(cacheKey)) {
            requestedRef.current.add(cacheKey);

            const apiUrl = window.location.hostname === 'localhost' ? 'http://localhost:5002/translate' : '/api/translate';
            fetch(apiUrl, {
                method: "POST",
                body: JSON.stringify({
                    q: fallbackEngText,
                    source: "en",
                    target: lang,
                    format: "text"
                }),
                headers: { "Content-Type": "application/json" }
            }).then(res => res.json())
                .then(data => {
                    if (data && data.translatedText) {
                        setDictCache(prev => ({
                            ...prev,
                            [keyOrText]: { ...(prev[keyOrText] || {}), [lang]: data.translatedText }
                        }));
                    }
                })
                .catch(err => {
                    console.error("Google Translate API Error:", err);
                    setTimeout(() => requestedRef.current.delete(cacheKey), 5000);
                });
        }

        return fallbackEngText;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, formatNum, t }}>
            {children}
        </LanguageContext.Provider>
    );
}

export function useLang() {
    return useContext(LanguageContext);
}
