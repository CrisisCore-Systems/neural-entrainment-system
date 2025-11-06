/**
 * @fileoverview Session Manager module for neural entrainment system
 * Handles session lifecycle, phase progression, and state persistence
 */

/**
 * Session phase configuration
 * @typedef {Object} PhaseConfig
 * @property {string} name - Phase name
 * @property {string} glyph - Visual glyph/emoji
 * @property {string} color - Phase color in hex format
 * @property {number} duration - Duration as a fraction of total session time
 * @property {number|number[]} beatFreq - Beat frequency or array for sweep
 * @property {string} description - Phase description
 */

/**
 * SessionManager class handles session lifecycle and phase progression
 * @class
 */
class SessionManager {
  /**
   * Creates an instance of SessionManager
   */
  constructor() {
    this.sessionActive = false;
    this.sessionPaused = false;
    this.currentPhaseIndex = -1;
    this.sessionStartTime = null;
    this.sessionDuration = 30; // Default 30 seconds
    this.phaseStartTime = null;
    
    /**
     * Phase definitions for the neural entrainment protocol
     * @type {PhaseConfig[]}
     */
    this.phases = [
      {
        name: 'Neural Calibration',
        glyph: '🧠',
        color: '#ff4500',
        duration: 0.15, // 15% of total time
        beatFreq: 3.0,
        description: 'Establishing baseline neural coherence...'
      },
      {
        name: 'Resonance Field',
        glyph: '🌊',
        color: '#ff6600',
        duration: 0.20, // 20% of total time
        beatFreq: [4.0, 6.0], // Sweep from 4 to 6 Hz
        description: 'Synchronizing neural oscillations...'
      },
      {
        name: 'Depth Descent',
        glyph: '⬇️',
        color: '#ff8800',
        duration: 0.25, // 25% of total time
        beatFreq: 5.0,
        description: 'Deepening meditative state...'
      },
      {
        name: 'Integration Matrix',
        glyph: '🌈',
        color: '#ffaa00',
        duration: 0.25, // 25% of total time
        beatFreq: [6.0, 8.0, 4.0], // Complex sweep
        description: 'Neural pattern integration...'
      },
      {
        name: 'Peak Coherence',
        glyph: '⭐',
        color: '#ffcc00',
        duration: 0.10, // 10% of total time
        beatFreq: 8.0,
        description: 'Maximum synchronization achieved...'
      },
      {
        name: 'Return Integration',
        glyph: '🕊️',
        color: '#ffee00',
        duration: 0.05, // 5% of total time
        beatFreq: [4.0, 2.0],
        description: 'Returning to baseline integration...'
      }
    ];
  }

  /**
   * Starts a new session
   * @param {number} duration - Session duration in seconds
   * @returns {boolean} True if session started successfully
   */
  startSession(duration = 30) {
    if (this.sessionActive) {
      console.warn('Session already active');
      return false;
    }

    this.sessionDuration = duration;
    this.sessionActive = true;
    this.sessionPaused = false;
    this.sessionStartTime = Date.now();
    this.currentPhaseIndex = -1;

    console.log(`Session started: ${duration} seconds`);
    return true;
  }

  /**
   * Pauses the current session
   * @returns {boolean} True if paused successfully
   */
  pauseSession() {
    if (!this.sessionActive || this.sessionPaused) {
      return false;
    }

    this.sessionPaused = true;
    console.log('Session paused');
    return true;
  }

  /**
   * Resumes a paused session
   * @returns {boolean} True if resumed successfully
   */
  resumeSession() {
    if (!this.sessionActive || !this.sessionPaused) {
      return false;
    }

    this.sessionPaused = false;
    console.log('Session resumed');
    return true;
  }

  /**
   * Stops the current session
   * @returns {boolean} True if stopped successfully
   */
  stopSession() {
    if (!this.sessionActive) {
      return false;
    }

    this.sessionActive = false;
    this.sessionPaused = false;
    this.currentPhaseIndex = -1;
    this.sessionStartTime = null;
    this.phaseStartTime = null;

    console.log('Session stopped');
    return true;
  }

  /**
   * Advances to the next phase
   * @returns {PhaseConfig|null} The next phase or null if no more phases
   */
  nextPhase() {
    if (!this.sessionActive) {
      console.warn('Cannot advance phase: no active session');
      return null;
    }

    this.currentPhaseIndex++;
    
    if (this.currentPhaseIndex >= this.phases.length) {
      console.log('All phases complete');
      return null;
    }

    this.phaseStartTime = Date.now();
    const phase = this.phases[this.currentPhaseIndex];
    console.log(`Advanced to phase ${this.currentPhaseIndex + 1}: ${phase.name}`);
    
    return phase;
  }

  /**
   * Gets the current phase
   * @returns {PhaseConfig|null} The current phase or null
   */
  getCurrentPhase() {
    if (this.currentPhaseIndex < 0 || this.currentPhaseIndex >= this.phases.length) {
      return null;
    }
    return this.phases[this.currentPhaseIndex];
  }

  /**
   * Calculates the duration of the current phase in milliseconds
   * @returns {number} Phase duration in milliseconds
   */
  getCurrentPhaseDuration() {
    const phase = this.getCurrentPhase();
    if (!phase) return 0;
    
    return phase.duration * this.sessionDuration * 1000;
  }

  /**
   * Gets the elapsed time in the current phase
   * @returns {number} Elapsed time in milliseconds
   */
  getPhaseElapsedTime() {
    if (!this.phaseStartTime) return 0;
    return Date.now() - this.phaseStartTime;
  }

  /**
   * Gets the progress through the current phase (0-1)
   * @returns {number} Progress value between 0 and 1
   */
  getPhaseProgress() {
    const duration = this.getCurrentPhaseDuration();
    if (duration === 0) return 0;
    
    const elapsed = this.getPhaseElapsedTime();
    return Math.min(elapsed / duration, 1);
  }

  /**
   * Calculates the beat frequency at the current point in the phase
   * @returns {number} Beat frequency in Hz
   */
  calculateCurrentBeatFrequency() {
    const phase = this.getCurrentPhase();
    if (!phase) return 0;

    const progress = this.getPhaseProgress();
    const beatFreq = phase.beatFreq;

    if (Array.isArray(beatFreq)) {
      if (beatFreq.length === 2) {
        // Linear sweep between two frequencies
        return beatFreq[0] + (beatFreq[1] - beatFreq[0]) * progress;
      } else if (beatFreq.length === 3) {
        // Three-point sweep
        if (progress < 0.5) {
          return beatFreq[0] + (beatFreq[1] - beatFreq[0]) * (progress / 0.5);
        } else {
          return beatFreq[1] + (beatFreq[2] - beatFreq[1]) * ((progress - 0.5) / 0.5);
        }
      }
    }

    // Constant frequency
    return beatFreq;
  }

  /**
   * Gets the elapsed time in the session
   * @returns {number} Elapsed time in milliseconds
   */
  getSessionElapsedTime() {
    if (!this.sessionStartTime) return 0;
    return Date.now() - this.sessionStartTime;
  }

  /**
   * Gets the overall session progress (0-1)
   * @returns {number} Progress value between 0 and 1
   */
  getSessionProgress() {
    if (!this.sessionActive || this.currentPhaseIndex < 0) return 0;

    const phaseProgress = this.getPhaseProgress();
    return ((this.currentPhaseIndex + phaseProgress) / this.phases.length);
  }

  /**
   * Saves session state to localStorage
   * @returns {boolean} True if saved successfully
   */
  saveState() {
    try {
      const state = {
        sessionActive: this.sessionActive,
        sessionPaused: this.sessionPaused,
        currentPhaseIndex: this.currentPhaseIndex,
        sessionStartTime: this.sessionStartTime,
        sessionDuration: this.sessionDuration,
        phaseStartTime: this.phaseStartTime
      };

      localStorage.setItem('neuralEntrainmentSession', JSON.stringify(state));
      return true;
    } catch (error) {
      console.error('Failed to save session state:', error);
      return false;
    }
  }

  /**
   * Loads session state from localStorage
   * @returns {boolean} True if loaded successfully
   */
  loadState() {
    try {
      const savedState = localStorage.getItem('neuralEntrainmentSession');
      if (!savedState) return false;

      const state = JSON.parse(savedState);
      
      this.sessionActive = state.sessionActive;
      this.sessionPaused = state.sessionPaused;
      this.currentPhaseIndex = state.currentPhaseIndex;
      this.sessionStartTime = state.sessionStartTime;
      this.sessionDuration = state.sessionDuration;
      this.phaseStartTime = state.phaseStartTime;

      console.log('Session state loaded from storage');
      return true;
    } catch (error) {
      console.error('Failed to load session state:', error);
      return false;
    }
  }

  /**
   * Clears saved session state
   */
  clearState() {
    try {
      localStorage.removeItem('neuralEntrainmentSession');
    } catch (error) {
      console.error('Failed to clear session state:', error);
    }
  }

  /**
   * Gets the current state of the session manager
   * @returns {Object} Session state object
   */
  getState() {
    return {
      sessionActive: this.sessionActive,
      sessionPaused: this.sessionPaused,
      currentPhaseIndex: this.currentPhaseIndex,
      currentPhase: this.getCurrentPhase(),
      phaseProgress: this.getPhaseProgress(),
      sessionProgress: this.getSessionProgress(),
      beatFrequency: this.calculateCurrentBeatFrequency(),
      sessionElapsedTime: this.getSessionElapsedTime(),
      phaseElapsedTime: this.getPhaseElapsedTime()
    };
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = SessionManager;
}
