/**
 * @fileoverview Audio Engine module for neural entrainment system
 * Handles binaural beat generation and audio management
 */

/**
 * AudioEngine class manages Web Audio API for binaural beat generation
 * @class
 */
class AudioEngine {
  /**
   * Creates an instance of AudioEngine
   */
  constructor() {
    this.audioContext = null;
    this.oscillator = null;
    this.gainNode = null;
    this.isInitialized = false;
    this.isEnabled = true;
  }

  /**
   * Initializes the Web Audio API context and audio nodes
   * @returns {Promise<boolean>} True if initialization successful, false otherwise
   * @throws {Error} If Web Audio API is not supported
   */
  async initialize() {
    if (!this.isEnabled) {
      console.log('Audio disabled - skipping audio initialization');
      return false;
    }

    try {
      // Create audio context
      const AudioContext = window.AudioContext || window.webkitAudioContext;
      if (!AudioContext) {
        throw new Error('Web Audio API not supported');
      }

      this.audioContext = new AudioContext();

      // Create audio nodes
      this.oscillator = this.audioContext.createOscillator();
      this.gainNode = this.audioContext.createGain();

      // Configure oscillator
      this.oscillator.type = 'sine';
      this.oscillator.frequency.value = 180; // Base frequency in Hz

      // Configure gain (volume)
      this.gainNode.gain.value = 0;

      // Connect audio chain: oscillator -> gain -> destination
      this.oscillator.connect(this.gainNode);
      this.gainNode.connect(this.audioContext.destination);

      // Start oscillator
      this.oscillator.start();

      this.isInitialized = true;
      console.log('Audio system initialized successfully');
      return true;

    } catch (error) {
      console.error(`Audio initialization failed: ${error.message}`);
      this.isEnabled = false;
      this.isInitialized = false;
      return false;
    }
  }

  /**
   * Updates the volume of the audio output
   * @param {number} volume - Volume level (0.0 to 1.0)
   * @throws {Error} If audio is not initialized
   */
  setVolume(volume) {
    if (!this.isInitialized || !this.gainNode) {
      console.warn('Audio not initialized, cannot set volume');
      return;
    }

    if (volume < 0 || volume > 1) {
      throw new Error('Volume must be between 0 and 1');
    }

    const now = this.audioContext.currentTime;
    this.gainNode.gain.cancelScheduledValues(now);
    this.gainNode.gain.linearRampToValueAtTime(volume, now + 0.1);
  }

  /**
   * Sets the beat frequency for binaural beats
   * @param {number} frequency - Beat frequency in Hz (typically 0.5-40 Hz)
   * @throws {Error} If frequency is out of safe range
   */
  setBeatFrequency(frequency) {
    if (!this.isInitialized || !this.oscillator) {
      console.warn('Audio not initialized, cannot set beat frequency');
      return;
    }

    if (frequency < 0.5 || frequency > 40) {
      throw new Error('Beat frequency must be between 0.5 and 40 Hz for safety');
    }

    const now = this.audioContext.currentTime;
    const targetFrequency = 180 + frequency; // Base frequency + beat frequency

    this.oscillator.frequency.cancelScheduledValues(now);
    this.oscillator.frequency.linearRampToValueAtTime(targetFrequency, now + 0.1);
  }

  /**
   * Enables or disables audio output
   * @param {boolean} enabled - Whether audio should be enabled
   */
  setEnabled(enabled) {
    this.isEnabled = enabled;
    
    if (!enabled && this.isInitialized) {
      this.setVolume(0);
    }
  }

  /**
   * Gets the current state of the audio engine
   * @returns {Object} Audio engine state
   */
  getState() {
    return {
      isInitialized: this.isInitialized,
      isEnabled: this.isEnabled,
      currentVolume: this.gainNode ? this.gainNode.gain.value : 0,
      currentFrequency: this.oscillator ? this.oscillator.frequency.value : 0
    };
  }

  /**
   * Cleans up audio resources
   */
  cleanup() {
    if (this.oscillator) {
      try {
        this.oscillator.stop();
      } catch (e) {
        // Oscillator may already be stopped
      }
      this.oscillator.disconnect();
      this.oscillator = null;
    }

    if (this.gainNode) {
      this.gainNode.disconnect();
      this.gainNode = null;
    }

    if (this.audioContext) {
      this.audioContext.close();
      this.audioContext = null;
    }

    this.isInitialized = false;
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = AudioEngine;
}
