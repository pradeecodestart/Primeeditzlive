'use client';
import React, { useState } from 'react';
import Link from 'next/link';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Sparkles, Mail } from 'lucide-react';

export default function ForgotPasswordPage() {
  const [submitted, setSubmitted] = useState(false);

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-2xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-center">
        <Link href="/" className="inline-flex items-center space-x-2">
          <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold">
            <Sparkles className="h-5 w-5" />
          </div>
          <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
            PostProd Pro
          </span>
        </Link>

        <h2 className="text-xl font-bold text-white">Reset Password</h2>
        <p className="text-xs text-slate-400">
          Enter your registered email address to receive password reset instructions.
        </p>

        {submitted ? (
          <div className="p-4 rounded-xl bg-green-950/60 border border-green-800 text-xs text-green-300">
            Password reset link sent! Check your inbox.
          </div>
        ) : (
          <form
            onSubmit={(e) => {
              e.preventDefault();
              setSubmitted(true);
            }}
            className="space-y-4 text-left"
          >
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email</label>
              <Input type="email" placeholder="john@example.com" className="bg-slate-800 border-slate-700 text-white" required />
            </div>
            <Button type="submit" className="w-full bg-indigo-600 hover:bg-indigo-700">
              Send Reset Link
            </Button>
          </form>
        )}

        <Link href="/login" className="block text-xs text-indigo-400 hover:underline pt-2">
          ← Back to Sign In
        </Link>
      </div>
    </div>
  );
}
