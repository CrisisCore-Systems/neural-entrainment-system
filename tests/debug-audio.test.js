const AudioEngine = require('../src/audio/AudioEngine');

describe('Test AudioEngine initialization', () => {
  test('should initialize and have gainNode', async () => {
    const audioEngine = new AudioEngine();
    console.log('before init - gainNode:', audioEngine.gainNode);
    
    const result = await audioEngine.initialize();
    console.log('init result:', result);
    console.log('after init - gainNode:', audioEngine.gainNode);
    console.log('after init - isInitialized:', audioEngine.isInitialized);
    
    expect(audioEngine.gainNode).not.toBeNull();
  });
});
