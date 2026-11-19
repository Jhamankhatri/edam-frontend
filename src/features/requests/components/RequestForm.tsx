import { useMemo, useRef, useState } from 'react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { ErrorState } from '@/components/feedback/ErrorState';
import { LoadingRows } from '@/components/feedback/LoadingRows';
import { FormField } from '@/components/forms/FormField';
import { PageHeader } from '@/components/layout/PageHeader';
import { Surface } from '@/components/ui/surface';
import { SectionLabel } from '@/components/ui/register';
import { createIdempotencyKey } from '@/api/client';
import type { CreateRequestPayload, RequestResponse, UpdateRequestPayload } from '@/api/services/request-contracts';
import { DETAIL_KIND_OPTIONS, SECTION_CONFIGS } from '../form-config';
import { emptyFormState, emptyRow, formStateFromResponse, hasUnpreservableDetail, optionSetsFromLookups } from '../form-state';
import { formatScalar } from '../format';
import { useRequestLookups } from '../hooks';
import { toCreatePayload, toUpdatePayload } from '../payload';
import { serverFieldErrorsToRecord, validateRequestForm } from '../validation';
import { recoverableErrorState } from '../recoverable-errors';
import { NO_SELECTION, type FieldErrors, type RequestFormState, type SectionKey } from '../types';
import {
  FormGrid,
  LookupSelect,
  RepeatableSections,
  TextControl,
  TypedDetailSection,
} from './FormControls';
import { RecoverableErrorPanel } from './RecoverableErrorPanel';

interface CommonProps {
  onReload: () => void;
  onReconcile: () => void;
}

export type RequestFormProps = CommonProps & (
  | {
      mode: 'create';
      initialResponse?: never;
      onSubmit: (payload: CreateRequestPayload, idempotencyKey: string) => Promise<void>;
    }
  | {
      mode: 'edit';
      initialResponse: RequestResponse;
      onSubmit: (payload: UpdateRequestPayload, idempotencyKey: string) => Promise<void>;
    }
);

function updateSectionRows(
  state: RequestFormState,
  section: SectionKey,
  rows: RequestFormState[SectionKey],
): RequestFormState {
  return { ...state, [section]: rows } as RequestFormState;
}

export function RequestForm(props: RequestFormProps) {
  const { mode, onReload, onReconcile } = props;
  const initialResponse = props.mode === 'edit' ? props.initialResponse : null;
  const initial = useMemo(
    () => initialResponse ? formStateFromResponse(initialResponse) : emptyFormState(),
    [initialResponse],
  );
  const [state, setState] = useState<RequestFormState>(initial);
  const [errors, setErrors] = useState<FieldErrors>({});
  const [submissionError, setSubmissionError] = useState<unknown>(null);
  const [pending, setPending] = useState(false);
  const pendingRef = useRef(false);
  const keyRef = useRef<string | null>(null);
  const lastPayloadRef = useRef<CreateRequestPayload | UpdateRequestPayload | null>(null);
  const lookups = useRequestLookups();
  const optionSets = useMemo(
    () => optionSetsFromLookups(lookups.data, state),
    [lookups.data, state],
  );

  const hasUnsafeReplacement = props.mode === 'edit' && (
    Boolean(props.initialResponse.opex && props.initialResponse.capex) ||
    hasUnpreservableDetail(props.initialResponse)
  );
  const requiredOptionsMissing = [
    optionSets.requestTypes,
    optionSets.categories,
    optionSets.natures,
    optionSets.departments,
    optionSets.currencies,
  ].some((options) => options.length === 0);

  const setCore = (field: keyof RequestFormState['core'], value: string): void => {
    setState((previous) => {
      const core = { ...previous.core, [field]: value };
      if (field === 'expenseCategoryId') core.expenseSubcategoryId = NO_SELECTION;
      return { ...previous, core };
    });
  };

  const setRow = (section: SectionKey, index: number, field: string, value: string): void => {
    setState((previous) => updateSectionRows(
      previous,
      section,
      previous[section].map((row, rowIndex) =>
        rowIndex === index ? { ...row, [field]: value } : row,
      ),
    ));
  };

  const addRow = (section: SectionKey): void => {
    const config = SECTION_CONFIGS.find((candidate) => candidate.key === section);
    if (!config) return;
    setState((previous) => updateSectionRows(previous, section, [
      ...previous[section],
      emptyRow(config.fields),
    ]));
  };

  const removeRow = (section: SectionKey, index: number): void => {
    setState((previous) => updateSectionRows(
      previous,
      section,
      previous[section].filter((_, rowIndex) => rowIndex !== index),
    ));
  };

  const setDetail = (detail: 'opex' | 'capex', field: string, value: string): void => {
    setState((previous) => ({
      ...previous,
      [detail]: { ...previous[detail], [field]: value },
    }));
  };

  const sendPayload = async (
    payload: CreateRequestPayload | UpdateRequestPayload,
    idempotencyKey: string,
  ): Promise<void> => {
    if (props.mode === 'create') {
      await props.onSubmit(payload as CreateRequestPayload, idempotencyKey);
    } else {
      await props.onSubmit(payload as UpdateRequestPayload, idempotencyKey);
    }
  };

  const execute = async (
    payload: CreateRequestPayload | UpdateRequestPayload,
    idempotencyKey: string,
  ): Promise<void> => {
    if (pendingRef.current) return;
    pendingRef.current = true;
    setPending(true);
    setSubmissionError(null);
    setErrors({});
    lastPayloadRef.current = payload;
    keyRef.current = idempotencyKey;
    try {
      await sendPayload(payload, idempotencyKey);
      keyRef.current = null;
      lastPayloadRef.current = null;
    } catch (error) {
      setSubmissionError(error);
      setErrors(serverFieldErrorsToRecord(error));
      const action = recoverableErrorState(error).action;
      if (action === 'validate' || action === 'new-key' || action === 'reload' || action === 'none') {
        keyRef.current = null;
      }
    } finally {
      pendingRef.current = false;
      setPending(false);
    }
  };

  const submitGesture = (reuseKey = false): void => {
    if (pendingRef.current || hasUnsafeReplacement) return;
    const clientErrors = validateRequestForm(state, mode);
    if (Object.keys(clientErrors).length > 0) {
      setErrors(clientErrors);
      return;
    }
    const payload = mode === 'create' ? toCreatePayload(state) : toUpdatePayload(state);
    const idempotencyKey = reuseKey && keyRef.current ? keyRef.current : createIdempotencyKey();
    void execute(payload, idempotencyKey);
  };

  const retrySameKey = (): void => {
    const payload = lastPayloadRef.current;
    const key = keyRef.current;
    if (payload && key) void execute(payload, key);
  };

  const startNewKey = (): void => {
    const payload = lastPayloadRef.current;
    if (payload) void execute(payload, createIdempotencyKey());
  };

  if (lookups.isLoading) {
    return (
      <section aria-labelledby="request-form-heading" className="space-y-6">
        <PageHeader
          id="request-form-heading"
          eyebrow="EDAM / Request register"
          title={mode === 'create' ? 'New Request' : 'Edit Request'}
          description="Loading documented backend reference values."
        />
        <LoadingRows rows={6} label="Loading request reference values" />
      </section>
    );
  }

  if (lookups.unavailable.length > 0 || lookups.errors.length > 0 || requiredOptionsMissing || hasUnsafeReplacement) {
    return (
      <section aria-labelledby="request-form-heading" className="space-y-6">
        <PageHeader
          id="request-form-heading"
          eyebrow="EDAM / Request register"
          title={mode === 'create' ? 'New Request' : 'Edit Request'}
          description="Reference data is required before a request can be changed."
        />
        {lookups.errors.length > 0 ? (
          <ErrorState
            title="Reference data unavailable"
            description="The backend reference endpoints did not return usable data. Retry without changing the form."
            onRetry={() => { void lookups.refetchAll(); }}
          />
        ) : (
          <Alert variant="warning">
            <div>
              <AlertTitle>Request form unavailable</AlertTitle>
              <AlertDescription>
                {hasUnsafeReplacement
                  ? 'The response contains typed details, child rows or document references whose payload-only fields are absent from the pinned response DTOs. A replacement request cannot safely preserve them without a backend contract decision.'
                  : lookups.unavailable.length > 0
                    ? `Required reference data is unavailable for this session: ${lookups.unavailable.join('; ')}. The backend remains authoritative.`
                    : 'Required reference endpoints returned no active options. No options are simulated.'}
              </AlertDescription>
            </div>
          </Alert>
        )}
      </section>
    );
  }

  const selectedCategory = lookups.data.categories.find(
    (category) => category.id === state.core.expenseCategoryId,
  );
  const departmentLabel = optionSets.departments.find(
    (option) => option.value === state.core.departmentId,
  )?.label ?? state.core.departmentId;

  return (
    <section aria-labelledby="request-form-heading" className="space-y-6 sm:space-y-8">
      <PageHeader
        id="request-form-heading"
        eyebrow={mode === 'create' ? 'EDAM / Create request' : 'EDAM / Replace draft'}
        title={mode === 'create' ? 'New Request' : 'Edit Request'}
        description={mode === 'create'
          ? 'Create a request using the documented DTO, reference values and server-authoritative validation.'
          : 'Replace an editable request. Department is retained by the backend and is not part of UpdateRequest.'}
        meta={<span className="font-numeric text-2xs uppercase tracking-micro text-muted-foreground">Server DTO / 01</span>}
      />
      {submissionError !== null && (
        <RecoverableErrorPanel
          error={submissionError}
          onStartNewKey={startNewKey}
          onRetrySameKey={retrySameKey}
          onReconcile={onReconcile}
          onReload={onReload}
        />
      )}

      <form
        className="space-y-8"
        noValidate
        onSubmit={(event) => {
          event.preventDefault();
          submitGesture();
        }}
      >
        <Surface variant="raised" padding="lg" className="space-y-6">
          <SectionLabel index="01">Header register</SectionLabel>
          <FormGrid>
            <LookupSelect
              id="requestTypeId"
              label="Request type"
              value={state.core.requestTypeId}
              options={optionSets.requestTypes}
              onValueChange={(value) => setCore('requestTypeId', value)}
              error={errors.requestTypeId}
            />
            <LookupSelect
              id="expenseCategoryId"
              label="Expense category"
              value={state.core.expenseCategoryId}
              options={optionSets.categories}
              onValueChange={(value) => setCore('expenseCategoryId', value)}
              error={errors.expenseCategoryId}
              hint={selectedCategory?.expenseType
                ? `Backend category type: ${selectedCategory.expenseType}`
                : undefined}
            />
            <LookupSelect
              id="expenseSubcategoryId"
              label="Expense subcategory"
              value={state.core.expenseSubcategoryId}
              options={optionSets.subcategories}
              onValueChange={(value) => setCore('expenseSubcategoryId', value)}
              error={errors.expenseSubcategoryId}
              optional
            />
            <LookupSelect
              id="expenseNatureId"
              label="Expense nature"
              value={state.core.expenseNatureId}
              options={optionSets.natures}
              onValueChange={(value) => setCore('expenseNatureId', value)}
              error={errors.expenseNatureId}
            />
            {mode === 'create' ? (
              <LookupSelect
                id="departmentId"
                label="Department"
                value={state.core.departmentId}
                options={optionSets.departments}
                onValueChange={(value) => setCore('departmentId', value)}
                error={errors.departmentId}
              />
            ) : (
              <FormField id="departmentId" label="Department (backend-retained)" hint="Not part of UpdateRequest.">
                <p className="rounded-lg border border-line bg-surface-subtle px-3.5 py-3 text-sm text-foreground">
                  {formatScalar(departmentLabel)}
                </p>
              </FormField>
            )}
            <LookupSelect
              id="branchId"
              label="Branch"
              value={state.core.branchId}
              options={optionSets.branches}
              onValueChange={(value) => setCore('branchId', value)}
              error={errors.branchId}
              optional
            />
            <LookupSelect
              id="currencyId"
              label="Currency"
              value={state.core.currencyId}
              options={optionSets.currencies}
              onValueChange={(value) => setCore('currencyId', value)}
              error={errors.currencyId}
            />
            <TextControl
              id="requestedAmount"
              label="Requested amount"
              type="number"
              value={state.core.requestedAmount}
              onValueChange={(value) => setCore('requestedAmount', value)}
              error={errors.requestedAmount}
              hint="Decimal value; the backend enforces the documented minimum and precision."
            />
          </FormGrid>
          <TextControl
            id="justification"
            label="Justification"
            value={state.core.justification}
            onValueChange={(value) => setCore('justification', value)}
            error={errors.justification}
            maxLength={4000}
            multiline
          />
        </Surface>

        <Surface variant="flat" padding="lg" className="space-y-6">
          <SectionLabel index="02">Classification and detail</SectionLabel>
          <LookupSelect
            id="detailKind"
            label="Typed detail block"
            value={state.detailKind}
            options={DETAIL_KIND_OPTIONS}
            onValueChange={(value) => setState((previous) => ({
              ...previous,
              detailKind: value as RequestFormState['detailKind'],
            }))}
            hint="Choose which documented DTO block to send. Classification itself is resolved by the backend."
          />
          <TypedDetailSection
            detailKind={state.detailKind}
            opex={state.opex}
            capex={state.capex}
            errors={errors}
            optionSets={optionSets}
            onChange={setDetail}
          />
        </Surface>

        <Surface variant="flat" padding="lg">
          <RepeatableSections
            errors={errors}
            optionSets={optionSets}
            state={state}
            onChange={setRow}
            onAdd={addRow}
            onRemove={removeRow}
          />
        </Surface>

        <Alert variant="info">
          <div>
            <AlertTitle>Server validation remains authoritative</AlertTitle>
            <AlertDescription>
              Recurring frequency, quotation counts, CAPEX eligibility, three-figure equality, budget
              reasons, warranty dates and allocation totals are evaluated by the backend. Document
              references and upload workflows are deferred.
            </AlertDescription>
          </div>
        </Alert>

        <div className="flex flex-col-reverse gap-3 sm:flex-row sm:justify-end">
          <Button type="button" variant="outline" onClick={onReconcile}>
            Refresh register
          </Button>
          <Button type="submit" size="lg" loading={pending} disabled={hasUnsafeReplacement}>
            {pending
              ? mode === 'create' ? 'Creating…' : 'Saving…'
              : mode === 'create' ? 'Create request' : 'Save changes'}
          </Button>
        </div>
      </form>
    </section>
  );
}
