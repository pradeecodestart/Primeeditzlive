'use client';

import React from 'react';
import { Clock, Lock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface Props {
  invoice: any;
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

export function EMIOptions({ invoice, onSuccess, onError, isProcessing, setIsProcessing }: Props) {
  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice?.id || 'inv-2',
          amount: invoice?.total || 165.00,
          method: 'EMI'
        })
      });
      const data = await res.json();
      if (data.success) onSuccess(data);
      else onError(data.error);
    } catch {
      onError('EMI option error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex items-center justify-center gap-2 text-white text-lg font-semibold">
        <Clock className="h-6 w-6 text-amber-400" /> Easy Monthly Installments (EMI)
      </div>
      <div className="grid grid-cols-3 gap-3">
        {['3 Months', '6 Months', '12 Months'].map((tenure, idx) => (
          <div key={tenure} className="p-3 bg-white/5 border border-white/10 rounded-xl text-xs text-white">
            <div className="font-bold text-amber-400">{tenure}</div>
            <div className="mt-1 text-slate-300">0% Interest</div>
          </div>
        ))}
      </div>
      <Button
        type="button"
        onClick={handlePay}
        disabled={isProcessing}
        className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
      >
        {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
        Select EMI Plan & Proceed
      </Button>
    </div>
  );
}
