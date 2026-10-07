"use client";

import Link from "next/link";
import { useEffect, useId, useLayoutEffect, useMemo, useRef, useState, ViewTransition } from "react";
import { CATEGORIES, PRODUCTS, STATUS_LABEL, getCategory, productHref, structureMeta, structureSrc, type CategorySlug, type Product, type ProductStatus } from "@/data/products";
import { formatFormula } from "@/lib/chem";
import { searchProducts } from "@/lib/search";
import { Icon } from "@/components/ui/Icon";
import { Badge } from "@/components/ui/primitives";

type Sort = "az" | "za" | "category";
type Use = "human" | "veterinary";

/**
 * Searchable, filterable product directory. Driven entirely by data/products.ts.
 * State is mirrored to the URL (?q=&category=&status=) so results are shareable.
 */
export function ProductCatalogue({ lockedCategory }: { lockedCategory?: CategorySlug }) {
  const [q, setQ] = useState("");
  const [categories, setCategories] = useState<CategorySlug[]>(lockedCategory ? [lockedCategory] : []);
  const [status, setStatus] = useState<ProductStatus | "all">("all");
  const [use, setUse] = useState<Use | "all">("all");
  const [therapy, setTherapy] = useState("all");
  const [sort, setSort] = useState<Sort>("category");
  const [showFilters, setShowFilters] = useState(false);
  const [view, setView] = useState<"grid" | "list">("grid");
  const searchId = useId();
  const searchRef = useRef<HTMLInputElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const rects = useRef(new Map<string, { x: number; y: number }>());
  const lastView = useRef(view);

  // "/" jumps to the search box from anywhere on the page
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey || t.closest("input, textarea, select, [contenteditable=true], dialog")) return;
      e.preventDefault();
      searchRef.current?.focus();
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  // Read initial state from the URL (no Suspense boundary needed for static export)
  useEffect(() => {
    const p = new URLSearchParams(window.location.search);
    if (p.get("q")) setQ(p.get("q")!);
    const c = p.get("category") as CategorySlug | null;
    if (c && !lockedCategory && getCategory(c)) setCategories([c]);
    const st = p.get("status") as ProductStatus | null;
    if (st && STATUS_LABEL[st]) setStatus(st);
  }, [lockedCategory]);

  useEffect(() => {
    // Preserve unrelated params (e.g. utm_*) and only touch history when something changed
    const p = new URLSearchParams(window.location.search);
    if (q.trim()) p.set("q", q.trim()); else p.delete("q");
    if (!lockedCategory && categories.length === 1) p.set("category", categories[0]); else p.delete("category");
    if (status !== "all") p.set("status", status); else p.delete("status");
    const qs = p.toString();
    const next = `${window.location.pathname}${qs ? `?${qs}` : ""}`;
    if (next !== `${window.location.pathname}${window.location.search}`) window.history.replaceState(null, "", next);
  }, [q, categories, status, lockedCategory]);

  const scope = useMemo(() => PRODUCTS.filter((p) => categories.length === 0 || categories.includes(p.category)), [categories]);
  const apisInScope = scope.some((p) => p.category === "apis");
  const therapies = useMemo(
    () => [...new Set(scope.filter((p) => p.therapeuticCategory && (use === "all" || p.use === use)).map((p) => p.therapeuticCategory!))].sort(),
    [scope, use],
  );

  const results = useMemo(() => {
    let list = scope.filter(
      (p) =>
        (status === "all" || p.status === status) &&
        (use === "all" || p.category !== "apis" || p.use === use) &&
        (therapy === "all" || p.therapeuticCategory === therapy),
    );
    if (use !== "all") list = list.filter((p) => p.category === "apis");
    if (q.trim()) return searchProducts(q, list);
    const order = CATEGORIES.map((c) => c.slug);
    return [...list].sort((a, b) =>
      sort === "az" ? a.name.localeCompare(b.name) : sort === "za" ? b.name.localeCompare(a.name) : order.indexOf(a.category) - order.indexOf(b.category) || a.name.localeCompare(b.name),
    );
  }, [scope, status, use, therapy, q, sort]);

  // FLIP: when filters, search or sort change, cards glide from their old slots to the new ones
  useLayoutEffect(() => {
    const ul = listRef.current;
    if (!ul) { rects.current.clear(); return; }
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    const viewChanged = lastView.current !== view;
    lastView.current = view;
    const items = Array.from(ul.children) as HTMLElement[];
    const next = new Map<string, { x: number; y: number }>();
    items.forEach((el) => { const r = el.getBoundingClientRect(); next.set(el.dataset.k ?? "", { x: r.left + window.scrollX, y: r.top + window.scrollY }); });
    if (!reduce && rects.current.size) {
      const ease = "cubic-bezier(0.22, 1, 0.36, 1)";
      items.forEach((el, i) => {
        const now = next.get(el.dataset.k ?? "")!;
        const prev = viewChanged ? undefined : rects.current.get(el.dataset.k ?? "");
        if (prev) {
          const dx = prev.x - now.x, dy = prev.y - now.y;
          if (Math.abs(dx) > 1 || Math.abs(dy) > 1) el.animate([{ transform: `translate(${dx}px, ${dy}px)` }, { transform: "none" }], { duration: 520, easing: ease });
        } else if (i < 24) {
          el.animate([{ opacity: 0, transform: "translateY(16px)" }, { opacity: 1, transform: "none" }], { duration: 480, delay: Math.min(i, 8) * 35, easing: ease, fill: "backwards" });
        }
      });
    }
    rects.current = next;
  }, [results, view]);

  const activeFilters = (lockedCategory ? 0 : categories.length) + (status !== "all" ? 1 : 0) + (use !== "all" ? 1 : 0) + (therapy !== "all" ? 1 : 0);
  function clearAll() {
    setQ(""); setStatus("all"); setUse("all"); setTherapy("all");
    if (!lockedCategory) setCategories([]);
  }
  const toggleCategory = (c: CategorySlug) => { setCategories((cs) => (cs.includes(c) ? cs.filter((x) => x !== c) : [...cs, c])); setTherapy("all"); };

  return (
    <div className="grid grid-cols-1 gap-10 lg:grid-cols-12">
      {/* Filters */}
      <aside className="lg:col-span-3" aria-label="Product filters">
        <div className="lg:sticky lg:top-28">
          <button
            type="button"
            onClick={() => setShowFilters((v) => !v)}
            aria-expanded={showFilters}
            aria-controls="filter-panel"
            className="flex min-h-12 w-full cursor-pointer items-center justify-between rounded-lg px-4 ring-1 ring-border-strong lg:hidden"
          >
            <span className="flex items-center gap-2 font-semibold text-primary-ink"><Icon name="filter" size={18} /> Filters {activeFilters > 0 && <span className="rounded-full bg-primary px-2 text-xs text-white">{activeFilters}</span>}</span>
            <Icon name="chevronDown" size={18} className={showFilters ? "rotate-180" : ""} />
          </button>
          <div id="filter-panel" className={`${showFilters ? "block" : "hidden"} mt-4 space-y-8 lg:mt-0 lg:block`}>
            {!lockedCategory && (
              <fieldset>
                <legend className="eyebrow mb-3 text-muted">Category</legend>
                <ul className="space-y-1">
                  {CATEGORIES.map((c) => {
                    const n = PRODUCTS.filter((p) => p.category === c.slug).length;
                    const on = categories.includes(c.slug);
                    return (
                      <li key={c.slug}>
                        <label className="flex min-h-11 cursor-pointer items-center gap-3 rounded-lg px-2 hover:bg-surface">
                          <input type="checkbox" checked={on} onChange={() => toggleCategory(c.slug)} className="h-[18px] w-[18px] cursor-pointer accent-[var(--primary)]" />
                          <span className="flex-1 text-[0.95rem] text-text">{c.shortName}</span>
                          <span className="font-mono text-xs text-muted">{n}</span>
                        </label>
                      </li>
                    );
                  })}
                </ul>
              </fieldset>
            )}
            <fieldset>
              <legend className="eyebrow mb-3 text-muted">Status</legend>
              <div className="flex flex-wrap gap-2">
                {(["all", "commercial", "under-development"] as const).map((s) => (
                  <button key={s} type="button" aria-pressed={status === s} onClick={() => setStatus(s)}
                    className={`min-h-10 cursor-pointer rounded-full px-3.5 text-sm transition-colors ${status === s ? "bg-primary text-white" : "text-text ring-1 ring-inset ring-border-strong hover:ring-primary"}`}>
                    {s === "all" ? "All" : STATUS_LABEL[s]}
                  </button>
                ))}
              </div>
            </fieldset>
            {apisInScope && (
              <fieldset>
                <legend className="eyebrow mb-3 text-muted">API use</legend>
                <div className="flex flex-wrap gap-2">
                  {(["all", "human", "veterinary"] as const).map((u) => (
                    <button key={u} type="button" aria-pressed={use === u} onClick={() => { setUse(u); setTherapy("all"); }}
                      className={`min-h-10 cursor-pointer rounded-full px-3.5 text-sm capitalize transition-colors ${use === u ? "bg-primary text-white" : "text-text ring-1 ring-inset ring-border-strong hover:ring-primary"}`}>
                      {u === "all" ? "All" : u}
                    </button>
                  ))}
                </div>
              </fieldset>
            )}
            {therapies.length > 0 && (
              <div>
                <label htmlFor="therapy" className="eyebrow mb-3 block text-muted">Therapeutic category</label>
                <div className="relative">
                  <select id="therapy" value={therapy} onChange={(e) => setTherapy(e.target.value)}
                    className="min-h-12 w-full cursor-pointer appearance-none rounded-lg bg-white px-3 pr-10 text-[0.95rem] ring-1 ring-border-strong focus:ring-primary">
                    <option value="all">All therapeutic categories</option>
                    {therapies.map((t) => <option key={t} value={t}>{t}</option>)}
                  </select>
                  <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
                </div>
              </div>
            )}
            {activeFilters > 0 && (
              <button type="button" onClick={clearAll} className="inline-flex min-h-10 cursor-pointer items-center gap-2 text-sm font-semibold text-primary underline-offset-4 hover:underline">
                <Icon name="close" size={15} /> Clear all filters
              </button>
            )}
          </div>
        </div>
      </aside>

      {/* Results */}
      <div className="lg:col-span-9">
        <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
          <div className="flex flex-1 items-center gap-3 rounded-lg bg-white px-4 ring-1 ring-border-strong focus-within:ring-2 focus-within:ring-primary">
            <Icon name="search" size={19} className="text-muted" />
            <label htmlFor={searchId} className="sr-only">Search products</label>
            <input
              id={searchId}
              ref={searchRef}
              type="search"
              value={q}
              onChange={(e) => setQ(e.target.value)}
              placeholder="Search APIs, intermediates, chemicals or CAS no."
              className="min-h-14 flex-1 bg-transparent text-base outline-none placeholder:text-muted"
              autoComplete="off"
            />
            {!q && <kbd className="hidden rounded border border-border px-1.5 py-0.5 font-mono text-[0.7rem] text-muted md:inline" title="Press / to search">/</kbd>}
            {q && <button type="button" onClick={() => setQ("")} aria-label="Clear search" className="grid min-h-10 min-w-10 cursor-pointer place-items-center rounded-full text-muted hover:bg-surface"><Icon name="close" size={16} /></button>}
          </div>
          <div className="relative">
            <label htmlFor="sort" className="sr-only">Sort products</label>
            <select id="sort" value={sort} onChange={(e) => setSort(e.target.value as Sort)} disabled={!!q.trim()}
              className="min-h-14 w-full cursor-pointer appearance-none rounded-lg bg-white pl-4 pr-10 text-[0.95rem] ring-1 ring-border-strong disabled:cursor-not-allowed disabled:opacity-60 sm:w-48">
              <option value="category">Sort: by category</option>
              <option value="az">Sort: A → Z</option>
              <option value="za">Sort: Z → A</option>
            </select>
            <Icon name="chevronDown" size={16} className="pointer-events-none absolute right-3 top-1/2 -translate-y-1/2 text-muted" />
          </div>
          <div role="group" aria-label="Layout" className="hidden rounded-full bg-surface p-1 sm:flex">
            {(["grid", "list"] as const).map((v) => (
              <button key={v} type="button" aria-pressed={view === v} aria-label={v === "grid" ? "Grid view with structures" : "List view"} onClick={() => setView(v)}
                className={`grid h-12 w-12 cursor-pointer place-items-center rounded-full transition-colors ${view === v ? "bg-white text-primary shadow-sm ring-1 ring-border" : "text-muted hover:text-primary"}`}>
                <Icon name={v} size={18} />
              </button>
            ))}
          </div>
        </div>

        <p className="mt-5 font-mono text-xs text-muted" role="status" aria-live="polite">
          {results.length} of {scope.length} {scope.length === 1 ? "product" : "products"}{q.trim() ? ` matching “${q.trim()}”` : ""}
        </p>

        {results.length === 0 ? (
          <div className="mt-6 rounded-lg bg-surface px-6 py-14 text-center">
            <Icon name="flask" size={32} strokeWidth={1.3} className="mx-auto text-accent-strong" />
            <p className="mt-4 font-display text-xl font-semibold text-primary-ink">No products matched your search.</p>
            <p className="mx-auto mt-2 max-w-md text-muted">Try a different name, CAS number or filter — or tell us what you are looking for and our team will respond.</p>
            <div className="mt-6 flex flex-wrap justify-center gap-3">
              <button type="button" onClick={clearAll} className="inline-flex min-h-12 cursor-pointer items-center rounded-md bg-primary px-5 font-semibold text-white hover:bg-primary-dark">Clear filters</button>
              <Link href={`/enquiry/${q.trim() ? `?message=${encodeURIComponent(`Looking for: ${q.trim()}`)}` : ""}`} className="inline-flex min-h-12 items-center rounded-md px-5 font-semibold text-primary ring-1 ring-inset ring-border-strong hover:ring-primary">Ask our team</Link>
            </div>
          </div>
        ) : (
          view === "grid" ? (
            <ul ref={listRef} className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2 xl:grid-cols-3">
              {results.map((p) => <ProductCard key={p.category + p.slug} p={p} showCategory={!lockedCategory} />)}
            </ul>
          ) : (
            <ul ref={listRef} className="mt-4 border-t border-border">
              {results.map((p) => <ProductRow key={p.category + p.slug} p={p} showCategory={!lockedCategory} />)}
            </ul>
          )
        )}
      </div>
    </div>
  );
}

function StructureThumb({ p, className = "" }: { p: Product; className?: string }) {
  const src = structureSrc(p);
  return src ? (
    // eslint-disable-next-line @next/next/no-img-element
    <img src={src} alt={`Chemical structure of ${p.name}`} loading="lazy" className={`object-contain mix-blend-multiply ${className}`} />
  ) : (
    <span className={`grid place-items-center text-center text-[0.68rem] font-semibold uppercase tracking-[0.1em] text-muted ${className}`}>
      <Icon name="flask" size={22} strokeWidth={1.3} className="mb-1 text-border-strong" />Structure on request
    </span>
  );
}

/** Product names carry a shared transition name so they morph into the product page title. */
export function ProductName({ slug, className, children }: { slug: string; className?: string; children: React.ReactNode }) {
  return (
    <ViewTransition name={`title-${slug}`} share="title-morph" default="none">
      <span className={className}>{children}</span>
    </ViewTransition>
  );
}

function ProductCard({ p, showCategory }: { p: Product; showCategory: boolean }) {
  const cat = getCategory(p.category)!;
  const meta = structureMeta(p.slug);
  const detail = p.therapeuticCategory ?? p.usedIn?.join(", ") ?? p.applications?.join(", ");
  return (
    <li data-k={p.category + p.slug}>
      <Link href={productHref(p)} className="card-hover group flex h-full flex-col overflow-hidden rounded-lg border border-border bg-white hover:border-primary/40">
        {/* Label row sits above the drawing so nothing ever overlaps the structure */}
        <span className="flex min-h-11 flex-wrap items-center justify-between gap-x-2 gap-y-1 border-b border-border bg-white px-4 py-2.5">
          <span className="text-[0.72rem] font-semibold uppercase leading-tight tracking-[0.08em] text-muted">
            {showCategory ? cat.shortName : ""}{p.use === "veterinary" ? (showCategory ? " · Vet" : "Veterinary") : ""}
          </span>
          {p.status && <Badge tone={p.status === "commercial" ? "green" : "amber"}>{STATUS_LABEL[p.status]}</Badge>}
        </span>
        <span className="grid-paper relative grid h-44 place-items-center overflow-hidden">
          <StructureThumb p={p} className="h-auto max-h-[136px] w-auto max-w-[84%] transition-transform duration-700 group-hover:scale-105" />
        </span>
        <span className="flex flex-1 flex-col border-t border-border p-5">
          <ProductName slug={p.slug} className="font-display text-[1.05rem] font-semibold leading-snug text-primary-ink group-hover:text-primary">{p.name}</ProductName>
          <span className="mt-1 font-mono text-xs text-muted">{p.cas ? `CAS ${p.cas}` : "CAS on request"}{meta.formula ? ` · ${formatFormula(meta.formula)}` : ""}</span>
          {detail && <span className="mt-3 line-clamp-2 flex-1 text-[0.88rem] text-muted">{detail}</span>}
          <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold text-primary">View details <Icon name="arrowRight" size={15} className="transition-transform group-hover:translate-x-1" /></span>
        </span>
      </Link>
    </li>
  );
}

function ProductRow({ p, showCategory }: { p: Product; showCategory: boolean }) {
  const cat = getCategory(p.category)!;
  const detail = p.therapeuticCategory ?? p.usedIn?.join(", ") ?? p.applications?.join(", ");
  return (
    <li data-k={p.category + p.slug} className="border-b border-border">
      <Link href={productHref(p)} className="group grid grid-cols-[4.5rem_1fr_auto] items-center gap-x-5 gap-y-2 py-4 transition-colors hover:bg-surface/70 sm:px-3 md:grid-cols-[6rem_minmax(0,1.6fr)_minmax(0,1fr)_minmax(0,1.2fr)_auto]">
        <span className="grid-paper row-span-2 grid h-16 place-items-center rounded-lg bg-white ring-1 ring-border md:row-span-1 md:h-20"><StructureThumb p={p} className="h-auto max-h-[52px] w-auto max-w-[84px] text-[0] md:max-h-[66px]" /></span>
        <span className="min-w-0">
          <ProductName slug={p.slug} className="block font-semibold text-primary-ink group-hover:text-primary">{p.name}</ProductName>
          <span className="mt-1 flex flex-wrap items-center gap-2">
            {showCategory && <span className="text-[0.8rem] text-muted">{cat.shortName}{p.use === "veterinary" ? " · Veterinary" : ""}</span>}
            {!showCategory && p.use === "veterinary" && <span className="text-[0.8rem] text-muted">Veterinary</span>}
            {p.status && <Badge tone={p.status === "commercial" ? "green" : "amber"}>{STATUS_LABEL[p.status]}</Badge>}
          </span>
        </span>
        <span className="hidden font-mono text-sm text-text md:block">{p.cas ? p.cas : <span className="text-muted">—</span>}</span>
        <span className="col-span-2 col-start-2 line-clamp-2 text-[0.9rem] text-muted md:col-span-1 md:col-start-auto">
          <span className="font-mono text-xs md:hidden">{p.cas ? `CAS ${p.cas}` : ""}{p.cas && detail ? " · " : ""}</span>
          {detail}
        </span>
        <Icon name="arrowRight" size={18} className="col-start-3 row-start-1 shrink-0 text-muted transition-transform group-hover:translate-x-1 group-hover:text-primary md:col-start-5 md:row-start-auto" />
      </Link>
    </li>
  );
}

const RV_KEY = "synthokem:recently-viewed";

/** Records a product visit (detail pages). */
export function TrackRecentlyViewed({ category, slug }: { category: string; slug: string }) {
  useEffect(() => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(RV_KEY) ?? "[]");
      const key = `${category}/${slug}`;
      localStorage.setItem(RV_KEY, JSON.stringify([key, ...list.filter((k) => k !== key)].slice(0, 6)));
    } catch { /* storage unavailable — feature silently disabled */ }
  }, [category, slug]);
  return null;
}

export function RecentlyViewed() {
  const [items, setItems] = useState<Product[]>([]);
  useEffect(() => {
    try {
      const list: string[] = JSON.parse(localStorage.getItem(RV_KEY) ?? "[]");
      setItems(list.map((k) => PRODUCTS.find((p) => `${p.category}/${p.slug}` === k)).filter(Boolean) as Product[]);
    } catch { /* ignore */ }
  }, []);
  if (items.length === 0) return null;
  return (
    <section aria-labelledby="rv-title" className="mb-12 rounded-lg bg-surface p-5 sm:p-6">
      <h2 id="rv-title" className="eyebrow flex items-center gap-2 text-muted"><Icon name="history" size={15} /> Recently viewed</h2>
      <ul className="mt-4 flex flex-wrap gap-2">
        {items.map((p) => (
          <li key={p.category + p.slug}>
            <Link href={productHref(p)} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white px-4 text-sm font-medium text-primary-ink ring-1 ring-border hover:ring-primary">
              {p.name}
              {p.cas && <span className="font-mono text-xs text-muted">{p.cas}</span>}
            </Link>
          </li>
        ))}
      </ul>
    </section>
  );
}
