"use client";

import { useEffect, useLayoutEffect, useRef, useState, type ReactNode, type CSSProperties, type ElementType } from "react";
import { Icon } from "./Icon";

/** Fades/slides children in when they enter the viewport. Content is visible without JS and under reduced motion. */
export function Reveal({ children, delay = 0, className = "", as: Tag = "div", variant = "up" }: { children: ReactNode; delay?: number; className?: string; as?: "div" | "li" | "section" | "article" | "ol" | "ul"; variant?: "up" | "left" | "right" | "scale" | "image" }) {
  const ref = useRef<HTMLElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    // Already scrolled past (restored scroll position or an anchor jump): show immediately
    if (!("IntersectionObserver" in window) || el.getBoundingClientRect().bottom < 0) { el.classList.add("is-visible", "settled"); return; }
    let settleTimer: ReturnType<typeof setTimeout> | undefined;
    const reveal = () => {
      if (el.classList.contains("is-visible")) return;
      el.classList.add("is-visible");
      io.unobserve(el);
      settleTimer = setTimeout(() => el.classList.add("settled"), 2200 + delay); // safety net if transitions stall
    };
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting || e.boundingClientRect.bottom < 0) reveal(); }),
      { rootMargin: "0px 0px -10% 0px", threshold: 0.12 },
    );
    io.observe(el);
    // Fallback: if the layout shifted after load without a scroll, the observer can miss elements that are
    // already on screen — reveal anything sitting in (or above) the viewport.
    const check = () => { if (el.getBoundingClientRect().top < window.innerHeight * 0.95) reveal(); };
    const fallback = setTimeout(check, 1400);
    window.addEventListener("load", check);
    return () => { io.disconnect(); clearTimeout(fallback); clearTimeout(settleTimer); window.removeEventListener("load", check); };
  }, [delay]);
  const Comp = Tag as ElementType;
  return (
    <Comp ref={ref} className={`reveal ${variant !== "up" ? `reveal-${variant}` : ""} ${className}`} style={{ "--reveal-delay": `${delay}ms` } as CSSProperties}>
      {children}
    </Comp>
  );
}

/**
 * Odometer-style figure: each digit rolls up to a verified value once visible.
 * Server HTML (and no-JS / reduced motion) shows the final value; screen readers get the plain number.
 */
export function Counter({ value, suffix = "" }: { value: number; suffix?: string; duration?: number }) {
  const ref = useRef<HTMLSpanElement>(null);
  const [state, setState] = useState<"final" | "armed" | "rolling">("final");
  useLayoutEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    setState("armed"); // park every digit at 0 before the first client paint
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      io.disconnect();
      requestAnimationFrame(() => setState("rolling"));
    }, { threshold: 0.5 });
    io.observe(el);
    // Safety net: never leave a figure parked at zero
    const t = setTimeout(() => setState((s) => (s === "armed" ? "rolling" : s)), 6000);
    return () => { io.disconnect(); clearTimeout(t); };
  }, [value]);
  const chars = String(value).split("");
  return (
    <span ref={ref} className="odo" aria-label={`${value}${suffix}`} role="img">
      {chars.map((ch, i) => (
        /\d/.test(ch) ? (
          <span key={i} className="odo-col" aria-hidden="true">
            <span className="invisible">{ch}</span>
            <span
              className={`odo-strip ${state === "rolling" ? "is-rolling" : ""}`}
              style={{ transform: `translateY(-${(state === "armed" ? 0 : Number(ch)) * 10}%)`, transitionDelay: `${(chars.length - 1 - i) * 90}ms` }}
            >
              {"0123456789".split("").map((d) => <span key={d}>{d}</span>)}
            </span>
          </span>
        ) : <span key={i} aria-hidden="true">{ch}</span>
      ))}
      {suffix && <span aria-hidden="true" className={`odo-suffix ${state === "armed" ? "opacity-0" : "opacity-100"}`}>{suffix}</span>}
    </span>
  );
}

/** Copies text to the clipboard with visible + announced feedback. */
export function CopyButton({ text, label, className = "", tone = "dark" }: { text: string; label: string; className?: string; tone?: "dark" | "light" }) {
  const [copied, setCopied] = useState(false);
  async function copy() {
    try {
      await navigator.clipboard.writeText(text);
    } catch {
      const ta = document.createElement("textarea");
      ta.value = text; document.body.appendChild(ta); ta.select(); document.execCommand("copy"); ta.remove();
    }
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  }
  return (
    <button
      type="button"
      onClick={copy}
      className={`inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-lg px-3 text-sm font-medium transition-colors ${tone === "light" ? "text-on-dark hover:bg-white/10" : "text-primary hover:bg-primary-tint"} ${className}`}
      aria-label={copied ? `${label} copied` : `Copy ${label}`}
    >
      <Icon name={copied ? "check" : "copy"} size={16} />
      <span>{copied ? "Copied" : "Copy"}</span>
      <span className="sr-only" role="status" aria-live="polite">{copied ? `${label} copied to clipboard` : ""}</span>
    </button>
  );
}

/** Lightweight scroll parallax (transform only). Disabled under reduced motion. */
export function Parallax({ children, speed = 0.18, className = "" }: { children: ReactNode; speed?: number; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let raf = 0;
    const update = () => { el.style.transform = `translate3d(0, ${Math.min(window.scrollY, 1200) * speed}px, 0)`; };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, [speed]);
  return <div ref={ref} className={`will-change-transform ${className}`}>{children}</div>;
}
