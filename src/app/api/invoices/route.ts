import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const filterEmail = searchParams.get('email') || session?.user?.email;

    let dbInvoices: any[] = [];
    try {
      dbInvoices = await prisma.invoice.findMany({
        include: {
          client: { select: { id: true, firstName: true, lastName: true, email: true, company: true } },
          order: { select: { id: true, orderNumber: true, projectName: true, serviceType: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      // Ignore database connection error
    }

    let invoices = dbInvoices;

    const userRole = (session?.user as any)?.role || 'CLIENT';
    const userPortal = (session?.user as any)?.portal || 'CLIENT';

    // If client user, filter invoices by client email/id
    if (filterEmail && (userRole === 'CLIENT' || userPortal === 'CLIENT')) {
      const cleanEmail = filterEmail.toLowerCase().trim();
      invoices = invoices.filter(
        (inv) =>
          inv.client?.email?.toLowerCase().trim() === cleanEmail ||
          inv.clientId === (session?.user as any)?.id
      );
    }

    return NextResponse.json({ invoices });
  } catch (error: any) {
    return NextResponse.json({ invoices: [] });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const count = await prisma.invoice.count();
    const invoiceNumber = `INV-2024-${String(count + 1).padStart(3, '0')}`;

    const invoice = await prisma.invoice.create({
      data: {
        invoiceNumber,
        orderId: body.orderId || 'order-id-placeholder',
        clientId: (session?.user as any)?.id || body.clientId || 'client-id',
        subtotal: body.subtotal,
        taxRate: body.taxRate || 18,
        taxAmount: body.subtotal * 0.18,
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
