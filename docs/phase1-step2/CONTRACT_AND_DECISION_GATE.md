# Phase 1 / Step 2 — contract matrix and decision gate

## Verified baselines

- Frontend `main` / working-branch base: `bb5f1f3def04e6ad3bc0eb7af9b894eefce02afb` (PR #4 merged).
- Backend reference `main`: `2835eb55d6595a56d43cabb5eb83370b5ca2b2b2`. The backend clone was read-only.
- Pinned OpenAPI artifact: `openapi-spec/openapi-620f7a795cc67a16e905115131f561bbd986af85.json`, SHA-256 `9533c5a5a9ce3044b2543cabaa7db09952b26c9e8581e08baf9889c33df2843d`. Generated `src/api/generated/schema.d.ts` remains authoritative for request/response shapes.
- The 19 finalized `docs/Frontend Handover/` files were read and remain unchanged. Backend source was used only to verify controller security, DTOs, validation and lifecycle semantics; it was not modified.

## Endpoint / permission matrix

All paths are relative to `/api/v1`. `GET` operations return the standard `ApiResponse<T>` envelope. Permissions below are from backend controller annotations and `Permissions.java`; frontend permission checks are UX-only and the backend remains authoritative.

| Ref | Method / path | OpenAPI operation | Backend permission | Step 2 use |
| --- | --- | --- | --- | --- |
| REQ-001 | `GET /expense-requests` | `list_5` | `request:view-own` | My Requests (`mineOnly=true`) and All Requests (`mineOnly=false`); backend data scope remains authoritative. |
| REQ-002 | `POST /expense-requests` | `create_5` | `request:create` | Create draft; `@IdempotentOperation`. Body: generated `CreateRequest`. |
| REQ-003 | `GET /expense-requests/{id}` | `get_3` | `request:view-own` | Request Details; backend `ExpenseRequestService.isVisible()` is not reproduced in the frontend. |
| REQ-004 | `PUT /expense-requests/{id}` | `update_5` | `request:edit` | Edit allowed request; `@IdempotentOperation`. Body: generated `UpdateRequest`. |
| REQ-005 | `GET /expense-requests/{id}/activity` | `timeline` | `request:view-own` | Authorized activity ledger with keyset `size` / `cursor`, cap 200. |
| REQ-006 | `POST /expense-requests/{id}/cancel` | `cancel` | `request:cancel` | Cancel with `{ reason }`; `@IdempotentOperation`. |
| REQ-007 | `POST /expense-requests/{id}/submit` | `submit` | `request:submit` | Submit, no body; `@IdempotentOperation`. |
| RPT-001 | `GET /reporting/dashboard` | `dashboard` | `report:view` | Sole dashboard business-data source, with no client-side filters in this step. |

Canonical lookup endpoints actually used by the form:

| Path | OpenAPI response | Backend permission |
| --- | --- | --- |
| `GET /expense-configuration/request-types` | `LookupResponse[]` | `expense-configuration:view` |
| `GET /expense-configuration/categories?includeInactive=false` | `CategoryResponse[]` | `expense-configuration:view` |
| `GET /expense-configuration/natures` | `LookupResponse[]` | `expense-configuration:view` |
| `GET /organization/departments` | `DepartmentResponse[]` | `organization:view` |
| `GET /organization/branches` | `BranchResponse[]` | `organization:view` |
| `GET /master-data/currencies?includeInactive=false` | `CurrencyResponse[]` | `currency:view` |
| `GET /master-data/tax-authorities` | `TaxAuthorityResponse[]` | `currency:view` |

The remaining spec-verified lookup constants (`/workflows`, `/master-data/vendors`, `/organization/units/tree`) are not called by Step 2. Their backend permissions are respectively `workflow:view`, `vendor:view` (paged response) and `organization:view`. H10's `/configuration/*`, `/workflows/active` and `/organization/departments/tree` paths do not exist in the pinned snapshot and are not used. H10's blanket `currency:view` for vendors is also incorrect; the controller requires `vendor:view`.

## DTO and lifecycle facts

- `CreateRequest` required fields: `requestTypeId`, `expenseCategoryId`, `expenseNatureId`, `departmentId`, `currencyId`, `requestedAmount`. `UpdateRequest` omits `departmentId` and `documents`.
- Optional DTO sections are sent only when the user supplies them. Exactly one of `opex` / `capex` may be supplied; classification itself is resolved by the backend from configuration, never by the frontend.
- `RequestResponse` supplies server action flags `canEdit`, `canSubmit`, `canCancel`; these flags plus the signed-in permission codes control action visibility. No client-side status-name heuristic or optimistic status transition is used.
- Status values are the generated OpenAPI enum: `DRAFT`, `SUBMITTED`, `IN_PROGRESS`, `RETURNED`, `APPROVED`, `REJECTED`, `CANCELLED`, `REVERSED`.
- `DashboardSummary` contains `baseCurrencyCode`, `metrics`, `byStatus`, `byDepartment`, `byCategory`, `byExpenseType` and `trend`. Every displayed value comes from that response; no aggregate is recomputed, and monetary totals are not FX-reconverted.
- Request-list query parameters used: `search`, `status`, `departmentId`, `categoryId`, `mineOnly`, `page`, `size`. The generated `list_5` query also declares `sort`.
- Idempotency codes are handled centrally: `EDAM-1005` reuses the same key after a 2 s backoff, at most 3 retries, without an error toast; `EDAM-1004` prompts for a new key; `EDAM-1006` asks for reconciliation. `EDAM-3002` / `EDAM-3003` request reload. `Idempotency-Key` is sent only on the four request write routes used by Step 2; never on `/auth/login`.

## Contract gaps and isolated implementation stops

1. **H04 / H09 dashboard route-navigation conflict — product-owner decision required.** H04 says the Dashboard navigation item is always visible to authenticated users with widgets only if `report:view`; H09 says `/app/dashboard` requires `report:view`. Backend `GET /reporting/dashboard` requires `report:view`, which resolves the data endpoint only, not the frontend route/nav policy. The existing `getNavigationRequirement()` exception and `RequirePermission` / `getRouteRequirement()` `report:view` guard are preserved. No assumed route-access rule is implemented and the guard is not weakened. Dashboard widgets are implemented only behind `report:view`.
2. **Sort parameter is documented but backend ignores it.** H02 documents `sort=property,(asc|desc)`; the backend controller accepts `sort`, but `ExpenseRequestService` passes a fixed `Sort.by(DESC, "createdAt")` to `PageQuery.toPageable`. A client sort control would be nonfunctional. This step displays the server order as a static note and does not send `sort`; no sorting rule is invented.
3. **Concurrency precondition is not client-supplied.** H05 mentions version mismatch, but generated `UpdateRequest` has no `version` field and backend source uses JPA `@Version` on the loaded entity. The frontend cannot send `If-Match` or a version. Concurrency responses are handled by a server-data reload; no client lock rule is invented.
4. **Pinned response DTOs are lossy for safe replacement.** `CapexDetailPayload` includes `purchaseNature`, `financeComment`, `budgetComment`, `termsAndConditions`; the pinned `CapexDetailResponse` omits them. `OpexDetailResponse` omits document-dependent payload flags. Quotation/invoice response rows also carry vendor/media references that the deferred document workflow cannot round-trip, and backend `RequestAssembler.applyUpdate()` replaces detail and child rows. A replacement would silently clear fields the frontend cannot see. Implementation therefore **limits `PUT` replacement to header-only records** (`hasUnpreservableDetail()`), and any record with typed details, child rows or document references stops with an explicit contract-decision state and sends no `PUT`. Create can still submit documented payload fields; no hidden value is reconstructed for edit. Product-owner/backend decision is required before exposing full replacement for richer records.
5. **Document-reference workflows are out of scope.** `DocumentReferencePayload` requires `mediaAssetId`; upload/download workflows are explicitly deferred. OPEX flags that require document attachments (`alreadyApproved`, `taxExempt`, `grnRequired`) are not exposed as form controls, because setting them without a supported reference would produce a known server validation failure. The backend remains authoritative for all conditional rules in `RequestValidator`.
6. **All Requests uses one documented endpoint, not a separate permission catalogue rule.** `GET /expense-requests` is secured with `request:view-own`; `mineOnly=false` returns the backend-scoped union. `ExpenseRequestService.isVisible()` is not reproduced. If a session reaches the All Requests route through `request:view-scope` / `request:view-all` but lacks `request:view-own`, the backend's 403 is shown rather than masked.
7. **OpenAPI response fields are optional and non-nullable in generated TypeScript.** Presentation code explicitly handles absent/null values and never assumes a business value. No `nullable` metadata exists in the pinned spec.
8. **Live integration is not available in this environment.** Contract tests use the pinned artifact, behavior tests use MSW, and browser/visual checks use intercepted backend-shaped envelopes. None is a live Spring Boot/PostgreSQL integration test.

## Implementation safety gate

After reading backend `RequestAssembler.applyUpdate()`, the Step 2 edit screen was deliberately narrowed to header-only records. This is not a generic edit failure: it is the isolated stop for the lossy `UpdateRequest` round-trip documented above. Create, list, detail, activity, submit, cancel and dashboard work are independent of that gap and remain implemented. The UI states the reason and links back to detail; it does not fabricate a replacement payload. The browser harness uses a separate header-only draft to capture the edit form, while a richer draft is used to capture the detail view.

## Deferred / not implemented

Approval decisions (approve/reject/revert/forward), workflow configuration, administration, user/role management, SMTP/email-template administration, audit viewer/export, document upload/download, PDF/print, reporting register/export, widget/report catalogue, dark mode, PWA/SSO/2FA, and any live-backend/production verification remain outside this step.
