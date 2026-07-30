'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { OrderStatusBadge } from '@/components/orders/OrderStatusBadge';
import { OrderTimeline } from '@/components/orders/OrderTimeline';
import { OrderFilesUpload } from '@/components/orders/OrderFilesUpload';
import { Button } from '@/components/ui/button';
import { formatCurrency, formatDate } from '@/lib/utils';
import { User, Calendar, Tag, ShieldAlert, MessageSquare, Download, CheckCircle, ArrowLeft } from 'lucide-react';
import Link from 'next/link';

export default function OrderDetailPage({ params }: { params: { id: string } }) {
  const [activeTab, setActiveTab] = useState('overview');

  const order = {
    id: params.id,
    orderNumber: 'ORD-2024-001',
    projectName: 'Summer Fashion Catalog 2024',
    serviceType: 'Advanced Retouching',
    status: 'IN_PROGRESS' as const,
    priority: 'HIGH' as const,
    totalAmount: 100.0,
    paidAmount: 100.0,
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    description: 'High-end beauty retouching for 50 catalog images.',
    client: { firstName: 'Bob', lastName: 'Martinez', email: 'bob@client.com', company: 'Martinez Media' },
    assignedTo: { firstName: 'Mike', lastName: 'Chen', email: 'mike@postprodpro.com' },
    timeline: [
      { id: '1', orderId: params.id, status: 'IN_PROGRESS', description: 'Mike Chen started retouching pass 1', createdAt: new Date().toISOString(), createdBy: 'Mike Chen' },
      { id: '2', orderId: params.id, status: 'PENDING', description: 'Order created & payment verified', createdAt: new Date(Date.now() - 86400000).toISOString(), createdBy: 'Sarah Johnson' },
    ],
    files: [
      { id: 'f1', orderId: params.id, fileName: 'raw_fashion_shot_01.CR3', fileUrl: '#', fileType: 'raw', mimeType: 'image/x-canon-cr3', fileSize: 45000000, uploadedAt: new Date().toISOString() },
    ],
  };

  return (
    <div className="space-y-6">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-4">
        <div className="flex items-center space-x-4">
          <Link href="/orders">
            <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
          </Link>
          <div>
            <div className="flex items-center space-x-3">
              <span className="font-mono text-xl font-bold text-indigo-600 dark:text-indigo-400">
                {order.orderNumber}
              </span>
              <OrderStatusBadge status={order.status} />
            </div>
            <h1 className="text-xl font-semibold text-slate-900 dark:text-slate-100 mt-0.5">
              {order.projectName}
            </h1>
          </div>
        </div>

        <div className="flex space-x-2">
          <Button variant="outline" size="sm">
            <MessageSquare className="h-4 w-4 mr-2" /> Message Team
          </Button>
          <Button size="sm" className="bg-green-600 hover:bg-green-700">
            <CheckCircle className="h-4 w-4 mr-2" /> Mark Complete
          </Button>
        </div>
      </div>

      {/* Tabs Control */}
      <Tabs defaultValue="overview" onValueChange={setActiveTab}>
        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <TabsTrigger value="overview">Overview</TabsTrigger>
          <TabsTrigger value="timeline">Timeline</TabsTrigger>
          <TabsTrigger value="files">Files & Deliverables</TabsTrigger>
          <TabsTrigger value="invoice">Invoice</TabsTrigger>
        </TabsList>

        <TabsContent value="overview" className="pt-4 space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <Card className="md:col-span-2">
              <CardHeader>
                <CardTitle className="text-base">Order Information</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <span className="text-xs font-semibold text-slate-400 uppercase block mb-1">Description & Notes</span>
                  <p className="text-slate-700 dark:text-slate-300 leading-relaxed">{order.description}</p>
                </div>

                <div className="grid grid-cols-2 gap-4 border-t border-slate-100 dark:border-slate-800 pt-4">
                  <div>
                    <span className="text-xs text-slate-400 block">Service Category</span>
                    <span className="font-semibold">{order.serviceType}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Priority SLA</span>
                    <span className="font-semibold">{order.priority}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Deadline</span>
                    <span className="font-semibold">{formatDate(order.deadline)}</span>
                  </div>
                  <div>
                    <span className="text-xs text-slate-400 block">Total Amount</span>
                    <span className="font-semibold text-green-600">{formatCurrency(order.totalAmount)}</span>
                  </div>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle className="text-base">Stakeholders</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4 text-sm">
                <div>
                  <span className="text-xs text-slate-400 block">Client</span>
                  <p className="font-semibold">{order.client.firstName} {order.client.lastName}</p>
                  <p className="text-xs text-slate-500">{order.client.company}</p>
                  <p className="text-xs text-indigo-500">{order.client.email}</p>
                </div>

                <div className="border-t border-slate-100 dark:border-slate-800 pt-3">
                  <span className="text-xs text-slate-400 block">Assigned Editor</span>
                  <p className="font-semibold">{order.assignedTo.firstName} {order.assignedTo.lastName}</p>
                  <p className="text-xs text-indigo-500">{order.assignedTo.email}</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>

        <TabsContent value="timeline" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Order Progress Timeline</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderTimeline timeline={order.timeline as any} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="files" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">File Deliverables Hub</CardTitle>
            </CardHeader>
            <CardContent>
              <OrderFilesUpload files={order.files as any} />
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="invoice" className="pt-4">
          <Card>
            <CardHeader>
              <CardTitle className="text-base">Associated Invoice</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex items-center justify-between p-4 rounded-xl border border-slate-200 dark:border-slate-800">
                <div>
                  <span className="font-mono font-bold text-indigo-600">INV-2024-001</span>
                  <p className="text-xs text-slate-400">Total: {formatCurrency(order.totalAmount)} • Paid</p>
                </div>
                <Link href="/invoices/1">
                  <Button size="sm">View Full Invoice</Button>
                </Link>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
