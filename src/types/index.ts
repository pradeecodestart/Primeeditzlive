export * from './auth';
export * from './order';
export * from './invoice';

export interface ChatMessage {
  id: string;
  conversationId: string;
  senderId: string;
  content: string;
  attachments?: string[];
  isRead: boolean;
  createdAt: string;
  sender?: {
    id: string;
    firstName: string;
    lastName: string;
    avatar?: string | null;
  };
}

export interface Conversation {
  id: string;
  name?: string | null;
  isGroup: boolean;
  orderId?: string | null;
  createdAt: string;
  updatedAt: string;
  lastMessage?: ChatMessage | null;
  unreadCount?: number;
  participants?: {
    id: string;
    userId: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      avatar?: string | null;
    };
  }[];
}

export interface DashboardStats {
  totalRevenue: number;
  totalOrders: number;
  activeClients: number;
  pendingOrders: number;
  teamPerformanceScore: number;
  monthlyGrowthPercent: number;
  recentOrders: any[];
  topClients: any[];
  monthlyRevenueChart: { month: string; revenue: number }[];
  ordersStatusChart: { status: string; count: number }[];
}
