/**
 * Unit tests for AudioEngine module
 */

const AudioEngine = require('../../src/audio/AudioEngine');

describe('AudioEngine', () => {
  let audioEngine;

  beforeEach(() => {
    audioEngine = new AudioEngine();
    // Don't use jest.clearAllMocks() as it clears mock implementations
    // Individual mocks will be cleared in nested beforeEach blocks if needed
  });

  afterEach(() => {
    if (audioEngine && audioEngine.isInitialized) {
      try {
        audioEngine.cleanup();
      } catch (e) {
        // Ignore cleanup errors in afterEach
      }
    }
  });

  describe('Constructor', () => {
    test('should initialize with default values', () => {
      expect(audioEngine.audioContext).toBeNull();
      expect(audioEngine.oscillator).toBeNull();
      expect(audioEngine.gainNode).toBeNull();
      expect(audioEngine.isInitialized).toBe(false);
      expect(audioEngine.isEnabled).toBe(true);
    });
  });

  describe('initialize()', () => {
    test('should initialize audio context and nodes successfully', async () => {
      const result = await audioEngine.initialize();

      expect(result).toBe(true);
      expect(audioEngine.isInitialized).toBe(true);
      expect(audioEngine.audioContext).toBeDefined();
      expect(audioEngine.oscillator).toBeDefined();
      expect(audioEngine.gainNode).toBeDefined();
    });

    test('should set up oscillator with correct defaults', async () => {
      await audioEngine.initialize();

      expect(audioEngine.oscillator.type).toBe('sine');
      expect(audioEngine.oscillator.frequency.value).toBe(180);
    });

    test('should set gain to 0 initially', async () => {
      await audioEngine.initialize();

      expect(audioEngine.gainNode.gain.value).toBe(0);
    });

    test('should connect audio nodes correctly', async () => {
      await audioEngine.initialize();

      expect(audioEngine.oscillator.connect).toHaveBeenCalledWith(audioEngine.gainNode);
      expect(audioEngine.gainNode.connect).toHaveBeenCalledWith(audioEngine.audioContext.destination);
    });

    test('should start oscillator after initialization', async () => {
      await audioEngine.initialize();

      expect(audioEngine.oscillator.start).toHaveBeenCalled();
    });

    test('should return false and disable audio when disabled', async () => {
      audioEngine.setEnabled(false);
      const result = await audioEngine.initialize();

      expect(result).toBe(false);
      expect(audioEngine.isInitialized).toBe(false);
    });

    test('should handle initialization errors gracefully', async () => {
      // Save original mock
      const originalAudioContext = global.AudioContext;
      const originalWindowAudioContext = window.AudioContext;
      
      // Mock AudioContext to throw error
      const throwingMock = jest.fn().mockImplementation(() => {
        throw new Error('Web Audio not supported');
      });
      global.AudioContext = throwingMock;
      window.AudioContext = throwingMock;

      const result = await audioEngine.initialize();

      expect(result).toBe(false);
      expect(audioEngine.isInitialized).toBe(false);
      expect(audioEngine.isEnabled).toBe(false);
      
      // Restore original mocks
      global.AudioContext = originalAudioContext;
      window.AudioContext = originalWindowAudioContext;
    });
  });

  describe('setVolume()', () => {
    beforeEach(async () => {
      await audioEngine.initialize();
    });

    test('should set volume within valid range', () => {
      audioEngine.setVolume(0.5);

      expect(audioEngine.gainNode.gain.cancelScheduledValues).toHaveBeenCalled();
      expect(audioEngine.gainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0.5, expect.any(Number));
    });

    test('should accept volume of 0', () => {
      audioEngine.setVolume(0);

      expect(audioEngine.gainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(0, expect.any(Number));
    });

    test('should accept volume of 1', () => {
      audioEngine.setVolume(1);

      expect(audioEngine.gainNode.gain.linearRampToValueAtTime).toHaveBeenCalledWith(1, expect.any(Number));
    });

    test('should throw error for volume below 0', () => {
      expect(() => audioEngine.setVolume(-0.1)).toThrow('Volume must be between 0 and 1');
    });

    test('should throw error for volume above 1', () => {
      expect(() => audioEngine.setVolume(1.1)).toThrow('Volume must be between 0 and 1');
    });

    test('should handle uninitialized state gracefully', () => {
      const uninitializedEngine = new AudioEngine();
      
      // Should not throw, just warn
      expect(() => uninitializedEngine.setVolume(0.5)).not.toThrow();
    });
  });

  describe('setBeatFrequency()', () => {
    beforeEach(async () => {
      await audioEngine.initialize();
    });

    test('should set beat frequency within valid range', () => {
      audioEngine.setBeatFrequency(5.0);

      expect(audioEngine.oscillator.frequency.cancelScheduledValues).toHaveBeenCalled();
      expect(audioEngine.oscillator.frequency.linearRampToValueAtTime).toHaveBeenCalledWith(185, expect.any(Number));
    });

    test('should accept minimum safe frequency (0.5 Hz)', () => {
      audioEngine.setBeatFrequency(0.5);

      expect(audioEngine.oscillator.frequency.linearRampToValueAtTime).toHaveBeenCalledWith(180.5, expect.any(Number));
    });

    test('should accept maximum safe frequency (40 Hz)', () => {
      audioEngine.setBeatFrequency(40);

      expect(audioEngine.oscillator.frequency.linearRampToValueAtTime).toHaveBeenCalledWith(220, expect.any(Number));
    });

    test('should throw error for frequency below safe range', () => {
      expect(() => audioEngine.setBeatFrequency(0.4)).toThrow('Beat frequency must be between 0.5 and 40 Hz');
    });

    test('should throw error for frequency above safe range', () => {
      expect(() => audioEngine.setBeatFrequency(41)).toThrow('Beat frequency must be between 0.5 and 40 Hz');
    });

    test('should handle uninitialized state gracefully', () => {
      const uninitializedEngine = new AudioEngine();
      
      // Should not throw, just warn
      expect(() => uninitializedEngine.setBeatFrequency(5.0)).not.toThrow();
    });
  });

  describe('setEnabled()', () => {
    test('should enable audio', () => {
      audioEngine.setEnabled(true);
      expect(audioEngine.isEnabled).toBe(true);
    });

    test('should disable audio', () => {
      audioEngine.setEnabled(false);
      expect(audioEngine.isEnabled).toBe(false);
    });

    test('should set volume to 0 when disabling initialized audio', async () => {
      await audioEngine.initialize();
      audioEngine.setVolume(0.5);
      
      audioEngine.setEnabled(false);

      // Should have been called twice: once for setVolume, once for setEnabled
      expect(audioEngine.gainNode.gain.linearRampToValueAtTime).toHaveBeenCalledTimes(2);
    });
  });

  describe('getState()', () => {
    test('should return state before initialization', () => {
      const state = audioEngine.getState();

      expect(state).toEqual({
        isInitialized: false,
        isEnabled: true,
        currentVolume: 0,
        currentFrequency: 0
      });
    });

    test('should return state after initialization', async () => {
      await audioEngine.initialize();
      const state = audioEngine.getState();

      expect(state.isInitialized).toBe(true);
      expect(state.isEnabled).toBe(true);
      expect(state.currentVolume).toBe(0);
      expect(state.currentFrequency).toBe(180);
    });

    test('should reflect volume changes in state', async () => {
      await audioEngine.initialize();
      audioEngine.gainNode.gain.value = 0.7;
      
      const state = audioEngine.getState();
      expect(state.currentVolume).toBe(0.7);
    });
  });

  describe('cleanup()', () => {
    test('should clean up uninitialized engine without errors', () => {
      expect(() => audioEngine.cleanup()).not.toThrow();
    });

    test('should stop and disconnect oscillator', async () => {
      await audioEngine.initialize();
      const stopSpy = audioEngine.oscillator.stop;
      const disconnectSpy = audioEngine.oscillator.disconnect;
      
      audioEngine.cleanup();

      expect(stopSpy).toHaveBeenCalled();
      expect(disconnectSpy).toHaveBeenCalled();
    });

    test('should disconnect gain node', async () => {
      await audioEngine.initialize();
      const disconnectSpy = audioEngine.gainNode.disconnect;
      
      audioEngine.cleanup();

      expect(disconnectSpy).toHaveBeenCalled();
    });

    test('should close audio context', async () => {
      await audioEngine.initialize();
      const closeSpy = audioEngine.audioContext.close;
      
      audioEngine.cleanup();

      expect(closeSpy).toHaveBeenCalled();
    });

    test('should reset initialization state', async () => {
      await audioEngine.initialize();
      audioEngine.cleanup();

      expect(audioEngine.isInitialized).toBe(false);
      expect(audioEngine.audioContext).toBeNull();
      expect(audioEngine.oscillator).toBeNull();
      expect(audioEngine.gainNode).toBeNull();
    });

    test('should handle cleanup errors gracefully', async () => {
      await audioEngine.initialize();
      
      // Mock stop to throw error
      audioEngine.oscillator.stop = jest.fn().mockImplementation(() => {
        throw new Error('Already stopped');
      });

      expect(() => audioEngine.cleanup()).not.toThrow();
    });
  });

  describe('Integration scenarios', () => {
    test('should handle full lifecycle: initialize -> set volume -> set frequency -> cleanup', async () => {
      await audioEngine.initialize();
      audioEngine.setVolume(0.3);
      audioEngine.setBeatFrequency(5.0);
      audioEngine.cleanup();

      expect(audioEngine.isInitialized).toBe(false);
    });

    test('should not allow operations after cleanup', async () => {
      await audioEngine.initialize();
      audioEngine.cleanup();

      // These should not throw but should also not work
      audioEngine.setVolume(0.5);
      audioEngine.setBeatFrequency(5.0);

      expect(console.warn).toHaveBeenCalled();
    });
  });
});
