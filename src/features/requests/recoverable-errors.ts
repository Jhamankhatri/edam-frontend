import { ApiError, formatApiError, normalizeUnknownError } from '@/api/errors';

export type RecoveryAction = 'new-key' | 'same-key' | 'reconcile' | 'reload' | 'validate' | 'none';

export interface RecoveryState {
  title: string;
  message: string;
  action: RecoveryAction;
  correlationId?: string;
}

/** Source-derived, user-safe recovery guidance; no raw stack traces are shown. */
export function recoverableErrorState(error: unknown): RecoveryState {
  const apiError = normalizeUnknownError(error);
  const message = formatApiError(error);
  const base = { message, correlationId: apiError.correlationId };
  if (!(apiError instanceof ApiError)) return { ...base, title: 'Unable to complete the action', action: 'none' };
  switch (apiError.code) {
    case 'EDAM-1004':
      return {
        ...base,
        title: 'A new submission key is required',
        action: 'new-key',
      };
    case 'EDAM-1005':
      return {
        ...base,
        title: 'The original submission is still processing',
        message: 'The backend has not recorded a final outcome. Reconcile the register before trying again.',
        action: 'reconcile',
      };
    case 'EDAM-1006':
      return {
        ...base,
        title: 'Reconciliation required',
        message: 'Refresh the register to determine whether the earlier submission completed.',
        action: 'reconcile',
      };
    case 'EDAM-3002':
    case 'EDAM-3003':
      return { ...base, title: 'Record changed elsewhere', action: 'reload' };
    case 'EDAM-3004':
    case 'EDAM-3001':
      return { ...base, title: 'Refresh the request state', action: 'reload' };
    case 'EDAM-1001':
    case 'EDAM-5002':
      return { ...base, title: 'Correct the highlighted fields', action: 'validate' };
    case 'NETWORK_ERROR':
      return { ...base, title: 'Connection interrupted', action: 'same-key' };
    case 'EDAM-2001':
      return { ...base, title: 'Your session has expired', action: 'none' };
    case 'EDAM-2002':
    case 'EDAM-2005':
    case 'EDAM-2003':
    case 'EDAM-2004':
      return { ...base, title: 'This action is not permitted', action: 'none' };
    default:
      return { ...base, title: 'Unable to complete the action', action: 'none' };
  }
}
