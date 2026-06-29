import { BadRequestException, ConflictException } from '@nestjs/common';
import { OrdersService } from './orders.service';
import { OrderStatus } from './order-status';

const product = (id: string, price: number, stock: number, name = 'Item') => ({
  _id: id,
  name,
  price,
  stock,
});

describe('OrdersService.checkout', () => {
  let orders: any, products: any, cart: any, cartRepo: any, payment: any, service: OrdersService;

  beforeEach(() => {
    orders = { create: jest.fn((o) => Promise.resolve({ ...o, _id: 'order1' })) };
    products = {
      findByIds: jest.fn(),
      decrementStock: jest.fn().mockResolvedValue(true),
      incrementStock: jest.fn().mockResolvedValue(undefined),
    };
    cart = { getCart: jest.fn() };
    cartRepo = { clear: jest.fn().mockResolvedValue(undefined) };
    payment = { charge: jest.fn().mockResolvedValue({ ref: 'pay_123', mocked: true }) };
    service = new OrdersService(orders, products, cart, cartRepo, payment);
  });

  const address = { firstName: 'A', lastName: 'B', line1: 'C', city: 'D', postcode: 'E' };

  it('computes totals from DB prices, decrements stock, clears cart', async () => {
    cart.getCart.mockResolvedValue({
      items: [{ productId: 'p1', quantity: 3, size: 'S', lineTotal: 999 /* untrusted */ }],
    });
    products.findByIds.mockResolvedValue([product('p1', 189, 9, 'Silk dress')]);

    const userId = '0123456789abcdef01234567';
    const order = await service.checkout(userId, { shippingAddress: address });

    // 189*3 = 567 subtotal, +20% VAT = 680.40 — not the client's 999.
    expect(order.subtotal).toBe(567);
    expect(order.tax).toBe(113.4);
    expect(order.total).toBe(680.4);
    expect(order.status).toBe(OrderStatus.Pending);
    expect(order.paymentRef).toBe('pay_123');
    expect(products.decrementStock).toHaveBeenCalledWith('p1', 3);
    expect(payment.charge).toHaveBeenCalledWith(680.4, undefined);
    expect(cartRepo.clear).toHaveBeenCalledWith(userId);
  });

  it('rejects an empty cart with 400', async () => {
    cart.getCart.mockResolvedValue({ items: [] });
    await expect(service.checkout('u1', { shippingAddress: address })).rejects.toBeInstanceOf(
      BadRequestException,
    );
    expect(orders.create).not.toHaveBeenCalled();
  });

  it('rejects ordering more than stock with 409 and creates no order', async () => {
    cart.getCart.mockResolvedValue({ items: [{ productId: 'p1', quantity: 5, size: 'M' }] });
    products.findByIds.mockResolvedValue([product('p1', 100, 3)]);

    await expect(service.checkout('u1', { shippingAddress: address })).rejects.toBeInstanceOf(
      ConflictException,
    );
    expect(products.decrementStock).not.toHaveBeenCalled();
    expect(orders.create).not.toHaveBeenCalled();
  });

  it('rolls back reserved stock if payment fails', async () => {
    cart.getCart.mockResolvedValue({
      items: [
        { productId: 'p1', quantity: 1, size: 'M' },
        { productId: 'p2', quantity: 2, size: 'M' },
      ],
    });
    products.findByIds.mockResolvedValue([product('p1', 100, 5), product('p2', 50, 5)]);
    payment.charge.mockRejectedValue(new Error('card declined'));

    await expect(service.checkout('u1', { shippingAddress: address })).rejects.toThrow();
    // Both reserved decrements must be restored.
    expect(products.incrementStock).toHaveBeenCalledWith('p1', 1);
    expect(products.incrementStock).toHaveBeenCalledWith('p2', 2);
    expect(orders.create).not.toHaveBeenCalled();
  });
});

describe('OrdersService.updateStatus', () => {
  it('rejects an illegal status transition with 400', async () => {
    const orders = {
      findById: jest.fn().mockResolvedValue({ status: OrderStatus.Pending, save: jest.fn() }),
      save: jest.fn(),
    };
    const service = new OrdersService(orders as any, {} as any, {} as any, {} as any, {} as any);
    await expect(service.updateStatus('o1', OrderStatus.Delivered)).rejects.toBeInstanceOf(
      BadRequestException,
    );
  });

  it('applies a legal transition', async () => {
    const order = { status: OrderStatus.Pending };
    const orders = {
      findById: jest.fn().mockResolvedValue(order),
      save: jest.fn((o) => Promise.resolve(o)),
    };
    const service = new OrdersService(orders as any, {} as any, {} as any, {} as any, {} as any);
    const result = await service.updateStatus('o1', OrderStatus.Processing);
    expect(result.status).toBe(OrderStatus.Processing);
  });
});
