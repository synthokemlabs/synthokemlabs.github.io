import { PageHero, PageNav } from "@/components/layout/PageHero";
import { FacilitiesNetwork } from "@/components/diagrams/Diagrams";
import { FacilityCards, ProcessChain } from "@/components/sections/shared";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Manufacturing — Integrated API & Intermediate Facilities",
  description: "Three integrated manufacturing facilities in Telangana and Andhra Pradesh with high-end machinery, USFDA-inspected and WHO-GMP certified units, ISO 14001 and OHSAS 18001 systems.",
  path: "/capabilities/manufacturing/",
});

const GALLERY = ["reactor-operator", "cleanroom-processing", "qc-analyst", "warehouse-aisle", "materials-store", "warehouse-operations"];

export default function ManufacturingPage() {
  return (
    <>
      <PageHero eyebrow="Manufacturing" title="Advanced machinery. Latest technologies. Proven processes." lede="Delivering our value proposition throughout the lifecycle of the project, through integrated manufacturing facilities spread across three locations." crumbs={[{ name: "Capabilities", href: "/capabilities/" }, { name: "Manufacturing", href: "/capabilities/manufacturing/" }]} image="cleanroom-processing" />
      <PageNav items={[{ id: "philosophy", label: "Philosophy" }, { id: "process", label: "How we work" }, { id: "units", label: "Units" }, { id: "inside", label: "Inside" }, { id: "safety", label: "Safety" }]} />

      <section id="philosophy" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Manufacturing philosophy" title="From gram level to multi-ton supplies." size="md" />
            <p className="lede mt-6 text-muted">Quality is made possible by sustained effort and total dedication at every scale. Our manufacturing units combine world-class equipment, technologies and operational frameworks — with capabilities across a wide range of APIs and intermediates, having handled varied process reactions and high reactor volumes.</p>
          </div>
          <Reveal variant="image" className="zoom-parent overflow-hidden rounded-lg lg:col-span-6">
            <Img name="facility-aerial" sizes="(min-width:1024px) 50vw, 100vw" className="zoom-img aspect-[16/10] w-full object-cover" />
          </Reveal>
        </Container>
      </section>

      <section id="process" className="on-dark relative overflow-hidden bg-primary-ink py-20 text-white lg:py-28">
        <div aria-hidden="true" className="grid-paper-dark absolute inset-0" />
        <Container className="relative">
          <SectionHeading tone="light" eyebrow="How we work" title="Facility → technology → process → quality → delivery." />
          <div className="mt-16"><ProcessChain /></div>
        </Container>
      </section>

      <section id="units" className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Manufacturing units" title="Three facilities across two states." lede="Units in Telangana and Andhra Pradesh, supported by our corporate office at Pashamylaram." />
          <div className="mt-14"><FacilitiesNetwork /></div>
          <div className="mt-14"><FacilityCards /></div>
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
          </div>
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border sm:grid-cols-2 lg:col-span-7">
            {[
              { t: "OHSAS 18001", d: "Occupational health & safety certification for Unit II by DNV GL, renewed to date.", i: "shield" as const },
              { t: "ISO 14001", d: "Environmental management system certification for Unit II by DNV GL, renewed to date.", i: "leaf" as const },
              { t: "Renewable energy", d: "Facilities powered by renewable sources — among the first pharma companies in India to harvest solar energy.", i: "factory" as const },
              { t: "Wastewater & waste", d: "Wastewater management at all facilities; approximately 80% of non-hazardous and 60% of hazardous waste recycled.", i: "globe" as const },
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
          <ButtonLink href="/quality/">Quality systems</ButtonLink>
          <ButtonLink href="/sustainability/" variant="secondary">Sustainability</ButtonLink>
          <ButtonLink href="/contact/?intent=partner" variant="secondary">Partner with us</ButtonLink>
        </Container>
      </section>
    </>
  );
}
