"use client";

import { useEffect, useRef, useState } from "react";

/**
 * GRID OS sound engine — everything is synthesized live with the
 * Web Audio API. No audio files, no copyright, instant load.
 *
 *  - UI SFX: clicks, hovers, keystrokes, boot blips, confirm chimes
 *  - Generative ambient soundtrack: slow minor-pentatonic arpeggio
 *    over a detuned drone pad, run through a feedback delay.
 *
 * Other components trigger SFX via:  window.dispatchEvent(new CustomEvent("sfx", { detail: "click" }))
 */

type SfxName = "click" | "hover" | "type" | "boot" | "confirm" | "deny" | "whoosh";

class GridAudio {
  ctx: AudioContext;
  master: GainNode;
  sfxBus: GainNode;
  musicBus: GainNode;
  delay: DelayNode;
  musicTimer: number | null = null;
  musicOn = false;
  lastHover = 0;

  constructor() {
    this.ctx = new (window.AudioContext || (window as unknown as { webkitAudioContext: typeof AudioContext }).webkitAudioContext)();
    this.master = this.ctx.createGain();
    this.master.gain.value = 0.9;
    this.master.connect(this.ctx.destination);

    this.sfxBus = this.ctx.createGain();
    this.sfxBus.gain.value = 0.5;
    this.sfxBus.connect(this.master);

    this.musicBus = this.ctx.createGain();
    this.musicBus.gain.value = 0;
    this.musicBus.connect(this.master);

    // shared feedback delay for the soundtrack
    this.delay = this.ctx.createDelay(2);
    this.delay.delayTime.value = 0.42;
    const fb = this.ctx.createGain();
    fb.gain.value = 0.38;
    const damp = this.ctx.createBiquadFilter();
    damp.type = "lowpass";
    damp.frequency.value = 2200;
    this.delay.connect(fb);
    fb.connect(damp);
    damp.connect(this.delay);
    this.delay.connect(this.musicBus);
  }

  /* ── tiny synth helpers ─────────────────────────────────────── */
  blip(freq: number, dur: number, type: OscillatorType, vol: number, when = 0, slideTo?: number) {
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = type;
    osc.frequency.setValueAtTime(freq, t0);
    if (slideTo) osc.frequency.exponentialRampToValueAtTime(slideTo, t0 + dur);
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.006);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + dur);
    osc.connect(g);
    g.connect(this.sfxBus);
    osc.start(t0);
    osc.stop(t0 + dur + 0.05);
  }

  noiseBurst(dur: number, vol: number, freq: number, when = 0) {
    const t0 = this.ctx.currentTime + when;
    const len = Math.max(1, Math.floor(this.ctx.sampleRate * dur));
    const buf = this.ctx.createBuffer(1, len, this.ctx.sampleRate);
    const data = buf.getChannelData(0);
    for (let i = 0; i < len; i++) data[i] = (Math.random() * 2 - 1) * (1 - i / len);
    const src = this.ctx.createBufferSource();
    src.buffer = buf;
    const flt = this.ctx.createBiquadFilter();
    flt.type = "bandpass";
    flt.frequency.value = freq;
    flt.Q.value = 1.1;
    const g = this.ctx.createGain();
    g.gain.value = vol;
    src.connect(flt); flt.connect(g); g.connect(this.sfxBus);
    src.start(t0);
  }

  play(name: SfxName) {
    if (this.ctx.state === "suspended") this.ctx.resume();
    switch (name) {
      case "click":
        this.blip(1250, 0.06, "square", 0.16);
        this.blip(2400, 0.04, "sine", 0.1, 0.012);
        break;
      case "hover": {
        const now = performance.now();
        if (now - this.lastHover < 90) return; // throttle
        this.lastHover = now;
        this.blip(1850, 0.035, "sine", 0.055);
        break;
      }
      case "type":
        this.blip(900 + Math.random() * 500, 0.025, "square", 0.05);
        break;
      case "boot":
        this.blip(160, 0.5, "sawtooth", 0.12, 0, 420);
        this.blip(640, 0.18, "square", 0.08, 0.1);
        this.noiseBurst(0.3, 0.06, 1400, 0);
        break;
      case "confirm":
        this.blip(523, 0.12, "triangle", 0.16);
        this.blip(784, 0.14, "triangle", 0.16, 0.09);
        this.blip(1047, 0.3, "triangle", 0.14, 0.18);
        break;
      case "deny":
        this.blip(220, 0.16, "sawtooth", 0.14, 0, 160);
        break;
      case "whoosh":
        this.noiseBurst(0.5, 0.1, 600);
        break;
    }
  }

  /* ── generative soundtrack ──────────────────────────────────── */
  padNote(freq: number, dur: number, vol: number) {
    const t0 = this.ctx.currentTime;
    [0, 4.5, -3.5].forEach((cents) => {
      const osc = this.ctx.createOscillator();
      const g = this.ctx.createGain();
      const flt = this.ctx.createBiquadFilter();
      flt.type = "lowpass";
      flt.frequency.setValueAtTime(420, t0);
      flt.frequency.linearRampToValueAtTime(900, t0 + dur * 0.5);
      flt.frequency.linearRampToValueAtTime(380, t0 + dur);
      osc.type = "sawtooth";
      osc.frequency.value = freq * Math.pow(2, cents / 1200);
      g.gain.setValueAtTime(0, t0);
      g.gain.linearRampToValueAtTime(vol, t0 + dur * 0.35);
      g.gain.linearRampToValueAtTime(0.0001, t0 + dur);
      osc.connect(flt); flt.connect(g); g.connect(this.musicBus);
      osc.start(t0);
      osc.stop(t0 + dur + 0.1);
    });
  }

  arpNote(freq: number, vol: number, when: number) {
    const t0 = this.ctx.currentTime + when;
    const osc = this.ctx.createOscillator();
    const g = this.ctx.createGain();
    osc.type = "triangle";
    osc.frequency.value = freq;
    g.gain.setValueAtTime(0, t0);
    g.gain.linearRampToValueAtTime(vol, t0 + 0.015);
    g.gain.exponentialRampToValueAtTime(0.0001, t0 + 0.55);
    osc.connect(g);
    g.connect(this.delay);
    g.connect(this.musicBus);
    osc.start(t0);
    osc.stop(t0 + 0.7);
  }

  startMusic() {
    if (this.musicOn) return;
    this.musicOn = true;
    if (this.ctx.state === "suspended") this.ctx.resume();
    this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime);
    this.musicBus.gain.linearRampToValueAtTime(0.32, this.ctx.currentTime + 2.5);

    // D minor world: roots D2/A2/Bb2/F2, arp from D minor pentatonic
    const roots = [73.42, 110.0, 116.54, 87.31];
    const scale = [293.66, 349.23, 392.0, 440.0, 523.25, 587.33]; // D F G A C D
    let bar = 0;

    const loop = () => {
      if (!this.musicOn) return;
      const root = roots[bar % roots.length];
      this.padNote(root, 6.4, 0.05);
      this.padNote(root * 1.5, 6.4, 0.025);

      // 8-step arpeggio, sparse + random octave lifts
      for (let s = 0; s < 8; s++) {
        if (Math.random() < 0.28) continue;
        const n = scale[Math.floor(Math.random() * scale.length)];
        const oct = Math.random() < 0.22 ? 2 : 1;
        this.arpNote(n * oct, 0.05, s * 0.75);
      }
      bar++;
      this.musicTimer = window.setTimeout(loop, 6000);
    };
    loop();
  }

  stopMusic() {
    this.musicOn = false;
    if (this.musicTimer) clearTimeout(this.musicTimer);
    this.musicBus.gain.cancelScheduledValues(this.ctx.currentTime);
    this.musicBus.gain.linearRampToValueAtTime(0, this.ctx.currentTime + 0.8);
  }
}

export function SoundSystem() {
  const audioRef = useRef<GridAudio | null>(null);
  const [musicOn, setMusicOn] = useState(false);
  const [entered, setEntered] = useState(false);

  useEffect(() => {
    const ensure = () => {
      if (!audioRef.current) audioRef.current = new GridAudio();
      return audioRef.current;
    };

    // custom event channel for any component
    const onSfx = (e: Event) => {
      ensure().play((e as CustomEvent).detail as SfxName);
    };
    window.addEventListener("sfx", onSfx);

    // experience start → boot sound + soundtrack
    const onEnter = () => {
      const a = ensure();
      a.play("confirm");
      a.startMusic();
      setMusicOn(true);
      setEntered(true);
    };
    window.addEventListener("grid-enter", onEnter);

    // global UI sounds via event delegation
    const onPointerDown = (e: PointerEvent) => {
      const el = (e.target as HTMLElement).closest("a, button, [role='button'], details summary");
      if (el) ensure().play("click");
    };
    const onMouseOver = (e: MouseEvent) => {
      const el = (e.target as HTMLElement).closest("a, button, [role='button'], details summary");
      if (el) ensure().play("hover");
    };
    window.addEventListener("pointerdown", onPointerDown, true);
    window.addEventListener("mouseover", onMouseOver, true);

    return () => {
      window.removeEventListener("sfx", onSfx);
      window.removeEventListener("grid-enter", onEnter);
      window.removeEventListener("pointerdown", onPointerDown, true);
      window.removeEventListener("mouseover", onMouseOver, true);
      audioRef.current?.stopMusic();
      audioRef.current?.ctx.close();
      audioRef.current = null;
    };
  }, []);

  const toggleMusic = () => {
    const a = audioRef.current;
    if (!a) return;
    if (musicOn) { a.stopMusic(); setMusicOn(false); }
    else { a.startMusic(); setMusicOn(true); }
  };

  if (!entered) return null;

  return (
    <button
      onClick={toggleMusic}
      aria-label={musicOn ? "Mute soundtrack" : "Play soundtrack"}
      className="fixed bottom-6 right-6 z-50 flex items-center justify-center"
      style={{
        width: 46,
        height: 46,
        background: "rgba(8,12,18,0.85)",
        border: "1px solid rgba(255,115,32,0.4)",
        clipPath: "polygon(8px 0, 100% 0, 100% calc(100% - 8px), calc(100% - 8px) 100%, 0 100%, 0 8px)",
        backdropFilter: "blur(10px)",
      }}
    >
      {musicOn ? (
        <span className="flex items-end" style={{ gap: 3, height: 16 }}>
          {[60, 100, 45, 80].map((h, i) => (
            <span
              key={i}
              style={{
                width: 3,
                height: `${h}%`,
                background: "var(--primary)",
                boxShadow: "0 0 6px rgba(255,115,32,0.7)",
                animation: `soundbar 0.7s ease-in-out ${i * 0.12}s infinite alternate`,
              }}
            />
          ))}
          <style>{`@keyframes soundbar { from { transform: scaleY(0.3);} to { transform: scaleY(1);} }`}</style>
        </span>
      ) : (
        <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="rgba(255,115,32,0.7)" strokeWidth="2" strokeLinecap="round">
          <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5" />
          <line x1="23" y1="9" x2="17" y2="15" />
          <line x1="17" y1="9" x2="23" y2="15" />
        </svg>
      )}
    </button>
  );
}
