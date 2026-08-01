import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSharedFolders, updateFolderRecord, deleteFolderRecord } from '@/lib/folderStore';
import { prisma } from '@/lib/prisma';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {}

    const userId = (session?.user as any)?.id || 'client-new';
    const allFolders = getSharedFolders(userId);
    const folder = allFolders.find((f) => f.id === params.id);

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    return NextResponse.json(folder);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Error fetching folder' }, { status: 500 });
  }
}

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {}

    const userId = (session?.user as any)?.id || 'client-new';
    const body = await req.json();

    const updated = updateFolderRecord(params.id, userId, body);
    if (!updated) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    try {
      await (prisma as any).folder.update({
        where: { id: params.id },
        data: {
          name: updated.name,
          path: updated.path,
          color: updated.color,
          icon: updated.icon,
        },
      });
    } catch {}

    return NextResponse.json(updated);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Update failed' }, { status: 500 });
  }
}

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {}

    const userId = (session?.user as any)?.id || 'client-new';
    const success = deleteFolderRecord(params.id, userId);

    try {
      await (prisma as any).folder.delete({
        where: { id: params.id },
      });
    } catch {}

    return NextResponse.json({ success, message: 'Folder and contents deleted successfully' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
