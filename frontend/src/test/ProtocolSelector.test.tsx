/**
 * ProtocolSelector Component Tests
 * Tests for protocol display, filtering, sorting, and selection
 */

import { describe, it, expect, vi, beforeEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import { ProtocolSelector } from '../components/ProtocolSelector';
import { apiClient } from '../services/apiClient';
import { useAuthStore } from '../store/authStore';

// Mock dependencies
vi.mock('../services/apiClient', () => ({
  apiClient: {
    getProtocols: vi.fn(),
  },
}));

vi.mock('../store/authStore', () => ({
  useAuthStore: vi.fn(),
}));

describe('ProtocolSelector Component', () => {
  const mockProtocols = [
    {
      id: 'protocol-1',
      name: 'Deep Focus',
      description: 'Enhanced concentration and mental clarity',
      category: 'focus',
      difficulty: 2,
      total_duration: 1500,
      safety_rating: 5,
      usage_count: 150,
      is_public: true,
      phases: [],
    },
    {
      id: 'protocol-2',
      name: 'Relaxation',
      description: 'Deep relaxation and stress relief',
      category: 'relaxation',
      difficulty: 1,
      total_duration: 1200,
      safety_rating: 5,
      usage_count: 200,
      is_public: true,
      phases: [],
    },
    {
      id: 'protocol-3',
      name: 'Power Nap',
      description: 'Quick energy restoration',
      category: 'sleep',
      difficulty: 1,
      total_duration: 600,
      safety_rating: 5,
      usage_count: 100,
      is_public: true,
      phases: [],
    },
  ];

  const mockOnSelect = vi.fn();
  const mockOnCancel = vi.fn();
  const mockOnOpenGateway = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();
    (useAuthStore as unknown as ReturnType<typeof vi.fn>).mockReturnValue({
      user: { id: 'user-1', email: 'test@example.com' },
    });
    vi.mocked(apiClient.getProtocols).mockResolvedValue({
      data: { protocols: mockProtocols },
      error: null,
    });
  });

  describe('Loading State', () => {
    it('should show loading indicator initially', () => {
      vi.mocked(apiClient.getProtocols).mockImplementation(
        () => new Promise(() => {}) // Never resolves
      );

      render(<ProtocolSelector onSelect={mockOnSelect} />);
      expect(screen.getByText(/loading|loading protocols/i)).toBeInTheDocument();
    });

    it('should hide loading indicator after protocols load', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.queryByText(/loading/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Protocol Display', () => {
    it('should display all loaded protocols', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText('Deep Focus')).toBeInTheDocument();
        expect(screen.getByText('Relaxation')).toBeInTheDocument();
        expect(screen.getByText('Power Nap')).toBeInTheDocument();
      });
    });

    it('should display protocol descriptions', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText(/Enhanced concentration/i)).toBeInTheDocument();
        expect(screen.getByText(/Deep relaxation/i)).toBeInTheDocument();
      });
    });

    it('should display difficulty levels', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText(/Easy|Beginner/i)).toBeInTheDocument();
        expect(screen.getByText(/Moderate/i)).toBeInTheDocument();
      });
    });

    it('should display duration information', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        // 1500 seconds = 25 minutes
        expect(screen.getByText(/25|min/i)).toBeInTheDocument();
        // 1200 seconds = 20 minutes
        expect(screen.getByText(/20|min/i)).toBeInTheDocument();
      });
    });

    it('should display safety ratings', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        const safetyElements = screen.getAllByText(/5|★★★★★/i);
        expect(safetyElements.length).toBeGreaterThan(0);
      });
    });

    it('should display usage count', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText(/150|used/i)).toBeInTheDocument();
        expect(screen.getByText(/200|used/i)).toBeInTheDocument();
      });
    });
  });

  describe('Category Filtering', () => {
    it('should show all categories filter by default', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        const allButton = screen.getByRole('button', { name: /all/i });
        expect(allButton).toBeInTheDocument();
      });
    });

    it('should filter protocols by category', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText('Deep Focus')).toBeInTheDocument();
      });

      const focusButton = screen.getByRole('button', { name: /focus/i });
      fireEvent.click(focusButton);

      expect(screen.getByText('Deep Focus')).toBeInTheDocument();
      expect(screen.queryByText('Relaxation')).not.toBeInTheDocument();
    });

    it('should show all protocols when "All" selected', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText('Deep Focus')).toBeInTheDocument();
      });

      // Filter to focus
      const focusButton = screen.getByRole('button', { name: /focus/i });
      fireEvent.click(focusButton);

      // Then back to all
      const allButton = screen.getByRole('button', { name: /all/i });
      fireEvent.click(allButton);

      expect(screen.getByText('Deep Focus')).toBeInTheDocument();
      expect(screen.getByText('Relaxation')).toBeInTheDocument();
    });

    it('should highlight selected category', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        const focusButton = screen.getByRole('button', { name: /focus/i });
        fireEvent.click(focusButton);

        expect(focusButton).toHaveClass(/active|selected/i);
      });
    });
  });

  describe('Sorting', () => {
    it('should sort by usage count by default', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        const protocolNames = screen.getAllByRole('heading', { level: 3 });
        // Relaxation (200) should be first
        expect(protocolNames[0]).toHaveTextContent('Relaxation');
      });
    });

    it('should sort by difficulty when selected', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText('Deep Focus')).toBeInTheDocument();
      });

      const sortButton = screen.getByRole('button', { name: /sort|difficulty/i });
      fireEvent.click(sortButton);

      const protocolNames = screen.getAllByRole('heading', { level: 3 });
      // Lower difficulty (1) should come first
      expect(protocolNames[0]).toHaveTextContent(/Relaxation|Power Nap/);
    });

    it('should sort by duration when selected', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText('Deep Focus')).toBeInTheDocument();
      });

      const sortButton = screen.getByRole('button', { name: /sort|duration/i });
      fireEvent.click(sortButton);

      const protocolNames = screen.getAllByRole('heading', { level: 3 });
      // Shortest duration (600) should be first
      expect(protocolNames[0]).toHaveTextContent('Power Nap');
    });
  });

  describe('Protocol Selection', () => {
    it('should call onSelect when protocol clicked', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText('Deep Focus')).toBeInTheDocument();
      });

      const protocolCard = screen.getByText('Deep Focus').closest('div');
      fireEvent.click(protocolCard!);

      expect(mockOnSelect).toHaveBeenCalledWith(
        expect.objectContaining({
          id: 'protocol-1',
          name: 'Deep Focus',
        })
      );
    });

    it('should highlight selected protocol', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText('Deep Focus')).toBeInTheDocument();
      });

      const protocolCard = screen.getByText('Deep Focus').closest('div');
      fireEvent.click(protocolCard!);

      expect(protocolCard).toHaveClass(/selected|active/i);
    });
  });

  describe('Gateway Protocol', () => {
    it('should display Gateway Process tile', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} onOpenGateway={mockOnOpenGateway} />);

      await waitFor(() => {
        expect(screen.getByText(/Gateway Process/i)).toBeInTheDocument();
      });
    });

    it('should call onOpenGateway when Gateway tile clicked', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} onOpenGateway={mockOnOpenGateway} />);

      await waitFor(() => {
        expect(screen.getByText(/Gateway Process/i)).toBeInTheDocument();
      });

      const gatewayCard = screen.getByText(/Gateway Process/i).closest('div');
      fireEvent.click(gatewayCard!);

      expect(mockOnOpenGateway).toHaveBeenCalled();
    });

    it('should show Gateway as admin-only', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} onOpenGateway={mockOnOpenGateway} />);

      await waitFor(() => {
        expect(screen.getByText(/admin|Admin-only/i)).toBeInTheDocument();
      });
    });

    it('should not show Gateway without onOpenGateway prop', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.queryByText(/Gateway Process/i)).not.toBeInTheDocument();
      });
    });
  });

  describe('Cancel Action', () => {
    it('should call onCancel when cancel button clicked', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} onCancel={mockOnCancel} />);

      await waitFor(() => {
        expect(screen.getByText('Deep Focus')).toBeInTheDocument();
      });

      const cancelButton = screen.getByRole('button', { name: /cancel|back/i });
      fireEvent.click(cancelButton);

      expect(mockOnCancel).toHaveBeenCalled();
    });

    it('should not show cancel button without onCancel prop', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.queryByRole('button', { name: /cancel|back/i })).not.toBeInTheDocument();
      });
    });
  });

  describe('Error Handling', () => {
    it('should display error message on API failure', async () => {
      vi.mocked(apiClient.getProtocols).mockResolvedValue({
        data: null,
        error: 'Failed to load protocols',
      });

      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to load protocols/i)).toBeInTheDocument();
      });
    });

    it('should handle network error gracefully', async () => {
      vi.mocked(apiClient.getProtocols).mockRejectedValue(new Error('Network error'));

      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText(/Failed to load protocols/i)).toBeInTheDocument();
      });
    });

    it('should show retry button on error', async () => {
      vi.mocked(apiClient.getProtocols).mockRejectedValue(new Error('Network error'));

      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry|try again/i })).toBeInTheDocument();
      });
    });

    it('should retry loading protocols when retry clicked', async () => {
      vi.mocked(apiClient.getProtocols).mockRejectedValueOnce(new Error('Network error'));
      vi.mocked(apiClient.getProtocols).mockResolvedValueOnce({
        data: { protocols: mockProtocols },
        error: null,
      });

      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByRole('button', { name: /retry/i })).toBeInTheDocument();
      });

      const retryButton = screen.getByRole('button', { name: /retry/i });
      fireEvent.click(retryButton);

      await waitFor(() => {
        expect(screen.getByText('Deep Focus')).toBeInTheDocument();
      });

      expect(apiClient.getProtocols).toHaveBeenCalledTimes(2);
    });
  });

  describe('Empty State', () => {
    it('should show empty message when no protocols available', async () => {
      vi.mocked(apiClient.getProtocols).mockResolvedValue({
        data: { protocols: [] },
        error: null,
      });

      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText(/no protocols|empty/i)).toBeInTheDocument();
      });
    });

    it('should show empty message for filtered category with no protocols', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        expect(screen.getByText('Deep Focus')).toBeInTheDocument();
      });

      // Filter to a category with no protocols
      const creativityButton = screen.getByRole('button', { name: /creativity/i });
      fireEvent.click(creativityButton);

      expect(screen.getByText(/no protocols|empty/i)).toBeInTheDocument();
    });
  });

  describe('Visual Feedback', () => {
    it('should show category color coding', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        const focusCard = screen.getByText('Deep Focus').closest('div');
        // Should have some color styling
        expect(focusCard).toHaveStyle({ borderColor: /#f59e0b|rgb\(245, 158, 11\)/i });
      });
    });

    it('should show hover effect on protocol cards', async () => {
      render(<ProtocolSelector onSelect={mockOnSelect} />);

      await waitFor(() => {
        const protocolCard = screen.getByText('Deep Focus').closest('div');
        fireEvent.mouseEnter(protocolCard!);
        
        expect(protocolCard).toHaveClass(/hover/i);
      });
    });
  });
});
