import type { ApiEnvelope, FieldErrorDetail } from './contracts';
import {
  FORBIDDEN_STATUS,
  isPermissionDeniedCode,
  SERVER_ERROR_STATUS_THRESHOLD,
} from './error-status';

export const NETWORK_ERROR_CODE = 'NETWORK_ERROR';
export const NON_JSON_ERROR_CODE = 'HTTP_NON_JSON';
export const CSRF_ERROR_CODE = 'CSRF_TOKEN_UNAVAILABLE';

export interface ApiErrorDetails {
  code: string;
  message: string;
  status: number;
  correlationId?: string;
  fieldErrors?: FieldErrorDetail[];
}

export class ApiError extends Error {
  readonly code: string;
  readonly status: number;
  readonly correlationId?: string;
  readonly fieldErrors?: FieldErrorDetail[];

  constructor(details: ApiErrorDetails) {
    super(details.message);
    this.name = 'ApiError';
    this.code = details.code;
    this.status = details.status;
    this.correlationId = details.correlationId;
    this.fieldErrors = details.fieldErrors;
  }
}

export function createApiErrorFromEnvelope(
  status: number,
  envelope: ApiEnvelope<unknown> | undefined,
  fallbackMessage = 'The request could not be completed.',
): ApiError {
  return new ApiError({
    code: envelope?.error?.code ?? (status > 0 ? `HTTP_${status}` : NETWORK_ERROR_CODE),
    message: envelope?.error?.message ?? fallbackMessage,
    status,
    correlationId: envelope?.correlationId,
    fieldErrors: envelope?.fieldErrors ?? undefined,
  });
}

export function normalizeUnknownError(error: unknown): ApiError {
  if (error instanceof ApiError) return error;
  if (error instanceof Error) {
    return new ApiError({ code: NETWORK_ERROR_CODE, message: error.message, status: 0 });
  }
  return new ApiError({
    code: NETWORK_ERROR_CODE,
    message: 'Unable to connect to EDAM. Check your connection and retry.',
    status: 0,
  });
}

export function isUnauthenticatedError(error: unknown): boolean {
  return error instanceof ApiError && error.code === 'EDAM-2001';
}

/**
 * A 403 with one of the four source-derived permission codes is an authorization
 * result, not a CSRF failure. Any other 403 (including an empty envelope) may be a
 * CSRF rejection and is retried once after re-priming the token. H02 §3's stale
 * status table is not used for these decisions; see `error-status.ts`.
 */
export function isLikelyCsrfFailure(status: number, envelope: ApiEnvelope<unknown> | undefined): boolean {
  if (status !== FORBIDDEN_STATUS) return false;
  return !isPermissionDeniedCode(envelope?.error?.code);
}

export function formatApiError(error: unknown): string {
  const apiError = normalizeUnknownError(error);
  if (apiError.status >= SERVER_ERROR_STATUS_THRESHOLD && apiError.correlationId) {
    return `${apiError.message} Support reference: ${apiError.correlationId}`;
  }
  return apiError.message;
}
