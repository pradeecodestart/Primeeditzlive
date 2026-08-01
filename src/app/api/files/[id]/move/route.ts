import { NextResponse } from 'next/server';
import { getSharedFiles, updateStoredFileRecord } from '@/lib/fileStorage';
import { getSharedFolders } from '@/lib/folderStore';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const uploadId = params.id;
    const body = await req.json();
    const { targetFolderPath } = body;

    const allFiles = getSharedFiles(undefined, true);
    const fileRecord = allFiles.find((f) => f.id === uploadId);

    if (!fileRecord) {
      return NextResponse.json({ error: 'File record not found' }, { status: 404 });
    }

    const updated = updateStoredFileRecord(uploadId, {
      folderPath: targetFolderPath || '',
    });

    return NextResponse.json({ success: true, file: updated });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Move file failed' }, { status: 500 });
  }
}
