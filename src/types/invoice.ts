export type InvoiceStatus = 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';

export interface Invoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  clientId: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: InvoiceStatus;
  dueDate?: string | null;
  paidAt?: string | null;
  notes?: string | null;
  paymentMethod?: string | null;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company?: string | null;
    address?: string | null;
  };
  order?: {
    id: string;
    orderNumber: string;
    projectName: string;
    serviceType: string;
  };
}
