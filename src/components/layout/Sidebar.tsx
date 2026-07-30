'use client';
import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  ShoppingBag,
  FileText,
  Users,
  UserCheck,
  MessageSquare,
  BarChart3,
  Settings,
  Sparkles,
  ChevronLeft,
  ChevronRight,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { useAuth } from '@/hooks/useAuth';
import { Role } from '@/types/auth';

interface NavItem {
  label: string;
  href: string;
  icon: React.ComponentType<{ className?: string }>;
  roles: Role[];
}

const navItems: NavItem[] = [
  { label: 'Dashboard', href: '/dashboard', icon: LayoutDashboard, roles: ['CEO', 'PROJECT_MANAGER', 'EDITOR', 'CLIENT', 'ACCOUNTANT', 'SALES'] },
  { label: 'Orders', href: '/orders', icon: ShoppingBag, roles: ['CEO', 'PROJECT_MANAGER', 'EDITOR', 'CLIENT', 'SALES'] },
  { label: 'Invoices', href: '/invoices', icon: FileText, roles: ['CEO', 'CLIENT', 'ACCOUNTANT'] },
  { label: 'Clients', href: '/clients', icon: Users, roles: ['CEO', 'PROJECT_MANAGER', 'SALES'] },
  { label: 'Team', href: '/team', icon: UserCheck, roles: ['CEO', 'PROJECT_MANAGER'] },
  { label: 'Chat', href: '/chat', icon: MessageSquare, roles: ['CEO', 'PROJECT_MANAGER', 'EDITOR', 'CLIENT', 'SALES'] },
  { label: 'Analytics', href: '/analytics', icon: BarChart3, roles: ['CEO', 'ACCOUNTANT'] },
  { label: 'Settings', href: '/settings', icon: Settings, roles: ['CEO'] },
];

export const Sidebar: React.FC = () => {
  const pathname = usePathname();
  const { role } = useAuth();
  const [collapsed, setCollapsed] = React.useState(false);

  const userRole = role || 'CLIENT';
  const filteredNavItems = navItems.filter((item) => item.roles.includes(userRole));

  return (
    <aside
      className={cn(
        'relative flex flex-col border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 transition-all duration-300 z-30',
        collapsed ? 'w-20' : 'w-64'
      )}
    >
      {/* Brand Header */}
      <div className="flex h-16 items-center justify-between px-4 border-b border-slate-200 dark:border-slate-800">
        <Link href="/dashboard" className="flex items-center space-x-3">
          <div className="h-9 w-9 rounded-xl bg-gradient-to-tr from-indigo-600 to-purple-600 flex items-center justify-center shadow-md shrink-0">
            <Sparkles className="h-5 w-5 text-white" />
          </div>
          {!collapsed && (
            <span className="font-bold text-lg bg-gradient-to-r from-indigo-600 to-purple-600 bg-clip-text text-transparent">
              PostProd Pro
            </span>
          )}
        </Link>
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="rounded-lg p-1 text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800"
        >
          {collapsed ? <ChevronRight className="h-5 w-5" /> : <ChevronLeft className="h-5 w-5" />}
        </button>
      </div>

      {/* Navigation */}
      <nav className="flex-1 space-y-1 px-3 py-4">
        {filteredNavItems.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/');
          const Icon = item.icon;
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center space-x-3 rounded-xl px-3 py-2.5 text-sm font-medium transition-colors',
                isActive
                  ? 'bg-indigo-50 text-indigo-600 dark:bg-indigo-950/50 dark:text-indigo-400 font-semibold'
                  : 'text-slate-600 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800 hover:text-slate-900 dark:hover:text-slate-100'
              )}
              title={collapsed ? item.label : undefined}
            >
              <Icon className={cn('h-5 w-5 shrink-0', isActive ? 'text-indigo-600 dark:text-indigo-400' : '')} />
              {!collapsed && <span>{item.label}</span>}
            </Link>
          );
        })}
      </nav>

      {/* Sidebar Footer Info */}
      {!collapsed && (
        <div className="p-4 border-t border-slate-200 dark:border-slate-800 text-xs text-slate-400">
          <p className="font-semibold text-slate-600 dark:text-slate-300">PostProd Pro v1.0</p>
          <p>Production Management</p>
        </div>
      )}
    </aside>
  );
};
