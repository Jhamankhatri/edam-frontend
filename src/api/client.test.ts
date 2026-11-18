import { describe, expect, it, vi } from 'vitest';
import { apiFetch, apiFetchRaw } from '@/api/client';
import { primeCsrf, readCsrfCookie } from '@/api/csrf';
import { ENDPOINTS, IDEMPOTENT_ROUTES, isIdempotentEndpoint } from '@/api/endpoints';
import { ApiError, formatApiError } from '@/api/errors';
import {
  bootstrapInstallation,
  getApprovalCount,
  getCurrentUser,
  login,
} from '@/api/services/auth';
import { subscribeToAuthExpired } from '@/auth/session-events';
import {
  getBackendState,
  getRequestLog,
  http,
  HttpResponse,
  server,
  setBootstrapped,
} from '@/test/server';
import {
  INITIAL_CSRF_TOKEN,
  INSTALLATION_TOKEN,
  POST_LOGIN_CSRF_TOKEN,
  TEST_PASSWORD,
} from '@/test/fixtures';

const CSRF_PATH = `/api/v1${ENDPOINTS.authCsrf}`;
const LOGIN_PATH = `/api/v1${ENDPOINTS.authLogin}`;
const BOOTSTRAP_PATH = `/api/v1${ENDPOINTS.authBootstrap}`;
const UUID = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;

const IDEMPOTENT_CALLS: readonly [method: 'POST' | 'PUT', path: string][] = [
  ['POST', '/expense-requests'],
  ['PUT', '/expense-requests/request-1'],
  ['POST', '/expense-requests/request-1/cancel'],
  ['POST', '/expense-requests/request-1/submit'],
  ['POST', '/approvals/tasks/task-1/approve'],
  ['POST', '/approvals/tasks/task-1/forward'],
  ['POST', '/approvals/tasks/task-1/reject'],
  ['POST', '/approvals/tasks/task-1/revert'],
];

function mockSuccess({ request }: { request: Request }) {
  return HttpResponse.json({
    success: true,
    data: null,
    correlationId: 'test-correlation-id',
    path: new URL(request.url).pathname,
    timestamp: '2026-11-18T10:00:00Z',
  });
}

function findRequest(method: string, path: string) {
  return getRequestLog().find((entry) => entry.method === method && entry.path === path);
}

describe('API client, CSRF and error envelope', () => {
  it('explicitly primes CSRF and verifies the readable cookie', async () => {
    await expect(primeCsrf({ force: true })).resolves.toBe(INITIAL_CSRF_TOKEN);
    expect(readCsrfCookie()).toBe(INITIAL_CSRF_TOKEN);
    expect(getBackendState().csrfCalls).toBe(1);
    expect(getRequestLog()[0]).toMatchObject({ method: 'GET', path: CSRF_PATH });
  });

  it('primes before login, sends the cookie header, and never sends Idempotency-Key on login', async () => {
    const result = await login({ username: 'admin', password: TEST_PASSWORD });

    expect(result.username).toBe('admin');
    const log = getRequestLog();
    const loginIndex = log.findIndex((entry) => entry.method === 'POST' && entry.path === LOGIN_PATH);
    expect(log[0]?.path).toBe(CSRF_PATH);
    expect(loginIndex).toBeGreaterThan(0);
    expect(log[loginIndex]).toMatchObject({
      credentials: 'include',
      csrf: INITIAL_CSRF_TOKEN,
      idempotencyKey: null,
      installationToken: null,
    });
    expect(readCsrfCookie()).toBe(POST_LOGIN_CSRF_TOKEN);
    expect(log.at(-1)).toMatchObject({ method: 'GET', path: CSRF_PATH });
  });

  it('sends the installation token only in its documented bootstrap header', async () => {
    setBootstrapped(false);
    const result = await bootstrapInstallation(INSTALLATION_TOKEN, {
      username: 'admin',
      firstName: 'Avery',
      lastName: 'Morgan',
      email: 'avery.morgan@example.invalid',
      password: TEST_PASSWORD,
    });

    expect(result.username).toBe('admin');
    const request = findRequest('POST', BOOTSTRAP_PATH);
    expect(request).toMatchObject({
      credentials: 'include',
      csrf: INITIAL_CSRF_TOKEN,
      idempotencyKey: null,
      installationToken: INSTALLATION_TOKEN,
    });
    expect(getRequestLog()[0]?.path).toBe(CSRF_PATH);
    expect(getBackendState().bootstrapCalls).toBe(1);
    expect(getBackendState().currentUser).toBeNull();
    expect(getBackendState().bootstrapped).toBe(true);
  });

  it('adds Idempotency-Key only to the eight documented idempotent routes', async () => {
    await primeCsrf({ force: true });
    await apiFetch({ method: 'POST', path: '/expense-requests', body: {} });
    await apiFetch({ method: 'PUT', path: '/expense-requests/request-1', body: {} });

    const createRequest = findRequest('POST', '/api/v1/expense-requests');
    const updateRequest = findRequest('PUT', '/api/v1/expense-requests/request-1');
    expect(createRequest?.idempotencyKey).toMatch(UUID);
    expect(updateRequest?.idempotencyKey).toMatch(UUID);
    expect(findRequest('POST', LOGIN_PATH)).toBeUndefined();
  });

  it('retries a raw 403 CSRF failure once after re-priming', async () => {
    await primeCsrf({ force: true });
    let attempts = 0;
    server.use(
      http.post(`*/api/v1${ENDPOINTS.authChangePassword}`, ({ request }) => {
        attempts += 1;
        if (attempts === 1) return new HttpResponse(null, { status: 403 });
        return HttpResponse.json({
          success: true,
          data: null,
          correlationId: 'test-correlation-id',
          path: new URL(request.url).pathname,
          timestamp: '2026-11-18T10:00:00Z',
        });
      }),
    );

    await expect(
      apiFetch({
        method: 'POST',
        path: ENDPOINTS.authChangePassword,
        body: { currentPassword: 'old', newPassword: 'new' },
      }),
    ).resolves.toBeNull();
    expect(attempts).toBe(2);
    expect(getBackendState().csrfCalls).toBe(2);
  });

  it('publishes session expiry for EDAM-2001 and respects suppression', async () => {
    const listener = vi.fn();
    const unsubscribe = subscribeToAuthExpired(listener);
    server.use(
      http.get(`*/api/v1${ENDPOINTS.approvalsCount}`, ({ request }) =>
        HttpResponse.json(
          {
            success: false,
            error: { code: 'EDAM-2001', message: 'Sign in is required.' },
            correlationId: 'corr-expired',
            path: new URL(request.url).pathname,
            timestamp: '2026-11-18T10:00:00Z',
          },
          { status: 401 },
        ),
      ),
    );

    await expect(getApprovalCount()).rejects.toMatchObject({
      code: 'EDAM-2001',
      status: 401,
      correlationId: 'corr-expired',
    });
    expect(listener).toHaveBeenCalledWith(
      expect.objectContaining({ path: ENDPOINTS.approvalsCount }),
    );

    listener.mockClear();
    server.use(
      http.get(`*/api/v1${ENDPOINTS.authMe}`, ({ request }) =>
        HttpResponse.json(
          {
            success: false,
            error: { code: 'EDAM-2001', message: 'Sign in is required.' },
            correlationId: 'corr-me',
            path: new URL(request.url).pathname,
            timestamp: '2026-11-18T10:00:00Z',
          },
          { status: 401 },
        ),
      ),
    );
    await expect(getCurrentUser({ suppressAuthExpiration: true })).rejects.toBeInstanceOf(ApiError);
    expect(listener).not.toHaveBeenCalled();
    unsubscribe();
  });

  it('preserves error code, field errors and correlation id from the backend envelope', async () => {
    server.use(
      http.get(`*/api/v1${ENDPOINTS.approvalsCount}`, ({ request }) =>
        HttpResponse.json(
          {
            success: false,
            error: { code: 'EDAM-1001', message: 'Validation failed.' },
            fieldErrors: [{ field: 'amount', message: 'Amount is required.' }],
            correlationId: 'corr-validation',
            path: new URL(request.url).pathname,
            timestamp: '2026-11-18T10:00:00Z',
          },
          { status: 400 },
        ),
      ),
    );

    let caught: unknown;
    try {
      await getApprovalCount();
    } catch (error) {
      caught = error;
    }
    expect(caught).toBeInstanceOf(ApiError);
    expect(caught).toMatchObject({
      code: 'EDAM-1001',
      status: 400,
      correlationId: 'corr-validation',
      fieldErrors: [{ field: 'amount', message: 'Amount is required.' }],
    });
    expect(formatApiError(caught)).toBe('Validation failed.');
  });

  it('normalizes an unreadable server response without guessing an error code', async () => {
    server.use(
      http.get(
        `*/api/v1${ENDPOINTS.approvalsCount}`,
        () => new HttpResponse('not json', { status: 500, headers: { 'Content-Type': 'text/plain' } }),
      ),
    );

    await expect(getApprovalCount()).rejects.toMatchObject({
      code: 'HTTP_NON_JSON',
      status: 500,
      message: 'EDAM returned an unreadable server response.',
    });
  });

  it('sends CSRF on every state-changing request using the current cookie', async () => {
    await primeCsrf({ force: true });
    await apiFetch({
      method: 'POST',
      path: ENDPOINTS.authForgotPassword,
      body: { email: 'user@example.invalid' },
    });
    expect(findRequest('POST', `/api/v1${ENDPOINTS.authForgotPassword}`)).toMatchObject({
      csrf: INITIAL_CSRF_TOKEN,
    });
  });

  it('sends an Idempotency-Key to exactly the eight documented business routes', async () => {
    expect(IDEMPOTENT_ROUTES).toHaveLength(8);
    expect(IDEMPOTENT_CALLS.every(([method, path]) => isIdempotentEndpoint(method, path))).toBe(true);
    await primeCsrf({ force: true });

    const writes: {
      method: string;
      path: string;
      credentials: string;
      csrf: string | null;
      idempotencyKey: string | null;
      installationToken: string | null;
      authorization: string | null;
    }[] = [];
    server.use(
      http.all('*/api/v1/*', ({ request }) => {
        writes.push({
          method: request.method,
          path: new URL(request.url).pathname,
          credentials: request.credentials,
          csrf: request.headers.get('X-XSRF-TOKEN'),
          idempotencyKey: request.headers.get('Idempotency-Key'),
          installationToken: request.headers.get('X-Installation-Token'),
          authorization: request.headers.get('Authorization'),
        });
        return mockSuccess({ request });
      }),
    );

    for (const [method, path] of IDEMPOTENT_CALLS) {
      await apiFetch({ method, path, body: {} });
    }

    expect(writes).toHaveLength(8);
    expect(writes.every((entry) => UUID.test(entry.idempotencyKey ?? ''))).toBe(true);
    expect(writes.every((entry) => entry.csrf === INITIAL_CSRF_TOKEN)).toBe(true);
    expect(writes.every((entry) => entry.credentials === 'include')).toBe(true);
    expect(writes.every((entry) => entry.installationToken === null)).toBe(true);
    expect(writes.every((entry) => entry.authorization === null)).toBe(true);
  });

  it('keeps credentials in cookies only and never leaks privileged headers on ordinary writes', async () => {
    window.localStorage.clear();
    window.sessionStorage.clear();
    await login({ username: 'admin', password: TEST_PASSWORD });
    await apiFetch({ method: 'POST', path: ENDPOINTS.authForgotPassword, body: { email: 'user@example.invalid' } });

    const requests = getRequestLog();
    expect(requests.every((entry) => entry.credentials === 'include')).toBe(true);
    expect(requests.every((entry) => entry.authorization === null)).toBe(true);
    expect(requests.every((entry) => entry.installationToken === null)).toBe(true);
    expect(findRequest('POST', LOGIN_PATH)?.idempotencyKey).toBeNull();
    expect(findRequest('POST', `/api/v1${ENDPOINTS.authForgotPassword}`)?.idempotencyKey).toBeNull();
    expect(window.localStorage.length).toBe(0);
    expect(window.sessionStorage.length).toBe(0);
  });

  it('returns raw export responses without parsing them as an envelope', async () => {
    server.use(
      http.get(
        '*/api/v1/reports/export',
        () =>
          new HttpResponse('amount,currency\n1,USD', {
            status: 200,
            headers: { 'Content-Type': 'text/csv; charset=utf-8' },
          }),
      ),
    );

    const response = await apiFetchRaw({ method: 'GET', path: '/reports/export' });
    expect(response).toBeInstanceOf(Response);
    expect(response.headers.get('content-type')).toContain('text/csv');
    await expect(response.text()).resolves.toContain('amount,currency');
  });

  it('rejects a successful HTTP response that is not a valid ApiResponse envelope', async () => {
    server.use(
      http.get(`*/api/v1${ENDPOINTS.approvalsCount}`, () => HttpResponse.json({ unexpected: true })),
    );

    await expect(getApprovalCount()).rejects.toMatchObject({
      code: 'HTTP_NON_JSON',
      status: 200,
      message: 'EDAM returned an unreadable server response.',
    });
  });
});
