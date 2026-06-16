"use client";

import { useEffect, useRef } from "react";
import { usePathname } from "next/navigation";
import Lenis from "lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

export function SmoothScroller() {
  const pathname = usePathname();
  const lenisRef = useRef<Lenis | null>(null);

  useEffect(() => {
    if (typeof window !== "undefined") {
      window.history.scrollRestoration = "manual";
    }

    const lenis = new Lenis({
      duration: 1.3,
      easing: (t) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      orientation: "vertical",
      gestureOrientation: "vertical",
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 2,
    });

    lenisRef.current = lenis;
    lenis.on("scroll", ScrollTrigger.update);

    gsap.ticker.lagSmoothing(0);
    const tickerFn = (time: number) => lenis.raf(time * 1000);
    gsap.ticker.add(tickerFn);

    // smooth-scroll anchor links through Lenis
    const onClick = (e: MouseEvent) => {
      const a = (e.target as HTMLElement).closest("a[href^='#']") as HTMLAnchorElement | null;
      if (!a) return;
      const id = a.getAttribute("href");
      if (!id || id === "#") return;
      const el = document.querySelector(id);
      if (el) {
        e.preventDefault();
        lenis.scrollTo(el as HTMLElement, { offset: -70 });
      }
    };
    document.addEventListener("click", onClick);

    return () => {
      document.removeEventListener("click", onClick);
      gsap.ticker.lagSmoothing(1);
      gsap.ticker.remove(tickerFn);
      lenis.destroy();
      lenisRef.current = null;
    };
  }, []);

  // On route change, reset scroll position: jump to the top for a fresh page,
  // or to the targeted #section when arriving via an anchored link (e.g. the
  // "REQUEST BRIEFING" button → /#comms). Without this, App-Router navigation
  // keeps the previous scroll offset and pages open mid-way down.
  useEffect(() => {
    const lenis = lenisRef.current;
    if (!lenis) return;

    const hash = window.location.hash;
    const hasHash = hash.length > 1;

    const go = () => {
      const el = hasHash ? document.querySelector(hash) : null;
      if (el) lenis.scrollTo(el as HTMLElement, { offset: -70, immediate: true });
      else lenis.scrollTo(0, { immediate: true });
    };

    const raf = requestAnimationFrame(go);
    // When arriving via an anchored link, the target's position keeps shifting
    // as the freshly-mounted page lays out (demo players, media, fonts). Re-snap
    // to it a few times until the layout settles so we don't land short.
    const timers = hasHash ? [120, 350, 700].map((ms) => window.setTimeout(go, ms)) : [];

    return () => {
      cancelAnimationFrame(raf);
      timers.forEach((t) => window.clearTimeout(t));
    };
  }, [pathname]);

  return null;
}
