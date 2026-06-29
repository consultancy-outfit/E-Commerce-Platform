import { Body, Controller, Delete, Get, Patch, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { CartService } from './cart.service';
import { AddCartItemDto, RemoveCartItemDto, UpdateCartItemDto } from './dto/cart-item.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('cart')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('cart')
export class CartController {
  constructor(private readonly cart: CartService) {}

  @Get()
  @ApiOperation({ summary: "Get the current user's cart with totals" })
  get(@CurrentUser('userId') userId: string) {
    return this.cart.getCart(userId);
  }

  @Post('items')
  @ApiOperation({ summary: 'Add an item to the cart' })
  add(@CurrentUser('userId') userId: string, @Body() dto: AddCartItemDto) {
    return this.cart.addItem(userId, dto);
  }

  @Patch('items')
  @ApiOperation({ summary: 'Set an item quantity (0 removes it)' })
  update(@CurrentUser('userId') userId: string, @Body() dto: UpdateCartItemDto) {
    return this.cart.updateItem(userId, dto);
  }

  @Delete('items')
  @ApiOperation({ summary: 'Remove an item from the cart' })
  remove(@CurrentUser('userId') userId: string, @Body() dto: RemoveCartItemDto) {
    return this.cart.removeItem(userId, dto);
  }
}
