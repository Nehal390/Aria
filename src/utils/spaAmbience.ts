/**
 * Serenity Wellness Spa Ambient Soundscape Engine
 * Real-time procedural audio synthesizer generating 432Hz / 528Hz warm harmonic solfeggio drone
 * Features automatic conversational audio ducking during assistant speech.
 */

class SpaAmbienceEngine {
  private ctx: AudioContext | null = null;
  private masterGain: GainNode | null = null;
  private isRunning = false;
  private isDucked = false;
  private baseVolume = 0.25;
  private duckedVolume = 0.06;
  private oscillators: OscillatorNode[] = [];

  public start(): boolean {
    if (this.isRunning) return true;

    try {
      const AudioContextClass = window.AudioContext || (window as any).webkitAudioContext;
      if (!AudioContextClass) return false;

      this.ctx = new AudioContextClass();
      if (this.ctx.state === 'suspended') {
        this.ctx.resume();
      }

      this.masterGain = this.ctx.createGain();
      this.masterGain.gain.setValueAtTime(0.001, this.ctx.currentTime);
      this.masterGain.gain.exponentialRampToValueAtTime(this.baseVolume, this.ctx.currentTime + 2.5);

      // Warm acoustic low-pass filter
      const filter = this.ctx.createBiquadFilter();
      filter.type = 'lowpass';
      filter.frequency.setValueAtTime(320, this.ctx.currentTime);
      filter.Q.setValueAtTime(1.2, this.ctx.currentTime);

      this.masterGain.connect(filter);
      filter.connect(this.ctx.destination);

      // Harmonic Solfeggio frequencies: 432Hz (Deep Peace) and 528Hz (Cellular Harmony) sub-harmonics
      const frequencies = [108, 162, 216, 270, 324];

      frequencies.forEach((freq, idx) => {
        if (!this.ctx || !this.masterGain) return;
        const osc = this.ctx.createOscillator();
        const oscGain = this.ctx.createGain();

        osc.type = idx % 2 === 0 ? 'sine' : 'triangle';
        osc.frequency.setValueAtTime(freq, this.ctx.currentTime);

        // Subtle slow detune for organic acoustic warmth
        osc.detune.setValueAtTime((idx - 2) * 3, this.ctx.currentTime);

        const individualVolume = (0.15 / (idx + 1));
        oscGain.gain.setValueAtTime(individualVolume, this.ctx.currentTime);

        // Gentle organic breathing LFO
        const lfo = this.ctx.createOscillator();
        const lfoGain = this.ctx.createGain();
        lfo.frequency.setValueAtTime(0.06 + idx * 0.015, this.ctx.currentTime); // ~14 second breath cycle
        lfoGain.gain.setValueAtTime(individualVolume * 0.4, this.ctx.currentTime);

        lfo.connect(lfoGain.gain);
        osc.connect(oscGain);
        oscGain.connect(this.masterGain);

        osc.start();
        lfo.start();
        this.oscillators.push(osc);
      });

      this.isRunning = true;
      return true;
    } catch (err) {
      console.warn('Spa ambience initialisation notice:', err);
      return false;
    }
  }

  public stop(): void {
    if (!this.isRunning || !this.ctx || !this.masterGain) return;

    try {
      const now = this.ctx.currentTime;
      this.masterGain.gain.cancelScheduledValues(now);
      this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);
      this.masterGain.gain.exponentialRampToValueAtTime(0.0001, now + 1.2);

      setTimeout(() => {
        this.oscillators.forEach((osc) => {
          try {
            osc.stop();
            osc.disconnect();
          } catch (e) {
            // ignore
          }
        });
        this.oscillators = [];
        try {
          this.ctx?.close();
        } catch (e) {
          // ignore
        }
        this.ctx = null;
        this.masterGain = null;
        this.isRunning = false;
        this.isDucked = false;
      }, 1300);
    } catch (err) {
      this.isRunning = false;
    }
  }

  /**
   * Conversational Audio Ducking:
   * Smoothly lowers ambient volume when assistant speaks,
   * swells back up when speaking ends.
   */
  public duck(shouldDuck: boolean): void {
    if (!this.isRunning || !this.ctx || !this.masterGain) return;
    if (this.isDucked === shouldDuck) return;

    this.isDucked = shouldDuck;
    const now = this.ctx.currentTime;
    this.masterGain.gain.cancelScheduledValues(now);
    this.masterGain.gain.setValueAtTime(this.masterGain.gain.value, now);

    const targetVolume = shouldDuck ? this.duckedVolume : this.baseVolume;
    const duration = shouldDuck ? 0.3 : 1.2; // Quick duck, gentle swell

    this.masterGain.gain.linearRampToValueAtTime(targetVolume, now + duration);
  }

  public toggle(): boolean {
    if (this.isRunning) {
      this.stop();
      return false;
    } else {
      return this.start();
    }
  }

  public getStatus(): { isRunning: boolean; isDucked: boolean } {
    return {
      isRunning: this.isRunning,
      isDucked: this.isDucked,
    };
  }
}

export const spaAmbience = new SpaAmbienceEngine();
