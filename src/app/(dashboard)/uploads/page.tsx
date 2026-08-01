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
  Search,
  Filter,
  Layers,
} from 'lucide-react';
import axios from 'axios';
import { useSession } from 'next-auth/react';

export default function UploadsPage() {
  const { data: session } = useSession();
  const [files, setFiles] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [isRescanning, setIsRescanning] = useState(false);
  const [rescanMessage, setRescanMessage] = useState('');

  const [activeTab, setActiveTab] = useState<'ALL' | 'FOLDERS' | 'VIDEO' | 'IMAGE' | 'AUDIO' | 'DOCS'>('ALL');
  const [searchQuery, setSearchQuery] = useState('');
  const [selectedFolder, setSelectedFolder] = useState<string | null>(null);

  const userRole = (session?.user as any)?.role || 'CLIENT';
  const isStaffOrAdmin = ['SUPER_ADMIN', 'ADMIN', 'MANAGER', 'CEO', 'PROJECT_MANAGER'].includes(userRole);

  const [mounted, setMounted] = useState(false);

  const fetchFiles = async () => {
    try {
      setLoading(true);
      const res = await axios.get('/api/files');
      setFiles(res.data.files || []);
    } catch (err) {
      console.error('Error fetching files:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    setMounted(true);
    fetchFiles();
  }, []);

  const handleRescan = async () => {
    try {
      setIsRescanning(true);
      setRescanMessage('');
      const res = await axios.post('/api/files/admin/rescan');
      setRescanMessage(res.data.message || 'Rescan completed successfully');
      fetchFiles();
    } catch (err: any) {
      setRescanMessage(err.response?.data?.error || 'Rescan failed');
    } finally {
      setIsRescanning(false);
    }
  };

  const handleDelete = async (id: string) => {
    if (!confirm('Are you sure you want to delete this file from disk and database?')) return;
    try {
      await axios.delete(`/api/files/${id}`);
      fetchFiles();
    } catch (err) {
      alert('Failed to delete file');
    }
  };

  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Group files into virtual folders
  const folderGroups = files.reduce((acc: Record<string, any[]>, file) => {
    const folder = file.folderPath || 'Root Direct Uploads';
    if (!acc[folder]) acc[folder] = [];
    acc[folder].push(file);
    return acc;
  }, {});

  const folderNames = Object.keys(folderGroups);

  // Filter files based on tab, search query, and selected folder
  const filteredFiles = files.filter((file) => {
    const matchesSearch =
      file.originalName.toLowerCase().includes(searchQuery.toLowerCase()) ||
      (file.folderPath && file.folderPath.toLowerCase().includes(searchQuery.toLowerCase()));

    const matchesFolder = selectedFolder ? (file.folderPath || 'Root Direct Uploads') === selectedFolder : true;

    if (!matchesSearch || !matchesFolder) return false;

    if (activeTab === 'VIDEO') return file.mimeType?.startsWith('video');
    if (activeTab === 'IMAGE') return file.mimeType?.startsWith('image');
    if (activeTab === 'AUDIO') return file.mimeType?.startsWith('audio');
    if (activeTab === 'DOCS') return !file.mimeType?.startsWith('video') && !file.mimeType?.startsWith('image') && !file.mimeType?.startsWith('audio');
    if (activeTab === 'FOLDERS') return Boolean(file.folderPath);

    return true;
  });

  return (
    <div className="space-y-8 pb-12">
      {/* Header Banner */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl font-extrabold text-slate-900 dark:text-slate-100 flex items-center gap-2">
            <HardDrive className="w-6 h-6 text-indigo-500" /> Storage & Raw Footage Center
          </h1>
          <p className="text-xs text-slate-500 mt-1">
            Organize raw footage folders, multi-file uploads with resumable chunking & disk storage.
          </p>
        </div>

        {isStaffOrAdmin && (
          <Button
            disabled={isRescanning}
            onClick={handleRescan}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-2 shadow-lg shadow-indigo-600/30"
          >
            <FolderSync className={`w-4 h-4 ${isRescanning ? 'animate-spin' : ''}`} />
            {isRescanning ? 'Scanning Local PC Storage...' : 'Rescan Storage Folder'}
          </Button>
        )}
      </div>

      {rescanMessage && (
        <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-2xl text-xs text-emerald-400 font-bold flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          {rescanMessage}
        </div>
      )}

      {/* Resumable Uploader Component */}
      <ResumableUploader onUploadSuccess={fetchFiles} />

      {/* Storage Organization & Folders Overview */}
      <div className="space-y-6">
        {/* Navigation Tabs & Search Filter */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 rounded-2xl bg-slate-900/90 border border-slate-800 text-white">
          {/* Tabs */}
          <div className="flex flex-wrap items-center gap-2">
            {[
              { key: 'ALL', label: 'All Files', icon: Layers },
              { key: 'FOLDERS', label: `📁 Folders (${folderNames.filter((f) => f !== 'Root Direct Uploads').length})`, icon: Folder },
              { key: 'VIDEO', label: '🎥 Videos', icon: FileVideo },
              { key: 'IMAGE', label: '📷 Photos & RAW', icon: FileImage },
              { key: 'AUDIO', label: '🎵 Audio', icon: FileText },
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
          <div className="relative min-w-[220px]">
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

        {/* Folders Grid View */}
        {folderNames.length > 0 && (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-4">
            {folderNames.map((folderName) => {
              const folderFiles = folderGroups[folderName];
              const totalSize = folderFiles.reduce((acc, f) => acc + (f.size || 0), 0);
              const isSelected = selectedFolder === folderName;

              return (
                <div
                  key={folderName}
                  onClick={() => setSelectedFolder(isSelected ? null : folderName)}
                  className={`p-4 rounded-2xl border cursor-pointer transition-all duration-300 ${
                    isSelected
                      ? 'bg-indigo-600/20 border-indigo-500 shadow-xl shadow-indigo-500/10'
                      : 'bg-slate-900/80 border-slate-800 hover:border-slate-700 hover:bg-slate-900'
                  }`}
                >
                  <div className="flex items-center justify-between mb-3">
                    <div className="p-3 rounded-xl bg-indigo-600/20 text-indigo-400 border border-indigo-500/30">
                      {isSelected ? <FolderOpen className="w-6 h-6" /> : <Folder className="w-6 h-6" />}
                    </div>
                    <span className="px-2.5 py-0.5 rounded-full bg-slate-950 text-indigo-300 text-[10px] font-mono font-bold border border-slate-800">
                      {folderFiles.length} {folderFiles.length === 1 ? 'File' : 'Files'}
                    </span>
                  </div>

                  <p className="font-bold text-sm text-white truncate" title={folderName}>
                    {folderName}
                  </p>
                  <p className="text-xs text-slate-400 font-mono mt-1">Total: {formatSize(totalSize)}</p>
                </div>
              );
            })}
          </div>
        )}

        {/* Selected Folder Breadcrumb Filter */}
        {selectedFolder && (
          <div className="p-3 bg-indigo-600/10 border border-indigo-500/30 rounded-xl flex items-center justify-between text-xs text-indigo-300">
            <span className="flex items-center gap-2 font-bold">
              <FolderOpen className="w-4 h-4 text-indigo-400" /> Filtered by Folder: {selectedFolder}
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
              <Button size="sm" variant="ghost" onClick={fetchFiles} className="text-slate-400 hover:text-white text-xs gap-1">
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
                No files match your selected folder or search query.
              </div>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full text-left text-xs">
                  <thead>
                    <tr className="border-b border-slate-800 text-slate-400 uppercase text-[10px] font-mono">
                      <th className="py-3 px-4">File Name & Folder</th>
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
                            onClick={() => handleDelete(file.id)}
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
