/** UK VAT rate, applied to the subtotal. Centralised so cart + orders agree. */
export const TAX_RATE = 0.2;

const round2 = (n: number) => Math.round(n * 100) / 100;

export interface Totals {
  subtotal: number;
  tax: number;
  total: number;
}

/** Compute order totals from line amounts. Always server-side; never trusted from the client. */
export function computeTotals(subtotal: number): Totals {
  const sub = round2(subtotal);
  const tax = round2(sub * TAX_RATE);
  return { subtotal: sub, tax, total: round2(sub + tax) };
}
