/**
 * Shared, development-only Step 2 preview data for the browser harnesses.
 *
 * Every identity, organization, request, count, distribution and activity value
 * below is synthetic. It is injected through intercepted API envelopes so the
 * responsive and visual checks can exercise real screens without a Spring Boot
 * backend or a production deployment. Product code never imports this module.
 */
export const step2Permissions = [
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
];

export const step2PreviewNote = [
  'Step 2 request, dashboard, lookup and activity values in these screenshots are synthetic,',
  'development-only values injected by scripts/step2-preview-api.mjs through intercepted API',
  'envelopes. They are not institutional information. No live Spring Boot backend, PostgreSQL',
  'database, file/document service or production deployment is used.',
].join(' ');

const USER_ID = '00000000-0000-0000-0000-000000000001';
export const STEP2_REQUEST_ID = '00000000-0000-0000-0000-000000000101';
export const STEP2_EDIT_REQUEST_ID = '00000000-0000-0000-0000-000000000104';
const SECOND_REQUEST_ID = '00000000-0000-0000-0000-000000000103';
const DEPARTMENT_ID = '00000000-0000-0000-0000-000000000201';
const BRANCH_ID = '00000000-0000-0000-0000-000000000202';
const CATEGORY_ID = '00000000-0000-0000-0000-000000000203';
const NATURE_ID = '00000000-0000-0000-0000-000000000204';
const REQUEST_TYPE_ID = '00000000-0000-0000-0000-000000000205';
const CURRENCY_ID = '00000000-0000-0000-0000-000000000206';
const TAX_AUTHORITY_ID = '00000000-0000-0000-0000-000000000207';

const requestTypes = [
  { id: REQUEST_TYPE_ID, code: 'OPEX_STANDARD', name: 'Standard operating expense', active: true },
];
const categories = [
  {
    id: CATEGORY_ID,
    code: 'TRAVEL',
    name: 'Travel',
    expenseType: 'OPEX',
    active: true,
    subcategories: [
      { id: '00000000-0000-0000-0000-000000000208', code: 'AIR', name: 'Air travel', active: true },
    ],
  },
  {
    id: '00000000-0000-0000-0000-000000000209',
    code: 'EQUIPMENT',
    name: 'Equipment',
    expenseType: 'CAPEX',
    active: true,
    subcategories: [],
  },
];
const natures = [{ id: NATURE_ID, code: 'RECURRING', name: 'Recurring', active: true }];
const departments = [{ id: DEPARTMENT_ID, code: 'FIN', name: 'Finance', active: true }];
const branches = [{ id: BRANCH_ID, code: 'MAIN', name: 'Main branch', active: true }];
const currencies = [
  { id: CURRENCY_ID, code: 'PKR', name: 'Pakistani Rupee', symbol: 'Rs', decimalPlaces: 2, active: true },
];
const taxAuthorities = [
  { id: TAX_AUTHORITY_ID, code: 'FBR', name: 'Federal Board of Revenue', active: true },
];

const draftRequest = {
  id: STEP2_REQUEST_ID,
  requestNumber: 'ER-PREVIEW-001',
  status: 'DRAFT',
  classification: 'OPEX',
  requestTypeId: REQUEST_TYPE_ID,
  expenseCategoryId: CATEGORY_ID,
  expenseSubcategoryId: '00000000-0000-0000-0000-000000000208',
  expenseNatureId: NATURE_ID,
  requestedBy: USER_ID,
  departmentId: DEPARTMENT_ID,
  branchId: BRANCH_ID,
  currencyId: CURRENCY_ID,
  requestedAmount: 1250.5,
  baseCurrencyAmount: 1250.5,
  exchangeRateId: null,
  justification: 'Synthetic development preview of a documented draft request.',
  workflowInstanceId: null,
  submittedAt: null,
  createdAt: '2026-11-18T09:00:00Z',
  updatedAt: '2026-11-18T09:30:00Z',
  version: 1,
  canEdit: true,
  canSubmit: true,
  canCancel: true,
  terminal: false,
  opex: {
    recurring: false,
    nonRecurringJustification: 'One-time operating cost',
  },
  capex: null,
  allocations: [
    { departmentId: DEPARTMENT_ID, allocationAmount: 1250.5 },
  ],
  items: [
    { itemDescription: 'Institutional travel line', quantity: 1, unitPrice: 1250.5 },
  ],
  quotations: [
    { currencyId: CURRENCY_ID, quotationAmount: 1250.5, quotationDate: '2026-11-17', quotationNumber: 'QT-PREVIEW-01' },
  ],
  invoices: [],
  previousSummaries: [],
  staDetails: [
    { taxAmount: 0, taxAuthorityId: TAX_AUTHORITY_ID },
  ],
  budgetSummaries: [
    { allocatedAmount: 5000, consumedAmount: 1250.5, budgetReference: 'BUD-PREVIEW-01' },
  ],
  documents: [],
};

const editableRequest = {
  ...draftRequest,
  id: STEP2_EDIT_REQUEST_ID,
  requestNumber: 'ER-PREVIEW-003',
  createdAt: '2026-11-18T11:00:00Z',
  updatedAt: '2026-11-18T11:00:00Z',
  opex: null,
  capex: null,
  allocations: [],
  items: [],
  quotations: [],
  invoices: [],
  previousSummaries: [],
  staDetails: [],
  budgetSummaries: [],
  documents: [],
};

const submittedRequest = {
  ...draftRequest,
  id: SECOND_REQUEST_ID,
  requestNumber: 'ER-PREVIEW-002',
  status: 'SUBMITTED',
  requestedAmount: 2500,
  baseCurrencyAmount: 2500,
  submittedAt: '2026-11-18T10:00:00Z',
  createdAt: '2026-11-18T08:00:00Z',
  updatedAt: '2026-11-18T10:00:00Z',
  version: 2,
  canEdit: false,
  canSubmit: false,
  canCancel: true,
  opex: { recurring: true },
  allocations: [],
  items: [],
  quotations: [],
  staDetails: [],
  budgetSummaries: [],
};

function summary(request) {
  return {
    id: request.id,
    requestNumber: request.requestNumber,
    status: request.status,
    classification: request.classification,
    departmentId: request.departmentId,
    currencyId: request.currencyId,
    requestedAmount: request.requestedAmount,
    createdAt: request.createdAt,
    submittedAt: request.submittedAt,
  };
}

const dashboard = {
  baseCurrencyCode: 'PKR',
  metrics: [
    { key: 'total_requests', label: 'Total requests', value: 2, unit: null, subtitle: 'Matching requests in period' },
    { key: 'pending_approvals', label: 'Pending approvals (visible)', value: 1, unit: null, subtitle: 'Visible to this session' },
    { key: 'approved_base_amount', label: 'Approved amount', value: 2500, unit: 'PKR', subtitle: 'Backend base currency' },
    { key: 'my_requests', label: 'My requests', value: 1, unit: null, subtitle: 'Requests created by this session' },
  ],
  byStatus: [
    { key: 'DRAFT', label: 'Draft', count: 1, amount: 1250.5 },
    { key: 'SUBMITTED', label: 'Submitted', count: 1, amount: 2500 },
  ],
  byDepartment: [{ key: DEPARTMENT_ID, label: 'Finance', count: 2, amount: 3750.5 }],
  byCategory: [{ key: CATEGORY_ID, label: 'Travel', count: 2, amount: 3750.5 }],
  byExpenseType: [{ key: 'OPEX', label: 'OPEX', count: 2, amount: 3750.5 }],
  trend: [
    { bucketStart: '2026-11-17T00:00:00Z', bucketEnd: '2026-11-18T00:00:00Z', count: 1, amount: 2500 },
    { bucketStart: '2026-11-18T00:00:00Z', bucketEnd: '2026-11-19T00:00:00Z', count: 1, amount: 1250.5 },
  ],
};

const emptyDashboard = {
  baseCurrencyCode: 'PKR',
  metrics: [],
  byStatus: [],
  byDepartment: [],
  byCategory: [],
  byExpenseType: [],
  trend: [],
};

const timeline = {
  items: [
    {
      source: 'AUDIT',
      eventId: '00000000-0000-0000-0000-000000000301',
      timestamp: '2026-11-18T09:00:00Z',
      actorId: USER_ID,
      actorName: 'Preview Session',
      action: 'CREATED',
      description: 'Draft request created',
      previousState: null,
      newState: 'DRAFT',
      remarks: null,
      correlationId: 'preview-correlation-1',
    },
    {
      source: 'AUDIT',
      eventId: '00000000-0000-0000-0000-000000000302',
      timestamp: '2026-11-18T09:30:00Z',
      actorId: USER_ID,
      actorName: 'Preview Session',
      action: 'UPDATED',
      description: 'Justification updated',
      previousState: 'DRAFT',
      newState: 'DRAFT',
      remarks: null,
      correlationId: 'preview-correlation-2',
    },
  ],
  size: 20,
  nextCursor: null,
  hasNext: false,
  boundedAt: '2026-11-18T10:00:00Z',
  complete: true,
};

function pageResponse(items, url) {
  const page = Number(url.searchParams.get('page') ?? '0');
  const size = Number(url.searchParams.get('size') ?? '20');
  const start = page * size;
  return {
    items: items.slice(start, start + size),
    page,
    size,
    totalElements: items.length,
    totalPages: size > 0 ? Math.ceil(items.length / size) : 0,
    hasNext: start + size < items.length,
    hasPrevious: page > 0,
  };
}

function listData(url) {
  const status = url.searchParams.get('status') ?? undefined;
  const departmentId = url.searchParams.get('departmentId') ?? undefined;
  const categoryId = url.searchParams.get('categoryId') ?? undefined;
  const search = (url.searchParams.get('search') ?? '').toLowerCase();
  const mineOnly = url.searchParams.get('mineOnly') === 'true';
  return [draftRequest, submittedRequest]
    .filter((request) => {
      if (mineOnly && request.requestedBy !== USER_ID) return false;
      if (status && request.status !== status) return false;
      if (departmentId && request.departmentId !== departmentId) return false;
      if (categoryId && request.expenseCategoryId !== categoryId) return false;
      if (search && !(request.requestNumber ?? '').toLowerCase().includes(search)) return false;
      return true;
    })
    .map(summary);
}

/**
 * Return a Step 2 envelope response for an intercepted browser request, or
 * null when the request belongs to the Step 1/other mock handlers.
 */
export function step2MockResponse({
  url,
  method = 'GET',
  route = {},
  envelopeSuccess,
  envelopeFailure,
}) {
  const parsed = url instanceof URL ? url : new URL(url, 'http://preview.invalid');
  const path = parsed.pathname;
  const verb = method.toUpperCase();
  const scenario = route.scenario ?? '';
  const success = (data, status = 200) => ({
    status,
    payload: envelopeSuccess(data, path),
  });
  const fail = (status, code, message, fieldErrors) => ({
    status,
    payload: envelopeFailure(code, message, path, fieldErrors),
  });

  if (!path.startsWith('/api/v1/')) return null;

  if (verb === 'GET' && path === '/api/v1/reporting/dashboard') {
    if (scenario === 'dashboard-permission-denied') return fail(403, 'EDAM-2005', 'You are not permitted to view reporting.');
    if (scenario === 'dashboard-error') return fail(502, 'EDAM-5003', 'Reporting is temporarily unavailable.');
    if (scenario === 'dashboard-empty') return success(emptyDashboard);
    return success(dashboard);
  }

  const simpleLookups = {
    '/api/v1/expense-configuration/request-types': requestTypes,
    '/api/v1/expense-configuration/categories': categories,
    '/api/v1/expense-configuration/natures': natures,
    '/api/v1/organization/departments': departments,
    '/api/v1/organization/branches': branches,
    '/api/v1/master-data/currencies': currencies,
    '/api/v1/master-data/tax-authorities': taxAuthorities,
  };
  if (verb === 'GET' && Object.hasOwn(simpleLookups, path)) return success(simpleLookups[path]);

  if (verb === 'GET' && path === '/api/v1/expense-requests') {
    if (scenario === 'list-error') return fail(502, 'EDAM-5003', 'The request register is temporarily unavailable.');
    if (scenario === 'list-empty') return success(pageResponse([], parsed));
    return success(pageResponse(listData(parsed), parsed));
  }

  const activityMatch = path.match(/^\/api\/v1\/expense-requests\/([^/]+)\/activity$/);
  if (verb === 'GET' && activityMatch) {
    if (scenario === 'activity-error') return fail(502, 'EDAM-5003', 'Activity is temporarily unavailable.');
    return success(timeline);
  }

  const submitMatch = path.match(/^\/api\/v1\/expense-requests\/([^/]+)\/submit$/);
  if (verb === 'POST' && submitMatch) {
    if (scenario === 'state-conflict') return fail(422, 'EDAM-3004', 'The operation is not permitted in the current state.');
    return success({ ...draftRequest, status: 'SUBMITTED', submittedAt: '2026-11-18T11:00:00Z', canSubmit: false, canEdit: false });
  }

  const cancelMatch = path.match(/^\/api\/v1\/expense-requests\/([^/]+)\/cancel$/);
  if (verb === 'POST' && cancelMatch) {
    return success({ ...draftRequest, status: 'CANCELLED', canEdit: false, canSubmit: false, canCancel: false, terminal: true });
  }

  if (verb === 'POST' && path === '/api/v1/expense-requests') {
    if (scenario === 'validation-error') {
      return fail(400, 'EDAM-1001', 'Validation failed.', [{ field: 'requestedAmount', message: 'Requested amount must be greater than zero.' }]);
    }
    if (scenario === 'key-reuse') return fail(409, 'EDAM-1004', 'This idempotency key was used with a different payload.');
    if (scenario === 'in-progress') return fail(409, 'EDAM-1005', 'The original submission is still processing.');
    if (scenario === 'state-conflict') return fail(409, 'EDAM-3002', 'The request changed elsewhere.');
    return success(draftRequest, 201);
  }

  const detailOrUpdate = path.match(/^\/api\/v1\/expense-requests\/([^/]+)$/);
  if (detailOrUpdate) {
    const id = decodeURIComponent(detailOrUpdate[1]);
    const request = id === SECOND_REQUEST_ID
      ? submittedRequest
      : id === STEP2_EDIT_REQUEST_ID
        ? editableRequest
        : draftRequest;
    if (verb === 'GET') {
      if (scenario === 'detail-error') return fail(404, 'EDAM-4001', 'Request not found.');
      return success(request);
    }
    if (verb === 'PUT') {
      if (scenario === 'validation-error') {
        return fail(400, 'EDAM-1001', 'Validation failed.', [{ field: 'justification', message: 'Justification is required by the backend.' }]);
      }
      if (scenario === 'state-conflict') return fail(409, 'EDAM-3002', 'The request changed elsewhere.');
      return success({ ...request, version: (request.version ?? 1) + 1 });
    }
  }

  return null;
}

export const step2VisualRoutes = [
  { name: 'dashboard', path: '/app/dashboard', heading: 'Dashboard', authenticated: true, capture: true },
  { name: 'my-requests', path: '/app/requests/mine?page=0&size=20', heading: 'My Requests', authenticated: true, capture: true },
  { name: 'all-requests', path: '/app/requests/all?page=0&size=20', heading: 'All Requests', authenticated: true, capture: true },
  { name: 'new-request', path: '/app/requests/new', heading: 'New Request', authenticated: true, capture: true },
  { name: 'request-detail', path: `/app/requests/${STEP2_REQUEST_ID}`, heading: 'Request Details', authenticated: true, capture: true },
  { name: 'edit-request', path: `/app/requests/${STEP2_EDIT_REQUEST_ID}/edit`, heading: 'Edit Request', authenticated: true, capture: true },
  {
    name: 'dashboard-empty',
    path: '/app/dashboard?empty=1',
    heading: 'Dashboard',
    authenticated: true,
    capture: true,
    viewports: ['desktop'],
    scenario: 'dashboard-empty',
  },
  {
    name: 'dashboard-error',
    path: '/app/dashboard?error=1',
    heading: 'Dashboard',
    authenticated: true,
    capture: true,
    viewports: ['desktop'],
    scenario: 'dashboard-error',
  },
  {
    name: 'dashboard-denied',
    path: '/app/dashboard?denied=1',
    heading: 'Access denied',
    authenticated: true,
    capture: true,
    viewports: ['desktop'],
    scenario: 'dashboard-permission-denied',
    permissionsOverride: step2Permissions.filter((permission) => permission !== 'report:view'),
  },
  {
    name: 'my-requests-empty',
    path: '/app/requests/mine?empty=1&page=0&size=20',
    heading: 'My Requests',
    authenticated: true,
    capture: true,
    viewports: ['desktop'],
    scenario: 'list-empty',
  },
  {
    name: 'request-activity-error',
    path: `/app/requests/${STEP2_REQUEST_ID}?activityError=1`,
    heading: 'Request Details',
    authenticated: true,
    capture: true,
    viewports: ['desktop'],
    scenario: 'activity-error',
  },
];

export const step2ResponsiveRoutes = step2VisualRoutes.map((route) => ({
  ...route,
  expectedHeading: route.heading,
  shell: true,
  bootstrapped: true,
  mustChangePassword: false,
}));
