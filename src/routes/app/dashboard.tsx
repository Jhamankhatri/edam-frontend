import { createFileRoute } from '@tanstack/react-router';
import { LayoutDashboard } from 'lucide-react';
import { RequirePermission } from '@/auth/guards';
import { ModulePlaceholder } from '@/components/feedback/ModulePlaceholder';

function DashboardFoundation() {
  return (
    <RequirePermission>
      <ModulePlaceholder
        icon={LayoutDashboard}
        title="Dashboard"
        description="Permission-gated foundation for KPIs, distributions, and trends. No business metrics are simulated before the reporting module is implemented."
      />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/dashboard')({ component: DashboardFoundation });
