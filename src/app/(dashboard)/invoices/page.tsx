'use client';
import React from 'react';
import { InvoiceTable } from '@/components/invoices/InvoiceTable';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import Link from 'next/link';
import { Invoice } from '@/types/invoice';

const sampleInvoices: Invoice[] = [
  {
    id: '1',
    invoiceNumber: 'INV-2024-001',
    orderId: 'ord-1',
    clientId: 'c1',
    subtotal: 100.0,
    taxRate: 10.0,
    taxAmount: 10.0,
    discount: 0.0,
    total: 110.0,
    status: 'PAID',
    dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    client: { id: 'c1', firstName: 'Bob', lastName: 'Martinez', email: 'bob@client.com', company: 'Martinez Media' },
    order: { id: 'ord-1', orderNumber: 'ORD-2024-001', projectName: 'Summer Fashion Catalog', serviceType: 'Advanced Retouching' },
  },
  {
    id: '2',
    invoiceNumber: 'INV-2024-002',
    orderId: 'ord-2',
    clientId: 'c1',
    subtotal: 90.0,
    taxRate: 10.0,
    taxAmount: 9.0,
    discount: 0.0,
    total: 99.0,
    status: 'SENT',
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    client: { id: 'c1', firstName: 'Bob', lastName: 'Martinez', email: 'bob@client.com', company: 'Martinez Media' },
    order: { id: 'ord-2', orderNumber: 'ORD-2024-002', projectName: 'Luxury Villa Photos', serviceType: 'Real Estate Editing' },
  },
  {
    id: '3',
    invoiceNumber: 'INV-2024-003',
    orderId: 'ord-3',
    clientId: 'c2',
    subtotal: 250.0,
    taxRate: 10.0,
    taxAmount: 25.0,
    discount: 0.0,
    total: 275.0,
    status: 'PAID',
    dueDate: new Date(Date.now() - 86400000 * 2).toISOString(),
    paidAt: new Date().toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    client: { id: 'c2', firstName: 'Alice', lastName: 'Cooper', email: 'alice@client.com', company: 'Cooper Creations' },
    order: { id: 'ord-3', orderNumber: 'ORD-2024-003', projectName: 'Corporate Promo Edit', serviceType: 'Video Editing' },
  },
];

export default function InvoicesPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Invoices & Billing
          </h1>
          <p className="text-sm text-slate-500">
            Generate invoices, track payment status, and download receipts.
          </p>
        </div>
        <Link href="/invoices/new">
          <Button className="bg-indigo-600 hover:bg-indigo-700">
            <Plus className="h-4 w-4 mr-2" /> New Invoice
          </Button>
        </Link>
      </div>

      <InvoiceTable invoices={sampleInvoices} />
    </div>
  );
}
