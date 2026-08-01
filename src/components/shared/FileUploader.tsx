'use client';

import React, { useState, useRef } from 'react';
import {
  UploadCloud,
  File,
  X,
  CheckCircle2,
  Folder,
  Pause,
  Play,
  RotateCcw,
  Loader2,
  AlertCircle,
  FileVideo,
  FileImage,
  FileText,
} from 'lucide-react';
import { Button } from '@/components/ui/button';
import axios from 'axios';

interface FileUploaderProps {
  onFilesSelected?: (files: any[]) => void;
  acceptedTypes?: string;
  multiple?: boolean;
}

export interface UploadQueueItem {
  id: string; // session id on server
  file: File;
  name: string;
  size: number;
  relativePath: string;
  status: 'QUEUED' | 'UPLOADING' | 'PAUSED' | 'COMPLETED' | 'FAILED';
  progress: number;
  uploadedBytes: number;
  error?: string;
}

const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunk size

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  acceptedTypes = 'image/*,video/*,.pdf,.zip',
  multiple = true,
}) => {
  const [queue, setQueue] = useState<UploadQueueItem[]>([]);
  const [isUploading, setIsUploading] = useState(false);
  const [isDragOver, setIsDragOver] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);
  const folderInputRef = useRef<HTMLInputElement>(null);

  // Helper to format bytes
  const formatSize = (bytes: number) => {
    if (!bytes || bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  // Add files to upload queue and trigger automatic chunked uploading
  const addFilesToQueue = async (fileList: Array<{ file: File; relativePath?: string }>) => {
    const newItems: UploadQueueItem[] = fileList.map((item) => ({
      id: `temp_${Math.random().toString(36).substring(2, 9)}`,
      file: item.file,
      name: item.file.name,
      size: item.file.size,
      relativePath: item.relativePath || item.file.name,
      status: 'QUEUED',
      progress: 0,
      uploadedBytes: 0,
    }));

    setQueue((prev) => [...prev, ...newItems]);

    // Automatically start uploading queue
    startUploads([...queue, ...newItems]);
  };

  // Process chunked uploads
  const startUploads = async (items: UploadQueueItem[]) => {
    setIsUploading(true);

    for (let i = 0; i < items.length; i++) {
      const item = items[i];
      if (item.status === 'COMPLETED') continue;

      try {
        // Update status to UPLOADING
        setQueue((prev) =>
          prev.map((q) => (q.name === item.name ? { ...q, status: 'UPLOADING' } : q))
        );

        // 1. Initialize upload session on server
        const initRes = await axios.post('/api/files/upload', {
          fileName: item.name,
          fileSize: item.size,
          mimeType: item.file.type || 'application/octet-stream',
          folderPath: item.relativePath ? item.relativePath.split('/')[0] : '',
        });

        const uploadId = initRes.data.uploadId;
        const totalChunks = Math.ceil(item.size / CHUNK_SIZE);
        let uploadedBytes = 0;

        // 2. Upload file in 5MB binary chunks
        for (let chunkIndex = 0; chunkIndex < totalChunks; chunkIndex++) {
          const start = chunkIndex * CHUNK_SIZE;
          const end = Math.min(item.size, start + CHUNK_SIZE);
          const chunk = item.file.slice(start, end);

          await axios.patch(`/api/files/upload/${uploadId}`, chunk, {
            headers: {
              'Content-Type': 'application/octet-stream',
              'X-Chunk-Index': chunkIndex.toString(),
              'X-Total-Chunks': totalChunks.toString(),
            },
          });

          uploadedBytes = end;
          const percent = Math.round((uploadedBytes / item.size) * 100);

          setQueue((prev) =>
            prev.map((q) =>
              q.name === item.name
                ? { ...q, id: uploadId, progress: percent, uploadedBytes }
                : q
            )
          );
        }

        // 3. Finalize upload
        await axios.post(`/api/files/complete/${uploadId}`);

        setQueue((prev) =>
          prev.map((q) =>
            q.name === item.name
              ? { ...q, status: 'COMPLETED', progress: 100 }
              : q
          )
        );
      } catch (err: any) {
        console.error(`Upload error for ${item.name}:`, err);
        setQueue((prev) =>
          prev.map((q) =>
            q.name === item.name
              ? { ...q, status: 'FAILED', error: err.message || 'Upload failed' }
              : q
          )
        );
      }
    }

    setIsUploading(false);

    if (onFilesSelected) {
      onFilesSelected(items.filter((i) => i.status === 'COMPLETED'));
    }
  };

  // HTML5 DataTransferItem directory scanner
  const handleDrop = async (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);

    const items = e.dataTransfer.items;
    const collectedFiles: Array<{ file: File; relativePath?: string }> = [];

    if (items) {
      for (let i = 0; i < items.length; i++) {
        const item = items[i];
        if (item.kind === 'file') {
          const entry = item.webkitGetAsEntry ? item.webkitGetAsEntry() : null;
          if (entry) {
            await scanEntry(entry, '', collectedFiles);
          } else {
            const file = item.getAsFile();
            if (file) collectedFiles.push({ file });
          }
        }
      }
    } else {
      const files = Array.from(e.dataTransfer.files);
      files.forEach((file) => collectedFiles.push({ file }));
    }

    if (collectedFiles.length > 0) {
      addFilesToQueue(collectedFiles);
    }
  };

  const scanEntry = async (
    entry: any,
    currentPath: string,
    result: Array<{ file: File; relativePath?: string }>
  ) => {
    if (entry.isFile) {
      return new Promise<void>((resolve) => {
        entry.file((file: File) => {
          result.push({
            file,
            relativePath: currentPath ? `${currentPath}/${file.name}` : file.name,
          });
          resolve();
        });
      });
    } else if (entry.isDirectory) {
      const dirReader = entry.createReader();
      const readAllEntries = async (): Promise<any[]> => {
        let entries: any[] = [];
        let read = await new Promise<any[]>((res) => dirReader.readEntries(res));
        while (read.length > 0) {
          entries = entries.concat(read);
          read = await new Promise<any[]>((res) => dirReader.readEntries(res));
        }
        return entries;
      };

      const entries = await readAllEntries();
      for (const childEntry of entries) {
        await scanEntry(
          childEntry,
          currentPath ? `${currentPath}/${entry.name}` : entry.name,
          result
        );
      }
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files).map((file) => ({ file }));
      addFilesToQueue(selected);
    }
  };

  const removeItem = (id: string) => {
    setQueue((prev) => prev.filter((q) => q.id !== id));
  };

  return (
    <div className="space-y-4">
      {/* Hidden File Inputs */}
      <input
        ref={fileInputRef}
        type="file"
        multiple={multiple}
        accept={acceptedTypes}
        onChange={handleFileChange}
        className="hidden"
      />
      <input
        ref={folderInputRef}
        type="file"
        // @ts-ignore
        webkitdirectory="true"
        directory="true"
        onChange={handleFileChange}
        className="hidden"
      />

      {/* Main Drag & Drop Zone */}
      <div
        onDragOver={(e) => {
          e.preventDefault();
          setIsDragOver(true);
        }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
        className={`border-2 border-dashed rounded-2xl p-8 text-center cursor-pointer transition-all duration-300 relative ${
          isDragOver
            ? 'border-indigo-500 bg-indigo-600/20 shadow-2xl scale-[1.01]'
            : 'border-slate-800 hover:border-indigo-500/50 bg-slate-950/70 hover:bg-slate-900/90'
        }`}
      >
        <div className="mx-auto w-14 h-14 rounded-2xl bg-indigo-600/20 text-indigo-400 flex items-center justify-center mb-3 border border-indigo-500/30 shadow-lg">
          <UploadCloud className="w-7 h-7 text-indigo-400" />
        </div>

        <p className="font-extrabold text-base text-white">
          Click to upload or drag & drop assets & project folders here
        </p>
        <p className="text-xs text-slate-400 mt-1 max-w-md mx-auto">
          Supports RAW photos, 4K MP4/MOV videos, ZIP archives & full directory trees with 5MB chunked resumable upload engine.
        </p>

        <div className="flex flex-wrap items-center justify-center gap-3 mt-4" onClick={(e) => e.stopPropagation()}>
          <Button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold text-xs gap-1.5 shadow-md px-4 py-2"
          >
            <UploadCloud className="w-4 h-4" /> Select 1000+ Files
          </Button>

          <Button
            type="button"
            onClick={() => folderInputRef.current?.click()}
            className="bg-slate-800 hover:bg-slate-700 text-indigo-300 border border-slate-700 font-bold text-xs gap-1.5 px-4 py-2"
          >
            <Folder className="w-4 h-4 text-indigo-400" /> Select Entire Folder
          </Button>
        </div>
      </div>

      {/* Live Upload Progress Queue */}
      {queue.length > 0 && (
        <div className="space-y-3 p-4 bg-slate-900/90 rounded-2xl border border-slate-800 text-white">
          <div className="flex items-center justify-between border-b border-slate-800 pb-2.5">
            <span className="text-xs font-bold text-indigo-300 uppercase tracking-wider flex items-center gap-2">
              <Loader2 className={`w-4 h-4 text-indigo-400 ${isUploading ? 'animate-spin' : ''}`} />
              Live Chunked Upload Progress ({queue.filter((q) => q.status === 'COMPLETED').length} / {queue.length} Done)
            </span>
            <span className="text-[11px] font-mono text-slate-400">
              Total Queue: {formatSize(queue.reduce((acc, q) => acc + q.size, 0))}
            </span>
          </div>

          <div className="space-y-2.5 max-h-72 overflow-y-auto pr-1">
            {queue.map((item) => (
              <div
                key={item.id}
                className="p-3 bg-slate-950 rounded-xl border border-slate-800/80 space-y-2"
              >
                <div className="flex items-center justify-between text-xs">
                  <div className="flex items-center space-x-2.5 truncate max-w-xs sm:max-w-md">
                    {item.file.type?.startsWith('video') ? (
                      <FileVideo className="w-4 h-4 text-indigo-400 shrink-0" />
                    ) : item.file.type?.startsWith('image') ? (
                      <FileImage className="w-4 h-4 text-emerald-400 shrink-0" />
                    ) : (
                      <FileText className="w-4 h-4 text-amber-400 shrink-0" />
                    )}
                    <span className="font-bold text-white truncate" title={item.relativePath}>
                      {item.relativePath}
                    </span>
                  </div>

                  <div className="flex items-center space-x-3">
                    <span className="font-mono text-[11px] text-slate-400">
                      {formatSize(item.uploadedBytes)} / {formatSize(item.size)}
                    </span>

                    {/* Status Badge */}
                    <span
                      className={`px-2.5 py-0.5 rounded-full text-[10px] font-extrabold uppercase border flex items-center gap-1 ${
                        item.status === 'COMPLETED'
                          ? 'bg-emerald-500/20 text-emerald-300 border-emerald-500/30'
                          : item.status === 'UPLOADING'
                          ? 'bg-indigo-500/20 text-indigo-300 border-indigo-500/30 animate-pulse'
                          : item.status === 'FAILED'
                          ? 'bg-rose-500/20 text-rose-300 border-rose-500/30'
                          : 'bg-slate-800 text-slate-400 border-slate-700'
                      }`}
                    >
                      {item.status === 'COMPLETED' ? (
                        <>
                          <CheckCircle2 className="w-3 h-3 text-emerald-400" /> COMPLETED (100%)
                        </>
                      ) : item.status === 'UPLOADING' ? (
                        <>
                          <Loader2 className="w-3 h-3 animate-spin text-indigo-400" /> UPLOADING ({item.progress}%)
                        </>
                      ) : item.status === 'FAILED' ? (
                        <>
                          <AlertCircle className="w-3 h-3 text-rose-400" /> FAILED
                        </>
                      ) : (
                        'QUEUED'
                      )}
                    </span>

                    <button
                      type="button"
                      onClick={() => removeItem(item.id)}
                      className="text-slate-500 hover:text-rose-400 transition-colors"
                    >
                      <X className="w-4 h-4" />
                    </button>
                  </div>
                </div>

                {/* Animated Progress Bar */}
                <div className="w-full bg-slate-900 rounded-full h-2 overflow-hidden p-0.5 border border-slate-800">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      item.status === 'COMPLETED'
                        ? 'bg-gradient-to-r from-emerald-500 to-teal-400 shadow-md shadow-emerald-500/30'
                        : item.status === 'FAILED'
                        ? 'bg-rose-500'
                        : 'bg-gradient-to-r from-indigo-500 via-purple-500 to-indigo-400 animate-pulse'
                    }`}
                    style={{ width: `${item.progress}%` }}
                  />
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
