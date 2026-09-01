/**
 * TranscribeService - Speech-to-Text (STT) Engine
 * Primary: Groq Whisper Large-v3 API (<150ms latency)
 * Fallback: Browser Web Speech Recognition
 */

const DEFAULT_GROQ_KEY = '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';

/**
 * Transcribe recorded audio blob using Groq Whisper Large-v3.
 * @param {Blob} audioBlob - Audio recording blob (audio/webm, audio/mp4, etc.)
 * @param {string} apiKey - Groq API key
 * @param {string} langCode - Language code ('en-IN', 'hi-IN', 'pa-IN', etc.)
 * @returns {Promise<string>} Transcribed text string
 */
export async function transcribeAudio(audioBlob, apiKey = DEFAULT_GROQ_KEY, langCode = 'en-IN') {
  if (!audioBlob || audioBlob.size === 0) {
    throw new Error('No audio data received.');
  }

  const effectiveKey = apiKey && apiKey.trim() ? apiKey.trim() : DEFAULT_GROQ_KEY;
  const isoLang = langCode ? langCode.split('-')[0] : 'en';

  const formData = new FormData();
  formData.append('file', audioBlob, 'speech_recording.webm');
  formData.append('model', 'whisper-large-v3');
  formData.append('language', isoLang);

  try {
    const response = await fetch('https://api.groq.com/openai/v1/audio/transcriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${effectiveKey}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.text && data.text.trim()) {
        return data.text.trim();
      }
    }
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `Whisper STT HTTP ${response.status}`);
  } catch (error) {
    console.warn('Groq Whisper STT API error:', error.message);
    throw error;
  }
}
