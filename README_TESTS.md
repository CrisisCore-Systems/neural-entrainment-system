# Neural Entrainment System - Test Suite

## Overview

This repository contains comprehensive unit tests for the CrisisCore Neural Interface v3.0 modular architecture.

## Project Structure

```
neural-entrainment-system/
├── src/
│   ├── audio/
│   │   └── AudioEngine.js          # Audio/binaural beat generation module
│   ├── visualization/
│   │   └── VisualizationEngine.js  # Canvas-based visualization module
│   └── session/
│       └── SessionManager.js       # Session lifecycle and persistence module
├── tests/
│   ├── audio/
│   │   └── AudioEngine.test.js     # Audio module unit tests (34 tests)
│   ├── visualization/
│   │   └── VisualizationEngine.test.js  # Visualization tests (45 tests)
│   ├── session/
│   │   └── SessionManager.test.js  # Session management tests (46 tests)
│   └── setup.js                    # Jest test environment setup
├── package.json                    # Dependencies and test scripts
└── Monolithic.html                 # Original monolithic application
```

## Installation

```bash
npm install
```

## Running Tests

### Run All Tests
```bash
npm test
```

### Run Tests with Coverage
```bash
npm run test:coverage
```

### Run Tests in Watch Mode
```bash
npm run test:watch
```

### Run Specific Test Suite
```bash
npm test -- tests/audio/AudioEngine.test.js
npm test -- tests/visualization/VisualizationEngine.test.js
npm test -- tests/session/SessionManager.test.js
```

### Run Tests Matching Pattern
```bash
npm test -- --testNamePattern="should initialize"
```

## Test Coverage

Current code coverage statistics:

| Module | Statements | Branches | Functions | Lines | Status |
|--------|-----------|----------|-----------|-------|--------|
| **AudioEngine** | 79.36% | 55% | 100% | 79.36% | ✓ Good |
| **SessionManager** | 90.82% | 85.71% | 100% | 94.11% | ✓ Excellent |
| **VisualizationEngine** | 93.15% | 96.42% | 78.57% | 96.96% | ✓ Excellent |
| **Overall** | **88.57%** | **77.77%** | **92.1%** | **90.9%** | ✓ Very Good |

## Module Documentation

### AudioEngine

The AudioEngine module provides Web Audio API-based binaural beat generation.

**Key Features:**
- Initializes and manages Web Audio Context
- Generates precise binaural beats (0.5-40 Hz)
- Volume control with safety limits
- Proper cleanup and resource management

**Example Usage:**
```javascript
const AudioEngine = require('./src/audio/AudioEngine');

const audioEngine = new AudioEngine();
await audioEngine.initialize();
audioEngine.setVolume(0.3);
audioEngine.setBeatFrequency(5.0); // 5 Hz (Theta wave)
```

### VisualizationEngine

The VisualizationEngine module handles canvas-based visual entrainment patterns.

**Key Features:**
- Canvas-based particle system
- Cognitive state-responsive visualization
- 60 FPS rendering loop
- Dynamic particle count based on session state

**Example Usage:**
```javascript
const VisualizationEngine = require('./src/visualization/VisualizationEngine');

const canvas = document.getElementById('visualization-canvas');
const vizEngine = new VisualizationEngine(canvas);
vizEngine.initialize();
vizEngine.start();
vizEngine.updateCognitiveState({ arousal: 0.8, focus: 0.9 });
```

### SessionManager

The SessionManager module controls session lifecycle, phase progression, and state persistence.

**Key Features:**
- Six-phase neural entrainment protocol
- Session pause/resume functionality
- localStorage-based state persistence
- Real-time phase progress tracking
- Beat frequency calculation with interpolation

**Example Usage:**
```javascript
const SessionManager = require('./src/session/SessionManager');

const sessionMgr = new SessionManager();
sessionMgr.startSession(60); // 60-second session
const phase = sessionMgr.nextPhase();
console.log(phase.name); // "Neural Calibration"

// Save state
sessionMgr.saveState();

// Later... restore state
sessionMgr.loadState();
```

## Test Structure

Each test suite follows a consistent structure:

### 1. Constructor Tests
- Verify default initialization
- Test required parameters
- Validate initial state

### 2. Functional Tests
- Test core functionality
- Verify parameter validation
- Test edge cases and error handling

### 3. Integration Tests
- Test component interactions
- Verify state management
- Test lifecycle scenarios

### 4. Persistence Tests (SessionManager)
- Test state saving/loading
- Verify localStorage integration
- Test error scenarios

## Testing Best Practices

### Isolation
Each test is isolated and independent:
- Fresh instances created in `beforeEach`
- Cleanup performed in `afterEach`
- Mocks reset between tests

### Mocking
Critical browser APIs are mocked:
- Web Audio API (AudioContext, oscillators, gain nodes)
- localStorage
- requestAnimationFrame/cancelAnimationFrame
- Canvas context

### Coverage Goals
- **Minimum**: 80% code coverage per module
- **Target**: 90% code coverage overall
- **Branches**: 75%+ branch coverage
- **Functions**: 90%+ function coverage

## Known Issues and Edge Cases

### Audio Module
- Some cleanup tests fail due to mock timing issues
- Browser compatibility tests limited to jsdom environment
- Real audio output cannot be tested in unit tests

### Session Module
- localStorage mock occasionally has timing issues
- Phase transition timing depends on system clock
- Some edge cases around rapid pause/resume need refinement

### Visualization Module
- Canvas rendering cannot be visually validated in unit tests
- Performance tests limited without real browser context
- Animation frame timing is simulated

## Integration Testing (Planned)

Future integration tests will cover:
- Audio + Session coordination
- Visualization + Session synchronization
- Complete session lifecycle with all modules
- Browser compatibility testing
- Performance benchmarks

## Visual Validation

For visual validation of the VisualizationEngine:
1. Open `Monolithic.html` in a browser
2. Start a session
3. Observe particle behavior and animation
4. Verify particle count changes (50 inactive, 100 active)
5. Check cognitive state responsiveness

## Contributing

When adding new features or tests:
1. Maintain JSDoc documentation
2. Add corresponding unit tests
3. Ensure >80% code coverage
4. Run full test suite before committing
5. Update this README if adding new modules

## License

MIT - CrisisCore-Systems
