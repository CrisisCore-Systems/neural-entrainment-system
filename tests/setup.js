/**
 * Test setup file for Jest
 * Configures the test environment with necessary mocks and utilities
 */

// Mock Web Audio API for testing
const AudioContextMock = jest.fn().mockImplementation(() => ({
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

global.AudioContext = AudioContextMock;
global.webkitAudioContext = AudioContextMock;
window.AudioContext = AudioContextMock;
window.webkitAudioContext = AudioContextMock;

// Mock localStorage - need to use defineProperty because jsdom sets up localStorage
const localStorageInstance = {
  store: {},
  getItem(key) {
    return this.store[key] || null;
  },
  setItem(key, value) {
    this.store[key] = value;
  },
  removeItem(key) {
    delete this.store[key];
  },
  clear() {
    this.store = {};
  }
};

// Delete the jsdom localStorage and replace with our own
delete global.localStorage;

// Define localStorage with our mock that has own properties
Object.defineProperty(global, 'localStorage', {
  value: localStorageInstance,
  writable: true,
  configurable: true
});

// Now spy on the methods - this should work since they're own properties
jest.spyOn(global.localStorage, 'getItem');
jest.spyOn(global.localStorage, 'setItem');
jest.spyOn(global.localStorage, 'removeItem');
jest.spyOn(global.localStorage, 'clear');

// Reset localStorage store between tests
beforeEach(() => {
  localStorageInstance.store = {};
});

// Clean up after each test (reset call history but keep spies)
afterEach(() => {
  if (global.localStorage.getItem.mockClear) {
    global.localStorage.getItem.mockClear();
    global.localStorage.setItem.mockClear();
    global.localStorage.removeItem.mockClear();
    global.localStorage.clear.mockClear();
  }
});

// Mock requestAnimationFrame and cancelAnimationFrame
global.requestAnimationFrame = jest.fn((cb) => {
  return setTimeout(cb, 16); // ~60fps
});

global.cancelAnimationFrame = jest.fn((id) => {
  clearTimeout(id);
});

// Mock console methods to reduce noise in tests (but keep console.log for debugging)
const originalConsole = global.console;
global.console = {
  ...console,
  log: originalConsole.log, // Keep log for debugging
  warn: jest.fn(),
  error: jest.fn()
};
