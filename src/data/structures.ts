import raw from "./structures.json";
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
}
export const STRUCTURES = raw as unknown as Record<string, StructureRecord>;
export const getStructure = (slug: string): StructureRecord | undefined => STRUCTURES[slug];
