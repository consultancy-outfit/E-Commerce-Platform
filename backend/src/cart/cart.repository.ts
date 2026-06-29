import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Cart, CartDocument } from './schemas/cart.schema';

@Injectable()
export class CartRepository {
  constructor(@InjectModel(Cart.name) private readonly model: Model<CartDocument>) {}

  /**
   * Get (or lazily create) the user's cart. Atomic upsert avoids a race between
   * findOne/create and the unique-user index (which previously caused E11000).
   */
  findOrCreate(userId: string): Promise<CartDocument> {
    const user = new Types.ObjectId(userId);
    return this.model
      .findOneAndUpdate(
        { user },
        { $setOnInsert: { user, items: [] } },
        { upsert: true, new: true, setDefaultsOnInsert: true },
      )
      .exec() as Promise<CartDocument>;
  }

  save(cart: CartDocument): Promise<CartDocument> {
    return cart.save();
  }

  clear(userId: string): Promise<unknown> {
    return this.model
      .updateOne({ user: new Types.ObjectId(userId) }, { $set: { items: [] } })
      .exec();
  }
}
