import {
  BadRequestException,
  ConflictException,
  ForbiddenException,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { Types } from 'mongoose';
import { OrdersRepository } from './orders.repository';
import { OrderDocument } from './schemas/order.schema';
import { ProductsRepository } from '../products/products.repository';
import { CartService } from '../cart/cart.service';
import { CartRepository } from '../cart/cart.repository';
import { PaymentService } from './payment.service';
import { CheckoutDto } from './dto/checkout.dto';
import { computeTotals } from '../common/pricing';
import { OrderStatus, canTransition } from './order-status';

@Injectable()
export class OrdersService {
  constructor(
    private readonly orders: OrdersRepository,
    private readonly products: ProductsRepository,
    private readonly cart: CartService,
    private readonly cartRepo: CartRepository,
    private readonly payment: PaymentService,
  ) {}

  /**
   * Checkout: validate stock, compute totals server-side from DB prices, reserve
   * stock atomically, charge (Stripe test / mock), persist the order, clear cart.
   * On any failure after reserving stock, the reservation is rolled back.
   */
  async checkout(userId: string, dto: CheckoutDto): Promise<OrderDocument> {
    const view = await this.cart.getCart(userId);
    if (view.items.length === 0) throw new BadRequestException('Your cart is empty');

    // Authoritative product lookup (never trust client prices/stock).
    const products = await this.products.findByIds(view.items.map((i) => i.productId));
    const byId = new Map(products.map((p) => [String(p._id), p]));

    const lines = view.items.map((i) => {
      const product = byId.get(i.productId);
      if (!product) throw new NotFoundException(`Product ${i.productId} no longer exists`);
      if (i.quantity > product.stock) {
        throw new ConflictException(
          `Only ${product.stock} of "${product.name}" in stock`,
        );
      }
      return { product, quantity: i.quantity, size: i.size };
    });

    const subtotal = lines.reduce((s, l) => s + l.product.price * l.quantity, 0);
    const totals = computeTotals(subtotal);

    // Reserve stock atomically; roll back if a concurrent order took the last unit.
    const reserved: Array<{ id: string; qty: number }> = [];
    for (const l of lines) {
      const ok = await this.products.decrementStock(String(l.product._id), l.quantity);
      if (!ok) {
        await this.rollback(reserved);
        throw new ConflictException(`"${l.product.name}" just went out of stock`);
      }
      reserved.push({ id: String(l.product._id), qty: l.quantity });
    }

    // Charge after stock is reserved; restore stock if the payment fails.
    let paymentRef: string;
    try {
      const result = await this.payment.charge(totals.total, dto.paymentMethodId);
      paymentRef = result.ref;
    } catch (err) {
      await this.rollback(reserved);
      throw err;
    }

    const order = await this.orders.create({
      user: new Types.ObjectId(userId),
      items: lines.map((l) => ({
        product: l.product._id as Types.ObjectId,
        name: l.product.name,
        price: l.product.price,
        size: l.size,
        quantity: l.quantity,
      })),
      subtotal: totals.subtotal,
      tax: totals.tax,
      total: totals.total,
      status: OrderStatus.Pending,
      shippingAddress: dto.shippingAddress,
      paymentRef,
    });

    await this.cartRepo.clear(userId);
    return order;
  }

  private async rollback(reserved: Array<{ id: string; qty: number }>): Promise<void> {
    await Promise.all(reserved.map((r) => this.products.incrementStock(r.id, r.qty)));
  }

  findMyOrders(userId: string): Promise<OrderDocument[]> {
    return this.orders.findByUser(userId);
  }

  async findMyOrder(userId: string, id: string): Promise<OrderDocument> {
    const order = await this.orders.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    // A customer may only see their own orders.
    if (String(order.user) !== userId) throw new ForbiddenException('Not your order');
    return order;
  }

  // ---- Admin operations (called by the admin module) ----

  findAll(): Promise<OrderDocument[]> {
    return this.orders.findAll();
  }

  async updateStatus(id: string, status: OrderStatus): Promise<OrderDocument> {
    const order = await this.orders.findById(id);
    if (!order) throw new NotFoundException('Order not found');
    if (!canTransition(order.status, status)) {
      throw new BadRequestException(
        `Cannot change status from ${order.status} to ${status}`,
      );
    }
    order.status = status;
    return this.orders.save(order);
  }
}
