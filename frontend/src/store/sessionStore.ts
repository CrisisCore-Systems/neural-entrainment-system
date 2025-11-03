/**
 * Session Store - Global state management with Zustand
 * Handles session lifecycle, phase transitions, and metrics
 */

import { create } from 'zustand';
import type { SessionState, PhaseConfig, CognitiveMetrics, Protocol } from '../types/session';
import { DEFAULT_PHASES } from '../types/session';

interface SessionStore extends SessionState {
  // State
  protocol: Protocol | null;
  phases: PhaseConfig[];
  metrics: CognitiveMetrics;
  
  // Actions
  initializeSession: (protocol?: Protocol) => void;
  startSession: () => void;
  pauseSession: () => void;
  resumeSession: () => void;
  stopSession: () => void;
  emergencyStop: () => void;
  setCurrentPhase: (phase: number) => void;
  updateMetrics: (metrics: Partial<CognitiveMetrics>) => void;
  toggleAudio: () => void;
  toggleVisual: () => void;
}

export const useSessionStore = create<SessionStore>((set, get) => ({
  // Initial state
  sessionActive: false,
  sessionPaused: false,
  sessionStartTime: null,
  currentPhase: 0,
  sessionDuration: 1200, // 20 minutes default
  audioEnabled: true,
  visualEnabled: true,
  protocol: null,
  phases: DEFAULT_PHASES,
  metrics: {
    coherence: 0,
    focus: 0,
    arousal: 0,
    load: 0,
    valence: 0.5
  },

  // Initialize session with protocol
  initializeSession: (protocol) => {
    const defaultProtocol: Protocol = {
      id: 'default-deep-meditation',
      name: 'Deep Meditation Protocol',
      description: 'Six-phase neural entrainment for deep meditative states',
      phases: DEFAULT_PHASES,
      totalDuration: 20,
      difficulty: 'beginner',
      safetyRating: 5
    };

    set({
      protocol: protocol || defaultProtocol,
      phases: protocol?.phases || DEFAULT_PHASES,
      sessionDuration: (protocol?.totalDuration || 20) * 60,
      currentPhase: 0,
      metrics: {
        coherence: 0,
        focus: 0,
        arousal: 0,
        load: 0,
        valence: 0.5
      }
    });

    console.log('[SessionStore] Session initialized:', protocol?.name || defaultProtocol.name);
  },

  // Start active session
  startSession: () => {
    set({
      sessionActive: true,
      sessionPaused: false,
      sessionStartTime: Date.now(),
      currentPhase: 0
    });

    console.log('[SessionStore] Session started');
  },

  // Pause session
  pauseSession: () => {
    if (get().sessionActive) {
      set({ sessionPaused: true });
      console.log('[SessionStore] Session paused');
    }
  },

  // Resume session
  resumeSession: () => {
    if (get().sessionActive && get().sessionPaused) {
      set({ sessionPaused: false });
      console.log('[SessionStore] Session resumed');
    }
  },

  // Stop session normally
  stopSession: () => {
    set({
      sessionActive: false,
      sessionPaused: false,
      sessionStartTime: null,
      currentPhase: 0
    });

    console.log('[SessionStore] Session stopped');
  },

  // Emergency stop - immediate termination
  emergencyStop: () => {
    set({
      sessionActive: false,
      sessionPaused: false,
      sessionStartTime: null,
      currentPhase: 0,
      metrics: {
        coherence: 0,
        focus: 0,
        arousal: 0,
        load: 0,
        valence: 0.5
      }
    });

    console.log('[SessionStore] EMERGENCY STOP - Session terminated immediately');
  },

  // Set current phase
  setCurrentPhase: (phase: number) => {
    const { phases } = get();
    if (phase >= 0 && phase < phases.length) {
      set({ currentPhase: phase });
      console.log(`[SessionStore] Phase changed to ${phase + 1}: ${phases[phase].name}`);
    }
  },

  // Update cognitive metrics
  updateMetrics: (newMetrics: Partial<CognitiveMetrics>) => {
    set((state) => ({
      metrics: {
        ...state.metrics,
        ...newMetrics
      }
    }));
  },

  // Toggle audio on/off
  toggleAudio: () => {
    set((state) => ({ audioEnabled: !state.audioEnabled }));
    console.log('[SessionStore] Audio toggled:', get().audioEnabled);
  },

  // Toggle visual on/off
  toggleVisual: () => {
    set((state) => ({ visualEnabled: !state.visualEnabled }));
    console.log('[SessionStore] Visual toggled:', get().visualEnabled);
  }
}));
