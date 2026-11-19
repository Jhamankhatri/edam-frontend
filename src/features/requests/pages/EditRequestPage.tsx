import { Link, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingRows } from '@/components/feedback/LoadingRows';
import { PageHeader } from '@/components/layout/PageHeader';
import { formatApiError } from '@/api/errors';
import { RequestForm } from '../components/RequestForm';
import { hasUnpreservableDetail } from '../form-state';
import { useRequestDetail, useUpdateRequest } from '../hooks';

export function EditRequestPage({ id }: { id: string }) {
  const detail = useRequestDetail(id);
  const update = useUpdateRequest();
  const navigate = useNavigate();
  const heading = (
    <PageHeader
      id="edit-request-heading"
      eyebrow="EDAM / Replace request"
      title="Edit Request"
      description="Only a request the backend marks editable can be replaced."
    />
  );

  if (detail.isLoading) {
    return (
      <section aria-labelledby="edit-request-heading" className="space-y-6">
        {heading}
        <LoadingRows rows={7} label="Loading editable request" />
      </section>
    );
  }
  if (detail.error) {
    return (
      <section aria-labelledby="edit-request-heading" className="space-y-6">
        {heading}
        <ErrorState
          title="Editable request unavailable"
          description={formatApiError(detail.error)}
          onRetry={() => { void detail.refetch(); }}
        />
      </section>
    );
  }
  if (!detail.data) {
    return (
      <section aria-labelledby="edit-request-heading" className="space-y-6">
        {heading}
        <ErrorState description="The backend returned no request detail." />
      </section>
    );
  }
  if (hasUnpreservableDetail(detail.data)) {
    return (
      <section aria-labelledby="edit-request-heading" className="space-y-6">
        {heading}
        <Alert variant="warning">
          <div>
            <AlertTitle>Safe replacement is not available for this record</AlertTitle>
            <AlertDescription>
              `UpdateRequest` replaces details and child rows, but the pinned response DTOs
              omit several payload-only fields. Header-only drafts can be edited; this record
              contains fields the frontend cannot round-trip. A backend contract decision is
              required before exposing a replacement form for it.
            </AlertDescription>
          </div>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/app/requests/$id" params={{ id }}>Return to details</Link>
        </Button>
      </section>
    );
  }

  if (detail.data.canEdit !== true) {
    return (
      <section aria-labelledby="edit-request-heading" className="space-y-6">
        {heading}
        <Alert variant="warning">
          <div>
            <AlertTitle>Editing is not available</AlertTitle>
            <AlertDescription>
              The backend did not mark this request as editable. No replacement request will be sent.
            </AlertDescription>
          </div>
        </Alert>
        <Button asChild variant="outline">
          <Link to="/app/requests/$id" params={{ id }}>Return to details</Link>
        </Button>
      </section>
    );
  }

  return (
    <RequestForm
      key={`${detail.data.id ?? id}-${detail.data.version ?? detail.data.updatedAt ?? 'current'}`}
      mode="edit"
      initialResponse={detail.data}
      onReload={() => { void detail.refetch(); }}
      onReconcile={() => { void detail.refetch(); toast.success('Latest request state refreshed'); }}
      onSubmit={async (payload, idempotencyKey) => {
        await update.mutateAsync({ id, payload, idempotencyKey });
        toast.success('Request updated');
        await navigate({ to: '/app/requests/$id', params: { id } });
      }}
    />
  );
}
