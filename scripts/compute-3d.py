"""
Computed 3D conformers for products PubChem has no 3D record for (molecules too large or too
flexible for PubChem's conformer generator, e.g. Bisbentiamine).

Uses the SMILES already stored in src/data/structures.json: embeds with RDKit ETKDGv3, optimises
with MMFF94 and keeps the lowest-energy of several conformers (fixed seed, so reruns match).
Salts use the neutral parent molecule, as PubChem does. Entries are marked model3dSource: "computed"
so the site labels them as computed rather than from PubChem.

Usage (needs RDKit: pip install rdkit):
  python scripts/compute-3d.py bisbentiamine sodium-stearyl-fumarate
"""
import json
import sys
from pathlib import Path

from rdkit import Chem
from rdkit.Chem import AllChem
from rdkit.Chem.MolStandardize import rdMolStandardize

DATA = Path(__file__).resolve().parent.parent / "src" / "data" / "structures.json"


def parent(smiles):
    mol = Chem.MolFromSmiles(smiles)
    frag = rdMolStandardize.LargestFragmentChooser(preferOrganic=True).choose(mol)
    neutral = rdMolStandardize.Uncharger().uncharge(frag)
    return neutral, Chem.MolToSmiles(neutral) != Chem.MolToSmiles(mol)


def conformer(mol, count=30, seed=1978):
    mol = Chem.AddHs(mol)
    params = AllChem.ETKDGv3()
    params.randomSeed = seed
    if not AllChem.EmbedMultipleConfs(mol, numConfs=count, params=params):
        raise RuntimeError("3D embedding failed")
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
for slug in sys.argv[1:]:
    entry = data[slug]
    mol, is_parent = parent(entry["smiles"])
    entry["model3d"], energy = conformer(mol)
    if is_parent:
        entry["model3dParent"] = True
    entry["model3dSource"] = "computed"
    heavy = sum(1 for a in entry["model3d"]["atoms"] if a[3] != "H")
    print(f"{slug:28} {Chem.MolToSmiles(mol)[:60]:60} atoms {len(entry['model3d']['atoms'])} (heavy {heavy})  MMFF {energy:.1f} kcal/mol{'  parent' if is_parent else ''}")
DATA.write_text(json.dumps(js_numbers(data), ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
