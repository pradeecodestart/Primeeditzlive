import { useState, useEffect } from 'react';
import axios from 'axios';
import { Conversation, ChatMessage } from '@/types';

export function useChat(conversationId?: string) {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const fetchConversations = async () => {
    try {
      const res = await axios.get('/api/chat/conversations');
      setConversations(res.data.conversations || []);
    } catch (err) {
      console.error('Failed to fetch conversations:', err);
    }
  };

  const fetchMessages = async (id: string) => {
    try {
      setIsLoading(true);
      const res = await axios.get(`/api/chat/conversations?id=${id}`);
      setMessages(res.data.messages || []);
    } catch (err) {
      console.error('Failed to fetch messages:', err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchConversations();
  }, []);

  useEffect(() => {
    if (conversationId) {
      fetchMessages(conversationId);
      const interval = setInterval(() => {
        fetchMessages(conversationId);
      }, 3000); // Polling every 3s
      return () => clearInterval(interval);
    }
  }, [conversationId]);

  const sendMessage = async (id: string, content: string, attachments: string[] = []) => {
    try {
      const res = await axios.post(`/api/chat/messages`, {
        conversationId: id,
        content,
        attachments,
      });
      setMessages((prev) => [...prev, res.data.message]);
      return res.data;
    } catch (err) {
      console.error('Failed to send message:', err);
      throw err;
    }
  };

  return {
    conversations,
    messages,
    isLoading,
    sendMessage,
    refetchConversations: fetchConversations,
  };
}
