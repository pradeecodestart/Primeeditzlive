'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from './StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  ShoppingBag, Clock, AlertTriangle, CheckCircle,
  UserCheck, Shield, Award, Calendar, Send, Users
} from 'lucide-react';
import Link from 'next/link';
import { Order } from '@/types/order';

const columns: ('PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'REVISION' | 'COMPLETED')[] = [
  'PENDING',
  'IN_PROGRESS',
  'REVIEW',
  'REVISION',
  'COMPLETED',
];

export const ManagerDashboard: React.FC = () => {
  const [selectedOrder, setSelectedOrder] = useState<Order | null>(null);
  const [assignedEditor, setAssignedEditor] = useState<string>('');
  const [internalDeadline, setInternalDeadline] = useState<string>('');
  const [editorNotes, setEditorNotes] = useState<string>('');

  // Fetch Live Orders
  const { data: orders = [], refetch } = useQuery({
    queryKey: ['manager-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      const json = await res.json();
      return json.orders || [];
    },
    refetchInterval: 3000,
  });

  // Fetch Live Team Employees (includes newly added editors, retouchers, custom roles!)
  const { data: teamMembers = [] } = useQuery({
    queryKey: ['manager-team-employees'],
    queryFn: async () => {
      const res = await fetch('/api/team');
      const json = await res.json();
      return json.employees || [];
    },
    refetchInterval: 3000,
  });

  const [statusMessage, setStatusMessage] = useState<string>('');

  const handleConfirmAssignment = () => {
    if (!selectedOrder) return;
    const targetEditor = assignedEditor || (teamMembers[0]?.name || 'Mike Chen');
    setStatusMessage(`✅ Order ${selectedOrder.orderNumber} assigned to ${targetEditor}! Moved to IN_PROGRESS.`);
    setSelectedOrder(null);
    refetch();
    setTimeout(() => setStatusMessage(''), 4000);
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            Project Manager Hub & Employee Control Center
          </h1>
          <p className="text-sm text-slate-500">
            Kanban production board, editor allocation, SLA deadline reviews & order assignment.
          </p>
        </div>
        <div className="flex space-x-3">
          <Link href="/team">
            <Button variant="outline" className="gap-2 border-indigo-500/30 text-indigo-400 hover:bg-indigo-500/10">
              <Users className="h-4 w-4 text-indigo-400" /> Employees Control Center ({teamMembers.length})
            </Button>
          </Link>
          <Link href="/orders/new">
            <Button className="bg-indigo-600 hover:bg-indigo-700 text-white">Create New Order</Button>
          </Link>
        </div>
      </div>

      {statusMessage && (
        <div className="p-3 bg-emerald-500/20 text-emerald-300 rounded-xl border border-emerald-500/40 text-xs font-bold font-mono">
          {statusMessage}
        </div>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="Total Orders" value={String(orders.length)} icon={ShoppingBag} />
        <StatsCard title="Pending Intake" value={String(orders.filter((o: Order) => o.status === 'PENDING').length)} icon={Clock} />
        <StatsCard title="In Production" value={String(orders.filter((o: Order) => o.status === 'IN_PROGRESS').length)} icon={AlertTriangle} />
        <StatsCard title="Completed Orders" value={String(orders.filter((o: Order) => o.status === 'COMPLETED').length)} icon={CheckCircle} />
      </div>

      {/* Live Kanban Board */}
      <Card>
        <CardHeader>
          <CardTitle className="text-base flex items-center justify-between">
            <span>Production Kanban Pipeline (Click Order Card to Assign to Editor)</span>
            <Badge variant="outline">Live Auto-Sync</Badge>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-5 gap-4 overflow-x-auto">
            {columns.map((col) => {
              const colOrders = orders.filter((o: Order) => o.status === col);
              return (
                <div
                  key={col}
                  className="bg-slate-50 dark:bg-slate-900/60 p-3 rounded-xl border border-slate-200 dark:border-slate-800 min-h-[350px]"
                >
                  <div className="flex items-center justify-between mb-3 px-1">
                    <span className="text-xs font-bold uppercase tracking-wider text-slate-600 dark:text-slate-400">
                      {col.replace('_', ' ')}
                    </span>
                    <span className="text-xs font-mono px-2 py-0.5 rounded-full bg-slate-200 dark:bg-slate-800 text-slate-700 dark:text-slate-300 font-bold">
                      {colOrders.length}
                    </span>
                  </div>

                  <div className="space-y-3">
                    {colOrders.map((ord: Order) => (
                      <div
                        key={ord.id}
                        onClick={() => setSelectedOrder(ord)}
                        className="p-3 bg-white dark:bg-slate-800 rounded-lg border border-slate-200 dark:border-slate-700 shadow-sm hover:border-indigo-500 cursor-pointer transition-all space-y-2"
                      >
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-mono text-indigo-600 dark:text-indigo-400 font-bold">{ord.orderNumber}</span>
                          <Badge variant={ord.priority === 'URGENT' ? 'destructive' : 'default'}>{ord.priority}</Badge>
                        </div>
                        <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{ord.projectName}</p>
                        <div className="flex items-center justify-between text-[11px] text-slate-500 pt-1 border-t border-slate-100 dark:border-slate-700/50">
                          <span>{ord.client?.firstName ? `${ord.client.firstName} ${ord.client.lastName || ''}` : 'Client'}</span>
                          <span className="font-medium text-indigo-500 flex items-center gap-1 font-bold">
                            <UserCheck className="w-3 h-3" /> Assign ➔
                          </span>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              );
            })}
          </div>
        </CardContent>
      </Card>

      {/* Dynamic Editor Assignment Control Modal */}
      {selectedOrder && (
        <div className="fixed inset-0 bg-black/70 backdrop-blur-sm z-50 flex items-center justify-center p-4">
          <div className="bg-slate-900 text-white rounded-3xl p-6 border border-slate-800 max-w-lg w-full space-y-6 shadow-2xl">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <div>
                <h3 className="font-bold text-lg text-indigo-300">Assign Order to Editor / Professional</h3>
                <p className="text-xs text-slate-400 font-mono">{selectedOrder.orderNumber} • {selectedOrder.projectName}</p>
              </div>
              <Badge variant="outline">{selectedOrder.serviceType}</Badge>
            </div>

            <div className="space-y-4">
              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">
                  Select Editor / Professional ({teamMembers.length} Available Staff)
                </label>
                <select
                  value={assignedEditor || (teamMembers[0]?.name || '')}
                  onChange={(e) => setAssignedEditor(e.target.value)}
                  className="w-full h-11 rounded-xl bg-slate-800 border border-slate-700 text-white px-3 text-sm font-semibold"
                >
                  {teamMembers.map((ed: any) => (
                    <option key={ed.id} value={ed.name}>
                      👤 {ed.name} — {ed.specialty || ed.role.replace(/_/g, ' ')} ({ed.workload || 'LOW'} Workload)
                    </option>
                  ))}
                </select>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Set Internal Buffer Deadline</label>
                <Input
                  type="date"
                  value={internalDeadline}
                  onChange={(e) => setInternalDeadline(e.target.value)}
                  className="bg-slate-800 border-slate-700 text-white"
                />
                <p className="text-[11px] text-slate-500 mt-1">Recommended: 1 day before client SLA</p>
              </div>

              <div>
                <label className="text-xs font-semibold text-slate-400 uppercase block mb-1">Editor Retouching & Technical Briefing Notes</label>
                <textarea
                  rows={3}
                  value={editorNotes}
                  onChange={(e) => setEditorNotes(e.target.value)}
                  placeholder="e.g. Natural skin tones, remove background glare, output 300dpi JPG."
                  className="w-full text-xs rounded-xl bg-slate-800 border border-slate-700 text-white p-3"
                />
              </div>
            </div>

            <div className="flex justify-end gap-3 pt-3 border-t border-slate-800">
              <Button variant="outline" onClick={() => setSelectedOrder(null)}>
                Cancel
              </Button>
              <Button onClick={handleConfirmAssignment} className="bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold gap-2">
                <Send className="w-4 h-4" /> Confirm Assignment & Move to Production
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
