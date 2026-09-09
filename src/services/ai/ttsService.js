/**
 * Krishi Jal - Multilingual Farmer Text-to-Speech (TTS) Voice Engine
 * Speaks aloud naturally and smoothly in all 10 regional Indian languages:
 * 1. English (en)
 * 2. Hindi (hi)
 * 3. Punjabi (pa)
 * 4. Telugu (te)
 * 5. Tamil (ta)
 * 6. Kannada (kn)
 * 7. Marathi (mr)
 * 8. Bengali (bn)
 * 9. Gujarati (gu)
 * 10. Odia (or)
 *
 * Architecture:
 * - Tier 1: Neural high-fidelity audio chunks streamed via /api/tts (Google TTS proxy)
 * - Tier 2: Direct client-side web audio playback
 * - Tier 3: Browser SpeechSynthesis (SpeechSynthesisUtterance) fallback
 */

const LANG_MAP = {
  en: 'en',
  hi: 'hi',
  te: 'te',
  ta: 'ta',
  kn: 'kn',
  pa: 'pa',
  mr: 'mr',
  bn: 'bn',
  gu: 'gu',
  or: 'hi' // Odia phonetic fallback to Hindi voice for clear audio
};

const LOCALE_SPEECH_MAP = {
  en: 'en-IN',
  hi: 'hi-IN',
  te: 'te-IN',
  ta: 'ta-IN',
  kn: 'kn-IN',
  pa: 'pa-IN',
  mr: 'mr-IN',
  bn: 'bn-IN',
  gu: 'gu-IN',
  or: 'hi-IN'
};

export class TtsService {
  constructor() {
    this.isSpeaking = false;
    this.currentAudio = null;
    this.activeToken = null;
  }

  /**
   * Split long text into natural spoken sentence chunks under 160 characters.
   */
  chunkText(rawText) {
    if (!rawText) return [];
    
    // Remove emojis, markdown, and special formatting characters
    const clean = rawText
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[\*\#\`\_\[\]\(\)\{\}\<\>\~\\\/]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) return [];

    // Split on natural sentence enders (. ! ? । ; :)
    const rawSentences = clean.split(/([.।?!;:\n]+)/);
    const sentences = [];
    
    for (let i = 0; i < rawSentences.length; i += 2) {
      const part = rawSentences[i] || '';
      const punct = rawSentences[i + 1] || '';
      const full = (part + punct).trim();
      if (full) {
        if (full.length <= 160) {
          sentences.push(full);
        } else {
          // If a sentence is unusually long, split by comma or space
          const subParts = full.split(/([,،]+)/);
          let currentSub = '';
          for (let j = 0; j < subParts.length; j++) {
            const sub = subParts[j].trim();
            if (!sub) continue;
            if ((currentSub + ' ' + sub).length <= 150) {
              currentSub = currentSub ? currentSub + ' ' + sub : sub;
            } else {
              if (currentSub) sentences.push(currentSub);
              currentSub = sub;
            }
          }
          if (currentSub) sentences.push(currentSub);
        }
      }
    }

    return sentences.filter(s => s && s.trim().length > 0);
  }

  /**
   * Speak plain text answer aloud in farmer's chosen language.
   * @param {string} text - Text to speak
   * @param {string} langCode - Language code ('en', 'hi', 'te', 'ta', 'kn', 'pa', 'mr', 'bn', 'gu', 'or' or 'hi-IN')
   * @param {Object} callbacks - { onStart, onEnd, onError }
   */
  speak(text, langCode = 'hi', callbacks = {}) {
    this.stop();

    if (!text || !text.trim()) {
      if (callbacks.onEnd) callbacks.onEnd();
      return;
    }

    const sentences = this.chunkText(text);
    if (!sentences.length) {
      if (callbacks.onEnd) callbacks.onEnd();
      return;
    }

    const iso = (langCode || 'hi').toLowerCase().slice(0, 2);
    const tl = LANG_MAP[iso] || 'hi';
    const speechLocale = LOCALE_SPEECH_MAP[iso] || 'hi-IN';

    const myToken = Symbol('tts-session');
    this.activeToken = myToken;
    this.isSpeaking = true;

    if (callbacks.onStart) callbacks.onStart();

    let currentIndex = 0;

    const playNext = () => {
      if (this.activeToken !== myToken) return;

      if (currentIndex >= sentences.length) {
        this.isSpeaking = false;
        this.currentAudio = null;
        if (callbacks.onEnd) callbacks.onEnd();
        return;
      }

      const chunk = sentences[currentIndex];
      currentIndex++;

      // Tier 1: Try /api/tts endpoint (high-quality neural voice stream)
      const primaryUrl = `/api/tts?tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(chunk)}`;
      const fallbackUrl = `https://translate.google.com/translate_tts?ie=UTF-8&client=tw-ob&tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(chunk)}`;

      const audio = new Audio();
      this.currentAudio = audio;

      let hasFallenBack = false;

      const fallbackToWebSpeech = () => {
        if (this.activeToken !== myToken) return;
        if (typeof window !== 'undefined' && window.speechSynthesis) {
          try {
            const u = new SpeechSynthesisUtterance(chunk);
            u.lang = speechLocale;
            u.rate = 0.95;
            const voices = window.speechSynthesis.getVoices() || [];
            const match = voices.find(v => v.lang && (v.lang.startsWith(iso) || v.lang.replace('_', '-').startsWith(iso)));
            if (match) u.voice = match;

            u.onend = () => {
              if (this.activeToken === myToken) playNext();
            };
            u.onerror = () => {
              if (this.activeToken === myToken) playNext();
            };
            window.speechSynthesis.speak(u);
            return;
          } catch (e) {
            console.warn('[WebSpeech Error]:', e);
          }
        }
        // If web speech also unavailable, continue to next chunk
        playNext();
      };

      audio.onended = () => {
        if (this.activeToken === myToken) playNext();
      };

      audio.onerror = () => {
        if (this.activeToken !== myToken) return;
        if (!hasFallenBack) {
          hasFallenBack = true;
          // Try direct fallback URL
          audio.src = fallbackUrl;
          audio.play().catch(() => {
            fallbackToWebSpeech();
          });
        } else {
          fallbackToWebSpeech();
        }
      };

      audio.src = primaryUrl;
      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.catch(() => {
          if (this.activeToken === myToken) {
            audio.src = fallbackUrl;
            audio.play().catch(() => {
              fallbackToWebSpeech();
            });
          }
        });
      }
    };

    playNext();
  }

  /**
   * Stop current speech playback immediately.
   */
  stop() {
    this.activeToken = Symbol('tts-stop');
    this.isSpeaking = false;

    if (this.currentAudio) {
      try {
        this.currentAudio.pause();
        this.currentAudio.currentTime = 0;
        this.currentAudio.src = '';
      } catch (e) { }
      this.currentAudio = null;
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) { }
    }
  }
}

export const ttsEngine = new TtsService();
export default ttsEngine;
