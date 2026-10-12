import Link from "next/link";
import type { CSSProperties } from "react";
import { CATEGORIES, PRODUCTS, structureSrc } from "@/data/products";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/client";

const CARD_H = 84;
const GAP = 20;
const H = CATEGORIES.length * CARD_H + (CATEGORIES.length - 1) * GAP; // 500
const HUB_Y = H / 2;

/**
 * Portfolio structure diagram: Synthokem hub → five product categories.
 * Connectors draw in once, when the diagram scrolls into view.
 */
export function PortfolioMap() {
  const total = PRODUCTS.length;
  const data = CATEGORIES.map((c) => {
    const items = PRODUCTS.filter((p) => p.category === c.slug);
    const commercial = items.filter((p) => p.status === "commercial").length;
    const dev = items.filter((p) => p.status === "under-development").length;
    const rep = items.find((p) => structureSrc(p));
    return { ...c, count: items.length, commercial, dev, examples: items.slice(0, 2).map((p) => p.name), structure: rep ? structureSrc(rep) : undefined };
  });

  return (
    <Reveal className="relative">
      {/* Desktop diagram */}
      <div className="relative hidden lg:block" style={{ height: H }}>
        <svg className="pointer-events-none absolute inset-0 h-full w-full" viewBox={`0 0 1000 ${H}`} preserveAspectRatio="none" aria-hidden="true">
          {data.map((_, i) => {
            const y = i * (CARD_H + GAP) + CARD_H / 2;
            const d = `M360 ${HUB_Y} C 470 ${HUB_Y}, 470 ${y}, 560 ${y}`;
            return (
              <g key={i}>
                <path d={d} fill="none" stroke="var(--border-strong)" strokeWidth="1.5" vectorEffect="non-scaling-stroke" pathLength={1} className="draw-path" style={{ "--draw-delay": `${0.2 + i * 0.1}s` } as CSSProperties} />
              </g>
            );
          })}
        </svg>

        {/* Hub */}
        <div className="absolute left-0 top-1/2 w-[36%] -translate-y-1/2">
          <div className="relative overflow-hidden rounded-lg bg-primary p-8 text-white">
            <div aria-hidden="true" className="grid-paper-dark absolute inset-0 opacity-70" />
            <div className="relative">
              <div className="flex items-center gap-3">
                <span className="grid h-12 w-12 place-items-center rounded-lg bg-white/10"><LogoMark className="h-7 w-auto" tone="light" /></span>
                <span className="text-sm font-semibold text-accent-soft">Synthokem portfolio</span>
              </div>
              <p className="mt-6 font-display text-6xl font-semibold tracking-tight">{total}</p>
              <p className="mt-1 text-on-dark-muted">products across {CATEGORIES.length} categories</p>
              <div className="mt-6 flex flex-wrap gap-4 text-xs text-on-dark-muted">
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-accent" />Commercial</span>
                <span className="flex items-center gap-2"><span className="h-2 w-2 rounded-full bg-white/40" />Under development</span>
              </div>
              <Link href="/products/" className="group mt-7 inline-flex min-h-11 items-center gap-2 rounded-md bg-white px-5 text-sm font-semibold text-primary-ink hover:bg-primary-tint">
                Search all products <Icon name="arrowRight" size={16} className="arrow-nudge" />
              </Link>
            </div>
          </div>
        </div>

        {/* Category nodes */}
        <ul className="absolute right-0 top-0 w-[44%]">
          {data.map((c, i) => (
            <li key={c.slug} className="node-pop absolute inset-x-0" style={{ top: i * (CARD_H + GAP), height: CARD_H, "--node-delay": `${0.5 + i * 0.1}s` } as CSSProperties}>
              <CategoryCard c={c} />
            </li>
          ))}
        </ul>
      </div>

      {/* Mobile / tablet: vertical tree */}
      <div className="lg:hidden">
        <div className="rounded-lg bg-primary p-6 text-white">
          <p className="text-sm font-semibold text-accent-soft">Synthokem portfolio</p>
          <p className="mt-2 font-display text-5xl font-semibold">{total}</p>
          <p className="text-on-dark-muted">products across {CATEGORIES.length} categories</p>
        </div>
        <ul className="relative ml-6 mt-0 border-l-2 border-border-strong pl-5 pt-5">
          {data.map((c) => (
            <li key={c.slug} className="relative mb-3" style={{ height: CARD_H }}>
              <span aria-hidden="true" className="absolute -left-5 top-1/2 h-[2px] w-5 bg-border-strong" />
              <CategoryCard c={c} />
            </li>
          ))}
        </ul>
      </div>
    </Reveal>
  );
}

function CategoryCard({ c }: { c: { slug: string; shortName: string; count: number; commercial: number; dev: number; examples: string[]; structure?: string } }) {
  const pc = c.count ? (c.commercial / c.count) * 100 : 0;
  const pd = c.count ? (c.dev / c.count) * 100 : 0;
  return (
    <Link href={`/products/${c.slug}/`} className="card-hover group flex h-full items-center gap-4 rounded-lg bg-white px-5 ring-1 ring-border hover:ring-primary">
      <span className="grid h-11 w-11 shrink-0 place-items-center rounded-lg bg-primary-tint font-display text-lg font-semibold text-primary transition-colors group-hover:bg-primary group-hover:text-white">{c.count}</span>
      <span className="min-w-0 flex-1">
        <span className="flex items-center justify-between gap-3">
          <span className="truncate font-semibold text-primary-ink">{c.shortName}</span>
          <Icon name="arrowRight" size={16} className="shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary" />
        </span>
        <span className="mt-2 flex h-1.5 w-full overflow-hidden rounded-full bg-surface-2" role="img" aria-label={`${c.commercial} commercial, ${c.dev} under development`}>
          <span className="h-full bg-accent" style={{ width: `${pc}%` }} />
          <span className="h-full bg-primary/25" style={{ width: `${pd}%` }} />
        </span>
        <span className="mt-1.5 block truncate text-xs text-muted">{c.examples.join(" · ")}{c.count > 2 ? " …" : ""}</span>
      </span>
      {c.structure && (
        // eslint-disable-next-line @next/next/no-img-element
        <img src={c.structure} alt="" aria-hidden="true" loading="lazy" className="hidden h-auto max-h-[52px] w-auto max-w-[76px] shrink-0 object-contain opacity-70 mix-blend-multiply transition-all duration-500 group-hover:scale-110 group-hover:opacity-100 sm:block" />
      )}
    </Link>
  );
}
