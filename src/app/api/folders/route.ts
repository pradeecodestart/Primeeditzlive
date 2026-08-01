import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSharedFolders, createFolderRecord } from '@/lib/folderStore';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {}

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || 'client-new';
    const parentId = searchParams.get('parentId') || null;

    const allFolders = getSharedFolders(userId);
    const filtered = allFolders.filter((f) => (parentId ? f.parentId === parentId : !f.parentId));

    return NextResponse.json(filtered);
  } catch (error: any) {
    return NextResponse.json([]);
  }
}

export async function POST(req: Request) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {}

    const body = await req.json();
    const { name, parentId, color, icon } = body;

    if (!name) {
      return NextResponse.json({ error: 'Folder name is required' }, { status: 400 });
    }

    const userId = (session?.user as any)?.id || body.userId || 'client-new';
    const folderRecord = createFolderRecord({
      userId,
      name,
      parentId,
      color,
      icon,
    });

    try {
      await (prisma as any).folder.create({
        data: {
          id: folderRecord.id,
          userId,
          name: folderRecord.name,
          path: folderRecord.path,
          parentId: folderRecord.parentId || null,
          color: folderRecord.color,
          icon: folderRecord.icon,
        },
      });
    } catch {}

    return NextResponse.json(folderRecord);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to create folder' }, { status: 500 });
  }
}
