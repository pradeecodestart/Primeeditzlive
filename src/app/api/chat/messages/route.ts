import { NextResponse } from 'next/server';
import { prisma } from '@/lib/prisma';

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const message = await prisma.message.create({
      data: {
        conversationId: body.conversationId,
        senderId: body.senderId || 'bob-martinez-id',
        content: body.content,
        attachments: body.attachments || [],
      },
      include: {
        sender: { select: { id: true, firstName: true, lastName: true, avatar: true } },
      },
    });

    await prisma.conversation.update({
      where: { id: body.conversationId },
      data: { updatedAt: new Date() },
    });

    return NextResponse.json({ message });
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 500 });
  }
}
