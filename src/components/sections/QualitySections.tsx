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
/* ISO 9001:2015 quality management system (PPT slide 21), told as a   */
/* scroll story. Desktop: the diagram stays pinned while the page      */
/* scrolls; the line fills from Inputs through Plan–Do–Check–Act to    */
/* Outputs, the loop from Act back to Plan draws during Act, and the   */
/* reading panel explains the current step. Phones: a vertical         */
/* timeline whose line fills as it scrolls past.                       */
/* ------------------------------------------------------------------ */
const QMS_INPUTS = ["Organisation and its context", "Customer requirements", "Needs & expectations of interested parties"];
const QMS_OUTPUTS = ["Customer satisfaction", "Results of the QMS", "Products & services"];
const STEPS = [
  { n: "In", title: "Inputs", node: "What the system starts from", kicker: "Inputs", d: "Every cycle starts from what customers and other interested parties need, and from the context Synthokem works in.", items: QMS_INPUTS },
  { n: "01", title: "Plan", node: "Planning", kicker: "Step 01 · Clause 6", d: "Risks and opportunities are assessed, and measurable quality objectives are set before work begins." },
  { n: "02", title: "Do", node: "Support & operation", kicker: "Step 02 · Clauses 7 – 8", d: "Competent people, the right resources and documented procedures keep every operation under control." },
  { n: "03", title: "Check", node: "Performance evaluation", kicker: "Step 03 · Clause 9", d: "Monitoring, analysis, internal audits and management review show how well the system is working." },
  { n: "04", title: "Act", node: "Improvement", kicker: "Step 04 · Clause 10", d: "Nonconformities are corrected and the lessons go back into planning — so the cycle starts again, better." },
  { n: "Out", title: "Outputs", node: "What the system delivers", kicker: "Outputs", d: "Products and services that meet requirements, satisfied customers, and measurable results of the quality system.", items: QMS_OUTPUTS },
];
const clamp = (n: number) => Math.min(1, Math.max(0, n));
// Track runs from the Inputs block to the Outputs block (columns 1.2 : 1 : 1 : 1 : 1 : 1.2); the four
// step markers sit at 1/8, 3/8, 5/8 and 7/8 of it. Step s (0–6 of scroll) fills it marker by marker; during
// Act the line holds while the improvement loop draws (s 4–4.7), then runs on to Outputs.
const fillAt = (s: number) => (s < 1 ? s * 0.125 : s < 4 ? 0.125 + (s - 1) * 0.25 : s < 4.7 ? 0.875 : Math.min(1, 0.875 + ((s - 4.7) / 0.3) * 0.125));
const loopAt = (s: number) => clamp((s - 4) / 0.7);

export function QmsStory() {
  const wrapRef = useRef<HTMLDivElement>(null);
  const stageRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLOListElement>(null);
  const [active, setActive] = useState(0);
  const [reached, setReached] = useState(-1);

  useEffect(() => {
    const desktop = window.matchMedia("(min-width: 1024px)");
    let raf = 0;
    const update = () => {
      raf = 0;
      const vh = window.innerHeight;
      const wrap = wrapRef.current, stage = stageRef.current, list = listRef.current;
      if (desktop.matches && wrap && stage) {
        const r = wrap.getBoundingClientRect();
        const span = r.height - stage.offsetHeight;
        const top = parseFloat(getComputedStyle(stage).top) || 0;
        const s = Math.min(5.999, clamp((top - r.top) / Math.max(1, span)) * 6);
        stage.style.setProperty("--fill", String(fillAt(s)));
        stage.style.setProperty("--loop", String(loopAt(s)));
        setActive(Math.floor(s));
      } else if (list) {
        // The line runs from the first dot to the last and fills to a little past the middle of the
        // screen; each step lights up as the fill reaches its dot
        const rows = [...list.querySelectorAll<HTMLElement>("[data-step]")];
        const len = rows[rows.length - 1].offsetTop;
        const f = clamp((vh * 0.62 - (list.getBoundingClientRect().top + 20)) / Math.max(1, len));
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

  // Clicking a step scrolls the page to the point where that step is explained
  const goto = (i: number) => {
    const wrap = wrapRef.current, stage = stageRef.current;
    if (!wrap || !stage) return;
    const top = parseFloat(getComputedStyle(stage).top) || 0;
    const y = wrap.getBoundingClientRect().top + window.scrollY - top + (wrap.offsetHeight - stage.offsetHeight) * ((i + 0.5) / 6);
    const lenis = (window as unknown as { __lenis?: { scrollTo: (y: number) => void } }).__lenis;
    if (lenis) lenis.scrollTo(y); else window.scrollTo({ top: y, behavior: "smooth" });
  };
  const state = (i: number) => (i === active ? "is-active" : i < active ? "is-done" : "");

  return (
    <>
      {/* Screen readers (desktop): the whole cycle as text; the pinned diagram is visual only */}
      <ol className="sr-only hidden lg:block">
        {STEPS.map((s) => <li key={s.n}>{s.title} — {s.node}: {s.d}{s.items ? ` (${s.items.join(", ")})` : ""}</li>)}
      </ol>

      {/* Desktop: pinned diagram + reading panel */}
      <div ref={wrapRef} className="hidden lg:block lg:h-[270vh]">
        <div ref={stageRef} aria-hidden="true" className="qms-stage sticky top-32">
          <div className="rounded-2xl bg-white px-10 pb-9 pt-7 ring-1 ring-border shadow-[0_30px_60px_-45px_rgb(10_45_80/0.5)]">
            <div className="flex items-center justify-between text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">
              <span>ISO 9001:2015 · Quality management system</span>
              <span className="flex items-center gap-4">
                <span className={`qms-hint flex items-center gap-1.5 normal-case tracking-normal ${active === 0 ? "" : "opacity-0"}`}>Scroll to follow the cycle<Icon name="chevronDown" size={14} /></span>
                <span className="flex gap-1">{STEPS.map((s, i) => <span key={s.n} className={`h-1 w-5 rounded-full transition-colors duration-300 ${i <= active ? "bg-primary" : "bg-border"}`} />)}</span>
              </span>
            </div>

            <div className="relative mt-7 grid min-h-[12.5rem] grid-cols-[1.2fr_1fr_1fr_1fr_1fr_1.2fr]">
              {/* The line, and its fill */}
              <span className="absolute left-[18.75%] right-[18.75%] top-7 h-0.5 bg-border" />
              <span className="qms-fill absolute left-[18.75%] right-[18.75%] top-7 h-0.5 origin-left bg-primary" />
              <span className={`absolute right-[18.75%] top-7 -mt-[5px] mr-px border-y-[6px] border-l-[8px] border-y-transparent transition-colors duration-300 ${active === 5 ? "border-l-primary" : "border-l-border-strong"}`} />
              {/* Continual improvement: Act back to Plan, drawn during the Act step */}
              <div className="absolute left-[26.5625%] right-[26.5625%] top-[8.6rem] h-11">
                <span className="absolute inset-0 rounded-b-2xl border-2 border-t-0 border-dashed border-border-strong" />
                <span className="qms-loop absolute inset-0 rounded-b-2xl border-2 border-t-0 border-primary" />
                <span className={`absolute -left-[7px] -top-2 border-x-[7px] border-b-[9px] border-x-transparent transition-colors duration-300 ${active >= 5 ? "border-b-primary" : "border-b-border-strong"}`} />
                <span className={`absolute bottom-0 left-1/2 flex -translate-x-1/2 translate-y-1/2 items-center gap-1.5 whitespace-nowrap bg-white px-3 text-[0.75rem] font-semibold transition-colors duration-300 ${active >= 4 ? "text-primary" : "text-muted"}`}><Icon name="history" size={14} />Continual improvement</span>
              </div>

              {/* Inputs */}
              <div className={`qms-io self-start overflow-hidden rounded-xl border ${state(0)}`}>
                <p className="qms-io-head flex h-14 items-center gap-2 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em]"><Icon name="arrowRight" size={14} />Inputs</p>
                <ul className="divide-y divide-border border-t border-border bg-white px-4">
                  {QMS_INPUTS.map((t) => <li key={t} className="py-2 text-[0.8rem] leading-snug text-primary-ink">{t}</li>)}
                </ul>
              </div>

              {STEPS.slice(1, 5).map((s, k) => (
                <button key={s.n} type="button" tabIndex={-1} onClick={() => goto(k + 1)} className={`qms-step group flex cursor-pointer flex-col items-center text-center ${state(k + 1)}`}>
                  <span className="qms-dot relative z-10 grid h-14 w-14 place-items-center rounded-full font-mono text-sm font-semibold">{s.n}</span>
                  <span className="qms-title mt-3.5 font-display text-xl font-semibold">{s.title}</span>
                  <span className="mt-0.5 max-w-[9rem] text-[0.74rem] leading-snug text-muted">{s.node}</span>
                </button>
              ))}

              {/* Outputs */}
              <div className={`qms-io qms-out self-start overflow-hidden rounded-xl border ${state(5)}`}>
                <p className="qms-io-head flex h-14 items-center gap-2 px-4 text-[0.68rem] font-semibold uppercase tracking-[0.14em]"><Icon name="check" size={14} />Outputs</p>
                <ul className="divide-y divide-border border-t border-border bg-white px-4">
                  {QMS_OUTPUTS.map((t) => <li key={t} className="py-2 text-[0.8rem] leading-snug text-primary-ink">{t}</li>)}
                </ul>
              </div>
            </div>

            {/* Reading panel: all six share one cell, so it never changes height */}
            <div className="mt-6 grid border-t border-border pt-7">
              {STEPS.map((s, i) => (
                <div key={s.n} className={`qms-read [grid-area:1/1] grid grid-cols-12 items-baseline gap-8 ${i === active ? "is-on" : ""}`}>
                  <div className="col-span-4">
                    <p className="font-mono text-[0.72rem] uppercase tracking-[0.1em] text-accent-strong">{s.kicker}</p>
                    <p className="mt-1.5 font-display text-[1.7rem] font-semibold leading-tight text-primary-ink">{s.title}</p>
                    {i > 0 && i < 5 && <p className="mt-0.5 text-sm text-muted">{s.node}</p>}
                  </div>
                  <p className="col-span-8 text-[1.08rem] leading-relaxed text-text">{s.d}</p>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      {/* Phones and tablets: a vertical timeline */}
      <ol ref={listRef} className="qms-list relative lg:hidden">
        <span aria-hidden="true" className="qms-mtrack absolute left-5 top-5 w-0.5 -translate-x-1/2 bg-border" />
        <span aria-hidden="true" className="qms-mtrack qms-mfill absolute left-5 top-5 w-0.5 origin-top -translate-x-1/2 bg-primary" />
        {STEPS.map((s, i) => (
          <Fragment key={s.n}>
            <li data-step={i} className={`qms-row relative flex gap-5 pb-9 ${i <= reached ? "is-done" : ""}`}>
              <span aria-hidden="true" className="qms-dot relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full font-mono text-[0.72rem] font-semibold">{s.n}</span>
              <div className="min-w-0 pt-1">
                <p className="font-mono text-[0.68rem] uppercase tracking-[0.1em] text-accent-strong">{s.kicker}</p>
                <p className="mt-1 font-display text-xl font-semibold text-primary-ink">{s.title}{i > 0 && i < 5 && <span className="text-muted"> · {s.node}</span>}</p>
                {s.items ? (
                  <ul className="mt-3 divide-y divide-border rounded-lg bg-white px-4 ring-1 ring-border">
                    {s.items.map((t) => <li key={t} className="py-2 text-[0.88rem] text-primary-ink">{t}</li>)}
                  </ul>
                ) : (
                  <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{s.d}</p>
                )}
              </div>
            </li>
            {i === 4 && (
              <li className="relative flex gap-5 pb-9">
                <span aria-hidden="true" className="relative z-10 grid h-10 w-10 shrink-0 place-items-center rounded-full border-2 border-dashed border-primary/40 bg-surface text-primary"><Icon name="history" size={17} /></span>
                <p className="pt-2.5 text-[0.92rem] text-muted"><span className="font-semibold text-primary">Back to Plan.</span> Continual improvement — the cycle starts again.</p>
              </li>
            )}
          </Fragment>
        ))}
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
