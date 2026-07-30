'use client';
import React, { useState } from 'react';
import { Send, Paperclip, Smile } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface ChatInputProps {
  onSendMessage: (content: string, attachments?: string[]) => void;
}

export const ChatInput: React.FC<ChatInputProps> = ({ onSendMessage }) => {
  const [content, setContent] = useState('');

  const handleSend = (e: React.FormEvent) => {
    e.preventDefault();
    if (!content.trim()) return;
    onSendMessage(content.trim());
    setContent('');
  };

  return (
    <form onSubmit={handleSend} className="flex items-center space-x-2 p-3 border-t border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900">
      <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600">
        <Paperclip className="h-5 w-5" />
      </Button>

      <input
        type="text"
        value={content}
        onChange={(e) => setContent(e.target.value)}
        placeholder="Type your message..."
        className="flex-1 bg-slate-100 dark:bg-slate-800 border-none rounded-xl px-4 py-2.5 text-sm text-slate-900 dark:text-slate-100 focus:outline-none focus:ring-2 focus:ring-indigo-500"
      />

      <Button type="button" variant="ghost" size="icon" className="text-slate-400 hover:text-indigo-600">
        <Smile className="h-5 w-5" />
      </Button>

      <Button type="submit" className="bg-indigo-600 hover:bg-indigo-700 text-white rounded-xl px-4">
        <Send className="h-4 w-4" />
      </Button>
    </form>
  );
};
