import type { CSSProperties } from "react";
import { PageHero, PageNav } from "@/components/layout/PageHero";
import { EhsFlow } from "@/components/diagrams/Diagrams";
import { InfoTabs, type InfoTab } from "@/components/sections/InfoTabs";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { Counter, Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { Icon, type IconName } from "@/components/ui/Icon";
import { CSR, EHS, RENEWABLES, RESPONSIBILITY } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

const SOLAR_KW = RENEWABLES.reduce((sum, r) => sum + r.pvKW, 0);

export const metadata = pageMetadata({
  title: "Sustainability, Health & Safety and CSR",
  description: `Synthokem's environment, health & safety and CSR: ${SOLAR_KW} kW of solar PV, solar concentrators, a zero liquid discharge facility, ~80% of non-hazardous waste recycled, an SHE policy and process safety standards, and CSR in education, nutrition and healthcare.`,
  path: "/sustainability/",
});

/** PPT slides 28–29 photographs. */
const ENV_PHOTOS = [
  { name: "solar-rooftop", caption: "Solar PV panels", span: "col-span-2 aspect-[2/1]" },
  { name: "solar-concentrators", caption: "Solar concentrators", span: "aspect-square" },
  { name: "zld-plant", caption: "Zero liquid discharge plant", span: "aspect-square" },
  { name: "green-belt", caption: "Greenery", span: "aspect-[4/3]" },
  { name: "unit2-greenbelt", caption: "Green belt at Unit II", span: "aspect-[4/3]" },
];

/** PPT slides 25–27, as tabs (one place each, not three stacked cards). */
const EHS_TABS: InfoTab[] = [
  { id: "she", label: "SHE policy", short: "SHE policy", intro: `${EHS.shePolicy.intro.replace(/ by:$/, ".")} Signed by the ${EHS.shePolicy.signedBy}.`, groups: [{ title: "Our commitments", items: EHS.shePolicy.points }] },
  { id: "health", label: "Health & hygiene", short: "Health", intro: "Looking after the people who handle our chemistry every day.", groups: [{ title: "In practice", items: EHS.health }] },
  { id: "standards", label: "Safety standards", short: "Standards", intro: "Standards that cover process safety, employee health, safety and emergency response.", groups: EHS.standards.map((s) => ({ title: s.t, items: [s.d] })) },
];

// Organisation names live only in the CSR list below, not repeated in these summaries
const SOCIAL: { t: string; d: string; icon: IconName }[] = [
  { t: "Education", icon: "users", d: "Contributing to the education of the girl child and financially challenged students — helping break the cycle of illiteracy in economically and socially backward communities." },
  { t: "Nutrition & care", icon: "message", d: "Supporting mid-day meal programmes and orphanages, including homes serving differently-abled individuals." },
  { t: "Healthcare", icon: "heart", d: "Taking part in hospital initiatives in Telangana that aid the treatment of underprivileged children and adults, and supporting people living with HIV." },
];
const SUPPORTED = [...CSR.supported, "The United Orphanage for the Disabled", "Network of HIV+ People"];

export default function SustainabilityPage() {
  return (
    <>
      <PageHero eyebrow="Social responsibility" title="Extending beyond business." lede="Conducting our business with complete respect for the environment, our people and the community — through long-term, sustainable initiatives led by our dedicated CSR wing." crumbs={[{ name: "Sustainability", href: "/sustainability/" }]} image="csr-environment" />
      <PageNav items={[{ id: "commitment", label: "Our commitment" }, { id: "environment", label: "Environment" }, { id: "ehs", label: "Health & safety" }, { id: "community", label: "Community" }]} />

      <section id="commitment" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Our commitment" title="Responsibility as part of how we operate." size="md" />
            <p className="lede mt-6 text-muted">{RESPONSIBILITY}</p>
          </div>
          <dl className="grid grid-cols-2 gap-6 self-end sm:grid-cols-3 lg:col-span-6">
            <div className="border-t-2 border-primary pt-4"><dd className="font-display text-5xl font-semibold text-primary"><Counter value={SOLAR_KW} /><span className="ml-1 text-2xl">kW</span></dd><dt className="mt-2 text-sm text-muted">of solar PV across both units</dt></div>
            <div className="border-t-2 border-primary pt-4"><dd className="font-display text-5xl font-semibold text-primary"><Counter value={80} suffix="%" /></dd><dt className="mt-2 text-sm text-muted">of non-hazardous waste recycled (approximately)</dt></div>
            <div className="border-t-2 border-primary pt-4"><dd className="font-display text-5xl font-semibold text-primary"><Counter value={60} suffix="%" /></dd><dt className="mt-2 text-sm text-muted">of hazardous waste recycled (approximately)</dt></div>
          </dl>
        </Container>
      </section>

      {/* PPT slides 28–29: one environment section (energy, water, waste) */}
      <section id="environment" className="bg-surface py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Environment" title="Securing Mother Nature." size="md" />
            <p className="mt-6 leading-relaxed text-muted">One of the first pharma companies in India to harvest solar energy, we run our sites on renewable power, operate a zero liquid discharge facility, and put waste prevention and reduction before treatment or disposal. We also contribute to the World Wildlife Fund.</p>
            <div className="mt-8 space-y-4">
              {RENEWABLES.map((r, i) => (
                <Reveal key={r.unit} delay={i * 100} className="rounded-xl bg-white p-6 ring-1 ring-border">
                  <div className="flex items-baseline justify-between gap-4">
                    <h3 className="text-lg font-semibold text-primary-ink">{r.unit}</h3>
                    <p className="font-display text-3xl font-semibold text-primary">{r.pvKW}<span className="ml-1 text-base">kW solar</span></p>
                  </div>
                  <ul className="mt-4 space-y-2 border-t border-border pt-4">
                    {r.items.map((x) => <li key={x} className="flex gap-2.5 text-[0.93rem] leading-relaxed text-text"><Icon name="sun" size={16} className="mt-1 shrink-0 text-accent-strong" />{x}</li>)}
                  </ul>
                </Reveal>
              ))}
            </div>
          </div>
          <ul className="grid grid-cols-2 gap-3 self-start lg:col-span-7">
            {ENV_PHOTOS.map((p, i) => (
              <Reveal as="li" key={p.name} variant="image" delay={(i % 2) * 90} className={`zoom-parent relative overflow-hidden rounded-xl bg-white ${p.span}`}>
                <Img name={p.name} sizes={i === 0 ? "(min-width:1024px) 55vw, 100vw" : "(min-width:1024px) 28vw, 50vw"} className="zoom-img absolute inset-0 h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-3 pt-10 text-[0.82rem] font-medium text-white">{p.caption}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* PPT slides 24–27 */}
      <section id="ehs" className="py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <SectionHeading eyebrow="Environmental health & safety" title="Our people are our real assets." size="md" />
              {EHS.intro.map((p, i) => <p key={i} className={i === 0 ? "lede mt-6 text-primary-ink" : "mt-4 leading-relaxed text-muted"}>{p}</p>)}
            </div>
            <Reveal className="flex flex-col justify-center rounded-xl bg-gradient-to-br from-primary to-accent-strong p-8 text-white sm:p-10 lg:col-span-6">
              <Icon name="message" size={28} className="text-accent-soft" />
              <blockquote className="mt-6">
                <p className="font-display text-[1.8rem] font-medium leading-snug tracking-[-0.015em] sm:text-[2.2rem]">“{EHS.quote.text}”</p>
                <footer className="mt-5 text-on-dark-muted">— {EHS.quote.by}</footer>
              </blockquote>
            </Reveal>
          </div>

          <div className="mt-16 rounded-xl bg-surface p-6 ring-1 ring-border sm:p-10">
            <h3 className="eyebrow text-center text-muted">How leadership turns into safeguards</h3>
            <div className="mt-8"><EhsFlow /></div>
          </div>

          <div className="mt-12 max-w-4xl">
            <InfoTabs tabs={EHS_TABS} label="Environment, health and safety" />
          </div>
        </Container>
      </section>

      {/* PPT slide 30 */}
      <section id="community" className="bg-surface py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="People & community" title="Empowering people through meaningful initiatives." size="md" />
            <p className="mt-6 text-muted">{CSR.policy}</p>
            <div className="mt-10 grid grid-cols-2 gap-3">
              <Reveal variant="image" className="zoom-parent overflow-hidden rounded-xl"><Img name="csr-education" sizes="(min-width:1024px) 20vw, 50vw" className="zoom-img aspect-square w-full object-cover" /></Reveal>
              <Reveal variant="image" delay={100} className="zoom-parent overflow-hidden rounded-xl"><Img name="csr-community" sizes="(min-width:1024px) 20vw, 50vw" className="zoom-img aspect-square w-full object-cover" /></Reveal>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ol>
              {SOCIAL.map((x, i) => (
                <Reveal as="li" key={x.t} delay={i * 70} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-border py-7 last:border-b">
                  <Icon name={x.icon} size={24} strokeWidth={1.4} className="mt-1 text-accent-strong" />
                  <div><h3 className="text-xl font-semibold text-primary-ink">{x.t}</h3><p className="mt-2 leading-relaxed text-muted">{x.d}</p></div>
                </Reveal>
              ))}
            </ol>
            <Reveal className="mt-10">
              <Eyebrow>Organisations and funds we support</Eyebrow>
              <ul className="mt-4 flex flex-wrap gap-2">
                {SUPPORTED.map((x, i) => (
                  <li key={x} className="node-pop rounded-full bg-white px-3.5 py-1.5 text-[0.86rem] font-medium text-primary-ink ring-1 ring-border" style={{ "--node-delay": `${0.1 + i * 0.05}s` } as CSSProperties}>{x}</li>
                ))}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="on-dark bg-primary py-16 text-white">
        <Container className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <p className="display-md max-w-2xl text-white">Responsible manufacturing is part of our quality story.</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/capabilities/manufacturing/" variant="light">Our manufacturing units</ButtonLink>
            <ButtonLink href="/careers/" variant="outline-light">Careers</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
