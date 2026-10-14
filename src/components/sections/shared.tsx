import Link from "next/link";
import type { CSSProperties } from "react";
import { APPROVALS, FACILITIES, TOTAL_CAPACITY_KL, type Approval } from "@/data/company";
import { LOCATIONS } from "@/data/site";
import { Icon } from "@/components/ui/Icon";
import { Img } from "@/components/ui/Img";
import { Counter, Reveal } from "@/components/ui/client";
import { asset } from "@/lib/asset";

/** The certifying body's logo (from the company presentation), or a designed seal where the slide has none. */
export function ApprovalMark({ a, size = "md" }: { a: Approval; size?: "sm" | "md" }) {
  const box = size === "sm" ? "h-12 w-28" : "h-16 w-40";
  if (a.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset(a.logo.src)} alt="" width={a.logo.width} height={a.logo.height} loading="lazy" decoding="async" className={`${box} object-contain object-left`} />;
  }
  const seal = size === "sm" ? "h-12 w-12" : "h-16 w-16";
  return (
    <span aria-hidden="true" className={`${seal} relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent-strong text-white ring-4 ring-primary-tint`}>
      <span className="absolute inset-[5px] rounded-full border border-dashed border-white/45" />
      <Icon name={a.short === "Kosher" ? "award" : "shield"} size={size === "sm" ? 18 : 24} strokeWidth={1.6} />
    </span>
  );
}

/** Approvals and certifications, each with its logo or seal. */
export function ApprovalsGrid({ limit }: { limit?: number }) {
  const list = limit ? APPROVALS.slice(0, limit) : APPROVALS;
  return (
    <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border sm:grid-cols-2 lg:grid-cols-4">
      {list.map((a, i) => (
        <Reveal as="li" key={a.short} delay={(i % 4) * 60} className="group flex flex-col bg-white p-6 transition-colors hover:bg-surface">
          <div className="flex h-20 items-center">
            <span className="inline-flex transition-transform duration-500 ease-out group-hover:scale-105">
              <ApprovalMark a={a} />
            </span>
          </div>
          <div className="mt-5 flex items-baseline justify-between gap-3">
            <span className="font-display text-xl font-semibold tracking-tight text-primary">{a.short}</span>
            {a.since && <span className="shrink-0 font-mono text-[0.68rem] text-muted">since {a.since}</span>}
          </div>
          <p className="mt-1 text-[0.82rem] font-medium text-primary-ink">{a.authority}</p>
          <p className="mt-3 text-[0.86rem] leading-relaxed text-muted">{a.scope}</p>
        </Reveal>
      ))}
      {!limit && (
        <li className="flex">
          <Link href="/enquiry/?type=technical" className="group flex w-full flex-col justify-between gap-6 bg-primary p-6 text-white transition-colors hover:bg-primary-dark">
            <Icon name="file" size={28} strokeWidth={1.4} className="text-accent-soft" />
            <span>
              <span className="block font-display text-xl font-semibold">Need a certificate?</span>
              <span className="mt-2 block text-[0.9rem] leading-relaxed text-on-dark-muted">GMP certificates, DMF/CEP information, specifications and CoAs for qualified customers.</span>
              <span className="mt-4 inline-flex items-center gap-2 text-sm font-semibold">Request documents <Icon name="arrowRight" size={16} className="arrow-nudge" /></span>
            </span>
          </Link>
        </li>
      )}
    </ul>
  );
}

/** Manufacturing units in depth (PPT slides 12–17): address, capacity, coordinates, connectivity and site photos. */
export function UnitProfiles() {
  return (
    <div className="space-y-20 lg:space-y-28">
      {FACILITIES.map((f, idx) => {
        // Unit II shares its site with the corporate office, so it uses that location's directions link
        const loc = LOCATIONS.find((l) => l.id === (f.id === "unit-ii" ? "corporate-office" : f.id));
        const flip = idx % 2 === 1;
        return (
          <article key={f.id} id={f.id} aria-labelledby={`${f.id}-title`} className="grid scroll-mt-40 grid-cols-1 gap-10 lg:grid-cols-12 lg:gap-14">
            <Reveal className={`lg:col-span-5 ${flip ? "lg:order-2" : ""}`}>
              <div className="flex items-end gap-4 border-b border-border pb-5">
                <span className="font-display text-6xl font-semibold leading-none tracking-tight text-primary/90">{f.name.replace(/^Unit\s+/, "")}</span>
                <span>
                  <span className="eyebrow block text-accent-strong">Manufacturing unit</span>
                  <h3 id={`${f.id}-title`} className="mt-1 text-xl font-semibold text-primary-ink">{f.name} · {f.state}</h3>
                </span>
              </div>
              <p className="mt-6 text-[1.02rem] leading-relaxed text-text">{f.summary}</p>
              <p className="mt-4 flex items-start gap-2.5 text-[0.92rem] leading-relaxed text-muted"><Icon name="pin" size={17} className="mt-0.5 shrink-0 text-accent-strong" />{f.address}</p>
              <p className="mt-5 flex items-start gap-2.5 font-mono text-[0.78rem] leading-relaxed text-muted"><Icon name="globe" size={16} className="mt-0.5 shrink-0 text-accent-strong" /><span>{f.coords.lat}, {f.coords.lon} · {f.coords.dms}</span></p>
              <ul className="mt-6 space-y-2">
                {f.highlights.map((h) => (
                  <li key={h} className="flex gap-2.5 text-[0.92rem] text-text"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-accent-strong" />{h}</li>
                ))}
              </ul>
              <h4 className="eyebrow mt-8 text-muted">Connectivity (approx. distance)</h4>
              <ul className="mt-3 divide-y divide-border rounded-lg bg-white ring-1 ring-border">
                {f.logistics.map((l) => (
                  <li key={l.name} className="flex items-center gap-3 px-4 py-3 text-[0.9rem]">
                    <Icon name={l.kind === "airport" ? "plane" : "ship"} size={17} className="shrink-0 text-accent-strong" />
                    <span className="flex-1 text-text">{l.name}</span>
                    <span className="shrink-0 font-mono text-xs text-primary-ink">~{l.km} km</span>
                  </li>
                ))}
              </ul>
              {loc && (
                <a href={loc.directions} target="_blank" rel="noopener" className="group mt-5 inline-flex min-h-10 items-center gap-2 font-semibold text-primary">
                  <span className="link-u">Get directions</span><Icon name="external" size={15} />
                </a>
              )}
            </Reveal>
            <ul className={`grid grid-cols-2 gap-3 self-start lg:col-span-7 ${flip ? "lg:order-1" : ""}`}>
              {f.photos.map((p, i) => (
                <Reveal as="li" key={p.name} variant="image" delay={(i % 3) * 80} className={`zoom-parent relative overflow-hidden rounded-lg bg-surface ${i === 0 ? "col-span-2 aspect-[16/9]" : "aspect-[4/3]"}`}>
                  <Img name={p.name} sizes={i === 0 ? "(min-width:1024px) 55vw, 100vw" : "(min-width:1024px) 28vw, 50vw"} className="zoom-img absolute inset-0 h-full w-full object-cover" />
                  <span className="absolute inset-x-0 bottom-0 bg-gradient-to-t from-black/65 to-transparent px-4 pb-3 pt-10 text-[0.8rem] font-medium text-white">{p.caption}</span>
                </Reveal>
              ))}
            </ul>
          </article>
        );
      })}
    </div>
  );
}

/** Capacity break-up by unit (PPT slide 20); bars grow in when revealed. */
export function CapacityBars() {
  return (
    <Reveal className="rounded-lg bg-white p-6 ring-1 ring-border sm:p-8">
      <div className="flex flex-wrap items-baseline justify-between gap-3">
        <p className="eyebrow text-muted">Total reactor capacity</p>
        <p className="font-display text-5xl font-semibold tracking-tight text-primary"><Counter value={TOTAL_CAPACITY_KL} /><span className="ml-1.5 text-2xl">KL</span></p>
      </div>
      <ul className="mt-8 space-y-6">
        {FACILITIES.map((f, i) => (
          <li key={f.id}>
            <div className="flex items-baseline justify-between gap-4 text-[0.95rem]">
              <span className="font-semibold text-primary-ink">{f.name} <span className="font-normal text-muted">· {f.state}</span></span>
              <span className="font-mono text-primary-ink">{f.capacityKL} KL</span>
            </div>
            <div className="mt-2.5 h-3.5 overflow-hidden rounded-full bg-primary-tint">
              <div className="bar-grow h-full rounded-full bg-gradient-to-r from-primary to-accent" style={{ width: `${(f.capacityKL / TOTAL_CAPACITY_KL) * 100}%`, "--bar-delay": `${0.25 + i * 0.2}s` } as CSSProperties} />
            </div>
            <p className="mt-1.5 text-xs text-muted">{Math.round((f.capacityKL / TOTAL_CAPACITY_KL) * 100)}% of total capacity</p>
          </li>
        ))}
      </ul>
    </Reveal>
  );
}
