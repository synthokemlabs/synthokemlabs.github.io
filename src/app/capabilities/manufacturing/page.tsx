import { PageHero, PageNav } from "@/components/layout/PageHero";
import { SitesStory } from "@/components/sections/SitesStory";
import { CapacityRing, ProcessTrain, UtilitiesGrid } from "@/components/sections/ManufacturingSections";
import { ScrollStatement } from "@/components/sections/ScrollStatement";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { TOTAL_CAPACITY_KL } from "@/data/company";
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
      <PageNav items={[{ id: "sites", label: "Our sites" }, { id: "capacity", label: "Capacity" }, { id: "equipment", label: "Equipment" }, { id: "safety", label: "Safety" }]} />

      {/* Statement lights up word by word as it scrolls past */}
      <section id="philosophy" className="py-24 lg:py-32">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal variant="image" className="zoom-parent relative overflow-hidden rounded-2xl lg:col-span-4">
            <Img name="materials-store" sizes="(min-width:1024px) 30vw, 100vw" className="zoom-img aspect-[4/3] w-full object-cover lg:aspect-[4/5]" />
          </Reveal>
          <div className="lg:col-span-8">
            <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-muted">Manufacturing philosophy</p>
            <ScrollStatement
              className="mt-6 font-display text-[clamp(1.6rem,2.3vw+0.75rem,2.75rem)] font-medium leading-[1.22] tracking-[-0.02em] text-primary-ink"
              text="From gram level to multi-ton supplies — quality made possible by sustained effort and total dedication at every scale, across two integrated GMP manufacturing units."
            />
          </div>
        </Container>
      </section>

      {/* PPT slides 11–17: the map stays pinned while each unit scrolls past */}
      <section id="sites" className="border-t border-border bg-surface py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Our sites · commercial scale" title="Two units. Two states. One standard." lede="Unit II at Pashamylaram, Telangana — with our corporate office and R&D unit — and Unit III at JN Pharmacity, Andhra Pradesh. Both are ISO 9001:2015 and GMP facilities." />
          <div className="mt-14"><SitesStory /></div>
        </Container>
      </section>

      {/* PPT slide 20 */}
      <section id="capacity" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Capacity" title="Built for batches of every size." size="md" />
            <p className="mt-6 text-muted">From small volumes to high-volume output, with adequate scope to expand for future projects.</p>
          </div>
          <div className="lg:col-span-7"><CapacityRing /></div>
        </Container>
      </section>

      {/* PPT slides 18–19 */}
      <section id="equipment" className="bg-surface py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Common equipment in all units" title="From reactor to finished product." lede="The same process line at every site — and the utilities that keep it running." />
          <div className="mt-16"><ProcessTrain /></div>
          <h3 className="eyebrow mt-20 text-muted">Utilities</h3>
          <div className="mt-6"><UtilitiesGrid /></div>
        </Container>
      </section>

      {/* Certifications and EHS detail live on Quality and Sustainability; this is the way there */}
      <section id="safety" className="on-dark relative isolate overflow-hidden sky-band py-20 text-white">
        <span aria-hidden="true" className="vmv-orb -left-24 -top-32 h-[24rem] w-[24rem] bg-[#3fa8ee]" />
        <span aria-hidden="true" className="vmv-orb vmv-orb-b -bottom-40 right-[-6rem] h-[26rem] w-[26rem] bg-[#22b8c9]" />
        <Container className="flex flex-col justify-between gap-8 lg:flex-row lg:items-center">
          <Reveal className="max-w-2xl">
            <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-accent-soft">Safety & environment</p>
            <p className="display-md mt-3 text-white">Operating responsibly at every site.</p>
            <p className="mt-3 text-on-dark-muted">ISO 45001:2018 and ISO 14001:2015 systems, solar power and a zero liquid discharge facility.</p>
          </Reveal>
          <Reveal delay={150} className="flex flex-wrap gap-3">
            <ButtonLink href="/sustainability/#ehs" variant="light">Health &amp; safety</ButtonLink>
            <ButtonLink href="/sustainability/#environment" variant="outline-light">Environment</ButtonLink>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
