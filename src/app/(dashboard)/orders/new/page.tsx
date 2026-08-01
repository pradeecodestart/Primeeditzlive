'use client';

import React from 'react';
import dynamic from 'next/dynamic';

const OrderForm = dynamic(
  () => import('@/components/orders/OrderForm').then((mod) => mod.OrderForm),
  {
    ssr: false,
    loading: () => (
      <div className="p-8 rounded-2xl bg-slate-900 border border-slate-800 text-slate-400 text-center animate-pulse">
        Loading Order Booking System...
      </div>
    ),
  }
);

export default function NewOrderPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          Create New Order
        </h1>
        <p className="text-sm text-slate-500">
          Configure service type, custom retouching options, upload files, and calculate live price.
        </p>
      </div>

      <OrderForm />
    </div>
  );
}
