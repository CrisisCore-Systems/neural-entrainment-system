/**
 * Protocol Selector Component
 * Displays available neural entrainment protocols from backend
 */

import { useEffect, useState } from 'react';
import { apiClient } from '../services/apiClient';
import { useAuthStore } from '../store/authStore';
import './ProtocolSelector.css';

interface Protocol {
  id: string;
  name: string;
  description: string;
  category: string;
  difficulty: number;
  total_duration: number;
  safety_rating: number;
  usage_count: number;
  is_public: boolean;
  phases: Array<{
    name: string;
    description: string;
    duration: number;
    startFrequency: number;
    endFrequency: number;
    intensity: number;
    color: string;
  }>;
}

interface ProtocolSelectorProps {
  onSelect: (protocol: Protocol) => void;
  onCancel?: () => void;
  onOpenGateway?: () => void;
}

const categoryColors: Record<string, string> = {
  balanced: '#667eea',
  focus: '#f59e0b',
  relaxation: '#10b981',
  sleep: '#6366f1',
  creativity: '#ec4899',
  meditation: '#8b5cf6',
  energy: '#ef4444',
  study: '#3b82f6',
  rest: '#14b8a6',
  stress: '#06b6d4',
  // Special category for the Gateway Process tile
  gateway: '#7c3aed',
};

const difficultyLabels = ['Beginner', 'Easy', 'Moderate', 'Advanced', 'Expert'];

export function ProtocolSelector({ onSelect, onCancel, onOpenGateway }: ProtocolSelectorProps) {
  const [protocols, setProtocols] = useState<Protocol[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [selectedCategory, setSelectedCategory] = useState<string>('all');
  const [sortBy, setSortBy] = useState<'usage' | 'difficulty' | 'duration'>('usage');
  const { user } = useAuthStore();

  useEffect(() => {
    loadProtocols();
  }, []);

  const loadProtocols = async () => {
    try {
      setLoading(true);
      setError(null);
      const response = await apiClient.getProtocols();
      
      if (response.error) {
        setError(response.error);
      } else if (response.data) {
        setProtocols(response.data.protocols || []);
      }
    } catch (err) {
      setError('Failed to load protocols');
      console.error('Protocol loading error:', err);
    } finally {
      setLoading(false);
    }
  };

  // Inject a synthetic Gateway protocol so it renders exactly like others
  const gatewaySynthetic: Protocol = {
    id: 'gateway',
    name: 'Gateway Process',
    description:
      'Admin-only Monroe Focus levels (10/12/15/21/27) with safety-first controls and real-time audio/visual sync.',
    category: 'gateway',
    difficulty: 4,
    total_duration: 30 * 60, // representative duration
    safety_rating: 5,
    usage_count: 0,
    is_public: false,
    phases: [
      { name: 'Neural Calibration', description: 'Baseline establishment', duration: 150, startFrequency: 10, endFrequency: 10, intensity: 0.5, color: '#7c3aed' },
      { name: 'Resonance Field', description: 'Sync initiation', duration: 240, startFrequency: 12, endFrequency: 12, intensity: 0.6, color: '#06b6d4' },
      { name: 'Depth Descent', description: 'Progressive deepening', duration: 360, startFrequency: 10, endFrequency: 4, intensity: 0.7, color: '#0ea5e9' },
      { name: 'Integration Matrix', description: 'Pattern reorganization', duration: 300, startFrequency: 7, endFrequency: 7, intensity: 0.6, color: '#22d3ee' },
      { name: 'Peak Coherence', description: 'Max synchronization', duration: 240, startFrequency: 12, endFrequency: 12, intensity: 0.8, color: '#f59e0b' },
      { name: 'Return Integration', description: 'Gentle return', duration: 240, startFrequency: 8, endFrequency: 10, intensity: 0.4, color: '#60a5fa' },
    ],
  };

  const protocolsWithGateway = [gatewaySynthetic, ...protocols];

  const categories = ['all', ...new Set(protocolsWithGateway.map(p => p.category))];

  const filteredProtocols = protocolsWithGateway
    .filter(p => selectedCategory === 'all' || p.category === selectedCategory)
    .sort((a, b) => {
      switch (sortBy) {
        case 'usage':
          return b.usage_count - a.usage_count;
        case 'difficulty':
          return a.difficulty - b.difficulty;
        case 'duration':
          return a.total_duration - b.total_duration;
        default:
          return 0;
      }
    });

  const formatDuration = (seconds: number) => {
    const minutes = Math.floor(seconds / 60);
    return `${minutes} min`;
  };

  // Determine Gateway access (accept snake_case or camelCase)
  const gatewayAccess = Boolean(
    (user && typeof (user as unknown as Record<string, unknown>)['gateway_access'] === 'boolean'
      ? (user as unknown as Record<string, unknown>)['gateway_access']
      : undefined) || user?.gatewayAccess
  );

  if (loading) {
    return (
      <div className="protocol-selector">
        <div className="loading-state">
          <div className="spinner"></div>
          <p>Loading protocols...</p>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="protocol-selector">
        <div className="error-state">
          <p className="error-message">{error}</p>
          <button onClick={loadProtocols} className="retry-button">
            Retry
          </button>
          {onCancel && (
            <button onClick={onCancel} className="cancel-button">
              Cancel
            </button>
          )}
        </div>
      </div>
    );
  }

  return (
    <div className="protocol-selector">
      <div className="selector-header">
        <h2>Choose Your Protocol</h2>
        <p className="subtitle">Select a neural entrainment protocol tailored to your goals</p>
      </div>

      <div className="controls">
        <div className="category-filters">
          {categories.map(category => (
            <button
              key={category}
              className={`category-button ${selectedCategory === category ? 'active' : ''}`}
              style={{
                borderColor: category !== 'all' ? categoryColors[category] : undefined,
                backgroundColor: selectedCategory === category && category !== 'all' 
                  ? categoryColors[category] 
                  : undefined,
              }}
              onClick={() => setSelectedCategory(category)}
            >
              {category.charAt(0).toUpperCase() + category.slice(1)}
            </button>
          ))}
        </div>

        <div className="sort-controls">
          <label>Sort by:</label>
          <select value={sortBy} onChange={(e) => setSortBy(e.target.value as 'usage' | 'difficulty' | 'duration')}>
            <option value="usage">Most Popular</option>
            <option value="difficulty">Difficulty</option>
            <option value="duration">Duration</option>
          </select>
        </div>
      </div>

      <div className="protocols-grid">
        {filteredProtocols.map(protocol => {
          const isGateway = protocol.id === 'gateway';
          const disabled = isGateway && !gatewayAccess;
          const handleClick = () => {
            if (isGateway) {
              if (gatewayAccess && onOpenGateway) onOpenGateway();
              return;
            }
            onSelect(protocol);
          };

          return (
            <div
              key={protocol.id}
              className={`protocol-card ${isGateway ? 'gateway' : ''} ${disabled ? 'disabled' : ''}`}
              onClick={disabled ? undefined : handleClick}
              role={isGateway ? 'button' : undefined}
              aria-disabled={disabled || undefined}
              title={isGateway ? (gatewayAccess ? 'Open Gateway Dashboard' : 'Admin-only · Request access from your administrator') : undefined}
            >
            <div className="card-header">
              <div
                className="category-badge"
                style={{ backgroundColor: categoryColors[protocol.category] }}
              >
                {isGateway ? 'Gateway' : protocol.category}
              </div>
              <div className="difficulty-stars">
                {Array.from({ length: 5 }, (_, i) => (
                  <span
                    key={i}
                    className={i < protocol.difficulty ? 'star filled' : 'star'}
                  >
                    ★
                  </span>
                ))}
              </div>
            </div>
            <h3 className="protocol-name">{protocol.name}</h3>
            <p className="protocol-description">{protocol.description}</p>

            <div className="protocol-stats">
              <div className="stat">
                <span className="stat-label">Duration</span>
                <span className="stat-value">{formatDuration(protocol.total_duration)}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Difficulty</span>
                <span className="stat-value">{difficultyLabels[protocol.difficulty - 1]}</span>
              </div>
              <div className="stat">
                <span className="stat-label">Safety</span>
                <span className="stat-value">{protocol.safety_rating}/5</span>
              </div>
            </div>

            <div className="protocol-phases">
              <span className="phases-label">
                {protocol.phases?.length || 0} Phases
              </span>
              <div className="phase-dots">
                {protocol.phases?.map((_, i) => (
                  <div key={i} className="phase-dot"></div>
                ))}
              </div>
            </div>

            <div className="usage-count">
              {protocol.usage_count > 0 && (
                <span>🔥 {protocol.usage_count.toLocaleString()} sessions</span>
              )}
            </div>

            {isGateway && !gatewayAccess && (
              <div className="gateway-lock-ribbon">🔒 Admin Only</div>
            )}
          </div>
          );
        })}
      </div>

      {filteredProtocols.length === 0 && (
        <div className="empty-state">
          <p>No protocols found for this category</p>
        </div>
      )}

      {onCancel && (
        <div className="selector-footer">
          <button onClick={onCancel} className="back-button">
            ← Back
          </button>
        </div>
      )}
    </div>
  );
}
