"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useEffect, useRef, useState } from "react";
import { SITE } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { CopyButton } from "@/components/ui/client";

/** Desktop: discreet "Let's talk" launcher. Mobile: sticky Enquire / Call / Email bar after the hero. */
export function FloatingContact() {
  const pathname = usePathname();
  const [visible, setVisible] = useState(false);
  const [open, setOpen] = useState(false);
  const panelRef = useRef<HTMLDivElement>(null);
  const hidden = pathname.startsWith("/enquiry") || pathname.startsWith("/contact");
  // On a product page, "Enquire" opens the form with that product already selected
  const productSlug = pathname.match(/^\/products\/[^/]+\/([^/]+)\/?$/)?.[1];
  const enquireHref = productSlug ? `/enquiry/?product=${productSlug}` : "/enquiry/";

  useEffect(() => {
    let atFooter = false;
    const onScroll = () => setVisible(window.scrollY > 520 && !atFooter);
    const footer = document.querySelector("footer");
    const io = footer ? new IntersectionObserver(([e]) => { atFooter = e.isIntersecting; onScroll(); }, { rootMargin: "0px 0px -120px 0px" }) : null;
    if (footer && io) io.observe(footer);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); io?.disconnect(); };
  }, [pathname]);
  useEffect(() => setOpen(false), [pathname]);
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => e.key === "Escape" && setOpen(false);
    const onDown = (e: MouseEvent) => { if (panelRef.current && !panelRef.current.contains(e.target as Node)) setOpen(false); };
    document.addEventListener("keydown", onKey); document.addEventListener("mousedown", onDown);
    return () => { document.removeEventListener("keydown", onKey); document.removeEventListener("mousedown", onDown); };
  }, [open]);

  if (hidden) return null;

  return (
    <>
      {/* Desktop */}
      <div ref={panelRef} className={`no-print fixed bottom-6 right-6 z-40 hidden transition-all duration-500 lg:block ${visible ? "translate-y-0 opacity-100" : "pointer-events-none translate-y-4 opacity-0"}`}>
        {open && (
          <div id="talk-panel" role="dialog" aria-label="Contact Synthokem" className="hero-in absolute bottom-16 right-0 w-80 rounded-lg bg-white p-2 text-text shadow-[0_24px_60px_-20px_rgb(10_45_80/0.45)] ring-1 ring-border" style={{ animationDuration: ".35s" }}>
            <p className="px-3 pb-2 pt-3 text-sm text-muted">{SITE.responseTime}</p>
            <Link href={enquireHref} className="flex min-h-12 items-center justify-between rounded-lg px-3 font-semibold text-primary-ink hover:bg-surface">Product enquiry <Icon name="arrowRight" size={16} /></Link>
            <Link href="/contact/?intent=partner" className="flex min-h-12 items-center justify-between rounded-lg px-3 font-semibold text-primary-ink hover:bg-surface">Partner with us <Icon name="arrowRight" size={16} /></Link>
            <a href={SITE.phone.href} className="flex min-h-12 items-center gap-3 rounded-lg px-3 text-primary-ink hover:bg-surface"><Icon name="phone" size={16} className="text-accent-strong" />{SITE.phone.display}</a>
            <div className="flex items-center justify-between rounded-lg pl-3 hover:bg-surface">
              <a href={`mailto:${SITE.email}`} className="flex min-h-12 items-center gap-3 text-primary-ink"><Icon name="mail" size={16} className="text-accent-strong" />{SITE.email}</a>
              <CopyButton text={SITE.email} label="Email address" />
            </div>
          </div>
        )}
        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          aria-expanded={open}
          aria-controls="talk-panel"
          className="group flex min-h-12 cursor-pointer items-center gap-2.5 rounded-full bg-primary py-2 pl-3 pr-5 text-sm font-semibold text-white shadow-[0_12px_32px_-12px_rgb(10_45_80/0.7)] transition-colors hover:bg-primary-dark"
        >
          <span className="grid h-8 w-8 place-items-center rounded-full bg-white/10"><Icon name={open ? "close" : "message"} size={16} /></span>
          Let’s talk
        </button>
      </div>

      {/* Mobile sticky action bar */}
      <nav
        aria-label="Quick contact"
        className={`no-print fixed inset-x-0 bottom-0 z-40 grid grid-cols-3 border-t border-border bg-white/95 pb-[env(safe-area-inset-bottom)] backdrop-blur-md transition-transform duration-500 lg:hidden ${visible ? "translate-y-0" : "translate-y-full"}`}
      >
        <Link href={enquireHref} className="flex min-h-14 flex-col items-center justify-center gap-0.5 bg-primary text-[0.78rem] font-semibold text-white">
          <Icon name="message" size={18} /> Enquire
        </Link>
        <a href={SITE.phone.href} className="flex min-h-14 flex-col items-center justify-center gap-0.5 text-[0.78rem] font-semibold text-primary">
          <Icon name="phone" size={18} /> Call
        </a>
        <a href={`mailto:${SITE.email}`} className="flex min-h-14 flex-col items-center justify-center gap-0.5 border-l border-border text-[0.78rem] font-semibold text-primary">
          <Icon name="mail" size={18} /> Email
        </a>
      </nav>
    </>
  );
}
