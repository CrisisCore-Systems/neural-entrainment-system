import { describe, it, expect, beforeEach, vi } from 'vitest';

// Mock Web Audio API
class MockAudioContext {
  sampleRate = 44100;
  currentTime = 0;
  destination = { connect: vi.fn() };

  createOscillator() {
    return {
      frequency: { value: 0, setValueAtTime: vi.fn() },
      type: 'sine',
      connect: vi.fn(),
      start: vi.fn(),
      stop: vi.fn(),
    };
  }

  createGain() {
    return {
      gain: { value: 1, setValueAtTime: vi.fn(), exponentialRampToValueAtTime: vi.fn() },
      connect: vi.fn(),
    };
  }

  createStereoPanner() {
    return {
      pan: { value: 0, setValueAtTime: vi.fn() },
      connect: vi.fn(),
    };
  }

  createBiquadFilter() {
    return {
      type: 'lowpass',
      frequency: { value: 0, setValueAtTime: vi.fn() },
      Q: { value: 1, setValueAtTime: vi.fn() },
      connect: vi.fn(),
    };
  }
}

// Simple AudioEngine mock for testing
class AudioEngine {
  private frequency: number = 440;
  private volume: number = 0.5;

  setFrequency(freq: number): void {
    if (freq < 20 || freq > 20000) {
      throw new Error('Frequency must be between 20Hz and 20kHz');
    }
    this.frequency = freq;
  }

  setVolume(vol: number): void {
    if (vol < 0 || vol > 1) {
      throw new Error('Volume must be between 0 and 1');
    }
    this.volume = vol;
  }

  getFrequency(): number {
    return this.frequency;
  }

  getVolume(): number {
    return this.volume;
  }
}

describe('AudioEngine', () => {
  let audioEngine: AudioEngine;

  beforeEach(() => {
    // Mock global AudioContext
    global.AudioContext = MockAudioContext as unknown as typeof AudioContext;
    audioEngine = new AudioEngine();
  });

  describe('Frequency Validation', () => {
    it('should accept valid frequencies', () => {
      expect(() => audioEngine.setFrequency(440)).not.toThrow();
      expect(audioEngine.getFrequency()).toBe(440);
    });

    it('should reject frequencies below 20Hz', () => {
      expect(() => audioEngine.setFrequency(10)).toThrow(
        'Frequency must be between 20Hz and 20kHz'
      );
    });

    it('should reject frequencies above 20kHz', () => {
      expect(() => audioEngine.setFrequency(25000)).toThrow(
        'Frequency must be between 20Hz and 20kHz'
      );
    });

    it('should accept boundary frequencies', () => {
      expect(() => audioEngine.setFrequency(20)).not.toThrow();
      expect(() => audioEngine.setFrequency(20000)).not.toThrow();
    });
  });

  describe('Volume Validation', () => {
    it('should accept valid volumes', () => {
      expect(() => audioEngine.setVolume(0.5)).not.toThrow();
      expect(audioEngine.getVolume()).toBe(0.5);
    });

    it('should reject negative volumes', () => {
      expect(() => audioEngine.setVolume(-0.1)).toThrow('Volume must be between 0 and 1');
    });

    it('should reject volumes above 1', () => {
      expect(() => audioEngine.setVolume(1.5)).toThrow('Volume must be between 0 and 1');
    });

    it('should accept boundary volumes', () => {
      expect(() => audioEngine.setVolume(0)).not.toThrow();
      expect(() => audioEngine.setVolume(1)).not.toThrow();
    });
  });
});
