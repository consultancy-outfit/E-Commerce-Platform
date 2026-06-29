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

  // Test-mode only. A Stripe test PaymentMethod id, or omitted to use the mock.
  @ApiPropertyOptional({ example: 'pm_card_visa' })
  @IsOptional()
  @IsString()
  paymentMethodId?: string;
}
