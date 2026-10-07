"use client";

import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Icon, type IconName } from "@/components/ui/Icon";

export const VALUE_CHAIN: { title: string; short: string; body: string; icon: IconName; href: string }[] = [
  { title: "Process chemistry & R&D", short: "R&D", icon: "flask", href: "/capabilities/", body: "Evolving process chemistry and R&D capability — producing cutting-edge intermediates for new as well as off-patent APIs." },
  { title: "Manufacturing", short: "Make", icon: "factory", href: "/capabilities/manufacturing/", body: "Three integrated manufacturing units in Telangana and Andhra Pradesh, scaling from gram level to multi-ton supplies." },
  { title: "Quality control", short: "Test", icon: "shield", href: "/quality/#control", body: "A qualified QC laboratory with sophisticated instruments, responsible for all analysis at every stage of the process." },
  { title: "Quality assurance", short: "Assure", icon: "check", href: "/quality/#assurance", body: "Integrated quality systems that harmonise global quality and regulatory standards across functions." },
  { title: "Regulatory affairs", short: "Comply", icon: "file", href: "/quality/regulatory-affairs/", body: "DMFs, CEPs, WHO-GMP and EU Written Confirmations — audited and recognised by global regulatory authorities." },
  { title: "Global supply", short: "Deliver", icon: "globe", href: "/about/global-presence/", body: "Delivered within the time frame stipulated by our customers, with a global presence across 40 countries in four regions." },
];

const R = 150;
const C = 200;
const pos = (i: number, n: number) => {
  const a = (i / n) * Math.PI * 2 - Math.PI / 2;
  return [C + R * Math.cos(a), C + R * Math.sin(a)] as const;
};

/** Sticky circular process diagram (desktop) that advances as the visitor scrolls through each step. */
export function ValueChain() {
  const [active, setActive] = useState(0);
  const stepRefs = useRef<(HTMLLIElement | null)[]>([]);
  const listRef = useRef<HTMLOListElement>(null);
  const [scrollProg, setScrollProg] = useState(0);
  const n = VALUE_CHAIN.length;

  useEffect(() => {
    const io = new IntersectionObserver(
      (entries) => entries.forEach((e) => { if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.step)); }),
      { rootMargin: "-45% 0px -45% 0px" },
    );
    stepRefs.current.forEach((el) => el && io.observe(el));
    return () => io.disconnect();
  }, []);

  const arcLen = 2 * Math.PI * R;
  // Continuous ring fill linked to scroll position through the steps
  useEffect(() => {
    const el = listRef.current;
    if (!el) return;
    let raf = 0;
    const update = () => {
      const r = el.getBoundingClientRect();
      const mid = window.innerHeight * 0.5;
      setScrollProg(Math.min(1, Math.max(0, (mid - r.top) / r.height)));
    };
    const onScroll = () => { cancelAnimationFrame(raf); raf = requestAnimationFrame(update); };
    update();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => { window.removeEventListener("scroll", onScroll); cancelAnimationFrame(raf); };
  }, []);
  const progress = Math.max((active + 0.5) / n, scrollProg);

  return (
    <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
      {/* Diagram */}
      <div className="hidden lg:col-span-6 lg:block">
        <div className="sticky top-28">
          <svg viewBox="0 0 400 400" className="mx-auto w-full max-w-[460px]" role="img" aria-label={`Synthokem value chain, step ${active + 1} of ${n}: ${VALUE_CHAIN[active].title}`}>
            <circle cx={C} cy={C} r={R} fill="none" stroke="rgb(255 255 255 / 0.12)" strokeWidth="2" />
            <circle
              cx={C} cy={C} r={R} fill="none" stroke="var(--accent)" strokeWidth="3" strokeLinecap="round"
              strokeDasharray={arcLen} strokeDashoffset={arcLen * (1 - progress)} transform={`rotate(-90 ${C} ${C})`}
              style={{ transition: "stroke-dashoffset 0.25s linear" }}
            />
            <circle cx={C} cy={C} r={R + 22} fill="none" stroke="rgb(255 255 255 / 0.08)" strokeDasharray="2 6" />
            {VALUE_CHAIN.map((s, i) => {
              const [x, y] = pos(i, n);
              const on = i <= active;
              const cur = i === active;
              return (
                <g key={s.title} style={{ cursor: "pointer" }} onClick={() => stepRefs.current[i]?.scrollIntoView({ behavior: "smooth", block: "center" })}>
                  <circle cx={x} cy={y} r={cur ? 26 : 22} fill={on ? "var(--accent)" : "var(--primary-dark)"} stroke={on ? "var(--accent)" : "rgb(255 255 255 / 0.25)"} strokeWidth="1.5" style={{ transition: "all .5s" }} />
                  <text x={x} y={y + 4.5} textAnchor="middle" fontSize="13" fontWeight="700" fill={on ? "var(--primary-ink)" : "rgb(255 255 255 / 0.7)"} style={{ fontFamily: "var(--font-display)" }}>{String(i + 1).padStart(2, "0")}</text>
                  <text x={x} y={y + (y < C ? -36 : 46)} textAnchor="middle" fontSize="12" fontWeight="600" fill={cur ? "#fff" : "rgb(255 255 255 / 0.55)"} style={{ transition: "fill .4s", fontFamily: "var(--font-sans)", letterSpacing: ".04em" }}>{s.short.toUpperCase()}</text>
                </g>
              );
            })}
            <g key={active} className="hero-in" style={{ animationDuration: ".6s" }}>
              <text x={C} y={C - 10} textAnchor="middle" fontSize="12" fill="var(--accent-soft)" fontWeight="600" style={{ letterSpacing: ".14em" }}>STEP {active + 1} / {n}</text>
              <foreignObject x={C - 95} y={C} width="190" height="70">
                <p style={{ margin: 0, textAlign: "center", color: "#fff", fontFamily: "var(--font-display)", fontWeight: 600, fontSize: 19, lineHeight: 1.2 }}>{VALUE_CHAIN[active].title}</p>
              </foreignObject>
            </g>
          </svg>
        </div>
      </div>

      {/* Steps */}
      <ol ref={listRef} className="relative lg:col-span-6">
        <span aria-hidden="true" className="absolute bottom-6 left-[22px] top-6 w-[2px] bg-white/10 lg:hidden" />
        <span aria-hidden="true" className="absolute left-[22px] top-6 w-[2px] origin-top rounded-full bg-accent shadow-[0_0_12px_var(--accent)] lg:hidden" style={{ height: "calc(100% - 3rem)", transform: `scaleY(${scrollProg})` }} />
        {VALUE_CHAIN.map((s, i) => {
          const on = i === active;
          return (
            <li
              key={s.title}
              ref={(el) => { stepRefs.current[i] = el; }}
              data-step={i}
              className={`relative grid grid-cols-[46px_1fr] gap-5 py-6 transition-opacity duration-500 lg:flex lg:min-h-[42vh] lg:flex-col lg:justify-center lg:py-10 ${on ? "lg:opacity-100" : "lg:opacity-60"}`}
            >
              <span className={`relative z-10 grid h-11 w-11 place-items-center rounded-full ring-1 transition-colors duration-500 ${on ? "bg-accent text-primary-ink ring-accent" : "bg-primary-dark text-accent-soft ring-white/20"}`}>
                <Icon name={s.icon} size={20} />
              </span>
              <div className="lg:mt-5">
                <p className="eyebrow text-accent-soft">Step {String(i + 1).padStart(2, "0")}</p>
                <h3 className="mt-2 font-display text-2xl font-semibold text-white sm:text-3xl">{s.title}</h3>
                <p className="mt-3 max-w-md text-[1.02rem] leading-relaxed text-on-dark-muted">{s.body}</p>
                <Link href={s.href} className="group mt-4 inline-flex min-h-10 items-center gap-2 text-sm font-semibold text-accent-soft hover:text-white">
                  Learn more <Icon name="arrowRight" size={15} className="arrow-nudge" />
                </Link>
              </div>
            </li>
          );
        })}
      </ol>
    </div>
  );
}
