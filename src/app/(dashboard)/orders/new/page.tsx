'use client';

import React from 'react';
import { OrderForm } from '@/components/orders/OrderForm';

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
