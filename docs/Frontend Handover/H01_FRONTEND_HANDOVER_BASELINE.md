# H01 — Frontend Handover Baseline

## 1. Baseline commit

| Item | Value |
|------|-------|
| Repository | `Jhamankhatri/edam` (backend) |
| Starting branch | `main` at `0253e18` (post PR #23 merge) |
| Remediation branch | `docs/frontend-handover-remediation` |
| Flyway migration added | `V28__grant_view_own_to_wider_view_roles.sql` (D-09 fix) |
| API base URL | `/api/v1` (Vite dev-proxied to backend) |
| SpringDoc | `/v3/api-docs` (OpenAPI 3.1 JSON) |
| Swagger UI | `/swagger-ui.html` (internal/VPN only) |
| Backend build | Maven (`mvn spring-boot:run`; wrapper `./mvnw` if present) |
| Frontend repo | `Jhamankhatri/edam-frontend` (not modified by this remediation) |

## 2. Conventions

- Endpoint IDs (e.g. `REQ-004`, `APL-005`) come from Appendix A and are referenced verbatim
  by H05, H10, and H16. They are stable for the lifetime of Phase 1.
- Permission codes are kebab-case strings from
  `src/main/java/com/edam/common/security/Permissions.java` (60 codes).
- All `/api/v1` endpoints except RPT-002 export return `ApiResponse<T>` JSON (H02 §1).
- IDs are UUID strings; monetary values are JSON numbers (Jackson default for BigDecimal,
  bounded by `@Digits(integer=15, fraction=4)`); timestamps are ISO-8601 instants.
- Module prefixes used by endpoint IDs:

| Prefix | Module | Endpoint count |
|--------|--------|----------------|
| AUTH | Authentication | 9 |
| BRD | Public / bootstrap data | 1 (`/public/configuration`) |
| SYS | System (authenticated) | 1 (`/system/info`) |
| REQ | Expense requests | 7 |
| APL | Approvals | 8 |
| DOC | Documents | 6 |
| RPT | Reporting | 5 |
| NTF | Notifications | 4 |
| AUD | Audit events | 2 (deferred in Phase 1) |
| USR/ROL/ORG/MST/CFG/ADM/WFL/DCM/EXP/BDG/NTS/... | Lookup/admin modules | remaining endpoints (admin CRUD deferred to Phase 2+) |

## 3. Environment variables (frontend)

| Variable | Purpose | Default |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Base URL for API calls (no trailing slash) | `/api/v1` |
| `VITE_APP_NAME` | Optional app-name override (falls back to server `applicationName`) | `` |
| `VITE_DEFAULT_LOCALE` | Fallback locale | `en-GB` |
| `VITE_IDLE_TIMEOUT_MINUTES` | Session idle warning + auto-logout | `25` (must align with server session TTL — see OD-2) |
| `VITE_SENTRY_DSN` | Optional error reporting | `` |

Server runtime branding comes from `GET /api/v1/public/configuration` (BRD-005):
`applicationName, organizationDisplayName, organizationName, supportEmail, logoAssetId,
faviconAssetId, defaultLocale, defaultTimeZone, dateFormat, defaultCurrencyCode,
activeThemeName, activeThemeType, themeTokens`. The frontend maps `themeTokens` to CSS
custom properties on boot. `logoAssetId`/`faviconAssetId` are opaque asset IDs — do NOT
assume a direct URL field (D-27); they require a resolution helper when an asset-endpoint
exists (deferred).

## 4. HTTP & REST conventions (summary)

- All API responses are JSON (UTF-8) wrapped in `ApiResponse<T>` **except** RPT-002 which
  streams raw CSV/XLSX bytes (H02 §7, H12).
- CSRF required on every POST/PUT/PATCH/DELETE via `X-XSRF-TOKEN` header (H03 §3).
- `Idempotency-Key` header required on endpoints annotated `@IdempotentOperation` (H02 §6).
- Pagination: `PageResponse<T>` for most lists (page 0-based, size default 20, capped 200);
  `RegisterResponse` for RPT-003 (capped 500, default sort `submittedAt,desc`); keyset
  (`cursor`+`size`, cap 200) for REQ-005 timeline.
- Use `error.code` (stable `EDAM-nnnn` strings) for conditional logic; never match on the
  human-readable `error.message`.
- Public surface in SecurityConfig: `/auth/login|logout|csrf|installation|bootstrap|
  forgot-password|reset-password`, `/public/configuration`, `/error`, `/v3/api-docs*`,
  `/swagger-ui*`, `/actuator/health*`, `/actuator/info`. Authenticated-only (no permission):
  `GET /auth/me`, `POST /auth/change-password`.
- `GET /system/info` carries `@PublicEndpoint` annotation but is NOT in the public matchers
  list — it is authenticated at runtime (401 for anonymous); documented in H03 §5.

## 5. Glossary

| Term | Meaning |
|------|---------|
| Institution | Single-tenant EDAM deployment. |
| Data scope | A `(type, referenceId, referenceName)` pair from `DataScopeView`; type is `DEPARTMENT` or `BRANCH`. |
| Task | A pending workflow user-task (one approval step). |
| Case file | `ApprovalCaseFile` aggregate for one task; includes `availableActions[]`. |
| OPEX / CAPEX | Expense types selected implicitly via `requestTypeId` + category `expense_type`; payload carries exactly one of `opex`/`capex`. |
| STA (Straight-Through Allowance) | Sub-list of tax-related items inside CAPEX (`staDetails[]`); not a top-level expense type. |
| Bootstrap | One-time admin creation via `/auth/bootstrap` with `X-Installation-Token`. Does NOT establish a session (D-23). |
| Principal | Server-side logged-in user, mirrored as `CurrentUserResponse`. |

## 6. Source evidence

- Controller inventory: `src/main/java/com/edam/**/*Controller.java` (27 controllers; 206 endpoints at `/api/v1`).
- Security config (public matchers, CSRF, CORS): `src/main/java/com/edam/config/SecurityConfig.java`.
- Permission catalogue: `src/main/java/com/edam/common/security/Permissions.java`.
- Pagination & envelope: `src/main/java/com/edam/common/api/{ApiResponse,PageResponse,PageQuery,ErrorCode}.java`.
- Error mapping: `src/main/java/com/edam/common/exception/GlobalExceptionHandler.java`.
- Service-layer visibility: `src/main/java/com/edam/expenserequest/service/ExpenseRequestService.java` `isVisible()`.
- Seeded roles/permissions (canonical): `src/main/resources/db/migration/V12__access_management.sql` (V3/V4 provisional tables dropped by V13).
- D-09 fix: `src/main/resources/db/migration/V28__grant_view_own_to_wider_view_roles.sql`.
