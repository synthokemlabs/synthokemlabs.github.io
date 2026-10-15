import type { Approval } from "@/data/company";
import { asset } from "@/lib/asset";

const BOX = { xs: "h-10 w-14 object-center", sm: "h-12 w-28 object-left", md: "h-16 w-40 object-left", lg: "h-24 w-56 object-left" };

/** The certifying body's logo, used only where the company presentation (PPT slide 4) provides one. */
export function ApprovalMark({ a, size = "md" }: { a: Approval; size?: keyof typeof BOX }) {
  if (!a.logo) return null;
  // eslint-disable-next-line @next/next/no-img-element
  return <img src={asset(a.logo.src)} alt="" width={a.logo.width} height={a.logo.height} loading="lazy" decoding="async" className={`${BOX[size]} object-contain`} />;
}
