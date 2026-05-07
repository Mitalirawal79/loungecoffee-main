import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Site-wide buttery smooth scrolling (Lenis).
 * Mounted once at app root. No layout changes — only scroll behaviour.
 */
export const SmoothScroll = () => {
  useEffect(() => {
    // Respect reduced motion
    const prefersReduced = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReduced) return;

    const lenis = new Lenis({
      duration: 1.25,
      easing: (t: number) => Math.min(1, 1.001 - Math.pow(2, -10 * t)),
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.2,
    });

    let rafId = 0;
    const raf = (time: number) => {
      lenis.raf(time);
      rafId = requestAnimationFrame(raf);
    };
    rafId = requestAnimationFrame(raf);

    // Notify framer-motion / scroll listeners
    const onScroll = () => window.dispatchEvent(new Event("scroll"));
    lenis.on("scroll", onScroll);

    return () => {
      cancelAnimationFrame(rafId);
      lenis.destroy();
    };
  }, []);

  return null;
};
