'use client';
import React from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { OrderStatusBadge } from './OrderStatusBadge';
import { Order } from '@/types/order';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Button } from '@/components/ui/button';
import { Eye, Edit3 } from 'lucide-react';
import Link from 'next/link';

export const OrderTable: React.FC<{ orders: Order[] }> = ({ orders }) => {
  const columns = [
    {
      header: 'Order #',
      accessorKey: 'orderNumber' as const,
      cell: (row: Order) => (
        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.orderNumber}</span>
      ),
    },
    {
      header: 'Project Name',
      accessorKey: 'projectName' as const,
    },
    {
      header: 'Client',
      cell: (row: Order) => row.client ? `${row.client.firstName} ${row.client.lastName}` : 'N/A',
    },
    {
      header: 'Service',
      accessorKey: 'serviceType' as const,
    },
    {
      header: 'Status',
      cell: (row: Order) => <OrderStatusBadge status={row.status} />,
    },
    {
      header: 'Deadline',
      cell: (row: Order) => formatDate(row.deadline),
    },
    {
      header: 'Amount',
      cell: (row: Order) => formatCurrency(row.totalAmount),
    },
    {
      header: 'Actions',
      cell: (row: Order) => (
        <div className="flex space-x-2">
          <Link href={`/orders/${row.id}`}>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-600 dark:text-slate-300 hover:text-indigo-600">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={orders} searchPlaceholder="Search orders..." />;
};
