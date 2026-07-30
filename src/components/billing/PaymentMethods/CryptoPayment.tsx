'use client';

import React from 'react';
import { Bitcoin, Lock, RefreshCw, Copy } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface Props {
  invoice: any;
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

export function CryptoPayment({ invoice, onSuccess, onError, isProcessing, setIsProcessing }: Props) {
  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice?.id || 'inv-2',
          amount: invoice?.total || 165.00,
          method: 'CRYPTO'
        })
      });
      const data = await res.json();
      if (data.success) onSuccess(data);
      else onError(data.error);
    } catch {
      onError('Crypto payment error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6 text-center">
      <div className="flex items-center justify-center gap-2 text-white text-lg font-semibold">
        <Bitcoin className="h-6 w-6 text-amber-400" /> Pay with Web3 Cryptocurrency
      </div>
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-left text-sm space-y-2">
        <div className="text-slate-400 text-xs uppercase font-semibold">Deposit Wallet Address (USDT - ERC20)</div>
        <div className="font-mono text-white text-xs bg-black/40 p-2.5 rounded-lg flex items-center justify-between border border-white/10">
          <span>0x71C7656EC7ab88b098defB751B7401B5f6d8976F</span>
          <Copy className="h-4 w-4 cursor-pointer text-indigo-400 hover:text-white" />
        </div>
      </div>
      <Button
        type="button"
        onClick={handleConfirm}
        disabled={isProcessing}
        className="w-full h-12 bg-amber-500 hover:bg-amber-600 text-slate-950 font-bold"
      >
        {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
        Confirm Web3 Transaction
      </Button>
    </div>
  );
}
