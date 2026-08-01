import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export const DEFAULT_LOCATION = process.env.NEXT_PUBLIC_APP_LOCATION || 'Bangalore, Karnataka, India';
export const DEFAULT_TIMEZONE = process.env.NEXT_PUBLIC_DEFAULT_TIMEZONE || 'Asia/Kolkata';
export const DEFAULT_LOCALE = 'en-IN';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(amount: number | string, currency: string = 'INR'): string {
  const numeric = typeof amount === 'string' ? parseFloat(amount) : amount;
  return new Intl.NumberFormat(DEFAULT_LOCALE, {
    style: 'currency',
    currency: currency,
    maximumFractionDigits: 2,
  }).format(numeric || 0);
}

// Automatically syncs to client PC local time or Asia/Kolkata timezone
export function formatDate(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'N/A';

  return d.toLocaleDateString(DEFAULT_LOCALE, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    timeZone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : DEFAULT_TIMEZONE,
  });
}

// Automatically syncs to client PC local time and date
export function formatDateTime(date: string | Date | null | undefined): string {
  if (!date) return 'N/A';
  const d = new Date(date);
  if (isNaN(d.getTime())) return 'N/A';

  return d.toLocaleString(DEFAULT_LOCALE, {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
    hour12: true,
    timeZone: typeof window !== 'undefined' ? Intl.DateTimeFormat().resolvedOptions().timeZone : DEFAULT_TIMEZONE,
  });
}

// Get current PC time string formatted for Bangalore, India
export function getLivePCTime(): string {
  return new Date().toLocaleString(DEFAULT_LOCALE, {
    timeZoneName: 'short',
    hour12: true,
  });
}
