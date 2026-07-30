import * as React from "react";
import { cn } from "@/lib/utils";

export interface AvatarProps extends React.HTMLAttributes<HTMLDivElement> {
  src?: string | null;
  fallback: string;
}

export const Avatar: React.FC<AvatarProps> = ({ src, fallback, className, ...props }) => {
  return (
    <div
      className={cn(
        "relative flex h-10 w-10 shrink-0 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700 items-center justify-center font-semibold text-slate-700 dark:text-slate-200 text-sm",
        className
      )}
      {...props}
    >
      {src ? (
        <img src={src} alt={fallback} className="aspect-square h-full w-full object-cover" />
      ) : (
        <span>{fallback}</span>
      )}
    </div>
  );
};
