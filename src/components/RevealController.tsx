"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";

/**
 * Scroll-reveal driven by IntersectionObserver instead of GSAP ScrollTrigger.
 *
 * Why: ScrollTrigger had to be refreshed at exactly the right moment (after the
 * boot loader released scroll, after fonts/layout settled) or lower `.reveal`
 * sections stayed invisible-but-clickable. It also only ran once, so App-Router
 * client navigation left project pages and the returned-to homepage with no
 * reveal triggers and dead stat bars.
 *
 * IntersectionObserver is deterministic, fires on real scroll regardless of
 * Lenis, and this controller re-initialises on every route change.
 */
export function RevealController() {
  const pathname = usePathname();

  useEffect(() => {
    let cleanup = () => {};
    let cancelled = false;

    // Wait one frame so the newly-navigated route's DOM is committed.
    const raf = requestAnimationFrame(() => {
      if (cancelled) return;

      const reveals = Array.from(document.querySelectorAll<HTMLElement>(".reveal"));
      reveals.forEach((el) => el.classList.remove("is-visible"));

      // No negative bottom margin: at max scroll the page can't move further,
      // so a negative bottom margin would trap the footer in a permanent
      // dead zone and never reveal it.
      const io = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              e.target.classList.add("is-visible");
              io.unobserve(e.target);
            }
          });
        },
        { rootMargin: "0px", threshold: 0.01 }
      );
      reveals.forEach((el) => io.observe(el));

      // Player stat bars fill as they enter view. Observe the full-size track,
      // not the zero-width fill (a zero-area target never reliably intersects).
      const bars = Array.from(document.querySelectorAll<HTMLElement>(".stat-anim"));
      bars.forEach((el) => { el.style.width = "0%"; });
      const ioBars = new IntersectionObserver(
        (entries) => {
          entries.forEach((e) => {
            if (e.isIntersecting) {
              const fill = e.target.querySelector<HTMLElement>(".stat-anim");
              if (fill) fill.style.width = `${Number(fill.dataset.value || 0)}%`;
              ioBars.unobserve(e.target);
            }
          });
        },
        { threshold: 0.25 }
      );
      bars.forEach((el) => { if (el.parentElement) ioBars.observe(el.parentElement); });

      cleanup = () => { io.disconnect(); ioBars.disconnect(); };
    });

    return () => {
      cancelled = true;
      cancelAnimationFrame(raf);
      cleanup();
    };
  }, [pathname]);

  return null;
}
