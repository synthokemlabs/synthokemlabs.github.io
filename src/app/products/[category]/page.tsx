import Link from "next/link";
import { notFound } from "next/navigation";
import { PageHero } from "@/components/layout/PageHero";
import { ProductCatalogue } from "@/components/products/ProductCatalogue";
import { ButtonLink, Container, JsonLd } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIES, getCategory, productHref, productsIn } from "@/data/products";
import { SITE } from "@/data/site";
import { absoluteUrl, pageMetadata } from "@/lib/seo";

export const dynamicParams = false;
export function generateStaticParams() {
  return CATEGORIES.map((c) => ({ category: c.slug }));
}

export async function generateMetadata({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) return {};
  return pageMetadata({ title: c.seoTitle, description: c.seoDescription, path: `/products/${c.slug}/` });
}

const HERO_IMAGE: Record<string, string> = {
  apis: "cleanroom-processing",
  intermediates: "reactor-operator",
  "fine-chemicals": "lab-team",
  excipients: "qc-analyst",
  "metal-scavengers": "lab-precision",
};

export default async function CategoryPage({ params }: { params: Promise<{ category: string }> }) {
  const { category } = await params;
  const c = getCategory(category);
  if (!c) notFound();
  const items = productsIn(c.slug);
  const commercial = items.filter((p) => p.status === "commercial").length;
  const dev = items.filter((p) => p.status === "under-development").length;

  return (
    <>
      <PageHero eyebrow="Products" title={c.name} lede={c.summary} crumbs={[{ name: "Products", href: "/products/" }, { name: c.shortName, href: `/products/${c.slug}/` }]} image={HERO_IMAGE[c.slug]} size="sm" />

      <section className="py-16 lg:py-20">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <p className="lede text-text lg:col-span-7">{c.intro}</p>
          <dl className="grid grid-cols-3 gap-4 self-start border-t border-border pt-5 lg:col-span-4 lg:col-start-9">
            <div><dt className="eyebrow text-muted">Listed</dt><dd className="mt-2 font-display text-3xl font-semibold text-primary">{items.length}</dd></div>
            <div><dt className="eyebrow text-muted">Commercial</dt><dd className="mt-2 font-display text-3xl font-semibold text-primary">{commercial}</dd></div>
            <div><dt className="eyebrow text-muted">In development</dt><dd className="mt-2 font-display text-3xl font-semibold text-primary">{dev}</dd></div>
          </dl>
        </Container>
      </section>

      <section className="pb-20 lg:pb-28">
        <Container><ProductCatalogue lockedCategory={c.slug} /></Container>
      </section>

      <section className="border-t border-border bg-surface py-16">
        <Container>
          <p className="eyebrow text-muted">Other categories</p>
          <ul className="mt-6 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
            {CATEGORIES.filter((o) => o.slug !== c.slug).map((o) => (
              <li key={o.slug}>
                <Link href={`/products/${o.slug}/`} className="group flex h-full flex-col justify-between gap-6 bg-white p-6 hover:bg-primary-tint/50">
                  <span className="font-display text-xl font-semibold text-primary-ink">{o.shortName}</span>
                  <span className="flex items-center justify-between text-sm text-muted">{productsIn(o.slug).length} products <Icon name="arrowRight" size={16} className="arrow-nudge text-primary" /></span>
                </Link>
              </li>
            ))}
          </ul>
          <div className="mt-10 flex flex-wrap gap-3">
            <ButtonLink href="/enquiry/">Request a quote</ButtonLink>
            <ButtonLink href={SITE.productListPdf} variant="secondary" icon="download">Product list PDF</ButtonLink>
          </div>
        </Container>
      </section>

      <JsonLd
        data={{
          "@context": "https://schema.org",
          "@type": "CollectionPage",
          name: c.name,
          url: absoluteUrl(`/products/${c.slug}/`),
          description: c.seoDescription,
          mainEntity: {
            "@type": "ItemList",
            numberOfItems: items.length,
            itemListElement: items.map((p, i) => ({ "@type": "ListItem", position: i + 1, name: p.name, url: absoluteUrl(productHref(p)) })),
          },
        }}
      />
    </>
  );
}
