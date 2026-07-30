'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Save, Plus } from 'lucide-react';

export default function SettingsPage() {
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <div className="space-y-6 max-w-5xl mx-auto">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            System Settings
          </h1>
          <p className="text-sm text-slate-500">
            Manage company branding, service catalog base prices, notifications, and user access.
          </p>
        </div>
        <Button onClick={handleSave} className="bg-indigo-600 hover:bg-indigo-700">
          <Save className="h-4 w-4 mr-2" /> {saved ? 'Saved!' : 'Save Changes'}
        </Button>
      </div>

      <Tabs defaultValue="general">
        <TabsList className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800">
          <TabsTrigger value="general">General</TabsTrigger>
          <TabsTrigger value="services">Service Catalog</TabsTrigger>
          <TabsTrigger value="notifications">Notifications</TabsTrigger>
          <TabsTrigger value="billing">Billing & Payments</TabsTrigger>
        </TabsList>

        <TabsContent value="general" className="pt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Company Info</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Company Name</label>
                <Input defaultValue="PostProd Pro Studio Inc." />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Business Address</label>
                <Input defaultValue="123 Studio Street, Suite 400, New York, NY" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Support Email</label>
                <Input defaultValue="hello@postprodpro.com" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="services" className="pt-4">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <CardTitle className="text-base">Services & Base Pricing</CardTitle>
              <Button size="sm" variant="outline"><Plus className="h-4 w-4 mr-1" /> Add Service</Button>
            </CardHeader>
            <CardContent className="space-y-3">
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-sm">Basic Photo Editing</p>
                  <p className="text-xs text-slate-400">Color correction, exposure adjustment</p>
                </div>
                <Input defaultValue="$0.50" className="w-24 text-right" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-sm">Advanced Retouching</p>
                  <p className="text-xs text-slate-400">Skin smoothing, stray hair removal</p>
                </div>
                <Input defaultValue="$2.00" className="w-24 text-right" />
              </div>
              <div className="flex items-center justify-between p-3 rounded-lg border border-slate-200 dark:border-slate-800">
                <div>
                  <p className="font-semibold text-sm">Video Editing (Basic)</p>
                  <p className="text-xs text-slate-400">Timeline cut, transition effects</p>
                </div>
                <Input defaultValue="$50.00" className="w-24 text-right" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="notifications" className="pt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Event Notification Controls</CardTitle></CardHeader>
            <CardContent className="space-y-3 text-sm">
              <label className="flex items-center space-x-2">
                <Checkbox defaultChecked /> <span>Email me when a new order is submitted</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox defaultChecked /> <span>Notify when order status changes to COMPLETED</span>
              </label>
              <label className="flex items-center space-x-2">
                <Checkbox defaultChecked /> <span>Send email receipt when invoice is marked as PAID</span>
              </label>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="billing" className="pt-4">
          <Card>
            <CardHeader><CardTitle className="text-base">Bank & Payment Gateways</CardTitle></CardHeader>
            <CardContent className="space-y-4 max-w-lg">
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Tax Rate (%)</label>
                <Input defaultValue="10.0" />
              </div>
              <div>
                <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Invoice Prefix</label>
                <Input defaultValue="INV-2024-" />
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
