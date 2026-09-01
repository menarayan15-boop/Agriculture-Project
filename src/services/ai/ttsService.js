/**
 * TtsService - Text-to-Speech (TTS) Voice Engine
 * Sanitizes response text and speaks aloud in farmer's chosen native language.
 */

export class TtsService {
  constructor() {
    this.isSpeaking = false;
    this.currentUtterance = null;
  }

  /**
   * Speak plain text answer aloud using browser SpeechSynthesis.
   * @param {string} text - Clean text to speak
   * @param {string} langCode - Language code ('en-IN', 'hi-IN', 'pa-IN', etc.)
   * @param {number} rate - Speech rate (0.8 - 1.2, default 1.0)
   * @param {Object} callbacks - { onStart, onEnd, onError }
   */
  speak(text, langCode = 'en-IN', rate = 1.0, callbacks = {}) {
    if (!window.speechSynthesis || !text || !text.trim()) return;

    this.stop();

    // Clean text for speech synthesis (remove emojis, special markdown, brackets)
    const cleanText = text
      .replace(/[\u{1F600}-\u{1F64F}\u{1F300}-\u{1F5FF}\u{1F680}-\u{1F6FF}\u{2600}-\u{26FF}\u{2700}-\u{27BF}]/gu, '')
      .replace(/[\*\#\`\_\[\]\(\)\{\}]/g, '')
      .trim();

    const utterance = new SpeechSynthesisUtterance(cleanText);
    utterance.lang = langCode || 'en-IN';
    utterance.rate = Math.max(0.7, Math.min(1.5, rate || 1.0));

    // Try finding matching voice
    const voices = window.speechSynthesis.getVoices();
    if (voices && voices.length > 0) {
      const match = voices.find(v => v.lang.startsWith((langCode || 'en').slice(0, 2)));
      if (match) utterance.voice = match;
    }

    utterance.onstart = () => {
      this.isSpeaking = true;
      if (callbacks.onStart) callbacks.onStart();
    };

    utterance.onend = () => {
      this.isSpeaking = false;
      if (callbacks.onEnd) callbacks.onEnd();
    };

    utterance.onerror = (e) => {
      this.isSpeaking = false;
      if (callbacks.onError) callbacks.onError(e);
    };

    this.currentUtterance = utterance;
    window.speechSynthesis.speak(utterance);
  }

  /**
   * Stop current speech playback.
   */
  stop() {
    if (window.speechSynthesis) {
      window.speechSynthesis.cancel();
    }
    this.isSpeaking = false;
    this.currentUtterance = null;
  }
}

export const ttsEngine = new TtsService();
