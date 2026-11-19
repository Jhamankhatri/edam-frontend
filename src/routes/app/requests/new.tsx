import { createFileRoute } from '@tanstack/react-router';
import { RequirePermission } from '@/auth/guards';
import { CreateRequestPage } from '@/features/requests/pages/CreateRequestPage';

function NewRequestRoute() {
  return (
    <RequirePermission>
      <CreateRequestPage />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/requests/new')({ component: NewRequestRoute });
