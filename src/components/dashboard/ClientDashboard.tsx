'use client';

import React from 'react';
import { useQuery } from '@tanstack/react-query';
import { useSession } from 'next-auth/react';
import { StatsCard } from './StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { ShoppingBag, CheckCircle, Clock, FileText, Plus, MessageSquare, Sparkles, Wand2 } from 'lucide-react';
import Link from 'next/link';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order } from '@/types/order';

export const ClientDashboard: React.FC = () => {
  const { data: session } = useSession();
  const userName = session?.user?.name || 'Valued Client';
  const firstName = userName.split(' ')[0] || 'Valued Client';

  const { data: orders = [], isLoading } = useQuery({
    queryKey: ['client-orders', session?.user?.email],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      const json = await res.json();
      return json.orders || [];
    },
    refetchInterval: 3000,
  });

  const activeOrders = orders.filter((o: Order) => o.status !== 'COMPLETED' && o.status !== 'CANCELLED');
  const completedOrders = orders.filter((o: Order) => o.status === 'COMPLETED');
  const latestOrder = orders[0];

  const isFreshClient = orders.length === 0;

  return (
    <div className="space-y-8">
      {/* Welcome & Congratulations Hero Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-r from-indigo-950 via-slate-900 to-purple-950 p-6 sm:p-8 border border-indigo-500/30 shadow-2xl">
        <div className="absolute top-0 right-0 -mt-4 -mr-4 w-40 h-40 bg-indigo-500/10 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 right-1/4 -mb-4 w-40 h-40 bg-purple-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="relative z-10 flex flex-col md:flex-row items-start md:items-center justify-between gap-6">
          <div className="space-y-2 max-w-2xl">
            <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-indigo-500/20 text-indigo-300 text-xs font-semibold border border-indigo-500/30 shadow-sm">
              <Sparkles className="w-3.5 h-3.5 text-amber-400 animate-pulse" />
              <span>Congratulations & Welcome</span>
            </div>
            
            <h1 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">
              🎉 Welcome to the Editing World, {firstName}!
            </h1>
            
            <p className="text-sm text-slate-300 italic font-medium leading-relaxed">
              &ldquo;Where your creative visual vision transforms into post-production perfection.&rdquo;
            </p>
          </div>

          <Link href="/orders/new">
            <Button size="lg" className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-500 hover:to-purple-500 text-white font-semibold shadow-lg shadow-indigo-600/30 border border-indigo-400/20 px-6 py-6 rounded-xl transition-all transform hover:scale-105">
              <Plus className="h-5 w-5 mr-2" />
              {isFreshClient ? 'Submit Your First Order' : 'Submit New Order'}
            </Button>
          </Link>
        </div>
      </div>

      {/* Stats Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Active Orders" value={String(activeOrders.length)} icon={ShoppingBag} />
        <StatsCard title="Completed Orders" value={String(completedOrders.length)} icon={CheckCircle} />
        <StatsCard title="Total Booked" value={String(orders.length)} icon={FileText} />
        <StatsCard
          title="Total Spent"
          value={formatCurrency(orders.reduce((sum: number, o: Order) => sum + Number(o.totalAmount || 0), 0))}
          icon={Clock}
        />
      </div>

      {/* Fresh Client Empty State Banner */}
      {isFreshClient && !isLoading && (
        <Card className="border-indigo-500/30 bg-slate-900/60 backdrop-blur-xl p-8 text-center shadow-xl">
          <div className="max-w-md mx-auto space-y-5">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30 shadow-inner">
              <Wand2 className="w-8 h-8 text-indigo-400" />
            </div>
            
            <div>
              <h2 className="text-xl font-bold text-white mb-2">Ready to Start Your Post-Production Journey?</h2>
              <p className="text-slate-400 text-sm leading-relaxed">
                You have 0 active orders. Submit your raw photos, video clips, or wedding footage to get expert retouching, color grading, and video editing!
              </p>
            </div>

            <Link href="/orders/new" className="inline-block">
              <Button size="lg" className="bg-indigo-600 hover:bg-indigo-500 text-white font-semibold px-8 py-3 rounded-xl shadow-lg shadow-indigo-600/30 transition-all">
                <Plus className="h-5 w-5 mr-2" /> Start First Order Now
              </Button>
            </Link>
          </div>
        </Card>
      )}

      {/* Latest Active Order Card (If client has orders) */}
      {latestOrder && (
        <Card className="border-indigo-500/30 bg-gradient-to-r from-indigo-950/20 to-slate-900/40 shadow-xl">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="text-lg text-slate-900 dark:text-slate-100">
                  Active Order: {latestOrder.projectName}
                </CardTitle>
                <p className="text-xs text-slate-400 font-mono mt-1">
                  Order #{latestOrder.orderNumber} • Service: {latestOrder.serviceType}
                </p>
              </div>
              <Badge variant="default">{latestOrder.status}</Badge>
            </div>
          </CardHeader>
          <CardContent className="space-y-6">
            <div>
              <div className="flex justify-between text-xs font-semibold mb-2 text-slate-600 dark:text-slate-300">
                <span>Progress Stage: {latestOrder.status === 'PENDING' ? 'Sales & Intake Review' : 'Editing in Progress'}</span>
                <span>{latestOrder.status === 'COMPLETED' ? '100%' : '65%'} Complete</span>
              </div>
              <Progress value={latestOrder.status === 'COMPLETED' ? 100 : 65} className="h-3" />
            </div>

            <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-slate-800">
              <span>Target SLA Deadline: {formatDate(latestOrder.deadline)}</span>
              <div className="flex space-x-2">
                <Link href="/chat">
                  <Button size="sm" variant="outline"><MessageSquare className="h-4 w-4 mr-1" /> Chat with Team</Button>
                </Link>
              </div>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Booked Orders Table (If client has orders) */}
      {orders.length > 0 && (
        <Card className="shadow-xl">
          <CardHeader>
            <CardTitle className="text-base flex items-center justify-between">
              <span>My Booked Orders ({orders.length})</span>
              <Link href="/orders" className="text-xs text-indigo-400 hover:underline">View All ➔</Link>
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="divide-y divide-slate-100 dark:divide-slate-800">
              {orders.map((ord: Order) => (
                <div key={ord.id} className="py-3 flex items-center justify-between">
                  <div>
                    <p className="font-semibold text-sm text-slate-900 dark:text-slate-100">{ord.projectName}</p>
                    <p className="text-xs text-slate-400 font-mono">{ord.orderNumber} • {ord.serviceType}</p>
                  </div>
                  <div className="text-right flex items-center gap-3">
                    <span className="font-bold text-sm text-slate-900 dark:text-white">{formatCurrency(ord.totalAmount)}</span>
                    <Badge variant="outline">{ord.status}</Badge>
                  </div>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  );
};
