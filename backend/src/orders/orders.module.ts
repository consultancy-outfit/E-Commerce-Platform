import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Order, OrderSchema } from './schemas/order.schema';
import { OrdersRepository } from './orders.repository';
import { OrdersService } from './orders.service';
import { OrdersController } from './orders.controller';
import { PaymentService } from './payment.service';
import { ProductsModule } from '../products/products.module';
import { CartModule } from '../cart/cart.module';

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Order.name, schema: OrderSchema }]),
    ProductsModule,
    CartModule,
  ],
  controllers: [OrdersController],
  providers: [OrdersRepository, OrdersService, PaymentService],
  exports: [OrdersService, OrdersRepository],
})
export class OrdersModule {}
