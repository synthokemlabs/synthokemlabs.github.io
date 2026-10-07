import Link from "next/link";
import { PageHero } from "@/components/layout/PageHero";
import { EnquiryForm } from "@/components/forms/EnquiryForm";
import { Container } from "@/components/ui/primitives";
import { CopyButton } from "@/components/ui/client";
import { Icon } from "@/components/ui/Icon";
import { SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Product Enquiry & Request for Quotation",
  description: "Request a quotation, samples or technical documentation for Synthokem APIs, intermediates, fine chemicals, excipients and metal scavengers.",
  path: "/enquiry/",
});

const STEPS = [
  { t: "Send your enquiry", d: "Tell us the product, grade, quantity and documentation you need." },
  { t: "We review it", d: "Our sales and technical teams assess your requirement." },
  { t: "We respond", d: "Our team will contact you within 3 business days." },
];

export default function EnquiryPage() {
  return (
    <>
      <PageHero eyebrow="Product enquiry" title="Request a quote or product information." lede="For APIs, intermediates, fine chemicals, excipients and metal scavengers — including specifications and regulatory documentation." crumbs={[{ name: "Product enquiry", href: "/enquiry/" }]} size="sm" />
      <section className="py-16 lg:py-24">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-8"><EnquiryForm /></div>
          <aside className="lg:col-span-4">
            <div className="space-y-8 lg:sticky lg:top-28">
              <div>
                <p className="eyebrow text-accent-strong">How it works</p>
                <ol className="mt-5 space-y-5">
                  {STEPS.map((s, i) => (
                    <li key={s.t} className="grid grid-cols-[2.25rem_1fr] gap-3">
                      <span className="grid h-9 w-9 place-items-center rounded-full font-mono text-xs text-primary ring-1 ring-primary/40">0{i + 1}</span>
                      <span><span className="block font-semibold text-primary-ink">{s.t}</span><span className="text-sm text-muted">{s.d}</span></span>
                    </li>
                  ))}
                </ol>
              </div>
              <div className="rounded-lg bg-surface p-6">
                <p className="font-semibold text-primary-ink">Prefer to talk?</p>
                <a href={SITE.phone.href} className="mt-3 flex min-h-11 items-center gap-3 text-primary-ink hover:text-primary"><Icon name="phone" size={17} className="text-accent-strong" />{SITE.phone.display}</a>
                <div className="flex items-center justify-between">
                  <a href={`mailto:${SITE.email}`} className="flex min-h-11 items-center gap-3 text-primary-ink hover:text-primary"><Icon name="mail" size={17} className="text-accent-strong" />{SITE.email}</a>
                  <CopyButton text={SITE.email} label="Email address" />
                </div>
                <p className="mt-2 text-sm text-muted">{SITE.hours}</p>
              </div>
              <div className="rounded-lg p-6 ring-1 ring-border">
                <p className="font-semibold text-primary-ink">Not sure which product?</p>
                <p className="mt-1 text-sm text-muted">Search the catalogue by name, CAS number or therapeutic category.</p>
                <Link href="/products/" className="group mt-3 inline-flex min-h-10 items-center gap-2 font-semibold text-primary">Browse products <Icon name="arrowRight" size={16} className="arrow-nudge" /></Link>
              </div>
            </div>
          </aside>
        </Container>
      </section>
    </>
  );
}
