export class AudioSystem {
  private ctx?: AudioContext;

  private context(): AudioContext | undefined {
    const AudioCtor = window.AudioContext || (window as typeof window & { webkitAudioContext?: typeof AudioContext }).webkitAudioContext;
    if (!AudioCtor) return undefined;
    this.ctx ??= new AudioCtor();
    return this.ctx;
  }

  beep(freq = 440, duration = 0.08, type: OscillatorType = 'square', gain = 0.04): void {
    const ctx = this.context();
    if (!ctx) return;
    const osc = ctx.createOscillator();
    const amp = ctx.createGain();
    osc.type = type;
    osc.frequency.value = freq;
    amp.gain.value = gain;
    osc.connect(amp);
    amp.connect(ctx.destination);
    osc.start();
    amp.gain.exponentialRampToValueAtTime(0.0001, ctx.currentTime + duration);
    osc.stop(ctx.currentTime + duration);
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
