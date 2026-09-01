/**
 * Krishi Jal AI Assistant - Master Entry Point
 * Orchestrates Audio Recording, Speech-to-Text, Agricultural Prompt Engineering,
 * LLM Reasoning, and Text-to-Speech into a unified, high-level API.
 */

import { AudioRecorder } from './audioRecorder';
import { transcribeAudio } from './transcribeService';
import { buildAgronomyPrompt } from './promptBuilder';
import { getAiAnswer, cleanAiResponse } from './aiReasoningService';
import { TtsService, ttsEngine } from './ttsService';

export {
  AudioRecorder,
  transcribeAudio,
  buildAgronomyPrompt,
  getAiAnswer,
  cleanAiResponse,
  TtsService,
  ttsEngine
};

/**
 * High-level Agricultural Voice Assistant Controller
 */
export class KrishiVoiceAssistant {
  constructor(config = {}) {
    this.recorder = new AudioRecorder();
    this.tts = ttsEngine;
    this.apiKey = config.apiKey || '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';
    this.langCode = config.langCode || 'en-IN';
    this.context = config.context || {};
  }

  setLanguage(langCode) {
    this.langCode = langCode;
  }

  setContext(context) {
    this.context = { ...this.context, ...context };
  }

  async startListening(onTick, onStateChange) {
    this.tts.stop();
    return this.recorder.start({ onTick, onStateChange });
  }

  async stopListeningAndTranscribe() {
    const audioBlob = await this.recorder.stop();
    if (!audioBlob) return '';
    return transcribeAudio(audioBlob, this.apiKey, this.langCode);
  }

  async ask(query, chatHistory = []) {
    return getAiAnswer(query, {
      ...this.context,
      langCode: this.langCode,
      apiKey: this.apiKey,
      chatHistory
    });
  }

  speak(text, onStart, onEnd) {
    this.tts.speak(text, this.langCode, 1.0, { onStart, onEnd });
  }

  stopSpeaking() {
    this.tts.stop();
  }
}
