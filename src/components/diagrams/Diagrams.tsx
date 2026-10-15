import type { CSSProperties } from "react";
import { Icon } from "@/components/ui/Icon";
import { LogoMark } from "@/components/ui/Logo";
import { Reveal } from "@/components/ui/client";

const d = (s: number) => ({ "--draw-delay": `${s}s`, "--node-delay": `${s}s` }) as CSSProperties;

/* ------------------------------------------------------------------ */
/* Quality layers — concentric system diagram                          */
/* ------------------------------------------------------------------ */
export const QUALITY_LAYERS = [
  { title: "Regulatory compliance", body: "Ph. Eur., USP and other national & international standards; DMFs, CEPs and GMP approvals.", r: 190, fill: "var(--primary-tint)", text: "var(--primary)" },
  { title: "Quality assurance", body: "Integrated quality systems that harmonise global quality and regulatory standards across functions.", r: 142, fill: "#c6e2f8", text: "var(--primary)" },
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
            <circle cx="210" cy="210" r="46" fill="var(--deep-2)" />
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
  // Circle centres form an equilateral triangle (side 140) around the centroid C. Each label sits in its circle's
  // own (non-overlapping) region: a third of the radius out from the centre, along the line from C through that
  // centre — where that region is widest, so "Manufacturing" keeps clear of both circle edges.
  const R = 112;
  const C = { x: 210, y: 221.3 };
  const circles = [
    { cx: 210, cy: 140, label: "Quality", icon: "award" as const, color: "var(--accent)" },
    { cx: 140, cy: 262, label: "Manufacturing", icon: "factory" as const, color: "var(--secondary)" },
    { cx: 280, cy: 262, label: "Integrity", icon: "shield" as const, color: "var(--primary)" },
  ].map((c) => {
    const dx = c.cx - C.x, dy = c.cy - C.y, len = Math.hypot(dx, dy);
    return { ...c, lx: c.cx + (dx / len) * R * 0.33, ly: c.cy + (dy / len) * R * 0.33 };
  });
  return (
    <Reveal>
      <svg viewBox="0 0 420 400" className="mx-auto w-full max-w-[440px]" role="img" aria-label="Three overlapping spheres of influence: Quality, Manufacturing and Integrity, forming the Synthokem ethos">
        {circles.map((c, i) => (
          <circle key={c.label} cx={c.cx} cy={c.cy} r={R} fill={c.color} fillOpacity="0.14" stroke={c.color} strokeWidth="1.5" className="node-pop" style={d(0.1 + i * 0.15)} />
        ))}
        {circles.map((c, i) => (
          <g key={c.label} className="node-pop" style={d(0.55 + i * 0.12)}>
            {/* Icon badge centred 18px above the label point, text baseline 16px below it — one centred stack */}
            <circle cx={c.lx} cy={c.ly - 18} r="15" fill="#fff" stroke={c.color} strokeOpacity="0.55" />
            <svg x={c.lx - 9} y={c.ly - 27} width="18" height="18" viewBox="0 0 24 24" style={{ color: c.color }}>
              <Icon name={c.icon} size={24} strokeWidth={1.8} />
            </svg>
            <text x={c.lx} y={c.ly + 16} textAnchor="middle" fontSize="13.5" fontWeight="700" fill="var(--primary-ink)" style={{ fontFamily: "var(--font-display)" }}>{c.label}</text>
          </g>
        ))}
        <g className="node-pop" style={d(0.95)}>
          <circle cx={C.x} cy={C.y} r="34" fill="#fff" stroke="var(--border-strong)" />
          <foreignObject x={C.x - 26} y={C.y - 26} width="52" height="52">
            <div style={{ display: "grid", placeItems: "center", height: "100%" }}><LogoMark className="h-8 w-auto" /></div>
          </foreignObject>
        </g>
      </svg>
    </Reveal>
  );
}
