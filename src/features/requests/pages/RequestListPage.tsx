import { useCallback, useMemo } from 'react';
import { Link } from '@tanstack/react-router';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/feedback/ErrorState';
import { EmptyState } from '@/components/feedback/EmptyState';
import { LoadingRows } from '@/components/feedback/LoadingRows';
import { PageHeader } from '@/components/layout/PageHeader';
import { useAuth } from '@/auth/useAuth';
import { formatApiError } from '@/api/errors';
import type { RequestListQuery } from '@/api/services/request-contracts';
import { RequestFilters } from '../components/RequestFilters';
import { RequestTable } from '../components/RequestTable';
import { useRequestFilterLookups, useRequestList } from '../hooks';
import type { RequestListFilters } from '../types';

interface RequestListPageProps {
  mode: 'mine' | 'all';
  filters: RequestListFilters;
  onFiltersChange: (next: Partial<RequestListFilters>) => void;
}

export function RequestListPage({ mode, filters, onFiltersChange }: RequestListPageProps) {
  const { hasPermission } = useAuth();
  const params = useMemo<RequestListQuery>(() => ({
    search: filters.search,
    status: filters.status,
    departmentId: filters.departmentId,
    categoryId: filters.categoryId,
    mineOnly: mode === 'mine',
    page: filters.page,
    size: filters.size,
  }), [filters, mode]);
  const list = useRequestList(params);
  const lookups = useRequestFilterLookups();
  const change = useCallback(
    (next: Partial<RequestListFilters>) => onFiltersChange(next),
    [onFiltersChange],
  );
  const page = list.data?.page ?? filters.page;
  const items = list.data?.items ?? [];

  return (
    <section aria-labelledby="requests-heading" className="space-y-6 sm:space-y-8">
      <PageHeader
        id="requests-heading"
        eyebrow="EDAM / Request register"
        title={mode === 'mine' ? 'My Requests' : 'All Requests'}
        description={mode === 'mine'
          ? 'Your own requests, using the documented mineOnly register filter.'
          : 'The backend-scoped register. The backend determines visibility; no frontend scope rule is applied.'}
        actions={hasPermission('request:create') ? (
          <Button asChild variant="default">
            <Link to="/app/requests/new">New request</Link>
          </Button>
        ) : undefined}
      />

      <RequestFilters filters={filters} lookups={lookups} onChange={change} />

      {list.isLoading ? (
        <LoadingRows rows={6} label="Loading expense requests" />
      ) : list.error ? (
        <ErrorState
          title="Request register unavailable"
          description={formatApiError(list.error)}
          onRetry={() => { void list.refetch(); }}
        />
      ) : items.length === 0 ? (
        <EmptyState
          index="02"
          title="No requests returned"
          description="The backend returned no rows for these documented filters. No sample records are displayed."
          action={(
            <div className="flex flex-wrap justify-center gap-2">
              <Button type="button" variant="outline" onClick={() => { void list.refetch(); }}>
                Refresh
              </Button>
              {hasPermission('request:create') && (
                <Button asChild>
                  <Link to="/app/requests/new">New request</Link>
                </Button>
              )}
            </div>
          )}
        />
      ) : (
        <RequestTable
          items={items}
          lookups={lookups}
          hasPrevious={list.data?.hasPrevious}
          hasNext={list.data?.hasNext}
          page={page}
          size={list.data?.size}
          totalElements={list.data?.totalElements}
          totalPages={list.data?.totalPages}
          onPrevious={() => change({ page: Math.max(0, page - 1) })}
          onNext={() => change({ page: page + 1 })}
        />
      )}
    </section>
  );
}
