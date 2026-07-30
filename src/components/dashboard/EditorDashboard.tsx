'use client';

import React, { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { StatsCard } from './StatsCard';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { FileUploader } from '@/components/shared/FileUploader';
import {
  CheckCircle2, Clock, Star, UploadCloud, AlertCircle,
  Award, Trophy, Eye, LayoutGrid, Check, ArrowRight,
  TrendingUp, Sparkles, Image as ImageIcon, Film, MessageSquare
} from 'lucide-react';
import { formatCurrency, formatDate } from '@/lib/utils';
import { Order } from '@/types/order';

interface PortfolioItem {
  id: string;
  title: string;
  category: string;
  beforeImg: string;
  afterImg: string;
  rating: number;
  clientComment: string;
  turnaroundTime: string;
}

const SAMPLE_PORTFOLIO: PortfolioItem[] = [
  {
    id: 'p1',
    title: 'High-Fashion Magazine Retouching',
    category: 'Photo Retouching',
    beforeImg: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    clientComment: 'Phenomenal skin texture work and color balance. Delivered 6 hours ahead of schedule!',
    turnaroundTime: '12 Hours (SLA SLA Exceeded)',
  },
  {
    id: 'p2',
    title: 'Luxury Real Estate HDR Sky Replacement',
    category: 'Real Estate',
    beforeImg: 'https://images.unsplash.com/photo-1600596542815-ffad4c1539a9?auto=format&fit=crop&w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1600585154340-be6161a56a0c?auto=format&fit=crop&w=600&q=80',
    rating: 4.9,
    clientComment: 'Sky replacement and window exposures look completely natural.',
    turnaroundTime: '8 Hours',
  },
  {
    id: 'p3',
    title: 'Cinematic Wedding Story Highlight Film',
    category: 'Video Grading',
    beforeImg: 'https://images.unsplash.com/photo-1519741497674-611481863552?auto=format&fit=crop&w=600&q=80',
    afterImg: 'https://images.unsplash.com/photo-1511285560929-80b456fea0bc?auto=format&fit=crop&w=600&q=80',
    rating: 5.0,
    clientComment: 'The color grading LUT and audio mix brought the couple to tears!',
    turnaroundTime: '24 Hours',
  },
];

export const EditorDashboard: React.FC = () => {
  const [viewMode, setViewMode] = useState<'workbench' | 'portfolio'>('workbench');
  const [selectedTaskId, setSelectedTaskId] = useState<string>('ORD-2024-001');
  const [taskProgress, setTaskProgress] = useState<number>(65);

  const { data: allOrders = [] } = useQuery({
    queryKey: ['editor-orders'],
    queryFn: async () => {
      const res = await fetch('/api/orders');
      const json = await res.json();
      return json.orders || [];
    },
    refetchInterval: 3000,
  });

  const activeTasks = allOrders.filter((o: Order) => o.status !== 'COMPLETED');
  const selectedOrder = allOrders.find((o: Order) => o.id === selectedTaskId || o.orderNumber === selectedTaskId) || allOrders[0];

  const handleUpdateProgress = (newVal: number) => {
    setTaskProgress(newVal);
    alert(`Work status updated to ${newVal}% for ${selectedOrder?.projectName || 'selected task'}!`);
  };

  return (
    <div className="space-y-8">
      {/* Header & Mode Switcher Toggle */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100 flex items-center gap-3">
            🎨 Editor Professional Hub
            <Badge variant="outline" className="bg-indigo-500/10 text-indigo-400 border-indigo-500/30">
              Senior Specialist
            </Badge>
          </h1>
          <p className="text-sm text-slate-500">
            Managed by Project Manager & CEO • Live task tracking, SLA timers, rewards & portfolio showcase.
          </p>
        </div>

        {/* View Toggle */}
        <div className="flex items-center p-1 bg-slate-200 dark:bg-slate-900 rounded-xl border border-slate-300 dark:border-slate-800">
          <button
            onClick={() => setViewMode('workbench')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'workbench'
                ? 'bg-indigo-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <LayoutGrid className="w-4 h-4" /> Production Workbench
          </button>
          <button
            onClick={() => setViewMode('portfolio')}
            className={`flex items-center gap-2 px-4 py-2 text-xs font-bold rounded-lg transition-all ${
              viewMode === 'portfolio'
                ? 'bg-gradient-to-r from-purple-600 to-pink-600 text-white shadow-md'
                : 'text-slate-500 hover:text-slate-900 dark:hover:text-white'
            }`}
          >
            <Sparkles className="w-4 h-4 text-amber-300" /> Portfolio Showcase
          </button>
        </div>
      </div>

      {/* Top Stats Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        <StatsCard title="My Active Tasks" value={String(activeTasks.length || 3)} icon={Clock} />
        <StatsCard title="Completed This Month" value="48" icon={CheckCircle2} />
        <StatsCard title="Avg Turnaround Time" value="11.4 hrs" icon={TrendingUp} />
        <StatsCard title="Editor Quality Score" value="⭐ 4.95 / 5.0" icon={Star} />
      </div>

      {/* Rewards & Performance Badges Banner */}
      <div className="p-4 rounded-2xl bg-gradient-to-r from-indigo-950/80 via-purple-950/80 to-slate-950 border border-indigo-500/30 text-white flex flex-col md:flex-row items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="p-3 rounded-2xl bg-amber-500/20 text-amber-400 border border-amber-500/30">
            <Trophy className="w-8 h-8" />
          </div>
          <div>
            <div className="font-bold text-base flex items-center gap-2">
              🏆 Master Retoucher Badge Awarded
              <span className="text-xs bg-amber-400/20 text-amber-300 px-2 py-0.5 rounded font-mono">TOP 1% EDITOR</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              100% On-Time SLA Delivery across 50 consecutive orders. Earned $250 Performance Bonus this month!
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 text-xs font-semibold">
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 flex items-center gap-1.5">
            <Award className="w-4 h-4 text-amber-400" /> 12 SLA Streak
          </div>
          <div className="px-3 py-1.5 rounded-xl bg-white/10 border border-white/20 flex items-center gap-1.5">
            <Star className="w-4 h-4 text-indigo-400" /> 99.4% Client CSAT
          </div>
        </div>
      </div>

      {/* WORKBENCH VIEW */}
      {viewMode === 'workbench' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Active Tasks List & Progress Controller */}
          <div className="lg:col-span-2 space-y-6">
            <Card>
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Assigned Orders Queue</span>
                  <Badge variant="outline">{activeTasks.length} Pending Actions</Badge>
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                {allOrders.map((ord: Order) => {
                  const isSelected = selectedOrder?.id === ord.id;
                  return (
                    <div
                      key={ord.id}
                      onClick={() => setSelectedTaskId(ord.id)}
                      className={`p-4 rounded-xl border cursor-pointer transition-all ${
                        isSelected
                          ? 'border-indigo-500 bg-indigo-50/50 dark:bg-indigo-950/40 shadow-sm'
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300'
                      }`}
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-mono font-bold text-indigo-600 dark:text-indigo-400">
                          {ord.orderNumber}
                        </span>
                        <div className="flex items-center gap-2">
                          <Badge variant={ord.priority === 'URGENT' ? 'destructive' : 'default'}>
                            {ord.priority}
                          </Badge>
                          <Badge variant="outline">{ord.status}</Badge>
                        </div>
                      </div>

                      <h4 className="font-semibold text-slate-900 dark:text-slate-100 mt-2">
                        {ord.projectName}
                      </h4>
                      <p className="text-xs text-slate-500 mt-1">
                        Service: {ord.serviceType} • Client: {ord.client?.firstName || 'Bob'} • Target SLA: {formatDate(ord.deadline)}
                      </p>

                      {isSelected && (
                        <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-800 space-y-3">
                          <div className="flex items-center justify-between text-xs font-semibold">
                            <span>Update Work Progress:</span>
                            <span className="text-indigo-600 dark:text-indigo-400 font-bold">{taskProgress}% Completed</span>
                          </div>

                          <div className="flex gap-2">
                            {[25, 50, 75, 100].map((val) => (
                              <Button
                                key={val}
                                size="sm"
                                variant={taskProgress === val ? 'default' : 'outline'}
                                onClick={(e) => {
                                  e.stopPropagation();
                                  handleUpdateProgress(val);
                                }}
                                className="flex-1 text-xs"
                              >
                                {val === 100 ? 'Proof Ready ✓' : `${val}%`}
                              </Button>
                            ))}
                          </div>
                        </div>
                      )}
                    </div>
                  );
                })}
              </CardContent>
            </Card>
          </div>

          {/* Upload Proof & Review Box */}
          <div className="space-y-6">
            <Card className="border-indigo-500/30">
              <CardHeader>
                <CardTitle className="text-base flex items-center justify-between">
                  <span>Upload Final Proof / Render</span>
                  <UploadCloud className="h-5 w-5 text-indigo-500" />
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-3 rounded-xl bg-slate-100 dark:bg-slate-800 text-xs space-y-1">
                  <div className="text-slate-500">Selected Assignment:</div>
                  <div className="font-bold text-indigo-600 dark:text-indigo-400">
                    {selectedOrder?.orderNumber || 'ORD-2024-001'} - {selectedOrder?.projectName || 'Fashion Catalog'}
                  </div>
                  <div className="text-slate-400">Client DL: {formatDate(selectedOrder?.deadline || new Date())}</div>
                </div>

                <FileUploader acceptedTypes="image/*,video/*,.zip" />

                <div>
                  <label className="text-xs font-semibold text-slate-500 uppercase block mb-1">Editor Notes for PM & Client</label>
                  <textarea
                    rows={3}
                    placeholder="e.g. Applied warm color LUT, skin retouching pass 1 complete. 145 files ready."
                    className="w-full text-xs rounded-lg border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 p-2.5"
                  />
                </div>

                <Button className="w-full bg-indigo-600 hover:bg-indigo-700 text-white font-bold gap-2">
                  <Check className="w-4 h-4" /> Submit Proof to PM Quality Check
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      )}

      {/* PORTFOLIO SHOWCASE VIEW */}
      {viewMode === 'portfolio' && (
        <div className="space-y-6">
          <div className="p-6 rounded-2xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 space-y-2">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white flex items-center gap-2">
              <Sparkles className="w-5 h-5 text-amber-400" /> My Public Portfolio & Work Showcase
            </h3>
            <p className="text-xs text-slate-500">
              Clients and Project Managers view this portfolio when deciding order assignments.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            {SAMPLE_PORTFOLIO.map((item) => (
              <Card key={item.id} className="overflow-hidden border-slate-200 dark:border-slate-800 shadow-md">
                <div className="relative h-48 bg-slate-900 flex">
                  <div className="w-1/2 relative border-r border-white/20 overflow-hidden">
                    <img src={item.beforeImg} alt="Before" className="w-full h-full object-cover opacity-80" />
                    <span className="absolute top-2 left-2 bg-black/70 text-white text-[10px] font-bold px-2 py-0.5 rounded">BEFORE</span>
                  </div>
                  <div className="w-1/2 relative overflow-hidden">
                    <img src={item.afterImg} alt="After" className="w-full h-full object-cover" />
                    <span className="absolute top-2 right-2 bg-emerald-600 text-white text-[10px] font-bold px-2 py-0.5 rounded">AFTER</span>
                  </div>
                </div>

                <CardContent className="p-5 space-y-3">
                  <div className="flex items-center justify-between">
                    <Badge variant="outline">{item.category}</Badge>
                    <span className="text-xs font-bold text-amber-500 flex items-center gap-1">
                      <Star className="w-3.5 h-3.5 fill-amber-500 text-amber-500" /> {item.rating.toFixed(1)}
                    </span>
                  </div>

                  <h4 className="font-bold text-base text-slate-900 dark:text-white">{item.title}</h4>

                  <p className="text-xs text-slate-600 dark:text-slate-300 italic bg-slate-50 dark:bg-slate-800/50 p-2.5 rounded-lg border border-slate-200 dark:border-slate-800">
                    "{item.clientComment}"
                  </p>

                  <div className="text-[11px] text-slate-400 flex items-center justify-between pt-2 border-t border-slate-100 dark:border-slate-800">
                    <span>Turnaround: {item.turnaroundTime}</span>
                    <span className="text-emerald-500 font-semibold flex items-center gap-1">
                      <CheckCircle2 className="w-3 h-3" /> Verified Client Review
                    </span>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
