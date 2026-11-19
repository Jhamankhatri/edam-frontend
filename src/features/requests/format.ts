import Decimal from 'decimal.js-light';
import type { BadgeProps } from '@/components/ui/badge';
import { isRecord } from '@/api/envelope';

function decimalToFiniteNumber(value: string | number): number | null {
  try {
    const number = new Decimal(value).toNumber();
    return Number.isFinite(number) ? number : null;
  } catch {
    return null;
  }
}

/** Parses a form decimal without performing raw JS arithmetic on money. */
export function decimalToNumber(value: string, fieldName: string): number {
  const number = decimalToFiniteNumber(value);
  if (number === null) throw new Error(`${fieldName} must be a valid amount.`);
  return number;
}

export function isValidDecimal(value: string): boolean {
  return decimalToFiniteNumber(value) !== null;
}

export function isDecimalAtLeast(value: string, minimum: string): boolean {
  try {
    return new Decimal(value).comparedTo(new Decimal(minimum)) >= 0;
  } catch {
    return false;
  }
}

export function formatNumber(
  value: unknown,
  options: Intl.NumberFormatOptions = { maximumFractionDigits: 4 },
): string {
  if (value === null || value === undefined || value === '') return '—';
  if (typeof value !== 'string' && typeof value !== 'number') return String(value);
  const number = decimalToFiniteNumber(value);
  if (number === null) return String(value);
  return new Intl.NumberFormat(undefined, options).format(number);
}

export function formatMoney(value: unknown, currencyCode?: string): string {
  const amount = formatNumber(value, { minimumFractionDigits: 2, maximumFractionDigits: 4 });
  return currencyCode ? `${amount} ${currencyCode}` : amount;
}

function isDateLike(value: string): boolean {
  return /^\d{4}-\d{2}-\d{2}(?:[T ].*)?$/.test(value);
}

export function formatDateTime(value: unknown): string {
  if (typeof value !== 'string' || !isDateLike(value)) return formatScalar(value);
  const date = new Date(value);
  if (Number.isNaN(date.getTime())) return value;
  return new Intl.DateTimeFormat(undefined, { dateStyle: 'medium', timeStyle: 'short' }).format(date);
}

export function formatScalar(value: unknown): string {
  if (value === null || value === undefined || value === '') return 'Not provided';
  if (typeof value === 'boolean') return value ? 'Yes' : 'No';
  if (typeof value === 'number') return formatNumber(value);
  if (typeof value === 'string') {
    if (isDateLike(value)) return formatDateTime(value);
    return value;
  }
  if (Array.isArray(value)) return `${value.length} entries`;
  if (isRecord(value)) return Object.keys(value).length > 0 ? 'Structured value' : 'Empty structured value';
  return String(value);
}

export function humanizeField(field: string): string {
  const normalized = field
    .replace(/\[(\d+)\]/g, ' $1 ')
    .replace(/([a-z0-9])([A-Z])/g, '$1 $2')
    .replace(/[._]/g, ' ')
    .trim();
  return normalized.charAt(0).toUpperCase() + normalized.slice(1);
}

const STATUS_LABELS: Readonly<Record<string, string>> = {
  DRAFT: 'Draft',
  SUBMITTED: 'Submitted',
  IN_PROGRESS: 'In progress',
  RETURNED: 'Returned',
  APPROVED: 'Approved',
  REJECTED: 'Rejected',
  CANCELLED: 'Cancelled',
  REVERSED: 'Reversed',
};

export function formatStatus(status: string | undefined): string {
  return status ? STATUS_LABELS[status] ?? status.replaceAll('_', ' ') : 'Status unavailable';
}

export function statusTone(status: string | undefined): BadgeProps['variant'] {
  switch (status) {
    case 'DRAFT': return 'outline';
    case 'SUBMITTED':
    case 'IN_PROGRESS': return 'info';
    case 'RETURNED': return 'warning';
    case 'APPROVED': return 'success';
    case 'REJECTED':
    case 'CANCELLED':
    case 'REVERSED': return 'destructive';
    default: return 'muted';
  }
}
