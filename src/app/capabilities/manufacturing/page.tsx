import { PageHero, PageNav } from "@/components/layout/PageHero";
import { FacilitiesNetwork } from "@/components/diagrams/Diagrams";
import { CapacityBars, ProcessChain, UnitProfiles } from "@/components/sections/shared";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { COMMON_EQUIPMENT, TOTAL_CAPACITY_KL } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Manufacturing — Integrated API & Intermediate Facilities",
  description: `Two manufacturing units in Telangana and Andhra Pradesh with ${TOTAL_CAPACITY_KL} KL of reactor capacity: a USFDA-inspected unit at Pashamylaram and a WHO- and EU-compliant unit at JN Pharmacity. ISO 9001:2015, ISO 14001:2015 and ISO 45001:2018.`,
  path: "/capabilities/manufacturing/",
});

const GALLERY = ["reactor-operator", "cleanroom-processing", "qc-analyst", "warehouse-aisle", "materials-store", "warehouse-operations"];

export default function ManufacturingPage() {
  return (
    <>
      <PageHero eyebrow="Manufacturing" title="Advanced machinery. Latest technologies. Proven processes." lede="Delivering our value proposition throughout the lifecycle of the project, through two integrated manufacturing units in Telangana and Andhra Pradesh." crumbs={[{ name: "Capabilities", href: "/capabilities/" }, { name: "Manufacturing", href: "/capabilities/manufacturing/" }]} image="cleanroom-processing" />
      <PageNav items={[{ id: "philosophy", label: "Philosophy" }, { id: "process", label: "How we work" }, { id: "units", label: "Units" }, { id: "capacity", label: "Capacity" }, { id: "equipment", label: "Equipment" }, { id: "inside", label: "Inside" }, { id: "safety", label: "Safety" }]} />

      <section id="philosophy" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Manufacturing philosophy" title="From gram level to multi-ton supplies." size="md" />
            <p className="lede mt-6 text-muted">Quality is made possible by sustained effort and total dedication at every scale. Our manufacturing units combine world-class equipment, technologies and operational frameworks — with capabilities across a wide range of APIs and intermediates, having handled varied process reactions and high reactor volumes.</p>
          </div>
          <Reveal variant="image" className="zoom-parent overflow-hidden rounded-lg lg:col-span-6">
            <Img name="unit2-gate" width={1920} height={1116} sizes="(min-width:1024px) 50vw, 100vw" className="zoom-img aspect-[16/10] w-full object-cover" />
          </Reveal>
        </Container>
      </section>

      <section id="process" className="on-dark relative overflow-hidden sky-band py-20 text-white lg:py-28">
        <div aria-hidden="true" className="grid-paper-dark absolute inset-0" />
        <Container className="relative">
          <SectionHeading tone="light" eyebrow="How we work" title="Facility → technology → process → quality → delivery." />
          <div className="mt-16"><ProcessChain /></div>
        </Container>
      </section>

      {/* PPT slides 11–17 */}
      <section id="units" className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Manufacturing units · commercial scale" title="Two manufacturing units across two states." lede="Unit II in Telangana and Unit III in Andhra Pradesh, supported by our corporate office and R&D unit at Pashamylaram. Both are ISO 9001:2015 and GMP facilities." />
          <div className="mt-14"><FacilitiesNetwork /></div>
          <div className="mt-20 lg:mt-24"><UnitProfiles /></div>
        </Container>
      </section>

      {/* PPT slide 20 */}
      <section id="capacity" className="bg-surface py-20 lg:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Capacity" title={`${TOTAL_CAPACITY_KL} KL of reactor capacity.`} size="md" />
            <p className="mt-6 text-muted">Batches from small volumes to high-volume output across our two units — with adequate scope to expand for future projects.</p>
          </div>
          <div className="lg:col-span-7"><CapacityBars /></div>
        </Container>
      </section>

      {/* PPT slides 18–19 */}
      <section id="equipment" className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Common equipment in all units" title="The same process and utility backbone at every site." />
          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {[
              { t: "Process & finishing", icon: "flask" as const, items: COMMON_EQUIPMENT.process, img: "reactor-hall" },
              { t: "Utilities & safety", icon: "factory" as const, items: COMMON_EQUIPMENT.utilities, img: "purified-water-system" },
            ].map((g, i) => (
              <Reveal key={g.t} delay={i * 100} className="flex flex-col overflow-hidden rounded-lg bg-white ring-1 ring-border">
                <div className="zoom-parent relative aspect-[16/7] overflow-hidden">
                  <Img name={g.img} sizes="(min-width:1024px) 50vw, 100vw" className="zoom-img absolute inset-0 h-full w-full object-cover" />
                </div>
                <div className="p-7 sm:p-9">
                  <h3 className="flex items-center gap-3 text-xl font-semibold text-primary-ink"><span className="grid h-10 w-10 place-items-center rounded-full bg-primary-tint text-primary"><Icon name={g.icon} size={20} /></span>{g.t}</h3>
                  <ul className="mt-6 space-y-3">
                    {g.items.map((x) => <li key={x} className="flex gap-3 text-[0.95rem] leading-relaxed text-text"><Icon name="check" size={17} className="mt-1 shrink-0 text-accent-strong" />{x}</li>)}
                  </ul>
                </div>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      <section id="inside" className="bg-surface py-20 lg:py-24" aria-labelledby="inside-title">
        <Container>
          <h2 id="inside-title" className="eyebrow text-muted">Inside our facilities</h2>
          <ul className="mt-8 grid grid-cols-2 gap-3 lg:grid-cols-3">
            {GALLERY.map((g, i) => (
              <Reveal as="li" key={g} variant="image" delay={(i % 3) * 90} className={`zoom-parent relative overflow-hidden rounded-lg ${i === 0 ? "col-span-2 aspect-[16/10] lg:row-span-2 lg:aspect-auto" : "aspect-[4/3]"}`}>
                <Img name={g} sizes={i === 0 ? "(min-width:1024px) 66vw, 100vw" : "(min-width:1024px) 33vw, 50vw"} className="zoom-img absolute inset-0 h-full w-full object-cover" />
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section id="safety" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Safety & environment" title="Operating responsibly at every site." size="md" />
            <p className="mt-6 text-muted">Our full environment, health &amp; safety programme — SHE policy, health &amp; hygiene, and process safety standards — is set out on the sustainability page.</p>
          </div>
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border sm:grid-cols-2 lg:col-span-7">
            {[
              { t: "ISO 45001:2018", d: "Occupational health & safety management for Unit II — certified since 2015 (formerly OHSAS 18001).", i: "hardHat" as const },
              { t: "ISO 14001:2015", d: "Environmental management system certification for Unit II by DNV GL, renewed to date.", i: "leaf" as const },
              { t: "Renewable energy", d: "476 kW of solar PV across both units, plus solar water heaters and solar concentrators at Unit II.", i: "sun" as const },
              { t: "Zero liquid discharge", d: "ZLD facility and wastewater management; approximately 80% of non-hazardous and 60% of hazardous waste recycled.", i: "droplet" as const },
            ].map((x) => (
              <li key={x.t} className="bg-white p-7">
                <Icon name={x.i} size={24} strokeWidth={1.4} className="text-accent-strong" />
                <h3 className="mt-6 text-lg font-semibold text-primary-ink">{x.t}</h3>
                <p className="mt-2 text-[0.95rem] text-muted">{x.d}</p>
              </li>
            ))}
          </ul>
        </Container>
        <Container className="mt-14 flex flex-wrap gap-3">
          <ButtonLink href="/sustainability/#ehs">Health &amp; safety</ButtonLink>
          <ButtonLink href="/quality/" variant="secondary">Quality systems</ButtonLink>
          <ButtonLink href="/contact/?intent=partner" variant="secondary">Partner with us</ButtonLink>
        </Container>
      </section>
    </>
  );
}
