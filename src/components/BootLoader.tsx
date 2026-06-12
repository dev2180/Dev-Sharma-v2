"use client";

import { useEffect, useRef, useState } from "react";

const BOOT_LINES = [
  "GRID OS v2.0.26 — BOOT SEQUENCE INITIATED",
  "MOUNTING /dev/portfolio ............ OK",
  "LOADING NEURAL MODULES ............. OK",
  "  > langgraph.runtime .............. OK",
  "  > rag.hybrid_retriever ........... OK",
  "  > prompt.optimizer ............... OK",
  "CALIBRATING RENDER GRID ............ OK",
  "SYNTHESIZING AUDIO ENGINE .......... OK",
  "IDENTITY VERIFIED: DEV SHARMA",
  "CLASS: GENAI ENGINEER · LVL 21",
  "ALL SYSTEMS NOMINAL.",
];

const SEGMENTS = 24;

export function BootLoader() {
  const [lines, setLines] = useState<string[]>([]);
  const [progress, setProgress] = useState(0);
  const [ready, setReady] = useState(false);
  const [exiting, setExiting] = useState(false);
  const [gone, setGone] = useState(false);
  const termRef = useRef<HTMLDivElement>(null);

  // lock scroll while loader is up
  useEffect(() => {
    if (!gone) {
      document.body.style.overflow = "hidden";
      document.body.classList.remove("experience-entered");
    } else {
      document.body.style.overflow = "";
      document.body.classList.add("experience-entered");
    }
    return () => { document.body.style.overflow = ""; };
  }, [gone]);

  // boot line typewriter
  useEffect(() => {
    let i = 0;
    let cancelled = false;

    const next = () => {
      if (cancelled) return;
      if (i < BOOT_LINES.length) {
        const line = BOOT_LINES[i];
        setLines((prev) => [...prev, line]);
        setProgress(Math.round(((i + 1) / BOOT_LINES.length) * 100));
        window.dispatchEvent(new CustomEvent("sfx", { detail: "type" }));
        i++;
        setTimeout(next, 110 + Math.random() * 240);
      } else {
        setTimeout(() => { if (!cancelled) setReady(true); }, 350);
      }
    };
    const t = setTimeout(next, 500);
    return () => { cancelled = true; clearTimeout(t); };
  }, []);

  useEffect(() => {
    termRef.current?.scrollTo({ top: termRef.current.scrollHeight });
  }, [lines]);

  const enter = () => {
    setExiting(true);
    window.dispatchEvent(new Event("grid-enter"));
    window.scrollTo(0, 0);
    setTimeout(() => setGone(true), 900);
  };

  if (gone) return null;

  const litSegs = Math.round((progress / 100) * SEGMENTS);

  return (
    <div
      className="fixed inset-0 flex flex-col items-center justify-center select-none"
      style={{
        zIndex: 99990,
        background: "#04060a",
        transition: "opacity 0.85s cubic-bezier(0.32,0.72,0,1), transform 0.85s cubic-bezier(0.32,0.72,0,1)",
        opacity: exiting ? 0 : 1,
        transform: exiting ? "scale(1.08)" : "scale(1)",
        pointerEvents: exiting ? "none" : "auto",
      }}
    >
      {/* faint grid backdrop */}
      <div
        className="absolute inset-0 pointer-events-none"
        style={{
          backgroundImage:
            "linear-gradient(rgba(255,115,32,0.05) 1px, transparent 1px), linear-gradient(90deg, rgba(255,115,32,0.05) 1px, transparent 1px)",
          backgroundSize: "48px 48px",
          maskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
          WebkitMaskImage: "radial-gradient(ellipse at center, black 30%, transparent 75%)",
        }}
      />

      <div className="relative z-10 flex flex-col items-center px-6 w-full" style={{ maxWidth: 620 }}>
        {/* identity glyph */}
        <p className="hud-label mb-6 flicker-in">SYSTEM // DEV SHARMA</p>

        <h1
          className="font-display neon text-center flicker-in"
          style={{ fontSize: "clamp(2.4rem, 6vw, 4rem)", fontWeight: 800, letterSpacing: "0.12em", marginBottom: "0.4rem" }}
        >
          GRID OS
        </h1>
        <p className="font-mono text-center" style={{ color: "var(--text-mute)", fontSize: "0.68rem", letterSpacing: "0.4em", marginBottom: "2.2rem" }}>
          PORTFOLIO RUNTIME ENVIRONMENT
        </p>

        {/* boot terminal */}
        <div className="terminal w-full hud-corners" style={{ position: "relative", marginBottom: "1.5rem" }}>
          <span className="hud-c" />
          <div className="terminal-titlebar">
            <span className="terminal-dot" style={{ background: "var(--red)" }} />
            <span className="terminal-dot" style={{ background: "var(--primary)" }} />
            <span className="terminal-dot" style={{ background: "var(--green)" }} />
            <span style={{ marginLeft: 6 }}>boot.log</span>
          </div>
          <div ref={termRef} style={{ height: 168, overflow: "hidden", padding: "0.8rem 1rem" }}>
            {lines.map((l, i) => (
              <p key={i} style={{ color: l.includes("OK") ? "var(--text-dim)" : l.includes("VERIFIED") || l.includes("CLASS") ? "var(--cyan)" : l.includes("NOMINAL") ? "var(--green)" : "var(--text-mute)", whiteSpace: "pre" }}>
                {l}
              </p>
            ))}
            {!ready && <span className="typewriter-caret" style={{ background: "var(--green)" }} />}
          </div>
        </div>

        {/* segmented progress */}
        <div className="w-full" style={{ marginBottom: "2rem" }}>
          <div className="flex justify-between font-mono" style={{ fontSize: "0.62rem", letterSpacing: "0.3em", color: "var(--text-mute)", marginBottom: 8 }}>
            <span>{ready ? "READY" : "LOADING"}</span>
            <span style={{ color: "var(--primary)" }}>{progress}%</span>
          </div>
          <div className="boot-seg-track">
            {Array.from({ length: SEGMENTS }).map((_, i) => (
              <span key={i} className={`boot-seg ${i < litSegs ? "lit" : ""}`} />
            ))}
          </div>
        </div>

        {/* start button */}
        <div style={{ height: 76 }} className="flex flex-col items-center justify-center">
          {ready && (
            <>
              <button onClick={enter} className="btn-grid pulse-border flicker-in" style={{ fontSize: "0.85rem", padding: "1rem 2.6rem" }}>
                ▶&nbsp; ENTER THE GRID
              </button>
              <p className="font-mono flicker-in" style={{ fontSize: "0.58rem", letterSpacing: "0.34em", color: "var(--text-mute)", marginTop: 14 }}>
                AUDIO ENGINE ARMED — SOUND ON RECOMMENDED
              </p>
            </>
          )}
        </div>
      </div>
    </div>
  );
}
