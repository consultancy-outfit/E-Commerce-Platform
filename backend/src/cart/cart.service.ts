import { BadRequestException, Injectable, NotFoundException } from '@nestjs/common';
import { Types } from 'mongoose';
import { CartRepository } from './cart.repository';
import { CartDocument } from './schemas/cart.schema';
import { ProductsRepository } from '../products/products.repository';
import { AddCartItemDto, RemoveCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';
import { computeTotals } from '../common/pricing';

export interface CartView {
  id: string;
  items: Array<{
    product: unknown;
    productId: string;
    size: string;
    quantity: number;
    lineTotal: number;
  }>;
  count: number;
  subtotal: number;
  tax: number;
  total: number;
}

@Injectable()
export class CartService {
  constructor(
    private readonly repo: CartRepository,
    private readonly products: ProductsRepository,
  ) {}

  async getCart(userId: string): Promise<CartView> {
    const cart = await this.repo.findOrCreate(userId);
    return this.toView(cart);
  }

  async addItem(userId: string, dto: AddCartItemDto): Promise<CartView> {
    const product = await this.products.findById(dto.productId);
    if (!product) throw new NotFoundException('Product not found');

    const size = dto.size ?? 'M';
    const cart = await this.repo.findOrCreate(userId);
    const line = cart.items.find(
      (i) => String(i.product) === dto.productId && i.size === size,
    );
    const newQty = (line?.quantity ?? 0) + dto.quantity;

    // Guard against adding more than is in stock.
    if (newQty > product.stock) {
      throw new BadRequestException(
        `Only ${product.stock} of "${product.name}" in stock`,
      );
    }

    if (line) line.quantity = newQty;
    else cart.items.push({ product: new Types.ObjectId(dto.productId), size, quantity: dto.quantity });

    await this.repo.save(cart);
    return this.toView(cart);
  }

  async updateItem(userId: string, dto: UpdateCartItemDto): Promise<CartView> {
    const size = dto.size ?? 'M';
    const cart = await this.repo.findOrCreate(userId);
    const line = cart.items.find(
      (i) => String(i.product) === dto.productId && i.size === size,
    );
    if (!line) throw new NotFoundException('Item not in cart');

    if (dto.quantity === 0) {
      cart.items = cart.items.filter(
        (i) => !(String(i.product) === dto.productId && i.size === size),
      );
    } else {
      const product = await this.products.findById(dto.productId);
      if (!product) throw new NotFoundException('Product not found');
      if (dto.quantity > product.stock) {
        throw new BadRequestException(`Only ${product.stock} of "${product.name}" in stock`);
      }
      line.quantity = dto.quantity;
    }

    await this.repo.save(cart);
    return this.toView(cart);
  }

  async removeItem(userId: string, dto: RemoveCartItemDto): Promise<CartView> {
    const size = dto.size ?? 'M';
    const cart = await this.repo.findOrCreate(userId);
    cart.items = cart.items.filter(
      (i) => !(String(i.product) === dto.productId && i.size === size),
    );
    await this.repo.save(cart);
    return this.toView(cart);
  }

  /** Build the populated cart view with server-computed line totals + totals. */
  private async toView(cart: CartDocument): Promise<CartView> {
    const ids = cart.items.map((i) => String(i.product));
    const products = await this.products.findByIds(ids);
    const byId = new Map(products.map((p) => [String(p._id), p]));

    // Drop lines whose product was deleted, keeping the cart consistent.
    const items = cart.items
      .filter((i) => byId.has(String(i.product)))
      .map((i) => {
        const product = byId.get(String(i.product))!;
        return {
          product: product.toJSON(),
          productId: String(product._id),
          size: i.size,
          quantity: i.quantity,
          lineTotal: Math.round(product.price * i.quantity * 100) / 100,
        };
      });

    const subtotal = items.reduce((s, i) => s + i.lineTotal, 0);
    const { tax, total, subtotal: sub } = computeTotals(subtotal);
    const count = items.reduce((c, i) => c + i.quantity, 0);

    return { id: String(cart._id), items, count, subtotal: sub, tax, total };
  }
}
