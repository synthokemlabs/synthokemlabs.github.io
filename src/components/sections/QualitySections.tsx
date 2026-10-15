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
/* ISO 9001:2015 quality management system (PPT slide 21) as a scroll- */
/* driven control panel. Desktop: the panel stays pinned; as the page  */
/* scrolls, Inputs light up, then each of Plan–Do–Check–Act opens in   */
/* turn (its card widens to show the clause, summary and the clause's  */
/* key activities), the continual-improvement loop runs back from Act  */
/* to Plan, and Outputs light up. Phones: a vertical timeline.         */
/* ------------------------------------------------------------------ */
const QMS_INPUTS = ["Organisation and its context", "Customer requirements", "Needs & expectations of interested parties"];
const QMS_OUTPUTS = ["Customer satisfaction", "Results of the QMS", "Products & services"];
// Key activities are the ISO 9001:2015 sub-clause headings for each phase
const PDCA = [
  { n: "01", title: "Plan", node: "Planning", clause: "Clause 6", icon: "target" as const, d: "Set the course before work begins.", points: ["Actions on risks and opportunities", "Quality objectives and how to meet them", "Planning of changes"] },
  { n: "02", title: "Do", node: "Support & operation", clause: "Clauses 7 – 8", icon: "cog" as const, d: "Run every operation under control.", points: ["Resources, competence and awareness", "Documented information", "Operational planning and control"] },
  { n: "03", title: "Check", node: "Performance evaluation", clause: "Clause 9", icon: "search" as const, d: "Measure how well the system performs.", points: ["Monitoring, measurement and analysis", "Internal audit", "Management review"] },
  { n: "04", title: "Act", node: "Improvement", clause: "Clause 10", icon: "spin" as const, d: "Correct, learn and improve — then begin again.", points: ["Nonconformity and corrective action", "Continual improvement"] },
];
const PHASES = ["Inputs", ...PDCA.map((s) => s.title), "Outputs"];
const clamp = (n: number) => Math.min(1, Math.max(0, n));

export function QmsStory() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [phase, setPhase] = useState(0);
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const wrap = wrapRef.current, stage = stageRef.current, list = listRef.current;
      if (desktop.matches && wrap && stage) {
        const r = wrap.getBoundingClientRect();
        const top = parseFloat(getComputedStyle(stage).top) || 0;
        const p = clamp((top - r.top) / Math.max(1, r.height - stage.offsetHeight));
        const s = Math.min(5.999, p * 6);
        stage.style.setProperty("--p", p.toFixed(4));
        stage.style.setProperty("--loop", clamp((s - 4) / 0.8).toFixed(4));
        setPhase(Math.floor(s));
      } else if (list) {
        const rows = [...list.querySelectorAll<HTMLElement>("[data-step]")];
        const len = rows[rows.length - 1].offsetTop;
        const f = clamp((window.innerHeight * 0.62 - (list.getBoundingClientRect().top + 20)) / Math.max(1, len));
        list.style.setProperty("--mlen", `${len}px`);
        list.style.setProperty("--mfill", String(f));
        setReached(rows.filter((row) => row.offsetTop <= f * len + 1).length - 1);
      }
    };
    const onScroll = () => { if (!raf) raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    desktop.addEventListener("change", onScroll);
    return () => { window.removeEventListener("scroll", onScroll); window.removeEventListener("resize", onScroll); desktop.removeEventListener("change", onScroll); cancelAnimationFrame(raf); };
  }, []);

  // Clicking a step scrolls the page to the point where that step is open
  const goto = (i: number) => {
    const wrap = wrapRef.current, stage = stageRef.current;
    if (!wrap || !stage) return;
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    const y = wrap.getBoundingClientRect().top + window.scrollY - top + (wrap.offsetHeight - stage.offsetHeight) * ((i + 0.5) / 6);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: "smooth" });
  };
  const state = (i: number) => (i === phase ? "is-active" : i < phase ? "is-done" : "");

  return (
    <>
      {/* Screen readers (desktop): the whole cycle as text; the pinned panel is visual only */}
      <ol className="sr-only hidden lg:block">
        <li>Inputs: {QMS_INPUTS.join(", ")}.</li>
        {PDCA.map((s) => <li key={s.n}>{s.title} — {s.node} ({s.clause}): {s.d} {s.points.join("; ")}.</li>)}
        <li>Outputs: {QMS_OUTPUTS.join(", ")}.</li>
      </ol>

      {/* Desktop: the pinned control panel */}
      <div ref={wrapRef} className="hidden lg:block lg:h-[300vh]">
        <div ref={stageRef} aria-hidden="true" className="qms-stage sticky top-28">
          <div className="qms-panel rounded-3xl p-7 xl:p-8">
            <div className="flex items-center justify-between gap-6">
              <p className="flex items-center gap-3 text-[0.7rem] font-semibold uppercase tracking-[0.18em] text-white/60">
                <span className="qms-live h-1.5 w-1.5 rounded-full bg-accent" />ISO 9001:2015 · Quality management system
              </p>
              <p className="flex items-center gap-4">
                <span className="font-mono text-[0.72rem] text-white/70"><span className="text-accent-soft">{String(phase + 1).padStart(2, "0")}</span> / 06 · {PHASES[phase]}</span>
                <span className="flex gap-1">{PHASES.map((t, i) => <span key={t} className={`h-1 w-6 rounded-full transition-colors duration-500 ${i <= phase ? "bg-accent" : "bg-white/15"}`} />)}</span>
              </p>
            </div>

            <div className="mt-6 grid grid-cols-[9.5rem_minmax(0,1fr)_9.5rem] gap-6 xl:grid-cols-[11rem_minmax(0,1fr)_11rem]">
              {/* Inputs */}
              <div className={`qms-port qms-port-in relative flex flex-col rounded-2xl p-4 ${state(0)}`}>
                <p className="flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-accent-soft"><Icon name="arrowRight" size={13} />Inputs</p>
                <p className="mt-1 text-[0.72rem] text-white/50">What the system starts from</p>
                <ul className="mt-auto space-y-2 pt-4">{QMS_INPUTS.map((t) => <li key={t} className="border-t border-white/10 pt-2 text-[0.8rem] leading-snug text-white/85">{t}</li>)}</ul>
              </div>

              {/* Plan – Do – Check – Act */}
              <div className="flex h-[19.5rem] gap-2.5">
                {PDCA.map((s, k) => (
                  <button key={s.n} type="button" tabIndex={-1} onClick={() => goto(k + 1)} className={`qms-card relative cursor-pointer overflow-hidden rounded-2xl text-left ${state(k + 1)}`}>
                    <span className="qms-card-bar absolute inset-x-0 top-0 h-[3px]" />
                    {/* Folded: number, icon and a vertical title */}
                    <span className="qms-mini absolute inset-0 flex flex-col items-center justify-between py-5">
                      <span className="font-mono text-[0.7rem] text-white/50">{s.n}</span>
                      <span className="qms-mini-icon grid h-10 w-10 place-items-center rounded-full"><Icon name={s.icon} size={18} /></span>
                      <span className="rotate-180 font-display text-lg font-semibold tracking-wide text-white/85 [writing-mode:vertical-rl]">{s.title}</span>
                    </span>
                    {/* Open: fixed-width content revealed as the card widens */}
                    <span className="qms-full absolute inset-y-0 left-0 flex w-[17.5rem] flex-col p-6 xl:w-[21rem]">
                      <span className="flex items-center justify-between">
                        <span className="grid h-11 w-11 place-items-center rounded-xl bg-white/10 text-accent-soft ring-1 ring-white/15"><Icon name={s.icon} size={20} /></span>
                        <span className="font-mono text-[0.68rem] uppercase tracking-[0.12em] text-accent-soft">{s.clause}</span>
                      </span>
                      <span className="mt-5 flex items-baseline gap-3"><span className="font-display text-[2rem] font-semibold leading-none text-white">{s.title}</span><span className="text-sm text-white/60">{s.node}</span></span>
                      <span className="mt-2.5 text-[0.95rem] leading-snug text-white/85">{s.d}</span>
                      <span className="mt-auto block space-y-2 border-t border-white/10 pt-4">
                        {s.points.map((pt, j) => (
                          <span key={pt} className="qms-pt flex items-start gap-2.5 text-[0.82rem] leading-snug text-white/75" style={{ "--k": j } as CSSProperties}>
                            <Icon name="check" size={14} className="mt-0.5 shrink-0 text-accent" />{pt}
                          </span>
                        ))}
                      </span>
                    </span>
                  </button>
                ))}
              </div>

              {/* Outputs */}
              <div className={`qms-port qms-port-out relative flex flex-col rounded-2xl p-4 ${state(5)}`}>
                <p className="flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-accent-soft"><Icon name="check" size={13} />Outputs</p>
                <p className="mt-1 text-[0.72rem] text-white/50">What it delivers</p>
                <ul className="mt-auto space-y-2 pt-4">{QMS_OUTPUTS.map((t) => <li key={t} className="border-t border-white/10 pt-2 text-[0.8rem] leading-snug text-white/85">{t}</li>)}</ul>
              </div>
            </div>

            {/* Progress rail under the cycle, and the loop from Act back to Plan */}
            <div className="mt-5 grid grid-cols-[9.5rem_minmax(0,1fr)_9.5rem] gap-6 xl:grid-cols-[11rem_minmax(0,1fr)_11rem]">
              <span />
              <div className="relative h-14">
                <span className="absolute inset-x-0 top-0 h-px bg-white/15" />
                <span className="qms-rail absolute inset-x-0 top-0 h-px origin-left bg-gradient-to-r from-accent/40 via-accent to-accent-soft" />
                <span className="qms-head absolute top-0 -ml-1 -mt-1 h-2 w-2 rounded-full bg-accent-soft" />
                <span className="absolute inset-x-6 bottom-3 top-4 rounded-b-2xl border-2 border-t-0 border-dashed border-white/15" />
                <span className="qms-loop absolute inset-x-6 bottom-3 top-4 rounded-b-2xl border-2 border-t-0 border-accent" />
                <span className={`absolute -top-0 left-6 -ml-[7px] mt-1.5 border-x-[7px] border-b-[9px] border-x-transparent transition-colors duration-300 ${phase >= 5 ? "border-b-accent" : "border-b-white/25"}`} />
                <span className={`absolute bottom-3 left-1/2 flex -translate-x-1/2 translate-y-1/2 items-center gap-1.5 whitespace-nowrap rounded-full px-3 py-0.5 text-[0.72rem] font-semibold transition-colors duration-500 ${phase >= 4 ? "bg-accent text-[#06223d]" : "bg-[#0a2744] text-white/60"}`}><Icon name="history" size={13} />Continual improvement</span>
              </div>
              <span />
            </div>
          </div>
        </div>
      </div>

      {/* Phones and tablets: a vertical timeline */}
      <ol ref={listRef} className="qms-list relative lg:hidden">
        <span aria-hidden="true" className="qms-mtrack absolute left-5 top-5 w-0.5 -translate-x-1/2 bg-white/15" />
        <span aria-hidden="true" className="qms-mtrack qms-mfill absolute left-5 top-5 w-0.5 origin-top -translate-x-1/2 bg-accent" />
        <li data-step={0} className={`qms-row relative flex gap-5 pb-9 ${reached >= 0 ? "is-done" : ""}`}>
          <span aria-hidden="true" className="qms-dot relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full font-mono text-[0.7rem] font-semibold">In</span>
          <div className="min-w-0 pt-1">
            <p className="font-display text-xl font-semibold text-white">Inputs</p>
            <ul className="mt-3 divide-y divide-white/10 rounded-xl bg-white/5 px-4 ring-1 ring-white/10">{QMS_INPUTS.map((t) => <li key={t} className="py-2 text-[0.88rem] text-white/85">{t}</li>)}</ul>
          </div>
        </li>
        {PDCA.map((s, k) => (
          <Fragment key={s.n}>
            <li data-step={k + 1} className={`qms-row relative flex gap-5 pb-9 ${k + 1 <= reached ? "is-done" : ""}`}>
              <span aria-hidden="true" className="qms-dot relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full"><Icon name={s.icon} size={17} /></span>
              <div className="min-w-0 pt-1">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-accent-soft">Step {s.n} · {s.clause}</p>
                <p className="mt-1 font-display text-xl font-semibold text-white">{s.title}<span className="text-white/55"> · {s.node}</span></p>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-white/75">{s.d}</p>
                <ul className="mt-3 space-y-1.5">{s.points.map((pt) => <li key={pt} className="flex gap-2 text-[0.86rem] text-white/70"><Icon name="check" size={14} className="mt-0.5 shrink-0 text-accent" />{pt}</li>)}</ul>
              </div>
            </li>
            {k === 3 && (
              <li className="relative flex gap-5 pb-9">
                <span aria-hidden="true" className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-dashed border-accent/50 bg-[#0a2744] text-accent"><Icon name="history" size={17} /></span>
                <p className="pt-2.5 text-[0.92rem] text-white/70"><span className="font-semibold text-accent-soft">Back to Plan.</span> Continual improvement — the cycle starts again.</p>
              </li>
            )}
          </Fragment>
        ))}
        <li data-step={5} className={`qms-row relative flex gap-5 ${reached >= 5 ? "is-done" : ""}`}>
          <span aria-hidden="true" className="qms-dot relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full font-mono text-[0.7rem] font-semibold">Out</span>
          <div className="min-w-0 pt-1">
            <p className="font-display text-xl font-semibold text-white">Outputs</p>
            <ul className="mt-3 divide-y divide-white/10 rounded-xl bg-white/5 px-4 ring-1 ring-white/10">{QMS_OUTPUTS.map((t) => <li key={t} className="py-2 text-[0.88rem] text-white/85">{t}</li>)}</ul>
          </div>
        </li>
      </ol>
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
