'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { CreditCard, Lock, User, Eye, EyeOff, Shield, RefreshCw } from 'lucide-react';
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

export function CreditCardForm({ invoice, onSuccess, onError, isProcessing, setIsProcessing }: Props) {
  const [cardNumber, setCardNumber] = useState('');
  const [cardHolder, setCardHolder] = useState('');
  const [expiryMonth, setExpiryMonth] = useState('');
  const [expiryYear, setExpiryYear] = useState('');
  const [cvv, setCvv] = useState('');
  const [showCVV, setShowCVV] = useState(false);
  const [cardFlipped, setCardFlipped] = useState(false);

  const formatCardNumber = (val: string) => {
    const clean = val.replace(/\D/g, '');
    const groups = clean.match(/.{1,4}/g) || [];
    return groups.join(' ').slice(0, 19);
  };

  const handleCardChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setCardNumber(formatCardNumber(e.target.value));
  };

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
          method: 'CREDIT_CARD'
        })
      });

      const data = await res.json();
      if (data.success) {
        onSuccess(data);
      } else {
        onError(data.error || 'Card payment failed');
      }
    } catch {
      onError('Card processing error');
    } finally {
      setIsProcessing(false);
    }
  };

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-3">
          <CreditCard className="h-6 w-6 text-indigo-400" />
          <h3 className="text-lg font-semibold text-white">Credit Card Payment</h3>
        </div>
        <span className="font-bold text-indigo-300">VISA / MC / AMEX</span>
      </div>

      {/* 3D Card Preview */}
      <div className="flex justify-center mb-6">
        <div
          className="relative w-80 h-48 cursor-pointer select-none"
          style={{ perspective: '1000px' }}
          onClick={() => setCardFlipped(!cardFlipped)}
        >
          <motion.div
            className="relative w-full h-full"
            style={{ transformStyle: 'preserve-3d' }}
            animate={{ rotateY: cardFlipped ? 180 : 0 }}
            transition={{ duration: 0.5 }}
          >
            {/* FRONT */}
            <div
              className="absolute inset-0 rounded-2xl p-6 bg-gradient-to-br from-indigo-600 via-purple-600 to-pink-600 shadow-2xl flex flex-col justify-between"
              style={{ backfaceVisibility: 'hidden' }}
            >
              <div className="flex justify-between items-start">
                <div className="w-12 h-8 bg-amber-400/80 rounded-md" />
                <span className="text-white font-bold text-sm tracking-widest">POSTPROD</span>
              </div>
              <div className="text-white font-mono text-xl tracking-widest">
                {cardNumber || '•••• •••• •••• ••••'}
              </div>
              <div className="flex justify-between items-end">
                <div>
                  <div className="text-white/60 text-[10px] uppercase tracking-widest">Card Holder</div>
                  <div className="text-white font-semibold text-sm truncate max-w-[160px]">
                    {cardHolder?.toUpperCase() || 'YOUR NAME'}
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-white/60 text-[10px] uppercase tracking-widest">Expires</div>
                  <div className="text-white font-semibold text-sm">
                    {expiryMonth || 'MM'}/{expiryYear || 'YY'}
                  </div>
                </div>
              </div>
            </div>

            {/* BACK */}
            <div
              className="absolute inset-0 rounded-2xl bg-gradient-to-br from-slate-700 to-slate-900 shadow-2xl p-6 flex flex-col justify-between"
              style={{ backfaceVisibility: 'hidden', transform: 'rotateY(180deg)' }}
            >
              <div className="h-10 bg-black/60 -mx-6 mt-2" />
              <div>
                <div className="h-9 bg-white/90 rounded flex items-center justify-end px-4">
                  <span className="font-mono font-bold text-slate-900">
                    {cvv ? (showCVV ? cvv : '•••') : '•••'}
                  </span>
                </div>
                <p className="text-white/60 text-xs mt-1 text-right">CVV Code</p>
              </div>
              <span className="text-white/40 text-[10px]">Click to flip card</span>
            </div>
          </motion.div>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="text-slate-200 text-sm font-medium block">Card Number</label>
          <div className="relative mt-1">
            <CreditCard className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={cardNumber}
              onChange={handleCardChange}
              placeholder="1234 5678 9012 3456"
              maxLength={19}
              required
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-500 font-mono tracking-widest"
            />
          </div>
        </div>

        <div>
          <label className="text-slate-200 text-sm font-medium block">Cardholder Name</label>
          <div className="relative mt-1">
            <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
            <Input
              value={cardHolder}
              onChange={(e) => setCardHolder(e.target.value)}
              placeholder="John Smith"
              required
              className="pl-10 bg-white/10 border-white/20 text-white placeholder:text-slate-500 uppercase"
            />
          </div>
        </div>

        <div className="grid grid-cols-3 gap-4">
          <div>
            <label className="text-slate-200 text-sm font-medium block">Month</label>
            <Input
              value={expiryMonth}
              onChange={(e) => setExpiryMonth(e.target.value)}
              placeholder="MM"
              maxLength={2}
              required
              className="mt-1 bg-white/10 border-white/20 text-white text-center"
            />
          </div>
          <div>
            <label className="text-slate-200 text-sm font-medium block">Year</label>
            <Input
              value={expiryYear}
              onChange={(e) => setExpiryYear(e.target.value)}
              placeholder="YY"
              maxLength={2}
              required
              className="mt-1 bg-white/10 border-white/20 text-white text-center"
            />
          </div>
          <div>
            <label className="text-slate-200 text-sm font-medium block">CVV</label>
            <div className="relative mt-1">
              <Input
                type={showCVV ? 'text' : 'password'}
                value={cvv}
                onChange={(e) => setCvv(e.target.value)}
                placeholder="•••"
                maxLength={4}
                required
                onFocus={() => setCardFlipped(true)}
                onBlur={() => setCardFlipped(false)}
                className="bg-white/10 border-white/20 text-white text-center pr-8"
              />
              <button
                type="button"
                onClick={() => setShowCVV(!showCVV)}
                className="absolute right-2 top-1/2 -translate-y-1/2 text-slate-400 hover:text-white"
              >
                {showCVV ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
          </div>
        </div>

        <Button
          type="submit"
          disabled={isProcessing}
          className="w-full h-12 text-base font-bold bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white gap-2 shadow-lg"
        >
          {isProcessing ? (
            <>
              <RefreshCw className="h-5 w-5 animate-spin" /> Processing...
            </>
          ) : (
            <>
              <Lock className="h-4 w-4" /> Pay {formatCurrency(invoice?.total || 165.00)} Securely
            </>
          )}
        </Button>
      </form>
    </div>
  );
}
