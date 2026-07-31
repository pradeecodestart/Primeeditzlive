'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { registerSchema } from '@/lib/validations';
import { z } from 'zod';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { Sparkles } from 'lucide-react';
import { signIn } from 'next-auth/react';
import axios from 'axios';

type RegisterFormData = z.infer<typeof registerSchema>;

export default function RegisterPage() {
  const router = useRouter();
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      setErrorMessage(null);
      await axios.post('/api/auth/register', data);

      // Instant Auto-Login on Successful Registration
      const res = await signIn('credentials', {
        email: data.email,
        password: data.password,
        loginType: 'CLIENT',
        redirect: false,
      });

      if (res?.ok) {
        window.location.href = '/dashboard';
      } else {
        window.location.href = '/login';
      }
    } catch (err: any) {
      setErrorMessage(err.response?.data?.message || 'Account created! Redirecting to login...');
      setTimeout(() => { window.location.href = '/login'; }, 1200);
    }
  };

  return (
    <div className="min-h-screen bg-slate-950 flex items-center justify-center p-4">
      <div className="w-full max-w-lg p-8 rounded-3xl bg-slate-900 border border-slate-800 shadow-2xl space-y-6 text-white">
        <div className="text-center space-y-2">
          <Link href="/" className="inline-flex items-center space-x-2">
            <div className="h-10 w-10 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center text-white font-bold shadow-md">
              <Sparkles className="h-5 w-5 text-white" />
            </div>
            <span className="text-2xl font-bold bg-gradient-to-r from-indigo-400 to-purple-400 bg-clip-text text-transparent">
              PostProd Pro
            </span>
          </Link>
          <h2 className="text-xl font-bold text-white pt-2">Create Client Portal Account</h2>
          <p className="text-xs text-slate-400">Join 500+ studio directors and creative managers</p>
        </div>

        {errorMessage && (
          <div className="p-3 rounded-xl bg-indigo-950/60 border border-indigo-800 text-xs text-indigo-300">
            {errorMessage}
          </div>
        )}

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">First Name</label>
              <Input {...register('firstName')} placeholder="John" className="bg-slate-800 border-slate-700 text-white" />
              {errors.firstName && <p className="text-xs text-red-400 mt-1">{errors.firstName.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Last Name</label>
              <Input {...register('lastName')} placeholder="Smith" className="bg-slate-800 border-slate-700 text-white" />
              {errors.lastName && <p className="text-xs text-red-400 mt-1">{errors.lastName.message}</p>}
            </div>
          </div>

          <div>
            <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Email Address</label>
            <Input {...register('email')} type="email" placeholder="rightcapture@gmail.com" className="bg-slate-800 border-slate-700 text-white" />
            {errors.email && <p className="text-xs text-red-400 mt-1">{errors.email.message}</p>}
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Phone (Optional)</label>
              <Input {...register('phone')} placeholder="+1 (555) 000-0000" className="bg-slate-800 border-slate-700 text-white" />
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Company (Optional)</label>
              <Input {...register('company')} placeholder="Apex Media Studio" className="bg-slate-800 border-slate-700 text-white" />
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Password</label>
              <Input {...register('password')} type="password" placeholder="••••••••" className="bg-slate-800 border-slate-700 text-white" />
              {errors.password && <p className="text-xs text-red-400 mt-1">{errors.password.message}</p>}
            </div>
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Confirm Password</label>
              <Input {...register('confirmPassword')} type="password" placeholder="••••••••" className="bg-slate-800 border-slate-700 text-white" />
              {errors.confirmPassword && <p className="text-xs text-red-400 mt-1">{errors.confirmPassword.message}</p>}
            </div>
          </div>

          <div className="flex items-center space-x-2 pt-2">
            <Checkbox {...register('terms')} />
            <span className="text-xs text-slate-400">
              I agree to the Terms of Service & Privacy Policy
            </span>
          </div>
          {errors.terms && <p className="text-xs text-red-400">{errors.terms.message}</p>}

          <Button
            type="submit"
            disabled={isSubmitting}
            className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg"
          >
            {isSubmitting ? 'Creating Account & Logging In...' : 'Register Free Client Account'}
          </Button>
        </form>

        <p className="text-center text-xs text-slate-400">
          Already have an account?{' '}
          <Link href="/login" className="text-indigo-400 font-semibold hover:underline">
            Sign in
          </Link>
        </p>
      </div>
    </div>
  );
}
