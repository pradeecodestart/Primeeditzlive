'use client';

import React from 'react';
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
  const activeRole: Role = role || 'CLIENT';

  return (
    <div className="space-y-6">
      {(activeRole === 'CEO' || activeRole === 'SUPER_ADMIN' || activeRole === 'ADMIN') && <CEODashboard />}
      {(activeRole === 'PROJECT_MANAGER' || activeRole === 'MANAGER') && <ManagerDashboard />}
      {(activeRole === 'EDITOR' || activeRole === 'STAFF') && <EditorDashboard />}
      {activeRole === 'CLIENT' && <ClientDashboard />}
      {activeRole === 'ACCOUNTANT' && <AccountantDashboard />}
      {activeRole === 'SALES' && <SalesDashboard />}
    </div>
  );
}
