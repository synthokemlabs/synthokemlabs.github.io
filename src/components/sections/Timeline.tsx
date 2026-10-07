"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { JOURNEY, MILESTONE_LABEL, type MilestoneType } from "@/data/company";
import { Reveal } from "@/components/ui/client";

/** Full company timeline with type filters and a scroll-linked progress line. */
export function Timeline() {
  const [filter, setFilter] = useState<MilestoneType | "all">("all");
  const lineRef = useRef<HTMLDivElement>(null);
  const items = useMemo(() => JOURNEY.filter((m) => filter === "all" || m.type === filter), [filter]);
  const byYear = useMemo(() => {
    const map = new Map<number, typeof items>();
    items.forEach((m) => map.set(m.year, [...(map.get(m.year) ?? []), m]));
    return [...map.entries()];
  }, [items]);

  useEffect(() => {
    const el = lineRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const p = Math.min(1, Math.max(0, (window.innerHeight * 0.6 - r.top) / r.height));
      el.style.setProperty("--progress", String(p));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); cancelAnimationFrame(raf); };
  }, [filter]);

  const types = Object.keys(MILESTONE_LABEL) as MilestoneType[];

  return (
    <div>
      <div role="group" aria-label="Filter milestones" className="rail -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {(["all", ...types] as const).map((t) => {
          const on = filter === t;
          const n = t === "all" ? JOURNEY.length : JOURNEY.filter((m) => m.type === t).length;
          return (
            <button
              key={t}
              type="button"
              aria-pressed={on}
              onClick={() => setFilter(t)}
              className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${on ? "bg-primary text-white" : "text-primary-ink ring-1 ring-inset ring-border-strong hover:ring-primary"}`}
            >
              {t === "all" ? "All milestones" : MILESTONE_LABEL[t]}
              <span className="font-mono text-[0.7rem] opacity-60">{n}</span>
            </button>
          );
        })}
      </div>

      <div ref={lineRef} className="relative mt-14" style={{ ["--progress" as string]: 0 }}>
        <div aria-hidden="true" className="absolute bottom-0 left-[4.5rem] top-0 w-px bg-border sm:left-[7.5rem]" />
        <div aria-hidden="true" className="absolute left-[4.5rem] top-0 w-px origin-top bg-primary sm:left-[7.5rem]" style={{ height: "100%", transform: "scaleY(var(--progress))" }} />
        <ol className="space-y-2">
          {byYear.map(([year, ms]) => (
            <Reveal as="li" key={`${filter}-${year}`} className="relative grid grid-cols-[4.5rem_1fr] sm:grid-cols-[7.5rem_1fr]">
              <div className="pr-5 pt-6 text-right sm:pr-10">
                <span className="font-display text-2xl font-semibold tracking-tight text-primary-ink sm:text-4xl">{year}</span>
              </div>
              <div className="relative pb-6 pl-6 pt-6 sm:pl-12">
                <span aria-hidden="true" className="absolute -left-[5px] top-[2.1rem] h-[10px] w-[10px] rounded-full border-2 border-primary bg-white sm:top-[2.6rem]" />
                <ul className="space-y-4">
                  {ms.map((m) => (
                    <li key={m.title} className="rounded-lg bg-white p-5 ring-1 ring-border sm:p-6">
                      <div className="flex flex-wrap items-center gap-2">
                        <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-accent-strong">{MILESTONE_LABEL[m.type]}</span>
                        {m.unit && <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-muted">· {m.unit}</span>}
                      </div>
                      <h3 className="mt-2 text-lg font-semibold text-primary-ink">{m.title}</h3>
                      <p className="mt-1.5 text-[0.95rem] leading-relaxed text-muted">{m.detail}</p>
                    </li>
                  ))}
                </ul>
              </div>
            </Reveal>
          ))}
          <li className="relative grid grid-cols-[4.5rem_1fr] sm:grid-cols-[7.5rem_1fr]">
            <div className="pr-5 pt-6 text-right sm:pr-10"><span className="font-display text-2xl font-semibold text-accent-strong sm:text-4xl">Today</span></div>
            <div className="relative pb-2 pl-6 pt-6 sm:pl-12">
              <span aria-hidden="true" className="absolute -left-[6px] top-[2.1rem] h-3 w-3 rounded-full bg-primary sm:top-[2.6rem]" />
              <p className="max-w-xl text-[1.05rem] leading-relaxed text-text">
                From a single unit with 10 employees to three manufacturing facilities and over 300 people — serving customers across 40 countries.
              </p>
            </div>
          </li>
        </ol>
      </div>
    </div>
  );
}
