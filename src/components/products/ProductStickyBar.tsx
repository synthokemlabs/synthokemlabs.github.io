"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Icon } from "@/components/ui/Icon";
import { RollLabel } from "@/components/ui/primitives";

/**
 * Compact bar that slides in once the product hero has scrolled away, keeping the
 * product's identity and the enquiry action in reach on long specification pages.
 * Tablet/desktop only: phones already have the sticky Enquire / Call / Email bar.
 */
export function ProductStickyBar({ name, cas, enquiryHref }: { name: string; cas?: string; enquiryHref: string }) {
  const [show, setShow] = useState(false);

  useEffect(() => {
    const hero = document.querySelector("[data-product-hero]");
    const footer = document.querySelector("footer");
    if (!hero) return;
    let pastHero = false, atFooter = false;
    const sync = () => setShow(pastHero && !atFooter);
    const io = new IntersectionObserver((entries) => {
      for (const e of entries) {
        if (e.target === hero) pastHero = !e.isIntersecting && e.boundingClientRect.top < 0;
        else atFooter = e.isIntersecting;
      }
      sync();
    });
    io.observe(hero);
    if (footer) io.observe(footer);
    return () => io.disconnect();
  }, []);

  return (
    <div
      data-stickybar
      aria-hidden={!show}
      inert={!show}
      className={`fixed inset-x-0 top-[var(--header-h)] z-40 hidden border-b border-border bg-white shadow-[0_10px_30px_-24px_rgb(10_45_80/0.5)] transition-[transform,opacity,top] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] md:block ${show ? "translate-y-0 opacity-100" : "pointer-events-none -translate-y-full opacity-0"}`}
    >
      <div className="mx-auto flex max-w-[1320px] items-center justify-between gap-6 px-4 py-2.5 sm:px-8 lg:px-12">
        <p className="min-w-0 truncate">
          <span className="font-display font-semibold text-primary-ink">{name}</span>
          {cas && <span className="ml-3 font-mono text-xs text-muted">CAS {cas}</span>}
        </p>
        <div className="flex shrink-0 items-center gap-2">
          <Link href={enquiryHref} className="group inline-flex min-h-10 items-center gap-2 rounded-md bg-primary px-4 text-sm font-semibold text-white transition-colors hover:bg-accent-strong">
            <RollLabel>Request product information</RollLabel>
            <Icon name="arrowRight" size={15} className="arrow-nudge" />
          </Link>
        </div>
      </div>
    </div>
  );
}
