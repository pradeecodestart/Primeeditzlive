import { create } from 'zustand';
import { Conversation, ChatMessage } from '@/types';

interface ChatState {
  conversations: Conversation[];
  activeConversation: Conversation | null;
  messages: ChatMessage[];
  setConversations: (conversations: Conversation[]) => void;
  setActiveConversation: (conversation: Conversation | null) => void;
  setMessages: (messages: ChatMessage[]) => void;
  addMessage: (message: ChatMessage) => void;
}

export const useChatStore = create<ChatState>((set) => ({
  conversations: [],
  activeConversation: null,
  messages: [],
  setConversations: (conversations) => set({ conversations }),
  setActiveConversation: (conversation) => set({ activeConversation: conversation }),
  setMessages: (messages) => set({ messages }),
  addMessage: (message) =>
    set((state) => ({
      messages: [...state.messages, message],
    })),
}));
