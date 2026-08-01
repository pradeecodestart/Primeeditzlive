import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { createStoredFileRecord, getUploadDir } from '@/lib/fileStorage';
import path from 'path';
import fs from 'fs';

export async function POST(req: Request) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {}

    const body = await req.json();
    const { files, folderId } = body;

    if (!Array.isArray(files) || files.length === 0) {
      return NextResponse.json({ error: 'files array is required' }, { status: 400 });
    }

    const userId = (session?.user as any)?.id || body.userId || 'client-new';
    const userEmail = session?.user?.email || 'client@example.com';
    const userName = session?.user?.name || 'Valued Client';

    const userDir = getUploadDir(userId);

    const createdRecords = files.map((file: any) => {
      const ext = path.extname(file.originalName || file.fileName || '');
      const storedName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
      const uploadId = `up_${Math.random().toString(36).substring(2, 9)}`;

      const filePath = path.join(userDir, storedName);
      fs.writeFileSync(filePath, Buffer.alloc(0));

      return createStoredFileRecord({
        id: uploadId,
        userId,
        originalName: file.originalName || file.fileName,
        storedName,
        size: Number(file.fileSize || file.size),
        mimeType: file.mimeType || 'application/octet-stream',
        status: 'UPLOADING',
        uploadOffset: 0,
        uniqueKey: `${userId}-${file.originalName}-${file.fileSize}-${Date.now()}-${Math.random()}`,
        folderPath: file.relativePath ? path.dirname(file.relativePath) : file.folderPath || '',
        client: {
          id: userId,
          firstName: userName.split(' ')[0] || 'Client',
          lastName: userName.split(' ')[1] || '',
          email: userEmail,
        },
      });
    });

    return NextResponse.json(createdRecords);
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Batch creation failed' }, { status: 500 });
  }
}
