/** £ with thousands separators; 2dp for totals, 0dp for tidy card prices. */
export function gbp(n: number, decimals = 2): string {
  return "£" + n.toLocaleString("en-GB", { minimumFractionDigits: decimals, maximumFractionDigits: decimals });
}

/** Compact price for product cards (no trailing .00). */
export function price(n: number): string {
  return "£" + n.toLocaleString("en-GB");
}

export interface StockState {
  label: string;
  key: "in stock" | "low stock" | "sold out";
}

export function stockState(stock: number): StockState {
  if (stock <= 0) return { label: "Sold out", key: "sold out" };
  if (stock <= 3) return { label: "Low stock", key: "low stock" };
  return { label: "In stock", key: "in stock" };
}
