import { OrderStatus, canTransition } from './order-status';

describe('canTransition', () => {
  it('allows the forward lifecycle', () => {
    expect(canTransition(OrderStatus.Pending, OrderStatus.Processing)).toBe(true);
    expect(canTransition(OrderStatus.Processing, OrderStatus.Shipped)).toBe(true);
    expect(canTransition(OrderStatus.Shipped, OrderStatus.Delivered)).toBe(true);
  });

  it('allows cancelling from pending and processing only', () => {
    expect(canTransition(OrderStatus.Pending, OrderStatus.Cancelled)).toBe(true);
    expect(canTransition(OrderStatus.Processing, OrderStatus.Cancelled)).toBe(true);
    expect(canTransition(OrderStatus.Shipped, OrderStatus.Cancelled)).toBe(false);
    expect(canTransition(OrderStatus.Delivered, OrderStatus.Cancelled)).toBe(false);
  });

  it('rejects skipping stages and going backwards', () => {
    expect(canTransition(OrderStatus.Pending, OrderStatus.Shipped)).toBe(false);
    expect(canTransition(OrderStatus.Processing, OrderStatus.Delivered)).toBe(false);
    expect(canTransition(OrderStatus.Shipped, OrderStatus.Processing)).toBe(false);
  });

  it('rejects terminal states and no-op transitions', () => {
    expect(canTransition(OrderStatus.Delivered, OrderStatus.Shipped)).toBe(false);
    expect(canTransition(OrderStatus.Cancelled, OrderStatus.Pending)).toBe(false);
    expect(canTransition(OrderStatus.Pending, OrderStatus.Pending)).toBe(false);
  });
});
