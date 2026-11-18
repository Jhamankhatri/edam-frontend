# H01 — Frontend Handover Baseline

## 1. Backend commit this handover is locked to

| Item | Value |
|------|-------|
| Repository | `Jhamankhatri/edam` (backend) |
| Branch | `main` |
| Commit | `93a89eb28cf4a17feae15abf572c51c14e45f0e7` |
| State | PR #22 merged; working tree clean |
| API base URL | `/api/v1` (proxied from Vite dev server to backend in development) |
| SpringDoc | `/v3/api-docs` (OpenAPI 3.1 JSON, used by frontend codegen) |
| Swagger UI | `/swagger-ui.html` (reference for humans, not for codegen) |

This is the **single source of truth**. If the backend moves past this commit, re-run the
introspection in `docs/phase-4j/_generated/` and regenerate this package before frontend work
lands on a new contract.

## 2. Conventions used across this package

- **Endpoint IDs** (e.g. `REQ-004`, `APL-005`, `RPT-002`) come from Appendix A (the full endpoint inventory)
  and are referenced verbatim by H05 (workflows), H10 (screen mapping), H16 (traceability).
- **Permission codes** are kebab-case strings (e.g. `request:submit`, `approval:act`) that match
  `com.edam.common.security.Permissions.java` constants. They are opaque strings to the frontend
  except for gate checks.
- **Module ID prefixes** (used to disambiguate IDs):

| Prefix | Module |
|--------|--------|
| `APL-` | Approval inbox & actions (8 endpoints) |
| `AUD-` | Audit (2 endpoints) |
| `AUTH-` | Authentication (9 endpoints) |
| `BR-` | Business rules (9 endpoints) |
| `BRD-` | Branding / configuration (17 endpoints) |
| `CFG-` | Expense configuration (12 endpoints) |
| `CMT-` | Committees (10 endpoints) |
| `DEL-` | Delegation (5 endpoints) |
| `DOC-` | Documents (6 endpoints) |
| `EVT-` | Notification events (2 endpoints) |
| `INT-` | Integrations (13 endpoints) |
| `LIM-` | Approval limits (18 endpoints) |
| `MST-` | Master data (16 endpoints) |
| `NTF-` | Notifications (4 endpoints) |
| `ORG-` | Organization (17 endpoints) |
| `REQ-` | Expense requests (7 endpoints) |
| `ROL-` | Roles (7 endpoints) |
| `RPT-` | Reports & dashboard (5 endpoints) |
| `SMT-` | SMTP (4 endpoints) |
| `SYS-` | System (1 endpoints) |
| `TPL-` | Email templates (7 endpoints) |
| `USR-` | Users (14 endpoints) |
| `WF-` | Workflow configuration (13 endpoints) |

## 3. Environment variables the frontend must accept

These mirror `application.yml` and deployment configuration; the frontend reads them at build
time from Vite (`import.meta.env.VITE_*`) and, where needed, from `GET /api/v1/public/configuration`
at runtime (see AUTH-* for the public config endpoint).

| Variable | Purpose | Example |
|----------|---------|---------|
| `VITE_API_BASE_URL` | Base URL for API calls (no trailing slash); `/api/v1` in dev/prod with proxy, or an absolute URL for cross-origin | `/api/v1` |
| `VITE_APP_NAME` | Institution branding override (falls back to server-driven branding) | `EDAM` |
| `VITE_ENABLE_PWA` | Toggle PWA/service-worker in production | `false` for Phase 1 |
| `VITE_SENTRY_DSN` | Optional error reporting DSN (leave empty to disable) | `` |
| `VITE_DEFAULT_LOCALE` | Fallback locale (`en-GB` for rollout) | `en-GB` |
| `VITE_IDLE_TIMEOUT_MINUTES` | Session idle warning + auto-logout (matches server session TTL) | `25` |

The server additionally exposes runtime branding (logo URL, theme palette, institution name)
through `GET /api/v1/public/configuration` (BRD-* public endpoint) — the frontend must hydrate
theme tokens from that response on boot and update CSS custom properties dynamically.

## 4. HTTP & REST conventions

- All API responses are JSON, UTF-8, wrapped in `ApiResponse<T>` (see H02).
- IDs are UUIDs (`string` in TypeScript, never numbers).
- Monetary amounts are transmitted as strings (BigDecimal-safe); do **not** coerce to `number`
  in JS (use `decimal.js-light` or store/display as strings until rendering).
- Timestamps are ISO-8601 instants (`Instant` on the server) — always render in the user's TZ.
- Lists use `PageResponse<T>` with zero-based `page`, `size ≤ 100`, and sorting via
  `sort=property,(asc|desc)` (repeatable).
- Write operations (`POST`, `PUT`, `PATCH`, `DELETE`) require the CSRF token header (H03).
- Mutating `POST` endpoints that create or advance business state use idempotency keys — the
  frontend MUST send an `Idempotency-Key` header (UUID v4, per request attempt) on:
  `POST /api/v1/expense-requests`, `POST /expense-requests/{{id}}/submit`,
  `POST /expense-requests/{{id}}/cancel`, `POST /approvals/tasks/{{taskId}}/approve|reject|forward|revert`,
  `POST /api/v1/auth/login` (retry protection on slow networks).
- The frontend never displays raw server error messages except the `error.message` field of the
  envelope, which is guaranteed safe by the backend.

## 5. Glossary

| Term | Meaning |
|------|---------|
| Institution | Tenant; EDAM supports one institution per deployment (single-tenant schema). |
| Data scope | A `(department, branch)` pair the user is allowed to see; enforced in service layer. |
| Task | A pending approval step in a workflow instance (BPMN user-task). |
| Case file | The full aggregate returned for one approval task (request + history + available actions). |
| OPEX / CAPEX | Expense type enum used throughout request configuration, limits, and reporting. |
| Bootstrap | One-time initial-administrator creation before any users exist (`X-Installation-Token`). |
| Principal | Server-side representation of the logged-in user, mirrored to the client via `CurrentUserResponse`. |

## 6. Source evidence for this file

- Baseline commit & PR state: `git log -1 93a89eb`; PR #22 merged into `main`.
- Idempotency annotations: `com.edam.common.api.IdempotentOperation` (applied on create/submit/cancel/approve/reject/forward/revert/login).
- Pagination shape: `com.edam.common.api.PageResponse`.
- CSRF configuration: `com.edam.config.SecurityConfig` (line 185: `CookieCsrfTokenRepository.withHttpOnlyFalse()`).
- Public matchers: `SecurityConfig.publicMatchers()` (auth login/logout/csrf/bootstrap/forgot/reset + `/public/configuration`).
