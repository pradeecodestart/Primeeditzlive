import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSharedInvoices, addSharedInvoice, StoredInvoice } from '@/lib/invoicesStore';

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
      // Database connection fallback
    }

    const shared = getSharedInvoices();
    const combinedMap = new Map();

    shared.forEach((inv) => combinedMap.set(inv.id, inv));
    dbInvoices.forEach((inv) => combinedMap.set(inv.id, inv));

    let invoices = Array.from(combinedMap.values());

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
    const existing = getSharedInvoices();
    const invoiceNumber = `INV-2024-${String(existing.length + 1).padStart(3, '0')}`;
    const invoiceId = `inv_${Math.random().toString(36).substring(2, 9)}`;

    const clientEmail = body.clientEmail || session?.user?.email || 'client@example.com';
    const clientName = session?.user?.name || body.clientName || 'Valued Client';
    const firstName = clientName.split(' ')[0] || 'Client';
    const lastName = clientName.split(' ')[1] || '';

    const newInvoiceObj: StoredInvoice = {
      id: invoiceId,
      invoiceNumber,
      orderId: body.orderId || 'order-placeholder',
      clientId: (session?.user as any)?.id || body.clientId || 'client-new',
      subtotal: body.subtotal || 100,
      taxRate: body.taxRate || 18,
      taxAmount: (body.subtotal || 100) * 0.18,
      discount: body.discount || 0,
      total: (body.subtotal || 100) * 1.18,
      status: 'SENT',
      dueDate: new Date(Date.now() + 86400000 * 14).toISOString(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      client: {
        id: (session?.user as any)?.id || 'client-new',
        firstName,
        lastName,
        email: clientEmail,
        company: body.company || '',
      },
    };

    addSharedInvoice(newInvoiceObj);

    try {
      await prisma.invoice.create({
        data: {
          id: invoiceId,
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
    } catch (dbErr) {
      // Ignored if local db initializing
    }

    return NextResponse.json({ invoice: newInvoiceObj });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
