import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './schemas/product.schema';
import { ProductSort, QueryProductsDto } from './dto/query-products.dto';

export interface PaginatedProducts {
  items: ProductDocument[];
  total: number;
  page: number;
  pageCount: number;
}

const SORT_MAP: Record<ProductSort, Record<string, 1 | -1>> = {
  [ProductSort.Newest]: { createdAt: -1 },
  [ProductSort.PriceAsc]: { price: 1 },
  [ProductSort.PriceDesc]: { price: -1 },
};

@Injectable()
export class ProductsRepository {
  constructor(@InjectModel(Product.name) private readonly model: Model<ProductDocument>) {}

  /** Catalog browse: search by name, filter by category + price range, sort, paginate. */
  async query(q: QueryProductsDto): Promise<PaginatedProducts> {
    const filter: Record<string, any> = {};

    if (q.search?.trim()) {
      // Escape regex metacharacters for a safe case-insensitive contains match.
      const safe = q.search.trim().replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
      filter.name = { $regex: safe, $options: 'i' };
    }
    if (q.category) filter.category = q.category;
    if (q.minPrice != null || q.maxPrice != null) {
      filter.price = {};
      if (q.minPrice != null) filter.price.$gte = q.minPrice;
      if (q.maxPrice != null) filter.price.$lte = q.maxPrice;
    }

    const page = q.page ?? 1;
    const limit = q.limit ?? 8;
    const sort = SORT_MAP[q.sort ?? ProductSort.Newest];

    const [items, total] = await Promise.all([
      this.model
        .find(filter)
        .sort(sort)
        .skip((page - 1) * limit)
        .limit(limit)
        .exec(),
      this.model.countDocuments(filter).exec(),
    ]);

    return { items, total, page, pageCount: Math.max(1, Math.ceil(total / limit)) };
  }

  findById(id: string): Promise<ProductDocument | null> {
    return this.model.findById(id).exec();
  }

  findByIds(ids: string[]): Promise<ProductDocument[]> {
    return this.model.find({ _id: { $in: ids } }).exec();
  }

  create(data: Partial<Product>): Promise<ProductDocument> {
    return this.model.create(data);
  }

  update(id: string, data: Partial<Product>): Promise<ProductDocument | null> {
    return this.model.findByIdAndUpdate(id, data, { new: true }).exec();
  }

  delete(id: string): Promise<ProductDocument | null> {
    return this.model.findByIdAndDelete(id).exec();
  }

  count(): Promise<number> {
    return this.model.countDocuments().exec();
  }

  /** Same-category candidates for recommendations, excluding the seed product. */
  findRelated(category: string, excludeId: string): Promise<ProductDocument[]> {
    return this.model.find({ category, _id: { $ne: excludeId } }).exec();
  }

  findAll(): Promise<ProductDocument[]> {
    return this.model.find().exec();
  }
}
