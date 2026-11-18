import { act, screen, waitFor } from '@testing-library/react';
import { describe, expect, it } from 'vitest';
import { publishAuthExpired } from './session-events';
import { currentUser, POST_LOGIN_CSRF_TOKEN } from '@/test/fixtures';
import {
  getBackendState,
  getRequestLog,
  http,
  HttpResponse,
  server,
  setLoginResult,
  setMockSession,
} from '@/test/server';
import { renderApp } from '@/test/utils';

describe('AuthProvider initialization and session lifecycle', () => {
  it('preserves a valid session on refresh and hides protected content until verification', async () => {
    setMockSession(currentUser({ permissions: ['report:view'] }));
    const { router } = renderApp('/app/dashboard');

    expect(screen.getByTestId('auth-status')).toHaveTextContent('initializing');
    expect(screen.queryByRole('heading', { name: 'Dashboard', level: 1 })).not.toBeInTheDocument();

    await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated'));
    expect(screen.getByTestId('auth-user')).toHaveTextContent('Avery Morgan');
    expect(await screen.findByRole('heading', { name: 'Dashboard', level: 1 })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/app/dashboard');
  });

  it('treats an EDAM-2001 /auth/me response as anonymous without an error screen', async () => {
    const { router } = renderApp('/app/dashboard');

    await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous'));
    expect(await screen.findByRole('heading', { name: 'Sign in to EDAM' })).toBeInTheDocument();
    expect(router.state.location.pathname).toBe('/login');
  });

  it('keeps protected content hidden on network failure and retries successfully', async () => {
    server.use(
      http.get('*/api/v1/auth/me', () => HttpResponse.error()),
    );
    const { user } = renderApp('/app/dashboard');

    expect(await screen.findByText('Unable to verify your session')).toBeInTheDocument();
    expect(screen.queryByRole('heading', { name: 'Dashboard', level: 1 })).not.toBeInTheDocument();

    setMockSession(currentUser({ permissions: ['report:view'] }));
    server.resetHandlers();
    await user.click(screen.getByRole('button', { name: /try again/i }));
    await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated'));
    expect(await screen.findByRole('heading', { name: 'Dashboard', level: 1 })).toBeInTheDocument();
  });

  it('does not log out a valid session when explicit CSRF priming fails', async () => {
    setMockSession(currentUser({ permissions: ['report:view'] }));
    server.use(http.get('*/api/v1/auth/csrf', () => HttpResponse.error()));
    renderApp('/app/dashboard');

    await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated'));
    expect(await screen.findByRole('heading', { name: 'Dashboard', level: 1 })).toBeInTheDocument();
    expect(screen.queryByText('Unable to verify your session')).not.toBeInTheDocument();
  });

  it('logs in and logs out through the shared session state', async () => {
    setLoginResult(currentUser({ permissions: ['report:view'] }));
    const { router, user } = renderApp('/login');
    await screen.findByRole('heading', { name: 'Sign in to EDAM' });

    await user.click(screen.getByTestId('probe-login'));
    await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated'));

    await user.click(screen.getByTestId('probe-logout'));
    await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous'));
    expect(getBackendState().currentUser).toBeNull();
    expect(
      getRequestLog().find(
        (entry) => entry.method === 'POST' && entry.path === '/api/v1/auth/logout',
      ),
    ).toMatchObject({ csrf: POST_LOGIN_CSRF_TOKEN, credentials: 'include', idempotencyKey: null });
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'));
  });

  it('clears cached data and redirects to login on a session-expiry event', async () => {
    setMockSession(currentUser({ permissions: ['report:view'] }));
    const { queryClient, router } = renderApp('/app/dashboard');
    await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('authenticated'));

    await act(async () => {
      queryClient.setQueryData(['approvals', 'count'], 3);
      publishAuthExpired({ path: '/api/v1/approvals/count' });
      await Promise.resolve();
    });

    await waitFor(() => expect(screen.getByTestId('auth-status')).toHaveTextContent('anonymous'));
    await waitFor(() => expect(queryClient.getQueryData(['approvals', 'count'])).toBeUndefined());
    await waitFor(() => expect(router.state.location.pathname).toBe('/login'));
  });
});
