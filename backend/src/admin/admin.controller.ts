import { Body, Controller, Get, Param, Patch, UseGuards } from '@nestjs/common';
import { ApiBearerAuth, ApiOperation, ApiTags } from '@nestjs/swagger';
import { OrdersService } from '../orders/orders.service';
import { AnalyticsService } from './analytics.service';
import { UpdateOrderStatusDto } from '../orders/dto/update-status.dto';
import { JwtAuthGuard } from '../common/guards/jwt-auth.guard';
import { RolesGuard } from '../common/guards/roles.guard';
import { Roles } from '../common/decorators/roles.decorator';
import { Role } from '../common/roles';

@ApiTags('admin')
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, RolesGuard)
@Roles(Role.Admin)
@Controller('admin')
export class AdminController {
  constructor(
    private readonly orders: OrdersService,
    private readonly analytics: AnalyticsService,
  ) {}

  @Get('orders')
  @ApiOperation({ summary: 'List all orders (admin)' })
  allOrders() {
    return this.orders.findAll();
  }

  @Patch('orders/:id/status')
  @ApiOperation({ summary: 'Advance an order status (validated transitions)' })
  updateStatus(@Param('id') id: string, @Body() dto: UpdateOrderStatusDto) {
    return this.orders.updateStatus(id, dto.status);
  }

  @Get('analytics')
  @ApiOperation({ summary: 'Dashboard analytics: sales, status counts, top products' })
  analyticsSummary() {
    return this.analytics.summary();
  }
}
