/**
 * Session Control Panel - Main UI for session management
 */

import { useState, useEffect } from 'react';
import { useSessionStore } from '../store/sessionStore';
import { audioService } from '../services/audioService';
import { sessionManager } from '../services/sessionManager';
import { NeuralVisualization } from './NeuralVisualization';
import { PhaseLegend } from './PhaseLegend';
import './SessionControl.css';
import './NeuralVisualization.css';

interface Protocol {
  id: string;
  name: string;
  description: string;
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

interface SessionControlProps {
  protocol?: Protocol;
  onBack?: () => void;
}

export const SessionControl: React.FC<SessionControlProps> = ({ protocol, onBack }) => {
  const {
    sessionActive,
    sessionPaused,
    currentPhase,
    phases,
    audioEnabled,
    visualEnabled,
    metrics,
    initializeSession,
    toggleAudio,
    toggleVisual
  } = useSessionStore();

  const [audioInitialized, setAudioInitialized] = useState(false);
  const [currentBeatFreq, setCurrentBeatFreq] = useState(0);

  const currentPhaseData = phases[currentPhase];

  // Initialize with protocol data when provided
  useEffect(() => {
    if (protocol && !sessionActive) {
      // Convert protocol phases to session store format
      const glyphs = ['◉', '◈', '◐', '◬', '◉', '◎'];
      
      const totalDuration = protocol.phases.reduce((sum, p) => sum + p.duration, 0);
      
      const convertedPhases = protocol.phases.map((p, i) => {
        // Use average frequency for brainwave classification
        const avgFreq = (p.startFrequency + p.endFrequency) / 2;
        
        return {
          name: p.name,
          glyph: glyphs[i % glyphs.length],
          description: p.description,
          duration: p.duration / totalDuration, // Convert to fraction
          beatFreq: p.startFrequency === p.endFrequency 
            ? p.startFrequency 
            : [p.startFrequency, p.endFrequency] as [number, number],
          color: p.color,
          targetBrainwave: (avgFreq >= 13 ? 'beta' : 
                           avgFreq >= 8 ? 'alpha' : 
                           avgFreq >= 4 ? 'theta' : 'delta') as 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma',
        };
      });
      
      // Update session store with protocol phases
      useSessionStore.setState({ phases: convertedPhases });
    }
  }, [protocol, sessionActive]);

  // Initialize audio system
  const handleInitialize = async () => {
    const success = await audioService.initialize();
    setAudioInitialized(success);
    if (success) {
      initializeSession();
    }
  };

  // Start session
  const handleStart = async () => {
    if (!audioInitialized) {
      await handleInitialize();
    }
    
    // Set protocol ID in session manager if available
    if (protocol?.id) {
      sessionManager.setProtocolId(protocol.id);
    }
    
    // Start the session (this sets sessionActive to true)
    const store = useSessionStore.getState();
    store.startSession();
    
    // Then run the session manager
    sessionManager.runSession();
  };

  // Pause/Resume
  const handlePauseResume = () => {
    if (sessionPaused) {
      sessionManager.resumeSession();
    } else {
      sessionManager.pauseSession();
    }
  };

  // Stop session
  const handleStop = () => {
    sessionManager.stopSession();
  };

  // Emergency stop
  const handleEmergencyStop = () => {
    if (confirm('Emergency stop will immediately terminate the session. Continue?')) {
      sessionManager.emergencyStop();
    }
  };

  // Update beat frequency display
  useEffect(() => {
    const interval = setInterval(() => {
      if (audioService.isReady()) {
        setCurrentBeatFreq(audioService.getCurrentBeatFrequency());
      }
    }, 200);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="session-control">
      <div className="control-header">
        {onBack && !sessionActive && (
          <button className="back-button" onClick={onBack}>
            ← Back to Protocols
          </button>
        )}
        <h2>CrisisCore Neural Interface</h2>
        {protocol && (
          <div className="protocol-info">
            <span className="protocol-name">{protocol.name}</span>
            <span className="protocol-description">{protocol.description}</span>
          </div>
        )}
        {!protocol && <p className="subtitle">Neural Entrainment Session Control</p>}
      </div>

      {/* Neural Visualization */}
      <NeuralVisualization />

      {/* Current Phase Display */}
      {sessionActive && currentPhaseData && (
        <div className="phase-display" style={{ '--phase-color': currentPhaseData.color } as React.CSSProperties}>
          <div className="phase-glyph">{currentPhaseData.glyph}</div>
          <div className="phase-info">
            <h3>{currentPhaseData.name}</h3>
            <p>{currentPhaseData.description}</p>
            <div className="phase-meta">
              Phase {currentPhase + 1} of {phases.length}
            </div>
          </div>
        </div>
      )}

      {/* Metrics Display */}
      {sessionActive && (
        <div className="metrics-display">
          <div className="metric">
            <span className="metric-label">Coherence</span>
            <div className="metric-bar">
              <div className="metric-fill" style={{ width: `${metrics.coherence * 100}%` }} />
            </div>
            <span className="metric-value">{(metrics.coherence * 100).toFixed(0)}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Focus</span>
            <div className="metric-bar">
              <div className="metric-fill" style={{ width: `${metrics.focus * 100}%` }} />
            </div>
            <span className="metric-value">{(metrics.focus * 100).toFixed(0)}%</span>
          </div>
          <div className="metric">
            <span className="metric-label">Beat Frequency</span>
            <span className="metric-value">{currentBeatFreq.toFixed(2)} Hz</span>
          </div>
        </div>
      )}

      {/* Control Buttons */}
      <div className="control-buttons">
        {!sessionActive && (
          <>
            {!audioInitialized && (
              <button className="btn btn-primary" onClick={handleInitialize}>
                Initialize Audio System
              </button>
            )}
            <button 
              className="btn btn-success" 
              onClick={handleStart}
              disabled={!audioInitialized && !audioEnabled}
            >
              Start Session
            </button>
          </>
        )}

        {sessionActive && (
          <>
            <button className="btn btn-warning" onClick={handlePauseResume}>
              {sessionPaused ? 'Resume' : 'Pause'}
            </button>
            <button className="btn btn-secondary" onClick={handleStop}>
              Stop Session
            </button>
            <button className="btn btn-danger" onClick={handleEmergencyStop}>
              🚨 Emergency Stop
            </button>
          </>
        )}
      </div>

      {/* Audio Toggle */}
      <div className="control-options">
        <label className="toggle">
          <input 
            type="checkbox" 
            checked={audioEnabled} 
            onChange={toggleAudio}
            disabled={sessionActive}
          />
          <span>Audio Enabled</span>
        </label>
        <label className="toggle">
          <input 
            type="checkbox" 
            checked={visualEnabled} 
            onChange={toggleVisual}
            disabled={sessionActive}
          />
          <span>Visual Entrainment</span>
        </label>
      </div>

      {/* Status */}
      <div className="status-bar">
        <span className={`status-indicator ${audioInitialized ? 'active' : 'inactive'}`}>
          Audio: {audioInitialized ? 'Ready' : 'Not Initialized'}
        </span>
        <span className={`status-indicator ${sessionActive ? 'active' : 'inactive'}`}>
          Session: {sessionActive ? (sessionPaused ? 'Paused' : 'Active') : 'Inactive'}
        </span>
      </div>

      {/* Phase Legend */}
      {!sessionActive && <PhaseLegend />}
    </div>
  );
};
