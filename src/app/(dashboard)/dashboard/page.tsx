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

  const userRole: Role = role || 'CLIENT';
  const isClient = userRole === 'CLIENT' && !overrideRole;

  if (isClient) {
    return <ClientDashboard />;
  }

  const activeRole: Role = overrideRole || userRole;

  return (
    <div className="space-y-6">
      {/* Role Switcher Toolbar for internal staff and management testing */}
      <div className="flex items-center justify-between p-3 rounded-xl bg-slate-900 text-white text-xs border border-slate-800">
        <span className="font-semibold text-slate-300">
          Active View Mode: <strong className="text-indigo-400">{activeRole}</strong>
        </span>
        <div className="flex space-x-1">
          {(['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'STAFF', 'CEO', 'PROJECT_MANAGER', 'EDITOR', 'ACCOUNTANT', 'SALES'] as Role[]).map((r) => (
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

      {(activeRole === 'CEO' || activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN') && <CEODashboard />}
      {(activeRole === 'PROJECT_MANAGER' || activeRole === 'MANAGER') && <ManagerDashboard />}
      {(activeRole === 'EDITOR' || activeRole === 'STAFF') && <EditorDashboard />}
      {activeRole === 'CLIENT' && <ClientDashboard />}
      {activeRole === 'ACCOUNTANT' && <AccountantDashboard />}
      {activeRole === 'SALES' && <SalesDashboard />}
    </div>
  );
}
