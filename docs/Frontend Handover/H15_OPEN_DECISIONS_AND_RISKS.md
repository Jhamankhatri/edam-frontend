# H15 — Open Decisions & Risks

## Open decisions (must be resolved during Phase 1 implementation, not assumed)

| ID | Decision | Owner | Default if unresolved |
|----|----------|-------|-----------------------|
| OD-1 | PDF/print timeline for register export | Product | Disable PDF/print buttons in Phase 1; CSV/XLSX only. |
| OD-2 | Idle-session timeout (warning + auto-logout) | Product/security | 25 min client warning, 30 min hard timeout aligned with server `server.servlet.session.timeout`. |
| OD-3 | Notification delivery model (60 s polling vs WebSocket/SSE) | Backend/infra | 60 s polling in Phase 1; replace when backend ships SSE. |
| OD-4 | Max per-request attachment size & per-file count | Backend | Enforce client cap at 25 MB/file and 10 files/request until backend advertises limits. |
| OD-5 | Default locale vs. per-user locale | Product/i18n | Use `defaultLocale` from public config; no per-user override in Phase 1. |
| OD-6 | System info display on the login page | Product | Do not call `/system/info` pre-login (it is authenticated); hide "version" on login screen. |
| OD-7 | Whether to reconcile `@PublicEndpoint` annotation with SecurityConfig for `GET /system/info` | Backend | Leave as-is (authenticated at runtime); document accurately. |

## Known risks

| ID | Risk | Mitigation |
|----|------|------------|
| R-1 | BigDecimal binary-fp bug in money rendering | Use `decimal.js-light`; never JS `number` arithmetic; codegen types to `string`? (rejected by source — JSON is number). |
| R-2 | CSRF cookie not present before first write | Always call `/auth/csrf` on boot and after login; retry once after 403. |
| R-3 | CORS misconfiguration blocks cross-origin deploy | Ship same-origin by default; CORS must allow credentials and the CSRF/idempotency/installation headers. |
| R-4 | OpenAPI drift between commits | CI contract check; regenerate types per PR. |
| R-5 | Role permissions regress after new seed migrations | Backend D-09 test; frontend falls back to permission checks on the principal. |
| R-6 | Storage URL / CSP prevent future inline preview | Defer inline preview until runtime verification (D-21). |
