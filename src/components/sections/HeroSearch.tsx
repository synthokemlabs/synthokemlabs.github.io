"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useId, useLayoutEffect, useMemo, useRef, useState, type CSSProperties, type FormEvent } from "react";
import { CATEGORIES, PRODUCTS, getCategory, productHref, structureSrc, type CategorySlug, type Product } from "@/data/products";
import { searchPages, searchProducts } from "@/lib/search";
import { Icon } from "@/components/ui/Icon";

/*
 * Product finder for the home hero, modelled on scientific catalogue search (a scope menu, name / CAS /
 * use matching, suggestions grouped by type with the matched letters in bold) with keyboard support
 * ("/" to focus, ↑ ↓ to move, ↵ to open, Esc to close). The panels open upwards when the bar sits low in the
 * viewport, as the hero search does on most screens.
 */
const POPULAR = ["Guaifenesin", "Methocarbamol", "532-03-6", "Ranolazine", "Cyclodextrin"];
type Scope = "all" | CategorySlug;
const COUNTS = Object.fromEntries(CATEGORIES.map((c) => [c.slug, PRODUCTS.filter((p) => p.category === c.slug).length]));

/** The query's first occurrence in bold; the rest of the name in regular weight. */
function Match({ text, q }: { text: string; q: string }) {
  const i = q ? text.toLowerCase().indexOf(q.toLowerCase()) : -1;
  if (i < 0) return <>{text}</>;
  return <>{text.slice(0, i)}<b className="font-semibold text-primary-ink">{text.slice(i, i + q.length)}</b>{text.slice(i + q.length)}</>;
}

export function HeroSearch() {
  const router = useRouter();
  const rootRef = useRef<HTMLFormElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);
  const barRef = useRef<HTMLDivElement>(null);
  const [q, setQ] = useState("");
  const [scope, setScope] = useState<Scope>("all");
  const [open, setOpen] = useState(false);
  const [scopeOpen, setScopeOpen] = useState(false);
  const [active, setActive] = useState(-1);
  const [up, setUp] = useState(false);
  const [room, setRoom] = useState(440);
  const listId = useId();

  const term = q.trim();
  const pool = useMemo(() => (scope === "all" ? PRODUCTS : PRODUCTS.filter((p) => p.category === scope)), [scope]);
  const all = useMemo(() => (term ? searchProducts(term, pool) : []), [term, pool]);
  const products = all.slice(0, 5);
  const pages = term && scope === "all" ? searchPages(term).slice(0, 2) : [];
  const items: { href: string }[] = [...products.map((p) => ({ href: productHref(p) })), ...pages];
  const scopeLabel = scope === "all" ? "All products" : getCategory(scope)!.shortName;

  // "/" focuses the search from anywhere on the page; a click outside closes the panels
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const t = e.target as HTMLElement;
      if (e.key !== "/" || e.metaKey || e.ctrlKey || e.altKey || t.closest("input, textarea, select, [contenteditable=true], dialog")) return;
      e.preventDefault();
      inputRef.current?.focus();
    };
    const onDown = (e: MouseEvent) => { if (!rootRef.current?.contains(e.target as Node)) { setOpen(false); setScopeOpen(false); } };
    window.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => { window.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, []);

  // Open below when there is room, otherwise above (clear of the sticky header), never taller than the space
  const place = useCallback(() => {
    const r = barRef.current?.getBoundingClientRect();
    if (!r) return;
    const top = (document.querySelector("header")?.getBoundingClientRect().bottom ?? 0) + 12;
    const below = window.innerHeight - r.bottom - 16;
    const above = r.top - top - 8;
    const flip = below < 340 && above > below;
    setUp(flip);
    setRoom(Math.min(440, Math.max(180, Math.floor(flip ? above : below))));
  }, []);
  const shown = open || scopeOpen;
  useLayoutEffect(() => { if (shown) place(); }, [shown, place]);
  useEffect(() => {
    if (!shown) return;
    window.addEventListener("resize", place);
    window.addEventListener("scroll", place, { passive: true });
    return () => { window.removeEventListener("resize", place); window.removeEventListener("scroll", place); };
  }, [shown, place]);

  const resultsUrl = () => {
    const params = new URLSearchParams();
    if (term) params.set("q", term);
    if (scope !== "all") params.set("category", scope);
    const s = params.toString();
    return `/products/${s ? `?${s}` : ""}`;
  };
  function submit(e?: FormEvent) {
    e?.preventDefault();
    router.push(active >= 0 && items[active] ? items[active].href : resultsUrl());
  }
  const pick = (t: string) => { setQ(t); setActive(-1); setOpen(true); inputRef.current?.focus(); };

  return (
    <form ref={rootRef} role="search" onSubmit={submit} className="relative w-full max-w-2xl" aria-label="Product search">
      <div className="relative">
        <div ref={barRef} className={`hs-bar flex items-stretch rounded-xl bg-white p-1.5 ${open ? "is-open" : ""}`}>
          {/* Scope */}
          <div className="relative hidden sm:block">
            <button
              type="button"
              aria-haspopup="listbox"
              aria-expanded={scopeOpen}
              onClick={() => { setScopeOpen((o) => !o); setOpen(false); }}
              className="flex h-full min-w-[9.5rem] cursor-pointer items-center justify-between gap-2 rounded-lg px-3.5 text-left text-[0.88rem] font-semibold text-primary-ink transition-colors hover:bg-surface"
            >
              <span><span className="block text-[0.66rem] font-semibold uppercase tracking-[0.12em] text-muted">Search in</span>{scopeLabel}</span>
              <Icon name="chevronDown" size={15} className={`text-muted transition-transform duration-300 ${scopeOpen ? "rotate-180" : ""}`} />
            </button>
            {scopeOpen && (
              <ul role="listbox" aria-label="Search in" className={`hs-pop absolute left-0 z-40 w-80 rounded-xl bg-white p-1.5 text-text shadow-[0_24px_60px_-20px_rgb(3_25_50/0.45)] ring-1 ring-border ${up ? "is-up bottom-full mb-3" : "top-full mt-3"}`}>
                {(["all", ...CATEGORIES.map((c) => c.slug)] as Scope[]).map((s) => (
                  <li key={s} role="option" aria-selected={s === scope}>
                    <button type="button" onClick={() => { setScope(s); setScopeOpen(false); setActive(-1); inputRef.current?.focus(); if (term) setOpen(true); }} className={`flex w-full cursor-pointer items-center justify-between gap-3 rounded-lg px-3 py-2.5 text-left text-[0.9rem] transition-colors ${s === scope ? "bg-primary-tint font-semibold text-primary-ink" : "hover:bg-surface"}`}>
                      <span>{s === "all" ? "All products" : getCategory(s)!.name}</span>
                      <span className="font-mono text-[0.72rem] text-muted">{s === "all" ? PRODUCTS.length : COUNTS[s]}</span>
                    </button>
                  </li>
                ))}
              </ul>
            )}
          </div>
          <span aria-hidden="true" className="my-2 hidden w-px bg-border sm:block" />

          {/* Query */}
          <label htmlFor="hero-search" className="flex min-w-0 flex-1 cursor-text items-center gap-3 px-3.5">
            <Icon name="search" size={18} className="shrink-0 text-muted" />
            <span className="sr-only">Search products by name, CAS number or therapeutic use</span>
            <input
              ref={inputRef}
              id="hero-search"
              value={q}
              onChange={(e) => { setQ(e.target.value); setActive(-1); setOpen(true); }}
              onFocus={() => { setOpen(true); setScopeOpen(false); }}
              onKeyDown={(e) => {
                if (e.key === "ArrowDown") { e.preventDefault(); setOpen(true); setActive((a) => Math.min(a + 1, items.length - 1)); }
                if (e.key === "ArrowUp") { e.preventDefault(); setActive((a) => Math.max(a - 1, -1)); }
                if (e.key === "Escape") { if (q) setQ(""); else { setOpen(false); inputRef.current?.blur(); } }
              }}
              role="combobox"
              aria-expanded={open}
              aria-controls={listId}
              aria-autocomplete="list"
              aria-activedescendant={active >= 0 ? `${listId}-${active}` : undefined}
              autoComplete="off"
              spellCheck={false}
              placeholder="Product name or CAS number"
              className="min-h-[3.25rem] min-w-0 flex-1 bg-transparent text-base text-text outline-none placeholder:text-muted/80"
            />
            {q ? (
              <button type="button" onClick={() => { setQ(""); setActive(-1); inputRef.current?.focus(); }} aria-label="Clear search" className="grid h-7 w-7 shrink-0 cursor-pointer place-items-center rounded-full text-muted transition-colors hover:bg-surface hover:text-primary-ink">
                <Icon name="close" size={15} />
              </button>
            ) : (
              <kbd className="hidden shrink-0 rounded-md border border-border px-1.5 py-0.5 font-mono text-[0.7rem] text-muted md:inline" title="Press / to search">/</kbd>
            )}
          </label>

          <button type="submit" className="group inline-flex shrink-0 cursor-pointer items-center gap-2 rounded-lg bg-primary px-4 text-[0.92rem] font-semibold text-white transition-colors hover:bg-primary-dark sm:px-5">
            <span className="hidden sm:inline">Search</span>
            <Icon name="arrowRight" size={17} className="transition-transform duration-300 group-hover:translate-x-0.5" />
            <span className="sr-only sm:hidden">Search</span>
          </button>
        </div>

        {/* Suggestions */}
        {open && (
          <div id={listId} data-lenis-prevent style={{ maxHeight: room }} className={`hs-pop absolute inset-x-0 z-30 flex flex-col overflow-hidden rounded-xl bg-white text-text shadow-[0_30px_70px_-24px_rgb(3_25_50/0.55)] ring-1 ring-border ${up ? "is-up bottom-full mb-2" : "top-full mt-2"}`}>
            {!term ? (
              <div className="grid min-h-0 grid-cols-1 overflow-y-auto overscroll-contain sm:grid-cols-2">
                <div className="p-2">
                  <p className="px-3 pb-1 pt-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">Popular searches</p>
                  {POPULAR.map((t, i) => (
                    <button key={t} type="button" onClick={() => pick(t)} className="hs-row flex w-full cursor-pointer items-center gap-3 rounded-lg px-3 py-2 text-left text-[0.92rem] text-primary-ink transition-colors hover:bg-surface" style={{ "--i": i } as CSSProperties}>
                      <Icon name="search" size={14} className="text-muted" />{t}
                    </button>
                  ))}
                </div>
                <div className="border-t border-border p-2 sm:border-l sm:border-t-0">
                  <p className="px-3 pb-1 pt-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">Browse by category</p>
                  {CATEGORIES.map((c, i) => (
                    <Link key={c.slug} href={`/products/${c.slug}/`} className="hs-row group flex items-center justify-between gap-3 rounded-lg px-3 py-2 text-[0.92rem] text-primary-ink transition-colors hover:bg-surface" style={{ "--i": i } as CSSProperties}>
                      <span>{c.name}</span>
                      <span className="flex items-center gap-2 font-mono text-[0.72rem] text-muted">{COUNTS[c.slug]}<Icon name="arrowRight" size={13} className="opacity-0 transition-opacity group-hover:opacity-100" /></span>
                    </Link>
                  ))}
                </div>
              </div>
            ) : items.length === 0 ? (
              <div className="px-5 py-6">
                <p className="font-semibold text-primary-ink">No products match “{term}”{scope !== "all" ? ` in ${scopeLabel}` : ""}.</p>
                <p className="mt-1 text-sm text-muted">Check the spelling, try a CAS number, or <Link href={`/enquiry/?type=technical&product=${encodeURIComponent(term)}`} className="font-semibold text-primary underline-offset-2 hover:underline">ask us about it</Link> — we may be able to make it.</p>
              </div>
            ) : (
              <>
                <ul role="listbox" aria-label="Suggestions" className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2">
                  {products.length > 0 && <li role="presentation" className="px-3 pb-1 pt-2 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">Products</li>}
                  {products.map((p: Product, i) => (
                    <li key={p.category + p.slug} id={`${listId}-${i}`} role="option" aria-selected={i === active} className="hs-row" style={{ "--i": i } as CSSProperties}>
                      <Link href={productHref(p)} tabIndex={-1} onMouseEnter={() => setActive(i)} className={`flex items-center gap-3.5 rounded-lg px-3 py-2.5 transition-colors ${i === active ? "bg-primary-tint" : ""}`}>
                        <span className="grid h-11 w-14 shrink-0 place-items-center rounded-md bg-surface ring-1 ring-border">
                          {structureSrc(p) ? (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img src={structureSrc(p)} alt="" className="h-auto max-h-[34px] w-auto max-w-[46px] object-contain mix-blend-multiply" />
                          ) : <Icon name="flask" size={16} className="text-muted" />}
                        </span>
                        <span className="min-w-0 flex-1">
                          <span className="block truncate text-[0.95rem] text-text"><Match text={p.name} q={term} /></span>
                          <span className="block truncate font-mono text-[0.72rem] text-muted">
                            {getCategory(p.category)!.shortName}{p.cas ? <> · CAS <Match text={p.cas} q={term} /></> : null}{p.therapeuticCategory ? ` · ${p.therapeuticCategory}` : ""}
                          </span>
                        </span>
                        <span className={`hidden shrink-0 rounded-full px-2 py-0.5 text-[0.66rem] font-semibold sm:inline ${p.status === "under-development" ? "bg-[#fff4e0] text-[#8a5a00]" : "bg-[#e7f5ee] text-[#15795a]"}`}>
                          {p.status === "under-development" ? "In development" : "Commercial"}
                        </span>
                        <Icon name={i === active ? "arrowRight" : "chevronRight"} size={15} className={`shrink-0 ${i === active ? "text-primary" : "text-muted/60"}`} />
                      </Link>
                    </li>
                  ))}
                  {pages.length > 0 && <li role="presentation" className="mt-1 border-t border-border px-3 pb-1 pt-3 text-[0.66rem] font-semibold uppercase tracking-[0.14em] text-muted">Pages</li>}
                  {pages.map((pg, j) => {
                    const i = products.length + j;
                    return (
                      <li key={pg.href} id={`${listId}-${i}`} role="option" aria-selected={i === active} className="hs-row" style={{ "--i": i } as CSSProperties}>
                        <Link href={pg.href} tabIndex={-1} onMouseEnter={() => setActive(i)} className={`flex items-center gap-3.5 rounded-lg px-3 py-2.5 transition-colors ${i === active ? "bg-primary-tint" : ""}`}>
                          <span className="grid h-9 w-14 shrink-0 place-items-center text-muted"><Icon name="file" size={16} /></span>
                          <span className="min-w-0 flex-1"><span className="block truncate text-[0.95rem] text-primary-ink">{pg.title}</span><span className="block text-[0.72rem] text-muted">{pg.section}</span></span>
                          <Icon name="chevronRight" size={15} className="shrink-0 text-muted/60" />
                        </Link>
                      </li>
                    );
                  })}
                </ul>
                <div className="flex shrink-0 items-center justify-between gap-4 border-t border-border bg-surface px-5 py-3 text-[0.8rem]">
                  <Link href={resultsUrl()} className="group inline-flex items-center gap-1.5 font-semibold text-primary">
                    See all {all.length} {all.length === 1 ? "result" : "results"} for “{term}”<Icon name="arrowRight" size={14} className="transition-transform group-hover:translate-x-0.5" />
                  </Link>
                  <span className="hidden items-center gap-3 text-muted md:flex">
                    <span className="flex items-center gap-1"><kbd className="hs-kbd">↑</kbd><kbd className="hs-kbd">↓</kbd> move</span>
                    <span className="flex items-center gap-1"><kbd className="hs-kbd">↵</kbd> open</span>
                    <span className="flex items-center gap-1"><kbd className="hs-kbd">esc</kbd> close</span>
                  </span>
                </div>
              </>
            )}
          </div>
        )}
      </div>

      {/* Popular searches, one click away */}
      <p className="mt-4 flex flex-wrap items-center gap-x-2.5 gap-y-2 text-[0.8rem] text-on-dark-muted">
        <span className="mr-0.5">Popular:</span>
        {POPULAR.slice(0, 4).map((t) => (
          <button key={t} type="button" onClick={() => pick(t)} className="inline-flex min-h-9 cursor-pointer items-center rounded-full px-3.5 font-medium text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white hover:text-primary-ink">{t}</button>
        ))}
      </p>
    </form>
  );
}
