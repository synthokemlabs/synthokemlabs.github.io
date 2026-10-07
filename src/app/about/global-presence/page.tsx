import { PageHero } from "@/components/layout/PageHero";
import { GlobalMap } from "@/components/sections/GlobalMap";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { COUNTRIES, REGIONS } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Global Presence — 40 Countries",
  description: `Synthokem Labs' global presence spans ${COUNTRIES.length} countries across Europe, Asia-Pacific, the Middle East & Africa and the Americas, served from Hyderabad, India.`,
  path: "/about/global-presence/",
});

export default function GlobalPresencePage() {
  return (
    <>
      <PageHero
        eyebrow="Global presence"
        title={`Serving the pharmaceutical industry across ${COUNTRIES.length} countries.`}
        lede="Providing the highest quality to our exacting customers worldwide — from our base in Hyderabad, India."
        crumbs={[{ name: "About", href: "/about/" }, { name: "Global presence", href: "/about/global-presence/" }]}
        size="sm"
      />
      <section className="on-dark bg-primary py-20 text-white lg:py-24">
        <Container><GlobalMap /></Container>
      </section>
      <section className="py-20 lg:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="By region" title="Where Synthokem is present." size="md" />
            <p className="mt-5 text-muted">Regulatory filings and approvals that support supply into these markets are documented on our regulatory affairs page.</p>
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/quality/regulatory-affairs/">Regulatory affairs</ButtonLink>
              <ButtonLink href="/contact/?intent=customer" variant="secondary">Contact sales</ButtonLink>
            </div>
          </div>
          <dl className="grid grid-cols-2 gap-px self-start overflow-hidden rounded-lg bg-border ring-1 ring-border lg:col-span-7">
            {REGIONS.map((r) => (
              <div key={r} className="bg-white p-6">
                <dt className="eyebrow text-muted">{r}</dt>
                <dd className="mt-3 font-display text-4xl font-semibold text-primary">{COUNTRIES.filter((c) => c.region === r).length}</dd>
                <dd className="mt-1 text-sm text-muted">countries</dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>
    </>
  );
}
