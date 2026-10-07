/** Second pass: name-based lookups for products whose CAS did not resolve, plus parent 3D models for salts. */
import { readFileSync, writeFileSync } from "node:fs";
const BASE = "https://pubchem.ncbi.nlm.nih.gov/rest/pug";
const file = new URL("../src/data/structures.json", import.meta.url);
const data = JSON.parse(readFileSync(file, "utf8"));
const sleep = (ms) => new Promise((r) => setTimeout(r, ms));
const get = async (u, t = "json") => { const r = await fetch(u); await sleep(250); return r.ok ? (t === "json" ? r.json() : r.text()) : null; };
function parseSdf(sdf) {
  const L = sdf.split(/\r?\n/); const na = parseInt(L[3].slice(0, 3)), nb = parseInt(L[3].slice(3, 6));
  const atoms = [], bonds = [];
  for (let i = 0; i < na; i++) { const l = L[4 + i]; atoms.push([+(+l.slice(0, 10)).toFixed(3), +(+l.slice(10, 20)).toFixed(3), +(+l.slice(20, 30)).toFixed(3), l.slice(31, 34).trim()]); }
  for (let i = 0; i < nb; i++) { const l = L[4 + na + i]; bonds.push([parseInt(l.slice(0, 3)) - 1, parseInt(l.slice(3, 6)) - 1, parseInt(l.slice(6, 9))]); }
  return { atoms, bonds };
}
const byName = { "potassium-guaiacol-sulphonate": ["potassium guaiacolsulfonate", "guaiacolsulfonic acid"], "drotaverine-hydrochloride": ["drotaverine hydrochloride", "drotaverine"], "prazosin-hydrochloride": ["prazosin hydrochloride", "prazosin"], "terazosin-hydrochloride": ["terazosin hydrochloride", "terazosin"], "mebeverine-hydrochloride": [null, "mebeverine"] };
for (const [slug, [name, parent]] of Object.entries(byName)) {
  if (name) {
    const p = await get(`${BASE}/compound/name/${encodeURIComponent(name)}/property/MolecularFormula,MolecularWeight,SMILES,IUPACName/JSON`);
    const row = p?.PropertyTable?.Properties?.[0];
    if (!row) { console.log("✗", slug); continue; }
    data[slug] = { cid: row.CID, formula: row.MolecularFormula, mw: row.MolecularWeight, smiles: row.SMILES, iupac: row.IUPACName ?? null, matchedBy: "name" };
  }
  if (!data[slug].model3d) {
    const sdf = await get(`${BASE}/compound/name/${encodeURIComponent(parent)}/record/SDF?record_type=3d`, "text");
    if (sdf) { data[slug].model3d = parseSdf(sdf); data[slug].model3dParent = true; }
  }
  console.log(`✓ ${slug.padEnd(32)} ${data[slug].formula.padEnd(16)} 3D:${data[slug].model3d ? "y" : "n"} ${(data[slug].iupac ?? "").slice(0, 70)}`);
}
delete data["silica-tmt"]; // CAS resolves to a small-molecule analogue, not the silica-supported scavenger
writeFileSync(file, JSON.stringify(data));
console.log("records:", Object.keys(data).length);
