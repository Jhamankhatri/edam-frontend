import { createFileRoute } from '@tanstack/react-router';
import { RequirePermission } from '@/auth/guards';
import { RequestDetailPage } from '@/features/requests/pages/RequestDetailPage';

function RequestDetailRoute() {
  const { id } = Route.useParams();
  return (
    <RequirePermission>
      <RequestDetailPage id={id} />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/requests/$id/')({ component: RequestDetailRoute });
