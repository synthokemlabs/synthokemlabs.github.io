"use client";

import { useEffect, useRef, useState, type MouseEvent } from "react";

type Lenis = { scrollTo(y: number, o?: { immediate?: boolean }): void };

/**
 * Sticky "On this page" bar. Highlights the section currently in view and
 * shows progress through the page, so long pages are easy to scan and jump around.
 */
export function PageNav({ items }: { items: { id: string; label: string }[] }) {
  const [active, setActive] = useState(items[0]?.id);
  const navRef = useRef<HTMLElement>(null);
  const railRef = useRef<HTMLUListElement>(null);

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => e.isIntersecting && setActive(e.target.id)),
      { rootMargin: "-40% 0px -55% 0px" },
    );
    items.forEach((i) => { const el = document.getElementById(i.id); if (el) io.observe(el); });
    return () => io.disconnect();
  }, [items]);

  // Keep the current item visible in the horizontal rail on narrow screens (without scrolling the page)
  useEffect(() => {
    const rail = railRef.current;
    const link = rail?.querySelector<HTMLElement>(`[data-id="${active}"]`);
    if (!rail || !link || rail.scrollWidth <= rail.clientWidth) return;
    const left = link.offsetLeft - rail.clientWidth / 2 + link.offsetWidth / 2;
    rail.scrollTo({ left: Math.max(0, left), behavior: "smooth" });
  }, [active]);

  // Land each section just below the sticky bars. Scrolling up brings the site header back, so allow for it too.
  function jump(e: MouseEvent<HTMLAnchorElement>, id: string) {
    const target = document.getElementById(id);
    if (!target) return;
    e.preventDefault();
    const top = target.getBoundingClientRect().top + window.scrollY;
    const header = parseFloat(getComputedStyle(document.documentElement).getPropertyValue("--header-h")) || 76;
    const offset = (navRef.current?.offsetHeight ?? 56) + 24 + (top < window.scrollY ? header : 0);
    const y = Math.max(0, top - offset);
    const lenis = (window as unknown as { __lenis?: Lenis }).__lenis;
    const reduce = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (lenis) lenis.scrollTo(y, { immediate: reduce });
    else window.scrollTo({ top: y, behavior: reduce ? "auto" : "smooth" });
    history.replaceState(null, "", `#${id}`);
    setActive(id);
    target.setAttribute("tabindex", "-1");
    target.focus({ preventScroll: true });
  }

  const idx = Math.max(0, items.findIndex((i) => i.id === active));

  return (
    <nav ref={navRef} aria-label="On this page" data-pagenav className="sticky top-[var(--header-h)] z-30 transition-[top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] border-b border-border bg-white/[0.97] shadow-[0_8px_24px_-20px_rgb(10_45_80/0.4)]">
      <div className="mx-auto flex max-w-[1320px] items-center gap-4 px-4 sm:px-8 lg:px-12">
        <span className="hidden shrink-0 text-xs font-semibold uppercase tracking-[0.12em] text-muted md:block">On this page</span>
        <ul ref={railRef} className="rail flex flex-1 gap-1 overflow-x-auto py-2">
          {items.map((i) => {
            const on = i.id === active;
            return (
              <li key={i.id}>
                <a
                  href={`#${i.id}`}
                  data-id={i.id}
                  onClick={(e) => jump(e, i.id)}
                  aria-current={on ? "true" : undefined}
                  className={`inline-flex min-h-10 items-center whitespace-nowrap rounded-full px-4 text-sm font-medium transition-colors duration-300 ${on ? "bg-primary text-white" : "text-muted hover:bg-surface hover:text-primary"}`}
                >
                  {i.label}
                </a>
              </li>
            );
          })}
        </ul>
        <span className="hidden shrink-0 font-mono text-xs text-muted sm:block">{String(idx + 1).padStart(2, "0")} / {String(items.length).padStart(2, "0")}</span>
      </div>
    </nav>
  );
}
