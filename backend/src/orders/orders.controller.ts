import { Body, Controller, Get, HttpCode, HttpStatus, Param, Post, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from './orders.service';
import { CheckoutDto } from './dto/checkout.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { CurrentUser } from '../common/decorators/current-user.decorator';

@ApiTags('orders')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard)
@Controller('orders')
export class OrdersController {
  constructor(private readonly orders: OrdersService) {}

  @Post('checkout')
  @HttpCode(HttpStatus.CREATED)
  @ApiOperation({ summary: 'Place an order from the cart (Stripe test / mock payment)' })
  checkout(@CurrentUser('userId') userId: string, @Body() dto: CheckoutDto) {
    return this.orders.checkout(userId, dto);
  }

  @Get()
  @ApiOperation({ summary: "Get the current user's order history" })
  myOrders(@CurrentUser('userId') userId: string) {
    return this.orders.findMyOrders(userId);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get one of the current user’s orders' })
  myOrder(@CurrentUser('userId') userId: string, @Param('id') id: string) {
    return this.orders.findMyOrder(userId, id);
  }
}
