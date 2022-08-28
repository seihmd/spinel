export function normalizeFormula(formula: string): string {
  return formula.replace(/( |\r\n|\n|\r)/gm, '');
}
