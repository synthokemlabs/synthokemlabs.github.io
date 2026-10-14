import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { LeadershipGrid } from "@/components/sections/Leadership";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/client";
import { Icon } from "@/components/ui/Icon";
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

      <section id="team" className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Leadership team" title="Board of Directors and management." size="md" />
          <div className="mt-14"><LeadershipGrid /></div>

          {/* The message itself lives on its own page; this is only the way in */}
          <Reveal className="mt-14">
            <Link href="/about/chairperson/" className="group flex flex-col gap-5 rounded-xl bg-gradient-to-br from-primary to-accent-strong p-7 text-white transition-shadow duration-500 hover:shadow-[0_24px_48px_-26px_rgb(10_45_80/0.6)] sm:flex-row sm:items-center sm:justify-between sm:p-9">
              <span>
                <span className="text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-accent-soft">Message from the Chairperson</span>
                <span className="mt-2 block font-display text-xl font-semibold sm:text-2xl">{CHAIRPERSON.name}</span>
              </span>
              <span className="inline-flex shrink-0 items-center gap-2 rounded-full bg-white px-5 py-2.5 text-sm font-semibold text-primary-ink">Read the message <Icon name="arrowRight" size={16} className="arrow-nudge" /></span>
            </Link>
          </Reveal>
        </Container>
      </section>
    </>
  );
}
