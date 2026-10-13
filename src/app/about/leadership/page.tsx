import { PageHero, PageNav } from "@/components/layout/PageHero";
import { LeadershipGrid } from "@/components/sections/Leadership";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/client";
import { CHAIRPERSON, LEADERSHIP } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Leadership — Board of Directors & Management",
  description: `The leadership of Synthokem Labs: ${LEADERSHIP.map((p) => `${p.name}, ${p.role}`).join("; ")}.`,
  path: "/about/leadership/",
});

export default function LeadershipPage() {
  return (
    <>
      <PageHero eyebrow="Leadership" title="The people leading Synthokem." lede="A board and management team guiding the company's growth in APIs and intermediates since 1978." crumbs={[{ name: "About", href: "/about/" }, { name: "Leadership", href: "/about/leadership/" }]} size="sm" />
      <PageNav items={[{ id: "team", label: "Board & management" }, { id: "message", label: "Chairperson’s message" }]} />

      <section id="team" className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Leadership team" title="Board of Directors and management." size="md" />
          <div className="mt-14"><LeadershipGrid /></div>
        </Container>
      </section>

      <section id="message" className="bg-surface py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Message from the Chairperson" title={`${CHAIRPERSON.name}`} size="md" />
            <p className="mt-3 text-muted">{CHAIRPERSON.title}, Synthokem Labs</p>
          </div>
          <Reveal className="lg:col-span-7">
            <blockquote className="border-l-2 border-accent-strong pl-6 sm:pl-8">
              <p className="font-display text-[1.6rem] font-medium leading-snug tracking-[-0.015em] text-primary-ink sm:text-[2rem]">“{CHAIRPERSON.quote}”</p>
            </blockquote>
            <div className="mt-8 space-y-4 text-[1.05rem] leading-relaxed text-muted">
              {CHAIRPERSON.message.slice(0, 2).map((p) => <p key={p}>{p}</p>)}
            </div>
            <div className="mt-8"><ButtonLink href="/about/chairperson/">Read the Chairperson’s full message</ButtonLink></div>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
