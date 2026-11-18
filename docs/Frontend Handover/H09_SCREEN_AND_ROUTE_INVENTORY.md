# H09 — Screen & Route Inventory (Phase 1)

Phase 1 (D-19) covers the screens needed to request, review, approve, and export expense
requests. Admin CRUD screens (users, roles, organization, master-data maintenance, expense
configuration, approval limits, committees, delegation, workflows, business rules, branding,
SMTP, templates, events, integrations) are **deferred** to later phases (see H14).

## Public (anonymous)
| Route | Component | Layout | States |
|-------|-----------|--------|--------|
| `/login` | `<LoginPage/>` | Public shell | error (credentials), locked, network |
| `/forgot-password` | `<ForgotPasswordPage/>` | Public | success (constant message) |
| `/reset-password?token=` | `<ResetPasswordPage/>` | Public | invalid/expired token, success |
| `/bootstrap` | `<BootstrapPage/>` | Public | already-bootstrapped → `/login` |
| `/change-password` | `<ChangePasswordPage/>` | Shell | required on first login / reset |

## Authenticated shell (`/app`)
Topbar: app name, current user, theme (LIGHT only in Phase 1 — DARK deferred), logout.
Sidebar: nav items gated by permissions (H04 §3).
Content: outlet with loading/error/denied/empty fallback.

| Route | Component | Purpose | Required perm |
|-------|-----------|---------|---------------|
| `/app/dashboard` | `<DashboardPage/>` | KPIs, distributions, trends | `report:view` |
| `/app/requests/mine` | `<RequestsListPage mineOnly=true/>` | My Requests | `request:view-own` |
| `/app/requests/all` | `<RequestsListPage mineOnly=false/>` | All Requests (scoped by role) | any of view-own/scope/all |
| `/app/requests/new` | `<RequestFormPage mode="create"/>` | New request | `request:create` |
| `/app/requests/$id` | `<RequestDetailPage/>` | Summary + tabs | `request:view-own` |
| `/app/requests/$id/edit` | `<RequestFormPage mode="edit"/>` | Edit | `request:edit` |
| `/app/approvals` | `<ApprovalsInboxPage/>` | My approvals + badge count | `approval:view` |
| `/app/approvals/tasks/$taskId` | `<ApprovalCasePage/>` | Case file + action bar | `approval:view` + `approval:act` to act |
| `/app/notifications` | `<NotificationsPage/>` | Inbox + mark-all | `notification:view` |

Detail tabs (inside `/app/requests/$id`): Summary, Items/Quotations/Invoices, Approvals
(timeline/audit trail), Documents.
