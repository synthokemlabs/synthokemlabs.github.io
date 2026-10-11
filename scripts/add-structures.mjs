/**
 * Adds (or refreshes) PubChem reference data for specific products only, leaving every other
 * record in src/data/structures.json untouched. Same lookup rules as fetch-structures.mjs:
 * match by the company's CAS number; salts without a 3D conformer fall back to the parent compound.
 * Run: node scripts/add-structures.mjs <slug> [<slug> ...]   then: node scripts/render-structures.mjs
 */
import { readFileSync, writeFileSync } from "node:fs";

const BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const file = new URL("../src/data/structures.json", import.meta.url);
const data = JSON.parse(readFileSync(file, "utf8"));
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
  const na = parseInt(lines[3].slice(0, 3)), nb = parseInt(lines[3].slice(3, 6));
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

// Read slug → CAS from products.ts as text (it imports a generated module, so it is not loaded directly)
const src = readFileSync(new URL("../src/data/products.ts", import.meta.url), "utf8");
const PRODUCTS = [...src.matchAll(/\{\s*slug: "([^"]+)"[\s\S]*?\n  \}/g)].map((m) => ({ slug: m[1], cas: m[0].match(/cas: "([^"]+)"/)?.[1] }));

const slugs = process.argv.slice(2);
if (!slugs.length) { console.log("usage: node scripts/add-structures.mjs <slug> [...]"); process.exit(1); }
for (const slug of slugs) {
  const p = PRODUCTS.find((x) => x.slug === slug);
  if (!p?.cas) { console.log(`✗ ${slug}: no product or no CAS number`); continue; }
  const props = await get(`${BASE}/compound/name/${encodeURIComponent(p.cas)}/property/MolecularFormula,MolecularWeight,SMILES,IUPACName/JSON`);
  await sleep(300);
  const row = props?.PropertyTable?.Properties?.[0];
  if (!row) { console.log(`✗ ${slug} (${p.cas}) not found in PubChem`); continue; }
  const entry = { cid: row.CID, formula: row.MolecularFormula, mw: row.MolecularWeight, smiles: row.SMILES, iupac: row.IUPACName ?? null };
  let sdf = await get(`${BASE}/compound/cid/${row.CID}/record/SDF?record_type=3d`, "text");
  await sleep(300);
  if (!sdf) {
    const parent = await get(`${BASE}/compound/cid/${row.CID}/cids/JSON?cids_type=parent`);
    await sleep(300);
    const pcid = parent?.IdentifierList?.CID?.[0];
    if (pcid && pcid !== row.CID) {
      sdf = await get(`${BASE}/compound/cid/${pcid}/record/SDF?record_type=3d`, "text");
      await sleep(300);
      if (sdf) entry.model3dParent = true;
    }
  }
  if (sdf) entry.model3d = parseSdf(sdf);
  data[slug] = entry;
  console.log(`✓ ${slug.padEnd(24)} CAS ${p.cas.padEnd(12)} CID ${String(row.CID).padEnd(9)} ${row.MolecularFormula.padEnd(18)} 3D:${sdf ? (entry.model3dParent ? "parent" : "yes") : "no"}  ${(row.IUPACName ?? "").slice(0, 70)}`);
}
writeFileSync(file, JSON.stringify(data));
console.log("records:", Object.keys(data).length);
