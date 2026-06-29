import { ApiProperty, ApiPropertyOptional } from '@nestjs/swagger';
import { Type } from 'class-transformer';
import { IsObject, IsOptional, IsString, MaxLength, MinLength, ValidateNested } from 'class-validator';

export class ShippingAddressDto {
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(60) firstName: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(60) lastName: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(200) line1: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(100) city: string;
  @ApiProperty() @IsString() @MinLength(1) @MaxLength(20) postcode: string;
}

export class CheckoutDto {
  @ApiProperty({ type: ShippingAddressDto })
  @IsObject()
  @ValidateNested()
  @Type(() => ShippingAddressDto)
  shippingAddress: ShippingAddressDto;

  // The PaymentIntent id the client confirmed via Stripe Elements. Omitted only
  // in mock mode (no Stripe key configured).
  @ApiPropertyOptional({ example: 'pi_3Xxx...' })
  @IsOptional()
  @IsString()
  paymentIntentId?: string;
}
