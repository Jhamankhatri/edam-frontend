# H16 — Traceability & Verification

## Verification method
This package was verified against the backend source at merge commit `38cedbc` (PR #24
merge of branch `docs/frontend-handover-remediation`), which includes the initial 19-file
handover (PR #23), the D-01…D-27 corrections, Flyway V28, the `SeededRolePermissionsD09Test`
regression test, and the idempotency transaction bug fix (`92c7d5a`).

Verification combined:
- **Static source inspection:** every controller, DTO, SecurityConfig public-matchers list,
  `@PublicEndpoint`/`@EdamPermission` annotations, `RequirePermissionAspect`,
  `ExpenseRequestService.isVisible`, migration files V5/V12/V27/V28, and idempotency
  services (`IdempotencyService`, `IntegrationService`).
- **CI execution (GitHub Actions run 44322838892 + push run 44322826952):** 37 test
  classes / 433 tests / 0 failures / 0 errors / 3 pre-existing skips, across three jobs
  (`build-and-test`, `prod-profile-smoke-test`, `war-package-smoke-test`).
- **Appendix A regeneration** directly from controller source + `Permissions.java`, with
  handler → Java method cross-check.

Endpoint, DTO, handler, path, permission, and annotation claims in this package are backed
by the source files listed in §Source evidence.

## Endpoint coverage
Total `/api/v1` endpoints covered in Appendix A: **206** (8 public, 3 authenticated-only,
195 permission-guarded). Phase 1 screens map to a focused subset (see H10):

- Auth surface: AUTH-001…AUTH-009.
- Public branding: BRD-005.
- System info: SYS-001 (authenticated — see H03 §5).
- Requests: REQ-001…REQ-007 (list/create/get/update/timeline/cancel/submit).
- Approvals: APL-001…APL-008 (inbox/count/case/approve/forward/reject/requestFor/revert).
- Documents: DOC-001…DOC-006 (upload/list/get/delete/download-url/scans).
- Reporting: RPT-001…RPT-003 (dashboard/export/register); RPT-004/RPT-005 deferred (Phase 2 admin).
- Notifications: NTF-001…NTF-004 (list/mark-all/unread/mark-one).
- Lookups (shared): `GET /configuration/request-types`, `/configuration/expense-categories`,
  `/configuration/expense-natures`, `/configuration/workflows/active`, `/master-data/currencies`,
  `/master-data/vendors`, `/master-data/tax-authorities`, `/organization/departments/tree`,
  `/organization/branches`.

## Correction status (D-01…D-27)

| ID | Issue | Status |
|----|-------|--------|
| D-01 | Endpoint IDs misaligned with handlers | Resolved (Appendix A regenerated) |
| D-02 | Documents endpoint list wrong (order, paths, IDs) | Resolved (DOC-001…DOC-006 aligned to source) |
| D-03 | Document permissions wrong (claimed `document:view`) | Resolved (only `document:upload/download/delete`) |
| D-04 | Reporting filter contract wrong | Resolved (13-arg dashboard; custom `RegisterResponse` for register) |
| D-05 | Phase arithmetic wrong (over-scoped Phase 1) | Resolved (H14 locks D-19 scope) |
| D-06 | Request permission semantics (view-scope/view-all vs view-own) | Resolved via V28 (H04 §5) |
| D-07 | Audit export claimed but no endpoint exists | Resolved (documented as unimplemented; deferred) |
| D-08 | Dashboard/notification permission gates wrong | Resolved (notifications require `notification:view`; RPT-004/005 deferred) |
| D-09 | Seeded roles missing `request:view-own` | Resolved by Flyway V28 (H04 §5) |
| D-10 | CSRF cookie behaviour wrong (GETs auto-set) | Resolved (H03 §3 — call `/auth/csrf` before writes) |
| D-11 | Raw CSV/XLSX export envelope (wrapped as `ApiResponse`) | Resolved (raw bytes; H02 §7) |
| D-12 | Error code catalogue incomplete | Resolved (H02 §3) |
| D-13 | Approval DTOs wrong (remarks optional; `targetUserId`) | Resolved (remarks required; `recipientUserId`) |
| D-14 | OPEX/CAPEX/STA payloads wrong | Resolved (H02 §4.6) |
| D-15 | Request list query params wrong (claimed `branchId` filter at list level) | Resolved (correct params in H10) |
| D-16 | Route file naming wrong (React Router colon params) | Resolved (TanStack Router `$id`; H07) |
| D-17 | Idempotency inventory incomplete | Resolved (H02 §6) |
| D-18 | Bootstrap/login behaviour wrong (session after bootstrap) | Resolved (bootstrap returns 201, no session; D-23) |
| D-19 | Phase 1 scope locked | Resolved (H14) |
| D-20 | Appendix A cross-references broken by path-doubling | Resolved (Appendix A regenerated with correct paths) |
| D-21 | Document preview deferred until URLs/CSP verified | Resolved (H11) |
| D-22 | Tax-authority endpoint permission documented incorrectly | Resolved (requires `currency:view`, not a separate tax perm) |
| D-23 | Bootstrap returns 201, explicit login required | Resolved (H03 §2) |
| D-24 | BigDecimal claimed as string on the wire | Resolved (JSON number; H02 §5) |
| D-25 | PageQuery max size cap wrong | Resolved (general 200, register 500; H02 §2) |
| D-26 | Heterogeneous list responses (catalogue endpoints) noted | Resolved (RPT-004/005 return `List<String>` — deferred to Phase 2) |
| D-27 | `themeTokens` contract vs unsupported fields | Resolved (H02 §4.5; public config fields documented exactly) |

## Source evidence index

| Concern | Source file |
|---------|-------------|
| Controllers | `src/main/java/com/edam/**/*Controller.java` (27 controllers, 206 `/api/v1` endpoints) |
| Security (public matchers) | `src/main/java/com/edam/config/SecurityConfig.java` |
| Permissions enum | `src/main/java/com/edam/common/security/Permissions.java` (60 codes) |
| Public/Authenticated annotations | `src/main/java/com/edam/common/security/{PublicEndpoint,AuthenticatedEndpoint}.java` |
| Architecture test (enforces @EdamPermission or @PublicEndpoint) | `src/test/java/com/edam/architecture/EndpointAuthorizationArchitectureTest.java` |
| Controller aspect (exact-match permission gate) | `src/main/java/com/edam/common/aspect/RequirePermissionAspect.java` |
| ApiResponse / PageResponse / PageQuery / ErrorCode | `src/main/java/com/edam/common/api/*.java` |
| GlobalExceptionHandler | `src/main/java/com/edam/common/exception/GlobalExceptionHandler.java` |
| Idempotency handling | `src/main/java/com/edam/common/api/{IdempotencyOperation,IdempotencyService,IdempotencyAspect,IdempotencyRecord,IdempotencyRecordRepository}.java`, `src/main/java/com/edam/integrations/service/IntegrationService.java` |
| Request visibility (service-layer scope enforcement) | `src/main/java/com/edam/expenserequest/service/ExpenseRequestService.java` `isVisible()` (lines ~419–434) |
| Expense-request DTOs | `src/main/java/com/edam/expenserequest/dto/ExpenseRequestDtos.java` |
| Approval DTOs / case-file | `src/main/java/com/edam/approval/dto/` |
| Document DTOs / controller | `src/main/java/com/edam/document/{controller,dto}/**` |
| Reporting DTOs / controller / service | `src/main/java/com/edam/reporting/{controller,dto,service}/**` |
| Public configuration response | `src/main/java/com/edam/web/PublicConfigurationResponse.java`, `web/SystemController.java` |
| Notification inbox | `src/main/java/com/edam/communication/controller/NotificationInboxController.java` |
| Seeded roles/permissions (canonical) | `src/main/resources/db/migration/V12__access_management.sql` (V3/V4 dropped by V13) |
| Idempotency partial unique index | `src/main/resources/db/migration/V27__phase4i_idempotency_unique_fix.sql` |
| D-09 regression test | `src/test/java/com/edam/rolemanagement/SeededRolePermissionsD09Test.java` |
| D-09 migration | `src/main/resources/db/migration/V28__grant_view_own_to_wider_view_roles.sql` |
