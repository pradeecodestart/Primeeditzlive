'use client';
import React, { useState } from 'react';
import { Card, CardHeader, CardTitle, CardContent, CardFooter } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Avatar } from '@/components/ui/avatar';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { useAuth } from '@/hooks/useAuth';
import { Save } from 'lucide-react';

export default function ProfilePage() {
  const { user, role } = useAuth();
  const [saved, setSaved] = useState(false);

  return (
    <div className="max-w-2xl mx-auto space-y-6">
      <div className="border-b border-slate-200 dark:border-slate-800 pb-5">
        <h1 className="text-2xl font-bold text-slate-900 dark:text-slate-100">
          My Account Profile
        </h1>
        <p className="text-sm text-slate-500">
          Update personal information, contact details, and credentials.
        </p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center space-x-4">
          <Avatar fallback={user?.name ? user.name.slice(0, 2) : 'PP'} className="h-16 w-16" />
          <div>
            <CardTitle className="text-lg">{user?.name || 'User Profile'}</CardTitle>
            <RoleBadge role={role || 'CLIENT'} />
          </div>
        </CardHeader>

        <CardContent className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address</label>
            <Input defaultValue={user?.email || 'john@postprodpro.com'} readOnly className="bg-slate-100 dark:bg-slate-800" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Phone Number</label>
            <Input defaultValue="+1 (555) 019-2831" />
          </div>
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Company / Studio</label>
            <Input defaultValue="PostProd Pro Studio" />
          </div>
        </CardContent>

        <CardFooter className="flex justify-end">
          <Button onClick={() => { setSaved(true); setTimeout(() => setSaved(false), 2000); }} className="bg-indigo-600 hover:bg-indigo-700">
            <Save className="h-4 w-4 mr-2" /> {saved ? 'Saved!' : 'Save Profile'}
          </Button>
        </CardFooter>
      </Card>
    </div>
  );
}
