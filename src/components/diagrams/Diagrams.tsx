import Link from "next/link";
import type { CSSProperties } from "react";
import { FACILITIES } from "@/data/company";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/client";

const d = (s: number) => ({ "--draw-delay": `${s}s`, "--node-delay": `${s}s` }) as CSSProperties;

/* ------------------------------------------------------------------ */
/* Quality layers — concentric system diagram                          */
/* ------------------------------------------------------------------ */
export const QUALITY_LAYERS = [
  { title: "Regulatory compliance", body: "Ph. Eur., USP and other national & international standards; DMFs, CEPs and GMP approvals.", r: 190, fill: "var(--primary-tint)", text: "var(--primary)" },
  { title: "Quality assurance", body: "Integrated quality systems that harmonise global quality and regulatory standards across functions.", r: 142, fill: "#cfe3ee", text: "var(--primary)" },
  { title: "Quality control", body: "Qualified QC laboratory responsible for all analysis, at every stage of the process.", r: 94, fill: "var(--secondary)", text: "#ffffff" },
];

export function QualityLayers() {
  return (
    <Reveal className="grid grid-cols-1 items-center gap-10 lg:grid-cols-12">
      <div className="lg:col-span-6">
        <svg viewBox="0 0 420 420" className="mx-auto w-full max-w-[440px]" role="img" aria-label="Quality system: quality control inside quality assurance inside regulatory compliance, surrounding every Synthokem product">
          <circle cx="210" cy="210" r="204" fill="none" stroke="var(--accent)" strokeOpacity=".5" strokeDasharray="2 7" />
          {QUALITY_LAYERS.map((l, i) => (
            <g key={l.title} className="node-pop" style={d(0.15 + i * 0.18)}>
              <circle cx="210" cy="210" r={l.r} fill={l.fill} />
              <path id={`ql-${i}`} d={`M ${210 - l.r + 22} 210 A ${l.r - 22} ${l.r - 22} 0 0 1 ${210 + l.r - 22} 210`} fill="none" />
              <text fontSize="12.5" fontWeight="700" letterSpacing="1.6" fill={l.text} style={{ fontFamily: "var(--font-sans)" }}>
                <textPath href={`#ql-${i}`} startOffset="50%" textAnchor="middle">{l.title.toUpperCase()}</textPath>
              </text>
            </g>
          ))}
          <g className="node-pop" style={d(0.75)}>
            <circle cx="210" cy="210" r="46" fill="var(--primary)" />
            <text x="210" y="206" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" style={{ fontFamily: "var(--font-sans)" }}>EVERY</text>
            <text x="210" y="222" textAnchor="middle" fontSize="12" fontWeight="700" fill="#fff" style={{ fontFamily: "var(--font-sans)" }}>PRODUCT</text>
          </g>
        </svg>
      </div>
      <ol className="space-y-4 lg:col-span-6">
        {[...QUALITY_LAYERS].reverse().map((l, i) => (
          <li key={l.title} className="lift flex gap-4 rounded-lg bg-white p-5 ring-1 ring-border">
            <span className="mt-1 h-4 w-4 shrink-0 rounded-full ring-4 ring-white" style={{ background: l.fill, boxShadow: "0 0 0 1px var(--border-strong)" }} />
            <span>
              <span className="text-xs font-semibold uppercase tracking-[0.1em] text-muted">Layer {i + 1}</span>
              <span className="mt-1 block text-lg font-semibold text-primary-ink">{l.title}</span>
              <span className="mt-1 block text-[0.95rem] leading-relaxed text-muted">{l.body}</span>
            </span>
          </li>
        ))}
      </ol>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Values — three overlapping spheres (from "Our philosophy")         */
/* ------------------------------------------------------------------ */
export function ValuesDiagram() {
  const circles = [
    { cx: 200, cy: 150, label: "Quality", color: "var(--accent)" },
    { cx: 140, cy: 255, label: "Manufacturing", color: "var(--secondary)" },
    { cx: 260, cy: 255, label: "Integrity", color: "var(--primary)" },
  ];
  return (
    <Reveal>
      <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-[420px]" role="img" aria-label="Three overlapping spheres of influence: Quality, Manufacturing and Integrity, forming the Synthokem ethos">
        {circles.map((c, i) => (
          <g key={c.label} className="node-pop" style={d(0.1 + i * 0.15)}>
            <circle cx={c.cx} cy={c.cy} r="105" fill={c.color} fillOpacity="0.16" stroke={c.color} strokeWidth="1.5" />
          </g>
        ))}
        {circles.map((c, i) => {
          const ty = c.cy + (i === 0 ? -52 : 58);
          const tx = c.cx + (i === 1 ? -38 : i === 2 ? 38 : 0);
          return (
            <text key={c.label} x={tx} y={ty} textAnchor="middle" fontSize="15" fontWeight="700" fill="var(--primary-ink)" className="node-pop" style={{ ...d(0.6 + i * 0.1), fontFamily: "var(--font-display)" }}>{c.label}</text>
          );
        })}
        <g className="node-pop" style={d(0.9)}>
          <circle cx="200" cy="222" r="34" fill="#fff" stroke="var(--border-strong)" />
          <foreignObject x="174" y="196" width="52" height="52">
            <div style={{ display: "grid", placeItems: "center", height: "100%" }}><LogoMark className="h-8 w-auto" /></div>
          </foreignObject>
        </g>
      </svg>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* Facilities network — hub and spoke                                 */
/* ------------------------------------------------------------------ */
export function FacilitiesNetwork() {
  const nodes = [
    { id: "unit-i", x: 160, y: 120, label: "Unit I", sub: "USFDA approved since 2005" },
    { id: "unit-ii", x: 160, y: 300, label: "Unit II", sub: "Pashamylaram, Telangana" },
    { id: "unit-iii", x: 840, y: 120, label: "Unit III", sub: "JN Pharmacity, Andhra Pradesh" },
    { id: "world", x: 840, y: 300, label: "40 countries", sub: "Four regions worldwide" },
  ];
  return (
    <Reveal>
      <div className="relative mx-auto max-w-5xl">
        {/* Mobile: stacked hub-and-spoke */}
        <div className="md:hidden">
          <div className="rounded-lg bg-primary p-6 text-white">
            <p className="text-sm font-semibold text-accent-soft">Hub</p>
            <p className="mt-1 font-display text-2xl font-semibold">Corporate office</p>
            <p className="text-on-dark-muted">Pashamylaram, Telangana</p>
          </div>
          <ul className="ml-6 border-l-2 border-accent/50 pl-5 pt-4">
            {nodes.map((n) => (
              <li key={n.id} className="relative mb-3 rounded-lg bg-white p-4 ring-1 ring-border">
                <span aria-hidden="true" className="absolute -left-5 top-1/2 h-[2px] w-5 bg-accent/50" />
                <span className="block font-semibold text-primary-ink">{n.label}</span>
                <span className="block text-sm text-muted">{n.sub}</span>
              </li>
            ))}
          </ul>
        </div>
        <svg viewBox="0 0 1000 420" className="hidden w-full md:block" aria-hidden="true" >
          {nodes.map((n, i) => {
            const path = `M500 210 C ${(500 + n.x) / 2} 210, ${(500 + n.x) / 2} ${n.y}, ${n.x} ${n.y}`;
            return (
              <g key={n.id}>
                <path d={path} fill="none" stroke="var(--border-strong)" strokeWidth="2" pathLength={1} className="draw-path" style={d(0.2 + i * 0.12)} />
              </g>
            );
          })}
          {nodes.map((n, i) => (
            <g key={n.id} className="node-pop" style={d(0.6 + i * 0.12)}>
              <rect x={n.x - 130} y={n.y - 38} width="260" height="76" rx="8" fill="#fff" stroke="var(--border)" />
              <circle cx={n.x - 96} cy={n.y} r="18" fill="var(--primary-tint)" />
              <text x={n.x - 96} y={n.y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--primary)" style={{ fontFamily: "var(--font-display)" }}>{n.id === "world" ? "◎" : ["I", "II", "III"][i]}</text>
              <text x={n.x - 66} y={n.y - 4} fontSize="17" fontWeight="700" fill="var(--primary-ink)" style={{ fontFamily: "var(--font-display)" }}>{n.label}</text>
              <text x={n.x - 66} y={n.y + 18} fontSize="12.5" fill="var(--muted)" style={{ fontFamily: "var(--font-sans)" }}>{n.sub}</text>
            </g>
          ))}
          <g className="node-pop" style={d(0.3)}>
            <circle cx="500" cy="210" r="86" fill="var(--primary)" />
            <foreignObject x="470" y="146" width="60" height="50"><div style={{ display: "grid", placeItems: "center", height: "100%" }}><LogoMark className="h-9 w-auto" tone="light" /></div></foreignObject>
            <text x="500" y="222" textAnchor="middle" fontSize="15" fontWeight="700" fill="#fff" style={{ fontFamily: "var(--font-display)" }}>Corporate office</text>
            <text x="500" y="242" textAnchor="middle" fontSize="12" fill="var(--accent-soft)" style={{ fontFamily: "var(--font-sans)" }}>Pashamylaram, Telangana</text>
          </g>
        </svg>
        <p className="sr-only">{FACILITIES.map((f) => `${f.name}: ${f.location}`).join(". ")}</p>
      </div>
    </Reveal>
  );
}

