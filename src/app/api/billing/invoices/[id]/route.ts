import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        order: {
          include: { items: true }
        }
      }
    });

    if (invoice) {
      return NextResponse.json(invoice);
    }
  } catch (err) {
    // Return fallback for demo ID
  }

  // Demo fallback invoice object
  return NextResponse.json({
    id: params.id || 'inv-2',
    invoiceNumber: 'PP-INV-2024-045',
    subtotal: 150.00,
    taxRate: 10,
    taxAmount: 15.00,
    discount: 0,
    total: 165.00,
    status: 'SENT',
    dueDate: new Date(Date.now() + 86400000 * 5).toISOString(),
    createdAt: new Date().toISOString(),
    clientId: 'user-1',
    client: {
      id: 'user-1',
      firstName: 'Bob',
      lastName: 'Martinez',
      email: 'bob.martinez@example.com',
      company: 'Apex Media Studio',
      address: '123 Creative Studio Way, Suite 400, Los Angeles, CA'
    },
    order: {
      id: 'order-1',
      orderNumber: 'PP-2024-045',
      projectName: 'Wedding Photo Editing (150 Photos)',
      serviceType: 'Photo Editing & Retouching',
      items: [
        { id: 'item-1', name: '150 RAW Photo Retouching', quantity: 150, unitPrice: 0.50, total: 75.00 },
        { id: 'item-2', name: 'Advanced Color Correction & Grading', quantity: 150, unitPrice: 0.50, total: 75.00 }
      ]
    }
  });
}
