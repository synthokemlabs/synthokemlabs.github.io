import Link from "next/link";
import { Fragment, type CSSProperties, type ReactNode } from "react";
import { Reveal } from "./client";
import { Icon, type IconName } from "./Icon";

export function Container({ children, className = "", as: Tag = "div" }: { children: ReactNode; className?: string; as?: "div" | "section" | "header" | "footer" | "nav" }) {
  return <Tag className={`mx-auto w-full max-w-[1320px] px-4 sm:px-8 lg:px-12 ${className}`}>{children}</Tag>;
}

type Variant = "primary" | "secondary" | "ghost" | "light" | "outline-light";
const VARIANTS: Record<Variant, string> = {
  primary: "bg-primary text-white hover:bg-accent-strong active:translate-y-px",
  secondary: "bg-transparent text-primary ring-1 ring-inset ring-border-strong hover:ring-primary hover:bg-primary hover:text-white active:translate-y-px",
  ghost: "text-primary hover:text-primary-dark px-0! min-h-0!",
  light: "bg-white text-primary-ink hover:bg-primary-tint active:translate-y-px",
  "outline-light": "text-white ring-1 ring-inset ring-white/35 hover:bg-white hover:text-primary-ink hover:ring-white active:translate-y-px",
};

export function ButtonLink({
  href, children, variant = "primary", icon = "arrowRight", className = "", external, ...rest
}: { href: string; children: ReactNode; variant?: Variant; icon?: IconName | null; className?: string; external?: boolean; "aria-label"?: string; download?: boolean }) {
  const cls = `group inline-flex min-h-12 items-center justify-center gap-3 rounded-md px-6 text-[0.92rem] font-semibold tracking-[0.01em] transition-colors duration-300 ${VARIANTS[variant]} ${className}`;
  const inner = (
    <>
      <RollLabel>{children}</RollLabel>
      {icon && <Icon name={icon} size={18} className="arrow-nudge" />}
    </>
  );
  if (external || href.startsWith("http") || href.startsWith("mailto:") || href.startsWith("tel:") || href.endsWith(".pdf")) {
    return (
      <a href={href} className={cls} {...(href.startsWith("http") ? { target: "_blank", rel: "noopener noreferrer" } : {})} {...rest}>
        {inner}
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {inner}
    </Link>
  );
}

/** Button label that rolls up to an identical copy on hover (the copy is hidden from assistive tech). */
export function RollLabel({ children }: { children: ReactNode }) {
  return (
    <span className="roll">
      <span className="roll-a">{children}</span>
      <span className="roll-b" aria-hidden="true">{children}</span>
    </span>
  );
}

export function Eyebrow({ children, tone = "dark", className = "" }: { children: ReactNode; index?: string; tone?: "dark" | "light"; className?: string }) {
  return <p className={`eyebrow ${tone === "light" ? "text-accent-soft" : "text-accent-strong"} ${className}`}>{children}</p>;
}

/** Splits a heading into words that rise into view (when an ancestor becomes .is-visible / .hero-play). */
export function SplitWords({ text, highlight, base = 0, highlightClass = "" }: { text: string; highlight?: string; base?: number; highlightClass?: string }) {
  const main = highlight && text.endsWith(highlight) ? text.slice(0, -highlight.length) : text;
  const words = main.split(" ").filter(Boolean);
  const hi = highlight && text.endsWith(highlight) ? highlight.split(" ").filter(Boolean) : [];
  const style = (i: number) => ({ "--i": i, "--base": `${base}ms` }) as CSSProperties;
  return (
    <>
      <span>
        {words.map((w, i) => (<Fragment key={i}><span className="split-word"><span style={style(i)}>{w}</span></span>{" "}</Fragment>))}
        {hi.map((w, i) => (<Fragment key={`h${i}`}><span className="split-word"><span style={style(words.length + i)} className={highlightClass}>{w}</span></span>{i < hi.length - 1 ? " " : ""}</Fragment>))}
      </span>
    </>
  );
}

export function SectionHeading({
  eyebrow, index, title, highlight, lede, tone = "dark", align = "left", className = "", as: H = "h2", size = "lg", id,
}: { eyebrow?: string; index?: string; title: ReactNode; highlight?: string; lede?: ReactNode; tone?: "dark" | "light"; align?: "left" | "center"; className?: string; as?: "h1" | "h2" | "h3"; size?: "lg" | "md"; id?: string }) {
  const light = tone === "light";
  return (
    <Reveal className={`${align === "center" ? "mx-auto text-center" : ""} max-w-3xl ${className}`}>
      {eyebrow && (
        <div className={`rule-draw flex items-center justify-between gap-6 pt-4 text-[0.74rem] font-semibold uppercase tracking-[0.16em] ${light ? "[--rule:rgb(255_255_255/0.18)] text-on-dark-muted" : "[--rule:var(--border-strong)] text-muted"}`}>
          <span>{eyebrow}</span>
          {index && <span className="font-mono tracking-normal">{index}</span>}
        </div>
      )}
      <H id={id} className={`${size === "lg" ? "display-lg" : "display-md"} ${eyebrow ? "mt-7" : ""} ${light ? "text-white" : "text-primary-ink"}`}>
        {typeof title === "string" ? <SplitWords text={title} highlight={highlight} /> : title}
      </H>
      {lede && <p className={`lede mt-5 ${light ? "text-on-dark-muted" : "text-muted"}`}>{lede}</p>}
    </Reveal>
  );
}

export function Badge({ children, tone = "neutral" }: { children: ReactNode; tone?: "neutral" | "green" | "amber" | "teal" }) {
  const t = {
    neutral: "bg-surface-2 text-text",
    green: "bg-[#e2f3ec] text-success",
    amber: "bg-[#fbf1df] text-warning",
    teal: "bg-secondary-tint text-secondary",
  }[tone];
  return <span className={`inline-flex shrink-0 items-center gap-1.5 whitespace-nowrap rounded-full px-2.5 py-0.5 text-[0.72rem] font-semibold ${t}`}>{children}</span>;
}

export function JsonLd({ data }: { data: object | object[] }) {
  return <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(data).replace(/</g, "\\u003c") }} />;
}

/** Spec-sheet style key/value row used for facts and product data. */
export function SpecRow({ label, children, mono }: { label: string; children: ReactNode; mono?: boolean }) {
  return (
    <div className="grid grid-cols-[minmax(0,9rem)_1fr] gap-4 border-t border-border py-3.5 sm:grid-cols-[minmax(0,12rem)_1fr]">
      <dt className="eyebrow pt-0.5 text-muted">{label}</dt>
      <dd className={`${mono ? "font-mono text-[0.95rem]" : ""} text-text`}>{children}</dd>
    </div>
  );
}
