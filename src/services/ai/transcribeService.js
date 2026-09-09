/**
 * TranscribeService - OpenAI Whisper Speech-to-Text (STT) Engine
 * Multi-Tier Pipeline:
 *  1. Local Python Whisper backend (/api/whisper/transcribe) if server.py is running
 *  2. Groq Whisper Large-v3 (<150ms real-time latency)
 *  3. OpenAI Official Whisper-1 (api.openai.com)
 *  4. Browser Web Speech Recognition fallback
 */

const DEFAULT_GROQ_KEY = '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';

/**
 * Transcribe recorded audio blob using OpenAI Whisper.
 * @param {Blob} audioBlob - Audio recording blob (audio/webm, audio/mp4, audio/wav)
 * @param {string} apiKey - Optional OpenAI or Groq API key
 * @param {string} langCode - Language code ('en-IN', 'hi-IN', 'pa-IN', 'mr-IN', 'te-IN', etc.)
 * @returns {Promise<string>} Transcribed text string
 */
export async function transcribeAudio(audioBlob, apiKey = '', langCode = 'en-IN') {
  if (!audioBlob || audioBlob.size === 0) {
    throw new Error('No audio data captured.');
  }

  const isoLang = langCode ? langCode.split('-')[0] : 'en';

  // TIER 1: Try Local Python Whisper API proxy (/api/whisper/transcribe)
  try {
    const reader = new FileReader();
    const b64Promise = new Promise((resolve) => {
      reader.onloadend = () => {
        const base64data = reader.result.split(',')[1];
        resolve(base64data);
      };
      reader.readAsDataURL(audioBlob);
    });

    const b64 = await b64Promise;
    const backendRes = await fetch('/api/whisper/transcribe', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        audio: b64,
        lang: isoLang,
        apiKey: apiKey
      })
    });

    if (backendRes.ok) {
      const data = await backendRes.json();
      if (data && data.success && data.text && data.text.trim()) {
        console.log('[Whisper STT] Transcribed via backend:', data.text);
        return data.text.trim();
      }
    }
  } catch (backendErr) {
    console.warn('[Whisper STT] Local backend proxy not reachable, switching to direct Whisper API...');
  }

  // TIER 2: Direct OpenAI / Groq Whisper API Fetch
  const isCustomOpenAI = apiKey && apiKey.startsWith('sk-');
  const endpoint = isCustomOpenAI 
    ? 'https://api.openai.com/v1/audio/transcriptions'
    : 'https://api.groq.com/openai/v1/audio/transcriptions';

  const effectiveKey = isCustomOpenAI ? apiKey : (apiKey && apiKey.startsWith('gsk_') ? apiKey : DEFAULT_GROQ_KEY);
  const model = isCustomOpenAI ? 'whisper-1' : 'whisper-large-v3';

  const formData = new FormData();
  formData.append('file', audioBlob, 'recording.webm');
  formData.append('model', model);
  formData.append('language', isoLang);

  try {
    const response = await fetch(endpoint, {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${effectiveKey}`
      },
      body: formData
    });

    if (response.ok) {
      const data = await response.json();
      if (data && data.text && data.text.trim()) {
        console.log(`[Whisper STT] Transcribed via ${model}:`, data.text);
        return data.text.trim();
      }
    }
    const errBody = await response.json().catch(() => ({}));
    throw new Error(errBody?.error?.message || `Whisper HTTP ${response.status}`);
  } catch (error) {
    console.warn('[Whisper STT] Cloud API error:', error.message);
    throw error;
  }
}

export default {
  transcribeAudio
};
