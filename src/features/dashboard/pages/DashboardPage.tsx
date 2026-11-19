import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingRows } from '@/components/feedback/LoadingRows';
import { useAuth } from '@/auth/useAuth';
import { formatApiError } from '@/api/errors';
import { useDashboard } from '../hooks';
import {
  DashboardHeading,
  DashboardIntro,
  DashboardProvenance,
  DistributionSection,
  MetricsRegister,
  TrendTable,
  WorkspaceNavigation,
} from '../components/DashboardViews';

export function DashboardPage() {
  const { hasPermission } = useAuth();
  const dashboard = useDashboard();
  const summary = dashboard.data;

  if (!hasPermission('report:view')) {
    return (
      <section aria-labelledby="dashboard-heading" className="space-y-6">
        <DashboardHeading />
        <Alert variant="warning">
          <div>
            <AlertTitle>Dashboard data is not available</AlertTitle>
            <AlertDescription>
              This session does not include `report:view`. The route guard remains authoritative and no
              reporting endpoint is called.
            </AlertDescription>
          </div>
        </Alert>
      </section>
    );
  }

  const metrics = summary?.metrics ?? [];
  const distributions = [
    summary?.byStatus ?? [],
    summary?.byDepartment ?? [],
    summary?.byCategory ?? [],
    summary?.byExpenseType ?? [],
  ];
  const trend = summary?.trend ?? [];
  const hasBusinessData = metrics.length > 0 || trend.length > 0 || distributions.some((rows) => rows.length > 0);

  return (
    <section aria-labelledby="dashboard-heading" className="space-y-6 sm:space-y-8">
      <DashboardHeading />
      <DashboardIntro summary={summary} />

      {dashboard.isLoading ? (
        <LoadingRows rows={7} label="Loading reporting dashboard" />
      ) : dashboard.error ? (
        <ErrorState
          title="Reporting dashboard unavailable"
          description={formatApiError(dashboard.error)}
          onRetry={() => { void dashboard.refetch(); }}
        />
      ) : !summary || !hasBusinessData ? (
        <EmptyState
          index="02"
          title="No reporting values returned"
          description="The backend returned no dashboard metrics, distributions or trend buckets. No KPIs, totals, charts, notifications or activity are invented."
          action={<WorkspaceNavigation />}
        />
      ) : (
        <>
          <MetricsRegister metrics={metrics} />
          <div className="grid grid-cols-1 gap-5 lg:grid-cols-2">
            <DistributionSection index="03" title="By status" rows={summary.byStatus ?? []} baseCurrencyCode={summary.baseCurrencyCode} />
            <DistributionSection index="04" title="By department" rows={summary.byDepartment ?? []} baseCurrencyCode={summary.baseCurrencyCode} />
            <DistributionSection index="05" title="By category" rows={summary.byCategory ?? []} baseCurrencyCode={summary.baseCurrencyCode} />
            <DistributionSection index="06" title="By expense type" rows={summary.byExpenseType ?? []} baseCurrencyCode={summary.baseCurrencyCode} />
          </div>
          <TrendTable trend={trend} />
          <WorkspaceNavigation />
          <DashboardProvenance summary={summary} />
        </>
      )}
    </section>
  );
}
