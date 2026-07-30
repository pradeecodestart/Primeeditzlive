'use client';
import React from 'react';
import { InvoicePreview } from '@/components/invoices/InvoicePreview';
import { Invoice } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const invoice: Invoice = {
    id: params.id,
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
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 no-print">
        <Link href="/invoices">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Invoice Details</h1>
      </div>

      <InvoicePreview invoice={invoice} />
    </div>
  );
}
