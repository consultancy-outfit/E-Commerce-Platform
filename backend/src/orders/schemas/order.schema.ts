import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument, Types } from 'mongoose';
import { OrderStatus } from '../order-status';

export type OrderDocument = HydratedDocument<Order>;

@Schema({ _id: false })
export class OrderItem {
  @Prop({ type: Types.ObjectId, ref: 'Product', required: true })
  product: Types.ObjectId;

  // Snapshot fields — preserve what was bought even if the product changes later.
  @Prop({ required: true })
  name: string;

  @Prop({ required: true })
  price: number;

  @Prop({ required: true })
  size: string;

  @Prop({ required: true })
  quantity: number;
}
const OrderItemSchema = SchemaFactory.createForClass(OrderItem);

@Schema({ _id: false })
export class ShippingAddress {
  @Prop({ required: true }) firstName: string;
  @Prop({ required: true }) lastName: string;
  @Prop({ required: true }) line1: string;
  @Prop({ required: true }) city: string;
  @Prop({ required: true }) postcode: string;
}
const ShippingAddressSchema = SchemaFactory.createForClass(ShippingAddress);

@Schema({ timestamps: true })
export class Order {
  @Prop({ type: Types.ObjectId, ref: 'User', required: true, index: true })
  user: Types.ObjectId;

  @Prop({ type: [OrderItemSchema], required: true })
  items: OrderItem[];

  @Prop({ required: true }) subtotal: number;
  @Prop({ required: true }) tax: number;
  @Prop({ required: true }) total: number;

  @Prop({ required: true, enum: OrderStatus, default: OrderStatus.Pending })
  status: OrderStatus;

  @Prop({ type: ShippingAddressSchema, required: true })
  shippingAddress: ShippingAddress;

  @Prop({ default: '' })
  paymentRef: string;
}

export const OrderSchema = SchemaFactory.createForClass(Order);
