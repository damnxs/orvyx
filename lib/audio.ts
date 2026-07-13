"use client";

// Procedural ambient engine: detuned low drone + slow breathing LFO +
// randomized crystal pings. Muted by default; resumes on first user gesture.
// No audio assets shipped.
class OracleAudio {
  private ctx: AudioContext | null = null;
  private master: GainNode | null = null;
  on = false;

  private ensure() {
    if (this.ctx) return;
    const Ctor =
      window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext;
    this.ctx = new Ctor();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0;
    this.master.connect(this.ctx.destination);

    const filt = this.ctx.createBiquadFilter();
    filt.type = "lowpass";
    filt.frequency.value = 340;
    filt.connect(this.master);

    // Detuned drone stack.
    [55, 82.4, 110, 164.8].forEach((f, i) => {
      const o = this.ctx!.createOscillator();
      o.type = i % 2 ? "sine" : "triangle";
      o.frequency.value = f;
      o.detune.value = (i - 1.5) * 7;
      const g = this.ctx!.createGain();
      g.gain.value = 0.13 / (i + 1);
      o.connect(g);
      g.connect(filt);
      o.start();
    });

    // Breathing: slow LFO on master gain.
    const lfo = this.ctx.createOscillator();
    lfo.frequency.value = 0.07;
    const lfoGain = this.ctx.createGain();
    lfoGain.gain.value = 0.035;
    lfo.connect(lfoGain);
    lfoGain.connect(this.master.gain);
    lfo.start();
  }

  async toggle(): Promise<boolean> {
    this.ensure();
    if (!this.ctx || !this.master) return false;
    if (this.ctx.state === "suspended") await this.ctx.resume();
    this.on = !this.on;
    const now = this.ctx.currentTime;
    this.master.gain.cancelScheduledValues(now);
    this.master.gain.linearRampToValueAtTime(this.on ? 0.5 : 0, now + 1.6);
    if (this.on) this.schedulePing();
    return this.on;
  }

  private pingTimer: number | null = null;
  private schedulePing() {
    if (!this.on) return;
    const delay = 6000 + Math.random() * 6000;
    this.pingTimer = window.setTimeout(() => {
      this.ping();
      this.schedulePing();
    }, delay);
  }

  private ping() {
    if (!this.ctx || !this.master || !this.on) return;
    const t = this.ctx.currentTime;
    const o = this.ctx.createOscillator();
    o.type = "sine";
    o.frequency.value = 1200 + Math.random() * 1600;
    const g = this.ctx.createGain();
    g.gain.setValueAtTime(0, t);
    g.gain.linearRampToValueAtTime(0.07, t + 0.012);
    g.gain.exponentialRampToValueAtTime(0.0001, t + 1.8);
    o.connect(g);
    g.connect(this.master);
    o.start(t);
    o.stop(t + 1.9);
  }
}

export const oracleAudio = new OracleAudio();
