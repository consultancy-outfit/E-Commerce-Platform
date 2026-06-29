import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type ProductDocument = HydratedDocument<Product>;

/** Catalog categories used across storefront and admin. */
export const CATEGORIES = ['Dresses', 'Outerwear', 'Knitwear', 'Trousers', 'Accessories'] as const;
export type Category = (typeof CATEGORIES)[number];

@Schema({ timestamps: true })
export class Product {
  @Prop({ required: true, trim: true })
  name: string;

  @Prop({ default: '' })
  description: string;

  @Prop({ required: true, min: 0 })
  price: number;

  @Prop({ type: String, required: true, enum: CATEGORIES })
  category: string;

  // '/uploads/<file>' for locally uploaded images, or an external URL.
  @Prop({ default: '' })
  image: string;

  @Prop({ required: true, min: 0, default: 0 })
  stock: number;
}

export const ProductSchema = SchemaFactory.createForClass(Product);

// Support case-insensitive name search efficiently.
ProductSchema.index({ name: 'text' });
