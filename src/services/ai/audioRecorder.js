/**
 * AudioRecorder - Native HTML5 MediaRecorder Engine
 * Handles microphone permissions, audio stream capture, recording timer, and WebM blob generation.
 */

export class AudioRecorder {
  constructor() {
    this.mediaRecorder = null;
    this.audioChunks = [];
    this.stream = null;
    this.timerId = null;
    this.onTick = null;
    this.onStateChange = null;
    this.duration = 0;
  }

  /**
   * Start recording from user's microphone.
   * @param {Object} options - { onTick, onStateChange }
   */
  async start(options = {}) {
    this.onTick = options.onTick || null;
    this.onStateChange = options.onStateChange || null;
    this.audioChunks = [];
    this.duration = 0;

    if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
      throw new Error('Microphone audio capture is not supported by your browser.');
    }

    try {
      this.stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      
      let mimeType = 'audio/webm';
      if (!MediaRecorder.isTypeSupported('audio/webm')) {
        if (MediaRecorder.isTypeSupported('audio/mp4')) mimeType = 'audio/mp4';
        else if (MediaRecorder.isTypeSupported('audio/ogg')) mimeType = 'audio/ogg';
        else mimeType = '';
      }

      this.mediaRecorder = mimeType ? new MediaRecorder(this.stream, { mimeType }) : new MediaRecorder(this.stream);

      this.mediaRecorder.ondataavailable = (event) => {
        if (event.data && event.data.size > 0) {
          this.audioChunks.push(event.data);
        }
      };

      this.mediaRecorder.start(250); // Emit chunks every 250ms

      if (this.onStateChange) this.onStateChange('recording');

      // Start duration timer
      this.timerId = setInterval(() => {
        this.duration += 1;
        if (this.onTick) this.onTick(this.duration);
      }, 1000);

      return true;
    } catch (error) {
      if (this.onStateChange) this.onStateChange('error');
      if (error.name === 'NotAllowedError' || error.name === 'PermissionDeniedError') {
        throw new Error('Microphone access was denied. Please allow microphone permission in your browser address bar (🔒).');
      }
      throw new Error(`Microphone error: ${error.message || 'Unable to access audio input.'}`);
    }
  }

  /**
   * Stop recording and return the recorded audio blob.
   * @returns {Promise<Blob>}
   */
  stop() {
    return new Promise((resolve, reject) => {
      if (!this.mediaRecorder || this.mediaRecorder.state === 'inactive') {
        resolve(null);
        return;
      }

      this.mediaRecorder.onstop = () => {
        clearInterval(this.timerId);
        if (this.stream) {
          this.stream.getTracks().forEach(track => track.stop());
        }

        const mimeType = this.mediaRecorder.mimeType || 'audio/webm';
        const audioBlob = new Blob(this.audioChunks, { type: mimeType });

        if (this.onStateChange) this.onStateChange('stopped');
        resolve(audioBlob);
      };

      try {
        this.mediaRecorder.stop();
      } catch (err) {
        reject(err);
      }
    });
  }

  /**
   * Cancel recording without saving audio.
   */
  cancel() {
    clearInterval(this.timerId);
    if (this.mediaRecorder && this.mediaRecorder.state !== 'inactive') {
      try { this.mediaRecorder.stop(); } catch (e) {}
    }
    if (this.stream) {
      this.stream.getTracks().forEach(track => track.stop());
    }
    this.audioChunks = [];
    if (this.onStateChange) this.onStateChange('cancelled');
  }
}
