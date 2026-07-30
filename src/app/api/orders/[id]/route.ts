import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const order = await prisma.order.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        assignedTo: true,
        items: true,
        files: true,
        timeline: { orderBy: { createdAt: 'desc' } },
        invoice: true,
      },
    });
    if (!order) return NextResponse.json({ error: 'Order not found' }, { status: 404 });
    return NextResponse.json({ order });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const body = await req.json();
    const updated = await prisma.order.update({
      where: { id: params.id },
      data: body,
    });

    if (body.status) {
      await prisma.orderTimeline.create({
        data: {
          orderId: params.id,
          status: body.status,
          description: `Status updated to ${body.status}`,
        },
      });
    }

    return NextResponse.json({ order: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
