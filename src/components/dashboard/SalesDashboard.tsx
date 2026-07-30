'use client';
import React from 'react';
import { StatsCard } from './StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Users, Target, Send, TrendingUp, Plus } from 'lucide-react';
import Link from 'next/link';

export const SalesDashboard: React.FC = () => {
  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Sales & Lead Pipeline
          </h1>
          <p className="text-sm text-slate-500">
            Lead acquisition, client quotes, and account conversions.
          </p>
        </div>
        <Link href="/clients">
          <Button className="bg-indigo-600 hover:bg-indigo-700"><Plus className="h-4 w-4 mr-2" /> Add New Lead</Button>
        </Link>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="New Leads This Month" value="24" change="+22.5%" icon={Users} />
        <StatsCard title="Converted Clients" value="8" change="+14.0%" icon={Target} />
        <StatsCard title="Quotes Sent" value="19" icon={Send} />
        <StatsCard title="Conversion Rate" value="33.3%" icon={TrendingUp} />
      </div>

      <Card>
        <CardHeader>
          <CardTitle className="text-base">Lead Pipeline Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-3">
            <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800 bg-slate-50 dark:bg-slate-800">
              <div>
                <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">Lumina Production House</p>
                <p className="text-xs text-slate-400">Interested in 500+ photos/month package edit</p>
              </div>
              <span className="text-xs font-semibold px-2 py-1 bg-yellow-100 dark:bg-yellow-950 text-yellow-800 dark:text-yellow-300 rounded">
                Quote Pending
              </span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
};
