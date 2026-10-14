import { Reveal } from "@/components/ui/client";
import { Img } from "@/components/ui/Img";
import { LogoMark } from "@/components/ui/Logo";
import { LEADERSHIP, type Leader } from "@/data/company";

/** Head-and-shoulders placeholder, used until a headshot is supplied. Pass positioning (absolute/relative) in className. */
export function PortraitPlaceholder({ className = "" }: { className?: string }) {
  return (
    // Gradient and grid are separate layers: .grid-paper sets background-image, which would replace the gradient
    <div aria-hidden="true" className={`overflow-hidden bg-gradient-to-b from-[#dcecfb] to-[#b9d8f3] ${className}`}>
      <div className="grid-paper absolute inset-0 opacity-70" />
      <svg viewBox="0 0 200 250" preserveAspectRatio="xMidYMax meet" className="absolute inset-x-0 bottom-0 h-[84%] w-full">
        <circle cx="100" cy="92" r="40" fill="#fff" fillOpacity="0.85" />
        <path d="M22 250C24 186 58 148 100 148s76 38 78 102z" fill="#fff" fillOpacity="0.85" />
      </svg>
    </div>
  );
}

function LeaderCard({ p, delay }: { p: Leader; delay: number }) {
  return (
    <Reveal as="li" delay={delay} className="h-full">
      <article className="group flex h-full flex-col overflow-hidden rounded-xl bg-white ring-1 ring-border transition-[transform,box-shadow] duration-500 ease-out hover:-translate-y-1 hover:shadow-[0_24px_48px_-28px_rgb(10_45_80/0.45)]">
        <div className="relative aspect-[4/5] overflow-hidden">
          {p.photo ? (
            <Img name={p.photo} alt={p.name} sizes="(min-width:1024px) 22vw, (min-width:640px) 45vw, 100vw" className="absolute inset-0 h-full w-full object-cover transition-transform duration-700 group-hover:scale-[1.03]" />
          ) : (
            <PortraitPlaceholder className="absolute inset-0 transition-transform duration-700 group-hover:scale-[1.03]" />
          )}
          <span className="absolute left-4 top-4 grid h-9 w-9 place-items-center rounded-full bg-white/90 shadow-sm"><LogoMark className="h-5 w-auto" /></span>
        </div>
        <div className="flex flex-1 flex-col p-5 sm:p-6">
          <p className="text-[0.72rem] font-semibold uppercase tracking-[0.12em] text-accent-strong">{p.role}</p>
          <h3 className="mt-1.5 text-lg font-semibold leading-snug text-primary-ink">{p.name}</h3>
        </div>
      </article>
    </Reveal>
  );
}

function GroupLabel({ children }: { children: string }) {
  return (
    <p className="flex items-center gap-3 text-[0.72rem] font-semibold uppercase tracking-[0.16em] text-muted">
      <span>{children}</span><span aria-hidden="true" className="h-px flex-1 bg-border" />
    </p>
  );
}

/** Board of Directors and Management, side by side on desktop, with every card the same width. */
export function LeadershipGrid() {
  const board = LEADERSHIP.filter((p) => p.group === "board");
  const management = LEADERSHIP.filter((p) => p.group === "management");
  return (
    <div className="grid grid-cols-1 gap-x-5 gap-y-10 sm:grid-cols-2 lg:grid-cols-4">
      <div className="sm:col-span-2 lg:col-span-3">
        <GroupLabel>Board of Directors</GroupLabel>
        <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {board.map((p, i) => <LeaderCard key={p.name} p={p} delay={i * 90} />)}
        </ul>
      </div>
      <div className="sm:col-span-2 lg:col-span-1">
        <GroupLabel>Management</GroupLabel>
        <ul className="mt-5 grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-1">
          {management.map((p, i) => <LeaderCard key={p.name} p={p} delay={270 + i * 90} />)}
        </ul>
      </div>
    </div>
  );
}
