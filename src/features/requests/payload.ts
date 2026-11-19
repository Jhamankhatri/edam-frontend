import { CAPEX_FIELDS, OPEX_FIELDS, SECTION_CONFIGS } from './form-config';
import { decimalToNumber } from './format';
import { NO_SELECTION, type RequestFormState, type RowField, type RowValues, type SectionKey } from './types';
import type { CreateRequestPayload, UpdateRequestPayload } from '@/api/services/request-contracts';

type PayloadPrimitive = string | number | boolean | undefined;
type PayloadRow = Record<string, PayloadPrimitive>;

function compactPayload<T extends object>(value: T): T {
  return Object.fromEntries(
    Object.entries(value).filter(([, entry]) => entry !== undefined),
  ) as T;
}

function optionalId(value: string): string | undefined {
  return !value || value === NO_SELECTION ? undefined : value;
}

function optionalText(value: string): string | undefined {
  return value.trim() ? value : undefined;
}

function isBooleanField(field: RowField): boolean {
  return Boolean(
    field.options?.every((option) => option.value === 'true' || option.value === 'false'),
  );
}

function fieldToPayload(field: RowField, value: string): PayloadPrimitive {
  if (!value || value === NO_SELECTION) return undefined;
  if (field.type === 'number') return decimalToNumber(value, field.label);
  if (isBooleanField(field)) return value === 'true';
  return value;
}

function rowToPayload(fields: readonly RowField[], row: RowValues): PayloadRow {
  const payload: PayloadRow = {};
  for (const field of fields) {
    const value = row[field.name] ?? '';
    if (field.type === 'select' && field.optionsKey && value === NO_SELECTION) continue;
    const converted = fieldToPayload(field, value);
    if (converted !== undefined) payload[field.name] = converted;
  }
  return payload;
}

function hasMeaningfulRow(row: RowValues): boolean {
  return Object.values(row).some((value) => value !== '' && value !== NO_SELECTION);
}

function fieldsForSection(section: SectionKey): readonly RowField[] {
  return SECTION_CONFIGS.find((candidate) => candidate.key === section)?.fields ?? [];
}

function rowsForSection(section: SectionKey, rows: RowValues[]): PayloadRow[] {
  const fields = fieldsForSection(section);
  return rows.filter(hasMeaningfulRow).map((row) => rowToPayload(fields, row));
}

function rowsOrUndefined(section: SectionKey, rows: RowValues[]): PayloadRow[] | undefined {
  const payload = rowsForSection(section, rows);
  return payload.length > 0 ? payload : undefined;
}

function commonPayload(state: RequestFormState) {
  return compactPayload({
    requestTypeId: state.core.requestTypeId,
    expenseCategoryId: state.core.expenseCategoryId,
    expenseSubcategoryId: optionalId(state.core.expenseSubcategoryId),
    expenseNatureId: state.core.expenseNatureId,
    branchId: optionalId(state.core.branchId),
    currencyId: state.core.currencyId,
    requestedAmount: decimalToNumber(state.core.requestedAmount, 'Requested amount'),
    justification: optionalText(state.core.justification),
    opex: state.detailKind === 'OPEX'
      ? rowToPayload(OPEX_FIELDS, state.opex) as NonNullable<CreateRequestPayload['opex']>
      : undefined,
    capex: state.detailKind === 'CAPEX'
      ? rowToPayload(CAPEX_FIELDS, state.capex) as NonNullable<CreateRequestPayload['capex']>
      : undefined,
    allocations: rowsOrUndefined('allocations', state.allocations) as CreateRequestPayload['allocations'],
    items: rowsOrUndefined('items', state.items) as CreateRequestPayload['items'],
    quotations: rowsOrUndefined('quotations', state.quotations) as CreateRequestPayload['quotations'],
    invoices: rowsOrUndefined('invoices', state.invoices) as CreateRequestPayload['invoices'],
    previousSummaries: rowsOrUndefined('previousSummaries', state.previousSummaries) as CreateRequestPayload['previousSummaries'],
    staDetails: rowsOrUndefined('staDetails', state.staDetails) as CreateRequestPayload['staDetails'],
    budgetSummaries: rowsOrUndefined('budgetSummaries', state.budgetSummaries) as CreateRequestPayload['budgetSummaries'],
  });
}

export function toCreatePayload(state: RequestFormState): CreateRequestPayload {
  return compactPayload({
    ...commonPayload(state),
    departmentId: state.core.departmentId,
  });
}

export function toUpdatePayload(state: RequestFormState): UpdateRequestPayload {
  const { ...payload } = commonPayload(state);
  return payload;
}
