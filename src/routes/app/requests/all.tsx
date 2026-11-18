import { createFileRoute } from '@tanstack/react-router';
import { ListFilter } from 'lucide-react';
import { RequirePermission } from '@/auth/guards';
import { ModulePlaceholder } from '@/components/feedback/ModulePlaceholder';

function AllRequestsFoundation() {
  return (
    <RequirePermission>
      <ModulePlaceholder
        icon={ListFilter}
        title="All Requests"
        description="Foundation for the scoped register, filters, export entry point, and responsive table behavior. Backend data scope remains authoritative."
        endpointGroup="REQ-001 / RPT-003"
      />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/requests/all')({ component: AllRequestsFoundation });
