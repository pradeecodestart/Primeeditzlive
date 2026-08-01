'use client';

import React, { useState, useRef } from 'react';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  UploadCloud,
  Play,
  Pause,
  RotateCcw,
  CheckCircle2,
  FileVideo,
  FileImage,
  FileText,
  AlertCircle,
  HardDrive,
  RefreshCw,
  FolderSync,
  Trash2,
  Plus,
  Layers,
  FolderPlus,
  Folder,
} from 'lucide-react';
import axios from 'axios';

interface ResumableUploaderProps {
  onUploadSuccess?: () => void;
}

export interface QueueItem {
  id: string;
  file: File;
  progress: number;
  uploadedBytes: number;
  status: 'IDLE' | 'UPLOADING' | 'PAUSED' | 'COMPLETED' | 'ERROR';
  uploadId?: string;
  errorMessage?: string;
  currentChunkIndex: number;
  folderPath?: string;
}

export const ResumableUploader: React.FC<ResumableUploaderProps> = ({ onUploadSuccess }) => {
  const [queue, setQueue] = useState<QueueItem[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [isBatchUploading, setIsBatchUploading] = useState(false);

  const pausedFlagsRef = useRef<{ [id: string]: boolean }>({});
  const folderInputRef = useRef<HTMLInputElement>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

  // Handle Drag Over / Drag Leave / Drop
  const handleDragOver = (e: React.DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  };

  const addFilesToQueue = (fileList: FileList | File[]) => {
    const newItems: QueueItem[] = Array.from(fileList).map((file) => {
      const relPath = (file as any).webkitRelativePath || '';
      const pathParts = relPath.split('/');
      const folderPath = pathParts.length > 1 ? pathParts.slice(0, -1).join('/') : '';

      return {
        id: `q_${Math.random().toString(36).substring(2, 9)}`,
        file,
        progress: 0,
        uploadedBytes: 0,
        status: 'IDLE',
        currentChunkIndex: 0,
        folderPath,
      };
    });

    setQueue((prev) => [...prev, ...newItems]);
  };

  const handleDrop = (e: React.DragEvent<HTMLLabelElement | HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);

    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      addFilesToQueue(e.dataTransfer.files);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0) {
      addFilesToQueue(e.target.files);
      e.target.value = '';
    }
  };

  const uploadSingleItem = async (item: QueueItem) => {
    pausedFlagsRef.current[item.id] = false;

    setQueue((prev) =>
      prev.map((q) => (q.id === item.id ? { ...q, status: 'UPLOADING', errorMessage: '' } : q))
    );

    try {
      let activeUploadId = item.uploadId;

      if (!activeUploadId) {
        const initRes = await axios.post('/api/files/upload', {
          fileName: item.file.name,
          fileSize: item.file.size,
          mimeType: item.file.type || 'application/octet-stream',
          uniqueKey: `${item.file.name}-${item.file.size}-${item.file.lastModified}`,
          folderPath: item.folderPath || '',
        });

        activeUploadId = initRes.data.uploadId;
        setQueue((prev) =>
          prev.map((q) => (q.id === item.id ? { ...q, uploadId: activeUploadId } : q))
        );
      }

      const totalChunks = Math.ceil(item.file.size / CHUNK_SIZE);
      let startIndex = item.currentChunkIndex || 0;

      for (let i = startIndex; i < totalChunks; i++) {
        if (pausedFlagsRef.current[item.id]) {
          setQueue((prev) =>
            prev.map((q) => (q.id === item.id ? { ...q, status: 'PAUSED', currentChunkIndex: i } : q))
          );
          return false;
        }

        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, item.file.size);
        const chunkBlob = item.file.slice(start, end);
        const arrayBuffer = await chunkBlob.arrayBuffer();

        await axios.patch(`/api/files/upload/${activeUploadId}`, arrayBuffer, {
          headers: { 'Content-Type': 'application/octet-stream' },
        });

        const currentBytes = Math.min((i + 1) * CHUNK_SIZE, item.file.size);
        const currentPercent = Math.round((currentBytes / item.file.size) * 100);

        setQueue((prev) =>
          prev.map((q) =>
            q.id === item.id
              ? {
                  ...q,
                  progress: currentPercent,
                  uploadedBytes: currentBytes,
                  currentChunkIndex: i + 1,
                }
              : q
          )
        );
      }

      await axios.post(`/api/files/complete/${activeUploadId}`);

      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'COMPLETED', progress: 100 } : q))
      );

      if (onUploadSuccess) onUploadSuccess();
      return true;
    } catch (err: any) {
      console.error(`Upload error for ${item.file.name}:`, err);
      const msg = err.response?.data?.error || err.message || 'Upload failed';
      setQueue((prev) =>
        prev.map((q) => (q.id === item.id ? { ...q, status: 'ERROR', errorMessage: msg } : q))
      );
      return false;
    }
  };

  const startAllUploads = async () => {
    setIsBatchUploading(true);
    const pendingItems = queue.filter((q) => q.status === 'IDLE' || q.status === 'PAUSED' || q.status === 'ERROR');

    for (const item of pendingItems) {
      await uploadSingleItem(item);
    }
    setIsBatchUploading(false);
  };

  const pauseSingleItem = (id: string) => {
    pausedFlagsRef.current[id] = true;
    setQueue((prev) =>
      prev.map((q) => (q.id === id ? { ...q, status: 'PAUSED' } : q))
    );
  };

  const removeItem = (id: string) => {
    pausedFlagsRef.current[id] = true;
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  const clearCompleted = () => {
    setQueue((prev) => prev.filter((q) => q.status !== 'COMPLETED'));
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const totalBytesInQueue = queue.reduce((acc, item) => acc + item.file.size, 0);
  const totalUploadedInQueue = queue.reduce((acc, item) => acc + item.uploadedBytes, 0);
  const overallProgress = totalBytesInQueue > 0 ? Math.round((totalUploadedInQueue / totalBytesInQueue) * 100) : 0;

  return (
    <Card className="border-slate-800 bg-slate-900/90 text-white shadow-2xl backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800 pb-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
          <CardTitle className="text-base font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wide">
            <UploadCloud className="w-5 h-5 text-indigo-400" /> Resumable Folders & Multiple Files Uploader
          </CardTitle>
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-mono font-bold border border-indigo-500/30">
              DIRECTORIES & FILES • 5MB CHUNKS
            </span>
          </div>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Drag and Drop Zone & Action Buttons */}
        <div
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          className={`border-2 border-dashed rounded-2xl p-8 flex flex-col items-center justify-center transition-all duration-300 ${
            isDragging
              ? 'border-indigo-400 bg-indigo-600/20 scale-[1.01] shadow-2xl shadow-indigo-500/20'
              : 'border-slate-700 hover:border-indigo-500 bg-slate-950/60 hover:bg-slate-900'
          }`}
        >
          <div className={`p-4 rounded-2xl mb-3 border transition-all ${isDragging ? 'bg-indigo-500 text-white border-indigo-400 animate-bounce' : 'bg-indigo-600/20 text-indigo-400 border-indigo-500/30'}`}>
            <UploadCloud className="w-8 h-8" />
          </div>

          <span className="text-sm font-bold text-white mb-1 text-center">
            {isDragging ? 'Drop your folders or files here now!' : 'DRAG & DROP folders or files here, or choose an option below'}
          </span>

          <span className="text-xs text-slate-400 font-mono text-center mb-5">
            Supports entire folders (e.g. Wedding_Shoot_Day1/), 4K Videos, RAW Photos & Audio
          </span>

          <div className="flex flex-wrap items-center justify-center gap-3">
            <Button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-2 shadow-lg shadow-indigo-600/30"
            >
              <Plus className="w-4 h-4" /> Select Files
            </Button>

            <Button
              type="button"
              onClick={() => folderInputRef.current?.click()}
              className="bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-bold text-xs gap-2"
            >
              <FolderPlus className="w-4 h-4 text-indigo-400" /> Select Entire Folder
            </Button>
          </div>

          <input
            ref={fileInputRef}
            type="file"
            multiple
            onChange={handleFileInputChange}
            className="hidden"
          />

          <input
            ref={folderInputRef}
            type="file"
            {...({ webkitdirectory: '', directory: '', multiple: true } as any)}
            onChange={handleFileInputChange}
            className="hidden"
          />
        </div>

        {/* Batch Queue Header & Controls */}
        {queue.length > 0 && (
          <div className="space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div>
                <p className="font-bold text-sm text-indigo-300 flex items-center gap-2">
                  <Layers className="w-4 h-4 text-indigo-400" /> Upload Queue ({queue.length} Items • Total: {formatSize(totalBytesInQueue)})
                </p>
                <p className="text-xs text-slate-400 font-mono mt-0.5">
                  Overall Batch Progress: {overallProgress}% ({formatSize(totalUploadedInQueue)} uploaded)
                </p>
              </div>

              <div className="flex flex-wrap items-center gap-2">
                <Button
                  onClick={startAllUploads}
                  disabled={isBatchUploading || queue.every((q) => q.status === 'COMPLETED')}
                  className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 shadow-lg shadow-indigo-600/30"
                >
                  <Play className="w-3.5 h-3.5" /> Start All Uploads
                </Button>

                <Button
                  onClick={clearCompleted}
                  variant="ghost"
                  size="sm"
                  className="text-slate-400 hover:text-white text-xs"
                >
                  Clear Completed
                </Button>
              </div>
            </div>

            {/* Individual File Items in Queue */}
            <div className="space-y-3 max-h-[420px] overflow-y-auto pr-1">
              {queue.map((item) => (
                <div
                  key={item.id}
                  className="p-4 rounded-xl bg-slate-950/80 border border-slate-800/80 space-y-3 hover:border-slate-700 transition-all"
                >
                  <div className="flex items-center justify-between gap-3">
                    <div className="flex items-center space-x-3 min-w-0">
                      <div className="p-2.5 rounded-lg bg-indigo-600/20 text-indigo-400 shrink-0">
                        {item.file.type.startsWith('video') ? (
                          <FileVideo className="w-5 h-5" />
                        ) : item.file.type.startsWith('image') ? (
                          <FileImage className="w-5 h-5" />
                        ) : (
                          <FileText className="w-5 h-5" />
                        )}
                      </div>

                      <div className="min-w-0">
                        <div className="flex items-center gap-2">
                          <p className="font-bold text-xs text-white truncate">{item.file.name}</p>
                          {item.folderPath && (
                            <span className="px-2 py-0.5 bg-slate-800 text-indigo-300 rounded text-[10px] font-mono flex items-center gap-1 border border-slate-700">
                              <Folder className="w-3 h-3 text-indigo-400" /> {item.folderPath}
                            </span>
                          )}
                        </div>
                        <p className="text-[10px] text-slate-400 font-mono mt-0.5">
                          {formatSize(item.file.size)} • {item.file.type || 'RAW/Binary'}
                        </p>
                      </div>
                    </div>

                    <div className="flex items-center gap-2 shrink-0">
                      <span
                        className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border ${
                          item.status === 'COMPLETED'
                            ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                            : item.status === 'UPLOADING'
                            ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30'
                            : item.status === 'PAUSED'
                            ? 'bg-amber-500/20 text-amber-300 border-amber-500/30'
                            : item.status === 'ERROR'
                            ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                            : 'bg-slate-800 text-slate-400 border-slate-700'
                        }`}
                      >
                        {item.status}
                      </span>

                      {item.status === 'IDLE' || item.status === 'PAUSED' || item.status === 'ERROR' ? (
                        <button
                          type="button"
                          onClick={() => uploadSingleItem(item)}
                          className="p-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 transition-all"
                          title="Start Upload"
                        >
                          <Play className="w-3.5 h-3.5" />
                        </button>
                      ) : item.status === 'UPLOADING' ? (
                        <button
                          type="button"
                          onClick={() => pauseSingleItem(item.id)}
                          className="p-1.5 rounded-lg bg-amber-500/20 hover:bg-amber-500/40 text-amber-300 border border-amber-500/30 transition-all"
                          title="Pause Upload"
                        >
                          <Pause className="w-3.5 h-3.5" />
                        </button>
                      ) : null}

                      <button
                        type="button"
                        onClick={() => removeItem(item.id)}
                        className="p-1.5 rounded-lg bg-slate-800 hover:bg-rose-500/20 hover:text-rose-400 text-slate-400 border border-slate-700 transition-all"
                        title="Remove from Queue"
                      >
                        <Trash2 className="w-3.5 h-3.5" />
                      </button>
                    </div>
                  </div>

                  {/* Item Progress Bar */}
                  {item.status !== 'IDLE' && (
                    <div className="space-y-1.5">
                      <div className="flex justify-between text-[10px] font-mono font-bold">
                        <span className="text-slate-400">
                          {item.progress}% ({formatSize(item.uploadedBytes)} / {formatSize(item.file.size)})
                        </span>
                        {item.errorMessage && <span className="text-rose-400">{item.errorMessage}</span>}
                      </div>

                      <div className="h-2 w-full bg-slate-900 rounded-full overflow-hidden border border-slate-800">
                        <div
                          className={`h-full rounded-full transition-all duration-300 ${
                            item.status === 'COMPLETED'
                              ? 'bg-emerald-500'
                              : item.status === 'PAUSED'
                              ? 'bg-amber-500'
                              : item.status === 'ERROR'
                              ? 'bg-rose-500'
                              : 'bg-indigo-600'
                          }`}
                          style={{ width: `${item.progress}%` }}
                        />
                      </div>
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
};
