'use client';

import React, { useState } from 'react';
import { signIn } from 'next-auth/react';
import Link from 'next/link';
import {
  Eye, EyeOff, Mail, Lock, Shield, Users, Crown,
  Briefcase, Palette, Calculator, TrendingUp, ArrowLeft, Building2, AlertTriangle
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';

const ROLES = [
  { role: 'CEO', label: 'CEO / Admin', icon: Crown, color: 'text-amber-400', email: 'john@postprodpro.com', pass: 'Admin@123', desc: 'Full system management' },
  { role: 'PROJECT_MANAGER', label: 'Project Manager', icon: Briefcase, color: 'text-indigo-400', email: 'sarah@postprodpro.com', pass: 'Admin@123', desc: 'Workload & team allocation' },
  { role: 'EDITOR', label: 'Senior Editor', icon: Palette, color: 'text-purple-400', email: 'mike@postprodpro.com', pass: 'Admin@123', desc: 'Photo & video proofing' },
  { role: 'ACCOUNTANT', label: 'Accountant', icon: Calculator, color: 'text-emerald-400', email: 'tom@postprodpro.com', pass: 'Admin@123', desc: 'Bill desk & invoicing' },
  { role: 'SALES', label: 'Sales Lead', icon: TrendingUp, color: 'text-blue-400', email: 'emma@postprodpro.com', pass: 'Admin@123', desc: 'Intake & estimations' },
];

export default function StaffLoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loginError, setLoginError] = useState('');

  const handleStaffSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setLoginError('');

    try {
      const result = await signIn('credentials', {
        email: email.toLowerCase().trim(),
        password: password,
        loginType: 'STAFF',
        redirect: false,
      });

      if (result?.error) {
        if (result.error.includes('client portal')) {
          setLoginError('This email is a Client account. Please use the Client Login portal.');
        } else {
          setLoginError('Invalid staff email or password.');
        }
        setIsLoading(false);
        return;
      }

      if (result?.ok) {
        window.location.href = '/dashboard';
      }
    } catch (err: any) {
      setLoginError('Authentication failed. Please check credentials.');
      setIsLoading(false);
    }
  };

  const handleQuickRoleLogin = async (acc: typeof ROLES[0]) => {
    setEmail(acc.email);
    setPassword(acc.pass);
    setIsLoading(true);
    const result = await signIn('credentials', {
      email: acc.email,
      password: acc.pass,
      loginType: 'STAFF',
      redirect: false,
    });
    if (result?.ok) {
      window.location.href = '/dashboard';
    } else {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex bg-slate-950 text-white">
      {/* LEFT PANEL - STAFF BRANDING */}
      <div className="hidden lg:flex lg:w-1/2 flex-col justify-between p-12 relative overflow-hidden bg-gradient-to-br from-slate-900 via-slate-900 to-slate-950 border-r border-slate-800">
        <div className="relative z-10">
          <Link href="/" className="flex items-center gap-3">
            <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
              <Building2 className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold text-white">PostProd Pro</h1>
              <div className="flex items-center gap-1.5 mt-0.5">
                <span className="h-2 w-2 rounded-full bg-amber-400 animate-pulse" />
                <span className="text-amber-400 text-xs font-bold uppercase tracking-wider">STAFF PORTAL</span>
              </div>
            </div>
          </Link>
        </div>

        {/* Roles List */}
        <div className="relative z-10 space-y-6">
          <div>
            <h2 className="text-3xl font-bold text-white mb-2">
              Staff & Team Member <span className="text-transparent bg-clip-text bg-gradient-to-r from-indigo-400 to-purple-400">Access Portal</span>
            </h2>
            <p className="text-slate-400 text-sm">
              Restricted portal for internal company employees, editors, project managers, and executives.
            </p>
          </div>

          <div className="space-y-2">
            <p className="text-xs uppercase tracking-widest text-slate-500 font-bold">1-Click Staff Login Shortcuts:</p>
            {ROLES.map((roleItem) => (
              <div
                key={roleItem.role}
                onClick={() => handleQuickRoleLogin(roleItem)}
                className="flex items-center justify-between p-3.5 rounded-xl bg-slate-900/80 border border-slate-800 hover:border-indigo-500 cursor-pointer transition-all"
              >
                <div className="flex items-center gap-3">
                  <div className="p-2 rounded-lg bg-slate-800">
                    <roleItem.icon className={`h-4 w-4 ${roleItem.color}`} />
                  </div>
                  <div>
                    <div className="text-sm font-bold text-white">{roleItem.label}</div>
                    <div className="text-xs text-slate-400">{roleItem.desc}</div>
                  </div>
                </div>
                <span className="text-xs text-indigo-400 font-mono font-bold hover:underline">Log in ➔</span>
              </div>
            ))}
          </div>
        </div>

        {/* Security Notice */}
        <div className="relative z-10 flex items-start gap-3 p-4 bg-amber-500/10 border border-amber-500/20 rounded-2xl">
          <Shield className="h-5 w-5 text-amber-400 shrink-0 mt-0.5" />
          <div>
            <p className="text-amber-400 text-xs font-bold">Restricted Staff Access</p>
            <p className="text-slate-400 text-[11px] mt-0.5">
              Authorized team members only. Accounts are created by Project Managers and CEOs.
            </p>
          </div>
        </div>
      </div>

      {/* RIGHT PANEL - LOGIN FORM */}
      <div className="w-full lg:w-1/2 flex items-center justify-center p-6">
        <div className="w-full max-w-md space-y-8">
          <Link href="/login" className="inline-flex items-center gap-2 text-xs text-slate-400 hover:text-white transition-colors">
            <ArrowLeft className="h-4 w-4" /> Go to Client Portal Login
          </Link>

          <div>
            <div className="flex items-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-2xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-lg">
                <Users className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-2xl font-bold text-white">Staff Sign In</h2>
                <p className="text-xs text-slate-400">Post-Production Operations System</p>
              </div>
            </div>
          </div>

          {loginError && (
            <div className="flex items-center gap-2 p-3 bg-red-950/60 border border-red-800 text-xs text-red-300 rounded-xl">
              <AlertTriangle className="h-4 w-4 shrink-0 text-red-400" />
              {loginError}
            </div>
          )}

          <form onSubmit={handleStaffSubmit} className="space-y-4">
            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Staff Work Email</label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type="email"
                  required
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  placeholder="john@postprodpro.com"
                  className="pl-9 bg-slate-900 border-slate-800 text-white h-11"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-semibold uppercase text-slate-400 mb-1">Staff Password</label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-4 w-4 text-slate-500" />
                <Input
                  type={showPassword ? 'text' : 'password'}
                  required
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  placeholder="••••••••"
                  className="pl-9 pr-9 bg-slate-900 border-slate-800 text-white h-11"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-slate-400 hover:text-white"
                >
                  {showPassword ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
                </button>
              </div>
            </div>

            <Button
              type="submit"
              disabled={isLoading}
              className="w-full h-11 bg-gradient-to-r from-indigo-600 to-purple-600 hover:from-indigo-700 hover:to-purple-700 text-white font-bold shadow-lg"
            >
              {isLoading ? 'Authenticating...' : 'Sign In to Staff Portal'}
            </Button>
          </form>

          <div className="p-4 rounded-xl bg-slate-900 border border-slate-800 text-xs text-slate-400 space-y-1">
            <p className="font-semibold text-slate-300">Quick Test Staff Accounts (Pass: Admin@123):</p>
            <div className="grid grid-cols-2 gap-1 font-mono text-[11px] pt-1">
              <span>CEO: john@postprodpro.com</span>
              <span>PM: sarah@postprodpro.com</span>
              <span>Editor: mike@postprodpro.com</span>
              <span>Sales: emma@postprodpro.com</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
