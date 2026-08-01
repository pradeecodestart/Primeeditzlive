'use client';

import React, { useState, useEffect } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ResumableUploader } from '@/components/files/ResumableUploader';
import {
  FolderSync,
  DownloadCloud,
  Trash2,
  HardDrive,
  CheckCircle2,
  Clock,
  FileVideo,
  FileImage,
  FileText,
  ShieldCheck,
  RefreshCw,
  Folder,
  FolderOpen,
  FolderPlus,
  Search,
  Filter,
  Layers,
  Plus,
  X,
  FileArchive,
  Database,
  Film,
  Zap,
  Sparkles,
} from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function UploadsPage() {
  const { data: session } = useSession();
  const [files, setFiles] = useState<any[]>([]);
  const [folders, setFolders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRescanning, setIsRescanning] = useState(false);
  const [rescanMessage, setRescanMessage] = useState('');

  const [activeTab, setActiveTab] = useState<'ALL' | 'FOLDERS' | 'VIDEO' | 'IMAGE' | 'AUDIO' | 'DOCS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  // Create folder modal state
  const [showFolderModal, setShowFolderModal] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [newFolderColor, setNewFolderColor] = useState('#3B82F6');
  const [isCreatingFolder, setIsCreatingFolder] = useState(false);

  const userRole = (session?.user as any)?.role || 'CLIENT';
  const isStaffOrAdmin = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CEO', 'PROJECT_MANAGER'].includes(userRole);

  const fetchFilesAndFolders = async () => {
    try {
      setLoading(true);
      const [filesRes, foldersRes] = await Promise.all([
        axios.get('/api/files').catch(() => ({ data: { files: [] } })),
        axios.get('/api/folders').catch(() => ({ data: [] })),
      ]);
      setFiles(filesRes.data.files || []);
      setFolders(foldersRes.data || []);
    } catch (err) {
      console.error('Error fetching files and folders:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchFilesAndFolders();
  }, []);

  const handleCreateFolder = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newFolderName.trim()) return;

    try {
      setIsCreatingFolder(true);
      await axios.post('/api/folders', {
        name: newFolderName.trim(),
        color: newFolderColor,
        icon: '📁',
      });
      setNewFolderName('');
      setShowFolderModal(false);
      fetchFilesAndFolders();
    } catch (err: any) {
      alert(err.response?.data?.error || 'Failed to create folder');
    } finally {
      setIsCreatingFolder(false);
    }
  };

  const handleRescan = async () => {
    try {
      setIsRescanning(true);
      setRescanMessage('');
      const res = await axios.post('/api/files/admin/rescan');
      setRescanMessage(res.data.message || 'Rescan completed successfully');
      fetchFilesAndFolders();
    } catch (err: any) {
      setRescanMessage(err.response?.data?.error || 'Rescan failed');
    } finally {
      setIsRescanning(false);
    }
  };

  const handleDeleteFile = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file from disk and database?')) return;
    try {
      await axios.delete(`/api/files/${id}`);
      fetchFilesAndFolders();
    } catch (err) {
      alert('Failed to delete file');
    }
  };

  const handleDeleteFolder = async (folderId: string) => {
    if (!confirm('Are you sure you want to delete this folder and all its contents?')) return;
    try {
      await axios.delete(`/api/folders/${folderId}`);
      fetchFilesAndFolders();
    } catch (err) {
      alert('Failed to delete folder');
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Stats calculation
  const totalSizeBytes = files.reduce((acc, f) => acc + (Number(f.size) || 0), 0);
  const videoFilesCount = files.filter((f) => f.mimeType?.startsWith('video')).length;
  const photoFilesCount = files.filter((f) => f.mimeType?.startsWith('image')).length;

  // Group files into virtual folders based on folderPath
  const fileFolderGroups = files.reduce((acc: Record<string, any[]>, file) => {
    const folder = file.folderPath || 'Root Direct Uploads';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(file);
    return acc;
  }, {});

  const virtualFolderNames = Object.keys(fileFolderGroups);

  const allFolderList = Array.from(
    new Set([
      ...folders.map((f) => f.name),
      ...virtualFolderNames.filter((f) => f !== 'Root Direct Uploads'),
    ])
  );

  // Filter files based on tab, search query, and selected folder
  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.folderPath && file.folderPath.toLowerCase().includes(searchQuery.toLowerCase()));

    const fileFolder = file.folderPath || 'Root Direct Uploads';
    const matchesFolder = selectedFolder ? fileFolder.includes(selectedFolder) : true;

    if (!matchesSearch || !matchesFolder) return false;

    if (activeTab === 'VIDEO') return file.mimeType?.startsWith('video');
    if (activeTab === 'IMAGE') return file.mimeType?.startsWith('image');
    if (activeTab === 'AUDIO') return file.mimeType?.startsWith('audio');
    if (activeTab === 'DOCS')
      return (
        !file.mimeType?.startsWith('video') &&
        !file.mimeType?.startsWith('image') &&
        !file.mimeType?.startsWith('audio')
      );
    if (activeTab === 'FOLDERS') return Boolean(file.folderPath);

    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2.5">
            <HardDrive className="w-7 h-7 text-indigo-500" /> Storage & Raw Footage Hub
          </h1>
          <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
            Resumable 5MB chunked multi-folder uploader with host disk mounting & instant ZIP downloads.
          </p>
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <Button
            onClick={() => setShowFolderModal(true)}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-2 shadow-lg shadow-indigo-600/30 px-4 py-2"
          >
            <FolderPlus className="w-4 h-4" /> Create New Folder
          </Button>

          {isStaffOrAdmin && (
            <Button
              disabled={isRescanning}
              onClick={handleRescan}
              className="bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-bold text-xs gap-2 px-4 py-2"
            >
              <FolderSync className={`w-4 h-4 ${isRescanning ? 'animate-spin' : ''}`} />
              {isRescanning ? 'Scanning Storage...' : 'Rescan Host PC Storage'}
            </Button>
          )}
        </div>
      </div>

      {/* Storage Quick Stats Grid (4 Cards) */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <Card className="border-slate-800 bg-slate-900/90 text-white p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Total Disk Storage</p>
              <p className="text-xl font-extrabold text-white mt-1">{formatSize(totalSizeBytes)}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Host PC Mounted Volume</p>
            </div>
            <div className="p-3 rounded-2xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
              <Database className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90 text-white p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Project Folders</p>
              <p className="text-xl font-extrabold text-indigo-300 mt-1">{allFolderList.length}</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Active Directory Trees</p>
            </div>
            <div className="p-3 rounded-2xl bg-emerald-600/20 text-emerald-400 border border-emerald-500/30">
              <Folder className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90 text-white p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Raw Video & Photos</p>
              <p className="text-xl font-extrabold text-amber-300 mt-1">
                {videoFilesCount} Videos • {photoFilesCount} Photos
              </p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">Total {files.length} Files Recorded</p>
            </div>
            <div className="p-3 rounded-2xl bg-amber-600/20 text-amber-400 border border-amber-500/30">
              <Film className="w-6 h-6" />
            </div>
          </div>
        </Card>

        <Card className="border-slate-800 bg-slate-900/90 text-white p-5 shadow-xl backdrop-blur-xl">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Transfer Engine</p>
              <p className="text-xl font-extrabold text-purple-300 mt-1">5MB Resumable</p>
              <p className="text-[10px] text-slate-400 font-mono mt-1">3x Parallel Chunk Pool</p>
            </div>
            <div className="p-3 rounded-2xl bg-purple-600/20 text-purple-400 border border-purple-500/30">
              <Zap className="w-6 h-6" />
            </div>
          </div>
        </Card>
      </div>

      {rescanMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {rescanMessage}
        </div>
      )}

      {/* Create Folder Modal */}
      {showFolderModal && (
        <div className="fixed inset-0 bg-slate-950/80 backdrop-blur-md flex items-center justify-center z-50 p-4">
          <div className="bg-slate-900 border border-slate-800 text-white rounded-2xl max-w-md w-full p-6 shadow-2xl space-y-5">
            <div className="flex items-center justify-between border-b border-slate-800 pb-3">
              <h3 className="text-base font-bold text-indigo-300 flex items-center gap-2">
                <FolderPlus className="w-5 h-5 text-indigo-400" /> Create Custom Project Folder
              </h3>
              <button
                type="button"
                onClick={() => setShowFolderModal(false)}
                className="text-slate-400 hover:text-white"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            <form onSubmit={handleCreateFolder} className="space-y-4">
              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Folder Name</label>
                <input
                  type="text"
                  required
                  placeholder="e.g. Wedding_Raw_Footage_2024"
                  value={newFolderName}
                  onChange={(e) => setNewFolderName(e.target.value)}
                  className="w-full bg-slate-950 border border-slate-800 rounded-xl px-4 py-2.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
                />
              </div>

              <div>
                <label className="text-xs font-bold text-slate-300 block mb-1.5">Folder Tag Color</label>
                <div className="flex items-center gap-3">
                  {['#3B82F6', '#10B981', '#F59E0B', '#EC4899', '#8B5CF6', '#6366F1'].map((color) => (
                    <button
                      key={color}
                      type="button"
                      onClick={() => setNewFolderColor(color)}
                      style={{ backgroundColor: color }}
                      className={`w-7 h-7 rounded-full border-2 transition-all ${
                        newFolderColor === color ? 'border-white scale-110 shadow-lg' : 'border-transparent'
                      }`}
                    />
                  ))}
                </div>
              </div>

              <div className="flex items-center gap-3 pt-2">
                <Button
                  type="submit"
                  disabled={isCreatingFolder}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs flex-1 py-2.5"
                >
                  {isCreatingFolder ? 'Creating...' : 'Create Folder'}
                </Button>
                <Button
                  type="button"
                  onClick={() => setShowFolderModal(false)}
                  variant="ghost"
                  className="text-slate-400 hover:text-white text-xs flex-1"
                >
                  Cancel
                </Button>
              </div>
            </form>
          </div>
        </div>
      )}

      {/* Resumable Uploader Component */}
      <ResumableUploader onUploadSuccess={fetchFilesAndFolders} />

      {/* Storage Organization & Folders Overview */}
      <div className="space-y-6">
        {/* Navigation Tabs & Search Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: 'ALL', label: `All Assets (${files.length})`, icon: Layers },
              { key: 'FOLDERS', label: `📁 Project Folders (${allFolderList.length})`, icon: Folder },
              { key: 'VIDEO', label: `🎥 Videos (${videoFilesCount})`, icon: FileVideo },
              { key: 'IMAGE', label: `📷 Photos & RAW (${photoFilesCount})`, icon: FileImage },
              { key: 'DOCS', label: '📄 Docs & ZIP', icon: FileText },
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => {
                  setActiveTab(tab.key as any);
                  if (tab.key !== 'FOLDERS') setSelectedFolder(null);
                }}
                className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all flex items-center gap-1.5 ${
                  activeTab === tab.key
                    ? 'bg-indigo-600 text-white shadow-lg shadow-indigo-600/30'
                    : 'bg-slate-950/60 text-slate-400 hover:text-white hover:bg-slate-800'
                }`}
              >
                {tab.label}
              </button>
            ))}
          </div>

          {/* Search Box */}
          <div className="relative min-w-[240px]">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-2.5" />
            <input
              type="text"
              placeholder="Search files or folders..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-slate-950 border border-slate-800 rounded-xl pl-9 pr-4 py-1.5 text-xs text-white placeholder-slate-500 focus:outline-none focus:border-indigo-500"
            />
          </div>
        </div>

        {/* Folders Cards View */}
        {allFolderList.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {allFolderList.map((folderName) => {
              const matchedDbFolder = folders.find((f) => f.name === folderName);
              const folderFiles = files.filter(
                (f) => (f.folderPath || 'Root Direct Uploads').includes(folderName)
              );
              const totalSize = folderFiles.reduce((acc, f) => acc + (Number(f.size) || 0), 0);
              const isSelected = selectedFolder === folderName;

              return (
                <div
                  key={folderName}
                  onClick={() => setSelectedFolder(isSelected ? null : folderName)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-xl shadow-indigo-500/10 scale-[1.02]'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div
                      className="p-3 rounded-xl text-indigo-400 border border-indigo-500/30"
                      style={{ backgroundColor: `${matchedDbFolder?.color || '#3B82F6'}20` }}
                    >
                      {isSelected ? <FolderOpen className="w-6 h-6" /> : <Folder className="w-6 h-6" />}
                    </div>

                    <div className="flex items-center gap-1.5">
                      <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-indigo-300 text-[10px] font-mono font-bold border border-slate-800">
                        {folderFiles.length} {folderFiles.length === 1 ? 'File' : 'Files'}
                      </span>

                      {matchedDbFolder && (
                        <a
                          href={`/api/folders/${matchedDbFolder.id}/download-zip`}
                          download
                          onClick={(e) => e.stopPropagation()}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-indigo-600/30 text-indigo-300 border border-slate-700 transition-all"
                          title="Download Folder ZIP"
                        >
                          <FileArchive className="w-3.5 h-3.5" />
                        </a>
                      )}

                      {matchedDbFolder && (
                        <button
                          type="button"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteFolder(matchedDbFolder.id);
                          }}
                          className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700 transition-all"
                          title="Delete Folder"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                  </div>

                  <p className="font-bold text-sm text-white truncate" title={folderName}>
                    {folderName}
                  </p>
                  <p className="text-xs text-slate-400 font-mono mt-1">Total Size: {formatSize(totalSize)}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Folder Breadcrumb Filter */}
        {selectedFolder && (
          <div className="p-3.5 bg-indigo-600/10 border border-indigo-500/30 rounded-xl flex items-center justify-between text-xs text-indigo-300">
            <span className="flex items-center gap-2 font-bold">
              <FolderOpen className="w-4 h-4 text-indigo-400" /> Filtered by Project Folder: {selectedFolder}
            </span>
            <button
              onClick={() => setSelectedFolder(null)}
              className="text-slate-400 hover:text-white underline font-mono text-[11px]"
            >
              Clear Filter
            </button>
          </div>
        )}

        {/* Uploaded Files Table */}
        <Card className="border-slate-800 bg-slate-900/90 text-white shadow-2xl backdrop-blur-xl">
          <CardHeader className="border-b border-slate-800 pb-4">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-bold text-indigo-300 uppercase tracking-wide">
                Files & Assets Registry ({filteredFiles.length})
              </CardTitle>
              <Button size="sm" variant="ghost" onClick={fetchFilesAndFolders} className="text-slate-400 hover:text-white text-xs gap-1">
                <RefreshCw className="w-3.5 h-3.5" /> Refresh Registry
              </Button>
            </div>
          </CardHeader>

          <CardContent className="pt-4">
            {loading ? (
              <div className="py-8 text-center text-slate-500 text-xs animate-pulse">
                Loading files from server storage...
              </div>
            ) : filteredFiles.length === 0 ? (
              <div className="py-12 text-center text-slate-500 text-xs italic">
                No files found in registry. Select files or drop project folders above to begin resumable upload.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
                      <th className="py-3 px-4">File Name & Directory</th>
                      <th className="py-3 px-4">Size</th>
                      <th className="py-3 px-4">Status</th>
                      <th className="py-3 px-4">Uploaded Date</th>
                      <th className="py-3 px-4 text-right">Actions</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-800/60">
                    {filteredFiles.map((file) => (
                      <tr key={file.id} className="hover:bg-slate-800/40 transition-all">
                        <td className="py-3 px-4">
                          <div className="flex items-center space-x-3">
                            <div className="p-2 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0">
                              {file.mimeType?.startsWith('video') ? (
                                <FileVideo className="w-4 h-4" />
                              ) : file.mimeType?.startsWith('image') ? (
                                <FileImage className="w-4 h-4" />
                              ) : (
                                <FileText className="w-4 h-4" />
                              )}
                            </div>
                            <div>
                              <div className="flex items-center gap-2">
                                <p className="font-bold text-white leading-tight">{file.originalName}</p>
                                {file.folderPath && (
                                  <span className="px-2 py-0.5 bg-slate-800 text-indigo-300 rounded text-[10px] font-mono flex items-center gap-1 border border-slate-700">
                                    <Folder className="w-3 h-3 text-indigo-400" /> {file.folderPath}
                                  </span>
                                )}
                              </div>
                              <p className="text-[10px] text-slate-500 font-mono mt-0.5">{file.storedName}</p>
                            </div>
                          </div>
                        </td>

                        <td className="py-3 px-4 font-mono text-slate-300 font-bold">
                          {formatSize(file.size)}
                        </td>

                        <td className="py-3 px-4">
                          <span
                            className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                              file.status === 'COMPLETED'
                                ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                                : 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            }`}
                          >
                            {file.status}
                          </span>
                        </td>

                        <td className="py-3 px-4 text-slate-400 font-mono text-[11px]">
                          {new Date(file.createdAt).toLocaleDateString('en-IN', {
                            day: 'numeric',
                            month: 'short',
                            year: 'numeric',
                          })}
                        </td>

                        <td className="py-3 px-4 text-right space-x-2">
                          <a
                            href={`/api/files/download/${file.id}`}
                            download
                            className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/30 text-indigo-300 border border-indigo-500/30 text-[11px] font-bold transition-all"
                          >
                            <DownloadCloud className="w-3.5 h-3.5" /> Download
                          </a>

                          <button
                            type="button"
                            onClick={() => handleDeleteFile(file.id)}
                            className="p-1.5 rounded-lg bg-rose-500/20 hover:bg-rose-500/30 text-rose-400 border border-rose-500/30 transition-all"
                            title="Delete File"
                          >
                            <Trash2 className="w-3.5 h-3.5" />
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
