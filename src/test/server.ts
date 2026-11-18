import { http, HttpResponse } from 'msw';
import { setupServer } from 'msw/node';
import { ENDPOINTS } from '@/api/endpoints';
import { CSRF_COOKIE_NAME, CSRF_HEADER_NAME } from '@/api/csrf';
import { isRecord } from '@/api/envelope';
import type {
  ApiEnvelope,
  BootstrapRequest,
  CurrentUserResponse,
  ErrorBody,
  FieldErrorDetail,
  LoginRequest,
} from '@/api/contracts';
import {
  bootstrapResponse,
  bootstrappedStatus,
  currentUser,
  INITIAL_CSRF_TOKEN,
  INSTALLATION_TOKEN,
  POST_LOGIN_CSRF_TOKEN,
  publicConfiguration,
  TEST_PASSWORD,
} from './fixtures';

export interface LoggedRequest {
  method: string;
  path: string;
  credentials: string;
  csrf: string | null;
  idempotencyKey: string | null;
  installationToken: string | null;
  authorization: string | null;
}

interface BackendState {
  bootstrapped: boolean;
  currentUser: CurrentUserResponse | null;
  loginResult: CurrentUserResponse;
  csrfToken: string;
  csrfCalls: number;
  bootstrapCalls: number;
  requests: LoggedRequest[];
}

function defaultState(): BackendState {
  return {
    bootstrapped: true,
    currentUser: null,
    loginResult: currentUser(),
    csrfToken: INITIAL_CSRF_TOKEN,
    csrfCalls: 0,
    bootstrapCalls: 0,
    requests: [],
  };
}

let state = defaultState();

export function resetBackendState(): void {
  state = defaultState();
}

export function setMockSession(user: CurrentUserResponse | null): void {
  state.currentUser = user;
}

export function setLoginResult(user: CurrentUserResponse): void {
  state.loginResult = user;
}

export function setBootstrapped(value: boolean): void {
  state.bootstrapped = value;
}

export function getBackendState(): Readonly<BackendState> {
  return state;
}

export function getRequestLog(): readonly LoggedRequest[] {
  return state.requests;
}

function success<T>(data: T, path: string): ApiEnvelope<T> {
  return {
    success: true,
    data,
    correlationId: 'test-correlation-id',
    path,
    timestamp: '2026-11-18T10:00:00Z',
  };
}

function failure(
  code: string,
  message: string,
  path: string,
  fieldErrors?: FieldErrorDetail[],
): ApiEnvelope<never> {
  const error: ErrorBody = { code, message };
  return {
    success: false,
    error,
    fieldErrors,
    correlationId: 'test-correlation-id',
    path,
    timestamp: '2026-11-18T10:00:00Z',
  };
}

function isLoginRequest(value: unknown): value is LoginRequest {
  return (
    isRecord(value) &&
    typeof value.username === 'string' &&
    typeof value.password === 'string'
  );
}

function isBootstrapRequest(value: unknown): value is BootstrapRequest {
  return (
    isRecord(value) &&
    typeof value.username === 'string' &&
    typeof value.firstName === 'string' &&
    typeof value.lastName === 'string' &&
    typeof value.email === 'string' &&
    typeof value.password === 'string'
  );
}

async function readJson(request: Request): Promise<unknown> {
  try {
    return await request.json();
  } catch {
    return null;
  }
}

function log(request: Request): void {
  const url = new URL(request.url);
  state.requests.push({
    method: request.method,
    path: url.pathname,
    credentials: request.credentials,
    csrf: request.headers.get(CSRF_HEADER_NAME),
    idempotencyKey: request.headers.get('Idempotency-Key'),
    installationToken: request.headers.get('X-Installation-Token'),
    authorization: request.headers.get('Authorization'),
  });
}

function csrfFailure(request: Request): HttpResponse | null {
  if (request.headers.get(CSRF_HEADER_NAME) === state.csrfToken) return null;
  return new HttpResponse(null, { status: 403 });
}

function setCsrfCookie(): void {
  document.cookie = `${CSRF_COOKIE_NAME}=${encodeURIComponent(state.csrfToken)}; Path=/`;
}

function csrfSuccess(request: Request): HttpResponse {
  state.csrfCalls += 1;
  setCsrfCookie();
  return HttpResponse.json(
    success(
      {
        headerName: CSRF_HEADER_NAME,
        parameterName: '_csrf',
        token: state.csrfToken,
      },
      new URL(request.url).pathname,
    ),
    {
      headers: {
        'Set-Cookie': `${CSRF_COOKIE_NAME}=${encodeURIComponent(state.csrfToken)}; Path=/; SameSite=Lax`,
      },
    },
  );
}

const handlers = [
  http.get(`*/api/v1${ENDPOINTS.publicConfiguration}`, ({ request }) => {
    log(request);
    return HttpResponse.json(success(publicConfiguration, new URL(request.url).pathname));
  }),

  http.get(`*/api/v1${ENDPOINTS.authInstallation}`, ({ request }) => {
    log(request);
    return HttpResponse.json(
      success(
        state.bootstrapped
          ? bootstrappedStatus
          : { bootstrapped: false, bootstrappedAt: null },
        new URL(request.url).pathname,
      ),
    );
  }),

  http.get(`*/api/v1${ENDPOINTS.authMe}`, ({ request }) => {
    log(request);
    const path = new URL(request.url).pathname;
    if (!state.currentUser) {
      return HttpResponse.json(failure('EDAM-2001', 'Sign in is required.', path), { status: 401 });
    }
    return HttpResponse.json(success(state.currentUser, path));
  }),

  http.get(`*/api/v1${ENDPOINTS.authCsrf}`, ({ request }) => {
    log(request);
    return csrfSuccess(request);
  }),

  http.post(`*/api/v1${ENDPOINTS.authLogin}`, async ({ request }) => {
    log(request);
    const csrfError = csrfFailure(request);
    if (csrfError) return csrfError;
    const body: unknown = await readJson(request);
    const path = new URL(request.url).pathname;
    if (!isLoginRequest(body) || body.username !== 'admin' || body.password !== TEST_PASSWORD) {
      return HttpResponse.json(
        failure('EDAM-2006', 'The username or password is incorrect.', path),
        { status: 401 },
      );
    }
    state.currentUser = state.loginResult;
    state.csrfToken = POST_LOGIN_CSRF_TOKEN;
    return HttpResponse.json(success(state.loginResult, path));
  }),

  http.post(`*/api/v1${ENDPOINTS.authLogout}`, ({ request }) => {
    log(request);
    const csrfError = csrfFailure(request);
    if (csrfError) return csrfError;
    state.currentUser = null;
    return HttpResponse.json(success(null, new URL(request.url).pathname));
  }),

  http.post(`*/api/v1${ENDPOINTS.authBootstrap}`, async ({ request }) => {
    log(request);
    const csrfError = csrfFailure(request);
    if (csrfError) return csrfError;
    const path = new URL(request.url).pathname;
    if (state.bootstrapped) {
      return HttpResponse.json(
        failure('EDAM-2010', 'This installation has already been set up.', path),
        { status: 422 },
      );
    }
    if (request.headers.get('X-Installation-Token') !== INSTALLATION_TOKEN) {
      return HttpResponse.json(
        failure('EDAM-2002', 'You are not permitted to perform this operation.', path),
        { status: 403 },
      );
    }
    const body: unknown = await readJson(request);
    if (!isBootstrapRequest(body) || !body.username || !body.password) {
      return HttpResponse.json(failure('EDAM-1001', 'Validation failed.', path), { status: 400 });
    }
    state.bootstrapCalls += 1;
    state.bootstrapped = true;
    // Backend AuthController#bootstrap returns ResponseEntity.status(CREATED) at
    // commit 620f7a7; the generated OpenAPI document declares only 200 for every
    // operation, so the source (not the spec) is authoritative for this status.
    // Deliberately do not set state.currentUser: bootstrap does not create a session.
    return HttpResponse.json(success(bootstrapResponse, path), { status: 201 });
  }),

  http.post(`*/api/v1${ENDPOINTS.authForgotPassword}`, ({ request }) => {
    log(request);
    const csrfError = csrfFailure(request);
    if (csrfError) return csrfError;
    return HttpResponse.json(
      success({ message: 'If the address is registered, reset instructions have been sent.' }, new URL(request.url).pathname),
    );
  }),

  http.post(`*/api/v1${ENDPOINTS.authResetPassword}`, ({ request }) => {
    log(request);
    const csrfError = csrfFailure(request);
    if (csrfError) return csrfError;
    return HttpResponse.json(success(null, new URL(request.url).pathname));
  }),

  http.post(`*/api/v1${ENDPOINTS.authChangePassword}`, ({ request }) => {
    log(request);
    const csrfError = csrfFailure(request);
    if (csrfError) return csrfError;
    const path = new URL(request.url).pathname;
    if (!state.currentUser) {
      return HttpResponse.json(failure('EDAM-2001', 'Sign in is required.', path), { status: 401 });
    }
    state.currentUser = { ...state.currentUser, mustChangePassword: false };
    return HttpResponse.json(success(null, path));
  }),

  http.get(`*/api/v1${ENDPOINTS.approvalsCount}`, ({ request }) => {
    log(request);
    return HttpResponse.json(success(3, new URL(request.url).pathname));
  }),

  http.get(`*/api/v1${ENDPOINTS.notificationsUnreadCount}`, ({ request }) => {
    log(request);
    return HttpResponse.json(success({ count: 2 }, new URL(request.url).pathname));
  }),

  http.post('*/api/v1/expense-requests', ({ request }) => {
    log(request);
    const csrfError = csrfFailure(request);
    if (csrfError) return csrfError;
    return HttpResponse.json(success({ id: 'request-1' }, new URL(request.url).pathname), { status: 201 });
  }),

  http.put('*/api/v1/expense-requests/:id', ({ request }) => {
    log(request);
    const csrfError = csrfFailure(request);
    if (csrfError) return csrfError;
    return HttpResponse.json(success({ id: 'request-1' }, new URL(request.url).pathname));
  }),
];

export const server = setupServer(...handlers);
export { http, HttpResponse };
