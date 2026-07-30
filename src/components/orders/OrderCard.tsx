import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Clock, User } from 'lucide-react';
import Link from 'next/link';

export const OrderCard: React.FC<{ order: Order }> = ({ order }) => {
  return (
    <Card className="hover:border-indigo-500 transition-all">
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <span className="font-mono text-sm font-bold text-indigo-600 dark:text-indigo-400">
            {order.orderNumber}
          </span>
          <OrderStatusBadge status={order.status} />
        </div>
        <CardTitle className="text-base mt-2">{order.projectName}</CardTitle>
      </CardHeader>
      <CardContent className="space-y-3 text-xs text-slate-500">
        <div className="flex items-center space-x-2">
          <User className="h-3.5 w-3.5" />
          <span>Client: {order.client ? `${order.client.firstName} ${order.client.lastName}` : 'N/A'}</span>
        </div>
        <div className="flex items-center space-x-2">
          <Clock className="h-3.5 w-3.5" />
          <span>Deadline: {formatDate(order.deadline)}</span>
        </div>
        <div className="flex items-center justify-between border-t border-slate-100 dark:border-slate-800 pt-3 text-sm font-semibold text-slate-900 dark:text-slate-100">
          <span>Total: {formatCurrency(order.totalAmount)}</span>
          <Link href={`/orders/${order.id}`} className="text-indigo-600 text-xs hover:underline">
            View Details →
          </Link>
        </div>
      </CardContent>
    </Card>
  );
};
