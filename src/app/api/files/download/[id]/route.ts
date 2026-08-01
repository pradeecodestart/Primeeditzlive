import { NextResponse } from 'next/server';
import { getSharedFiles, getUploadDir } from '@/lib/fileStorage';
import path from 'path';
import fs from 'fs';

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    const uploadId = params.id;
    const allFiles = getSharedFiles(undefined, true);
    const fileRecord = allFiles.find((f) => f.id === uploadId);

    if (!fileRecord) {
      return NextResponse.json({ error: 'File record not found' }, { status: 404 });
    }

    const userDir = getUploadDir(fileRecord.userId);
    const filePath = path.join(userDir, fileRecord.storedName);

    if (!fs.existsSync(filePath)) {
      return NextResponse.json({ error: 'File on disk not found' }, { status: 404 });
    }

    const fileStream = fs.createReadStream(filePath);
    const stat = fs.statSync(filePath);

    // Convert node stream to Web ReadableStream
    const webStream = new ReadableStream({
      start(controller) {
        fileStream.on('data', (chunk) => controller.enqueue(chunk));
        fileStream.on('end', () => controller.close());
        fileStream.on('error', (err) => controller.error(err));
      },
    });

    const encodedName = encodeURIComponent(fileRecord.originalName);

    return new NextResponse(webStream, {
      status: 200,
      headers: {
        'Content-Type': fileRecord.mimeType || 'application/octet-stream',
        'Content-Length': String(stat.size),
        'Content-Disposition': `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Download failed' }, { status: 500 });
  }
}
