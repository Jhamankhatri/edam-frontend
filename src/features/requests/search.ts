import { REQUEST_STATUS_VALUES } from '@/api/services/request-contracts';
import type { RequestListFilters } from './types';

function stringValue(value: unknown): string | undefined {
  return typeof value === 'string' && value.trim() ? value.trim() : undefined;
}

function integerValue(value: unknown, fallback: number, maximum?: number): number {
  const parsed = typeof value === 'number'
    ? value
    : typeof value === 'string' && value.trim()
      ? Number(value)
      : fallback;
  if (!Number.isInteger(parsed) || parsed < 0) return fallback;
  return maximum === undefined ? parsed : Math.min(parsed, maximum);
}

/** Validates only transport-shaped list search values; no business scope rules. */
export function parseRequestListSearch(search: Record<string, unknown>): RequestListFilters {
  const rawStatus = stringValue(search.status);
  const status = REQUEST_STATUS_VALUES.find((candidate) => candidate === rawStatus);
  const parsed: RequestListFilters = {
    search: stringValue(search.search),
    status,
    departmentId: stringValue(search.departmentId),
    categoryId: stringValue(search.categoryId),
    page: integerValue(search.page, 0),
    size: integerValue(search.size, 20, 200) || 20,
  };
  return Object.fromEntries(
    Object.entries(parsed).filter(([, value]) => value !== undefined),
  ) as RequestListFilters;
}
