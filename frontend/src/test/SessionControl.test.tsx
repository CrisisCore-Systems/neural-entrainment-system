/**
 * SessionControl Component Tests
 * Tests for session management, controls, and state transitions
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { SessionControl } from '../components/SessionControl';
import { useSessionStore } from '../store/sessionStore';
import { audioService } from '../services/audioService';
import { sessionManager } from '../services/sessionManager';

// Mock dependencies
vi.mock('../store/sessionStore', () => ({
  useSessionStore: vi.fn(),
}));

vi.mock('../services/audioService', () => ({
  audioService: {
    initialize: vi.fn(),
    start: vi.fn(),
    stop: vi.fn(),
    pause: vi.fn(),
    resume: vi.fn(),
    setVolume: vi.fn(),
    cleanup: vi.fn(),
  },
}));

vi.mock('../services/sessionManager', () => ({
  sessionManager: {
    runSession: vi.fn(),
    pauseSession: vi.fn(),
    resumeSession: vi.fn(),
    stopSession: vi.fn(),
    setProtocolId: vi.fn(),
  },
}));

vi.mock('../components/NeuralVisualization', () => ({
  NeuralVisualization: () => <div data-testid="neural-visualization">Visualization</div>,
}));

vi.mock('../components/PhaseLegend', () => ({
  PhaseLegend: () => <div data-testid="phase-legend">Phase Legend</div>,
}));

describe('SessionControl Component', () => {
  const mockProtocol = {
    id: 'protocol-1',
    name: 'Deep Focus',
    description: 'Enhanced concentration protocol',
    phases: [
      {
        name: 'Calibration',
        description: 'Baseline establishment',
        duration: 180,
        startFrequency: 10,
        endFrequency: 10,
        intensity: 0.5,
        color: '#667eea',
      },
      {
        name: 'Focus Build',
        description: 'Increasing focus',
        duration: 300,
        startFrequency: 10,
        endFrequency: 14,
        intensity: 0.7,
        color: '#f59e0b',
      },
    ],
  };

  const mockPhases = [
    {
      name: 'Calibration',
      glyph: '◉',
      description: 'Baseline establishment',
      duration: 0.375,
      beatFreq: 10,
      color: '#667eea',
      targetBrainwave: 'alpha' as const,
    },
    {
      name: 'Focus Build',
      glyph: '◈',
      description: 'Increasing focus',
      duration: 0.625,
      beatFreq: [10, 14] as [number, number],
      color: '#f59e0b',
      targetBrainwave: 'beta' as const,
    },
  ];

  const defaultStoreState = {
    sessionActive: false,
    sessionPaused: false,
    currentPhase: 0,
    phases: mockPhases,
    audioEnabled: true,
    visualEnabled: true,
    metrics: {
      coherence: 0,
      focus: 0,
      arousal: 0.5,
      load: 0,
      valence: 0.5,
    },
    initializeSession: vi.fn(),
    startSession: vi.fn(),
    toggleAudio: vi.fn(),
    toggleVisual: vi.fn(),
  };

  beforeEach(() => {
    vi.clearAllMocks();
    (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue(defaultStoreState);
    (useSessionStore.getState as any) = vi.fn().mockReturnValue(defaultStoreState);
    (useSessionStore.setState as any) = vi.fn();
    vi.mocked(audioService.initialize).mockResolvedValue(true);
  });

  describe('Rendering', () => {
    it('should render session control panel', () => {
      render(<SessionControl />);
      expect(screen.getByTestId('neural-visualization')).toBeInTheDocument();
    });

    it('should display protocol name when provided', () => {
      render(<SessionControl protocol={mockProtocol} />);
      // Protocol info should be visible somewhere in the component
      expect(screen.getByText(/Deep Focus|protocol/i)).toBeInTheDocument();
    });

    it('should render phase legend', () => {
      render(<SessionControl />);
      expect(screen.getByTestId('phase-legend')).toBeInTheDocument();
    });

    it('should show start button when session inactive', () => {
      render(<SessionControl />);
      const startButton = screen.getByRole('button', { name: /start|begin/i });
      expect(startButton).toBeInTheDocument();
    });

    it('should show controls when session active', () => {
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        sessionActive: true,
      });

      render(<SessionControl />);
      expect(screen.getByRole('button', { name: /pause|stop/i })).toBeInTheDocument();
    });
  });

  describe('Session Lifecycle', () => {
    it('should initialize audio service on start', async () => {
      render(<SessionControl protocol={mockProtocol} />);
      
      const startButton = screen.getByRole('button', { name: /start|begin/i });
      fireEvent.click(startButton);

      await waitFor(() => {
        expect(audioService.initialize).toHaveBeenCalled();
      });
    });

    it('should call initializeSession when audio initialized', async () => {
      const mockInitialize = vi.fn();
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        initializeSession: mockInitialize,
      });

      render(<SessionControl />);
      
      const startButton = screen.getByRole('button', { name: /start|begin/i });
      fireEvent.click(startButton);

      await waitFor(() => {
        expect(mockInitialize).toHaveBeenCalled();
      });
    });

    it('should start session manager after initialization', async () => {
      render(<SessionControl protocol={mockProtocol} />);
      
      const startButton = screen.getByRole('button', { name: /start|begin/i });
      fireEvent.click(startButton);

      await waitFor(() => {
        expect(sessionManager.runSession).toHaveBeenCalled();
      });
    });

    it('should set protocol ID in session manager', async () => {
      render(<SessionControl protocol={mockProtocol} />);
      
      const startButton = screen.getByRole('button', { name: /start|begin/i });
      fireEvent.click(startButton);

      await waitFor(() => {
        expect(sessionManager.setProtocolId).toHaveBeenCalledWith('protocol-1');
      });
    });
  });

  describe('Session Controls', () => {
    it('should pause session when pause button clicked', () => {
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        sessionActive: true,
        sessionPaused: false,
      });

      render(<SessionControl />);
      
      const pauseButton = screen.getByRole('button', { name: /pause/i });
      fireEvent.click(pauseButton);

      expect(sessionManager.pauseSession).toHaveBeenCalled();
    });

    it('should resume session when resume button clicked', () => {
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        sessionActive: true,
        sessionPaused: true,
      });

      render(<SessionControl />);
      
      const resumeButton = screen.getByRole('button', { name: /resume/i });
      fireEvent.click(resumeButton);

      expect(sessionManager.resumeSession).toHaveBeenCalled();
    });

    it('should stop session when stop button clicked', () => {
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        sessionActive: true,
      });

      render(<SessionControl />);
      
      const stopButton = screen.getByRole('button', { name: /stop|end/i });
      fireEvent.click(stopButton);

      expect(sessionManager.stopSession).toHaveBeenCalled();
    });
  });

  describe('Audio/Visual Toggles', () => {
    it('should toggle audio when audio button clicked', () => {
      const mockToggleAudio = vi.fn();
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        toggleAudio: mockToggleAudio,
      });

      render(<SessionControl />);
      
      const audioButton = screen.getByRole('button', { name: /audio|sound/i });
      fireEvent.click(audioButton);

      expect(mockToggleAudio).toHaveBeenCalled();
    });

    it('should toggle visual when visual button clicked', () => {
      const mockToggleVisual = vi.fn();
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        toggleVisual: mockToggleVisual,
      });

      render(<SessionControl />);
      
      const visualButton = screen.getByRole('button', { name: /visual|graphics/i });
      fireEvent.click(visualButton);

      expect(mockToggleVisual).toHaveBeenCalled();
    });

    it('should show audio enabled state', () => {
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        audioEnabled: true,
      });

      render(<SessionControl />);
      const audioButton = screen.getByRole('button', { name: /audio|sound/i });
      expect(audioButton).toHaveClass(/enabled|active/i);
    });

    it('should show visual enabled state', () => {
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        visualEnabled: true,
      });

      render(<SessionControl />);
      const visualButton = screen.getByRole('button', { name: /visual|graphics/i });
      expect(visualButton).toHaveClass(/enabled|active/i);
    });
  });

  describe('Phase Management', () => {
    it('should display current phase', () => {
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        sessionActive: true,
        currentPhase: 0,
      });

      render(<SessionControl />);
      expect(screen.getByText(/Calibration/i)).toBeInTheDocument();
    });

    it('should update display when phase changes', () => {
      const { rerender } = render(<SessionControl />);
      
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        currentPhase: 1,
      });

      rerender(<SessionControl />);
      expect(screen.getByText(/Focus Build/i)).toBeInTheDocument();
    });

    it('should show phase progress', () => {
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        sessionActive: true,
        currentPhase: 0,
      });

      render(<SessionControl />);
      // Should show some indication of phase 1/2 or similar
      expect(screen.getByText(/1|phase/i)).toBeInTheDocument();
    });
  });

  describe('Metrics Display', () => {
    it('should display coherence metric', () => {
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        sessionActive: true,
        metrics: { coherence: 0.85, focus: 0, arousal: 0.5, load: 0, valence: 0.5 },
      });

      render(<SessionControl />);
      expect(screen.getByText(/coherence|85%/i)).toBeInTheDocument();
    });

    it('should display focus metric', () => {
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        sessionActive: true,
        metrics: { coherence: 0, focus: 0.72, arousal: 0.5, load: 0, valence: 0.5 },
      });

      render(<SessionControl />);
      expect(screen.getByText(/focus|72%/i)).toBeInTheDocument();
    });

    it('should update metrics in real-time', () => {
      const { rerender } = render(<SessionControl />);
      
      (useSessionStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
        ...defaultStoreState,
        metrics: { coherence: 0.90, focus: 0, arousal: 0.5, load: 0, valence: 0.5 },
      });

      rerender(<SessionControl />);
      expect(screen.getByText(/90%/i)).toBeInTheDocument();
    });
  });

  describe('Protocol Conversion', () => {
    it('should convert protocol phases to session format', () => {
      render(<SessionControl protocol={mockProtocol} />);
      
      expect(useSessionStore.setState).toHaveBeenCalledWith({
        phases: expect.arrayContaining([
          expect.objectContaining({
            name: 'Calibration',
            beatFreq: 10,
          }),
        ]),
      });
    });

    it('should calculate phase durations as fractions', () => {
      render(<SessionControl protocol={mockProtocol} />);
      
      // Total duration: 180 + 300 = 480
      // Phase 1: 180/480 = 0.375
      // Phase 2: 300/480 = 0.625
      expect(useSessionStore.setState).toHaveBeenCalledWith({
        phases: expect.arrayContaining([
          expect.objectContaining({ duration: 0.375 }),
          expect.objectContaining({ duration: 0.625 }),
        ]),
      });
    });

    it('should classify brainwave targets correctly', () => {
      render(<SessionControl protocol={mockProtocol} />);
      
      expect(useSessionStore.setState).toHaveBeenCalledWith({
        phases: expect.arrayContaining([
          expect.objectContaining({ targetBrainwave: 'alpha' }), // 10 Hz
          expect.objectContaining({ targetBrainwave: 'beta' }), // 12 Hz avg
        ]),
      });
    });
  });

  describe('Back Navigation', () => {
    it('should call onBack when back button clicked', () => {
      const mockOnBack = vi.fn();
      render(<SessionControl onBack={mockOnBack} />);
      
      const backButton = screen.getByRole('button', { name: /back|return/i });
      fireEvent.click(backButton);

      expect(mockOnBack).toHaveBeenCalled();
    });

    it('should not show back button if onBack not provided', () => {
      render(<SessionControl />);
      
      const backButton = screen.queryByRole('button', { name: /back|return/i });
      expect(backButton).not.toBeInTheDocument();
    });
  });

  describe('Error Handling', () => {
    it('should handle audio initialization failure', async () => {
      vi.mocked(audioService.initialize).mockResolvedValue(false);

      render(<SessionControl />);
      
      const startButton = screen.getByRole('button', { name: /start|begin/i });
      fireEvent.click(startButton);

      await waitFor(() => {
        expect(sessionManager.runSession).not.toHaveBeenCalled();
      });
    });
  });
});
