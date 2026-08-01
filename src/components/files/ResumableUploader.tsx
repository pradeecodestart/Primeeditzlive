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
} from 'lucide-react';
import axios from 'axios';

interface ResumableUploaderProps {
  onUploadSuccess?: () => void;
}

export const ResumableUploader: React.FC<ResumableUploaderProps> = ({ onUploadSuccess }) => {
  const [file, setFile] = useState<File | null>(null);
  const [uploadId, setUploadId] = useState<string | null>(null);
  const [progress, setProgress] = useState(0);
  const [uploadedBytes, setUploadedBytes] = useState(0);
  const [status, setStatus] = useState<'IDLE' | 'UPLOADING' | 'PAUSED' | 'COMPLETED' | 'ERROR'>('IDLE');
  const [errorMessage, setErrorMessage] = useState('');

  const isPausedRef = useRef(false);
  const currentChunkIndexRef = useRef(0);
  const CHUNK_SIZE = 5 * 1024 * 1024; // 5MB chunks

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      setFile(e.target.files[0]);
      setStatus('IDLE');
      setProgress(0);
      setUploadedBytes(0);
      setUploadId(null);
      setErrorMessage('');
    }
  };

  const startOrResumeUpload = async () => {
    if (!file) return;

    setStatus('UPLOADING');
    isPausedRef.current = false;
    setErrorMessage('');

    try {
      let activeUploadId = uploadId;
      let startOffset = uploadedBytes;

      // Initialize upload session if not started
      if (!activeUploadId) {
        const initRes = await axios.post('/api/files/upload', {
          fileName: file.name,
          fileSize: file.size,
          mimeType: file.type || 'application/octet-stream',
          uniqueKey: `${file.name}-${file.size}-${file.lastModified}`,
        });

        activeUploadId = initRes.data.uploadId;
        setUploadId(activeUploadId);
        startOffset = 0;
        currentChunkIndexRef.current = 0;
      }

      const totalChunks = Math.ceil(file.size / CHUNK_SIZE);

      for (let i = currentChunkIndexRef.current; i < totalChunks; i++) {
        if (isPausedRef.current) {
          setStatus('PAUSED');
          return;
        }

        const start = i * CHUNK_SIZE;
        const end = Math.min(start + CHUNK_SIZE, file.size);
        const chunkBlob = file.slice(start, end);

        // Convert Blob to ArrayBuffer
        const arrayBuffer = await chunkBlob.arrayBuffer();

        await axios.patch(`/api/files/upload/${activeUploadId}`, arrayBuffer, {
          headers: {
            'Content-Type': 'application/octet-stream',
          },
        });

        currentChunkIndexRef.current = i + 1;
        const currentBytes = Math.min((i + 1) * CHUNK_SIZE, file.size);
        setUploadedBytes(currentBytes);
        const currentPercent = Math.round((currentBytes / file.size) * 100);
        setProgress(currentPercent);
      }

      // Complete upload
      await axios.post(`/api/files/complete/${activeUploadId}`);
      setStatus('COMPLETED');
      setProgress(100);
      if (onUploadSuccess) onUploadSuccess();
    } catch (err: any) {
      console.error('Resumable upload error:', err);
      setStatus('ERROR');
      setErrorMessage(err.response?.data?.error || err.message || 'Upload failed');
    }
  };

  const pauseUpload = () => {
    isPausedRef.current = true;
    setStatus('PAUSED');
  };

  const formatSize = (bytes: number) => {
    if (bytes === 0) return '0 B';
    const k = 1024;
    const sizes = ['B', 'KB', 'MB', 'GB', 'TB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <Card className="border-slate-800 bg-slate-900/90 text-white shadow-2xl backdrop-blur-xl">
      <CardHeader className="border-b border-slate-800 pb-4">
        <div className="flex items-center justify-between">
          <CardTitle className="text-base font-bold text-indigo-300 flex items-center gap-2 uppercase tracking-wide">
            <UploadCloud className="w-5 h-5 text-indigo-400" /> Resumable Large Footage Uploader
          </CardTitle>
          <span className="px-3 py-1 bg-indigo-500/20 text-indigo-300 rounded-full text-xs font-mono font-bold border border-indigo-500/30">
            5MB CHUNK RESUMABLE (TUS / REST)
          </span>
        </div>
      </CardHeader>

      <CardContent className="space-y-6 pt-6">
        {/* Dropzone Input */}
        {!file && (
          <label className="border-2 border-dashed border-slate-700 hover:border-indigo-500 rounded-2xl p-8 flex flex-col items-center justify-center cursor-pointer transition-all bg-slate-950/60 hover:bg-slate-900">
            <div className="p-4 rounded-2xl bg-indigo-600/20 text-indigo-400 mb-3 border border-indigo-500/30">
              <UploadCloud className="w-8 h-8" />
            </div>
            <span className="text-sm font-bold text-white mb-1">
              Click to select or drag raw footage & files here
            </span>
            <span className="text-xs text-slate-400 font-mono">
              Supports 4K MP4, MOV, RAW Images, Audio, ZIP up to 10GB+
            </span>
            <input type="file" onChange={handleFileChange} className="hidden" />
          </label>
        )}

        {/* Selected File Details */}
        {file && (
          <div className="space-y-4">
            <div className="flex items-center justify-between p-4 rounded-xl bg-slate-950 border border-slate-800">
              <div className="flex items-center space-x-3">
                <div className="p-3 rounded-lg bg-indigo-600/20 text-indigo-400">
                  {file.type.startsWith('video') ? (
                    <FileVideo className="w-6 h-6" />
                  ) : file.type.startsWith('image') ? (
                    <FileImage className="w-6 h-6" />
                  ) : (
                    <FileText className="w-6 h-6" />
                  )}
                </div>
                <div>
                  <p className="font-bold text-sm text-white">{file.name}</p>
                  <p className="text-xs text-slate-400 font-mono">
                    Size: {formatSize(file.size)} • {file.type || 'RAW/Binary'}
                  </p>
                </div>
              </div>

              <Button
                variant="ghost"
                size="sm"
                onClick={() => {
                  setFile(null);
                  setStatus('IDLE');
                }}
                className="text-slate-400 hover:text-white"
              >
                Change File
              </Button>
            </div>

            {/* Progress Bar & Status */}
            {status !== 'IDLE' && (
              <div className="space-y-2">
                <div className="flex justify-between text-xs font-bold font-mono">
                  <span className="text-slate-300">
                    Progress: {progress}% ({formatSize(uploadedBytes)} / {formatSize(file.size)})
                  </span>
                  <span
                    className={
                      status === 'COMPLETED'
                        ? 'text-emerald-400'
                        : status === 'PAUSED'
                        ? 'text-amber-400'
                        : status === 'ERROR'
                        ? 'text-rose-400'
                        : 'text-indigo-400'
                    }
                  >
                    STATUS: {status}
                  </span>
                </div>

                <div className="h-3 w-full bg-slate-950 rounded-full overflow-hidden border border-slate-800 p-0.5">
                  <div
                    className={`h-full rounded-full transition-all duration-300 ${
                      status === 'COMPLETED'
                        ? 'bg-emerald-500 shadow-lg shadow-emerald-500/50'
                        : status === 'PAUSED'
                        ? 'bg-amber-500'
                        : status === 'ERROR'
                        ? 'bg-rose-500'
                        : 'bg-indigo-600 shadow-lg shadow-indigo-600/50'
                    }`}
                    style={{ width: `${progress}%` }}
                  />
                </div>
              </div>
            )}

            {/* Error Display */}
            {status === 'ERROR' && (
              <div className="p-3 bg-rose-500/10 border border-rose-500/30 rounded-xl text-xs text-rose-300 flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0" />
                <span>{errorMessage}</span>
              </div>
            )}

            {/* Success Display */}
            {status === 'COMPLETED' && (
              <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-xl text-xs text-emerald-300 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0" />
                  <span className="font-bold">File Upload Completed & Verified on Disk!</span>
                </div>
                <Button
                  size="sm"
                  onClick={() => {
                    setFile(null);
                    setStatus('IDLE');
                  }}
                  className="bg-emerald-600 hover:bg-emerald-500 text-white font-bold"
                >
                  Upload Another File
                </Button>
              </div>
            )}

            {/* Controls */}
            {status !== 'COMPLETED' && (
              <div className="flex items-center gap-3">
                {status === 'IDLE' || status === 'PAUSED' || status === 'ERROR' ? (
                  <Button
                    onClick={startOrResumeUpload}
                    className="bg-indigo-600 hover:bg-indigo-500 text-white font-bold gap-2 px-6 shadow-lg shadow-indigo-600/30"
                  >
                    <Play className="w-4 h-4" /> {status === 'PAUSED' ? 'Resume Upload' : 'Start Upload'}
                  </Button>
                ) : (
                  <Button
                    onClick={pauseUpload}
                    className="bg-amber-600 hover:bg-amber-500 text-white font-bold gap-2 px-6 shadow-lg shadow-amber-600/30"
                  >
                    <Pause className="w-4 h-4" /> Pause Upload
                  </Button>
                )}
              </div>
            )}
          </div>
        )}
      </CardContent>
    </Card>
  );
};
