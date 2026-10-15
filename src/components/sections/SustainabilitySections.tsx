"use client";

import { useState, type CSSProperties } from "react";
import { Img } from "@/components/ui/Img";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Counter, Reveal } from "@/components/ui/client";
import { EHS, RENEWABLES } from "@/data/company";

const nd = (s: number) => ({ "--node-delay": `${s}s`, "--draw-delay": `${s}s` }) as CSSProperties;
export const SOLAR_KW = RENEWABLES.reduce((sum, r) => sum + r.pvKW, 0);

/* ------------------------------------------------------------------ */
/* Solar (PPT slides 28–29): the rooftop array, with the total counted */
/* up and a bar that splits it between the two units.                  */
/* ------------------------------------------------------------------ */
export function SolarBanner() {
  return (
    <Reveal variant="image" className="zoom-parent relative overflow-hidden rounded-2xl bg-primary-ink">
      <Img name="solar-rooftop" sizes="(min-width:1024px) 80vw, 100vw" className="zoom-img aspect-[4/5] w-full object-cover sm:aspect-[16/9] lg:aspect-[21/9]" />
      <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#06223d]/85 via-[#06223d]/25 to-transparent sm:bg-gradient-to-r sm:from-[#06223d]/85 sm:via-[#06223d]/35" />
      <div className="absolute inset-x-0 bottom-0 p-6 text-white sm:inset-y-0 sm:right-auto sm:flex sm:w-[26rem] sm:flex-col sm:justify-end sm:p-9">
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent-soft">Solar PV · in-house power</p>
        <p className="mt-2 font-display text-6xl font-semibold leading-none tracking-tight"><Counter value={SOLAR_KW} /><span className="ml-2 text-2xl font-medium">kW</span></p>
        <p className="mt-2 text-sm text-on-dark-muted">across both units — Unit II alone generates 600–700 units a day.</p>
        {/* Each unit's share of the total */}
        <div className="mt-6 flex gap-1.5">
          {RENEWABLES.map((r, i) => (
            <div key={r.unit} style={{ flexGrow: r.pvKW }}>
              <p className="flex items-baseline justify-between gap-2 text-[0.78rem]"><span className="font-semibold">{r.unit}</span><span className="font-mono text-white/75">{r.pvKW} kW</span></p>
              <span aria-hidden="true" className="solar-bar mt-2 block h-1.5 origin-left rounded-full bg-accent" style={nd(0.6 + i * 0.25)} />
            </div>
          ))}
        </div>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Energy, water, waste: one column each.                             */
/* ------------------------------------------------------------------ */
function RingMeter({ value, label, delay }: { value: number; label: string; delay: number }) {
  return (
    <div className="flex items-center gap-4">
      <span className="relative grid h-20 w-20 shrink-0 place-items-center">
        <svg viewBox="0 0 80 80" className="absolute inset-0 -rotate-90" aria-hidden="true">
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--primary-tint)" strokeWidth="7" />
          <circle cx="40" cy="40" r="34" fill="none" stroke="var(--primary)" strokeWidth="7" strokeLinecap="round" pathLength={100} className="ring-meter" style={{ "--off": 100 - value, ...nd(delay) } as CSSProperties} />
        </svg>
        <span className="font-display text-lg font-semibold text-primary-ink">~{value}%</span>
      </span>
      <span className="text-[0.88rem] leading-snug text-muted">{label}</span>
    </div>
  );
}

const ENERGY = RENEWABLES[0].items.slice(1);

export function ResourceColumns() {
  return (
    <Reveal className="grid grid-cols-1 gap-5 md:grid-cols-3">
      <article className="node-pop flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border" style={nd(0.1)}>
        <div className="zoom-parent relative aspect-[16/10] overflow-hidden"><Img name="solar-concentrators" sizes="(min-width:768px) 30vw, 100vw" className="zoom-img absolute inset-0 h-full w-full object-cover" /></div>
        <div className="flex-1 p-6">
          <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent-strong"><Icon name="sun" size={15} />Energy</p>
          <h3 className="mt-2 text-xl font-semibold text-primary-ink">Solar heat as well as power</h3>
          <p className="mt-1 font-mono text-[0.7rem] text-muted">At Unit II</p>
          <ul className="mt-3 space-y-3">
            {ENERGY.map((x) => <li key={x} className="border-t border-border pt-3 text-[0.9rem] leading-relaxed text-muted">{x}</li>)}
          </ul>
        </div>
      </article>

      <article className="node-pop flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border" style={nd(0.22)}>
        <div className="zoom-parent relative aspect-[16/10] overflow-hidden"><Img name="zld-plant" sizes="(min-width:768px) 30vw, 100vw" className="zoom-img absolute inset-0 h-full w-full object-cover" /></div>
        <div className="flex-1 p-6">
          <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent-strong"><Icon name="droplet" size={15} />Water</p>
          <h3 className="mt-2 text-xl font-semibold text-primary-ink">Zero liquid discharge</h3>
          <p className="mt-4 border-t border-border pt-3 text-[0.9rem] leading-relaxed text-muted">Our ZLD facility treats and recovers wastewater, so no liquid effluent leaves the site.</p>
        </div>
      </article>

      <article className="node-pop flex flex-col overflow-hidden rounded-2xl bg-white ring-1 ring-border" style={nd(0.34)}>
        <div className="grid aspect-[16/10] place-items-center bg-surface">
          <div className="space-y-4">
            <RingMeter value={80} label="of non-hazardous waste recycled" delay={0.7} />
            <RingMeter value={60} label="of hazardous waste recycled" delay={0.95} />
          </div>
        </div>
        <div className="flex-1 p-6">
          <p className="flex items-center gap-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent-strong"><Icon name="spin" size={15} />Waste</p>
          <h3 className="mt-2 text-xl font-semibold text-primary-ink">Prevent first, then recycle</h3>
          <p className="mt-4 border-t border-border pt-3 text-[0.9rem] leading-relaxed text-muted">Waste prevention and reduction come before treatment or disposal — and most of what remains is recycled.</p>
        </div>
      </article>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Slide 24 flowchart as a hub: leadership & commitment at the centre, */
/* the six safeguards it drives around it. Spokes draw out, then a     */
/* pulse runs along each in turn. Phones: centre card + a grid.        */
/* ------------------------------------------------------------------ */
const HUB = EHS.safeguards.map((s, i) => {
  const a = ((-90 + i * 60) * Math.PI) / 180;
  return { ...s, x: 50 + 37 * Math.cos(a), y: 50 + 37 * Math.sin(a) };
});

export function SafeguardsHub() {
  return (
    <Reveal>
      <div className="relative mx-auto hidden aspect-square w-full max-w-[34rem] sm:block">
        <svg viewBox="0 0 100 100" className="absolute inset-0 h-full w-full" aria-hidden="true">
          <circle cx="50" cy="50" r="37" fill="none" stroke="#fff" strokeOpacity=".14" strokeDasharray="0.6 1.6" vectorEffect="non-scaling-stroke" />
          {HUB.map((s, i) => (
            <g key={s.t}>
              <line x1="50" y1="50" x2={s.x} y2={s.y} stroke="#fff" strokeOpacity=".35" strokeWidth="1.5" vectorEffect="non-scaling-stroke" pathLength={1} className="draw-path" style={nd(0.35 + i * 0.08)} />
              <line x1="50" y1="50" x2={s.x} y2={s.y} stroke="var(--accent-soft)" strokeWidth="2.5" strokeLinecap="round" vectorEffect="non-scaling-stroke" pathLength={1} className="hub-pulse" style={{ "--i": i } as CSSProperties} />
            </g>
          ))}
        </svg>
        <div className="node-pop absolute left-1/2 top-1/2 grid aspect-square w-[34%] -translate-x-1/2 -translate-y-1/2 place-items-center rounded-full bg-white text-center shadow-[0_24px_50px_-20px_rgb(0_0_0/0.45)]" style={nd(0.15)}>
          <span className="px-3">
            <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">Driven by</span>
            <span className="mt-1 block font-display text-[clamp(0.95rem,1.6vw,1.25rem)] font-semibold leading-tight text-primary-ink">Leadership &amp; commitment</span>
          </span>
        </div>
        {HUB.map((s, i) => (
          <div key={s.t} className="node-pop absolute flex w-32 -translate-x-1/2 -translate-y-7 flex-col items-center text-center" style={{ left: `${s.x}%`, top: `${s.y}%`, ...nd(0.7 + i * 0.1) }}>
            <span className="grid h-14 w-14 place-items-center rounded-full bg-white text-primary ring-4 ring-white/15"><Icon name={s.icon as IconName} size={22} strokeWidth={1.6} /></span>
            <span className="mt-2.5 text-[0.86rem] font-semibold leading-tight text-white">{s.t}</span>
          </div>
        ))}
      </div>

      {/* Phones */}
      <div className="sm:hidden">
        <div className="node-pop rounded-xl bg-white px-5 py-4 text-center" style={nd(0.1)}>
          <span className="block text-[0.62rem] font-semibold uppercase tracking-[0.16em] text-muted">Driven by</span>
          <span className="mt-1 block font-display text-lg font-semibold text-primary-ink">Leadership &amp; commitment</span>
        </div>
        <span aria-hidden="true" className="mx-auto block h-6 w-px bg-white/30" />
        <ul className="grid grid-cols-2 gap-2.5">
          {HUB.map((s, i) => (
            <li key={s.t} className="node-pop flex items-center gap-3 rounded-xl bg-white/10 p-3 ring-1 ring-white/15" style={nd(0.3 + i * 0.07)}>
              <span className="grid h-9 w-9 shrink-0 place-items-center rounded-full bg-white text-primary"><Icon name={s.icon as IconName} size={17} /></span>
              <span className="text-[0.82rem] font-semibold leading-tight text-white">{s.t}</span>
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* SHE policy (slide 25) as the signed document it is, beside the      */
/* health and safety detail (slides 26–27) in a fold-out list.         */
/* ------------------------------------------------------------------ */
export function ShePolicy() {
  return (
    <Reveal className="relative overflow-hidden rounded-2xl bg-white ring-1 ring-border shadow-[0_30px_60px_-45px_rgb(10_45_80/0.5)]">
      <span aria-hidden="true" className="block h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
      <div className="p-7 sm:p-9">
        <div className="flex items-start justify-between gap-6">
          <div>
            <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent-strong">Policy document</p>
            <h3 className="mt-2 font-display text-2xl font-semibold text-primary-ink sm:text-[1.75rem]">Safety, Health &amp; Environment Policy</h3>
          </div>
          <span className="hidden h-12 w-12 shrink-0 place-items-center rounded-full bg-primary-tint text-primary sm:grid"><Icon name="shield" size={22} /></span>
        </div>
        <p className="mt-5 leading-relaxed text-text">{EHS.shePolicy.intro}</p>
        <ol className="mt-5">
          {EHS.shePolicy.points.map((p, i) => (
            <li key={p} className="node-pop grid grid-cols-[2.25rem_1fr] gap-2 border-t border-border py-2.5 text-[0.9rem] leading-snug text-muted" style={nd(0.2 + i * 0.07)}>
              <span className="font-mono text-[0.72rem] leading-[1.5] text-accent-strong">{String(i + 1).padStart(2, "0")}</span>{p}
            </li>
          ))}
        </ol>
        <div className="mt-6 flex items-end justify-between gap-6 border-t border-border pt-6">
          <div>
            <span aria-hidden="true" className="sign-line block h-px w-44 origin-left bg-primary-ink" style={nd(0.9)} />
            <p className="mt-2 text-sm font-semibold text-primary-ink">{EHS.shePolicy.signedBy}</p>
            <p className="text-xs text-muted">Synthokem Labs Private Limited</p>
          </div>
          <p className="max-w-[12rem] text-right text-xs leading-snug text-muted">Reviewed periodically in line with regulatory requirements.</p>
        </div>
      </div>
    </Reveal>
  );
}

const DETAIL = [
  { t: "Health & hygiene", items: EHS.health },
  ...EHS.standards.map((s) => ({ t: s.t, text: s.d })),
] as { t: string; items?: string[]; text?: string }[];

export function SafetyDetail() {
  const [open, setOpen] = useState(0);
  return (
    <Reveal delay={120}>
      <ul className="border-t border-border">
        {DETAIL.map((d, i) => {
          const on = open === i;
          return (
            <li key={d.t} className="border-b border-border">
              <button type="button" onClick={() => setOpen(on ? -1 : i)} aria-expanded={on} className="group flex w-full cursor-pointer items-center justify-between gap-4 py-5 text-left">
                <span className="flex items-baseline gap-3"><span className="font-mono text-[0.72rem] text-accent-strong">{String(i + 1).padStart(2, "0")}</span><span className={`text-lg font-semibold transition-colors ${on ? "text-primary" : "text-primary-ink group-hover:text-primary"}`}>{d.t}</span></span>
                <span className={`grid h-8 w-8 shrink-0 place-items-center rounded-full ring-1 transition-[transform,background-color,color] duration-300 ${on ? "rotate-45 bg-primary text-white ring-primary" : "text-primary ring-border"}`}><Icon name="plus" size={15} /></span>
              </button>
              <div className={`grid transition-[grid-template-rows] duration-500 ease-out ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                <div className="overflow-hidden">
                  {d.items ? (
                    <ul className="space-y-2.5 pb-6 pl-8">
                      {d.items.map((x) => <li key={x} className="flex gap-2.5 text-[0.93rem] leading-relaxed text-muted"><Icon name="check" size={16} className="mt-1 shrink-0 text-accent-strong" />{x}</li>)}
                    </ul>
                  ) : (
                    <p className="pb-6 pl-8 text-[0.93rem] leading-relaxed text-muted">{d.text}</p>
                  )}
                </div>
              </div>
            </li>
          );
        })}
      </ul>
    </Reveal>
  );
}
