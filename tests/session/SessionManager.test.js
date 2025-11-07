/**
 * Unit tests for SessionManager module
 */

const SessionManager = require('../../src/session/SessionManager');

describe('SessionManager', () => {
  let sessionManager;

  beforeEach(() => {
    // Create fresh SessionManager
    sessionManager = new SessionManager();
    
    // Clear mock call history but preserve implementations
    if (localStorage.getItem.mockClear) {
      localStorage.getItem.mockClear();
      localStorage.setItem.mockClear();
      localStorage.removeItem.mockClear();
      localStorage.clear.mockClear();
    }
    if (console.log.mockClear) {
      console.log.mockClear();
      console.warn.mockClear();
      console.error.mockClear();
    }
  });

  describe('Constructor', () => {
    test('should initialize with default values', () => {
      expect(sessionManager.sessionActive).toBe(false);
      expect(sessionManager.sessionPaused).toBe(false);
      expect(sessionManager.currentPhaseIndex).toBe(-1);
      expect(sessionManager.sessionStartTime).toBeNull();
      expect(sessionManager.sessionDuration).toBe(30);
    });

    test('should define 6 phases', () => {
      expect(sessionManager.phases).toHaveLength(6);
    });

    test('should have valid phase configurations', () => {
      sessionManager.phases.forEach((phase) => {
        expect(phase).toHaveProperty('name');
        expect(phase).toHaveProperty('glyph');
        expect(phase).toHaveProperty('color');
        expect(phase).toHaveProperty('duration');
        expect(phase).toHaveProperty('beatFreq');
        expect(phase).toHaveProperty('description');
      });
    });

    test('should have phase durations that sum to 1.0', () => {
      const totalDuration = sessionManager.phases.reduce((sum, phase) => sum + phase.duration, 0);
      expect(totalDuration).toBeCloseTo(1.0, 5);
    });
  });

  describe('startSession()', () => {
    test('should start session with default duration', () => {
      const result = sessionManager.startSession();

      expect(result).toBe(true);
      expect(sessionManager.sessionActive).toBe(true);
      expect(sessionManager.sessionPaused).toBe(false);
      expect(sessionManager.sessionStartTime).toBeDefined();
      expect(sessionManager.sessionDuration).toBe(30);
    });

    test('should start session with custom duration', () => {
      const result = sessionManager.startSession(60);

      expect(result).toBe(true);
      expect(sessionManager.sessionDuration).toBe(60);
    });

    test('should not start if session already active', () => {
      sessionManager.startSession();
      const result = sessionManager.startSession();

      expect(result).toBe(false);
      expect(console.warn).toHaveBeenCalledWith('Session already active');
    });

    test('should reset phase index when starting', () => {
      sessionManager.currentPhaseIndex = 3;
      sessionManager.startSession();

      expect(sessionManager.currentPhaseIndex).toBe(-1);
    });
  });

  describe('pauseSession()', () => {
    test('should pause active session', () => {
      sessionManager.startSession();
      const result = sessionManager.pauseSession();

      expect(result).toBe(true);
      expect(sessionManager.sessionPaused).toBe(true);
      expect(sessionManager.sessionActive).toBe(true);
    });

    test('should not pause if no active session', () => {
      const result = sessionManager.pauseSession();

      expect(result).toBe(false);
    });

    test('should not pause if already paused', () => {
      sessionManager.startSession();
      sessionManager.pauseSession();
      const result = sessionManager.pauseSession();

      expect(result).toBe(false);
    });
  });

  describe('resumeSession()', () => {
    test('should resume paused session', () => {
      sessionManager.startSession();
      sessionManager.pauseSession();
      const result = sessionManager.resumeSession();

      expect(result).toBe(true);
      expect(sessionManager.sessionPaused).toBe(false);
      expect(sessionManager.sessionActive).toBe(true);
    });

    test('should not resume if no active session', () => {
      const result = sessionManager.resumeSession();

      expect(result).toBe(false);
    });

    test('should not resume if not paused', () => {
      sessionManager.startSession();
      const result = sessionManager.resumeSession();

      expect(result).toBe(false);
    });
  });

  describe('stopSession()', () => {
    test('should stop active session', () => {
      sessionManager.startSession();
      const result = sessionManager.stopSession();

      expect(result).toBe(true);
      expect(sessionManager.sessionActive).toBe(false);
      expect(sessionManager.sessionPaused).toBe(false);
      expect(sessionManager.currentPhaseIndex).toBe(-1);
      expect(sessionManager.sessionStartTime).toBeNull();
    });

    test('should not stop if no active session', () => {
      const result = sessionManager.stopSession();

      expect(result).toBe(false);
    });
  });

  describe('nextPhase()', () => {
    beforeEach(() => {
      sessionManager.startSession();
    });

    test('should advance to first phase', () => {
      const phase = sessionManager.nextPhase();

      expect(phase).toBeDefined();
      expect(sessionManager.currentPhaseIndex).toBe(0);
      expect(phase.name).toBe('Neural Calibration');
    });

    test('should advance through all phases', () => {
      for (let i = 0; i < sessionManager.phases.length; i++) {
        const phase = sessionManager.nextPhase();
        expect(phase).toBeDefined();
        expect(sessionManager.currentPhaseIndex).toBe(i);
      }
    });

    test('should return null after last phase', () => {
      // Advance through all phases
      for (let i = 0; i < sessionManager.phases.length; i++) {
        sessionManager.nextPhase();
      }
      
      const phase = sessionManager.nextPhase();
      expect(phase).toBeNull();
    });

    test('should not advance if session not active', () => {
      sessionManager.stopSession();
      const phase = sessionManager.nextPhase();

      expect(phase).toBeNull();
      expect(console.warn).toHaveBeenCalled();
    });

    test('should set phase start time', () => {
      const before = Date.now();
      sessionManager.nextPhase();
      const after = Date.now();

      expect(sessionManager.phaseStartTime).toBeGreaterThanOrEqual(before);
      expect(sessionManager.phaseStartTime).toBeLessThanOrEqual(after);
    });
  });

  describe('getCurrentPhase()', () => {
    test('should return null when no phase active', () => {
      const phase = sessionManager.getCurrentPhase();
      expect(phase).toBeNull();
    });

    test('should return current phase', () => {
      sessionManager.startSession();
      sessionManager.nextPhase();
      
      const phase = sessionManager.getCurrentPhase();
      expect(phase).toBeDefined();
      expect(phase.name).toBe('Neural Calibration');
    });
  });

  describe('getCurrentPhaseDuration()', () => {
    test('should return 0 when no phase active', () => {
      const duration = sessionManager.getCurrentPhaseDuration();
      expect(duration).toBe(0);
    });

    test('should calculate phase duration correctly', () => {
      sessionManager.startSession(60); // 60 second session
      sessionManager.nextPhase(); // First phase is 15% of total
      
      const duration = sessionManager.getCurrentPhaseDuration();
      expect(duration).toBe(9000); // 60 * 0.15 * 1000 = 9000ms
    });
  });

  describe('getPhaseProgress()', () => {
    test('should return 0 for no phase', () => {
      const progress = sessionManager.getPhaseProgress();
      expect(progress).toBe(0);
    });

    test('should calculate progress correctly', () => {
      sessionManager.startSession(10); // 10 second session for easy testing
      sessionManager.nextPhase();
      
      // Mock elapsed time to be half the phase duration
      const phaseDuration = sessionManager.getCurrentPhaseDuration();
      sessionManager.phaseStartTime = Date.now() - (phaseDuration / 2);
      
      const progress = sessionManager.getPhaseProgress();
      expect(progress).toBeCloseTo(0.5, 1);
    });

    test('should cap progress at 1.0', () => {
      sessionManager.startSession(10);
      sessionManager.nextPhase();
      
      // Mock elapsed time to exceed phase duration
      sessionManager.phaseStartTime = Date.now() - 100000;
      
      const progress = sessionManager.getPhaseProgress();
      expect(progress).toBe(1);
    });
  });

  describe('calculateCurrentBeatFrequency()', () => {
    beforeEach(() => {
      sessionManager.startSession();
      sessionManager.nextPhase();
    });

    test('should return constant frequency for non-array beatFreq', () => {
      // First phase has constant frequency of 3.0 Hz
      const freq = sessionManager.calculateCurrentBeatFrequency();
      expect(freq).toBe(3.0);
    });

    test('should interpolate for two-frequency sweep', () => {
      // Move to second phase (Resonance Field) with sweep from 4.0 to 6.0 Hz
      sessionManager.nextPhase();
      
      // Mock 50% progress
      sessionManager.phaseStartTime = Date.now() - (sessionManager.getCurrentPhaseDuration() / 2);
      
      const freq = sessionManager.calculateCurrentBeatFrequency();
      expect(freq).toBeCloseTo(5.0, 1); // Should be midway between 4.0 and 6.0
    });

    test('should handle three-frequency sweep', () => {
      // Move to Integration Matrix phase with three-frequency sweep
      for (let i = 0; i < 3; i++) {
        sessionManager.nextPhase();
      }
      
      // Test first half (should be between 6.0 and 8.0)
      sessionManager.phaseStartTime = Date.now() - (sessionManager.getCurrentPhaseDuration() / 4);
      let freq = sessionManager.calculateCurrentBeatFrequency();
      expect(freq).toBeGreaterThan(6.0);
      expect(freq).toBeLessThan(8.0);
    });
  });

  describe('getSessionProgress()', () => {
    test('should return 0 for no active session', () => {
      const progress = sessionManager.getSessionProgress();
      expect(progress).toBe(0);
    });

    test('should calculate overall session progress', () => {
      sessionManager.startSession();
      sessionManager.nextPhase(); // First phase
      
      // Mock 50% through first phase
      const phaseDuration = sessionManager.getCurrentPhaseDuration();
      sessionManager.phaseStartTime = Date.now() - (phaseDuration / 2);
      
      const progress = sessionManager.getSessionProgress();
      
      // Should be 0.5 phases out of 6 = 0.5/6 ≈ 0.083
      expect(progress).toBeCloseTo(0.083, 2);
    });
  });

  describe('State persistence', () => {
    describe('saveState()', () => {
      test('should save session state to localStorage', () => {
        sessionManager.startSession(60);
        sessionManager.nextPhase();
        
        const result = sessionManager.saveState();
        
        expect(result).toBe(true);
        expect(localStorage.setItem).toHaveBeenCalledWith(
          'neuralEntrainmentSession',
          expect.any(String)
        );
      });

      test('should save all relevant state properties', () => {
        sessionManager.startSession(60);
        sessionManager.nextPhase();
        sessionManager.pauseSession();
        
        sessionManager.saveState();
        
        const savedData = JSON.parse(localStorage.setItem.mock.calls[0][1]);
        expect(savedData).toHaveProperty('sessionActive');
        expect(savedData).toHaveProperty('sessionPaused');
        expect(savedData).toHaveProperty('currentPhaseIndex');
        expect(savedData).toHaveProperty('sessionStartTime');
        expect(savedData).toHaveProperty('sessionDuration');
        expect(savedData).toHaveProperty('phaseStartTime');
      });

      test('should handle save errors gracefully', () => {
        // Make setItem throw an error
        localStorage.setItem.mockImplementationOnce(() => {
          throw new Error('Storage full');
        });
        
        const result = sessionManager.saveState();
        
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });
    });

    describe('loadState()', () => {
      test('should load session state from localStorage', () => {
        const savedState = {
          sessionActive: true,
          sessionPaused: false,
          currentPhaseIndex: 2,
          sessionStartTime: Date.now(),
          sessionDuration: 60,
          phaseStartTime: Date.now()
        };
        
        localStorage.getItem.mockReturnValueOnce(JSON.stringify(savedState));
        
        const result = sessionManager.loadState();
        
        expect(result).toBe(true);
        expect(sessionManager.sessionActive).toBe(true);
        expect(sessionManager.currentPhaseIndex).toBe(2);
        expect(sessionManager.sessionDuration).toBe(60);
      });

      test('should return false if no saved state exists', () => {
        localStorage.getItem.mockReturnValueOnce(null);
        
        const result = sessionManager.loadState();
        
        expect(result).toBe(false);
      });

      test('should handle load errors gracefully', () => {
        localStorage.getItem.mockImplementationOnce(() => {
          throw new Error('Storage error');
        });
        
        const result = sessionManager.loadState();
        
        expect(result).toBe(false);
        expect(console.error).toHaveBeenCalled();
      });

      test('should handle invalid JSON gracefully', () => {
        localStorage.getItem.mockReturnValueOnce('invalid json{');
        
        const result = sessionManager.loadState();
        
        expect(result).toBe(false);
      });
    });

    describe('clearState()', () => {
      test('should clear saved state from localStorage', () => {
        sessionManager.clearState();
        
        expect(localStorage.removeItem).toHaveBeenCalledWith('neuralEntrainmentSession');
      });

      test('should handle clear errors gracefully', () => {
        localStorage.removeItem.mockImplementationOnce(() => {
          throw new Error('Storage error');
        });
        
        expect(() => sessionManager.clearState()).not.toThrow();
        expect(console.error).toHaveBeenCalled();
      });
    });
  });

  describe('getState()', () => {
    test('should return complete state object', () => {
      sessionManager.startSession(60);
      sessionManager.nextPhase();
      
      const state = sessionManager.getState();
      
      expect(state).toHaveProperty('sessionActive');
      expect(state).toHaveProperty('sessionPaused');
      expect(state).toHaveProperty('currentPhaseIndex');
      expect(state).toHaveProperty('currentPhase');
      expect(state).toHaveProperty('phaseProgress');
      expect(state).toHaveProperty('sessionProgress');
      expect(state).toHaveProperty('beatFrequency');
      expect(state).toHaveProperty('sessionElapsedTime');
      expect(state).toHaveProperty('phaseElapsedTime');
    });

    test('should reflect current session state', () => {
      sessionManager.startSession(60);
      sessionManager.nextPhase();
      
      const state = sessionManager.getState();
      
      expect(state.sessionActive).toBe(true);
      expect(state.currentPhaseIndex).toBe(0);
      expect(state.currentPhase).toBeDefined();
      expect(state.currentPhase.name).toBe('Neural Calibration');
    });
  });

  describe('Integration scenarios', () => {
    test('should handle full session lifecycle', () => {
      // Start session
      sessionManager.startSession(30);
      expect(sessionManager.sessionActive).toBe(true);
      
      // Progress through phases
      sessionManager.nextPhase();
      expect(sessionManager.currentPhaseIndex).toBe(0);
      
      // Pause
      sessionManager.pauseSession();
      expect(sessionManager.sessionPaused).toBe(true);
      
      // Resume
      sessionManager.resumeSession();
      expect(sessionManager.sessionPaused).toBe(false);
      
      // Stop
      sessionManager.stopSession();
      expect(sessionManager.sessionActive).toBe(false);
    });

    test('should persist and restore session state', () => {
      // Create session
      sessionManager.startSession(60);
      sessionManager.nextPhase();
      sessionManager.nextPhase();
      const originalState = sessionManager.getState();
      
      // Save state
      sessionManager.saveState();
      
      // Create new manager and load state
      const newManager = new SessionManager();
      newManager.loadState();
      const restoredState = newManager.getState();
      
      // Verify state matches
      expect(restoredState.sessionActive).toBe(originalState.sessionActive);
      expect(restoredState.currentPhaseIndex).toBe(originalState.currentPhaseIndex);
      expect(restoredState.sessionPaused).toBe(originalState.sessionPaused);
    });
  });
});
