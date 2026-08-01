'use client';

import React from 'react';
import Link from 'next/link';
import { OrderForm } from '@/components/orders/OrderForm';
import { Sparkles, ArrowLeft, ShieldCheck, PhoneCall, HelpCircle } from 'lucide-react';

export default function NewOrderPage() {
  return (
    <div className="min-h-screen bg-slate-950 text-slate-100 font-sans selection:bg-indigo-500 selection:text-white">
      {/* Top Studio Header Banner */}
      <header className="sticky top-0 z-50 border-b border-slate-800/80 bg-slate-900/90 backdrop-blur-xl px-6 py-4">
        <div className="max-w-7xl mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-4">
            <Link
              href="/dashboard"
              className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 transition-all flex items-center gap-1.5 text-xs font-bold"
            >
              <ArrowLeft className="w-4 h-4" /> Back to Dashboard
            </Link>
            <div className="h-6 w-px bg-slate-800" />
            <div className="flex items-center space-x-3">
              <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg shadow-indigo-600/30">
                <Sparkles className="h-5 w-5 text-white" />
              </div>
              <div>
                <span className="font-extrabold text-base bg-gradient-to-r from-indigo-400 via-purple-300 to-pink-400 bg-clip-text text-transparent tracking-tight">
                  PostProd Pro Studio
                </span>
                <span className="block text-[10px] text-slate-400 font-mono">
                  Official Order Booking System & Live Estimator
                </span>
              </div>
            </div>
          </div>

          <div className="hidden sm:flex items-center space-x-4 text-xs font-semibold">
            <span className="flex items-center gap-1.5 text-emerald-400 bg-emerald-500/10 px-3 py-1.5 rounded-full border border-emerald-500/20">
              <ShieldCheck className="w-4 h-4" /> GST 18% Compliant Invoice
            </span>
            <span className="flex items-center gap-1.5 text-indigo-300 bg-indigo-500/10 px-3 py-1.5 rounded-full border border-indigo-500/20">
              <PhoneCall className="w-3.5 h-3.5" /> Support: +91 98765 43210
            </span>
          </div>
        </div>
      </header>

      {/* Main Order Form Body */}
      <main className="max-w-7xl mx-auto p-4 sm:p-6 lg:p-8 space-y-6">
        <div>
          <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
            Configure Your Post-Production Order
          </h1>
          <p className="text-sm text-slate-400 mt-1">
            Select Photo/Video editing scope, customize retouching options, upload assets, and get live GST breakdown.
          </p>
        </div>

        <OrderForm />
      </main>
    </div>
  );
}
