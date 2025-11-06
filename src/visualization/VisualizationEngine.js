/**
 * @fileoverview Visualization Engine module for neural entrainment system
 * Handles canvas-based visual entrainment patterns
 */

/**
 * VisualizationEngine class manages canvas rendering for visual entrainment
 * @class
 */
class VisualizationEngine {
  /**
   * Creates an instance of VisualizationEngine
   * @param {HTMLCanvasElement} canvas - The canvas element to render on
   */
  constructor(canvas) {
    if (!canvas) {
      throw new Error('Canvas element is required');
    }

    this.canvas = canvas;
    this.ctx = canvas.getContext('2d');
    this.isRunning = false;
    this.animationFrameId = null;
    this.time = 0;
    this.cognitiveState = {
      arousal: 0.5,
      focus: 0.5,
      coherence: 0.72
    };
    this.sessionActive = false;
  }

  /**
   * Initializes the visualization engine
   * @returns {boolean} True if initialization successful
   */
  initialize() {
    try {
      this.resizeCanvas();
      window.addEventListener('resize', () => this.resizeCanvas());
      console.log('Visualization system initialized');
      return true;
    } catch (error) {
      console.error(`Visualization initialization failed: ${error.message}`);
      return false;
    }
  }

  /**
   * Resizes the canvas to match its display size
   */
  resizeCanvas() {
    if (!this.canvas) return;
    
    this.canvas.width = this.canvas.clientWidth;
    this.canvas.height = this.canvas.clientHeight;
  }

  /**
   * Starts the visualization rendering loop
   */
  start() {
    if (this.isRunning) {
      console.warn('Visualization already running');
      return;
    }

    this.isRunning = true;
    this.time = 0;
    this.render();
  }

  /**
   * Stops the visualization rendering loop
   */
  stop() {
    this.isRunning = false;
    if (this.animationFrameId) {
      cancelAnimationFrame(this.animationFrameId);
      this.animationFrameId = null;
    }
  }

  /**
   * Main rendering loop
   * @private
   */
  render() {
    if (!this.isRunning) return;

    this.time += 0.016; // Approximately 60 FPS
    this.renderVisualization(this.time);
    this.animationFrameId = requestAnimationFrame(() => this.render());
  }

  /**
   * Renders the visualization on the canvas
   * @param {number} time - Current animation time
   * @private
   */
  renderVisualization(time) {
    if (!this.ctx) return;

    const width = this.canvas.width;
    const height = this.canvas.height;

    // Clear canvas with fade effect
    this.ctx.fillStyle = 'rgba(0, 0, 0, 0.1)';
    this.ctx.fillRect(0, 0, width, height);

    // Calculate parameters based on session state
    const particleCount = this.sessionActive ? 100 : 50;
    const intensity = this.sessionActive ? 1.5 : 0.5;

    // Draw particles based on cognitive state
    for (let i = 0; i < particleCount; i++) {
      const angle = (i / particleCount) * Math.PI * 2 + time * 0.5;
      const distance = 50 + Math.sin(time + i) * 30 * this.cognitiveState.arousal * intensity;
      const x = width / 2 + Math.cos(angle) * distance;
      const y = height / 2 + Math.sin(angle) * distance;
      const size = 2 + Math.sin(time * 2 + i) * 2 * intensity;

      this.ctx.beginPath();
      this.ctx.arc(x, y, size, 0, Math.PI * 2);
      
      const hue = 15 + Math.sin(time + i) * 20;
      const alpha = 0.3 + Math.sin(time + i) * 0.2;
      this.ctx.fillStyle = `hsla(${hue}, 90%, 60%, ${alpha})`;
      this.ctx.fill();
    }
  }

  /**
   * Updates the cognitive state for visualization
   * @param {Object} state - Cognitive state object
   * @param {number} state.arousal - Arousal level (0-1)
   * @param {number} state.focus - Focus level (0-1)
   * @param {number} state.coherence - Coherence level (0-1)
   */
  updateCognitiveState(state) {
    if (state.arousal !== undefined) {
      this.cognitiveState.arousal = Math.max(0, Math.min(1, state.arousal));
    }
    if (state.focus !== undefined) {
      this.cognitiveState.focus = Math.max(0, Math.min(1, state.focus));
    }
    if (state.coherence !== undefined) {
      this.cognitiveState.coherence = Math.max(0, Math.min(1, state.coherence));
    }
  }

  /**
   * Sets whether a session is active
   * @param {boolean} active - Whether a session is active
   */
  setSessionActive(active) {
    this.sessionActive = active;
  }

  /**
   * Gets the current state of the visualization engine
   * @returns {Object} Visualization engine state
   */
  getState() {
    return {
      isRunning: this.isRunning,
      sessionActive: this.sessionActive,
      cognitiveState: { ...this.cognitiveState },
      canvasSize: {
        width: this.canvas.width,
        height: this.canvas.height
      }
    };
  }

  /**
   * Cleans up resources
   */
  cleanup() {
    this.stop();
    window.removeEventListener('resize', () => this.resizeCanvas());
    
    if (this.ctx) {
      this.ctx.clearRect(0, 0, this.canvas.width, this.canvas.height);
    }
  }
}

// Export for both Node.js and browser environments
if (typeof module !== 'undefined' && module.exports) {
  module.exports = VisualizationEngine;
}
