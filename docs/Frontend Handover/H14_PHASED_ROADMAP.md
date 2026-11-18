# H14 — Phased Roadmap

## Phase 1 — Core Expense Management (this package)
Scope:
- Auth (login, logout, CSRF, bootstrap, forgot/reset/change password, me), session handling.
- Dashboard + metrics + trends.
- My Requests, All Requests (register + paging + filtering), search.
- Create / edit / submit / cancel request (DRAFT/SUBMITTED/CANCELLED flow; resubmit from RETURNED).
- Request detail: summary, items, quotations, invoices, allocations, OPEX/CAPEX/STA, timeline.
- Approval inbox, case file, approve / reject / forward / revert.
- Per-request document upload, list, delete, signed-URL download (no preview).
- CSV + XLSX register export (streamed).
- Notifications inbox, unread badge, mark read.
- Required lookup selectors (currencies, vendors, tax authorities, request types, categories,
  natures, departments, branches, active workflow).

Done criteria (D-19/D-21/D-23/D-27):
100% of Phase 1 screens, workflows, permissions, and APIs mapped and tested. NOT 100% of all
102 module-set endpoints — those that correspond to deferred admin CRUD are explicitly
deferred.

## Phase 2 — Admin & Operations
Users CRUD, roles CRUD, department/branch admin, master data maintenance (currencies,
vendors, tax authorities, GL codes, budget heads), expense configuration, approval limits,
committees, delegation, workflow editor, business rules, branding/themes/settings, SMTP,
notification templates, event subscriptions, integrations (ERP/HR), widgets/report catalogue
(RPT-004/005), audit viewer (AUD-001/002), dashboard:manage UIs, document inline preview
(once CSP/URL verified — D-21).

## Phase 3 — Advanced
PDF/print export, audit export (when endpoint is implemented), multi-institution mode,
advanced analytics, offline/PWA, SSO, 2FA, localization, dark mode (if backend themeTokens
expand to support two palettes), delegated approvals dashboard, budget vs actuals.

## Phase 4 — Polish & scale
Accessibility audit pass, performance pass (virtual scroll on long registers),
telemetry/error reporting, admin health/metrics, API rate-limit UX.
