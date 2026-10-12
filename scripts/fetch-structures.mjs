/**
 * Fetches reference chemistry data from PubChem for every product with a CAS number
 * from the company's Product List. Writes src/data/structures.json.
 * Run: node scripts/fetch-structures.mjs
 * Products flagged with a reviewNote are skipped (their CAS needs company confirmation).
 */
import { writeFileSync } from "node:fs";
import { PRODUCTS } from "../src/data/products.ts";

const BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
async function get(url, type = "json") {
  for (let i = 0; i < 3; i++) {
    const r = await fetch(url);
    if (r.ok) return type === "json" ? r.json() : r.text();
    if (r.status === 404) return null;
    await sleep(1000);
  }
  return null;
}
function parseSdf(sdf) {
  const lines = sdf.split(/\r?\n/);
  const counts = lines[3];
  const na = parseInt(counts.slice(0, 3)), nb = parseInt(counts.slice(3, 6));
  const atoms = [], bonds = [];
  for (let i = 0; i < na; i++) {
    const l = lines[4 + i];
    atoms.push([+parseFloat(l.slice(0, 10)).toFixed(3), +parseFloat(l.slice(10, 20)).toFixed(3), +parseFloat(l.slice(20, 30)).toFixed(3), l.slice(31, 34).trim()]);
  }
  for (let i = 0; i < nb; i++) {
    const l = lines[4 + na + i];
    bonds.push([parseInt(l.slice(0, 3)) - 1, parseInt(l.slice(3, 6)) - 1, parseInt(l.slice(6, 9))]);
  }
  return { atoms, bonds };
}

const out = {};
for (const p of PRODUCTS) {
  if (!p.cas || p.reviewNote) continue;
  const props = await get(`${BASE}/compound/name/${encodeURIComponent(p.cas)}/property/MolecularFormula,MolecularWeight,SMILES,IUPACName/JSON`);
  await sleep(250);
  const row = props?.PropertyTable?.Properties?.[0];
  if (!row) { console.log(`✗ ${p.slug} (${p.cas}) not found`); continue; }
  const entry = { cid: row.CID, formula: row.MolecularFormula, mw: row.MolecularWeight, smiles: row.SMILES, iupac: row.IUPACName ?? null };
  // 3D conformer: PubChem has none for salts/mixtures, so fall back to the parent compound
  let sdf = await get(`${BASE}/compound/cid/${row.CID}/record/SDF?record_type=3d`, "text");
  await sleep(250);
  if (!sdf) {
    const parent = await get(`${BASE}/compound/cid/${row.CID}/cids/JSON?cids_type=parent`);
    await sleep(250);
    const pcid = parent?.IdentifierList?.CID?.[0];
    if (pcid && pcid !== row.CID) {
      sdf = await get(`${BASE}/compound/cid/${pcid}/record/SDF?record_type=3d`, "text");
      await sleep(250);
      if (sdf) entry.model3dParent = true;
    }
  }
  if (sdf) entry.model3d = parseSdf(sdf);
  out[p.slug] = entry;
  console.log(`✓ ${p.slug.padEnd(42)} CID ${String(row.CID).padEnd(9)} ${row.MolecularFormula.padEnd(16)} 3D:${sdf ? "y" : "n"}  ${(row.IUPACName ?? "").slice(0, 60)}`);
}
writeFileSync(new URL("../src/data/structures.json", import.meta.url), JSON.stringify(out));
console.log(`\nSaved ${Object.keys(out).length} records`);
