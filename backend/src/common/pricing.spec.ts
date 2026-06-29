import { computeTotals, TAX_RATE } from './pricing';

describe('computeTotals', () => {
  it('applies 20% VAT and rounds to 2dp', () => {
    expect(TAX_RATE).toBe(0.2);
    expect(computeTotals(567)).toEqual({ subtotal: 567, tax: 113.4, total: 680.4 });
  });

  it('handles zero', () => {
    expect(computeTotals(0)).toEqual({ subtotal: 0, tax: 0, total: 0 });
  });

  it('rounds fractional subtotals correctly', () => {
    expect(computeTotals(10.005)).toEqual({ subtotal: 10.01, tax: 2, total: 12.01 });
  });
});
