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
/* ISO 9001:2015 quality management system (PPT slide 21) as a dial.  */
/* Desktop: the stage stays pinned while the page scrolls. The dial    */
/* turns so each phase comes to the top under a fixed pointer, its arc */
/* and dots light up, and the copy beside it changes; after Act it     */
/* completes the turn back to Plan (continual improvement). The dot    */
/* ring echoes the dotted map on Manufacturing. Phones: a column.      */
/* ------------------------------------------------------------------ */
const QMS_INPUTS = ["Organisation and its context", "Customer requirements", "Needs & expectations of interested parties"];
const QMS_OUTPUTS = ["Customer satisfaction", "Results of the QMS", "Products & services"];
// Sub-clause numbers and titles as published in ISO 9001:2015
const PDCA = [
  { L: "P", title: "Plan", node: "Planning", clause: "Clause 6", d: "Set the course before work begins.", subs: [["6.1", "Actions to address risks and opportunities"], ["6.2", "Quality objectives and planning to achieve them"], ["6.3", "Planning of changes"]] },
  { L: "D", title: "Do", node: "Support & operation", clause: "Clauses 7–8", d: "Run every operation under control.", subs: [["7.1", "Resources"], ["7.2", "Competence"], ["7.5", "Documented information"], ["8.1", "Operational planning and control"]] },
  { L: "C", title: "Check", node: "Performance evaluation", clause: "Clause 9", d: "Measure how well the system performs.", subs: [["9.1", "Monitoring, measurement, analysis and evaluation"], ["9.2", "Internal audit"], ["9.3", "Management review"]] },
  { L: "A", title: "Act", node: "Improvement", clause: "Clause 10", d: "Correct, learn and improve — then begin again.", subs: [["10.2", "Nonconformity and corrective action"], ["10.3", "Continual improvement"]] },
];
const STAGES = [
  { label: "Inputs", kicker: "Before the cycle", title: "Inputs", node: "What the system starts from", d: "Every cycle starts from the context we work in, what customers require and what interested parties expect.", list: QMS_INPUTS },
  ...PDCA.map((s, i) => ({ label: s.title, kicker: `Step 0${i + 1} · ${s.clause}`, title: s.title, node: s.node, d: s.d, subs: s.subs })),
  { label: "Outputs", kicker: "After each turn", title: "Outputs", node: "What the system delivers", d: "Each turn of the cycle delivers to agreed requirements — and makes the next turn better.", list: QMS_OUTPUTS },
] as { label: string; kicker: string; title: string; node: string; d: string; list?: string[]; subs?: string[][] }[];

// Dial geometry (viewBox 600): quadrants centred at the top, right, bottom and left, clockwise P → D → C → A
const C0 = 300;
const at = (deg: number, r: number) => [C0 + r * Math.cos((deg * Math.PI) / 180), C0 + r * Math.sin((deg * Math.PI) / 180)].map((n) => +n.toFixed(2));
const QUAD = [-90, 0, 90, 180];
const arc = (c: number, r: number) => { const [x1, y1] = at(c - 41, r); const [x2, y2] = at(c + 41, r); return `M ${x1} ${y1} A ${r} ${r} 0 0 1 ${x2} ${y2}`; };
const DOTS = Array.from({ length: 96 }, (_, i) => { const deg = -90 + i * 3.75; const q = Math.round(((deg + 90 + 360) % 360) / 90) % 4; const [x, y] = at(deg, 262); return { x, y, q, i }; });
const clamp = (n: number) => Math.min(1, Math.max(0, n));
const ease = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);

function Dial({ phase, overview = false }: { phase: number; overview?: boolean }) {
  // Quadrant q (0–3) is phase q + 1; during Outputs every quadrant is complete
  const qState = (q: number) => (overview ? "is-done" : phase === q + 1 ? "is-active" : phase > q + 1 ? "is-done" : "");
  return (
    <svg viewBox="0 0 600 600" className="qd-dial h-full w-full" aria-hidden="true">
      <circle cx={C0} cy={C0} r="228" fill="none" stroke="var(--border-strong)" strokeWidth="1" />
      <circle cx={C0} cy={C0} r="150" fill="none" stroke="var(--border)" strokeWidth="1" strokeDasharray="2 6" />
      <g className="qd-rot">
        {[0, 1, 2, 3].map((q) => (
          <g key={q} className={qState(q)}>
            {DOTS.filter((d) => d.q === q).map((d) => <circle key={d.i} cx={d.x} cy={d.y} r="2.6" className="qd-dot" style={{ "--i": d.i } as CSSProperties} />)}
            <path d={arc(QUAD[q], 196)} fill="none" strokeWidth="12" strokeLinecap="round" className="qd-arc" />
            <path d={arc(QUAD[q], 196)} fill="none" strokeWidth="12" strokeLinecap="round" pathLength={1} className="qd-arc-on" />
            <g transform={`translate(${at(QUAD[q], 128).join(" ")})`}><g className="qd-upright">
              <text y="12" textAnchor="middle" className="qd-letter">{PDCA[q].L}</text>
              <text y="36" textAnchor="middle" className="qd-name">{PDCA[q].title}</text>
            </g></g>
          </g>
        ))}
      </g>
      {/* Fixed pointer at the top: the phase under it is the one being described */}
      <path d={`M ${C0 - 8} 14 L ${C0 + 8} 14 L ${C0} 28 Z`} fill="var(--primary-ink)" />
      <line x1={C0} y1="28" x2={C0} y2="96" stroke="var(--primary-ink)" strokeOpacity=".35" strokeWidth="1" />
      {/* Centre: the ISO 9001 logo from the company presentation */}
      <circle cx={C0} cy={C0} r="78" fill="#fff" className="qd-core" />
      <image href={asset("/images/logos/iso-9001.png")} x={C0 - 48} y={C0 - 48} width="96" height="96" />
    </svg>
  );
}

export function QmsStory() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const wrap = wrapRef.current, stage = stageRef.current;
      if (!desktop.matches || !wrap || !stage) return;
      const r = wrap.getBoundingClientRect();
      const top = parseFloat(getComputedStyle(stage).top) || 0;
      const s = Math.min(5.999, clamp((top - r.top) / Math.max(1, r.height - stage.offsetHeight)) * 6);
      // Each phase holds at the top for most of its share of the scroll, then the dial turns to the next;
      // after Act it turns once more, back to Plan
      const f = Math.min(4, Math.max(0, s - 1));
      const k = Math.floor(f), t = f - k;
      const rot = -90 * (k >= 4 ? 4 : k + (t < 0.6 ? 0 : ease((t - 0.6) / 0.4)));
      stage.style.setProperty("--rot", `${rot.toFixed(2)}deg`);
      stage.style.setProperty("--t", (s - Math.floor(s)).toFixed(3));
      setPhase(Math.floor(s));
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    desktop.addEventListener("change", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); desktop.removeEventListener("change", onScroll); cancelAnimationFrame(raf); };
  }, []);

  const goto = (i: number) => {
    const wrap = wrapRef.current, stage = stageRef.current;
    if (!wrap || !stage) return;
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    const y = wrap.getBoundingClientRect().top + window.scrollY - top + (wrap.offsetHeight - stage.offsetHeight) * ((i + 0.3) / 6);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: "smooth" });
  };

  return (
    <>
      {/* Screen readers (desktop): the whole cycle as text */}
      <ol className="sr-only hidden lg:block">
        {STAGES.map((s) => <li key={s.label}>{s.title} — {s.node}: {s.d} {(s.list ?? s.subs?.map((x) => x.join(" ")) ?? []).join("; ")}.</li>)}
      </ol>

      {/* Desktop: pinned stage */}
      <div ref={wrapRef} className="hidden lg:block lg:h-[340vh]">
        <div ref={stageRef} className="qd-stage sticky top-28">
        <Reveal>
          <div aria-hidden="true" className="grid grid-cols-12 items-center gap-10 xl:gap-16">
            <div className="col-span-5">
              <div className="grid">
                {STAGES.map((s, i) => (
                  <div key={s.label} className={`qd-panel [grid-area:1/1] ${i === phase ? "is-on" : ""}`}>
                    <p className="flex items-center gap-2.5 font-mono text-[0.72rem] uppercase tracking-[0.12em] text-accent-strong"><span className="h-2 w-2 rounded-full bg-accent-strong" />{s.kicker}</p>
                    <p className="qd-title mt-4 font-display text-[clamp(3.5rem,5.6vw,5.75rem)] font-semibold leading-[0.95] tracking-[-0.035em] text-primary-ink">{s.title}</p>
                    <p className="mt-3 text-lg font-medium text-muted">{s.node}</p>
                    <p className="mt-6 max-w-md text-[1.1rem] leading-relaxed text-text">{s.d}</p>
                    <ul className="mt-7 max-w-md border-t border-border">
                      {s.subs
                        ? s.subs.map(([n, t]) => <li key={n} className="grid grid-cols-[2.75rem_1fr] border-b border-border py-2.5 text-[0.9rem] text-muted"><span className="font-mono text-[0.75rem] leading-[1.6] text-accent-strong">{n}</span>{t}</li>)
                        : s.list?.map((t) => <li key={t} className="border-b border-border py-2.5 text-[0.95rem] text-primary-ink">{t}</li>)}
                    </ul>
                  </div>
                ))}
              </div>
            </div>
            <div className="col-span-7">
              <div className="mx-auto aspect-square w-full max-w-[min(34rem,62vh)]"><Dial phase={phase} /></div>
            </div>
          </div>
          {/* Index: where you are in the cycle; the bar under the current phase fills as you scroll */}
          <ol className="mt-6 grid grid-cols-6 gap-3 border-t border-border pt-4">
            {STAGES.map((s, i) => (
              <li key={s.label}>
                <button type="button" tabIndex={-1} onClick={() => goto(i)} className={`qd-idx group w-full cursor-pointer text-left ${i === phase ? "is-on" : i < phase ? "is-done" : ""}`}>
                  <span className="relative block h-0.5 overflow-hidden rounded-full bg-border"><span className="qd-idx-bar absolute inset-0 origin-left bg-primary" /></span>
                  <span className="mt-2.5 flex items-baseline gap-2 text-[0.8rem]"><span className="font-mono text-[0.7rem]">0{i + 1}</span><span className="font-semibold">{s.label}</span></span>
                </button>
              </li>
            ))}
          </ol>
        </Reveal>
        </div>
      </div>

      {/* Phones and small tablets: the dial as an overview, then the phases in order */}
      <div className="lg:hidden">
        <Reveal className="mx-auto mb-10 aspect-square w-full max-w-[20rem]"><Dial phase={0} overview /></Reveal>
        <ol>
          {STAGES.map((s) => (
            <Reveal as="li" key={s.label} className="border-l-2 border-primary/30 pb-8 pl-5 last:pb-0">
              <p className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-accent-strong">{s.kicker}</p>
              <p className="mt-1 font-display text-2xl font-semibold text-primary-ink">{s.title}<span className="ml-2 text-sm font-medium text-muted">{s.node}</span></p>
              <p className="mt-2 text-[0.95rem] text-text">{s.d}</p>
              <ul className="mt-3 border-t border-border">
                {s.subs
                  ? s.subs.map(([n, t]) => <li key={n} className="grid grid-cols-[2.6rem_1fr] border-b border-border py-2 text-[0.88rem] text-muted"><span className="font-mono text-[0.72rem] text-accent-strong">{n}</span>{t}</li>)
                  : s.list?.map((t) => <li key={t} className="border-b border-border py-2 text-[0.9rem] text-primary-ink">{t}</li>)}
              </ul>
            </Reveal>
          ))}
        </ol>
      </div>
    </>
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
const isCert = (a: Approval) => /^(ISO|ZED)/.test(a.short);
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
                {a.logo && <div className="mb-6 flex h-24 items-center"><ApprovalMark a={a} size="lg" /></div>}
                <div className="flex flex-wrap items-baseline gap-x-4 gap-y-1">
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
