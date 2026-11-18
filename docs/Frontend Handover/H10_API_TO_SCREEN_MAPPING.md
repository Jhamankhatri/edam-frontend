# H10 — API → Screen Mapping (Phase 1)

Screen ↔ endpoint cross-reference. All endpoint IDs are from Appendix A. Lookup endpoints
(`/master-data/*`, `/configuration/*`, `/organization/departments/branches`) are referenced
once here and reused by multiple screens; hook up via shared TanStack Query hooks.

## Shared boot
- App root: BRD-005 `GET /public/configuration`, AUTH-008 `GET /auth/me`.
- Before any write: AUTH-003 `GET /auth/csrf`.

## Screens
| Screen | GETs | POST/PUT/DELETE |
|--------|------|-----------------|
| Login | BRD-005 | AUTH-006 login |
| Logout | — | AUTH-007 logout |
| Forgot password | — | AUTH-004 |
| Reset password | — | AUTH-009 |
| Bootstrap | AUTH-005 (installation status) | AUTH-001 (X-Installation-Token) |
| Change password | — | AUTH-002 |
| Dashboard | RPT-001, CFG lookups for filter selects | — |
| My Requests | REQ-001 (`mineOnly=true`), CFG filters | REQ-006 cancel |
| All Requests | REQ-001 (`mineOnly=false`), CFG filters | REQ-006 cancel, RPT-002 export |
| New Request | CFG request-types/categories/natures, MST currencies/vendors/tax authorities, ORG departments/branches | REQ-002 create |
| Request Detail | REQ-003 get, REQ-005 timeline (keyset), DOC-002 list documents, APL-003? (via case file link when invoked from approval) | REQ-004 update, REQ-006 cancel, REQ-007 submit, DOC-001 upload, DOC-003 get, DOC-004 delete, DOC-005 download-url |
| Edit Request | same as New Request + REQ-003 | REQ-004 update |
| Approvals inbox | APL-001 list, APL-002 count (poll 60 s) | — |
| Approval case | APL-003 case-file | APL-004 approve, APL-005 forward, APL-006 reject, APL-008 revert (all with Idempotency-Key; remarks required) |
| Notifications | NTF-001 list, NTF-003 unread (poll 60 s) | NTF-002 mark-all, NTF-004 mark-one |

## Lookup endpoints used by forms
- `GET /configuration/request-types`, `GET /configuration/expense-categories`,
  `GET /configuration/expense-natures`, `GET /configuration/workflows/active` —
  all require `expense-configuration:view` (branded config, master-data-backed config).
- `GET /master-data/currencies?active=true`, `GET /master-data/vendors?page=...`,
  `GET /master-data/tax-authorities?page=...` — all require `currency:view`.
- `GET /organization/departments/tree`, `GET /organization/branches` — `organization:view`.
