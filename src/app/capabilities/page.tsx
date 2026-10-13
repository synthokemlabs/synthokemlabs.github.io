import Link from "next/link";
import { PageHero, PageNav } from "@/components/layout/PageHero";
import { SpecialisationGrid } from "@/components/sections/shared";
import { ButtonLink, Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { Counter, Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { ANALYTICAL_DEVELOPMENT, CDMO, PILLARS, RND_LABS, RND_TEAM } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Capabilities — CDMO, Process Chemistry & R&D",
  description: "Synthokem's capabilities: CDMO and co-development partnerships, 23 reaction chemistries from Friedel–Crafts acylation to hydrogenation and cross-coupling, a synthesis lab and 21 CFR Part 11 analytical R&D lab, and an experienced R&D team.",
  path: "/capabilities/",
});

const DEVELOPMENT = [
  { t: "New and off-patent APIs", d: "Producing cutting-edge intermediates for new as well as off-patent APIs, within the time frame stipulated by our customers." },
  { t: "A pipeline of new products", d: "Investing in scientific and technical excellence to continually improve and develop products that meet the needs of patients, payers and consumers." },
  { t: "Analytical methods", d: "Developing novel analytical methods for new products, and supporting customers during product and method development and validation." },
  { t: "Regulatory readiness", d: "Ensuring all APIs and processes developed for various markets comply with applicable regulatory requirements." },
];

export default function CapabilitiesPage() {
  return (
    <>
      <PageHero eyebrow="Capabilities" title="Translating fundamental science into pharmaceutical solutions." lede="Evolving process chemistry, advanced capabilities and backward integration — from gram level to multi-ton supplies." crumbs={[{ name: "Capabilities", href: "/capabilities/" }]} image="reactor-operator" />
      <PageNav items={[{ id: "cdmo", label: "CDMO" }, { id: "specialisation", label: "Chemistry" }, { id: "rnd", label: "R&D labs" }, { id: "analytical", label: "Analytical" }, { id: "team", label: "R&D team" }, { id: "development", label: "Development" }]} />

      <section className="py-20 lg:py-28">
        <Container>
          <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border md:grid-cols-3">
            {PILLARS.map((p, i) => (
              <Reveal as="li" key={p.title} delay={i * 80} className="bg-white p-8">
                <Icon name={(["factory", "users", "flask"] as const)[i]} size={28} strokeWidth={1.3} className="text-accent-strong" />
                <h2 className="mt-8 text-xl font-semibold text-primary-ink">{p.title}</h2>
                <p className="mt-3 text-muted">{p.body}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* PPT slide 6 */}
      <section id="cdmo" className="bg-surface py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Contract development & manufacturing (CDMO)" title="Your process. Our plants, people and practices." size="md" />
            <p className="mt-6 leading-relaxed text-muted">{CDMO.lead}</p>
            <div className="mt-8"><ButtonLink href="/contact/?intent=partner">Discuss a project</ButtonLink></div>
          </div>
          <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:col-span-7">
            {CDMO.points.map((p, i) => (
              <Reveal as="li" key={p.t} delay={i * 80} className="lift rounded-lg bg-white p-7 ring-1 ring-border">
                <span className="grid h-11 w-11 place-items-center rounded-full bg-primary-tint text-primary"><Icon name={p.icon} size={21} /></span>
                <h3 className="mt-6 text-lg font-semibold text-primary-ink">{p.t}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{p.d}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      {/* PPT slide 7 */}
      <section id="specialisation" className="py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading className="lg:col-span-7" eyebrow="Synthetic chemistry capabilities" title="Reaction chemistries we run at scale." />
            <p className="text-muted lg:col-span-5">Progressive and proactive, dynamic and innovative — Synthokem has handled varied process reactions and high reactor volumes across a wide range of APIs and intermediates.</p>
          </div>
          <div className="mt-14"><SpecialisationGrid /></div>
        </Container>
      </section>

      {/* PPT slide 9 */}
      <section id="rnd" className="bg-surface py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Research & Development" title="Two labs working as one: synthesis and analytical R&D." lede="Our R&D unit, at the corporate office in Pashamylaram, runs reactions from milligram to kilogram scale — backed by its own analytical R&D laboratory." />
          <div className="mt-14 grid grid-cols-1 gap-6 lg:grid-cols-2">
            {RND_LABS.map((lab, i) => (
              <Reveal key={lab.t} delay={i * 100} className="rounded-lg bg-white p-7 ring-1 ring-border sm:p-9">
                <div className="flex items-center gap-4">
                  <span className="grid h-12 w-12 shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent-strong text-white"><Icon name={i === 0 ? "flask" : "grid"} size={22} /></span>
                  <div><h3 className="text-xl font-semibold text-primary-ink">{lab.t}</h3><p className="text-[0.92rem] text-muted">{lab.d}</p></div>
                </div>
                <ul className="mt-7 grid grid-cols-1 gap-x-6 gap-y-3 sm:grid-cols-2">
                  {lab.items.map((x) => <li key={x} className="flex gap-2.5 text-[0.93rem] leading-snug text-text"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-accent-strong" />{x}</li>)}
                </ul>
              </Reveal>
            ))}
          </div>
        </Container>
      </section>

      {/* PPT slide 8 */}
      <section id="analytical" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal variant="image" className="zoom-parent relative overflow-hidden rounded-lg lg:col-span-6">
            <Img name="analytical-lab" sizes="(min-width:1024px) 50vw, 100vw" className="zoom-img aspect-[5/4] w-full object-cover" />
          </Reveal>
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Analytical development" title="Methods that stand up to regulators." size="md" />
            <ol className="mt-8">
              {ANALYTICAL_DEVELOPMENT.map((x, i) => (
                <Reveal as="li" key={x} delay={i * 50} className="grid grid-cols-[2.5rem_1fr] gap-3 border-t border-border py-3.5 last:border-b">
                  <span className="font-mono text-xs text-accent-strong">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-medium text-primary-ink">{x}</span>
                </Reveal>
              ))}
            </ol>
          </div>
        </Container>
      </section>

      {/* PPT slide 10 */}
      <section id="team" className="on-dark relative overflow-hidden sky-band py-20 text-white lg:py-28">
        <div aria-hidden="true" className="grid-paper-dark absolute inset-0" />
        <Container className="relative grid grid-cols-1 gap-14 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-6">
            <SectionHeading tone="light" eyebrow="Our talent pool" title="Experienced chemists behind every route." size="md" />
            <dl className="mt-10 grid grid-cols-2 gap-6">
              {RND_TEAM.stats.map((s) => (
                <div key={s.l} className="border-t border-white/25 pt-4">
                  <dd className="font-display text-5xl font-semibold tracking-tight text-white"><Counter value={s.v} suffix={s.suffix} /></dd>
                  <dt className="mt-2 text-sm text-on-dark-muted">{s.l}</dt>
                </div>
              ))}
            </dl>
            <p className="mt-8 text-on-dark-muted">{RND_TEAM.note}</p>
          </div>
          <Reveal delay={120} className="lg:col-span-6">
            <Eyebrow tone="light">Literature support</Eyebrow>
            <ul className="mt-6 space-y-3">
              {RND_TEAM.literature.map((x) => (
                <li key={x} className="flex items-start gap-4 rounded-lg bg-white/10 p-4 ring-1 ring-white/15">
                  <Icon name="book" size={20} className="mt-0.5 shrink-0 text-accent-soft" />
                  <span className="text-on-dark">{x}</span>
                </li>
              ))}
            </ul>
          </Reveal>
        </Container>
      </section>

      <section id="development" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="R&D and development" title="Developing what comes next." size="md" />
            <Reveal variant="image" className="zoom-parent mt-10 overflow-hidden rounded-lg">
              <Img name="unit3-lab" sizes="(min-width:1024px) 40vw, 100vw" className="zoom-img aspect-[4/3] w-full object-cover" />
            </Reveal>
          </div>
          <ol className="lg:col-span-7">
            {DEVELOPMENT.map((x, i) => (
              <Reveal as="li" key={x.t} delay={i * 60} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-border py-7 last:border-b">
                <span className="font-mono text-sm text-accent-strong">0{i + 1}</span>
                <div><h3 className="text-xl font-semibold text-primary-ink">{x.t}</h3><p className="mt-2 leading-relaxed text-muted">{x.d}</p></div>
              </Reveal>
            ))}
            <div className="mt-10 flex flex-wrap gap-3">
              <ButtonLink href="/contact/?intent=partner">Partner with us</ButtonLink>
              <ButtonLink href="/products/" variant="secondary">View products</ButtonLink>
            </div>
          </ol>
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
