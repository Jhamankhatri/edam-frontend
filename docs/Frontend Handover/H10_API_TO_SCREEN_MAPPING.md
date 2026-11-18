# H10 — API-to-Screen Mapping (Screen → Endpoint Coverage)

Cross-reference tying each screen (H09) to the endpoints it calls and the permissions it needs.
Endpoint IDs reference Appendix A (e.g. REQ-004, APL-005); the H-prefixed codes remain as documented in H01 baseline. This matrix is the basis for the traceability verification in H16.

## Public screens

| Screen | APIs called | Purpose |
|--------|-------------|---------|
| Login | AUTH-003 (csrf, pre), AUTH-006 (login), BRD public (config) | Session start, branding |
| Bootstrap | AUTH-005 (installation check), AUTH-003 (csrf), AUTH-001 (bootstrap) | First-run setup |
| Forgot password | AUTH-004 | Self-service reset initiation |
| Reset password | AUTH-009 | Self-service reset completion |
| Change password (forced) | AUTH-008 (re-fetch me), AUTH-002 | Password change |

## Authenticated shell (layout loader)

| Loader | APIs | Purpose |
|--------|------|---------|
| Auth boot | AUTH-008 (me), AUTH-003 if needed | Hydrate user + perms |
| Branding | BRD public (`/public/configuration`) | CSS custom properties |
| Badges | APL-002 (approval count), NTF unread count | Sidebar badges |
| System info (optional) | SYS-001 | Footer version (authenticated only) |

## Workspace screens

| Screen | APIs | Required perms |
|--------|------|----------------|
| Dashboard | RPT-001 (dashboard summary), RPT widget list, APL-002, REQ-001 (mine, top 5) | authenticated; report:view for widgets |
| My Requests | REQ-001 (list, mine=true), REQ-005 (per row detail when expanded) | request:view-own |
| All Requests | REQ-001 (list), lookups for filters: MST currencies/vendors, ORG departments/branches, CFG categories | request:view-own / view-scope / view-all |
| New Request | MST/CFG/ORG lookups (currencies, vendors, depts, categories, expense types), REQ-002 (create) | request:create |
| Request detail | REQ-003 (detail), REQ-005 (timeline tab), DOC list/associate (documents tab) | request:view-own / view-scope / view-all |
| Edit request | REQ-003 (load), REQ-004 (PUT update), lookups | request:edit |
| Request detail actions | REQ-006 (cancel), REQ-007 (submit) | request:cancel / request:submit |
| Approval inbox | APL-001 (list), APL-002 (count) | approval:view |
| Approval case file | APL-003 (case file), APL-004 (approve), APL-006 (reject), APL-005 (forward), APL-008 (revert), APL-007 (request snapshot helper) | approval:view (load) + approval:act (mutations) |
| Notifications | NTF list, NTF mark-read | notification:view |

## Documents screens

| Screen | APIs | Required perms |
|--------|------|----------------|
| Documents register | DOC list, DOC upload, DOC delete | document:view / document:upload / document:delete |
| Document detail | DOC get, DOC download | document:download |

## Reports screens

| Screen | APIs | Required perms |
|--------|------|----------------|
| Reports dashboard | RPT-001, widget endpoints | report:view |
| Exports | RPT-002 (export, streaming) | report:export |

## Admin screens (selected)

| Screen | APIs (prefix) | Required perms |
|--------|---------------|----------------|
| Users | USR list/get/create/update, ROL list, UserScopeView assign (USR scope) | user:view / user:manage / user-role:assign / data-scope:manage |
| Roles | ROL list/get/save, permission catalogue (ROL perms) | role:view / role:manage |
| Organization | ORG list/get/save (departments, branches, profile) | organization:view / organization:manage |
| Master Data — Currencies | MST currency list/save/activate, MST exchange rates | currency:view / currency:manage |
| Master Data — Vendors | MST vendor list/save | vendor:view / vendor:manage |
| Master Data — Tax Authorities | MST tax authority list/save | tax-authority:manage |
| Expense Configuration | CFG category/subcategory/lookup list/save | expense-configuration:view / manage |
| Approval Limits | LIM limit list/save, exceeding-limit rules, recommending authorities, authority-check (preview) | approval-limit:view / manage |
| Delegation | DEL delegation rule list/save, approver step resolution | delegation:view / manage |
| Committees | CMT list/save, levels, members, coverage | committee:view / manage |
| Workflow config | WF definition list/save/publish/retire, version diff, states, steps, transitions, validation | workflow:view / manage / publish |
| Business rules | BR rule/rule-set list/save/publish, evaluation/test | rule:view / manage / publish |
| Communication | SMT get/save/test, TPL list/save/test, EVT get/save | email-configuration:manage / notification-template:manage |
| Settings | BRD themes/settings/feature-flags list/save, public config preview | configuration:view / manage |
| Audit | AUD list/detail, AUD export | audit:view / audit:export |
| Integrations | INT provider catalogue, summary/detail, create/update/test/execute/retry | integration:view / manage / test / execute |

## Endpoints that MUST have UI coverage

Every endpoint in Appendix A must be reachable from at least one screen. The H16 traceability script
verifies this by diffing H01 IDs against this matrix. Endpoints without a screen in Phase 1 are
flagged as "admin-only" or "deferred to Phase N" per the roadmap (H14).
