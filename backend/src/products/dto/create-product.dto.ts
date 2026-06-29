import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsIn, IsInt, IsNumber, IsOptional, IsString, MaxLength, Min, MinLength } from 'class-validator';
import { CATEGORIES } from '../schemas/product.schema';

export class CreateProductDto {
  @ApiProperty({ example: 'Linen blazer' })
  @IsString()
  @MinLength(1)
  @MaxLength(120)
  name: string;

  @ApiPropertyOptional()
  @IsOptional()
  @IsString()
  @MaxLength(2000)
  description?: string;

  @ApiProperty({ example: 189, minimum: 0 })
  @Type(() => Number)
  @IsNumber()
  @Min(0)
  price: number;

  @ApiProperty({ enum: CATEGORIES })
  @IsIn(CATEGORIES as unknown as string[])
  category: string;

  @ApiProperty({ example: 12, minimum: 0 })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  stock: number;

  // Optional when an image file is uploaded; otherwise an external URL.
  @ApiPropertyOptional({ description: 'Image URL (omit when uploading a file)' })
  @IsOptional()
  @IsString()
  @MaxLength(1000)
  image?: string;
}
