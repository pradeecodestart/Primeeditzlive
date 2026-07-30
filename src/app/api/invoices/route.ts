import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET() {
  try {
    const invoices = await prisma.invoice.findMany({
      include: {
        client: { select: { firstName: true, lastName: true, email: true, company: true } },
        order: { select: { orderNumber: true, projectName: true, serviceType: true } },
      },
      orderBy: { createdAt: 'desc' },
    });
    return NextResponse.json({ invoices });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-2024-${String(count + 1).padStart(3, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: body.orderId || 'order-id-placeholder',
        clientId: body.clientId || 'bob-martinez-id',
        subtotal: body.subtotal,
        taxRate: body.taxRate || 10,
        taxAmount: body.subtotal * (body.taxRate / 100 || 0.1),
        discount: body.discount || 0,
        total: body.total,
        status: 'SENT',
        dueDate: new Date(Date.now() + 86400000 * 14),
      },
    });

    return NextResponse.json({ invoice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
