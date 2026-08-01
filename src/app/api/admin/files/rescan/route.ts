import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { rescanStorageDirectories } from '@/lib/fileStorage';

export async function POST(req: Request) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {}

    const { searchParams } = new URL(req.url);
    const specificUserId = searchParams.get('userId') || undefined;

    const result = rescanStorageDirectories(specificUserId);

    return NextResponse.json({
      success: true,
      message: `Rescan completed successfully. Discovered and registered ${result.addedCount} new files.`,
      addedCount: result.addedCount,
      scannedFolders: result.scannedFolders,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Rescan failed' }, { status: 500 });
  }
}
