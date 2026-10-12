"use client";

import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";

/** "Back to top" button with a ring showing how far down the page you are. */
export function BackToTop() {
  const [show, setShow] = useState(false);
  const ref = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    let raf = 0;
    const update = () => {
      const max = document.documentElement.scrollHeight - window.innerHeight;
      const p = max > 0 ? window.scrollY / max : 0;
      ref.current?.style.setProperty("--p", p.toFixed(3));
      setShow(window.scrollY > window.innerHeight * 1.2);
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  return (
    <button
      ref={ref}
      type="button"
      aria-label="Back to top"
      onClick={() => {
        const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
        const lenis = (window as unknown as { __lenis?: { scrollTo(y: number): void } }).__lenis;
        if (lenis) lenis.scrollTo(0); else window.scrollTo({ top: 0, behavior: reduce ? "auto" : "smooth" });
        document.getElementById("main")?.focus({ preventScroll: true });
      }}
      className={`no-print progress-ring group fixed bottom-[84px] right-4 z-40 grid h-12 w-12 cursor-pointer place-items-center rounded-full bg-white text-primary shadow-[0_12px_30px_-12px_rgb(10_45_80/0.45)] ring-1 ring-border transition-all duration-500 hover:-translate-y-1 hover:text-accent-strong lg:bottom-24 lg:right-7 ${
        show ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"
      }`}
    >
      <svg viewBox="0 0 36 36" className="absolute inset-0 h-full w-full -rotate-90" aria-hidden="true">
        <circle cx="18" cy="18" r="16" fill="none" stroke="var(--border)" strokeWidth="2" pathLength={100} />
        <circle className="bar" cx="18" cy="18" r="16" fill="none" stroke="var(--accent)" strokeWidth="2" strokeLinecap="round" pathLength={100} />
      </svg>
      <Icon name="arrowRight" size={18} className="-rotate-90 transition-transform group-hover:-translate-y-0.5" />
    </button>
  );
}
