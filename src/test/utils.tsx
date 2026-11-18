import { QueryClientProvider } from '@tanstack/react-query';
import { createMemoryHistory, RouterProvider } from '@tanstack/react-router';
import { render } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import type { ReactNode } from 'react';
import { AuthProvider } from '@/auth/AuthProvider';
import { useAuth } from '@/auth/useAuth';
import { createQueryClient } from '@/app/query-client';
import { createAppRouter } from '@/router';
import { TEST_PASSWORD } from './fixtures';

function AuthProbe() {
  const { status, user, login, logout } = useAuth();
  return (
    <div data-testid="auth-probe">
      <span data-testid="auth-status">{status}</span>
      <span data-testid="auth-user">{user?.displayName ?? ''}</span>
      <span data-testid="auth-permissions">{user?.permissions.join(',') ?? ''}</span>
      <button
        type="button"
        data-testid="probe-login"
        onClick={() => {
          void login({ username: 'admin', password: TEST_PASSWORD }).catch(() => undefined);
        }}
      >
        Probe login
      </button>
      <button
        type="button"
        data-testid="probe-logout"
        onClick={() => {
          void logout().catch(() => undefined);
        }}
      >
        Probe logout
      </button>
    </div>
  );
}

export function renderWithAuth(ui: ReactNode) {
  const queryClient = createQueryClient();
  return {
    ...render(
      <QueryClientProvider client={queryClient}>
        <AuthProvider>{ui}</AuthProvider>
      </QueryClientProvider>,
    ),
    queryClient,
  };
}

export function renderApp(initialPath = '/') {
  const history = createMemoryHistory({ initialEntries: [initialPath] });
  const router = createAppRouter(history);
  const queryClient = createQueryClient();
  const user = userEvent.setup();
  const result = render(
    <QueryClientProvider client={queryClient}>
      <AuthProvider>
        <AuthProbe />
        <RouterProvider router={router} />
      </AuthProvider>
    </QueryClientProvider>,
  );
  return { ...result, router, queryClient, user };
}
