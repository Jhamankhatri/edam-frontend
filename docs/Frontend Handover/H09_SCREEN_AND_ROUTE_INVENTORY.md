# H09 — Screen & Route Inventory

Every route the frontend must implement. Routes use TanStack Router file conventions
(`src/app/**`). `Perms` = route gate (one of the codes from H04). Layout slots:
`public` (outside auth shell) or `app` (inside authenticated shell with sidebar/topbar).

## 1. Public routes (outside auth shell)

| Route file | Path | Purpose | Perms | Data loaded | States |
|------------|------|---------|-------|-------------|--------|
| `login.tsx` | `/login` | Username/password login; links to forgot-password | anonymous | `public/configuration` (branding) | empty, submitting, error (invalid creds / locked / installation-required) |
| `bootstrap.tsx` | `/bootstrap` | First-run admin creation form | anonymous + `X-Installation-Token` | `public/configuration`, `/auth/installation` | idle, submitting, success, weak-password, token-invalid, already-bootstrapped |
| `forgot-password.tsx` | `/forgot-password` | Email entry to request reset | anonymous | `public/configuration` | idle, submitted (always-success message) |
| `reset-password.tsx` | `/reset-password` | New-password form with `?token=` | anonymous | `public/configuration` | idle, submitting, invalid-token, success |
| `change-password.tsx` | `/change-password` | Force-change on first login / admin reset | authenticated, `mustChangePassword=true` | `/auth/me` | idle, submitting, weak-password, success |

## 2. Authenticated shell layout

Route file `app/layout.tsx` → mounts `<Shell>` with:
- **Sidebar** (primary nav, built from H04 §3; badge counts for approvals & notifications).
- **Topbar** (institution name from `public/configuration`, user menu with Display name /
  Role / Change password / Logout, global search in Phase 3).
- **Outlet** (current route).
- **Toaster**, **GlobalCommandPalette** (Phase 3), **NetworkStatusIndicator** (online/offline).
- Loads on mount: `/auth/me`, `/public/configuration`, `/approvals/count`, `/notifications/unread-count`.

## 3. Authenticated routes (in `/app/*`)

### Workspace

| Route | Path | Purpose | Perms | Primary APIs | States |
|-------|------|---------|-------|--------------|--------|
| `app/dashboard.tsx` | `/app/dashboard` | Default landing: metric cards, my pending approvals, my recent requests, quick actions | authenticated (any) | RPT-001, APL-002, REQ list (mine, top 5) | loading, loaded, error (scope empty OK → show welcome) |
| `app/requests/index.tsx` | `/app/requests` | Redirects to `/app/requests/all` (or `/mine` as preference) | request:view-own | — | redirect |
| `app/requests/mine.tsx` | `/app/requests/mine` | My Requests register (tab: All / Drafts / Submitted / Returned) | request:view-own | REQ-001 (mine=true) | loading, empty, loaded, error, filter-empty |
| `app/requests/all.tsx` | `/app/requests/all` | All Requests register (scope-aware) | request:view-own/scope/all | REQ-001 | same |
| `app/requests/new.tsx` | `/app/requests/new` | New request wizard (type → detail → items → allocations → quotations → review) | request:create | config lookups (CFG-, MST-, ORG-*) REQ-002 submit | step states, invalid, submitting, submitted (nav to detail) |
| `app/requests/$id.tsx` | `/app/requests/$id` | Request detail (header + tabs: Summary / Items / Allocations / Quotations / Invoices / Documents / Activity / Approvals) | request:view-own/scope/all | REQ-003, REQ-005, DOC list | loading, not-found, loaded, forbidden-by-scope (shows 404) |
| `app/requests/$id.edit.tsx` | `/app/requests/$id/edit` | Edit draft/returned request | request:edit | REQ-003, REQ-004 (PUT), lookups | editing, saving, conflict (409) |
| `app/approvals/index.tsx` | `/app/approvals` | Approval Inbox register (pending / acted-on) | approval:view | APL-001, APL-002 | loading, empty, loaded |
| `app/approvals/tasks.$taskId.tsx` | `/app/approvals/tasks/$taskId` | Case-file view: request snapshot, progress, timeline, action panel | approval:view | APL-003 (case file), APL-004/5/6/8 (mutations) | loading, not-assigned (refetch), acting (per action), acted (nav back) |
| `app/notifications/index.tsx` | `/app/notifications` | Notification inbox | notification:view | NTF list | — |

### Documents

| Route | Path | Purpose | Perms | APIs |
|-------|------|---------|-------|------|
| `app/documents/index.tsx` | `/app/documents` | Documents register (all attached + unattached uploads) | document:view | DOC list |
| `app/documents/$id.tsx` | `/app/documents/$id` | Document preview / metadata / associations | document:view (download) | DOC get, DOC download |

### Reports

| Route | Path | Purpose | Perms | APIs |
|-------|------|---------|-------|------|
| `app/reports/dashboard.tsx` | `/app/reports/dashboard` | Reports dashboard (KPIs, trend charts, configurable widgets) | report:view | RPT-001, widget list |
| `app/reports/exports.tsx` | `/app/reports/exports` | Ad-hoc register export (select report, filters, CSV/XLSX) | report:export | RPT-002 export |
| `app/reports/$reportKey.tsx` | `/app/reports/$reportKey` | Saved/custom report viewer (Phase 2) | report:view | RPT register endpoints |

### Admin

All admin routes live under `/app/admin/*` and use a secondary nav sidebar. Access-denied is
rendered in-place if the user lacks the route-level permission.

| Route | Perms | Purpose |
|-------|-------|---------|
| `app/admin/users/index.tsx` | user:view | User directory |
| `app/admin/users/$id.tsx` | user:view / user:manage | User detail + roles/scopes assignment |
| `app/admin/users/new.tsx` | user:manage | Create user |
| `app/admin/roles/index.tsx` | role:view | Roles list |
| `app/admin/roles/$id.tsx` | role:view / role:manage | Role editor (permissions matrix) |
| `app/admin/organization/index.tsx` | organization:view | Org tree (departments + branches) |
| `app/admin/master-data/index.tsx` | masterdata view perms | Master data hub: currencies, vendors, tax authorities, exchange rates |
| `app/admin/expense-config/index.tsx` | expense-configuration:view | Categories, subcategories, lookups |
| `app/admin/approval-limits/index.tsx` | approval-limit:view | Approval limits, exceeding-limit rules, recommending authorities |
| `app/admin/delegation/index.tsx` | delegation:view | Delegation matrix |
| `app/admin/committees/index.tsx` | committee:view | Committees & levels |
| `app/admin/workflows/index.tsx` | workflow:view | Workflow definitions, versions, publish |
| `app/admin/rules/index.tsx` | rule:view | Business rules, rule sets, publish |
| `app/admin/communication/index.tsx` | email-configuration or template | SMTP config, email templates, notification events |
| `app/admin/settings/index.tsx` | configuration:view | Branding (logo/colour), themes, settings KV, feature flags |
| `app/admin/audit/index.tsx` | audit:view | Audit log viewer + export |
| `app/admin/integrations/index.tsx` | integration:view | Integration providers, configured connections, execution history |

## 4. Standalone flows (dialogs not routes)

These are reached via action buttons on existing screens rather than URL routes:

- Submit confirm dialog (on request detail).
- Cancel/withdraw confirm (with optional remark).
- Approve / Reject (remark required) / Forward (pick user) / Revert (remark required) dialogs
  on the approval case file.
- Document upload (modal dropzone; also inline in request detail Documents tab).
- Column-customization, saved-filter, and export-start dialogs on registers.

## 5. Common child routes & deep linking

- All list views support query-string state: `?page=&size=&sort=&status=&q=&from=&to=&departmentId=&…`.
  TanStack Router validates types; links/bookmarks preserve the state.
- Detail pages route by UUID (`/$id`), not by request number — but the UI shows request number
  prominently. Support search-by-request-number that resolves to a redirect.
- Tabs are deep-linkable via `?tab=items` etc.

## 6. Error / loading / empty / denied states per route

Every route must implement these four slot states:

- **Loading:** skeleton matching the final layout (nav visible, shell hydrated).
- **Empty:** empty-state component with context-specific message + CTA.
- **Error:** error-state component with message, retry, and "go back" actions; shows correlationId on 5xx.
- **Access denied:** `<AccessDenied/>` in the outlet when the route-level perm is missing.

## 7. Canonical URL & redirects

- `/` → `/app/dashboard` (if authenticated) or `/login` (if anonymous).
- `/app` → `/app/dashboard`.
- `/app/requests` → `/app/requests/mine` (or `/all` if user lacks own-scope-only — but all users
  hold `request:view-own` so this is the default).
