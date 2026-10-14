import { PageHero, PageNav } from "@/components/layout/PageHero";
import { LabGallery, PdcaCycle, PolicyStatement, QualityUnitChart } from "@/components/sections/QualitySections";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { Counter, Reveal } from "@/components/ui/client";
import { Icon } from "@/components/ui/Icon";
import { APPROVALS, JOURNEY } from "@/data/company";
import { SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { asset } from "@/lib/asset";

export const metadata = pageMetadata({
  title: "Quality Systems — Quality Control & Quality Assurance",
  description: "Synthokem's quality systems: an ISO 9001:2015 quality management system, an independent Quality Unit reporting to the Managing Director, qualified QC laboratories, and approvals including USFDA inspection, WHO-GMP, EDQM CEP and KFDA.",
  path: "/quality/",
});

export default function QualityPage() {
  const filings = JOURNEY.filter((m) => m.type === "filing");
  const stats = [
    { value: Math.min(...filings.map((m) => m.year)), label: "First USFDA drug master files" },
    { value: APPROVALS.length, label: "Approvals & certifications" },
    { value: filings.length, label: "Regulatory filings worldwide" },
  ];
  return (
    <>
      <PageHero eyebrow="Quality & assurance" title="Quality goes beyond business." lede="Benchmarking quality and regulatory affairs — Synthokem’s quality systems cover three key functional areas." crumbs={[{ name: "Quality", href: "/quality/" }]} image="lab-precision" />

      <PageNav items={[{ id: "policy", label: "Quality policy" }, { id: "system", label: "Quality system" }, { id: "unit", label: "Quality Unit" }, { id: "labs", label: "Laboratories" }, { id: "regulatory", label: "Regulatory" }]} />

      {/* PPT slide 22: the commitment, with its key promises marked as it comes into view */}
      <section id="policy" className="py-24 lg:py-32">
        <Container className="max-w-5xl">
          <p className="text-[0.74rem] font-semibold uppercase tracking-[0.16em] text-muted">Our quality policy</p>
          <div className="mt-7"><PolicyStatement /></div>
          <Reveal delay={200} className="mt-10 flex items-center gap-4">
            <span aria-hidden="true" className="h-px w-12 bg-accent-strong" />
            <span className="text-sm font-medium text-muted">Synthokem Labs · Quality policy</span>
          </Reveal>
        </Container>
      </section>

      {/* PPT slide 21 */}
      <section id="system" className="border-y border-border bg-surface py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Quality management system" title="A system built to keep improving." highlight="improving." lede="Certified to ISO 9001 since 2000. Requirements go in, a Plan–Do–Check–Act cycle runs without pause, and satisfied customers come out." />
          <div className="mt-16"><PdcaCycle /></div>
        </Container>
      </section>

      {/* PPT slide 23 */}
      <section id="unit" className="py-20 lg:py-28">
        <Container>
          <SectionHeading align="center" eyebrow="Quality Unit" title="Independent by design." lede="Quality assurance and quality control are clearly defined departments within a Quality Unit that answers directly to the Managing Director." />
          <div className="mt-16"><QualityUnitChart /></div>
        </Container>
      </section>

      {/* QC laboratory photographs (PPT slides 18 and 20) */}
      <section id="labs" className="on-dark relative isolate overflow-hidden sky-band py-20 text-white lg:py-28">
        <span aria-hidden="true" className="vmv-orb -left-24 -top-32 h-[24rem] w-[24rem] bg-[#3fa8ee]" />
        <span aria-hidden="true" className="vmv-orb vmv-orb-b -bottom-40 right-[-6rem] h-[26rem] w-[26rem] bg-[#22b8c9]" />
        <Container>
          <SectionHeading tone="light" eyebrow="Laboratories" title="Where every batch is proven." lede="Qualified analysts and sophisticated instruments, at every stage of the process." />
          <div className="mt-12"><LabGallery /></div>
        </Container>
      </section>

      {/* Approvals and status by product live on Regulatory affairs; this is the summary and the way there */}
      <section id="regulatory" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading size="md" eyebrow="Regulatory affairs" title="Audited and recognised worldwide." lede="Approvals, filings and the regulatory status of every commercial API, documented in one place." />
            <Reveal delay={150} className="mt-8"><ButtonLink href="/quality/regulatory-affairs/">Approvals & regulatory status</ButtonLink></Reveal>
          </div>
          <div className="lg:col-span-7">
            <Reveal as="ul" className="grid grid-cols-1 divide-y divide-border border-y border-border sm:grid-cols-3 sm:divide-x sm:divide-y-0">
              {stats.map((s) => (
                <li key={s.label} className="py-6 sm:px-6 sm:first:pl-0">
                  <p className="font-display text-5xl font-semibold tracking-tight text-primary"><Counter value={s.value} /></p>
                  <p className="mt-2 text-sm text-muted">{s.label}</p>
                </li>
              ))}
            </Reveal>
            <Reveal as="ul" delay={120} className="mt-8 divide-y divide-border rounded-xl bg-white ring-1 ring-border">
              <li>
                <a href={SITE.productListPdf} target="_blank" rel="noopener" className="group flex min-h-20 items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-primary-tint/40">
                  <span className="flex items-center gap-4"><Icon name="file" size={22} className="shrink-0 text-accent-strong" /><span><span className="block font-semibold text-primary-ink">Product List</span><span className="font-mono text-xs text-muted">PDF · grades, CAS numbers and regulatory status</span></span></span>
                  <Icon name="download" size={18} className="shrink-0 text-primary" />
                </a>
              </li>
              <li>
                <a href={asset("/enquiry/?type=technical")} className="group flex min-h-20 items-center justify-between gap-4 px-6 py-4 transition-colors hover:bg-primary-tint/40">
                  <span className="flex items-center gap-4"><Icon name="shield" size={22} className="shrink-0 text-accent-strong" /><span><span className="block font-semibold text-primary-ink">Request certificates & documents</span><span className="text-sm text-muted">GMP certificates, DMF/CEP information, specifications, CoA</span></span></span>
                  <Icon name="arrowRight" size={18} className="arrow-nudge shrink-0 text-primary" />
                </a>
              </li>
            </Reveal>
          </div>
        </Container>
      </section>
    </>
  );
}
