/**
 * Audio Service v2.0 Demo & Testing
 * Demonstrates all advanced audio capabilities
 */

import { audioService } from './audioService';

type AudioPreset = 'warm' | 'bright' | 'deep' | 'ethereal' | 'natural';

export class AudioDemo {
  /**
   * Demo 1: Progressive frequency sweep through all brainwave states
   */
  static async demoFrequencySweep(): Promise<void> {
    console.log('=== DEMO: Frequency Sweep ===');
    
    await audioService.initialize();
    await audioService.resume();
    
    // Delta (0.5-4 Hz) - Deep sleep
    console.log('Phase 1: Delta waves (1 Hz)');
    audioService.setBeatFrequency(1, 2, 'delta');
    audioService.fadeIn(2);
    await this.wait(5000);
    
    // Theta (4-8 Hz) - Meditation
    console.log('Phase 2: Theta waves (6 Hz)');
    audioService.setBeatFrequency(6, 3, 'theta');
    await this.wait(5000);
    
    // Alpha (8-14 Hz) - Relaxation
    console.log('Phase 3: Alpha waves (10 Hz)');
    audioService.setBeatFrequency(10, 3, 'alpha');
    await this.wait(5000);
    
    // Beta (14-30 Hz) - Focus
    console.log('Phase 4: Beta waves (20 Hz)');
    audioService.setBeatFrequency(20, 3, 'beta');
    await this.wait(5000);
    
    // Gamma (30+ Hz) - Peak performance
    console.log('Phase 5: Gamma waves (40 Hz)');
    audioService.setBeatFrequency(40, 3, 'gamma');
    await this.wait(5000);
    
    audioService.fadeOut(3);
    await this.wait(3000);
    
    console.log('Frequency sweep complete!');
  }

  /**
   * Demo 2: Audio presets showcase
   */
  static async demoAudioPresets(): Promise<void> {
    console.log('=== DEMO: Audio Presets ===');
    
    await audioService.initialize();
    await audioService.resume();
    
    const presets: AudioPreset[] = ['warm', 'bright', 'deep', 'ethereal', 'natural'];
    
    audioService.setBeatFrequency(10, 1, 'alpha'); // Fixed alpha frequency
    audioService.fadeIn(2);
    await this.wait(2000);
    
    for (const preset of presets) {
      console.log(`Preset: ${preset.toUpperCase()}`);
      audioService.setAudioPreset(preset);
      await this.wait(4000);
    }
    
    audioService.fadeOut(2);
    await this.wait(2000);
    
    console.log('Audio presets demo complete!');
  }

  /**
   * Demo 3: Isochronic pulses
   */
  static async demoIsochronicPulse(): Promise<void> {
    console.log('=== DEMO: Isochronic Pulse ===');
    
    await audioService.initialize();
    await audioService.resume();
    
    audioService.setBeatFrequency(8, 1, 'theta');
    audioService.fadeIn(2);
    await this.wait(2000);
    
    console.log('Activating isochronic pulse (40% intensity)');
    audioService.setIsochronicPulse(true, 0.4);
    await this.wait(5000);
    
    console.log('Increasing to 70% intensity');
    audioService.setIsochronicPulse(true, 0.7);
    await this.wait(5000);
    
    console.log('Disabling isochronic pulse');
    audioService.setIsochronicPulse(false);
    await this.wait(3000);
    
    audioService.fadeOut(2);
    await this.wait(2000);
    
    console.log('Isochronic pulse demo complete!');
  }

  /**
   * Demo 4: Spatial audio movement
   */
  static async demoSpatialAudio(): Promise<void> {
    console.log('=== DEMO: Spatial Audio ===');
    
    await audioService.initialize();
    await audioService.resume();
    
    audioService.setBeatFrequency(10, 1, 'alpha');
    audioService.fadeIn(2);
    await this.wait(2000);
    
    console.log('Moving to left');
    audioService.setSpatialPosition(-0.8, 2);
    await this.wait(3000);
    
    console.log('Moving to center');
    audioService.setSpatialPosition(0, 2);
    await this.wait(3000);
    
    console.log('Moving to right');
    audioService.setSpatialPosition(0.8, 2);
    await this.wait(3000);
    
    console.log('Returning to center');
    audioService.setSpatialPosition(0, 2);
    await this.wait(2000);
    
    audioService.fadeOut(2);
    await this.wait(2000);
    
    console.log('Spatial audio demo complete!');
  }

  /**
   * Demo 5: Ambient noise layers
   */
  static async demoAmbientNoise(): Promise<void> {
    console.log('=== DEMO: Ambient Noise ===');
    
    await audioService.initialize();
    await audioService.resume();
    
    // Base binaural beat
    audioService.setBeatFrequency(8, 1, 'theta');
    audioService.fadeIn(2);
    await this.wait(2000);
    
    console.log('Adding pink noise (gentle background)');
    audioService.startAmbientNoise('pink', 0.08);
    await this.wait(5000);
    
    console.log('Adding brown noise (deeper atmosphere)');
    audioService.startAmbientNoise('brown', 0.06);
    await this.wait(5000);
    
    console.log('Removing pink noise');
    audioService.stopAmbientNoise('pink', 2);
    await this.wait(3000);
    
    console.log('Removing brown noise');
    audioService.stopAmbientNoise('brown', 2);
    await this.wait(3000);
    
    audioService.fadeOut(2);
    await this.wait(2000);
    
    console.log('Ambient noise demo complete!');
  }

  /**
   * Demo 6: Full immersive session (combines all features)
   */
  static async demoFullSession(): Promise<void> {
    console.log('=== DEMO: Full Immersive Session ===');
    
    await audioService.initialize();
    await audioService.resume();
    
    // Phase 1: Entry (Theta + warm preset + subtle pink noise)
    console.log('Phase 1: Entering meditative state...');
    audioService.setAudioPreset('warm');
    audioService.setBeatFrequency(6, 2, 'theta');
    audioService.startAmbientNoise('pink', 0.05);
    audioService.fadeIn(3);
    await this.wait(8000);
    
    // Phase 2: Deepening (Alpha-Theta bridge + ethereal + spatial movement)
    console.log('Phase 2: Deepening experience...');
    audioService.setAudioPreset('ethereal');
    audioService.setBeatFrequency(8, 4, 'alpha');
    audioService.setSpatialPosition(-0.5, 3);
    await this.wait(6000);
    
    // Phase 3: Peak (Alpha + isochronic pulse + bright preset)
    console.log('Phase 3: Peak focus state...');
    audioService.setAudioPreset('bright');
    audioService.setBeatFrequency(12, 3, 'alpha');
    audioService.setIsochronicPulse(true, 0.5);
    audioService.setSpatialPosition(0.5, 3);
    await this.wait(8000);
    
    // Phase 4: Integration (Theta + deep preset + brown noise)
    console.log('Phase 4: Integration phase...');
    audioService.setAudioPreset('deep');
    audioService.setIsochronicPulse(false);
    audioService.setBeatFrequency(5, 4, 'theta');
    audioService.stopAmbientNoise('pink', 2);
    audioService.startAmbientNoise('brown', 0.07);
    await this.wait(8000);
    
    // Phase 5: Return (Natural + center + fade out)
    console.log('Phase 5: Gentle return...');
    audioService.setAudioPreset('natural');
    audioService.setSpatialPosition(0, 3);
    audioService.stopAmbientNoise('brown', 3);
    audioService.fadeOut(5);
    await this.wait(5000);
    
    console.log('Full session complete! 🧘‍♂️✨');
  }

  /**
   * Demo 7: Frequency analysis visualization test
   */
  static async demoFrequencyAnalysis(): Promise<void> {
    console.log('=== DEMO: Frequency Analysis ===');
    
    await audioService.initialize();
    await audioService.resume();
    
    audioService.setBeatFrequency(10, 1, 'alpha');
    audioService.fadeIn(2);
    
    console.log('Reading frequency data for 10 seconds...');
    
    const interval = setInterval(() => {
      const freqData = audioService.getFrequencyData();
      const timeData = audioService.getTimeDomainData();
      
      if (freqData && timeData) {
        // Calculate average frequency magnitude
        const avgFreq = Array.from(freqData).reduce((a, b) => a + b, 0) / freqData.length;
        // Calculate waveform amplitude
        const avgTime = Array.from(timeData).reduce((a, b) => a + b, 0) / timeData.length;
        
        console.log(`Freq avg: ${avgFreq.toFixed(1)}, Time avg: ${avgTime.toFixed(1)}`);
      }
    }, 1000);
    
    await this.wait(10000);
    clearInterval(interval);
    
    audioService.fadeOut(2);
    await this.wait(2000);
    
    console.log('Frequency analysis demo complete!');
  }

  /**
   * Utility: Wait for milliseconds
   */
  private static wait(ms: number): Promise<void> {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
}

// Export convenience functions for console testing
if (typeof window !== 'undefined') {
  (window as any).audioDemo = {
    sweep: () => AudioDemo.demoFrequencySweep(),
    presets: () => AudioDemo.demoAudioPresets(),
    isochronic: () => AudioDemo.demoIsochronicPulse(),
    spatial: () => AudioDemo.demoSpatialAudio(),
    ambient: () => AudioDemo.demoAmbientNoise(),
    full: () => AudioDemo.demoFullSession(),
    analysis: () => AudioDemo.demoFrequencyAnalysis(),
  };
  
  console.log('%c🎵 Audio Demo Available!', 'color: #20d48a; font-size: 16px; font-weight: bold;');
  console.log('Run demos in console:');
  console.log('  audioDemo.sweep()     - Frequency sweep (Delta → Gamma)');
  console.log('  audioDemo.presets()   - Audio presets showcase');
  console.log('  audioDemo.isochronic() - Isochronic pulse test');
  console.log('  audioDemo.spatial()   - Spatial audio movement');
  console.log('  audioDemo.ambient()   - Ambient noise layers');
  console.log('  audioDemo.full()      - Full immersive session');
  console.log('  audioDemo.analysis()  - Frequency analysis data');
}
