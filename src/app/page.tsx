import type { CSSProperties } from "react";
import Link from "next/link";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink, Container, SectionHeading, SplitWords } from "@/components/ui/primitives";
import { Counter, Parallax, Reveal } from "@/components/ui/client";
import { HeroSearch } from "@/components/sections/HeroSearch";
import { GlobalMap } from "@/components/sections/GlobalMap";
import { PortfolioMap } from "@/components/diagrams/PortfolioMap";
import { ValueChain } from "@/components/diagrams/ValueChain";
import { QualityLayers } from "@/components/diagrams/Diagrams";
import { QuickLinks } from "@/components/sections/QuickLinks";
import { ScrollStatement } from "@/components/sections/ScrollStatement";
import { ACCOLADES, COUNTRIES } from "@/data/company";
import { asset } from "@/lib/asset";
import { HeroMolecules, type HeroMolecule } from "@/components/molecules/HeroMolecules";
import { MoleculeGallery, type GalleryItem } from "@/components/molecules/MoleculeGallery";
import { getStructure } from "@/data/structures";
import { PRODUCTS, STATUS_LABEL, getCategory, productHref, structureMeta, structureSrc } from "@/data/products";
import { SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = {
  ...pageMetadata({
    title: "API & Pharmaceutical Intermediates Manufacturer in India",
    description:
      "Synthokem Labs, Hyderabad — manufacturer of Active Pharmaceutical Ingredients, pharmaceutical intermediates, fine chemicals, excipients and metal scavengers since 1978. USFDA-inspected, WHO-GMP certified sites.",
    path: "/",
  }),
  title: { absolute: `${SITE.name} — API & Pharmaceutical Intermediates Manufacturer, India` },
};

const d = (ms: number) => ({ "--d": `${ms}ms` }) as CSSProperties;

const FEATURED = ["methocarbamol", "guaifenesin", "prazosin-hydrochloride", "ranolazine"];

export default function HomePage() {
  const heroMolecules: HeroMolecule[] = FEATURED.flatMap((slug) => {
    const p = PRODUCTS.find((x) => x.slug === slug);
    const st = getStructure(slug);
    if (!p || !st?.model3d) return [];
    return [{ slug, href: productHref(p), name: p.name, formula: st.matchedBy ? undefined : st.formula, detail: `${p.status ? STATUS_LABEL[p.status] + " API" : "API"} · ${p.therapeuticCategory ?? ""}`, model: st.model3d }];
  });

  const gallery: GalleryItem[] = PRODUCTS.filter((p) => p.status === "commercial" && structureSrc(p)).slice(0, 12).map((p) => ({
    slug: p.slug,
    href: productHref(p),
    name: p.name,
    cas: p.cas,
    formula: structureMeta(p.slug).formula,
    detail: p.therapeuticCategory,
    category: getCategory(p.category)!.shortName,
    src: structureSrc(p)!,
  }));

  return (
    <>
      {/* ───────────── HERO ───────────── */}
      {/* Only the background layers are clipped, so the search suggestions can open over the next section */}
      <section className="hero-play on-dark relative isolate z-10 flex min-h-[100svh] flex-col overflow-x-clip bg-deep text-white" aria-labelledby="hero-title">
        <div aria-hidden="true" className="absolute inset-0 -z-10 overflow-hidden">
          <Parallax speed={0.22} className="absolute inset-0 -z-20">
            <Img name="hero-cleanroom" priority sizes="100vw" className="ken-burns h-full w-full object-cover object-[72%_center]" alt="" />
          </Parallax>
          <div className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(8_64_118/0.93)_0%,rgb(12_88_155/0.88)_100%)] lg:bg-[linear-gradient(100deg,rgb(8_64_118/0.95)_0%,rgb(12_88_155/0.86)_40%,rgb(30_128_200/0.6)_72%,rgb(63_168_238/0.38)_100%)]" />
          <div className="absolute inset-x-0 bottom-0 -z-10 h-1/2 bg-gradient-to-t from-[#0a4c8a] via-[#0a4c8a]/70 to-transparent" />
        </div>

        <Container className="grid grid-cols-1 flex-1 items-center gap-12 pb-10 pt-32 lg:grid-cols-12 lg:pb-12">
          <div className="lg:col-span-7" data-hero-fade>
            <p className="hero-in flex items-center gap-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-on-dark-muted" style={d(0)}>
              <span aria-hidden="true" className="h-px w-10 bg-accent" />
              API manufacturer · Hyderabad · Since 1978
            </p>
            <h1 id="hero-title" className="display-xl mt-8 max-w-[16ch] font-display text-white">
              <SplitWords text="Performance and perfection, driven by chemistry." highlight="driven by chemistry." highlightClass="text-[#a9dcfb]" base={150} />
            </h1>
            <p className="lede hero-in mt-7 max-w-[36rem] text-on-dark-muted" style={d(650)}>
              We manufacture Active Pharmaceutical Ingredients and drug intermediates — with a global presence across {COUNTRIES.length} countries.
            </p>
            <div className="hero-in mt-10 flex flex-wrap gap-3" style={d(780)}>
              <ButtonLink href="/products/" variant="light">Explore our products</ButtonLink>
              <ButtonLink href="/contact/?intent=partner" variant="outline-light">Partner with us</ButtonLink>
            </div>
            <div className="hero-in mt-8" style={d(900)}><HeroSearch /></div>
          </div>
          <div className="hero-in mx-auto w-full max-w-[400px] sm:max-w-[460px] lg:col-span-5 lg:max-w-none" style={d(400)}>
            <HeroMolecules items={heroMolecules} />
          </div>
        </Container>

        {/* Key figures, set on a hairline at the foot of the hero */}
        <Container className="pb-8">
          <dl className="hero-in grid grid-cols-2 border-t border-white/15 lg:grid-cols-4" style={d(1000)} aria-label="Synthokem at a glance">
            {[
              { v: <Counter value={1978} />, l: "Year established" },
              { v: <Counter value={SITE.facilitiesCount} />, l: "Manufacturing units" },
              { v: <Counter value={300} suffix="+" />, l: "Skilled people" },
              { v: <Counter value={COUNTRIES.length} />, l: "Countries served" },
            ].map((s, i) => (
              <div key={i} className={`flex flex-col pt-6 ${i > 0 ? "lg:border-l lg:border-white/15 lg:pl-8" : ""} ${i % 2 === 1 ? "border-l border-white/15 pl-6 lg:pl-8" : ""} ${i > 1 ? "mt-6 lg:mt-0" : ""}`}>
                <dd className="font-display text-[2rem] font-semibold leading-none tracking-tight text-white sm:text-[2.4rem]">{s.v}</dd>
                <dt className="order-2 mt-2 text-[0.85rem] text-on-dark-muted">{s.l}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ───────────── STATEMENT ───────────── */}
      <section className="pb-6 pt-24 lg:pb-10 lg:pt-36" aria-label="About Synthokem">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12 lg:items-center lg:gap-16">
          <div className="lg:col-span-5">
            <Reveal className="flex items-baseline justify-between gap-4 border-b border-border pb-4">
              <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-muted">Synthokem Labs</p>
              <p className="font-mono text-xs text-muted">Hyderabad · Est. 1978</p>
            </Reveal>
            {/* Unit II gate: a sky panel sweeps across to reveal the photo, chip and caption follow, then a slow
                drift (globals.css "Photo wipe"). Landscape frame keeps both the signboard and the logo wall. */}
            <Reveal variant="wipe" delay={120} className="wipe-frame mt-6">
              {/* Not a .zoom-parent: ScrollFX's 1.12 parallax scale would crop the signboard at the left edge */}
              <div className="wipe-photo relative aspect-[544/316] overflow-hidden rounded-xl bg-surface shadow-[0_26px_50px_-30px_rgb(10_45_80/0.55)]">
                <Img name="unit2-gate" width={1920} height={1116} sizes="(min-width:1024px) 40vw, 100vw" className="wipe-img absolute inset-0 h-full w-full object-cover" />
                <span aria-hidden="true" className="wipe-panel" />
                <span aria-hidden="true" className="pointer-events-none absolute inset-0 z-[1] rounded-xl ring-1 ring-inset ring-black/10" />
                <span className="wipe-chip absolute right-3 top-3 z-[3] inline-flex items-center gap-1.5 rounded-full bg-white/90 px-3 py-1.5 font-mono text-[0.7rem] text-primary-ink shadow-sm backdrop-blur-sm">
                  <Icon name="pin" size={13} className="text-accent-strong" /> Unit II · Pashamylaram
                </span>
              </div>
              <p className="mt-7">
                <span className="wipe-mask"><span className="wipe-line font-mono text-xs text-muted" style={{ "--l": 0 } as CSSProperties}>Two units · Telangana &amp; Andhra Pradesh</span></span>
                <span className="wipe-mask mt-1.5"><span className="wipe-line font-display text-lg font-semibold leading-snug text-primary-ink" style={{ "--l": 1 } as CSSProperties}>Manufacturing in India since 1978</span></span>
              </p>
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <ScrollStatement
              className="font-display text-[clamp(1.6rem,2.3vw+0.75rem,2.75rem)] font-medium leading-[1.22] tracking-[-0.02em] text-primary-ink"
              text={`Since 1978, Synthokem Labs has manufactured Active Pharmaceutical Ingredients and drug intermediates in India — from gram level to multi-ton supplies, audited and recognised by global regulatory authorities, with a global presence across ${COUNTRIES.length} countries.`}
            />
            <div className="mt-10"><ButtonLink href="/about/" variant="secondary">About Synthokem</ButtonLink></div>
          </div>
        </Container>
      </section>

      {/* ───────────── START HERE ───────────── */}
      <section id="start" className="py-24 lg:py-32" aria-labelledby="start-title">
        <Container>
          <QuickLinks heading={<SectionHeading id="start-title" eyebrow="Start here" index="01" title="Find what you need." lede="Products, quality documentation, development work or a role with us." />} />
        </Container>
      </section>

      {/* ───────────── MOLECULES ───────────── */}
      <section className="bg-surface py-24 lg:py-0" aria-labelledby="molecules-title">
        <MoleculeGallery
          items={gallery}
          total={PRODUCTS.length}
          heading={
            <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
              <SectionHeading id="molecules-title" eyebrow="Our molecules" index="02" title="Molecules in our portfolio." lede="Commercial APIs and intermediates, drawn from their registered structures. Select one for grades, CAS number and regulatory status." />
              <Reveal delay={200}><ButtonLink href="/products/" variant="secondary">Browse all products</ButtonLink></Reveal>
            </div>
          }
        />
      </section>

      {/* ───────────── PORTFOLIO ───────────── */}
      <section className="py-24 lg:py-32" aria-labelledby="portfolio-title">
        <Container>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading id="portfolio-title" eyebrow="What we make" index="03" title="Five product families." lede="Every listing includes CAS number, pharmacopoeial grade and regulatory status." />
            <Reveal delay={200}><ButtonLink href={SITE.productListPdf} variant="secondary" icon="download">Product list (PDF)</ButtonLink></Reveal>
          </div>
          <div className="mt-14"><PortfolioMap /></div>
        </Container>
      </section>

      {/* ───────────── HOW WE WORK ───────────── */}
      <section className="on-dark relative isolate overflow-x-clip sky-band py-24 text-white lg:py-32" aria-labelledby="chain-title">
        <Container>
          <SectionHeading id="chain-title" tone="light" eyebrow="How we work" index="04" title="From molecule to market." lede="The Synthokem value chain, step by step — each stage links to the detail behind it." />
          <div className="mt-10 lg:mt-4"><ValueChain /></div>
        </Container>
      </section>

      {/* ───────────── QUALITY ───────────── */}
      <section className="py-24 lg:py-32" aria-labelledby="quality-title">
        <Container>
          <div className="flex flex-col justify-between gap-8 lg:flex-row lg:items-end">
            <SectionHeading id="quality-title" eyebrow="Quality & assurance" index="05" title="Quality goes beyond business." lede="Three layers of control surround every product we release." />
            <Reveal delay={200} className="flex flex-wrap gap-3">
              <ButtonLink href="/quality/">Quality systems</ButtonLink>
              <ButtonLink href="/quality/regulatory-affairs/" variant="secondary">Regulatory affairs</ButtonLink>
            </Reveal>
          </div>
          <div className="mt-14"><QualityLayers /></div>

          {/* PPT slide 4 ("Accolades"): the same eight logos, in the slide's order and two rows of four */}
          <Reveal className="mt-20">
            <div className="flex flex-wrap items-baseline justify-between gap-4">
              <h3 className="font-sans text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-muted">Inspections, approvals & certifications</h3>
              <Link href="/quality/regulatory-affairs/" className="group inline-flex items-center gap-2 text-sm font-semibold text-primary">
                <span className="link-u">View all approvals</span><Icon name="arrowRight" size={15} className="arrow-nudge" />
              </Link>
            </div>
            <ul className="mt-6 grid grid-cols-2 gap-3 sm:grid-cols-4 sm:gap-4">
              {ACCOLADES.map((a, i) => {
                // Only the very wide KFDA wordmark gets less height, so all eight read at a similar optical size;
                // EDQM keeps full height because its two logos carry small text
                const wide = a.logo.width / a.logo.height > 2.2;
                return (
                  <li key={a.name} className="node-pop group flex flex-col items-center rounded-xl bg-white px-4 pb-5 pt-6 text-center ring-1 ring-border transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_22px_44px_-28px_rgb(10_45_80/0.45)]" style={{ "--node-delay": `${0.1 + i * 0.07}s` } as CSSProperties}>
                    <span className="flex h-24 w-full items-center justify-center">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={asset(a.logo.src)} alt={`${a.name} logo`} width={a.logo.width} height={a.logo.height} loading="lazy" decoding="async" className={`w-auto max-w-[85%] object-contain transition-transform duration-500 ease-out group-hover:scale-105 ${wide ? "max-h-[4.25rem]" : "max-h-24"}`} />
                    </span>
                    <span className="mt-4 text-[0.88rem] font-semibold leading-snug text-primary-ink">{a.name}</span>
                  </li>
                );
              })}
            </ul>
          </Reveal>
        </Container>
      </section>

      {/* ───────────── GLOBAL PRESENCE ───────────── */}
      <section className="bg-surface py-24 lg:py-32" aria-labelledby="global-title">
        <Container>
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <SectionHeading id="global-title" className="lg:col-span-8" eyebrow="Global presence" index="06" title={`From Hyderabad to ${COUNTRIES.length} countries.`} />
            <Reveal delay={200} className="lg:col-span-4 lg:text-right"><ButtonLink href="/about/global-presence/" variant="secondary">Explore the map</ButtonLink></Reveal>
          </div>
          <Reveal className="relative mt-12"><GlobalMap tone="light" /></Reveal>
        </Container>
      </section>
    </>
  );
}
