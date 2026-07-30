'use client';
import React, { useRef, useEffect } from 'react';
import { Conversation, ChatMessage as ChatMessageType } from '@/types';
import { ChatMessage } from './ChatMessage';
import { ChatInput } from './ChatInput';
import { Avatar } from '@/components/ui/avatar';
import { Badge } from '@/components/ui/badge';
import { Phone, Video, Info } from 'lucide-react';

interface ChatWindowProps {
  conversation: Conversation;
  messages: ChatMessageType[];
  currentUserId: string;
  onSendMessage: (content: string) => void;
}

export const ChatWindow: React.FC<ChatWindowProps> = ({
  conversation,
  messages,
  currentUserId,
  onSendMessage,
}) => {
  const bottomRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  return (
    <div className="flex flex-col h-full flex-1 bg-white dark:bg-slate-900">
      {/* Header */}
      <div className="flex items-center justify-between px-6 py-3.5 border-b border-slate-200 dark:border-slate-800">
        <div className="flex items-center space-x-3">
          <Avatar fallback={conversation.name ? conversation.name.slice(0, 2) : 'CH'} />
          <div>
            <h4 className="font-bold text-sm text-slate-900 dark:text-slate-100">
              {conversation.name || 'Order Channel'}
            </h4>
            <p className="text-xs text-green-500 font-medium flex items-center">
              <span className="h-2 w-2 rounded-full bg-green-500 mr-1.5 animate-pulse" />
              Online • Realtime Sync
            </p>
          </div>
        </div>

        <div className="flex items-center space-x-2 text-slate-500">
          <Badge variant="outline">ORDER #ORD-2024-001</Badge>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><Phone className="h-4 w-4" /></button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><Video className="h-4 w-4" /></button>
          <button className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg"><Info className="h-4 w-4" /></button>
        </div>
      </div>

      {/* Messages Scroll Area */}
      <div className="flex-1 overflow-y-auto p-6 bg-slate-50/50 dark:bg-slate-950/40">
        {messages.map((m) => (
          <ChatMessage key={m.id} message={m} isMe={m.senderId === currentUserId} />
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <ChatInput onSendMessage={onSendMessage} />
    </div>
  );
};
