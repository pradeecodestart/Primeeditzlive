import * as React from "react";
import { cva, type VariantProps } from "class-variance-authority";
import { cn } from "@/lib/utils";

const badgeVariants = cva(
  "inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2",
  {
    variants: {
      variant: {
        default: "border-transparent bg-indigo-100 text-indigo-800 dark:bg-indigo-900/50 dark:text-indigo-300",
        secondary: "border-transparent bg-purple-100 text-purple-800 dark:bg-purple-900/50 dark:text-purple-300",
        success: "border-transparent bg-green-100 text-green-800 dark:bg-green-900/50 dark:text-green-300",
        warning: "border-transparent bg-yellow-100 text-yellow-800 dark:bg-yellow-900/50 dark:text-yellow-300",
        destructive: "border-transparent bg-red-100 text-red-800 dark:bg-red-900/50 dark:text-red-300",
        outline: "text-slate-950 dark:text-slate-50 border border-slate-300 dark:border-slate-700",
      },
    },
    defaultVariants: {
      variant: "default",
    },
  }
);

export interface BadgeProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof badgeVariants> {}

function Badge({ className, variant, ...props }: BadgeProps) {
  return (
    <div className={cn(badgeVariants({ variant }), className)} {...props} />
  );
}

export { Badge, badgeVariants };
