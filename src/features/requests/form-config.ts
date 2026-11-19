import {
  ALL_FILTER,
  NO_SELECTION,
  type RowField,
  type SectionConfig,
  type SelectOption,
} from './types';

export const YES_NO_OPTIONS: readonly SelectOption[] = [
  { value: 'true', label: 'Yes' },
  { value: 'false', label: 'No' },
] as const;

export const NONE_OPTION: SelectOption = { value: NO_SELECTION, label: 'Not selected' };
export const ALL_OPTION: SelectOption = { value: ALL_FILTER, label: 'All' };

export const DETAIL_KIND_OPTIONS: readonly SelectOption[] = [
  { value: NO_SELECTION, label: 'No typed details (draft only)' },
  { value: 'OPEX', label: 'OPEX details' },
  { value: 'CAPEX', label: 'CAPEX details' },
] as const;

export const OPEX_FIELDS: readonly RowField[] = [
  { name: 'recurring', label: 'Recurring', type: 'select', options: YES_NO_OPTIONS, defaultValue: 'false' },
  { name: 'recurrenceFrequency', label: 'Recurrence frequency', type: 'text' },
  { name: 'nonRecurringJustification', label: 'Non-recurring justification', type: 'textarea', maxLength: 4000 },
  { name: 'accruedAmount', label: 'Accrued amount', type: 'number' },
  { name: 'previouslyApprovedAmount', label: 'Previously approved amount', type: 'number' },
  { name: 'ytdAmount', label: 'Year-to-date amount', type: 'number' },
  { name: 'mtdAmount', label: 'Month-to-date amount', type: 'number' },
  { name: 'paymentTerms', label: 'Payment terms', type: 'textarea', maxLength: 4000 },
  { name: 'budgetAvailable', label: 'Budget available', type: 'number' },
  { name: 'budgetReference', label: 'Budget reference', type: 'text', maxLength: 150 },
  { name: 'threeQuotationsSelected', label: 'Three quotations selected', type: 'select', options: YES_NO_OPTIONS, defaultValue: 'false' },
] as const;

export const CAPEX_FIELDS: readonly RowField[] = [
  { name: 'requestType', label: 'CAPEX request type', type: 'text', maxLength: 50 },
  { name: 'invoiceTotal', label: 'Invoice total', type: 'number' },
  { name: 'approvalAmount', label: 'Approval amount', type: 'number' },
  { name: 'totalCharges', label: 'Total charges', type: 'number' },
  { name: 'budgeted', label: 'Budgeted', type: 'select', options: YES_NO_OPTIONS, defaultValue: 'true' },
  { name: 'budgetAmount', label: 'Budget amount', type: 'number' },
  { name: 'unbudgetedReason', label: 'Unbudgeted reason', type: 'text', maxLength: 500 },
  { name: 'overBudgetReason', label: 'Over-budget reason', type: 'text', maxLength: 500 },
  { name: 'classification', label: 'Classification detail', type: 'text', maxLength: 100 },
  { name: 'warrantyStartDate', label: 'Warranty start date', type: 'date' },
  { name: 'warrantyEndDate', label: 'Warranty end date', type: 'date' },
  { name: 'purchaseNature', label: 'Purchase nature', type: 'textarea', maxLength: 4000 },
  { name: 'financeComment', label: 'Finance comment', type: 'textarea', maxLength: 4000 },
  { name: 'budgetComment', label: 'Budget comment', type: 'textarea', maxLength: 4000 },
  { name: 'termsAndConditions', label: 'Terms and conditions', type: 'textarea', maxLength: 4000 },
] as const;

export const SECTION_CONFIGS: readonly SectionConfig[] = [
  {
    key: 'allocations',
    index: '04',
    title: 'Charge allocations',
    description: 'Optional DTO rows. The backend validates allocation totals and submission completeness.',
    fields: [
      { name: 'departmentId', label: 'Department', type: 'select', optionsKey: 'departments', defaultValue: NO_SELECTION },
      { name: 'branchId', label: 'Branch', type: 'select', optionsKey: 'branches', defaultValue: NO_SELECTION },
      { name: 'costCenter', label: 'Cost centre', type: 'text', maxLength: 100 },
      { name: 'allocationAmount', label: 'Allocation amount', type: 'number' },
      { name: 'allocationPercentage', label: 'Allocation percentage', type: 'number' },
    ],
  },
  {
    key: 'items',
    index: '05',
    title: 'Item-wise details',
    description: 'Optional rows from ItemPayload; CAPEX submissions require at least one item.',
    fields: [
      { name: 'itemDescription', label: 'Item description', type: 'text', maxLength: 500 },
      { name: 'quantity', label: 'Quantity', type: 'number' },
      { name: 'unitPrice', label: 'Unit price', type: 'number' },
      { name: 'warrantyDate', label: 'Warranty date', type: 'date' },
    ],
  },
  {
    key: 'quotations',
    index: '06',
    title: 'Quotations',
    description: 'Optional rows from QuotationPayload; document media references are deferred.',
    fields: [
      { name: 'quotationNumber', label: 'Quotation number', type: 'text', maxLength: 100 },
      { name: 'quotationDate', label: 'Quotation date', type: 'date' },
      { name: 'quotationAmount', label: 'Quotation amount', type: 'number' },
      { name: 'currencyId', label: 'Currency', type: 'select', optionsKey: 'currencies', defaultValue: NO_SELECTION },
    ],
  },
  {
    key: 'invoices',
    index: '07',
    title: 'Invoices',
    description: 'Optional rows from InvoicePayload; the backend checks the invoice total.',
    fields: [
      { name: 'invoiceNumber', label: 'Invoice number', type: 'text', maxLength: 100 },
      { name: 'invoiceDate', label: 'Invoice date', type: 'date' },
      { name: 'invoiceAmount', label: 'Invoice amount', type: 'number' },
      { name: 'currencyId', label: 'Currency', type: 'select', optionsKey: 'currencies', defaultValue: NO_SELECTION },
    ],
  },
  {
    key: 'previousSummaries',
    index: '08',
    title: 'Previous summaries',
    description: 'Optional rows from PreviousSummaryPayload.',
    fields: [
      { name: 'period', label: 'Period', type: 'text', maxLength: 40 },
      { name: 'previousAmount', label: 'Previous amount', type: 'number' },
      { name: 'approvedAmount', label: 'Approved amount', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea', maxLength: 4000 },
    ],
  },
  {
    key: 'staDetails',
    index: '09',
    title: 'Sales tax authorities',
    description: 'Optional rows from StaPayload; CAPEX submissions require at least one.',
    fields: [
      { name: 'taxAuthorityId', label: 'Tax authority', type: 'select', optionsKey: 'taxAuthorities', defaultValue: NO_SELECTION },
      { name: 'staReference', label: 'STA reference', type: 'text', maxLength: 150 },
      { name: 'taxAmount', label: 'Tax amount', type: 'number' },
      { name: 'description', label: 'Description', type: 'textarea', maxLength: 4000 },
    ],
  },
  {
    key: 'budgetSummaries',
    index: '10',
    title: 'Budget summaries',
    description: 'Optional rows from BudgetSummaryPayload.',
    fields: [
      { name: 'budgetReference', label: 'Budget reference', type: 'text', maxLength: 150 },
      { name: 'allocatedAmount', label: 'Allocated amount', type: 'number' },
      { name: 'consumedAmount', label: 'Consumed amount', type: 'number' },
    ],
  },
] as const;
