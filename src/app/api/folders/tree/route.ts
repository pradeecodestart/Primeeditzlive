import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSharedFolders, buildFolderTree } from '@/lib/folderStore';

export async function GET(req: Request) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {}

    const { searchParams } = new URL(req.url);
    const userId = searchParams.get('userId') || (session?.user as any)?.id || 'client-new';

    const allFolders = getSharedFolders(userId);
    const tree = buildFolderTree(allFolders);

    return NextResponse.json(tree);
  } catch (error: any) {
    return NextResponse.json([]);
  }
}
