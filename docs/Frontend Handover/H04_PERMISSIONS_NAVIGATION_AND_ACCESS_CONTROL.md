# H04 — Permissions, Navigation & Access Control

Two-layer enforcement: controller `@EdamPermission` (exact code match, handled by
`RequirePermissionAspect`) plus service-level data-scope filters. The aspect does NOT infer a
hierarchy — `request:view-scope` does NOT imply `request:view-own`. Roles that need to see
wider sets MUST also carry `request:view-own`; this was wrong in initial seed data and is
fixed by Flyway **V28** (D-09).

## 1. Permission model for expense-request viewing

| Code | Meaning | Typical role |
|------|---------|--------------|
| `request:view-own` | Controller gate. Service layer always lets requesters see their own requests; non-requesters see requests whose department/branch matches their data scopes (if any). | Every requester; also granted to every role that holds `request:view-scope` or `request:view-all` (post-V28). |
| `request:view-scope` | Catalogue code. Controller gate is still `request:view-own`; if the role also holds `request:view-own`, the service widens results to matching scopes. | Department Head, Recommending Authority, Expense Committee Member |
| `request:view-all` | Catalogue code. Controller gate is still `request:view-own`; service returns installation-wide results. | CEO, CFO, Head of Admin/GSD, Report Administrator, System Administrator |

`RequirePermissionAspect` does exact-match only (source: `if (!principal.hasPermission(edamPermission.value()))`).
Without V28, roles seeded with only `view-scope` or `view-all` received 403 at the controller.
V28 grants `request:view-own` to every role that already holds one of the wider codes; service
visibility is unchanged, so no privilege is broadened.

## 2. Permission catalogue (60 codes)

See `src/main/java/com/edam/common/security/Permissions.java`. Selected categories relevant
to Phase 1:

**Request / Approval:** `request:create`, `request:view-own`, `request:view-scope`,
`request:view-all`, `request:edit`, `request:submit`, `request:cancel`, `request:reverse`,
`request:export`, `approval:view`, `approval:act`.

**Documents:** `document:upload`, `document:download`, `document:delete` (there is NO
`document:view`; listing per-request uses `document:download`).

**Notifications:** `notification:view`.

**Reporting:** `report:view`, `report:export`, `dashboard:manage`.

**Master / config lookups (used in Phase 1 forms):** `currency:view`, `vendor:view`,
`expense-configuration:view`, `organization:view`. Note: tax-authority listing endpoint
(`GET /master-data/tax-authorities`) requires `currency:view` (not a separate tax code).

## 3. Navigation → permission (Phase 1)

| Nav | Route | Show when user holds |
|-----|-------|----------------------|
| Dashboard | `/app/dashboard` | always (authenticated); widgets shown only if `report:view` |
| My Requests | `/app/requests/mine` | `request:view-own` (every requester + all wider roles post-V28) |
| All Requests | `/app/requests/all` | any of `request:view-own` / `view-scope` / `view-all` |
| New Request | `/app/requests/new` | `request:create` |
| Approval Inbox (with badge) | `/app/approvals` | `approval:view` |
| Notifications (with badge) | `/app/notifications` | `notification:view` |
| Documents | (tab inside request detail) | `document:download` (to view) / `document:upload` (to attach) |

There is no standalone `/app/documents` or `/app/reports/exports` admin screen in Phase 1 —
exports are launched from the All Requests register; documents are managed inside request
detail.

## 4. UI gate rules

1. Hide (don't disable) actions the user lacks the permission code for.
2. Disable (don't hide) actions the user can perform but not in this state; tooltip with reason.
3. Row-level actions (Approve, etc.) render only when `availableActions[].available === true`
   in the case-file response — never infer from status.
4. Empty vs. denied: empty list when results are scoped to zero; `<AccessDenied/>` when the
   route-level permission is missing.
5. `useHasPermission(code)` reads from the auth store populated by `/auth/me`; refresh only on
   login/logout.

## 5. D-09 fix details (V28)

`src/main/resources/db/migration/V28__grant_view_own_to_wider_view_roles.sql` does:

1. `INSERT INTO role_permissions ... SELECT` for every role that currently holds
   `request:view-scope` or `request:view-all`, granting `request:view-own`.
2. `ON CONFLICT DO NOTHING` so roles that already hold `request:view-own` are unchanged.
3. A PL/pgSQL assertion fails the migration if any role holds a widened view code without
   `request:view-own` after the insert.

Roles that receive the new grant (seeded in V12): DEPARTMENT_HEAD, RECOMMENDING_AUTHORITY,
EXPENSE_COMMITTEE_MEMBER, CEO, CFO, HEAD_OF_ADMIN_GSD, REPORT_ADMINISTRATOR. SYSTEM_ADMINISTRATOR
already holds `request:view-all` explicitly and REQUESTER/READ_ONLY already hold `request:view-own`.

Service-layer `isVisible()` continues to apply requester/department/branch/installation checks,
so a manager with `view-scope` still sees only department-scoped requests (no privilege
escalation).
