import { Injectable, NotFoundException } from '@nestjs/common';
import { ProductsRepository, PaginatedProducts } from './products.repository';
import { ProductDocument } from './schemas/product.schema';
import { QueryProductsDto } from './dto/query-products.dto';
import { CreateProductDto } from './dto/create-product.dto';
import { UpdateProductDto } from './dto/update-product.dto';

@Injectable()
export class ProductsService {
  constructor(private readonly repo: ProductsRepository) {}

  query(q: QueryProductsDto): Promise<PaginatedProducts> {
    return this.repo.query(q);
  }

  async findOne(id: string): Promise<ProductDocument> {
    const product = await this.repo.findById(id);
    if (!product) throw new NotFoundException('Product not found');
    return product;
  }

  create(dto: CreateProductDto): Promise<ProductDocument> {
    return this.repo.create(dto);
  }

  async update(id: string, dto: UpdateProductDto): Promise<ProductDocument> {
    const updated = await this.repo.update(id, dto);
    if (!updated) throw new NotFoundException('Product not found');
    return updated;
  }

  async remove(id: string): Promise<{ success: true }> {
    const deleted = await this.repo.delete(id);
    if (!deleted) throw new NotFoundException('Product not found');
    return { success: true };
  }
}
