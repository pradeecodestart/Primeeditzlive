'use client';

import React from 'react';
import Link from 'next/link';
import {
  FileText, Download, Eye, CreditCard,
  Clock, CheckCircle2, AlertCircle
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface InvoiceTableProps {
  search?: string;
  status?: string;
  dateRange?: string;
}

const mockInvoices = [
  {
    id: 'inv-45',
    invoiceNumber: 'PP-INV-2024-045',
    clientName: 'Bob Martinez',
    company: 'Apex Media Studio',
    projectName: 'Wedding Photo Editing',
    total: 165.00,
    status: 'SENT',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
  },
  {
    id: 'inv-44',
    invoiceNumber: 'PP-INV-2024-044',
    clientName: 'Alice Cooper',
    company: 'Vogue Motion Lab',
    projectName: 'Commercial Video Grading',
    total: 350.00,
    status: 'PAID',
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 10).toISOString(),
  },
  {
    id: 'inv-43',
    invoiceNumber: 'PP-INV-2024-043',
    clientName: 'Charlie Brown',
    company: 'Studio 54 Pro',
    projectName: 'Product Retouching (200 shots)',
    total: 450.00,
    status: 'OVERDUE',
    dueDate: new Date(Date.now() - 86400000 * 3).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 15).toISOString(),
  },
  {
    id: 'inv-42',
    invoiceNumber: 'PP-INV-2024-042',
    clientName: 'David Miller',
    company: 'Skyline Real Estate',
    projectName: 'HDR Sky Replacement',
    total: 120.00,
    status: 'PAID',
    dueDate: new Date(Date.now() - 86400000 * 12).toISOString(),
    createdAt: new Date(Date.now() - 86400000 * 20).toISOString(),
  }
];

export function InvoiceTable({ search = '', status = 'all' }: InvoiceTableProps) {
  const filtered = mockInvoices.filter((inv) => {
    const matchesSearch =
      inv.invoiceNumber.toLowerCase().includes(search.toLowerCase()) ||
      inv.clientName.toLowerCase().includes(search.toLowerCase()) ||
      inv.projectName.toLowerCase().includes(search.toLowerCase());

    const matchesStatus = status === 'all' || inv.status.toLowerCase() === status.toLowerCase();

    return matchesSearch && matchesStatus;
  });

  const getStatusBadge = (statusStr: string) => {
    switch (statusStr.toUpperCase()) {
      case 'PAID':
        return <Badge className="bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border-emerald-500/20"><CheckCircle2 className="w-3 h-3 mr-1" /> Paid</Badge>;
      case 'SENT':
        return <Badge className="bg-amber-500/10 text-amber-600 dark:text-amber-400 border-amber-500/20"><Clock className="w-3 h-3 mr-1" /> Pending</Badge>;
      case 'OVERDUE':
        return <Badge className="bg-red-500/10 text-red-600 dark:text-red-400 border-red-500/20"><AlertCircle className="w-3 h-3 mr-1" /> Overdue</Badge>;
      default:
        return <Badge variant="outline">{statusStr}</Badge>;
    }
  };

  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="overflow-x-auto">
        <table className="w-full text-left text-sm">
          <thead className="bg-slate-50 dark:bg-slate-800/50 text-slate-500 dark:text-slate-400 font-medium border-b border-slate-200 dark:border-slate-800">
            <tr>
              <th className="px-6 py-4">Invoice #</th>
              <th className="px-6 py-4">Client</th>
              <th className="px-6 py-4">Project</th>
              <th className="px-6 py-4">Amount</th>
              <th className="px-6 py-4">Status</th>
              <th className="px-6 py-4">Due Date</th>
              <th className="px-6 py-4 text-right">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100 dark:divide-slate-800 text-slate-700 dark:text-slate-300">
            {filtered.map((inv) => (
              <tr key={inv.id} className="hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
                <td className="px-6 py-4 font-mono font-semibold text-slate-900 dark:text-white">
                  {inv.invoiceNumber}
                </td>
                <td className="px-6 py-4">
                  <div className="font-medium text-slate-900 dark:text-white">{inv.clientName}</div>
                  <div className="text-xs text-slate-400">{inv.company}</div>
                </td>
                <td className="px-6 py-4">{inv.projectName}</td>
                <td className="px-6 py-4 font-bold text-slate-900 dark:text-white">
                  {formatCurrency(inv.total)}
                </td>
                <td className="px-6 py-4">{getStatusBadge(inv.status)}</td>
                <td className="px-6 py-4 text-slate-500">{formatDate(inv.dueDate)}</td>
                <td className="px-6 py-4 text-right">
                  <div className="flex items-center justify-end gap-2">
                    {inv.status !== 'PAID' && (
                      <Link href={`/billing/invoices/${inv.id}/pay`}>
                        <Button size="sm" className="bg-indigo-600 hover:bg-indigo-700 text-white gap-1">
                          <CreditCard className="w-3.5 h-3.5" /> Pay Now
                        </Button>
                      </Link>
                    )}
                    <Button variant="outline" size="icon" className="h-8 w-8">
                      <Download className="w-3.5 h-3.5" />
                    </Button>
                  </div>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
}
