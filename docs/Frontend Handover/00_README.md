# Frontend Handover — README

**Package:** EDAM frontend handover (documentation only — React + TypeScript target)
**Document set:** 19 files under `docs/Frontend Handover/`
**Total `/api/v1` endpoints documented (Appendix A):** 206 (8 public, 3 authenticated-only, 195 permission-guarded)
**Current backend baseline:** `main` at `38cedbc` (merge of PR #24)
**Frontend implementation status:** Not started; this package is the contract the frontend will implement against.

## Purpose

This directory is the **authoritative handover** from the EDAM backend team to the frontend
team. It supersedes the earlier `docs/Frontend Integration/` draft, which contained
multiple inaccuracies that are now corrected. It is documentation only — no source code,
no `package.json`, no Vite scaffold, and no backend logic beyond what is already merged
into `main`.

## History

| Milestone | PR | Commit | What it delivered |
|-----------|----|--------|-------------------|
| Initial 19-file handover package | [#23](https://github.com/Jhamankhatri/edam/pull/23) | `0253e18` | First cut of all 19 documents; superseded `docs/Frontend Integration/`. |
| Remediation: D-01…D-27 corrections, D-09 seed fix, idempotency transaction fix | [#24](https://github.com/Jhamankhatri/edam/pull/24) | `92c7d5a` (→ merge `38cedbc`) | Corrected every document against source; added Flyway V28 granting `request:view-own` to widened-view roles; added `SeededRolePermissionsD09Test`; fixed a pre-existing PostgreSQL/`REQUIRES_NEW` idempotency bug that was failing CI. |
| Final consistency audit | [#25](https://github.com/Jhamankhatri/edam/pull/25) | `0b952a5` (this PR) | README cleanup; stale SHAs/build-tool references/idempotency counts corrected; no code or contract changes. |

## How to read this package

Read in this order, then use the rest as reference.

| # | File | Purpose |
|---|------|---------|
| 01 | H01_FRONTEND_HANDOVER_BASELINE.md | Baseline commit, conventions, environment variables, glossary |
| 02 | H02_API_CONTRACTS_AND_RESPONSE_ENVELOPE.md | `ApiResponse`, `PageResponse`, error envelope, HTTP→code map, OpenAPI codegen recipe, BigDecimal-as-number, raw CSV/XLSX stream, idempotency contract |
| 03 | H03_AUTH_SECURITY_CSRF.md | Session cookie, CSRF (`XSRF-TOKEN` / `X-XSRF-TOKEN`), bootstrap header `X-Installation-Token`, bootstrap→explicit-login, CSRF cookie lifecycle |
| 04 | H04_PERMISSIONS_NAVIGATION_AND_ACCESS_CONTROL.md | All 60 permissions, data-scope model, role→nav mapping, UI gate rules, D-09 resolution (V28) |
| 05 | H05_END_TO_END_BUSINESS_WORKFLOWS.md | 17 sequenced workflows (W1–W17): user journey → route → API sequence → perm → state → errors |
| 06 | H06_VALIDATION_FORM_AND_ERROR_HANDLING.md | Client validation matrix, server validation parsing, optimistic-lock/idempotency replay, UX patterns |
| 07 | H07_FRONTEND_ARCHITECTURE.md | React 18 + TS + Vite + TanStack + shadcn/ui + Tailwind stack, folder layout, data/query/error/security layers |
| 08 | H08_DESIGN_SYSTEM_AND_UI_UX.md | Design tokens (driven by `themeTokens`), typography, components, responsive, motion, accessibility |
| 09 | H09_SCREEN_AND_ROUTE_INVENTORY.md | Every Phase 1 route/screen, layout slot, component contract, empty/loading/error/denied states |
| 10 | H10_API_TO_SCREEN_MAPPING.md | Cross-reference: Phase 1 screen → APIs it calls → required perms |
| 11 | H11_FILE_AND_DOCUMENT_INTEGRATION.md | Multipart upload, metadata, signed download, malware-scan polling, delete; NO inline preview in Phase 1; NO standalone document register |
| 12 | H12_REPORTING_AND_EXPORT_INTEGRATION.md | Dashboard, register (custom `RegisterResponse` paging, max 500), CSV + XLSX streaming (PDF/print out of scope), filter model |
| 13 | H13_TESTING_STRATEGY.md | Unit, integration (MSW), E2E (Playwright), contract/OpenAPI drift detection |
| 14 | H14_PHASED_ROADMAP.md | Phase 1 scope (core expense management), Phase 2–4 deferred admin, done gates |
| 15 | H15_OPEN_DECISIONS_AND_RISKS.md | Outstanding decisions (OD-1…), known risks (R-…); no silent assumptions |
| 16 | H16_TRACEABILITY_AND_VERIFICATION.md | Coverage matrix, D-01…D-28 status, source-file evidence, CI verification |
| 17 | H17_DEPLOYMENT_AND_LOCAL_SETUP.md | Backend runbook (Maven), Vite proxy, prod build, CSP/CORS checklist |

Supporting appendix:

- `APPENDIX_A_ENDPOINT_INVENTORY.md` — full 206-endpoint table used by every H-file.
- `docs/phase-4j/_generated/{{controllers,dtos,entities,permissions,migrations}}.json` — machine introspection that seeded this package (handler names re-verified against source at PR #24).

## Canonical contract (as of `38cedbc`)

These statements are the source of truth; any H-file that contradicts them is wrong and the
statements below win.

1. **Backend build.** Maven only. The Maven Wrapper (`./mvnw`) is NOT checked in; use a system-installed `mvn` (Maven 3.9+). `mvn spring-boot:run` starts the server on `0.0.0.0:8080`. There is no Gradle build.
2. **Auth surface (public).** Per `SecurityConfig.publicMatchers`:
   `POST /auth/login|logout|forgot-password|reset-password|bootstrap`,
   `GET /auth/csrf|installation`,
   `GET /public/configuration`,
   plus `/error`, `/v3/api-docs*`, `/swagger-ui*`, `/actuator/health*`, `/actuator/info`.
3. **Auth surface (authenticated, no permission).** `GET /auth/me`, `POST /auth/change-password`.
4. **`@PublicEndpoint` is declarative, not a runtime bypass.** `GET /system/info` is annotated `@PublicEndpoint` but is authenticated at runtime (401 to anonymous callers) because it is not in `publicMatchers`.
5. **Bootstrap.** `POST /auth/bootstrap` with `X-Installation-Token` returns HTTP 201 with `BootstrapResponse` and does NOT establish a session; the administrator must then explicitly log in (D-23).
6. **CSRF.** Spring 6 uses deferred CSRF; GET requests do NOT materialise the `XSRF-TOKEN` cookie. The client MUST call `GET /auth/csrf` before its first write. Writes send the cookie value back as `X-XSRF-TOKEN`.
7. **D-09 (V28).** Roles seeded with `request:view-scope` or `request:view-all` now also hold `request:view-own` (DEPARTMENT_HEAD, RECOMMENDING_AUTHORITY, EXPENSE_COMMITTEE_MEMBER, CEO, CFO, HEAD_OF_ADMIN_GSD, REPORT_ADMINISTRATOR). Service-layer `ExpenseRequestService.isVisible()` continues to enforce requester/department/branch/installation scope — no data-access widening. `SeededRolePermissionsD09Test` locks this against regression.
8. **Permissions.** Document endpoints use `document:upload` / `document:download` / `document:delete` (there is NO `document:view`). Notifications all use `notification:view`. Approval actions require `approval:act`.
9. **Idempotency (8 endpoints).** The following endpoints are annotated `@IdempotentOperation` and require an `Idempotency-Key: <uuidv4>` header:
   - REQ-002 `POST /expense-requests` (create)
   - REQ-004 `PUT /expense-requests/{id}` (update)
   - REQ-006 `POST /expense-requests/{id}/cancel`
   - REQ-007 `POST /expense-requests/{id}/submit`
   - APL-004 `POST /approvals/tasks/{taskId}/approve`
   - APL-005 `POST /approvals/tasks/{taskId}/forward`
   - APL-006 `POST /approvals/tasks/{taskId}/reject`
   - APL-008 `POST /approvals/tasks/{taskId}/revert`
   
   Concurrent same-key submissions collapse to exactly one execution. Losers receive the
   original response (replay) or HTTP 409 `EDAM-1005 IDEMPOTENCY_IN_PROGRESS` while the
   winner is running (retry same key after backoff — NOT an error toast). Same key +
   different body returns HTTP 409 `EDAM-1004 IDEMPOTENCY_CONFLICT` (user must generate a
   new key). Aged-out unknown outcomes return HTTP 409 `EDAM-1006 IDEMPOTENCY_UNKNOWN_OUTCOME`
   (out-of-band reconciliation). `POST /auth/login` does NOT require an idempotency key.
   Nested `REQUIRES_NEW` transactions let duplicate-key errors roll back cleanly without
   surfacing `UnexpectedRollbackException` (fixed in commit `92c7d5a`).
10. **Pagination.** Most lists use `PageResponse<T>` (page 0-based, default size 20, cap 200). The expense-request register (RPT-003) uses `RegisterResponse` (default size 50, cap 500, default sort `submittedAt,desc`). Request timeline (REQ-005) uses keyset pagination (`cursor` + `size`, cap 200).
11. **Money.** Monetary values are JSON **numbers** (Jackson default for BigDecimal; `@Digits(integer=15, fraction=4)`). Parse/render with `decimal.js-light`; never use raw JS `number` arithmetic.
12. **Approval actions.** Every action requires `@NotBlank remarks`; forward uses `{ recipientUserId, remarks }` (not `targetUserId`/`comment`). Cancel body is `{ reason }`. Case-file `availableActions[]` is authoritative for which buttons render.
13. **Request list.** Query params: `search, status, departmentId, categoryId, mineOnly, page, size, sort`. There is no top-level `branchId` filter at list level.
14. **Public config** (`GET /public/configuration`) returns: `applicationName, organizationDisplayName, organizationName, supportEmail, logoAssetId, faviconAssetId, defaultLocale, defaultTimeZone, dateFormat, defaultCurrencyCode, activeThemeName, activeThemeType, themeTokens`. It does NOT return feature flags, password policy, or a logo URL (asset IDs only — D-27). Branding/feature flags/password policy are available only after authentication.
15. **Documents.** Managed per request (DOC-002 `GET /documents/requests/{requestId}`). No standalone document register. Upload via multipart; signed-download URL returns `{url, expiresInSeconds:300}`. Malware-scan polling from `PENDING` until `CLEAN`/`INFECTED`. Inline PDF/image preview is deferred (D-21).
16. **Reporting.** Dashboard (RPT-001) uses GET filter params + `lookbackDays`. Register (RPT-003) mirrors filters with paging. CSV + XLSX (SXSSF streaming) via RPT-002; response is raw bytes (not wrapped in `ApiResponse`). PDF/print NOT implemented. Audit export NOT implemented (no endpoint; `audit:export` reserved). Widget/report catalogues (RPT-004/005) require `dashboard:manage` and return `List<String>` — deferred to Phase 2.
17. **Notifications.** Four endpoints (list, unread-count `{count:N}`, mark-one-read, mark-all-read `{marked:N}`), all requiring `notification:view`.
18. **Audit.** `/audit-events` (AUD-001/002) uses keyset pagination with a 31-day date window. No audit viewer UI in Phase 1.
19. **Routes.** TanStack Router file naming (`app/requests/$id/index.tsx`, `app/approvals/tasks.$taskId.tsx`).
20. **Error codes.** In addition to standard 4xx/5xx: `INVALID_STATE_TRANSITION`, `BUSINESS_RULE_VIOLATION`, `EXTERNAL_SERVICE_FAILURE`, `INVALID_DOCUMENT`, `INVALID_CONFIGURATION`, `CONCURRENT_MODIFICATION`, `DUPLICATE_RESOURCE`, plus the three idempotency codes above. Use `error.code` (`EDAM-nnnn`), not `error.message`, for conditional logic.
21. **CORS.** Same-origin preferred. Cross-origin requires `allowCredentials(true)` and the allowed headers `Content-Type`, `X-XSRF-TOKEN`, `X-Installation-Token`, `Idempotency-Key`.
22. **Open decisions** in H15 (PDF/print timeline, idle timeout, polling vs WebSocket, file size caps, locale) are NOT silently converted into assumptions; they must be resolved by product during implementation.

## Phase 1 in scope (D-19)

Auth (login/logout/CSRF/bootstrap/forgot/reset/change-password/me), dashboard, My Requests, All Requests (register + filtering), create/edit/submit/cancel request, approval inbox + approve/reject/forward/revert, request detail (summary + items/quotations/invoices + timeline + documents), per-request document upload/list/delete/signed-download, notifications inbox, required lookup selectors, CSV/XLSX register export.

## Explicitly deferred (NOT in Phase 1)

Full admin CRUD (users, roles, organization, master data maintenance, expense config, approval limits, committees, delegation, workflows, business rules, branding/themes/settings, SMTP/templates/events, integrations); audit viewer / audit export; PDF export / print view; WebSocket/SSE (60-second polling in Phase 1); inline document preview; PWA / offline / SSO / dark mode / localization beyond en-GB / 2FA; frontend source code or scaffolding.

## Source of truth

- Controllers: `src/main/java/com/edam/**/*Controller.java`
- Security: `src/main/java/com/edam/config/SecurityConfig.java`
- Permissions: `src/main/java/com/edam/common/security/Permissions.java`
- Envelope / errors / pagination: `src/main/java/com/edam/common/api/*`, `src/main/java/com/edam/common/exception/GlobalExceptionHandler.java`
- Idempotency: `src/main/java/com/edam/common/api/{IdempotencyOperation,IdempotencyService,IdempotencyAspect,IdempotencyRecord,IdempotencyRecordRepository}.java`, `src/main/java/com/edam/integrations/service/IntegrationService.java`
- Request visibility: `src/main/java/com/edam/expenserequest/service/ExpenseRequestService.java#isVisible`
- Seeded roles/permissions: `src/main/resources/db/migration/V12__access_management.sql` (V3/V4 provisional tables dropped by V13)
- Idempotency partial unique index (null-keyed executions do not collapse): `src/main/resources/db/migration/V27__phase4i_idempotency_unique_fix.sql`
- D-09 migration: `src/main/resources/db/migration/V28__grant_view_own_to_wider_view_roles.sql`
- D-09 regression test: `src/test/java/com/edam/rolemanagement/SeededRolePermissionsD09Test.java`

## Verification evidence (PR #24 CI, run 44322838892)

- `build-and-test`: 37 classes, 433 tests, 0 failures, 0 errors, 3 pre-existing skips — success
- `prod-profile-smoke-test`: success
- `war-package-smoke-test`: success
