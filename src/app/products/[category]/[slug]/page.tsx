import Link from "next/link";
import { notFound } from "next/navigation";
import { Breadcrumbs } from "@/components/layout/PageHero";
import { ProductName, TrackRecentlyViewed } from "@/components/products/ProductCatalogue";
import { ViewTransition } from "react";
import { ProductStickyBar } from "@/components/products/ProductStickyBar";
import { readFileSync, existsSync } from "node:fs";
import { join } from "node:path";
import { Molecule3D } from "@/components/molecules/Molecule3D";
import { StructureViewer } from "@/components/molecules/StructureViewer";
import { getStructure } from "@/data/structures";
import { formatFormula } from "@/lib/chem";
import { Badge, ButtonLink, Container, JsonLd, SpecRow } from "@/components/ui/primitives";
import { CopyButton } from "@/components/ui/client";
import { Icon } from "@/components/ui/Icon";
import {
  GRADE_GLOSSARY, PRODUCTS, REGULATORY_GLOSSARY, STATUS_LABEL, getCategory, getProduct, productDescription, productHref, relatedProducts,
} from "@/data/products";
import { SITE } from "@/data/site";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return PRODUCTS.map((p) => ({ category: p.category, slug: p.slug }));
}

type Params = { params: Promise<{ category: string; slug: string }> };

export async function generateMetadata({ params }: Params) {
  const { category, slug } = await params;
  const p = getProduct(category, slug);
  if (!p) return {};
  const cat = getCategory(p.category)!;
  return pageMetadata({
    title: `${p.name}${p.cas ? ` (CAS ${p.cas})` : ""} — ${cat.singular} Manufacturer`,
    description: productDescription(p),
    path: productHref(p),
  });
}

export default async function ProductPage({ params }: Params) {
  const { category, slug } = await params;
  const p = getProduct(category, slug);
  if (!p) notFound();
  const cat = getCategory(p.category)!;
  const related = relatedProducts(p);
  const enquiry = `/enquiry/?product=${encodeURIComponent(p.slug)}`;
  const structure = getStructure(p.slug);
  const svgFile = join(process.cwd(), "public", "structures", "svg", `${p.slug}.svg`);
  const svg = existsSync(svgFile) ? readFileSync(svgFile, "utf8") : undefined;
  const casMatched = structure && !structure.matchedBy;

  return (
    <>
      <TrackRecentlyViewed category={p.category} slug={p.slug} />
      <ProductStickyBar name={p.name} cas={p.cas} enquiryHref={enquiry} />
      <section data-product-hero className="on-dark relative isolate overflow-hidden bg-primary-ink text-white">
        <div aria-hidden="true" className="grid-paper-dark absolute inset-0 -z-10" />
        <Container className="grid grid-cols-1 items-center gap-10 pb-14 pt-36 lg:grid-cols-12 lg:pb-20 lg:pt-40">
          <div className="lg:col-span-7">
          <Breadcrumbs items={[{ name: "Products", href: "/products/" }, { name: cat.shortName, href: `/products/${cat.slug}/` }, { name: p.name, href: productHref(p) }]} />
          <div className="mt-10 flex flex-wrap items-center gap-2">
            <span className="eyebrow text-accent-soft">{cat.name}{p.use === "veterinary" ? " · Veterinary use" : p.use === "human" ? " · Human use" : ""}</span>
          </div>
          <ViewTransition name={`title-${p.slug}`} share="title-morph" default="none">
          <h1 className={`display-lg mt-4 max-w-4xl break-words text-white ${Math.max(...p.name.split(/\s+/).map((w) => w.length)) > 16 ? "title-long" : ""}`}>
            {/* Allow line breaks after hyphens and brackets in long chemical names */}
            {p.name.split(/(?<=[-)])/).map((part, i) => (i ? [<wbr key={i} />, part] : part))}
          </h1>
          </ViewTransition>
          <div className="mt-6 flex flex-wrap items-center gap-3">
            {p.status && (
              <span className={`inline-flex min-h-8 items-center gap-2 rounded-lg px-3 font-mono text-xs uppercase tracking-[0.08em] ${p.status === "commercial" ? "bg-accent/20 text-accent" : "bg-[#f3c46b]/15 text-[#f3c46b]"}`}>
                <span className={`h-1.5 w-1.5 rounded-full ${p.status === "commercial" ? "bg-accent" : "bg-[#f3c46b]"}`} />
                {STATUS_LABEL[p.status]}
              </span>
            )}
            {p.cas && (
              <span className="inline-flex items-center gap-1 rounded-lg bg-white/10 pl-3 font-mono text-sm text-white">
                CAS {p.cas}
                <CopyButton text={p.cas} label="CAS number" tone="light" className="min-h-9!" />
              </span>
            )}
          </div>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href={enquiry} variant="light">Request product information</ButtonLink>
            <ButtonLink href={`/contact/?intent=customer&product=${encodeURIComponent(p.slug)}`} variant="outline-light">Contact sales</ButtonLink>
          </div>
          </div>
          {(structure?.model3d || svg) && (
            <div className="relative hidden lg:col-span-5 lg:block">
              <div className="relative aspect-square">
                {structure?.model3d ? (
                  <Molecule3D model={structure.model3d} label={`Rotating 3D model of ${p.name}`} hydrogens={false} variant="line" speed={0.9} follow />
                ) : (
                  <div className="mol-draw mol-on-dark is-visible grid h-full w-full place-items-center p-10" dangerouslySetInnerHTML={{ __html: svg! }} />
                )}
              </div>
              {casMatched && <p className="mt-2 flex justify-between border-t border-white/15 pt-4 font-mono text-sm text-on-dark-muted"><span className="text-white">{formatFormula(structure!.formula)}</span><span>{structure!.mw} g/mol</span></p>}
            </div>
          )}
        </Container>
      </section>

      <section className="py-16 lg:py-24">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-7">
            <h2 className="eyebrow text-accent-strong">Product information</h2>
            <dl className="mt-5 border-b border-border">
              <SpecRow label="Product">{p.name}</SpecRow>
              {p.synonyms?.length ? <SpecRow label="Also known as">{p.synonyms.join(" · ")}</SpecRow> : null}
              {p.cas && <SpecRow label="CAS number" mono>{p.cas}</SpecRow>}
              {casMatched && <SpecRow label="Molecular formula" mono>{formatFormula(structure!.formula)}</SpecRow>}
              {casMatched && <SpecRow label="Molecular weight" mono>{structure!.mw} g/mol</SpecRow>}
              {casMatched && structure!.iupac && <SpecRow label="IUPAC name"><span className="break-words text-[0.92rem]">{structure!.iupac}</span></SpecRow>}
              <SpecRow label="Category"><Link href={`/products/${cat.slug}/`} className="text-primary underline-offset-4 hover:underline">{cat.name}</Link></SpecRow>
              {p.use && <SpecRow label="Use">{p.use === "human" ? "Human" : "Veterinary"}</SpecRow>}
              {p.status && <SpecRow label="Status">{STATUS_LABEL[p.status]}</SpecRow>}
              {p.grades?.length ? (
                <SpecRow label="Grades">
                  <ul className="flex flex-wrap gap-1.5">
                    {p.grades.map((g) => {
                      const base = g.split("-")[0].replace(/\d+$/, "");
                      const title = GRADE_GLOSSARY[g] ?? GRADE_GLOSSARY[base];
                      return (
                        <li key={g}>
                          <abbr title={title} className="inline-flex min-h-8 items-center rounded-lg bg-surface px-2.5 font-mono text-[0.82rem] no-underline ring-1 ring-border">{g}</abbr>
                        </li>
                      );
                    })}
                  </ul>
                </SpecRow>
              ) : null}
              {p.therapeuticCategory && <SpecRow label="Therapeutic category">{p.therapeuticCategory}</SpecRow>}
              {p.usedIn?.length ? <SpecRow label="Used in (API)">{p.usedIn.join(", ")}</SpecRow> : null}
              {p.applications?.length ? <SpecRow label="Applications">{p.applications.join(", ")}</SpecRow> : null}
              {p.regulatoryStatus?.length ? (
                <SpecRow label="Regulatory status">
                  <ul className="flex flex-wrap gap-1.5">
                    {p.regulatoryStatus.map((r) => (
                      <li key={r}>
                        <span title={REGULATORY_GLOSSARY[r]} className="inline-flex min-h-8 items-center rounded-lg bg-primary-tint px-2.5 font-mono text-[0.8rem] text-primary">{r}</span>
                      </li>
                    ))}
                  </ul>
                </SpecRow>
              ) : null}
            </dl>
            <p className="mt-5 flex items-start gap-2 text-sm text-muted">
              <Icon name="file" size={16} className="mt-0.5 shrink-0" />
              {p.source === "product-list-2026"
                ? "Information as published in the Synthokem Product List 2026. Contact us for current specifications and documentation."
                : "Information as listed in the Synthokem product table. Contact us to confirm current availability and specifications."}
            </p>
            {structure && (
              <p className="mt-2 flex items-start gap-2 text-sm text-muted">
                <Icon name="flask" size={16} className="mt-0.5 shrink-0" />
                <span>Structure{casMatched ? ", formula and molecular weight" : ""} from PubChem reference record <a href={`https://pubchem.ncbi.nlm.nih.gov/compound/${structure.cid}`} target="_blank" rel="noopener noreferrer" className="font-semibold text-primary underline underline-offset-2">CID {structure.cid}</a>{casMatched ? ", matched by CAS number" : ", matched by product name"}.</span>
              </p>
            )}
            {p.regulatoryStatus?.some((r) => REGULATORY_GLOSSARY[r]) && (
              <details className="group mt-8 rounded-lg bg-surface p-5">
                <summary className="flex min-h-8 cursor-pointer list-none items-center justify-between font-semibold text-primary-ink">
                  What do these regulatory terms mean?
                  <Icon name="plus" size={18} className="transition-transform group-open:rotate-45" />
                </summary>
                <dl className="mt-4 space-y-2 text-sm">
                  {p.regulatoryStatus.filter((r) => REGULATORY_GLOSSARY[r]).map((r) => (
                    <div key={r} className="grid grid-cols-[6.5rem_1fr] gap-3"><dt className="font-mono text-primary">{r}</dt><dd className="text-muted">{REGULATORY_GLOSSARY[r]}</dd></div>
                  ))}
                </dl>
              </details>
            )}
          </div>

          <aside className="space-y-6 lg:col-span-5">
            {(svg || p.structureImage) && (
              <StructureViewer name={p.name} svg={svg} rasterSrc={p.structureImage} model3d={structure?.model3d} parentNote={structure?.model3dParent} cas={p.cas} />
            )}
            <div className="rounded-lg bg-primary p-7 text-white">
              <h2 className="font-display text-xl font-semibold">Documentation</h2>
              <ul className="mt-5 divide-y divide-white/10 border-y border-white/10">
                <li>
                  <a href={SITE.productListPdf} className="group flex min-h-14 items-center justify-between gap-4 py-3" target="_blank" rel="noopener">
                    <span><span className="block font-medium">Product List 2026</span><span className="font-mono text-xs text-on-dark-muted">PDF · 210 KB</span></span>
                    <Icon name="download" size={18} className="text-accent" />
                  </a>
                </li>
              </ul>
              <p className="mt-5 text-sm leading-relaxed text-on-dark-muted">
                Specifications, certificates of analysis and regulatory documents are shared on request with qualified customers.
              </p>
              <ButtonLink href={`${enquiry}&topic=documentation`} variant="light" className="mt-6 w-full">Request documentation</ButtonLink>
            </div>
            <div className="rounded-lg p-7 ring-1 ring-border">
              <h2 className="font-display text-lg font-semibold text-primary-ink">Talk to our team</h2>
              <p className="mt-2 text-sm text-muted">{SITE.responseTime}</p>
              <div className="mt-4 space-y-1">
                <a href={SITE.phone.href} className="flex min-h-11 items-center gap-3 text-primary-ink hover:text-primary"><Icon name="phone" size={17} className="text-accent-strong" />{SITE.phone.display}</a>
                <div className="flex items-center justify-between">
                  <a href={`mailto:${SITE.email}?subject=${encodeURIComponent(`Enquiry: ${p.name}`)}`} className="flex min-h-11 items-center gap-3 text-primary-ink hover:text-primary"><Icon name="mail" size={17} className="text-accent-strong" />{SITE.email}</a>
                  <CopyButton text={SITE.email} label="Email address" />
                </div>
              </div>
            </div>
          </aside>
        </Container>
      </section>

      {related.length > 0 && (
        <section className="border-t border-border bg-surface py-16 lg:py-20">
          <Container>
            <div className="flex items-end justify-between gap-6">
              <h2 className="display-md text-primary-ink">Related {cat.shortName.toLowerCase() === "apis" ? "APIs" : cat.shortName.toLowerCase()}</h2>
              <Link href={`/products/${cat.slug}/`} className="group hidden items-center gap-2 font-semibold text-primary sm:inline-flex">View all <Icon name="arrowRight" size={16} className="arrow-nudge" /></Link>
            </div>
            <ul className="mt-8 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
              {related.map((r) => (
                <li key={r.slug}>
                  <Link href={productHref(r)} className="group flex h-full flex-col gap-6 bg-white p-6 transition-colors hover:bg-primary-tint/40">
                    <ProductName slug={r.slug} className="flex-1 font-semibold text-primary-ink group-hover:text-primary">{r.name}</ProductName>
                    <span className="flex items-center justify-between gap-3">
                      <span className="font-mono text-xs text-muted">{r.cas ?? r.therapeuticCategory ?? ""}</span>
                      {r.status && <Badge tone={r.status === "commercial" ? "green" : "amber"}>{STATUS_LABEL[r.status]}</Badge>}
                    </span>
                  </Link>
                </li>
              ))}
            </ul>
          </Container>
        </section>
      )}

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "Product",
          name: p.name,
          description: productDescription(p),
          category: cat.name,
          url: absoluteUrl(productHref(p)),
          ...(svg || p.structureImage ? { image: absoluteUrl(svg ? `/structures/svg/${p.slug}.svg` : p.structureImage!) } : {}),
          brand: { "@type": "Brand", name: SITE.name },
          manufacturer: { "@id": `${SITE.url}/#organization` },
          ...(p.cas ? { additionalProperty: [{ "@type": "PropertyValue", name: "CAS Registry Number", value: p.cas }] } : {}),
        }}
      />
    </>
  );
}
