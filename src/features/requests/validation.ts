import { z, type ZodIssue } from 'zod';
import { ApiError, normalizeUnknownError } from '@/api/errors';
import { CAPEX_FIELDS, OPEX_FIELDS, SECTION_CONFIGS } from './form-config';
import { isDecimalAtLeast, isValidDecimal } from './format';
import {
  NO_SELECTION,
  type FieldErrors,
  type RequestFormMode,
  type RequestFormState,
  type RowField,
  type RowValues,
} from './types';

const uuid = z.string().uuid('Select a documented reference value.');
const optionalUuid = z.union([z.literal(NO_SELECTION), z.string().uuid('Select a valid reference.')]);

function coreSchema(mode: RequestFormMode) {
  return z.object({
    requestTypeId: uuid,
    expenseCategoryId: uuid,
    expenseSubcategoryId: optionalUuid,
    expenseNatureId: uuid,
    departmentId: mode === 'create' ? uuid : z.string(),
    branchId: optionalUuid,
    currencyId: uuid,
    requestedAmount: z.string().refine(
      (value) => isDecimalAtLeast(value, '0.0001'),
      'Enter an amount greater than zero.',
    ),
    justification: z.string().max(4000, 'Justification cannot exceed 4000 characters.'),
  });
}

export function sectionFieldKey(section: string, index: number, field: string): string {
  return `${section}[${index}].${field}`;
}

export function detailFieldKey(detail: 'opex' | 'capex', field: string): string {
  return `${detail}.${field}`;
}

function validateRow(
  row: RowValues,
  fields: readonly RowField[],
  prefix: (field: string) => string,
  errors: FieldErrors,
): void {
  for (const field of fields) {
    const value = row[field.name] ?? '';
    if (field.maxLength && value.length > field.maxLength) {
      errors[prefix(field.name)] = `${field.label} cannot exceed ${field.maxLength} characters.`;
    }
    if (field.type === 'number' && value && !isValidDecimal(value)) {
      errors[prefix(field.name)] = `${field.label} must be a valid decimal amount.`;
    }
  }
}

export function validateRequestForm(state: RequestFormState, mode: RequestFormMode): FieldErrors {
  const errors: FieldErrors = {};
  const result = coreSchema(mode).safeParse(state.core);
  if (!result.success) {
    for (const issue of result.error.issues satisfies ZodIssue[]) {
      const field = issue.path[0];
      if (typeof field === 'string') errors[field] = issue.message;
    }
  }

  if (state.detailKind === 'OPEX') {
    validateRow(state.opex, OPEX_FIELDS, (field) => detailFieldKey('opex', field), errors);
  }
  if (state.detailKind === 'CAPEX') {
    validateRow(state.capex, CAPEX_FIELDS, (field) => detailFieldKey('capex', field), errors);
  }
  for (const section of SECTION_CONFIGS) {
    state[section.key].forEach((row, index) => {
      validateRow(row, section.fields, (field) => sectionFieldKey(section.key, index, field), errors);
    });
  }
  return errors;
}

/** Backend source uses `opexDetail.*` / `capexDetail.*`; the payload uses `opex.*` / `capex.*`. */
function normalizeServerField(field: string): string {
  if (field === 'opexDetail') return 'opex';
  if (field === 'capexDetail') return 'capex';
  if (field.startsWith('opexDetail.')) return `opex.${field.slice('opexDetail.'.length)}`;
  if (field.startsWith('capexDetail.')) return `capex.${field.slice('capexDetail.'.length)}`;
  return field;
}

export function serverFieldErrorsToRecord(error: unknown): FieldErrors {
  const apiError = normalizeUnknownError(error);
  if (!(apiError instanceof ApiError) || !apiError.fieldErrors) return {};
  const errors: FieldErrors = {};
  for (const detail of apiError.fieldErrors) {
    errors[normalizeServerField(detail.field)] = detail.message;
  }
  return errors;
}
