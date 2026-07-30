'use client';

import React, { Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { motion } from 'framer-motion';
import { CheckCircle2, ArrowRight, ShieldCheck, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { formatCurrency } from '@/lib/utils';

function PaymentSuccessContent() {
  const searchParams = useSearchParams();
  const paymentId = searchParams.get('paymentId') || 'pay_890214';
  const amount = searchParams.get('amount') || '165.00';

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="max-w-md w-full bg-white/5 border border-white/10 rounded-3xl p-8 text-center backdrop-blur-xl shadow-2xl space-y-6"
    >
      <div className="w-20 h-20 mx-auto rounded-full bg-emerald-500/20 text-emerald-400 border border-emerald-500/30 flex items-center justify-center">
        <CheckCircle2 className="w-10 h-10" />
      </div>

      <div>
        <h1 className="text-2xl font-bold">Payment Successful!</h1>
        <p className="text-slate-400 text-sm mt-1">
          Transaction ID: <span className="font-mono text-indigo-300 font-semibold">{paymentId}</span>
        </p>
      </div>

      <div className="p-4 bg-white/5 rounded-2xl border border-white/10 text-left space-y-2 text-sm">
        <div className="flex justify-between">
          <span className="text-slate-400">Amount Paid:</span>
          <span className="font-bold text-emerald-400 text-lg">{formatCurrency(parseFloat(amount))}</span>
        </div>
        <div className="flex justify-between">
          <span className="text-slate-400">Payment Status:</span>
          <span className="text-emerald-400 font-medium flex items-center gap-1">
            <ShieldCheck className="w-4 h-4" /> Verified & Cleared
          </span>
        </div>
      </div>

      <div className="space-y-3">
        <Link href="/billing" className="block">
          <Button className="w-full h-12 bg-indigo-600 hover:bg-indigo-700 font-bold gap-2 text-white">
            Go to Bill Desk <ArrowRight className="w-4 h-4" />
          </Button>
        </Link>
        <Link href={`/orders`} className="block">
          <Button variant="outline" className="w-full h-12 border-white/20 text-white hover:bg-white/10 gap-2">
            <FileText className="w-4 h-4" /> View My Orders
          </Button>
        </Link>
      </div>
    </motion.div>
  );
}

export default function PaymentSuccessPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-6">
      <Suspense fallback={<div className="text-white text-sm font-semibold">Loading payment details...</div>}>
        <PaymentSuccessContent />
      </Suspense>
    </div>
  );
}
