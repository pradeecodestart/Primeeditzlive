import { NextResponse } from 'next/server';

export async function GET() {
  const stats = {
    totalRevenue: 19800,
    totalOrders: 248,
    activeClients: 42,
    pendingOrders: 14,
    teamPerformanceScore: 98.4,
    monthlyGrowthPercent: 18.5,
    recentOrders: [],
    topClients: [],
    monthlyRevenueChart: [],
    ordersStatusChart: [],
  };

  return NextResponse.json({ stats });
}
