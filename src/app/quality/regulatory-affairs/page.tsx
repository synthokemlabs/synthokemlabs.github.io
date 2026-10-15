import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ApprovalsRegister } from "@/components/sections/QualitySections";
import { Reveal } from "@/components/ui/client";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { JOURNEY } from "@/data/company";
import { PRODUCTS, REGULATORY_GLOSSARY, productHref, structureSrc } from "@/data/products";
import { Icon } from "@/components/ui/Icon";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Regulatory Affairs — DMFs, CEPs, Approvals & Certifications",
  description: "Synthokem Labs regulatory record: USDMF filings since 1993, CEP for Guaifenesin, USFDA facility approval, WHO-GMP, KFDA, ISO 9001:2015, ISO 14001:2015, ISO 45001:2018 and MSME ZED Gold — with regulatory status by product.",
  path: "/quality/regulatory-affairs/",
});

export default function RegulatoryPage() {
  const commercialApis = PRODUCTS.filter((p) => p.category === "apis" && p.status === "commercial");
  const filingCount = JOURNEY.filter((m) => m.type === "filing").length;
  const firstFiling = Math.min(...JOURNEY.filter((m) => m.type === "filing").map((m) => m.year));
  return (
    <>
      <PageHero eyebrow="Regulatory affairs" title="Regulatory discipline, documented." lede="Having been successfully audited and recognised by global regulatory authorities, Synthokem delivers differentiated, high-quality products consistently." crumbs={[{ name: "Quality", href: "/quality/" }, { name: "Regulatory affairs", href: "/quality/regulatory-affairs/" }]} size="sm" />

      <section id="approvals" className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Approvals & certifications" title="Inspections, approvals and certifications." lede="Regulatory approvals and management-system certifications across our units. Every filing and inspection is on our company timeline." />
          <div className="mt-14"><ApprovalsRegister /></div>
        </Container>
      </section>

      <section id="by-product" className="bg-surface py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Regulatory status by product" title="Commercial APIs — filings and registrations." lede="As published in the current Synthokem Product List." />
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
          <Reveal className="mt-12 hidden overflow-x-auto rounded-lg bg-white ring-1 ring-border md:block"><div role="region" aria-label="Regulatory status table" tabIndex={0}>
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
          </div></Reveal>
          <dl className="mt-10 grid grid-cols-1 gap-x-10 gap-y-3 text-sm sm:grid-cols-2">
            {Object.entries(REGULATORY_GLOSSARY).map(([k, v]) => (
              <div key={k} className="grid grid-cols-[6.5rem_1fr] gap-3 border-b border-border py-2"><dt className="font-mono text-primary">{k}</dt><dd className="text-muted">{v}</dd></div>
            ))}
          </dl>
        </Container>
      </section>

      {/* The filing and inspection history lives on Our journey (one copy); link to it pre-filtered */}
      <section className="border-t border-border py-16">
        <Container className="grid grid-cols-1 gap-6 md:grid-cols-2">
          <Link href="/about/journey/?type=filing" className="group flex items-center justify-between gap-6 rounded-xl bg-white p-7 ring-1 ring-border transition-[transform,box-shadow] duration-500 hover:-translate-y-1 hover:shadow-[0_22px_44px_-28px_rgb(10_45_80/0.45)]">
            <span>
              <span className="eyebrow block text-accent-strong">Filing & inspection history</span>
              <span className="mt-2 block text-xl font-semibold text-primary-ink">{filingCount} regulatory filings since {firstFiling}</span>
              <span className="mt-1 block text-sm text-muted">On our company timeline, with inspections and certifications</span>
            </span>
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary-tint text-primary"><Icon name="arrowRight" size={18} className="arrow-nudge" /></span>
          </Link>
          <div className="flex flex-col justify-center gap-4 rounded-xl bg-primary p-7 text-white sm:flex-row sm:items-center sm:justify-between">
            <span>
              <span className="block text-xl font-semibold">Need regulatory documentation?</span>
              <span className="mt-1 block text-sm text-on-dark-muted">Certificates, DMF/CEP information and CoAs.</span>
            </span>
            <ButtonLink href="/enquiry/?type=technical" variant="light">Request documents</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
