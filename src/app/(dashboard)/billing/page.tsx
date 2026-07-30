'use client';

import React, { useState } from 'react';
import { motion } from 'framer-motion';
import {
  CreditCard, FileText, TrendingUp,
  Clock, CheckCircle, AlertCircle,
  Download, Search, Plus,
  BarChart3
} from 'lucide-react';
import { useQuery } from '@tanstack/react-query';
import { formatCurrency } from '@/lib/utils';
import { BillingStats } from '@/components/billing/BillingStats';
import { InvoiceTable } from '@/components/billing/InvoiceTable';
import { PaymentHistory } from '@/components/billing/PaymentHistory';
import { Button } from '@/components/ui/button';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';

export default function BillDeskPage() {
  const [activeTab, setActiveTab] = useState('overview');
  const [searchQuery, setSearchQuery] = useState('');
  const [statusFilter, setStatusFilter] = useState('all');

  const { data: billingData, isLoading } = useQuery({
    queryKey: ['billing-overview'],
    queryFn: async () => {
      const res = await fetch('/api/billing/overview');
      return res.json();
    }
  });

  const stats = [
    {
      title: 'Total Outstanding',
      value: formatCurrency(billingData?.outstanding || 2450.00),
      change: '+2 active invoices',
      icon: AlertCircle,
      color: 'text-amber-500',
      bg: 'bg-amber-50 dark:bg-amber-950/40',
      border: 'border-amber-200 dark:border-amber-800'
    },
    {
      title: 'Paid This Month',
      value: formatCurrency(billingData?.paidThisMonth || 8900.00),
      change: '+18% vs last month',
      icon: CheckCircle,
      color: 'text-emerald-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/40',
      border: 'border-emerald-200 dark:border-emerald-800'
    },
    {
      title: 'Overdue Amount',
      value: formatCurrency(billingData?.overdue || 450.00),
      change: `${billingData?.overdueCount || 1} invoice`,
      icon: Clock,
      color: 'text-red-500',
      bg: 'bg-red-50 dark:bg-red-950/40',
      border: 'border-red-200 dark:border-red-800'
    },
    {
      title: 'Total Revenue (YTD)',
      value: formatCurrency(billingData?.totalPaidYTD || 45200.00),
      change: 'Year to date',
      icon: TrendingUp,
      color: 'text-indigo-500',
      bg: 'bg-indigo-50 dark:bg-indigo-950/40',
      border: 'border-indigo-200 dark:border-indigo-800'
    }
  ];

  return (
    <div className="min-h-screen bg-slate-50 dark:bg-slate-950 p-6 space-y-8">
      {/* HEADER */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white flex items-center gap-3">
            💳 Bill Desk & Financial Center
          </h1>
          <p className="text-slate-500 dark:text-slate-400 mt-1">
            Manage client invoices, active payment gateways, settlements & financial reporting
          </p>
        </div>
        <div className="flex gap-3">
          <Button variant="outline" className="gap-2">
            <Download className="h-4 w-4" /> Export Report
          </Button>
          <Button className="gap-2 bg-indigo-600 hover:bg-indigo-700 text-white">
            <Plus className="h-4 w-4" /> Create Invoice
          </Button>
        </div>
      </div>

      {/* STATS CARDS */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {stats.map((stat, index) => {
          const Icon = stat.icon;
          return (
            <motion.div
              key={stat.title}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: index * 0.05 }}
              className={`rounded-2xl border p-6 ${stat.bg} ${stat.border} shadow-sm transition-all`}
            >
              <div className="flex items-center justify-between mb-4">
                <span className="text-sm font-medium text-slate-600 dark:text-slate-300">
                  {stat.title}
                </span>
                <div className="p-2 rounded-xl bg-white dark:bg-slate-900/80 shadow-xs">
                  <Icon className={`h-5 w-5 ${stat.color}`} />
                </div>
              </div>
              <div className="text-2xl font-bold text-slate-900 dark:text-white mb-1">
                {stat.value}
              </div>
              <div className="text-xs font-medium text-slate-500 dark:text-slate-400">
                {stat.change}
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* MAIN TABS & FILTERS */}
      <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
          <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-1 rounded-xl">
            <TabsTrigger value="overview" className="gap-2 rounded-lg">
              <BarChart3 className="h-4 w-4" /> Overview
            </TabsTrigger>
            <TabsTrigger value="invoices" className="gap-2 rounded-lg">
              <FileText className="h-4 w-4" /> Invoices
            </TabsTrigger>
            <TabsTrigger value="payments" className="gap-2 rounded-lg">
              <CreditCard className="h-4 w-4" /> Payment History
            </TabsTrigger>
          </TabsList>

          <div className="flex items-center gap-3">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-slate-400" />
              <Input
                placeholder="Search invoices..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-9 w-64 bg-white dark:bg-slate-900"
              />
            </div>
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="h-10 rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 px-3 py-2 text-sm text-slate-900 dark:text-slate-100"
            >
              <option value="all">All Status</option>
              <option value="sent">Pending / Sent</option>
              <option value="paid">Paid</option>
              <option value="overdue">Overdue</option>
            </select>
          </div>
        </div>

        <TabsContent value="overview">
          <BillingStats data={billingData} isLoading={isLoading} />
        </TabsContent>

        <TabsContent value="invoices">
          <InvoiceTable search={searchQuery} status={statusFilter} />
        </TabsContent>

        <TabsContent value="payments">
          <PaymentHistory />
        </TabsContent>
      </Tabs>
    </div>
  );
}
