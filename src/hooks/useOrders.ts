import { useState, useEffect } from 'react';
import axios from 'axios';
import { Order, OrderStatus } from '@/types/order';

export function useOrders(statusFilter?: string) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchOrders = async () => {
    try {
      setIsLoading(true);
      const res = await axios.get('/api/orders', {
        params: { status: statusFilter !== 'ALL' ? statusFilter : undefined },
      });
      setOrders(res.data.orders || []);
      setError(null);
    } catch (err: any) {
      setError(err.response?.data?.message || 'Failed to fetch orders');
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, [statusFilter]);

  const updateStatus = async (orderId: string, status: OrderStatus) => {
    try {
      const res = await axios.patch(`/api/orders/${orderId}`, { status });
      setOrders((prev) =>
        prev.map((o) => (o.id === orderId ? { ...o, status } : o))
      );
      return res.data;
    } catch (err: any) {
      throw new Error(err.response?.data?.message || 'Failed to update order status');
    }
  };

  return {
    orders,
    isLoading,
    error,
    refetch: fetchOrders,
    updateStatus,
  };
}
