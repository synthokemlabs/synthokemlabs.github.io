"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/client";
import { FACILITIES } from "@/data/company";
import { INDIA_DOTS, INDIA_MAP, indiaXY } from "@/data/india-dots";
import { LOCATIONS } from "@/data/site";

const SITES = FACILITIES.map((f) => {
  const [x, y] = indiaXY(f.coords.lat, f.coords.lon);
  // Distant seaports are drawn as routes on the map; every other connection is listed in the callout
  const isFar = (l: (typeof f.logistics)[number]) => l.km > 100 && l.kind === "seaport";
  return { ...f, x, y, far: f.logistics.filter(isFar), near: f.logistics.filter((l) => !isFar(l)) };
});
const [A, B] = SITES;
// Route between the two sites, bowed north
const ROUTE = `M${A.x} ${A.y} Q${(A.x + B.x) / 2} ${Math.min(A.y, B.y) - 120} ${B.x} ${B.y}`;
// Each dot knows its distance from Unit II (for the ripple) and which site it is near (for the highlight)
const DOTS = INDIA_DOTS.map(([x, y]) => {
  const near = SITES.find((s) => Math.hypot(x - s.x, y - s.y) < 70)?.id;
  return { x, y, d: Math.round(Math.hypot(x - A.x, y - A.y) * 2.2), near };
});
// Labels near the map's left/right edge anchor inward so they never spill outside it
const anchor = (x: number) => (x / INDIA_MAP.width < 0.3 ? "-translate-x-[12%]" : x / INDIA_MAP.width > 0.7 ? "-translate-x-[88%]" : "-translate-x-1/2");
const pct = (x: number, y: number) => ({ left: `${(x / INDIA_MAP.width) * 100}%`, top: `${(y / INDIA_MAP.height) * 100}%` });

function SitesMap({ active, onSelect }: { active: string; onSelect: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { setLive(true); io.disconnect(); } }, { threshold: 0.25 });
    io.observe(el);
    return () => io.disconnect();
  }, []);
  const site = SITES.find((s) => s.id === active)!;

  return (
    <div ref={ref} data-active={active} className={`sites-map relative overflow-hidden rounded-2xl bg-gradient-to-b from-[#f2f8fe] to-[#e3effb] p-3 ring-1 ring-border sm:p-5 ${live ? "map-live" : ""}`}>
      <div className="relative">
        <svg viewBox={`0 0 ${INDIA_MAP.width} ${INDIA_MAP.height}`} className="block h-auto w-full" role="img" aria-label="Map of peninsular India showing Synthokem Unit II at Pashamylaram near Hyderabad, Telangana, and Unit III at JN Pharmacity near Visakhapatnam, Andhra Pradesh">
          <g>
            {DOTS.map((p, i) => (
              <circle key={i} cx={p.x} cy={p.y} r="4.3" className="map-dot" data-near={p.near} style={{ "--d": `${p.d}ms` } as CSSProperties} />
            ))}
          </g>
          {/* Connections from the active site to its distant seaports, redrawn whenever the active site changes */}
          <g key={active} className="map-links">
            {site.far.map((l, i) => {
              const [lx, ly] = indiaXY(l.lat, l.lon);
              return (
                <g key={l.name}>
                  <path d={`M${site.x} ${site.y} Q${(site.x + lx) / 2 + 30} ${(site.y + ly) / 2 - 30} ${lx} ${ly}`} fill="none" stroke="var(--secondary)" strokeWidth="2.5" strokeOpacity="0.8" pathLength={1} className="map-link" style={{ "--link-delay": `${0.15 + i * 0.2}s` } as CSSProperties} />
                  <circle cx={lx} cy={ly} r="9" fill="#fff" stroke="var(--secondary)" strokeWidth="2" className="map-port" style={{ "--link-delay": `${0.7 + i * 0.2}s` } as CSSProperties} />
                </g>
              );
            })}
          </g>
          <path d={ROUTE} fill="none" stroke="var(--primary)" strokeWidth="3" strokeLinecap="round" pathLength={1} className="map-route" />
          <circle r="6" fill="var(--accent)" className="map-traveller">
            <animateMotion dur="4.5s" repeatCount="indefinite" path={ROUTE} begin="2s" />
          </circle>
          {SITES.map((s) => (
            <g key={s.id} transform={`translate(${s.x} ${s.y})`} className={`map-pin ${s.id === active ? "is-active" : ""}`} onClick={() => onSelect(s.id)} style={{ cursor: "pointer" }}>
              <circle r="15" className="map-pulse" />
              <circle r="15" className="map-pulse map-pulse-b" />
              <circle r="11" fill="var(--primary)" stroke="#fff" strokeWidth="3" className="map-pin-core" />
            </g>
          ))}
        </svg>

        {/* HTML labels positioned in map space */}
        {SITES.map((s, i) => (
          <button
            key={s.id}
            type="button"
            onClick={() => onSelect(s.id)}
            aria-pressed={s.id === active}
            className={`map-label absolute z-10 -translate-y-[calc(100%+18px)] cursor-pointer whitespace-nowrap rounded-lg px-3 py-1.5 text-left shadow-md transition-all duration-500 ${i === 0 ? "-translate-x-[85%]" : "-translate-x-[15%]"} ${s.id === active ? "bg-primary text-white" : "bg-white text-primary-ink ring-1 ring-border"}`}
            style={pct(s.x, s.y)}
          >
            <span className="block text-[0.68rem] font-semibold uppercase tracking-[0.12em] opacity-80">{s.name}</span>
            <span className="block text-sm font-semibold">{s.state}</span>
          </button>
        ))}
        {SITES.flatMap((s) => s.far).filter((l, i, arr) => arr.findIndex((x) => x.name === l.name) === i).map((l) => {
          const [lx, ly] = indiaXY(l.lat, l.lon);
          const on = site.far.some((x) => x.name === l.name);
          return (
            <span key={l.name} className={`map-port-label absolute z-10 ${anchor(lx)} translate-y-3 whitespace-nowrap rounded-full bg-white px-2.5 py-1 text-[0.7rem] font-semibold text-secondary shadow-sm ring-1 ring-border transition-opacity duration-500 ${on ? "opacity-100" : "opacity-0"}`} style={pct(lx, ly)}>
              <Icon name="ship" size={12} className="mr-1 inline align-[-2px]" />{l.short} · ~{l.km} km
            </span>
          );
        })}
      </div>

      {/* Nearby connections for the active site */}
      <div key={`near-${active}`} className="map-callout mt-3 flex flex-wrap gap-2">
        {site.near.map((l) => (
          <span key={l.name} className="inline-flex items-center gap-1.5 rounded-full bg-white px-3 py-1.5 text-[0.78rem] font-medium text-primary-ink ring-1 ring-border">
            <Icon name={l.kind === "airport" ? "plane" : "ship"} size={13} className="text-accent-strong" />{l.short} · ~{l.km} km
          </span>
        ))}
      </div>
    </div>
  );
}

/** Scroll story: the map stays pinned while each unit's panel passes; the unit in the middle of the screen is active. */
export function SitesStory() {
  const [active, setActive] = useState(SITES[0].id);
  const panels = useRef<Record<string, HTMLElement | null>>({});
  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive((e.target as HTMLElement).dataset.unit!); }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    Object.values(panels.current).forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);
  const select = (id: string) => {
    setActive(id);
    panels.current[id]?.scrollIntoView({ behavior: "smooth", block: "center" });
  };

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
      <div className="lg:col-span-6">
        <div className="lg:sticky lg:top-32"><SitesMap active={active} onSelect={select} /></div>
      </div>
      <div className="space-y-20 lg:col-span-6 lg:space-y-32 lg:py-10">
        {SITES.map((f) => {
          const loc = LOCATIONS.find((l) => l.id === (f.id === "unit-ii" ? "corporate-office" : f.id));
          const on = f.id === active;
          return (
            <article key={f.id} id={f.id} data-unit={f.id} ref={(el) => { panels.current[f.id] = el; }} aria-labelledby={`${f.id}-title`} className={`scroll-mt-40 transition-opacity duration-700 lg:min-h-[70vh] ${on ? "lg:opacity-100" : "lg:opacity-45"}`}>
              <Reveal>
                <div className="flex items-end gap-4">
                  <span className="font-display text-7xl font-semibold leading-none tracking-tight text-primary">{f.name.replace(/^Unit\s+/, "")}</span>
                  <span>
                    <span className="eyebrow block text-accent-strong">Manufacturing unit</span>
                    <h3 id={`${f.id}-title`} className="mt-1 text-2xl font-semibold text-primary-ink">{f.name} · {f.state}</h3>
                  </span>
                </div>
                <p className="mt-6 text-[1.05rem] leading-relaxed text-text">{f.summary}</p>
                <p className="mt-4 flex items-start gap-2.5 text-[0.92rem] leading-relaxed text-muted"><Icon name="pin" size={17} className="mt-0.5 shrink-0 text-accent-strong" />{f.address}</p>
                <p className="mt-2 flex items-start gap-2.5 font-mono text-[0.76rem] leading-relaxed text-muted"><Icon name="globe" size={16} className="mt-0.5 shrink-0 text-accent-strong" />{f.coords.dms}</p>
                <ul className="mt-5 flex flex-wrap gap-2">
                  {f.highlights.map((h) => <li key={h} className="rounded-full bg-primary-tint px-3 py-1.5 text-[0.8rem] font-medium text-primary-ink">{h}</li>)}
                </ul>
                {loc && (
                  <a href={loc.directions} target="_blank" rel="noopener" className="group mt-5 inline-flex min-h-10 items-center gap-2 font-semibold text-primary">
                    <span className="link-u">Get directions</span><Icon name="external" size={15} />
                  </a>
                )}
              </Reveal>
              <ul className="mt-8 grid grid-cols-2 gap-3">
                {f.photos.map((p, i) => (
                  <Reveal as="li" key={p.name} variant="image" delay={(i % 2) * 90} className={`zoom-parent relative overflow-hidden rounded-xl bg-surface ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}>
                    <Img name={p.name} sizes={i === 0 ? "(min-width:1024px) 45vw, 100vw" : "(min-width:1024px) 22vw, 50vw"} className="zoom-img absolute inset-0 h-full w-full object-cover" />
                    <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-3 pt-10 text-[0.8rem] font-medium text-white">{p.caption}</span>
                  </Reveal>
                ))}
              </ul>
            </article>
          );
        })}
      </div>
    </div>
  );
}
