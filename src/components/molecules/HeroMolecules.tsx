"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Molecule3D, type Model3D } from "./Molecule3D";
import { formatFormula } from "@/lib/chem";

export interface HeroMolecule { slug: string; href: string; name: string; formula?: string; detail: string; model: Model3D }

const DURATION = 7000;

/** Hero visual: a slowly rotating line-art 3D model cycling through flagship APIs, with a plain caption. */
export function HeroMolecules({ items }: { items: HeroMolecule[] }) {
  const [i, setI] = useState(0);
  const [fade, setFade] = useState(false);
  const [paused, setPaused] = useState(false);

  useEffect(() => {
    if (paused || window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;
    const t = setTimeout(() => go((i + 1) % items.length), DURATION);
    return () => clearTimeout(t);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [i, paused, items.length]);

  function go(n: number) {
    setFade(true);
    setTimeout(() => { setI(n); setFade(false); }, 450);
  }

  const m = items[i];
  return (
    <div className="relative" onMouseEnter={() => setPaused(true)} onMouseLeave={() => setPaused(false)}>
      <div className={`relative aspect-square transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}>
        <Molecule3D key={m.slug} model={m.model} label={`Rotating 3D model of ${m.name}`} speed={0.9} hydrogens={false} variant="line" follow />
      </div>

      <div className="mt-2 border-t border-white/15 pt-4">
        <div className="flex items-baseline justify-between gap-4">
          <Link href={m.href} className={`group min-w-0 transition-opacity duration-500 ${fade ? "opacity-0" : "opacity-100"}`}>
            <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-on-dark-muted">{m.detail}</span>
            <span className="link-u mt-1 inline-block font-display text-xl font-semibold text-white">{m.name}</span>
            {m.formula && <span className="ml-3 font-mono text-sm text-on-dark-muted">{formatFormula(m.formula)}</span>}
          </Link>
          <span className="shrink-0 font-mono text-xs text-on-dark-muted">{String(i + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
        </div>
        <div className="mt-4 grid gap-2" style={{ gridTemplateColumns: `repeat(${items.length}, minmax(0, 1fr))` }} role="tablist" aria-label="Featured molecules">
          {items.map((it, n) => (
            <button key={it.slug} type="button" role="tab" aria-selected={n === i} aria-label={`Show ${it.name}`} onClick={() => n !== i && go(n)} className="group h-8 cursor-pointer">
              <span className="relative block h-px w-full overflow-hidden bg-white/20 group-hover:bg-white/40">
                <span
                  className="absolute inset-y-0 left-0 bg-white"
                  style={{ width: n < i ? "100%" : n === i ? undefined : "0%", animation: n === i && !paused ? `hero-progress ${DURATION}ms linear forwards` : undefined }}
                />
              </span>
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
