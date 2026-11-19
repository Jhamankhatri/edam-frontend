import { env } from '@/config/env';
import { ensureCsrfCookie, primeCsrf, CSRF_HEADER_NAME } from './csrf';
import type { ApiEnvelope } from './contracts';
import { parseApiEnvelope } from './envelope';
import { isIdempotentEndpoint } from './endpoints';
import {
  ApiError,
  createApiErrorFromEnvelope,
  isLikelyCsrfFailure,
  NETWORK_ERROR_CODE,
  NON_JSON_ERROR_CODE,
  normalizeUnknownError,
} from './errors';
import { publishAuthExpired } from '@/auth/session-events';

export type ApiMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

export interface ApiRequestOptions {
  method: ApiMethod;
  path: string;
  body?: unknown;
  headers?: Record<string, string>;
  idempotencyKey?: string;
  suppressAuthExpiration?: boolean;
  signal?: AbortSignal;
  responseType?: 'json' | 'raw';
}

const writeMethods = new Set<ApiMethod>(['POST', 'PUT', 'PATCH', 'DELETE']);

/** H06: EDAM-1005 is a normal in-progress outcome, retried with the same key. */
export const IDEMPOTENCY_IN_PROGRESS_CODE = 'EDAM-1005';
export const IDEMPOTENCY_RETRY_DELAY_MS = 2_000;
export const IDEMPOTENCY_MAX_RETRIES = 3;

function isWrite(method: ApiMethod): boolean {
  return writeMethods.has(method);
}

export function createIdempotencyKey(): string {
  return createUuidV4();
}

function createUuidV4(): string {
  const cryptoApi = globalThis.crypto;
  if (typeof cryptoApi?.randomUUID === 'function') return cryptoApi.randomUUID();
  const bytes = new Uint8Array(16);
  cryptoApi.getRandomValues(bytes);
  const sixth = bytes[6] ?? 0;
  const eighth = bytes[8] ?? 0;
  bytes[6] = (sixth & 0x0f) | 0x40;
  bytes[8] = (eighth & 0x3f) | 0x80;
  const hex = Array.from(bytes, (byte) => byte.toString(16).padStart(2, '0')).join('');
  return `${hex.slice(0, 8)}-${hex.slice(8, 12)}-${hex.slice(12, 16)}-${hex.slice(16, 20)}-${hex.slice(20)}`;
}

/**
 * Resolve an auto-generated idempotency key exactly once per apiFetch gesture.
 * CSRF and EDAM-1005 retries then reuse the same explicit key; callers may also
 * supply a gesture key from a form/action so corrections can be distinguished
 * from safe retries.
 */
function withResolvedIdempotencyKey(options: ApiRequestOptions): ApiRequestOptions {
  if (options.idempotencyKey || !isWrite(options.method)) return options;
  if (!isIdempotentEndpoint(options.method, options.path)) return options;
  return { ...options, idempotencyKey: createUuidV4() };
}

function toFetchBody(body: unknown): { body?: BodyInit; contentType?: string } {
  if (body === undefined || body === null) return {};
  if (body instanceof FormData) return { body };
  if (body instanceof Blob) return { body };
  if (body instanceof URLSearchParams) return { body, contentType: 'application/x-www-form-urlencoded' };
  return { body: JSON.stringify(body), contentType: 'application/json' };
}

async function execute(
  options: ApiRequestOptions,
  allowCsrfRetry: boolean,
  idempotencyAttempt = 0,
): Promise<ApiEnvelope<unknown> | Response> {
  const headers: Record<string, string> = {
    Accept: options.responseType === 'raw' ? '*/*' : 'application/json',
    ...options.headers,
  };

  if (isWrite(options.method)) {
    const csrfToken = await ensureCsrfCookie();
    headers[CSRF_HEADER_NAME] = csrfToken;
  }

  const { idempotencyKey } = options;
  if (idempotencyKey) headers['Idempotency-Key'] = idempotencyKey;

  const converted = toFetchBody(options.body);
  if (converted.contentType && !headers['Content-Type']) headers['Content-Type'] = converted.contentType;

  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${options.path}`, {
      method: options.method,
      credentials: 'include',
      headers,
      body: converted.body,
      signal: options.signal,
      cache: 'no-store',
    });
  } catch (error) {
    throw normalizeUnknownError(error);
  }

  if (options.responseType === 'raw') {
    if (!response.ok) {
      const envelope = await parseApiEnvelope(response);
      throw createApiErrorFromEnvelope(response.status, envelope, 'The download could not be completed.');
    }
    return response;
  }

  const envelope = await parseApiEnvelope(response);
  if (!response.ok || !envelope?.success) {
    const error = createApiErrorFromEnvelope(
      response.status,
      envelope,
      'The request could not be completed.',
    );
    if (isLikelyCsrfFailure(response.status, envelope) && allowCsrfRetry && isWrite(options.method)) {
      await primeCsrf({ force: true });
      return execute(options, false, idempotencyAttempt);
    }
    if (
      error.code === IDEMPOTENCY_IN_PROGRESS_CODE &&
      options.idempotencyKey &&
      isWrite(options.method) &&
      idempotencyAttempt < IDEMPOTENCY_MAX_RETRIES
    ) {
      await new Promise((resolve) => setTimeout(resolve, IDEMPOTENCY_RETRY_DELAY_MS));
      return execute(options, allowCsrfRetry, idempotencyAttempt + 1);
    }
    if (!envelope && response.ok) {
      throw new ApiError({
        code: NON_JSON_ERROR_CODE,
        message: 'EDAM returned an unreadable server response.',
        status: response.status,
      });
    }
    if (error.code === 'EDAM-2001' && !options.suppressAuthExpiration) {
      publishAuthExpired({ path: options.path, correlationId: error.correlationId });
    }
    if (!envelope && response.status >= 500) {
      throw new ApiError({
        code: NON_JSON_ERROR_CODE,
        message: 'EDAM returned an unreadable server response.',
        status: response.status,
      });
    }
    throw error;
  }
  return envelope;
}

async function executeWithGetRetry(input: ApiRequestOptions): Promise<ApiEnvelope<unknown> | Response> {
  const options = withResolvedIdempotencyKey(input);
  try {
    return await execute(options, true);
  } catch (error) {
    if (options.method === 'GET' && error instanceof ApiError && error.code === NETWORK_ERROR_CODE) {
      await new Promise((resolve) => setTimeout(resolve, 250));
      return execute(options, true);
    }
    throw error;
  }
}

export async function apiFetch<T>(options: ApiRequestOptions): Promise<T> {
  const result = await executeWithGetRetry({ ...options, responseType: 'json' });
  if (result instanceof Response) {
    throw new ApiError({ code: NON_JSON_ERROR_CODE, message: 'Unexpected raw response.', status: 0 });
  }
  // Single network-boundary cast: the shared envelope parser deliberately exposes
  // `data` as `unknown`; service functions declare the payload type explicitly from
  // the Step 1 contracts in `contracts.ts`. The generated `schema.d.ts` supplies the
  // authoritative backend operation/DTO shapes for the CI consistency check.
  return result.data as T;
}

export async function apiFetchRaw(options: ApiRequestOptions): Promise<Response> {
  const result = await executeWithGetRetry({ ...options, responseType: 'raw' });
  if (!(result instanceof Response)) {
    throw new ApiError({ code: NON_JSON_ERROR_CODE, message: 'Unexpected JSON response.', status: 0 });
  }
  return result;
}
