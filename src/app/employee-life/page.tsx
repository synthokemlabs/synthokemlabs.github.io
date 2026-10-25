import type { CSSProperties } from "react";
import { Breadcrumbs, PageNav } from "@/components/layout/PageHero";
import { BusRoute, CoverExplorer, HeartTrace, HeroOrbit, ShiftDial, Spotlight, TripRoute } from "@/components/sections/EmployeeLifeSections";
import { ButtonLink, Container, SectionHeading, SplitWords } from "@/components/ui/primitives";
import { Counter, Parallax, Reveal } from "@/components/ui/client";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { ALL_BENEFITS, DAILY, SHIFT, YEARLY } from "@/data/employee-life";
import { pageMetadata } from "@/lib/seo";

export const metadata = pageMetadata({
  title: "Employee Life — Benefits at Synthokem Labs",
  description: "Life at Synthokem Labs: group medical claim (GMC), group term life insurance (GTLI) and group personal accident (GPA) cover, a free bus facility, 50% off canteen food, free dresses, shift allowances, a yearly free medical check-up and yearly trips.",
  path: "/employee-life/",
});

const STATS = [
  { v: 3, suffix: "", label: "insurance covers for every employee" },
  { v: 50, suffix: "%", label: "off every meal in the canteen" },
  { v: 0, suffix: "", label: "rupees spent on your daily commute", prefix: "₹" },
  { v: 1, suffix: "", label: "company trip, every single year" },
];

// The order a working day unfolds in — each step is one of the everyday benefits
const DAY = [
  { icon: "bus", t: "Ride in", d: "Free company bus" },
  { icon: "shirt", t: "Suit up", d: "Free work dress" },
  { icon: "utensils", t: "Lunch break", d: "Half-price meals" },
  { icon: "bus", t: "Ride home", d: "Free, again" },
] as const;

const nd = (s: number) => ({ "--node-delay": `${s}s` }) as CSSProperties;

export default function EmployeeLifePage() {
  return (
    <>
      {/* ---------- Hero: sky band over a team photograph, every benefit on one ring ---------- */}
      <section className="hero-play on-dark relative isolate overflow-hidden sky-band text-white">
        <Parallax speed={0.15} className="absolute inset-0 -z-20">
          <Img name="qa-team" priority sizes="100vw" alt="" className="ken-burns h-full w-full object-cover" />
        </Parallax>
        <div aria-hidden="true" className="absolute inset-0 -z-10 bg-[linear-gradient(180deg,rgb(8_64_118/0.94)_0%,rgb(12_88_155/0.9)_100%)] lg:bg-[linear-gradient(100deg,rgb(8_64_118/0.96)_0%,rgb(12_88_155/0.9)_50%,rgb(17_104_173/0.82)_100%)]" />
        <span aria-hidden="true" className="vmv-orb -z-10 right-[8%] top-[12%] h-[26rem] w-[26rem] bg-[#3fa8ee]" />

        <Container className="grid grid-cols-1 items-center gap-14 pb-14 pt-36 lg:grid-cols-12 lg:pb-20 lg:pt-44">
          <div className="lg:col-span-7">
            <div className="hero-in"><Breadcrumbs items={[{ name: "Employee Life", href: "/employee-life/" }]} /></div>
            <p className="hero-in mt-10 flex items-center gap-4 text-[0.78rem] font-semibold uppercase tracking-[0.18em] text-on-dark-muted" style={{ "--d": "80ms" } as CSSProperties}><span aria-hidden="true" className="h-px w-10 bg-accent" />Employee life at Synthokem</p>
            <h1 className="display-xl mt-5 max-w-3xl font-display text-white">
              <SplitWords text="Cared for at work, and well beyond it." highlight="well beyond it." base={120} highlightClass="text-[#a9dcfb]" />
            </h1>
            <p className="lede hero-in mt-6 max-w-2xl text-on-dark-muted" style={{ "--d": "420ms" } as CSSProperties}>
              Our people are our most valuable asset. From insurance that protects your family to a free ride to work and a trip every year, here is how Synthokem looks after the people who look after our chemistry.
            </p>
            <div className="hero-in mt-9 flex flex-wrap gap-3" style={{ "--d": "540ms" } as CSSProperties}>
              <ButtonLink href="#protection" variant="light">Explore the benefits</ButtonLink>
              <ButtonLink href="/careers/" variant="outline-light">Join our team</ButtonLink>
            </div>
          </div>

          <div className="lg:col-span-5">
            <Reveal variant="scale" delay={300} className="hidden lg:block"><HeroOrbit /></Reveal>
            <ul className="hero-in flex flex-wrap gap-2 lg:hidden" aria-label="Employee benefits" style={{ "--d": "620ms" } as CSSProperties}>
              {ALL_BENEFITS.map((b) => (
                <li key={b.label}><a href={b.href} className="inline-flex min-h-10 items-center gap-2 rounded-full bg-white/10 px-3.5 text-[0.84rem] font-medium text-white ring-1 ring-inset ring-white/25 transition-colors hover:bg-white/20"><Icon name={b.icon} size={15} className="text-[#a9dcfb]" />{b.label}</a></li>
              ))}
            </ul>
          </div>
        </Container>

        <Container className="pb-14 lg:pb-20">
          <dl className="grid grid-cols-2 gap-px overflow-hidden rounded-2xl bg-white/15 ring-1 ring-white/20 lg:grid-cols-4">
            {STATS.map((s, i) => (
              <div key={s.label} className="hero-in bg-[#0b4d8c]/70 p-5 sm:p-6" style={{ "--d": `${700 + i * 90}ms` } as CSSProperties}>
                <dt className="sr-only">{s.label}</dt>
                <dd>
                  <span className="font-display text-4xl font-semibold tracking-tight text-white sm:text-5xl">{s.prefix}<Counter value={s.v} suffix={s.suffix} /></span>
                  <span className="mt-2 block text-[0.86rem] leading-snug text-on-dark-muted" aria-hidden="true">{s.label}</span>
                </dd>
              </div>
            ))}
          </dl>
        </Container>
      </section>

      {/* ---------- Ribbon of every benefit ---------- */}
      <div className="el-marquee overflow-hidden border-b border-border bg-surface py-4" aria-hidden="true">
        <div className="el-marquee-track flex w-max">
          {[0, 1].map((copy) => (
            <div key={copy} className="flex shrink-0">
              {ALL_BENEFITS.map((b) => (
                <span key={b.label} className="flex items-center gap-3 whitespace-nowrap pr-12 font-display text-lg font-semibold text-primary-ink">
                  <Icon name={b.icon} size={18} className="text-primary" />{b.label}<span className="ml-9 h-1.5 w-1.5 rounded-full bg-accent" />
                </span>
              ))}
            </div>
          ))}
        </div>
      </div>

      <PageNav items={[{ id: "protection", label: "Protection" }, { id: "everyday", label: "Every day" }, { id: "shifts", label: "Every shift" }, { id: "yearly", label: "Every year" }, { id: "glance", label: "At a glance" }]} />

      {/* ---------- 01 Protection ---------- */}
      <section id="protection" className="bg-surface py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7"><SectionHeading eyebrow="Protection" index="01" title="Three layers of cover, wrapped around you." highlight="wrapped around you." size="md" /></div>
            <Reveal delay={120} className="lg:col-span-5"><p className="leading-relaxed text-muted">Health, life and accident insurance work together, so you and your family are protected whatever happens. Pick a layer to see what it covers.</p></Reveal>
          </div>
          <Reveal delay={150} className="mt-14"><CoverExplorer /></Reveal>
        </Container>
      </section>

      {/* ---------- 02 Every day ---------- */}
      <section id="everyday" className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="Every day" index="02" title="The small things that make every day easier." size="md" />
          <div className="mt-12 grid grid-cols-1 gap-5 md:grid-cols-6">
            <Reveal variant="rise3d" className="md:col-span-4">
              <Spotlight className="sky-band-deep flex h-full flex-col justify-between rounded-2xl p-7 text-white sm:p-9">
                <div className="flex items-start justify-between gap-6">
                  <div className="max-w-md">
                    <span className="el-icon-light grid h-12 w-12 place-items-center rounded-xl"><Icon name="bus" size={22} /></span>
                    <h3 className="mt-5 text-2xl font-semibold">{DAILY[0].title}</h3>
                    <p className="mt-3 leading-relaxed text-on-dark-muted">{DAILY[0].text}</p>
                  </div>
                  <span className="hidden shrink-0 rounded-full bg-white/10 px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#a9dcfb] ring-1 ring-white/15 sm:inline">Free</span>
                </div>
                <div className="mt-8"><BusRoute /></div>
              </Spotlight>
            </Reveal>

            <Reveal variant="rise3d" delay={100} className="md:col-span-2">
              <Spotlight className="el-card-sky flex h-full flex-col rounded-2xl p-7 text-white sm:p-9">
                <div className="flex items-center justify-between">
                  <span className="grid h-12 w-12 place-items-center rounded-xl bg-white/15 ring-1 ring-white/25"><Icon name="utensils" size={22} /></span>
                  <svg viewBox="0 0 36 36" className="h-20 w-20 -rotate-90" aria-hidden="true">
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="rgb(255 255 255 / 0.25)" strokeWidth="4" />
                    <circle cx="18" cy="18" r="15.9" fill="none" stroke="#fff" strokeWidth="4" strokeLinecap="round" pathLength={100} className="ring-meter" style={{ "--off": 50, ...nd(0.5) } as CSSProperties} />
                  </svg>
                </div>
                <p className="mt-auto pt-8 font-display text-7xl font-bold leading-none tracking-tight"><Counter value={50} suffix="%" /></p>
                <h3 className="mt-2 text-xl font-semibold">Discount on food</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-white/85">{DAILY[1].text}</p>
              </Spotlight>
            </Reveal>

            <Reveal variant="rise3d" delay={60} className="md:col-span-2">
              <Spotlight className="flex h-full flex-col rounded-2xl bg-white p-7 ring-1 ring-border sm:p-9">
                <span className="el-icon grid h-12 w-12 place-items-center rounded-xl"><Icon name="shirt" size={22} /></span>
                <h3 className="mt-5 text-xl font-semibold text-primary-ink">{DAILY[2].title}</h3>
                <p className="mt-2 text-[0.95rem] leading-relaxed text-muted">{DAILY[2].text}</p>
                <div className="mt-auto flex gap-2 pt-8" aria-hidden="true">
                  {["#0b2e4f", "#1168ad", "#3fa8ee", "#ffffff"].map((c, i) => (
                    <span key={c} className="el-swatch grid h-11 w-11 place-items-center rounded-full ring-1 ring-border" style={{ background: c, "--i": i } as CSSProperties}>
                      <Icon name="shirt" size={18} className={c === "#ffffff" ? "text-primary-ink" : "text-white"} />
                    </span>
                  ))}
                </div>
              </Spotlight>
            </Reveal>

            <Reveal variant="rise3d" delay={140} className="md:col-span-4">
              <div className="h-full rounded-2xl bg-surface p-7 ring-1 ring-border sm:p-9">
                <p className="font-mono text-[0.72rem] font-semibold uppercase tracking-[0.14em] text-accent-strong">A day at Synthokem</p>
                <h3 className="mt-2 text-xl font-semibold text-primary-ink">Taken care of, from the first stop to the last.</h3>
                <ol className="relative mt-8 grid grid-cols-2 gap-x-6 gap-y-8 sm:grid-cols-4">
                  {/* Rail runs exactly from the first stop's centre to the last's */}
                  <span aria-hidden="true" className="absolute left-6 right-[calc((100%_-_4.5rem)/4_-_1.5rem)] top-6 hidden h-0.5 bg-border-strong sm:block">
                    <span className="solar-bar block h-full origin-left bg-primary" style={nd(0.3)} />
                  </span>
                  {DAY.map((s, i) => (
                    <li key={s.t} className="node-pop relative" style={nd(0.35 + i * 0.3)}>
                      <span className="relative grid h-12 w-12 place-items-center rounded-full bg-white text-primary shadow-[0_10px_24px_-14px_rgb(17_104_173/0.7)] ring-1 ring-border"><Icon name={s.icon} size={20} /></span>
                      <span className="mt-3 block font-semibold text-primary-ink">{s.t}</span>
                      <span className="block text-[0.88rem] text-muted">{s.d}</span>
                    </li>
                  ))}
                </ol>
              </div>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- 03 Every shift ---------- */}
      <section id="shifts" className="on-dark relative isolate overflow-hidden sky-band py-20 text-white lg:py-28">
        <span aria-hidden="true" className="vmv-orb -left-24 -top-32 h-[24rem] w-[24rem] bg-[#3fa8ee]" />
        <span aria-hidden="true" className="vmv-orb vmv-orb-b -bottom-40 right-[-6rem] h-[26rem] w-[26rem] bg-[#22b8c9]" />
        <Container className="grid grid-cols-1 items-center gap-14 lg:grid-cols-12">
          <div className="lg:col-span-6">
            <SectionHeading eyebrow="Every shift" index="03" title="Day or night, your effort counts." highlight="your effort counts." size="md" tone="light" />
            <Reveal delay={120}><p className="lede mt-6 text-on-dark-muted">{SHIFT.text}</p></Reveal>
            <Reveal delay={200} className="mt-8 flex flex-wrap gap-3">
              {["Important departments", "Shift-based roles", "Paid on top of salary"].map((t) => (
                <span key={t} className="inline-flex items-center gap-2 rounded-full bg-white/10 px-4 py-2 text-[0.86rem] font-medium ring-1 ring-inset ring-white/25"><Icon name="check" size={15} className="text-[#a9dcfb]" />{t}</span>
              ))}
            </Reveal>
          </div>
          <Reveal variant="scale" delay={150} className="lg:col-span-6"><ShiftDial /></Reveal>
        </Container>
      </section>

      {/* ---------- 04 Every year ---------- */}
      <section id="yearly" className="bg-surface py-20 lg:py-28">
        <Container>
          <div className="grid grid-cols-1 items-end gap-8 lg:grid-cols-12">
            <div className="lg:col-span-7"><SectionHeading eyebrow="Every year" index="04" title="A health check and a holiday, every year." highlight="every year." size="md" /></div>
            <Reveal delay={120} className="lg:col-span-5"><p className="leading-relaxed text-muted">Two things on the calendar every Synthokem employee looks forward to: a free check-up to stay well, and a trip to switch off and refresh.</p></Reveal>
          </div>
          <div className="mt-12 grid grid-cols-1 gap-5 lg:grid-cols-2">
            <Reveal variant="rise3d">
              <Spotlight className="flex h-full flex-col rounded-2xl bg-white p-7 ring-1 ring-border sm:p-10">
                <div className="flex items-center justify-between">
                  <span className="el-icon grid h-14 w-14 place-items-center rounded-xl"><Icon name={YEARLY[0].icon} size={26} /></span>
                  <span className="rounded-full bg-primary-tint px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-accent-strong">Free · yearly</span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold text-primary-ink">{YEARLY[0].title}</h3>
                <p className="mt-3 leading-relaxed text-muted">{YEARLY[0].text}</p>
                <div className="mt-auto pt-8"><HeartTrace /></div>
              </Spotlight>
            </Reveal>
            <Reveal variant="rise3d" delay={120}>
              <Spotlight className="sky-band-deep flex h-full flex-col rounded-2xl p-7 text-white sm:p-10">
                <div className="flex items-center justify-between">
                  <span className="el-icon-light grid h-14 w-14 place-items-center rounded-xl"><Icon name={YEARLY[1].icon} size={26} /></span>
                  <span className="rounded-full bg-white/10 px-3 py-1 font-mono text-[0.7rem] font-semibold uppercase tracking-[0.12em] text-[#a9dcfb] ring-1 ring-white/15">Every year</span>
                </div>
                <h3 className="mt-6 text-2xl font-semibold">{YEARLY[1].title}</h3>
                <p className="mt-3 leading-relaxed text-on-dark-muted">{YEARLY[1].text}</p>
                <div className="mt-auto pt-6"><TripRoute /></div>
              </Spotlight>
            </Reveal>
          </div>
        </Container>
      </section>

      {/* ---------- At a glance ---------- */}
      <section id="glance" className="py-20 lg:py-28">
        <Container>
          <SectionHeading eyebrow="At a glance" index="05" title="Everything you get, in one place." align="center" size="md" />
          <ul className="mx-auto mt-12 grid max-w-5xl grid-cols-1 gap-3 sm:grid-cols-2">
            {ALL_BENEFITS.map((b, i) => (
              <Reveal as="li" key={b.label} delay={(i % 2) * 70 + Math.floor(i / 2) * 40} className={i === ALL_BENEFITS.length - 1 && i % 2 === 0 ? "sm:col-span-2" : ""}>
                <a href={b.href} className="el-row group flex min-h-16 items-center gap-4 rounded-xl bg-white px-5 py-3 ring-1 ring-border">
                  <span className="font-mono text-[0.72rem] text-muted">{String(i + 1).padStart(2, "0")}</span>
                  <span className="grid h-10 w-10 shrink-0 place-items-center rounded-lg bg-primary-tint text-primary transition-colors group-hover:bg-primary group-hover:text-white"><Icon name={b.icon} size={18} /></span>
                  <span className="flex-1 font-semibold text-primary-ink">{b.label}</span>
                  <Icon name="arrowRight" size={17} className="arrow-nudge text-primary" />
                </a>
              </Reveal>
            ))}
          </ul>
        </Container>
      </section>

      <section className="on-dark bg-primary py-16 text-white">
        <Container className="flex flex-col justify-between gap-6 md:flex-row md:items-center">
          <div>
            <p className="display-md max-w-2xl text-white">Be part of a team that takes care of its own.</p>
            <p className="mt-3 text-on-dark-muted">Explore careers in R&amp;D, manufacturing, quality and more.</p>
          </div>
          <div className="flex flex-wrap gap-3">
            <ButtonLink href="/careers/#apply" variant="light">Submit your resume</ButtonLink>
            <ButtonLink href="/careers/#openings" variant="outline-light">Current openings</ButtonLink>
          </div>
        </Container>
      </section>
    </>
  );
}
