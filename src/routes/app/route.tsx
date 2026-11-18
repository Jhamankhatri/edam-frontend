import { createFileRoute, Outlet } from '@tanstack/react-router';
import { RequireAuth } from '@/auth/guards';
import { AppShell } from '@/components/layout/AppShell';

function AppLayoutRoute() {
  return (
    <RequireAuth>
      <AppShell>
        <Outlet />
      </AppShell>
    </RequireAuth>
  );
}

export const Route = createFileRoute('/app')({ component: AppLayoutRoute });
