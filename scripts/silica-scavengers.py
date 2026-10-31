"""
Representative structures for the silica metal scavengers (Product List, "Metal Scavengers (under development)").

A functionalised silica is not a single molecule, so the site shows the bonded functional group, with a
wavy bond marking the attachment to the silica support (as for the polymer end groups of Calcium
Polycarbophil). Only these entries are added or replaced in src/data/representative-structures.json;
every other entry is left untouched. Silica Thiol keeps the company's own drawing (public/structures).

  - Silica TMT (CAS 1226494-16-1): 2,4,6-trimercaptotriazine bound through one sulfur atom. PubChem files
    this CAS under the S-methyl model compound, 6-methylsulfanyl-1H-1,3,5-triazine-2,4-dithione (CID 12210973).
  - Silica DMT (CAS 2222422-83-3): dimercaptotriazine, the silica-bound form of the same trimercaptotriazine
    (one sulfur bonded, two free mercapto groups).
  - Silica Thiourea: 3-(thioureido)propyl silica, as suppliers list it ("3-(1-Thioureido)propyl-functionalized silica gel").
  - Silica Amine (CAS 126850-14-4): 3-aminopropyl silica ("amino-functionalized silica gel").

Usage (needs RDKit: pip install rdkit), then render the 2D drawings:
  python scripts/silica-scavengers.py
  node scripts/render-structures.mjs silica-tmt silica-dmt silica-thiourea silica-amine
"""
import json
from pathlib import Path

from rdkit import Chem
from rdkit.Chem import rdDepictor

OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "representative-structures.json"

# '*' = attachment to the silica support (drawn as a wavy bond)
GROUPS = {
    "silica-tmt": {
        "attached": "*Sc1nc(S)nc(S)n1",
        "smiles": "CSc1nc(S)nc(S)n1",
        "description": "2,4,6-Trimercaptotriazine (TMT) bonded to silica gel through one of its sulfur atoms. The wavy bond marks the attachment to the silica support.",
    },
    "silica-dmt": {
        "attached": "*Sc1nc(S)nc(S)n1",
        "smiles": "CSc1nc(S)nc(S)n1",
        "description": "Dimercaptotriazine (DMT): the silica-bound form of 2,4,6-trimercaptotriazine, bonded through one sulfur atom and leaving two free mercapto groups. The wavy bond marks the attachment to the silica support.",
    },
    "silica-thiourea": {
        "attached": "*CCCNC(=S)N",
        "smiles": "CCCCNC(=S)N",
        "description": "3-(Thioureido)propyl groups bonded to silica gel. The wavy bond marks the attachment to the silica support.",
    },
    "silica-amine": {
        "attached": "*CCCN",
        "smiles": "CCCCN",
        "description": "3-Aminopropyl groups bonded to silica gel. The wavy bond marks the attachment to the silica support.",
    },
}


def depiction(smiles):
    mol = Chem.MolFromSmiles(smiles)
    rdDepictor.SetPreferCoordGen(True)
    rdDepictor.Compute2DCoords(mol)
    return Chem.MolToMolBlock(mol)


data = json.loads(OUT.read_text(encoding="utf-8"))
for slug, g in GROUPS.items():
    data[slug] = {
        "smiles": g["smiles"],
        "description": g["description"],
        "label": "Functional group",
        "note": "functional group bonded to silica",
        "caption": "Bonded to silica",
        "depiction": {"molblock": depiction(g["attached"]), "attachments": True},
    }
    print(f"{slug:18} {g['attached']}")
OUT.write_text(json.dumps(data, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
