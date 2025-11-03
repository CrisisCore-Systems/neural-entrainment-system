/**
 * Session Manager - Orchestrates six-phase neural entrainment sessions
 * Handles phase transitions, safety protocols, and audio/visual sync
 */

import { audioService } from './audioService';
import { sessionHistoryService } from './sessionHistoryService';
import { apiClient } from './apiClient';
import { useSessionStore } from '../store/sessionStore';
import { eventBus, EVENTS } from '../utils/eventBus';
import type { PhaseConfig, CognitiveMetrics } from '../types/session';
import type { SessionRecord } from '../types/history';

class SessionManager {
  private phaseInterval: number | null = null;
  private metricsInterval: number | null = null;
  private phaseStartTime: number = 0;
  private sessionStartTime: number = 0;
  private metricsHistory: CognitiveMetrics[] = [];
  private backendSessionId: string | null = null;
  private currentProtocolId: string | null = null;

  /**
   * Set the protocol ID for the current session
   */
  setProtocolId(protocolId: string): void {
    this.currentProtocolId = protocolId;
  }

  /**
   * Run complete session with all phases
   */
  async runSession(): Promise<void> {
    const store = useSessionStore.getState();
    
    if (!store.sessionActive) {
      console.warn('[SessionManager] Cannot run session - not active');
      return;
    }

    console.log('[SessionManager] Starting session with', store.phases.length, 'phases');

    // Reset tracking
    this.sessionStartTime = Date.now();
    this.metricsHistory = [];
    this.backendSessionId = null;

    // Create session in backend
    if (this.currentProtocolId) {
      try {
        const response = await apiClient.createSession(this.currentProtocolId);
        if (response.data?.session) {
          this.backendSessionId = response.data.session.id;
          console.log('[SessionManager] Backend session created:', this.backendSessionId);
        }
      } catch (error) {
        console.error('[SessionManager] Failed to create backend session:', error);
        // Continue anyway - save to localStorage as fallback
      }
    }

    // Resume audio context if needed (browser requirement)
    await audioService.resume();

    // Fade in audio
    if (store.audioEnabled) {
      audioService.fadeIn(2);
    }

    // Run each phase sequentially
    for (let phaseIndex = 0; phaseIndex < store.phases.length; phaseIndex++) {
      const currentState = useSessionStore.getState();
      
      // Check if session was stopped
      if (!currentState.sessionActive) {
        console.log('[SessionManager] Session stopped by user');
        break;
      }

      // Update current phase
      currentState.setCurrentPhase(phaseIndex);

      // Run phase
      await this.runPhase(store.phases[phaseIndex], phaseIndex);
    }

    // Complete session
    const finalState = useSessionStore.getState();
    if (finalState.sessionActive) {
      this.completeSession();
    }
  }

  /**
   * Run a single phase
   */
  private async runPhase(phase: PhaseConfig, phaseIndex: number): Promise<void> {
    return new Promise((resolve) => {
      const store = useSessionStore.getState();
      const phaseDurationMs = phase.duration * store.sessionDuration * 1000;

      console.log(`[SessionManager] Phase ${phaseIndex + 1}: ${phase.name} (${(phaseDurationMs / 1000).toFixed(0)}s)`);

      this.phaseStartTime = Date.now();
      let lastProgress = 0;

      // Update phase progress and audio/visual
      const updatePhase = () => {
        const currentStore = useSessionStore.getState();

        // Check if paused
        if (currentStore.sessionPaused) {
          return;
        }

        // Check if stopped
        if (!currentStore.sessionActive) {
          this.cleanup();
          resolve();
          return;
        }

        const elapsed = Date.now() - this.phaseStartTime;
        const progress = Math.min(elapsed / phaseDurationMs, 1);

        // Update beat frequency based on phase config
        this.updateBeatFrequency(phase, progress);

        // Simulate cognitive metrics (replace with real biometric data later)
        if (progress - lastProgress > 0.1) {
          this.updateCognitiveMetrics(phaseIndex, progress);
          lastProgress = progress;
        }

        // Phase complete
        if (progress >= 1) {
          console.log(`[SessionManager] Phase ${phaseIndex + 1} completed`);
          this.cleanup();
          resolve();
        }
      };

      // Update every 100ms for smooth transitions
      this.phaseInterval = window.setInterval(updatePhase, 100);
    });
  }

  /**
   * Update binaural beat frequency based on phase progress
   * Uses protocol-specific carrier frequencies for optimal entrainment
   */
  private updateBeatFrequency(phase: PhaseConfig, progress: number): void {
    let beatFreq: number;

    if (Array.isArray(phase.beatFreq)) {
      // Linear sweep from start to end frequency
      const [startFreq, endFreq] = phase.beatFreq;
      beatFreq = startFreq + (endFreq - startFreq) * progress;
    } else {
      // Fixed frequency
      beatFreq = phase.beatFreq;
    }

    // Determine carrier frequency based on beat frequency range
    let carrierType: 'delta' | 'theta' | 'alpha' | 'beta' | 'gamma' = 'alpha';
    
    if (beatFreq < 4) {
      carrierType = 'delta'; // 0.5-4 Hz: Deep sleep, healing
    } else if (beatFreq < 8) {
      carrierType = 'theta'; // 4-8 Hz: Meditation, creativity
    } else if (beatFreq < 14) {
      carrierType = 'alpha'; // 8-14 Hz: Relaxation, light focus
    } else if (beatFreq < 30) {
      carrierType = 'beta'; // 14-30 Hz: Active focus, alertness
    } else {
      carrierType = 'gamma'; // 30+ Hz: Peak cognition, insight
    }

    // Update audio service with advanced parameters
    const store = useSessionStore.getState();
    if (store.audioEnabled) {
      audioService.setBeatFrequency(beatFreq, 0.2, carrierType);
    }
  }

  /**
   * Update cognitive metrics (simulated for now)
   */
  private updateCognitiveMetrics(phaseIndex: number, progress: number): void {
    // Phase-specific metric patterns (from prototype)
    const phaseMetrics: CognitiveMetrics[] = [
      { load: 0.3, focus: 0.4, coherence: 0.6, arousal: 0.3, valence: 0.7 }, // Calibration
      { load: 0.4, focus: 0.6, coherence: 0.7, arousal: 0.4, valence: 0.75 }, // Resonance
      { load: 0.5, focus: 0.7, coherence: 0.8, arousal: 0.3, valence: 0.8 }, // Descent
      { load: 0.6, focus: 0.8, coherence: 0.9, arousal: 0.2, valence: 0.85 }, // Integration
      { load: 0.7, focus: 0.9, coherence: 0.95, arousal: 0.2, valence: 0.9 }, // Peak
      { load: 0.5, focus: 0.7, coherence: 0.8, arousal: 0.4, valence: 0.8 }  // Return
    ];

    const baseMetrics = phaseMetrics[phaseIndex] || phaseMetrics[0];

    // Add some variation based on progress
    const metrics: CognitiveMetrics = {
      coherence: baseMetrics.coherence + Math.sin(progress * Math.PI) * 0.1,
      focus: baseMetrics.focus + Math.sin(progress * Math.PI * 2) * 0.05,
      arousal: baseMetrics.arousal + Math.cos(progress * Math.PI) * 0.05,
      load: baseMetrics.load,
      valence: baseMetrics.valence
    };

    useSessionStore.getState().updateMetrics(metrics);
    this.metricsHistory.push(metrics);
  }

  /**
   * Complete session successfully
   */
  private completeSession(): void {
    console.log('[SessionManager] Session completed successfully');

    // Save session to history
    this.saveSessionRecord(true);

    // Emit event for analytics refresh
    eventBus.emit(EVENTS.SESSION_COMPLETED);

    // Fade out audio
    audioService.fadeOut(3);

    // Stop session after fade out
    setTimeout(() => {
      useSessionStore.getState().stopSession();
      this.cleanup();
    }, 3000);
  }

  /**
   * Save session record to history
   */
  private async saveSessionRecord(completed: boolean): Promise<void> {
    const store = useSessionStore.getState();
    const sessionDuration = (Date.now() - this.sessionStartTime) / 1000; // seconds
    
    // Calculate average metrics
    const avgMetrics: CognitiveMetrics = this.metricsHistory.length > 0
      ? {
          coherence: this.metricsHistory.reduce((sum, m) => sum + m.coherence, 0) / this.metricsHistory.length,
          focus: this.metricsHistory.reduce((sum, m) => sum + m.focus, 0) / this.metricsHistory.length,
          arousal: this.metricsHistory.reduce((sum, m) => sum + m.arousal, 0) / this.metricsHistory.length,
          load: this.metricsHistory.reduce((sum, m) => sum + m.load, 0) / this.metricsHistory.length,
          valence: this.metricsHistory.reduce((sum, m) => sum + m.valence, 0) / this.metricsHistory.length
        }
      : store.metrics;

    const record: SessionRecord = {
      id: `session-${Date.now()}`,
      protocolId: store.protocol?.id || 'default',
      protocolName: store.protocol?.name || 'Unknown Protocol',
      startTime: this.sessionStartTime,
      endTime: Date.now(),
      duration: sessionDuration,
      completed,
      phasesCompleted: store.currentPhase + (completed ? 1 : 0),
      totalPhases: store.phases.length,
      finalMetrics: store.metrics,
      averageMetrics: avgMetrics
    };

    // Save to localStorage as fallback
    sessionHistoryService.saveSession(record);
    console.log('[SessionManager] Session saved to localStorage');

    // Update backend session if we have a session ID
    if (this.backendSessionId) {
      try {
        await apiClient.updateSession(this.backendSessionId, {
          status: completed ? 'completed' : 'stopped',
          end_time: new Date().toISOString(),
          real_time_metrics: {
            coherence_avg: avgMetrics.coherence,
            focus_avg: avgMetrics.focus,
            arousal_avg: avgMetrics.arousal,
            load_avg: avgMetrics.load,
            valence_avg: avgMetrics.valence,
          },
        });
        console.log('[SessionManager] Session saved to backend:', this.backendSessionId);
      } catch (error) {
        console.error('[SessionManager] Failed to update backend session:', error);
        // Already saved to localStorage, so continue
      }
    }
  }

  /**
   * Stop session immediately
   */
  stopSession(): void {
    console.log('[SessionManager] Stopping session...');
    
    // Save incomplete session
    if (this.sessionStartTime > 0) {
      this.saveSessionRecord(false);
      // Emit event for analytics refresh
      eventBus.emit(EVENTS.SESSION_STOPPED);
    }
    
    audioService.fadeOut(1);
    
    setTimeout(() => {
      useSessionStore.getState().stopSession();
      this.cleanup();
    }, 1000);
  }

  /**
   * Emergency stop - immediate termination
   */
  emergencyStop(): void {
    console.log('[SessionManager] EMERGENCY STOP activated');
    
    // Immediate audio cutoff
    audioService.emergencyStop();
    
    // Stop session
    useSessionStore.getState().emergencyStop();
    
    // Clean up intervals
    this.cleanup();
  }

  /**
   * Clean up intervals and resources
   */
  private cleanup(): void {
    if (this.phaseInterval) {
      clearInterval(this.phaseInterval);
      this.phaseInterval = null;
    }
    if (this.metricsInterval) {
      clearInterval(this.metricsInterval);
      this.metricsInterval = null;
    }
  }

  /**
   * Pause session
   */
  pauseSession(): void {
    const store = useSessionStore.getState();
    if (store.sessionActive && !store.sessionPaused) {
      store.pauseSession();
      audioService.fadeOut(1);
      console.log('[SessionManager] Session paused');
    }
  }

  /**
   * Resume session
   */
  async resumeSession(): Promise<void> {
    const store = useSessionStore.getState();
    if (store.sessionActive && store.sessionPaused) {
      store.resumeSession();
      await audioService.resume();
      audioService.fadeIn(1);
      console.log('[SessionManager] Session resumed');
    }
  }
}

// Export singleton instance
export const sessionManager = new SessionManager();
