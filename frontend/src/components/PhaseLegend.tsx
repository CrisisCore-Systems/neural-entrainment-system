/**
 * Phase Legend - Shows what each visualization represents
 */

import './PhaseLegend.css';

export const PhaseLegend: React.FC = () => {
  const phases = [
    {
      number: 1,
      name: 'Neural Calibration',
      visual: 'Baseline Spiral',
      description: 'Gentle spiral establishing your baseline state',
      color: '#3366ff'
    },
    {
      number: 2,
      name: 'Resonance Field',
      visual: 'Expanding Rings',
      description: 'Concentric rings building resonance patterns',
      color: '#00cc99'
    },
    {
      number: 3,
      name: 'Depth Descent',
      visual: 'Tunnel Vortex',
      description: 'Rotating tunnel guiding you deeper',
      color: '#9933ff'
    },
    {
      number: 4,
      name: 'Integration Matrix',
      visual: 'Geometric Grid',
      description: 'Dynamic 3D grid reorganizing patterns',
      color: '#ff6600'
    },
    {
      number: 5,
      name: 'Peak Coherence',
      visual: 'Sacred Mandala',
      description: 'Symmetrical mandala at maximum synchronization',
      color: '#20d48a'
    },
    {
      number: 6,
      name: 'Return Integration',
      visual: 'Gentle Waves',
      description: 'Rippling wave field bringing you back',
      color: '#3366ff'
    }
  ];

  return (
    <div className="phase-legend">
      <h3>Visualization Phases</h3>
      <div className="legend-grid">
        {phases.map((phase) => (
          <div key={phase.number} className="legend-item">
            <div className="legend-number" style={{ borderColor: phase.color }}>
              {phase.number}
            </div>
            <div className="legend-content">
              <div className="legend-name" style={{ color: phase.color }}>
                {phase.name}
              </div>
              <div className="legend-visual">{phase.visual}</div>
              <div className="legend-description">{phase.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};
