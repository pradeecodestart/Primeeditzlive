'use client';
import React from 'react';
import { FileUploader } from '@/components/shared/FileUploader';
import { OrderFile } from '@/types/order';
import { Button } from '@/components/ui/button';
import { Download, File, Trash2 } from 'lucide-react';

interface OrderFilesUploadProps {
  files?: OrderFile[];
  onUploadSuccess?: (files: any) => void;
  canUpload?: boolean;
}

export const OrderFilesUpload: React.FC<OrderFilesUploadProps> = ({
  files = [],
  onUploadSuccess,
  canUpload = true,
}) => {
  return (
    <div className="space-y-6">
      {canUpload && (
        <div className="space-y-2">
          <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100">Upload New Files</h4>
          <FileUploader onFilesSelected={onUploadSuccess} />
        </div>
      )}

      <div>
        <h4 className="text-sm font-semibold text-slate-900 dark:text-slate-100 mb-3">Attached Assets ({files.length})</h4>
        {files.length > 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            {files.map((f) => (
              <div key={f.id} className="flex items-center justify-between p-3 border border-slate-200 dark:border-slate-800 rounded-xl bg-slate-50 dark:bg-slate-800">
                <div className="flex items-center space-x-3">
                  <File className="h-5 w-5 text-indigo-600" />
                  <div className="truncate max-w-[150px]">
                    <p className="text-xs font-semibold text-slate-900 dark:text-slate-100 truncate">{f.fileName}</p>
                    <p className="text-[10px] text-slate-400">{(Number(f.fileSize) / 1024 / 1024).toFixed(1)} MB</p>
                  </div>
                </div>
                <a href={f.fileUrl} target="_blank" rel="noopener noreferrer">
                  <Button size="icon" variant="ghost" className="h-8 w-8 text-indigo-600">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
              </div>
            ))}
          </div>
        ) : (
          <p className="text-xs text-slate-400 py-4 text-center">No files uploaded yet.</p>
        )}
      </div>
    </div>
  );
};
