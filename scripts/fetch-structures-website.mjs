/** Third pass: products listed only on the previous website (their reviewNote concerns availability, not identity). */
import { readFileSync, writeFileSync } from "node:fs";
const BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const file = new URL("../src/data/structures.json", import.meta.url);
const data = JSON.parse(readFileSync(file, "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (u, t = "json") => { const r = await fetch(u); await sleep(300); return r.ok ? (t === "json" ? r.json() : r.text()) : null; };
function parseSdf(sdf) {
  const L = sdf.split(/\r?\n/); const na = parseInt(L[3].slice(0, 3)), nb = parseInt(L[3].slice(3, 6));
  const atoms = [], bonds = [];
  for (let i = 0; i < na; i++) { const l = L[4 + i]; atoms.push([+(+l.slice(0, 10)).toFixed(3), +(+l.slice(10, 20)).toFixed(3), +(+l.slice(20, 30)).toFixed(3), l.slice(31, 34).trim()]); }
  for (let i = 0; i < nb; i++) { const l = L[4 + na + i]; bonds.push([parseInt(l.slice(0, 3)) - 1, parseInt(l.slice(3, 6)) - 1, parseInt(l.slice(6, 9))]); }
  return { atoms, bonds };
}
const items = [
  { slug: "calcium-glycerophosphate", query: "27214-00-2", matchedBy: undefined },
  { slug: "tetrahydro-1-2-furoyl-piperazine", query: "1-(tetrahydro-2-furoyl)piperazine", matchedBy: "name" },
];
for (const it of items) {
  const p = await get(`${BASE}/compound/name/${encodeURIComponent(it.query)}/property/MolecularFormula,MolecularWeight,SMILES,IUPACName/JSON`);
  const row = p?.PropertyTable?.Properties?.[0];
  if (!row) { console.log("✗", it.slug); continue; }
  const rec = { cid: row.CID, formula: row.MolecularFormula, mw: row.MolecularWeight, smiles: row.SMILES, iupac: row.IUPACName ?? null };
  if (it.matchedBy) rec.matchedBy = it.matchedBy;
  const sdf = await get(`${BASE}/compound/cid/${row.CID}/record/SDF?record_type=3d`, "text");
  if (sdf) rec.model3d = parseSdf(sdf);
  data[it.slug] = rec;
  console.log(`✓ ${it.slug.padEnd(34)} CID ${row.CID} ${row.MolecularFormula} 3D:${sdf ? "y" : "n"} ${row.IUPACName}`);
}
writeFileSync(file, JSON.stringify(data));
console.log("records:", Object.keys(data).length);
