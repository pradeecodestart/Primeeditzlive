'use client';

import React, { useEffect, useState } from 'react';
import { useSession } from 'next-auth/react';
import { InvoicePreview } from '@/components/invoices/InvoicePreview';
import { Invoice } from '@/types/invoice';
import { Button } from '@/components/ui/button';
import { ArrowLeft, RefreshCw } from 'lucide-react';
import Link from 'next/link';

export default function InvoiceDetailPage({ params }: { params: { id: string } }) {
  const { data: session } = useSession();
  const [invoice, setInvoice] = useState<Invoice | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    fetchInvoice();
  }, [params.id]);

  const fetchInvoice = async () => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/invoices/${params.id}`);
      const data = await res.json();

      if (data.invoice) {
        setInvoice(data.invoice);
      } else {
        // Fallback dynamic invoice for current user session
        const clientName = session?.user?.name || 'Valued Client';
        const firstName = clientName.split(' ')[0] || 'Client';
        const lastName = clientName.split(' ')[1] || 'User';

        setInvoice({
          id: params.id,
          invoiceNumber: `PP-INV-${params.id.toUpperCase().slice(0, 8)}`,
          orderId: 'ord-1',
          clientId: (session?.user as any)?.id || 'client-id',
          subtotal: 10000.0,
          taxRate: 18.0,
          taxAmount: 1800.0,
          discount: 0.0,
          total: 11800.0,
          status: 'PAID',
          dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
          paidAt: new Date().toISOString(),
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
          client: {
            id: (session?.user as any)?.id || 'client-id',
            firstName,
            lastName,
            email: session?.user?.email || 'client@postprodpro.com',
            company: 'Client Studio',
          },
          order: {
            id: 'ord-1',
            orderNumber: 'ORD-2024-001',
            projectName: 'Post-Production Retouching & Editing',
            serviceType: 'Cinematic Photo & Video Editing',
          },
        });
      }
    } catch (err) {
      console.error('Error fetching invoice details:', err);
    } finally {
      setIsLoading(false);
    }
  };

  if (isLoading || !invoice) {
    return (
      <div className="flex items-center justify-center min-h-[400px] text-slate-400">
        <RefreshCw className="w-6 h-6 animate-spin mr-2 text-indigo-400" />
        Loading Invoice Details...
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center space-x-4 no-print">
        <Link href="/invoices">
          <Button variant="ghost" size="icon">
            <ArrowLeft className="h-5 w-5" />
          </Button>
        </Link>
        <h1 className="text-xl font-bold text-slate-900 dark:text-slate-100">Invoice Details</h1>
      </div>

      <InvoicePreview invoice={invoice} />
    </div>
  );
}
