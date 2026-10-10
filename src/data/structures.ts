import raw from "./structures.json";
import representative from "./representative-structures.json";
import type { Model3D } from "@/components/molecules/Molecule3D";

/**
 * Reference chemistry data from PubChem, looked up by the CAS numbers in the company's
 * Product List (scripts/fetch-structures.mjs). Server-side only — import into server components
 * and pass just what a page needs to client components.
 */
export interface StructureRecord {
  cid: number;
  formula: string;
  mw: string;
  smiles: string;
  iupac: string | null;
  matchedBy?: "name";
  model3d?: Model3D;
  model3dParent?: boolean;
  /** "computed": PubChem has no 3D record, so the conformer was generated with RDKit (scripts/compute-3d.py) */
  model3dSource?: "computed";
}
export const STRUCTURES = raw as unknown as Record<string, StructureRecord>;
export const getStructure = (slug: string): StructureRecord | undefined => STRUCTURES[slug];

/**
 * Products that are not a single molecule (a cross-linked polymer, substituted cyclodextrins): a representative
 * structure with its own wording (scripts/representative-structures.py), computed 3D (scripts/compute-3d.py)
 * and a fixed-layout 2D drawing (scripts/render-structures.mjs).
 */
export interface RepresentativeStructure {
  smiles: string;
  description: string;
  /** e.g. "Representative segment", "Example molecule" */
  label: string;
  /** shown after "Drag to rotate · " in the 3D view */
  note: string;
  /** hero caption beside the label, e.g. "Cross-linked polymer" */
  caption: string;
  depiction?: { molblock: string; legend?: string; attachments?: boolean };
  model3d?: Model3D;
}
const REPRESENTATIVE = representative as unknown as Record<string, RepresentativeStructure>;
export const getRepresentative = (slug: string): RepresentativeStructure | undefined => REPRESENTATIVE[slug];
