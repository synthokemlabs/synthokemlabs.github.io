import { PageHero } from "@/components/layout/PageHero";
import { CareerForm } from "@/components/forms/CareerForm";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { CAREER_AREAS, OPENINGS } from "@/data/company";
import { SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Careers — Life at Synthokem Labs",
  description: "Build your career in pharmaceutical chemistry at Synthokem Labs, Hyderabad — R&D, manufacturing, quality, regulatory affairs, supply chain and marketing. Submit your resume.",
  path: "/careers/",
});

const AS_MEMBER = [
  "Enrich lives to create a healthier and happier world",
  "Consistently deliver high performance",
  "Learn continually, excel and grow",
  "Collectively celebrate achievements and milestones",
  "Enjoy a good family atmosphere",
];

export default function CareersPage() {
  return (
    <>
      <PageHero eyebrow="Careers" title="Build the future of pharmaceutical chemistry." lede="Talented and capable people have played a major role in powering and defining the growth of Synthokem Labs over the last four decades." crumbs={[{ name: "Careers", href: "/careers/" }]} image="lab-team">
        <div className="flex flex-wrap gap-3">
          <ButtonLink href="#apply" variant="light">Submit your resume</ButtonLink>
          <ButtonLink href="#openings" variant="outline-light">Current opportunities</ButtonLink>
        </div>
      </PageHero>

      <section className="py-20 lg:py-28" aria-labelledby="life-title">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-20">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Life at Synthokem" title={<span id="life-title">A healthy and challenging place to work.</span>} size="md" />
            <div className="mt-6 space-y-4 text-[1.02rem] leading-relaxed text-muted">
              <p>We provide a healthy and challenging work environment to our employees. We give them great opportunities, train them, and enable them to work on advanced technologies — helping them acquire and improve the skills needed in today’s dynamic pharma world.</p>
              <p>We believe our employees are the most valuable assets of the company, and taking good care of them is our utmost priority. Management interacts frequently with employees to motivate them and ensure they are trained to industry standards. Synthokem is keen on practising ethical standards and HR policies that benefit its employees.</p>
              <p>When people with diverse skills are bound together by a common purpose and value system, they can make magic. We also insist on work–life balance, and help our people understand why it matters.</p>
            </div>
          </div>
          <div className="lg:col-span-6">
            <Reveal variant="image" className="zoom-parent overflow-hidden rounded-lg">
              <Img name="qc-analyst" sizes="(min-width:1024px) 50vw, 100vw" className="zoom-img aspect-[4/3] w-full object-cover" />
            </Reveal>
            <div className="mt-8 rounded-lg bg-surface p-7">
              <p className="eyebrow text-accent-strong">As a member of our team, you will</p>
              <ul className="mt-4 space-y-3">
                {AS_MEMBER.map((x) => (
                  <li key={x} className="flex gap-3 text-text"><Icon name="check" size={18} className="mt-0.5 shrink-0 text-accent-strong" />{x}</li>
                ))}
              </ul>
            </div>
          </div>
        </Container>
      </section>

      <section className="bg-surface py-20 lg:py-24" aria-labelledby="areas-title">
        <Container>
          <SectionHeading eyebrow="Career areas" title={<span id="areas-title">Where you could contribute.</span>} lede="Our major focus areas span research and development, manufacturing, supply chain, quality and regulatory — alongside our commercial teams." size="md" />
          <ul className="mt-10 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
            {CAREER_AREAS.map((a, i) => (
              <Reveal as="li" key={a} delay={(i % 4) * 60} className="flex min-h-28 flex-col justify-between bg-white p-6">
                <span className="font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-lg font-semibold text-primary-ink">{a}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section id="openings" className="py-20 lg:py-24" aria-labelledby="open-title">
        <Container>
          <SectionHeading eyebrow="Current opportunities" title={<span id="open-title">Open positions</span>} size="md" />
          {OPENINGS.length === 0 ? (
            <div className="mt-10 flex flex-col justify-between gap-6 rounded-lg p-8 ring-1 ring-border sm:flex-row sm:items-center">
              <div>
                <p className="text-lg font-semibold text-primary-ink">There are no advertised openings at the moment.</p>
                <p className="mt-1 text-muted">We are always glad to hear from talented people — submit your resume and we’ll be in touch when a suitable role opens.</p>
              </div>
              <ButtonLink href="#apply">Submit your resume</ButtonLink>
            </div>
          ) : (
            <ul className="mt-10 border-t border-border">
              {OPENINGS.map((o) => (
                <li key={o.id} className="grid grid-cols-1 gap-2 border-b border-border py-6 md:grid-cols-[2fr_1fr_1fr_auto] md:items-center">
                  <span className="font-semibold text-primary-ink">{o.title}</span>
                  <span className="text-muted">{o.department}</span>
                  <span className="text-muted">{o.location}</span>
                  <ButtonLink href="#apply" variant="ghost">Apply</ButtonLink>
                </li>
              ))}
            </ul>
          )}
        </Container>
      </section>

      <section id="apply" className="bg-surface py-20 lg:py-28" aria-labelledby="apply-title">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <SectionHeading eyebrow="Submit your resume" title={<span id="apply-title">Looking for opportunities to work with us?</span>} size="md" />
            <p className="mt-5 text-muted">Share your details and resume. You can also email us at <a className="font-semibold text-primary underline underline-offset-2" href={`mailto:${SITE.email}?subject=Careers`}>{SITE.email}</a>.</p>
          </div>
          <div className="lg:col-span-8"><CareerForm /></div>
        </Container>
      </section>
    </>
  );
}
