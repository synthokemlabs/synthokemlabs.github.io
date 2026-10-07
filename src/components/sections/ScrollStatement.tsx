"use client";

import { Fragment, useEffect, useRef, useState } from "react";

/**
 * A short company statement whose words light up as it scrolls through the viewport.
 * Without JS, or with reduced motion, the whole statement is shown at full strength.
 */
export function ScrollStatement({ text, className = "" }: { text: string; className?: string }) {
  const ref = useRef<HTMLParagraphElement>(null);
  const words = text.split(" ");
  const [lit, setLit] = useState(words.length);

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const vh = window.innerHeight;
      // 0 when the statement's top reaches 85% of the viewport, 1 when its bottom passes 45%
      const p = Math.min(1, Math.max(0, (vh * 0.85 - r.top) / (r.height + vh * 0.4)));
      setLit(Math.round(p * words.length));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [words.length]);

  return (
    <p ref={ref} className={className}>
      {words.map((w, i) => (
        <Fragment key={i}>
          <span className={`read-word ${i < lit ? "opacity-100" : "opacity-[0.18]"}`}>{w}</span>{" "}
        </Fragment>
      ))}
    </p>
  );
}
