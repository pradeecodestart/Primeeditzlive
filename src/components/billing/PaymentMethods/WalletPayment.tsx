'use client';

import React from 'react';
import { Wallet, Lock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface Props {
  invoice: any;
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

export function WalletPayment({ invoice, onSuccess, onError, isProcessing, setIsProcessing }: Props) {
  const handlePay = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice?.id || 'inv-2',
          amount: invoice?.total || 165.00,
          method: 'WALLET'
        })
      });
      const data = await res.json();
      if (data.success) onSuccess(data);
      else onError(data.error);
    } catch {
      onError('Wallet payment error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex items-center justify-center gap-2 text-white text-lg font-semibold">
        <Wallet className="h-6 w-6 text-purple-400" /> Digital Wallet Payment
      </div>
      <p className="text-sm text-slate-300">
        Pay instantly using Apple Pay, Google Pay, or Amazon Pay balance.
      </p>
      <Button
        type="button"
        onClick={handlePay}
        disabled={isProcessing}
        className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold"
      >
        {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
        Pay {formatCurrency(invoice?.total || 165.00)} with Apple Pay / GPay
      </Button>
    </div>
  );
}
