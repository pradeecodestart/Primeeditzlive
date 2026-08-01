'use client';

import React, { useState, useEffect } from 'react';
import { Smartphone, RefreshCw, Lock, QrCode, CheckCircle, Copy, Building2, ShieldCheck } from 'lucide-react';
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
  const [mode, setMode] = useState<'id' | 'qr'>('qr');
  const [copied, setCopied] = useState(false);

  const [ceoSettings, setCeoSettings] = useState({
    upiId: 'postprodpro@okicici',
    payeeName: 'Antigravity PostProd Pro Studio',
    bankName: 'HDFC Bank',
    accountNumber: '50200088991122',
    ifscCode: 'HDFC0001234',
    qrCodeUrl: '',
  });

  useEffect(() => {
    fetch('/api/settings/qr-code')
      .then((r) => r.json())
      .then((data) => {
        if (data.success && data.settings) {
          setCeoSettings(data.settings);
        }
      })
      .catch(() => {});
  }, []);

  const totalAmount = Number(invoice?.total || 114785);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsProcessing(true);

    try {
      const res = await fetch('/api/payments/create-intent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          invoiceId: invoice?.id || 'inv-2',
          amount: totalAmount,
          method: 'UPI',
          upiId: upiId || ceoSettings.upiId,
        }),
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

  const copyUpiId = () => {
    navigator.clipboard.writeText(ceoSettings.upiId);
    setCopied(true);
    setTimeout(() => setCopied(false), 3000);
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-3">
          <Smartphone className="h-6 w-6 text-emerald-400" />
          <div>
            <h3 className="text-lg font-semibold text-white">Instant UPI & Direct Bank Transfer</h3>
            <p className="text-xs text-slate-400">Official CEO Approved Studio Payment Gateway</p>
          </div>
        </div>
        <span className="text-xs bg-emerald-500/20 text-emerald-300 px-3 py-1 rounded-full font-medium border border-emerald-500/30 flex items-center gap-1">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" /> 0% ZERO FEE
        </span>
      </div>

      {/* Mode Switcher */}
      <div className="flex border border-white/20 rounded-xl overflow-hidden p-1 bg-slate-950/60">
        <button
          type="button"
          onClick={() => setMode('qr')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
            mode === 'qr' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          <QrCode className="w-4 h-4" /> Scan QR Code
        </button>
        <button
          type="button"
          onClick={() => setMode('id')}
          className={`flex-1 py-2 text-sm font-medium rounded-lg transition-all flex items-center justify-center gap-2 ${
            mode === 'id' ? 'bg-indigo-600 text-white shadow-md' : 'text-slate-300 hover:bg-white/10'
          }`}
        >
          <Smartphone className="w-4 h-4" /> Enter UPI ID (VPA)
        </button>
      </div>

      {mode === 'qr' ? (
        <div className="text-center py-4 space-y-5 bg-slate-950/40 p-6 rounded-2xl border border-indigo-500/20 shadow-inner">
          {/* CEO QR Code Picture Display */}
          <div className="relative w-56 h-56 mx-auto bg-white p-3 rounded-2xl border-4 border-indigo-500/50 shadow-2xl flex items-center justify-center">
            {ceoSettings.qrCodeUrl ? (
              // eslint-disable-next-line @next/next/no-img-element
              <img
                src={ceoSettings.qrCodeUrl}
                alt="Official CEO Payment QR Code"
                className="w-full h-full object-contain"
              />
            ) : (
              <div className="w-full h-full flex flex-col items-center justify-center text-slate-900 space-y-2">
                <QrCode className="w-32 h-32 text-slate-800" />
                <span className="text-[10px] font-bold text-slate-600 uppercase">Scan with Any UPI App</span>
              </div>
            )}
          </div>

          <div className="space-y-1">
            <p className="text-sm font-bold text-white">
              Scan with Google Pay, PhonePe, Paytm, BHIM, or Banking App
            </p>
            <p className="text-xs text-indigo-300 font-mono">
              Amount Due: <span className="text-emerald-400 font-bold text-base">{formatCurrency(totalAmount)}</span>
            </p>
          </div>

          {/* Copyable UPI VPA Box */}
          <div className="p-3 bg-slate-900 rounded-xl border border-slate-800 flex items-center justify-between max-w-md mx-auto">
            <div className="text-left">
              <span className="text-[10px] font-semibold uppercase text-slate-400 block">Official Studio VPA ID</span>
              <span className="text-sm font-bold text-indigo-300 font-mono">{ceoSettings.upiId}</span>
            </div>
            <Button size="sm" variant="outline" onClick={copyUpiId} className="h-8 gap-1.5 border-slate-700 text-xs">
              {copied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
              {copied ? 'Copied!' : 'Copy UPI'}
            </Button>
          </div>

          {/* Bank Transfer Details Fallback */}
          <div className="p-4 bg-slate-900/80 rounded-xl border border-slate-800 text-left text-xs text-slate-300 space-y-1.5 max-w-md mx-auto">
            <div className="flex items-center gap-1.5 font-bold text-white pb-1 border-b border-slate-800">
              <Building2 className="w-4 h-4 text-indigo-400" /> Direct NEFT / RTGS Bank Transfer
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Account Name:</span>
              <span className="font-semibold text-white">{ceoSettings.payeeName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Bank & Branch:</span>
              <span className="font-semibold text-white">{ceoSettings.bankName}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">Account Number:</span>
              <span className="font-mono font-semibold text-emerald-400">{ceoSettings.accountNumber}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-slate-400">IFSC Code:</span>
              <span className="font-mono font-semibold text-white">{ceoSettings.ifscCode}</span>
            </div>
          </div>

          <Button
            type="button"
            onClick={handleSubmit}
            disabled={isProcessing}
            className="w-full h-12 bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-base shadow-lg shadow-emerald-600/30 rounded-xl"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin mr-2" /> Verifying Payment...
              </>
            ) : (
              'I Have Completed Payment (Confirm Order)'
            )}
          </Button>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <label className="text-slate-200 text-sm font-medium block">Enter Your UPI ID (VPA)</label>
            <div className="relative mt-1">
              <Smartphone className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                value={upiId}
                onChange={(e) => setUpiId(e.target.value)}
                placeholder="yourname@okicici / mobile@paytm"
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
            className="w-full h-12 text-base font-bold bg-gradient-to-r from-emerald-600 to-indigo-600 hover:from-emerald-500 hover:to-indigo-500 text-white gap-2 shadow-lg rounded-xl"
          >
            {isProcessing ? (
              <>
                <RefreshCw className="h-5 w-5 animate-spin" /> Requesting Payment...
              </>
            ) : (
              <>
                <Lock className="h-4 w-4" /> Pay {formatCurrency(totalAmount)} via UPI
              </>
            )}
          </Button>
        </form>
      )}
    </div>
  );
}
