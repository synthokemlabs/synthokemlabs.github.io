import type { CSSProperties } from "react";
import { Reveal } from "@/components/ui/client";
import { Icon, type IconName } from "@/components/ui/Icon";
import { Container, SectionHeading, SplitWords } from "@/components/ui/primitives";
import { MISSION, VALUES, VISION } from "@/data/company";

/** Icon inside a ring that draws itself, with a dot orbiting on a slow dashed track. */
function OrbitIcon({ name, delay }: { name: IconName; delay: number }) {
  return (
    <span className="vmv-icon relative grid h-16 w-16 shrink-0 place-items-center">
      <svg viewBox="0 0 64 64" className="absolute inset-0 h-full w-full overflow-visible" aria-hidden="true">
        <circle cx="32" cy="32" r="27" fill="rgb(255 255 255 / 0.12)" />
        <circle cx="32" cy="32" r="27" fill="none" stroke="rgb(255 255 255 / 0.75)" strokeWidth="1.5" pathLength={1} className="draw-path" transform="rotate(-90 32 32)" style={{ "--draw-delay": `${delay}s` } as CSSProperties} />
        <g className="vmv-orbit">
          <circle cx="32" cy="32" r="31.5" fill="none" stroke="rgb(255 255 255 / 0.25)" strokeDasharray="1.5 5" />
          <circle cx="32" cy="0.5" r="2.6" fill="var(--accent-soft)" />
        </g>
      </svg>
      <Icon name={name} size={24} strokeWidth={1.5} className="vmv-glyph relative text-white" />
    </span>
  );
}

/** Vision, mission and values (PPT slide 3) as three animated glass cards on the sky band. */
export function VisionMissionValues() {
  const statements = [
    { k: "Vision", v: VISION, icon: "eye" as const },
    { k: "Mission", v: MISSION, icon: "target" as const },
  ];
  return (
    <section id="vision" className="on-dark relative isolate overflow-hidden sky-band py-20 text-white lg:py-28">
      <div aria-hidden="true" className="grid-paper-dark absolute inset-0 -z-10" />
      {/* Slow-moving light behind the glass cards */}
      <span aria-hidden="true" className="vmv-orb -left-24 -top-24 h-[26rem] w-[26rem] bg-[#3fa8ee]" />
      <span aria-hidden="true" className="vmv-orb vmv-orb-b -bottom-32 right-[-6rem] h-[30rem] w-[30rem] bg-[#22b8c9]" />

      <Container>
        <SectionHeading tone="light" eyebrow="What drives us" title="Vision, mission & values." size="md" />
        <div className="mt-14 grid grid-cols-1 gap-5 md:grid-cols-3">
          {statements.map((x, i) => (
            <Reveal key={x.k} variant="rise3d" delay={i * 150} className="h-full">
              <article className="vmv-card relative flex h-full flex-col overflow-hidden rounded-2xl p-7 sm:p-8">
                <span aria-hidden="true" className="vmv-line" />
                <div className="flex items-start justify-between">
                  <OrbitIcon name={x.icon} delay={0.35 + i * 0.15} />
                  <span className="font-mono text-sm text-white/45">0{i + 1}</span>
                </div>
                <h3 className="eyebrow mt-7 text-accent-soft">{x.k}</h3>
                <p className="mt-3 font-display text-[1.35rem] font-medium leading-snug text-white">
                  <SplitWords text={x.v} base={450 + i * 150} />
                </p>
              </article>
            </Reveal>
          ))}
          <Reveal variant="rise3d" delay={300} className="h-full">
            <article className="vmv-card relative flex h-full flex-col overflow-hidden rounded-2xl p-7 sm:p-8">
              <span aria-hidden="true" className="vmv-line" />
              <div className="flex items-start justify-between">
                <OrbitIcon name="award" delay={0.65} />
                <span className="font-mono text-sm text-white/45">03</span>
              </div>
              <h3 className="eyebrow mt-7 text-accent-soft">Values</h3>
              <ul className="mt-3 space-y-1.5">
                {VALUES.map((v, i) => (
                  <li key={v} className="vmv-value flex items-center gap-3 rounded-lg px-2 py-1.5 -mx-2" style={{ "--i": i } as CSSProperties}>
                    <svg viewBox="0 0 20 20" className="h-5 w-5 shrink-0" aria-hidden="true">
                      <circle cx="10" cy="10" r="9" fill="rgb(255 255 255 / 0.14)" />
                      <path d="M6 10.2 8.7 13 14 7.4" fill="none" stroke="var(--accent-soft)" strokeWidth="1.8" strokeLinecap="round" strokeLinejoin="round" pathLength={1} className="draw-path" style={{ "--draw-delay": `${0.9 + i * 0.1}s` } as CSSProperties} />
                    </svg>
                    <span className="font-display text-lg font-medium text-white">{v}</span>
                  </li>
                ))}
              </ul>
            </article>
          </Reveal>
        </div>
      </Container>
    </section>
  );
}
