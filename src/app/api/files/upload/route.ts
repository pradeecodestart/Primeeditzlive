import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
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
    const { fileName, fileSize, mimeType, uniqueKey, folderPath } = body;

    if (!fileName || !fileSize) {
      return NextResponse.json({ error: 'fileName and fileSize are required' }, { status: 400 });
    }

    const userId = (session?.user as any)?.id || body.userId || 'client-new';
    const userEmail = session?.user?.email || body.userEmail || 'client@example.com';
    const userName = session?.user?.name || 'Valued Client';

    const ext = path.extname(fileName);
    const storedName = `${Date.now()}_${Math.random().toString(36).substring(2, 8)}${ext}`;
    const uploadId = `up_${Math.random().toString(36).substring(2, 9)}`;

    const userDir = getUploadDir(userId);
    const filePath = path.join(userDir, storedName);

    // Create an empty file on disk
    fs.writeFileSync(filePath, Buffer.alloc(0));

    const newRecord = createStoredFileRecord({
      id: uploadId,
      userId,
      originalName: fileName,
      storedName,
      size: Number(fileSize),
      mimeType: mimeType || 'application/octet-stream',
      status: 'UPLOADING',
      uploadOffset: 0,
      uniqueKey: uniqueKey || `${userId}-${fileName}-${fileSize}-${Date.now()}`,
      folderPath: folderPath || '',
      client: {
        id: userId,
        firstName: userName.split(' ')[0] || 'Client',
        lastName: userName.split(' ')[1] || '',
        email: userEmail,
      },
    });

    // Try saving to database if online
    try {
      await (prisma as any).upload.create({
        data: {
          id: uploadId,
          userId,
          originalName: fileName,
          storedName,
          size: BigInt(fileSize),
          mimeType: mimeType || 'application/octet-stream',
          status: 'UPLOADING',
          uploadOffset: BigInt(0),
          uniqueKey: newRecord.uniqueKey,
        },
      });
    } catch (dbErr) {
      // Ignored if local db initializing
    }

    return NextResponse.json({
      uploadId,
      storedName,
      uploadOffset: 0,
      chunkSize: 5 * 1024 * 1024, // 5MB chunk recommendation
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Failed to start upload' }, { status: 500 });
  }
}
