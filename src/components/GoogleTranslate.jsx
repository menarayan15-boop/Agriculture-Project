import React, { useEffect, useRef } from 'react';
import { useApp } from '../context/AppContext';

let scriptLoaded = false;

export function GoogleTranslate() {
  const { lang, activeTab } = useApp();
  const containerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initTranslate = () => {
      try {
        if (window.google && window.google.translate && containerRef.current) {
          containerRef.current.innerHTML = '';
          new window.google.translate.TranslateElement({
            pageLanguage: 'en',
            includedLanguages: 'en,hi,te,ta,kn,pa,mr,bn,gu,or',
            autoDisplay: false
          }, containerRef.current.id);
        }
      } catch (e) {
        console.warn('Google Translate initialization error:', e);
      }
    };

    if (scriptLoaded && window.google && window.google.translate) {
      initTranslate();
    } else if (!scriptLoaded) {
      scriptLoaded = true;
      window.googleTranslateElementInit = initTranslate;

      const script = document.createElement('script');
      script.id = 'google-translate-script';
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  // Whenever lang or activeTab changes, ensure the translation combo is triggered
  useEffect(() => {
    const triggerTranslate = () => {
      try {
        const hostname = window.location.hostname;
        document.cookie = `googtrans=/en/${lang}; path=/;`;
        if (hostname) {
          document.cookie = `googtrans=/en/${lang}; domain=${hostname}; path=/;`;
          const parts = hostname.split('.');
          if (parts.length > 1) {
            document.cookie = `googtrans=/en/${lang}; domain=.${parts.slice(-2).join('.')}; path=/;`;
          }
        }

        const gtCombo = document.querySelector('.goog-te-combo');
        if (gtCombo) {
          if (gtCombo.value !== lang) {
            gtCombo.value = lang;
            gtCombo.dispatchEvent(new Event('change'));
          }
        }
      } catch (e) {}
    };

    triggerTranslate();
    const interval = setInterval(triggerTranslate, 400);
    const timeout = setTimeout(() => clearInterval(interval), 2400);

    return () => {
      clearInterval(interval);
      clearTimeout(timeout);
    };
  }, [lang, activeTab]);

  return <div id="google_translate_element" ref={containerRef} style={{ display: 'none' }} aria-hidden="true"></div>;
}

export default GoogleTranslate;

