import { screen, waitFor, within } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { ENDPOINTS } from '@/api/endpoints';
import {
  getBackendState,
  getRequestLog,
  setBootstrapped,
  setLoginResult,
  setMockSession,
} from '@/test/server';
import {
  currentUser,
  INITIAL_CSRF_TOKEN,
  INSTALLATION_TOKEN,
  POST_LOGIN_CSRF_TOKEN,
  TEST_PASSWORD,
} from '@/test/fixtures';
import { renderApp } from '@/test/utils';

function findRequest(method: string, path: string) {
  return getRequestLog().find((entry) => entry.method === method && entry.path === path);
}

async function fillLogin(user: ReturnType<typeof renderApp>['user'], password = TEST_PASSWORD) {
  await user.type(screen.getByLabelText('Username'), 'admin');
  await user.type(screen.getByLabelText('Password'), password);
  await user.click(screen.getByRole('button', { name: /sign in securely/i }));
}

describe('Step 1 route and screen flows', () => {
  it('signs in through the login form with exact CSRF and session-cookie behavior', async () => {
    const { router, user } = renderApp('/login');
    await screen.findByRole('heading', { name: 'Sign in to EDAM' });

    await fillLogin(user);
    await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated'));
    await waitFor(() => expect(router.state.location.pathname).toBe('/app/dashboard'));

    const log = getRequestLog();
    const csrfIndex = log.findIndex((entry) => entry.path === `/api/v1${ENDPOINTS.authCsrf}`);
    const loginIndex = log.findIndex(
      (entry) => entry.method === 'POST' && entry.path === `/api/v1${ENDPOINTS.authLogin}`,
    );
    expect(csrfIndex).toBeGreaterThanOrEqual(0);
    expect(loginIndex).toBeGreaterThan(csrfIndex);
    expect(log[loginIndex]).toMatchObject({
      credentials: 'include',
      csrf: INITIAL_CSRF_TOKEN,
      idempotencyKey: null,
      installationToken: null,
    });
  });

  it('shows the backend credential error without exposing internal details', async () => {
    const { user } = renderApp('/login');
    await screen.findByRole('heading', { name: 'Sign in to EDAM' });
    await fillLogin(user, 'WrongPass1');

    expect(await screen.findByText('The username or password is incorrect.')).toBeInTheDocument();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous');
  });

  it('bootstraps with HTTP 201 semantics and does not establish a session', async () => {
    setBootstrapped(false);
    const { router, user } = renderApp('/bootstrap');
    await screen.findByRole('heading', { name: 'Create the administrator' });

    await user.type(screen.getByLabelText('Installation token'), INSTALLATION_TOKEN);
    await user.type(screen.getByLabelText('First name'), 'Preview');
    await user.type(screen.getByLabelText('Last name'), 'Session');
    await user.type(screen.getByLabelText('Username'), 'admin');
    await user.type(screen.getByLabelText('Work email'), 'preview.session@example.invalid');
    await user.type(screen.getByLabelText('Initial password'), TEST_PASSWORD);
    await user.type(screen.getByLabelText('Confirm password'), TEST_PASSWORD);
    await user.click(screen.getByRole('button', { name: /complete installation/i }));
    expect(await screen.findByRole('heading', { name: 'Administrator created' })).toBeInTheDocument();
    expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous');
    expect(getBackendState().currentUser).toBeNull();
    expect(getBackendState().bootstrapped).toBe(true);
    expect(getBackendState().bootstrapCalls).toBe(1);

    const log = getRequestLog();
    const csrfIndex = log.findIndex((entry) => entry.path === `/api/v1${ENDPOINTS.authCsrf}`);
    const bootstrapIndex = log.findIndex(
      (entry) => entry.method === 'POST' && entry.path === `/api/v1${ENDPOINTS.authBootstrap}`,
    );
    expect(csrfIndex).toBeGreaterThanOrEqual(0);
    expect(bootstrapIndex).toBeGreaterThan(csrfIndex);
    expect(log[bootstrapIndex]).toMatchObject({
      credentials: 'include',
      csrf: INITIAL_CSRF_TOKEN,
      idempotencyKey: null,
      installationToken: INSTALLATION_TOKEN,
    });

    await user.click(screen.getByRole('button', { name: 'Continue to sign in' }));
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'));
  });

  it('redirects anonymous protected-route visits to login with a safe returnTo', async () => {
    const { router } = renderApp('/app/requests/mine?foo=bar');

    expect(await screen.findByRole('heading', { name: 'Sign in to EDAM' })).toBeInTheDocument();
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'));
    expect(router.state.location.search).toMatchObject({
      returnTo: '/app/requests/mine?foo=bar',
    });
  });

  it('hides unauthorized navigation and polls only permission-authorized shell badges', async () => {
    setMockSession(
      currentUser({
        permissions: ['report:view', 'request:view-own', 'approval:view'],
      }),
    );
    renderApp('/app/dashboard');
    await screen.findByRole('heading', { name: 'Dashboard', level: 1 });

    const nav = screen.getByRole('navigation', { name: 'Primary navigation' });
    expect(within(nav).getByRole('link', { name: 'Dashboard' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'My Requests' })).toBeInTheDocument();
    expect(within(nav).getByRole('link', { name: 'Approval Inbox' })).toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: 'New Request' })).not.toBeInTheDocument();
    expect(within(nav).queryByRole('link', { name: 'Notifications' })).not.toBeInTheDocument();

    expect(findRequest('GET', `/api/v1${ENDPOINTS.approvalsCount}`)).toBeDefined();
    expect(findRequest('GET', `/api/v1${ENDPOINTS.notificationsUnreadCount}`)).toBeUndefined();
  });

  it('shows a professional access-denied page when a route permission is missing', async () => {
    setMockSession(currentUser({ permissions: ['report:view'] }));
    renderApp('/app/approvals');

    expect(await screen.findByRole('heading', { name: 'Access denied' })).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /sign out and return to sign in/i })).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Approval Inbox', level: 1 })).not.toBeInTheDocument();
  });

  it('renders the root not-found experience', async () => {
    renderApp('/does-not-exist');
    expect(await screen.findByRole('heading', { name: 'Page not found' })).toBeInTheDocument();
  });

  it('forces a password change before workspace access and then releases the guard', async () => {
    setLoginResult(
      currentUser({
        mustChangePassword: true,
        permissions: ['report:view'],
      }),
    );
    const { router, user } = renderApp('/login');
    await screen.findByRole('heading', { name: 'Sign in to EDAM' });
    await fillLogin(user);

    await waitFor(() => expect(router.state.location.pathname).toBe('/change-password'));
    expect(await screen.findByRole('heading', { name: 'Change your password' })).toBeInTheDocument();

    await user.type(screen.getByLabelText('Current password'), TEST_PASSWORD);
    await user.type(screen.getByLabelText('New password'), 'NewPass12');
    await user.type(screen.getByLabelText('Confirm new password'), 'NewPass12');
    await user.click(screen.getByRole('button', { name: /update and continue/i }));

    await waitFor(() => expect(router.state.location.pathname).toBe('/app/dashboard'));
    expect(getBackendState().currentUser?.mustChangePassword).toBe(false);
    expect(findRequest('POST', `/api/v1${ENDPOINTS.authChangePassword}`)).toMatchObject({
      csrf: POST_LOGIN_CSRF_TOKEN,
      idempotencyKey: null,
    });
  });

  it('signs out from the accessible account menu', async () => {
    setMockSession(currentUser());
    const { router, user } = renderApp('/app/dashboard');
    await screen.findByRole('heading', { name: 'Dashboard', level: 1 });

    await user.click(screen.getByRole('button', { name: 'Open account menu' }));
    await user.click(await screen.findByRole('menuitem', { name: /sign out/i }));

    await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous'));
    expect(getBackendState().currentUser).toBeNull();
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'));
  });
});
