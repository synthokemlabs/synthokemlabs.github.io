import { PageHero, PageNav } from "@/components/layout/PageHero";
import { QmsCycle } from "@/components/diagrams/Diagrams";
import { Container, Eyebrow, SectionHeading } from "@/components/ui/primitives";
import { Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { Icon } from "@/components/ui/Icon";
import { QA_RESPONSIBILITIES, QUALITY_POLICY, QUALITY_UNIT } from "@/data/company";
import { SITE } from "@/data/site";
import { pageMetadata } from "@/lib/seo";
import { asset } from "@/lib/asset";

export const metadata = pageMetadata({
  title: "Quality Systems — Quality Control & Quality Assurance",
  description: "Synthokem's quality systems: an ISO 9001:2015 quality management system, an independent Quality Unit reporting to the Managing Director, qualified QC laboratories, and approvals including USFDA inspection, WHO-GMP, EDQM CEP and KFDA.",
  path: "/quality/",
});

/** QC laboratory photographs from the company presentation (slides 18 and 20). */
const QC_LAB = [
  { name: "hplc-system", caption: "HPLC system" },
  { name: "gc-instruments", caption: "Gas chromatographs" },
  { name: "melting-point", caption: "Melting point apparatus" },
  { name: "qc-instrument-lab", caption: "QC laboratory" },
];

export default function QualityPage() {
  return (
    <>
      <PageHero eyebrow="Quality & assurance" title="Quality goes beyond business." lede="Benchmarking quality and regulatory affairs — Synthokem’s quality systems cover three key functional areas." crumbs={[{ name: "Quality", href: "/quality/" }]} image="lab-precision" />

      <PageNav items={[{ id: "qms", label: "Quality system" }, { id: "policy", label: "Quality policy" }, { id: "control", label: "Quality control" }, { id: "assurance", label: "Quality unit" }, { id: "documents", label: "Documents" }]} />

      {/* PPT slide 21 */}
      <section id="qms" className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Quality management system" title="An ISO 9001:2015 system that keeps improving." lede="Customer requirements and the needs of interested parties feed a Plan–Do–Check–Act cycle; its outputs are customer satisfaction, the results of the QMS, and products and services." />
          <div className="mt-14"><QmsCycle /></div>
        </Container>
      </section>

      {/* PPT slide 22 */}
      <section id="policy" className="bg-surface py-20 lg:py-28">
        <Container className="grid grid-cols-1 items-center gap-12 lg:grid-cols-12 lg:gap-16">
          <Reveal className="lg:col-span-7">
            <Eyebrow>Quality policy</Eyebrow>
            <blockquote className="mt-6">
              <p className="font-display text-[1.45rem] font-medium leading-snug tracking-[-0.015em] text-primary-ink sm:text-[1.9rem]">
                <span className="text-accent-strong">“</span>{QUALITY_POLICY}<span className="text-accent-strong">”</span>
              </p>
            </blockquote>
          </Reveal>
          <Reveal variant="image" delay={120} className="zoom-parent overflow-hidden rounded-lg lg:col-span-5">
            <Img name="qa-team" sizes="(min-width:1024px) 40vw, 100vw" className="zoom-img aspect-[4/3] w-full object-cover" />
          </Reveal>
        </Container>
      </section>

      <section className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-6 lg:grid-cols-2">
          <article id="control" className="overflow-hidden rounded-lg bg-white ring-1 ring-border">
            <Img name="qc-analyst" sizes="(min-width:1024px) 50vw, 100vw" className="aspect-[16/9] w-full object-cover" />
            <div className="p-8 lg:p-10">
              <p className="eyebrow text-accent-strong">Quality control</p>
              <h2 className="display-md mt-4 text-primary-ink">Qualified people, sophisticated instruments.</h2>
              <p className="mt-5 leading-relaxed text-muted">The Quality Control laboratory is staffed by qualified, well-trained personnel and equipped with sophisticated instruments to ensure product quality and consistency at various stages of the process. Quality Control is responsible for all analysis undertaken at Synthokem — and provides analytical support and training to customers during product and method development and validation.</p>
            </div>
          </article>
          {/* PPT slide 23 */}
          <article id="assurance" className="overflow-hidden rounded-lg bg-white ring-1 ring-border">
            <Img name="qa-office" sizes="(min-width:1024px) 50vw, 100vw" className="aspect-[16/9] w-full object-cover" />
            <div className="p-8 lg:p-10">
              <p className="eyebrow text-accent-strong">Quality assurance</p>
              <h2 className="display-md mt-4 text-primary-ink">An independent Quality Unit.</h2>
              <ul className="mt-5 space-y-2.5">
                {QUALITY_UNIT.map((x) => <li key={x} className="flex gap-2.5 leading-relaxed text-muted"><Icon name="check" size={17} className="mt-1 shrink-0 text-accent-strong" />{x}</li>)}
              </ul>
              <h3 className="eyebrow mt-7 text-muted">QA responsibilities</h3>
              <ul className="mt-3 flex flex-wrap gap-2">
                {QA_RESPONSIBILITIES.map((x) => <li key={x} className="rounded-full bg-primary-tint px-3 py-1.5 text-[0.82rem] font-medium text-primary-ink">{x}</li>)}
              </ul>
            </div>
          </article>
        </Container>
        <Container className="mt-12">
          <h2 className="eyebrow text-muted">Inside our QC laboratories</h2>
          <ul className="mt-6 grid grid-cols-2 gap-3 lg:grid-cols-4">
            {QC_LAB.map((p, i) => (
              <Reveal as="li" key={p.name} variant="image" delay={i * 80} className="zoom-parent relative aspect-[4/3] overflow-hidden rounded-lg bg-surface">
                <Img name={p.name} sizes="(min-width:1024px) 25vw, 50vw" className="zoom-img absolute inset-0 h-full w-full object-cover" />
                <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-3 pb-2.5 pt-8 text-[0.8rem] font-medium text-white">{p.caption}</span>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section id="documents" className="border-t border-border bg-surface py-20">
        <Container className="grid grid-cols-1 gap-10 lg:grid-cols-12">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="Documents" title="Quality & regulatory documentation." size="md" />
            <p className="mt-5 text-muted">Certificates, specifications, CoAs and regulatory documents are shared on request with qualified customers and partners.</p>
          </div>
          <ul className="divide-y divide-border self-start rounded-lg bg-white ring-1 ring-border lg:col-span-7">
            <li>
              <a href={asset("/quality/regulatory-affairs/")} className="group flex min-h-20 items-center justify-between gap-4 px-6 py-4 hover:bg-primary-tint/40">
                <span className="flex items-center gap-4"><Icon name="award" size={22} className="text-accent-strong" /><span><span className="block font-semibold text-primary-ink">Approvals & certifications</span><span className="text-sm text-muted">USFDA, EDQM, WHO-GMP, KFDA, ISO and ZED — with regulatory status by product</span></span></span>
                <Icon name="arrowRight" size={18} className="arrow-nudge text-primary" />
              </a>
            </li>
            <li>
              <a href={SITE.productListPdf} target="_blank" rel="noopener" className="group flex min-h-20 items-center justify-between gap-4 px-6 py-4 hover:bg-primary-tint/40">
                <span className="flex items-center gap-4"><Icon name="file" size={22} className="text-accent-strong" /><span><span className="block font-semibold text-primary-ink">Product List</span><span className="font-mono text-xs text-muted">PDF · grades, CAS numbers and regulatory status</span></span></span>
                <Icon name="download" size={18} className="text-primary" />
              </a>
            </li>
            <li>
              <a href={asset("/enquiry/?type=technical")} className="group flex min-h-20 items-center justify-between gap-4 px-6 py-4 hover:bg-primary-tint/40">
                <span className="flex items-center gap-4"><Icon name="shield" size={22} className="text-accent-strong" /><span><span className="block font-semibold text-primary-ink">Request certificates & regulatory documents</span><span className="text-sm text-muted">GMP certificates, DMF/CEP information, specifications, CoA</span></span></span>
                <Icon name="arrowRight" size={18} className="arrow-nudge text-primary" />
              </a>
            </li>
          </ul>
        </Container>
      </section>
    </>
  );
}
