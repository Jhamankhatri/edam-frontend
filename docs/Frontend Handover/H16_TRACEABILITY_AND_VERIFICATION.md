# H16 — Traceability & Verification

Cross-reference of the 206 API endpoints (H01) against screens (H09) and workflows (H05), plus verification evidence for this handover.

## 1. Coverage summary

- Total `/api/v1` endpoints: **206**.
- Public: **8**; authenticated-only: **3**; permission-guarded: **195**.
- Phase 1 modules (AUTH, SYS, REQ, APL, DOC, RPT, NTF + required ORG/MST/CFG lookups + BRD public config): **102** endpoints.
- Phase 1 endpoints mapped to a screen/workflow in this handover: **53 / 102** (51%).
- Admin/Phase 2+ endpoints documented in Appendix A but not yet assigned a Phase 1 screen: **104**. These contracts are locked and will receive UI coverage in their respective phases per H14.

## 2. Endpoint → screen / workflow map (Phase 1)

| ID | Method | Path | Used by |
|----|--------|------|--------|
| APL-001 | `GET` | `/api/v1/approvals` | W12 Approval inbox list |
| APL-002 | `GET` | `/api/v1/approvals/count` | Shell badges (approval count) |
| APL-003 | `GET` | `/api/v1/approvals/tasks/{taskId}` | W8–W11 Case file view |
| APL-004 | `POST` | `/api/v1/approvals/tasks/{taskId}/approve` | W8 Approve |
| APL-005 | `POST` | `/api/v1/approvals/tasks/{taskId}/forward` | W10 Forward |
| APL-006 | `POST` | `/api/v1/approvals/tasks/{taskId}/reject` | W9 Reject |
| APL-007 | `GET` | `/api/v1/approvals/tasks/{taskId}/request` | Case file request snapshot |
| APL-008 | `POST` | `/api/v1/approvals/tasks/{taskId}/revert` | W11 Revert |
| AUTH-001 | `POST` | `/api/v1/auth/bootstrap` | W1 Bootstrap |
| AUTH-002 | `POST` | `/api/v1/auth/change-password` | Change password (forced & self-service) |
| AUTH-003 | `GET` | `/api/v1/auth/csrf` | W2/H03 CSRF token |
| AUTH-004 | `POST` | `/api/v1/auth/forgot-password` | W3 Forgot password |
| AUTH-005 | `GET` | `/api/v1/auth/installation` | W1 Bootstrap (status check) |
| AUTH-006 | `POST` | `/api/v1/auth/login` | W2 Login |
| AUTH-007 | `POST` | `/api/v1/auth/logout` | W2 Logout |
| AUTH-008 | `GET` | `/api/v1/auth/me` | Shell auth boot (/auth/me) |
| AUTH-009 | `POST` | `/api/v1/auth/reset-password` | W3 Reset password |
| BRD-005 | `GET` | `/api/v1/public/configuration` | Public config (branding on login/shell boot) |
| CFG-001 | `GET` | `/api/v1/expense-configuration/categories` | New/edit request form (expense-config lookup) |
| CFG-006 | `GET` | `/api/v1/expense-configuration/natures` | New/edit request form (expense-config lookup) |
| CFG-009 | `GET` | `/api/v1/expense-configuration/request-types` | New/edit request form (expense-config lookup) |
| DOC-001 | `POST` | `/api/v1/documents` | W17 Document upload |
| DOC-002 | `GET` | `/api/v1/documents/requests/{requestId}` | Documents tab (per request) |
| DOC-003 | `GET` | `/api/v1/documents/{id}` | Document metadata |
| DOC-004 | `DELETE` | `/api/v1/documents/{id}` | Signed download URL |
| DOC-005 | `GET` | `/api/v1/documents/{id}/download-url` | Scan history |
| DOC-006 | `GET` | `/api/v1/documents/{id}/scans` | Delete document |
| MST-001 | `GET` | `/api/v1/master-data/currencies` | New/edit request form (master-data lookup) |
| MST-005 | `GET` | `/api/v1/master-data/exchange-rates` | New/edit request form (master-data lookup) |
| MST-008 | `GET` | `/api/v1/master-data/tax-authorities` | New/edit request form (master-data lookup) |
| MST-012 | `GET` | `/api/v1/master-data/vendors` | New/edit request form (master-data lookup) |
| NTF-001 | `GET` | `/api/v1/notifications` | Notifications inbox |
| NTF-002 | `POST` | `/api/v1/notifications/read-all` | Mark all read |
| NTF-003 | `GET` | `/api/v1/notifications/unread-count` | Unread count (badge) |
| NTF-004 | `POST` | `/api/v1/notifications/{id}/read` | Mark one read |
| ORG-001 | `GET` | `/api/v1/organization/branches` | New/edit request form (org lookup) |
| ORG-005 | `GET` | `/api/v1/organization/departments` | New/edit request form (org lookup) |
| ORG-009 | `GET` | `/api/v1/organization/profile` | New/edit request form (org lookup) |
| ORG-012 | `GET` | `/api/v1/organization/unit-types` | New/edit request form (org lookup) |
| ORG-013 | `GET` | `/api/v1/organization/units` | New/edit request form (org lookup) |
| REQ-001 | `GET` | `/api/v1/expense-requests` | My Requests / All Requests registers |
| REQ-002 | `POST` | `/api/v1/expense-requests` | W4 Create (draft) |
| REQ-003 | `GET` | `/api/v1/expense-requests/{id}` | Request detail |
| REQ-004 | `PUT` | `/api/v1/expense-requests/{id}` | W5 Edit |
| REQ-005 | `GET` | `/api/v1/expense-requests/{id}/activity` | W13 Timeline/activity |
| REQ-006 | `POST` | `/api/v1/expense-requests/{id}/cancel` | W7 Cancel/withdraw |
| REQ-007 | `POST` | `/api/v1/expense-requests/{id}/submit` | W6 Submit (and RETURNED→SUBMITTED resubmission) |
| RPT-001 | `GET` | `/api/v1/reporting/dashboard` | W15 Dashboard / Reports dashboard |
| RPT-002 | `POST` | `/api/v1/reporting/expense-requests/export` | W14 Export (CSV+XLSX) |
| RPT-003 | `GET` | `/api/v1/reporting/expense-requests/register` | Register report |
| RPT-004 | `GET` | `/api/v1/reporting/reports` | Report catalogue (admin Phase 2) |
| RPT-005 | `GET` | `/api/v1/reporting/widgets` | Widget catalogue (admin Phase 2) |
| SYS-001 | `GET` | `/api/v1/system/info` | Shell footer (optional, authenticated-only) |

## 3. Deferred endpoints (Phase 2 / Phase 3)

These endpoints have their contracts locked in Appendix A and types will be generated via OpenAPI codegen, but their UI screens are scheduled for later phases.

| Module | Count | Phase target |
|--------|------|--------------|
| Audit (`AUD-`) | 2 | Phase 2 |
| Business rules (`BR-`) | 9 | Phase 3 |
| Branding / configuration (`BRD-`) | 16 | Phase 2 (admin branding/settings) |
| Expense configuration (`CFG-`) | 9 | Phase 2 (config management — lookups already in Phase 1) |
| Committees (`CMT-`) | 10 | Phase 2 |
| Delegation (`DEL-`) | 5 | Phase 2 |
| Notification events (`EVT-`) | 2 | Phase 2 |
| Integrations (`INT-`) | 13 | Phase 3 |
| Approval limits (`LIM-`) | 18 | Phase 2 |
| Master data (`MST-`) | 12 | Phase 2 (master-data management screens — lookups already in Phase 1) |
| Organization (`ORG-`) | 12 | Phase 2 (org management — lookups already in Phase 1) |
| Roles (`ROL-`) | 7 | Phase 2 |
| SMTP (`SMT-`) | 4 | Phase 2 |
| Email templates (`TPL-`) | 7 | Phase 2 |
| Users (`USR-`) | 14 | Phase 2 |
| Workflow configuration (`WF-`) | 13 | Phase 3 |

## 4. Verification evidence

1. **Backend HEAD** confirmed at `93a89eb28cf4a17feae15abf572c51c14e45f0e7` with a clean working tree; no Java/migration/config/DTO files modified.
2. **Endpoint introspection** regenerated from source (`docs/phase-4j/_generated/controllers.json`): 206 endpoints across 26 controllers; all handler names resolved (no `?`); no `src/main/java/src/main/java/` path duplication.
3. **Permission catalogue** verified against `src/main/java/com/edam/common/security/Permissions.java` (60 codes, exact match).
4. **Bootstrap header** verified at `AuthController.java:196` → `X-Installation-Token` (prior handover's `X-EDAM-Bootstrap-Token` was wrong).
5. **CSRF** verified at `SecurityConfig.java:185` → `CookieCsrfTokenRepository.withHttpOnlyFalse()`, cookie `XSRF-TOKEN`, header `X-XSRF-TOKEN`.
6. **Public endpoints** verified against `SecurityConfig.publicMatchers()`: 8 business endpoints public (AUTH-001, 003, 004, 005, 006, 007, 009 + BRD-005). `/api/v1/system/info` is authenticated (deny-by-default).
7. **XLSX export** verified from `ReportingDtos.java:107` (`enum ExportFormat { CSV, EXCEL }`) and `ReportingService.streamExcel()` (Apache POI SXSSF streaming writer). PDF/print are not implemented.
8. **Approval actions** verified from `ApprovalController.java` methods: `approve`, `reject`, `revert`, `forward` at `/approvals/tasks/{taskId}/<action>`.
9. **Request actions** verified from `ExpenseRequestController.java`: `create` (POST `/expense-requests`), `update` (PUT `/{id}`), `submit` (POST `/{id}/submit`), `cancel` (POST `/{id}/cancel`). RETURNED→SUBMITTED resubmission uses `submit` (no separate resubmit endpoint).
10. **Module ID prefix collision** resolved: `APL-` = Approval Inbox & Actions, `LIM-` = Approval Limits.
11. **`request:view` scope model** verified from `ExpenseRequestController` class Javadoc (lines 51–55) + `RequirePermissionAspect.java`: controller gate is `request:view-own`; service layer widens for `request:view-scope` and `request:view-all` holders.
12. **Envelope shapes** (`ApiResponse`, `PageResponse`, error handling) read from `src/main/java/com/edam/common/api/` and `src/main/java/com/edam/common/exception/GlobalExceptionHandler.java`.
13. **Document flow** verified from `src/main/java/com/edam/documents/controller/DocumentController.java`: multipart upload, 5-minute signed download URLs, malware-scan status polling.
14. **No backend code was changed**: `git status` will show only additions under `docs/Frontend Handover/`.

## 5. Source files referenced (read during this handover)

- `src/main/java/com/edam/common/api/{ApiResponse,PageResponse,PageQuery,ErrorCode,ApiPaths}.java`
- `src/main/java/com/edam/common/exception/{GlobalExceptionHandler,BusinessException,EdamException,ValidationFailedException}.java`
- `src/main/java/com/edam/common/security/{Permissions.java,EdamPermission.java,RequirePermissionAspect.java}`
- `src/main/java/com/edam/config/SecurityConfig.java`
- `src/main/java/com/edam/identity/controller/AuthController.java`
- `src/main/java/com/edam/identity/dto/AuthDtos.java`
- `src/main/java/com/edam/expenserequest/controller/ExpenseRequestController.java`
- `src/main/java/com/edam/expenserequest/dto/ExpenseRequestDtos.java`
- `src/main/java/com/edam/workflow/controller/ApprovalController.java` (package `workflow`, not `approval`)
- `src/main/java/com/edam/workflow/dto/ApprovalDtos.java`
- `src/main/java/com/edam/documents/controller/DocumentController.java`
- `src/main/java/com/edam/documents/dto/DocumentDtos.java`
- `src/main/java/com/edam/reporting/controller/ReportingController.java`
- `src/main/java/com/edam/reporting/service/ReportingService.java`
- `src/main/java/com/edam/reporting/dto/ReportingDtos.java`
- `src/main/java/com/edam/web/SystemController.java`
- `src/main/java/com/edam/configuration/controller/ConfigurationController.java`
- `docs/phase-4j/_generated/{controllers,dtos,entities,permissions,migrations}.json` (machine introspection)
