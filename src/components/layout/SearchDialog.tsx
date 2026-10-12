"use client";

import { useRouter } from "next/navigation";
import { useEffect, useId, useMemo, useRef, useState } from "react";
import { getCategory, PRODUCTS, productHref, STATUS_LABEL, structureSrc } from "@/data/products";
import { searchPages, searchProducts } from "@/lib/search";
import { Icon } from "@/components/ui/Icon";

const SUGGESTED = ["Guaifenesin", "Methocarbamol", "93-14-1", "Ranolazine", "Cyclodextrin"];

/** Site-wide command-palette search over products (name, CAS, application) and pages. Native <dialog> gives focus trapping and Escape. */
export function SearchDialog({ open, onClose }: { open: boolean; onClose: () => void }) {
  const ref = useRef<HTMLDialogElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const router = useRouter();
  const [q, setQ] = useState("");
  const [active, setActive] = useState(0);
  const listId = useId();

  useEffect(() => {
    const d = ref.current;
    if (!d) return;
    if (open && !d.open) { d.showModal(); setQ(""); setActive(0); requestAnimationFrame(() => inputRef.current?.focus()); }
    if (!open && d.open) d.close();
  }, [open]);

  const results = useMemo(() => {
    if (!q.trim()) return [];
    const products = searchProducts(q, PRODUCTS).slice(0, 7).map((p) => ({
      key: `p-${p.category}-${p.slug}`, href: productHref(p), title: p.name, img: structureSrc(p),
      meta: [getCategory(p.category)!.shortName, p.cas && `CAS ${p.cas}`, p.status && STATUS_LABEL[p.status]].filter(Boolean).join(" · "), kind: "Product" as const,
    }));
    const pages = searchPages(q).slice(0, 4).map((p) => ({ key: `g-${p.href}`, href: p.href, title: p.title, meta: p.section, kind: "Page" as const, img: undefined as string | undefined }));
    return [...products, ...pages];
  }, [q]);

  function go(href: string) { onClose(); router.push(href); }

  return (
    <dialog
      ref={ref}
      onClose={onClose}
      onClick={(e) => { if (e.target === ref.current) onClose(); }}
      aria-label="Search"
      data-lenis-prevent
      className="m-0 mx-auto mt-[8vh] w-[min(720px,calc(100vw-2rem))] max-w-none rounded-lg bg-white p-0 text-text shadow-2xl backdrop:bg-primary-ink/60 backdrop:backdrop-blur-sm"
    >
      <div className="flex items-center gap-3 border-b border-border px-5">
        <Icon name="search" size={20} className="text-muted" />
        <label htmlFor="site-search" className="sr-only">Search products and pages</label>
        <input
          id="site-search"
          ref={inputRef}
          value={q}
          onChange={(e) => { setQ(e.target.value); setActive(0); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, 0)); }
            if (e.key === "Enter") {
              e.preventDefault();
              if (results[active]) go(results[active].href);
              else if (q.trim()) go(`/products/?q=${encodeURIComponent(q.trim())}`);
            }
          }}
          role="combobox"
          aria-expanded={results.length > 0}
          aria-controls={listId}
          aria-activedescendant={results[active] ? `${listId}-${active}` : undefined}
          autoComplete="off"
          placeholder="Search APIs, intermediates, CAS numbers…"
          className="min-h-16 flex-1 bg-transparent text-lg outline-none placeholder:text-muted"
        />
        <button type="button" onClick={onClose} className="inline-flex min-h-11 cursor-pointer items-center rounded-lg px-2 font-mono text-xs text-muted hover:bg-surface" aria-label="Close search">
          ESC
        </button>
      </div>

      <div className="max-h-[60vh] overflow-y-auto p-2">
        {!q.trim() && (
          <div className="p-4">
            <p className="eyebrow text-muted">Try</p>
            <div className="mt-3 flex flex-wrap gap-2">
              {SUGGESTED.map((s) => (
                <button key={s} type="button" onClick={() => { setQ(s); inputRef.current?.focus(); }} className="min-h-10 cursor-pointer rounded-lg bg-surface px-3 text-sm text-text hover:bg-primary-tint hover:text-primary">
                  {s}
                </button>
              ))}
            </div>
          </div>
        )}
        {q.trim() && results.length === 0 && (
          <div className="p-6 text-center">
            <p className="font-medium text-primary-ink">No matches for “{q}”.</p>
            <p className="mt-1 text-sm text-muted">Try a product name, CAS number or therapeutic category — or ask our team.</p>
            <button type="button" onClick={() => go(`/enquiry/?message=${encodeURIComponent(`Looking for: ${q}`)}`)} className="mt-4 inline-flex min-h-11 cursor-pointer items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white hover:bg-accent-strong">
              Ask about “{q}” <Icon name="arrowRight" size={16} />
            </button>
          </div>
        )}
        {results.length > 0 && (
          <ul id={listId} role="listbox" aria-label="Search results">
            {results.map((r, i) => (
              <li key={r.key} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                <button
                  type="button"
                  tabIndex={-1}
                  onMouseMove={() => setActive(i)}
                  onClick={() => go(r.href)}
                  className={`flex w-full cursor-pointer items-center justify-between gap-4 rounded-lg px-4 py-3 text-left ${i === active ? "bg-primary-tint" : ""}`}
                >
                  <span className="flex min-w-0 items-center gap-3">
                    <span className="grid h-11 w-14 shrink-0 place-items-center rounded-lg bg-surface ring-1 ring-border">
                      {r.img ? (
                        // eslint-disable-next-line @next/next/no-img-element
                        <img src={r.img} alt="" className="h-auto max-h-[36px] w-auto max-w-[48px] object-contain mix-blend-multiply" />
                      ) : (
                        <span aria-hidden="true" className="text-muted">{r.kind === "Page" ? "↗" : "⚗"}</span>
                      )}
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate font-semibold text-primary-ink">{r.title}</span>
                      <span className="block truncate font-mono text-xs text-muted">{r.meta}</span>
                    </span>
                  </span>
                  <span className="shrink-0 font-mono text-[0.68rem] uppercase tracking-wider text-muted">{r.kind}</span>
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
      <div className="flex items-center justify-between border-t border-border px-5 py-3 font-mono text-[0.7rem] text-muted">
        <span>↑ ↓ to navigate · Enter to open</span>
        <span>{PRODUCTS.length} products indexed</span>
      </div>
    </dialog>
  );
}
