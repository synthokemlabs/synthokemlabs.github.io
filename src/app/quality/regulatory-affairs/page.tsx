import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ApprovalsGrid } from "@/components/sections/shared";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { JOURNEY } from "@/data/company";
import { PRODUCTS, REGULATORY_GLOSSARY, productHref, structureSrc } from "@/data/products";
import { SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Regulatory Affairs — DMFs, CEPs, Approvals & Certifications",
  description: "Synthokem Labs regulatory record: USDMF filings since 1993, CEP for Guaifenesin, USFDA facility approval, WHO-GMP, EU Written Confirmation, KFDA, COFEPRIS, ISO 9001/14001 and OHSAS 18001 — with regulatory status by product.",
  path: "/quality/regulatory-affairs/",
});

export default function RegulatoryPage() {
  const commercialApis = PRODUCTS.filter((p) => p.category === "apis" && p.status === "commercial");
  const filings = JOURNEY.filter((m) => m.type === "filing" || m.type === "inspection");
  return (
    <>
      <PageHero eyebrow="Regulatory affairs" title="Regulatory discipline, documented." lede="Having been successfully audited and recognised by global regulatory authorities, Synthokem delivers differentiated, high-quality products consistently." crumbs={[{ name: "Quality", href: "/quality/" }, { name: "Regulatory affairs", href: "/quality/regulatory-affairs/" }]} size="sm" />

      <section id="approvals" className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Approvals & certifications" title="Inspections, approvals and certifications." lede="As documented in our company milestones. Certificates are available to customers on request." />
          <div className="mt-12"><ApprovalsGrid /></div>
        </Container>
      </section>

      <section id="by-product" className="bg-surface py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Regulatory status by product" title="Commercial APIs — filings and registrations." lede="As published in the Synthokem Product List 2026." />
          {/* Phones: one card per product */}
          <ul className="mt-12 grid grid-cols-1 gap-3 md:hidden">
            {commercialApis.map((p) => (
              <li key={p.slug} className="rounded-lg bg-white p-5 ring-1 ring-border">
                <div className="flex items-start justify-between gap-4">
                  <div className="min-w-0">
                    <Link href={productHref(p)} className="font-semibold text-primary-ink hover:text-primary hover:underline">{p.name}</Link>
                    <p className="mt-1 font-mono text-xs text-muted">CAS {p.cas}</p>
                  </div>
                  {structureSrc(p) && (
                    <span className="grid-paper grid h-14 w-20 shrink-0 place-items-center rounded-lg bg-white ring-1 ring-border">
                      {/* eslint-disable-next-line @next/next/no-img-element */}
                      <img src={structureSrc(p)} alt="" loading="lazy" className="h-auto max-h-[46px] w-auto max-w-[70px] object-contain mix-blend-multiply" />
                    </span>
                  )}
                </div>
                {p.grades?.length ? <p className="mt-3 font-mono text-[0.78rem] text-muted">{p.grades.join(" / ")}</p> : null}
                <ul className="mt-3 flex flex-wrap gap-1.5" aria-label="Regulatory status">
                  {p.regulatoryStatus?.map((r) => <li key={r} title={REGULATORY_GLOSSARY[r]} className="rounded-lg bg-primary-tint px-2 py-0.5 font-mono text-[0.75rem] text-primary">{r}</li>)}
                </ul>
              </li>
            ))}
          </ul>
          <div className="mt-12 hidden overflow-x-auto rounded-lg bg-white ring-1 ring-border md:block" role="region" aria-label="Regulatory status table" tabIndex={0}>
            <table className="w-full min-w-[880px] text-left text-[0.92rem]">
              <caption className="sr-only">Regulatory status of commercial APIs</caption>
              <thead>
                <tr className="border-b border-border bg-surface-2 font-mono text-[0.7rem] uppercase tracking-[0.1em] text-muted">
                  <th scope="col" className="w-28 px-5 py-4 font-medium">Structure</th>
                  <th scope="col" className="px-5 py-4 font-medium">Product</th>
                  <th scope="col" className="px-5 py-4 font-medium">CAS</th>
                  <th scope="col" className="px-5 py-4 font-medium">Grades</th>
                  <th scope="col" className="px-5 py-4 font-medium">Regulatory status</th>
                </tr>
              </thead>
              <tbody>
                {commercialApis.map((p) => (
                  <tr key={p.slug} className="border-b border-border last:border-0 hover:bg-surface/60">
                    <td className="px-5 py-3">
                      <span className="grid-paper grid h-16 w-24 place-items-center rounded-lg bg-white ring-1 ring-border">
                        {structureSrc(p) && (
                          // eslint-disable-next-line @next/next/no-img-element
                          <img src={structureSrc(p)} alt={`Chemical structure of ${p.name}`} loading="lazy" className="h-auto max-h-[54px] w-auto max-w-[84px] object-contain mix-blend-multiply" />
                        )}
                      </span>
                    </td>
                    <th scope="row" className="px-5 py-4 font-semibold"><Link href={productHref(p)} className="text-primary-ink hover:text-primary hover:underline">{p.name}</Link></th>
                    <td className="whitespace-nowrap px-5 py-4 font-mono text-[0.85rem]">{p.cas}</td>
                    <td className="px-5 py-4 font-mono text-[0.8rem] text-muted">{p.grades?.join(" / ")}</td>
                    <td className="px-5 py-4">
                      <ul className="flex flex-wrap gap-1.5">
                        {p.regulatoryStatus?.map((r) => <li key={r} title={REGULATORY_GLOSSARY[r]} className="rounded-lg bg-primary-tint px-2 py-0.5 font-mono text-[0.75rem] text-primary">{r}</li>)}
                      </ul>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
          <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
            {Object.entries(REGULATORY_GLOSSARY).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-border py-2"><dt className="font-mono text-primary">{k}</dt><dd className="text-muted">{v}</dd></div>
            ))}
          </dl>
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Filing & inspection history" title="Three decades of regulatory filings." size="md" />
            <div className="mt-8 flex flex-wrap gap-3">
              <ButtonLink href="/about/journey/">Full timeline</ButtonLink>
              <ButtonLink href={SITE.productListPdf} variant="secondary" icon="download">Product list</ButtonLink>
            </div>
          </div>
          <ol className="lg:col-span-8">
            {filings.map((m) => (
              <li key={m.year + m.title} className="grid grid-cols-[4.5rem_1fr] gap-4 border-t border-border py-5 last:border-b">
                <span className="font-display text-2xl font-semibold text-primary">{m.year}</span>
                <div>
                  <p className="font-semibold text-primary-ink">{m.title}{m.unit ? <span className="ml-2 font-mono text-xs font-normal text-muted">{m.unit}</span> : null}</p>
                  <p className="mt-1 text-[0.95rem] text-muted">{m.detail}</p>
                </div>
              </li>
            ))}
          </ol>
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-16">
        <Container className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="display-md text-primary-ink">Need regulatory documentation?</p>
            <p className="mt-2 text-muted">We support customers with their technical and regulatory queries.</p>
          </div>
          <ButtonLink href="/enquiry/?type=technical">Request documents</ButtonLink>
        </Container>
      </section>
    </>
  );
}
