'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles } from 'lucide-react';

export default function ResetPasswordPage() {
  const router = useRouter();
  const [success, setSuccess] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-center">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="h-10 w-10 rounded-xl bg-indigo-600 flex items-center justify-center text-white">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold text-white">PostProd Pro</span>
        </Link>

        <h2 className="text-xl font-bold text-white">Set New Password</h2>

        {success ? (
          <div className="p-4 rounded-xl bg-green-950/60 border border-green-800 text-xs text-green-300">
            Password reset successful! Redirecting to login...
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSuccess(true);
              setTimeout(() => router.push('/login'), 1500);
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">New Password</label>
              <Input type="password" placeholder="••••••••" className="bg-slate-800 border-slate-700 text-white" required />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Confirm New Password</label>
              <Input type="password" placeholder="••••••••" className="bg-slate-800 border-slate-700 text-white" required />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              Update Password
            </Button>
          </form>
        )}
      </div>
    </div>
  );
}
