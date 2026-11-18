# Frontend Handover — README

**Package:** EDAM React + TypeScript frontend blueprint (Phase 0, documentation only)
**Backend baseline:** commit `93a89eb28cf4a17feae15abf572c51c14e45f0e7` → remediation adds V28 migration (`docs/frontend-handover-remediation` branch)
**Generated/verified:** 2026-11-18
**Total `/api/v1` endpoints covered:** 206 (8 public, 3 authenticated-only, 195 permission-guarded)

This directory is the **authoritative handover** from the EDAM backend team to the frontend team.
It supersedes the earlier `docs/Frontend Integration/` draft (which contained multiple verified
inaccuracies) and consolidates corrections from the remediation pass. It is documentation only:
no source code, no `package.json`, no Vite scaffold, and no backend modifications beyond the
single Flyway migration V28 that fixes the seeded-role permission for D-09.

## How to read this package

Read in this order, then use the rest as reference.

| # | File | Purpose |
|---|------|---------|
| 01 | H01_FRONTEND_HANDOVER_BASELINE.md | Backend commit, conventions, environment variables, glossary |
| 02 | H02_API_CONTRACTS_AND_RESPONSE_ENVELOPE.md | `ApiResponse`, `PageResponse`, error envelope, HTTP→code map, OpenAPI codegen recipe, BigDecimal-as-number behaviour, raw CSV/XLSX stream |
| 03 | H03_AUTH_SECURITY_CSRF.md | Session cookie, CSRF (`XSRF-TOKEN` cookie / `X-XSRF-TOKEN` header), bootstrap header `X-Installation-Token`, bootstrap→explicit-login, CSRF cookie lifecycle |
| 04 | H04_PERMISSIONS_NAVIGATION_AND_ACCESS_CONTROL.md | All 60 permissions, data-scope model, role→nav mapping, UI gate rules, D-09 resolution |
| 05 | H05_END_TO_END_BUSINESS_WORKFLOWS.md | 17 sequenced workflows (W1–W17): user journey → route → API sequence → perm → state → errors |
| 06 | H06_VALIDATION_FORM_AND_ERROR_HANDLING.md | Client validation matrix, server validation parsing, optimistic-lock/idempotency, UX patterns |
| 07 | H07_FRONTEND_ARCHITECTURE.md | React 18 + TS + Vite + TanStack + shadcn/ui + Tailwind stack, folder layout, data/query/error/security layers |
| 08 | H08_DESIGN_SYSTEM_AND_UI_UX.md | Design tokens (driven by `themeTokens`), typography, components, responsive, motion, accessibility |
| 09 | H09_SCREEN_AND_ROUTE_INVENTORY.md | Every Phase 1 route/screen, layout slot, component contract, empty/loading/error/denied states |
| 10 | H10_API_TO_SCREEN_MAPPING.md | Cross-reference: Phase 1 screen → APIs it calls → required perms |
| 11 | H11_FILE_AND_DOCUMENT_INTEGRATION.md | Multipart upload, metadata, signed download, malware-scan polling, delete; NO inline preview in Phase 1; NO standalone document register |
| 12 | H12_REPORTING_AND_EXPORT_INTEGRATION.md | Dashboard, register (custom `RegisterResponse` paging, max 500), CSV + XLSX streaming (PDF/print out of scope), filter model |
| 13 | H13_TESTING_STRATEGY.md | Unit, integration (MSW), E2E (Playwright), contract/OpenAPI drift detection |
| 14 | H14_PHASED_ROADMAP.md | Phase 1 scope (core expense management), Phase 2–4 deferred admin, done gates |
| 15 | H15_OPEN_DECISIONS_AND_RISKS.md | Outstanding decisions (OD-1…), known risks (R-…); no silent assumptions |
| 16 | H16_TRACEABILITY_AND_VERIFICATION.md | Coverage matrix, D-01…D-27 status, source-file evidence, runtime vs static-inspection statement |
| 17 | H17_DEPLOYMENT_AND_LOCAL_SETUP.md | Maven/Gradle backend runbook, Vite proxy, prod build, CSP/CORS checklist |

Supporting appendix:

- `APPENDIX_A_ENDPOINT_INVENTORY.md` — the full 206-endpoint table used by every H-file.
- `docs/phase-4j/_generated/{controllers,dtos,entities,permissions,migrations}.json` — machine introspection that seeded this package (handler names re-verified against source during remediation).

## Correction log vs. prior handover

Key corrections applied in this remediation:

1. Bootstrap header = `X-Installation-Token` (source `AuthController.java`).
2. XLSX export IS implemented (`ExportFormat.EXCEL` + `ReportingService.streamExcel`). PDF/print are NOT.
3. Endpoint inventory regenerated from source: correct handler names (`approve/reject/revert/forward/update/submit/cancel/listForRequest`), correct paths (no `auth/auth/...` doubling), correct DOC endpoint order (`DELETE` is `DOC-004`, scans `DOC-006`), correct Audit base path `/audit-events`, correct timeline keyset pagination (`cursor`+`size`, not page/size/sort).
4. Document permissions are `document:upload` / `document:download` / `document:delete` (there is no `document:view`). There is no standalone documents register — the only list endpoint is `GET /documents/requests/{requestId}` (per-request).
5. Reporting register returns `RegisterResponse` (NOT `PageResponse`), default page size 50, cap 500; dashboard has GET query filters + `lookbackDays`; widgets/reports catalogues return `List<String>` and require `dashboard:manage` (Phase 2).
6. Monetary values travel as JSON **numbers** (`BigDecimal` with `@Digits(integer=15, fraction=4)`); do not treat them as strings on the wire — use `decimal.js-light` after parsing.
7. Approval actions ALL require `@NotBlank remarks` (ApproveRequest too); forward body is `{ recipientUserId, remarks }` (not `targetUserId`/`comment`).
8. Expense request list endpoint uses query params `search, status, departmentId, categoryId, mineOnly, page, size, sort` (no `branchId` filter at list level); cancel takes a body `{ reason }` (not path-only).
9. CreateRequest carries `requestTypeId, expenseCategoryId, expenseNatureId, departmentId, currencyId, ...` + `opex` XOR `capex`; STA is a list under `staDetails`, not a separate expense type toggle; `DocumentReferencePayload` references an uploaded `mediaAssetId`.
10. OPEX/CAPEX/STA fields aligned to `ExpenseRequestDtos.java` (warranty dates, budget summaries, three-quote flag, GRN required, etc.).
11. Public config (`PublicConfigurationResponse`) returns `applicationName, organizationDisplayName, organizationName, supportEmail, logoAssetId, faviconAssetId, defaultLocale, defaultTimeZone, dateFormat, defaultCurrencyCode, activeThemeName, activeThemeType, themeTokens` — NOT feature flags, password policy, or logo URL.
12. CSRF cookie behaviour corrected: GET requests do NOT by themselves set the cookie (Spring's deferred CSRF); the client MUST call `GET /auth/csrf` (which explicitly saves the cookie) before its first write.
13. `GET /api/v1/system/info` is authenticated (deny-by-default at the filter chain) despite carrying `@PublicEndpoint` annotation; runtime behaviour matches SecurityConfig `publicMatchers`.
14. Notifications unread-count returns `{"count": N}` (not a bare long); mark-all-read returns `{"marked": N}`; all endpoints require `notification:view`.
15. Audit lives at `/api/v1/audit-events` (keyset pagination, date window max 31 days); audit export is NOT implemented yet (no endpoint; permission `audit:export` reserved for future use — deferred).
16. Bootstrap returns HTTP 201 with `BootstrapResponse` (userId, username, displayName, roles, bootstrappedAt) but does NOT establish a session; the administrator must explicitly log in afterward (D-23).
17. PageQuery caps list endpoints at 200/page (separate from the reporting register's 500 cap).
18. Error codes expanded to include `INVALID_STATE_TRANSITION`, `BUSINESS_RULE_VIOLATION`, `EXTERNAL_SERVICE_FAILURE`, `INVALID_DOCUMENT`, `INVALID_CONFIGURATION` (previously missing from H02).
19. Route file naming corrected: TanStack Router file names (e.g. `app/requests/$id/index.tsx`, `app/approvals/tasks.$taskId.tsx`), not React Router colon-params.
20. Idempotency endpoints confirmed: the seven endpoints annotated `@IdempotentOperation` (create, update, submit, cancel, approve, reject, forward, revert — see H02 §6).
21. CORS requirement documented: same-origin deploy preferred; cross-origin requires `allowCredentials(true)` + `X-XSRF-TOKEN` / `X-Installation-Token` / `Idempotency-Key` allowed headers.
22. Backend uses Maven/Gradle (`./mvnw spring-boot:run`); corrected setup instructions.
23. D-09 resolved via Flyway V28: roles that hold `request:view-scope` or `request:view-all` are now also granted `request:view-own` at the controller gate, preserving service-level scope filtering (see H04 §5).
24. Phase 1 scope locked: core workspace (auth, dashboard, my/all requests, create/edit, submit/cancel, approval inbox + 4 actions, request timeline, documents per request, notifications, required lookups). Admin CRUD screens deferred. Audit viewer deferred (no standalone audit viewer required for Phase 1 core).
25. Document preview deferred: Phase 1 uses signed-URL download only (new tab); inline PDF/image preview added only after storage/CDN URL and CSP are verified in deployed environments (D-21).
26. H15 open decisions retained and NOT silently converted into assumptions (PDF/print timeline, idle timeout, polling vs websocket, file size cap, locale, etc.).
27. Verification in H16 is static source inspection; no runtime backend was executed against this pass (that is stated explicitly).

## What is NOT in this package (Phase 1 scope)

- Full admin CRUD (users, roles, organization, master data, expense config, approval limits, committees, delegation, workflows, rules, branding/themes/settings, SMTP/templates/events, integrations).
- Audit log viewer / audit export.
- PDF export / print view.
- WebSocket / SSE (60-second polling in Phase 1).
- Inline document preview (signed-URL download only).
- PWA / offline / SSO / dark mode / localization beyond en-GB / 2FA.
- Frontend source code or scaffolding.

---

*Source of truth: `src/main/java/com/edam/**`; D-09 migration: `src/main/resources/db/migration/V28__grant_view_own_to_wider_view_roles.sql`.*
