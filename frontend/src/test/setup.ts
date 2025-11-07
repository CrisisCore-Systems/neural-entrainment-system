import { expect, afterEach } from 'vitest';
import { cleanup } from '@testing-library/react';
import * as matchers from '@testing-library/jest-dom/matchers';

// Extend Vitest's expect with jest-dom matchers
expect.extend(matchers);

// Cleanup after each test
afterEach(() => {
  cleanup();
});

// Mock Web Audio API
global.AudioContext = class MockAudioContext {
  state = 'suspended';
  currentTime = 0;
  destination = { maxChannelCount: 2 };
  
  createOscillator() {
    return {
      frequency: { value: 0, setValueAtTime: () => {} },
      type: 'sine',
      connect: () => {},
      start: () => {},
      stop: () => {},
    };
  }
  
  createGain() {
    return {
      gain: { value: 1, setValueAtTime: () => {}, exponentialRampToValueAtTime: () => {} },
      connect: () => {},
    };
  }
  
  createStereoPanner() {
    return {
      pan: { value: 0, setValueAtTime: () => {} },
      connect: () => {},
    };
  }
  
  resume() {
    return Promise.resolve();
  }
  
  close() {
    return Promise.resolve();
  }
} as any;

// Mock WebGL for Three.js
HTMLCanvasElement.prototype.getContext = function(contextId: string) {
  if (contextId === 'webgl' || contextId === 'webgl2') {
    return {
      canvas: this,
      drawingBufferWidth: 800,
      drawingBufferHeight: 600,
    };
  }
  return null;
} as any;
