"use client";

import { usePathname } from "next/navigation";
import { useEffect } from "react";
import Lenis from "lenis";

/**
 * Inertial smooth scrolling (Lenis). Native scroll position and scrollbar are kept,
 * so sticky elements, IntersectionObservers and keyboard scrolling keep working.
 * Disabled for reduced-motion users and touch devices (which already scroll smoothly).
 */
export function SmoothScroll() {
  const pathname = usePathname();

  useEffect(() => {
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const coarse = window.matchMedia("(pointer: coarse)").matches;
    if (reduce || coarse) return;

    const lenis = new Lenis({ duration: 1.15, easing: (t) => 1 - Math.pow(1 - t, 4), wheelMultiplier: 1, anchors: { offset: -96 } });
    let raf = 0;
    const loop = (time: number) => { lenis.raf(time); raf = requestAnimationFrame(loop); };
    raf = requestAnimationFrame(loop);
    document.documentElement.classList.add("lenis-on");
    (window as unknown as { __lenis?: Lenis }).__lenis = lenis;

    return () => {
      cancelAnimationFrame(raf);
      lenis.destroy();
      document.documentElement.classList.remove("lenis-on");
      delete (window as unknown as { __lenis?: Lenis }).__lenis;
    };
  }, []);

  // New route: start at the top without an animated jump
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    if (lenis && !window.location.hash) lenis.scrollTo(0, { immediate: true });
  }, [pathname]);

  return null;
}
