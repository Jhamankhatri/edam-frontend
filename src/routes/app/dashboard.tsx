import { createFileRoute } from '@tanstack/react-router';
import { RequirePermission } from '@/auth/guards';
import { DashboardPage } from '@/features/dashboard/pages/DashboardPage';

function DashboardRoute() {
  return (
    <RequirePermission>
      <DashboardPage />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/dashboard')({ component: DashboardRoute });
