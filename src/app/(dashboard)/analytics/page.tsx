'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { RevenueChart } from '@/components/dashboard/RevenueChart';
import { OrdersChart } from '@/components/dashboard/OrdersChart';
import { StatsCard } from '@/components/dashboard/StatsCard';
import { DollarSign, Award, Users, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';

export default function AnalyticsPage() {
  return (
    <div className="space-y-8">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Analytics & Performance Insights
        </h1>
        <p className="text-sm text-slate-500">
          In-depth revenue trends, service category distribution, and editor SLAs.
        </p>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Revenue YTD" value={formatCurrency(154200)} change="+24%" icon={DollarSign} />
        <StatsCard title="Avg Order Value" value={formatCurrency(480)} change="+8.2%" icon={TrendingUp} />
        <StatsCard title="Client Retention Rate" value="94.2%" icon={Users} />
        <StatsCard title="On-Time Delivery SLA" value="99.1%" icon={Award} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Trajectory</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders Distribution</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersChart />
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
