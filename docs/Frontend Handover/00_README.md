# Frontend Handover — README

**Package:** EDAM React + TypeScript frontend blueprint (Phase 0, documentation only)
**Backend baseline:** commit `93a89eb28cf4a17feae15abf572c51c14e45f0e7` on branch `main` (PR #22 merged)
**Generated:** 2026-11-18
**Total `/api/v1` endpoints covered:** 206 (8 public, 3 authenticated-only, 195 permission-guarded)
**Total permissions in catalogue:** 60

This directory is the **authoritative handover** from the EDAM backend team to the frontend team.
It supersedes `docs/Frontend Integration/` (which contained 10 verified inaccuracies — see H17) and
`docs/phase-4j/FRONTEND_MASTER_INTEGRATION_GUIDE.md`. It is documentation only: no source code,
no `package.json`, no Vite scaffold, no commits/branches/PRs, and no backend modifications.

## How to read this package

Read in this order, then use the rest as reference.

| # | File | Purpose |
|---|------|---------|
| 01 | H01_FRONTEND_HANDOVER_BASELINE.md | Backend commit, conventions, environment variables, glossary |
| 02 | H02_API_CONTRACTS_AND_RESPONSE_ENVELOPE.md | `ApiResponse`, `PageResponse`, error envelope, HTTP status → code map, OpenAPI codegen recipe |
| 03 | H03_AUTH_SECURITY_CSRF.md | Session cookie, CSRF (`XSRF-TOKEN` cookie / `X-XSRF-TOKEN` header), bootstrap header `X-Installation-Token`, login/logout/password flows |
| 04 | H04_PERMISSIONS_NAVIGATION_AND_ACCESS_CONTROL.md | All 60 permissions, data-scope model, role→nav mapping, UI gate rules |
| 05 | H05_END_TO_END_BUSINESS_WORKFLOWS.md | 17 sequenced workflows (W1–W17): user journey → route → API sequence → perm → state → errors |
| 06 | H06_VALIDATION_FORM_AND_ERROR_HANDLING.md | Client validation matrix, server validation parsing, optimistic-lock/idempotency, UX patterns |
| 07 | H07_FRONTEND_ARCHITECTURE.md | Stack decision (React 18 + TS + Vite + TanStack Query/Router + shadcn/ui + Tailwind), folder layout, data/query/error/security layers |
| 08 | H08_DESIGN_SYSTEM_AND_UI_UX.md | Design tokens, typography, components, responsive, motion, accessibility |
| 09 | H09_SCREEN_AND_ROUTE_INVENTORY.md | Every route/screen, layout slot, component contract, empty/loading/error/denied states |
| 10 | H10_API_TO_SCREEN_MAPPING.md | Cross-reference: screen → APIs it calls → required perms → required data shapes |
| 11 | H11_FILE_AND_DOCUMENT_INTEGRATION.md | Document upload, association, virus-scan polling, preview/download |
| 12 | H12_REPORTING_AND_EXPORT_INTEGRATION.md | Dashboard, register/report widgets, CSV + **XLSX streaming export** (PDF/print out of scope), filter model |
| 13 | H13_TESTING_STRATEGY.md | Unit, integration (MSW), E2E (Playwright), contract-testing against OpenAPI |
| 14 | H14_PHASED_ROADMAP.md | Phase 1–4 plan, acceptance criteria per phase, done gates |
| 15 | H15_OPEN_DECISIONS_AND_RISKS.md | Outstanding decisions, known gaps, mitigations, contact owners |
| 16 | H16_TRACEABILITY_AND_VERIFICATION.md | Coverage matrix: every endpoint referenced by at least one screen/flow, with source-file evidence |
| 17 | H17_DEPLOYMENT_AND_LOCAL_SETUP.md | Local dev (Docker + backend runbook), production build, environment variables, CSP/CORS checklist |

Supporting appendix:

- `APPENDIX_A_ENDPOINT_INVENTORY.md` — the full 206-endpoint table (supporting reference, cited by every H-file).
- `docs/phase-4j/_generated/{controllers,dtos,entities,permissions,migrations}.json` — the raw introspection output that backs every claim in this package.

## Correction log vs. `docs/Frontend Integration/`

Ten verified inaccuracies in the prior handover are corrected here:

1. **Bootstrap header is `X-Installation-Token`**, not `X-EDAM-Bootstrap-Token` (`AuthController.java:196`).
2. **XLSX export IS implemented** via `ExportFormat.EXCEL` + `ReportingService.streamExcel` (SXSSF streaming, `application/vnd.openxmlformats-officedocument.spreadsheetml.sheet`).
3. Only **PDF and print** are not implemented; XLSX must be surfaced in the UI.
4. Baseline metadata updated: backend is on **merged** PR #22 at commit `93a89eb` (not "open" at `f3a8bc4`).
5. The seven `?` handler names are resolved: `approve`, `reject`, `revert`, `forward`, `update`, `submit`, `cancel`.
6. Module ID prefix collision fixed: **`APL-` = Approval Inbox & Actions**, **`LIM-` = Approval Limits** (the prior handover used `APR-`/`APL-` inconsistently).
7. All 206 duplicated `src/main/java/src/main/java/` source paths removed; paths now relative to repo root.
8. **"All Requests" permission:** controller gate is `request:view-own`; the service layer enforces data scopes. Separate catalogue codes `request:view-scope` and `request:view-all` exist and grant wider scope; all three codes pass the controller gate because scopes are resolved at the service layer (`RequirePermissionAspect.java`).
9. **RETURNED → SUBMITTED resubmission** reuses the existing `POST /api/v1/expense-requests/{id}/submit` endpoint; no separate "resubmit" endpoint exists.
10. **`/api/v1/system/info` is authenticated (deny-by-default)**, not public. Only the 8 endpoints listed in AUTH-001..009 and `GET /api/v1/public/configuration` are public.

## What is NOT in this package

- **No source code, no scaffolding.** Per direction, Phase 0 is docs only. Phase 1 will add `package.json`, Vite, and scaffolding after this handover is reviewed.
- **No hand-transcribed TypeScript types for all 189 DTOs.** H02 documents the codegen recipe (`openapi-typescript` against a running `/v3/api-docs`) so the frontend gets types directly from SpringDoc — hand-transcribing would drift immediately.
- **No backend changes.** No Java, migration, config, or security files were touched; HEAD remains `93a89eb` with a clean working tree.

---

*Source of truth: `src/main/java/com/edam/**`, verified against `docs/phase-4j/_generated/*.json`.*
