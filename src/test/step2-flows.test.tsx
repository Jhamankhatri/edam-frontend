import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ENDPOINTS } from '@/api/endpoints';
import { renderApp } from '@/test/utils';
import {
  currentUser,
  emptyStep2Dashboard,
  step2SecondRequest,
  STEP2_EDITABLE_REQUEST_ID,
  STEP2_REQUEST_ID,
} from '@/test/fixtures';
import { getRequestLog, setMockSession, setStep2State } from '@/test/server';

const CREATE_PATH = '/app/requests/new';
const MINE_PATH = '/app/requests/mine?page=0&size=20';
const ALL_PATH = '/app/requests/all?page=0&size=20';
const DETAIL_PATH = `/app/requests/${STEP2_REQUEST_ID}`;
const CREATE_LOG_PATH = `/api/v1${ENDPOINTS.requests}`;

type RenderedUser = ReturnType<typeof renderApp>['user'];

async function choose(user: RenderedUser, label: string, option: string) {
  await user.click(screen.getByRole('combobox', { name: label }));
  await user.click(await screen.findByRole('option', { name: option }));
}

async function fillCreateForm(user: RenderedUser) {
  await screen.findByText('Header register');
  await choose(user, 'Request type', 'Standard operating expense');
  await choose(user, 'Expense category', 'Travel');
  await choose(user, 'Expense nature', 'Recurring');
  await choose(user, 'Department', 'Finance');
  await choose(user, 'Currency', 'Pakistani Rupee');
  await user.type(screen.getByLabelText('Requested amount'), '1250.50');
}

function findRequest(method: string, path: string) {
  return getRequestLog().find((entry) => entry.method === method && entry.path === path);
}

function postKeys(path = CREATE_LOG_PATH): (string | null)[] {
  return getRequestLog()
    .filter((entry) => entry.method === 'POST' && entry.path === path)
    .map((entry) => entry.idempotencyKey);
}

describe('Step 2 dashboard and request flows', () => {
  it('renders only backend dashboard metrics and their documented base currency', async () => {
    setMockSession(currentUser());
    renderApp('/app/dashboard');
    expect(await screen.findByRole('heading', { level: 1, name: 'Dashboard' })).toBeInTheDocument();
    expect(await screen.findByText('Total requests')).toBeInTheDocument();
    expect(screen.getByText('Finance')).toBeInTheDocument();
    expect(screen.getByText(/Source: `GET \/reporting\/dashboard`/)).toBeInTheDocument();
    expect(screen.getByText(/no FX re-conversion/i)).toBeInTheDocument();
    expect(findRequest('GET', `/api/v1${ENDPOINTS.reportingDashboard}`)).toBeDefined();
  });

  it('shows a contract-faithful empty dashboard without fabricated KPIs', async () => {
    setMockSession(currentUser());
    setStep2State({ dashboard: emptyStep2Dashboard });
    renderApp('/app/dashboard');
    expect(await screen.findByText('No reporting values returned')).toBeInTheDocument();
    expect(screen.queryByText('Total requests')).not.toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /My Requests/ }).length).toBeGreaterThan(0);
  });

  it('preserves the H04 navigation exception while H09 keeps the dashboard route gated', async () => {
    const permissions = currentUser().permissions.filter((permission) => permission !== 'report:view');
    setMockSession(currentUser({ permissions }));
    renderApp('/app/dashboard');
    expect(await screen.findByText('Access denied')).toBeInTheDocument();
    expect(screen.getAllByRole('link', { name: /Dashboard/ }).length).toBeGreaterThan(0);
    expect(findRequest('GET', `/api/v1${ENDPOINTS.reportingDashboard}`)).toBeUndefined();
  });

  it('uses one documented register endpoint with mineOnly and no client sort control', async () => {
    setMockSession(currentUser());
    renderApp(MINE_PATH);
    expect(await screen.findByRole('heading', { level: 1, name: 'My Requests' })).toBeInTheDocument();
    expect(await screen.findByText('ER-TEST-001')).toBeInTheDocument();
    const mineRequest = findRequest('GET', CREATE_LOG_PATH);
    expect(mineRequest?.query).toContain('mineOnly=true');
    expect(mineRequest?.query).toContain('page=0');
    expect(mineRequest?.query).toContain('size=20');
    expect(mineRequest?.query).not.toContain('sort=');
    expect(screen.getByText(/No client sort control is offered/)).toBeInTheDocument();
  });

  it('uses backend visibility for All Requests with mineOnly=false', async () => {
    setMockSession(currentUser());
    renderApp(ALL_PATH);
    expect(await screen.findByRole('heading', { level: 1, name: 'All Requests' })).toBeInTheDocument();
    expect(await screen.findByText('ER-TEST-002')).toBeInTheDocument();
    const allRequest = findRequest('GET', CREATE_LOG_PATH);
    expect(allRequest?.query).toContain('mineOnly=false');
    expect(screen.getByText(/backend-scoped register/i)).toBeInTheDocument();
  });

  it('renders request detail, authorized activity and only server-authorized actions', async () => {
    setMockSession(currentUser());
    renderApp(DETAIL_PATH);
    expect(await screen.findByRole('heading', { level: 1, name: 'Request Details' })).toBeInTheDocument();
    expect(await screen.findByText('Draft request created')).toBeInTheDocument();
    expect(screen.getByRole('link', { name: 'Edit request' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Submit' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: 'Cancel request' })).toBeInTheDocument();
    expect(findRequest('GET', `/api/v1/expense-requests/${STEP2_REQUEST_ID}/activity`)?.query)
      .toContain('size=20');
  });

  it('hides actions when the backend response sets canEdit/canSubmit false', async () => {
    setMockSession(currentUser());
    const id = step2SecondRequest.id ?? '';
    renderApp(`/app/requests/${id}`);
    expect(await screen.findByRole('heading', { level: 1, name: 'Request Details' })).toBeInTheDocument();
    expect(await screen.findByRole('button', { name: 'Cancel request' })).toBeInTheDocument();
    expect(screen.queryByRole('link', { name: 'Edit request' })).not.toBeInTheDocument();
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
  });

  it('stops replacement of richer records whose payload-only fields cannot round-trip', async () => {
    setMockSession(currentUser());
    renderApp(`${DETAIL_PATH}/edit`);
    expect(await screen.findByText('Safe replacement is not available for this record')).toBeInTheDocument();
    expect(findRequest('PUT', `/api/v1/expense-requests/${STEP2_REQUEST_ID}`)).toBeUndefined();
  });

  it('creates a request with an explicit idempotency key and navigates to its detail', async () => {
    setMockSession(currentUser());
    const { router, user } = renderApp(CREATE_PATH);
    expect(await screen.findByRole('heading', { level: 1, name: 'New Request' })).toBeInTheDocument();
    await fillCreateForm(user);
    await user.click(screen.getByRole('button', { name: 'Create request' }));

    await waitFor(() => {
      expect(findRequest('POST', CREATE_LOG_PATH)).toBeDefined();
    });
    const log = findRequest('POST', CREATE_LOG_PATH);
    expect(log?.idempotencyKey).toMatch(/^[0-9a-f-]{36}$/i);
    expect(log?.body).toMatchObject({
      requestTypeId: expect.any(String),
      departmentId: expect.any(String),
      requestedAmount: 1250.5,
    });
    expect(log?.body).not.toHaveProperty('version');
    await waitFor(() => expect(router.state.location.pathname).toMatch(/^\/app\/requests\//));
  });

  it('replaces only a header-only editable draft with UpdateRequest semantics', async () => {
    setMockSession(currentUser());
    const { user } = renderApp(`/app/requests/${STEP2_EDITABLE_REQUEST_ID}/edit`);
    expect(await screen.findByRole('heading', { level: 1, name: 'Edit Request' })).toBeInTheDocument();
    const amount = await screen.findByLabelText('Requested amount');
    await user.clear(amount);
    await user.type(amount, '777.25');
    await user.click(screen.getByRole('button', { name: 'Save changes' }));
    await waitFor(() => {
      expect(findRequest('PUT', `/api/v1/expense-requests/${STEP2_EDITABLE_REQUEST_ID}`)).toBeDefined();
    });
    const log = findRequest('PUT', `/api/v1/expense-requests/${STEP2_EDITABLE_REQUEST_ID}`);
    expect(log?.idempotencyKey).toMatch(/^[0-9a-f-]{36}$/i);
    expect(log?.body).toMatchObject({ requestedAmount: 777.25 });
    expect(log?.body).not.toHaveProperty('departmentId');
    expect(log?.body).not.toHaveProperty('version');
    expect(log?.body).not.toHaveProperty('documents');
  });

  it('submits through the documented endpoint and displays the server-returned status', async () => {
    setMockSession(currentUser());
    const { user } = renderApp(DETAIL_PATH);
    await user.click(await screen.findByRole('button', { name: 'Submit' }));
    const dialog = await screen.findByRole('dialog');
    await user.click(within(dialog).getByRole('button', { name: 'Submit request' }));
    await waitFor(() => {
      expect(findRequest('POST', `/api/v1/expense-requests/${STEP2_REQUEST_ID}/submit`)).toBeDefined();
    });
    const log = findRequest('POST', `/api/v1/expense-requests/${STEP2_REQUEST_ID}/submit`);
    expect(log?.idempotencyKey).toMatch(/^[0-9a-f-]{36}$/i);
    expect(log?.body).toBeUndefined();
    expect((await screen.findAllByText('Submitted')).length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'Submit' })).not.toBeInTheDocument();
  });

  it('requires a cancellation reason and sends the documented CancelRequest DTO', async () => {
    setMockSession(currentUser());
    const { user } = renderApp(DETAIL_PATH);
    await user.click(await screen.findByRole('button', { name: 'Cancel request' }));
    const dialog = await screen.findByRole('dialog');
    await user.type(within(dialog).getByLabelText('Cancellation reason'), 'Duplicate preview request');
    await user.click(within(dialog).getByRole('button', { name: 'Cancel request' }));
    await waitFor(() => {
      expect(findRequest('POST', `/api/v1/expense-requests/${STEP2_REQUEST_ID}/cancel`)).toBeDefined();
    });
    const log = findRequest('POST', `/api/v1/expense-requests/${STEP2_REQUEST_ID}/cancel`);
    expect(log?.idempotencyKey).toMatch(/^[0-9a-f-]{36}$/i);
    expect(log?.body).toEqual({ reason: 'Duplicate preview request' });
    expect((await screen.findAllByText('Cancelled')).length).toBeGreaterThan(0);
  });

  it('shows backend field errors and provides EDAM-1004 new-key recovery', async () => {
    setMockSession(currentUser());
    setStep2State({
      createOutcome: {
        status: 400,
        code: 'EDAM-1001',
        message: 'Validation failed.',
        fieldErrors: [{ field: 'requestedAmount', message: 'Backend rejected the amount.' }],
      },
    });
    const first = renderApp(CREATE_PATH);
    await screen.findByRole('heading', { level: 1, name: 'New Request' });
    await fillCreateForm(first.user);
    await first.user.click(screen.getByRole('button', { name: 'Create request' }));
    expect(await screen.findByText('Correct the highlighted fields')).toBeInTheDocument();
    expect(screen.getAllByText('Backend rejected the amount.').length).toBeGreaterThan(0);
    expect(screen.queryByRole('button', { name: 'Start a new submission' })).not.toBeInTheDocument();
    first.unmount();

    setStep2State({
      createOutcome: {
        status: 409,
        code: 'EDAM-1004',
        message: 'This idempotency key was used with a different payload.',
      },
    });
    const second = renderApp(CREATE_PATH);
    await screen.findByRole('heading', { level: 1, name: 'New Request' });
    await fillCreateForm(second.user);
    await second.user.click(screen.getByRole('button', { name: 'Create request' }));
    expect(await screen.findByText('A new submission key is required')).toBeInTheDocument();
    setStep2State({ createOutcome: null });
    await second.user.click(screen.getByRole('button', { name: 'Start a new submission' }));
    await waitFor(() => expect(postKeys().length).toBeGreaterThanOrEqual(3));
    const keys = postKeys();
    expect(keys.at(-1)).toMatch(/^[0-9a-f-]{36}$/i);
    expect(keys.at(-1)).not.toBe(keys.at(-2));
  });

  it('shows an explicit unavailable state when required lookup permissions are missing', async () => {
    const permissions = currentUser().permissions.filter(
      (permission) => permission !== 'expense-configuration:view',
    );
    setMockSession(currentUser({ permissions }));
    renderApp(CREATE_PATH);
    expect(await screen.findByRole('heading', { level: 1, name: 'New Request' })).toBeInTheDocument();
    expect(await screen.findByText('Request form unavailable')).toBeInTheDocument();
    expect(screen.getByText(/Request types, categories and natures/)).toBeInTheDocument();
    expect(findRequest('GET', `/api/v1${ENDPOINTS.requestTypes}`)).toBeUndefined();
    expect(findRequest('POST', CREATE_LOG_PATH)).toBeUndefined();
  });
});
