import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Order, OrderDocument } from './schemas/order.schema';

@Injectable()
export class OrdersRepository {
  constructor(@InjectModel(Order.name) private readonly model: Model<OrderDocument>) {}

  create(data: Partial<Order>): Promise<OrderDocument> {
    return this.model.create(data);
  }

  findByUser(userId: string): Promise<OrderDocument[]> {
    return this.model
      .find({ user: new Types.ObjectId(userId) })
      .sort({ createdAt: -1 })
      .exec();
  }

  findById(id: string): Promise<OrderDocument | null> {
    return this.model.findById(id).exec();
  }

  findAll(): Promise<OrderDocument[]> {
    return this.model.find().sort({ createdAt: -1 }).exec();
  }

  save(order: OrderDocument): Promise<OrderDocument> {
    return order.save();
  }

  // ---- Analytics aggregations (admin dashboard) ----

  /** Sum of order totals, excluding cancelled orders. */
  async totalSales(): Promise<number> {
    const res = await this.model.aggregate<{ total: number }>([
      { $match: { status: { $ne: 'cancelled' } } },
      { $group: { _id: null, total: { $sum: '$total' } } },
    ]);
    return res[0]?.total ?? 0;
  }

  /** Number of orders grouped by status. */
  countByStatus(): Promise<Array<{ _id: string; count: number }>> {
    return this.model.aggregate([
      { $group: { _id: '$status', count: { $sum: 1 } } },
    ]);
  }

  /** Top-selling products by units sold (excludes cancelled orders). */
  topProducts(limit = 5): Promise<Array<{ _id: unknown; name: string; units: number }>> {
    return this.model.aggregate([
      { $match: { status: { $ne: 'cancelled' } } },
      { $unwind: '$items' },
      {
        $group: {
          _id: '$items.product',
          name: { $first: '$items.name' },
          units: { $sum: '$items.quantity' },
        },
      },
      { $sort: { units: -1 } },
      { $limit: limit },
    ]);
  }

  count(): Promise<number> {
    return this.model.countDocuments().exec();
  }
}
