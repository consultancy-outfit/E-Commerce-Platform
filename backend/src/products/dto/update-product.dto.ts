import { PartialType } from '@nestjs/swagger';
import { CreateProductDto } from './create-product.dto';

/** All product fields optional for PATCH updates. */
export class UpdateProductDto extends PartialType(CreateProductDto) {}
