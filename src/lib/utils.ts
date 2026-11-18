import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]): string {
  return twMerge(clsx(inputs));
}

export function initials(name: string): string {
  const parts = name.trim().split(/\s+/).filter(Boolean);
  if (parts.length === 0) return 'ED';
  const first = parts[0]?.[0] ?? 'E';
  const last = parts.length > 1 ? parts[parts.length - 1]?.[0] ?? 'D' : 'D';
  return `${first}${last}`.toUpperCase();
}

export function safeReturnTo(value: unknown): string | undefined {
  if (typeof value !== 'string') return undefined;
  if (!value.startsWith('/') || value.startsWith('//')) return undefined;
  if (value.includes('\\')) return undefined;
  return value;
}

export function formatBadgeCount(value: number | undefined): string | null {
  if (value === undefined || !Number.isFinite(value) || value <= 0) return null;
  return value > 99 ? '99+' : String(value);
}

export function titleCase(value: string): string {
  return value
    .replace(/[-_]/g, ' ')
    .replace(/([a-z])([A-Z])/g, '$1 $2')
    .replace(/\s+/g, ' ')
    .trim()
    .replace(/\b\w/g, (character) => character.toUpperCase());
}
