import { Link } from '@tanstack/react-router';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableWrapper } from '@/components/ui/table';
import type { RequestSummary } from '@/api/services/request-contracts';
import { formatDateTime, formatMoney, formatNumber, formatStatus, statusTone } from '../format';
import type { RequestFilterLookups } from '../hooks';

interface RequestTableProps {
  items: readonly RequestSummary[];
  lookups: RequestFilterLookups;
  onPrevious: () => void;
  onNext: () => void;
  hasPrevious?: boolean;
  hasNext?: boolean;
  page?: number;
  size?: number;
  totalElements?: number;
  totalPages?: number;
}

export function RequestTable({
  items,
  lookups,
  onPrevious,
  onNext,
  hasPrevious,
  hasNext,
  page,
  size,
  totalElements,
  totalPages,
}: RequestTableProps) {
  const currencyCode = (id: string | undefined): string | undefined =>
    lookups.currencies.find((currency) => currency.id === id)?.code;
  const departmentLabel = (id: string | undefined): string =>
    lookups.departments.find((department) => department.id === id)?.name ?? id ?? 'Not provided';

  return (
    <section aria-label="Expense request register" className="space-y-4">
      <TableWrapper className="scrollbar-subtle">
        <Table>
          <caption className="sr-only">Expense requests returned by the backend</caption>
          <TableHeader>
            <TableRow>
              <TableHead scope="col">Reference</TableHead>
              <TableHead scope="col">Status</TableHead>
              <TableHead scope="col">Classification</TableHead>
              <TableHead scope="col">Department</TableHead>
              <TableHead scope="col">Amount</TableHead>
              <TableHead scope="col">Created</TableHead>
              <TableHead scope="col">Submitted</TableHead>
              <TableHead scope="col">Detail</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {items.map((item, index) => (
              <TableRow key={item.id ?? `${item.requestNumber ?? 'request'}-${index}`}>
                <TableCell className="font-numeric text-xs font-semibold">
                  {item.requestNumber ?? item.id ?? 'Not provided'}
                </TableCell>
                <TableCell><StatusBadge label={formatStatus(item.status)} variant={statusTone(item.status)} /></TableCell>
                <TableCell>{item.classification ?? 'Not provided'}</TableCell>
                <TableCell>{departmentLabel(item.departmentId)}</TableCell>
                <TableCell className="font-numeric">{formatMoney(item.requestedAmount, currencyCode(item.currencyId))}</TableCell>
                <TableCell className="font-numeric text-xs">{formatDateTime(item.createdAt)}</TableCell>
                <TableCell className="font-numeric text-xs">{formatDateTime(item.submittedAt)}</TableCell>
                <TableCell>
                  {item.id ? (
                    <Link
                      to="/app/requests/$id"
                      params={{ id: item.id }}
                      className="inline-flex min-h-10 items-center rounded-md px-2 text-sm font-semibold text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring"
                    >
                      View
                    </Link>
                  ) : (
                    <Badge variant="muted">Reference unavailable</Badge>
                  )}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableWrapper>
      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <p className="font-numeric text-xs text-muted-foreground">
          {formatNumber(items.length, { maximumFractionDigits: 0 })} shown ·{' '}
          {formatNumber(totalElements, { maximumFractionDigits: 0 })} total · page{' '}
          {formatNumber(page === undefined ? undefined : page + 1, { maximumFractionDigits: 0 })} of{' '}
          {formatNumber(totalPages, { maximumFractionDigits: 0 })} · size{' '}
          {formatNumber(size, { maximumFractionDigits: 0 })}
        </p>
        <div className="flex flex-wrap gap-2">
          {hasPrevious && (
            <Button type="button" variant="outline" onClick={onPrevious}>Previous</Button>
          )}
          {hasNext && (
            <Button type="button" variant="outline" onClick={onNext}>Next</Button>
          )}
        </div>
      </div>
    </section>
  );
}
