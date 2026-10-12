"""
Representative structures for products that are not a single molecule (a cross-linked polymer and
substituted cyclodextrins). Writes src/data/representative-structures.json with, per product:

  smiles     the molecule used for the computed 3D model (scripts/compute-3d.py)
  depiction  a 2D drawing as a molblock with fixed coordinates (rendered by scripts/render-structures.mjs)
  label / note / caption   the wording the site shows, so the model is never mistaken for the whole substance

  - Calcium Polycarbophil: two polyacrylate chains joined by one divinyl glycol cross-link, laid out like
    the company's own drawing (repeat-unit brackets, calcium counter-ions); 3D in the acid form.
  - Hydroxypropyl / Sulfobutylether β-cyclodextrin: the glucose repeat unit of β-cyclodextrin
    (PubChem CID 444041) with R = H or the substituent, as monographs draw it; 3D is an example
    β-cyclodextrin carrying a typical number of groups.

Usage (needs RDKit: pip install rdkit), then compute the 3D models and render the 2D drawings:
  python scripts/representative-structures.py
  python scripts/compute-3d.py hydroxypropyl-beta-cyclodextrin sulfobutylether-beta-cyclodextrin-sodium
  node scripts/render-structures.mjs
"""
import json
import math
from pathlib import Path

from rdkit import Chem
from rdkit.Chem import rdDepictor
from rdkit.Geometry import Point3D

OUT = Path(__file__).resolve().parent.parent / "src" / "data" / "representative-structures.json"
BCD = "C([C@@H]1[C@@H]2[C@@H]([C@H]([C@H](O1)O[C@@H]3[C@H](O[C@@H]([C@@H]([C@H]3O)O)O[C@@H]4[C@H](O[C@@H]([C@@H]([C@H]4O)O)O[C@@H]5[C@H](O[C@@H]([C@@H]([C@H]5O)O)O[C@@H]6[C@H](O[C@@H]([C@@H]([C@H]6O)O)O[C@@H]7[C@H](O[C@@H]([C@@H]([C@H]7O)O)O[C@@H]8[C@H](O[C@H](O2)[C@@H]([C@H]8O)O)CO)CO)CO)CO)CO)CO)O)O)O"
POLYCARBOPHIL_3D = "CC(C(=O)O)CC(C(=O)O)CC(C(O)C(O)C(CC(C(=O)O)CC(C(=O)O)C)CC(C(=O)O)CC(C(=O)O)C)CC(C(=O)O)CC(C(=O)O)C"


def sru(mol, atoms, crossing, brackets, label):
    """Repeat-unit brackets (SRU S-group) with a subscript label."""
    sg = Chem.CreateMolSubstanceGroup(mol, "SRU")
    for a in atoms:
        sg.AddAtomWithIdx(a)
    for b in crossing:
        sg.AddBondWithIdx(b)
    sg.SetProp("LABEL", label)
    for (x1, y1), (x2, y2) in brackets:
        sg.AddBracket([Point3D(x1, y1, 0), Point3D(x2, y2, 0), Point3D(0, 0, 0)])


def polycarbophil_depiction():
    rw = Chem.RWMol()
    xy = {}

    def add(sym, x, y, charge=0):
        a = Chem.Atom(sym)
        a.SetFormalCharge(charge)
        i = rw.AddAtom(a)
        xy[i] = (x, y)
        return i

    def bond(i, j, order=1):
        return rw.AddBond(i, j, Chem.BondType.DOUBLE if order == 2 else Chem.BondType.SINGLE) - 1

    up, down = 0.5, 0.0
    # Along one chain: '*' continues, 'C' CH2, 'A' CH bearing COO-, 'X' CH bearing the cross-link
    seq = [("*", up), ("C", down), ("A", up), ("C", down), ("A", up), ("C", up), ("X", down),
           ("C", up), ("A", up), ("C", down), ("A", up), ("C", down), ("*", up)]
    xs, x = [], 0.0
    for k, (_, level) in enumerate(seq):
        if k:
            x += 0.866 if level != seq[k - 1][1] else 1.0
        xs.append(x)
    xs = [v - xs[6] for v in xs]

    def chain(sign, base):
        """sign +1: top chain, substituents up; -1: bottom chain, mirrored."""
        ids, coo, bonds = [], {}, {}
        for k, (kind, level) in enumerate(seq):
            y = base + sign * level
            ids.append(add("*" if kind == "*" else "C", xs[k], y))
            if k:
                bonds[(k - 1, k)] = bond(ids[k - 1], ids[k])
            if kind == "A":
                c = add("C", xs[k], y + sign * 1.0)
                bond(ids[k], c)
                o1 = add("O", xs[k] + 0.5, y + sign * 1.866)
                o2 = add("O", xs[k] - 0.5, y + sign * 1.866, -1)
                bond(c, o1, 2)
                bond(c, o2)
                coo[k] = [c, o1, o2]
        return ids, coo, bonds

    chains = [(+1, 0.0, *chain(+1, 0.0)), (-1, -3.0, *chain(-1, -3.0))]
    top, bottom = chains[0][2], chains[1][2]
    c1, c2 = add("C", 0, -1.0), add("C", 0, -2.0)  # the divinyl glycol bridge, CH(OH)-CH(OH)
    bond(top[6], c1)
    bond(c1, c2)
    bond(c2, bottom[6])
    bond(c1, add("O", 0.95, -0.75))
    bond(c2, add("O", 0.95, -2.25))
    for sign, base, *_ in chains:  # calcium counter-ions above / below each pair of carboxylates
        for a, b in ((2, 4), (8, 10)):
            add("Ca", (xs[a] + xs[b]) / 2, base + sign * 3.0, 2)

    mol = rw.GetMol()
    Chem.SanitizeMol(mol)
    conf = Chem.Conformer(mol.GetNumAtoms())
    for i, (px, py) in xy.items():
        conf.SetAtomPosition(i, Point3D(px, py, 0))
    mol.AddConformer(conf, assignId=True)
    # Brackets around the outermost CH2-CH(COO-) unit at each end of both chains
    for sign, base, ids, coo, bonds in chains:
        for unit, cross in (((1, 2), ((0, 1), (2, 3))), ((10, 11), ((9, 10), (11, 12)))):
            atoms = [ids[unit[0]], ids[unit[1]], *coo[unit[0] if unit[0] in coo else unit[1]]]
            lo, hi = sorted((base - sign * 0.3, base + sign * 1.1))
            brackets = [(((xs[a] + xs[b]) / 2, lo), ((xs[a] + xs[b]) / 2, hi)) for a, b in cross]
            sru(mol, atoms, [bonds[c] for c in cross], brackets, "n")
    return Chem.MolToMolBlock(mol)


def glucose_rings(mol):
    return [set(r) for r in mol.GetRingInfo().AtomRings() if len(r) == 6]


def glycosidic_cuts(mol):
    """Bonds from each glycosidic oxygen to the anomeric C1 of the next glucose unit."""
    rings = glucose_rings(mol)
    in_ring = lambda i: any(i in r for r in rings)
    cuts = []
    for o in mol.GetAtoms():
        if o.GetSymbol() != "O" or in_ring(o.GetIdx()) or o.GetDegree() != 2:
            continue
        for c in o.GetNeighbors():
            if any(n.GetSymbol() == "O" and in_ring(n.GetIdx()) for n in c.GetNeighbors()):
                cuts.append(mol.GetBondBetweenAtoms(o.GetIdx(), c.GetIdx()).GetIdx())
    return cuts


def cyclodextrin_unit_depiction():
    """One α-1,4-linked glucose unit with R on O2, O3 and O6, in repeat-unit brackets with subscript 7."""
    bcd = Chem.MolFromSmiles(BCD)
    unit = Chem.GetMolFrags(Chem.FragmentOnBonds(bcd, glycosidic_cuts(bcd), addDummies=True), asMols=True)[0]
    m = Chem.RWMol(unit)
    for a in m.GetAtoms():
        if a.GetAtomicNum() == 0:
            a.SetIsotope(0)
    ends = [a.GetIdx() for a in m.GetAtoms() if a.GetAtomicNum() == 0]
    for a in list(m.GetAtoms()):
        if a.GetSymbol() == "O" and a.GetTotalNumHs() == 1:
            r = m.AddAtom(Chem.Atom(0))
            m.AddBond(a.GetIdx(), r, Chem.BondType.SINGLE)
            a.SetNoImplicit(True)
            a.SetNumExplicitHs(0)
    mol = m.GetMol()
    Chem.SanitizeMol(mol)
    rdDepictor.Compute2DCoords(mol)
    conf = mol.GetConformer()
    # Rotate so the glycosidic links run left-right, and lengthen them so the brackets clear the labels
    p, q = conf.GetAtomPosition(ends[0]), conf.GetAtomPosition(ends[1])
    ang = -math.atan2(q.y - p.y, q.x - p.x)
    ca, sa = math.cos(ang), math.sin(ang)
    for i in range(mol.GetNumAtoms()):
        v = conf.GetAtomPosition(i)
        conf.SetAtomPosition(i, Point3D(v.x * ca - v.y * sa, v.x * sa + v.y * ca, 0))
    crossing, brackets = [], []
    for e in ends:
        b = mol.GetAtomWithIdx(e).GetBonds()[0]
        inner = b.GetOtherAtomIdx(e)
        p, q = conf.GetAtomPosition(inner), conf.GetAtomPosition(e)
        dx, dy = q.x - p.x, q.y - p.y
        conf.SetAtomPosition(e, Point3D(p.x + dx * 1.6, p.y + dy * 1.6, 0))
        mx, my = p.x + dx * 0.95, p.y + dy * 0.95
        ln = math.hypot(dx, dy)
        nx, ny = -dy / ln * 0.75, dx / ln * 0.75
        crossing.append(b.GetIdx())
        brackets.append(((mx - nx, my - ny), (mx + nx, my + ny)))
    sru(mol, [a.GetIdx() for a in mol.GetAtoms() if a.GetIdx() not in ends], crossing, brackets, "7")
    block = Chem.MolToMolBlock(mol).split("\n")
    # Dummy atoms are written as "R"; the two link ends become "*" (chain continues), the rest stay R
    for e in ends:
        line = 4 + e
        block[line] = block[line][:31] + "*  " + block[line][34:]
    return "\n".join(block)


def substituted_cyclodextrin(o6_units, o2_units, group):
    """β-cyclodextrin with `group` (SMILES, first atom bonds to O) on O6 / O2 of the given glucose units."""
    mol = Chem.MolFromSmiles(BCD)
    rings = glucose_rings(mol)
    ring_of = lambda a: next(i for i, r in enumerate(rings) if a in r)
    links = {i: set() for i in range(len(rings))}
    for b in glycosidic_cuts(mol):
        o = mol.GetBondWithIdx(b).GetBeginAtom() if mol.GetBondWithIdx(b).GetBeginAtom().GetSymbol() == "O" else mol.GetBondWithIdx(b).GetEndAtom()
        c4 = next(n.GetIdx() for n in o.GetNeighbors() if mol.GetBondBetweenAtoms(o.GetIdx(), n.GetIdx()).GetIdx() != b)
        c1 = mol.GetBondWithIdx(b).GetOtherAtomIdx(o.GetIdx())
        links[ring_of(c4)].add(ring_of(c1))
        links[ring_of(c1)].add(ring_of(c4))
    order, prev = [0], None
    while len(order) < len(rings):
        nxt = next(n for n in links[order[-1]] if n != prev and n not in order)
        prev = order[-1]
        order.append(nxt)
    o6 = {ring_of(m[2]): m[0] for m in mol.GetSubstructMatches(Chem.MolFromSmarts("[OX2H1][CH2][C;R]"))}
    o2 = {ring_of(m[1]): m[0] for m in mol.GetSubstructMatches(Chem.MolFromSmarts("[OX2H1][CH1;R][CH1;R]([OX2;R])[OX2;R]"))}
    rw = Chem.RWMol(mol)
    frag = Chem.MolFromSmiles(group)
    for o in [o6[order[u]] for u in o6_units] + [o2[order[u]] for u in o2_units]:
        base = rw.GetNumAtoms()
        for at in frag.GetAtoms():
            rw.AddAtom(Chem.Atom(at.GetAtomicNum()))
        for b in frag.GetBonds():
            rw.AddBond(base + b.GetBeginAtomIdx(), base + b.GetEndAtomIdx(), b.GetBondType())
        rw.AddBond(o, base, Chem.BondType.SINGLE)
        rw.GetAtomWithIdx(o).SetNumExplicitHs(0)
    out = rw.GetMol()
    Chem.SanitizeMol(out)
    return Chem.MolToSmiles(out)


cd_unit = cyclodextrin_unit_depiction()
entries = {
    "calcium-polycarbophil": {
        "smiles": POLYCARBOPHIL_3D,
        "description": "Polyacrylic acid cross-linked with divinyl glycol: two chain segments joined by one cross-link (acid form in 3D; calcium salt in 2D, as in the company's drawing).",
        "label": "Representative segment",
        "note": "representative segment, acid form",
        "caption": "Cross-linked polymer",
        "depiction": {"molblock": polycarbophil_depiction(), "attachments": True},
    },
    "hydroxypropyl-beta-cyclodextrin": {
        "smiles": substituted_cyclodextrin([0, 2, 4], [5], "CC(O)C"),
        "description": "β-cyclodextrin (seven α-1,4-linked glucose units) with 2-hydroxypropyl ether groups; the number and position of groups vary. The 3D model is an example molecule with four groups.",
        "ring": True,  # compute-3d.py keeps the macrocycle open (crystal-like cone)
        "label": "Example molecule",
        "note": "example molecule, substitution varies",
        "caption": "Substitution varies",
        "depiction": {"molblock": cd_unit, "legend": "R = H or CH<sub>2</sub>CH(OH)CH<sub>3</sub>"},
    },
    "sulfobutylether-beta-cyclodextrin-sodium": {
        "smiles": substituted_cyclodextrin([0, 1, 3, 4], [2, 5], "CCCCS(=O)(=O)O"),
        "description": "β-cyclodextrin (seven α-1,4-linked glucose units) with sulfobutyl ether groups, as the sodium salt; the number and position of groups vary. The 3D model is an example molecule with six groups, in the acid form.",
        "ring": True,  # compute-3d.py keeps the macrocycle open (crystal-like cone)
        "label": "Example molecule",
        "note": "example molecule, acid form, substitution varies",
        "caption": "Substitution varies",
        "depiction": {"molblock": cd_unit, "legend": "R = H or (CH<sub>2</sub>)<sub>4</sub>SO<sub>3</sub>Na"},
    },
}

existing = json.loads(OUT.read_text(encoding="utf-8")) if OUT.exists() else {}
for slug, entry in entries.items():
    old = existing.get(slug, {})
    if old.get("smiles") == entry["smiles"] and "model3d" in old:
        entry["model3d"] = old["model3d"]  # unchanged molecule: keep its computed 3D model
    print(f"{slug:42} 3D {'kept' if 'model3d' in entry else 'needs scripts/compute-3d.py'}")
OUT.write_text(json.dumps(entries, ensure_ascii=False, separators=(",", ":")), encoding="utf-8")
