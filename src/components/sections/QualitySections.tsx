"use client";

import { Fragment, useEffect, useRef, useState, type CSSProperties } from "react";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/client";
import { APPROVALS, QA_RESPONSIBILITIES, QUALITY_POLICY, QUALITY_UNIT, type Approval } from "@/data/company";
import { ApprovalMark } from "@/components/sections/shared";
import { asset } from "@/lib/asset";

const nd = (s: number) => ({ "--node-delay": `${s}s` }) as CSSProperties;

/* ------------------------------------------------------------------ */
/* Quality policy (PPT slide 22): the key commitments get a marker     */
/* stroke, one after another, as the statement comes into view.        */
/* ------------------------------------------------------------------ */
const POLICY_MARKS = ["meeting customer requirements", "high-quality pharmaceutical ingredients", "agreed schedules", "current Good Manufacturing Practices", "continually improving"];
const POLICY_PARTS = QUALITY_POLICY.split(new RegExp(`(${POLICY_MARKS.join("|")})`)).filter(Boolean);

export function PolicyStatement() {
  return (
    <Reveal>
      <blockquote>
        <p className="font-display text-[clamp(1.45rem,1.9vw+0.85rem,2.6rem)] font-medium leading-[1.3] tracking-[-0.018em] text-primary-ink">
          <span aria-hidden="true" className="text-accent-strong">“</span>
          {POLICY_PARTS.map((p, i) => {
            const k = POLICY_MARKS.indexOf(p);
            return k < 0 ? <Fragment key={i}>{p}</Fragment> : <mark key={i} className="policy-mark" style={{ "--mark-delay": `${0.55 + k * 0.32}s` } as CSSProperties}>{p}</mark>;
          })}
          <span aria-hidden="true" className="text-accent-strong">”</span>
        </p>
      </blockquote>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* ISO 9001:2015 quality management system (PPT slide 21) as a living */
/* Plan–Do–Check–Act wheel: a light runs the ring clockwise and each   */
/* phase takes the stage as it arrives. Hover or focus pauses it.      */
/* ------------------------------------------------------------------ */
const PHASES = [
  { tag: "Plan", name: "Planning", clause: "Clause 6", d: "Risks, opportunities and quality objectives are set out before work begins.", pos: { left: "12.5%", top: "50%" } },
  { tag: "Do", name: "Support & operation", clause: "Clauses 7 – 8", d: "Competent people, resources and documented procedures run controlled operations.", pos: { left: "50%", top: "12.5%" } },
  { tag: "Check", name: "Performance evaluation", clause: "Clause 9", d: "Monitoring, internal audits and management review measure how the system performs.", pos: { left: "87.5%", top: "50%" } },
  { tag: "Act", name: "Improvement", clause: "Clause 10", d: "Nonconformities are corrected and the system is continually improved.", pos: { left: "50%", top: "87.5%" } },
];
const QMS_INPUTS = ["Organisation and its context", "Customer requirements", "Needs & expectations of interested parties"];
const QMS_OUTPUTS = ["Customer satisfaction", "Results of the QMS", "Products & services"];
// Ring geometry (viewBox 400): radius 150. Plan sits at 180°, so step s puts the light at 180° + 90°·s.
const R = 150;
const at = (deg: number, r = R) => [200 + r * Math.cos((deg * Math.PI) / 180), 200 + r * Math.sin((deg * Math.PI) / 180)].map((n) => +n.toFixed(2));
const TAIL = at(-58);
const CHEVRONS = [225, 315, 45, 135].map((deg) => ({ p: at(deg), r: deg + 90 }));

export function PdcaCycle() {
  const ref = useRef<HTMLDivElement>(null);
  const [step, setStep] = useState(0);
  const [running, setRunning] = useState(false);
  const [paused, setPaused] = useState(false);
  const phase = step % 4;

  useEffect(() => {
    const el = ref.current;
    if (!el || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      clearTimeout(t);
      // Start once the wheel has drawn in; stop while it is off screen
      if (e.isIntersecting) t = window.setTimeout(() => setRunning(true), 1800);
      else setRunning(false);
    }, { threshold: 0.35 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);
  useEffect(() => {
    if (!running || paused) return;
    const id = window.setInterval(() => setStep((s) => s + 1), 3400);
    return () => clearInterval(id);
  }, [running, paused]);
  // Selecting a phase keeps the light moving clockwise to it
  const go = (i: number) => setStep((s) => s + ((i - (s % 4) + 4) % 4));

  return (
    <Reveal className="pdca grid grid-cols-1 items-center gap-8 lg:grid-cols-[minmax(0,1fr)_minmax(0,27rem)_minmax(0,1fr)] lg:gap-10">
      <div>
        <p className="node-pop text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted lg:text-right" style={nd(0.1)}>Inputs</p>
        <ul className="mt-3 space-y-2.5">
          {QMS_INPUTS.map((t, i) => (
            <li key={t} className="pdca-in node-pop relative rounded-lg bg-white px-4 py-3 text-[0.9rem] font-semibold text-primary-ink ring-1 ring-border lg:text-right" style={nd(0.2 + i * 0.1)}>{t}</li>
          ))}
        </ul>
      </div>

      <div ref={ref} onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)} onFocus={() => setPaused(true)} onBlur={() => setPaused(false)}>
        <div className="relative mx-auto aspect-square w-full max-w-[27rem]">
          <svg viewBox="0 0 400 400" className="absolute inset-0 h-full w-full" aria-hidden="true">
            <defs>
              <radialGradient id="pdca-core" cx="35%" cy="30%" r="80%"><stop offset="0" stopColor="#3fa8ee" /><stop offset="1" stopColor="#0b5597" /></radialGradient>
              <linearGradient id="pdca-tail" gradientUnits="userSpaceOnUse" x1={TAIL[0]} y1={TAIL[1]} x2={350} y2={200}><stop offset="0" stopColor="var(--accent)" stopOpacity="0" /><stop offset="1" stopColor="var(--accent)" /></linearGradient>
            </defs>
            <circle cx="200" cy="200" r="190" fill="none" stroke="var(--border-strong)" strokeDasharray="1 7" strokeLinecap="round" className="pdca-orbit" />
            <circle cx="200" cy="200" r={R} fill="none" stroke="var(--border-strong)" strokeWidth="2" pathLength={1} className="draw-path" style={{ "--draw-delay": "0.3s" } as CSSProperties} />
            {/* Position on the inner path: the pop-in animates the group's own transform */}
            {CHEVRONS.map((c, i) => (
              <g key={i} className="node-pop" style={nd(1 + i * 0.1)}>
                <path d="M -5 -6 L 3 0 L -5 6" fill="none" stroke="var(--primary)" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round" transform={`translate(${c.p[0]} ${c.p[1]}) rotate(${c.r})`} />
              </g>
            ))}
            {/* The light: a fading tail and a bright head, rotated to the current phase */}
            <g className="pdca-comet" style={{ transform: `rotate(${180 + step * 90}deg)` }}>
              <path d={`M ${TAIL[0]} ${TAIL[1]} A ${R} ${R} 0 0 1 350 200`} fill="none" stroke="url(#pdca-tail)" strokeWidth="5" strokeLinecap="round" />
              <circle cx="350" cy="200" r="7" fill="var(--accent)" className="pdca-head" />
            </g>
            <circle cx="200" cy="200" r="82" fill="url(#pdca-core)" className="node-pop" style={nd(0.35)} />
            <circle cx="200" cy="200" r="72" fill="none" stroke="#fff" strokeOpacity=".3" strokeDasharray="2 5" className="pdca-orbit pdca-orbit-r node-pop" style={nd(0.5)} />
          </svg>
          <div className="node-pop absolute inset-0 grid place-items-center text-center text-white" style={nd(0.5)}>
            <p>
              <span className="block font-display text-[clamp(1.1rem,2.4vw,1.55rem)] font-semibold leading-none">ISO 9001</span>
              <span className="mt-1 block font-mono text-[0.7rem] text-white/80">:2015</span>
            </p>
          </div>
          {PHASES.map((p, i) => (
            <button
              key={p.tag}
              type="button"
              onClick={() => go(i)}
              aria-pressed={phase === i}
              aria-label={`${p.tag}: ${p.name}`}
              className="pdca-node node-pop absolute w-[29%] -translate-x-1/2 -translate-y-1/2 cursor-pointer"
              style={{ ...p.pos, ...nd(0.6 + i * 0.12) }}
            >
              <span className="pdca-card block rounded-xl bg-white px-2 py-2.5 text-center ring-1 ring-border">
                <span className="block font-display text-[clamp(0.95rem,1.6vw,1.15rem)] font-semibold leading-none">{p.tag}</span>
                <span className="pdca-sub mt-1 block text-[0.66rem] font-medium leading-tight sm:text-[0.72rem]">{p.name}</span>
              </span>
            </button>
          ))}
        </div>
        {/* All four captions share one grid cell, so switching never shifts the page */}
        <div className="mx-auto mt-6 grid max-w-sm text-center">
          {PHASES.map((p, i) => (
            <p key={p.tag} aria-hidden={phase !== i} className={`pdca-caption [grid-area:1/1] ${phase === i ? "is-on" : ""}`}>
              <span className="block font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-strong">{p.tag} · {p.clause}</span>
              <span className="mt-1.5 block text-[0.92rem] leading-relaxed text-muted">{p.d}</span>
            </p>
          ))}
        </div>
      </div>

      <div>
        <p className="node-pop text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted" style={nd(1.3)}>Outputs</p>
        <ul className="mt-3 space-y-2.5">
          {QMS_OUTPUTS.map((t, i) => (
            <li key={t} className="pdca-out node-pop relative rounded-lg bg-primary px-4 py-3 text-[0.9rem] font-semibold text-white" style={nd(1.4 + i * 0.1)}>{t}</li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* The Quality Unit (PPT slide 23) as a reporting chart that draws     */
/* itself: Managing Director → independent Quality Unit → QA and QC.   */
/* ------------------------------------------------------------------ */
export function QualityUnitChart() {
  return (
    <Reveal className="qu-chart">
      <div className="flex flex-col items-center">
        <div className="node-pop flex items-center gap-3 rounded-full bg-white py-2 pl-2 pr-5 ring-1 ring-border" style={nd(0.1)}>
          <span className="grid h-9 w-9 place-items-center rounded-full bg-primary-tint text-primary"><Icon name="users" size={17} /></span>
          <span className="text-[0.92rem] font-semibold text-primary-ink">Managing Director</span>
        </div>
        <span aria-hidden="true" className="qu-line qu-v h-10" style={nd(0.35)} />
        <div className="node-pop rounded-2xl bg-gradient-to-br from-primary to-[#0b5597] px-7 py-4 text-center text-white shadow-[0_18px_40px_-20px_rgb(11_85_151/0.8)]" style={nd(0.6)}>
          <p className="font-display text-xl font-semibold">Quality Unit</p>
          <p className="mt-0.5 text-[0.8rem] text-on-dark-muted">Independent · reports directly to the MD</p>
        </div>
      </div>

      {/* Desktop: the line splits to the two departments */}
      <div aria-hidden="true" className="relative hidden h-10 md:block">
        <span className="qu-line qu-v absolute left-1/2 top-0 h-5 -translate-x-1/2" style={nd(0.85)} />
        <span className="qu-line qu-h absolute left-[calc(25%-0.75rem)] right-[calc(25%-0.75rem)] top-5" style={nd(1)} />
      </div>

      <div className="mt-8 grid grid-cols-1 gap-12 md:mt-0 md:grid-cols-2 md:gap-6">
        {/* Quality assurance */}
        <div className="relative">
          <span aria-hidden="true" className="qu-line qu-v absolute -top-5 left-1/2 hidden h-5 -translate-x-1/2 md:block" style={nd(1.2)} />
          <div className="node-pop mx-auto flex w-fit items-center gap-3 rounded-xl bg-white px-5 py-3 ring-1 ring-primary/25 shadow-[0_12px_30px_-20px_rgb(10_45_80/0.5)]" style={nd(1.35)}>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white"><Icon name="shield" size={19} /></span>
            <span><span className="block font-semibold text-primary-ink">Quality assurance</span><span className="text-xs text-muted">Runs the quality management system</span></span>
          </div>
          <ol className="mx-auto mt-7 grid max-w-lg grid-cols-1 gap-x-6 sm:grid-cols-2">
            {QA_RESPONSIBILITIES.map((r, i) => (
              <li key={r} className="node-pop flex items-baseline gap-3 border-b border-border py-2.5 text-[0.9rem] text-text" style={nd(1.5 + i * 0.05)}>
                <span className="font-mono text-[0.7rem] text-accent-strong">{String(i + 1).padStart(2, "0")}</span>{r}
              </li>
            ))}
          </ol>
        </div>

        {/* Quality control */}
        <div className="relative">
          <span aria-hidden="true" className="qu-line qu-v absolute -top-5 left-1/2 hidden h-5 -translate-x-1/2 md:block" style={nd(1.2)} />
          <div className="node-pop mx-auto flex w-fit items-center gap-3 rounded-xl bg-white px-5 py-3 ring-1 ring-primary/25 shadow-[0_12px_30px_-20px_rgb(10_45_80/0.5)]" style={nd(1.35)}>
            <span className="grid h-10 w-10 place-items-center rounded-lg bg-primary text-white"><Icon name="flask" size={19} /></span>
            <span><span className="block font-semibold text-primary-ink">Quality control</span><span className="text-xs text-muted">Responsible for all analysis</span></span>
          </div>
          <div className="node-pop mx-auto mt-7 max-w-lg" style={nd(1.55)}>
            <p className="leading-relaxed text-muted">Qualified, well-trained analysts and sophisticated instruments ensure product quality and consistency at every stage of the process.</p>
            <p className="mt-4 leading-relaxed text-muted">QC also gives customers analytical support and training during product and method development and validation.</p>
            <a href="#labs" className="group mt-5 inline-flex min-h-10 items-center gap-2 font-semibold text-primary"><span className="link-u">Inside our laboratories</span><Icon name="chevronDown" size={16} className="transition-transform duration-300 group-hover:translate-y-0.5" /></a>
          </div>
        </div>
      </div>

      <p className="node-pop mx-auto mt-12 flex w-fit max-w-xl items-start gap-2.5 text-[0.88rem] text-muted" style={nd(1.9)}>
        <Icon name="check" size={16} className="mt-0.5 shrink-0 text-accent-strong" />{QUALITY_UNIT[2]}
      </p>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Laboratory gallery: panels widen on hover or focus (desktop);       */
/* a swipeable row on phones.                                          */
/* ------------------------------------------------------------------ */
const LAB = [
  { name: "qc-analyst", caption: "Quality control laboratory" },
  { name: "hplc-system", caption: "HPLC system" },
  { name: "gc-instruments", caption: "Gas chromatographs" },
  { name: "qc-instrument-lab", caption: "Instrument laboratory" },
  { name: "melting-point", caption: "Melting point apparatus" },
  { name: "qa-team", caption: "Quality assurance team" },
];

export function LabGallery() {
  return (
    <ul className="lab-gallery -mx-4 flex snap-x snap-mandatory gap-3 overflow-x-auto px-4 pb-2 md:mx-0 md:h-[26rem] md:overflow-visible md:px-0 md:pb-0">
      {LAB.map((p, i) => (
        <li key={p.name} className="lab-panel relative aspect-[4/5] w-[78%] shrink-0 snap-center md:aspect-auto md:w-auto">
          <Reveal variant="image" delay={i * 70} className="zoom-parent absolute inset-0 overflow-hidden rounded-xl bg-white/10">
            <Img name={p.name} sizes="(min-width:768px) 40vw, 80vw" className="zoom-img absolute inset-0 h-full w-full object-cover" />
            <span aria-hidden="true" className="absolute inset-0 bg-gradient-to-t from-[#06223d]/80 via-[#06223d]/10 to-transparent" />
            <span className="lab-caption absolute inset-x-0 bottom-0 px-5 pb-4 text-white">
              <span className="block font-mono text-[0.68rem] text-white/70">{String(i + 1).padStart(2, "0")}</span>
              <span className="lab-caption-t mt-0.5 block whitespace-nowrap font-semibold">{p.caption}</span>
            </span>
          </Reveal>
        </li>
      ))}
    </ul>
  );
}

/* ------------------------------------------------------------------ */
/* Approvals register (Regulatory affairs): a compact list in two      */
/* groups beside one detail panel. Desktop: hover or select a row to   */
/* show it in the panel. Phones: the selected row opens in place.      */
/* ------------------------------------------------------------------ */
const isCert = (a: Approval) => /^(ISO|ZED|Kosher)/.test(a.short);
const GROUPS = [
  { title: "Regulatory approvals", items: APPROVALS.filter((a) => !isCert(a)) },
  { title: "Certifications", items: APPROVALS.filter(isCert) },
];

export function ApprovalsRegister() {
  const [active, setActive] = useState(APPROVALS[0].short);
  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-6">
        {GROUPS.map((g, gi) => (
          <Reveal key={g.title} delay={gi * 120} className={gi ? "mt-10" : ""}>
            <p className="flex items-baseline justify-between text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted"><span>{g.title}</span><span className="font-mono tracking-normal">{String(g.items.length).padStart(2, "0")}</span></p>
            <ul className="mt-3 border-t border-border">
              {g.items.map((a, i) => {
                const on = a.short === active;
                return (
                  <li key={a.short} className="node-pop border-b border-border" style={nd(0.1 + i * 0.06)}>
                    <button type="button" onClick={() => setActive(a.short)} onMouseEnter={() => setActive(a.short)} aria-expanded={on} className={`reg-row group relative flex w-full cursor-pointer items-center gap-4 py-3 pl-3 pr-2 text-left transition-colors duration-300 ${on ? "bg-primary-tint/60" : "hover:bg-surface"}`}>
                      <span aria-hidden="true" className={`absolute inset-y-0 left-0 w-0.5 origin-top bg-primary transition-transform duration-500 ${on ? "scale-y-100" : "scale-y-0"}`} />
                      <span className="grid h-10 w-14 shrink-0 place-items-center"><ApprovalMark a={a} size="xs" /></span>
                      <span className="min-w-0 flex-1">
                        <span className={`block font-semibold transition-colors ${on ? "text-primary" : "text-primary-ink"}`}>{a.short}</span>
                        <span className="block text-[0.8rem] leading-snug text-muted lg:truncate">{a.authority}</span>
                      </span>
                      {a.since && <span className="shrink-0 font-mono text-[0.72rem] text-muted">{a.since}</span>}
                      <Icon name="chevronDown" size={16} className={`shrink-0 text-primary transition-transform duration-300 lg:hidden ${on ? "rotate-180" : ""}`} />
                    </button>
                    {/* Phones: the scope opens under the row */}
                    <div className={`grid transition-[grid-template-rows] duration-500 ease-out lg:hidden ${on ? "grid-rows-[1fr]" : "grid-rows-[0fr]"}`}>
                      <p className="overflow-hidden px-3 text-[0.9rem] leading-relaxed text-muted"><span className="block pb-4 pt-1">{a.scope}</span></p>
                    </div>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        ))}
      </div>

      {/* Desktop: one detail panel; all entries share a grid cell so the panel never changes height */}
      <div className="hidden lg:col-span-6 lg:block">
        <Reveal variant="scale" delay={150} className="sticky top-32 overflow-hidden rounded-2xl bg-white ring-1 ring-border shadow-[0_30px_60px_-40px_rgb(10_45_80/0.55)]">
          <div aria-hidden="true" className="h-1.5 bg-gradient-to-r from-primary via-accent to-primary" />
          <div className="grid p-10">
            {APPROVALS.map((a) => (
              <div key={a.short} aria-hidden={a.short !== active} className={`reg-pane [grid-area:1/1] ${a.short === active ? "is-on" : ""}`}>
                <div className="flex h-24 items-center"><ApprovalMark a={a} size="lg" /></div>
                <div className="mt-6 flex flex-wrap items-baseline gap-x-4 gap-y-1">
                  <p className="font-display text-3xl font-semibold tracking-tight text-primary-ink">{a.short}</p>
                  {a.since && <p className="rounded-full bg-primary-tint px-3 py-1 font-mono text-[0.72rem] text-primary">Since {a.since}</p>}
                </div>
                <p className="mt-2 font-medium text-primary">{a.authority}</p>
                <p className="mt-5 text-[1.02rem] leading-relaxed text-text">{a.scope}</p>
              </div>
            ))}
          </div>
          <a href={asset("/enquiry/?type=technical")} className="group flex items-center justify-between gap-4 border-t border-border bg-surface px-10 py-5 text-sm font-semibold text-primary transition-colors hover:bg-primary-tint">
            Certificates are available to customers on request<Icon name="arrowRight" size={16} className="arrow-nudge shrink-0" />
          </a>
        </Reveal>
      </div>
    </div>
  );
}
