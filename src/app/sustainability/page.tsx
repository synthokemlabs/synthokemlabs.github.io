import { PageHero, PageNav } from "@/components/layout/PageHero";
import { ButtonLink, Container, SectionHeading } from "@/components/ui/primitives";
import { Counter, Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { Icon, type IconName } from "@/components/ui/Icon";
import { MISSION } from "@/data/company";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Sustainability & Social Responsibility",
  description: "Synthokem's environmental and social initiatives: solar energy, wastewater management, recycling of ~80% non-hazardous and ~60% hazardous waste, and community programmes in education, nutrition and healthcare.",
  path: "/sustainability/",
});

const ENV: { t: string; d: string; icon: IconName }[] = [
  { t: "Renewable energy", icon: "factory", d: "Synthokem Labs was one of the first pharma companies to harvest solar energy in India. To reduce our energy footprint, our facilities are powered by renewable sources — balancing environmental responsibility, financial performance and business commitments." },
  { t: "Wastewater management", icon: "globe", d: "With wastewater management practices in place at all our facilities, our operations comply with water management standards in a safe and sustainable environment." },
  { t: "Recycling & waste management", icon: "leaf", d: "We follow a clear waste management strategy: prevention and reduction are always preferred to treatment, incineration or disposal — and we continue to maximise opportunities for reuse and recycling." },
];

const SOCIAL: { t: string; d: string; icon: IconName }[] = [
  { t: "Education", icon: "users", d: "Synthokem actively contributes to the education of the girl child and financially challenged students — helping break the cycle of illiteracy by empowering children from economically and socially backward communities." },
  { t: "Support", icon: "message", d: "We participate in the mid-day meal scheme by Akshaya Patra, and support orphanages including Shantiniketan and The United Orphanage for the Disabled, serving differently-abled individuals." },
  { t: "Healthcare", icon: "shield", d: "We are part of support initiatives by hospitals in Telangana that aid the treatment of underprivileged children and adults, and provide assistance to people living with HIV in association with the Network of HIV+ People." },
];

export default function SustainabilityPage() {
  return (
    <>
      <PageHero eyebrow="Social responsibility" title="Extending beyond business." lede="Conducting our business with complete respect for the environment and community — through long-term, sustainable initiatives led by our dedicated CSR wing." crumbs={[{ name: "Sustainability", href: "/sustainability/" }]} image="csr-environment" />
      <PageNav items={[{ id: "commitment", label: "Our commitment" }, { id: "environment", label: "Environment" }, { id: "community", label: "Community" }]} />

      <section id="commitment" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Our commitment" title="Responsibility as part of how we operate." size="md" />
            <p className="lede mt-6 text-muted">{MISSION}</p>
          </div>
          <dl className="grid grid-cols-2 gap-6 self-end lg:col-span-5 lg:col-start-8">
            <div className="border-t-2 border-primary pt-4"><dd className="font-display text-5xl font-semibold text-primary"><Counter value={80} suffix="%" /></dd><dt className="mt-2 text-sm text-muted">of non-hazardous waste recycled (approximately)</dt></div>
            <div className="border-t-2 border-primary pt-4"><dd className="font-display text-5xl font-semibold text-primary"><Counter value={60} suffix="%" /></dd><dt className="mt-2 text-sm text-muted">of hazardous waste recycled (approximately)</dt></div>
          </dl>
        </Container>
      </section>

      <section id="environment" className="bg-surface py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 items-end gap-10 lg:grid-cols-12">
            <SectionHeading className="lg:col-span-7" eyebrow="Environment" title="Paving the way for a sustainable future." />
            <p className="text-muted lg:col-span-5">We strive to use natural resources efficiently and minimise the environmental impact of our activities and products. Beyond contributing to the World Wildlife Fund, we raise awareness among employees and equip our facilities with technology that ensures responsible practices.</p>
          </div>
          <ul className="mt-14 grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border md:grid-cols-3">
            {ENV.map((x, i) => (
              <Reveal as="li" key={x.t} delay={i * 80} className="bg-white p-8">
                <Icon name={x.icon} size={26} strokeWidth={1.4} className="text-accent-strong" />
                <h3 className="mt-8 text-xl font-semibold text-primary-ink">{x.t}</h3>
                <p className="mt-3 leading-relaxed text-muted">{x.d}</p>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section id="community" className="py-20 lg:py-28">
        <Container className="grid grid-cols-1 gap-12 lg:grid-cols-12 lg:gap-16">
          <div className="lg:col-span-5">
            <SectionHeading eyebrow="People & community" title="Empowering people through meaningful initiatives." size="md" />
            <p className="mt-6 text-muted">Our aim is to address the challenges faced by society and help those unable to care for their basic requirements. Our projects are not limited to financial help — we make a long-term commitment to their well-being.</p>
            <div className="mt-10 grid grid-cols-2 gap-3">
              <Reveal variant="image" className="zoom-parent overflow-hidden rounded-lg"><Img name="csr-education" sizes="(min-width:1024px) 20vw, 50vw" className="zoom-img aspect-square w-full object-cover" /></Reveal>
              <Reveal variant="image" delay={100} className="zoom-parent overflow-hidden rounded-lg"><Img name="csr-community" sizes="(min-width:1024px) 20vw, 50vw" className="zoom-img aspect-square w-full object-cover" /></Reveal>
            </div>
          </div>
          <ol className="lg:col-span-7">
            {SOCIAL.map((x, i) => (
              <Reveal as="li" key={x.t} delay={i * 70} className="grid grid-cols-[3rem_1fr] gap-4 border-t border-border py-8 last:border-b">
                <Icon name={x.icon} size={24} strokeWidth={1.4} className="mt-1 text-accent-strong" />
                <div><h3 className="text-xl font-semibold text-primary-ink">{x.t}</h3><p className="mt-2 leading-relaxed text-muted">{x.d}</p></div>
              </Reveal>
            ))}
          </ol>
        </Container>
      </section>

      <section className="on-dark bg-primary py-16 text-white">
        <Container className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <p className="display-md max-w-2xl text-white">Responsible manufacturing is part of our quality story.</p>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/capabilities/manufacturing/#safety" variant="light">Safety & environment</ButtonLink>
            <ButtonLink href="/careers/" variant="outline-light">Careers</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
