import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { SpecialisationGrid } from "@/components/sections/shared";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { PILLARS } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Capabilities — Process Chemistry & Areas of Specialisation",
  description: "Synthokem's capabilities in process chemistry: chloromethylation, halogenation, hydrogenation, high-vacuum distillation, Friedel–Crafts acylation, Darzens reaction and more — from gram scale to multi-ton supply.",
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

      <section id="specialisation" className="bg-surface py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 gap-8 lg:grid-cols-12 lg:items-end">
            <SectionHeading className="lg:col-span-7" eyebrow="Areas of specialisation" title="Reaction chemistries we run at scale." />
            <p className="text-muted lg:col-span-5">Progressive and proactive, dynamic and innovative — Synthokem has handled varied process reactions and high reactor volumes across a wide range of APIs and intermediates.</p>
          </div>
          <div className="mt-14"><SpecialisationGrid /></div>
        </Container>
      </section>

      <section id="development" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="R&D and development" title="Developing what comes next." size="md" />
            <Reveal variant="image" className="zoom-parent mt-10 overflow-hidden rounded-lg">
              <Img name="lab-precision" sizes="(min-width:1024px) 40vw, 100vw" className="zoom-img aspect-[4/3] w-full object-cover" />
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

      <section className="on-dark bg-primary-ink py-20 text-white">
        <Container>
          <div className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-white/10 md:grid-cols-2">
          {[
            { href: "/capabilities/manufacturing/", t: "Manufacturing", d: "Integrated facilities, from technology to delivery.", img: "cleanroom-processing" },
            { href: "/quality/", t: "Quality systems", d: "Quality control, assurance and regulatory affairs.", img: "qc-analyst" },
          ].map((x) => (
            <Link key={x.href} href={x.href} className="zoom-parent group relative isolate flex min-h-72 flex-col justify-end overflow-hidden p-8 sm:p-10">
              <Img name={x.img} sizes="(min-width:768px) 50vw, 100vw" className="zoom-img absolute inset-0 -z-20 h-full w-full object-cover" alt="" />
              <span aria-hidden="true" className="absolute inset-0 -z-10 bg-gradient-to-t from-primary-ink via-primary-ink/70 to-primary-ink/20" />
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
