"use client";

import { useEffect } from "react";
import { usePathname } from "next/navigation";
import gsap from "gsap";

/**
 * Hero entrance stagger only. Scroll-reveal and stat bars now live in
 * RevealController (IntersectionObserver). Keyed on pathname so the hero
 * re-animates when navigating back to the home page.
 */
export function GsapController() {
  const pathname = usePathname();

  useEffect(() => {
    let ctx: gsap.Context | undefined;

    const raf = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        gsap.from(".hero-word", {
          opacity: 0,
          y: 50,
          duration: 1.1,
          stagger: 0.12,
          ease: "power3.out",
          delay: 0.2,
        });
        gsap.from(".hero-sub, .hero-ctas", {
          opacity: 0,
          y: 30,
          duration: 1,
          stagger: 0.1,
          ease: "power3.out",
          delay: 0.55,
        });
      });
    });

    return () => {
      cancelAnimationFrame(raf);
      ctx?.revert();
    };
  }, [pathname]);

  return null;
}
