'use client';

import React from 'react';
import { Globe, Lock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface Props {
  invoice: any;
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

export function PayPalButton({ invoice, onSuccess, onError, isProcessing, setIsProcessing }: Props) {
  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice?.id || 'inv-2',
          amount: invoice?.total || 165.00,
          method: 'PAYPAL'
        })
      });
      const data = await res.json();
      if (data.success) onSuccess(data);
      else onError(data.error);
    } catch {
      onError('PayPal checkout error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex items-center justify-center gap-2 text-white text-lg font-semibold">
        <Globe className="h-6 w-6 text-blue-400" /> Pay with PayPal Express
      </div>
      <p className="text-sm text-slate-300">
        You will be redirected to PayPal's secure checkout page to complete payment of <span className="font-bold text-white">{formatCurrency(invoice?.total || 165.00)}</span>.
      </p>
      <Button
        type="button"
        onClick={handlePay}
        disabled={isProcessing}
        className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold text-lg rounded-xl gap-2 shadow-lg"
      >
        {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Lock className="h-5 w-5" />}
        Checkout with PayPal
      </Button>
    </div>
  );
}
