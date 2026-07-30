'use client';

import React, { useState } from 'react';
import { Building2, Lock, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Select } from '@/components/ui/select';
import { formatCurrency } from '@/lib/utils';

interface Props {
  invoice: any;
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

export function NetBankingForm({ invoice, onSuccess, onError, isProcessing, setIsProcessing }: Props) {
  const [bank, setBank] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice?.id || 'inv-2',
          amount: invoice?.total || 165.00,
          method: 'NET_BANKING',
          bankName: bank
        })
      });

      const data = await res.json();
      if (data.success) onSuccess(data);
      else onError(data.error);
    } catch {
      onError('Net banking payment error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      <div className="flex items-center gap-3">
        <Building2 className="h-6 w-6 text-indigo-400" />
        <h3 className="text-lg font-semibold text-white">Net Banking</h3>
      </div>

      <div>
        <label className="text-slate-200 text-sm font-medium block mb-2">Select Your Bank</label>
        <Select
          value={bank}
          onChange={(e) => setBank(e.target.value)}
          className="bg-slate-900 border-slate-700 text-white"
        >
          <option value="" className="bg-slate-900 text-slate-400">Choose Bank...</option>
          <option value="hdfc" className="bg-slate-900 text-white">HDFC Bank</option>
          <option value="icici" className="bg-slate-900 text-white">ICICI Bank</option>
          <option value="sbi" className="bg-slate-900 text-white">State Bank of India (SBI)</option>
          <option value="axis" className="bg-slate-900 text-white">Axis Bank</option>
          <option value="kotak" className="bg-slate-900 text-white">Kotak Mahindra Bank</option>
          <option value="chase" className="bg-slate-900 text-white">JPMorgan Chase</option>
          <option value="bofa" className="bg-slate-900 text-white">Bank of America</option>
        </Select>
      </div>

      <Button
        type="submit"
        disabled={isProcessing || !bank}
        className="w-full h-12 text-base font-bold bg-indigo-600 hover:bg-indigo-700 text-white gap-2"
      >
        {isProcessing ? <RefreshCw className="h-5 w-5 animate-spin" /> : <Lock className="h-4 w-4" />}
        Proceed to Bank Gateway ({formatCurrency(invoice?.total || 165.00)})
      </Button>
    </form>
  );
}
