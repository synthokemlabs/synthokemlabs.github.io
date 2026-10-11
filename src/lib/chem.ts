/** Renders digits in a molecular formula as Unicode subscripts: C10H14O4 → C₁₀H₁₄O₄ */
export function formatFormula(f: string) {
  const sub = "₀₁₂₃₄₅₆₇₈₉";
  return f.replace(/\d/g, (d) => sub[+d]);
}

/** Caps the on-screen scale of a 2D structure SVG (~1.55 px per drawing unit) so small molecules aren't blown up. */
export function structureMaxSize(svg?: string, pxPerUnit = 1.55) {
  const vb = svg?.match(/viewBox='[\d.-]+ [\d.-]+ ([\d.]+) ([\d.]+)'/);
  return vb ? { maxWidth: `${Math.round(+vb[1] * pxPerUnit)}px`, maxHeight: `${Math.round(+vb[2] * pxPerUnit)}px` } : undefined;
}
