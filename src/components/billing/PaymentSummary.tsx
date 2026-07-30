'use client';

import React from 'react';
import { ShieldCheck, FileText } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface PaymentSummaryProps {
  invoice: any;
  selectedMethod: string;
}

export function PaymentSummary({ invoice }: PaymentSummaryProps) {
  const subtotal = invoice?.subtotal || 150.00;
  const taxRate = invoice?.taxRate || 10;
  const taxAmount = invoice?.taxAmount || 15.00;
  const total = invoice?.total || 165.00;

  return (
    <Card className="bg-white/10 backdrop-blur-xl border-white/20 text-white rounded-2xl shadow-xl">
      <CardHeader className="pb-4">
        <CardTitle className="text-lg font-bold flex items-center justify-between">
          <span>Order Summary</span>
          <FileText className="h-5 w-5 text-indigo-400" />
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4 text-sm">
        <div className="p-3 bg-white/5 rounded-xl border border-white/10 space-y-1">
          <div className="font-semibold text-indigo-300">
            {invoice?.order?.projectName || 'Wedding Photo Editing (150 Photos)'}
          </div>
          <div className="text-xs text-slate-300">
            Service: {invoice?.order?.serviceType || 'Photo Editing & Retouching'}
          </div>
        </div>

        <div className="space-y-2">
          <div className="flex justify-between text-slate-300">
            <span>Subtotal</span>
            <span>{formatCurrency(subtotal)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Tax ({taxRate}%)</span>
            <span>{formatCurrency(taxAmount)}</span>
          </div>
          <div className="flex justify-between text-slate-300">
            <span>Processing Fee</span>
            <span className="text-emerald-400 font-medium">FREE</span>
          </div>
        </div>

        <div className="border-b border-white/20 my-2" />

        <div className="flex justify-between items-center text-lg font-bold">
          <span>Total Amount</span>
          <span className="text-2xl text-emerald-400">{formatCurrency(total)}</span>
        </div>

        <div className="p-3 bg-indigo-500/10 rounded-xl border border-indigo-500/20 text-xs space-y-2">
          <div className="flex items-center gap-2 text-indigo-300 font-medium">
            <ShieldCheck className="h-4 w-4 text-emerald-400" /> Buyer Protection Guarantee
          </div>
          <p className="text-slate-300">
            100% Satisfaction or free revision within 48 hours of final file delivery.
          </p>
        </div>
      </CardContent>
    </Card>
  );
}
