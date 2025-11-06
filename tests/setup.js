/**
 * Test setup file for Jest
 * Configures the test environment with necessary mocks and utilities
 */

// Mock Web Audio API for testing
global.AudioContext = jest.fn().mockImplementation(() => ({
  createOscillator: jest.fn().mockReturnValue({
    type: 'sine',
    frequency: {
      value: 180,
      cancelScheduledValues: jest.fn(),
      linearRampToValueAtTime: jest.fn()
    },
    connect: jest.fn(),
    disconnect: jest.fn(),
    start: jest.fn(),
    stop: jest.fn()
  }),
  createGain: jest.fn().mockReturnValue({
    gain: {
      value: 0,
      cancelScheduledValues: jest.fn(),
      linearRampToValueAtTime: jest.fn()
    },
    connect: jest.fn(),
    disconnect: jest.fn()
  }),
  destination: {},
  currentTime: 0,
  close: jest.fn()
}));

global.webkitAudioContext = global.AudioContext;

// Mock localStorage
const localStorageMock = (function() {
  let store = {};
  
  return {
    getItem: jest.fn((key) => store[key] || null),
    setItem: jest.fn((key, value) => { store[key] = value; }),
    removeItem: jest.fn((key) => { delete store[key]; }),
    clear: jest.fn(() => { store = {}; })
  };
})();

global.localStorage = localStorageMock;

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  return setTimeout(cb, 16); // ~60fps
});

global.cancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id);
});

// Mock console methods to reduce noise in tests
global.console = {
  ...console,
  log: jest.fn(),
  warn: jest.fn(),
  error: jest.fn()
};
