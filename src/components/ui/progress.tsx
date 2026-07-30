import * as React from "react";
import { cn } from "@/lib/utils";

interface ProgressProps extends React.HTMLAttributes<HTMLDivElement> {
  value: number;
}

export const Progress: React.FC<ProgressProps> = ({ value, className, ...props }) => {
  return (
    <div
      className={cn("relative h-2 w-full overflow-hidden rounded-full bg-slate-200 dark:bg-slate-800", className)}
      {...props}
    >
      <div
        className="h-full bg-indigo-600 transition-all duration-300 ease-in-out"
        style={{ width: `${Math.min(100, Math.max(0, value))}%` }}
      />
    </div>
  );
};
