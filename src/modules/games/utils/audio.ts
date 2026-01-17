
// Web Audio API Synthesizer for Retro Sounds
// Generates "cloned" nostalgic sounds mathematically to avoid copyright issues

let audioCtx: AudioContext | null = null;

export const initAudio = () => {
  if (!audioCtx) {
    audioCtx = new (window.AudioContext || (window as any).webkitAudioContext)();
  }
  if (audioCtx.state === 'suspended') {
    audioCtx.resume();
  }
};

export const playRetroSound = (type: 'JUMP' | 'COIN' | 'EXPLOSION' | 'POWERUP' | 'LASER' | 'START' | 'POWERON' | 'WAKA' | 'SUCCESS' | 'WGS') => {
  if (!audioCtx) return;

  const oscillator = audioCtx.createOscillator();
  const gainNode = audioCtx.createGain();

  oscillator.connect(gainNode);
  gainNode.connect(audioCtx.destination);

  const now = audioCtx.currentTime;

  switch (type) {
    case 'JUMP':
      // Mario-style Jump: Square wave slide up
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(150, now);
      oscillator.frequency.linearRampToValueAtTime(300, now + 0.1);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.15);
      oscillator.start(now);
      oscillator.stop(now + 0.15);
      break;

    case 'COIN':
      // B5 then E6 rapid (Coin sound)
      oscillator.type = 'square';
      oscillator.frequency.setValueAtTime(987, now); // B5
      oscillator.frequency.setValueAtTime(1318, now + 0.08); // E6
      gainNode.gain.setValueAtTime(0.05, now);
      gainNode.gain.setValueAtTime(0.05, now + 0.3);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.4);
      oscillator.start(now);
      oscillator.stop(now + 0.4);
      break;

    case 'EXPLOSION':
      // Noise burst for breaking blocks/confetti
      const bufferSize = audioCtx.sampleRate * 0.5; // 0.5 sec
      const buffer = audioCtx.createBuffer(1, bufferSize, audioCtx.sampleRate);
      const data = buffer.getChannelData(0);
      for (let i = 0; i < bufferSize; i++) {
        data[i] = Math.random() * 2 - 1;
      }
      const noise = audioCtx.createBufferSource();
      noise.buffer = buffer;
      const noiseFilter = audioCtx.createBiquadFilter();
      noiseFilter.type = 'lowpass';
      noiseFilter.frequency.setValueAtTime(1000, now);
      noiseFilter.frequency.linearRampToValueAtTime(100, now + 0.3);
      
      noise.connect(noiseFilter);
      noiseFilter.connect(gainNode);
      
      gainNode.gain.setValueAtTime(0.2, now);
      gainNode.gain.exponentialRampToValueAtTime(0.01, now + 0.3);
      noise.start(now);
      noise.stop(now + 0.3);
      return; // Special case, uses buffer source

    case 'POWERUP':
      // Arpeggio (Fanfareish)
      oscillator.type = 'triangle';
      oscillator.frequency.setValueAtTime(440, now);
      oscillator.frequency.setValueAtTime(554, now + 0.1); // C#
      oscillator.frequency.setValueAtTime(659, now + 0.2); // E
      oscillator.frequency.setValueAtTime(880, now + 0.3); // A
      oscillator.frequency.setValueAtTime(1108, now + 0.4); // C#
      
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.6);
      oscillator.start(now);
      oscillator.stop(now + 0.6);
      break;
      
    case 'LASER':
      // Pew pew
      oscillator.type = 'sawtooth';
      oscillator.frequency.setValueAtTime(880, now);
      oscillator.frequency.exponentialRampToValueAtTime(110, now + 0.2);
      gainNode.gain.setValueAtTime(0.1, now);
      gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
      oscillator.start(now);
      oscillator.stop(now + 0.2);
      break;
    
    case 'WAKA':
        // Rough Waka approximation
        oscillator.type = 'triangle';
        oscillator.frequency.setValueAtTime(200, now);
        oscillator.frequency.linearRampToValueAtTime(400, now + 0.1);
        gainNode.gain.setValueAtTime(0.1, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.15);
        oscillator.start(now);
        oscillator.stop(now + 0.15);
        break;

    case 'WGS':
        // Heavy mechanical thud for letters
        oscillator.type = 'square';
        oscillator.frequency.setValueAtTime(50, now);
        oscillator.frequency.exponentialRampToValueAtTime(10, now + 0.2);
        gainNode.gain.setValueAtTime(0.2, now);
        gainNode.gain.linearRampToValueAtTime(0, now + 0.2);
        oscillator.start(now);
        oscillator.stop(now + 0.2);
        break;

    case 'POWERON':
       // Deep THX style swell (simplified)
       oscillator.type = 'sawtooth';
       oscillator.frequency.setValueAtTime(55, now); // Low A
       oscillator.frequency.linearRampToValueAtTime(110, now + 2);
       
       // Add a second oscillator for harmony
       const osc2 = audioCtx.createOscillator();
       osc2.type = 'square';
       osc2.frequency.setValueAtTime(55, now);
       osc2.frequency.linearRampToValueAtTime(55.5, now + 2); // Detune slightly
       const gain2 = audioCtx.createGain();
       osc2.connect(gain2);
       gain2.connect(audioCtx.destination);
       
       gainNode.gain.setValueAtTime(0, now);
       gainNode.gain.linearRampToValueAtTime(0.15, now + 1);
       gainNode.gain.linearRampToValueAtTime(0, now + 3);
       
       gain2.gain.setValueAtTime(0, now);
       gain2.gain.linearRampToValueAtTime(0.1, now + 1);
       gain2.gain.linearRampToValueAtTime(0, now + 3);

       oscillator.start(now);
       oscillator.stop(now + 3);
       osc2.start(now);
       osc2.stop(now + 3);
       return; 
       
    case 'SUCCESS':
       // Simple victory triad
       oscillator.type = 'square';
       oscillator.frequency.setValueAtTime(523.25, now); // C
       oscillator.frequency.setValueAtTime(659.25, now + 0.15); // E
       oscillator.frequency.setValueAtTime(783.99, now + 0.30); // G
       oscillator.frequency.setValueAtTime(1046.50, now + 0.45); // C
       
       gainNode.gain.setValueAtTime(0.1, now);
       gainNode.gain.linearRampToValueAtTime(0, now + 1.0);
       oscillator.start(now);
       oscillator.stop(now + 1.0);
       break;
  }
};
