import { NextResponse } from 'next/server';
import { getSharedFiles, updateStoredFileRecord, getUploadDir } from '@/lib/fileStorage';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request, { params }: { params: { id: string } }) {
  try {
    const uploadId = params.id;
    const allFiles = getSharedFiles(undefined, true);
    const fileRecord = allFiles.find((f) => f.id === uploadId);

    if (!fileRecord) {
      return NextResponse.json({ error: 'Upload session not found' }, { status: 404 });
    }

    const userDir = getUploadDir(fileRecord.userId);
    const filePath = path.join(userDir, fileRecord.storedName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File on disk not found' }, { status: 404 });
    }

    const actualSize = fs.statSync(filePath).size;

    // Check size match
    if (actualSize !== fileRecord.size) {
      updateStoredFileRecord(uploadId, { status: 'FAILED' });
      return NextResponse.json(
        { error: `File size mismatch. Expected ${fileRecord.size} bytes, got ${actualSize} bytes` },
        { status: 400 }
      );
    }

    const completedRecord = updateStoredFileRecord(uploadId, {
      status: 'COMPLETED',
      uploadOffset: actualSize,
    });

    try {
      await (prisma as any).upload.update({
        where: { id: uploadId },
        data: {
          status: 'COMPLETED',
          uploadOffset: BigInt(actualSize),
        },
      });
    } catch {}

    return NextResponse.json({
      success: true,
      message: 'Upload completed successfully',
      file: completedRecord,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Complete failed' }, { status: 500 });
  }
}
