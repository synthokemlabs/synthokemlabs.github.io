import { PageHero, PageNav } from "@/components/layout/PageHero";
import { FacilitiesNetwork } from "@/components/diagrams/Diagrams";
import { CapacityBars, UnitProfiles } from "@/components/sections/shared";
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

export default function ManufacturingPage() {
  return (
    <>
      <PageHero eyebrow="Manufacturing" title="Advanced machinery. Latest technologies. Proven processes." lede="Delivering our value proposition throughout the lifecycle of the project, through two integrated manufacturing units in Telangana and Andhra Pradesh." crumbs={[{ name: "Capabilities", href: "/capabilities/" }, { name: "Manufacturing", href: "/capabilities/manufacturing/" }]} image="cleanroom-processing" />
      <PageNav items={[{ id: "philosophy", label: "Philosophy" }, { id: "units", label: "Units" }, { id: "capacity", label: "Capacity" }, { id: "equipment", label: "Equipment" }, { id: "safety", label: "Safety" }]} />

      <section id="philosophy" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Manufacturing philosophy" title="From gram level to multi-ton supplies." size="md" />
            <p className="lede mt-6 text-muted">Quality is made possible by sustained effort and total dedication at every scale. Our manufacturing units combine world-class equipment, technologies and operational frameworks — with capabilities across a wide range of APIs and intermediates, having handled varied process reactions and high reactor volumes.</p>
          </div>
          <Reveal variant="image" className="zoom-parent overflow-hidden rounded-lg lg:col-span-6">
            <Img name="materials-store" sizes="(min-width:1024px) 50vw, 100vw" className="zoom-img aspect-[16/10] w-full object-cover" />
          </Reveal>
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
              { t: "Process & finishing", icon: "flask" as const, items: COMMON_EQUIPMENT.process, img: "reactor-operator" },
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

      {/* Certifications and EHS detail live on Quality and Sustainability; this is the way there */}
      <section id="safety" className="on-dark sky-band py-16 text-white">
        <Container className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <div className="max-w-2xl">
            <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent-soft">Safety & environment</p>
            <p className="display-md mt-3 text-white">Operating responsibly at every site.</p>
            <p className="mt-3 text-on-dark-muted">ISO 45001:2018 and ISO 14001:2015 systems, solar power and a zero liquid discharge facility.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/sustainability/#ehs" variant="light">Health &amp; safety</ButtonLink>
            <ButtonLink href="/sustainability/#environment" variant="outline-light">Environment</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
