import { describe, expect, it } from 'vitest';
import { ENDPOINTS } from './endpoints';
import {
  cancelRequest,
  createRequest,
  getCurrencies,
  getDashboardSummary,
  getExpenseCategories,
  getRequest,
  getRequestTimeline,
  listRequests,
  submitRequest,
  updateRequest,
} from './services/requests';
import type { CreateRequestPayload, UpdateRequestPayload } from './services/request-contracts';
import { currentUser, STEP2_CURRENCY_ID, STEP2_DEPARTMENT_ID, STEP2_EDITABLE_REQUEST_ID, STEP2_NATURE_ID, STEP2_REQUEST_ID, STEP2_REQUEST_TYPE_ID } from '@/test/fixtures';
import { getRequestLog, setMockSession } from '@/test/server';

function findRequest(method: string, path: string) {
  return getRequestLog().find((entry) => entry.method === method && entry.path === path);
}

const createPayload: CreateRequestPayload = {
  requestTypeId: STEP2_REQUEST_TYPE_ID,
  expenseCategoryId: '00000000-0000-0000-0000-000000000203',
  expenseNatureId: STEP2_NATURE_ID,
  departmentId: STEP2_DEPARTMENT_ID,
  currencyId: STEP2_CURRENCY_ID,
  requestedAmount: 10.5,
  justification: 'Service contract test',
};

const updatePayload: UpdateRequestPayload = {
  requestTypeId: STEP2_REQUEST_TYPE_ID,
  expenseCategoryId: '00000000-0000-0000-0000-000000000203',
  expenseNatureId: STEP2_NATURE_ID,
  currencyId: STEP2_CURRENCY_ID,
  requestedAmount: 20.25,
  justification: 'Service replacement test',
};

describe('Step 2 request/reporting services', () => {
  it('sends only documented list query parameters and reads a paged register', async () => {
    setMockSession(currentUser());
    const result = await listRequests({
      search: 'ER-TEST',
      status: 'DRAFT',
      departmentId: STEP2_DEPARTMENT_ID,
      categoryId: '00000000-0000-0000-0000-000000000203',
      mineOnly: true,
      page: 1,
      size: 50,
    });
    expect(result).toMatchObject({ page: 1, size: 50 });
    const request = findRequest('GET', `/api/v1${ENDPOINTS.requests}`);
    expect(request?.query).toContain('search=ER-TEST');
    expect(request?.query).toContain('status=DRAFT');
    expect(request?.query).toContain('mineOnly=true');
    expect(request?.query).toContain('page=1');
    expect(request?.query).toContain('size=50');
    expect(request?.query).not.toContain('sort=');
    expect(request?.idempotencyKey).toBeNull();
  });

  it('uses the exact lookup, dashboard and keyset timeline query shapes', async () => {
    setMockSession(currentUser());
    await Promise.all([
      getExpenseCategories(),
      getCurrencies(),
      getDashboardSummary({ departmentId: STEP2_DEPARTMENT_ID, lookbackDays: 30 }),
      getRequestTimeline(STEP2_REQUEST_ID, { size: 20 }),
    ]);
    const categoryRequest = findRequest('GET', `/api/v1${ENDPOINTS.expenseCategories}`);
    const currencyRequest = findRequest('GET', `/api/v1${ENDPOINTS.currencies}`);
    const dashboardRequest = findRequest('GET', `/api/v1${ENDPOINTS.reportingDashboard}`);
    const activityRequest = findRequest('GET', `/api/v1/expense-requests/${STEP2_REQUEST_ID}/activity`);
    expect(categoryRequest?.query).toContain('includeInactive=false');
    expect(currencyRequest?.query).toContain('includeInactive=false');
    expect(dashboardRequest?.query).toContain(`departmentId=${STEP2_DEPARTMENT_ID}`);
    expect(dashboardRequest?.query).toContain('lookbackDays=30');
    expect(activityRequest?.query).toContain('size=20');
    expect(activityRequest?.query).not.toContain('page=');
  });

  it('sends the server DTOs, explicit idempotency keys and CSRF on every write', async () => {
    setMockSession(currentUser());
    const create = await createRequest(createPayload, 'create-key');
    const update = await updateRequest(STEP2_EDITABLE_REQUEST_ID, updatePayload, 'update-key');
    const submitted = await submitRequest(STEP2_REQUEST_ID, 'submit-key');
    const cancelled = await cancelRequest(
      STEP2_REQUEST_ID,
      { reason: 'Cancelled by service contract test' },
      'cancel-key',
    );

    expect(create.requestNumber).toContain('ER-TEST-CREATED');
    expect(update.id).toBe(STEP2_EDITABLE_REQUEST_ID);
    expect(submitted.status).toBe('SUBMITTED');
    expect(cancelled.status).toBe('CANCELLED');

    const createRequestLog = findRequest('POST', `/api/v1${ENDPOINTS.requests}`);
    expect(createRequestLog).toMatchObject({
      credentials: 'include',
      idempotencyKey: 'create-key',
      body: createPayload,
    });
    expect(createRequestLog?.csrf).toBeTruthy();
    const updateLog = findRequest('PUT', `/api/v1/expense-requests/${STEP2_EDITABLE_REQUEST_ID}`);
    expect(updateLog).toMatchObject({ idempotencyKey: 'update-key', body: updatePayload });
    expect(updateLog?.body).not.toHaveProperty('departmentId');
    expect(updateLog?.body).not.toHaveProperty('version');
    const submitLog = findRequest('POST', `/api/v1/expense-requests/${STEP2_REQUEST_ID}/submit`);
    expect(submitLog?.idempotencyKey).toBe('submit-key');
    expect(submitLog?.body).toBeUndefined();
    const cancelLog = findRequest('POST', `/api/v1/expense-requests/${STEP2_REQUEST_ID}/cancel`);
    expect(cancelLog?.idempotencyKey).toBe('cancel-key');
    expect(cancelLog?.body).toEqual({ reason: 'Cancelled by service contract test' });
  });

  it('returns the authorized detail including server action flags', async () => {
    setMockSession(currentUser());
    const detail = await getRequest(STEP2_REQUEST_ID);
    expect(detail).toMatchObject({
      id: STEP2_REQUEST_ID,
      requestNumber: 'ER-TEST-001',
      canEdit: true,
      canSubmit: true,
      canCancel: true,
    });
    expect(findRequest('GET', `/api/v1/expense-requests/${STEP2_REQUEST_ID}`)?.idempotencyKey)
      .toBeNull();
  });
});
