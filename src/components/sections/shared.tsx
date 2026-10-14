import Link from "next/link";
import { APPROVALS, type Approval } from "@/data/company";
import { Icon } from "@/components/ui/Icon";
import { Reveal } from "@/components/ui/client";
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
