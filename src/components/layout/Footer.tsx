import Link from "next/link";
import { FOOTER_NAV, LEGAL_NAV } from "@/data/navigation";
import { LOCATIONS, SITE } from "@/data/site";
import { Logo } from "@/components/ui/Logo";
import { Icon } from "@/components/ui/Icon";
import { ButtonLink, Container } from "@/components/ui/primitives";

export function Footer() {
  const hq = LOCATIONS[0];
  return (
    <footer className="on-dark relative overflow-hidden bg-primary-ink text-on-dark">
      <div aria-hidden="true" className="grid-paper-dark pointer-events-none absolute inset-0 opacity-60" />
      <Container className="relative">
        {/* CTA */}
        <div className="flex flex-col gap-8 border-b border-white/10 py-16 md:flex-row md:items-end md:justify-between lg:py-20">
          <div className="max-w-2xl">
            <p className="eyebrow text-accent-soft">Work with Synthokem</p>
            <p className="display-md mt-4 font-display text-white">Let’s discuss your API and intermediate requirements.</p>
            <p className="mt-3 text-on-dark-muted">Our team will contact you within 3 business days.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/enquiry/" variant="light">Request a quote</ButtonLink>
            <ButtonLink href="/contact/" variant="outline-light">Contact sales</ButtonLink>
          </div>
        </div>

        <div className="grid grid-cols-1 gap-12 py-14 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <Link href="/" aria-label={`${SITE.name} — home`} className="inline-block rounded-sm">
              <Logo tone="light" />
            </Link>
            <p className="mt-6 max-w-sm text-[0.95rem] leading-relaxed text-on-dark-muted">
              Progressive and proactive, dynamic and innovative — a manufacturer of Active Pharmaceutical Ingredients and drug intermediates, headquartered in Hyderabad, India, since 1978.
            </p>
            <address className="mt-8 space-y-3 text-[0.92rem] not-italic text-on-dark-muted">
              <p className="flex gap-3"><Icon name="pin" size={18} className="mt-0.5 shrink-0 text-accent-soft" /><span>{hq.lines.join(", ")}</span></p>
              <p><a className="flex min-h-8 items-center gap-3 hover:text-white" href={SITE.phone.href}><Icon name="phone" size={18} className="shrink-0 text-accent-soft" />{SITE.phone.display}</a></p>
              <p><a className="flex min-h-8 items-center gap-3 hover:text-white" href={`mailto:${SITE.email}`}><Icon name="mail" size={18} className="shrink-0 text-accent-soft" />{SITE.email}</a></p>
            </address>
          </div>
          <div className="grid grid-cols-2 gap-10 sm:grid-cols-3 lg:col-span-7 lg:col-start-6">
            {FOOTER_NAV.map((col) => (
              <nav key={col.heading} aria-label={col.heading}>
                <p className="eyebrow text-on-dark-muted">{col.heading}</p>
                <ul className="mt-5 space-y-1">
                  {col.links.map((l) => (
                    <li key={l.href}>
                      <Link href={l.href} className="inline-flex min-h-9 items-center text-[0.93rem] text-on-dark/85 transition-colors hover:text-white">
                        {l.label}
                      </Link>
                    </li>
                  ))}
                </ul>
              </nav>
            ))}
          </div>
        </div>

        <div className="flex flex-col gap-4 border-t border-white/10 py-8 pb-24 text-[0.82rem] text-on-dark-muted lg:flex-row lg:items-center lg:justify-between lg:pb-8">
          <p>© {new Date().getFullYear()} {SITE.legalName}. All rights reserved.</p>
          <ul className="flex flex-wrap gap-x-6 gap-y-1">
            {LEGAL_NAV.map((l) => (
              <li key={l.href}><Link href={l.href} className="inline-flex min-h-9 items-center hover:text-white">{l.label}</Link></li>
            ))}
          </ul>
        </div>
      </Container>
    </footer>
  );
}
