"use client";

import { useEffect, useId, useRef, useState, type CSSProperties, type ReactNode } from "react";
import { Icon, iconPath, type IconName } from "@/components/ui/Icon";
import { ALL_BENEFITS, COVERS } from "@/data/employee-life";

// Fixed precision keeps server and client markup identical
const round = (n: number) => Math.round(n * 100) / 100;
const reducedMotion = () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

/** True while the element is on screen — used to pause auto-cycling widgets off-screen. */
function useInView<T extends Element>(threshold = 0.3) {
  const ref = useRef<T>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { threshold });
    io.observe(el);
    return () => io.disconnect();
  }, [threshold]);
  return [ref, inView] as const;
}

/** A 24×24 icon drawn inside a larger SVG, centred on the current origin. */
function SvgIcon({ name, size = 24, ...rest }: { name: IconName; size?: number } & React.SVGProps<SVGGElement>) {
  return (
    <g {...rest}>
      <path d={iconPath(name)} transform={`scale(${size / 24}) translate(-12 -12)`} fill="none" stroke="currentColor" strokeWidth={1.8} strokeLinecap="round" strokeLinejoin="round" vectorEffect="non-scaling-stroke" />
    </g>
  );
}

/* ------------------------------------------------------------------ */
/* Hero: every benefit on one ring. A hand turns from the centre to    */
/* each benefit in turn and the centre names it; hover or focus a      */
/* benefit to take over. Chips sit at fixed angles — nothing drifts.   */
/* ------------------------------------------------------------------ */
const STEP = 360 / ALL_BENEFITS.length;

export function HeroOrbit() {
  const [ref, inView] = useInView<HTMLDivElement>(0.4);
  const [active, setActive] = useState(0);
  const [turn, setTurn] = useState(0); // cumulative hand angle, so it never spins backwards the long way
  const [held, setHeld] = useState(false);

  const goTo = (i: number) => {
    if (i === active) return;
    let d = (i - active + ALL_BENEFITS.length) % ALL_BENEFITS.length;
    if (d > ALL_BENEFITS.length / 2) d -= ALL_BENEFITS.length;
    setTurn((t) => t + d * STEP);
    setActive(i);
  };

  useEffect(() => {
    if (!inView || held || reducedMotion()) return;
    const t = setTimeout(() => goTo((active + 1) % ALL_BENEFITS.length), 2600);
    return () => clearTimeout(t);
  }, [inView, held, active]);

  const b = ALL_BENEFITS[active];
  return (
    <div ref={ref} className="relative mx-auto aspect-square w-full max-w-[30rem]" onMouseLeave={() => setHeld(false)}>
      <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <circle cx="50" cy="50" r="44" fill="none" stroke="rgb(255 255 255 / 0.14)" strokeWidth="0.3" />
        <circle cx="50" cy="50" r="44" fill="none" stroke="var(--accent)" strokeWidth="0.45" pathLength={1} className="el-draw" transform="rotate(-90 50 50)" />
        <circle cx="50" cy="50" r="30" fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="0.3" strokeDasharray="0.8 1.6" />
        <g className="el-hand" style={{ transform: `rotate(${turn}deg)` }}>
          <line x1="50" y1="32" x2="50" y2="12" stroke="#a9dcfb" strokeWidth="0.5" strokeLinecap="round" />
          <circle cx="50" cy="12" r="0.9" fill="#a9dcfb" />
        </g>
      </svg>

      <div className="absolute inset-[31%] grid place-items-center rounded-full bg-white/10 text-center ring-1 ring-white/25">
        <div key={active} className="tab-in px-3">
          <span className="mx-auto grid h-11 w-11 place-items-center rounded-full bg-white text-primary"><Icon name={b.icon} size={20} /></span>
          <p className="mt-2.5 text-[0.82rem] font-semibold leading-snug text-white">{b.label}</p>
          <p className="mt-1 font-mono text-[0.66rem] tracking-[0.1em] text-on-dark-muted">{String(active + 1).padStart(2, "0")} / {String(ALL_BENEFITS.length).padStart(2, "0")}</p>
        </div>
      </div>

      <ul aria-label="Employee benefits">
        {ALL_BENEFITS.map((x, i) => {
          const a = ((i * STEP - 90) * Math.PI) / 180;
          return (
            <li key={x.label} className="node-pop absolute -translate-x-1/2 -translate-y-1/2" style={{ left: `${round(50 + 44 * Math.cos(a))}%`, top: `${round(50 + 44 * Math.sin(a))}%`, "--node-delay": `${0.5 + i * 0.07}s` } as CSSProperties}>
              <a
                href={x.href}
                aria-label={x.label}
                onMouseEnter={() => { setHeld(true); goTo(i); }}
                onFocus={() => { setHeld(true); goTo(i); }}
                onBlur={() => setHeld(false)}
                className={`el-chip grid h-12 w-12 place-items-center rounded-full ${i === active ? "is-on" : ""}`}
              >
                <Icon name={x.icon} size={20} />
              </a>
            </li>
          );
        })}
      </ul>
    </div>
  );
}

/** Card whose soft light follows the pointer (mouse only). */
export function Spotlight({ children, className = "" }: { children: ReactNode; className?: string }) {
  const ref = useRef<HTMLDivElement>(null);
  const move = (e: React.PointerEvent) => {
    const el = ref.current;
    if (!el || e.pointerType !== "mouse") return;
    const r = el.getBoundingClientRect();
    el.style.setProperty("--mx", `${e.clientX - r.left}px`);
    el.style.setProperty("--my", `${e.clientY - r.top}px`);
  };
  return <div ref={ref} onPointerMove={move} className={`el-spot ${className}`}>{children}</div>;
}

/* ------------------------------------------------------------------ */
/* Insurance: three nested shields with a tab per layer. Cycles on its */
/* own until the visitor picks one; paused off-screen.                 */
/* ------------------------------------------------------------------ */
const AUTO_MS = 6500;
const SHIELD = "M100 12 172 40v62c0 50-34 84-72 100-38-16-72-50-72-100V40z";
// Labels beside each layer: outer (top right), middle (left), inner (right)
const PIN_POS: CSSProperties[] = [{ top: "4%", right: "0%" }, { top: "30%", left: "0%" }, { top: "50%", right: "8%" }];

export function CoverExplorer() {
  const [ref, inView] = useInView<HTMLDivElement>(0.35);
  const [active, setActive] = useState(0);
  const [auto, setAuto] = useState(true);
  const tabsRef = useRef<(HTMLButtonElement | null)[]>([]);

  useEffect(() => { if (reducedMotion()) setAuto(false); }, []);
  useEffect(() => {
    if (!auto || !inView) return;
    const t = setTimeout(() => setActive((a) => (a + 1) % COVERS.length), AUTO_MS);
    return () => clearTimeout(t);
  }, [auto, inView, active]);

  const pick = (i: number) => { setAuto(false); setActive(i); };
  const onKey = (e: React.KeyboardEvent, i: number) => {
    const dir = e.key === "ArrowRight" || e.key === "ArrowDown" ? 1 : e.key === "ArrowLeft" || e.key === "ArrowUp" ? -1 : 0;
    if (!dir) return;
    e.preventDefault();
    const next = (i + dir + COVERS.length) % COVERS.length;
    pick(next);
    tabsRef.current[next]?.focus();
  };
  const c = COVERS[active];

  return (
    <div ref={ref} className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-5">
        <div className="relative mx-auto aspect-square w-full max-w-[19rem] sm:max-w-[26rem]">
          <span aria-hidden="true" className="el-halo absolute inset-[14%] rounded-full" />
          <svg viewBox="0 0 200 214" className="relative h-full w-full overflow-visible" role="img" aria-label="Three layers of insurance cover: group medical, group term life and group personal accident">
            {COVERS.map((cv, i) => (
              <g key={cv.id} className={`el-layer ${i === active ? "is-on" : ""}`} transform={`translate(100 107) scale(${1 - i * 0.24}) translate(-100 -107)`}>
                <path d={SHIELD} className="el-layer-fill" />
                <path key={i === active ? `on-${active}` : "off"} d={SHIELD} pathLength={1} className="el-layer-stroke" />
              </g>
            ))}
            <g transform="translate(100 108)" className="text-white">
              <circle r="17" fill="var(--primary)" />
              <SvgIcon name={c.icon} size={18} key={c.id} className="tab-in" />
            </g>
          </svg>
          {COVERS.map((cv, i) => (
            <button key={cv.id} type="button" tabIndex={-1} aria-hidden="true" onClick={() => pick(i)} className={`el-pin absolute cursor-pointer rounded-full px-3 py-1 font-mono text-[0.72rem] font-semibold tracking-[0.08em] ${i === active ? "is-on" : ""}`} style={PIN_POS[i]}>
              {cv.code}
            </button>
          ))}
        </div>
      </div>

      <div className="lg:col-span-7">
        <div role="tablist" aria-label="Insurance cover" className="grid grid-cols-3 gap-1.5 rounded-2xl bg-white p-1.5 ring-1 ring-border">
          {COVERS.map((cv, i) => (
            <button
              key={cv.id}
              ref={(el) => { tabsRef.current[i] = el; }}
              id={`cover-tab-${cv.id}`}
              type="button"
              role="tab"
              aria-selected={i === active}
              aria-controls={`cover-panel-${cv.id}`}
              tabIndex={i === active ? 0 : -1}
              onClick={() => pick(i)}
              onKeyDown={(e) => onKey(e, i)}
              className={`el-tab relative min-h-14 cursor-pointer overflow-hidden rounded-xl px-3 text-left ${i === active ? "is-on" : ""}`}
            >
              <span className="block font-display text-lg font-bold leading-none">{cv.code}</span>
              <span className="mt-1 hidden truncate text-[0.74rem] font-medium opacity-80 sm:block">{cv.tagline}</span>
              {i === active && auto && inView && <span aria-hidden="true" key={active} className="el-timer" style={{ animationDuration: `${AUTO_MS}ms` }} />}
            </button>
          ))}
        </div>

        <div key={c.id} id={`cover-panel-${c.id}`} role="tabpanel" aria-labelledby={`cover-tab-${c.id}`} className="tab-in mt-5 rounded-2xl bg-white p-7 shadow-[0_30px_60px_-40px_rgb(10_45_80/0.45)] ring-1 ring-border sm:p-9">
          <div className="flex items-start gap-5">
            <span className="el-icon grid h-14 w-14 shrink-0 place-items-center rounded-xl"><Icon name={c.icon} size={26} /></span>
            <div className="min-w-0">
              <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-strong">{c.code} · {c.tagline}</p>
              <h3 className="mt-1.5 text-[1.6rem] font-semibold leading-tight text-primary-ink">{c.name}</h3>
            </div>
          </div>
          <p className="mt-5 text-[1.05rem] leading-relaxed text-muted">{c.summary}</p>
          <ul className="mt-6 grid gap-3">
            {c.points.map((p, i) => (
              <li key={p} className="tab-item flex gap-3 text-text" style={{ animationDelay: `${120 + i * 70}ms` }}>
                <span className="mt-0.5 grid h-6 w-6 shrink-0 place-items-center rounded-full bg-primary-tint text-primary"><Icon name="check" size={14} strokeWidth={2.2} /></span>
                {p}
              </li>
            ))}
          </ul>
        </div>
        <p className="mt-4 text-[0.8rem] text-muted">Cover, limits and eligibility are as per the group policies in force.</p>
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Moving parts are SVG elements riding the very path that is drawn    */
/* (animateMotion), so they stay on the line at every screen size.     */
/* ------------------------------------------------------------------ */
const ROUTE = "M20 96 C 100 96, 120 34, 210 38 S 330 100, 420 64 S 530 24, 580 44";

export function BusRoute() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 600 130" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <path id={`route-${id}`} d={ROUTE} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="16" strokeLinecap="round" />
      <path d={ROUTE} fill="none" stroke="#a9dcfb" strokeWidth="2" strokeDasharray="10 12" className="el-road" />
      <circle cx="20" cy="96" r="7" fill="#fff" />
      <circle cx="580" cy="44" r="7" fill="var(--accent)" />
      <text x="20" y="124" textAnchor="start" className="fill-[var(--on-dark-muted)] text-[11px] font-semibold uppercase tracking-[0.14em]">Home</text>
      <text x="580" y="20" textAnchor="end" className="fill-[var(--on-dark-muted)] text-[11px] font-semibold uppercase tracking-[0.14em]">Synthokem</text>
      <g className="el-mover text-primary-ink">
        <rect x="-17" y="-15" width="34" height="30" rx="9" fill="#fff" />
        <SvgIcon name="bus" size={18} />
        {/* Out to work, a pause at the gate, then home again */}
        <animateMotion dur="9s" repeatCount="indefinite" calcMode="spline" keyPoints="0;1;1;0;0" keyTimes="0;0.42;0.5;0.92;1" keySplines="0.45 0 0.55 1;0 0 1 1;0.45 0 0.55 1;0 0 1 1">
          <mpath href={`#route-${id}`} />
        </animateMotion>
      </g>
    </svg>
  );
}

const TRIP = "M24 116 Q 180 -18 336 70";

export function TripRoute() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 360 130" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <path id={`trip-${id}`} d={TRIP} fill="none" stroke="rgb(255 255 255 / 0.3)" strokeWidth="1.5" strokeDasharray="5 7" />
      <circle cx="24" cy="116" r="6" fill="#fff" />
      <circle cx="336" cy="70" r="6" fill="var(--accent)" />
      <g className="el-mover text-primary-ink">
        <circle r="15" fill="#fff" />
        {/* The plane glyph points up-right; turn it so its nose follows the path */}
        <SvgIcon name="plane" size={16} transform="rotate(45)" />
        <animateMotion dur="6s" repeatCount="indefinite" rotate="auto" calcMode="spline" keyPoints="0;1;1" keyTimes="0;0.75;1" keySplines="0.4 0 0.2 1;0 0 1 1">
          <mpath href={`#trip-${id}`} />
        </animateMotion>
        <animate attributeName="opacity" dur="6s" repeatCount="indefinite" values="0;1;1;0;0" keyTimes="0;0.06;0.72;0.8;1" />
      </g>
    </svg>
  );
}

const ECG = "M0 50h120l14-30 18 52 16-40 10 18h182";

export function HeartTrace() {
  const id = useId().replace(/:/g, "");
  return (
    <svg viewBox="0 0 360 80" className="block h-auto w-full overflow-visible" aria-hidden="true">
      <line x1="0" y1="50" x2="360" y2="50" stroke="var(--border)" />
      <path id={`ecg-${id}`} d={ECG} pathLength={1} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinejoin="round" strokeLinecap="round" className="el-draw" />
      <circle r="5" fill="var(--accent)" className="el-mover">
        <animateMotion dur="3.2s" repeatCount="indefinite" calcMode="linear" keyPoints="0;1;1" keyTimes="0;0.8;1"><mpath href={`#ecg-${id}`} /></animateMotion>
      </circle>
    </svg>
  );
}

/* ------------------------------------------------------------------ */
/* Shifts: a 24-hour dial. Sun and moon ride the same ring a full day  */
/* apart, turning about its exact centre.                              */
/* ------------------------------------------------------------------ */
export function ShiftDial() {
  const ticks = Array.from({ length: 24 }, (_, h) => {
    const a = ((h * 15 - 90) * Math.PI) / 180;
    const r1 = h % 6 === 0 ? 68 : 73;
    return { h, x1: round(100 + r1 * Math.cos(a)), y1: round(100 + r1 * Math.sin(a)), x2: round(100 + 78 * Math.cos(a)), y2: round(100 + 78 * Math.sin(a)) };
  });
  return (
    <svg viewBox="0 0 200 200" className="mx-auto block h-auto w-full max-w-[24rem] overflow-visible" role="img" aria-label="24-hour dial: operations run round the clock">
      <defs>
        <linearGradient id="el-dial" x1="0" y1="0" x2="0" y2="1">
          <stop offset="0" stopColor="#a9dcfb" stopOpacity="0.55" />
          <stop offset="1" stopColor="#0b2e4f" stopOpacity="0.5" />
        </linearGradient>
      </defs>
      <circle cx="100" cy="100" r="92" fill="none" stroke="url(#el-dial)" strokeWidth="10" />
      <circle cx="100" cy="100" r="92" fill="none" stroke="#fff" strokeWidth="1.2" pathLength={1} className="el-draw" transform="rotate(-90 100 100)" />
      {ticks.map((t) => (
        <line key={t.h} x1={t.x1} y1={t.y1} x2={t.x2} y2={t.y2} stroke="rgb(255 255 255 / 0.5)" strokeWidth={t.h % 6 === 0 ? 1.8 : 0.9} strokeLinecap="round" />
      ))}
      <circle cx="100" cy="100" r="46" fill="rgb(255 255 255 / 0.1)" stroke="rgb(255 255 255 / 0.22)" />
      <text x="100" y="100" textAnchor="middle" className="fill-white font-display text-[19px] font-bold">24×7</text>
      <text x="100" y="116" textAnchor="middle" className="fill-[var(--on-dark-muted)] text-[6.5px] font-semibold uppercase tracking-[0.16em]">operations</text>
      <g className="el-mover">
        <animateTransform attributeName="transform" type="rotate" from="0 100 100" to="360 100 100" dur="30s" repeatCount="indefinite" />
        <g transform="translate(100 8)">
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="30s" repeatCount="indefinite" />
            <circle r="13" fill="#fff" />
            <circle r="19" fill="#fff" opacity="0.18" />
            <SvgIcon name="sun" size={16} className="text-primary" />
          </g>
        </g>
        <g transform="translate(100 192)">
          <g>
            <animateTransform attributeName="transform" type="rotate" from="0" to="-360" dur="30s" repeatCount="indefinite" />
            <circle r="13" fill="#0b2e4f" stroke="#a9dcfb" strokeWidth="1" />
            <SvgIcon name="moon" size={15} className="text-[#a9dcfb]" />
          </g>
        </g>
      </g>
    </svg>
  );
}
