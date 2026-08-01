import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSharedFiles } from '@/lib/fileStorage';

export async function GET(req: Request) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {}

    const { searchParams } = new URL(req.url);
    const filterUserId = searchParams.get('userId') || (session?.user as any)?.id;
    const userRole = (session?.user as any)?.role || 'CLIENT';
    const isStaffOrAdmin = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CEO', 'PROJECT_MANAGER'].includes(userRole);

    const files = getSharedFiles(filterUserId, isStaffOrAdmin);

    return NextResponse.json({ files });
  } catch (error: any) {
    return NextResponse.json({ files: [] });
  }
}
