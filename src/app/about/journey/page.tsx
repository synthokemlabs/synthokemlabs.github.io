import { PageHero } from "@/components/layout/PageHero";
import { Timeline } from "@/components/sections/Timeline";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { JOURNEY } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Our Journey — Milestones Since 1978",
  description: "Synthokem Labs milestones from incorporation in 1978: USFDA DMF filings, CEP for Guaifenesin, WHO-GMP, USFDA facility approval, EU Written Confirmation, KFDA, COFEPRIS and ISO certifications.",
  path: "/about/journey/",
});

export default function JourneyPage() {
  return (
    <>
      <PageHero
        eyebrow="Our journey"
        title="Our journey over the years."
        lede="Synthokem Labs began operations as a single unit with 10 employees. Today it has three manufacturing facilities and over 300 employees."
        crumbs={[{ name: "About", href: "/about/" }, { name: "Our journey", href: "/about/journey/" }]}
        image="warehouse-aisle"
      >
        <p className="font-mono text-sm text-on-dark-muted">{JOURNEY.length} milestones · {JOURNEY[0].year}–{JOURNEY[JOURNEY.length - 1].year}</p>
      </PageHero>
      <section className="bg-surface py-20 lg:py-28" aria-labelledby="milestones-title">
        <Container className="max-w-[1100px]">
          <h2 id="milestones-title" className="sr-only">Company milestones</h2>
          <Timeline />
          <div className="mt-16 flex flex-wrap gap-3 border-t border-border pt-10">
            <ButtonLink href="/quality/regulatory-affairs/">Regulatory affairs</ButtonLink>
            <ButtonLink href="/capabilities/manufacturing/" variant="secondary">Manufacturing units</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
