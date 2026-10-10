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

/** Polymers have no single structure: a computed 3D model of a representative segment (scripts/compute-3d.py). */
export interface RepresentativeStructure { smiles: string; description: string; model3d?: Model3D }
const REPRESENTATIVE = representative as unknown as Record<string, RepresentativeStructure>;
export const getRepresentative = (slug: string): RepresentativeStructure | undefined => REPRESENTATIVE[slug];
