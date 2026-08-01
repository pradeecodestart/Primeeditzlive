import { NextResponse } from 'next/server';
import { getSharedFiles, removeStoredFileRecord, getUploadDir } from '@/lib/fileStorage';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs';

export async function DELETE(req: Request, { params }: { params: { id: string } }) {
  try {
    const uploadId = params.id;
    const allFiles = getSharedFiles(undefined, true);
    const fileRecord = allFiles.find((f) => f.id === uploadId);

    if (!fileRecord) {
      return NextResponse.json({ error: 'File record not found' }, { status: 404 });
    }

    const userDir = getUploadDir(fileRecord.userId);
    const filePath = path.join(userDir, fileRecord.storedName);

    // Delete from disk if present
    if (fs.existsSync(filePath)) {
      try {
        fs.unlinkSync(filePath);
      } catch (e) {
        console.error('File unlink error:', e);
      }
    }

    removeStoredFileRecord(uploadId);

    try {
      await (prisma as any).upload.delete({
        where: { id: uploadId },
      });
    } catch {}

    return NextResponse.json({ success: true, message: 'File deleted from disk and database' });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Delete failed' }, { status: 500 });
  }
}
