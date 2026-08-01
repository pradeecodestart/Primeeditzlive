import { NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { getSharedFolders } from '@/lib/folderStore';
import { getUploadDir } from '@/lib/fileStorage';
import path from 'path';
import fs from 'fs';
const archiver = require('archiver');

export async function GET(req: Request, { params }: { params: { id: string } }) {
  try {
    let session = null;
    try {
      session = await getServerSession(authOptions);
    } catch {}

    const userId = (session?.user as any)?.id || 'client-new';
    const allFolders = getSharedFolders(userId);
    const folder = allFolders.find((f) => f.id === params.id);

    if (!folder) {
      return NextResponse.json({ error: 'Folder not found' }, { status: 404 });
    }

    const baseUploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), '.data', 'uploads');
    const physicalFolderPath = path.join(baseUploadDir, userId, folder.path);

    if (!fs.existsSync(physicalFolderPath)) {
      return NextResponse.json({ error: 'Folder path on disk not found' }, { status: 404 });
    }

    const archive = (archiver as any)('zip', { zlib: { level: 6 } });
    const encodedName = encodeURIComponent(`${folder.name}.zip`);

    const readable = new ReadableStream({
      start(controller) {
        archive.on('data', (data: any) => controller.enqueue(data));
        archive.on('end', () => controller.close());
        archive.on('error', (err: any) => controller.error(err));

        archive.directory(physicalFolderPath, folder.name);
        archive.finalize();
      },
    });

    return new NextResponse(readable, {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="${encodedName}"; filename*=UTF-8''${encodedName}`,
      },
    });
  } catch (error: any) {
    return NextResponse.json({ error: error.message || 'Zip creation failed' }, { status: 500 });
  }
}
