// Global shared store for orders to sync created orders across Client, Manager, Sales & Editor dashboards

export interface StoredOrder {
  id: string;
  orderNumber: string;
  clientId: string;
  projectName: string;
  serviceType: string;
  status: 'PENDING' | 'IN_PROGRESS' | 'REVIEW' | 'REVISION' | 'COMPLETED' | 'CANCELLED';
  priority: 'LOW' | 'MEDIUM' | 'HIGH' | 'URGENT';
  totalAmount: number;
  paidAmount: number;
  deadline: string;
  description?: string;
  revisionCount: number;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
  };
}

let initialOrders: StoredOrder[] = [
  {
    id: 'ord-1',
    orderNumber: 'ORD-2024-001',
    clientId: 'client-1',
    projectName: 'Summer Fashion Catalog 2024',
    serviceType: 'Photo Editing & Retouching',
    status: 'IN_PROGRESS',
    priority: 'HIGH',
    totalAmount: 100.0,
    paidAmount: 100.0,
    deadline: new Date(Date.now() + 86400000 * 2).toISOString(),
    description: 'High-end beauty retouching for 50 catalog images.',
    revisionCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    client: { id: 'c1', firstName: 'Bob', lastName: 'Martinez', email: 'bob@client.com', company: 'Martinez Media' },
  },
  {
    id: 'ord-2',
    orderNumber: 'ORD-2024-002',
    clientId: 'client-1',
    projectName: 'Luxury Villa Real Estate Photos',
    serviceType: 'Real Estate Photo Editing',
    status: 'REVIEW',
    priority: 'MEDIUM',
    totalAmount: 90.0,
    paidAmount: 90.0,
    deadline: new Date(Date.now() + 86400000 * 1).toISOString(),
    description: 'HDR blending and sky replacement.',
    revisionCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    client: { id: 'c1', firstName: 'Bob', lastName: 'Martinez', email: 'bob@client.com', company: 'Martinez Media' },
  },
  {
    id: 'ord-3',
    orderNumber: 'ORD-2024-003',
    clientId: 'client-2',
    projectName: 'Corporate Promo Video Edit',
    serviceType: 'Video Editing (Basic)',
    status: 'COMPLETED',
    priority: 'URGENT',
    totalAmount: 250.0,
    paidAmount: 250.0,
    deadline: new Date(Date.now() - 86400000 * 3).toISOString(),
    description: '5-minute company profile edit.',
    revisionCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    client: { id: 'c2', firstName: 'Alice', lastName: 'Cooper', email: 'alice@client.com', company: 'Cooper Creations' },
  },
  {
    id: 'ord-4',
    orderNumber: 'ORD-2024-004',
    clientId: 'client-2',
    projectName: 'E-commerce Shoe Product Cutouts',
    serviceType: 'Background Removal',
    status: 'PENDING',
    priority: 'LOW',
    totalAmount: 150.0,
    paidAmount: 0.0,
    deadline: new Date(Date.now() + 86400000 * 5).toISOString(),
    description: 'Transparent PNG output for 100 items.',
    revisionCount: 0,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    client: { id: 'c2', firstName: 'Alice', lastName: 'Cooper', email: 'alice@client.com', company: 'Cooper Creations' },
  },
  {
    id: 'ord-5',
    orderNumber: 'ORD-2024-005',
    clientId: 'client-1',
    projectName: 'Smith Wedding Highlight Film',
    serviceType: 'Wedding Package',
    status: 'REVISION',
    priority: 'HIGH',
    totalAmount: 500.0,
    paidAmount: 500.0,
    deadline: new Date(Date.now() + 86400000 * 1).toISOString(),
    description: 'Full highlight film color grade and sound design.',
    revisionCount: 1,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    client: { id: 'c1', firstName: 'Bob', lastName: 'Martinez', email: 'bob@client.com', company: 'Martinez Media' },
  },
];

// Memory store fallback if database is restarting
const globalRef = global as unknown as { __sharedOrdersStore?: StoredOrder[] };
if (!globalRef.__sharedOrdersStore) {
  globalRef.__sharedOrdersStore = [...initialOrders];
}

export function getSharedOrders(): StoredOrder[] {
  return globalRef.__sharedOrdersStore || initialOrders;
}

export function addSharedOrder(newOrder: StoredOrder): StoredOrder {
  if (!globalRef.__sharedOrdersStore) {
    globalRef.__sharedOrdersStore = [...initialOrders];
  }
  globalRef.__sharedOrdersStore.unshift(newOrder);
  return newOrder;
}
