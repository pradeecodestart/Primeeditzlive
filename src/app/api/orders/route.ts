import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { getSharedOrders, addSharedOrder, StoredOrder } from '@/lib/ordersStore';

export async function GET(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const { searchParams } = new URL(req.url);
    const status = searchParams.get('status');
    const filterEmail = searchParams.get('email') || session?.user?.email;

    let dbOrders: any[] = [];
    try {
      dbOrders = await prisma.order.findMany({
        where: status && status !== 'ALL' ? { status: status as any } : undefined,
        include: {
          client: { select: { id: true, firstName: true, lastName: true, email: true, company: true } },
          assignedTo: { select: { id: true, firstName: true, lastName: true, email: true } },
        },
        orderBy: { createdAt: 'desc' },
      });
    } catch (dbErr) {
      // Ignore database connection error
    }

    const shared = getSharedOrders();
    const combinedMap = new Map();

    // Add shared orders first
    shared.forEach((o) => combinedMap.set(o.id, o));
    // Overlay DB orders if any
    dbOrders.forEach((o) => combinedMap.set(o.id, o));

    let allOrders = Array.from(combinedMap.values());

    // Filter by client email if user is a client
    const userRole = (session?.user as any)?.role || 'CLIENT';
    const userPortal = (session?.user as any)?.portal || 'CLIENT';

    if (filterEmail && (userRole === 'CLIENT' || userPortal === 'CLIENT')) {
      const cleanEmail = filterEmail.toLowerCase().trim();
      allOrders = allOrders.filter(
        (o) =>
          o.client?.email?.toLowerCase().trim() === cleanEmail ||
          o.clientId === (session?.user as any)?.id
      );
    }

    if (status && status !== 'ALL') {
      allOrders = allOrders.filter((o) => o.status === status);
    }

    return NextResponse.json({ orders: allOrders });
  } catch (error: any) {
    return NextResponse.json({ orders: [] });
  }
}

export async function POST(req: Request) {
  try {
    const session = await getServerSession(authOptions);
    const body = await req.json();
    const existingOrders = getSharedOrders();
    const orderNumber = `ORD-2024-${String(existingOrders.length + 1).padStart(3, '0')}`;
    const invoiceNumber = `PP-INV-2024-${String(existingOrders.length + 1).padStart(3, '0')}`;
    const orderId = `ord_${Math.random().toString(36).substring(2, 9)}`;

    const clientEmail = body.clientEmail || body.clientId || session?.user?.email || 'client@example.com';
    const clientName = session?.user?.name || body.clientName || 'Valued Client';
    const firstName = clientName.split(' ')[0] || 'Client';
    const lastName = clientName.split(' ')[1] || '';

    const newOrderObj: StoredOrder = {
      id: orderId,
      orderNumber,
      clientId: (session?.user as any)?.id || body.clientId || 'client-new',
      projectName: body.projectName || 'Untitled Order',
      serviceType: body.serviceType || 'Photo Editing',
      status: 'PENDING',
      priority: (body.priority as any) || 'MEDIUM',
      totalAmount: Number(body.totalAmount || 150),
      paidAmount: 0,
      deadline: body.deadline || new Date(Date.now() + 86400000 * 3).toISOString(),
      description: body.description || '',
      revisionCount: 0,
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

    // Save to shared memory store
    addSharedOrder(newOrderObj);

    // Save to Database if connected
    try {
      await prisma.order.create({
        data: {
          id: orderId,
          orderNumber,
          clientId: (session?.user as any)?.id || 'client-new',
          projectName: body.projectName || 'Untitled Order',
          serviceType: body.serviceType || 'Photo Editing',
          priority: body.priority || 'MEDIUM',
          totalAmount: body.totalAmount || 150,
          deadline: body.deadline ? new Date(body.deadline) : null,
          description: body.description,
        },
      });

      await prisma.invoice.create({
        data: {
          invoiceNumber,
          orderId,
          clientId: (session?.user as any)?.id || 'client-new',
          subtotal: body.totalAmount || 150,
          taxRate: 10,
          taxAmount: Number(body.totalAmount || 150) * 0.1,
          total: Number(body.totalAmount || 150) * 1.1,
          status: 'SENT',
          dueDate: new Date(Date.now() + 86400000 * 7),
        },
      });
    } catch (dbErr) {
      // Ignored if local db initializing
    }

    const mockInvoice = {
      id: `inv_${Math.random().toString(36).substring(2, 9)}`,
      invoiceNumber,
      total: Number(body.totalAmount || 150) * 1.1,
    };

    return NextResponse.json({ order: newOrderObj, invoice: mockInvoice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
