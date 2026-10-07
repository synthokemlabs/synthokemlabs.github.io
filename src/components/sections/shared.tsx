import Link from "next/link";
import { APPROVALS, FACILITIES, SPECIALISATIONS } from "@/data/company";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/client";

/** Regulatory approvals as a typographic grid — no third-party agency logos, which agencies restrict. */
export function ApprovalsGrid({ limit }: { limit?: number }) {
  const list = limit ? APPROVALS.slice(0, limit) : APPROVALS;
  return (
    <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border sm:grid-cols-2 lg:grid-cols-5">
      {list.map((a, i) => (
        <Reveal as="li" key={a.short} delay={(i % 5) * 60} className="group flex flex-col bg-white p-6 transition-colors hover:bg-surface">
          <div className="flex items-start justify-between gap-3">
            <span className="font-display text-2xl font-semibold tracking-tight text-primary">{a.short}</span>
            <span className="font-mono text-[0.68rem] text-muted">since {a.since}</span>
          </div>
          <p className="mt-1 text-[0.82rem] font-medium text-primary-ink">{a.authority}</p>
          <p className="mt-3 text-[0.86rem] leading-relaxed text-muted">{a.scope}</p>
        </Reveal>
      ))}
    </ul>
  );
}

export const PROCESS_STEPS = [
  { title: "Facility", body: "Integrated manufacturing facilities spread across three locations in Telangana and Andhra Pradesh." },
  { title: "Technology", body: "World-class equipment, latest technologies and operational frameworks across all manufacturing units." },
  { title: "Process", body: "A wide range of APIs and intermediates, having handled varied process reactions and high reactor volumes." },
  { title: "Quality", body: "Excellent manufacturing, laboratory and documentation practices, consistently meeting Ph. Eur., USP and other standards." },
  { title: "Delivery", body: "From gram level to multi-ton supplies — within the time frame stipulated by our customers." },
];

export function ProcessChain({ tone = "dark" }: { tone?: "dark" | "light" }) {
  const dark = tone === "dark";
  return (
    <ol className="relative grid grid-cols-1 gap-8 md:grid-cols-5 md:gap-6">
      <span aria-hidden="true" className={`absolute left-[19px] top-0 h-full w-px md:left-0 md:top-[19px] md:h-px md:w-full ${dark ? "bg-white/15" : "bg-border"}`} />
      {PROCESS_STEPS.map((s, i) => (
        <Reveal as="li" key={s.title} delay={i * 90} className="relative grid grid-cols-[40px_1fr] gap-5 md:block">
          <span className={`relative z-10 grid h-10 w-10 place-items-center rounded-full font-mono text-xs ${dark ? "bg-primary-ink text-accent ring-1 ring-accent/60" : "bg-white text-primary ring-1 ring-primary/40"}`}>
            0{i + 1}
          </span>
          <div className="md:mt-7">
            <h3 className={`text-xl font-semibold ${dark ? "text-white" : "text-primary-ink"}`}>{s.title}</h3>
            <p className={`mt-2.5 text-[0.93rem] leading-relaxed ${dark ? "text-on-dark-muted" : "text-muted"}`}>{s.body}</p>
          </div>
        </Reveal>
      ))}
    </ol>
  );
}

/** Reaction chemistries as a periodic-table style grid. */
/** Reaction chemistries as a plain numbered index (no pseudo element symbols, which chemists would read as real elements). */
export function SpecialisationGrid() {
  return (
    <div>
      <ol className="grid grid-cols-1 border-t border-border-strong sm:grid-cols-2 sm:gap-x-10 lg:grid-cols-3">
        {SPECIALISATIONS.map((s, i) => (
          <Reveal as="li" key={s.name} delay={(i % 3) * 60} className="flex items-baseline gap-5 border-b border-border py-5">
            <span className="w-6 shrink-0 font-mono text-xs text-muted">{String(i + 1).padStart(2, "0")}</span>
            <span className="font-display text-lg font-semibold text-primary-ink sm:text-xl">{s.name}</span>
          </Reveal>
        ))}
      </ol>
      <div className="mt-10 flex flex-col gap-4 rounded-lg bg-primary px-6 py-6 text-white sm:flex-row sm:items-center sm:justify-between sm:px-8">
        <p className="text-on-dark-muted"><span className="font-semibold text-white">Have a process in mind?</span> Tell us the chemistry, scale and timelines.</p>
        <Link href="/contact/?intent=partner" className="group inline-flex min-h-12 shrink-0 items-center justify-center gap-2 rounded-md bg-white px-6 text-[0.92rem] font-semibold text-primary-ink transition-colors hover:bg-primary-tint">
          Talk to us <Icon name="arrowRight" size={18} className="arrow-nudge" />
        </Link>
      </div>
    </div>
  );
}

export function FacilityCards() {
  return (
    <ul className="grid grid-cols-1 gap-px overflow-hidden rounded-lg bg-border ring-1 ring-border lg:grid-cols-3">
      {FACILITIES.map((f, i) => (
        <Reveal as="li" key={f.id} delay={i * 80} className="flex flex-col bg-white p-7 sm:p-9">
          <div className="flex items-baseline justify-between">
            <span className="font-display text-5xl font-semibold tracking-tight text-primary/90">{["I", "II", "III"][i]}</span>
            <span className="font-mono text-[0.7rem] uppercase tracking-[0.12em] text-muted">{f.name}</span>
          </div>
          <p className="mt-6 flex items-start gap-2 text-sm font-medium text-accent-strong"><Icon name="pin" size={16} className="mt-0.5 shrink-0" />{f.location}</p>
          <p className="mt-3 text-[0.98rem] leading-relaxed text-text">{f.summary}</p>
          <ul className="mt-6 space-y-2 border-t border-border pt-5">
            {f.highlights.map((h) => (
              <li key={h} className="flex gap-2.5 text-[0.9rem] text-muted"><Icon name="check" size={16} className="mt-0.5 shrink-0 text-accent-strong" />{h}</li>
            ))}
          </ul>
        </Reveal>
      ))}
    </ul>
  );
}
