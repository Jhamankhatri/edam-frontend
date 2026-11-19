import { createFileRoute } from '@tanstack/react-router';
import { RequirePermission } from '@/auth/guards';
import { RequestListPage } from '@/features/requests/pages/RequestListPage';
import { parseRequestListSearch } from '@/features/requests/search';

function MyRequestsRoute() {
  const filters = Route.useSearch();
  const navigate = Route.useNavigate();
  return (
    <RequirePermission>
      <RequestListPage
        mode="mine"
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

export const Route = createFileRoute('/app/requests/mine')({
  validateSearch: parseRequestListSearch,
  component: MyRequestsRoute,
});
