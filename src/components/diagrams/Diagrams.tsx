import Link from "next/link";
import type { CSSProperties } from "react";
import { EHS, FACILITIES } from "@/data/company";
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
    // As listed on the Product List cover: Corporate Office | R&D Unit, and manufacturing Units II and III
    { id: "rnd", x: 160, y: 120, glyph: "R&D", label: "R&D unit", sub: "At the corporate office" },
    { id: "unit-ii", x: 160, y: 300, glyph: "II", label: "Unit II", sub: "Pashamylaram, Telangana" },
    { id: "unit-iii", x: 840, y: 120, glyph: "III", label: "Unit III", sub: "JN Pharmacity, Andhra Pradesh" },
    { id: "world", x: 840, y: 300, glyph: "◎", label: "40 countries", sub: "Four regions worldwide" },
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
              <text x={n.x - 96} y={n.y + 5} textAnchor="middle" fontSize={n.glyph.length > 2 ? 10 : 13} fontWeight="700" fill="var(--primary)" style={{ fontFamily: "var(--font-display)" }}>{n.glyph}</text>
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

/* ------------------------------------------------------------------ */
/* Quality Management System — ISO 9001:2015 PDCA cycle (PPT slide 21) */
/* ------------------------------------------------------------------ */
const QMS_INPUTS = ["Organisation and its context (4)", "Customer requirements", "Needs and expectations of interested parties (4)"];
const QMS_OUTPUTS = ["Customer satisfaction", "Results of the QMS", "Products & services"];
const QMS_CYCLE = [
  { phase: "Plan", node: "Planning (6)", x: 330, y: 280 },
  { phase: "Do", node: "Support & operation (7, 8)", x: 500, y: 110 },
  { phase: "Check", node: "Performance evaluation (9)", x: 670, y: 280 },
  { phase: "Act", node: "Improvement (10)", x: 500, y: 450 },
];
const wrap = (s: string, n: number) =>
  s.split(" ").reduce<string[]>((lines, w) => {
    const last = lines[lines.length - 1];
    if (last && `${last} ${w}`.length <= n) lines[lines.length - 1] = `${last} ${w}`;
    else lines.push(w);
    return lines;
  }, []);

export function QmsCycle() {
  const font = { fontFamily: "var(--font-sans)" };
  // Clockwise arcs on a ring (r = 170) around the centre, each running in the gap between two node boxes;
  // arrowheads sit at the arc ends, rotated to the tangent (angle + 90°). PDCA tags sit just outside the ring.
  const ring = (deg: number, r = 170) => [500 + r * Math.cos((deg * Math.PI) / 180), 280 + r * Math.sin((deg * Math.PI) / 180)].map((n) => +n.toFixed(2));
  const spans = [[193, 235], [305, 347], [13, 55], [125, 167]];
  const arcs = spans.map(([a, b]) => `M ${ring(a).join(" ")} A 170 170 0 0 1 ${ring(b).join(" ")}`);
  const heads = spans.map(([, b]) => ({ x: ring(b)[0], y: ring(b)[1], r: b + 90 }));
  const tags = [["Plan", 225], ["Do", 315], ["Check", 45], ["Act", 135]].map(([t, deg]) => ({ t: t as string, x: ring(deg as number, 215)[0], y: ring(deg as number, 215)[1] }));
  return (
    <Reveal>
      {/* Phones: the same cycle as an ordered flow */}
      <ol className="space-y-3 md:hidden">
        <li className="rounded-lg bg-surface p-5">
          <p className="eyebrow text-muted">Inputs</p>
          <ul className="mt-2 space-y-1 text-[0.92rem] text-text">{QMS_INPUTS.map((t) => <li key={t}>{t}</li>)}</ul>
        </li>
        {QMS_CYCLE.map((c, i) => (
          <li key={c.phase} className="flex items-center gap-4 rounded-lg bg-white p-4 ring-1 ring-border">
            <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-primary font-mono text-[0.7rem] font-semibold text-white">{c.phase}</span>
            <span><span className="block font-semibold text-primary-ink">{c.node}</span><span className="text-xs text-muted">Step {i + 1} of the Plan–Do–Check–Act cycle</span></span>
          </li>
        ))}
        <li className="rounded-lg bg-surface p-5">
          <p className="eyebrow text-muted">Outputs</p>
          <ul className="mt-2 space-y-1 text-[0.92rem] text-text">{QMS_OUTPUTS.map((t) => <li key={t}>{t}</li>)}</ul>
        </li>
      </ol>

      <svg viewBox="0 0 1000 560" className="hidden w-full md:block" role="img" aria-label="ISO 9001:2015 quality management system: inputs (organisation and its context, customer requirements, needs and expectations of interested parties) feed a Plan–Do–Check–Act cycle of planning, support and operation, performance evaluation and improvement, producing customer satisfaction, results of the QMS, and products and services.">
        <defs>
          <linearGradient id="qms-core" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stopColor="var(--primary)" /><stop offset="1" stopColor="var(--accent)" /></linearGradient>
        </defs>
        {/* System boundary */}
        <rect x="232" y="34" width="536" height="492" rx="18" fill="var(--surface)" stroke="var(--border-strong)" strokeDasharray="4 6" />
        <text x="500" y="62" textAnchor="middle" fontSize="13" fontWeight="700" letterSpacing="1.4" fill="var(--muted)" style={font}>QUALITY MANAGEMENT SYSTEM (4)</text>

        {/* Inputs feed Planning; Performance evaluation produces the outputs */}
        {QMS_INPUTS.map((t, i) => <path key={t} d={`M 196 ${170 + i * 110} C 232 ${170 + i * 110}, 222 280, 245 280`} fill="none" stroke="var(--accent)" strokeWidth="2" pathLength={1} className="draw-path" style={d(0.2 + i * 0.1)} />)}
        {QMS_OUTPUTS.map((t, i) => <path key={t} d={`M 755 280 C 778 280, 768 ${170 + i * 110}, 804 ${170 + i * 110}`} fill="none" stroke="var(--secondary)" strokeWidth="2" pathLength={1} className="draw-path" style={d(1.3 + i * 0.1)} />)}
        {QMS_INPUTS.map((t, i) => {
          const lines = wrap(t, 24);
          return (
            <g key={t} className="node-pop" style={d(0.1 + i * 0.1)}>
              <rect x="20" y={140 + i * 110} width="176" height="60" rx="10" fill="#fff" stroke="var(--accent)" />
              <text x="108" y={175 + i * 110 - (lines.length - 1) * 8} textAnchor="middle" fontSize="12.5" fontWeight="600" fill="var(--primary-ink)" style={font}>
                {lines.map((l, k) => <tspan key={k} x="108" dy={k ? 16 : 0}>{l}</tspan>)}
              </text>
            </g>
          );
        })}
        {QMS_OUTPUTS.map((t, i) => (
          <g key={t} className="node-pop" style={d(1.5 + i * 0.1)}>
            <rect x="804" y={140 + i * 110} width="176" height="60" rx="10" fill="var(--secondary)" />
            <text x="892" y={175 + i * 110} textAnchor="middle" fontSize="13" fontWeight="600" fill="#fff" style={font}>{t}</text>
          </g>
        ))}

        {/* Plan–Do–Check–Act ring */}
        {arcs.map((p) => <path key={p} d={p} fill="none" stroke="var(--primary)" strokeWidth="2.5" pathLength={1} className="draw-path" style={d(0.6 + arcs.indexOf(p) * 0.15)} />)}
        {heads.map((h, i) => (
          <g key={i} className="node-pop" style={d(0.85 + i * 0.15)}>
            <path d="M -7 -6 L 7 0 L -7 6 Z" fill="var(--primary)" transform={`translate(${h.x} ${h.y}) rotate(${h.r})`} />
          </g>
        ))}
        {tags.map((t, i) => (
          <g key={t.t} className="node-pop" style={d(0.9 + i * 0.15)}>
            <rect x={t.x - 30} y={t.y - 14} width="60" height="28" rx="14" fill="var(--primary-tint)" />
            <text x={t.x} y={t.y + 5} textAnchor="middle" fontSize="13" fontWeight="700" fill="var(--primary)" style={font}>{t.t}</text>
          </g>
        ))}
        {QMS_CYCLE.map((c, i) => {
          const lines = wrap(c.node, 20);
          return (
            <g key={c.node} className="node-pop" style={d(0.45 + i * 0.15)}>
              <rect x={c.x - 85} y={c.y - 30} width="170" height="60" rx="10" fill="#fff" stroke="var(--primary)" strokeWidth="1.5" />
              <text x={c.x} y={c.y + 5 - (lines.length - 1) * 8.5} textAnchor="middle" fontSize="13.5" fontWeight="700" fill="var(--primary-ink)" style={font}>
                {lines.map((l, k) => <tspan key={k} x={c.x} dy={k ? 17 : 0}>{l}</tspan>)}
              </text>
            </g>
          );
        })}
        <g className="node-pop" style={d(0.3)}>
          <circle cx="500" cy="280" r="78" fill="url(#qms-core)" />
          <circle cx="500" cy="280" r="70" fill="none" stroke="#fff" strokeOpacity=".35" strokeDasharray="2 5" />
          <text x="500" y="277" textAnchor="middle" fontSize="20" fontWeight="700" fill="#fff" style={{ fontFamily: "var(--font-display)" }}>ISO 9001</text>
          <text x="500" y="299" textAnchor="middle" fontSize="13" fontWeight="600" fill="#fff" fillOpacity=".85" style={font}>:2015</text>
        </g>
      </svg>
    </Reveal>
  );
}

/* ------------------------------------------------------------------ */
/* EHS — leadership & commitment drives six safeguards (PPT slide 24)  */
/* ------------------------------------------------------------------ */
export function EhsFlow() {
  return (
    <Reveal>
      <div className="node-pop mx-auto w-fit rounded-lg bg-gradient-to-br from-primary to-accent-strong px-7 py-4 text-center text-white shadow-lg shadow-primary/20" style={d(0.1)}>
        <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-accent-soft">Driven by</p>
        <p className="mt-1 font-display text-xl font-semibold">Leadership &amp; commitment</p>
      </div>
      <span aria-hidden="true" className="mx-auto block h-8 w-px bg-border-strong" />
      <ul className="relative grid grid-cols-2 gap-3 sm:grid-cols-3 md:grid-cols-6 md:gap-4 md:pt-8">
        {/* Rail joining the six branches (desktop) */}
        <span aria-hidden="true" className="absolute left-[8%] right-[8%] top-0 hidden h-px bg-border-strong md:block" />
        {EHS.safeguards.map((s, i) => (
          <li key={s.t} className="node-pop relative flex flex-col items-center rounded-lg bg-white p-4 text-center ring-1 ring-border" style={d(0.35 + i * 0.1)}>
            <span aria-hidden="true" className="absolute -top-8 left-1/2 hidden h-8 w-px bg-border-strong md:block" />
            <span className="grid h-12 w-12 place-items-center rounded-full bg-primary-tint text-primary"><Icon name={s.icon} size={22} strokeWidth={1.5} /></span>
            <span className="mt-3 text-[0.9rem] font-semibold leading-snug text-primary-ink">{s.t}</span>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}

