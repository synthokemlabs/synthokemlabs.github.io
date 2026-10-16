import { PageHero } from "@/components/layout/PageHero";
import { PortraitPlaceholder } from "@/components/sections/Leadership";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { CHAIRPERSON } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Message from the Chairperson",
  description: `A message from ${CHAIRPERSON.name}, Chairperson of Synthokem Labs: “${CHAIRPERSON.quote}”`,
  path: "/about/chairperson/",
});

export default function ChairpersonPage() {
  return (
    <>
      <PageHero eyebrow="Leadership" title="Message from the Chairperson." crumbs={[{ name: "About", href: "/about/" }, { name: "Leadership", href: "/about/leadership/" }, { name: "Chairperson's message", href: "/about/chairperson/" }]} size="sm" />
      <article className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            {/* Phones and tablets: the portrait sits beside the name; on desktop it heads a sticky column */}
            <div className="flex items-center gap-5 lg:sticky lg:top-28 lg:block">
              {/* Same portrait placeholder as the leadership cards, until a headshot is supplied */}
              <PortraitPlaceholder className="relative aspect-[4/5] w-24 shrink-0 rounded-xl ring-1 ring-border sm:w-32 lg:w-auto" />
              <div>
                <p className="text-xl font-semibold text-primary-ink lg:mt-6">{CHAIRPERSON.name}</p>
                <p className="eyebrow mt-1 text-muted">{CHAIRPERSON.title}, Synthokem Labs</p>
              </div>
            </div>
          </aside>
          <div className="lg:col-span-8">
            <blockquote className="border-l-2 border-accent-strong pl-6 sm:pl-10">
              <p className="font-display text-[1.9rem] font-medium leading-[1.2] tracking-[-0.02em] text-primary-ink sm:text-[2.8rem]">“{CHAIRPERSON.quote}”</p>
            </blockquote>
            <div className="mt-12 max-w-2xl space-y-6 text-[1.1rem] leading-[1.75] text-text">
              {CHAIRPERSON.message.map((p, i) => <p key={i}>{p}</p>)}
            </div>
            <p className="mt-10 font-display text-lg font-semibold text-primary-ink">— {CHAIRPERSON.name}</p>
            <div className="mt-12 flex flex-wrap gap-3 border-t border-border pt-8">
              <ButtonLink href="/about/leadership/">Meet the leadership team</ButtonLink>
              <ButtonLink href="/about/journey/" variant="secondary">Our journey</ButtonLink>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
