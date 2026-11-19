import { useCallback } from 'react';
import { useQueryClient } from '@tanstack/react-query';
import { useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { queryKeys } from '@/app/query-client';
import { RequestForm } from '../components/RequestForm';
import { useCreateRequest } from '../hooks';

export function CreateRequestPage() {
  const create = useCreateRequest();
  const navigate = useNavigate();
  const queryClient = useQueryClient();
  const refresh = useCallback((): void => {
    void Promise.all([
      queryClient.invalidateQueries({ queryKey: queryKeys.requests.all }),
      queryClient.invalidateQueries({ queryKey: queryKeys.dashboard.all }),
    ]);
    toast.success('Register and dashboard refreshed');
  }, [queryClient]);

  return (
    <RequestForm
      mode="create"
      onReload={refresh}
      onReconcile={refresh}
      onSubmit={async (payload, idempotencyKey) => {
        const response = await create.mutateAsync({ payload, idempotencyKey });
        toast.success('Request created');
        if (response.id) {
          await navigate({ to: '/app/requests/$id', params: { id: response.id } });
        } else {
          await navigate({ to: '/app/requests/mine', search: { page: 0, size: 20 } });
        }
      }}
    />
  );
}
