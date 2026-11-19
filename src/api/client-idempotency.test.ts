import { afterEach, describe, expect, it, vi } from 'vitest';
import { toast } from 'sonner';
import {
  apiFetch,
  createIdempotencyKey,
  IDEMPOTENCY_IN_PROGRESS_CODE,
  IDEMPOTENCY_MAX_RETRIES,
  IDEMPOTENCY_RETRY_DELAY_MS,
} from './client';
import { primeCsrf } from './csrf';
import { ENDPOINTS } from './endpoints';
import { http, HttpResponse, server } from '@/test/server';

const BUSINESS_PATH = `*/api/v1${ENDPOINTS.requests}`;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

function successEnvelope(path: string, data: unknown = { id: 'request-1' }) {
  return {
    success: true,
    data,
    correlationId: 'client-idempotency-test',
    path,
    timestamp: '2026-11-18T10:00:00Z',
  };
}

function inProgressEnvelope(path: string) {
  return {
    success: false,
    error: { code: IDEMPOTENCY_IN_PROGRESS_CODE, message: 'The original submission is still processing.' },
    correlationId: 'client-idempotency-test',
    path,
    timestamp: '2026-11-18T10:00:00Z',
  };
}

afterEach(() => {
  vi.restoreAllMocks();
});

describe('Step 2 idempotency recovery in the API client', () => {
  it('retries EDAM-1005 with the same resolved key, a 2s delay and at most three retries', async () => {
    const key = createIdempotencyKey();
    const keys: (string | null)[] = [];
    const delays: number[] = [];
    let attempts = 0;
    server.use(
      http.post(BUSINESS_PATH, ({ request }) => {
        attempts += 1;
        keys.push(request.headers.get('Idempotency-Key'));
        const path = new URL(request.url).pathname;
        if (attempts <= IDEMPOTENCY_MAX_RETRIES) {
          return HttpResponse.json(inProgressEnvelope(path), { status: 409 });
        }
        return HttpResponse.json(successEnvelope(path), { status: 201 });
      }),
    );
    const errorToast = vi.spyOn(toast, 'error');
    const setTimeoutSpy = vi.spyOn(globalThis, 'setTimeout').mockImplementation(
      ((handler: Parameters<typeof setTimeout>[0], timeout?: number, ...args: unknown[]) => {
        delays.push(timeout ?? 0);
        if (typeof handler === 'function') {
          (handler as (...callbackArgs: unknown[]) => void)(...args);
        }
        return 0 as unknown as ReturnType<typeof setTimeout>;
      }) as typeof globalThis.setTimeout,
    );

    const result = await apiFetch<{ id: string }>({
      method: 'POST',
      path: ENDPOINTS.requests,
      body: { requestTypeId: 'test' },
      idempotencyKey: key,
    });

    expect(result).toEqual({ id: 'request-1' });
    expect(attempts).toBe(IDEMPOTENCY_MAX_RETRIES + 1);
    expect(keys).toEqual(Array(IDEMPOTENCY_MAX_RETRIES + 1).fill(key));
    expect(key).toMatch(UUID);
    expect(delays).toEqual(Array(IDEMPOTENCY_MAX_RETRIES).fill(IDEMPOTENCY_RETRY_DELAY_MS));
    expect(setTimeoutSpy).toHaveBeenCalledTimes(IDEMPOTENCY_MAX_RETRIES);
    expect(errorToast).not.toHaveBeenCalled();
  });

  it('reuses one resolved idempotency key across a CSRF retry', async () => {
    await primeCsrf({ force: true });
    const keys: (string | null)[] = [];
    let attempts = 0;
    server.use(
      http.post(BUSINESS_PATH, ({ request }) => {
        attempts += 1;
        keys.push(request.headers.get('Idempotency-Key'));
        const path = new URL(request.url).pathname;
        if (attempts === 1) return new HttpResponse(null, { status: 403 });
        return HttpResponse.json(successEnvelope(path));
      }),
    );

    await expect(apiFetch({
      method: 'POST',
      path: ENDPOINTS.requests,
      body: { requestTypeId: 'test' },
    })).resolves.toEqual({ id: 'request-1' });

    expect(attempts).toBe(2);
    expect(keys).toHaveLength(2);
    expect(keys[0]).toMatch(UUID);
    expect(keys[1]).toBe(keys[0]);
  });
});
