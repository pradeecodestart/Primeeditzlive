export type OrderStatus = 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'REVISION' | 'COMPLETED' | 'CANCELLED';
export type Priority = 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';

export interface OrderItem {
  id: string;
  orderId: string;
  name: string;
  description?: string | null;
  quantity: number;
  unitPrice: number;
  total: number;
}

export interface OrderCustomization {
  id: string;
  orderId: string;
  optionName: string;
  optionValue: string;
  priceAdjust: number;
}

export interface OrderFile {
  id: string;
  orderId: string;
  fileName: string;
  fileUrl: string;
  fileType: string;
  mimeType: string;
  fileSize: number;
  uploadedBy?: string | null;
  uploadedAt: string;
}

export interface OrderTimeline {
  id: string;
  orderId: string;
  status: string;
  description: string;
  createdBy?: string | null;
  createdAt: string;
}

export interface Order {
  id: string;
  orderNumber: string;
  clientId: string;
  assignedToId?: string | null;
  managerId?: string | null;
  projectName: string;
  serviceType: string;
  description?: string | null;
  status: OrderStatus;
  priority: Priority;
  totalAmount: number;
  paidAmount: number;
  deadline?: string | null;
  completedAt?: string | null;
  notes?: string | null;
  revisionCount: number;
  createdAt: string;
  updatedAt: string;
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company?: string | null;
  };
  assignedTo?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  } | null;
  items?: OrderItem[];
  files?: OrderFile[];
  timeline?: OrderTimeline[];
  customizations?: OrderCustomization[];
}
