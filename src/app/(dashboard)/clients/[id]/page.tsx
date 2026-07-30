import React from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Avatar } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Mail, Phone, Building } from 'lucide-react';
import Link from 'next/link';

export default function ClientDetailPage({ params }: { params: { id: string } }) {
  return (
    <div className="space-y-6 max-w-4xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link href="/clients">
          <Button variant="ghost" size="icon"><ArrowLeft className="h-5 w-5" /></Button>
        </Link>
        <h1 className="text-xl font-bold">Client Account Overview</h1>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar fallback="BM" className="h-16 w-16" />
          <div>
            <CardTitle className="text-xl">Bob Martinez</CardTitle>
            <p className="text-sm text-slate-500">Martinez Media • Active Client</p>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-2 gap-4 text-sm">
            <div>
              <span className="text-xs text-slate-400 block">Email Address</span>
              <span className="font-semibold">bob@client.com</span>
            </div>
            <div>
              <span className="text-xs text-slate-400 block">Phone</span>
              <span className="font-semibold">+1 (555) 019-9901</span>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
