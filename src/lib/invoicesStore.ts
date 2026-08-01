// Global disk-persistent store for invoices to sync across dashboards

import fs from 'fs';
import path from 'path';

export interface StoredInvoice {
  id: string;
  invoiceNumber: string;
  orderId: string;
  clientId: string;
  subtotal: number;
  taxRate: number;
  taxAmount: number;
  discount: number;
  total: number;
  status: 'DRAFT' | 'SENT' | 'PAID' | 'OVERDUE' | 'CANCELLED';
  dueDate: string;
  createdAt: string;
  updatedAt: string;
  client: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
    company?: string;
  };
  order?: {
    id: string;
    orderNumber: string;
    projectName: string;
    serviceType: string;
  };
}

let initialInvoices: StoredInvoice[] = [
  {
    id: 'inv-1',
    invoiceNumber: 'INV-2024-001',
    orderId: 'ord-1',
    clientId: 'c1',
    subtotal: 100.0,
    taxRate: 18,
    taxAmount: 18.0,
    discount: 0,
    total: 118.0,
    status: 'PAID',
    dueDate: new Date(Date.now() + 86400000 * 7).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    client: { id: 'c1', firstName: 'Bob', lastName: 'Martinez', email: 'bob@client.com', company: 'Martinez Media' },
    order: { id: 'ord-1', orderNumber: 'ORD-2024-001', projectName: 'Summer Fashion Catalog 2024', serviceType: 'Photo Editing & Retouching' },
  },
  {
    id: 'inv-2',
    invoiceNumber: 'INV-2024-002',
    orderId: 'ord-2',
    clientId: 'c1',
    subtotal: 90.0,
    taxRate: 18,
    taxAmount: 16.2,
    discount: 0,
    total: 106.2,
    status: 'SENT',
    dueDate: new Date(Date.now() + 86400000 * 10).toISOString(),
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    client: { id: 'c1', firstName: 'Bob', lastName: 'Martinez', email: 'bob@client.com', company: 'Martinez Media' },
    order: { id: 'ord-2', orderNumber: 'ORD-2024-002', projectName: 'Luxury Villa Real Estate Photos', serviceType: 'Real Estate Photo Editing' },
  },
];

const dataDir = path.join(process.cwd(), '.data');
const filePath = path.join(dataDir, 'invoices.json');

function loadInvoicesFromDisk(): StoredInvoice[] {
  try {
    if (fs.existsSync(filePath)) {
      const data = fs.readFileSync(filePath, 'utf-8');
      const parsed = JSON.parse(data);
      if (Array.isArray(parsed) && parsed.length > 0) {
        return parsed;
      }
    }
  } catch (err) {
    console.error('Error reading invoices from disk:', err);
  }
  return [...initialInvoices];
}

function saveInvoicesToDisk(invoices: StoredInvoice[]) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(filePath, JSON.stringify(invoices, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving invoices to disk:', err);
  }
}

const globalRef = global as unknown as { __sharedInvoicesStore?: StoredInvoice[] };
if (!globalRef.__sharedInvoicesStore) {
  globalRef.__sharedInvoicesStore = loadInvoicesFromDisk();
}

export function getSharedInvoices(): StoredInvoice[] {
  return globalRef.__sharedInvoicesStore || loadInvoicesFromDisk();
}

export function addSharedInvoice(newInvoice: StoredInvoice): StoredInvoice {
  if (!globalRef.__sharedInvoicesStore) {
    globalRef.__sharedInvoicesStore = loadInvoicesFromDisk();
  }
  globalRef.__sharedInvoicesStore.unshift(newInvoice);
  saveInvoicesToDisk(globalRef.__sharedInvoicesStore);
  return newInvoice;
}
