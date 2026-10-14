"use client";

import { useId, useRef, useState, type KeyboardEvent } from "react";
import { Icon } from "@/components/ui/Icon";

export interface RndTab { id: string; label: string; short: string; intro: string; groups: { title: string; items: string[] }[] }

/** Accessible tabs (arrow keys move between tabs) for the R&D labs, team and literature. */
export function RndTabs({ tabs }: { tabs: RndTab[] }) {
  const [active, setActive] = useState(0);
  const base = useId();
  const refs = useRef<(HTMLButtonElement | null)[]>([]);
  const onKey = (e: KeyboardEvent) => {
    const step = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!step) return;
    e.preventDefault();
    const next = (active + step + tabs.length) % tabs.length;
    setActive(next);
    refs.current[next]?.focus();
  };
  const tab = tabs[active];
  return (
    <div>
      <div role="tablist" aria-label="R&D" onKeyDown={onKey} className="relative flex gap-1 rounded-full bg-surface p-1 ring-1 ring-border">
        {tabs.map((t, i) => (
          <button
            key={t.id}
            ref={(el) => { refs.current[i] = el; }}
            id={`${base}-tab-${t.id}`}
            role="tab"
            type="button"
            aria-selected={i === active}
            aria-controls={`${base}-panel-${t.id}`}
            tabIndex={i === active ? 0 : -1}
            onClick={() => setActive(i)}
            className={`min-h-11 flex-1 cursor-pointer rounded-full px-3 text-[0.88rem] font-semibold transition-colors duration-300 sm:px-4 ${i === active ? "bg-primary text-white shadow-sm" : "text-muted hover:text-primary-ink"}`}
          >
            <span className="sm:hidden">{t.short}</span><span className="hidden sm:inline">{t.label}</span>
          </button>
        ))}
      </div>
      {/* key forces a fresh mount so the panel animates in on every switch */}
      <div key={tab.id} id={`${base}-panel-${tab.id}`} role="tabpanel" aria-labelledby={`${base}-tab-${tab.id}`} className="tab-in mt-7">
        <p className="text-[1.02rem] leading-relaxed text-text">{tab.intro}</p>
        <div className={`mt-6 grid grid-cols-1 gap-x-8 gap-y-6 ${tab.groups.length > 1 ? "sm:grid-cols-2" : ""}`}>
          {tab.groups.map((g) => (
            <div key={g.title}>
              <h3 className="eyebrow text-muted">{g.title}</h3>
              <ul className="mt-3 space-y-2.5">
                {g.items.map((x, i) => (
                  <li key={x} className="tab-item flex gap-2.5 text-[0.94rem] leading-snug text-text" style={{ animationDelay: `${120 + i * 45}ms` }}>
                    <Icon name="check" size={16} className="mt-0.5 shrink-0 text-accent-strong" />{x}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
