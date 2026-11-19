import type { RequestLookups } from './hooks';
import { CAPEX_FIELDS, OPEX_FIELDS, SECTION_CONFIGS } from './form-config';
import type {
  LookupOptionKey,
  RequestFormState,
  RowField,
  RowValues,
  SelectOption,
} from './types';
import { NO_SELECTION } from './types';
import type { RequestResponse } from '@/api/services/request-contracts';

export type OptionSets = Record<LookupOptionKey, readonly SelectOption[]>;

export function emptyRow(fields: readonly RowField[]): RowValues {
  const row: RowValues = {};
  for (const field of fields) row[field.name] = field.defaultValue ?? '';
  return row;
}

export function emptyFormState(): RequestFormState {
  return {
    core: {
      requestTypeId: '',
      expenseCategoryId: '',
      expenseSubcategoryId: NO_SELECTION,
      expenseNatureId: '',
      departmentId: '',
      branchId: NO_SELECTION,
      currencyId: '',
      requestedAmount: '',
      justification: '',
    },
    detailKind: NO_SELECTION,
    opex: emptyRow(OPEX_FIELDS),
    capex: emptyRow(CAPEX_FIELDS),
    allocations: [],
    items: [],
    quotations: [],
    invoices: [],
    previousSummaries: [],
    staDetails: [],
    budgetSummaries: [],
  };
}

function scalar(value: unknown): string {
  if (value === null || value === undefined) return '';
  return String(value);
}

function rowFromResponse(value: unknown, fields: readonly RowField[]): RowValues {
  const source = typeof value === 'object' && value !== null
    ? value as Record<string, unknown>
    : {};
  const row = emptyRow(fields);
  for (const field of fields) {
    if (field.name in source) row[field.name] = scalar(source[field.name]);
    else if (field.type === 'select' && field.options?.some((option) => option.value === 'true' || option.value === 'false')) {
      row[field.name] = field.defaultValue ?? 'false';
    }
  }
  return row;
}

function rowsFromResponse(value: unknown, fields: readonly RowField[]): RowValues[] {
  if (!Array.isArray(value)) return [];
  return value.map((entry) => rowFromResponse(entry, fields));
}

/** Rehydrates only fields present in the pinned OpenAPI response DTOs. */
export function formStateFromResponse(response: RequestResponse): RequestFormState {
  const state = emptyFormState();
  state.core = {
    requestTypeId: scalar(response.requestTypeId),
    expenseCategoryId: scalar(response.expenseCategoryId),
    expenseSubcategoryId: response.expenseSubcategoryId ? scalar(response.expenseSubcategoryId) : NO_SELECTION,
    expenseNatureId: scalar(response.expenseNatureId),
    departmentId: scalar(response.departmentId),
    branchId: response.branchId ? scalar(response.branchId) : NO_SELECTION,
    currencyId: scalar(response.currencyId),
    requestedAmount: scalar(response.requestedAmount),
    justification: scalar(response.justification),
  };
  state.detailKind = response.opex ? 'OPEX' : response.capex ? 'CAPEX' : NO_SELECTION;
  state.opex = rowFromResponse(response.opex, OPEX_FIELDS);
  state.capex = rowFromResponse(response.capex, CAPEX_FIELDS);
  const fieldsByKey = new Map(SECTION_CONFIGS.map((section) => [section.key, section.fields]));
  for (const section of SECTION_CONFIGS) {
    const fields = fieldsByKey.get(section.key) ?? section.fields;
    state[section.key] = rowsFromResponse(response[section.key], fields);
  }
  return state;
}

function lookupOptions(
  values: readonly { id?: string; code?: string; name?: string; active?: boolean }[] | undefined,
): SelectOption[] {
  return (values ?? [])
    .filter((value) => value.id && value.active !== false)
    .map((value) => ({
      value: value.id ?? '',
      label: value.name ?? value.code ?? value.id ?? '',
    }));
}

function withCurrent(options: readonly SelectOption[], current: string | undefined): SelectOption[] {
  if (!current || current === NO_SELECTION || options.some((option) => option.value === current)) {
    return [...options];
  }
  return [{ value: current, label: `Current reference: ${current}` }, ...options];
}

export function optionSetsFromLookups(
  lookups: RequestLookups,
  current: RequestFormState,
): OptionSets {
  const selectedCategory = lookups.categories.find(
    (category) => category.id === current.core.expenseCategoryId,
  );
  const subcategories = (selectedCategory?.subcategories ?? []).map((subcategory) => ({
    value: subcategory.id ?? '',
    label: subcategory.name ?? subcategory.code ?? subcategory.id ?? '',
  }));
  return {
    requestTypes: withCurrent(lookupOptions(lookups.requestTypes), current.core.requestTypeId),
    categories: withCurrent(lookupOptions(lookups.categories), current.core.expenseCategoryId),
    natures: withCurrent(lookupOptions(lookups.natures), current.core.expenseNatureId),
    departments: withCurrent(lookupOptions(lookups.departments), current.core.departmentId),
    branches: withCurrent(lookupOptions(lookups.branches), current.core.branchId),
    currencies: withCurrent(lookupOptions(lookups.currencies), current.core.currencyId),
    taxAuthorities: withCurrent(lookupOptions(lookups.taxAuthorities), undefined),
    subcategories: withCurrent(subcategories, current.core.expenseSubcategoryId),
  };
}

const REPLACE_SENSITIVE_SECTIONS = [
  'allocations', 'items', 'quotations', 'invoices',
  'previousSummaries', 'staDetails', 'budgetSummaries',
] as const satisfies readonly (keyof RequestResponse)[];

/**
 * `UpdateRequest` is a replacement DTO. The pinned response DTOs omit several
 * payload-only fields (OPEX attachment flags, four CAPEX narrative fields,
 * vendor/document references and document references). A safe replacement is
 * therefore limited to a header-only request until the backend contract supplies
 * complete round-trip fields. Replacing a richer record would silently clear
 * fields the frontend cannot see, so the edit screen stops instead.
 */
export function hasUnpreservableDetail(response: RequestResponse): boolean {
  if (response.opex || response.capex) return true;
  if (REPLACE_SENSITIVE_SECTIONS.some((section) => {
    const value: unknown = response[section];
    return Array.isArray(value) && value.length > 0;
  })) return true;
  const documents = (response as unknown as { documents?: unknown }).documents;
  return Array.isArray(documents) && documents.length > 0;
}
