"use client";

import { useEffect } from "react";
import gsap from "gsap";
import ScrollTrigger from "gsap/ScrollTrigger";

export function GsapController() {
  useEffect(() => {
    gsap.registerPlugin(ScrollTrigger);

    let ctx: gsap.Context | undefined;

    const raf = requestAnimationFrame(() => {
      ctx = gsap.context(() => {
        // Scroll-reveal: fade + lift + unblur every .reveal element as it enters
        gsap.utils.toArray<HTMLElement>(".reveal").forEach((el) => {
          gsap.to(el, {
            opacity: 1,
            y: 0,
            filter: "blur(0px)",
            duration: 1,
            ease: "power3.out",
            scrollTrigger: {
              trigger: el,
              start: "top 88%",
              toggleActions: "play none none none",
            },
          });
        });

        // Hero entrance: words + sub + CTAs stagger in once experience starts
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
  }, []);

  return null;
}
