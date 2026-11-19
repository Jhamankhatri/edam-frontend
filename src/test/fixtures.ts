import type {
  BranchResponse,
  CategoryResponse,
  CurrencyResponse,
  DashboardSummary,
  DepartmentResponse,
  LookupResponse,
  PageResponseRequestSummary,
  RequestResponse,
  RequestSummary,
  TaxAuthorityResponse,
  TimelinePage,
} from '@/api/services/request-contracts';
import type {
  BootstrapResponse,
  CurrentUserResponse,
  InstallationStatusResponse,
  PasswordPolicyView,
  PublicConfigurationResponse,
} from '@/api/contracts';

export const INITIAL_CSRF_TOKEN = 'csrf-token-initial';
export const POST_LOGIN_CSRF_TOKEN = 'csrf-token-after-login';
export const INSTALLATION_TOKEN = 'one-time-installation-token';
export const TEST_PASSWORD = 'InitialPass1';

export const passwordPolicy: PasswordPolicyView = {
  minimumLength: 8,
  maximumLength: 64,
  requireUppercase: true,
  requireLowercase: true,
  requireDigit: true,
  requireSpecial: false,
};

const allRequiredPermissions = [
  'report:view',
  'request:view-own',
  'request:view-scope',
  'request:view-all',
  'request:create',
  'request:edit',
  'request:submit',
  'request:cancel',
  'expense-configuration:view',
  'organization:view',
  'currency:view',
  'workflow:view',
  'vendor:view',
  'approval:view',
  'notification:view',
] as const;

export function currentUser(
  overrides: Partial<CurrentUserResponse> = {},
): CurrentUserResponse {
  return {
    userId: '00000000-0000-0000-0000-000000000001',
    username: 'admin',
    employeeCode: 'EMP-001',
    displayName: 'Preview Session',
    email: 'preview.session@example.invalid',
    designation: 'Institution Administrator',
    departmentId: null,
    departmentName: null,
    branchId: null,
    branchName: null,
    roles: [],
    permissions: [...allRequiredPermissions],
    dataScopes: [],
    installationScope: true,
    mustChangePassword: false,
    lastLoginAt: '2026-11-18T09:00:00Z',
    passwordPolicy,
    ...overrides,
  };
}

export const publicConfiguration: PublicConfigurationResponse = {
  applicationName: 'EDAM',
  organizationDisplayName: 'Preview Institution',
  organizationName: 'Preview Institution',
  supportEmail: 'support@example.invalid',
  logoAssetId: null,
  faviconAssetId: null,
  defaultLocale: 'en-GB',
  defaultTimeZone: 'Asia/Karachi',
  dateFormat: 'dd MMM yyyy',
  defaultCurrencyCode: 'PKR',
  activeThemeName: 'Institution Light',
  activeThemeType: 'LIGHT',
  themeTokens: { primary: '#1e5fd6' },
};

export const bootstrappedStatus: InstallationStatusResponse = {
  bootstrapped: true,
  bootstrappedAt: '2026-11-18T08:00:00Z',
};

export const bootstrapResponse: BootstrapResponse = {
  userId: '00000000-0000-0000-0000-000000000002',
  username: 'admin',
  displayName: 'Preview Session',
  roles: [],
  bootstrappedAt: '2026-11-18T10:00:00Z',
};

/**
 * Development-only Step 2 fixtures. These represent backend-shaped envelopes in
 * MSW/browser harnesses; they are never imported by product components.
 */

export const STEP2_USER_ID = '00000000-0000-0000-0000-000000000001';
export const STEP2_REQUEST_ID = '00000000-0000-0000-0000-000000000101';
export const STEP2_CREATED_REQUEST_ID = '00000000-0000-0000-0000-000000000102';
export const STEP2_EDITABLE_REQUEST_ID = '00000000-0000-0000-0000-000000000104';
export const STEP2_DEPARTMENT_ID = '00000000-0000-0000-0000-000000000201';
export const STEP2_BRANCH_ID = '00000000-0000-0000-0000-000000000202';
export const STEP2_CATEGORY_ID = '00000000-0000-0000-0000-000000000203';
export const STEP2_NATURE_ID = '00000000-0000-0000-0000-000000000204';
export const STEP2_REQUEST_TYPE_ID = '00000000-0000-0000-0000-000000000205';
export const STEP2_CURRENCY_ID = '00000000-0000-0000-0000-000000000206';
export const STEP2_TAX_AUTHORITY_ID = '00000000-0000-0000-0000-000000000207';

export const step2RequestTypes: LookupResponse[] = [
  { id: STEP2_REQUEST_TYPE_ID, code: 'OPEX_STANDARD', name: 'Standard operating expense', active: true },
];
export const step2Categories: CategoryResponse[] = [
  {
    id: STEP2_CATEGORY_ID,
    code: 'TRAVEL',
    name: 'Travel',
    expenseType: 'OPEX',
    active: true,
    subcategories: [],
  },
];
export const step2Natures: LookupResponse[] = [
  { id: STEP2_NATURE_ID, code: 'RECURRING', name: 'Recurring', active: true },
];
export const step2Departments: DepartmentResponse[] = [
  { id: STEP2_DEPARTMENT_ID, code: 'FIN', name: 'Finance', active: true },
];
export const step2Branches: BranchResponse[] = [
  { id: STEP2_BRANCH_ID, code: 'MAIN', name: 'Main branch', active: true },
];
export const step2Currencies: CurrencyResponse[] = [
  { id: STEP2_CURRENCY_ID, code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', decimalPlaces: 2, active: true },
];
export const step2TaxAuthorities: TaxAuthorityResponse[] = [
  { id: STEP2_TAX_AUTHORITY_ID, code: 'FBR', name: 'Federal Board of Revenue', active: true },
];

export const step2Request: RequestResponse = {
  id: STEP2_REQUEST_ID,
  requestNumber: 'ER-TEST-001',
  status: 'DRAFT',
  classification: 'OPEX',
  requestTypeId: STEP2_REQUEST_TYPE_ID,
  expenseCategoryId: STEP2_CATEGORY_ID,
  expenseNatureId: STEP2_NATURE_ID,
  requestedBy: STEP2_USER_ID,
  departmentId: STEP2_DEPARTMENT_ID,
  branchId: STEP2_BRANCH_ID,
  currencyId: STEP2_CURRENCY_ID,
  requestedAmount: 1250.5,
  baseCurrencyAmount: 1250.5,
  justification: 'Documented test request',
  createdAt: '2026-11-18T09:00:00Z',
  updatedAt: '2026-11-18T09:00:00Z',
  version: 1,
  canEdit: true,
  canSubmit: true,
  canCancel: true,
  terminal: false,
  opex: {
    recurring: false,
    nonRecurringJustification: 'One-time operating cost',
  },
  allocations: [],
  items: [],
  quotations: [],
  invoices: [],
  previousSummaries: [],
  staDetails: [],
  budgetSummaries: [],
};

export const step2EditableRequest: RequestResponse = {
  ...step2Request,
  id: STEP2_EDITABLE_REQUEST_ID,
  requestNumber: 'ER-TEST-003',
  createdAt: '2026-11-18T11:00:00Z',
  updatedAt: '2026-11-18T11:00:00Z',
  opex: undefined,
  capex: undefined,
  allocations: [],
  items: [],
  quotations: [],
  invoices: [],
  previousSummaries: [],
  staDetails: [],
  budgetSummaries: [],
};

export const step2SecondRequest: RequestResponse = {
  ...step2Request,
  id: '00000000-0000-0000-0000-000000000103',
  requestNumber: 'ER-TEST-002',
  status: 'SUBMITTED',
  requestedBy: '00000000-0000-0000-0000-000000000009',
  canEdit: false,
  canSubmit: false,
  canCancel: true,
  submittedAt: '2026-11-18T10:00:00Z',
};

export const step2Summary = (request: RequestResponse): RequestSummary => ({
  id: request.id,
  requestNumber: request.requestNumber,
  status: request.status,
  classification: request.classification,
  departmentId: request.departmentId,
  currencyId: request.currencyId,
  requestedAmount: request.requestedAmount,
  createdAt: request.createdAt,
  submittedAt: request.submittedAt,
});

export const step2Page = (items: readonly RequestSummary[]): PageResponseRequestSummary => ({
  items: [...items],
  page: 0,
  size: 20,
  totalElements: items.length,
  totalPages: items.length > 0 ? 1 : 0,
  hasNext: false,
  hasPrevious: false,
});

export const step2Dashboard: DashboardSummary = {
  baseCurrencyCode: 'PKR',
  metrics: [
    { key: 'total_requests', label: 'Total requests', value: 2, unit: undefined, subtitle: 'Matching requests in period' },
    { key: 'total_base_amount', label: 'Total amount', value: 2501, unit: 'PKR', subtitle: 'Base-currency total' },
  ],
  byStatus: [
    { key: 'DRAFT', label: 'Draft', count: 1, amount: 1250.5 },
  ],
  byDepartment: [
    { key: STEP2_DEPARTMENT_ID, label: 'Finance', count: 2, amount: 2501 },
  ],
  byCategory: [
    { key: STEP2_CATEGORY_ID, label: 'Travel', count: 2, amount: 2501 },
  ],
  byExpenseType: [
    { key: 'OPEX', label: 'OPEX', count: 2, amount: 2501 },
  ],
  trend: [
    {
      bucketStart: '2026-11-18T00:00:00Z',
      bucketEnd: '2026-11-19T00:00:00Z',
      count: 2,
      amount: 2501,
    },
  ],
};

export const emptyStep2Dashboard: DashboardSummary = {
  baseCurrencyCode: 'PKR',
  metrics: [],
  byStatus: [],
  byDepartment: [],
  byCategory: [],
  byExpenseType: [],
  trend: [],
};

export const step2Timeline: TimelinePage = {
  items: [
    {
      source: 'AUDIT',
      eventId: '00000000-0000-0000-0000-000000000301',
      timestamp: '2026-11-18T09:00:00Z',
      actorId: STEP2_USER_ID,
      actorName: 'Preview Session',
      action: 'CREATED',
      description: 'Draft request created',
      newState: 'DRAFT',
      correlationId: 'test-correlation-id',
    },
  ],
  size: 20,
  hasNext: false,
  boundedAt: '2026-11-18T10:00:00Z',
  complete: true,
};
