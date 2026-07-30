import React from 'react';
import { ChatMessage as ChatMessageType } from '@/types';
import { Avatar } from '@/components/ui/avatar';
import { formatDateTime } from '@/lib/utils';
import { CheckCheck } from 'lucide-react';

interface ChatMessageProps {
  message: ChatMessageType;
  isMe: boolean;
}

export const ChatMessage: React.FC<ChatMessageProps> = ({ message, isMe }) => {
  return (
    <div className={`flex items-end space-x-2 mb-4 ${isMe ? 'justify-end' : 'justify-start'}`}>
      {!isMe && (
        <Avatar
          fallback={message.sender?.firstName?.slice(0, 2) || 'U'}
          src={message.sender?.avatar}
          className="h-8 w-8 text-xs shrink-0"
        />
      )}

      <div className={`max-w-xs md:max-w-md px-4 py-2.5 rounded-2xl ${
        isMe
          ? 'bg-indigo-600 text-white rounded-br-none shadow-md'
          : 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-slate-100 rounded-bl-none border border-slate-200 dark:border-slate-700'
      }`}>
        {!isMe && (
          <p className="text-[11px] font-bold text-indigo-400 mb-0.5">
            {message.sender?.firstName} {message.sender?.lastName}
          </p>
        )}
        <p className="text-sm leading-relaxed whitespace-pre-wrap">{message.content}</p>

        <div className={`flex items-center justify-end space-x-1 mt-1 text-[10px] ${
          isMe ? 'text-indigo-200' : 'text-slate-400'
        }`}>
          <span>{formatDateTime(message.createdAt)}</span>
          {isMe && <CheckCheck className="h-3 w-3 text-indigo-200" />}
        </div>
      </div>
    </div>
  );
};
