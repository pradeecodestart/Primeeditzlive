'use client';
import React from 'react';
import { StatsCard } from './StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { DollarSign, FileText, AlertCircle, CheckCircle, Plus } from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import Link from 'next/link';

export const AccountantDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Financial Ledger & Invoices
          </h1>
          <p className="text-sm text-slate-500">
            Invoice generation, payment collections, and revenue tracking.
          </p>
        </div>
        <Link href="/invoices">
          <Button className="bg-indigo-600 hover:bg-indigo-700">Manage All Invoices</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Monthly Revenue" value={formatCurrency(19800)} change="+14.2%" icon={DollarSign} />
        <StatsCard title="Outstanding Invoices" value={formatCurrency(1450)} icon={FileText} />
        <StatsCard title="Overdue Amount" value={formatCurrency(250)} isPositive={false} icon={AlertCircle} />
        <StatsCard title="Paid This Month" value={formatCurrency(18350)} icon={CheckCircle} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Recent Invoices Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-mono font-bold text-indigo-600">INV-2024-001</span>
                <p className="text-xs text-slate-500">Client: Bob Martinez • Project: Summer Fashion Catalog</p>
              </div>
              <span className="text-sm font-bold text-green-600">$110.00 (PAID)</span>
            </div>
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
              <div>
                <span className="font-mono font-bold text-indigo-600">INV-2024-004</span>
                <p className="text-xs text-slate-500">Client: Alice Cooper • Project: E-commerce Shoe Cutouts</p>
              </div>
              <span className="text-sm font-bold text-yellow-600">$165.00 (SENT)</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
