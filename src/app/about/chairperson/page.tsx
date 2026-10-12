import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { CHAIRPERSON } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Message from the Chairperson",
  description: `A message from ${CHAIRPERSON.name}, Chairperson of Synthokem Labs: “${CHAIRPERSON.quote}”`,
  path: "/about/chairperson/",
});

export default function ChairpersonPage() {
  const initials = CHAIRPERSON.name.split(" ").map((n) => n[0]).join("");
  return (
    <>
      <PageHero eyebrow="Leadership" title="Message from the Chairperson." crumbs={[{ name: "About", href: "/about/" }, { name: "Chairperson's message", href: "/about/chairperson/" }]} size="sm" />
      <article className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <aside className="lg:col-span-4">
            <div className="lg:sticky lg:top-28">
              {/* Portrait placeholder: no approved portrait was available on the previous site. */}
              <div className="grid-paper relative grid aspect-[4/5] place-items-center overflow-hidden rounded-lg bg-primary-tint" role="img" aria-label={`${CHAIRPERSON.name} monogram`}>
                <span className="font-display text-8xl font-semibold tracking-tight text-primary/80">{initials}</span>
              </div>
              <p className="mt-6 text-xl font-semibold text-primary-ink">{CHAIRPERSON.name}</p>
              <p className="eyebrow mt-1 text-muted">{CHAIRPERSON.title}, Synthokem Labs</p>
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
              <ButtonLink href="/about/journey/">Our journey</ButtonLink>
              <ButtonLink href="/about/" variant="secondary">About Synthokem</ButtonLink>
            </div>
          </div>
        </Container>
      </article>
    </>
  );
}
