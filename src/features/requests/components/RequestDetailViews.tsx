import { Link } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useRef, useState } from 'react';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Badge, StatusBadge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { ConfirmDialog, Dialog, DialogContent, DialogDescription, DialogTitle } from '@/components/ui/dialog';
import { EmptyState } from '@/components/feedback/EmptyState';
import { ErrorState } from '@/components/feedback/ErrorState';
import { FormField } from '@/components/forms/FormField';
import { Surface } from '@/components/ui/surface';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow, TableWrapper } from '@/components/ui/table';
import { SectionLabel } from '@/components/ui/register';
import { createIdempotencyKey } from '@/api/client';
import { formatApiError } from '@/api/errors';
import { isRecord } from '@/api/envelope';
import { useAuth } from '@/auth/useAuth';
import { useQueryClient } from '@tanstack/react-query';
import { queryKeys } from '@/app/query-client';
import type { CancelRequestPayload, RequestResponse, TimelineEntry } from '@/api/services/request-contracts';
import { formatScalar, formatStatus, humanizeField, statusTone } from '../format';
import { useCancelRequest, useRequestActivity, useRequestLookups, useSubmitRequest } from '../hooks';
import { RecoverableErrorPanel } from './RecoverableErrorPanel';
import { recoverableErrorState } from '../recoverable-errors';

const HEADER_FIELDS = [
  'id', 'requestNumber', 'status', 'classification', 'requestTypeId', 'expenseCategoryId',
  'expenseSubcategoryId', 'expenseNatureId', 'requestedBy', 'departmentId', 'branchId',
  'currencyId', 'requestedAmount', 'baseCurrencyAmount', 'exchangeRateId', 'justification',
  'workflowInstanceId', 'submittedAt', 'createdAt', 'updatedAt', 'version', 'canEdit',
  'canSubmit', 'canCancel', 'terminal',
] as const satisfies readonly (keyof RequestResponse)[];

const RESPONSE_SECTIONS = [
  { key: 'opex', index: '02', title: 'OPEX detail' },
  { key: 'capex', index: '03', title: 'CAPEX detail' },
  { key: 'allocations', index: '04', title: 'Charge allocations' },
  { key: 'items', index: '05', title: 'Item-wise details' },
  { key: 'quotations', index: '06', title: 'Quotations' },
  { key: 'invoices', index: '07', title: 'Invoices' },
  { key: 'previousSummaries', index: '08', title: 'Previous summaries' },
  { key: 'staDetails', index: '09', title: 'Sales tax authorities' },
  { key: 'budgetSummaries', index: '10', title: 'Budget summaries' },
] as const satisfies readonly { key: keyof RequestResponse; index: string; title: string }[];

function rowsOf(value: unknown): readonly Record<string, unknown>[] {
  if (Array.isArray(value)) return value.filter(isRecord);
  if (isRecord(value)) return [value];
  return [];
}

function columnsOf(rows: readonly Record<string, unknown>[]): string[] {
  const columns = new Set<string>();
  for (const row of rows) for (const key of Object.keys(row)) columns.add(key);
  return [...columns];
}

export function ResponseTable({ rows, label }: { rows: readonly Record<string, unknown>[]; label: string }) {
  const columns = columnsOf(rows);
  if (columns.length === 0) {
    return (
      <p className="border-b border-line-soft py-4 text-sm text-muted-foreground">
        The backend returned no documented values for this section.
      </p>
    );
  }
  return (
    <TableWrapper className="scrollbar-subtle">
      <Table>
        <caption className="sr-only">{label}</caption>
        <TableHeader>
          <TableRow>
            {columns.map((column) => <TableHead key={column} scope="col">{humanizeField(column)}</TableHead>)}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row, index) => (
            <TableRow key={index}>
              {columns.map((column) => (
                <TableCell key={column} className="align-top text-sm">
                  {formatScalar(row[column])}
                </TableCell>
              ))}
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </TableWrapper>
  );
}

export function RequestDetailViews({ request }: { request: RequestResponse }) {
  const lookups = useRequestLookups();
  const lookupLabel = (value: unknown): string => {
    if (typeof value !== 'string') return formatScalar(value);
    const pools = [
      lookups.data.requestTypes,
      lookups.data.categories,
      lookups.data.natures,
      lookups.data.departments,
      lookups.data.branches,
      lookups.data.currencies,
      lookups.data.taxAuthorities,
    ];
    for (const pool of pools) {
      const match = pool.find((entry) => entry.id === value);
      if (match?.name) return match.name;
    }
    return formatScalar(value);
  };

  return (
    <div className="space-y-8">
      {lookups.unavailable.length > 0 && (
        <Alert variant="info">
          <AlertDescription>
            Some backend reference labels are unavailable for this session: {lookups.unavailable.join('; ')}.
            Documented identifiers are shown instead; no names are guessed.
          </AlertDescription>
        </Alert>
      )}
      <Surface variant="raised" padding="lg" className="space-y-4">
        <SectionLabel index="01">Request header</SectionLabel>
        <dl className="grid grid-cols-1 gap-x-8 gap-y-0 md:grid-cols-2">
          {HEADER_FIELDS.map((field) => (
            <div key={field} className="register-row py-3">
              <dt className="font-numeric text-2xs font-semibold uppercase tracking-micro text-muted-foreground">
                {humanizeField(field)}
              </dt>
              <dd className="mt-1 break-words text-sm text-foreground">
                {field === 'status'
                  ? formatStatus(request.status)
                  : field.endsWith('Id') || field === 'requestedBy'
                    ? lookupLabel(request[field])
                    : formatScalar(request[field])}
              </dd>
            </div>
          ))}
        </dl>
      </Surface>

      {RESPONSE_SECTIONS.map((section) => (
        <section key={section.key} aria-labelledby={`${section.key}-heading`} className="space-y-4">
          <SectionLabel index={section.index}>
            <span id={`${section.key}-heading`}>{section.title}</span>
          </SectionLabel>
          <ResponseTable rows={rowsOf(request[section.key])} label={section.title} />
        </section>
      ))}
    </div>
  );
}

export function RequestActivity({ id }: { id: string }) {
  const activity = useRequestActivity(id);
  const entries = (activity.data?.pages ?? []).flatMap((page) => page.items ?? []) as TimelineEntry[];
  if (activity.isLoading) return <p className="text-sm text-muted-foreground">Loading documented activity…</p>;
  if (activity.error) {
    return (
      <ErrorState
        title="Activity unavailable"
        description={formatApiError(activity.error)}
        onRetry={() => { void activity.refetch(); }}
      />
    );
  }
  if (entries.length === 0) {
    return (
      <EmptyState
        index="11"
        title="No activity returned"
        description="The authorized activity endpoint returned no entries. No history is simulated."
      />
    );
  }
  return (
    <div className="space-y-4">
      <ResponseTable rows={entries.filter(isRecord)} label="Request activity" />
      {activity.hasNextPage && (
        <Button
          type="button"
          variant="outline"
          loading={activity.isFetchingNextPage}
          onClick={() => { void activity.fetchNextPage(); }}
        >
          Load older activity
        </Button>
      )}
    </div>
  );
}

interface RequestActionsProps {
  request: RequestResponse;
  onReload: () => void;
  onReconcile: () => void;
}

type ActionKind = 'submit' | 'cancel';
type ActionDialog = ActionKind | null;

export function RequestActions({ request, onReload, onReconcile }: RequestActionsProps) {
  const { hasPermission } = useAuth();
  const queryClient = useQueryClient();
  const submit = useSubmitRequest();
  const cancel = useCancelRequest();
  const [dialog, setDialog] = useState<ActionDialog>(null);
  const [reason, setReason] = useState('');
  const [reasonError, setReasonError] = useState<string | undefined>();
  const [actionError, setActionError] = useState<unknown>(null);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const keyRef = useRef<string | null>(null);
  const lastActionRef = useRef<{ kind: ActionKind; payload?: CancelRequestPayload } | null>(null);
  const id = request.id ?? '';

  const runAction = async (kind: ActionKind, payload: CancelRequestPayload | undefined, key: string): Promise<void> => {
    if (!id || pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    setActionError(null);
    keyRef.current = key;
    lastActionRef.current = { kind, payload };
    try {
      if (kind === 'submit') {
        await submit.mutateAsync({ id, idempotencyKey: key });
        toast.success('Request submitted');
      } else if (payload) {
        await cancel.mutateAsync({ id, payload, idempotencyKey: key });
        toast.success('Request cancelled');
      }
      setDialog(null);
      setReason('');
      keyRef.current = null;
      lastActionRef.current = null;
      onReload();
    } catch (error) {
      setActionError(error);
      const action = recoverableErrorState(error).action;
      if (action === 'validate' || action === 'new-key' || action === 'reload' || action === 'none') {
        keyRef.current = null;
      }
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };

  const startAction = (kind: ActionKind): void => {
    if (pendingRef.current) return;
    setActionError(null);
    if (kind === 'cancel') {
      setReasonError(undefined);
      setDialog('cancel');
      return;
    }
    setDialog('submit');
  };

  const confirmSubmit = (): void => {
    void runAction('submit', undefined, createIdempotencyKey());
  };

  const confirmCancel = (): void => {
    const trimmed = reason.trim();
    if (!trimmed) {
      setReasonError('A cancellation reason is required.');
      return;
    }
    if (trimmed.length > 500) {
      setReasonError('A cancellation reason cannot exceed 500 characters.');
      return;
    }
    void runAction('cancel', { reason: trimmed }, createIdempotencyKey());
  };

  const retrySameKey = (): void => {
    const last = lastActionRef.current;
    const key = keyRef.current;
    if (last && key) void runAction(last.kind, last.payload, key);
  };
  const startNewKey = (): void => {
    const last = lastActionRef.current;
    if (last) void runAction(last.kind, last.payload, createIdempotencyKey());
  };
  const reconcile = (): void => {
    void queryClient.invalidateQueries({ queryKey: queryKeys.requests.all });
    onReconcile();
  };

  const canShowActions = Boolean(id);
  return (
    <div className="space-y-3">
      {canShowActions && (
        <div className="flex flex-wrap justify-end gap-2">
          {request.canEdit && hasPermission('request:edit') && (
            <Button asChild variant="outline">
              <Link to="/app/requests/$id/edit" params={{ id }}>Edit request</Link>
            </Button>
          )}
          {request.canSubmit && hasPermission('request:submit') && (
            <Button type="button" onClick={() => startAction('submit')} loading={pending && dialog === 'submit'}>
              Submit
            </Button>
          )}
          {request.canCancel && hasPermission('request:cancel') && (
            <Button type="button" variant="destructive" onClick={() => startAction('cancel')} loading={pending && dialog === 'cancel'}>
              Cancel request
            </Button>
          )}
        </div>
      )}
      {actionError !== null && (
        <RecoverableErrorPanel
          error={actionError}
          onStartNewKey={startNewKey}
          onRetrySameKey={retrySameKey}
          onReconcile={reconcile}
          onReload={onReload}
        />
      )}

      <ConfirmDialog
        open={dialog === 'submit'}
        onOpenChange={(open) => { if (!open && !pending) setDialog(null); }}
        title="Submit this request?"
        description="The backend will validate every submission rule. No approval decision is made here."
        confirmLabel="Submit request"
        loading={pending}
        onConfirm={confirmSubmit}
      />

      <Dialog open={dialog === 'cancel'} onOpenChange={(open) => { if (!open && !pending) setDialog(null); }}>
        <DialogContent>
          <DialogTitle className="font-display text-lg font-semibold">Cancel this request?</DialogTitle>
          <DialogDescription className="mt-2 text-sm leading-relaxed text-muted-foreground">
            A reason is required by the backend. The request remains a financial record.
          </DialogDescription>
          <div className="mt-5">
            <FormField id="cancel-reason" label="Cancellation reason" error={reasonError}>
              <Textarea
                id="cancel-reason"
                value={reason}
                maxLength={500}
                invalid={Boolean(reasonError)}
                onChange={(event) => setReason(event.target.value)}
                placeholder="Enter the reason"
              />
            </FormField>
          </div>
          <div className="mt-6 flex flex-col-reverse gap-2 sm:flex-row sm:justify-end">
            <Button variant="outline" disabled={pending} onClick={() => setDialog(null)}>Keep request</Button>
            <Button variant="destructive" loading={pending} onClick={confirmCancel}>Cancel request</Button>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}

export function RequestDetailHeadingStatus({ request }: { request: RequestResponse }) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      <StatusBadge label={formatStatus(request.status)} variant={statusTone(request.status)} />
      {request.terminal === true && <Badge variant="muted">Terminal</Badge>}
    </div>
  );
}
