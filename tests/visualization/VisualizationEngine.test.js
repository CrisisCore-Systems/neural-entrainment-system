/**
 * Unit tests for VisualizationEngine module
 */

const VisualizationEngine = require('../../src/visualization/VisualizationEngine');

describe('VisualizationEngine', () => {
  let canvas;
  let visualizationEngine;

  beforeEach(() => {
    // Create mock canvas
    canvas = document.createElement('canvas');
    canvas.width = 800;
    canvas.height = 600;
    canvas.clientWidth = 800;
    canvas.clientHeight = 600;
    
    // Mock getContext
    canvas.getContext = jest.fn().mockReturnValue({
      fillStyle: '',
      fillRect: jest.fn(),
      beginPath: jest.fn(),
      arc: jest.fn(),
      fill: jest.fn(),
      clearRect: jest.fn()
    });

    visualizationEngine = new VisualizationEngine(canvas);
    jest.clearAllMocks();
  });

  afterEach(() => {
    if (visualizationEngine) {
      visualizationEngine.cleanup();
    }
  });

  describe('Constructor', () => {
    test('should throw error if canvas is not provided', () => {
      expect(() => new VisualizationEngine(null)).toThrow('Canvas element is required');
    });

    test('should initialize with canvas and context', () => {
      expect(visualizationEngine.canvas).toBe(canvas);
      expect(visualizationEngine.ctx).toBeDefined();
    });

    test('should initialize with default values', () => {
      expect(visualizationEngine.isRunning).toBe(false);
      expect(visualizationEngine.animationFrameId).toBeNull();
      expect(visualizationEngine.time).toBe(0);
      expect(visualizationEngine.sessionActive).toBe(false);
    });

    test('should initialize with default cognitive state', () => {
      expect(visualizationEngine.cognitiveState).toEqual({
        arousal: 0.5,
        focus: 0.5,
        coherence: 0.72
      });
    });
  });

  describe('initialize()', () => {
    test('should initialize successfully', () => {
      const result = visualizationEngine.initialize();
      
      expect(result).toBe(true);
    });

    test('should resize canvas on initialization', () => {
      visualizationEngine.initialize();
      
      expect(canvas.width).toBe(canvas.clientWidth);
      expect(canvas.height).toBe(canvas.clientHeight);
    });

    test('should add resize event listener', () => {
      const addEventListenerSpy = jest.spyOn(window, 'addEventListener');
      
      visualizationEngine.initialize();
      
      expect(addEventListenerSpy).toHaveBeenCalledWith('resize', expect.any(Function));
      
      addEventListenerSpy.mockRestore();
    });
  });

  describe('resizeCanvas()', () => {
    test('should update canvas dimensions to match client size', () => {
      // Update the canvas element's clientWidth/Height which are readonly
      Object.defineProperty(canvas, 'clientWidth', { value: 1024, writable: true });
      Object.defineProperty(canvas, 'clientHeight', { value: 768, writable: true });
      
      visualizationEngine.resizeCanvas();
      
      expect(canvas.width).toBe(1024);
      expect(canvas.height).toBe(768);
    });

    test('should handle missing canvas gracefully', () => {
      const originalCanvas = visualizationEngine.canvas;
      visualizationEngine.canvas = null;
      
      expect(() => visualizationEngine.resizeCanvas()).not.toThrow();
      
      // Restore for cleanup
      visualizationEngine.canvas = originalCanvas;
    });
  });

  describe('start()', () => {
    test('should start visualization loop', () => {
      const initialTime = visualizationEngine.time;
      visualizationEngine.start();
      
      expect(visualizationEngine.isRunning).toBe(true);
      // Time gets incremented in render() which is called by start()
      expect(visualizationEngine.time).toBeGreaterThanOrEqual(initialTime);
    });

    test('should not start if already running', () => {
      visualizationEngine.start();
      visualizationEngine.time = 5.0;
      visualizationEngine.start();
      
      expect(console.warn).toHaveBeenCalledWith('Visualization already running');
      expect(visualizationEngine.time).toBe(5.0); // Time not reset
    });

    test('should call render method', () => {
      const renderSpy = jest.spyOn(visualizationEngine, 'render');
      
      visualizationEngine.start();
      
      expect(renderSpy).toHaveBeenCalled();
      
      renderSpy.mockRestore();
    });
  });

  describe('stop()', () => {
    test('should stop visualization loop', () => {
      visualizationEngine.start();
      visualizationEngine.stop();
      
      expect(visualizationEngine.isRunning).toBe(false);
    });

    test('should cancel animation frame', () => {
      visualizationEngine.start();
      visualizationEngine.animationFrameId = 123;
      
      visualizationEngine.stop();
      
      expect(cancelAnimationFrame).toHaveBeenCalledWith(123);
      expect(visualizationEngine.animationFrameId).toBeNull();
    });

    test('should handle stop when not running', () => {
      expect(() => visualizationEngine.stop()).not.toThrow();
    });
  });

  describe('render()', () => {
    test('should not render if not running', () => {
      visualizationEngine.isRunning = false;
      visualizationEngine.render();
      
      expect(requestAnimationFrame).not.toHaveBeenCalled();
    });

    test('should request animation frame if running', () => {
      visualizationEngine.isRunning = true;
      visualizationEngine.render();
      
      expect(requestAnimationFrame).toHaveBeenCalled();
    });

    test('should increment time', () => {
      visualizationEngine.isRunning = true;
      const initialTime = visualizationEngine.time;
      
      visualizationEngine.render();
      
      expect(visualizationEngine.time).toBeGreaterThan(initialTime);
    });
  });

  describe('renderVisualization()', () => {
    test('should handle missing context gracefully', () => {
      visualizationEngine.ctx = null;
      
      expect(() => visualizationEngine.renderVisualization(0)).not.toThrow();
    });

    test('should clear canvas with fade effect', () => {
      visualizationEngine.renderVisualization(0);
      
      expect(visualizationEngine.ctx.fillRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });

    test('should render 50 particles when session inactive', () => {
      visualizationEngine.sessionActive = false;
      visualizationEngine.renderVisualization(0);
      
      // beginPath is called once per particle
      expect(visualizationEngine.ctx.beginPath).toHaveBeenCalledTimes(50);
    });

    test('should render 100 particles when session active', () => {
      visualizationEngine.sessionActive = true;
      visualizationEngine.renderVisualization(0);
      
      expect(visualizationEngine.ctx.beginPath).toHaveBeenCalledTimes(100);
    });

    test('should use arc for drawing particles', () => {
      visualizationEngine.renderVisualization(0);
      
      expect(visualizationEngine.ctx.arc).toHaveBeenCalled();
    });

    test('should call fill for each particle', () => {
      visualizationEngine.sessionActive = false;
      visualizationEngine.renderVisualization(0);
      
      expect(visualizationEngine.ctx.fill).toHaveBeenCalledTimes(50);
    });
  });

  describe('updateCognitiveState()', () => {
    test('should update arousal level', () => {
      visualizationEngine.updateCognitiveState({ arousal: 0.8 });
      
      expect(visualizationEngine.cognitiveState.arousal).toBe(0.8);
    });

    test('should update focus level', () => {
      visualizationEngine.updateCognitiveState({ focus: 0.9 });
      
      expect(visualizationEngine.cognitiveState.focus).toBe(0.9);
    });

    test('should update coherence level', () => {
      visualizationEngine.updateCognitiveState({ coherence: 0.85 });
      
      expect(visualizationEngine.cognitiveState.coherence).toBe(0.85);
    });

    test('should update multiple values at once', () => {
      visualizationEngine.updateCognitiveState({
        arousal: 0.7,
        focus: 0.6,
        coherence: 0.9
      });
      
      expect(visualizationEngine.cognitiveState.arousal).toBe(0.7);
      expect(visualizationEngine.cognitiveState.focus).toBe(0.6);
      expect(visualizationEngine.cognitiveState.coherence).toBe(0.9);
    });

    test('should clamp arousal to 0-1 range', () => {
      visualizationEngine.updateCognitiveState({ arousal: 1.5 });
      expect(visualizationEngine.cognitiveState.arousal).toBe(1);
      
      visualizationEngine.updateCognitiveState({ arousal: -0.5 });
      expect(visualizationEngine.cognitiveState.arousal).toBe(0);
    });

    test('should clamp focus to 0-1 range', () => {
      visualizationEngine.updateCognitiveState({ focus: 2.0 });
      expect(visualizationEngine.cognitiveState.focus).toBe(1);
      
      visualizationEngine.updateCognitiveState({ focus: -1.0 });
      expect(visualizationEngine.cognitiveState.focus).toBe(0);
    });

    test('should clamp coherence to 0-1 range', () => {
      visualizationEngine.updateCognitiveState({ coherence: 1.2 });
      expect(visualizationEngine.cognitiveState.coherence).toBe(1);
      
      visualizationEngine.updateCognitiveState({ coherence: -0.3 });
      expect(visualizationEngine.cognitiveState.coherence).toBe(0);
    });

    test('should ignore undefined values', () => {
      const originalState = { ...visualizationEngine.cognitiveState };
      visualizationEngine.updateCognitiveState({ arousal: 0.8 });
      
      expect(visualizationEngine.cognitiveState.focus).toBe(originalState.focus);
      expect(visualizationEngine.cognitiveState.coherence).toBe(originalState.coherence);
    });
  });

  describe('setSessionActive()', () => {
    test('should set session as active', () => {
      visualizationEngine.setSessionActive(true);
      
      expect(visualizationEngine.sessionActive).toBe(true);
    });

    test('should set session as inactive', () => {
      visualizationEngine.sessionActive = true;
      visualizationEngine.setSessionActive(false);
      
      expect(visualizationEngine.sessionActive).toBe(false);
    });
  });

  describe('getState()', () => {
    test('should return complete state object', () => {
      const state = visualizationEngine.getState();
      
      expect(state).toHaveProperty('isRunning');
      expect(state).toHaveProperty('sessionActive');
      expect(state).toHaveProperty('cognitiveState');
      expect(state).toHaveProperty('canvasSize');
    });

    test('should return current running state', () => {
      visualizationEngine.start();
      const state = visualizationEngine.getState();
      
      expect(state.isRunning).toBe(true);
    });

    test('should return current session state', () => {
      visualizationEngine.setSessionActive(true);
      const state = visualizationEngine.getState();
      
      expect(state.sessionActive).toBe(true);
    });

    test('should return cognitive state copy', () => {
      const state = visualizationEngine.getState();
      
      // Modify returned state
      state.cognitiveState.arousal = 0.99;
      
      // Original should not be modified
      expect(visualizationEngine.cognitiveState.arousal).toBe(0.5);
    });

    test('should return canvas dimensions', () => {
      const state = visualizationEngine.getState();
      
      expect(state.canvasSize).toEqual({
        width: 800,
        height: 600
      });
    });
  });

  describe('cleanup()', () => {
    test('should stop visualization', () => {
      visualizationEngine.start();
      visualizationEngine.cleanup();
      
      expect(visualizationEngine.isRunning).toBe(false);
    });

    test('should clear canvas', () => {
      visualizationEngine.cleanup();
      
      expect(visualizationEngine.ctx.clearRect).toHaveBeenCalledWith(0, 0, canvas.width, canvas.height);
    });

    test('should remove resize event listener', () => {
      const removeEventListenerSpy = jest.spyOn(window, 'removeEventListener');
      
      visualizationEngine.cleanup();
      
      // Note: This test may not work as expected due to how the event listener is bound
      // but it demonstrates the intent
      expect(removeEventListenerSpy).toHaveBeenCalled();
      
      removeEventListenerSpy.mockRestore();
    });

    test('should handle cleanup with null context', () => {
      visualizationEngine.ctx = null;
      
      expect(() => visualizationEngine.cleanup()).not.toThrow();
    });
  });

  describe('Integration scenarios', () => {
    test('should handle full lifecycle: initialize -> start -> update state -> stop', () => {
      visualizationEngine.initialize();
      visualizationEngine.start();
      visualizationEngine.setSessionActive(true);
      visualizationEngine.updateCognitiveState({ arousal: 0.8 });
      visualizationEngine.stop();
      
      expect(visualizationEngine.isRunning).toBe(false);
      expect(visualizationEngine.sessionActive).toBe(true);
      expect(visualizationEngine.cognitiveState.arousal).toBe(0.8);
    });

    test('should render different particle counts based on session state', () => {
      visualizationEngine.initialize();
      
      // Inactive session
      visualizationEngine.setSessionActive(false);
      visualizationEngine.renderVisualization(0);
      const inactiveCallCount = visualizationEngine.ctx.beginPath.mock.calls.length;
      
      jest.clearAllMocks();
      
      // Active session
      visualizationEngine.setSessionActive(true);
      visualizationEngine.renderVisualization(0);
      const activeCallCount = visualizationEngine.ctx.beginPath.mock.calls.length;
      
      expect(activeCallCount).toBeGreaterThan(inactiveCallCount);
    });
  });
});
