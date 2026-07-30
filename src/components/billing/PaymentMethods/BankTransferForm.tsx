'use client';

import React from 'react';
import { Building2, Lock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface Props {
  invoice: any;
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

export function BankTransferForm({ invoice, onSuccess, onError, isProcessing, setIsProcessing }: Props) {
  const handleConfirm = async () => {
    setIsProcessing(true);
    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice?.id || 'inv-2',
          amount: invoice?.total || 165.00,
          method: 'BANK_TRANSFER'
        })
      });
      const data = await res.json();
      if (data.success) onSuccess(data);
      else onError(data.error);
    } catch {
      onError('Bank transfer error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-purple-400" />
        <h3 className="text-lg font-semibold text-white">Direct Wire / SWIFT / ACH Transfer</h3>
      </div>
      <div className="p-4 bg-white/5 rounded-xl border border-white/10 text-sm space-y-3 text-slate-200">
        <div><span className="text-slate-400">Bank Name:</span> Chase Commercial Bank</div>
        <div><span className="text-slate-400">Account Name:</span> PostProd Pro Inc.</div>
        <div><span className="text-slate-400">Account Number:</span> 987654321098</div>
        <div><span className="text-slate-400">Routing / SWIFT:</span> CHASEUS33XXX</div>
      </div>
      <Button
        type="button"
        onClick={handleConfirm}
        disabled={isProcessing}
        className="w-full h-12 bg-purple-600 hover:bg-purple-700 text-white font-bold"
      >
        {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
        Submit Bank Wire Confirmation
      </Button>
    </div>
  );
}
