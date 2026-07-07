import Phaser from 'phaser';

export class AudioSystem {
  private static ctx?: AudioContext;
  private static musicTimer?: number;
  private static beat = 0;
  private static enabled = true;
  private static unlockBound = false;

  private context(): AudioContext | undefined {
    return AudioSystem.context();
  }

  private static context(): AudioContext | undefined {
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return undefined;
    AudioSystem.ctx ??= new AudioCtor();
    return AudioSystem.ctx;
  }

  static setMusicEnabled(enabled: boolean): void {
    AudioSystem.enabled = enabled;
    if (!enabled) AudioSystem.stopMusic();
    else AudioSystem.playMusic();
  }

  static bindMusicUnlock(scene: Phaser.Scene): void {
    if (AudioSystem.unlockBound) return;
    AudioSystem.unlockBound = true;
    const unlock = () => {
      AudioSystem.playMusic();
      scene.input.off('pointerdown', unlock);
      scene.input.keyboard?.off('keydown', unlock);
    };
    scene.input.once('pointerdown', unlock);
    scene.input.keyboard?.once('keydown', unlock);
  }

  static playMusic(): void {
    if (!AudioSystem.enabled || AudioSystem.musicTimer !== undefined) return;
    const ctx = AudioSystem.context();
    if (!ctx) return;
    void ctx.resume();
    AudioSystem.beat = 0;
    AudioSystem.musicTimer = window.setInterval(() => AudioSystem.tickMusic(), 150);
  }

  static stopMusic(): void {
    if (AudioSystem.musicTimer === undefined) return;
    window.clearInterval(AudioSystem.musicTimer);
    AudioSystem.musicTimer = undefined;
  }

  private static tickMusic(): void {
    if (!AudioSystem.enabled) return;
    const melody = [659, 784, 880, 784, 659, 523, 587, 659, 698, 880, 784, 698, 659, 587, 523, 587];
    const bass = [196, 196, 262, 262, 220, 220, 294, 294];
    const step = AudioSystem.beat % melody.length;
    AudioSystem.playTone(melody[step], 0.11, 'square', 0.018);
    if (AudioSystem.beat % 2 === 0) AudioSystem.playTone(bass[Math.floor(AudioSystem.beat / 2) % bass.length], 0.13, 'triangle', 0.018);
    if (AudioSystem.beat % 4 === 2) AudioSystem.playTone(988, 0.045, 'square', 0.009);
    AudioSystem.beat += 1;
  }

  private static playTone(freq: number, duration: number, type: OscillatorType, gain: number): void {
    const ctx = AudioSystem.context();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.setValueAtTime(gain, ctx.currentTime);
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start();
    osc.stop(ctx.currentTime + duration);
  }

  beep(freq = 440, duration = 0.08, type: OscillatorType = 'square', gain = 0.04): void {
    AudioSystem.playTone(freq, duration, type, gain);
  }

  pickup(): void {
    this.beep(880, 0.06, 'triangle', 0.05);
  }

  hit(): void {
    this.beep(170, 0.12, 'sawtooth', 0.05);
  }

  jump(): void {
    this.beep(520, 0.06, 'square', 0.035);
  }

  boss(): void {
    this.beep(120, 0.18, 'sawtooth', 0.06);
    setTimeout(() => this.beep(90, 0.18, 'sawtooth', 0.06), 130);
  }
}
