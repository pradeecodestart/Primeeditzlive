'use client';
import React, { useState } from 'react';
import { ChatList } from '@/components/chat/ChatList';
import { ChatWindow } from '@/components/chat/ChatWindow';
import { Conversation, ChatMessage } from '@/types';

const sampleConversations: Conversation[] = [
  {
    id: 'conv-1',
    name: 'Project ORD-2024-001 Discussion',
    isGroup: true,
    orderId: 'ORD-2024-001',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
  {
    id: 'conv-2',
    name: 'Real Estate Photos Support',
    isGroup: false,
    orderId: 'ORD-2024-002',
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  },
];

const sampleMessages: ChatMessage[] = [
  {
    id: 'm1',
    conversationId: 'conv-1',
    senderId: 'client-1',
    content: 'Hi team! Just uploaded the RAW files for the fashion retouching.',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 2).toISOString(),
    sender: { id: 'client-1', firstName: 'Bob', lastName: 'Martinez' },
  },
  {
    id: 'm2',
    conversationId: 'conv-1',
    senderId: 'manager-1',
    content: 'Received Bob! Mike will start working on skin tones today.',
    isRead: true,
    createdAt: new Date(Date.now() - 3600000 * 1).toISOString(),
    sender: { id: 'manager-1', firstName: 'Sarah', lastName: 'Johnson' },
  },
  {
    id: 'm3',
    conversationId: 'conv-1',
    senderId: 'editor-1',
    content: 'Pass 1 skin smoothing complete! Check deliverables tab.',
    isRead: true,
    createdAt: new Date().toISOString(),
    sender: { id: 'editor-1', firstName: 'Mike', lastName: 'Chen' },
  },
];

export default function ChatPage() {
  const [conversations, setConversations] = useState<Conversation[]>(sampleConversations);
  const [activeConv, setActiveConv] = useState<Conversation>(sampleConversations[0]);
  const [messages, setMessages] = useState<ChatMessage[]>(sampleMessages);

  const handleSendMessage = (content: string) => {
    const newMessage: ChatMessage = {
      id: `m-${Date.now()}`,
      conversationId: activeConv.id,
      senderId: 'current-user-id',
      content,
      isRead: false,
      createdAt: new Date().toISOString(),
      sender: { id: 'current-user-id', firstName: 'You', lastName: '' },
    };
    setMessages((prev) => [...prev, newMessage]);
  };

  return (
    <div className="flex h-[calc(100vh-6.5rem)] rounded-2xl overflow-hidden border border-slate-200 dark:border-slate-800 shadow-xl">
      <ChatList
        conversations={conversations}
        activeId={activeConv.id}
        onSelect={(c) => setActiveConv(c)}
      />
      <ChatWindow
        conversation={activeConv}
        messages={messages}
        currentUserId="current-user-id"
        onSendMessage={handleSendMessage}
      />
    </div>
  );
}
