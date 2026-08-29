import { useEffect, useRef } from 'react';

let scriptLoaded = false;

export default function GoogleTranslate() {
  const containerRef = useRef(null);
  const initialized = useRef(false);

  useEffect(() => {
    if (initialized.current) return;
    initialized.current = true;

    const initTranslate = () => {
      if (window.google && window.google.translate && containerRef.current) {
        // Clear any previous widget content
        containerRef.current.innerHTML = '';
        new window.google.translate.TranslateElement({
          pageLanguage: 'en',
          includedLanguages: 'en,hi,te,ta,kn,pa,bn',
          autoDisplay: false
        }, containerRef.current.id);
      }
    };

    if (scriptLoaded && window.google && window.google.translate) {
      // Script already loaded from a previous mount
      initTranslate();
    } else if (!scriptLoaded) {
      // First time — load the script
      scriptLoaded = true;
      window.googleTranslateElementInit = initTranslate;

      const script = document.createElement('script');
      script.src = 'https://translate.google.com/translate_a/element.js?cb=googleTranslateElementInit';
      script.async = true;
      document.body.appendChild(script);
    }
  }, []);

  return <div id="google_translate_element" ref={containerRef}></div>;
}
