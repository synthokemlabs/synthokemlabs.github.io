"use client";

import { Fragment, useState, type CSSProperties } from "react";
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
/* ISO 9001:2015 quality management system (PPT slide 21), drawn as a */
/* quality-manual figure: Inputs → Plan → Do → Check → Act → Outputs,  */
/* each phase with its clause and the standard's sub-clause headings.  */
/* On entry the process line draws across, each column appears as the */
/* line reaches it, the letters are drawn in outline, and the          */
/* continual-improvement loop runs back from Act to Plan. Afterwards a */
/* single marker keeps travelling the cycle.                           */
/* ------------------------------------------------------------------ */
const QMS_INPUTS = ["Organisation and its context", "Customer requirements", "Needs & expectations of interested parties"];
const QMS_OUTPUTS = ["Customer satisfaction", "Results of the QMS", "Products & services"];
// Sub-clause numbers and titles as published in ISO 9001:2015
const PDCA = [
  { L: "P", title: "Plan", node: "Planning", clause: "Clause 6", d: "Set the course before work begins.", subs: [["6.1", "Actions to address risks and opportunities"], ["6.2", "Quality objectives and planning to achieve them"], ["6.3", "Planning of changes"]] },
  { L: "D", title: "Do", node: "Support & operation", clause: "Clauses 7–8", d: "Run every operation under control.", subs: [["7.1", "Resources"], ["7.2", "Competence"], ["7.5", "Documented information"], ["8.1", "Operational planning and control"]] },
  { L: "C", title: "Check", node: "Performance evaluation", clause: "Clause 9", d: "Measure how well the system performs.", subs: [["9.1", "Monitoring, measurement, analysis and evaluation"], ["9.2", "Internal audit"], ["9.3", "Management review"]] },
  { L: "A", title: "Act", node: "Improvement", clause: "Clause 10", d: "Correct, learn and improve.", subs: [["10.2", "Nonconformity and corrective action"], ["10.3", "Continual improvement"]] },
];
// When the 1.6 s line draw reaches each column (columns 0.85 : 1 : 1 : 1 : 1 : 0.85)
const ARRIVE = [0.25, 0.55, 0.85, 1.15, 1.45, 1.7];

function Letter({ ch, delay, className = "" }: { ch: string; delay: number; className?: string }) {
  return (
    <svg viewBox="0 0 72 84" className={`qms-letter ${className}`} aria-hidden="true">
      <text x="0" y="72" style={{ "--d": `${delay}s` } as CSSProperties}>{ch}</text>
    </svg>
  );
}

export function QmsStory() {
  return (
    <>
      {/* Desktop and wide tablets: the figure */}
      <Reveal className="qms-fig hidden lg:block">
        <div className="qms-flow relative grid grid-cols-[minmax(0,0.85fr)_repeat(4,minmax(0,1fr))_minmax(0,0.85fr)]">
          {/* The process line, its arrowheads, and the marker that keeps travelling it */}
          <span aria-hidden="true" className="qms-line absolute left-[3%] right-[3%] top-7 h-px bg-primary/45" />
          <span aria-hidden="true" className="qms-signal absolute top-7 h-1.5 w-1.5 rounded-full bg-accent-strong" />

          <div className="pr-6">
            <p className="flex h-14 items-center"><span className="flex items-center gap-2 bg-surface pr-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted"><span className="qms-node node-pop" style={nd(ARRIVE[0])} />Inputs</span></p>
            <ul className="node-pop mt-2 space-y-2.5" style={nd(ARRIVE[0] + 0.15)}>
              {QMS_INPUTS.map((t) => <li key={t} className="border-t border-border pt-2.5 text-[0.88rem] leading-snug text-primary-ink">{t}</li>)}
            </ul>
          </div>

          {PDCA.map((s, k) => (
            <article key={s.L} className="qms-col group relative border-l border-border px-4 pb-6 xl:px-6">
              <span aria-hidden="true" className="qms-arrow node-pop absolute -left-[5px] top-[23px]" style={nd(ARRIVE[k + 1] - 0.05)} />
              <p className="flex h-14 items-center"><span className="flex items-center gap-2 bg-surface pr-2"><span className="qms-node node-pop" style={nd(ARRIVE[k + 1])} /><span className="node-pop font-mono text-[0.68rem] uppercase tracking-[0.12em] text-accent-strong" style={nd(ARRIVE[k + 1] + 0.05)}>{s.clause}</span></span></p>
              <Letter ch={s.L} delay={ARRIVE[k + 1] + 0.05} className="mt-1 h-[5.25rem] w-auto" />
              <div className="node-pop" style={nd(ARRIVE[k + 1] + 0.2)}>
                <h3 className="mt-3 text-xl font-semibold text-primary-ink">{s.title}</h3>
                <p className="text-sm font-medium text-muted">{s.node}</p>
                <p className="mt-2 text-[0.92rem] leading-snug text-text">{s.d}</p>
                <ul className="mt-5 border-t border-border">
                  {s.subs.map(([n, t]) => (
                    <li key={n} className="grid grid-cols-[2.4rem_1fr] gap-1 border-b border-border py-2 text-[0.83rem] leading-snug text-muted">
                      <span className="font-mono text-[0.72rem] leading-[1.45] text-accent-strong">{n}</span>{t}
                    </li>
                  ))}
                </ul>
              </div>
            </article>
          ))}

          <div className="relative border-l border-border pl-6">
            <span aria-hidden="true" className="qms-arrow node-pop absolute -left-[5px] top-[23px]" style={nd(ARRIVE[5] - 0.05)} />
            <p className="flex h-14 items-center"><span className="flex items-center gap-2 bg-surface pr-2 text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted"><span className="qms-node qms-node-end node-pop" style={nd(ARRIVE[5])} />Outputs</span></p>
            <ul className="node-pop mt-2 space-y-2.5" style={nd(ARRIVE[5] + 0.15)}>
              {QMS_OUTPUTS.map((t) => <li key={t} className="border-t border-border pt-2.5 text-[0.88rem] leading-snug text-primary-ink">{t}</li>)}
            </ul>
          </div>
        </div>

        {/* Continual improvement: Act back to Plan, under the four phases */}
        <div className="grid grid-cols-[minmax(0,0.85fr)_repeat(4,minmax(0,1fr))_minmax(0,0.85fr)]">
          <span />
          <div className="relative col-span-4 h-16">
            <span aria-hidden="true" className="qms-loop absolute bottom-6 left-[12.5%] right-[12.5%] top-0 rounded-b-xl border border-t-0 border-primary/45" />
            <span aria-hidden="true" className="qms-loop-head node-pop absolute left-[12.5%] top-0 -ml-[5px] -mt-[2px] border-x-[5px] border-b-[7px] border-x-transparent border-b-primary/70" style={nd(3)} />
            <span aria-hidden="true" className="qms-signal-b absolute bottom-6 h-1.5 w-1.5 -translate-x-1/2 translate-y-1/2 rounded-full bg-accent-strong" />
            <p className="node-pop absolute bottom-6 left-1/2 flex -translate-x-1/2 translate-y-1/2 items-center gap-2 whitespace-nowrap bg-surface px-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-primary" style={nd(2.9)}>
              <Icon name="history" size={14} />Continual improvement · 10.3
            </p>
          </div>
          <span />
        </div>
      </Reveal>

      {/* Phones and small tablets: the same figure as a column */}
      <ol className="lg:hidden">
        <Reveal as="li" className="border-l-2 border-primary/30 pb-8 pl-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">Inputs</p>
          <ul className="mt-2">{QMS_INPUTS.map((t) => <li key={t} className="border-b border-border py-2 text-[0.9rem] text-primary-ink">{t}</li>)}</ul>
        </Reveal>
        {PDCA.map((s) => (
          <Reveal as="li" key={s.L} className="border-l-2 border-primary/30 pb-8 pl-5">
            <div className="flex items-end gap-4">
              <Letter ch={s.L} delay={0.2} className="h-14 w-auto shrink-0" />
              <p className="pb-1">
                <span className="block font-mono text-[0.68rem] uppercase tracking-[0.12em] text-accent-strong">{s.clause}</span>
                <span className="block text-lg font-semibold text-primary-ink">{s.title}<span className="ml-2 text-sm font-medium text-muted">{s.node}</span></span>
              </p>
            </div>
            <p className="mt-3 text-[0.95rem] text-text">{s.d}</p>
            <ul className="mt-3 border-t border-border">
              {s.subs.map(([n, t]) => <li key={n} className="grid grid-cols-[2.4rem_1fr] gap-1 border-b border-border py-2 text-[0.86rem] text-muted"><span className="font-mono text-[0.72rem] text-accent-strong">{n}</span>{t}</li>)}
            </ul>
          </Reveal>
        ))}
        <Reveal as="li" className="border-l-2 border-dashed border-primary/30 pb-8 pl-5">
          <p className="flex items-center gap-2 text-[0.92rem] text-muted"><Icon name="history" size={16} className="text-primary" /><span><span className="font-semibold text-primary">Back to Plan.</span> Continual improvement (10.3) — the cycle starts again.</span></p>
        </Reveal>
        <Reveal as="li" className="border-l-2 border-primary/30 pl-5">
          <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">Outputs</p>
          <ul className="mt-2">{QMS_OUTPUTS.map((t) => <li key={t} className="border-b border-border py-2 text-[0.9rem] text-primary-ink">{t}</li>)}</ul>
        </Reveal>
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
