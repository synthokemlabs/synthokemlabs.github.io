import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/client";
import { Icon } from "@/components/ui/Icon";
import { LIFECYCLE, SPECIALISATIONS } from "@/data/company";

/**
 * Lab-to-market lifecycle as a flowchart: a rail draws across (down on phones), the four stages pop in
 * order, and a dot keeps travelling along the rail to show the flow from R&D to regulatory support.
 */
export function LifecycleFlow() {
  return (
    <Reveal>
      {/* Desktop: four equal columns (gap 24px), steps centred, so the rail runs from the first icon centre to the
          last — (100% - 72px) / 8 in from each side. Phones: each step draws its own connector to the next. */}
      <ol className="flow-host relative grid grid-cols-1 gap-10 md:grid-cols-4 md:gap-6">
        <span aria-hidden="true" className="evo-rail absolute top-[27px] hidden h-px bg-border-strong md:left-[calc((100%-72px)/8)] md:right-[calc((100%-72px)/8)] md:block" />
        <span aria-hidden="true" className="flow-dot" />
        {LIFECYCLE.map((s, i) => (
          <li key={s.t} className="node-pop relative grid grid-cols-[56px_1fr] gap-5 md:flex md:flex-col md:items-center md:text-center" style={{ "--node-delay": `${0.3 + i * 0.2}s` } as CSSProperties}>
            {i < LIFECYCLE.length - 1 && <span aria-hidden="true" className="absolute -bottom-10 left-[27px] top-14 w-px bg-border-strong md:hidden" />}
            <span className="relative z-10 grid h-14 w-14 place-items-center rounded-full bg-white text-primary shadow-[0_8px_24px_-12px_rgb(10_45_80/0.5)] ring-1 ring-primary/25">
              <Icon name={s.icon} size={24} strokeWidth={1.5} />
              <span className="absolute -right-1 -top-1 grid h-6 w-6 place-items-center rounded-full bg-primary font-mono text-[0.65rem] font-semibold text-white">{i + 1}</span>
            </span>
            <div className="md:mt-6">
              <h3 className="text-lg font-semibold text-primary-ink">{s.t}</h3>
              <p className="mt-2 text-[0.93rem] leading-relaxed text-muted">{s.d}</p>
            </div>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

/** The 23 reaction chemistries as tags; the previous website's core specialisations are filled and lead the list. */
export function ChemistryCloud() {
  const sorted = [...SPECIALISATIONS.filter((s) => s.core), ...SPECIALISATIONS.filter((s) => !s.core)];
  return (
    <Reveal>
      <ul className="flex flex-wrap gap-2.5">
        {sorted.map((s, i) => (
          <li
            key={s.name}
            className={`node-pop rounded-full px-4 py-2 text-[0.92rem] font-medium transition-colors duration-300 ${s.core ? "bg-primary text-white hover:bg-primary-dark" : "bg-white text-primary-ink ring-1 ring-border hover:ring-primary/50"}`}
            style={{ "--node-delay": `${0.1 + i * 0.03}s` } as CSSProperties}
          >
            {s.name}
          </li>
        ))}
      </ul>
      <div className="mt-8 flex flex-wrap items-center justify-between gap-4 border-t border-border pt-6">
        <p className="flex items-center gap-2.5 text-sm text-muted"><span className="h-3 w-3 rounded-full bg-primary" />Core specialisations</p>
        <Link href="/contact/?intent=partner" className="group inline-flex min-h-10 items-center gap-2 font-semibold text-primary">
          <span className="link-u">Have a process in mind? Talk to us</span><Icon name="arrowRight" size={16} className="arrow-nudge" />
        </Link>
      </div>
    </Reveal>
  );
}
