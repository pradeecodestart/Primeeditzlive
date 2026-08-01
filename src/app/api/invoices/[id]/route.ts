import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';
import { getSharedOrders } from '@/lib/ordersStore';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const { id } = params;

    // Try finding in database
    try {
      const invoice = await prisma.invoice.findUnique({
        where: { id },
        include: {
          client: { select: { id: true, firstName: true, lastName: true, email: true, company: true } },
          order: { select: { id: true, orderNumber: true, projectName: true, serviceType: true } },
        },
      });

      if (invoice) {
        return NextResponse.json({ invoice });
      }
    } catch (e) {
      // Ignore DB error
    }

    // Memory store fallback lookup
    const sharedOrders = getSharedOrders();
    const matchedOrder = sharedOrders.find(
      (o) => o.id === id || o.orderNumber === id || `inv_${o.id}` === id
    );

    if (matchedOrder) {
      const subtotal = matchedOrder.totalAmount || 100;
      const taxAmount = subtotal * 0.18;
      const total = subtotal + taxAmount;

      const mockInvoice = {
        id: id,
        invoiceNumber: `PP-INV-${matchedOrder.orderNumber.replace('ORD-', '')}`,
        orderId: matchedOrder.id,
        clientId: matchedOrder.clientId,
        subtotal,
        taxRate: 18,
        taxAmount,
        discount: 0,
        total,
        status: matchedOrder.paidAmount >= total ? 'PAID' : 'SENT',
        dueDate: matchedOrder.deadline,
        paidAt: matchedOrder.paidAmount >= total ? matchedOrder.updatedAt : null,
        createdAt: matchedOrder.createdAt,
        updatedAt: matchedOrder.updatedAt,
        client: matchedOrder.client,
        order: {
          id: matchedOrder.id,
          orderNumber: matchedOrder.orderNumber,
          projectName: matchedOrder.projectName,
          serviceType: matchedOrder.serviceType,
        },
      };

      return NextResponse.json({ invoice: mockInvoice });
    }

    return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
