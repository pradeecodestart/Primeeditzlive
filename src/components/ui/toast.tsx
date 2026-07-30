import * as React from "react";
import { cn } from "@/lib/utils";

interface ToastProps {
  message: string;
  type?: "success" | "error" | "info";
  onClose?: () => void;
}

export const Toast: React.FC<ToastProps> = ({ message, type = "info", onClose }) => {
  const bg =
    type === "success"
      ? "bg-green-600 text-white"
      : type === "error"
      ? "bg-red-600 text-white"
      : "bg-indigo-600 text-white";

  return (
    <div
      className={cn(
        "fixed bottom-4 right-4 z-50 flex items-center justify-between rounded-lg px-4 py-3 shadow-lg transition-all transform duration-300",
        bg
      )}
    >
      <span className="text-sm font-medium">{message}</span>
      {onClose && (
        <button
          onClick={onClose}
          className="ml-4 text-white opacity-80 hover:opacity-100"
        >
          ×
        </button>
      )}
    </div>
  );
};
