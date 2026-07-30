import React from 'react';
import { Badge } from '@/components/ui/badge';
import { OrderStatus } from '@/types/order';

export const OrderStatusBadge: React.FC<{ status: OrderStatus }> = ({ status }) => {
  switch (status) {
    case 'PENDING':
      return <Badge variant="warning">PENDING</Badge>;
    case 'IN_PROGRESS':
      return <Badge variant="default">IN PROGRESS</Badge>;
    case 'REVIEW':
      return <Badge variant="secondary">REVIEW</Badge>;
    case 'REVISION':
      return <Badge variant="outline" className="border-orange-500 text-orange-500">REVISION</Badge>;
    case 'COMPLETED':
      return <Badge variant="success">COMPLETED</Badge>;
    case 'CANCELLED':
      return <Badge variant="destructive">CANCELLED</Badge>;
    default:
      return <Badge>{status}</Badge>;
  }
};
