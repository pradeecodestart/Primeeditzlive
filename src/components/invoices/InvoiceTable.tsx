'use client';
import React from 'react';
import { DataTable } from '@/components/shared/DataTable';
import { Invoice } from '@/types/invoice';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Eye, Download } from 'lucide-react';
import Link from 'next/link';

export const InvoiceTable: React.FC<{ invoices: Invoice[] }> = ({ invoices }) => {
  const columns = [
    {
      header: 'Invoice #',
      accessorKey: 'invoiceNumber' as const,
      cell: (row: Invoice) => (
        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">{row.invoiceNumber}</span>
      ),
    },
    {
      header: 'Client',
      cell: (row: Invoice) => (row.client ? `${row.client.firstName} ${row.client.lastName}` : 'N/A'),
    },
    {
      header: 'Order Ref',
      cell: (row: Invoice) => row.order?.orderNumber || 'N/A',
    },
    {
      header: 'Total',
      cell: (row: Invoice) => formatCurrency(row.total),
    },
    {
      header: 'Status',
      cell: (row: Invoice) => (
        <Badge variant={row.status === 'PAID' ? 'success' : row.status === 'DRAFT' ? 'outline' : 'warning'}>
          {row.status}
        </Badge>
      ),
    },
    {
      header: 'Due Date',
      cell: (row: Invoice) => formatDate(row.dueDate),
    },
    {
      header: 'Actions',
      cell: (row: Invoice) => (
        <div className="flex space-x-2">
          <Link href={`/invoices/${row.id}`}>
            <Button size="icon" variant="ghost" className="h-8 w-8 text-slate-600 hover:text-indigo-600">
              <Eye className="h-4 w-4" />
            </Button>
          </Link>
        </div>
      ),
    },
  ];

  return <DataTable columns={columns} data={invoices} searchPlaceholder="Search invoices..." />;
};
