import { createFileRoute } from '@tanstack/react-router';
import { RequirePermission } from '@/auth/guards';
import { EditRequestPage } from '@/features/requests/pages/EditRequestPage';

function EditRequestRoute() {
  const { id } = Route.useParams();
  return (
    <RequirePermission>
      <EditRequestPage id={id} />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/requests/$id/edit')({ component: EditRequestRoute });
