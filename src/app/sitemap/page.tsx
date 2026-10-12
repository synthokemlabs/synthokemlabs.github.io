import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { Container, SectionHeading } from "@/components/ui/primitives";
import { SiteStructure } from "@/components/diagrams/SiteStructure";
import { LEGAL_NAV } from "@/data/navigation";
import { CATEGORIES, PRODUCTS, productHref } from "@/data/products";
import { STATIC_ROUTES } from "@/lib/routes";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({ title: "Sitemap", description: "All pages and products on the Synthokem Labs website.", path: "/sitemap/" });

export default function SitemapPage() {
  const groups = [...new Set(STATIC_ROUTES.map((r) => r.group))];
  return (
    <>
      <PageHero eyebrow="Site map" title="The whole website, at a glance." lede="Six sections, each a click away. Use this map to jump straight to what you need." crumbs={[{ name: "Site map", href: "/sitemap/" }]} size="sm" />
      <section className="bg-surface py-16 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Website structure" title="How the site is organised." size="md" className="mb-12" />
          <SiteStructure />
        </Container>
      </section>
      <section className="py-16 lg:py-24">
        <Container className="grid grid-cols-1 gap-12 sm:grid-cols-2 lg:grid-cols-4">
          <h2 className="sr-only">All pages</h2>
          {groups.map((g) => (
            <nav key={g} aria-label={g}>
              <h2 className="eyebrow border-b border-border pb-3 text-muted">{g}</h2>
              <ul className="mt-3">
                {STATIC_ROUTES.filter((r) => r.group === g).map((r) => (
                  <li key={r.path}><Link href={r.path} className="inline-flex min-h-10 items-center text-primary-ink hover:text-primary hover:underline">{r.title}</Link></li>
                ))}
              </ul>
            </nav>
          ))}
          <nav aria-label="Legal">
            <h2 className="eyebrow border-b border-border pb-3 text-muted">Legal</h2>
            <ul className="mt-3">{LEGAL_NAV.filter((l) => l.href !== "/sitemap/").map((l) => <li key={l.href}><Link href={l.href} className="inline-flex min-h-10 items-center text-primary-ink hover:text-primary hover:underline">{l.label}</Link></li>)}</ul>
          </nav>
        </Container>
        <Container className="mt-16">
          <h2 className="display-md text-primary-ink">All products</h2>
          <div className="mt-8 grid grid-cols-1 gap-10 sm:grid-cols-2 lg:grid-cols-3">
            {CATEGORIES.map((c) => (
              <div key={c.slug}>
                <h3 className="eyebrow border-b border-border pb-3 text-muted">{c.shortName}</h3>
                <ul className="mt-3">
                  {PRODUCTS.filter((p) => p.category === c.slug).map((p) => (
                    <li key={p.slug}><Link href={productHref(p)} className="inline-flex min-h-9 items-center text-[0.95rem] text-primary-ink hover:text-primary hover:underline">{p.name}</Link></li>
                  ))}
                </ul>
              </div>
            ))}
          </div>
        </Container>
      </section>
    </>
  );
}
