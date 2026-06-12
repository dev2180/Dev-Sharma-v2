"use client";

import { useEffect, useRef } from "react";
import gsap from "gsap";

/**
 * Targeting-reticle cursor: a precise dot wrapped by a square
 * reticle that rotates 45° and locks on over interactive
 * elements — game HUD style.
 */
export function SpaceCursor() {
  const dotRef = useRef<HTMLDivElement>(null);
  const ringRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const dot = dotRef.current;
    const ring = ringRef.current;
    if (!dot || !ring) return;

    gsap.set(dot, { x: -100, y: -100 });
    gsap.set(ring, { x: -100, y: -100 });

    const onMouseMove = (e: MouseEvent) => {
      const { clientX, clientY } = e;
      gsap.to(dot, { x: clientX, y: clientY, duration: 0.07, ease: "power2.out" });
      gsap.to(ring, { x: clientX, y: clientY, duration: 0.3, ease: "power3.out" });
    };

    window.addEventListener("mousemove", onMouseMove);

    const SELECTOR = "a, button, [role='button'], details summary, .mission-card, .clickable";

    const onMouseOver = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(SELECTOR);
      if (target) {
        gsap.to(ring, {
          scale: 1.5,
          rotation: 45,
          borderColor: "rgba(255, 115, 32, 0.9)",
          boxShadow: "0 0 16px rgba(255, 115, 32, 0.4)",
          duration: 0.28,
          ease: "power2.out",
        });
        gsap.to(dot, { scale: 0.5, backgroundColor: "#ff7320", duration: 0.28 });
      }
    };

    const onMouseOut = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest(SELECTOR);
      if (target) {
        gsap.to(ring, {
          scale: 1,
          rotation: 0,
          borderColor: "rgba(43, 217, 254, 0.5)",
          boxShadow: "0 0 0px rgba(255, 115, 32, 0)",
          duration: 0.28,
          ease: "power2.out",
        });
        gsap.to(dot, { scale: 1, backgroundColor: "#e8ecf4", duration: 0.28 });
      }
    };

    window.addEventListener("mouseover", onMouseOver);
    window.addEventListener("mouseout", onMouseOut);

    return () => {
      window.removeEventListener("mousemove", onMouseMove);
      window.removeEventListener("mouseover", onMouseOver);
      window.removeEventListener("mouseout", onMouseOut);
    };
  }, []);

  return (
    <>
      <div
        ref={dotRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: 5,
          height: 5,
          background: "#e8ecf4",
          zIndex: 100000,
          transform: "translate(-50%, -50%)",
        }}
      />
      <div
        ref={ringRef}
        className="fixed top-0 left-0 pointer-events-none"
        style={{
          width: 26,
          height: 26,
          border: "1px solid rgba(43, 217, 254, 0.5)",
          zIndex: 99999,
          transform: "translate(-50%, -50%)",
        }}
      />
    </>
  );
}
