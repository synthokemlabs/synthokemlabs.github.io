import type { CSSProperties } from "react";
import { Counter, Reveal } from "@/components/ui/client";
import { Icon } from "@/components/ui/Icon";
import { CLEAN_AREA, FACILITIES, PROCESS_TRAIN, TOTAL_CAPACITY_KL, UTILITIES } from "@/data/company";

/** Capacity as a ring: each unit's segment draws in turn, the total counts up in the middle (PPT slide 20). */
export function CapacityRing() {
  const R = 84;
  const C = 2 * Math.PI * R;
  const GAP = 6;
  const colors = ["var(--primary)", "var(--accent)"];
  let start = 0;
  const segs = FACILITIES.map((f, i) => {
    const frac = f.capacityKL / TOTAL_CAPACITY_KL;
    const seg = { f, len: frac * C - GAP, rot: (start / C) * 360 - 90, color: colors[i], delay: 0.3 + i * 0.9, pct: Math.round(frac * 100) };
    start += frac * C;
    return seg;
  });
  return (
    <Reveal className="grid grid-cols-1 items-center gap-10 sm:grid-cols-[auto_1fr] sm:gap-12">
      <div className="relative mx-auto h-60 w-60 sm:h-64 sm:w-64">
        <svg viewBox="0 0 200 200" className="h-full w-full" aria-hidden="true">
          <circle cx="100" cy="100" r={R} fill="none" stroke="var(--primary-tint)" strokeWidth="18" />
          {segs.map((s) => (
            <circle key={s.f.id} cx="100" cy="100" r={R} fill="none" stroke={s.color} strokeWidth="18" transform={`rotate(${s.rot} 100 100)`} className="ring-seg" style={{ strokeDasharray: `${s.len} ${C}`, "--len": s.len, "--seg-delay": `${s.delay}s` } as CSSProperties} />
          ))}
        </svg>
        <div className="absolute inset-0 grid place-items-center text-center">
          <div>
            <p className="font-display text-5xl font-semibold tracking-tight text-primary-ink"><Counter value={TOTAL_CAPACITY_KL} /></p>
            <p className="mt-1 text-sm font-medium text-muted">KL total capacity</p>
          </div>
        </div>
      </div>
      <ul className="space-y-4">
        {segs.map((s) => (
          <li key={s.f.id} className="node-pop rounded-xl bg-white p-5 ring-1 ring-border" style={{ "--node-delay": `${s.delay + 0.4}s` } as CSSProperties}>
            <p className="flex items-center gap-2.5">
              <span className="h-3 w-3 shrink-0 rounded-full" style={{ background: s.color }} />
              <span className="font-semibold text-primary-ink">{s.f.name}</span>
              <span className="text-sm text-muted">{s.f.state}</span>
            </p>
            <p className="mt-2 flex items-baseline justify-between gap-3">
              <span className="font-display text-3xl font-semibold text-primary">{s.f.capacityKL}<span className="ml-1 text-base">KL</span></span>
              <span className="text-sm font-medium text-muted">{s.pct}% of total</span>
            </p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

/**
 * The product's path through the plant. A bead travels the rail stage by stage and each stage lights up
 * as it arrives (both run on one 6s clock: stage i is reached at i × 1.2s). Desktop: six columns, 16px gaps.
 */
export function ProcessTrain() {
  return (
    <Reveal>
      <div className="flow-host relative">
        <span aria-hidden="true" className="evo-rail absolute top-[35px] hidden h-0.5 rounded-full bg-gradient-to-r from-primary/40 via-accent/60 to-primary/40 md:left-[calc((100%-80px)/12)] md:right-[calc((100%-80px)/12)] md:block" />
        <span aria-hidden="true" className="train-bead" />
        <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-6 md:gap-4">
          {PROCESS_TRAIN.map((s, i) => (
            <li key={s.t} className="node-pop relative grid grid-cols-[70px_1fr] items-start gap-5 md:flex md:flex-col md:items-center md:text-center" style={{ "--node-delay": `${0.2 + i * 0.12}s`, "--i": i } as CSSProperties}>
              {i < PROCESS_TRAIN.length - 1 && <span aria-hidden="true" className="absolute -bottom-8 left-[34px] top-[70px] w-0.5 bg-gradient-to-b from-primary/40 to-accent/40 md:hidden" />}
              <span className="train-icon relative z-10 grid h-[70px] w-[70px] place-items-center rounded-2xl bg-white text-primary shadow-[0_10px_28px_-14px_rgb(10_45_80/0.55)] ring-1 ring-primary/20">
                <Icon name={s.icon} size={28} strokeWidth={1.5} />
              </span>
              <div className="md:mt-5">
                <p className="font-mono text-[0.7rem] text-accent-strong">0{i + 1}</p>
                <h3 className="mt-1 font-semibold text-primary-ink">{s.t}</h3>
                <p className="mt-1.5 text-[0.86rem] leading-relaxed text-muted">{s.d}</p>
              </div>
            </li>
          ))}
        </ol>
        {/* Clean area applies from crystallisation onwards: brackets stages 2–6 on desktop */}
        <div className="mt-8 grid grid-cols-1 md:mt-10 md:grid-cols-6 md:gap-4">
          <div className="node-pop flex items-center gap-3 rounded-xl border border-dashed border-accent/60 bg-white/60 px-5 py-3 text-[0.88rem] text-primary-ink md:col-span-5 md:col-start-2" style={{ "--node-delay": "1s" } as CSSProperties}>
            <Icon name="shield" size={18} className="shrink-0 text-accent-strong" />{CLEAN_AREA}
          </div>
        </div>
      </div>
    </Reveal>
  );
}

/** Utilities that serve every unit (PPT slide 19). */
export function UtilitiesGrid() {
  return (
    <Reveal>
      <ul className="grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
        {UTILITIES.map((u, i) => (
          <li key={u.t} className="util-tile node-pop group rounded-xl bg-white p-5 ring-1 ring-border transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_22px_44px_-28px_rgb(10_45_80/0.45)]" style={{ "--node-delay": `${0.1 + i * 0.07}s` } as CSSProperties}>
            <span className="util-icon grid h-11 w-11 place-items-center rounded-full bg-primary-tint text-primary transition-transform duration-500 ease-out group-hover:-rotate-12 group-hover:scale-110"><Icon name={u.icon} size={20} strokeWidth={1.6} /></span>
            <h3 className="mt-4 font-semibold text-primary-ink">{u.t}</h3>
            <p className="mt-1 text-[0.86rem] leading-snug text-muted">{u.d}</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
