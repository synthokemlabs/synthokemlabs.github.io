import Link from "next/link";
import { PageHero, PageNav } from "@/components/layout/PageHero";
import { ValuesDiagram } from "@/components/diagrams/Diagrams";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { Counter, Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { CHAIRPERSON, COUNTRIES, LEADERSHIP, MISSION, OVERVIEW, PARTNER_PRODUCTS, PHILOSOPHY, TOTAL_CAPACITY_KL, VALUES, VISION } from "@/data/company";
import { PRODUCTS, productHref } from "@/data/products";
import { SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Synthokem Labs — API Manufacturer Since 1978",
  description: "Synthokem Labs is a privately held manufacturer of APIs and drug intermediates, established in 1978, with two manufacturing units in Telangana and Andhra Pradesh and over 300 people.",
  path: "/about/",
});

const STATS = [
  { v: 1978, l: "Established" },
  { v: SITE.facilitiesCount, l: "Manufacturing units" },
  // Non-breaking space: the odometer lays digits out with flex, which drops a plain leading space
  { v: TOTAL_CAPACITY_KL, suffix: " KL", l: "Reactor capacity" },
  { v: 300, suffix: "+", l: "People" },
  { v: COUNTRIES.length, l: "Countries served" },
];

export default function AboutPage() {
  const partners = PARTNER_PRODUCTS.flatMap((p) => {
    const product = PRODUCTS.find((x) => x.slug === p.slug);
    return product ? [{ ...p, name: product.name, href: productHref(product) }] : [];
  });

  return (
    <>
      <PageHero eyebrow="Who we are" title="Driven by our principles and people." lede="Delivering products for a healthier and happier community — since 1978." crumbs={[{ name: "About", href: "/about/" }]} image="facility-aerial" />

      <PageNav items={[{ id: "overview", label: "Overview" }, { id: "vision", label: "Vision & values" }, { id: "philosophy", label: "Philosophy" }, { id: "leadership", label: "Leadership" }, { id: "more", label: "Explore more" }]} />

      <section id="overview" className="py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <SectionHeading eyebrow="Company overview" title="Quality APIs from India, since 1978." highlight="since 1978." size="md" />
              <p className="lede mt-6 text-muted">{OVERVIEW}</p>
              <div className="mt-8">
                <p className="text-sm font-medium text-muted">A preferred partner to leading consumer brands for</p>
                <ul className="mt-3 flex flex-wrap gap-3">
                  {partners.map((p) => (
                    <li key={p.slug}>
                      <Link href={p.href} className="group inline-flex items-center gap-3 rounded-full bg-white py-2 pl-5 pr-3 ring-1 ring-border transition-shadow hover:ring-primary/50">
                        <span className="font-semibold text-primary-ink">{p.name}</span>
                        <span className="text-[0.82rem] text-muted">{p.use}</span>
                        <span className="grid h-7 w-7 place-items-center rounded-full bg-primary-tint text-primary"><Icon name="arrowRight" size={14} className="arrow-nudge" /></span>
                      </Link>
                    </li>
                  ))}
                </ul>
              </div>
            </div>
            {/* Not a .zoom-parent: the parallax scale would crop the signboard at the left edge */}
            <Reveal variant="image" className="overflow-hidden rounded-lg lg:col-span-6">
              <Img name="unit2-gate" width={1920} height={1116} sizes="(min-width:1024px) 45vw, 100vw" className="aspect-[1920/1116] w-full object-cover" />
            </Reveal>
          </div>
          <dl className="mt-16 grid grid-cols-2 gap-x-6 gap-y-8 border-t border-border pt-10 sm:grid-cols-3 lg:grid-cols-5">
            {STATS.map((s) => (
              <div key={s.l} className="flex flex-col">
                <dd className="font-display text-4xl font-semibold tracking-tight text-primary"><Counter value={s.v} suffix={s.suffix} /></dd>
                <dt className="order-2 mt-1.5 text-sm text-muted">{s.l}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* PPT slide 3 */}
      <section id="vision" className="on-dark relative overflow-hidden sky-band py-20 text-white lg:py-24">
        <div aria-hidden="true" className="grid-paper-dark absolute inset-0" />
        <Container className="relative">
          <SectionHeading tone="light" eyebrow="What drives us" title="Vision, mission & values." size="md" />
          <div className="mt-12 grid grid-cols-1 gap-4 md:grid-cols-3">
            {[{ k: "Vision", v: VISION, icon: "eye" as const }, { k: "Mission", v: MISSION, icon: "target" as const }].map((x, i) => (
              <Reveal key={x.k} delay={i * 100} className="flex flex-col rounded-lg bg-white/[0.08] p-7 ring-1 ring-white/20 sm:p-8">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><Icon name={x.icon} size={20} className="text-white" /></span>
                <h3 className="eyebrow mt-6 text-accent-soft">{x.k}</h3>
                <p className="mt-3 font-display text-xl font-medium leading-snug text-white">{x.v}</p>
              </Reveal>
            ))}
            <Reveal delay={200} className="flex flex-col rounded-lg bg-white/[0.08] p-7 ring-1 ring-white/20 sm:p-8">
              <span className="grid h-11 w-11 place-items-center rounded-full bg-white/15"><Icon name="award" size={20} className="text-white" /></span>
              <h3 className="eyebrow mt-6 text-accent-soft">Values</h3>
              <ul className="mt-3 space-y-2">
                {VALUES.map((v) => (
                  <li key={v} className="flex items-center gap-3 font-display text-lg font-medium text-white"><span className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent-soft" />{v}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      <section id="philosophy" className="bg-surface py-20 lg:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Our philosophy" title="Three spheres of influence, one ethos." highlight="one ethos." size="md" />
            <ul className="mt-8 space-y-5">
              {PHILOSOPHY.map((p, i) => (
                <Reveal as="li" key={p.title} delay={i * 90} variant="left" className="flex gap-4">
                  <span className="mt-1.5 h-3 w-3 shrink-0 rounded-full" style={{ background: ["var(--accent)", "var(--secondary)", "var(--primary)"][i] }} />
                  <span><span className="block text-lg font-semibold text-primary-ink">{p.title}</span><span className="mt-1 block text-muted">{p.body}</span></span>
                </Reveal>
              ))}
            </ul>
          </div>
          <div className="lg:col-span-7"><ValuesDiagram /></div>
        </Container>
      </section>

      {/* PPT slide 2 */}
      <section id="leadership" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <p className="eyebrow text-accent-strong">Message from the Chairperson</p>
            <blockquote className="mt-6">
              <p className="font-display text-[1.75rem] font-medium leading-snug tracking-[-0.02em] text-primary-ink sm:text-[2.4rem]">
                <span className="text-accent-strong">“</span>{CHAIRPERSON.quote}<span className="text-accent-strong">”</span>
              </p>
              <footer className="mt-6 text-muted"><cite className="not-italic"><strong className="text-primary-ink">{CHAIRPERSON.name}</strong>, {CHAIRPERSON.title}</cite></footer>
            </blockquote>
            <div className="mt-8"><ButtonLink href="/about/chairperson/" variant="secondary">Read the full message</ButtonLink></div>
          </div>
          <Reveal delay={100} className="self-center rounded-lg bg-surface p-7 ring-1 ring-border sm:p-8 lg:col-span-5">
            <h2 className="eyebrow text-muted">Leadership team</h2>
            <ul className="mt-2 divide-y divide-border">
              {LEADERSHIP.map((p) => (
                <li key={p.name} className="py-4">
                  <span className="block text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-accent-strong">{p.role}</span>
                  <span className="mt-1 block text-lg font-semibold text-primary-ink">{p.name}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section id="more" className="border-t border-border bg-surface py-20">
        <Container>
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border md:grid-cols-3">
            {[
              { href: "/about/journey/", t: "Our journey", d: "From a single unit with 10 employees in 1978 to two manufacturing units today.", icon: "history" as const },
              { href: "/about/global-presence/", t: "Global presence", d: `${COUNTRIES.length} countries across Europe, Asia-Pacific, the Middle East & Africa and the Americas.`, icon: "globe" as const },
              { href: "/quality/regulatory-affairs/", t: "Regulatory affairs", d: "Audited and recognised by global regulatory authorities.", icon: "shield" as const },
            ].map((x) => (
              <li key={x.href}>
                <Link href={x.href} className="group flex h-full flex-col bg-white p-8 transition-colors hover:bg-primary-tint/40">
                  <Icon name={x.icon} size={26} strokeWidth={1.4} className="text-accent-strong" />
                  <h2 className="mt-8 text-xl font-semibold text-primary-ink">{x.t}</h2>
                  <p className="mt-2 flex-1 text-muted">{x.d}</p>
                  <span className="mt-6 inline-flex items-center gap-2 font-semibold text-primary">Explore <Icon name="arrowRight" size={16} className="arrow-nudge" /></span>
                </Link>
              </li>
            ))}
          </ul>
        </Container>
      </section>
    </>
  );
}
