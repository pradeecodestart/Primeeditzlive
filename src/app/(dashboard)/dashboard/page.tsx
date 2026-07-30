'use client';
import React, { useState } from 'react';
import { useAuth } from '@/hooks/useAuth';
import { CEODashboard } from '@/components/dashboard/CEODashboard';
import { ManagerDashboard } from '@/components/dashboard/ManagerDashboard';
import { EditorDashboard } from '@/components/dashboard/EditorDashboard';
import { ClientDashboard } from '@/components/dashboard/ClientDashboard';
import { AccountantDashboard } from '@/components/dashboard/AccountantDashboard';
import { SalesDashboard } from '@/components/dashboard/SalesDashboard';
import { Role } from '@/types/auth';

export default function DashboardPage() {
  const { role } = useAuth();
  const [overrideRole, setOverrideRole] = useState<Role | null>(null);

  const activeRole: Role = overrideRole || role || 'CEO';

  return (
    <div className="space-y-6">
      {/* Role Switcher Toolbar for live demo testing */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white text-xs border border-slate-800">
        <span className="font-semibold text-slate-300">Active View Mode: <strong className="text-indigo-400">{activeRole}</strong></span>
        <div className="flex space-x-1">
          {(['CEO', 'PROJECT_MANAGER', 'EDITOR', 'CLIENT', 'ACCOUNTANT', 'SALES'] as Role[]).map((r) => (
            <button
              key={r}
              onClick={() => setOverrideRole(r)}
              className={`px-2.5 py-1 rounded font-medium transition-colors ${
                activeRole === r ? 'bg-indigo-600 text-white font-bold' : 'text-slate-400 hover:text-white'
              }`}
            >
              {r.replace('_', ' ')}
            </button>
          ))}
        </div>
      </div>

      {activeRole === 'CEO' && <CEODashboard />}
      {activeRole === 'PROJECT_MANAGER' && <ManagerDashboard />}
      {activeRole === 'EDITOR' && <EditorDashboard />}
      {activeRole === 'CLIENT' && <ClientDashboard />}
      {activeRole === 'ACCOUNTANT' && <AccountantDashboard />}
      {activeRole === 'SALES' && <SalesDashboard />}
    </div>
  );
}
