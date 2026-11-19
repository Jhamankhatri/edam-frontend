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
  STEP2_BRANCH_ID,
  STEP2_CATEGORY_ID,
  STEP2_CREATED_REQUEST_ID,
  STEP2_CURRENCY_ID,
  STEP2_DEPARTMENT_ID,
  STEP2_NATURE_ID,
  STEP2_REQUEST_TYPE_ID,
  step2Branches,
  step2Categories,
  step2Currencies,
  step2Dashboard,
  step2Departments,
  step2EditableRequest,
  step2Natures,
  step2Request,
  step2RequestTypes,
  step2SecondRequest,
  step2Summary,
  step2TaxAuthorities,
  step2Timeline,
  TEST_PASSWORD,
} from './fixtures';
import type {
  CancelRequestPayload,
  CreateRequestPayload,
  DashboardSummary,
  PageResponseRequestSummary,
  RequestResponse,
  RequestSummary,
  TimelinePage,
  UpdateRequestPayload,
} from '@/api/services/request-contracts';

export interface LoggedRequest {
  method: string;
  path: string;
  query: string;
  credentials: string;
  csrf: string | null;
  idempotencyKey: string | null;
  installationToken: string | null;
  authorization: string | null;
  body?: unknown;
}

export interface Step2Outcome {
  status: number;
  code: string;
  message: string;
  fieldErrors?: FieldErrorDetail[];
}

export interface Step2State {
  requests: RequestResponse[];
  dashboard: DashboardSummary;
  timeline: TimelinePage;
  createOutcome: Step2Outcome | null;
  updateOutcome: Step2Outcome | null;
  submitOutcome: Step2Outcome | null;
  cancelOutcome: Step2Outcome | null;
  listOutcome: Step2Outcome | null;
  dashboardOutcome: Step2Outcome | null;
  activityOutcome: Step2Outcome | null;
  createCalls: number;
  updateCalls: number;
  submitCalls: number;
  cancelCalls: number;
}

function defaultStep2State(): Step2State {
  return {
    requests: [step2Request, step2SecondRequest, step2EditableRequest],
    dashboard: step2Dashboard,
    timeline: step2Timeline,
    createOutcome: null,
    updateOutcome: null,
    submitOutcome: null,
    cancelOutcome: null,
    listOutcome: null,
    dashboardOutcome: null,
    activityOutcome: null,
    createCalls: 0,
    updateCalls: 0,
    submitCalls: 0,
    cancelCalls: 0,
  };
}

interface BackendState {
  bootstrapped: boolean;
  currentUser: CurrentUserResponse | null;
  loginResult: CurrentUserResponse;
  csrfToken: string;
  csrfCalls: number;
  bootstrapCalls: number;
  requests: LoggedRequest[];
  step2: Step2State;
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
    step2: defaultStep2State(),
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

export function getStep2State(): Readonly<Step2State> {
  return state.step2;
}

export function setStep2State(next: Partial<Step2State>): void {
  state.step2 = { ...state.step2, ...next };
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

function log(request: Request, body?: unknown): void {
  const url = new URL(request.url);
  state.requests.push({
    method: request.method,
    path: url.pathname,
    query: url.search,
    credentials: request.credentials,
    csrf: request.headers.get(CSRF_HEADER_NAME),
    idempotencyKey: request.headers.get('Idempotency-Key'),
    installationToken: request.headers.get('X-Installation-Token'),
    authorization: request.headers.get('Authorization'),
    body,
  });
}

function permissionFailure(request: Request, code: string): HttpResponse | null {
  // Existing Step 1 client tests call idempotent routes without a session. A real
  // session without the documented permission receives the backend-style 403.
  if (!state.currentUser || state.currentUser.permissions.includes(code)) return null;
  return HttpResponse.json(
    failure('EDAM-2005', 'You are not permitted to perform this operation.', new URL(request.url).pathname),
    { status: 403 },
  );
}

function outcomeResponse(outcome: Step2Outcome | null, path: string): HttpResponse | null {
  if (!outcome) return null;
  return HttpResponse.json(
    failure(outcome.code, outcome.message, path, outcome.fieldErrors),
    { status: outcome.status },
  );
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

  // ---------------------------------------------------------------------------
  // Step 2: development-only MSW implementation of documented backend routes.
  // ---------------------------------------------------------------------------
  http.get(`*/api/v1${ENDPOINTS.reportingDashboard}`, ({ request }) => {
    log(request);
    const path = new URL(request.url).pathname;
    const denied = permissionFailure(request, 'report:view');
    if (denied) return denied;
    const outcome = outcomeResponse(state.step2.dashboardOutcome, path);
    if (outcome) return outcome;
    return HttpResponse.json(success(state.step2.dashboard, path));
  }),

  http.get(`*/api/v1${ENDPOINTS.requestTypes}`, ({ request }) => {
    log(request);
    const denied = permissionFailure(request, 'expense-configuration:view');
    if (denied) return denied;
    return HttpResponse.json(success(step2RequestTypes, new URL(request.url).pathname));
  }),
  http.get(`*/api/v1${ENDPOINTS.expenseCategories}`, ({ request }) => {
    log(request);
    const denied = permissionFailure(request, 'expense-configuration:view');
    if (denied) return denied;
    return HttpResponse.json(success(step2Categories, new URL(request.url).pathname));
  }),
  http.get(`*/api/v1${ENDPOINTS.expenseNatures}`, ({ request }) => {
    log(request);
    const denied = permissionFailure(request, 'expense-configuration:view');
    if (denied) return denied;
    return HttpResponse.json(success(step2Natures, new URL(request.url).pathname));
  }),
  http.get(`*/api/v1${ENDPOINTS.departments}`, ({ request }) => {
    log(request);
    const denied = permissionFailure(request, 'organization:view');
    if (denied) return denied;
    return HttpResponse.json(success(step2Departments, new URL(request.url).pathname));
  }),
  http.get(`*/api/v1${ENDPOINTS.branches}`, ({ request }) => {
    log(request);
    const denied = permissionFailure(request, 'organization:view');
    if (denied) return denied;
    return HttpResponse.json(success(step2Branches, new URL(request.url).pathname));
  }),
  http.get(`*/api/v1${ENDPOINTS.currencies}`, ({ request }) => {
    log(request);
    const denied = permissionFailure(request, 'currency:view');
    if (denied) return denied;
    return HttpResponse.json(success(step2Currencies, new URL(request.url).pathname));
  }),
  http.get(`*/api/v1${ENDPOINTS.taxAuthorities}`, ({ request }) => {
    log(request);
    const denied = permissionFailure(request, 'currency:view');
    if (denied) return denied;
    return HttpResponse.json(success(step2TaxAuthorities, new URL(request.url).pathname));
  }),

  http.get(`*/api/v1${ENDPOINTS.requests}`, ({ request }) => {
    log(request);
    const path = new URL(request.url).pathname;
    const denied = permissionFailure(request, 'request:view-own');
    if (denied) return denied;
    const outcome = outcomeResponse(state.step2.listOutcome, path);
    if (outcome) return outcome;
    const url = new URL(request.url);
    const status = url.searchParams.get('status') ?? undefined;
    const departmentId = url.searchParams.get('departmentId') ?? undefined;
    const categoryId = url.searchParams.get('categoryId') ?? undefined;
    const search = (url.searchParams.get('search') ?? '').toLowerCase();
    const mineOnly = url.searchParams.get('mineOnly') === 'true';
    const page = Number(url.searchParams.get('page') ?? '0');
    const size = Number(url.searchParams.get('size') ?? '20');
    let requests = state.step2.requests.filter((entry) => {
      if (mineOnly && state.currentUser && entry.requestedBy !== state.currentUser.userId) return false;
      if (status && entry.status !== status) return false;
      if (departmentId && entry.departmentId !== departmentId) return false;
      if (categoryId && entry.expenseCategoryId !== categoryId) return false;
      if (search && !(entry.requestNumber ?? '').toLowerCase().includes(search)) return false;
      return true;
    });
    const totalElements = requests.length;
    const start = page * size;
    requests = requests.slice(start, start + size);
    const summaries: RequestSummary[] = requests.map(step2Summary);
    const response: PageResponseRequestSummary = {
      items: summaries,
      page,
      size,
      totalElements,
      totalPages: size > 0 ? Math.ceil(totalElements / size) : 0,
      hasNext: start + size < totalElements,
      hasPrevious: page > 0,
    };
    return HttpResponse.json(success(response, path));
  }),

  http.get('*/api/v1/expense-requests/:id/activity', ({ request }) => {
    log(request);
    const path = new URL(request.url).pathname;
    const denied = permissionFailure(request, 'request:view-own');
    if (denied) return denied;
    const outcome = outcomeResponse(state.step2.activityOutcome, path);
    if (outcome) return outcome;
    return HttpResponse.json(success(state.step2.timeline, path));
  }),

  http.get('*/api/v1/expense-requests/:id', ({ request, params }) => {
    log(request);
    const path = new URL(request.url).pathname;
    const denied = permissionFailure(request, 'request:view-own');
    if (denied) return denied;
    const id = String(params.id);
    const found = state.step2.requests.find((entry) => entry.id === id);
    if (!found) return HttpResponse.json(failure('EDAM-4001', 'Request not found.', path), { status: 404 });
    return HttpResponse.json(success(found, path));
  }),

  http.post(`*/api/v1${ENDPOINTS.requests}`, async ({ request }) => {
    const body: unknown = await readJson(request);
    log(request, body);
    const path = new URL(request.url).pathname;
    const denied = permissionFailure(request, 'request:create');
    if (denied) return denied;
    const csrfError = csrfFailure(request);
    if (csrfError) return csrfError;
    const outcome = outcomeResponse(state.step2.createOutcome, path);
    if (outcome) return outcome;
    state.step2.createCalls += 1;
    if (!state.currentUser) {
      return HttpResponse.json(success({ id: 'request-1' }, path), { status: 201 });
    }
    const payload = (isRecord(body) ? body : {}) as unknown as CreateRequestPayload;
    const response: RequestResponse = {
      ...step2Request,
      id: STEP2_CREATED_REQUEST_ID,
      requestNumber: `ER-TEST-CREATED-${state.step2.createCalls}`,
      requestTypeId: payload.requestTypeId ?? STEP2_REQUEST_TYPE_ID,
      expenseCategoryId: payload.expenseCategoryId ?? STEP2_CATEGORY_ID,
      expenseNatureId: payload.expenseNatureId ?? STEP2_NATURE_ID,
      departmentId: payload.departmentId ?? STEP2_DEPARTMENT_ID,
      branchId: payload.branchId ?? STEP2_BRANCH_ID,
      currencyId: payload.currencyId ?? STEP2_CURRENCY_ID,
      requestedAmount: payload.requestedAmount ?? step2Request.requestedAmount,
      baseCurrencyAmount: payload.requestedAmount ?? step2Request.baseCurrencyAmount,
      justification: payload.justification ?? step2Request.justification,
      status: 'DRAFT',
      version: 1,
      canEdit: true,
      canSubmit: true,
      canCancel: true,
      terminal: false,
    };
    state.step2.requests = [response, ...state.step2.requests];
    return HttpResponse.json(success(response, path), { status: 201 });
  }),

  http.put('*/api/v1/expense-requests/:id', async ({ request, params }) => {
    const body: unknown = await readJson(request);
    log(request, body);
    const path = new URL(request.url).pathname;
    const denied = permissionFailure(request, 'request:edit');
    if (denied) return denied;
    const csrfError = csrfFailure(request);
    if (csrfError) return csrfError;
    const outcome = outcomeResponse(state.step2.updateOutcome, path);
    if (outcome) return outcome;
    state.step2.updateCalls += 1;
    const id = String(params.id);
    const existing = state.step2.requests.find((entry) => entry.id === id);
    if (!existing && !state.currentUser) {
      return HttpResponse.json(success({ id: 'request-1' }, path));
    }
    if (!existing) return HttpResponse.json(failure('EDAM-4001', 'Request not found.', path), { status: 404 });
    if (existing.canEdit !== true) {
      return HttpResponse.json(failure('EDAM-3004', 'The operation is not permitted in the current state.', path), { status: 422 });
    }
    const payload = (isRecord(body) ? body : {}) as unknown as UpdateRequestPayload;
    const response: RequestResponse = {
      ...existing,
      requestTypeId: payload.requestTypeId ?? existing.requestTypeId,
      expenseCategoryId: payload.expenseCategoryId ?? existing.expenseCategoryId,
      expenseNatureId: payload.expenseNatureId ?? existing.expenseNatureId,
      branchId: payload.branchId ?? existing.branchId,
      currencyId: payload.currencyId ?? existing.currencyId,
      requestedAmount: payload.requestedAmount ?? existing.requestedAmount,
      baseCurrencyAmount: payload.requestedAmount ?? existing.baseCurrencyAmount,
      justification: payload.justification ?? existing.justification,
      updatedAt: '2026-11-18T11:00:00Z',
      version: (existing.version ?? 1) + 1,
    };
    state.step2.requests = state.step2.requests.map((entry) => entry.id === id ? response : entry);
    return HttpResponse.json(success(response, path));
  }),

  http.post('*/api/v1/expense-requests/:id/submit', ({ request, params }) => {
    log(request);
    const path = new URL(request.url).pathname;
    const denied = permissionFailure(request, 'request:submit');
    if (denied) return denied;
    const csrfError = csrfFailure(request);
    if (csrfError) return csrfError;
    const outcome = outcomeResponse(state.step2.submitOutcome, path);
    if (outcome) return outcome;
    state.step2.submitCalls += 1;
    const id = String(params.id);
    const existing = state.step2.requests.find((entry) => entry.id === id);
    if (!existing) return HttpResponse.json(failure('EDAM-4001', 'Request not found.', path), { status: 404 });
    if (existing.canSubmit !== true) {
      return HttpResponse.json(failure('EDAM-3004', 'The operation is not permitted in the current state.', path), { status: 422 });
    }
    const response: RequestResponse = {
      ...existing,
      status: 'SUBMITTED',
      submittedAt: '2026-11-18T11:00:00Z',
      updatedAt: '2026-11-18T11:00:00Z',
      canEdit: false,
      canSubmit: false,
      canCancel: true,
      terminal: false,
    };
    state.step2.requests = state.step2.requests.map((entry) => entry.id === id ? response : entry);
    return HttpResponse.json(success(response, path));
  }),

  http.post('*/api/v1/expense-requests/:id/cancel', async ({ request, params }) => {
    const body: unknown = await readJson(request);
    log(request, body);
    const path = new URL(request.url).pathname;
    const denied = permissionFailure(request, 'request:cancel');
    if (denied) return denied;
    const csrfError = csrfFailure(request);
    if (csrfError) return csrfError;
    const outcome = outcomeResponse(state.step2.cancelOutcome, path);
    if (outcome) return outcome;
    const payload = (isRecord(body) ? body : {}) as unknown as CancelRequestPayload;
    if (!payload.reason || !payload.reason.trim()) {
      return HttpResponse.json(
        failure('EDAM-1001', 'Validation failed.', path, [{ field: 'reason', message: 'A cancellation reason is required.' }]),
        { status: 400 },
      );
    }
    state.step2.cancelCalls += 1;
    const id = String(params.id);
    const existing = state.step2.requests.find((entry) => entry.id === id);
    if (!existing) return HttpResponse.json(failure('EDAM-4001', 'Request not found.', path), { status: 404 });
    if (existing.canCancel !== true) {
      return HttpResponse.json(failure('EDAM-3004', 'The operation is not permitted in the current state.', path), { status: 422 });
    }
    const response: RequestResponse = {
      ...existing,
      status: 'CANCELLED',
      updatedAt: '2026-11-18T11:00:00Z',
      canEdit: false,
      canSubmit: false,
      canCancel: false,
      terminal: true,
    };
    state.step2.requests = state.step2.requests.map((entry) => entry.id === id ? response : entry);
    return HttpResponse.json(success(response, path));
  }),
];

export const server = setupServer(...handlers);
export { http, HttpResponse };
