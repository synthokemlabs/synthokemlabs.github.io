import Link from "next/link";
import type { CSSProperties, ReactNode } from "react";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { Container, JsonLd, SplitWords } from "@/components/ui/primitives";
import { Parallax } from "@/components/ui/client";
import { breadcrumbJsonLd } from "@/lib/seo";

export interface Crumb { name: string; href: string }

export function Breadcrumbs({ items, tone = "light" }: { items: Crumb[]; tone?: "light" | "dark" }) {
  const all = [{ name: "Home", href: "/" }, ...items];
  return (
    <>
      <nav aria-label="Breadcrumb">
        <ol className={`flex flex-wrap items-center gap-1.5 font-mono text-[0.72rem] uppercase tracking-[0.1em] ${tone === "light" ? "text-on-dark-muted" : "text-muted"}`}>
          {all.map((c, i) => (
            <li key={c.href} className="flex items-center gap-1.5">
              {i > 0 && <Icon name="chevronRight" size={12} className="opacity-60" />}
              {i === all.length - 1 ? (
                <span aria-current="page" className={tone === "light" ? "text-white" : "text-primary-ink"}>{c.name}</span>
              ) : (
                <Link href={c.href} className={`inline-flex min-h-6 items-center ${tone === "light" ? "hover:text-white" : "hover:text-primary"}`}>{c.name}</Link>
              )}
            </li>
          ))}
        </ol>
      </nav>
      <JsonLd data={breadcrumbJsonLd(all)} />
    </>
  );
}

/** Dark editorial page header. With `image`, a real Synthokem photograph sits behind a petrol-blue wash. */
export function PageHero({
  eyebrow, title, lede, crumbs, image, children, size = "md",
}: { eyebrow: string; title: ReactNode; lede?: ReactNode; crumbs: Crumb[]; image?: string; children?: ReactNode; size?: "sm" | "md" }) {
  return (
    <section className="hero-play on-dark relative isolate overflow-hidden bg-primary-ink text-white">
      {image ? (
        <>
          <Parallax speed={0.15} className="absolute inset-0 -z-20">
            <Img name={image} priority sizes="100vw" className="ken-burns h-full w-full object-cover" alt="" />
          </Parallax>
          <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(100deg,rgb(7_27_48/0.95)_0%,rgb(10_45_80/0.84)_45%,rgb(13_59_102/0.5)_100%)]" />
        </>
      ) : (
        <>
          <div aria-hidden="true" className="grid-paper-dark absolute inset-0 -z-10" />
        </>
      )}
      <Container className={size === "sm" ? "pb-14 pt-36 lg:pb-20 lg:pt-40" : "pb-20 pt-40 lg:pb-28 lg:pt-48"}>
        <div className="hero-in"><Breadcrumbs items={crumbs} /></div>
        <p className="hero-in mt-10 flex items-center gap-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-on-dark-muted" style={{ "--d": "80ms" } as CSSProperties}><span aria-hidden="true" className="h-px w-10 bg-accent" />{eyebrow}</p>
        <h1 className={`mt-5 max-w-4xl font-display text-white ${size === "sm" ? "display-lg" : "display-xl"}`}>
          {typeof title === "string" ? <SplitWords text={title} base={120} /> : title}
        </h1>
        {lede && <p className="lede hero-in mt-6 max-w-2xl text-on-dark-muted" style={{ "--d": "420ms" } as CSSProperties}>{lede}</p>}
        {children && <div className="hero-in mt-10" style={{ "--d": "540ms" } as CSSProperties}>{children}</div>}
      </Container>
    </section>
  );
}

/** Sticky in-page section navigation with scroll-spy (re-exported client component). */
export { PageNav } from "./PageNav";
