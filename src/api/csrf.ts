import { env } from '@/config/env';
import type { ApiEnvelope, CsrfTokenResponse } from './contracts';
import { ENDPOINTS } from './endpoints';
import { isRecord, parseApiEnvelope } from './envelope';
import { ApiError, createApiErrorFromEnvelope, CSRF_ERROR_CODE } from './errors';

export const CSRF_COOKIE_NAME = 'XSRF-TOKEN';
export const CSRF_HEADER_NAME = 'X-XSRF-TOKEN';

let primingPromise: Promise<string> | null = null;

export function readCsrfCookie(): string | null {
  const match = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  if (!match?.[1]) return null;
  try {
    return decodeURIComponent(match[1]);
  } catch {
    return match[1];
  }
}

function isCsrfTokenResponse(value: unknown): value is CsrfTokenResponse {
  return (
    isRecord(value) &&
    typeof value.headerName === 'string' &&
    typeof value.parameterName === 'string' &&
    typeof value.token === 'string'
  );
}

async function requestAndVerifyCsrfCookie(): Promise<string> {
  let response: Response;
  try {
    response = await fetch(`${env.apiBaseUrl}${ENDPOINTS.authCsrf}`, {
      method: 'GET',
      credentials: 'include',
      headers: { Accept: 'application/json' },
      cache: 'no-store',
    });
  } catch (error) {
    throw new ApiError({
      code: 'NETWORK_ERROR',
      message: error instanceof Error ? error.message : 'Unable to reach the CSRF endpoint.',
      status: 0,
    });
  }

  const envelope: ApiEnvelope<unknown> | undefined = await parseApiEnvelope(response);
  if (!response.ok || !envelope?.success) {
    throw createApiErrorFromEnvelope(
      response.status,
      envelope,
      'EDAM could not initialise a secure session.',
    );
  }

  const data = envelope.data;
  if (isCsrfTokenResponse(data) && data.headerName !== CSRF_HEADER_NAME) {
    throw new ApiError({
      code: CSRF_ERROR_CODE,
      message: 'The server returned an unexpected CSRF header name.',
      status: response.status,
      correlationId: envelope.correlationId,
    });
  }

  const cookieValue = readCsrfCookie();
  if (!cookieValue) {
    throw new ApiError({
      code: CSRF_ERROR_CODE,
      message: 'The CSRF cookie is unavailable. Refresh the page and retry.',
      status: response.status,
      correlationId: envelope.correlationId,
    });
  }
  return cookieValue;
}

export interface PrimeCsrfOptions {
  force?: boolean;
}

export async function primeCsrf(options: PrimeCsrfOptions = {}): Promise<string> {
  if (!options.force) {
    const existing = readCsrfCookie();
    if (existing) return existing;
  }
  if (!primingPromise) {
    primingPromise = requestAndVerifyCsrfCookie().finally(() => {
      primingPromise = null;
    });
  }
  return primingPromise;
}

export async function ensureCsrfCookie(): Promise<string> {
  return primeCsrf();
}
