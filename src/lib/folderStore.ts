import fs from 'fs';
import path from 'path';
import { prisma } from '@/lib/prisma';

export interface FolderItem {
  id: string;
  userId: string;
  name: string;
  path: string;
  parentId?: string | null;
  color?: string | null;
  icon?: string | null;
  isShared?: boolean;
  createdAt: string;
  updatedAt: string;
  children?: FolderItem[];
}

const baseUploadDir = process.env.UPLOAD_DIR || path.join(process.cwd(), '.data', 'uploads');
const dataDir = path.join(process.cwd(), '.data');
const foldersJsonPath = path.join(dataDir, 'folders.json');

function loadFoldersFromDisk(): FolderItem[] {
  try {
    if (fs.existsSync(foldersJsonPath)) {
      const content = fs.readFileSync(foldersJsonPath, 'utf-8');
      const parsed = JSON.parse(content);
      if (Array.isArray(parsed)) return parsed;
    }
  } catch (err) {
    console.error('Error loading folders registry from disk:', err);
  }
  return [];
}

function saveFoldersToDisk(folders: FolderItem[]) {
  try {
    if (!fs.existsSync(dataDir)) {
      fs.mkdirSync(dataDir, { recursive: true });
    }
    fs.writeFileSync(foldersJsonPath, JSON.stringify(folders, null, 2), 'utf-8');
  } catch (err) {
    console.error('Error saving folders registry to disk:', err);
  }
}

const globalRef = global as unknown as { __sharedFoldersStore?: FolderItem[] };
if (!globalRef.__sharedFoldersStore) {
  globalRef.__sharedFoldersStore = loadFoldersFromDisk();
}

export function getSharedFolders(userId?: string): FolderItem[] {
  const all = globalRef.__sharedFoldersStore || loadFoldersFromDisk();
  if (!userId) return all;
  return all.filter((f) => f.userId === userId);
}

export function buildFolderTree(folders: FolderItem[]): FolderItem[] {
  const map = new Map<string, FolderItem>();
  const roots: FolderItem[] = [];

  folders.forEach((folder) => {
    map.set(folder.id, { ...folder, children: [] });
  });

  folders.forEach((folder) => {
    const node = map.get(folder.id);
    if (node) {
      if (folder.parentId && map.has(folder.parentId)) {
        map.get(folder.parentId)!.children!.push(node);
      } else {
        roots.push(node);
      }
    }
  });

  return roots;
}

export function createFolderRecord(data: {
  userId: string;
  name: string;
  parentId?: string | null;
  color?: string;
  icon?: string;
}): FolderItem {
  const folders = globalRef.__sharedFoldersStore || loadFoldersFromDisk();
  let parentPath = '';

  if (data.parentId) {
    const parent = folders.find((f) => f.id === data.parentId);
    if (parent) parentPath = parent.path;
  }

  const folderPath = parentPath ? `${parentPath}/${data.name}` : `/${data.name}`;
  const folderId = `fld_${Math.random().toString(36).substring(2, 9)}`;

  // Create physical directory on host disk
  const userPhysicalDir = path.join(baseUploadDir, data.userId || 'public', folderPath);
  if (!fs.existsSync(userPhysicalDir)) {
    fs.mkdirSync(userPhysicalDir, { recursive: true });
  }

  const newFolder: FolderItem = {
    id: folderId,
    userId: data.userId,
    name: data.name,
    path: folderPath,
    parentId: data.parentId || null,
    color: data.color || '#3B82F6',
    icon: data.icon || '📁',
    isShared: false,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  folders.push(newFolder);
  globalRef.__sharedFoldersStore = folders;
  saveFoldersToDisk(folders);

  return newFolder;
}

export function updateFolderRecord(
  id: string,
  userId: string,
  updates: { name?: string; color?: string; icon?: string }
): FolderItem | null {
  const folders = globalRef.__sharedFoldersStore || loadFoldersFromDisk();
  const idx = folders.findIndex((f) => f.id === id && f.userId === userId);
  if (idx === -1) return null;

  const current = folders[idx];
  let newPath = current.path;

  if (updates.name && updates.name !== current.name) {
    const parts = current.path.split('/');
    parts[parts.length - 1] = updates.name;
    newPath = parts.join('/');
  }

  folders[idx] = {
    ...current,
    name: updates.name || current.name,
    path: newPath,
    color: updates.color !== undefined ? updates.color : current.color,
    icon: updates.icon !== undefined ? updates.icon : current.icon,
    updatedAt: new Date().toISOString(),
  };

  globalRef.__sharedFoldersStore = folders;
  saveFoldersToDisk(folders);
  return folders[idx];
}

export function deleteFolderRecord(id: string, userId: string): boolean {
  const folders = globalRef.__sharedFoldersStore || loadFoldersFromDisk();
  const target = folders.find((f) => f.id === id && f.userId === userId);
  if (!target) return false;

  const toRemove = new Set<string>();
  const collectChildIds = (parentId: string) => {
    toRemove.add(parentId);
    folders.filter((f) => f.parentId === parentId).forEach((child) => collectChildIds(child.id));
  };

  collectChildIds(id);

  const updatedFolders = folders.filter((f) => !toRemove.has(f.id));
  globalRef.__sharedFoldersStore = updatedFolders;
  saveFoldersToDisk(updatedFolders);

  // Remove physical directory on disk
  const physicalPath = path.join(baseUploadDir, userId || 'public', target.path);
  if (fs.existsSync(physicalPath)) {
    try {
      fs.rmSync(physicalPath, { recursive: true, force: true });
    } catch (e) {
      console.error('Error deleting physical folder:', e);
    }
  }

  return true;
}
