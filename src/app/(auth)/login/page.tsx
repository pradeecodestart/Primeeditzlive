'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import {
  Eye, EyeOff, Mail, Lock, Shield, Camera, ArrowRight, Chrome
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Checkbox } from '@/components/ui/checkbox';

const loginSchema = z.object({
  email: z.string().min(1, 'Email is required').email('Please enter a valid email'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

type LoginFormData = z.infer<typeof loginSchema>;

const CLIENT_DEMO_ACCOUNTS = [
  { role: 'Client', name: 'Bob Martinez', email: 'bob@client.com', pass: 'Client@123' },
  { role: 'Client', name: 'Alice Cooper', email: 'alice@client.com', pass: 'Client@123' },
];

export default function ClientLoginPage() {
  const [showPassword, setShowPassword] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    setValue,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      setErrorMessage(null);
      const res = await signIn('credentials', {
        email: data.email.toLowerCase().trim(),
        password: data.password,
        loginType: 'CLIENT',
        redirect: false,
      });

      if (res?.error) {
        if (res.error.includes('staff/login')) {
          setErrorMessage('Staff members must log in at the Staff Portal (/staff/login).');
        } else {
          setErrorMessage(res.error || 'Invalid client email or password.');
        }
        return;
      }

      if (res?.ok) {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setErrorMessage(err.message || 'Login failed. Please try again.');
    }
  };

  const handleQuickClientLogin = async (email: string, pass: string) => {
    setValue('email', email);
    setValue('password', pass);
    const res = await signIn('credentials', {
      email: email.toLowerCase().trim(),
      password: pass,
      loginType: 'CLIENT',
      redirect: false,
    });
    if (res?.ok) {
      window.location.href = '/dashboard';
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 text-white flex items-center justify-center p-4">
      <div className="w-full max-w-md p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6">
        {/* Brand Header */}
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
              <Camera className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              PostProd Pro
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white pt-2">Client Portal Sign In</h2>
          <p className="text-xs text-slate-400">Manage photo & video orders, view proofs and pay invoices</p>
        </div>

        {/* Staff Portal Redirect Banner */}
        <div className="flex items-center gap-3 p-3.5 rounded-2xl bg-amber-500/10 border border-amber-500/20 text-xs">
          <Shield className="h-4 w-4 text-amber-400 shrink-0" />
          <div>
            <span className="text-amber-300 font-bold block">Are you a team employee?</span>
            <Link href="/staff/login" className="text-amber-400 hover:underline font-semibold flex items-center gap-1 mt-0.5">
              Go to Staff Login Portal <ArrowRight className="h-3 w-3" />
            </Link>
          </div>
        </div>

        {/* Google OAuth Login */}
        <Button
          onClick={() => signIn('google', { callbackUrl: '/dashboard' })}
          variant="outline"
          className="w-full h-11 border border-slate-700 bg-slate-800 hover:bg-slate-700 text-white gap-2 text-xs font-semibold"
        >
          <Chrome className="h-4 w-4 text-indigo-400" /> Continue with Google
        </Button>

        <div className="flex items-center gap-3">
          <div className="flex-1 h-[1px] bg-slate-800" />
          <span className="text-slate-500 text-[11px] uppercase font-bold">Or Sign In With Email</span>
          <div className="flex-1 h-[1px] bg-slate-800" />
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-red-950/60 border border-red-800 text-xs text-red-300">
            {errorMessage}
          </div>
        )}

        {/* Form */}
        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Client Email Address</label>
            <div className="relative">
              <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                {...register('email')}
                type="email"
                placeholder="bob@client.com"
                className="pl-9 bg-slate-800 border-slate-700 text-white h-11"
              />
            </div>
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Password</label>
            <div className="relative">
              <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
              <Input
                {...register('password')}
                type={showPassword ? 'text' : 'password'}
                placeholder="••••••••"
                className="pl-9 pr-9 bg-slate-800 border-slate-700 text-white h-11"
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
                className="absolute right-3 top-3 text-slate-400 hover:text-white"
              >
                {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </button>
            </div>
            {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
          </div>

          <div className="flex items-center justify-between text-xs pt-1">
            <label className="flex items-center space-x-2 text-slate-400 cursor-pointer">
              <Checkbox {...register('rememberMe')} />
              <span>Remember me</span>
            </label>
            <Link href="/forgot-password" className="text-indigo-400 hover:underline">
              Forgot password?
            </Link>
          </div>

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg"
          >
            {isSubmitting ? 'Authenticating...' : 'Sign In to Client Portal'}
          </Button>
        </form>

        {/* 1-Click Client Accounts */}
        <div className="border-t border-slate-800 pt-4 text-xs space-y-1.5 text-slate-400">
          <p className="font-semibold text-slate-300">Quick Client Login (Password: Client@123):</p>
          <div className="grid grid-cols-2 gap-2 text-xs">
            {CLIENT_DEMO_ACCOUNTS.map((acc) => (
              <button
                key={acc.email}
                type="button"
                onClick={() => handleQuickClientLogin(acc.email, acc.pass)}
                className="p-2 rounded-xl bg-slate-800 border border-slate-700 hover:border-indigo-500 text-left"
              >
                <span className="font-bold text-indigo-300 block">{acc.name}</span>
                <span className="text-[10px] text-slate-400">{acc.email}</span>
              </button>
            ))}
          </div>
        </div>

        <p className="text-center text-xs text-slate-400">
          Don&apos;t have an account?{' '}
          <Link href="/register" className="text-indigo-400 font-semibold hover:underline">
            Create free account
          </Link>
        </p>
      </div>
    </div>
  );
}
