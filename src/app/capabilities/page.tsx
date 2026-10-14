import Link from "next/link";
import { PageHero, PageNav } from "@/components/layout/PageHero";
import { ChemistryCloud, LifecycleFlow } from "@/components/sections/CapabilitySections";
import { RndTabs, type RndTab } from "@/components/sections/RndTabs";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { Counter, Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { ANALYTICAL_DEVELOPMENT, CDMO, RND_LABS, RND_TEAM, SPECIALISATIONS, TOTAL_CAPACITY_KL } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Capabilities — CDMO, Process Chemistry & R&D",
  description: `Synthokem's capabilities from lab to market: process R&D from milligram to kilogram scale, analytical development, ${TOTAL_CAPACITY_KL} KL of GMP manufacturing, regulatory support, CDMO partnerships and ${SPECIALISATIONS.length} reaction chemistries.`,
  path: "/capabilities/",
});

const FIGURES = [
  { v: SPECIALISATIONS.length, l: "Reaction chemistries" },
  { v: TOTAL_CAPACITY_KL, suffix: " KL", l: "Reactor capacity" },
  { v: 15, suffix: "+", l: "R&D chemists" },
  { v: 10, suffix: "+ yrs", l: "Average R&D experience" },
];

// PPT slides 8–10, as three tabs
const RND: RndTab[] = [
  { id: "synthesis", label: "Synthesis lab", short: "Synthesis", intro: `${RND_LABS[0].d} Route and process development before scale-up to the plant.`, groups: [{ title: "Facilities", items: RND_LABS[0].items }] },
  { id: "analytical", label: "Analytical R&D", short: "Analytical", intro: RND_LABS[1].d, groups: [{ title: "Instruments", items: RND_LABS[1].items }, { title: "Services", items: ANALYTICAL_DEVELOPMENT }] },
  { id: "team", label: "Team & literature", short: "Team", intro: `${RND_TEAM.stats[0].v}+ ${RND_TEAM.stats[0].l.toLowerCase()} averaging ${RND_TEAM.stats[1].v}+ years of experience. ${RND_TEAM.note}`, groups: [{ title: "Literature support", items: RND_TEAM.literature }] },
];

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero eyebrow="Capabilities" title="Translating fundamental science into pharmaceutical solutions." lede="Evolving process chemistry, advanced capabilities and backward integration — from gram level to multi-ton supplies." crumbs={[{ name: "Capabilities", href: "/capabilities/" }]} image="reactor-operator" />
      <PageNav items={[{ id: "lifecycle", label: "Lab to market" }, { id: "cdmo", label: "CDMO" }, { id: "chemistry", label: "Chemistry" }, { id: "rnd", label: "R&D" }]} />

      <section aria-label="Key figures" className="border-b border-border py-12">
        <Container>
          <dl className="grid grid-cols-2 gap-x-6 gap-y-8 lg:grid-cols-4">
            {FIGURES.map((f) => (
              <div key={f.l} className="flex flex-col border-l-2 border-primary/80 pl-5">
                <dd className="font-display text-4xl font-semibold tracking-tight text-primary"><Counter value={f.v} suffix={f.suffix} /></dd>
                <dt className="order-2 mt-1.5 text-sm text-muted">{f.l}</dt>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      <section id="lifecycle" className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="From lab to market" title="One partner from first route to commercial supply." lede="Development, analytics, manufacturing and regulatory work under one roof." />
          <div className="mt-16"><LifecycleFlow /></div>
        </Container>
      </section>

      {/* PPT slide 6 */}
      <section id="cdmo" className="on-dark relative isolate overflow-hidden sky-band py-20 text-white lg:py-24">
        <div aria-hidden="true" className="grid-paper-dark absolute inset-0 -z-10" />
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading tone="light" eyebrow="Contract development & manufacturing" title="Your process. Our plants, people and practices." size="md" />
            <p className="lede mt-6 text-on-dark-muted">{CDMO.short}</p>
            <ul className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-2">
              {CDMO.highlights.map((h, i) => (
                <Reveal as="li" key={h} delay={i * 80} className="flex items-start gap-3 rounded-lg bg-white/10 px-4 py-3 ring-1 ring-white/15">
                  <Icon name="check" size={18} className="mt-0.5 shrink-0 text-accent-soft" />
                  <span className="text-[0.93rem] font-medium text-white">{h}</span>
                </Reveal>
              ))}
            </ul>
            <div className="mt-9"><ButtonLink href="/contact/?intent=partner" variant="light">Discuss a project</ButtonLink></div>
          </div>
          <Reveal variant="image" delay={150} className="zoom-parent relative overflow-hidden rounded-xl lg:col-span-6">
            <Img name="unit3-production" sizes="(min-width:1024px) 45vw, 100vw" className="zoom-img aspect-[4/3] w-full object-cover" />
          </Reveal>
        </Container>
      </section>

      {/* PPT slide 7 */}
      <section id="chemistry" className="py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading className="lg:col-span-7" eyebrow="Synthetic chemistry" title={`${SPECIALISATIONS.length} reaction chemistries, run at scale.`} />
            <p className="text-muted lg:col-span-5">Varied process reactions and high reactor volumes across a wide range of APIs and intermediates.</p>
          </div>
          <div className="mt-12"><ChemistryCloud /></div>
        </Container>
      </section>

      {/* PPT slides 8–10 */}
      <section id="rnd" className="bg-surface py-20 lg:py-28">
        <Container className="grid grid-cols-1 items-start gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Research & Development" title="Two labs and an experienced team." size="md" />
            <Reveal variant="image" className="zoom-parent relative mt-8 overflow-hidden rounded-xl">
              <Img name="analytical-lab" sizes="(min-width:1024px) 40vw, 100vw" className="zoom-img aspect-[5/4] w-full object-cover" />
              <span className="absolute bottom-4 left-4 rounded-full bg-white/90 px-3.5 py-1.5 text-xs font-semibold text-primary-ink shadow-sm backdrop-blur-sm">21 CFR Part 11 compliant</span>
            </Reveal>
          </div>
          <div className="lg:col-span-7 lg:pt-4">
            <RndTabs tabs={RND} />
          </div>
        </Container>
      </section>

      <section className="on-dark sky-band py-20 text-white">
        <Container>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-white/10 md:grid-cols-2">
          {[
            { href: "/capabilities/manufacturing/", t: "Manufacturing", d: "Integrated facilities, from technology to delivery.", img: "cleanroom-processing" },
            { href: "/quality/", t: "Quality systems", d: "Quality control, assurance and regulatory affairs.", img: "qc-analyst" },
          ].map((x) => (
            <Link key={x.href} href={x.href} className="zoom-parent group relative isolate flex min-h-72 flex-col justify-end overflow-hidden p-8 sm:p-10">
              <Img name={x.img} sizes="(min-width:768px) 50vw, 100vw" className="zoom-img absolute inset-0 -z-20 h-full w-full object-cover" alt="" />
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-deep via-deep/70 to-deep/20" />
              <span className="font-display text-3xl font-semibold">{x.t}</span>
              <span className="mt-2 flex items-center justify-between text-on-dark-muted">{x.d}<Icon name="arrowRight" size={20} className="arrow-nudge text-white" /></span>
            </Link>
          ))}
          </div>
        </Container>
      </section>
    </>
  );
}
