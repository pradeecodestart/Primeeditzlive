import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const invoice = await prisma.invoice.findUnique({
      where: { id: params.id },
      include: {
        client: true,
        order: true,
      },
    });
    if (!invoice) return NextResponse.json({ error: 'Invoice not found' }, { status: 404 });
    return NextResponse.json({ invoice });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
