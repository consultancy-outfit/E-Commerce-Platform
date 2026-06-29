import { Injectable } from '@nestjs/common';
import { OrdersRepository } from '../orders/orders.repository';
import { OrderStatus } from '../orders/order-status';

export interface AnalyticsSummary {
  totalSales: number;
  orderCount: number;
  ordersByStatus: Record<string, number>;
  topProducts: Array<{ productId: string; name: string; units: number }>;
}

@Injectable()
export class AnalyticsService {
  constructor(private readonly orders: OrdersRepository) {}

  async summary(): Promise<AnalyticsSummary> {
    const [totalSales, statusCounts, orderCount, top] = await Promise.all([
      this.orders.totalSales(),
      this.orders.countByStatus(),
      this.orders.count(),
      this.orders.topProducts(5),
    ]);

    // Always return every status key (zero-filled) so the dashboard chart is stable.
    const ordersByStatus: Record<string, number> = {};
    for (const s of Object.values(OrderStatus)) ordersByStatus[s] = 0;
    for (const row of statusCounts) ordersByStatus[row._id] = row.count;

    return {
      totalSales: Math.round(totalSales * 100) / 100,
      orderCount,
      ordersByStatus,
      topProducts: top.map((t) => ({ productId: String(t._id), name: t.name, units: t.units })),
    };
  }
}
