"""
Computed 3D conformers for products PubChem has no 3D record for (molecules too large or too
flexible for PubChem's conformer generator, e.g. Bisbentiamine).

Uses the SMILES already stored in src/data/structures.json: embeds with RDKit ETKDGv3, optimises
with MMFF94 and keeps the lowest-energy of several conformers (fixed seed, so reruns match).
Salts use the neutral parent molecule, as PubChem does. Entries are marked model3dSource: "computed"
so the site labels them as computed rather than from PubChem.

Polymers have no single structure: src/data/representative-structures.json holds the SMILES of a
representative segment for them (e.g. Calcium Polycarbophil), and its model3d is written there.

Usage (needs RDKit: pip install rdkit):
  python scripts/compute-3d.py bisbentiamine sodium-stearyl-fumarate calcium-polycarbophil
"""
import json
import math
import sys
from pathlib import Path

from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit.Geometry import Point3D
from rdkit.Chem.MolStandardize import rdMolStandardize

DATA = Path(__file__).resolve().parent.parent / "src" / "data" / "structures.json"
REPRESENTATIVE = DATA.with_name("representative-structures.json")


def parent(smiles):
    mol = Chem.MolFromSmiles(smiles)
    frag = rdMolStandardize.LargestFragmentChooser(preferOrganic=True).choose(mol)
    neutral = rdMolStandardize.Uncharger().uncharge(frag)
    return neutral, Chem.MolToSmiles(neutral) != Chem.MolToSmiles(mol)


def cyclodextrin_ring(mol, spacing=4.4):
    """Glycosidic oxygens of a cyclodextrin, in ring order, placed on a regular polygon about 4.4 Å apart
    (as in crystal structures). An unrestrained gas-phase optimisation collapses the macrocycle; holding these
    oxygens keeps its open cone shape. Returns fixed embedding coordinates and pairwise distance restraints."""
    rings = mol.GetRingInfo().AtomRings()
    six = [set(r) for r in rings if len(r) == 6]
    ox = [a for a in max(rings, key=len) if mol.GetAtomWithIdx(a).GetSymbol() == "O" and not any(a in r for r in six)]
    n = len(ox)
    radius = spacing / (2 * math.sin(math.pi / n))
    coords = {a: Point3D(radius * math.cos(2 * math.pi * k / n), radius * math.sin(2 * math.pi * k / n), 0) for k, a in enumerate(ox)}
    pairs = [(ox[i], ox[j], 2 * radius * math.sin(math.pi * (j - i) / n)) for i in range(n) for j in range(i + 1, n)]
    return coords, pairs


def conformer(mol, count=30, seed=1978, ring=False):
    mol = Chem.AddHs(mol)
    params = AllChem.ETKDGv3()
    params.randomSeed = seed
    restraints = []
    if ring:
        coords, restraints = cyclodextrin_ring(mol)
        params.SetCoordMap(coords)
    if not AllChem.EmbedMultipleConfs(mol, numConfs=count, params=params):
        raise RuntimeError("3D embedding failed")
    if restraints:
        props = AllChem.MMFFGetMoleculeProperties(mol)
        results = []
        for c in mol.GetConformers():
            ff = AllChem.MMFFGetMoleculeForceField(mol, props, confId=c.GetId())
            for i, j, d in restraints:
                ff.MMFFAddDistanceConstraint(i, j, False, d - 0.15, d + 0.15, 100.0)
            results.append((ff.Minimize(maxIts=5000), ff.CalcEnergy()))
    else:
        results = AllChem.MMFFOptimizeMoleculeConfs(mol, maxIters=5000)  # [(not_converged, energy)]
    best = min(range(len(results)), key=lambda i: (results[i][0] != 0, results[i][1]))
    conf = list(mol.GetConformers())[best]
    Chem.Kekulize(mol, clearAromaticFlags=True)  # single/double bonds, like PubChem's SDF records
    atoms = []
    for a in mol.GetAtoms():
        p = conf.GetAtomPosition(a.GetIdx())
        atoms.append([round(p.x, 3), round(p.y, 3), round(p.z, 3), a.GetSymbol()])
    bonds = [[b.GetBeginAtomIdx(), b.GetEndAtomIdx(), int(b.GetBondTypeAsDouble())] for b in mol.GetBonds()]
    return {"atoms": atoms, "bonds": bonds}, results[best][1]


def js_numbers(x):
    """Match the JSON.stringify output of the Node scripts (2.0 -> 2)."""
    if isinstance(x, float) and x.is_integer():
        return int(x)
    if isinstance(x, list):
        return [js_numbers(v) for v in x]
    if isinstance(x, dict):
        return {k: js_numbers(v) for k, v in x.items()}
    return x


data = json.loads(DATA.read_text(encoding="utf-8"))
representative = json.loads(REPRESENTATIVE.read_text(encoding="utf-8"))
for slug in sys.argv[1:]:
    rep = slug in representative and slug not in data
    entry = representative[slug] if rep else data[slug]
    mol, is_parent = parent(entry["smiles"])
    # Cyclodextrins (ring: true): keep the macrocycle open; fewer, larger conformers
    entry["model3d"], energy = conformer(mol, count=10, ring=True) if entry.get("ring") else conformer(mol)
    if not rep:
        if is_parent:
            entry["model3dParent"] = True
        entry["model3dSource"] = "computed"
    heavy = sum(1 for a in entry["model3d"]["atoms"] if a[3] != "H")
    print(f"{slug:28} {Chem.MolToSmiles(mol)[:60]:60} atoms {len(entry['model3d']['atoms'])} (heavy {heavy})  MMFF {energy:.1f} kcal/mol{'  parent' if is_parent else ''}{'  representative' if rep else ''}")
DATA.write_text(json.dumps(js_numbers(data), ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
REPRESENTATIVE.write_text(json.dumps(js_numbers(representative), ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
