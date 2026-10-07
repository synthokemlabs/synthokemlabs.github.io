/**
 * Responsive WebP image. Source assets live in /public/images as
 * `<name>-640.webp`, `<name>-1280.webp` and `<name>-1920.webp`
 * (generated from the original Synthokem photography).
 */
const WIDTHS: Record<string, number[]> = {
  "lab-team": [640, 1280],
};

export const IMAGE_ALT: Record<string, string> = {
  "hero-cleanroom": "Synthokem operator in full cleanroom attire working at process equipment",
  "facility-aerial": "Aerial view of a Synthokem Labs manufacturing site",
  "lab-precision": "Scientist handling a sample in an analytical laboratory",
  "qc-analyst": "Quality control analyst working with laboratory instruments",
  "lab-team": "Synthokem chemists at work in the laboratory",
  "reactor-operator": "Operator in protective equipment working at a reactor",
  "warehouse-operations": "Material handling in a Synthokem warehouse",
  "cleanroom-processing": "Technician processing material in a controlled clean area",
  "warehouse-aisle": "Organised aisle of drums in a Synthokem warehouse",
  "materials-store": "Forklift operator moving drums in the materials store",
  "csr-community": "Synthokem team members planting a tree with the community",
  "csr-environment": "Hands holding soil with young seedlings",
  "csr-education": "Students supported by Synthokem's education initiatives",
};

export function Img({
  name, alt, className = "", sizes = "100vw", priority = false, width = 1600, height = 1067,
}: { name: string; alt?: string; className?: string; sizes?: string; priority?: boolean; width?: number; height?: number }) {
  const widths = WIDTHS[name] ?? [640, 1280, 1920];
  const srcSet = widths.map((w) => `/images/${name}-${w}.webp ${w}w`).join(", ");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={`/images/${name}-${widths[Math.min(1, widths.length - 1)]}.webp`}
      srcSet={srcSet}
      sizes={sizes}
      alt={alt ?? IMAGE_ALT[name] ?? ""}
      width={width}
      height={height}
      loading={priority ? "eager" : "lazy"}
      decoding={priority ? "sync" : "async"}
      fetchPriority={priority ? "high" : "auto"}
      className={className}
    />
  );
}
