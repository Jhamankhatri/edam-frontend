# H02 — API Contracts, Response Envelope & OpenAPI Codegen

All `/api/v1` responses except RPT-002 export are JSON wrapped in `ApiResponse<T>`. Sources:
`src/main/java/com/edam/common/api/{ApiResponse,PageResponse,PageQuery,ErrorCode}.java`,
`src/main/java/com/edam/common/exception/GlobalExceptionHandler.java`.

## 1. Response envelope

```ts
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ErrorBody | null;
  fieldErrors: FieldErrorDetail[] | null;
  correlationId: string;
  path: string;
  timestamp: string;          // ISO-8601 instant
}
interface ErrorBody   { code: string; message: string; }  // code = EDAM-nnnn, message safe for users
interface FieldErrorDetail { field: string; message: string; }  // rejected values NEVER echoed back
```

- `@JsonInclude(NON_NULL)` — absent means null, do not require the field.
- Success: `success:true`, `data:<payload>`, `error:null`, `fieldErrors:null`.
- Validation failure: HTTP 400, `error.code="EDAM-1001"`, `fieldErrors[]` populated.
- `correlationId` ties the response to server logs; surface it to the user on 5xx.

## 2. Pagination

### Standard list endpoints (`PageResponse<T>`)

Used by nearly every list endpoint (requests list, approvals inbox, notifications,
documents list, users, roles, etc.).

```ts
interface PageResponse<T> {
  items: T[];
  page: number;          // zero-based
  size: number;          // server-selected page size (capped at 200)
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```
Request params: `page` (default 0), `size` (default 20, capped 200), `sort=property,(asc|desc)` (repeatable).

### Expense-request register report (`RegisterResponse`)

Used only by RPT-003 `GET /reporting/expense-requests/register`. Uses Spring `Pageable` with
default `size=50, sort=submittedAt,desc`; cap **500** rows (separate from the general 200 cap).

```ts
interface RegisterResponse {
  rows: RegisterRow[];
  total: number;
  page: number;
  size: number;
  totals: RegisterTotals;
  availableColumns: string[];
}
interface RegisterTotals {
  totalCount: number; totalBaseAmount: number;   // number (BigDecimal)
  pendingCount: number; pendingBaseAmount: number;
  approvedCount: number; approvedBaseAmount: number;
  rejectedCount: number; returnedCount: number; cancelledCount: number;
}
```

### Request timeline (keyset pagination)

REQ-005 uses keyset pagination: `size` (integer, capped 200) and `cursor` (opaque string; omit for
first page). Returns `TimelinePage { events: TimelineEntry[]; nextCursor: string | null }`.

## 3. HTTP status → `error.code` mapping

Source: `ErrorCode.java` + `GlobalExceptionHandler.statusFor(...)`.

| HTTP | Code | Meaning |
|------|------|---------|
| 400 | `EDAM-1001` VALIDATION_FAILED | Bean validation failed (fieldErrors[]) |
| 400 | `EDAM-1002` INVALID_REQUEST | Malformed JSON / missing param / type mismatch |
| 400 | `EDAM-1003` INVALID_PAGINATION | page/size out of range (size > MAX_SIZE) |
| 400 | `EDAM-5004` INVALID_DOCUMENT | Upload rejected (type/size/scan) |
| 400 | `EDAM-5005` INVALID_CONFIGURATION | Admin config rejected |
| 401 | `EDAM-2001` UNAUTHENTICATED | Session missing/expired |
| 401 | `EDAM-2006` INVALID_CREDENTIALS | Bad credentials (identical for unknown user/wrong password/inactive) |
| 401 | `EDAM-2009` INVALID_RESET_TOKEN | Reset token invalid/expired |
| 403 | `EDAM-2002` ACCESS_DENIED | Spring Security access denied |
| 403 | `EDAM-2005` PERMISSION_DENIED | `@EdamPermission` failure |
| 403 | `EDAM-2003` INSTITUTION_REQUIRED, `EDAM-2004` INSTITUTION_ACCESS_DENIED | Multi-institution checks (reserved) |
| 409 | `EDAM-1004/1005/1006` IDEMPOTENCY_CONFLICT / IN_PROGRESS / UNKNOWN_OUTCOME | Idempotency failures |
| 409 | `EDAM-3002` CONCURRENT_MODIFICATION | Optimistic-lock conflict (on `@Version`) |
| 409 | `EDAM-3003` PRECONDITION_FAILED | If-Match / version mismatch |
| 409 | `EDAM-3004` INVALID_STATE_TRANSITION | Action not permitted in the current state |
| 409 | `EDAM-3001` BUSINESS_RULE_VIOLATION | Generic business-rule rejection |
| 409 | `EDAM-5002` DUPLICATE_RESOURCE | Unique constraint violation |
| 409 | `EDAM-5001` PERSISTENCE_ERROR | DB constraint/connectivity |
| 422 | `EDAM-2008` WEAK_PASSWORD | Password fails policy |
| 422 | `EDAM-2010` INSTALLATION_ALREADY_COMPLETED, `EDAM-2011` INSTALLATION_NOT_BOOTSTRAPPED | Bootstrap state errors |
| 422 | `EDAM-3005` SYSTEM_ROLE_PROTECTED | Edit to protected system role rejected |
| 423 | `EDAM-2007` ACCOUNT_LOCKED | Too many failed logins |
| 404 | `EDAM-4001` NOT_FOUND | Record not found OR record outside caller's data scope (deliberately indistinguishable) |
| 500 | `EDAM-9001` INTERNAL_ERROR | Unexpected (safe message only) |
| 503 | `EDAM-5003` EXTERNAL_SERVICE_FAILURE | External provider failure (storage/mail/etc.) |

Network errors (no response, CORS, DNS) are not in the envelope; the fetch wrapper normalizes
them into the same `ApiError` shape.

## 4. Key DTO shapes

Only cross-cutting DTOs are documented here. Generate all other types via OpenAPI (§8).

### 4.1 `CurrentUserResponse` (AUTH-008 `GET /auth/me`)
```ts
interface CurrentUserResponse {
  userId: string; username: string; employeeCode: string; displayName: string; email: string;
  designation: string | null;
  departmentId: string | null; departmentName: string | null;
  branchId: string | null; branchName: string | null;
  roles: string[]; permissions: string[];
  dataScopes: DataScopeView[];   // { type: "DEPARTMENT"|"BRANCH"; referenceId; referenceName }
  installationScope: boolean;
  mustChangePassword: boolean;
  lastLoginAt: string | null;
  passwordPolicy: PasswordPolicyView;
}
interface PasswordPolicyView { minimumLength: number; maximumLength: number;
  requireUppercase: boolean; requireLowercase: boolean; requireDigit: boolean; requireSpecial: boolean; }
```

### 4.2 Login / logout / bootstrap
- `POST /auth/login` (AUTH-006): body `{ username, password }` → `ApiResponse<CurrentUserResponse>`;
  sets `JSESSIONID` + rotated `XSRF-TOKEN` cookies.
- `POST /auth/logout` (AUTH-007): no body → `ApiResponse<Void>`; invalidates session.
- `POST /auth/bootstrap` (AUTH-001): header `X-Installation-Token: <token>`, body
  `{ username, firstName, lastName, email, employeeCode?, password }` →
  **HTTP 201** `ApiResponse<BootstrapResponse>` where `BootstrapResponse { userId, username, displayName, roles: string[], bootstrappedAt }`.
  **Does not establish a session** — the admin must then explicitly log in (D-23).

### 4.3 CSRF (AUTH-003)
`GET /auth/csrf` returns `CsrfTokenResponse { headerName, parameterName, token }` AND explicitly
saves the cookie via `csrfTokenRepository.saveToken(...)` so clients that call this endpoint
before their first write are guaranteed to receive the `Set-Cookie: XSRF-TOKEN` header.
`headerName` is always `X-XSRF-TOKEN` with the configured repository.

### 4.4 Forgot/reset/change password
- `POST /auth/forgot-password` → `ApiResponse<NeutralResponse> { message }` (constant message,
  never reveals whether the email exists).
- `POST /auth/reset-password` → `{ token, newPassword }` → `ApiResponse<Void>`.
- `POST /auth/change-password` → `{ currentPassword, newPassword }` → `ApiResponse<Void>`.

### 4.5 Public configuration (BRD-005 `GET /public/configuration`)
```ts
interface PublicConfigurationResponse {
  applicationName: string; organizationDisplayName: string; organizationName: string;
  supportEmail: string;
  logoAssetId: string | null; faviconAssetId: string | null;
  defaultLocale: string; defaultTimeZone: string; dateFormat: string;
  defaultCurrencyCode: string;
  activeThemeName: string; activeThemeType: "LIGHT"|"DARK";
  themeTokens: Map<string,string>;   // e.g. { "--primary": "#1e5fd6", ... }
}
```
This is the ONLY data the login screen should rely on. It does NOT include feature flags, the
password policy, or a logo URL (only asset IDs — D-27). Feature flags and password policy are
available only after authentication (`GET /auth/me` and admin-only feature-flag endpoints).

### 4.6 Request DTOs (selected, H02 §4.6 continued in module docs)

`RequestSummary` (register rows):
`{ id, requestNumber, status, classification, departmentId, currencyId, requestedAmount:number, createdAt, submittedAt }`.

`RequestResponse` (detail) — see `ExpenseRequestDtos.java`; includes:
`opex?: OpexDetailResponse`, `capex?: CapexDetailResponse`,
`allocations[], items[], quotations[], invoices[], previousSummaries[], staDetails[], budgetSummaries[]`,
plus action flags `canEdit, canSubmit, canCancel, terminal` computed server-side. Clients
must rely on these flags (not status-name heuristics).

`CreateRequest`: `{ requestTypeId, expenseCategoryId, expenseSubcategoryId?, expenseNatureId,
departmentId, branchId?, currencyId, requestedAmount:number|string, justification?, opex?,
capex?, allocations?, items?, quotations?, invoices?, previousSummaries?, staDetails?,
budgetSummaries?, documents?: DocumentReferencePayload[] }` where `DocumentReferencePayload {
mediaAssetId: UUID; documentType: string; mandatory: boolean }`. Exactly one of `opex`/`capex`
must be supplied.

`UpdateRequest`: same fields minus `departmentId` (department is immutable after create).

`CancelRequest`: `{ reason: string }` (body is required; not path-only).

### 4.7 Approval DTOs
- `ApproveRequest`  `{ remarks: string }` — **remarks required** (`@NotBlank`, max 2000).
- `RejectRequest`   `{ remarks: string }` — required.
- `RevertRequest`   `{ remarks: string }` — required.
- `ForwardRequest`  `{ recipientUserId: UUID; remarks: string }` — both required.
- `ActionResponse { taskId, taskStatus, workflowStateCode, workflowStateType, workflowCompleted, requestId, requestStatus, newTaskIds: UUID[] }`.
- `ApprovalCaseFile` carries `availableActions: ActionAvailability[]` where `{ action, available, reason }` — render buttons only for available actions.

### 4.8 Document DTOs
- `DocumentResponse { id, originalFilename, category, mimeType, sizeBytes:number, description, lifecycleStatus, scanStatus:"PENDING"|"CLEAN"|"INFECTED", uploadedBy, uploadedByName, uploadedAt, expenseRequestId }`.
- `UploadDocumentRequest` is built server-side from multipart fields `file, expenseRequestId, category, description?`. The `category` is one of the `DocumentCategory` enum codes (`QUOTATION`, `INVOICE`, `SUPPORTING_DOCUMENT`, `APPROVAL_DOCUMENT`, `TAX_DOCUMENT`, `GRN_DOCUMENT`, `CAPEX_DOCUMENT`, `OTHER`) — `@Pattern("^[A-Z_]+$")`.
- Download URL response: `{ url: string; expiresInSeconds: 300 }`.
- `ScanEventResponse { id, status, scanner, scannerVersion, threatName, startedAt, finishedAt, detail }`.

### 4.9 Reporting DTOs
- Dashboard filter: 13 explicit query params (`departmentId, branchId, categoryId, subcategoryId,
  requesterId, expenseType, currency, status, from, to, search, lookbackDays`) on RPT-001.
- Register filter (RPT-003) mirrors the dashboard filter plus `Pageable`; default sort
  `submittedAt,desc`.
- Export request: `ExportRequest { reportKey, filter: ReportFilter, format: "CSV"|"EXCEL" }`.
  RPT-002 returns raw bytes (see §7).

## 5. Monetary numbers on the wire

Jackson's default BigDecimal serializer writes JSON **numbers** (e.g. `{"requestedAmount": 1234.56}`).
The `@Digits(integer=15, fraction=4)` constraint caps precision. Clients MUST:
- Parse with a decimal-aware library (`decimal.js-light`) to avoid binary floating-point error.
- Send monetary values as either `number` (safe up to `Number.MAX_SAFE_INTEGER` for 4dp) or as a
  JSON number produced by the decimal library; either is accepted because Jackson coerces to
  BigDecimal. For amounts larger than 2^53 − 1 (≈ 90 trillion, which is implausible for EDAM),
  a string is not an option; configure Jackson if needed in a future iteration.

## 6. Idempotency endpoints

The seven endpoints annotated `@IdempotentOperation` (source
`com.edam.common.api.IdempotentOperation` plus controller annotations):
REQ-002 POST create, REQ-004 PUT update, REQ-006 POST cancel, REQ-007 POST submit,
APL-004/005/006/008 POST approve/forward/reject/revert, plus AUTH-006 POST login.
Each must send `Idempotency-Key: <uuidv4>` header. The key persists across retries of the same
user gesture.

## 7. Raw binary response (RPT-002 export)

RPT-002 is declared `public void export(...)` and writes directly to the HttpServletResponse
— it is NOT wrapped in `ApiResponse`. Content handling:

- CSV → `Content-Type: text/csv; charset=UTF-8`, with UTF-8 BOM and formula-injection prefix
  (`=+-@` stripped/prepended per RFC 4180).
- XLSX → `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
  (SXSSF streaming).
- `Content-Disposition: attachment; filename="expense-request-register.<csv|xlsx>"`.
- Caller must use `response.blob()` / `response.arrayBuffer()`, not `.json()`.
- Row cap: server enforces `EXPORT_ROW_LIMIT`; returns 400 `EDAM-1001` with a message naming
  the matched count when exceeded.

## 8. TypeScript codegen (REQUIRED)

```bash
npx openapi-typescript http://localhost:8080/v3/api-docs -o src/api/generated/schema.d.ts
```
Do not hand-write DTOs. Regenerate on every backend pull; CI fails on diff. The generated
schema module becomes the only imported type source for API payloads; cross-module DTO shapes
in this H-file are a reference for humans, not the generated source.

## 9. HTTP client wrapper requirements

Single `apiFetch<T>` wrapper must:
1. Prepend `VITE_API_BASE_URL`.
2. Attach `X-XSRF-TOKEN` from the `XSRF-TOKEN` cookie for non-GET requests.
3. Attach `Idempotency-Key` on the endpoints listed in §6.
4. Attach `Accept: application/json`; `Content-Type: application/json` for writes; no header
   overrides for `multipart/form-data` (let the browser set `Content-Type` with boundary).
5. Read responses by content-type: JSON → `ApiResponse<T>`; blob (octet-stream/csv/xlsx) →
   return the raw `Response` for download handling.
6. Normalize network / non-JSON 5xx / envelope `success:false` into `ApiError { code, message, correlationId, fieldErrors?, status }`.
7. On 401 `EDAM-2001`, publish `auth:expired` and redirect to `/login?returnTo=`.
8. Export endpoints must set `responseType: 'blob'` (axios) / equivalent so the body is not parsed as JSON.
