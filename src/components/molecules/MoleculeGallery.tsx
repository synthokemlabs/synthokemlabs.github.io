"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { formatFormula } from "@/lib/chem";
import { ProductName } from "@/components/products/ProductCatalogue";

export interface GalleryItem { slug: string; href: string; name: string; cas?: string; formula?: string; detail?: string; category: string; src: string }

/**
 * Pinned horizontal gallery: on desktop the section pins while vertical scrolling moves the
 * row of structures sideways. On touch/small screens it is a native swipe rail.
 */
export function MoleculeGallery({ items, total, heading }: { items: GalleryItem[]; total: number; heading: React.ReactNode }) {
  const sectionRef = useRef<HTMLDivElement>(null);
  const trackRef = useRef<HTMLDivElement>(null);
  const [pinned, setPinned] = useState(false);
  const [height, setHeight] = useState<number | undefined>(undefined);
  const [progress, setProgress] = useState(0);
  const [dist, setDist] = useState(0);

  useEffect(() => {
    const mq = window.matchMedia("(min-width: 1024px) and (min-height: 700px) and (prefers-reduced-motion: no-preference)");
    let distance = 0, raf = 0;
    const measure = () => {
      const on = mq.matches;
      setPinned(on);
      if (!on || !trackRef.current) { distance = 0; setDist(0); setHeight(undefined); return; }
      distance = Math.max(0, trackRef.current.scrollWidth - document.documentElement.clientWidth);
      setDist(distance);
      setHeight(window.innerHeight + distance);
      update();
    };
    const update = () => {
      const el = sectionRef.current;
      if (!el || !distance) return;
      const top = el.getBoundingClientRect().top;
      setProgress(Math.min(1, Math.max(0, -top / distance)));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    measure();
    // The track is only w-max once pinned, so measure again after that render
    const again = setTimeout(measure, 60);
    window.addEventListener("resize", measure);
    window.addEventListener("scroll", onScroll, { passive: true });
    mq.addEventListener("change", measure);
    return () => { window.removeEventListener("resize", measure); window.removeEventListener("scroll", onScroll); mq.removeEventListener("change", measure); cancelAnimationFrame(raf); clearTimeout(again); };
  }, []);

  const offset = pinned ? progress * dist : 0;

  return (
    <div ref={sectionRef} style={{ height: pinned ? height : undefined }} className="relative">
      <div className={pinned ? "sticky top-0 flex h-screen flex-col justify-center overflow-hidden" : ""}>
        <div className="mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-12">{heading}</div>
        <div
          ref={trackRef}
          className={`hscroll-track mt-12 flex gap-6 px-4 sm:px-8 lg:px-[max(3rem,calc((100vw_-_1320px)/2_+_3rem))] ${pinned ? "w-max" : "rail snap-x snap-mandatory scroll-px-4 overflow-x-auto pb-4 sm:scroll-px-8"}`}
          style={pinned ? { transform: `translate3d(${-offset}px,0,0)` } : undefined}
        >
          {items.map((it, n) => (
            <Link key={it.slug} href={it.href} className="card-hover group flex w-[19rem] shrink-0 snap-start flex-col rounded-lg border border-border bg-white sm:w-[22rem]">
              <span className="flex items-center justify-between border-b border-border px-5 py-3 text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-muted">
                <span>{it.category}</span>
                <span className="font-mono tracking-normal">{String(n + 1).padStart(2, "0")}</span>
              </span>
              <span className="grid-paper grid h-56 place-items-center">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img src={it.src} alt={`Chemical structure of ${it.name}`} loading="lazy" className="h-auto max-h-[176px] w-auto max-w-[84%] object-contain mix-blend-multiply transition-transform duration-700 group-hover:scale-[1.04]" />
              </span>
              <span className="flex flex-1 flex-col border-t border-border px-5 py-4">
                <span className="font-display text-lg font-semibold text-primary-ink"><ProductName slug={it.slug} className="link-u">{it.name}</ProductName></span>
                <span className="mt-1 font-mono text-xs text-muted">{it.cas ? `CAS ${it.cas}` : ""}{it.formula ? ` · ${formatFormula(it.formula)}` : ""}</span>
                {it.detail && <span className="mt-3 text-sm text-muted">{it.detail}</span>}
              </span>
            </Link>
          ))}
          <Link href="/products/" className="group flex w-[19rem] shrink-0 snap-start flex-col justify-between rounded-lg bg-primary p-7 text-white sm:w-[22rem]">
            <span className="text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-on-dark-muted">Full catalogue</span>
            <span>
              <span className="block font-display text-5xl font-semibold">{total}</span>
              <span className="mt-2 block text-on-dark-muted">products across APIs, intermediates, fine chemicals, excipients and metal scavengers</span>
            </span>
            <span className="inline-flex items-center gap-2 font-semibold">Browse all products <Icon name="arrowRight" size={16} className="arrow-nudge" /></span>
          </Link>
        </div>
        {pinned && (
          <div className="mx-auto mt-10 flex w-full max-w-[1320px] items-center gap-4 px-12 text-xs text-muted">
            <span className="font-mono">{String(Math.min(items.length, Math.floor(progress * items.length) + 1)).padStart(2, "0")}</span>
            <span className="relative h-px flex-1 bg-border"><span className="absolute inset-y-0 left-0 bg-primary" style={{ width: `${progress * 100}%` }} /></span>
            <span className="font-mono">{String(items.length).padStart(2, "0")}</span>
          </div>
        )}
      </div>
    </div>
  );
}
