import Link from "next/link";
import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/client";
import { Icon } from "@/components/ui/Icon";
import { JOURNEY } from "@/data/company";
import { CATEGORIES, productsIn, structureSrc } from "@/data/products";

/** The five product families, each with a representative structure — like the "What we deliver" row on peer API sites. */
export function WhatWeDeliver() {
  return (
    <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
      {CATEGORIES.map((c, i) => {
        const items = productsIn(c.slug);
        const sample = items.find((p) => structureSrc(p));
        const inDevelopment = items.every((p) => p.status === "under-development");
        return (
          <Reveal as="li" key={c.slug} delay={i * 80} className="h-full">
            <Link href={`/products/${c.slug}/`} className="group flex h-full flex-col rounded-xl bg-white p-5 ring-1 ring-border transition-[box-shadow,transform] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_48px_-30px_rgb(10_45_80/0.45)] hover:ring-primary/30">
              <span className="grid h-24 place-items-center overflow-hidden rounded-lg bg-surface">
                {sample && (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img src={structureSrc(sample)} alt="" loading="lazy" className="h-[4.5rem] w-auto max-w-[85%] object-contain opacity-80 transition-transform duration-500 group-hover:scale-110" />
                )}
              </span>
              <span className="mt-5 font-mono text-[0.72rem] text-muted">{items.length} products{inDevelopment ? " · in development" : ""}</span>
              <span className="mt-1 text-lg font-semibold text-primary-ink">{c.shortName}</span>
              <span className="mt-2 text-[0.88rem] leading-relaxed text-muted">{c.summary}</span>
              <span className="mt-auto inline-flex items-center gap-2 pt-4 text-sm font-semibold text-primary">Explore <Icon name="arrowRight" size={15} className="arrow-nudge" /></span>
            </Link>
          </Reveal>
        );
      })}
    </ul>
  );
}

/** Five turning points, from the Journey data; the rail draws in and the milestones pop in order. */
export function EvolutionTimeline() {
  const pick = (year: number, title: string) => JOURNEY.find((m) => m.year === year && m.title === title)!;
  const items = [
    { year: "1978", title: "Founded in Hyderabad", d: pick(1978, "Incorporated").detail.replace(/^Synthokem Labs is incorporated/, "Incorporated") },
    { year: "1993", title: "First USFDA filings", d: "Drug Master Files for Methocarbamol and Guaifenesin." },
    { year: "2002", title: "WHO-GMP certified", d: "WHO-GMP certificate achieved — renewed to date." },
    { year: "2010", title: "Unit II in operation", d: "Our Pashamylaram site, home to the corporate office and R&D unit, comes into operation." },
    { year: "2019", title: "CEP for Unit II", d: "EDQM Certificate of Suitability for Guaifenesin made at Unit II." },
  ];
  return (
    <Reveal>
      <ol className="relative grid grid-cols-1 gap-9 lg:grid-cols-5 lg:gap-6">
        <span aria-hidden="true" className="evo-rail absolute left-[11px] top-3 h-[calc(100%-1.5rem)] w-px bg-border-strong lg:left-0 lg:top-[11px] lg:h-px lg:w-full" />
        {items.map((m, i) => {
          const now = i === items.length - 1; // most recent milestone is highlighted
          return (
            <li key={m.year} className="node-pop relative pl-11 lg:pl-0 lg:pt-12" style={{ "--node-delay": `${0.35 + i * 0.18}s` } as CSSProperties}>
              <span className={`absolute left-0 top-0 grid h-6 w-6 place-items-center rounded-full ring-2 ${now ? "bg-primary ring-primary" : "bg-white ring-primary"}`}>
                <span className={`h-2 w-2 rounded-full ${now ? "bg-white" : "bg-primary"}`} />
              </span>
              <p className={`font-display text-3xl font-semibold tracking-tight ${now ? "text-accent-strong" : "text-primary"}`}>{m.year}</p>
              <h3 className="mt-2 font-semibold text-primary-ink">{m.title}</h3>
              <p className="mt-1.5 text-[0.92rem] leading-relaxed text-muted">{m.d}</p>
            </li>
          );
        })}
      </ol>
    </Reveal>
  );
}
