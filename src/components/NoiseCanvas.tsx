"use client";

import { useEffect, useRef } from "react";

/**
 * Animated RGB static — the DeadCrypt visual. Random pixel noise
 * with occasional horizontal "signal tears", like a dead TV channel
 * that is secretly carrying data.
 */
export function NoiseCanvas({ height = 240 }: { height?: number }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let destroyed = false;
    let raf = 0;

    const resize = () => {
      canvas.width = canvas.offsetWidth / 3;   // chunky pixels
      canvas.height = canvas.offsetHeight / 3;
    };
    resize();
    window.addEventListener("resize", resize, { passive: true });

    let frame = 0;
    const draw = () => {
      if (destroyed) return;
      frame++;
      const { width: w, height: h } = canvas;
      const img = ctx.createImageData(w, h);
      const d = img.data;
      for (let i = 0; i < d.length; i += 4) {
        const v = Math.random() * 255;
        // bias toward warm static so it matches the grid palette
        d[i] = v;
        d[i + 1] = v * 0.72;
        d[i + 2] = v * 0.55;
        d[i + 3] = 255;
      }
      ctx.putImageData(img, 0, 0);

      // signal tear lines
      if (frame % 7 === 0) {
        const y = Math.floor(Math.random() * h);
        ctx.fillStyle = "rgba(43, 217, 254, 0.55)";
        ctx.fillRect(0, y, w, 1);
      }
      raf = requestAnimationFrame(draw);
    };
    raf = requestAnimationFrame(draw);

    return () => {
      destroyed = true;
      cancelAnimationFrame(raf);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return (
    <canvas
      ref={ref}
      style={{ width: "100%", height, display: "block", imageRendering: "pixelated", opacity: 0.55 }}
    />
  );
}
