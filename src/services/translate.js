/**
 * High-performance Google Translate Service
 * Supports Google Cloud Translate API Key or free Google Translate fallback API
 */

const translationCache = new Map();

/**
 * Translate a single text string into target language
 */
export async function translateText(text, targetLang, apiKey = null) {
  if (!text || typeof text !== 'string' || !text.trim() || targetLang === 'en') {
    return text;
  }

  const cacheKey = `${targetLang}:${text}`;
  if (translationCache.has(cacheKey)) {
    return translationCache.get(cacheKey);
  }

  const cleanApiKey = apiKey || localStorage.getItem('krishi_translate_key') || localStorage.getItem('krishi_gemini_key');

  // 1. Official Google Cloud Translate API v2 (if API key is present)
  if (cleanApiKey && cleanApiKey.length > 15) {
    try {
      const res = await fetch(`https://translation.googleapis.com/language/translate/v2?key=${cleanApiKey}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          q: text,
          target: targetLang,
          format: 'html'
        })
      });
      const data = await res.json();
      if (data && data.data && data.data.translations && data.data.translations[0]) {
        const translated = data.data.translations[0].translatedText;
        translationCache.set(cacheKey, translated);
        return translated;
      }
    } catch (err) {
      console.warn("Google Cloud Translate API error:", err);
    }
  }

  // 2. Free Google Translate GTX API endpoint
  try {
    const url = `https://translate.googleapis.com/translate_a/single?client=gtx&sl=auto&tl=${targetLang}&dt=t&q=${encodeURIComponent(text)}`;
    const res = await fetch(url);
    const data = await res.json();
    if (data && data[0]) {
      const translated = data[0].map(item => item[0]).join('');
      if (translated) {
        translationCache.set(cacheKey, translated);
        return translated;
      }
    }
  } catch (err) {
    console.warn("Google Translate GTX endpoint error:", err);
  }

  return text;
}

/**
 * Batch translation helper
 */
export async function translateBatch(textArray, targetLang, apiKey = null) {
  if (!Array.isArray(textArray) || targetLang === 'en') return textArray;
  return Promise.all(textArray.map(t => translateText(t, targetLang, apiKey)));
}
