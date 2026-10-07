"use client";

import { useMemo, useState } from "react";
import { COUNTRIES, HUB, REGIONS, type Region } from "@/data/company";

const W = 360;
const H = 138;
const px = (lon: number) => lon + 180;
const py = (lat: number) => 80 - lat;

function arc(lon: number, lat: number) {
  const x1 = px(HUB.lon), y1 = py(HUB.lat), x2 = px(lon), y2 = py(lat);
  const mx = (x1 + x2) / 2, my = (y1 + y2) / 2;
  const dist = Math.hypot(x2 - x1, y2 - y1);
  return `M${x1},${y1} Q${mx},${my - dist * 0.35} ${x2},${y2}`;
}

/**
 * Global presence map. Countries are exactly those listed on the previous
 * Synthokem "Global presence" section; positions are capital/central coordinates.
 */
export function GlobalMap({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const [region, setRegion] = useState<Region | "All">("All");
  const [hover, setHover] = useState<string | null>(null);
  const visible = useMemo(() => COUNTRIES.filter((c) => c.name !== "India" && (region === "All" || c.region === region)), [region]);
  const dark = tone === "dark";

  return (
    <div>
      <div role="group" aria-label="Filter by region" className="rail -mx-4 flex gap-2 overflow-x-auto px-4 pb-2 sm:mx-0 sm:flex-wrap sm:px-0">
        {(["All", ...REGIONS] as const).map((r) => {
          const n = r === "All" ? COUNTRIES.length : COUNTRIES.filter((c) => c.region === r).length;
          const on = r === region;
          return (
            <button
              key={r}
              type="button"
              aria-pressed={on}
              onClick={() => setRegion(r)}
              className={`inline-flex min-h-11 shrink-0 cursor-pointer items-center gap-2 rounded-full px-4 text-sm font-medium transition-colors ${
                on ? (dark ? "bg-white text-primary-ink" : "bg-primary text-white") : dark ? "text-on-dark ring-1 ring-inset ring-white/20 hover:ring-white/50" : "text-primary-ink ring-1 ring-inset ring-border-strong hover:ring-primary"
              }`}
            >
              {r}
              <span className={`font-mono text-[0.7rem] ${on ? "opacity-70" : "opacity-60"}`}>{n}</span>
            </button>
          );
        })}
      </div>

      <div className="relative mt-8">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img src="/images/world-dots.svg" alt="" aria-hidden="true" width={1440} height={552} className={`block h-auto w-full ${dark ? "opacity-[0.35]" : "opacity-70"}`} loading="lazy" />
        <svg viewBox={`0 0 ${W} ${H}`} className="absolute inset-0 h-full w-full" role="img" aria-label={`Map showing Synthokem's presence in ${region === "All" ? `${COUNTRIES.length} countries` : region}`}>
          <g key={region}>
            {visible.map((c, i) => (
              <path
                key={c.name}
                d={arc(c.lon, c.lat)}
                fill="none"
                stroke={dark ? "#3fa8ee" : "#0a7682"}
                strokeWidth={hover === c.name ? 0.7 : 0.35}
                strokeOpacity={hover && hover !== c.name ? 0.15 : 0.7}
                pathLength={1}
                strokeDasharray="1"
                strokeDashoffset="1"
                style={{ animation: `draw-arc 1.4s ${i * 30}ms cubic-bezier(.22,1,.36,1) forwards` }}
              />
            ))}
          </g>
          {COUNTRIES.map((c) => {
            const on = region === "All" || c.region === region;
            return (
              <circle
                key={c.name}
                cx={px(c.lon)}
                cy={py(c.lat)}
                r={hover === c.name ? 2.2 : 1.3}
                fill={dark ? "#ffffff" : "#0d3b66"}
                opacity={on ? 1 : 0.2}
                style={{ transition: "r .3s, opacity .4s" }}
              >
                <title>{c.name}</title>
              </circle>
            );
          })}
          <circle cx={px(HUB.lon)} cy={py(HUB.lat)} r="5" fill="none" stroke={dark ? "#3fa8ee" : "#0f69b4"} strokeWidth="0.5" className="molecule-node" />
          <circle cx={px(HUB.lon)} cy={py(HUB.lat)} r="2.4" fill={dark ? "#3fa8ee" : "#0f69b4"} />
        </svg>
        <p className={`absolute -translate-x-1/2 rounded px-1.5 py-0.5 font-mono text-[0.62rem] uppercase tracking-[0.14em] sm:text-[0.7rem] ${dark ? "bg-primary-ink/85 text-accent" : "bg-surface/90 text-accent-strong"}`} style={{ left: `${(px(HUB.lon) / W) * 100}%`, top: `${(py(HUB.lat) / H) * 100 + 3.2}%` }}>
          Hyderabad HQ
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-8 sm:grid-cols-2 lg:grid-cols-4">
        {REGIONS.filter((r) => region === "All" || r === region).map((r) => (
          <div key={r}>
            <p className={`eyebrow border-b pb-3 ${dark ? "border-white/15 text-on-dark-muted" : "border-border text-muted"}`}>{r}</p>
            <ul className="mt-3 flex flex-wrap gap-x-4 gap-y-1.5">
              {COUNTRIES.filter((c) => c.region === r).map((c) => (
                <li
                  key={c.name}
                  onMouseEnter={() => setHover(c.name)}
                  onMouseLeave={() => setHover(null)}
                  className={`text-[0.95rem] transition-colors ${dark ? "text-on-dark hover:text-accent" : "text-text hover:text-primary"}`}
                >
                  {c.name}
                </li>
              ))}
            </ul>
          </div>
        ))}
      </div>
    </div>
  );
}
