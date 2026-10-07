import { PageHero } from "@/components/layout/PageHero";
import { ContactExperience } from "@/components/forms/ContactExperience";
import { MapFacade } from "@/components/sections/MapFacade";
import { Container, JsonLd } from "@/components/ui/primitives";
import { CopyButton } from "@/components/ui/client";
import { Icon } from "@/components/ui/Icon";
import { LOCATIONS, SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Contact Synthokem Labs — Sales, Product & General Enquiries",
  description: `Contact Synthokem Labs in Pashamylaram, Hyderabad. Call ${SITE.phone.display}, email ${SITE.email}, or send a sales, product or partnership enquiry. ${SITE.hours}.`,
  path: "/contact/",
});

export default function ContactPage() {
  const hq = LOCATIONS[0];
  return (
    <>
      <PageHero eyebrow="Contact" title="Bringing innovation & ideas to life." lede="Tell us who you are and what you need — our sales, technical and support teams will take it from there." crumbs={[{ name: "Contact", href: "/contact/" }]} size="sm" />

      {/* Quick actions */}
      <section aria-label="Quick contact" className="border-b border-border bg-surface">
        <Container className="grid grid-cols-1 divide-y divide-border lg:grid-cols-3 lg:divide-x lg:divide-y-0">
          <a href={SITE.phone.href} className="group flex min-h-24 items-center gap-4 py-5 lg:px-6 lg:first:pl-0">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-white"><Icon name="phone" size={18} /></span>
            <span><span className="eyebrow block text-muted">Call</span><span className="mt-1 block font-semibold text-primary-ink group-hover:text-primary">{SITE.phone.display}</span></span>
          </a>
          <div className="flex min-h-24 items-center justify-between gap-4 py-5 lg:px-6">
            <a href={`mailto:${SITE.email}`} className="group flex items-center gap-4">
              <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-white"><Icon name="mail" size={18} /></span>
              <span><span className="eyebrow block text-muted">Email</span><span className="mt-1 block font-semibold text-primary-ink group-hover:text-primary">{SITE.email}</span></span>
            </a>
            <CopyButton text={SITE.email} label="Email address" />
          </div>
          <div className="flex min-h-24 items-center gap-4 py-5 lg:px-6">
            <span className="grid h-11 w-11 shrink-0 place-items-center rounded-full bg-primary text-white"><Icon name="clock" size={18} /></span>
            <span>
              <span className="eyebrow block text-muted">Office hours</span>
              {/* "Monday to Saturday, 9:00 am – 5:30 pm" → days on one line, times on the next */}
              <span className="mt-1 block font-semibold text-primary-ink">{SITE.hours.split(", ")[0]}</span>
              {SITE.hours.includes(", ") && <span className="block text-sm text-muted">{SITE.hours.split(", ").slice(1).join(", ")}</span>}
            </span>
          </div>
        </Container>
      </section>

      <section id="get-in-touch" className="py-16 lg:py-24">
        <Container className="grid grid-cols-1 gap-14 lg:grid-cols-12">
          <div className="lg:col-span-8">
            <h2 className="display-md text-primary-ink">Any queries? Get in touch with us.</h2>
            <p className="mt-3 text-muted">Drop us a message and our team will contact you within 3 business days.</p>
            <div className="mt-10"><ContactExperience /></div>
          </div>
          <aside className="space-y-10 lg:col-span-4" aria-label="Addresses">
            {LOCATIONS.map((l) => (
              <div key={l.id} className="border-t-2 border-primary pt-6">
                <p className="eyebrow text-accent-strong">{l.role}</p>
                <h3 className="mt-2 text-xl font-semibold text-primary-ink">{l.name}</h3>
                <address className="mt-3 not-italic leading-relaxed text-text">{l.lines.map((x) => <span key={x} className="block">{x}</span>)}</address>
                <div className="mt-4 flex flex-wrap gap-2">
                  {l.phone && <a href={l.phone.href} className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary ring-1 ring-inset ring-border-strong hover:ring-primary"><Icon name="phone" size={15} />{l.phone.display}</a>}
                  <a href={l.directions} target="_blank" rel="noopener noreferrer" className="inline-flex min-h-11 items-center gap-2 rounded-lg px-3 text-sm font-semibold text-primary ring-1 ring-inset ring-border-strong hover:ring-primary"><Icon name="pin" size={15} />Directions</a>
                </div>
              </div>
            ))}
          </aside>
        </Container>
      </section>

      <section id="map" className="pb-20 lg:pb-28" aria-labelledby="map-title">
        <Container>
          <h2 id="map-title" className="eyebrow mb-5 text-muted">Corporate office & Unit II — Pashamylaram, Telangana</h2>
          <MapFacade src={hq.mapEmbed!} title="Map showing Synthokem Labs, Pashamylaram" directions={hq.directions} />
        </Container>
      </section>

      <JsonLd data={{ "@context": "https://schema.org", "@type": "ContactPage", name: "Contact Synthokem Labs", url: `${SITE.url}/contact/`, about: { "@id": `${SITE.url}/#organization` } }} />
    </>
  );
}
