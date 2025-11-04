import { useState, useEffect, useRef, lazy, Suspense } from 'react';
// Lazy-load the heavy visualization to cut initial bundle size
const LazyNeuralVisualization = lazy(() =>
  import('./NeuralVisualization').then((m) => ({ default: m.NeuralVisualization }))
);
import { useSessionStore } from '../store/sessionStore';
import ErrorBoundary from './ErrorBoundary';
import { audioService } from '../services/audioService';
import { GATEWAY_PROTOCOLS, type GatewayPhase } from '../config/gatewayProtocols';
import '../styles/GatewaySession.css';

interface GatewaySessionProps {
  protocolId: string;
  onExit: () => void;
}

export default function GatewaySession({ protocolId, onExit }: GatewaySessionProps) {
  const protocol = GATEWAY_PROTOCOLS[protocolId];
  
  console.log('[GatewaySession] Component mounted with protocolId:', protocolId);
  console.log('[GatewaySession] Protocol loaded:', protocol ? protocol.name : 'NOT FOUND');
  
  const [isPlaying, setIsPlaying] = useState(false);
  const [startStatus, setStartStatus] = useState<'idle' | 'starting' | 'playing' | 'error'>('idle');
  const [currentPhaseIndex, setCurrentPhaseIndex] = useState(0);
  const [phaseProgress, setPhaseProgress] = useState(0);
  const [sessionTime, setSessionTime] = useState(0);
  const [showAffirmations, setShowAffirmations] = useState(true);
  const [emergencyStop, setEmergencyStop] = useState(false);
  
  const phaseTimerRef = useRef<number | null>(null);
  const sessionTimerRef = useRef<number | null>(null);

  const currentPhase = protocol?.phases[currentPhaseIndex];

  useEffect(() => {
    console.log('[GatewaySession] useEffect cleanup hook registered');
    // Cleanup on unmount
    return () => {
      console.log('[GatewaySession] Component unmounting, cleaning up...');
      handleStop();
    };
  }, []);

  // Best-effort audio unlock on first user interaction (helps Safari/Firefox)
  useEffect(() => {
    const unlock = async () => {
      try {
        await audioService.resume();
      } catch {
        // no-op: best-effort unlock
        console.debug('Audio unlock attempt failed (ignored).');
      }
    };
    const options: AddEventListenerOptions = { once: true, capture: true };
    window.addEventListener('pointerdown', unlock, options);
    window.addEventListener('keydown', unlock, options);
    return () => {
      window.removeEventListener('pointerdown', unlock, true);
      window.removeEventListener('keydown', unlock, true);
    };
  }, []);

  const handleStart = async () => {
    try {
      setStartStatus('starting');
      console.log('[GatewaySession] handleStart → initializing audio...');
      
      // Initialize audio engine and ensure context is resumed on user gesture
      const ok = await audioService.initialize();
      if (!ok) {
        throw new Error('Audio initialization returned false');
      }
      console.log('[GatewaySession] audio initialized successfully');
      
      await audioService.resume();
      console.log('[GatewaySession] audio context resumed');

      // Bring audio in gently so users hear immediate feedback
      audioService.fadeIn(2);
      console.log('[GatewaySession] fade in started');

      setIsPlaying(true);
      setStartStatus('playing');
      
      // Reflect session state in global store (for visualization, etc.)
      try { 
        useSessionStore.getState().startSession(); 
        console.log('[GatewaySession] session store updated');
      } catch (e) { 
        console.warn('[GatewaySession] Could not update session store:', e);
      }
      
      console.log('[GatewaySession] starting phase 0 of', protocol?.phases.length);
      startPhase(0);
      
      // Start session timer
      sessionTimerRef.current = window.setInterval(() => {
        setSessionTime(prev => prev + 1);
      }, 1000);
      
      console.log('[GatewaySession] Session started successfully');
    } catch (error) {
      console.error('[GatewaySession] Failed to start Gateway session:', error);
      setStartStatus('error');
      alert(
        'Failed to initialize audio system.\n\n' +
        'This usually happens if:\n' +
        '• Your browser blocked audio playback\n' +
        '• Headphones are not connected\n' +
        '• Audio permissions were denied\n\n' +
        'Please check your browser settings and try again.'
      );
    }
  };

  // Note: Auto-start removed to comply with browser autoplay policies.
  // Previously attempted to start audio automatically on component mount, but this:
  // 1. Violates browser autoplay policies (requires user gesture)
  // 2. Failed silently in most browsers, leaving UI in inconsistent state
  // 3. Made debugging difficult as errors were swallowed with `silent: true`
  // User must now explicitly click "Begin Gateway Session" button to start.

  const startPhase = (phaseIndex: number) => {
    if (!protocol) {
      console.error('[GatewaySession] Cannot start phase - no protocol loaded');
      return;
    }

    if (phaseIndex >= protocol.phases.length) {
      // Session complete
      console.log('[GatewaySession] All phases completed, finishing session');
      handleComplete();
      return;
    }

    const phase = protocol.phases[phaseIndex];
    console.log(`[GatewaySession] Starting phase ${phaseIndex + 1}/${protocol.phases.length}: ${phase.name}`);
    console.log(`[GatewaySession] Phase duration: ${phase.duration}s, beat: ${Array.isArray(phase.beatFreq) ? phase.beatFreq.join('-') : phase.beatFreq}Hz`);
    
    setCurrentPhaseIndex(phaseIndex);
    try { 
      useSessionStore.getState().setCurrentPhase(phaseIndex); 
      console.log('[GatewaySession] Updated session store phase');
    } catch (e) { 
      console.warn('[GatewaySession] Could not update session store phase:', e);
    }
    setPhaseProgress(0);

    // Configure audio for this phase
    console.log('[GatewaySession] Configuring audio for phase...');
    configureAudioForPhase(phase);
    console.log('[GatewaySession] Audio configured successfully');

    // Start phase timer
    const phaseStartTime = Date.now();
    const updateInterval = 100; // Update every 100ms

    phaseTimerRef.current = window.setInterval(() => {
      const elapsed = (Date.now() - phaseStartTime) / 1000;
      const progress = Math.min((elapsed / phase.duration) * 100, 100);
      
      setPhaseProgress(progress);

      // Handle frequency sweeps
      if (Array.isArray(phase.beatFreq)) {
        const [startFreq, endFreq] = phase.beatFreq;
        const currentFreq = startFreq + (endFreq - startFreq) * (elapsed / phase.duration);
        audioService.setBeatFrequency(currentFreq, 0.1, phase.carrierType);
      }

      // Phase complete
      if (elapsed >= phase.duration) {
        if (phaseTimerRef.current) {
          clearInterval(phaseTimerRef.current);
        }
        console.log(`[GatewaySession] Phase ${phaseIndex + 1} completed`);
        startPhase(phaseIndex + 1);
      }
    }, updateInterval);
  };

  const configureAudioForPhase = (phase: GatewayPhase) => {
    console.log('[GatewaySession] Configuring audio:', {
      beatFreq: phase.beatFreq,
      carrierType: phase.carrierType,
      preset: phase.preset,
      isochronic: phase.isochronic?.enabled,
      spatial: phase.spatial?.enabled,
      ambient: phase.ambient?.type
    });

    // Set beat frequency
    const beatFreq = Array.isArray(phase.beatFreq) ? phase.beatFreq[0] : phase.beatFreq;
    audioService.setBeatFrequency(beatFreq, 0.5, phase.carrierType);

    // Set audio preset
    audioService.setAudioPreset(phase.preset);

    // Configure isochronic pulse
    if (phase.isochronic?.enabled) {
      audioService.setIsochronicPulse(true, phase.isochronic.intensity);
    } else {
      audioService.setIsochronicPulse(false, 0);
    }

    // Configure spatial audio
    if (phase.spatial?.enabled) {
      // Animate spatial position based on pattern
      animateSpatialAudio(phase.spatial.pattern, phase.spatial.speed);
    } else {
      audioService.setSpatialPosition(0, 0.5); // Center
    }

    // Configure ambient noise
    if (phase.ambient) {
      audioService.startAmbientNoise(phase.ambient.type, phase.ambient.volume);
      
      if (phase.ambient.secondary) {
        // Layer secondary ambient
        setTimeout(() => {
          audioService.startAmbientNoise(
            phase.ambient!.secondary!, 
            phase.ambient!.secondaryVolume || 0.05
          );
        }, 1000);
      }
    }

    // Enhanced reverb for deeper states
    if (phase.reverb) {
      // Note: reverb control would need to be added to audioService
      console.log('[GatewaySession] Reverb requested:', phase.reverb, '(not yet implemented)');
    }
  };

  const animateSpatialAudio = (pattern: string, speed: number) => {
    const startTime = Date.now();
    const rotationPeriod = (60 / speed) * 1000; // Convert RPM to milliseconds

    const spatialInterval = setInterval(() => {
      if (!isPlaying) {
        clearInterval(spatialInterval);
        return;
      }

      const elapsed = Date.now() - startTime;
      const phase = (elapsed % rotationPeriod) / rotationPeriod;

      switch (pattern) {
        case 'circular':
          // Full circle: -1 (left) -> 0 (center) -> 1 (right) -> 0 -> -1
          audioService.setSpatialPosition(Math.sin(phase * Math.PI * 2), 0.1);
          break;
        case 'figure8':
          // Figure-8 pattern
          audioService.setSpatialPosition(
            Math.sin(phase * Math.PI * 2),
            0.1
          );
          break;
        case 'linear':
          // Left to right sweep
          audioService.setSpatialPosition(
            -1 + (phase * 2),
            0.5
          );
          break;
      }
    }, 100);

    return () => clearInterval(spatialInterval);
  };

  const handleStop = () => {
    console.log('[GatewaySession] Stopping session');
    setIsPlaying(false);
    setStartStatus('idle');
    try { 
      useSessionStore.getState().stopSession(); 
      console.log('[GatewaySession] Session store updated (stopped)');
    } catch (e) { 
      console.warn('[GatewaySession] Could not update session store:', e);
    }
    
    if (phaseTimerRef.current) {
      clearInterval(phaseTimerRef.current);
      phaseTimerRef.current = null;
    }
    
    if (sessionTimerRef.current) {
      clearInterval(sessionTimerRef.current);
      sessionTimerRef.current = null;
    }

    // Stop ambient noise and fade out audio
    console.log('[GatewaySession] Fading out audio...');
    audioService.fadeOut(2);
    
    setTimeout(() => {
      console.log('[GatewaySession] Destroying audio service');
      audioService.destroy();
    }, 2000);
  };

  const handleEmergencyStop = () => {
    console.log('[GatewaySession] EMERGENCY STOP activated');
    setEmergencyStop(true);
    handleStop();
    try { 
      useSessionStore.getState().emergencyStop(); 
    } catch (e) { 
      console.warn('[GatewaySession] Could not trigger emergency stop in store:', e);
    }
  };

  const handleComplete = () => {
    console.log('[GatewaySession] Session completed successfully');
    handleStop();
    try { 
      useSessionStore.getState().stopSession(); 
    } catch (e) { 
      console.warn('[GatewaySession] Could not update session store:', e);
    }
    
    // Show completion message
    setTimeout(() => {
      const response = confirm(
        `✅ Gateway Session Complete!\n\n` +
        `Focus ${protocol.focusLevel}: ${protocol.name}\n` +
        `Duration: ${formatTime(sessionTime)}\n\n` +
        `Take time to integrate your experience.\n\n` +
        `Would you like to journal your experience?`
      );
      
      if (response) {
        // TODO: Open journal modal
        console.log('Opening journal...');
      }
      
      onExit();
    }, 1000);
  };

  const formatTime = (seconds: number): string => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  if (!protocol || !currentPhase) {
    return (
      <div className="gateway-session-error">
        <h2>Protocol not found</h2>
        <button onClick={onExit}>Return to Gateway</button>
      </div>
    );
  }

  return (
    <div className="gateway-session">
      {/* Emergency overlay */}
      {emergencyStop && (
        <div className="emergency-overlay" onClick={() => setEmergencyStop(false)}>
          <div className="emergency-message" onClick={(e) => e.stopPropagation()}>
            <h1>🔴 EMERGENCY STOP</h1>
            <p className="grounding-affirmation">
              "I return to physical awareness NOW"
            </p>
            <p>Take deep breaths. You are safe.</p>
            <div className="emergency-actions">
              <button onClick={onExit} className="btn-exit-emergency">
                Exit Gateway
              </button>
              <button onClick={() => setEmergencyStop(false)} className="btn-clear-message">
                Clear Message
              </button>
            </div>
          </div>
        </div>
      )}

      {/* Header */}
      <header className="gateway-session-header">
        <div className="session-info">
          <h1 className="focus-level">Focus {protocol.focusLevel}</h1>
          <p className="protocol-name">{protocol.name}</p>
        </div>
        <div className="session-time">{formatTime(sessionTime)}</div>
      </header>

      {/* Visualization */}
  <div className="visualization-container" style={{ position: 'relative' }}>
        <ErrorBoundary>
          <Suspense fallback={<div style={{display:'flex',alignItems:'center',justifyContent:'center',height:'100%',color:'#94a3b8'}}>Loading visualization…</div>}>
            <LazyNeuralVisualization />
          </Suspense>
        </ErrorBoundary>

        {/* HUD moved into Canvas via drei Html */}
      </div>

      {/* Phase Info */}
      <div className="phase-info">
        <div className="phase-header">
          <span className="phase-name">{currentPhase.name}</span>
          <span className="phase-number">
            Phase {currentPhaseIndex + 1} of {protocol.phases.length}
          </span>
        </div>
        <div className="phase-progress-bar">
          <div 
            className="phase-progress-fill" 
            style={{ width: `${phaseProgress}%` }}
          />
        </div>
        <div className="phase-details">
          <span>
            {Array.isArray(currentPhase.beatFreq)
              ? `${currentPhase.beatFreq[0]}-${currentPhase.beatFreq[1]} Hz`
              : `${currentPhase.beatFreq} Hz`}
          </span>
          <span>{currentPhase.preset}</span>
          <span>{currentPhase.carrierType}</span>
        </div>
      </div>

      {/* Affirmations */}
      {showAffirmations && (
        <div className="affirmations-panel">
          <div className="affirmations-header">
            <h3>Affirmations</h3>
            <button 
              onClick={() => setShowAffirmations(false)}
              className="btn-close-affirmations"
            >
              ✕
            </button>
          </div>
          <ul className="affirmations-list">
            {protocol.affirmations.map((affirmation, i) => (
              <li key={i} className="affirmation-item">
                "{affirmation}"
              </li>
            ))}
          </ul>
        </div>
      )}

      {/* Controls */}
      <div className="session-controls">
        {!isPlaying ? (
          <button 
            onClick={handleStart} 
            className="btn-start" 
            disabled={startStatus === 'starting'}
          >
            {startStatus === 'starting' ? 'Starting…' : 
             startStatus === 'error' ? '⚠️ Retry Start Session' :
             'Begin Gateway Session'}
          </button>
        ) : (
          <>
            <button onClick={handleStop} className="btn-pause">
              Pause Session
            </button>
            <button onClick={handleEmergencyStop} className="btn-emergency">
              🔴 EMERGENCY STOP
            </button>
          </>
        )}
        
        {!isPlaying && (
          <button onClick={onExit} className="btn-back">
            ← Back to Gateway
          </button>
        )}
        
        {!showAffirmations && (
          <button 
            onClick={() => setShowAffirmations(true)}
            className="btn-show-affirmations"
          >
            Show Affirmations
          </button>
        )}
      </div>

      {/* Minimal runtime status for troubleshooting */}
      <div style={{ position: 'fixed', bottom: '9.5rem', right: '1rem', color: '#94a3b8', fontSize: 12, opacity: 0.8 }}>
        Status: {startStatus} · Phase {currentPhaseIndex + 1}/{protocol.phases.length} · {formatTime(sessionTime)}
      </div>

      {/* Safety reminder */}
      <div className="safety-reminder">
        <p>
          💡 <strong>Tip:</strong> Use the grounding affirmation "I return to physical awareness NOW" 
          if you feel uncomfortable at any time.
        </p>
      </div>
    </div>
  );
}

  
