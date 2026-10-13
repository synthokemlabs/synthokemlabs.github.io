import { asset } from "@/lib/asset";

/**
 * Responsive WebP image. Source assets live in /public/images as
 * `<name>-640.webp`, `<name>-1280.webp` and `<name>-1920.webp`
 * (generated from the original Synthokem photography).
 */
const WIDTHS: Record<string, number[]> = {
  "lab-team": [640, 1280],
  // Company photographs from "for website.pptx" (date stamps and phone watermarks cropped off)
  "unit2-campus": [640, 1280],
  "unit2-greenbelt": [640, 1280],
  "reactor-hall": [640, 1280],
  "unit3-block": [640, 1280],
  "unit3-lab": [640, 1280],
  "unit3-production": [640, 1280],
  "gc-instruments": [640],
  "hplc-system": [640],
  "purified-water-system": [640, 1280],
  "qa-office": [640, 1280],
  "qa-team": [640, 1280],
  "solar-rooftop": [640, 1152],
  "zld-plant": [405],
  "solar-concentrators": [401],
  "green-belt": [640, 1280],
};

export const IMAGE_ALT: Record<string, string> = {
  "hero-cleanroom": "Synthokem operator in full cleanroom attire working at process equipment",
  "facility-aerial": "Aerial view of a Synthokem Labs manufacturing site",
  "unit2-gate": "Main gate of Synthokem Labs Unit II, with the company signboard and logo wall",
  "unit2-campus": "Buildings and internal road at Synthokem Unit II",
  "unit2-greenbelt": "Trees and landscaped green belt at Synthokem Unit II",
  "unit2-qc-lab": "Laboratory with HPLC systems at Synthokem Unit II",
  "warehouse-drums": "Blue drums stored on racks in a Synthokem warehouse",
  "reactor-hall": "Stainless-steel reactors in a Synthokem production block",
  "unit3-block": "Building at Synthokem Unit III, JN Pharmacity",
  "unit3-lab": "Analyst working at a gas chromatograph in the Unit III laboratory",
  "unit3-production": "Row of reactors in the Unit III production block",
  "gc-instruments": "Gas chromatographs in a Synthokem laboratory",
  "hplc-system": "HPLC system with its data station",
  "purified-water-system": "Purified water generation and storage system",
  "melting-point": "Digital melting point apparatus in the quality control laboratory",
  "qc-instrument-lab": "Quality control laboratory with analytical instruments",
  "analytical-lab": "Analysts at HPLC systems in the analytical R&D laboratory",
  "qa-office": "Synthokem quality assurance team at their workstations",
  "qa-team": "Quality team working in an open-plan office",
  "solar-rooftop": "Rooftop solar panels at a Synthokem unit",
  "zld-plant": "Zero liquid discharge plant at a Synthokem unit",
  "solar-concentrators": "Solar concentrator dishes for pre-heating the hot-oil system",
  "green-belt": "Planted green belt along a road at a Synthokem unit",
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
  const srcSet = widths.map((w) => `${asset(`/images/${name}-${w}.webp`)} ${w}w`).join(", ");
  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={asset(`/images/${name}-${widths[Math.min(1, widths.length - 1)]}.webp`)}
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
