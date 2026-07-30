'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from './StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ShoppingBag, CheckCircle, Clock, FileText, Plus, Download, MessageSquare } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order } from '@/types/order';

export const ClientDashboard: React.FC = () => {
  const { data: orders = [] } = useQuery({
    queryKey: ['client-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      const json = await res.json();
      return json.orders || [];
    },
    refetchInterval: 3000,
  });

  const activeOrders = orders.filter((o: Order) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const completedOrders = orders.filter((o: Order) => o.status === 'COMPLETED');
  const latestOrder = orders[0];

  return (
    <div className="space-y-8">
      {/* Header CTA */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Welcome to PostProd Portal
          </h1>
          <p className="text-sm text-slate-500">
            Track your ongoing photo & video orders, view invoices, and download deliverables.
          </p>
        </div>
        <Link href="/orders/new">
          <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white shadow-lg">
            <Plus className="h-5 w-5 mr-2" /> Submit New Order
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Active Orders" value={String(activeOrders.length)} icon={ShoppingBag} />
        <StatsCard title="Completed Orders" value={String(completedOrders.length)} icon={CheckCircle} />
        <StatsCard title="Total Booked" value={String(orders.length)} icon={FileText} />
        <StatsCard
          title="Total Spent"
          value={formatCurrency(orders.reduce((sum: number, o: Order) => sum + Number(o.totalAmount || 0), 0))}
          icon={Clock}
        />
      </div>

      {/* Latest Active Order Card */}
      {latestOrder && (
        <Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 to-slate-900/40">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                  Active Order: {latestOrder.projectName}
                </CardTitle>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Order #{latestOrder.orderNumber} • Service: {latestOrder.serviceType}
                </p>
              </div>
              <Badge variant="default">{latestOrder.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2 text-slate-600 dark:text-slate-300">
                <span>Progress Stage: {latestOrder.status === 'PENDING' ? 'Sales & Intake Review' : 'Editing in Progress'}</span>
                <span>{latestOrder.status === 'COMPLETED' ? '100%' : '65%'} Complete</span>
              </div>
              <Progress value={latestOrder.status === 'COMPLETED' ? 100 : 65} className="h-3" />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Target SLA Deadline: {formatDate(latestOrder.deadline)}</span>
              <div className="flex space-x-2">
                <Link href="/chat">
                  <Button size="sm" variant="outline"><MessageSquare className="h-4 w-4 mr-1" /> Chat with Team</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* All Booked Orders Table */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>My Booked Orders ({orders.length})</span>
            <Link href="/orders" className="text-xs text-indigo-400 hover:underline">View All ➔</Link>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="divide-y divide-slate-100 dark:divide-slate-800">
            {orders.map((ord: Order) => (
              <div key={ord.id} className="py-3 flex items-center justify-between">
                <div>
                  <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{ord.projectName}</p>
                  <p className="text-xs text-slate-400 font-mono">{ord.orderNumber} • {ord.serviceType}</p>
                </div>
                <div className="text-right flex items-center gap-3">
                  <span className="font-bold text-sm text-slate-900 dark:text-white">{formatCurrency(ord.totalAmount)}</span>
                  <Badge variant="outline">{ord.status}</Badge>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
