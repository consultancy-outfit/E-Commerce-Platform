import { ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsEnum, IsIn, IsInt, IsOptional, IsString, Min } from 'class-validator';
import { CATEGORIES } from '../schemas/product.schema';

export enum ProductSort {
  Newest = 'newest',
  PriceAsc = 'price-asc',
  PriceDesc = 'price-desc',
}

/** Catalog query params. Strings from the querystring are coerced via @Type. */
export class QueryProductsDto {
  @ApiPropertyOptional({ description: 'Case-insensitive search by product name' })
  @IsOptional()
  @IsString()
  search?: string;

  @ApiPropertyOptional({ enum: CATEGORIES })
  @IsOptional()
  @IsIn(CATEGORIES as unknown as string[])
  category?: string;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  minPrice?: number;

  @ApiPropertyOptional({ minimum: 0 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(0)
  maxPrice?: number;

  @ApiPropertyOptional({ enum: ProductSort, default: ProductSort.Newest })
  @IsOptional()
  @IsEnum(ProductSort)
  sort?: ProductSort = ProductSort.Newest;

  @ApiPropertyOptional({ minimum: 1, default: 1 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  page?: number = 1;

  @ApiPropertyOptional({ minimum: 1, default: 8 })
  @IsOptional()
  @Type(() => Number)
  @IsInt()
  @Min(1)
  limit?: number = 8;
}
