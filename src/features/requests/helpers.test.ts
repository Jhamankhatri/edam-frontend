import { describe, expect, it } from 'vitest';
import { ApiError } from '@/api/errors';
import {
  step2Currencies,
  step2EditableRequest,
  step2Request,
  step2RequestTypes,
  STEP2_BRANCH_ID,
  STEP2_CATEGORY_ID,
  STEP2_CURRENCY_ID,
  STEP2_DEPARTMENT_ID,
  STEP2_NATURE_ID,
  STEP2_REQUEST_TYPE_ID,
} from '@/test/fixtures';
import { emptyFormState, formStateFromResponse, hasUnpreservableDetail, optionSetsFromLookups } from './form-state';
import type { RequestLookups } from './hooks';
import { decimalToNumber, formatMoney, formatNumber, formatStatus, isDecimalAtLeast, statusTone } from './format';
import { toCreatePayload, toUpdatePayload } from './payload';
import { serverFieldErrorsToRecord, validateRequestForm } from './validation';
import { recoverableErrorState } from './recoverable-errors';
import { NO_SELECTION, type RequestFormState } from './types';
import { parseRequestListSearch } from './search';

function validState(): RequestFormState {
  const state = emptyFormState();
  state.core = {
    requestTypeId: STEP2_REQUEST_TYPE_ID,
    expenseCategoryId: STEP2_CATEGORY_ID,
    expenseSubcategoryId: NO_SELECTION,
    expenseNatureId: STEP2_NATURE_ID,
    departmentId: STEP2_DEPARTMENT_ID,
    branchId: STEP2_BRANCH_ID,
    currencyId: STEP2_CURRENCY_ID,
    requestedAmount: '1250.50',
    justification: 'Documented test request',
  };
  state.detailKind = 'OPEX';
  state.opex = { ...state.opex, recurring: 'false' };
  return state;
}

const lookups: RequestLookups = {
  requestTypes: step2RequestTypes,
  categories: [
    {
      id: STEP2_CATEGORY_ID,
      code: 'TRAVEL',
      name: 'Travel',
      expenseType: 'OPEX',
      active: true,
      subcategories: [{ id: '00000000-0000-0000-0000-000000000208', code: 'AIR', name: 'Air travel', active: true }],
    },
  ],
  natures: [{ id: STEP2_NATURE_ID, code: 'RECURRING', name: 'Recurring', active: true }],
  departments: [{ id: STEP2_DEPARTMENT_ID, code: 'FIN', name: 'Finance', active: true }],
  branches: [{ id: STEP2_BRANCH_ID, code: 'MAIN', name: 'Main branch', active: true }],
  currencies: step2Currencies,
  taxAuthorities: [],
};

describe('Step 2 form state and payload helpers', () => {
  it('validates documented required fields without inventing server rules', () => {
    expect(validateRequestForm(validState(), 'create')).toEqual({});
    const invalid = validState();
    invalid.core = {
      ...invalid.core,
      requestTypeId: 'not-a-uuid',
      requestedAmount: '0',
      justification: 'x'.repeat(4001),
    };
    invalid.items = [{ itemDescription: 'A'.repeat(501), quantity: 'not-a-number', unitPrice: '', warrantyDate: '' }];
    const errors = validateRequestForm(invalid, 'create');
    expect(errors.requestTypeId).toMatch(/reference value/i);
    expect(errors.requestedAmount).toMatch(/greater than zero/i);
    expect(errors.justification).toMatch(/4000/);
    expect(errors['items[0].itemDescription']).toMatch(/500/);
    expect(errors['items[0].quantity']).toMatch(/valid decimal/i);
  });

  it('creates and replaces only fields present in the generated DTO aliases', () => {
    const state = validState();
    const create = toCreatePayload(state);
    const update = toUpdatePayload(state);
    expect(create).toMatchObject({
      requestTypeId: STEP2_REQUEST_TYPE_ID,
      expenseCategoryId: STEP2_CATEGORY_ID,
      expenseNatureId: STEP2_NATURE_ID,
      departmentId: STEP2_DEPARTMENT_ID,
      branchId: STEP2_BRANCH_ID,
      currencyId: STEP2_CURRENCY_ID,
      requestedAmount: 1250.5,
      justification: 'Documented test request',
      opex: { recurring: false },
    });
    expect(create).not.toHaveProperty('expenseSubcategoryId');
    expect(create).not.toHaveProperty('allocations');
    expect(create).not.toHaveProperty('items');
    expect(update).toMatchObject({ requestedAmount: 1250.5, opex: { recurring: false } });
    expect(update).not.toHaveProperty('departmentId');
    expect(update).not.toHaveProperty('documents');
    expect(update).not.toHaveProperty('version');
  });

  it('rehydrates header-only records and stops unsafe replacements of richer records', () => {
    const state = formStateFromResponse(step2EditableRequest);
    expect(state).toMatchObject({
      core: {
        requestTypeId: STEP2_REQUEST_TYPE_ID,
        departmentId: STEP2_DEPARTMENT_ID,
        requestedAmount: '1250.5',
      },
      detailKind: NO_SELECTION,
      allocations: [],
      items: [],
      quotations: [],
    });
    expect(hasUnpreservableDetail(step2EditableRequest)).toBe(false);
    expect(hasUnpreservableDetail(step2Request)).toBe(true);
    expect(hasUnpreservableDetail({ ...step2EditableRequest, opex: { recurring: false }, capex: {} })).toBe(true);
    const options = optionSetsFromLookups(lookups, state);
    expect(options.requestTypes.map((option) => option.label)).toContain('Standard operating expense');
    expect(options.subcategories.map((option) => option.label)).toContain('Air travel');
    expect(options.departments.map((option) => option.value)).toContain(STEP2_DEPARTMENT_ID);
  });

  it('parses only transport-shaped search values and preserves the default paging', () => {
    expect(parseRequestListSearch({})).toEqual({ page: 0, size: 20 });
    const parsed = parseRequestListSearch({
      search: '  ER-001 ',
      status: 'DRAFT',
      departmentId: STEP2_DEPARTMENT_ID,
      page: '2',
      size: '5000',
    });
    expect(parsed).toEqual({
      search: 'ER-001',
      status: 'DRAFT',
      departmentId: STEP2_DEPARTMENT_ID,
      page: 2,
      size: 200,
    });
    expect(parseRequestListSearch({ status: 'NOT_A_STATUS', page: -1, size: 0 }).status).toBeUndefined();
    expect(parseRequestListSearch({})).toEqual({ page: 0, size: 20 });
  });

  it('uses Decimal for form parsing and handles absent backend values explicitly', () => {
    expect(decimalToNumber('1250.50', 'Requested amount')).toBe(1250.5);
    expect(isDecimalAtLeast('0.0001', '0.0001')).toBe(true);
    expect(isDecimalAtLeast('0', '0.0001')).toBe(false);
    expect(formatNumber(undefined)).toBe('—');
    expect(formatMoney(1250.5, 'PKR')).toMatch(/PKR$/);
    expect(formatStatus('IN_PROGRESS')).toBe('In progress');
    expect(formatStatus(undefined)).toBe('Status unavailable');
    expect(statusTone('DRAFT')).toBe('outline');
    expect(statusTone('APPROVED')).toBe('success');
  });
});

describe('Step 2 recovery mapping', () => {
  const action = (code: string, status = 409) => recoverableErrorState(
    new ApiError({ code, message: 'Backend error', status }),
  ).action;

  it('maps source-derived idempotency, validation and concurrency outcomes', () => {
    expect(action('EDAM-1004')).toBe('new-key');
    expect(action('EDAM-1005')).toBe('reconcile');
    expect(action('EDAM-1006')).toBe('reconcile');
    expect(action('EDAM-3002')).toBe('reload');
    expect(action('EDAM-3003')).toBe('reload');
    expect(action('EDAM-3001', 422)).toBe('reload');
    expect(action('EDAM-3004', 422)).toBe('reload');
    expect(action('EDAM-1001', 400)).toBe('validate');
    expect(action('EDAM-5002', 409)).toBe('validate');
    expect(action('NETWORK_ERROR', 0)).toBe('same-key');
    expect(action('EDAM-2005', 403)).toBe('none');
  });

  it('normalizes server field paths without exposing raw internal errors', () => {
    const error = new ApiError({
      code: 'EDAM-1001',
      message: 'Validation failed.',
      status: 400,
      fieldErrors: [
        { field: 'opexDetail.recurring', message: 'Recurring is required.' },
        { field: 'requestedAmount', message: 'Amount must be greater than zero.' },
      ],
    });
    expect(serverFieldErrorsToRecord(error)).toEqual({
      'opex.recurring': 'Recurring is required.',
      requestedAmount: 'Amount must be greater than zero.',
    });
  });
});
