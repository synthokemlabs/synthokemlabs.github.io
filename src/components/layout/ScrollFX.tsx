"use client";

import { usePathname } from "next/navigation";
import { useEffect, useRef } from "react";

/**
 * Single rAF-throttled scroll loop for scroll-linked effects:
 *  - `.zoom-parent > img.zoom-img` and `[data-parallax]` drift inside their frame
 *  - `[data-hero-fade]` content lifts and fades as the hero scrolls away
 * Uses the CSS `translate`/`opacity` properties only (compositor-friendly).
 */
export function ScrollFX() {
  const pathname = usePathname();

  // Replay the hero entrance on each route, then pin its final state (see "Animation safety net" in globals.css)
  const firstRoute = useRef(true);
  useEffect(() => {
    const html = document.documentElement;
    // First load is handled by the inline script in layout.tsx; only replay on client-side navigation
    if (!firstRoute.current) html.classList.remove("anim-settled");
    firstRoute.current = false;
    const t = setTimeout(() => html.classList.add("anim-settled"), 2600);
    return () => clearTimeout(t);
  }, [pathname]);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    let parallax: HTMLElement[] = [];
    let fades: HTMLElement[] = [];

    const collect = () => {
      parallax = Array.from(document.querySelectorAll<HTMLElement>(".zoom-parent > img.zoom-img, [data-parallax]"));
      fades = Array.from(document.querySelectorAll<HTMLElement>("[data-hero-fade]"));
    };

    const update = () => {
      const vh = window.innerHeight;
      for (const el of parallax) {
        // Measure the frame, not the moving image, so the drift doesn't feed back into itself
        const r = (el.parentElement ?? el).getBoundingClientRect();
        if (r.bottom < -100 || r.top > vh + 100) continue;
        const speed = Number(el.dataset.parallax) || 0.08;
        // The image is scaled to 1.12 inside its frame: never drift further than that spare 6%, or an edge shows
        const max = el.offsetHeight * 0.054;
        const offset = Math.max(-max, Math.min(max, (r.top + r.height / 2 - vh / 2) * -speed));
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      }
      const y = window.scrollY;
      for (const el of fades) {
        const h = el.offsetHeight || vh;
        const p = Math.min(1, Math.max(0, y / (h * 0.9)));
        el.style.opacity = String(1 - p * 0.85);
        el.style.translate = `0 ${(-p * 90).toFixed(1)}px`;
      }
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };

    // Collect after the route has painted (and again shortly after, for lazily mounted sections)
    collect(); update();
    const t = setTimeout(() => { collect(); update(); }, 600);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => {
      clearTimeout(t); cancelAnimationFrame(raf);
      window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll);
    };
  }, [pathname]);

  return null;
}
