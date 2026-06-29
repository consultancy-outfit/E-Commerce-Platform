import { Module } from '@nestjs/common';
import { AdminController } from './admin.controller';
import { AnalyticsService } from './analytics.service';
import { OrdersModule } from '../orders/orders.module';

@Module({
  imports: [OrdersModule],
  controllers: [AdminController],
  providers: [AnalyticsService],
})
export class AdminModule {}
