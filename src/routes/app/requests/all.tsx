import { createFileRoute } from '@tanstack/react-router';
import { RequirePermission } from '@/auth/guards';
import { RequestListPage } from '@/features/requests/pages/RequestListPage';
import { parseRequestListSearch } from '@/features/requests/search';

function AllRequestsRoute() {
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <RequirePermission>
      <RequestListPage
        mode="all"
        filters={filters}
        onFiltersChange={(next) => {
          void navigate({
            search: (previous) => ({ ...previous, ...next }),
            replace: true,
          });
        }}
      />
    </RequirePermission>
  );
}

export const Route = createFileRoute('/app/requests/all')({
  validateSearch: parseRequestListSearch,
  component: AllRequestsRoute,
});
