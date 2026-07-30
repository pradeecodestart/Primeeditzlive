'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { OrderTable } from '@/components/orders/OrderTable';
import { Button } from '@/components/ui/button';
import { Plus, Download, Filter, RefreshCw } from 'lucide-react';
import Link from 'next/link';
import { Order } from '@/types/order';

export default function OrdersPage() {
  const [statusFilter, setStatusFilter] = useState<string>('ALL');

  const { data, isLoading, refetch } = useQuery({
    queryKey: ['orders-list', statusFilter],
    queryFn: async () => {
      const res = await fetch(`/api/orders?status=${statusFilter}`);
      const json = await res.json();
      return json.orders || [];
    },
    refetchInterval: 3000, // Auto refresh every 3 seconds to pick up new client bookings live
  });

  const orders: Order[] = data || [];

  return (
    <div className="space-y-6">
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            Order Management Portal
          </h1>
          <p className="text-sm text-slate-500">
            View, track, assign, and update all client post-production orders.
          </p>
        </div>
        <div className="flex space-x-3">
          <Button variant="outline" size="sm" onClick={() => refetch()}>
            <RefreshCw className="h-4 w-4 mr-2" /> Refresh
          </Button>
          <Button variant="outline" size="sm">
            <Download className="h-4 w-4 mr-2" /> Export CSV
          </Button>
          <Link href="/orders/new">
            <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white font-semibold">
              <Plus className="h-4 w-4 mr-2" /> Create Order
            </Button>
          </Link>
        </div>
      </div>

      {/* Filter Toolbar */}
      <div className="flex items-center space-x-4 p-4 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
        <Filter className="h-4 w-4 text-slate-400" />
        <span className="text-xs font-semibold text-slate-500 uppercase">Filter Status:</span>
        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
          className="h-9 w-48 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 text-xs text-slate-900 dark:text-slate-100"
        >
          <option value="ALL">All Statuses</option>
          <option value="PENDING">Pending Intake</option>
          <option value="IN_PROGRESS">In Progress</option>
          <option value="REVIEW">PM / Client Review</option>
          <option value="REVISION">Revision Cycle</option>
          <option value="COMPLETED">Completed</option>
        </select>
      </div>

      {isLoading ? (
        <div className="p-12 text-center text-slate-400 bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800">
          <RefreshCw className="h-6 w-6 animate-spin mx-auto mb-2 text-indigo-500" />
          Loading active orders...
        </div>
      ) : (
        <OrderTable orders={orders} />
      )}
    </div>
  );
}
