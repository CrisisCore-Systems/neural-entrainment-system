/**
 * Neural Entrainment Session Types
 * Based on CrisisCore Neural Interface v3.0 specifications
 */

export type BrainwaveType = 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma';

export interface PhaseConfig {
  name: string;
  glyph: string;
  description: string;
  duration: number; // Fraction of total session (0-1)
  beatFreq: number | [number, number]; // Hz or [start, end] for sweep
  color: string;
  targetBrainwave: BrainwaveType;
}

export interface Protocol {
  id: string;
  name: string;
  description: string;
  phases: PhaseConfig[];
  totalDuration: number; // minutes
  difficulty: 'beginner' | 'intermediate' | 'advanced';
  safetyRating: number; // 1-5 scale
}

export interface SessionState {
  sessionActive: boolean;
  sessionPaused: boolean;
  sessionStartTime: number | null;
  currentPhase: number;
  sessionDuration: number; // seconds
  audioEnabled: boolean;
  visualEnabled: boolean;
}

export interface CognitiveMetrics {
  coherence: number; // 0-1
  focus: number; // 0-1
  arousal: number; // 0-1
  load: number; // 0-1
  valence: number; // 0-1
}

export interface SessionMetrics extends CognitiveMetrics {
  timestamp: number;
  phase: number;
  beatFrequency: number;
}

export const BRAINWAVE_RANGES: Record<BrainwaveType, [number, number]> = {
  delta: [0.5, 4],
  theta: [4, 8],
  alpha: [8, 13],
  beta: [13, 30],
  gamma: [30, 100]
};

export const DEFAULT_PHASES: PhaseConfig[] = [
  {
    name: 'Neural Calibration',
    glyph: '◉',
    description: 'Establishing baseline neural coherence',
    duration: 0.10, // 10% of session (~1 min)
    beatFreq: 10, // Alpha
    color: '#3366ff',
    targetBrainwave: 'alpha'
  },
  {
    name: 'Resonance Field',
    glyph: '◈',
    description: 'Initiating neural oscillation synchronization',
    duration: 0.15, // 15% of session (~1.5 min)
    beatFreq: [10, 7], // Alpha to Theta transition
    color: '#00cc99',
    targetBrainwave: 'theta'
  },
  {
    name: 'Depth Descent',
    glyph: '◐',
    description: 'Progressive meditative state deepening',
    duration: 0.20, // 20% of session (~2 min)
    beatFreq: [7, 5], // Theta deepening
    color: '#9933ff',
    targetBrainwave: 'theta'
  },
  {
    name: 'Integration Matrix',
    glyph: '◬',
    description: 'Neural pattern reorganization phase',
    duration: 0.20, // 20% of session (~2 min)
    beatFreq: 6, // Deep Theta
    color: '#ff6600',
    targetBrainwave: 'theta'
  },
  {
    name: 'Peak Coherence',
    glyph: '◉',
    description: 'Maximum neural synchronization achieved',
    duration: 0.15, // 15% of session (~1.5 min)
    beatFreq: 7.83, // Schumann resonance
    color: '#20d48a',
    targetBrainwave: 'theta'
  },
  {
    name: 'Return Integration',
    glyph: '◎',
    description: 'Gentle baseline reintegration sequence',
    duration: 0.20, // 20% of session (~2 min)
    beatFreq: [7, 10], // Theta to Alpha return
    color: '#3366ff',
    targetBrainwave: 'alpha'
  }
];
