'use client';
import React from 'react';
import { Conversation } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { Input } from '@/components/ui/input';
import { Search, Plus } from 'lucide-react';

interface ChatListProps {
  conversations: Conversation[];
  activeId?: string;
  onSelect: (conv: Conversation) => void;
}

export const ChatList: React.FC<ChatListProps> = ({ conversations, activeId, onSelect }) => {
  return (
    <div className="flex flex-col h-full border-r border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 w-80 shrink-0">
      <div className="p-4 border-b border-slate-200 dark:border-slate-800 space-y-3">
        <div className="flex items-center justify-between">
          <h3 className="font-bold text-lg text-slate-900 dark:text-slate-100">Messages</h3>
          <button className="h-8 w-8 rounded-lg bg-indigo-50 dark:bg-indigo-950 text-indigo-600 dark:text-indigo-400 flex items-center justify-center">
            <Plus className="h-4 w-4" />
          </button>
        </div>
        <div className="relative">
          <Search className="absolute left-3 top-2.5 h-4 w-4 text-slate-400" />
          <Input placeholder="Search chat..." className="pl-9 bg-slate-100 dark:bg-slate-800 border-none text-xs" />
        </div>
      </div>

      <div className="flex-1 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-800">
        {conversations.map((c) => {
          const isActive = c.id === activeId;
          return (
            <div
              key={c.id}
              onClick={() => onSelect(c)}
              className={`p-4 flex items-center space-x-3 cursor-pointer transition-colors ${
                isActive ? 'bg-indigo-50/80 dark:bg-indigo-950/40' : 'hover:bg-slate-50 dark:hover:bg-slate-800/50'
              }`}
            >
              <Avatar fallback={c.name ? c.name.slice(0, 2) : 'GR'} />
              <div className="flex-1 min-w-0">
                <div className="flex items-center justify-between">
                  <p className="text-sm font-semibold text-slate-900 dark:text-slate-100 truncate">{c.name || 'Group Chat'}</p>
                </div>
                <p className="text-xs text-slate-400 truncate mt-0.5">Click to open conversation</p>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
};
