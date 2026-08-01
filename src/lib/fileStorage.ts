import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export interface StoredFile {
  id: string;
  userId: string;
  originalName: string;
  storedName: string;
  size: number;
  mimeType: string;
  status: 'UPLOADING' | 'COMPLETED' | 'FAILED';
  uploadOffset: number;
  uniqueKey: string;
  metadata?: any;
  createdAt: string;
  updatedAt: string;
  user?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
  client?: {
    id: string;
    firstName: string;
    lastName: string;
    email: string;
  };
}

const baseUploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), '.data', 'uploads');
const dataDir = path.join(process.cwd(), '.data');
const jsonFilePath = path.join(dataDir, 'files.json');

export function getUploadDir(userId: string): string {
  const userDir = path.join(baseUploadDir, userId || 'public');
  if (!fs.existsSync(userDir)) {
    fs.mkdirSync(userDir, { recursive: true });
  }
  return userDir;
}

function loadDiskFilesRegistry(): StoredFile[] {
  try {
    if (fs.existsSync(jsonFilePath)) {
      const content = fs.readFileSync(jsonFilePath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error loading files registry from disk:', err);
  }
  return [];
}

function saveDiskFilesRegistry(files: StoredFile[]) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(jsonFilePath, JSON.stringify(files, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving files registry to disk:', err);
  }
}

const globalRef = global as unknown as { __sharedFilesStore?: StoredFile[] };
if (!globalRef.__sharedFilesStore) {
  globalRef.__sharedFilesStore = loadDiskFilesRegistry();
}

export function getSharedFiles(userId?: string, isStaffOrAdmin: boolean = false): StoredFile[] {
  const all = globalRef.__sharedFilesStore || loadDiskFilesRegistry();
  if (isStaffOrAdmin || !userId) return all;
  return all.filter((f) => f.userId === userId);
}

export function createStoredFileRecord(data: Omit<StoredFile, 'createdAt' | 'updatedAt'>): StoredFile {
  const newFile: StoredFile = {
    ...data,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (!globalRef.__sharedFilesStore) {
    globalRef.__sharedFilesStore = loadDiskFilesRegistry();
  }
  globalRef.__sharedFilesStore.unshift(newFile);
  saveDiskFilesRegistry(globalRef.__sharedFilesStore);
  return newFile;
}

export function updateStoredFileRecord(id: string, updates: Partial<StoredFile>): StoredFile | null {
  const files = globalRef.__sharedFilesStore || loadDiskFilesRegistry();
  const idx = files.findIndex((f) => f.id === id);
  if (idx === -1) return null;

  files[idx] = {
    ...files[idx],
    ...updates,
    updatedAt: new Date().toISOString(),
  };
  globalRef.__sharedFilesStore = files;
  saveDiskFilesRegistry(files);
  return files[idx];
}

export function removeStoredFileRecord(id: string): StoredFile | null {
  const files = globalRef.__sharedFilesStore || loadDiskFilesRegistry();
  const idx = files.findIndex((f) => f.id === id);
  if (idx === -1) return null;

  const [removed] = files.splice(idx, 1);
  globalRef.__sharedFilesStore = files;
  saveDiskFilesRegistry(files);
  return removed;
}

export function getMimeFromExtension(ext: string): string {
  const cleanExt = ext.replace('.', '').toLowerCase();
  const mimeMap: Record<string, string> = {
    mp4: 'video/mp4',
    mov: 'video/quicktime',
    avi: 'video/x-msvideo',
    mkv: 'video/x-matroska',
    webm: 'video/webm',
    jpg: 'image/jpeg',
    jpeg: 'image/jpeg',
    png: 'image/png',
    gif: 'image/gif',
    webp: 'image/webp',
    mp3: 'audio/mpeg',
    wav: 'audio/wav',
    pdf: 'application/pdf',
    doc: 'application/msword',
    docx: 'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    zip: 'application/zip',
    rar: 'application/x-rar-compressed',
  };
  return mimeMap[cleanExt] || 'application/octet-stream';
}

export function rescanStorageDirectories(specificUserId?: string): { addedCount: number; scannedFolders: number } {
  if (!fs.existsSync(baseUploadDir)) {
    fs.mkdirSync(baseUploadDir, { recursive: true });
    return { addedCount: 0, scannedFolders: 0 };
  }

  let addedCount = 0;
  const userFolders = specificUserId
    ? [specificUserId]
    : fs.readdirSync(baseUploadDir).filter((f) => {
        try {
          return fs.statSync(path.join(baseUploadDir, f)).isDirectory();
        } catch {
          return false;
        }
      });

  const currentStore = getSharedFiles(undefined, true);

  for (const uid of userFolders) {
    const userDir = path.join(baseUploadDir, uid);
    if (!fs.existsSync(userDir)) continue;

    const filesOnDisk = fs.readdirSync(userDir);
    for (const filename of filesOnDisk) {
      const fullPath = path.join(userDir, filename);
      try {
        const stat = fs.statSync(fullPath);
        if (stat.isFile()) {
          const existsInStore = currentStore.some((f) => f.userId === uid && f.storedName === filename);
          if (!existsInStore) {
            const ext = path.extname(filename);
            const mimeType = getMimeFromExtension(ext);
            const fileId = `up_${Math.random().toString(36).substring(2, 9)}`;

            createStoredFileRecord({
              id: fileId,
              userId: uid,
              originalName: filename,
              storedName: filename,
              size: stat.size,
              mimeType,
              status: 'COMPLETED',
              uploadOffset: stat.size,
              uniqueKey: `rescan-${uid}-${filename}-${stat.size}`,
              client: {
                id: uid,
                firstName: 'Discovered',
                lastName: 'User',
                email: `${uid}@system.local`,
              },
            });
            addedCount++;
          }
        }
      } catch (err) {
        console.error(`Error scanning file ${fullPath}:`, err);
      }
    }
  }

  return { addedCount, scannedFolders: userFolders.length };
}
