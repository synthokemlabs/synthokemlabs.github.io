"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useId, useMemo, useRef, useState, type FormEvent } from "react";
import { getCategory, productHref, structureSrc } from "@/data/products";
import { searchProducts } from "@/lib/search";
import { Icon } from "@/components/ui/Icon";

/** Inline product finder: live suggestions by name, CAS number or application. */
export function HeroSearch() {
  const router = useRouter();
  const [q, setQ] = useState("");
  const [focused, setFocused] = useState(false);
  const [active, setActive] = useState(-1);
  const listId = useId();
  const blurTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const results = useMemo(() => (q.trim() ? searchProducts(q).slice(0, 5) : []), [q]);
  const show = focused && q.trim().length > 0;

  function submit(e?: FormEvent) {
    e?.preventDefault();
    if (active >= 0 && results[active]) router.push(productHref(results[active]));
    else router.push(`/products/${q.trim() ? `?q=${encodeURIComponent(q.trim())}` : ""}`);
  }

  return (
    <form role="search" onSubmit={submit} className="relative w-full max-w-xl" aria-label="Product search">
      <label htmlFor="hero-search" className="sr-only">Search products by name, CAS number or application</label>
      <div className="flex items-center gap-3 rounded-lg bg-white/10 px-4 ring-1 ring-inset ring-white/25 backdrop-blur-md transition focus-within:bg-white focus-within:ring-white">
        <Icon name="search" size={19} className={focused ? "text-primary" : "text-white/80"} />
        <input
          id="hero-search"
          value={q}
          onChange={(e) => { setQ(e.target.value); setActive(-1); }}
          onFocus={() => { if (blurTimer.current) clearTimeout(blurTimer.current); setFocused(true); }}
          onBlur={() => { blurTimer.current = setTimeout(() => setFocused(false), 150); }}
          onKeyDown={(e) => {
            if (e.key === "ArrowDown") { e.preventDefault(); setActive((a) => Math.min(a + 1, results.length - 1)); }
            if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
            if (e.key === "Escape") { setQ(""); }
          }}
          role="combobox"
          aria-expanded={show}
          aria-controls={listId}
          aria-autocomplete="list"
          aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
          autoComplete="off"
          placeholder="Search products or CAS no."
          className={`min-h-14 flex-1 bg-transparent text-base outline-none ${focused ? "text-text placeholder:text-muted" : "text-white placeholder:text-white/70"}`}
        />
        <button type="submit" className="inline-flex min-h-10 cursor-pointer items-center rounded-lg bg-accent px-3.5 text-sm font-semibold text-primary-ink transition-colors hover:bg-white">
          Search
        </button>
      </div>
      {show && (
        <div className="absolute inset-x-0 top-full z-20 mt-2 overflow-hidden rounded-lg bg-white text-text shadow-2xl ring-1 ring-border">
          {results.length > 0 ? (
            <ul id={listId} role="listbox" aria-label="Matching products">
              {results.map((p, i) => (
                <li key={p.category + p.slug} id={`${listId}-${i}`} role="option" aria-selected={i === active}>
                  <Link
                    href={productHref(p)}
                    tabIndex={-1}
                    onMouseEnter={() => setActive(i)}
                    className={`flex items-center justify-between gap-4 px-4 py-3 ${i === active ? "bg-primary-tint" : ""}`}
                  >
                    <span className="flex min-w-0 items-center gap-3">
                      <span className="grid h-10 w-12 shrink-0 place-items-center rounded-lg bg-surface">
                        {structureSrc(p) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={structureSrc(p)} alt="" className="h-auto max-h-[32px] w-auto max-w-[42px] object-contain mix-blend-multiply" />
                        )}
                      </span>
                      <span className="min-w-0">
                      <span className="block truncate font-semibold text-primary-ink">{p.name}</span>
                      <span className="block truncate font-mono text-xs text-muted">
                        {getCategory(p.category)!.shortName}{p.cas ? ` · CAS ${p.cas}` : ""}{p.therapeuticCategory ? ` · ${p.therapeuticCategory}` : ""}
                      </span>
                      </span>
                    </span>
                    <Icon name="arrowRight" size={16} className="shrink-0 text-muted" />
                  </Link>
                </li>
              ))}
            </ul>
          ) : (
            <p id={listId} className="px-4 py-4 text-sm text-muted">No products match “{q}”. Press Enter to search the full catalogue or <Link href="/enquiry/" className="font-semibold text-primary underline">ask our team</Link>.</p>
          )}
        </div>
      )}
    </form>
  );
}
