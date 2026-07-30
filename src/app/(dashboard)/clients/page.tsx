'use client';
import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Mail, Phone, Building, Plus } from 'lucide-react';
import Link from 'next/link';

const clients = [
  { id: '1', name: 'Bob Martinez', company: 'Martinez Media', email: 'bob@client.com', phone: '+1 (555) 019-9901', orders: 4, spent: '$1,200.00' },
  { id: '2', name: 'Alice Cooper', company: 'Cooper Creations', email: 'alice@client.com', phone: '+1 (555) 019-9902', orders: 2, spent: '$650.00' },
  { id: '3', name: 'Elena Rostova', company: 'Vogue Motion Lab', email: 'elena@vogue.com', phone: '+1 (555) 019-9903', orders: 8, spent: '$4,500.00' },
];

export default function ClientsPage() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
            Client Directory
          </h1>
          <p className="text-sm text-slate-500">
            Manage client accounts, order history, and contact information.
          </p>
        </div>
        <Button className="bg-indigo-600 hover:bg-indigo-700">
          <Plus className="h-4 w-4 mr-2" /> Add Client
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {clients.map((c) => (
          <Card key={c.id} className="hover:border-indigo-500 transition-all">
            <CardHeader className="flex flex-row items-center space-x-4 pb-2">
              <Avatar fallback={c.name.slice(0, 2)} className="h-12 w-12" />
              <div>
                <CardTitle className="text-base">{c.name}</CardTitle>
                <p className="text-xs text-slate-500">{c.company}</p>
              </div>
            </CardHeader>
            <CardContent className="space-y-3 text-xs text-slate-600 dark:text-slate-400">
              <div className="flex items-center space-x-2">
                <Mail className="h-3.5 w-3.5 text-slate-400" />
                <span>{c.email}</span>
              </div>
              <div className="flex items-center space-x-2">
                <Phone className="h-3.5 w-3.5 text-slate-400" />
                <span>{c.phone}</span>
              </div>
              <div className="border-t border-slate-100 dark:border-slate-800 pt-3 flex justify-between font-semibold text-slate-900 dark:text-slate-100">
                <span>{c.orders} Orders</span>
                <span className="text-green-600">{c.spent}</span>
              </div>
              <Link href={`/clients/${c.id}`} className="block text-center text-indigo-600 hover:underline pt-1 text-xs">
                View Client Profile →
              </Link>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
}
