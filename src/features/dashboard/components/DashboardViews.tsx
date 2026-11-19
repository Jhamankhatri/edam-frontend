import { Link } from '@tanstack/react-router';
import { EmptyState } from '@/components/feedback/EmptyState';
import { PageHeader } from '@/components/layout/PageHeader';
import { Badge } from '@/components/ui/badge';
import { Surface } from '@/components/ui/surface';
import { SectionLabel } from '@/components/ui/register';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableWrapper } from '@/components/ui/table';
import { useAuth } from '@/auth/useAuth';
import { getVisibleNavigation } from '@/config/navigation';
import type { DashboardSummary, DistributionRow, MetricCard, TrendPoint } from '@/api/services/request-contracts';
import { formatDateTime, formatMoney, formatNumber, formatScalar } from '@/features/requests/format';

export function DashboardIntro({ summary }: { summary: DashboardSummary | undefined }) {
  const { user, publicConfiguration, hasPermission } = useAuth();
  return (
    <Surface variant="brand" padding="lg" className="space-y-6">
      <SectionLabel index="01" tone="onBrand">Workspace overview</SectionLabel>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <h2 className="font-display text-3xl font-semibold tracking-display text-on-brand sm:text-4xl">
            Institutional reporting register
          </h2>
          <p className="mt-4 max-w-2xl text-sm leading-relaxed text-on-brand-muted sm:text-base">
            A permission-gated reading of the aggregate fields returned by the reporting dashboard.
            Every business figure below is supplied by the backend response; none is inferred here.
          </p>
        </div>
        <dl className="grid gap-3 font-numeric text-xs text-on-brand-muted">
          <div>
            <dt className="uppercase tracking-micro">Session</dt>
            <dd className="mt-1 text-on-brand">{formatScalar(user?.displayName)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-micro">Institution</dt>
            <dd className="mt-1 text-on-brand">{formatScalar(publicConfiguration?.organizationDisplayName)}</dd>
          </div>
          <div>
            <dt className="uppercase tracking-micro">Base currency</dt>
            <dd className="mt-1 text-on-brand">{formatScalar(summary?.baseCurrencyCode)}</dd>
          </div>
        </dl>
      </div>
      <div className="ledger-rule" />
      <p className="font-numeric text-2xs uppercase tracking-micro text-on-brand-quiet">
        {hasPermission('report:view')
          ? 'Reporting endpoint enabled for this session'
          : 'Reporting endpoint permission is not present in this session'}
      </p>
    </Surface>
  );
}

export function MetricsRegister({ metrics }: { metrics: readonly MetricCard[] }) {
  if (metrics.length === 0) {
    return (
      <EmptyState
        index="02"
        title="No metrics returned"
        description="The reporting endpoint returned no metric rows. No key performance indicators are fabricated."
      />
    );
  }
  return (
    <section aria-labelledby="metrics-heading" className="space-y-4">
      <SectionLabel index="02"><span id="metrics-heading">Backend metrics register</span></SectionLabel>
      <TableWrapper className="scrollbar-subtle">
        <Table>
          <caption className="sr-only">Metric cards returned by the reporting dashboard</caption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Reference</TableHead>
              <TableHead scope="col">Measure</TableHead>
              <TableHead scope="col">Value</TableHead>
              <TableHead scope="col">Unit</TableHead>
              <TableHead scope="col">Backend note</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {metrics.map((metric, index) => (
              <TableRow key={metric.key ?? `${metric.label ?? 'metric'}-${index}`}>
                <TableCell className="font-numeric text-xs">{formatScalar(metric.key)}</TableCell>
                <TableCell className="font-semibold">{formatScalar(metric.label)}</TableCell>
                <TableCell className="font-numeric text-base font-semibold">{formatNumber(metric.value)}</TableCell>
                <TableCell className="font-numeric text-xs">{formatScalar(metric.unit)}</TableCell>
                <TableCell className="text-sm text-muted-foreground">{formatScalar(metric.subtitle)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </section>
  );
}

export function DistributionSection({
  index,
  title,
  rows,
  baseCurrencyCode,
}: {
  index: string;
  title: string;
  rows: readonly DistributionRow[];
  baseCurrencyCode?: string;
}) {
  return (
    <Surface variant="flat" padding="md" className="space-y-3">
      <SectionLabel index={index}>{title}</SectionLabel>
      {rows.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">No rows returned by the backend.</p>
      ) : (
        <div>
          {rows.map((row, rowIndex) => (
            <div key={row.key ?? `${title}-${rowIndex}`} className="register-row flex gap-4 py-3">
              <span className="shrink-0 font-numeric text-xs font-semibold text-accent-warm">
                {String(rowIndex + 1).padStart(2, '0')}
              </span>
              <div className="min-w-0 flex-1">
                <p className="text-sm font-semibold text-foreground">{formatScalar(row.label)}</p>
                <p className="mt-1 font-numeric text-xs text-muted-foreground">
                  {formatNumber(row.count, { maximumFractionDigits: 0 })} entries ·{' '}
                  {formatMoney(row.amount, baseCurrencyCode)}
                </p>
              </div>
            </div>
          ))}
        </div>
      )}
    </Surface>
  );
}

export function TrendTable({ trend }: { trend: readonly TrendPoint[] }) {
  if (trend.length === 0) {
    return (
      <EmptyState
        index="07"
        title="No trend buckets returned"
        description="The reporting endpoint returned no trend points. No chart history is simulated."
      />
    );
  }
  return (
    <section aria-labelledby="trend-heading" className="space-y-4">
      <SectionLabel index="07"><span id="trend-heading">Trend buckets</span></SectionLabel>
      <TableWrapper className="scrollbar-subtle">
        <Table>
          <caption className="sr-only">Trend points returned by the reporting dashboard</caption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Bucket start</TableHead>
              <TableHead scope="col">Bucket end</TableHead>
              <TableHead scope="col">Count</TableHead>
              <TableHead scope="col">Amount</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {trend.map((point, index) => (
              <TableRow key={point.bucketStart ?? `${index}`}>
                <TableCell className="font-numeric text-xs">{formatDateTime(point.bucketStart)}</TableCell>
                <TableCell className="font-numeric text-xs">{formatDateTime(point.bucketEnd)}</TableCell>
                <TableCell className="font-numeric">{formatNumber(point.count, { maximumFractionDigits: 0 })}</TableCell>
                <TableCell className="font-numeric">{formatNumber(point.amount)}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
    </section>
  );
}

export function WorkspaceNavigation() {
  const { user } = useAuth();
  const items = getVisibleNavigation(user?.permissions);
  return (
    <Surface variant="quiet" padding="md" className="space-y-3">
      <SectionLabel index="08">Permitted navigation</SectionLabel>
      {items.length === 0 ? (
        <p className="py-4 text-sm text-muted-foreground">No navigation items are permitted for this session.</p>
      ) : (
        <div>
          {items.map((item, index) => (
            <div key={item.to} className="register-row flex gap-4 py-3">
              <span className="shrink-0 font-numeric text-xs font-semibold text-accent-warm">
                {String(index + 1).padStart(2, '0')}
              </span>
              <Link
                to={item.to}
                className="inline-flex min-h-10 flex-1 items-center justify-between gap-3 rounded-md text-sm font-semibold text-foreground hover:text-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
              >
                <span>{item.label}</span>
                <span className="text-xs font-normal text-muted-foreground">{item.description}</span>
              </Link>
            </div>
          ))}
        </div>
      )}
    </Surface>
  );
}

export function DashboardProvenance({ summary }: { summary: DashboardSummary }) {
  return (
    <Surface variant="inset" padding="md">
      <div className="flex flex-col gap-3 lg:flex-row lg:items-start lg:justify-between">
        <p className="max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Source: `GET /reporting/dashboard`. Monetary values use the response base currency
          {' '}{formatScalar(summary.baseCurrencyCode)}; no FX re-conversion or aggregate arithmetic is
          performed in the frontend. Empty sections mean the backend returned no values.
        </p>
        <Badge variant="outline">report:view</Badge>
      </div>
    </Surface>
  );
}

export function DashboardHeading() {
  return (
    <PageHeader
      id="dashboard-heading"
      eyebrow="EDAM / Workspace register"
      title="Dashboard"
      description="A useful, contract-faithful overview: backend metrics, distributions, trend buckets and permitted navigation."
      status={<Badge variant="outline">Permission-gated</Badge>}
    />
  );
}
