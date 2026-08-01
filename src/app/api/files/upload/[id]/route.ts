import { NextResponse } from 'next/server';
import { getSharedFiles, updateStoredFileRecord, getUploadDir } from '@/lib/fileStorage';
import { prisma } from '@/lib/prisma';
import path from 'path';
import fs from 'fs';

export async function PATCH(req: Request, { params }: { params: { id: string } }) {
  try {
    const uploadId = params.id;
    const allFiles = getSharedFiles(undefined, true);
    const fileRecord = allFiles.find((f) => f.id === uploadId);

    if (!fileRecord) {
      return NextResponse.json({ error: 'Upload session not found' }, { status: 404 });
    }

    if (fileRecord.status === 'COMPLETED') {
      return NextResponse.json({ error: 'Upload already completed' }, { status: 400 });
    }

    const arrayBuffer = await req.arrayBuffer();
    const chunkBuffer = Buffer.from(arrayBuffer);

    if (chunkBuffer.length === 0) {
      return NextResponse.json({ error: 'Empty chunk payload received' }, { status: 400 });
    }

    const userDir = getUploadDir(fileRecord.userId);
    const filePath = path.join(userDir, fileRecord.storedName);

    // Append binary chunk directly to disk file
    fs.appendFileSync(filePath, chunkBuffer);

    const newOffset = fileRecord.uploadOffset + chunkBuffer.length;
    updateStoredFileRecord(uploadId, { uploadOffset: newOffset });

    try {
      await (prisma as any).upload.update({
        where: { id: uploadId },
        data: { uploadOffset: BigInt(newOffset) },
      });
    } catch {}

    return NextResponse.json({
      uploadId,
      uploadOffset: newOffset,
      bytesReceived: chunkBuffer.length,
      isFinished: newOffset >= fileRecord.size,
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Chunk save failed' }, { status: 500 });
  }
}
