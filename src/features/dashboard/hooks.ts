import { useQuery } from '@tanstack/react-query';
import { useAuth } from '@/auth/useAuth';
import { queryKeys } from '@/app/query-client';
import { getDashboardSummary } from '@/api/services/requests';
import type { DashboardQuery } from '@/api/services/request-contracts';
import type { QueryPrimitive } from '@/api/services/requests';

/**
 * The reporting dashboard is the only Step 2 business-data source. The permission
 * check is a UX gate; the backend endpoint remains authoritative.
 */
export function useDashboard(params: DashboardQuery = {}) {
  const { hasPermission } = useAuth();
  const keyParams: Record<string, QueryPrimitive> = { ...params };
  return useQuery({
    queryKey: queryKeys.dashboard.summary(keyParams),
    queryFn: () => getDashboardSummary(params),
    enabled: hasPermission('report:view'),
  });
}
