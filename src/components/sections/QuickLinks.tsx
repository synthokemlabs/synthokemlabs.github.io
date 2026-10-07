"use client";

import Link from "next/link";
import { useEffect, useRef, useState, type ReactNode } from "react";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/client";

const PATHS: { title: string; body: string; href: string; img: string; alt: string }[] = [
  { title: "Source a product", body: "Search 46 APIs, intermediates and chemicals by name or CAS number, then request a quote.", href: "/products/", img: "materials-store", alt: "Drums being moved in the materials store" },
  { title: "Check quality & compliance", body: "Our quality system, approvals and the regulatory status of each product.", href: "/quality/", img: "qc-analyst", alt: "Quality control analyst at a laboratory instrument" },
  { title: "Partner with us", body: "Process chemistry and manufacturing capabilities for development projects.", href: "/capabilities/", img: "reactor-operator", alt: "Operator in protective equipment at a reactor" },
  { title: "Build your career", body: "Join the team that has powered Synthokem’s growth for over four decades.", href: "/careers/", img: "lab-team", alt: "Chemists at work in the laboratory" },
];

/**
 * "Start here": numbered destinations on the right; on desktop, a framed photo on the left
 * previews whichever row is hovered or focused, drifting slightly with the pointer.
 */
export function QuickLinks({ heading }: { heading: ReactNode }) {
  const frameRef = useRef<HTMLDivElement>(null);
  const [active, setActive] = useState(0);

  // Gentle pointer parallax inside the frame (desktop, fine pointer, motion allowed)
  useEffect(() => {
    const frame = frameRef.current;
    if (!frame || !window.matchMedia("(hover: hover) and (pointer: fine) and (prefers-reduced-motion: no-preference)").matches) return;
    let x = 0, y = 0, tx = 0, ty = 0, raf = 0;
    const onMove = (e: PointerEvent) => {
      tx = (e.clientX / window.innerWidth - 0.5) * -18;
      ty = (e.clientY / window.innerHeight - 0.5) * -14;
    };
    const loop = () => {
      x += (tx - x) * 0.06; y += (ty - y) * 0.06;
      frame.style.setProperty("--qx", `${x.toFixed(2)}px`);
      frame.style.setProperty("--qy", `${y.toFixed(2)}px`);
      raf = requestAnimationFrame(loop);
    };
    const io = new IntersectionObserver(([e]) => {
      cancelAnimationFrame(raf);
      if (e.isIntersecting) raf = requestAnimationFrame(loop);
    });
    io.observe(frame);
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => { io.disconnect(); cancelAnimationFrame(raf); window.removeEventListener("pointermove", onMove); };
  }, []);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12">
      <div className="lg:col-span-5">
        {heading}
        <Reveal variant="image" delay={150} className="relative mt-12 hidden aspect-[4/3] overflow-hidden rounded-lg bg-primary-ink lg:block">
          <div ref={frameRef} className="absolute inset-0" aria-hidden="true">
            {PATHS.map((p, i) => (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                key={p.img}
                src={`/images/${p.img}-640.webp`}
                alt=""
                loading="lazy"
                className={`qpeek absolute inset-0 h-full w-full object-cover ${i === active ? "is-current" : ""}`}
              />
            ))}
            <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-primary-ink/80 to-transparent px-5 pb-4 pt-12 text-sm font-medium text-white">
              <span className="font-mono text-xs text-on-dark-muted">{String(active + 1).padStart(2, "0")}</span>
              <span className="ml-3">{PATHS[active].title}</span>
            </span>
          </div>
        </Reveal>
      </div>
      <ol className="border-t border-border-strong lg:col-span-7">
        {PATHS.map((p, i) => (
          <Reveal as="li" key={p.title} delay={i * 80} className="border-b border-border">
            <Link
              href={p.href}
              onMouseEnter={() => setActive(i)}
              onFocus={() => setActive(i)}
              className="group grid grid-cols-[2.5rem_1fr_auto] items-start gap-x-4 py-7 transition-[padding] duration-500 ease-[cubic-bezier(0.22,1,0.36,1)] sm:grid-cols-[3.5rem_1fr_auto] sm:py-8 lg:hover:pl-3"
            >
              <span className={`pt-1.5 font-mono text-sm transition-colors duration-300 group-hover:text-accent-strong ${i === active ? "lg:text-accent-strong" : "text-muted"}`}>{String(i + 1).padStart(2, "0")}</span>
              <span>
                <span className="font-display text-xl font-semibold text-primary-ink sm:text-2xl"><span className="link-u">{p.title}</span></span>
                <span className="mt-2 block max-w-[46ch] text-[0.95rem] leading-relaxed text-muted">{p.body}</span>
              </span>
              <span className="mt-1 grid h-10 w-10 place-items-center rounded-full ring-1 ring-border transition-[background-color,color,box-shadow] duration-300 group-hover:bg-primary group-hover:text-white group-hover:ring-primary">
                <Icon name="arrowRight" size={16} className="arrow-nudge" />
              </span>
            </Link>
          </Reveal>
        ))}
      </ol>
    </div>
  );
}
