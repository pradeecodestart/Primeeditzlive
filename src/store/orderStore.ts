import { create } from 'zustand';
import { Order, OrderStatus } from '@/types/order';

interface OrderState {
  orders: Order[];
  selectedOrder: Order | null;
  filterStatus: OrderStatus | 'ALL';
  searchQuery: string;
  setOrders: (orders: Order[]) => void;
  setSelectedOrder: (order: Order | null) => void;
  setFilterStatus: (status: OrderStatus | 'ALL') => void;
  setSearchQuery: (query: string) => void;
  updateOrderStatus: (orderId: string, status: OrderStatus) => void;
}

export const useOrderStore = create<OrderState>((set) => ({
  orders: [],
  selectedOrder: null,
  filterStatus: 'ALL',
  searchQuery: '',
  setOrders: (orders) => set({ orders }),
  setSelectedOrder: (order) => set({ selectedOrder: order }),
  setFilterStatus: (status) => set({ filterStatus: status }),
  setSearchQuery: (query) => set({ searchQuery: query }),
  updateOrderStatus: (orderId, status) =>
    set((state) => ({
      orders: state.orders.map((o) => (o.id === orderId ? { ...o, status } : o)),
      selectedOrder: state.selectedOrder?.id === orderId ? { ...state.selectedOrder, status } : state.selectedOrder,
    })),
}));
