import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingRows } from '@/components/feedback/LoadingRows';
import { PageHeader } from '@/components/layout/PageHeader';
import { Surface } from '@/components/ui/surface';
import { SectionLabel } from '@/components/ui/register';
import { formatApiError } from '@/api/errors';
import { queryKeys } from '@/app/query-client';
import { RequestActions, RequestActivity, RequestDetailHeadingStatus, RequestDetailViews } from '../components/RequestDetailViews';
import { useRequestDetail } from '../hooks';

export function RequestDetailPage({ id }: { id: string }) {
  const detail = useRequestDetail(id);
  const queryClient = useQueryClient();
  const reload = useCallback((): void => {
    void Promise.all([
      detail.refetch(),
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all }),
    ]);
  }, [detail, queryClient]);
  const reconcile = useCallback((): void => {
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
    ]);
    toast.success('Register and dashboard refreshed');
  }, [queryClient]);

  const heading = (
    <PageHeader
      id="request-detail-heading"
      eyebrow="EDAM / Request detail"
      title="Request Details"
      description="All displayed values come from the documented request response and authorized activity endpoint."
      meta={detail.data?.requestNumber
        ? <span className="font-numeric text-xs font-semibold text-muted-foreground">{detail.data.requestNumber}</span>
        : undefined}
      status={detail.data ? <RequestDetailHeadingStatus request={detail.data} /> : undefined}
      actions={detail.data ? (
        <RequestActions request={detail.data} onReload={reload} onReconcile={reconcile} />
      ) : undefined}
    />
  );

  if (detail.isLoading) {
    return (
      <section aria-labelledby="request-detail-heading" className="space-y-6">
        {heading}
        <LoadingRows rows={7} label="Loading request details" />
      </section>
    );
  }
  if (detail.error) {
    return (
      <section aria-labelledby="request-detail-heading" className="space-y-6">
        {heading}
        <ErrorState
          title="Request detail unavailable"
          description={formatApiError(detail.error)}
          onRetry={reload}
        />
      </section>
    );
  }
  if (!detail.data) {
    return (
      <section aria-labelledby="request-detail-heading" className="space-y-6">
        {heading}
        <EmptyState
          index="01"
          title="No request returned"
          description="The backend returned no request detail for this authorized route."
          action={<Button asChild variant="outline"><Link to="/app/requests/mine" search={{ page: 0, size: 20 }}>Return to My Requests</Link></Button>}
        />
      </section>
    );
  }

  return (
    <section aria-labelledby="request-detail-heading" className="space-y-8">
      {heading}
      <RequestDetailViews request={detail.data} />
      <Surface variant="flat" padding="lg" className="space-y-4">
        <SectionLabel index="11">Authorized activity</SectionLabel>
        <RequestActivity id={id} />
      </Surface>
    </section>
  );
}
