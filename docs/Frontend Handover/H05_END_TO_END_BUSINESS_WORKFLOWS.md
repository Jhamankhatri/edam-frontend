# H05 — End-to-End Business Workflows

Each workflow below documents: user journey → route → API sequence → permissions → request
state transitions → validation & error handling → edge cases. Endpoint IDs cross-reference
H01 (`APPENDIX_A_ENDPOINT_INVENTORY.md`).

> Legend: `→` = sequence, `✅` = happy path, `⚠️` = error/edge case, `🔁` = retry/recovery.

---

## W1. First-run bootstrap (administrator)

- **Actor:** Installation operator (unauthenticated).
- **Precondition:** `GET /api/v1/auth/installation` returns `{ bootstrapped: false }`.
- **Route:** `/bootstrap`.
- **API sequence:**
  1. `GET /api/v1/auth/csrf` (AUTH-003) → obtain `XSRF-TOKEN`.
  2. `POST /api/v1/auth/bootstrap` (AUTH-001) with header `X-Installation-Token: <token>` and body `BootstrapRequest`.
  3. On 200: session cookie is set; fetch `GET /api/v1/auth/me` (AUTH-008); route to `/app/dashboard`.
- **Permission:** none (one-time endpoint protected by installation-token header).
- **Validation:** `username` not blank ≤100 chars; `firstName/lastName` not blank ≤100; `email` valid ≤255; `password` not blank ≤200.
- ⚠️ `INSTALLATION_ALREADY_COMPLETED` (422) → another operator completed boot; redirect to `/login`.
- ⚠️ 401 `UNAUTHENTICATED` → bad or missing `X-Installation-Token`; show "Invalid installation token" on form.
- ⚠️ `WEAK_PASSWORD` (422) → show password policy hints.

---

## W2. Login / logout

- **Actor:** Any user with credentials.
- **Routes:** `/login`, logout action from user menu.
- **Login sequence:**
  1. Pre-load branding: `GET /api/v1/public/configuration` (BRD public) — set theme.
  2. `GET /api/v1/auth/csrf` (AUTH-003).
  3. `POST /api/v1/auth/login` (AUTH-006) with `Idempotency-Key` header, body `{username, password}`.
  4. On 200: store `CurrentUserResponse` in auth store; re-read CSRF cookie (rotated); route to `?returnTo` or `/app/dashboard`.
  5. If `mustChangePassword: true` → force-redirect to `/change-password`.
- **Logout sequence:**
  1. `POST /api/v1/auth/logout` (AUTH-007).
  2. Clear in-memory stores (QueryClient, auth store); navigate to `/login`.
- ⚠️ `INVALID_CREDENTIALS` (401) → show generic "Invalid username or password" (do NOT reveal which field was wrong — prevents enumeration).
- ⚠️ `ACCOUNT_LOCKED` (423) → show lockout screen.
- ⚠️ `INSTALLATION_NOT_BOOTSTRAPPED` (422) → redirect to `/bootstrap`.
- 🔁 On network failure: show "Network error — retry"; the idempotency key allows safe retry.

---

## W3. Forgot password / reset password

- **Actor:** User with known email address; user with reset-token email link.
- **Routes:** `/forgot-password`, `/reset-password?token=…`.
- **Forgot sequence:** `POST /api/v1/auth/forgot-password` (AUTH-004) with `{email}` → always show
  "If an account exists with that email, a reset link has been sent" (to avoid enumeration).
- **Reset sequence:** `POST /api/v1/auth/reset-password` (AUTH-009) with `{token, newPassword}` →
  on success navigate to `/login` with success toast "Your password has been reset".
- ⚠️ `INVALID_RESET_TOKEN` (401) → "This link has expired or already been used; request a new one".
- ⚠️ `WEAK_PASSWORD` (422) → render policy hints inline.

---

## W4. Create expense request (draft)

- **Actor:** Requester with `request:create`.
- **Route:** `/app/requests/new` (opens a wizard: header → OPEX|CAPEX detail → items → allocations → quotations → review).
- **API sequence:**
  1. Load lookups in parallel: `GET /expense-config/categories`, `GET /master-data/vendors`,
     `GET /master-data/currencies?active=true`, `GET /organization/departments`, etc.
     (CFG-*, MST-*, ORG-* list endpoints).
  2. POST `POST /api/v1/expense-requests` (REQ-002) with `CreateRequest` body; send
     `Idempotency-Key` header.
  3. On 201: server returns the new request (with `id` and `requestNumber`); navigate to
     `/app/requests/{id}` in Draft state.
- **Permissions:** `request:create` (route gate); lookup endpoints require their respective view perms.
- **State transition:** (nonexistent) → `DRAFT`.
- **Validation:** see H06; server returns 400 `VALIDATION_FAILED` with fieldErrors.
- ⚠️ `DUPLICATE_RESOURCE` (409) if same reference number supplied; map to field error.
- 🔁 On 409 `IDEMPOTENCY_*` → show "Save already in progress"; reload list.

---

## W5. Edit expense request

- **Actor:** Requester with `request:edit` who owns the draft (or returned) request.
- **Route:** `/app/requests/{id}/edit`.
- **API sequence:**
  1. `GET /api/v1/expense-requests/{id}` (REQ-003).
  2. User edits; PUT `PUT /api/v1/expense-requests/{id}` (REQ-004) with full `UpdateRequest` body; send `Idempotency-Key` and `If-Match: <etag>` for optimistic locking.
  3. On success navigate back to `/app/requests/{id}`.
- **Permissions:** `request:edit`. The service further requires status ∈ {DRAFT, RETURNED} and
  that the caller is the requester (or has edit-override scope).
- **State transition:** DRAFT → DRAFT, or RETURNED → RETURNED.
- ⚠️ 409 `CONCURRENT_MODIFICATION` → show "This request was updated elsewhere; your edits are
  preserved — review and re-submit". Reload detail and re-apply user edits (local form state).
- ⚠️ 422 when attempting to edit a non-editable status → "This request cannot be edited in its current state."

---

## W6. Submit for approval

- **Actor:** Requester with `request:submit`.
- **Route:** `/app/requests/{id}` → Submit action (available in DRAFT or RETURNED state).
- **API sequence:**
  1. Confirm dialog ("Submit for approval? You won't be able to edit unless it is returned.").
  2. POST `POST /api/v1/expense-requests/{id}/submit` (REQ-007) with `{ comment?: string }` body (if SubmitRequestCommand includes comment — verify via codegen); send `Idempotency-Key`.
  3. On success: invalidate request detail + request list queries; navigate to detail view with SUBMITTED state.
- **State transition:** DRAFT → SUBMITTED, **RETURNED → SUBMITTED** (resubmission reuses this same endpoint; there is no separate "resubmit" endpoint).
- ⚠️ Pre-submit business validation (missing mandatory fields, budget overrun warnings) → 422 business error; surface inline.
- ⚠️ 409 if workflow engine cannot start (e.g. no matching workflow configured) → "No approval workflow configured for this expense type/amount; contact administrator."

---

## W7. Cancel/withdraw a request

- **Actor:** Requester with `request:cancel`.
- **Route:** `/app/requests/{id}` → Withdraw action.
- **API:** `POST /api/v1/expense-requests/{id}/cancel` (REQ-006) with optional comment; `Idempotency-Key`.
- **State:** SUBMITTED → CANCELLED (only before a decision has been recorded). Drafts may also be cancelled.
- ⚠️ If a decision has already been recorded → business error "Cannot withdraw a decided request."

---

## W8. Approve a task

- **Actor:** Approver (assignee of the approval task) holding `approval:act`.
- **Route:** `/app/approvals/tasks/{taskId}` (case-file view).
- **API sequence:**
  1. `GET /api/v1/approvals/tasks/{taskId}` (APL-003) → renders case file; `availableActions` includes `approve`.
  2. Fill comment (optional) and any approval-specific fields.
  3. POST `POST /api/v1/approvals/tasks/{taskId}/approve` (APL-004) body `ApproveRequest`; `Idempotency-Key`.
  4. On success: invalidate inbox count (APL-002), case file, and request detail queries; show "Approved" toast; navigate back to `/app/approvals`.
- **State:** task advances along workflow (e.g. PENDING → APPROVED at step; or to next step).
- ⚠️ If task is no longer assigned to user (claimed by another approver or forwarded between load
  and submit) → business error; refetch case file and show fresh state.

---

## W9. Reject a task

- **Actor:** Approver with `approval:act`.
- **API:** `POST /api/v1/approvals/tasks/{taskId}/reject` (APL-006) body `RejectRequest` (comment
  **required**); `Idempotency-Key`.
- **State:** request transitions to REJECTED (terminal) or RETURNED (requester must revise),
  depending on workflow definition — the backend decides; the frontend reflects whatever status
  comes back in the refetched request.

---

## W10. Forward a task to another approver

- **Actor:** Approver with `approval:act`.
- **API:** `POST /api/v1/approvals/tasks/{taskId}/forward` (APL-005) body `ForwardRequest`
  `{ targetUserId, comment? }`; `Idempotency-Key`.
- **UX notes:**
  - Load forwardable users via user search or a "forward to" dropdown (USR-* list endpoint,
    filtered by users with `approval:act` in the same or higher scope).
  - Comment recommended but optional.
- **State:** task assignee changes; request stays in current workflow step.

---

## W11. Revert an approval (undo a mistaken approval)

- **Actor:** The same approver who previously approved the current step; holding `approval:act`.
- **API:** `POST /api/v1/approvals/tasks/{taskId}/revert` (APL-008) body `RevertRequest` (comment
  required); `Idempotency-Key`.
- **Precondition (server-enforced):** the revert window is open (workflow has not advanced past
  this approver's step). The button only appears when `availableActions[]` includes `revert`.
- **State:** step returns to PENDING for the same approver.

---

## W12. View approval inbox

- **Actor:** User with `approval:view`.
- **Route:** `/app/approvals`.
- **API:**
  - Badge count: `GET /api/v1/approvals/count` (APL-002) — poll every 60 s while tab is visible;
    also subscribe to websocket/SSE if available in future, but for Phase 1 poll.
  - List: `GET /api/v1/approvals` (APL-001) paginated, with sort/filter.
- **States shown:** Pending on the current user; optionally filterable to "acted on recently".
- **Empty state:** "No pending approvals. Great job 🎉."

---

## W13. View request timeline / activity

- **Actor:** User with request view permission.
- **Route:** detail view tab "Activity" on `/app/requests/{id}`.
- **API:** `GET /api/v1/expense-requests/{id}/activity` (REQ-005) → `TimelinePage<TimelineEntry>`;
  supports pagination for long-running requests.
- **Each entry:** actor, timestamp, action, description, previousState → newState, remarks.

---

## W14. Export request register

- **Actor:** User with `report:export`.
- **Route:** `/app/reports/exports` (or via export button on All Requests / Reports register).
- **API:**
  1. User selects reportKey, filters, format.
  2. POST `POST /api/v1/reporting/expense-requests/export` (RPT-002) body `ExportRequest`
     `{ reportKey, filter, format }` where `format ∈ {"CSV","EXCEL"}`.
  3. Response is streamed as file download (CSV or XLSX), **not** wrapped in ApiResponse. Use
     `response.blob()` and trigger download via `<a download>` + object URL.
  4. XLSX is generated server-side via streaming SXSSF (`ReportingService.streamExcel`) —
     support large exports (hundreds of thousands of rows) without buffering in memory.
- **Permissions:** `report:export`.
- ⚠️ PDF and print are NOT implemented (the backend has no PDF renderer); hide/gray those
  options with "Coming soon" tooltip — see H15 open decisions.
- ⚠️ For timeouts on large exports: show indeterminate progress with cancel; backend supports
  streaming so the download starts quickly.

---

## W15. View dashboard & widgets

- **Actor:** User with `report:view`.
- **Route:** `/app/dashboard` and `/app/reports/dashboard`.
- **API:** `GET /api/v1/reporting/dashboard` (RPT-001) returns `DashboardSummary` (metric cards,
  trend points); `GET /api/v1/reporting/widgets` returns configurable widget list for admin.
- **UX:** metric cards show YTD/MTD totals; click-through to filtered register.

---

## W16. Manage approval limits (admin)

- **Actor:** Admin with `approval-limit:manage`.
- **Route:** `/app/admin/approval-limits`.
- **APIs (LIM-*):** list / create / update approval limits by department, expense type, currency;
  list / create / update exceeding-limit rules; list / assign recommending authorities.
- **UX:** Tabular grid with inline edits; preview effective limit with test amounts (authority
  check endpoint `LIM-* authority-check`).

---

## W17. Document upload & association

- **Actor:** User with `document:upload`.
- **Route:** Document tab on request detail, plus standalone `/app/documents`.
- **APIs (DOC-*):** `POST /documents` (multipart upload) → `DocumentResponse` (with
  `scanStatus: PENDING/CLEAN/INFECTED`); poll `GET /documents/{id}` until scan resolves;
  `POST /documents/associate` to attach to a request.
- See H11 for full integration.

---

## Workflow/state machine summary for expense requests

```
 (none) ──create──► DRAFT ──submit──► SUBMITTED ──(workflow)──► APPROVED
                       │                 ▲                           │
                       │                 │ (reject→returned)         │ cancel (post-decision = reverse)
                       cancel            │                           ▼
                       ▼                 └────RETURNED◄──reject(return-to-requester)
                    CANCELLED                                  │
                                                               └──submit──► SUBMITTED (resubmission)
```

Transitions are enforced server-side. The frontend must never assume which status a transition
lands in — always refetch and display the server-returned status.
