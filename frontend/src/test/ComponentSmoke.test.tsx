/**
 * Smoke Tests for Critical Components
 * Simple, non-brittle tests that validate core rendering without implementation details
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen } from '@testing-library/react';
import { SessionControl } from '../components/SessionControl';
import { ProtocolSelector } from '../components/ProtocolSelector';

// Mock dependencies
vi.mock('../store/sessionStore', () => ({
  useSessionStore: Object.assign(
    vi.fn(() => ({
      sessionActive: false,
      sessionPaused: false,
      currentPhase: 0,
      phases: [],
      audioEnabled: true,
      visualEnabled: true,
      metrics: { coherence: 0, focus: 0, arousal: 0, load: 0, valence: 0 },
      initializeSession: vi.fn(),
      toggleAudio: vi.fn(),
      toggleVisual: vi.fn(),
      startSession: vi.fn(),
    })),
    {
      setState: vi.fn(),
      getState: vi.fn(() => ({
        startSession: vi.fn(),
      })),
    }
  ),
}));

vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn(() => ({
    user: { id: '1', email: 'test@example.com', gatewayAccess: false },
  })),
}));

vi.mock('../services/audioService', () => ({
  audioService: {
    initialize: vi.fn().mockResolvedValue(true),
    isReady: vi.fn().mockReturnValue(false),
    getCurrentBeatFrequency: vi.fn().mockReturnValue(0),
  },
}));

vi.mock('../services/sessionManager', () => ({
  sessionManager: {
    setProtocolId: vi.fn(),
    runSession: vi.fn(),
    pauseSession: vi.fn(),
    resumeSession: vi.fn(),
    stopSession: vi.fn(),
    emergencyStop: vi.fn(),
  },
}));

vi.mock('../services/apiClient', () => ({
  apiClient: {
    getProtocols: vi.fn().mockResolvedValue({
      data: {
        protocols: [
          {
            id: '1',
            name: 'Deep Focus',
            description: 'Enhanced concentration',
            category: 'focus',
            difficulty: 2,
            total_duration: 1200,
            safety_rating: 4,
            usage_count: 10,
            is_public: true,
            phases: [],
          },
        ],
      },
    }),
  },
}));

vi.mock('../components/NeuralVisualization', () => ({
  NeuralVisualization: () => <div data-testid="neural-visualization">Visualization</div>,
}));

vi.mock('../components/PhaseLegend', () => ({
  PhaseLegend: () => <div data-testid="phase-legend">Phase Legend</div>,
}));

describe('SessionControl - Smoke Tests', () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', () => {
    render(<SessionControl />);
    expect(screen.getByText(/CrisisCore Neural Interface/i)).toBeInTheDocument();
  });

  it('should show control buttons', () => {
    render(<SessionControl />);
    const buttons = screen.getAllByRole('button');
    expect(buttons.length).toBeGreaterThan(0);
  });

  it('should render protocol information when provided', () => {
    const mockProtocol = {
      id: '1',
      name: 'Test Protocol',
      description: 'Test Description',
      phases: [
        {
          name: 'Phase 1',
          description: 'First phase',
          duration: 300,
          startFrequency: 10,
          endFrequency: 10,
          intensity: 0.5,
          color: '#667eea',
        },
      ],
    };

    render(<SessionControl protocol={mockProtocol} />);
    expect(screen.getByText(/Test Protocol/i)).toBeInTheDocument();
  });

  it('should include audio and visual toggles', () => {
    render(<SessionControl />);
    const checkboxes = screen.getAllByRole('checkbox');
    expect(checkboxes.length).toBeGreaterThanOrEqual(2);
  });

  it('should render neural visualization component', () => {
    render(<SessionControl />);
    expect(screen.getByTestId('neural-visualization')).toBeInTheDocument();
  });
});

describe('ProtocolSelector - Smoke Tests', () => {
  const mockOnSelect = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
  });

  it('should render without crashing', async () => {
    render(<ProtocolSelector onSelect={mockOnSelect} />);
    // Wait for loading to complete
    await screen.findByText(/Deep Focus/i);
    expect(screen.getByText(/Deep Focus/i)).toBeInTheDocument();
  });

  it('should display loading state initially', () => {
    render(<ProtocolSelector onSelect={mockOnSelect} />);
    expect(screen.getByText(/Loading protocols/i)).toBeInTheDocument();
  });

  it('should show protocol cards after loading', async () => {
    render(<ProtocolSelector onSelect={mockOnSelect} />);
    const protocolCard = await screen.findByText(/Deep Focus/i);
    expect(protocolCard).toBeInTheDocument();
  });

  it('should display Gateway Process tile', async () => {
    render(<ProtocolSelector onSelect={mockOnSelect} />);
    const gateway = await screen.findByText(/Gateway Process/i);
    expect(gateway).toBeInTheDocument();
  });

  it('should display protocol metadata', async () => {
    render(<ProtocolSelector onSelect={mockOnSelect} />);
    await screen.findByText(/Deep Focus/i);
    
    // Should show difficulty and duration
    expect(screen.getByText(/20 min/i)).toBeInTheDocument();
  });
});
