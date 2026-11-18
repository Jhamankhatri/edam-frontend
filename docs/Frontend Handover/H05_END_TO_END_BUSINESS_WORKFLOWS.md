# H05 — End-to-End Business Workflows (W1–W17)

17 workflows. Each documents: journey → route → API sequence → permissions → state → errors.
Endpoint IDs reference Appendix A.

## W1. Bootstrap (first-run admin)
- **Actor:** Installation operator (anonymous).
- **Route:** `/bootstrap` (shown when `GET /auth/installation` returns `bootstrapped:false`).
- **Sequence:** GET `/auth/csrf` → POST `/auth/bootstrap` with `X-Installation-Token` header and
  `BootstrapRequest`. On 201 show success message → redirect `/login`. The admin logs in explicitly.
- **Errors:** `INSTALLATION_ALREADY_COMPLETED` (422), `WEAK_PASSWORD` (422), bad token → 401.

## W2. Login / logout
- **Route:** `/login`; logout from user menu.
- **Sequence (login):** GET `/public/configuration` (branding) → GET `/auth/csrf` → POST
  `/auth/login`. On success store `CurrentUserResponse`, re-read CSRF cookie,
  route to `returnTo` or `/app/dashboard`. If `mustChangePassword` redirect to `/change-password`.
- **Sequence (logout):** POST `/auth/logout` → invalidate client caches → `/login`.
- **Errors:** `INVALID_CREDENTIALS` (generic, no user enumeration), `ACCOUNT_LOCKED`,
  `INSTALLATION_NOT_BOOTSTRAPPED` (redirect to `/bootstrap`).

## W3. Forgot / reset password
- **Routes:** `/forgot-password`, `/reset-password?token=`.
- **Sequence:** POST `/auth/forgot-password` → constant message; POST `/auth/reset-password` →
  success → `/login`.
- **Errors:** `INVALID_RESET_TOKEN` (401), `WEAK_PASSWORD` (422).

## W4. Create request (draft)
- **Perm:** `request:create`.
- **Route:** `/app/requests/new`.
- **Sequence:** Load lookups (CFG categories/natures/request-types, MST currencies/vendors/tax
  authorities, ORG departments/branches) → POST `/expense-requests` (REQ-002, Idempotency-Key,
  `CreateRequest` body) → 201 with `RequestResponse` → navigate `/app/requests/{id}`.
- **State:** (none) → DRAFT.
- **Validation:** Bean validation + cross-field `RequestValidator`; 400 with fieldErrors.

## W5. Edit request
- **Perm:** `request:edit`.
- **Route:** `/app/requests/{id}/edit`.
- **Sequence:** GET `/expense-requests/{id}` (REQ-003) → PUT `/expense-requests/{id}` (REQ-004)
  with `UpdateRequest` (Idempotency-Key) → return to detail.
- **State:** DRAFT→DRAFT or RETURNED→RETURNED.
- **Errors:** 409 `CONCURRENT_MODIFICATION` (version mismatch), 422 `INVALID_STATE_TRANSITION`
  if not editable.

## W6. Submit for approval (and resubmission)
- **Perm:** `request:submit`.
- **Route:** request detail → Submit.
- **Sequence:** Confirm → POST `/expense-requests/{id}/submit` (REQ-007, Idempotency-Key, no body).
  RETURNED→SUBMITTED resubmission uses the SAME endpoint.
- **State:** DRAFT→SUBMITTED; RETURNED→SUBMITTED.

## W7. Cancel/withdraw
- **Perm:** `request:cancel`.
- **Sequence:** POST `/expense-requests/{id}/cancel` with body `{ reason }` (REQ-006, Idempotency-Key).
- **State:** DRAFT|SUBMITTED → CANCELLED. Only before a decision (requester only). Approved
  requests must use reverse (out of Phase 1 scope).

## W8. Approve a task
- **Perm:** `approval:view` (load) + `approval:act` (act).
- **Route:** `/app/approvals/tasks/{taskId}`.
- **Sequence:** GET case-file (APL-003) → POST `/tasks/{taskId}/approve` (APL-004) with
  `{ remarks }` (Idempotency-Key). Refetch inbox/case-file on success.
- **Remarks are required** (`@NotBlank`, max 2000).

## W9. Reject
- POST `/tasks/{taskId}/reject` (APL-006) with `{ remarks }`. Remarks required.

## W10. Forward
- POST `/tasks/{taskId}/forward` (APL-005) with `{ recipientUserId, remarks }` (both required).

## W11. Revert (return for correction)
- POST `/tasks/{taskId}/revert` (APL-008) with `{ remarks }`. Destination is defined by the
  workflow revision; client must not assume a target state.

## W12. Approval inbox
- **Route:** `/app/approvals`.
- **APIs:** APL-001 `GET /approvals` (paginated via PageQuery, sort fixed `assignedAt,desc`),
  APL-002 badge count (poll 60 s).

## W13. Request activity timeline
- **Route:** detail tab.
- **API:** REQ-005 `GET /expense-requests/{id}/activity?size=&cursor=` (keyset pagination).
- States PENDING/CLEAN not applicable — timeline uses chronological entries.

## W14. Export register
- **Perm:** `report:export`.
- **Sequence:** POST `/reporting/expense-requests/export` (RPT-002) with `ExportRequest` → raw
  CSV/XLSX blob → trigger browser download (appendix H12). XLSX SXSSF streaming; CSV with UTF-8
  BOM; server returns 400 if matched rows exceed `EXPORT_ROW_LIMIT`.
- PDF/print buttons disabled with "Coming soon" (OD-1).

## W15. Dashboard
- **Perm:** `report:view`.
- **API:** RPT-001 with filter query params + `lookbackDays`; renders `MetricCard`s,
  `DistributionRow`s, `TrendPoint`s. Base currency from `baseCurrencyCode`.

## W16. Document upload (on request detail)
- **Perm:** `document:upload`.
- **Route:** Documents tab inside `/app/requests/{id}` (multipart upload: `file`,
  `expenseRequestId`, `category`, `description?` → DOC-001). After upload poll DOC-003 until
  `scanStatus ∈ {CLEAN, INFECTED}` (2 s interval, 30 s cap).
- No standalone document register.

## W17. Notifications
- **Perm:** `notification:view`.
- **APIs:** NTF-001 list, NTF-003 unread-count, NTF-004 mark one read, NTF-002 mark-all-read.
  Mark-all returns `{ marked: number }`; unread-count returns `{ count: number }`.

## State machine (request)
```
(none) ─create─► DRAFT ─submit─► SUBMITTED ──(workflow)──► APPROVED
                    ▲                 │
                    │(return)         │ cancel (pre-decision)
                    │                 ▼
                 RETURNED          CANCELLED
                    │
                    └──submit──► SUBMITTED (resubmission)
```
The workflow decides what Reject does (RETURNED vs terminal REJECTED) per its revision. Always
read the status from the refetched request.
