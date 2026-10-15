import type { CSSProperties } from "react";
import { PageHero, PageNav } from "@/components/layout/PageHero";
import { GreeneryStrip, ResourceColumns, SafeguardsHub, SafetyDetail, ShePolicy, SOLAR_KW, SolarBanner } from "@/components/sections/SustainabilitySections";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { CSR, EHS, RESPONSIBILITY } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sustainability, Health & Safety and CSR",
  description: `Synthokem's environment, health & safety and CSR: ${SOLAR_KW} kW of solar PV, solar concentrators, a zero liquid discharge facility, ~80% of non-hazardous waste recycled, an SHE policy and process safety standards, and CSR in education, nutrition and healthcare.`,
  path: "/sustainability/",
});

// Organisation names live only in the list below, not repeated in these summaries
const SOCIAL = [
  { t: "Education", d: "Contributing to the education of the girl child and financially challenged students — helping break the cycle of illiteracy in economically and socially backward communities." },
  { t: "Nutrition & care", d: "Supporting mid-day meal programmes and orphanages, including homes serving differently-abled individuals." },
  { t: "Healthcare", d: "Taking part in hospital initiatives in Telangana that aid the treatment of underprivileged children and adults, and supporting people living with HIV." },
];
const SUPPORTED = [...CSR.supported, "The United Orphanage for the Disabled", "Network of HIV+ People"];

export default function SustainabilityPage() {
  return (
    <>
      <PageHero eyebrow="Social responsibility" title="Extending beyond business." lede="Conducting our business with complete respect for the environment, our people and the community — through long-term, sustainable initiatives led by our dedicated CSR wing." crumbs={[{ name: "Sustainability", href: "/sustainability/" }]} image="csr-environment" />
      <PageNav items={[{ id: "commitment", label: "Our commitment" }, { id: "environment", label: "Environment" }, { id: "ehs", label: "Health & safety" }, { id: "community", label: "Community" }]} />

      <section id="commitment" className="py-20 lg:py-28">
        <Container className="max-w-5xl">
          <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-muted">Our commitment</p>
          <Reveal className="mt-6">
            <p className="font-display text-[clamp(1.5rem,2vw+0.85rem,2.6rem)] font-medium leading-[1.25] tracking-[-0.018em] text-primary-ink">{RESPONSIBILITY}</p>
          </Reveal>
          <Reveal delay={150} className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-xl bg-border ring-1 ring-border sm:grid-cols-3">
            {[["01", "Environment", "#environment"], ["02", "Our people", "#ehs"], ["03", "Community", "#community"]].map(([n, t, href]) => (
              <a key={t} href={href} className="group flex items-center justify-between gap-4 bg-white px-6 py-5 transition-colors hover:bg-primary-tint/50">
                <span className="flex items-baseline gap-3"><span className="font-mono text-[0.72rem] text-accent-strong">{n}</span><span className="font-semibold text-primary-ink">{t}</span></span>
                <span aria-hidden="true" className="text-primary transition-transform duration-300 group-hover:translate-y-0.5">↓</span>
              </a>
            ))}
          </Reveal>
        </Container>
      </section>

      {/* PPT slides 28–29 */}
      <section id="environment" className="border-t border-border bg-surface py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-6"><SectionHeading eyebrow="Environment" title="Securing Mother Nature." size="md" /></div>
            <Reveal delay={120} className="lg:col-span-6"><p className="leading-relaxed text-muted">One of the first pharma companies in India to harvest solar energy, we run our sites on renewable power, recover our water and put waste prevention before treatment or disposal. We also contribute to the World Wildlife Fund.</p></Reveal>
          </div>
          <div className="mt-12"><SolarBanner /></div>
          <div className="mt-5"><ResourceColumns /></div>
          <div className="mt-5"><GreeneryStrip /></div>
        </Container>
      </section>

      {/* Health & safety: the band and the policy share one anchor, so the page menu stays on it through both */}
      <div id="ehs">
      {/* PPT slide 24: the Chairperson's belief, and the safeguards leadership puts in place */}
      <section className="on-dark relative isolate overflow-hidden sky-band py-20 text-white lg:py-28">
        <span aria-hidden="true" className="vmv-orb -left-24 -top-32 h-[24rem] w-[24rem] bg-[#3fa8ee]" />
        <span aria-hidden="true" className="vmv-orb vmv-orb-b -bottom-40 right-[-6rem] h-[26rem] w-[26rem] bg-[#22b8c9]" />
        <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12 lg:gap-12">
          <div className="lg:col-span-5">
            <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent-soft">Environmental health &amp; safety</p>
            <Reveal className="mt-6">
              <blockquote>
                <p className="font-display text-[clamp(2rem,3vw+0.8rem,3.1rem)] font-medium leading-[1.1] tracking-[-0.02em]">“{EHS.quote.text}”</p>
                <footer className="mt-5 flex items-center gap-3 text-sm text-on-dark-muted"><span aria-hidden="true" className="h-px w-8 bg-accent-soft" />{EHS.quote.by}</footer>
              </blockquote>
            </Reveal>
            <Reveal delay={150} className="mt-8 space-y-4 text-on-dark-muted">
              {EHS.intro.map((p) => <p key={p} className="leading-relaxed">{p}</p>)}
            </Reveal>
          </div>
          <div className="lg:col-span-7"><SafeguardsHub /></div>
        </Container>
      </section>

      {/* PPT slides 25–27 */}
      <section className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-14">
          <div className="lg:col-span-7"><ShePolicy /></div>
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Health & safety in practice" title="Written down, and followed." size="md" lede="How we look after the people who handle our chemistry every day." />
            <div className="mt-8"><SafetyDetail /></div>
          </div>
        </Container>
      </section>
      </div>

      {/* PPT slide 30 */}
      <section id="community" className="border-t border-border bg-surface py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="relative pb-16 sm:pb-24 lg:col-span-5 lg:pb-0">
            <Reveal variant="image" className="zoom-parent overflow-hidden rounded-2xl">
              <Img name="csr-education" sizes="(min-width:1024px) 38vw, 100vw" className="zoom-img aspect-[4/5] w-full object-cover" />
            </Reveal>
            <Reveal variant="image" delay={200} className="zoom-parent absolute -bottom-0 right-0 w-1/2 overflow-hidden rounded-xl ring-8 ring-surface lg:-bottom-10 lg:-right-8">
              <Img name="csr-community" sizes="(min-width:1024px) 20vw, 50vw" className="zoom-img aspect-square w-full object-cover" />
            </Reveal>
          </div>
          <div className="lg:col-span-7">
            <SectionHeading eyebrow="People & community" title="Empowering people through meaningful initiatives." size="md" lede={CSR.policy} />
            <Reveal delay={120}><p className="mt-4 leading-relaxed text-muted">{CSR.support}</p></Reveal>
            <ol className="mt-10">
              {SOCIAL.map((x, i) => (
                <Reveal as="li" key={x.t} delay={i * 80} className="grid grid-cols-[3rem_1fr] gap-3 border-t border-border py-6">
                  <span className="font-display text-2xl font-semibold leading-none text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
                  <div><h3 className="text-xl font-semibold text-primary-ink">{x.t}</h3><p className="mt-2 leading-relaxed text-muted">{x.d}</p></div>
                </Reveal>
              ))}
            </ol>
            <Reveal className="mt-4 rounded-xl bg-white p-6 ring-1 ring-border sm:p-7">
              <p className="text-[0.7rem] font-semibold uppercase tracking-[0.16em] text-muted">Organisations &amp; funds we support</p>
              <ul className="mt-4 grid grid-cols-1 gap-x-8 sm:grid-cols-2">
                {SUPPORTED.map((x, i) => (
                  <li key={x} className="node-pop flex items-center gap-3 border-b border-border py-2.5 text-[0.92rem] font-medium text-primary-ink" style={{ "--node-delay": `${0.1 + i * 0.05}s` } as CSSProperties}>
                    <span aria-hidden="true" className="h-1.5 w-1.5 shrink-0 rounded-full bg-accent" />{x}
                  </li>
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
