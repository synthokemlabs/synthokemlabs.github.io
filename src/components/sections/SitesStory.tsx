"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/client";
import { FACILITIES, TOTAL_CAPACITY_KL } from "@/data/company";
import { INDIA_DOTS, INDIA_MAP, indiaXY } from "@/data/india-dots";
import { LOCATIONS } from "@/data/site";

/*
 * Cartography. Both units get the same treatment: a pin with a thin leader line to a typographic label.
 * When a unit becomes active its pin pulses, the land around it lights up in a ripple and the data strip
 * under the map swaps to its location, capacity and connections. Leader lines point away from the route:
 * Unit II's label hangs below-left of its pin, Unit III's sits above-right.
 */
const SITES = FACILITIES.map((f, i) => {
  const [x, y] = indiaXY(f.coords.lat, f.coords.lon);
  const leader = i === 0 ? { x: x - 56, y: y + 50, side: "left" as const } : { x: x + 56, y: y - 50, side: "right" as const };
  return { ...f, x, y, leader, place: f.location.split(",")[0] };
});
const [A, B] = SITES;
const ROUTE = `M${A.x} ${A.y} Q${(A.x + B.x) / 2} ${Math.min(A.y, B.y) - 120} ${B.x} ${B.y}`;
const CITIES = [
  { name: "Mumbai", lat: 18.94, lon: 72.84, side: "left" as const },
  { name: "Chennai", lat: 13.08, lon: 80.27, side: "right" as const },
].map((c) => ({ ...c, xy: indiaXY(c.lat, c.lon) }));
const SEAS = [
  { name: "Arabian Sea", lat: 12.6, lon: 70.6 },
  { name: "Bay of Bengal", lat: 15.6, lon: 86.2 },
].map((s) => ({ ...s, xy: indiaXY(s.lat, s.lon) }));
// Scale bar: the projection is equal-scale, 40 units per degree of latitude (111 km), so 200 km ≈ 72 units
const SCALE = { x: 26, y: 690, w: Math.round((200 / 111) * 40) };
/*
 * Each dot carries: its distance from Unit II (opening ripple), the site it sits near, a delay that makes the
 * highlight ripple outwards from that site, and an opacity that fades with distance (a soft glow, not a disc).
 */
const GLOW = 84;
const DOTS = INDIA_DOTS.map(([x, y]) => {
  const near = SITES.map((s) => ({ id: s.id, r: Math.hypot(x - s.x, y - s.y) })).find((s) => s.r < GLOW);
  return { x, y, d: Math.round(Math.hypot(x - A.x, y - A.y) * 2.2), near: near?.id, n: near ? Math.round(near.r * 4) : 0, o: near ? +(0.95 - (near.r / GLOW) * 0.65).toFixed(2) : 0 };
});
const pct = (x: number, y: number) => ({ left: `${(x / INDIA_MAP.width) * 100}%`, top: `${(y / INDIA_MAP.height) * 100}%` });

type Site = (typeof SITES)[number];

function StripUnit({ site }: { site: Site }) {
  return (
    <div className="grid grid-cols-1 gap-4 sm:grid-cols-[1fr_1.15fr] sm:gap-6">
      {/* Phones: capacity sits beside the name to keep the strip short */}
      <div className="flex items-end justify-between gap-4 sm:block">
        <div>
          <p className="flex items-center gap-2 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-accent-strong"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-strong" /><span className="sm:whitespace-nowrap">{site.name} · {site.state}</span></p>
          <p className="mt-1.5 text-[1.05rem] font-semibold leading-snug text-primary-ink">{site.place}</p>
          <p className="mt-0.5 whitespace-nowrap font-mono text-[0.68rem] text-muted">{site.coords.lat.toFixed(4)}° N · {site.coords.lon.toFixed(4)}° E</p>
        </div>
        <p className="shrink-0 text-right sm:mt-3 sm:flex sm:items-baseline sm:gap-2 sm:text-left">
          <span className="block font-display text-[1.75rem] font-semibold leading-none text-primary">{site.capacityKL}<span className="ml-1 text-sm">KL</span></span>
          <span className="text-xs text-muted">{Math.round((site.capacityKL / TOTAL_CAPACITY_KL) * 100)}% of capacity</span>
        </p>
      </div>
      <div>
        <p className="text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">Connections</p>
        <ul className="mt-1 divide-y divide-border">
          {site.logistics.map((l, i) => (
            <li key={l.name} title={l.name} className="map-row flex items-center gap-2.5 py-[0.3rem] text-[0.82rem]" style={{ "--row": `${120 + i * 70}ms` } as CSSProperties}>
              <Icon name={l.kind === "airport" ? "plane" : "ship"} size={14} className="shrink-0 text-accent-strong" />
              <span className="flex-1 text-text">{l.short}</span>
              <span className="font-mono text-[0.74rem] tabular-nums text-primary-ink">{l.km} km</span>
            </li>
          ))}
        </ul>
      </div>
    </div>
  );
}

function StripOverview({ onSelect }: { onSelect: (id: string) => void }) {
  return (
    <>
      <p className="flex items-baseline justify-between gap-3 text-[0.66rem] font-semibold uppercase tracking-[0.16em] text-muted">
        <span>Two manufacturing units</span><span className="font-mono normal-case tracking-normal text-primary-ink">{TOTAL_CAPACITY_KL} KL</span>
      </p>
      <ul className="mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
        {SITES.map((s, i) => (
          <li key={s.id} className="map-row" style={{ "--row": `${100 + i * 90}ms` } as CSSProperties}>
            <button type="button" onClick={() => onSelect(s.id)} className="group flex w-full cursor-pointer items-center gap-3 rounded-lg bg-surface px-3 py-2.5 text-left ring-1 ring-border transition-colors duration-300 hover:bg-primary-tint">
              <span className="flex-1">
                <span className="block text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-accent-strong">{s.name}</span>
                <span className="block text-sm font-semibold text-primary-ink">{s.place}</span>
                <span className="block text-xs text-muted">{s.state} · {s.capacityKL} KL</span>
              </span>
              <Icon name="arrowRight" size={16} className="text-primary transition-transform duration-300 group-hover:translate-x-0.5" />
            </button>
          </li>
        ))}
      </ul>
    </>
  );
}

/**
 * The data strip under the map: an overview until a unit is active, then that unit's figures. All three
 * states share one grid cell, so the strip is always as tall as the tallest and nothing below it jumps.
 */
function MapStrip({ active, onSelect }: { active: string | null; onSelect: (id: string) => void }) {
  return (
    <div className="grid border-t border-border bg-white px-5 py-4">
      <div className={`map-card [grid-area:1/1] ${active === null ? "is-on" : ""}`}><StripOverview onSelect={onSelect} /></div>
      {SITES.map((s) => (
        <div key={s.id} className={`map-card [grid-area:1/1] ${s.id === active ? "is-on" : ""}`}><StripUnit site={s} /></div>
      ))}
    </div>
  );
}

function SitesMap({ active, onSelect }: { active: string | null; onSelect: (id: string) => void }) {
  const ref = useRef<HTMLDivElement>(null);
  const [live, setLive] = useState(false);
  const [ready, setReady] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    let t = 0;
    const io = new IntersectionObserver(([e]) => {
      if (!e.isIntersecting) return;
      setLive(true);
      io.disconnect();
      t = window.setTimeout(() => setReady(true), 2200);
    }, { threshold: 0.25 });
    io.observe(el);
    return () => { io.disconnect(); clearTimeout(t); };
  }, []);

  return (
    <div ref={ref} data-active={active ?? "none"} className={`sites-map overflow-hidden rounded-2xl ring-1 ring-border ${live ? "map-live" : ""} ${ready ? "map-ready" : ""}`}>
      <div className="relative bg-gradient-to-b from-[#f4f9fd] to-[#e3eef8] p-3 sm:p-4">
        <div className="relative">
          <svg viewBox={`0 0 ${INDIA_MAP.width} ${INDIA_MAP.height}`} className="block h-auto w-full" role="img" aria-label="Map of peninsular India showing Synthokem Unit II at Pashamylaram near Hyderabad, Telangana, and Unit III at JN Pharmacity near Visakhapatnam, Andhra Pradesh">
            <g>
              {DOTS.map((p, i) => (
                <circle key={i} cx={p.x} cy={p.y} r="4.3" className="map-dot" data-near={p.near} style={{ "--d": `${p.d}ms`, "--n": `${p.n}ms`, "--o": p.o } as CSSProperties} />
              ))}
            </g>
            {CITIES.map((c) => <circle key={c.name} cx={c.xy[0]} cy={c.xy[1]} r="5.5" className="map-city" />)}
            <g className="map-scale" stroke="var(--muted)" strokeWidth="2" fill="none">
              <path d={`M${SCALE.x} ${SCALE.y - 7} V${SCALE.y} H${SCALE.x + SCALE.w} V${SCALE.y - 7} M${SCALE.x + SCALE.w / 2} ${SCALE.y} V${SCALE.y - 4}`} />
              <path d={`M${SCALE.x + 8} ${SCALE.y - 64} L${SCALE.x + 16} ${SCALE.y - 44} L${SCALE.x + 8} ${SCALE.y - 50} L${SCALE.x} ${SCALE.y - 44} Z`} fill="var(--muted)" stroke="none" />
            </g>
            <path d={ROUTE} fill="none" stroke="var(--primary)" strokeWidth="2.5" strokeLinecap="round" pathLength={1} className="map-route" />
            <circle r="5" fill="var(--accent)" className="map-traveller">
              <animateMotion dur="5s" repeatCount="indefinite" path={ROUTE} begin="2s" />
            </circle>
            {SITES.map((s) => (
              <g key={s.id} className={`map-pin ${s.id === active ? "is-active" : ""}`} onClick={() => onSelect(s.id)} style={{ cursor: "pointer" }}>
                <path d={`M${s.x} ${s.y} L${s.leader.x} ${s.leader.y}`} pathLength={1} className="map-leader" />
                <g transform={`translate(${s.x} ${s.y})`}>
                  <circle r="14" className="map-ping" />
                  <circle r="14" className="map-pulse" />
                  <circle r="14" className="map-pulse map-pulse-b" />
                  <circle r="10" fill="var(--primary)" stroke="#fff" strokeWidth="3" className="map-pin-core" />
                </g>
              </g>
            ))}
          </svg>

          {/* Typographic labels at the end of each leader line; seas and reference cities set like a printed map */}
          {SITES.map((s) => (
            <button
              key={s.id}
              type="button"
              onClick={() => onSelect(s.id)}
              aria-pressed={s.id === active}
              className={`map-label absolute z-10 cursor-pointer px-1 leading-tight ${s.leader.side === "left" ? "-translate-x-full text-right" : "-translate-y-full text-left"}`}
              style={pct(s.leader.x, s.leader.y)}
            >
              <span className="map-label-tag map-halo block whitespace-nowrap text-[0.68rem] sm:text-[0.66rem] font-semibold uppercase tracking-[0.18em]">{s.name}</span>
              <span className="map-label-place map-halo hidden whitespace-nowrap text-[0.82rem] font-semibold sm:block">{s.place}</span>
            </button>
          ))}
          {CITIES.map((c) => (
            <span key={c.name} className={`map-ref map-halo absolute z-10 -translate-y-1/2 text-[0.7rem] font-medium text-muted ${c.side === "left" ? "-translate-x-[calc(100%+9px)]" : "translate-x-[9px]"}`} style={pct(c.xy[0], c.xy[1])}>{c.name}</span>
          ))}
          {SEAS.map((s) => (
            <span key={s.name} className="map-ref pointer-events-none absolute -translate-x-1/2 -translate-y-1/2 whitespace-nowrap font-display text-[0.7rem] italic tracking-[0.12em] text-primary/45 sm:text-[0.8rem]" style={pct(s.xy[0], s.xy[1])}>{s.name}</span>
          ))}
          <span className="map-ref absolute -translate-y-full pb-1 font-mono text-[0.6rem] text-muted" style={pct(SCALE.x, SCALE.y - 8)}>200 km</span>
          <span className="map-ref absolute -translate-x-1/2 -translate-y-full font-mono text-[0.6rem] font-semibold text-muted" style={pct(SCALE.x + 8, SCALE.y - 66)}>N</span>
        </div>
      </div>
      <MapStrip active={active} onSelect={onSelect} />
    </div>
  );
}

/** Scroll story: the map stays pinned while each unit's panel passes; the panel in the middle of the screen is active. */
export function SitesStory() {
  const [active, setActive] = useState<string | null>(null);
  const panels = useRef<Record<string, HTMLElement | null>>({});
  useEffect(() => {
    const first = SITES[0].id;
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        const id = (e.target as HTMLElement).dataset.unit!;
        if (e.isIntersecting) setActive(id);
        // Scrolled back above the first unit: return to the overview, so Unit II makes its entrance again
        else if (id === first && e.boundingClientRect.top > window.innerHeight / 2) setActive(null);
      }),
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
          const dim = active !== null && f.id !== active;
          return (
            <article key={f.id} id={f.id} data-unit={f.id} ref={(el) => { panels.current[f.id] = el; }} aria-labelledby={`${f.id}-title`} className={`scroll-mt-40 transition-opacity duration-700 lg:min-h-[70vh] ${dim ? "lg:opacity-45" : "lg:opacity-100"}`}>
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
