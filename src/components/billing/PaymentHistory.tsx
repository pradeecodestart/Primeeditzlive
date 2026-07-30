'use client';

import React from 'react';
import { CreditCard, CheckCircle2, Shield, Calendar } from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';

const mockPayments = [
  {
    id: 'pay-1',
    paymentNumber: 'PAY-2024-8902',
    invoiceNumber: 'PP-INV-2024-044',
    clientName: 'Alice Cooper',
    amount: 350.00,
    method: 'CREDIT_CARD',
    gateway: 'STRIPE',
    cardLast4: '4242',
    paidAt: new Date(Date.now() - 86400000 * 2).toISOString(),
    status: 'COMPLETED'
  },
  {
    id: 'pay-2',
    paymentNumber: 'PAY-2024-7741',
    invoiceNumber: 'PP-INV-2024-042',
    clientName: 'David Miller',
    amount: 120.00,
    method: 'UPI',
    gateway: 'RAZORPAY',
    cardLast4: 'upi@gpay',
    paidAt: new Date(Date.now() - 86400000 * 12).toISOString(),
    status: 'COMPLETED'
  }
];

export function PaymentHistory() {
  return (
    <div className="bg-white dark:bg-slate-900 rounded-2xl border border-slate-200 dark:border-slate-800 overflow-hidden shadow-sm">
      <div className="p-6 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
          <CreditCard className="h-5 w-5 text-indigo-500" /> Recent Payment Transactions
        </h3>
        <Badge variant="outline" className="gap-1">
          <Shield className="h-3 w-3 text-emerald-500" /> 256-Bit Encrypted
        </Badge>
      </div>

      <div className="divide-y divide-slate-100 dark:divide-slate-800">
        {mockPayments.map((pmt) => (
          <div key={pmt.id} className="p-6 flex items-center justify-between hover:bg-slate-50/50 dark:hover:bg-slate-800/30 transition-colors">
            <div className="flex items-center gap-4">
              <div className="p-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/50 text-emerald-600 border border-emerald-200 dark:border-emerald-800">
                <CheckCircle2 className="h-6 w-6" />
              </div>
              <div>
                <div className="font-bold text-slate-900 dark:text-white flex items-center gap-2">
                  {pmt.paymentNumber}
                  <span className="text-xs font-normal text-slate-400">({pmt.invoiceNumber})</span>
                </div>
                <div className="text-sm text-slate-500 dark:text-slate-400 mt-0.5">
                  Paid by <span className="font-medium text-slate-700 dark:text-slate-300">{pmt.clientName}</span> via {pmt.method}
                </div>
              </div>
            </div>

            <div className="text-right">
              <div className="text-lg font-bold text-emerald-600 dark:text-emerald-400">
                +{formatCurrency(pmt.amount)}
              </div>
              <div className="text-xs text-slate-400 flex items-center justify-end gap-1 mt-0.5">
                <Calendar className="h-3 w-3" /> {formatDate(pmt.paidAt)}
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
