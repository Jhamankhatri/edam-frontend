import type { RequestStatus } from '@/api/services/request-contracts';

export const NO_SELECTION = 'NONE';
export const ALL_FILTER = 'ALL';

export type RequestFormMode = 'create' | 'edit';
export type DetailKind = 'NONE' | 'OPEX' | 'CAPEX';
export type RowValues = Record<string, string>;

export interface SelectOption {
  value: string;
  label: string;
}

export type LookupOptionKey =
  | 'requestTypes'
  | 'categories'
  | 'natures'
  | 'departments'
  | 'branches'
  | 'currencies'
  | 'taxAuthorities'
  | 'subcategories';

export interface RowField {
  name: string;
  label: string;
  type: 'text' | 'number' | 'date' | 'textarea' | 'select';
  maxLength?: number;
  options?: readonly SelectOption[];
  optionsKey?: LookupOptionKey;
  defaultValue?: string;
}

export interface SectionConfig {
  key: SectionKey;
  index: string;
  title: string;
  description: string;
  fields: readonly RowField[];
}

export type SectionKey =
  | 'allocations'
  | 'items'
  | 'quotations'
  | 'invoices'
  | 'previousSummaries'
  | 'staDetails'
  | 'budgetSummaries';

export interface RequestCoreValues {
  requestTypeId: string;
  expenseCategoryId: string;
  expenseSubcategoryId: string;
  expenseNatureId: string;
  departmentId: string;
  branchId: string;
  currencyId: string;
  requestedAmount: string;
  justification: string;
}

export interface RequestFormState {
  core: RequestCoreValues;
  detailKind: DetailKind;
  opex: RowValues;
  capex: RowValues;
  allocations: RowValues[];
  items: RowValues[];
  quotations: RowValues[];
  invoices: RowValues[];
  previousSummaries: RowValues[];
  staDetails: RowValues[];
  budgetSummaries: RowValues[];
}

export interface RequestListFilters {
  search?: string;
  status?: RequestStatus;
  departmentId?: string;
  categoryId?: string;
  page: number;
  size: number;
}

export type FieldErrors = Record<string, string>;
