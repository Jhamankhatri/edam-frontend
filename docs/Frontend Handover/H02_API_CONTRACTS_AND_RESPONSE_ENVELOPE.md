# H02 — API Contracts, Response Envelope & OpenAPI Codegen

## 1. Canonical response envelope

Every non-HTML response from EDAM is wrapped in `ApiResponse<T>`:

```ts
// com.edam.common.api.ApiResponse
interface ApiResponse<T> {
  success: boolean;
  data: T | null;
  error: ErrorBody | null;
  fieldErrors: FieldErrorDetail[] | null;
  correlationId: string;
  path: string;
  timestamp: string; // ISO-8601 instant
}

interface ErrorBody {
  code: string;     // stable, machine-readable (e.g. "VALIDATION_FAILED", "ACCESS_DENIED")
  message: string;  // safe for end users — never contains SQL, stack traces, or class names
}

interface FieldErrorDetail {
  field: string;    // request-path expression (e.g. "allocations[2].amount")
  message: string;  // human-readable, localized message from the backend
}
```

Conventions enforced by `GlobalExceptionHandler.java`:

- On success: `success: true`, `data: <payload>`, `error: null`, `fieldErrors: null`.
- On validation failure: HTTP 400, `success: false`, `error.code = "VALIDATION_FAILED"`,
  `fieldErrors[]` populated, **no rejected value is echoed back** (security policy).
- On business errors: HTTP mapped by `ErrorCode` (see §3), `success: false`, `error.code` set.
- `correlationId` is the bridge to server logs; show it to the user on 5xx so support can find the trace.
- `null` fields are omitted (`@JsonInclude(NON_NULL)`); the TypeScript client must treat missing
  fields as absent, not `null`.

## 2. Pagination envelope

Every list endpoint returns `PageResponse<T>` inside `ApiResponse.data`:

```ts
interface PageResponse<T> {
  items: T[];
  page: number;          // zero-based
  size: number;          // actual page size used (capped server-side at 100)
  totalElements: number;
  totalPages: number;
  hasNext: boolean;
  hasPrevious: boolean;
}
```

Request parameters for every paginated list endpoint:

| Param | Type | Default | Notes |
|-------|------|---------|-------|
| `page` | int | 0 | zero-based; negative values → 400 `INVALID_PAGINATION` |
| `size` | int | 20 | clamped server-side to `[1, 100]` |
| `sort` | string | server default | `property,asc` or `property,desc`; repeat for multi-sort |

Query contracts per list endpoint are not re-documented here — they come from SpringDoc
(see §5).

## 3. Error codes and HTTP status mapping

The table below is the **frontend error-handling contract**. Every error the frontend will ever
see from the API uses one of these codes. Source: `com.edam.common.api.ErrorCode.java` and
`GlobalExceptionHandler.statusFor(...)`.

| HTTP | `error.code` | When | Frontend action |
|------|--------------|------|-----------------|
| 400 | `VALIDATION_FAILED` | Bean validation failed | Render per-field errors from `fieldErrors[]` (see H06) |
| 400 | `INVALID_REQUEST` | Malformed JSON, missing param, type mismatch | Show generic "Please check your request" toast |
| 400 | `INVALID_PAGINATION` | page/size/sort out of range | Reset list paging state |
| 400 | `INVALID_DOCUMENT` | Upload rejected (size/type/virus) | Show document-specific error inline |
| 400 | `INVALID_CONFIGURATION` | Admin config change rejected | Show form error |
| 401 | `UNAUTHENTICATED` | Session missing/expired | Redirect to `/login` preserving `?returnTo=` |
| 401 | `INVALID_CREDENTIALS` | Login bad credentials | Show "Invalid username or password" on login form |
| 401 | `INVALID_RESET_TOKEN` | Reset-password token expired/wrong | Show "This link has expired" |
| 403 | `ACCESS_DENIED`, `PERMISSION_DENIED`, `INSTITUTION_REQUIRED`, `INSTITUTION_ACCESS_DENIED` | Authenticated but not allowed | Render `<AccessDenied/>` screen; hide nav entry |
| 409 | `CONCURRENT_MODIFICATION` | Optimistic lock conflict (If-Match / @Version mismatch) | Reload record and ask user to re-apply edits |
| 409 | `IDEMPOTENCY_CONFLICT`, `IDEMPOTENCY_IN_PROGRESS`, `IDEMPOTENCY_UNKNOWN_OUTCOME` | Duplicate/replayed mutating request | Show "Request already in progress / completed"; reload list |
| 409 | `DUPLICATE_RESOURCE` | Unique constraint (e.g. duplicate username/email/code) | Show field-level error on the offending input |
| 409 | `PERSISTENCE_ERROR` | DB constraint / general DB failure | Generic error toast; log with correlationId |
| 423 | `ACCOUNT_LOCKED` | Too many failed logins | Show lockout screen with retry timing if provided |
| 422 | `WEAK_PASSWORD` | Password does not meet policy | Show password-policy hints |
| 422 | `INSTALLATION_ALREADY_COMPLETED` | Bootstrap attempted twice | Redirect to `/login` |
| 422 | `INSTALLATION_NOT_BOOTSTRAPPED` | Login attempted before bootstrap | Redirect to `/bootstrap` |
| 422 | `SYSTEM_ROLE_PROTECTED` | Attempt to edit/delete a built-in role | Show "This role is managed by the system" |
| 404 | `NOT_FOUND` | No handler / record not found | Render `<NotFound/>`; for records outside scope the server returns 404 (not 403) to avoid existence leaks |
| 405 | (no body — framework) | Wrong HTTP method | Should not happen if client uses generated types |
| 500 | `INTERNAL_ERROR` | Unhandled server error | Show "Something went wrong" + correlationId; report to monitoring |
| 503 | `PERSISTENCE_ERROR` | DB connectivity loss | Show "Service temporarily unavailable"; retry with backoff |

Network-layer errors (no response, CORS, DNS failure, timeout) are not in the envelope — the
frontend's fetch/query wrapper must translate them to a normalized shape before reaching UI code.

## 4. Key DTO shapes used by every screen

Rather than hand-transcribe all 189 DTOs (which would drift the moment the backend changes),
this section documents the **core cross-cutting DTOs** every screen uses. All other DTOs MUST
be generated by OpenAPI codegen (§5).

### 4.1 Current user (AUTH-008 `GET /api/v1/auth/me` → `CurrentUserResponse`)

```ts
interface CurrentUserResponse {
  userId: string;              // UUID
  username: string;
  employeeCode: string;
  displayName: string;
  email: string;
  designation: string | null;
  departmentId: string | null; // UUID
  departmentName: string | null;
  branchId: string | null;     // UUID
  branchName: string | null;
  roles: string[];             // role codes
  permissions: string[];       // kebab-case permission codes — used for UI gates (H04)
  dataScopes: DataScopeView[]; // department/branch pairs visible to the user
  installationScope: boolean;  // true → user has installation-wide (admin) scope
  mustChangePassword: boolean; // true → force redirect to /change-password
  lastLoginAt: string | null;  // ISO-8601
  passwordPolicy: PasswordPolicyView;
}
interface DataScopeView { departmentId: string; departmentName: string; branchId: string; branchName: string; }
interface PasswordPolicyView { minLength: number; requireUppercase: boolean; requireDigit: boolean; requireSpecial: boolean; }
```

### 4.2 Login (AUTH-006 `POST /api/v1/auth/login`)

Request (`LoginRequest`):
```ts
{ username: string; password: string; }  // both @NotBlank, max 100/200 chars
```
On success: HTTP 200, returns `CurrentUserResponse` as `data`; session cookie is set on the response (`Set-Cookie: JSESSIONID=...; HttpOnly; SameSite=Lax; Path=/`). The CSRF token cookie is also set/rotated.

### 4.3 Bootstrap (AUTH-001 `POST /api/v1/auth/bootstrap`)

Requires the one-time installation token in header **`X-Installation-Token: <token>`** (not `X-EDAM-Bootstrap-Token`). Request body:
```ts
{ username: string; firstName: string; lastName: string; email: string; employeeCode?: string; password: string; }
```
On success, returns `BootstrapResponse` with the created admin user.

### 4.4 Password flows

- `POST /api/v1/auth/forgot-password` → `{ email: string }` (AUTH-004) — always returns success to
  avoid account enumeration.
- `POST /api/v1/auth/reset-password` → `{ token: string; newPassword: string }` (AUTH-009).
- `POST /api/v1/auth/change-password` → `{ currentPassword: string; newPassword: string }` (AUTH-002, authenticated).

### 4.5 CSRF token (AUTH-003 `GET /api/v1/auth/csrf`)

Returns:
```ts
interface CsrfTokenResponse { token: string; headerName: string; parameterName: string; }
// headerName is always "X-XSRF-TOKEN" when CookieCsrfTokenRepository is used
```
The response also sets (or rotates) the cookie `XSRF-TOKEN`. The client echoes it back as the
`X-XSRF-TOKEN` header on every non-GET request (see H03).

### 4.6 Expense request summary (returned by list endpoints)

`RequestSummary` (`com.edam.expenserequest.dto.ExpenseRequestDtos.java`):

| Field | Type | Notes |
|-------|------|-------|
| `id` | UUID | |
| `requestNumber` | string | Human-readable business key (e.g. `REQ-2026-00123`) |
| `title` | string | |
| `expenseType` | `"OPEX" \| "CAPEX"` | |
| `status` | enum string | Draft / Submitted / Returned / Approved / Rejected / Cancelled / … |
| `totalAmount` | string (decimal) | Render with currency from `currencyId` |
| `currencyId` | UUID | |
| `requesterId` | UUID | |
| `requesterName` | string | |
| `departmentId` | UUID | |
| `departmentName` | string | |
| `submittedAt` | ISO instant \| null | null for drafts |
| `lastUpdatedAt` | ISO instant | |

### 4.7 Expense request detail (returned by `GET /expense-requests/{id}`)

`RequestResponse` aggregates: `RequestSummary` fields + `items: ItemResponse[]`,
`allocations: AllocationResponse[]`, `quotations: QuotationResponse[]`,
`invoices: InvoiceResponse[]`, `opexDetail` / `capexDetail` / `staPayload` conditional on
expense type, `budgetSummary`, `previousSummary` (for returned requests), `documents: DocumentReferencePayload[]`.

The frontend MUST render OPEX vs CAPEX vs STA (Straight Through Allowance) subforms conditionally.

### 4.8 Approval case file (APL-003 `GET /approvals/tasks/{taskId}`)

`ApprovalCaseFile` aggregates: `task: ApprovalTaskSummary`, `request: RequestResponse`,
`stepProgress: StepProgress`, `taskProgress: TaskProgress`, `availableActions: ActionResponse[]`,
`workflowEvents: WorkflowEventView[]`, `timeline: TimelineEntry[]`.

`ActionResponse` tells the frontend which buttons to render for the current approver
(`approve`, `reject`, `forward`, `revert` are not always all available — e.g. revert is only
offered to the task assignee on a task they previously approved in error).

### 4.9 Approval action requests

All approval action endpoints (APL-004/005/006/008) accept a body with a `comment` field:

| Endpoint | Body type | Required fields |
|----------|-----------|-----------------|
| `POST /approvals/tasks/{taskId}/approve` | `ApproveRequest` | `comment?: string` |
| `POST /approvals/tasks/{taskId}/reject` | `RejectRequest` | `comment: string` (mandatory reason) |
| `POST /approvals/tasks/{taskId}/forward` | `ForwardRequest` | `targetUserId: UUID; comment?: string` |
| `POST /approvals/tasks/{taskId}/revert` | `RevertRequest` | `comment: string` (mandatory reason) |

### 4.10 Export (RPT-002 `POST /reporting/expense-requests/export`)

`ExportRequest`: `{ reportKey: string; filter: ReportFilter; format: "CSV" | "EXCEL" }`.
Response: the raw file stream (not wrapped in ApiResponse) with:
- CSV → `Content-Type: text/csv; charset=utf-8`
- XLSX → `Content-Type: application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`
- `Content-Disposition: attachment; filename="..."; filename*=UTF-8''...`

`ReportFilter` mirrors the on-screen filter panel: date range `from`/`to`, status[], expenseType[],
departmentIds[], branchIds[], requesterIds[], currencyIds[], categoryIds[], minAmount/maxAmount.

### 4.11 Public configuration (BRD public `GET /public/configuration`)

`PublicConfigurationResponse` carries theme tokens, institution display name, logo URL, currency
defaults, enabled feature flags, and password policy hints. It is the only `/api/v1` endpoint
that returns UI-critical data without a session (so the login screen can be branded correctly).

## 5. TypeScript type generation (REQUIRED — do NOT hand-write types)

EDAM ships a complete SpringDoc OpenAPI 3.1 document at `/v3/api-docs`. The frontend must
generate TypeScript types directly from it:

```bash
# With the backend running on http://localhost:8080:
npx openapi-typescript http://localhost:8080/v3/api-docs \
  -o src/api/generated/schema.d.ts \
  --alphabetize \
  --export-type

# Optional: also generate typed fetch clients (recommended for Phase 1):
npx openapi-typescript-codegen --input http://localhost:8080/v3/api-docs \
  --output src/api/generated \
  --useOptions --useUnionTypes --client fetch
```

**Do not hand-transcribe DTOs.** This package intentionally shows only the 10 cross-cutting
shapes above. Every per-screen DTO is sourced from SpringDoc to guarantee drift-free contracts.

Regenerate types after every backend pull. CI must diff `schema.d.ts` against the backend
OpenAPI doc and fail the build if they diverge.

## 6. HTTP client contract for the frontend

A single `apiFetch<T>(method, path, opts)` wrapper must:

1. Prepend `VITE_API_BASE_URL` to paths that start with `/`.
2. Attach `X-XSRF-TOKEN` header from the `XSRF-TOKEN` cookie for non-GET requests.
3. Attach `Idempotency-Key: <uuidv4()>` on idempotency-annotated endpoints (list in H01 §4).
4. Attach `Accept: application/json` and (for writes) `Content-Type: application/json`.
5. Read response as JSON when `Content-Type` is `application/json`; for export endpoints, return
   the `Response` object so the caller can trigger a download.
6. Normalize errors: network failure, non-JSON 5xx, and envelope `success:false` all produce a
   single typed `ApiError` with `{ code, message, correlationId, fieldErrors?, status }`.
7. On 401 `UNAUTHENTICATED`, publish an `auth:expired` event and redirect to `/login` (except
   for the login page itself).
8. Attach `If-Match` header on updates when the loaded record has an `@Version` field (sent as
   `etag` field in responses), so optimistic-lock conflicts return 409 `CONCURRENT_MODIFICATION`.

## 7. Source evidence

- Envelope shapes: `src/main/java/com/edam/common/api/ApiResponse.java`, `PageResponse.java`.
- Error handling & status map: `src/main/java/com/edam/common/exception/GlobalExceptionHandler.java`,
  `src/main/java/com/edam/common/api/ErrorCode.java`.
- Auth DTOs: `src/main/java/com/edam/identity/dto/AuthDtos.java`.
- Expense request DTOs: `src/main/java/com/edam/expenserequest/dto/ExpenseRequestDtos.java`.
- Approval DTOs: `src/main/java/com/edam/workflow/dto/ApprovalDtos.java` (note package is
  `workflow`, not `approval`).
- Reporting DTOs & ExportFormat enum: `src/main/java/com/edam/reporting/dto/ReportingDtos.java`
  (line 107: `public enum ExportFormat { CSV, EXCEL }`).
