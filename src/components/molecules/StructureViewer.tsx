"use client";

import { useEffect, useRef, useState } from "react";
import { Molecule3D, type Model3D } from "./Molecule3D";
import { Icon } from "@/components/ui/Icon";

/**
 * Product-page structure panel: an inline 2D structure that draws itself bond by bond,
 * with an optional interactive 3D ball-and-stick model.
 */
export function StructureViewer({
  name, svg, rasterSrc, model3d, parentNote, cas,
}: { name: string; svg?: string; rasterSrc?: string; model3d?: Model3D; parentNote?: boolean; cas?: string }) {
  const [mode, setMode] = useState<"2d" | "3d">("2d");
  const [drawKey, setDrawKey] = useState(0);
  const wrapRef = useRef<HTMLDivElement>(null);
  // Cap the on-screen scale (~1.55 px per drawing unit) so small molecules aren't blown up
  const vb = svg?.match(/viewBox='[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)'/);
  const maxStyle = vb ? { maxWidth: `${Math.round(+vb[1] * 1.55)}px`, maxHeight: `${Math.round(+vb[2] * 1.55)}px` } : undefined;

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => {
      if (e.isIntersecting) { el.classList.add("is-visible"); io.disconnect(); setTimeout(() => el.classList.add("settled"), 3200); }
    }, { threshold: 0.3 });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <figure className="overflow-hidden rounded-lg bg-white ring-1 ring-border">
      <div className="flex items-center justify-between gap-3 border-b border-border px-4 py-3">
        <figcaption className="text-xs font-semibold uppercase tracking-[0.12em] text-muted">Chemical structure</figcaption>
        <div className="flex items-center gap-1">
          {mode === "2d" && svg && (
            <button type="button" onClick={() => { wrapRef.current?.classList.remove("settled"); setDrawKey((k) => k + 1); setTimeout(() => wrapRef.current?.classList.add("settled"), 3200); }} className="grid h-9 w-9 cursor-pointer place-items-center rounded-full text-muted hover:bg-surface hover:text-primary" aria-label="Replay drawing animation">
              <Icon name="history" size={16} />
            </button>
          )}
          {model3d && (
            <div role="group" aria-label="Structure view" className="flex rounded-full bg-surface p-1">
              {(["2d", "3d"] as const).map((m) => (
                <button
                  key={m}
                  type="button"
                  aria-pressed={mode === m}
                  onClick={() => setMode(m)}
                  className={`min-h-8 cursor-pointer rounded-full px-3.5 text-xs font-bold uppercase tracking-wider transition-colors ${mode === m ? "bg-primary text-white shadow-sm" : "text-muted hover:text-primary"}`}
                >
                  {m}
                </button>
              ))}
            </div>
          )}
        </div>
      </div>

      <div ref={wrapRef} className="relative aspect-[4/3]">
        {mode === "2d" ? (
          <div className="grid-paper absolute inset-0 grid place-items-center p-6">
            {svg ? (
              <div key={drawKey} className="mol-draw h-full w-full" style={maxStyle} role="img" aria-label={`2D chemical structure of ${name}`} dangerouslySetInnerHTML={{ __html: svg }} />
            ) : rasterSrc ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img src={rasterSrc} alt={`Chemical structure of ${name}`} className="h-[72%] w-[80%] object-contain mix-blend-multiply" />
            ) : null}
          </div>
        ) : (
          <div className="absolute inset-0 bg-[radial-gradient(circle_at_50%_40%,#123f6b_0%,#071b30_70%)]">
            <Molecule3D model={model3d!} label={`Interactive 3D model of ${name}`} />
            <p className="pointer-events-none absolute bottom-3 left-4 flex items-center gap-2 text-[0.72rem] text-on-dark-muted">
              <Icon name="globe" size={13} /> Drag to rotate{parentNote ? " · parent molecule shown" : ""}
            </p>
          </div>
        )}
      </div>
      {cas && <div className="flex items-center justify-between border-t border-border bg-surface px-4 py-2.5 font-mono text-xs text-muted"><span>CAS {cas}</span><span>{mode === "3d" ? "3D conformer · PubChem" : "2D depiction"}</span></div>}
    </figure>
  );
}
