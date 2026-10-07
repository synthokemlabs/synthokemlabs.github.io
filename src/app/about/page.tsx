import Link from "next/link";
import { PageHero, PageNav } from "@/components/layout/PageHero";
import { ValuesDiagram } from "@/components/diagrams/Diagrams";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { Counter, Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { CHAIRPERSON, COMMITMENTS, COUNTRIES, MISSION, OVERVIEW, PHILOSOPHY, VISION } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "About Synthokem Labs — API Manufacturer Since 1978",
  description: "Synthokem Labs is a privately held manufacturer of APIs and drug intermediates, established in 1978, with three manufacturing facilities in Telangana and Andhra Pradesh and over 300 people.",
  path: "/about/",
});

export default function AboutPage() {
  return (
    <>
      <PageHero eyebrow="Who we are" title="Driven by our principles and people." lede="Delivering products for a healthier and happier community — since 1978." crumbs={[{ name: "About", href: "/about/" }]} image="facility-aerial" />

      <PageNav items={[{ id: "overview", label: "Overview" }, { id: "philosophy", label: "Philosophy" }, { id: "vision", label: "Vision & mission" }, { id: "leadership", label: "Leadership" }, { id: "more", label: "Explore more" }]} />

      <section id="overview" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Company overview" title="An integral part of the Indian pharmaceutical industry." highlight="pharmaceutical industry." size="md" />
            <dl className="mt-10 grid grid-cols-2 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border">
              {[
                { v: <Counter value={1978} />, l: "Year established" },
                { v: <Counter value={3} />, l: "Manufacturing facilities" },
                { v: <Counter value={300} suffix="+" />, l: "People" },
                { v: <Counter value={COUNTRIES.length} />, l: "Countries" },
              ].map((s, i) => (
                <div key={i} className="flex flex-col bg-white p-5">
                  <dd className="font-display text-3xl font-semibold text-primary">{s.v}</dd>
                  <dt className="order-2 mt-1 text-sm text-muted">{s.l}</dt>
                </div>
              ))}
            </dl>
          </div>
          <div className="space-y-5 text-[1.05rem] leading-relaxed text-text lg:col-span-7">
            {OVERVIEW.slice(0, 2).map((p, i) => <Reveal key={i}><p className={i === 0 ? "lede text-primary-ink" : "text-muted"}>{p}</p></Reveal>)}
            <details className="group rounded-lg bg-surface p-5 [&_summary::-webkit-details-marker]:hidden">
              <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between font-semibold text-primary">
                <span className="group-open:hidden">Read the full overview</span><span className="hidden group-open:inline">Show less</span>
                <Icon name="plus" size={18} className="transition-transform duration-300 group-open:rotate-45" />
              </summary>
              <div className="mt-4 space-y-4 text-muted">{OVERVIEW.slice(2).map((p, i) => <p key={i}>{p}</p>)}</div>
            </details>
          </div>
        </Container>
      </section>

      <section id="philosophy" className="bg-surface py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
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
          </div>
          <ul className="mt-10 grid grid-cols-1 gap-8 md:grid-cols-3">
            {COMMITMENTS.map((c) => (
              <li key={c.title} className="lift rounded-lg bg-white p-6 ring-1 ring-border">
                <h3 className="eyebrow text-accent-strong">{c.title}</h3>
                <p className="mt-3 leading-relaxed text-text">{c.body}</p>
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="vision" className="on-dark relative overflow-hidden bg-primary-ink py-20 text-white lg:py-28">
        <div aria-hidden="true" className="grid-paper-dark absolute inset-0" />
        <Container className="relative grid grid-cols-1 gap-14 lg:grid-cols-2 lg:gap-20">
          {[{ k: "Our vision", v: VISION }, { k: "Our mission", v: MISSION }].map((x, i) => (
            <Reveal key={x.k} delay={i * 120}>
              <Eyebrow tone="light">{x.k}</Eyebrow>
              <p className="mt-6 font-display text-[1.6rem] font-medium leading-snug tracking-[-0.015em] text-white sm:text-[2rem]">{x.v}</p>
            </Reveal>
          ))}
        </Container>
      </section>

      <section id="leadership" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Eyebrow>Message from the Chairperson</Eyebrow>
            <blockquote className="mt-6">
              <p className="font-display text-[1.75rem] font-medium leading-snug tracking-[-0.02em] text-primary-ink sm:text-[2.4rem]">
                <span className="text-accent-strong">“</span>{CHAIRPERSON.quote}<span className="text-accent-strong">”</span>
              </p>
              <footer className="mt-6 text-muted"><cite className="not-italic"><strong className="text-primary-ink">{CHAIRPERSON.name}</strong>, {CHAIRPERSON.title}</cite></footer>
            </blockquote>
            <div className="mt-8"><ButtonLink href="/about/chairperson/" variant="secondary">Read the full message</ButtonLink></div>
          </div>
          <Reveal variant="image" className="zoom-parent overflow-hidden rounded-lg lg:col-span-5">
            <Img name="lab-team" sizes="(min-width:1024px) 40vw, 100vw" className="zoom-img aspect-[4/3] w-full object-cover" />
          </Reveal>
        </Container>
      </section>

      <section id="more" className="border-t border-border bg-surface py-20">
        <Container>
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border md:grid-cols-3">
            {[
              { href: "/about/journey/", t: "Our journey", d: "From a single unit with 10 employees in 1978 to three facilities today.", icon: "history" as const },
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
