# H04 — Permissions, Navigation & Access Control

## 1. Permission model

EDAM uses **code-string permissions** (`<domain>:<action>`, e.g. `request:submit`,
`approval:act`) plus **data scopes** (department/branch pairs that narrow where the permission
applies). The backend enforces two layers:

1. **Controller gate** (`@EdamPermission("…")`) — checks the user's session carries the code.
2. **Service-layer scope check** (`DataScopeGuard`) — further filters or rejects based on
   department/branch data scopes attached to the user.

Important nuance: the controller annotation for `GET /expense-requests` and
`GET /expense-requests/{id}` is `request:view-own`, but the service widens results for users
holding `request:view-scope` or `request:view-all`. Holders of any of the three codes can reach
the register; the service decides which rows they see. The frontend's "All Requests" nav entry
should show for **any** of the three codes.

Source: `com.edam.expenserequest.controller.ExpenseRequestController` (class Javadoc lines 51–55),
`com.edam.common.security.RequirePermissionAspect`.

## 2. Permission catalogue

**Total:** 60 permission codes.


### `approval:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `approval:act` | `APPROVAL_ACT` | Approve / reject / forward / revert an assigned approval task |
| `approval:view` | `APPROVAL_VIEW` | View approval inbox and case files assigned to (or visible to) user |

### `approval-limit:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `approval-limit:manage` | `APPROVAL_LIMIT_MANAGE` | Manage approval limits, exceeding-limit rules, recommending authorities |
| `approval-limit:view` | `APPROVAL_LIMIT_VIEW` | View approval limits, exceeding-limit rules, recommending authorities |

### `audit:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `audit:export` | `AUDIT_EXPORT` | Export audit log |
| `audit:view` | `AUDIT_VIEW` | View audit log |

### `committee:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `committee:manage` | `COMMITTEE_MANAGE` | Create, edit committees, levels, members |
| `committee:view` | `COMMITTEE_VIEW` | View committees and their levels/members |

### `configuration:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `configuration:manage` | `CONFIGURATION_MANAGE` | Edit branding, themes, settings, feature flags |
| `configuration:view` | `CONFIGURATION_VIEW` | View branding, themes, settings, feature flags |

### `currency:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `currency:manage` | `CURRENCY_MANAGE` | Activate/deactivate currencies, set exchange rates |
| `currency:view` | `CURRENCY_VIEW` | View currencies and exchange rates |

### `dashboard:*` — 1 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `dashboard:manage` | `DASHBOARD_MANAGE` | Configure dashboard widgets |

### `data-scope:*` — 1 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `data-scope:manage` | `DATA_SCOPE_MANAGE` | Assign data scopes (department/branch) to users |

### `delegation:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `delegation:manage` | `DELEGATION_MANAGE` | Create, edit delegation rules |
| `delegation:view` | `DELEGATION_VIEW` | View delegation matrix |

### `document:*` — 3 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `document:delete` | `DOCUMENT_DELETE` | Delete unattached or permitted documents |
| `document:download` | `DOCUMENT_DOWNLOAD` | Download/view documents |
| `document:upload` | `DOCUMENT_UPLOAD` | Upload documents and attach to requests |

### `email-configuration:*` — 1 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `email-configuration:manage` | `EMAIL_CONFIGURATION_MANAGE` | Manage SMTP configuration and email settings |

### `exceeding-limit:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `exceeding-limit:manage` | `EXCEEDING_LIMIT_MANAGE` | Manage exceeding-limit rules (subset of approval-limit:manage) |
| `exceeding-limit:view` | `EXCEEDING_LIMIT_VIEW` | View exceeding-limit rules (subset of approval-limit:view) |

### `expense-configuration:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `expense-configuration:manage` | `EXPENSE_CONFIGURATION_MANAGE` | Edit categories, subcategories, lookups, OPEX/CAPEX config |
| `expense-configuration:view` | `EXPENSE_CONFIGURATION_VIEW` | View categories, subcategories, lookups, OPEX/CAPEX config |

### `integration:*` — 4 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `integration:execute` | `INTEGRATION_EXECUTE` | Execute/trigger an integration run |
| `integration:manage` | `INTEGRATION_MANAGE` | Create/edit integrations |
| `integration:test` | `INTEGRATION_TEST` | Test an integration connection |
| `integration:view` | `INTEGRATION_VIEW` | View configured integrations |

### `notification:*` — 1 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `notification:view` | `NOTIFICATION_VIEW` | View in-app notification inbox |

### `notification-template:*` — 1 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `notification-template:manage` | `NOTIFICATION_TEMPLATE_MANAGE` | Manage notification templates (email/in-app) |

### `organization:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `organization:manage` | `ORGANIZATION_MANAGE` | Create, edit, retire departments/branches |
| `organization:view` | `ORGANIZATION_VIEW` | View departments, branches, and org structure |

### `recommending-authority:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `recommending-authority:manage` | `RECOMMENDING_AUTHORITY_MANAGE` | Manage recommending authorities (subset of approval-limit:manage) |
| `recommending-authority:view` | `RECOMMENDING_AUTHORITY_VIEW` | View recommending authorities (subset of approval-limit:view) |

### `report:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `report:export` | `REPORT_EXPORT` | Export register reports (CSV / XLSX) |
| `report:view` | `REPORT_VIEW` | View reports, dashboard, widgets |

### `request:*` — 9 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `request:cancel` | `REQUEST_CANCEL` | Cancel/withdraw a request before decision |
| `request:create` | `REQUEST_CREATE` | Create new expense requests (draft) |
| `request:edit` | `REQUEST_EDIT` | Edit editable (draft/returned) requests |
| `request:export` | `REQUEST_EXPORT` | Export requests register (note: superseded by report:export for generic exports) |
| `request:reverse` | `REQUEST_REVERSE` | Reverse a settled/paid request |
| `request:submit` | `REQUEST_SUBMIT` | Submit a draft request for approval |
| `request:view-all` | `REQUEST_VIEW_ALL` | View all requests across the institution (passes controller gate; service unfiltered) |
| `request:view-own` | `REQUEST_VIEW_OWN` | View own requests (base gate — service widens for view-scope/view-all holders) |
| `request:view-scope` | `REQUEST_VIEW_SCOPE` | View requests within own data scopes (passes controller gate; service filters) |

### `role:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `role:manage` | `ROLE_MANAGE` | Create, edit, delete non-system roles |
| `role:view` | `ROLE_VIEW` | View roles and their permissions |

### `rule:*` — 3 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `rule:manage` | `RULE_MANAGE` | Create/edit business rules and rule sets |
| `rule:publish` | `RULE_PUBLISH` | Publish business rules |
| `rule:view` | `RULE_VIEW` | View business rules and rule sets |

### `system:*` — 1 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `system:administer` | `SYSTEM_ADMINISTER` | Installation-wide administration (bootstrap, system info) |

### `tax-authority:*` — 1 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `tax-authority:manage` | `TAX_AUTHORITY_MANAGE` | Create, edit, retire tax authorities |

### `user:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `user:manage` | `USER_MANAGE` | Create, edit, deactivate users |
| `user:view` | `USER_VIEW` | View user directory |

### `user-role:*` — 1 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `user-role:assign` | `USER_ROLE_ASSIGN` | Assign roles to users |

### `vendor:*` — 2 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `vendor:manage` | `VENDOR_MANAGE` | Create, edit, retire vendors |
| `vendor:view` | `VENDOR_VIEW` | View vendor directory |

### `workflow:*` — 3 permissions

| Code | Java constant | Description |
|------|---------------|-------------|
| `workflow:manage` | `WORKFLOW_MANAGE` | Create/edit draft workflow definitions |
| `workflow:publish` | `WORKFLOW_PUBLISH` | Publish workflow definitions |
| `workflow:view` | `WORKFLOW_VIEW` | View workflow definitions, versions, states |

## 3. Navigation → permission mapping

Primary navigation entries and the permission gate each uses. An entry is shown if the user
holds **any** of the listed permissions. Secondary/action buttons are described in H09 (screen
inventory).

| Nav section | Entry | Route | Show when user holds |
|-------------|-------|-------|----------------------|
| Workspace | Dashboard | `/app/dashboard` | always (authenticated) |
| Workspace | My Requests | `/app/requests/mine` | `request:view-own` |
| Workspace | All Requests | `/app/requests/all` | `request:view-own` or `request:view-scope` or `request:view-all` |
| Workspace | New Request | `/app/requests/new` | `request:create` |
| Workspace | Approval Inbox (with badge) | `/app/approvals` | `approval:view` |
| Workspace | Notifications (with badge) | `/app/notifications` | `notification:view` |
| Documents | Documents | `/app/documents` | `document:view` |
| Reports | Dashboard & Widgets | `/app/reports/dashboard` | `report:view` |
| Reports | Exports | `/app/reports/exports` | `report:export` |
| Admin | Users | `/app/admin/users` | `user:view` |
| Admin | Roles & Permissions | `/app/admin/roles` | `role:view` |
| Admin | Organization | `/app/admin/organization` | `organization:view` |
| Admin | Master Data (Currencies/Vendors/Tax/Exchange Rates) | `/app/admin/master-data` | `currency:view` or `vendor:view` or `tax-authority:manage` |
| Admin | Expense Configuration | `/app/admin/expense-config` | `expense-configuration:view` |
| Admin | Approval Limits | `/app/admin/approval-limits` | `approval-limit:view` |
| Admin | Delegation | `/app/admin/delegation` | `delegation:view` |
| Admin | Committees | `/app/admin/committees` | `committee:view` |
| Admin | Workflow Configuration | `/app/admin/workflows` | `workflow:view` |
| Admin | Business Rules | `/app/admin/rules` | `rule:view` |
| Admin | Communication (SMTP / Templates / Events) | `/app/admin/communication` | `email-configuration:manage` or `notification-template:manage` |
| Admin | Branding & Settings | `/app/admin/settings` | `configuration:view` |
| Admin | Audit Log | `/app/admin/audit` | `audit:view` |
| Admin | Integrations | `/app/admin/integrations` | `integration:view` |

## 4. UI gate rules

1. **Hide (don't disable) actions the user can never perform** (they lack the permission code).
2. **Disable (don't hide) actions the user can perform but not in this state** (e.g. Submit
   while form invalid, or Approve when the task is not assigned to them) — add a tooltip.
3. **Row-level action availability is server-driven.** For approval tasks, render buttons only
   for actions listed in `ApprovalCaseFile.availableActions[]`. Never infer from status alone.
4. **Empty vs. denied.** When a list returns 0 rows because of scope narrowing, show empty
   state. When the user navigates to a route they lack the route-level permission for, render
   `<AccessDenied/>` in the outlet — do not silently redirect.
5. **Never rely solely on client-side hiding for security.** The backend enforces every gate;
   the client gating is UX, not access control.
6. **Permission hook** (`useHasPermission(code)`) reads from the auth store populated by
   `/auth/me`. Refresh the store only on login/logout and explicit role edits.
