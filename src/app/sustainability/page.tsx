import { PageHero, PageNav } from "@/components/layout/PageHero";
import { EhsFlow } from "@/components/diagrams/Diagrams";
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

const ENV: { t: string; d: string; icon: IconName }[] = [
  { t: "Renewable energy", icon: "sun", d: "Synthokem Labs was one of the first pharma companies to harvest solar energy in India. To reduce our energy footprint, our facilities are powered by renewable sources — balancing environmental responsibility, financial performance and business commitments." },
  { t: "Zero liquid discharge", icon: "droplet", d: "With a zero liquid discharge (ZLD) facility and wastewater management practices at our facilities, our operations comply with water management standards in a safe and sustainable environment." },
  { t: "Recycling & waste management", icon: "leaf", d: "We follow a clear waste management strategy: prevention and reduction are always preferred to treatment, incineration or disposal — and we continue to maximise opportunities for reuse and recycling." },
];

/** PPT slide 29 photographs. */
const ENERGY_PHOTOS = [
  { name: "solar-rooftop", caption: "Solar PV panels", span: "col-span-2 aspect-[2/1]" },
  { name: "solar-concentrators", caption: "Solar concentrators", span: "aspect-square" },
  { name: "zld-plant", caption: "Zero liquid discharge plant", span: "aspect-square" },
  { name: "green-belt", caption: "Greenery", span: "aspect-[4/3]" },
  { name: "unit2-greenbelt", caption: "Green belt at Unit II", span: "aspect-[4/3]" },
];

const SOCIAL: { t: string; d: string; icon: IconName }[] = [
  { t: "Education", icon: "users", d: "Synthokem actively contributes to the education of the girl child and financially challenged students — helping break the cycle of illiteracy by empowering children from economically and socially backward communities." },
  { t: "Support", icon: "message", d: "We participate in the mid-day meal scheme by Akshaya Patra, and support orphanages including Shanthiniketan and The United Orphanage for the Disabled, serving differently-abled individuals." },
  { t: "Healthcare", icon: "heart", d: "We are part of support initiatives by hospitals in Telangana that aid the treatment of underprivileged children and adults, and provide assistance to people living with HIV in association with the Network of HIV+ People." },
];

export default function SustainabilityPage() {
  return (
    <>
      <PageHero eyebrow="Social responsibility" title="Extending beyond business." lede="Conducting our business with complete respect for the environment, our people and the community — through long-term, sustainable initiatives led by our dedicated CSR wing." crumbs={[{ name: "Sustainability", href: "/sustainability/" }]} image="csr-environment" />
      <PageNav items={[{ id: "commitment", label: "Our commitment" }, { id: "environment", label: "Environment" }, { id: "energy", label: "Renewable energy" }, { id: "ehs", label: "Health & safety" }, { id: "community", label: "Community" }]} />

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

      <section id="environment" className="bg-surface py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
            <SectionHeading className="lg:col-span-7" eyebrow="Environment" title="Paving the way for a sustainable future." />
            <p className="text-muted lg:col-span-5">We strive to use natural resources efficiently and minimise the environmental impact of our activities and products. Beyond contributing to the World Wildlife Fund, we raise awareness among employees and equip our facilities with technology that ensures responsible practices.</p>
          </div>
          <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border md:grid-cols-3">
            {ENV.map((x, i) => (
              <Reveal as="li" key={x.t} delay={i * 80} className="bg-white p-8">
                <Icon name={x.icon} size={26} strokeWidth={1.4} className="text-accent-strong" />
                <h3 className="mt-8 text-xl font-semibold text-primary-ink">{x.t}</h3>
                <p className="mt-3 leading-relaxed text-muted">{x.d}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* PPT slides 28–29 */}
      <section id="energy" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Securing Mother Nature" title="Renewable energy, generated on site." size="md" />
            <div className="mt-10 space-y-4">
              {RENEWABLES.map((r, i) => (
                <Reveal key={r.unit} delay={i * 100} className="rounded-lg bg-white p-6 ring-1 ring-border">
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
            {ENERGY_PHOTOS.map((p, i) => (
              <Reveal as="li" key={p.name} variant="image" delay={(i % 2) * 90} className={`zoom-parent relative overflow-hidden rounded-lg bg-surface ${p.span}`}>
                <Img name={p.name} sizes={i === 0 ? "(min-width:1024px) 55vw, 100vw" : "(min-width:1024px) 28vw, 50vw"} className="zoom-img absolute inset-0 h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-3 pt-10 text-[0.82rem] font-medium text-white">{p.caption}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* PPT slides 24–27 */}
      <section id="ehs" className="bg-surface py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
            <div className="lg:col-span-6">
              <SectionHeading eyebrow="Environmental health & safety management" title="Our people are our real assets." size="md" />
              {EHS.intro.map((p, i) => <p key={i} className={i === 0 ? "lede mt-6 text-primary-ink" : "mt-4 leading-relaxed text-muted"}>{p}</p>)}
            </div>
            <Reveal className="flex flex-col justify-center rounded-lg bg-gradient-to-br from-primary to-accent-strong p-8 text-white sm:p-10 lg:col-span-6">
              <Icon name="message" size={28} className="text-accent-soft" />
              <blockquote className="mt-6">
                <p className="font-display text-[1.8rem] font-medium leading-snug tracking-[-0.015em] sm:text-[2.2rem]">“{EHS.quote.text}”</p>
                <footer className="mt-5 text-on-dark-muted">— {EHS.quote.by}</footer>
              </blockquote>
            </Reveal>
          </div>

          <div className="mt-16 rounded-lg bg-white p-6 ring-1 ring-border sm:p-10">
            <h3 className="eyebrow text-center text-muted">How leadership turns into safeguards</h3>
            <div className="mt-8"><EhsFlow /></div>
          </div>

          <div className="mt-6 grid grid-cols-1 gap-6 lg:grid-cols-2">
            <Reveal className="rounded-lg bg-white p-8 ring-1 ring-border sm:p-10">
              <div className="flex items-center justify-between gap-4">
                <h3 className="font-display text-2xl font-semibold text-primary-ink">SHE Policy</h3>
                <span className="rounded-full bg-primary-tint px-3 py-1 text-xs font-semibold text-primary">Safety · Health · Environment</span>
              </div>
              <p className="mt-5 font-medium text-text">{EHS.shePolicy.intro}</p>
              <ul className="mt-4 space-y-3">
                {EHS.shePolicy.points.map((x) => <li key={x} className="flex gap-3 text-[0.94rem] leading-relaxed text-muted"><Icon name="chevronRight" size={16} className="mt-1 shrink-0 text-accent-strong" />{x}</li>)}
              </ul>
              <p className="mt-6 border-t border-border pt-4 text-right text-sm font-semibold uppercase tracking-[0.1em] text-primary-ink">{EHS.shePolicy.signedBy}</p>
            </Reveal>
            <div className="flex flex-col gap-6">
              <Reveal delay={100} className="rounded-lg bg-white p-8 ring-1 ring-border sm:p-10">
                <h3 className="flex items-center gap-3 font-display text-2xl font-semibold text-primary-ink"><span className="grid h-10 w-10 place-items-center rounded-full bg-primary-tint text-primary"><Icon name="heart" size={20} /></span>Health &amp; hygiene</h3>
                <ul className="mt-6 space-y-3">
                  {EHS.health.map((x) => <li key={x} className="flex gap-3 text-[0.94rem] leading-relaxed text-muted"><Icon name="check" size={16} className="mt-1 shrink-0 text-accent-strong" />{x}</li>)}
                </ul>
              </Reveal>
              {EHS.standards.map((s, i) => (
                <Reveal key={s.t} delay={160 + i * 60} className="rounded-lg bg-white p-8 ring-1 ring-border">
                  <h3 className="flex items-center gap-3 text-lg font-semibold text-primary-ink"><Icon name={i === 0 ? "shield" : "hardHat"} size={22} className="text-accent-strong" />{s.t}</h3>
                  <p className="mt-3 text-[0.94rem] leading-relaxed text-muted">{s.d}</p>
                </Reveal>
              ))}
            </div>
          </div>
        </Container>
      </section>

      <section id="community" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="People & community" title="Empowering people through meaningful initiatives." size="md" />
            <p className="mt-6 text-muted">Our aim is to address the challenges faced by society and help those unable to care for their basic requirements. Our projects are not limited to financial help — we make a long-term commitment to their well-being.</p>
            <div className="mt-10 grid grid-cols-2 gap-3">
              <Reveal variant="image" className="zoom-parent overflow-hidden rounded-lg"><Img name="csr-education" sizes="(min-width:1024px) 20vw, 50vw" className="zoom-img aspect-square w-full object-cover" /></Reveal>
              <Reveal variant="image" delay={100} className="zoom-parent overflow-hidden rounded-lg"><Img name="csr-community" sizes="(min-width:1024px) 20vw, 50vw" className="zoom-img aspect-square w-full object-cover" /></Reveal>
            </div>
          </div>
          <div className="lg:col-span-7">
            <ol>
              {SOCIAL.map((x, i) => (
                <Reveal as="li" key={x.t} delay={i * 70} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-border py-8 last:border-b">
                  <Icon name={x.icon} size={24} strokeWidth={1.4} className="mt-1 text-accent-strong" />
                  <div><h3 className="text-xl font-semibold text-primary-ink">{x.t}</h3><p className="mt-2 leading-relaxed text-muted">{x.d}</p></div>
                </Reveal>
              ))}
            </ol>
            {/* PPT slide 30 */}
            <Reveal className="mt-10 rounded-lg bg-surface p-7 ring-1 ring-border sm:p-9">
              <Eyebrow>CSR policy</Eyebrow>
              <p className="mt-4 leading-relaxed text-text">{CSR.policy}</p>
              <p className="mt-3 leading-relaxed text-muted">{CSR.support}</p>
              <h3 className="mt-6 text-sm font-semibold text-primary-ink">Organisations and funds we have supported</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {CSR.supported.map((x) => <li key={x} className="rounded-full bg-white px-3.5 py-1.5 text-[0.85rem] font-medium text-primary-ink ring-1 ring-border">{x}</li>)}
              </ul>
            </Reveal>
          </div>
        </Container>
      </section>

      <section className="on-dark bg-primary py-16 text-white">
        <Container className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <p className="display-md max-w-2xl text-white">Responsible manufacturing is part of our quality story.</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/capabilities/manufacturing/#safety" variant="light">Safety & environment</ButtonLink>
            <ButtonLink href="/careers/" variant="outline-light">Careers</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
