/**
 * Krishi Jal - Multilingual Farmer Text-to-Speech (TTS) Voice Engine
 * Pure Neural HTML5 Audio Streaming Engine (Google Neural Audio)
 * Speaks aloud smoothly, naturally, and sweetly in all 10 regional Indian languages:
 * 1. English (en)
 * 2. Hindi (hi)
 * 3. Telugu (te)
 * 4. Tamil (ta)
 * 5. Kannada (kn)
 * 6. Punjabi (pa)
 * 7. Marathi (mr)
 * 8. Bengali (bn)
 * 9. Gujarati (gu)
 * 10. Odia (or)
 */

const LANG_MAP = {
  en: 'en-IN',
  hi: 'hi',
  te: 'te',
  ta: 'ta',
  kn: 'kn',
  pa: 'pa',
  mr: 'mr',
  bn: 'bn',
  gu: 'gu',
  or: 'hi' // Odia maps to Hindi phonetics for clear, sweet pronunciation
};

export class TtsService {
  constructor() {
    this.isSpeaking = false;
    this.audio = null;
    this.activeToken = null;

    if (typeof window !== 'undefined') {
      try {
        this.audio = new Audio();
        this.audio.preload = 'auto';
        window.__ttsEngine = this;
        window.__ttsAudio = this.audio;
      } catch (e) {}
    }
  }

  /**
   * Split text into short, natural, conversational spoken sentences.
   */
  chunkText(rawText) {
    if (!rawText) return [];
    
    // Remove markdown symbols, brackets, emojis, extra whitespace
    const clean = rawText
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[\*\#\`\_\[\]\(\)\{\}\<\>\~\\\/]/g, '')
      .replace(/\s+/g, ' ')
      .trim();

    if (!clean) return [];

    // Split on sentence terminators (. ! ? । ; :)
    const rawSentences = clean.split(/([.।?!;:\n]+)/);
    const sentences = [];
    
    for (let i = 0; i < rawSentences.length; i += 2) {
      const part = rawSentences[i] || '';
      const punct = rawSentences[i + 1] || '';
      const full = (part + punct).trim();
      if (full) {
        if (full.length <= 150) {
          sentences.push(full);
        } else {
          // Split longer sentences by commas
          const subParts = full.split(/([,،]+)/);
          let currentSub = '';
          for (let j = 0; j < subParts.length; j++) {
            const sub = subParts[j].trim();
            if (!sub) continue;
            if ((currentSub + ' ' + sub).length <= 140) {
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
   * Plays each sentence chunk cleanly once using Google Neural TTS stream.
   */
  speak(text, langCode = 'hi', arg3 = {}, arg4 = {}) {
    this.stop();

    let callbacks = {};
    if (typeof arg3 === 'object' && arg3 !== null && (arg3.onStart || arg3.onEnd || arg3.onError)) {
      callbacks = arg3;
    } else if (typeof arg4 === 'object' && arg4 !== null) {
      callbacks = arg4;
    }

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

    const sessionToken = Symbol('tts-session');
    this.activeToken = sessionToken;
    this.isSpeaking = true;

    if (!this.audio) {
      this.audio = new Audio();
    }

    if (callbacks.onStart) callbacks.onStart();

    let currentIndex = 0;

    const playNext = () => {
      if (this.activeToken !== sessionToken) return;

      if (currentIndex >= sentences.length) {
        this.isSpeaking = false;
        if (callbacks.onEnd) callbacks.onEnd();
        return;
      }

      const chunk = sentences[currentIndex];
      currentIndex++;
      console.log(`[TTS Engine] Playing chunk ${currentIndex}/${sentences.length} (${tl}):`, chunk);

      const audio = this.audio;
      audio.onended = null;
      audio.onerror = null;

      let chunkHandled = false;
      const onDone = () => {
        if (chunkHandled) return;
        chunkHandled = true;
        console.log(`[TTS Engine] Finished chunk ${currentIndex}/${sentences.length}`);
        if (this.activeToken === sessionToken) {
          // Gentle 180ms conversational pause between sentences for a pleasant, natural human cadence
          setTimeout(() => {
            if (this.activeToken === sessionToken) {
              playNext();
            }
          }, 180);
        }
      };

      audio.onended = onDone;
      audio.onerror = (e) => {
        console.warn('[TTS Audio Stream Error on chunk]:', chunk, e);
        // Advance to next chunk smoothly after short pause
        setTimeout(onDone, 120);
      };

      const url = `/api/tts?tl=${encodeURIComponent(tl)}&q=${encodeURIComponent(chunk)}`;
      audio.src = url;
      audio.preservesPitch = true;
      audio.playbackRate = 1.0; // Crystal-clear, un-distorted neural studio quality

      const playPromise = audio.play();
      if (playPromise !== undefined) {
        playPromise.then(() => {
          console.log(`[TTS Engine] audio.play() succeeded for chunk ${currentIndex}`);
        }).catch((err) => {
          console.warn('[TTS play() Error]:', err);
          onDone();
        });
      }
    };

    playNext();
  }

  /**
   * Stop current speech playback immediately and cleanly.
   */
  stop() {
    this.activeToken = Symbol('tts-stop');
    this.isSpeaking = false;

    if (this.audio) {
      try {
        this.audio.onended = null;
        this.audio.onerror = null;
        this.audio.pause();
        this.audio.currentTime = 0;
        this.audio.src = '';
      } catch (e) { }
    }

    if (typeof document !== 'undefined') {
      try {
        document.querySelectorAll('audio').forEach(a => {
          try {
            a.onended = null;
            a.onerror = null;
            a.pause();
            a.currentTime = 0;
            a.src = '';
          } catch (e) {}
        });
      } catch (e) {}
    }

    if (typeof window !== 'undefined' && window.speechSynthesis) {
      try {
        window.speechSynthesis.cancel();
      } catch (e) { }
    }
  }
}

export const ttsEngine = new TtsService();

if (typeof window !== 'undefined') {
  document.addEventListener('visibilitychange', () => {
    if (document.hidden) {
      ttsEngine.stop();
    }
  });

  window.addEventListener('pagehide', () => {
    ttsEngine.stop();
  });

  window.addEventListener('beforeunload', () => {
    ttsEngine.stop();
  });
}

export default ttsEngine;
