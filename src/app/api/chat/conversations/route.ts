import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const id = searchParams.get('id');

    if (id) {
      const messages = await prisma.message.findMany({
        where: { conversationId: id },
        include: { sender: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
        orderBy: { createdAt: 'asc' },
      });
      return NextResponse.json({ messages });
    }

    const conversations = await prisma.conversation.findMany({
      include: {
        participants: {
          include: { user: { select: { id: true, firstName: true, lastName: true, avatar: true } } },
        },
      },
      orderBy: { updatedAt: 'desc' },
    });
    return NextResponse.json({ conversations });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
