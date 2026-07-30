import React from 'react';

export const LoadingSpinner: React.FC<{ size?: 'sm' | 'md' | 'lg' }> = ({ size = 'md' }) => {
  const sizeClasses = size === 'sm' ? 'h-4 w-4 border-2' : size === 'lg' ? 'h-10 w-10 border-4' : 'h-6 w-6 border-3';
  return (
    <div className="flex items-center justify-center p-4">
      <div
        className={`animate-spin rounded-full border-indigo-600 border-t-transparent ${sizeClasses}`}
      />
    </div>
  );
};
