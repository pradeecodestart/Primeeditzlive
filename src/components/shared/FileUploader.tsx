'use client';
import React, { useState } from 'react';
import { UploadCloud, File, X, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface FileUploaderProps {
  onFilesSelected?: (files: File[]) => void;
  acceptedTypes?: string;
  multiple?: boolean;
}

export const FileUploader: React.FC<FileUploaderProps> = ({
  onFilesSelected,
  acceptedTypes = 'image/*,video/*,.pdf,.zip',
  multiple = true,
}) => {
  const [files, setFiles] = useState<File[]>([]);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      const selected = Array.from(e.target.files);
      const newFiles = [...files, ...selected];
      setFiles(newFiles);
      if (onFilesSelected) onFilesSelected(newFiles);
    }
  };

  const removeFile = (index: number) => {
    const updated = files.filter((_, i) => i !== index);
    setFiles(updated);
    if (onFilesSelected) onFilesSelected(updated);
  };

  return (
    <div className="space-y-4">
      <div className="border-2 border-dashed border-slate-300 dark:border-slate-700 rounded-xl p-6 text-center hover:border-indigo-500 transition-colors bg-slate-50 dark:bg-slate-900/50 cursor-pointer relative">
        <input
          type="file"
          multiple={multiple}
          accept={acceptedTypes}
          onChange={handleFileChange}
          className="absolute inset-0 opacity-0 cursor-pointer w-full h-full"
        />
        <UploadCloud className="mx-auto h-12 w-12 text-indigo-500 mb-2" />
        <p className="font-semibold text-slate-800 dark:text-slate-200">
          Click to upload or drag & drop assets
        </p>
        <p className="text-xs text-slate-500 mt-1">
          Supports RAW, JPG, PNG, MP4, MOV, ZIP files up to 500MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, idx) => (
            <div
              key={idx}
              className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-lg bg-white dark:bg-slate-900"
            >
              <div className="flex items-center space-x-3">
                <File className="h-5 w-5 text-indigo-600" />
                <div>
                  <p className="text-sm font-medium text-slate-800 dark:text-slate-200 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-400">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="h-4 w-4 text-green-500" />
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={() => removeFile(idx)}
                  className="h-8 w-8 text-slate-400 hover:text-red-500"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};
