"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Simulated screen-recording of an engine running a real session.
 * Behaves like a video: play / pause / restart / seek bar — but it's
 * a live-typed terminal session with keystroke SFX. Zero megabytes.
 *
 * Two captures share the same player:
 *   • "d-rag"     — the RAG engine answering a grounded query
 *   • "deadcrypt" — a file encoded into lossless TV-static video, then
 *                   decoded back byte-for-byte
 */

interface Frame {
  t: number;          // ms timestamp the line appears
  text: string;
  color?: string;
  typed?: boolean;    // typewriter-animate this line
}

interface Capture {
  title: string;      // titlebar label
  duration: number;   // total ms
  script: Frame[];
}

const DRAG_SCRIPT: Frame[] = [
  { t: 0,     text: "$ python cli.py", typed: true, color: "var(--text)" },
  { t: 900,   text: "[boot] embedder all-MiniLM-L6-v2 loaded · 384-dim", color: "var(--text-mute)" },
  { t: 1450,  text: "[boot] qdrant collection 'docs' ready · hybrid dense+sparse", color: "var(--text-mute)" },
  { t: 2000,  text: "[boot] ollama llama3.2 connected @ localhost:11434", color: "var(--text-mute)" },
  { t: 2600,  text: "", },
  { t: 2700,  text: "> what changed in the refund policy after v2?", typed: true, color: "var(--cyan)" },
  { t: 4600,  text: "[optimizer]  3 query variants generated · anaphora resolved", color: "var(--text-dim)" },
  { t: 5400,  text: "[retriever]  hybrid RRF search → 24 candidates", color: "var(--text-dim)" },
  { t: 6200,  text: "[reranker]   cross-encoder ms-marco rescoring → top 6", color: "var(--text-dim)" },
  { t: 7000,  text: "[compressor] 6 → 3 chunks · score ≥ 0.42 · keyword overlap", color: "var(--text-dim)" },
  { t: 7800,  text: "[llm]        streaming answer...", color: "var(--text-dim)" },
  { t: 8600,  text: "ANSWER: Since v2, refunds are processed within 14 days", color: "var(--green)", typed: true },
  { t: 10300, text: "and partial refunds now apply to opened items. [1][2]", color: "var(--green)", typed: true },
  { t: 11900, text: "", },
  { t: 12000, text: "citations  [1] policy_v2.pdf · p.4   [2] changelog.pdf · p.1", color: "var(--cyan)" },
  { t: 12700, text: "metrics    retrieve 142ms · rerank 89ms · llm 1.2s · coverage 87%", color: "var(--primary)" },
];

const DEADCRYPT_SCRIPT: Frame[] = [
  { t: 0,     text: "$ deadcrypt encode secret.zip --resolution 1080p", typed: true, color: "var(--text)" },
  { t: 1100,  text: "[boot]    DeadCrypt v1 · FFV1 lossless · ffmpeg on PATH", color: "var(--text-mute)" },
  { t: 1700,  text: "[boot]    1080p · 1920x1080 · 5.93 MB payload / frame", color: "var(--text-mute)" },
  { t: 2300,  text: "[read]    secret.zip → 4.21 MB", color: "var(--text-dim)" },
  { t: 3000,  text: "[header]  DCRT·v1 · name=secret.zip · size=4,413,952 B", color: "var(--text-dim)" },
  { t: 3800,  text: "[framing] bytes → W×H×3 RGB pixels · 1 frame · zero-padded", color: "var(--text-dim)" },
  { t: 4600,  text: "[render]  static frame written → frame_000001.png", color: "var(--text-dim)" },
  { t: 5400,  text: "[ffmpeg]  mux FFV1 → encoded/secret.zip.mkv", color: "var(--text-dim)" },
  { t: 6200,  text: "Encoded -> encoded/secret.zip.mkv  (4.20 MB)", color: "var(--green)", typed: true },
  { t: 7900,  text: "", },
  { t: 8000,  text: "$ deadcrypt decode encoded/secret.zip.mkv", typed: true, color: "var(--cyan)" },
  { t: 9600,  text: "[ffmpeg]  extract frames → 1 frame", color: "var(--text-dim)" },
  { t: 10300, text: "[pixels]  RGB channels → byte stream · padding trimmed", color: "var(--text-dim)" },
  { t: 11000, text: "[header]  magic OK · secret.zip · 4,413,952 bytes", color: "var(--text-dim)" },
  { t: 11800, text: "Recovered -> decoded/secret.zip  (4.21 MB)", color: "var(--green)", typed: true },
  { t: 13400, text: "verify    sha256 match · byte-for-byte identical ✓", color: "var(--primary)" },
];

const CAPTURES: Record<string, Capture> = {
  "d-rag": {
    title: "d-rag — live session capture",
    duration: 13600,
    script: DRAG_SCRIPT,
  },
  deadcrypt: {
    title: "deadcrypt — live session capture",
    duration: 14800,
    script: DEADCRYPT_SCRIPT,
  },
};

export function DemoPlayer({ variant = "d-rag" }: { variant?: "d-rag" | "deadcrypt" }) {
  const { title, duration: DURATION, script: SCRIPT } = CAPTURES[variant] ?? CAPTURES["d-rag"];

  const [playing, setPlaying] = useState(false);
  const [time, setTime] = useState(0);
  const rafRef = useRef(0);
  const lastTick = useRef(0);
  const bodyRef = useRef<HTMLDivElement>(null);
  const typeSfxAt = useRef(0);

  useEffect(() => {
    if (!playing) return;
    lastTick.current = performance.now();

    const loop = (now: number) => {
      const dt = now - lastTick.current;
      lastTick.current = now;
      setTime((t) => {
        const nt = t + dt;
        if (nt >= DURATION) { setPlaying(false); return DURATION; }
        return nt;
      });
      rafRef.current = requestAnimationFrame(loop);
    };
    rafRef.current = requestAnimationFrame(loop);
    return () => cancelAnimationFrame(rafRef.current);
  }, [playing, DURATION]);

  // typing SFX while a typed line is animating
  useEffect(() => {
    if (!playing) return;
    const active = SCRIPT.find((f) => f.typed && time >= f.t && time < f.t + f.text.length * 35);
    if (active && time - typeSfxAt.current > 70) {
      typeSfxAt.current = time;
      window.dispatchEvent(new CustomEvent("sfx", { detail: "type" }));
    }
  }, [time, playing, SCRIPT]);

  useEffect(() => {
    bodyRef.current?.scrollTo({ top: bodyRef.current.scrollHeight });
  }, [time]);

  const toggle = () => {
    if (time >= DURATION) { setTime(0); setPlaying(true); }
    else setPlaying((p) => !p);
  };

  const restart = () => { setTime(0); setPlaying(true); };

  const seek = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const frac = Math.min(Math.max((e.clientX - rect.left) / rect.width, 0), 1);
    setTime(frac * DURATION);
  };

  const visible = SCRIPT.filter((f) => time >= f.t);
  const fmt = (ms: number) => {
    const s = Math.floor(ms / 1000);
    return `0:${String(s).padStart(2, "0")}`;
  };

  return (
    <div className="terminal hud-corners w-full" style={{ position: "relative" }}>
      <span className="hud-c" />
      <div className="terminal-titlebar">
        <span className="terminal-dot" style={{ background: "var(--red)" }} />
        <span className="terminal-dot" style={{ background: "var(--primary)" }} />
        <span className="terminal-dot" style={{ background: "var(--green)" }} />
        <span style={{ marginLeft: 6 }}>{title}</span>
        <span style={{ marginLeft: "auto", color: "var(--primary)" }}>● REC</span>
      </div>

      {/* screen */}
      <div
        ref={bodyRef}
        style={{ height: 330, overflow: "hidden", padding: "1rem 1.25rem", position: "relative" }}
      >
        {time === 0 && !playing && (
          <div className="absolute inset-0 flex flex-col items-center justify-center" style={{ background: "rgba(4,7,11,0.55)", zIndex: 2 }}>
            <button
              onClick={toggle}
              aria-label="Play demo"
              className="flex items-center justify-center pulse-border"
              style={{
                width: 74, height: 74,
                background: "rgba(255,115,32,0.12)",
                border: "1px solid rgba(255,115,32,0.6)",
                clipPath: "polygon(12px 0, 100% 0, 100% calc(100% - 12px), calc(100% - 12px) 100%, 0 100%, 0 12px)",
              }}
            >
              <svg width="22" height="22" viewBox="0 0 24 24" fill="var(--primary)"><polygon points="6 3 21 12 6 21 6 3" /></svg>
            </button>
            <p className="font-mono" style={{ fontSize: "0.6rem", letterSpacing: "0.32em", color: "var(--text-mute)", marginTop: 16 }}>
              PLAY MISSION CAPTURE
            </p>
          </div>
        )}

        {visible.map((f, i) => {
          let text = f.text;
          if (f.typed) {
            const chars = Math.floor((time - f.t) / 35);
            text = f.text.slice(0, Math.max(0, chars));
          }
          return (
            <p key={i} style={{ color: f.color || "var(--text-dim)", whiteSpace: "pre-wrap", minHeight: "1.4em" }}>
              {text}
              {f.typed && text.length < f.text.length && <span className="typewriter-caret" />}
            </p>
          );
        })}
      </div>

      {/* transport bar */}
      <div
        className="flex items-center gap-4"
        style={{ padding: "0.7rem 1rem", borderTop: "1px solid var(--line)" }}
      >
        <button onClick={toggle} aria-label={playing ? "Pause" : "Play"} className="flex items-center justify-center" style={{ width: 30, height: 30, background: "rgba(255,115,32,0.1)", border: "1px solid rgba(255,115,32,0.4)" }}>
          {playing ? (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--primary)"><rect x="5" y="4" width="5" height="16" /><rect x="14" y="4" width="5" height="16" /></svg>
          ) : (
            <svg width="11" height="11" viewBox="0 0 24 24" fill="var(--primary)"><polygon points="6 3 21 12 6 21 6 3" /></svg>
          )}
        </button>
        <button onClick={restart} aria-label="Restart" className="flex items-center justify-center" style={{ width: 30, height: 30, background: "rgba(255,255,255,0.03)", border: "1px solid var(--line-dim)" }}>
          <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="var(--text-dim)" strokeWidth="2.4"><path d="M3 12a9 9 0 1 0 3-6.7" /><polyline points="3 2 3 8 9 8" /></svg>
        </button>

        <div onClick={seek} className="clickable" style={{ flex: 1, height: 18, display: "flex", alignItems: "center" }}>
          <div style={{ width: "100%", height: 5, background: "rgba(255,255,255,0.07)", position: "relative" }}>
            <div style={{ position: "absolute", inset: 0, width: `${(time / DURATION) * 100}%`, background: "var(--primary)", boxShadow: "0 0 8px var(--primary-glow)" }} />
          </div>
        </div>

        <span className="font-mono" style={{ fontSize: "0.62rem", color: "var(--text-mute)", letterSpacing: "0.1em" }}>
          {fmt(time)} / {fmt(DURATION)}
        </span>
      </div>
    </div>
  );
}
