'use client';
import React, { useState } from 'react';
import { Search, Bell, User, LogOut, Settings, HelpCircle } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from '@/components/shared/ThemeToggle';
import { Avatar } from '@/components/ui/avatar';
import { RoleBadge } from '@/components/shared/RoleBadge';
import { useAuth } from '@/hooks/useAuth';
import Link from 'next/link';

export const Header: React.FC = () => {
  const { user, role, logout } = useAuth();
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const [notificationsOpen, setNotificationsOpen] = useState(false);

  return (
    <header className="sticky top-0 z-40 flex h-16 w-full items-center justify-between border-b border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 px-6">
      {/* Search Bar */}
      <div className="relative w-64 md:w-96">
        <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
        <Input
          placeholder="Search orders, clients, invoices..."
          className="pl-9 bg-slate-50 dark:bg-slate-800 border-none"
        />
      </div>

      {/* Right Controls */}
      <div className="flex items-center space-x-4">
        <ThemeToggle />

        {/* Notifications Bell */}
        <div className="relative">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setNotificationsOpen(!notificationsOpen)}
            className="relative"
          >
            <Bell className="h-5 w-5 text-slate-600 dark:text-slate-300" />
            <span className="absolute top-1 right-1 flex h-2 w-2 rounded-full bg-red-500 animate-pulse" />
          </Button>

          {notificationsOpen && (
            <div className="absolute right-0 mt-2 w-80 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 p-4 shadow-xl z-50">
              <h4 className="font-semibold text-sm mb-2 text-slate-900 dark:text-slate-100">Notifications</h4>
              <div className="space-y-2 text-xs">
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <p className="font-medium text-slate-800 dark:text-slate-200">New Order #ORD-2024-005 created</p>
                  <span className="text-slate-400">10 mins ago</span>
                </div>
                <div className="p-2 rounded bg-slate-50 dark:bg-slate-800">
                  <p className="font-medium text-slate-800 dark:text-slate-200">Invoice #INV-2024-001 paid</p>
                  <span className="text-slate-400">1 hour ago</span>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* User Avatar + Dropdown */}
        <div className="relative">
          <button
            onClick={() => setDropdownOpen(!dropdownOpen)}
            className="flex items-center space-x-3 focus:outline-none"
          >
            <Avatar
              fallback={user?.name ? user.name.slice(0, 2).toUpperCase() : 'PP'}
              src={(user as any)?.avatar}
            />
            <div className="hidden md:block text-left">
              <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 leading-none">
                {user?.name || 'User Name'}
              </p>
              <div className="mt-1">
                <RoleBadge role={role || 'CLIENT'} />
              </div>
            </div>
          </button>

          {dropdownOpen && (
            <div className="absolute right-0 mt-2 w-56 rounded-xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 py-2 shadow-xl z-50">
              <div className="px-4 py-2 border-b border-slate-100 dark:border-slate-800">
                <p className="text-sm font-semibold text-slate-900 dark:text-slate-100">{user?.name}</p>
                <p className="text-xs text-slate-400 truncate">{user?.email}</p>
              </div>
              <Link href="/profile" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                <User className="h-4 w-4 mr-2" /> Profile
              </Link>
              <Link href="/settings" onClick={() => setDropdownOpen(false)} className="flex items-center px-4 py-2 text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800">
                <Settings className="h-4 w-4 mr-2" /> Settings
              </Link>
              <div className="border-t border-slate-100 dark:border-slate-800 mt-1">
                <button
                  onClick={logout}
                  className="w-full flex items-center px-4 py-2 text-sm text-red-600 hover:bg-red-50 dark:hover:bg-red-950/30"
                >
                  <LogOut className="h-4 w-4 mr-2" /> Sign Out
                </button>
              </div>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};
