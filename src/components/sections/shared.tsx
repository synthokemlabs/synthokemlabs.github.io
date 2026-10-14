import type { Approval } from "@/data/company";
import { Icon } from "@/components/ui/Icon";
import { asset } from "@/lib/asset";

const BOX = { xs: "h-10 w-14 object-center", sm: "h-12 w-28 object-left", md: "h-16 w-40 object-left", lg: "h-24 w-56 object-left" };
const SEAL = { xs: ["h-9 w-9", 15], sm: ["h-12 w-12", 18], md: ["h-16 w-16", 24], lg: ["h-20 w-20", 30] } as const;

/** The certifying body's logo (from the company presentation), or a designed seal where the slide has none. */
export function ApprovalMark({ a, size = "md" }: { a: Approval; size?: keyof typeof BOX }) {
  if (a.logo) {
    // eslint-disable-next-line @next/next/no-img-element
    return <img src={asset(a.logo.src)} alt="" width={a.logo.width} height={a.logo.height} loading="lazy" decoding="async" className={`${BOX[size]} object-contain`} />;
  }
  const [seal, icon] = SEAL[size];
  return (
    <span aria-hidden="true" className={`${seal} relative grid shrink-0 place-items-center rounded-full bg-gradient-to-br from-primary to-accent-strong text-white ring-4 ring-primary-tint`}>
      <span className="absolute inset-[4px] rounded-full border border-dashed border-white/45" />
      <Icon name={a.short === "Kosher" ? "award" : "shield"} size={icon} strokeWidth={1.6} />
    </span>
  );
}
