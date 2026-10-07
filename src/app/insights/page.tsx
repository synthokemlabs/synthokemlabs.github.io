import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { Icon } from "@/components/ui/Icon";
import { NEWS } from "@/data/company";
import { SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Insights & Resources",
  description: "Synthokem Labs resources and updates — product list downloads, regulatory information, and company news and announcements.",
  path: "/insights/",
});

const RESOURCES = [
  { t: "Product List 2026", d: "All products with pharmacopoeial grades, CAS numbers and regulatory status.", href: SITE.productListPdf, kind: "PDF download", icon: "download" as const },
  { t: "Regulatory status by product", d: "Filings and registrations for commercial APIs.", href: "/quality/regulatory-affairs/#by-product", kind: "Reference", icon: "shield" as const },
  { t: "Areas of specialisation", d: "Reaction chemistries we run at scale.", href: "/capabilities/#specialisation", kind: "Capabilities", icon: "flask" as const },
  { t: "Company milestones", d: "Every filing, inspection and certification since 1978.", href: "/about/journey/", kind: "Timeline", icon: "history" as const },
];

export default function InsightsPage() {
  return (
    <>
      <PageHero eyebrow="Insights & resources" title="Technical resources and company updates." crumbs={[{ name: "Insights & resources", href: "/insights/" }]} size="sm" />

      <section className="py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="Technical resources" title="Downloads & references" size="md" />
          <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
            {RESOURCES.map((r) => (
              <li key={r.t}>
                {(() => {
                  const inner = (
                    <>
                      <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-accent-strong">{r.kind}</span>
                      <span className="mt-6 text-lg font-semibold text-primary-ink">{r.t}</span>
                      <span className="mt-2 flex-1 text-sm text-muted">{r.d}</span>
                      <Icon name={r.icon} size={20} className="mt-6 text-primary" />
                    </>
                  );
                  const cls = "group flex h-full flex-col bg-white p-7 transition-colors hover:bg-primary-tint/40";
                  // Files are plain links: the router would otherwise try to prefetch a PDF as a page
                  return r.href.endsWith(".pdf")
                    ? <a href={r.href} target="_blank" rel="noopener" className={cls}>{inner}</a>
                    : <Link href={r.href} className={cls}>{inner}</Link>;
                })()}
              </li>
            ))}
          </ul>
        </Container>
      </section>

      <section id="news" className="bg-surface py-20 lg:py-24">
        <Container>
          <SectionHeading eyebrow="News & announcements" title="Latest updates" size="md" />
          {NEWS.length === 0 ? (
            <div className="mt-10 rounded-lg bg-white p-10 text-center ring-1 ring-border">
              <Icon name="file" size={30} strokeWidth={1.3} className="mx-auto text-accent-strong" />
              <p className="mt-4 text-lg font-semibold text-primary-ink">No announcements have been published yet.</p>
              <p className="mx-auto mt-2 max-w-md text-muted">Company news, events and updates will appear here. For media or business queries, please contact us.</p>
              <div className="mt-6"><ButtonLink href="/contact/?intent=general" variant="secondary">Contact us</ButtonLink></div>
            </div>
          ) : (
            <ul className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-3">
              {NEWS.map((n) => (
                <li key={n.slug} className="rounded-lg bg-white p-7 ring-1 ring-border">
                  <p className="font-mono text-xs text-muted"><time dateTime={n.date}>{n.date}</time> · {n.category}</p>
                  <h3 className="mt-4 text-lg font-semibold text-primary-ink">{n.title}</h3>
                  <p className="mt-2 text-sm text-muted">{n.summary}</p>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>
    </>
  );
}
