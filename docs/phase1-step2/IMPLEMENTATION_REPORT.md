# Phase 1 / Step 2 — Dashboard and Expense Request Management

**Status:** frontend implementation and mocked/contract verification delivered. This is not a claim of live frontend/backend integration, production verification, full WCAG/axe certification, or Step 2 product completion. One H04/H09 route-policy conflict and several backend contract gaps remain open for product-owner decision; see item 18.

## 18-item delivery report

1. **Branch and baselines.** Work is on `arena/500e74a7-edam-frontend`, branched from frontend `main` merge commit `bb5f1f3def04e6ad3bc0eb7af9b894eefce02afb`. Backend reference `main` is `2835eb55d6595a56d43cabb5eb83370b5ca2b2b2`; its clone was read-only. The 19 finalized `docs/Frontend Handover/` files remain unchanged. Delivery commit/PR/CI metadata: **see `## Delivery metadata` below.**

2. **Contract gate.** `docs/phase1-step2/CONTRACT_AND_DECISION_GATE.md` records the endpoint/permission matrix, lookup paths, DTO/lifecycle facts, idempotency rules and eight contract gaps. The pinned OpenAPI artifact is `229310` bytes with SHA-256 `9533c5a5a9ce3044b2543cabaa7db09952b26c9e8581e08baf9889c33df2843d`; `npm run types:check` regenerated `src/api/generated/schema.d.ts` byte-identically.

3. **Dashboard.** `/app/dashboard` renders only fields from `GET /reporting/dashboard`: base currency, metric cards, four distribution lists, trend buckets, provenance, and permitted navigation. Empty and error states are explicit. No KPI, total, chart, notification or activity value is fabricated, and monetary values are not FX-reconverted. The sole business-data endpoint is enabled only with `report:view`.

4. **My Requests.** `/app/requests/mine` calls the one documented register endpoint with `mineOnly=true`, `page`, `size` and the spec-verified `search` / `status` / `departmentId` / `categoryId` filters. The UI states the backend-fixed newest-created-first order and exposes no nonfunctional `sort` control. Pagination and backend-shaped empty/error/loading states are implemented.

5. **All Requests.** `/app/requests/all` uses the same endpoint with `mineOnly=false`. Backend visibility remains authoritative; no frontend reproduction of `ExpenseRequestService.isVisible()`, no separate permission-catalogue rule, and no client-side scope filtering are introduced. A backend 403 is shown rather than masked.

6. **New Request.** `/app/requests/new` builds a generated `CreateRequest` payload from permission-aware backend lookups. Required header fields, optional typed OPEX/CAPEX details and optional child rows are token-driven; `decimal.js-light@2.5.1` parses form decimals before transport. Document-dependent OPEX flags and upload/download workflows remain deliberately deferred. Cross-field validation, classification, CAPEX eligibility and completeness remain backend-authoritative.

7. **Edit Request.** `/app/requests/$id/edit` uses `UpdateRequest`, which omits `departmentId`, `documents` and `version`. The department is displayed as backend-retained. Because backend replacement clears details/child rows while pinned response DTOs omit several payload-only fields, safe replacement is deliberately limited to header-only records. Richer records show an explicit contract-decision state and send no `PUT`; see `hasUnpreservableDetail()` and item 18.

8. **Request Details and Activity.** `/app/requests/$id` renders documented response fields, nested response sections and the authorized keyset activity endpoint (`size` / `cursor`, no page number). Detail views tolerate absent/null generated fields. No client-side status flip or status-name heuristic decides lifecycle behavior.

9. **Submit and Cancel.** Actions appear only when both the backend `canEdit` / `canSubmit` / `canCancel` flags and the signed-in permission codes allow them. Submit uses the documented no-body endpoint. Cancel requires a reason (max 500 characters) in an accessible dialog and sends generated `CancelRequest`. Both reuse explicit idempotency keys per gesture and refresh from backend state after success.

10. **Permissions and route guards.** The H04 Dashboard navigation exception and H09 `RequirePermission` / `getRouteRequirement()` `report:view` guard are preserved exactly; the guard is not weakened. Dashboard widgets are behind `report:view`, lookup queries are disabled when their documented permission is absent, and the UI states unavailability instead of inventing reference options. Backend authorization remains authoritative.

11. **Idempotency and recovery.** `src/api/client.ts` resolves one key per write gesture and reuses it across CSRF retries. `EDAM-1005` retries with the same key after `2000 ms`, at most three times, without an error toast. `EDAM-1004` offers a new key; `EDAM-1006` asks for reconciliation; `EDAM-3002` / `3003` and state conflicts request reload. `/auth/login` never receives `Idempotency-Key`. These behaviors are covered by client and integration tests.

12. **Validation and errors.** Client validation checks only transport/field shapes; server `fieldErrors[]` are mapped to controls (`opexDetail.*` → `opex.*`), and a reusable recovery panel shows user-safe guidance and support references. Error, empty, loading, permission-denied and lookup-unavailable states are contract-faithful and do not display sample records outside explicitly labelled harnesses.

13. **API architecture.** New generated DTO aliases, typed request/reporting services, React Query hooks and namespaced dashboard/request/activity/lookup query keys were added. No `If-Match`, payload version, H10-only lookup path, blanket `currency:view` vendor rule, or unsupported repeatable `sort` value is introduced. Query invalidation refreshes request and dashboard views after writes.

14. **Design-system and accessibility foundations.** New textarea, empty/loading feedback and form/recovery controls use existing tokens. `FormField` now gives labels stable IDs and `SelectField` associates its trigger with that label while staying controlled for its lifetime; dialogs and tables remain responsive. This is not a full axe/WCAG certification; deterministic token contrast and browser-harness accessible-name checks are reported below.

15. **Automated tests.** `npm test` passed **14 files / 91 tests**. New tests cover the pinned Step 2 OpenAPI operations and DTO omissions, typed services and query shapes, EDAM-1005/CSRF idempotency recovery, form state/payload/validation/search/format/recovery helpers, and 14 MSW-backed dashboard/request route flows. MSW now mocks Step 2 lookup, list, detail, activity, write, dashboard and error envelopes.

16. **Responsive browser harness.** `npm run responsive:check` passed **44/44** route/viewport checks at desktop `1440×900`, tablet `834×1112` and mobile `390×844`; it inspected **391** interactive controls, **17** forms and **3** data tables. The extended harness covers public/auth screens, all Step 2 routes, empty/error/permission-denied scenarios and mobile navigation. Report: `docs/phase1-step2/responsive-check.json`.

17. **Visual audit and screenshots.** `npm run visual:audit` passed **65** route/viewport checks with **29** screenshots and **0** failures across six audit widths; captures are at desktop/tablet/mobile. All screenshots are labelled `DEVELOPMENT PREVIEW`, use synthetic intercepted API envelopes, and are not production evidence. Files: `docs/phase1-step2/screenshots/` and `visual-audit.json`.

18. **Open decisions, limitations and stop scope.** Product owner must decide the H04/H09 Dashboard route/nav conflict (preserved, not silently resolved) and the lossy replacement DTO gap (richer edits stopped). Backend must decide whether to honor client `sort`, expose full round-trip detail/document fields, or provide a non-replacing update contract. Document upload/download, approvals, reporting register/export, widget/report catalogue, admin, dark mode, live Spring Boot/PostgreSQL integration, production deployment and full axe/WCAG verification remain out of scope. Contract tests, MSW tests and browser-harness checks are explicitly distinguished from live integration tests.

## Verification gates

- `npm run typecheck`: passed (`routes:generate` + `tsc --noEmit`).
- `npm run lint`: passed (`--max-warnings=0`).
- `npm test`: passed, 14 files / 91 tests.
- `npm run build`: passed; Vite transformed **1932 modules**; CSS `52.61 kB` (`10.13 kB` gzip), main JS `345.01 kB` (`108.99 kB` gzip).
- `npm run types:check`: passed; pinned snapshot checksum verified and generated schema byte-identical.
- `npm run check:design`: passed; **298 tokens**, **246 referenced variables**, **134 TS/TSX files**, **19 token contrast pairs** all `>= 4.5:1`.
- `npm run responsive:check`: passed, **44/44**.
- `npm run visual:audit`: passed, **65 checks / 29 screenshots / 0 failures**.
- `git diff --check`: passed.

## Delivery metadata

- Implementation branch: `arena/500e74a7-edam-frontend`.
- Implementation commit: `eb89018f695f39cab7695e8afc9b359e4fe93ac8` (pushed to the working branch).
- Pull request: [#5](https://github.com/Jhamankhatri/edam-frontend/pull/5), `OPEN`, not a draft, not merged. It is intentionally left open/unmerged.
- CI on the implementation commit: push run `44474884478` (`success`) and pull-request run `44474915430` (`success`). Both PR checks — `Pinned OpenAPI snapshot and generated types` and `Typecheck, lint, test and build` — passed.
- Final PR head: `ad27effed5e8f4d12add3e1d2168dbb8bc20264a`. The last two commits contain delivery metadata only, not product code. Final push run `44475267632` and PR run `44475276902` both completed `success`.
