'use client';
import React from 'react';
import { StatsCard } from './StatsCard';
import { RevenueChart } from './RevenueChart';
import { OrdersChart } from './OrdersChart';
import { ActivityFeed } from './ActivityFeed';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { DollarSign, ShoppingBag, Users, Clock, Award, TrendingUp } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

import { CeoQrCodeManager } from '@/components/admin/CeoQrCodeManager';

export const CEODashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Executive Overview
          </h1>
          <p className="text-sm text-slate-500">
            Real-time business performance, revenue streams, and operation metrics.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/team">
            <Button variant="outline" className="gap-2 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
              <Users className="h-4 w-4 text-indigo-400" /> Employees Control Center
            </Button>
          </Link>
          <Link href="/orders/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700">New Order</Button>
          </Link>
          <Link href="/analytics">
            <Button variant="outline">Detailed Analytics</Button>
          </Link>
        </div>
      </div>

      {/* Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Revenue" value={formatCurrency(19800)} change="+18.5%" icon={DollarSign} />
        <StatsCard title="Total Orders" value="248" change="+12.2%" icon={ShoppingBag} />
        <StatsCard title="Active Clients" value="42" change="+8.4%" icon={Users} />
        <StatsCard title="Pending Orders" value="14" change="-3.1%" isPositive={false} icon={Clock} />
      </div>

      {/* Charts Row */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle className="text-base">Revenue Growth (12 Months)</CardTitle>
          </CardHeader>
          <CardContent>
            <RevenueChart />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-base">Orders Completion Trend</CardTitle>
          </CardHeader>
          <CardContent>
            <OrdersChart />
          </CardContent>
        </Card>
      </div>

      {/* CEO Payment QR Code & Bank Account Setup Panel */}
      <CeoQrCodeManager />

      {/* Bottom Grid */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2 space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Top Performing Editors</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-indigo-600 text-white font-bold flex items-center justify-center">MC</div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">Mike Chen</p>
                      <p className="text-xs text-slate-400">Senior Editor • 98.4% On Time</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">42 Orders</span>
                </div>

                <div className="flex items-center justify-between p-3 rounded-lg bg-slate-50 dark:bg-slate-800">
                  <div className="flex items-center space-x-3">
                    <div className="h-9 w-9 rounded-full bg-purple-600 text-white font-bold flex items-center justify-center">LW</div>
                    <div>
                      <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">Lisa Wong</p>
                      <p className="text-xs text-slate-400">Video Retoucher • 97.1% On Time</p>
                    </div>
                  </div>
                  <span className="text-sm font-bold text-green-600 dark:text-green-400">38 Orders</span>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        <div>
          <ActivityFeed />
        </div>
      </div>
    </div>
  );
};
