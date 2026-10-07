"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { MAIN_NAV, type NavItem } from "@/data/navigation";
import { SITE } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { SearchDialog } from "./SearchDialog";
import { RollLabel } from "@/components/ui/primitives";

export function Header() {
  const pathname = usePathname();
  const [open, setOpen] = useState<string | null>(null);
  const [scrolled, setScrolled] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [searchOpen, setSearchOpen] = useState(false);
  const [hidden, setHidden] = useState(false);
  const closeTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const navRef = useRef<HTMLElement>(null);
  const progressRef = useRef<HTMLDivElement>(null);
  const listRef = useRef<HTMLUListElement>(null);
  const [hovered, setHovered] = useState<string | null>(null);
  const [pill, setPill] = useState<{ x: number; w: number; on: boolean }>({ x: 0, w: 0, on: false });

  useEffect(() => {
    let raf = 0;
    let lastY = window.scrollY;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const y = window.scrollY;
        setScrolled(y > 12);
        // Hide while reading down the page, reveal on any upward scroll
        if (Math.abs(y - lastY) > 6) { setHidden(y > lastY && y > 240); lastY = y; }
        const max = document.documentElement.scrollHeight - window.innerHeight;
        progressRef.current?.style.setProperty("--scroll", String(max > 0 ? window.scrollY / max : 0));
      });
    };
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);

  useEffect(() => { setOpen(null); setMobileOpen(false); }, [pathname]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key.toLowerCase() === "k") { e.preventDefault(); setSearchOpen(true); }
      if (e.key === "Escape" && open) {
        navRef.current?.querySelector<HTMLButtonElement>(`[data-menu="${open}"]`)?.focus();
        setOpen(null);
      }
      if (e.key === "Escape" && mobileOpen) {
        setMobileOpen(false);
        document.querySelector<HTMLButtonElement>("[aria-controls=\"mobile-nav\"]")?.focus();
      }
    };
    const onDown = (e: MouseEvent) => { if (open && navRef.current && !navRef.current.contains(e.target as Node)) setOpen(null); };
    document.addEventListener("keydown", onKey);
    document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [open, mobileOpen]);

  useEffect(() => {
    document.documentElement.style.overflow = mobileOpen ? "hidden" : "";
    return () => { document.documentElement.style.overflow = ""; };
  }, [mobileOpen]);

  // Freeze smooth scrolling behind the mobile menu and the search dialog
  useEffect(() => {
    const lenis = (window as unknown as { __lenis?: { stop(): void; start(): void } }).__lenis;
    if (!lenis) return;
    if (mobileOpen || searchOpen) lenis.stop(); else lenis.start();
  }, [mobileOpen, searchOpen]);

  const cancelClose = () => { if (closeTimer.current) clearTimeout(closeTimer.current); };
  const scheduleClose = () => { cancelClose(); closeTimer.current = setTimeout(() => setOpen(null), 160); };
  const openSearch = useCallback(() => { setMobileOpen(false); setSearchOpen(true); }, []);

  const solid = scrolled || mobileOpen;
  const hide = hidden && !open && !mobileOpen && !searchOpen;
  // Let sticky sub-navigation move up into the space the header leaves
  useEffect(() => { document.documentElement.classList.toggle("header-is-hidden", hide); }, [hide]);
  const isActive = (href: string) => href !== "/" && pathname.startsWith(href.split("#")[0]);
  const groupActive = (g: NavItem) => isActive(g.href) || !!g.items?.some((i) => i.href !== "/products/" && isActive(i.href));
  const linkTone = solid ? "text-text/80 hover:text-primary" : "text-white/85 hover:text-white";

  // One soft pill glides between nav items on hover and rests under an open menu
  const pillTarget = hovered ?? open;
  useEffect(() => {
    const li = pillTarget ? listRef.current?.querySelector<HTMLElement>(`[data-nav="${pillTarget}"]`) : null;
    setPill((p) => (li ? { x: li.offsetLeft, w: li.offsetWidth, on: true } : { ...p, on: false }));
  }, [pillTarget]);

  return (
    <>
      <header
        style={{ viewTransitionName: "site-header" }}
        className={`fixed inset-x-0 top-0 z-50 transition-[background-color,box-shadow,color,transform] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${hide ? "header-hidden" : ""} ${
          solid ? "bg-white/[0.97] text-text shadow-[0_1px_0_var(--border),0_12px_30px_-24px_rgb(10_45_80/0.35)]" : "on-dark bg-transparent text-white"
        }`}
      >
        <div className="mx-auto flex h-[var(--header-h)] max-w-[1320px] items-center justify-between gap-6 px-4 sm:px-8 lg:px-12">
          <Link href="/" className="relative z-10 shrink-0 rounded-lg" aria-label={`${SITE.name} — home`}>
            <Logo tone={solid ? "dark" : "light"} />
          </Link>

          <nav ref={navRef} aria-label="Main" className="hidden lg:block" onMouseLeave={() => { scheduleClose(); setHovered(null); }} onMouseEnter={cancelClose}>
            <ul ref={listRef} className="relative flex items-center gap-0.5">
              <li
                aria-hidden="true"
                className={`pointer-events-none absolute left-0 top-1/2 h-11 -translate-y-1/2 rounded-full transition-[transform,width,opacity] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] ${solid ? "bg-surface" : "bg-white/10"} ${pill.on ? "opacity-100" : "opacity-0"}`}
                style={{ transform: `translate3d(${pill.x}px, -50%, 0)`, width: pill.w }}
              />
              {MAIN_NAV.map((g) => {
                const active = groupActive(g);
                if (!g.items) {
                  return (
                    <li key={g.label} data-nav={g.label} className="relative" onMouseEnter={() => { scheduleClose(); setHovered(g.label); }}>
                      <Link href={g.href} aria-current={active ? "page" : undefined} className={`relative inline-flex min-h-11 items-center rounded-full px-4 text-[0.92rem] font-medium transition-colors ${active ? (solid ? "text-primary" : "text-white") : linkTone}`}>
                        {g.label}
                        {active && <span aria-hidden="true" className="absolute inset-x-4 bottom-1 h-[2px] rounded-full bg-accent" />}
                      </Link>
                    </li>
                  );
                }
                const isOpen = open === g.label;
                return (
                  <li
                    key={g.label}
                    data-nav={g.label}
                    className="relative"
                    onMouseEnter={() => { cancelClose(); setOpen(g.label); setHovered(g.label); }}
                    onBlur={(e) => { if (isOpen && !e.currentTarget.contains(e.relatedTarget as Node)) setOpen(null); }}
                  >
                    <button
                      type="button"
                      data-menu={g.label}
                      aria-expanded={isOpen}
                      aria-controls={`menu-${g.label}`}
                      onClick={() => setOpen(isOpen ? null : g.label)}
                      onKeyDown={(e) => {
                        if (e.key === "ArrowDown") {
                          e.preventDefault(); setOpen(g.label);
                          // The panel is still `visibility: hidden` on the first frame of its fade-in, so retry until focus lands
                          let tries = 0;
                          const focusFirst = () => {
                            const a = document.querySelector<HTMLAnchorElement>(`#menu-${g.label} a`);
                            a?.focus();
                            if (a && document.activeElement !== a && ++tries < 12) requestAnimationFrame(focusFirst);
                          };
                          requestAnimationFrame(focusFirst);
                        }
                      }}
                      className={`relative inline-flex min-h-11 cursor-pointer items-center gap-1 rounded-full px-4 text-[0.92rem] font-medium transition-colors ${isOpen ? (solid ? "text-primary" : "text-white") : active ? (solid ? "text-primary" : "text-white") : linkTone}`}
                    >
                      {g.label}
                      <Icon name="chevronDown" size={15} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
                      {active && !isOpen && <span aria-hidden="true" className="absolute inset-x-4 bottom-1 h-[2px] rounded-full bg-accent" />}
                    </button>
                    <Dropdown group={g} open={isOpen} isActive={isActive} />
                  </li>
                );
              })}
            </ul>
          </nav>

          <div className="flex items-center gap-1.5">
            <button
              type="button"
              onClick={openSearch}
              className={`inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center gap-2 rounded-full px-3 text-sm transition-colors ${solid ? "hover:bg-surface" : "hover:bg-white/10"}`}
              aria-label="Search products and pages"
            >
              <Icon name="search" size={19} />
              <span className="hidden xl:inline">Search</span>
            </button>
            <Link
              href="/contact/"
              className={`group hidden min-h-11 items-center gap-2 rounded-md px-5 text-[0.88rem] font-semibold transition-colors sm:inline-flex ${
                solid ? "bg-primary text-white hover:bg-accent-strong" : "bg-white text-primary-ink hover:bg-primary-tint"
              }`}
            >
              <RollLabel>Contact us</RollLabel>
              <Icon name="arrowRight" size={16} className="arrow-nudge" />
            </Link>
            <button
              type="button"
              className="inline-flex min-h-11 min-w-11 cursor-pointer items-center justify-center rounded-full lg:hidden"
              aria-expanded={mobileOpen}
              aria-controls="mobile-nav"
              aria-label={mobileOpen ? "Close menu" : "Open menu"}
              onClick={() => setMobileOpen((v) => !v)}
            >
              <Icon name={mobileOpen ? "close" : "menu"} size={24} />
            </button>
          </div>
        </div>
        <div aria-hidden="true" ref={progressRef} className={`scroll-progress absolute inset-x-0 bottom-0 h-[2px] bg-accent transition-opacity ${scrolled ? "opacity-100" : "opacity-0"}`} />
      </header>
      {/* Outside <header>: its backdrop-filter would otherwise become the containing block for this fixed panel */}
      {mobileOpen && <MobileNav onSearch={openSearch} isActive={isActive} />}
      <SearchDialog open={searchOpen} onClose={() => setSearchOpen(false)} />
    </>
  );
}

function Dropdown({ group, open, isActive }: { group: NavItem; open: boolean; isActive: (h: string) => boolean }) {
  const items = group.items!;
  const wide = items.length > 4;
  return (
    <div
      id={`menu-${group.label}`}
      className={`absolute left-1/2 top-full -translate-x-1/2 pt-3 transition-[opacity,translate,visibility] duration-300 ${wide ? "w-[560px]" : "w-[400px]"} ${
        open ? "visible translate-y-0 opacity-100" : "invisible -translate-y-2 opacity-0"
      }`}
    >
      <div className="overflow-hidden rounded-lg bg-white p-2 text-text shadow-[0_30px_60px_-20px_rgb(10_45_80/0.35)] ring-1 ring-border">
        <ul className={`grid gap-1 ${wide ? "grid-cols-2" : "grid-cols-1"}`}>
          {items.map((l, i) => (
            <li key={l.href + l.label} className={open ? "hero-in" : ""} style={{ "--d": `${i * 35}ms`, animationDuration: ".45s" } as CSSProperties}>
              <Link
                href={l.href}
                aria-current={isActive(l.href) && l.href !== "/products/" ? "page" : undefined}
                className="group flex items-center gap-3 rounded-lg p-3 transition-colors hover:bg-surface"
              >
                <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white">
                  <Icon name={l.icon ?? "arrowRight"} size={18} />
                </span>
                <span className="min-w-0">
                  <span className="block text-[0.93rem] font-semibold text-primary-ink">{l.label}</span>
                  {l.description && <span className="block truncate text-[0.8rem] text-muted">{l.description}</span>}
                </span>
              </Link>
            </li>
          ))}
        </ul>
        {group.footer && (
          <a href={group.footer.href} target={group.footer.external ? "_blank" : undefined} rel="noopener" className="mt-1 flex items-center justify-between rounded-lg bg-surface px-4 py-3 text-sm font-semibold text-primary hover:bg-primary-tint">
            {group.footer.label}<Icon name="download" size={16} />
          </a>
        )}
      </div>
    </div>
  );
}

function MobileNav({ onSearch, isActive }: { onSearch: () => void; isActive: (h: string) => boolean }) {
  const [expanded, setExpanded] = useState<string | null>(null);
  return (
    <div id="mobile-nav" data-lenis-prevent className="page-enter fixed inset-x-0 bottom-0 top-[var(--header-h)] z-50 overflow-y-auto overscroll-contain border-t border-border bg-white text-text lg:hidden" style={{ animationDuration: ".35s" }}>
      <div className="px-4 pb-10 pt-4 sm:px-8">
        <button type="button" onClick={onSearch} className="flex min-h-12 w-full cursor-pointer items-center gap-3 rounded-md bg-surface px-5 text-left text-muted">
          <Icon name="search" size={18} /> Search products or CAS no.
        </button>
        <nav aria-label="Mobile" className="mt-3">
          <ul>
            {MAIN_NAV.map((g) => {
              const isOpen = expanded === g.label;
              if (!g.items) {
                return (
                  <li key={g.label} className="border-b border-border">
                    <Link href={g.href} className="flex min-h-14 items-center justify-between font-display text-lg font-semibold text-primary-ink">{g.label}<Icon name="arrowRight" size={18} className="text-muted" /></Link>
                  </li>
                );
              }
              return (
                <li key={g.label} className="border-b border-border">
                  <button type="button" aria-expanded={isOpen} onClick={() => setExpanded(isOpen ? null : g.label)} className="flex min-h-14 w-full cursor-pointer items-center justify-between font-display text-lg font-semibold text-primary-ink">
                    {g.label}
                    <Icon name="chevronDown" size={20} className={`transition-transform ${isOpen ? "rotate-180" : ""}`} />
                  </button>
                  {isOpen && (
                    <ul className="grid gap-1 pb-4">
                      {g.items.map((l) => (
                        <li key={l.href + l.label}>
                          <Link href={l.href} aria-current={isActive(l.href) && l.href !== "/products/" ? "page" : undefined} className="flex min-h-12 items-center gap-3 rounded-lg px-2 hover:bg-surface">
                            <span className="grid h-9 w-9 place-items-center rounded-lg bg-primary-tint text-primary"><Icon name={l.icon ?? "arrowRight"} size={16} /></span>
                            <span className="font-medium text-text">{l.label}</span>
                          </Link>
                        </li>
                      ))}
                    </ul>
                  )}
                </li>
              );
            })}
          </ul>
        </nav>
        <div className="mt-8 grid grid-cols-2 gap-3">
          <a href={SITE.phone.href} className="flex min-h-12 items-center justify-center gap-2 rounded-md font-semibold text-primary ring-1 ring-border-strong"><Icon name="phone" size={17} /> Call</a>
          <a href={`mailto:${SITE.email}`} className="flex min-h-12 items-center justify-center gap-2 rounded-md font-semibold text-primary ring-1 ring-border-strong"><Icon name="mail" size={17} /> Email</a>
          <Link href="/contact/" className="col-span-2 flex min-h-12 items-center justify-center gap-2 rounded-md bg-primary font-semibold text-white">Contact us <Icon name="arrowRight" size={17} /></Link>
        </div>
      </div>
    </div>
  );
}
