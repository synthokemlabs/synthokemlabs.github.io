/** Renders digits in a molecular formula as Unicode subscripts: C10H14O4 → C₁₀H₁₄O₄ */
export function formatFormula(f: string) {
  const sub = "₀₁₂₃₄₅₆₇₈₉";
  return f.replace(/\d/g, (d) => sub[+d]);
}
