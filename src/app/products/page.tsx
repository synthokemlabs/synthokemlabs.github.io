import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ProductCatalogue, RecentlyViewed } from "@/components/products/ProductCatalogue";
import { ButtonLink, Container } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { CATEGORIES, PRODUCTS, productsIn } from "@/data/products";
import { SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Product Catalogue — APIs, Intermediates & Fine Chemicals",
  description: `Search Synthokem's catalogue of ${PRODUCTS.length} products — Active Pharmaceutical Ingredients, pharmaceutical intermediates, fine chemicals, excipients and metal scavengers — by name, CAS number or therapeutic category.`,
  path: "/products/",
});

export default function ProductsPage() {
  return (
    <>
      <PageHero
        eyebrow="Product catalogue"
        title="Making chemistry work."
        lede="A strong portfolio in key markets — search by product name, CAS number, therapeutic category or the API an intermediate is used in."
        crumbs={[{ name: "Products", href: "/products/" }]}
        image="lab-precision"
        size="sm"
      >
        <ul className="flex flex-wrap gap-2">
          {CATEGORIES.map((c) => (
            <li key={c.slug}>
              <Link href={`/products/${c.slug}/`} className="inline-flex min-h-11 items-center gap-2 rounded-full px-4 text-sm font-medium text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white hover:text-primary-ink">
                {c.shortName} <span className="font-mono text-xs opacity-70">{productsIn(c.slug).length}</span>
              </Link>
            </li>
          ))}
        </ul>
      </PageHero>

      <section className="py-16 lg:py-24">
        <Container>
          <RecentlyViewed />
          <ProductCatalogue />
        </Container>
      </section>

      <section className="border-t border-border bg-surface py-16 lg:py-20">
        <Container className="grid grid-cols-1 items-center gap-8 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <p className="eyebrow text-accent-strong">Downloads</p>
            <h2 className="display-md mt-4 text-primary-ink">The complete Product List 2026 — with pharmacopoeial grades and regulatory status.</h2>
          </div>
          <div className="flex flex-wrap gap-3 lg:col-span-5 lg:justify-end">
            <ButtonLink href={SITE.productListPdf} icon="download">Download PDF</ButtonLink>
            <ButtonLink href="/enquiry/" variant="secondary">Request a quote</ButtonLink>
          </div>
          <p className="flex items-center gap-2 text-sm text-muted lg:col-span-12"><Icon name="file" size={16} /> {SITE.productListLabel}. Can’t find a product? <Link href="/enquiry/" className="font-semibold text-primary underline underline-offset-4">Ask our team</Link>.</p>
        </Container>
      </section>
    </>
  );
}
