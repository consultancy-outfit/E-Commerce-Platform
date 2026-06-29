import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsInt, IsMongoId, IsOptional, IsString, Max, Min } from 'class-validator';

export class AddCartItemDto {
  @ApiProperty({ description: 'Product id' })
  @IsMongoId()
  productId: string;

  @ApiPropertyOptional({ default: 'M' })
  @IsOptional()
  @IsString()
  size?: string = 'M';

  @ApiProperty({ minimum: 1, default: 1 })
  @Type(() => Number)
  @IsInt()
  @Min(1)
  @Max(99)
  quantity: number;
}

export class UpdateCartItemDto {
  @ApiProperty()
  @IsMongoId()
  productId: string;

  @ApiPropertyOptional({ default: 'M' })
  @IsOptional()
  @IsString()
  size?: string = 'M';

  @ApiProperty({ minimum: 0, description: 'Absolute quantity; 0 removes the line' })
  @Type(() => Number)
  @IsInt()
  @Min(0)
  @Max(99)
  quantity: number;
}

export class RemoveCartItemDto {
  @ApiProperty()
  @IsMongoId()
  productId: string;

  @ApiPropertyOptional({ default: 'M' })
  @IsOptional()
  @IsString()
  size?: string = 'M';
}
