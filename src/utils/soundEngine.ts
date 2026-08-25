import { BgmType, SfxType } from '../types/game';

class SoundEngine {
  private ctx: AudioContext | null = null;
  private bgmInterval: number | null = null;
  private currentBgmType: BgmType | null = null;
  private isMuted: boolean = false;
  private bgmVolume: number = 0.35;
  private sfxVolume: number = 0.6;
  private masterGain: GainNode | null = null;
  private bgmGain: GainNode | null = null;
  private sfxGain: GainNode | null = null;

  constructor() {
    // AudioContext will be initialized on first user interaction
  }

  private initContext() {
    if (!this.ctx) {
      const AudioContextClass = window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
      this.ctx = new AudioContextClass();
      
      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.value = this.isMuted ? 0 : 1;
      this.masterGain.connect(this.ctx.destination);

      this.bgmGain = this.ctx.createGain();
      this.bgmGain.gain.value = this.bgmVolume;
      this.bgmGain.connect(this.masterGain);

      this.sfxGain = this.ctx.createGain();
      this.sfxGain.gain.value = this.sfxVolume;
      this.sfxGain.connect(this.masterGain);
    }

    if (this.ctx.state === 'suspended') {
      this.ctx.resume();
    }
  }

  public setMute(muted: boolean) {
    this.isMuted = muted;
    if (this.masterGain && this.ctx) {
      this.masterGain.gain.setValueAtTime(muted ? 0 : 1, this.ctx.currentTime);
    }
  }

  public getMuted(): boolean {
    return this.isMuted;
  }

  public setBgmVolume(vol: number) {
    this.bgmVolume = Math.max(0, Math.min(1, vol));
    if (this.bgmGain && this.ctx) {
      this.bgmGain.gain.setValueAtTime(this.bgmVolume, this.ctx.currentTime);
    }
  }

  public setSfxVolume(vol: number) {
    this.sfxVolume = Math.max(0, Math.min(1, vol));
    if (this.sfxGain && this.ctx) {
      this.sfxGain.gain.setValueAtTime(this.sfxVolume, this.ctx.currentTime);
    }
  }

  // --- SFX GENERATION ---
  public playSfx(type: SfxType) {
    if (this.isMuted) return;
    this.initContext();
    if (!this.ctx || !this.sfxGain) return;

    const t = this.ctx.currentTime;

    switch (type) {
      case 'sword': {
        // High metallic screech + quick slice
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        const filter = this.ctx.createBiquadFilter();

        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(1400, t);
        osc.frequency.exponentialRampToValueAtTime(300, t + 0.25);

        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(2500, t);
        filter.Q.setValueAtTime(8, t);

        gain.gain.setValueAtTime(0.4, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.3);

        osc.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.35);
        break;
      }

      case 'chime':
      case 'item': {
        // Pentatonic crystalline bell
        const freqs = type === 'chime' ? [880, 1318.5, 1760] : [587.33, 880];
        freqs.forEach((freq, idx) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(freq, t + idx * 0.05);

          gain.gain.setValueAtTime(0.25, t + idx * 0.05);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.05 + 0.8);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(t + idx * 0.05);
          osc.stop(t + idx * 0.05 + 0.9);
        });
        break;
      }

      case 'heartbeat': {
        // Deep thumping pulse (du-dum)
        [0, 0.18].forEach(offset => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sine';
          osc.frequency.setValueAtTime(65, t + offset);
          osc.frequency.exponentialRampToValueAtTime(35, t + offset + 0.15);

          gain.gain.setValueAtTime(0.5, t + offset);
          gain.gain.exponentialRampToValueAtTime(0.001, t + offset + 0.2);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(t + offset);
          osc.stop(t + offset + 0.25);
        });
        break;
      }

      case 'gong': {
        // Deep resonant bell
        const osc1 = this.ctx.createOscillator();
        const osc2 = this.ctx.createOscillator();
        const gain = this.ctx.createGain();

        osc1.type = 'sine';
        osc1.frequency.setValueAtTime(110, t); // A2
        osc2.type = 'triangle';
        osc2.frequency.setValueAtTime(221, t); // Slight detune for shimmer

        gain.gain.setValueAtTime(0.6, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 2.5);

        osc1.connect(gain);
        osc2.connect(gain);
        gain.connect(this.sfxGain);

        osc1.start(t);
        osc2.start(t);
        osc1.stop(t + 2.6);
        osc2.stop(t + 2.6);
        break;
      }

      case 'shock': {
        // Dramatic suspense sting
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'sawtooth';
        osc.frequency.setValueAtTime(180, t);
        osc.frequency.linearRampToValueAtTime(600, t + 0.12);
        osc.frequency.linearRampToValueAtTime(120, t + 0.6);

        gain.gain.setValueAtTime(0.5, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.7);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.75);
        break;
      }

      case 'reveal':
      case 'success': {
        // Uplifting Korean pentatonic arpeggio (G4, A4, C5, D5, E5)
        const notes = [392.00, 440.00, 523.25, 587.33, 659.25];
        notes.forEach((freq, idx) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'triangle';
          osc.frequency.setValueAtTime(freq, t + idx * 0.08);

          gain.gain.setValueAtTime(0.3, t + idx * 0.08);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.08 + 0.9);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(t + idx * 0.08);
          osc.stop(t + idx * 0.08 + 1.0);
        });
        break;
      }

      case 'fail': {
        const notes = [293.66, 277.18, 220.00];
        notes.forEach((freq, idx) => {
          if (!this.ctx || !this.sfxGain) return;
          const osc = this.ctx.createOscillator();
          const gain = this.ctx.createGain();
          osc.type = 'sawtooth';
          osc.frequency.setValueAtTime(freq, t + idx * 0.18);

          gain.gain.setValueAtTime(0.3, t + idx * 0.18);
          gain.gain.exponentialRampToValueAtTime(0.001, t + idx * 0.18 + 0.6);

          osc.connect(gain);
          gain.connect(this.sfxGain);

          osc.start(t + idx * 0.18);
          osc.stop(t + idx * 0.18 + 0.7);
        });
        break;
      }

      case 'paper': {
        // Filtered white noise puff
        const bufferSize = this.ctx.sampleRate * 0.2;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.2;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'bandpass';
        filter.frequency.setValueAtTime(800, t);
        filter.Q.setValueAtTime(3, t);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.35, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.2);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(t);
        break;
      }

      case 'footsteps': {
        const osc = this.ctx.createOscillator();
        const gain = this.ctx.createGain();
        osc.type = 'triangle';
        osc.frequency.setValueAtTime(90, t);
        osc.frequency.exponentialRampToValueAtTime(40, t + 0.1);

        gain.gain.setValueAtTime(0.2, t);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.12);

        osc.connect(gain);
        gain.connect(this.sfxGain);

        osc.start(t);
        osc.stop(t + 0.15);
        break;
      }

      case 'wind': {
        const bufferSize = this.ctx.sampleRate * 0.8;
        const buffer = this.ctx.createBuffer(1, bufferSize, this.ctx.sampleRate);
        const data = buffer.getChannelData(0);
        for (let i = 0; i < bufferSize; i++) {
          data[i] = (Math.random() * 2 - 1) * 0.15;
        }

        const noise = this.ctx.createBufferSource();
        noise.buffer = buffer;
        const filter = this.ctx.createBiquadFilter();
        filter.type = 'lowpass';
        filter.frequency.setValueAtTime(300, t);
        filter.frequency.linearRampToValueAtTime(700, t + 0.4);
        filter.frequency.linearRampToValueAtTime(200, t + 0.8);

        const gain = this.ctx.createGain();
        gain.gain.setValueAtTime(0.01, t);
        gain.gain.linearRampToValueAtTime(0.25, t + 0.3);
        gain.gain.exponentialRampToValueAtTime(0.001, t + 0.8);

        noise.connect(filter);
        filter.connect(gain);
        gain.connect(this.sfxGain);

        noise.start(t);
        break;
      }
    }
  }

  // --- PROCEDURAL TRADITIONAL KOREAN BGM GENERATOR ---
  public playBgm(type: BgmType) {
    if (this.currentBgmType === type && this.bgmInterval !== null) return;
    this.stopBgm();
    this.currentBgmType = type;

    this.initContext();
    if (!this.ctx || !this.bgmGain) return;

    // Korean traditional Pentatonic Scales (Gyemyeonjo & Pyeongjo)
    // Night mystery: D3, F3, G3, A3, C4, D4
    // Romance: C4, D4, E4, G4, A4, C5 (warm, soft)
    // Investigation: E3, G3, A3, B3, D4, E4 (curious, subtle)
    // Suspense Climax: D2, Eb2, G2, Ab2, C3, D3 (tense, minor second)
    // Triumph: D3, G3, A3, B3, D4, E4, G4 (bright)
    // Sorrow: A2, C3, D3, E3, G3, A3 (melancholic)

    let notes: number[];
    let tempoMs: number;
    let waveType: OscillatorType;

    switch (type) {
      case 'night_mystery':
        notes = [146.83, 174.61, 196.00, 220.00, 261.63, 293.66, 349.23];
        tempoMs = 1600;
        waveType = 'triangle';
        break;
      case 'romance_tender':
        notes = [261.63, 293.66, 329.63, 392.00, 440.00, 523.25, 587.33];
        tempoMs = 1400;
        waveType = 'sine';
        break;
      case 'investigation':
        notes = [164.81, 196.00, 220.00, 246.94, 293.66, 329.63];
        tempoMs = 1100;
        waveType = 'triangle';
        break;
      case 'suspense_climax':
        notes = [73.42, 77.78, 98.00, 103.83, 130.81, 146.83];
        tempoMs = 700;
        waveType = 'sawtooth';
        break;
      case 'triumph':
        notes = [196.00, 220.00, 246.94, 293.66, 329.63, 392.00];
        tempoMs = 900;
        waveType = 'triangle';
        break;
      case 'sorrow':
        notes = [110.00, 130.81, 146.83, 164.81, 196.00, 220.00];
        tempoMs = 1800;
        waveType = 'sine';
        break;
    }

    let noteIndex = 0;
    const playNote = () => {
      if (!this.ctx || !this.bgmGain || this.isMuted) return;

      const t = this.ctx.currentTime;
      // Pick note from pattern or random walk
      const baseFreq = notes[noteIndex % notes.length];
      noteIndex = (noteIndex + 1 + Math.floor(Math.random() * 3)) % notes.length;

      // Primary plucked instrument (Geomungo / Gayageum feel)
      const osc = this.ctx.createOscillator();
      const gain = this.ctx.createGain();
      const filter = this.ctx.createBiquadFilter();

      osc.type = waveType;
      osc.frequency.setValueAtTime(baseFreq, t);

      // Filter simulation
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(type === 'suspense_climax' ? 500 : 1200, t);
      filter.frequency.exponentialRampToValueAtTime(300, t + 1.2);

      gain.gain.setValueAtTime(type === 'suspense_climax' ? 0.15 : 0.22, t);
      gain.gain.exponentialRampToValueAtTime(0.0001, t + (tempoMs / 1000) * 1.5);

      osc.connect(filter);
      filter.connect(gain);
      gain.connect(this.bgmGain);

      osc.start(t);
      osc.stop(t + (tempoMs / 1000) * 1.6);

      // Flute / Daegeum harmonic accompaniment randomly
      if (Math.random() > 0.45 && type !== 'suspense_climax') {
        const droneOsc = this.ctx.createOscillator();
        const droneGain = this.ctx.createGain();
        droneOsc.type = 'sine';
        droneOsc.frequency.setValueAtTime(baseFreq * 2, t + 0.1);

        droneGain.gain.setValueAtTime(0.001, t + 0.1);
        droneGain.gain.linearRampToValueAtTime(0.08, t + 0.4);
        droneGain.gain.exponentialRampToValueAtTime(0.001, t + 1.8);

        droneOsc.connect(droneGain);
        droneGain.connect(this.bgmGain);

        droneOsc.start(t + 0.1);
        droneOsc.stop(t + 1.9);
      }
    };

    // Play immediately and set loop
    playNote();
    this.bgmInterval = window.setInterval(playNote, tempoMs);
  }

  public stopBgm() {
    if (this.bgmInterval !== null) {
      clearInterval(this.bgmInterval);
      this.bgmInterval = null;
    }
    this.currentBgmType = null;
  }
}

export const soundEngine = new SoundEngine();
