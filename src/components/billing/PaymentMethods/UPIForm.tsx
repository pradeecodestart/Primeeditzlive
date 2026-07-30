'use client';

import React, { useState } from 'react';
import { Smartphone, RefreshCw, Lock, QrCode } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

interface Props {
  invoice: any;
  onSuccess: (data: unknown) => void;
  onError: (error: string) => void;
  isProcessing: boolean;
  setIsProcessing: (v: boolean) => void;
}

export function UPIForm({ invoice, onSuccess, onError, isProcessing, setIsProcessing }: Props) {
  const [upiId, setUpiId] = useState('');
  const [mode, setMode] = useState<'id' | 'qr'>('id');

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
          method: 'UPI',
          upiId
        })
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(data);
      } else {
        onError(data.error || 'UPI transaction failed');
      }
    } catch {
      onError('UPI processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone className="h-6 w-6 text-emerald-400" />
          <h3 className="text-lg font-semibold text-white">UPI Payment</h3>
        </div>
        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-2 py-1 rounded-full font-medium">
          INSTANT • FREE
        </span>
      </div>

      <div className="flex border border-white/20 rounded-xl overflow-hidden">
        <button
          type="button"
          onClick={() => setMode('id')}
          className={`flex-1 py-2 text-sm font-medium transition-all ${
            mode === 'id' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          UPI ID / VPA
        </button>
        <button
          type="button"
          onClick={() => setMode('qr')}
          className={`flex-1 py-2 text-sm font-medium transition-all ${
            mode === 'qr' ? 'bg-indigo-600 text-white' : 'bg-white/5 text-slate-300 hover:bg-white/10'
          }`}
        >
          Scan QR Code
        </button>
      </div>

      {mode === 'id' ? (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-200 text-sm font-medium block">Enter UPI ID (VPA)</label>
            <div className="relative mt-1">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="username@okicici / mobile@paytm"
                required
                className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-500"
              />
            </div>
            <p className="text-xs text-slate-400 mt-1">
              Supports Google Pay, PhonePe, Paytm, BHIM & all Indian Banks
            </p>
          </div>

          <Button
            type="submit"
            disabled={isProcessing}
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-700 hover:to-indigo-700 text-white gap-2 shadow-lg"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" /> Requesting Payment...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Pay {formatCurrency(invoice?.total || 165.00)} via UPI
              </>
            )}
          </Button>
        </form>
      ) : (
        <div className="text-center py-6 space-y-4">
          <div className="w-48 h-48 mx-auto bg-white p-3 rounded-2xl flex items-center justify-center border-4 border-indigo-500/50 shadow-2xl">
            <QrCode className="w-full h-full text-slate-900" />
          </div>
          <p className="text-sm text-slate-300">
            Scan this QR code using any UPI App (GPay, PhonePe, Paytm) to pay <span className="font-bold text-white">{formatCurrency(invoice?.total || 165.00)}</span>
          </p>
          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-700 text-white font-bold"
          >
            I Have Completed Payment
          </Button>
        </div>
      )}
    </div>
  );
}
