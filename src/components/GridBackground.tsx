"use client";

import { useEffect, useRef } from "react";

/**
 * Animated neon perspective grid — the "game world" backdrop.
 * A floor grid rushes toward a glowing horizon; light streaks
 * ride the lanes. Speed reacts to scroll velocity.
 */
export function GridBackground() {
  const canvasRef = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let destroyed = false;
    let raf = 0;

    let W = (canvas.width = window.innerWidth);
    let H = (canvas.height = window.innerHeight);

    // Scroll-reactive speed
    let lastScrollY = window.scrollY;
    let scrollBoost = 0;

    const onScroll = () => {
      const dy = Math.abs(window.scrollY - lastScrollY);
      lastScrollY = window.scrollY;
      scrollBoost = Math.min(scrollBoost + dy * 0.004, 3.5);
    };
    window.addEventListener("scroll", onScroll, { passive: true });

    const onResize = () => {
      W = canvas.width = window.innerWidth;
      H = canvas.height = window.innerHeight;
    };
    window.addEventListener("resize", onResize, { passive: true });

    // Light streaks racing along grid lanes
    interface Streak {
      lane: number;      // -1..1 horizontal position at horizon
      z: number;         // 0 (horizon) → 1 (camera)
      speed: number;
      color: string;
      width: number;
    }
    const streaks: Streak[] = [];
    const spawnStreak = () => {
      const cyan = Math.random() < 0.35;
      streaks.push({
        lane: (Math.random() * 2 - 1) * 0.85,
        z: 0,
        speed: 0.002 + Math.random() * 0.004,
        color: cyan ? "43, 217, 254" : "255, 115, 32",
        width: 1.5 + Math.random() * 2,
      });
    };

    let t = 0;
    let gridOffset = 0;

    const draw = () => {
      if (destroyed) return;
      t += 0.016;
      scrollBoost *= 0.96; // decay
      const speed = 0.35 + scrollBoost;

      ctx.clearRect(0, 0, W, H);

      const horizonY = H * 0.42;
      const vpX = W / 2;

      // ── Sky glow above horizon
      const sky = ctx.createLinearGradient(0, 0, 0, horizonY);
      sky.addColorStop(0, "rgba(4, 6, 10, 0)");
      sky.addColorStop(0.75, "rgba(255, 115, 32, 0.025)");
      sky.addColorStop(1, "rgba(255, 115, 32, 0.10)");
      ctx.fillStyle = sky;
      ctx.fillRect(0, 0, W, horizonY);

      // ── Horizon line
      ctx.strokeStyle = "rgba(255, 115, 32, 0.65)";
      ctx.shadowColor = "rgba(255, 115, 32, 0.8)";
      ctx.shadowBlur = 14;
      ctx.lineWidth = 1.4;
      ctx.beginPath();
      ctx.moveTo(0, horizonY);
      ctx.lineTo(W, horizonY);
      ctx.stroke();
      ctx.shadowBlur = 0;

      // ── Vertical (converging) grid lines
      const VLINES = 26;
      for (let i = 0; i <= VLINES; i++) {
        const frac = i / VLINES;             // 0..1
        const spread = (frac * 2 - 1);       // -1..1
        const xBottom = vpX + spread * W * 1.25;
        const alpha = 0.16 * (1 - Math.abs(spread) * 0.55);
        ctx.strokeStyle = `rgba(255, 115, 32, ${alpha})`;
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(vpX + spread * W * 0.04, horizonY);
        ctx.lineTo(xBottom, H);
        ctx.stroke();
      }

      // ── Horizontal grid lines rushing toward camera
      gridOffset = (gridOffset + speed * 0.012) % 1;
      const HLINES = 16;
      for (let i = 0; i < HLINES; i++) {
        let z = i / HLINES + gridOffset;
        if (z > 1) z -= 1;
        // perspective: z 0 at horizon, 1 at camera
        const pz = Math.pow(z, 2.6);
        const y = horizonY + pz * (H - horizonY);
        const alpha = 0.05 + pz * 0.22;
        ctx.strokeStyle = `rgba(255, 115, 32, ${alpha})`;
        ctx.lineWidth = 0.8 + pz * 1.4;
        ctx.beginPath();
        ctx.moveTo(0, y);
        ctx.lineTo(W, y);
        ctx.stroke();
      }

      // ── Light streaks
      if (Math.random() < 0.025 + scrollBoost * 0.01 && streaks.length < 14) spawnStreak();
      for (let i = streaks.length - 1; i >= 0; i--) {
        const s = streaks[i];
        s.z += s.speed * (1 + scrollBoost * 0.8);
        if (s.z >= 1) { streaks.splice(i, 1); continue; }
        const pz = Math.pow(s.z, 2.6);
        const y = horizonY + pz * (H - horizonY);
        const x = vpX + s.lane * (W * 0.04 + pz * W * 1.2);
        const tail = 30 + pz * 130;
        const pzTail = Math.pow(Math.max(s.z - 0.06, 0), 2.6);
        const yTail = horizonY + pzTail * (H - horizonY);
        const xTail = vpX + s.lane * (W * 0.04 + pzTail * W * 1.2);

        const grad = ctx.createLinearGradient(xTail, yTail, x, y);
        grad.addColorStop(0, `rgba(${s.color}, 0)`);
        grad.addColorStop(1, `rgba(${s.color}, ${0.25 + pz * 0.6})`);
        ctx.strokeStyle = grad;
        ctx.lineWidth = s.width * (0.4 + pz);
        ctx.shadowColor = `rgba(${s.color}, 0.7)`;
        ctx.shadowBlur = 8;
        ctx.beginPath();
        ctx.moveTo(xTail, yTail);
        ctx.lineTo(x, y);
        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // ── Floating data particles above horizon
      ctx.fillStyle = "rgba(43, 217, 254, 0.35)";
      for (let i = 0; i < 18; i++) {
        const px = ((i * 397.3 + t * (6 + (i % 5) * 3)) % (W + 40)) - 20;
        const py = (Math.sin(i * 2.7 + t * 0.4) * 0.5 + 0.5) * horizonY * 0.85;
        const size = 1 + (i % 3) * 0.6;
        ctx.globalAlpha = 0.15 + (Math.sin(t * 1.4 + i) * 0.5 + 0.5) * 0.3;
        ctx.fillRect(px, py, size, size);
      }
      ctx.globalAlpha = 1;

      raf = requestAnimationFrame(draw);
    };

    raf = requestAnimationFrame(draw);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onResize);
    };
  }, []);

  return (
    <>
      <canvas
        ref={canvasRef}
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
        style={{ zIndex: -20, opacity: 0.85 }}
      />
      {/* darkening overlay so content stays readable */}
      <div
        className="fixed top-0 left-0 w-screen h-screen pointer-events-none"
        style={{ zIndex: -10, background: "radial-gradient(ellipse at 50% 38%, transparent 0%, rgba(4,6,10,0.72) 78%)" }}
      />
    </>
  );
}
