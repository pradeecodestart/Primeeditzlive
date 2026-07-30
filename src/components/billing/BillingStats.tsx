'use client';

import React from 'react';
import { motion } from 'framer-motion';
import {
  TrendingUp, ArrowUpRight, DollarSign,
  PieChart as PieIcon, CreditCard, ShieldCheck
} from 'lucide-react';
import { formatCurrency } from '@/lib/utils';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface BillingStatsProps {
  data?: any;
  isLoading?: boolean;
}

export function BillingStats({ data, isLoading }: BillingStatsProps) {
  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="h-44 rounded-2xl bg-slate-200 dark:bg-slate-800 animate-pulse" />
        ))}
      </div>
    );
  }

  const breakdown = [
    { label: 'Photo Retouching', amount: 14500, percentage: 45, color: 'bg-indigo-500' },
    { label: 'Video Editing & Grading', amount: 11200, percentage: 35, color: 'bg-purple-500' },
    { label: 'Real Estate & HDR', amount: 4800, percentage: 15, color: 'bg-emerald-500' },
    { label: 'Wedding Packages', amount: 1600, percentage: 5, color: 'bg-amber-500' },
  ];

  return (
    <div className="space-y-6">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Revenue Growth
            </CardTitle>
            <TrendingUp className="h-4 w-4 text-emerald-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              {formatCurrency(data?.totalPaidYTD || 32100)}
            </div>
            <p className="text-xs text-emerald-600 dark:text-emerald-400 mt-1 flex items-center gap-1 font-medium">
              <ArrowUpRight className="h-3 w-3" /> +24.5% from previous quarter
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Collection Rate
            </CardTitle>
            <ShieldCheck className="h-4 w-4 text-indigo-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              98.2%
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Average payment turnaround: 1.8 days
            </p>
          </CardContent>
        </Card>

        <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900">
          <CardHeader className="flex flex-row items-center justify-between pb-2">
            <CardTitle className="text-sm font-medium text-slate-500 dark:text-slate-400">
              Active Payment Gateways
            </CardTitle>
            <CreditCard className="h-4 w-4 text-purple-500" />
          </CardHeader>
          <CardContent>
            <div className="text-3xl font-bold text-slate-900 dark:text-white">
              Stripe & UPI
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
              Instant settlement enabled
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Revenue Breakdown */}
      <Card className="border-slate-200 dark:border-slate-800 shadow-sm bg-white dark:bg-slate-900 p-6">
        <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2">
          <PieIcon className="h-5 w-5 text-indigo-500" /> Service Revenue Distribution
        </h3>
        <div className="space-y-4">
          {breakdown.map((item) => (
            <div key={item.label} className="space-y-1">
              <div className="flex justify-between text-sm">
                <span className="font-medium text-slate-700 dark:text-slate-300">{item.label}</span>
                <span className="font-bold text-slate-900 dark:text-white">
                  {formatCurrency(item.amount)} ({item.percentage}%)
                </span>
              </div>
              <div className="w-full h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden">
                <div className={`h-full ${item.color}`} style={{ width: `${item.percentage}%` }} />
              </div>
            </div>
          ))}
        </div>
      </Card>
    </div>
  );
}
