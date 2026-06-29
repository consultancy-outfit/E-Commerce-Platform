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
}
