# EDAM Frontend — Phase 1 / Step 1 Final Report

**Date:** 2026-11-18

**Scope:** Phase 1, Step 1 — Premium Design Foundation + Authentication + Role-Based Access only.

**Outcome:** Implemented, verified, committed, pushed, and opened as a pull request. Step 1 is the stopping point; no later phase was implemented.

---

## 1. Executive summary and stop condition

Step 1 delivers a reviewed frontend foundation: strict TypeScript tooling, the H08 design system, reusable UI primitives, responsive public/auth layouts and app shell, session-cookie authentication, CSRF handling, permission-based route/navigation rules, typed API/client plumbing, and automated unit/flow/responsive verification.

The work stops after Step 1. There are no business-module implementations, no dashboard data calls, no backend source edits, no `main` push, and no pull-request merge. Open documentation-vs-source questions are recorded rather than resolved by inventing contracts.

---

## 2. Documentation and source baseline reviewed

The 19 finalized Markdown handover files in `docs/Frontend Handover/` were reviewed:

- `00_README.md`
- `APPENDIX_A_ENDPOINT_INVENTORY.md`
- `H01_FRONTEND_HANDOVER_BASELINE.md`
- `H02_API_CONTRACTS_AND_RESPONSE_ENVELOPE.md`
- `H03_AUTH_SECURITY_CSRF.md`
- `H04_PERMISSIONS_NAVIGATION_AND_ACCESS_CONTROL.md`
- `H05_END_TO_END_BUSINESS_WORKFLOWS.md`
- `H06_VALIDATION_FORM_AND_ERROR_HANDLING.md`
- `H07_FRONTEND_ARCHITECTURE.md`
- `H08_DESIGN_SYSTEM_AND_UI_UX.md`
- `H09_SCREEN_AND_ROUTE_INVENTORY.md`
- `H10_API_TO_SCREEN_MAPPING.md`
- `H11_FILE_AND_DOCUMENT_INTEGRATION.md`
- `H12_REPORTING_AND_EXPORT_INTEGRATION.md`
- `H13_TESTING_STRATEGY.md`
- `H14_PHASED_ROADMAP.md`
- `H15_OPEN_DECISIONS_AND_RISKS.md`
- `H16_TRACEABILITY_AND_VERIFICATION.md`
- `H17_DEPLOYMENT_AND_LOCAL_SETUP.md`

The frontend base is `main` commit `37c0a02f79728ea4a95a88b3952b864fb81b7309` (merged PR #2). The read-only backend source baseline is `Jhamankhatri/edam` `main` `620f7a795cc67a16e905115131f561bbd986af85`. The backend auth/security/DTO/public-configuration/permission/error-envelope Java sources and generated backend evidence were checked against the docs; the backend repository was not modified.

---

## 3. Architecture and project structure

Pinned stack: React 18.3.1, TypeScript 5.6.3, Vite 5.4.21, TanStack Router/CLI/plugin 1.160.0, React Query 5.108.0, Tailwind CSS 3.4.17, Vitest 2.1.9, MSW 2.7.0, Radix UI primitives, React Hook Form, Zod, and headless Chromium/Puppeteer for responsive checks. Router 1.160.0 was selected because 1.169.0 requires Vite 6.

Key structure:

- Root: `package.json`, `package-lock.json`, strict `tsconfig.json`, `tsr.config.json`, `vite.config.ts`, Tailwind/PostCSS/ESLint config, `.env.example`, `index.html`, and lightweight `.github/workflows/frontend-ci.yml`.
- `src/api/`: `endpoints.ts`, `contracts.ts`, `client.ts`, `csrf.ts`, `errors.ts`, `envelope.ts`, `services/auth.ts`.
- `src/auth/`: `AuthProvider.tsx`, `auth-context.ts`, `guards.tsx`, `permissions.ts`, generated `permission-codes.ts`, `session-events.ts`, `useSignOut.ts`.
- `src/config/`: environment, navigation, route-access rules, and the generated 60-code permission catalogue.
- `src/components/ui/`: 15 reusable primitives (button, input, label, card, badge, skeleton, alert, select, table, dialog, drawer, dropdown-menu, tooltip, toaster, password-input); the unused `textarea.tsx` and `EmptyState.tsx` were removed by the audit.
- `src/components/{brand,feedback,forms,auth,layout}/`: brand mark, feedback states, form field wrapper, auth-expiry redirector, public layout, breadcrumbs, user menu, sidebar, mobile nav, topbar, and app shell.
- `src/features/auth/`: login, bootstrap, forgot-password, reset-password, change-password forms and success card.
- `src/routes/`, `src/routeTree.gen.ts`, `src/router.tsx`, `src/main.tsx`: generated file-based routes, shared `createAppRouter(history?)`, `trailingSlash: 'never'`, and app bootstrap.
- `src/test/`: Vitest/MSW fixtures, server, setup, render helpers, and 8 specs.
- `scripts/`: `generate-permission-codes.mjs` and `responsive-check.mjs`.
- `docs/`: approved handovers, `PHASE1_STEP1_CONTRACT_NOTES.md`, and this final report.

Strict TypeScript uses the `@/* → src/*` alias. Browser code uses same-origin relative API URLs; Vite proxies `/api`, `/v3/api-docs`, `/swagger-ui`, and `/actuator` to `http://127.0.0.1:8080`. Dev and preview bind to `0.0.0.0` with `allowedHosts: true`.

---

## 4. Design system and UX foundation

`src/styles/tokens.css` and `src/styles/index.css` implement H08 fallback tokens as CSS custom properties on `:root`, including `--radius: .5rem`. `src/lib/theme.ts` accepts backend camelCase theme keys and maps prefixed/kebab/snake aliases without rejecting persisted keys. Tailwind maps colors to CSS variables. The strict audit centralized all semantic surfaces, status colors, typography, spacing, widths, and shadows; removed scattered palette/white-alpha utilities and repeated arbitrary values; and shared global classes such as `.auth-card`, `.glass-card`, `.elevated-card`, and `.feedback-icon`. `index.html` no longer hardcodes a theme color; `src/lib/theme.ts` remains the isolated runtime-branding layer.

The design foundation includes:

- Commercial-banking palette, glass panels, soft shadows, display typography, Lucide icons, and professional empty/error/loading/access-denied/not-found states.
- 150ms transitions with `prefers-reduced-motion` protection.
- WCAG 2.1 AA as a design target, semantic headings, labelled fields, visible focus rings, and at least 40×40 CSS-px interactive targets (with a 0.5px subpixel tolerance in the responsive script for transformed controls).
- Responsive rules: sidebar collapses below `lg`, mobile drawer below `lg`, forms are single-column below `md`, and table wrappers are prepared for horizontal scrolling below `md`.

---

## 5. Screens, routes, and reusable components

Implemented public/auth flows:

- `/login` — `Sign in to EDAM`
- `/bootstrap` — `Create the administrator`; HTTP 201 semantics; no session established
- `/forgot-password` — neutral reset-request response
- `/reset-password?token=…` — token-aware reset form and success card
- `/change-password` — mandatory password-change layout and policy display
- Not-found, initialization-error, access-denied, loading, and empty states

Implemented protected foundations:

- `/app/dashboard`, `/app/requests/mine`, `/app/requests/all`, `/app/requests/new`, `/app/requests/$id/`, `/app/requests/$id/edit`, `/app/approvals/`, `/app/approvals/tasks/$taskId`, `/app/notifications/`.
- Each module uses a professional `ModulePlaceholder`; no business data, metrics, or actions are simulated.
- `AppShell` contains `Sidebar`, `MobileNav`, `Topbar`, `Breadcrumbs`, `UserMenu`, notification/approval badges, and the routed main content.

---

## 6. API contracts and endpoints integrated

`src/api/contracts.ts` is a source-transcribed Step-1 contract, not generated OpenAPI output. The audit added `src/api/envelope.ts` as the single runtime `ApiResponse` envelope validator and removed duplicate JSON parsers from the client and CSRF modules. The envelope is `ApiResponse<T>` with `success, data, error, fieldErrors, correlationId, path, timestamp`; errors expose `{ code, message }` and conditional logic keys off `EDAM-nnnn` codes. Network and non-JSON failures normalize to `ApiError`.

Step-1 integrated endpoints under `/api/v1`:

`/auth/bootstrap`, `/auth/change-password`, `/auth/csrf`, `/auth/forgot-password`, `/auth/installation`, `/auth/login`, `/auth/logout`, `/auth/me`, `/auth/reset-password`, `/public/configuration`, `/approvals/count`, `/notifications/unread-count`.

Exactly eight H02 idempotent routes receive `Idempotency-Key`:

- `POST /expense-requests`
- `PUT /expense-requests/{id}`
- `POST /expense-requests/{id}/cancel`
- `POST /expense-requests/{id}/submit`
- `POST /approvals/tasks/{id}/approve`
- `POST /approvals/tasks/{id}/forward`
- `POST /approvals/tasks/{id}/reject`
- `POST /approvals/tasks/{id}/revert`

No `Idempotency-Key` is attached to `/auth/login`. `GET /approvals/count` is typed as `Long`; `GET /notifications/unread-count` is typed as `{ count: number }`. `X-Installation-Token` is used only for bootstrap. No lookup, reporting, document, workflow, or business-module endpoint is called in Step 1.

---

## 7. Authentication, session, and CSRF verification

Backend source verification established that login persists the `SecurityContextRepository`, `/auth/bootstrap` returns 201 without authenticating, `AuthDtos` return no bearer token, and `JSESSIONID` is the only credential. The frontend therefore uses `credentials: 'include'` and no JWT, `Authorization`, localStorage, or sessionStorage credential.

`src/api/client.ts` and `src/api/csrf.ts`:

- Prime `GET /auth/csrf` before the first write.
- Read the actual readable `XSRF-TOKEN` cookie and send `X-XSRF-TOKEN`.
- Retry once on raw 403 CSRF failure after re-priming.
- Retry one GET network failure.
- Publish `auth:expired` only for relevant unauthenticated responses; initialization `/auth/me` suppresses expiry publication.

`AuthProvider` initializes configuration, current user, installation status, and CSRF with `Promise.allSettled`, applies public branding, preserves valid sessions, hides protected content until verification, clears React Query data on expiry, and does not set user state after bootstrap. Guards preserve a safe `returnTo` `href`, and login navigates to the validated `href` or `/app/dashboard`.

Automated coverage includes exact CSRF/session-cookie login behavior, bootstrap 201/no-session semantics, forced password change, initialization retry, expiry redirect, and client retry/error behavior.

---

## 8. RBAC, guards, and navigation

`src/config/permission-catalogue.json` and generated `src/auth/permission-codes.ts` contain exactly 60 unique backend permission codes. `document:view` is intentionally absent: it appears in docs but not in `Permissions.java` or backend generated evidence.

RBAC uses permissions, not roles. Centralized `RequireAuth`, `RequireAnonymous`, `RequirePermission`, and `RequirePasswordChange` guards enforce initialization, anonymous, authenticated, permission, and mandatory-password-change states. `src/config/navigation.ts` now holds metadata only, while `src/config/route-access.ts` is the sole permission-rule source through `getNavigationRequirement()` and `getRouteRequirement()`. The H04/H09 dashboard exception is explicit and tested. Unauthorized actions are hidden and routes show `AccessDenied`. Frontend checks are UX only; the backend remains authoritative.

Dashboard conflict decision: H04 says the Dashboard nav is visible to every authenticated user and widgets require `report:view`; H09/Appendix A require `report:view` for the route. Step 1 shows the nav item to authenticated users, guards the route/placeholders with `report:view`, shows access denied to users without it, and calls no dashboard API. This remains an unresolved product wording decision, not a backend contract change.

---

## 9. Forms, validation, and error handling

Forms use React Hook Form + Zod with `FormField` labels, hints, `aria-invalid`, inline error text, and alert regions. `src/forms/server-errors.ts` maps backend `fieldErrors` into RHF field errors only through caller-supplied `FieldPath<T>` allowlists, so unexpected backend field names are never asserted into form state. It does not guess codes. `formatApiError` and `ApiError` normalize validation, authentication, permission, CSRF, network, and non-JSON failures.

Password policy is displayed from `CurrentUserResponse.passwordPolicy`. Because the backend publishes `requireSpecial` without an accepted character class, no special-character regex was invented; the server's `EDAM-2008 WEAK_PASSWORD` remains authoritative. Bootstrap sends `X-Installation-Token` in the documented header and never establishes a session.

---

## 10. Responsive verification

`scripts/responsive-check.mjs` launches bundled headless Chromium, intercepts handover-shaped API envelopes in-browser, and checks nine routes at three viewports: desktop 1440×900, tablet 834×1112, and mobile 390×844. It asserts expected headings, no horizontal overflow, accessible names, 40×40 touch targets, single-column forms below `md`, table horizontal-scroll wrappers below `md`, desktop-sidebar/mobile-drawer behavior, primary navigation availability, and no unexpected runtime/console/HTTP/API errors. It also opens the mobile/tablet navigation drawer before auditing.

Results:

| Target | Route/viewport checks | Controls | Forms | Data tables | Result |
|---|---:|---:|---:|---:|---|
| Dev server `http://127.0.0.1:5173` | 27/27 passed | 201 | 15 | 0 | PASS |
| Production preview `http://127.0.0.1:4173` | 27/27 passed | 201 | 15 | 0 | PASS |

Sidebar visibility, mobile trigger visibility, drawer navigation, no horizontal overflow, accessible names, and touch targets passed at all checked widths. Zero data tables are implemented in Step 1, so the horizontal-scroll rule is structurally available but has no table instances to exercise yet.

---

## 11. Unit/flow tests and static quality gates

| Command | Result |
|---|---|
| `npm ci --no-audit --no-fund` | Passed; 649 packages from lockfile |
| `npm run routes:generate` | Passed; generated `src/routeTree.gen.ts` with no test-file route warning |
| `npm run typecheck` | Passed (`routes:generate` + `tsc --noEmit`) |
| `npm run lint` | Passed with `--max-warnings=0` and zero warnings |
| `npm test` | 8 files / **47 tests** passed after audit corrections |
| `npm run build` | Passed; 1893 modules transformed; built in 4.63s |
| `npm run contracts:permissions` | Passed; 60 codes; no generated diff |
| `git diff --check` | Passed |

Test coverage spans endpoint/idempotency rules (all eight documented routes plus near-miss negatives), API client CSRF/retry/error/raw-response/malformed-envelope behavior, privileged-header and storage restrictions, permission helpers, theme token aliases including runtime meta creation, server field-error allowlists, UI primitives, `AuthProvider` lifecycle, and end-to-end-in-jsdom login/bootstrap/password-change route flows. Final audit evidence is under `/tmp/audit-*.txt`, `/tmp/audit-*.json`, and `/tmp/tailwind-audit-final.css`; local CI-equivalent output is `/tmp/audit-ci-local-final.txt`.

---

## 12. Production build and runtime/dev/preview verification

`npm run build` produces a route-split production bundle in `dist/` (705K total / 29 files; main JS 341.48 kB / 107.65 kB gzip, CSS 31.54 kB / 6.83 kB gzip). Generated artifacts remain ignored by Git. `autoCodeSplitting: true` remains enabled and emits route-level chunks.

Live processes in this workspace:

- `EDAM Frontend` — Vite dev server on `0.0.0.0:5173`.
- `EDAM Production Preview` — Vite preview on `0.0.0.0:4173`.
- `EDAM Mock API` — local in-memory mock API on `0.0.0.0:8080` for preview/demo only; it is not committed and is not the Spring Boot backend.

Both dev and preview proxy same-origin `/api/v1/...` calls to the local mock API; `/api/v1/public/configuration` returned HTTP 200 with a valid envelope on each. After the audit corrections, a cookie-isolated browser smoke test loaded `/login` on each server, signed in with `admin` / `InitialPass1`, reached `/app/dashboard`, and verified the primary nav, user menu, and Dashboard heading. No browser runtime errors were observed. Start/preview host configuration permits the Arena preview host; no preview-breaking host/origin warning was reported.

---

## 13. Accessibility and quality posture

The implementation targets WCAG 2.1 AA with semantic landmarks/headings, visible focus styles, labelled inputs, icon-button accessible names, reduced-motion support, neutral error messaging, and 40×40 touch targets. The responsive script checks accessible names and target sizes across all nine routes and three viewports.

A full automated axe contrast/tree audit, screen-reader pass, keyboard-only traversal of every future business module, and live assistive-technology review were **not** performed. Those remain later-phase verification tasks. Step 1 only contains foundation forms and placeholder modules.

---

## 14. Limitations and unresolved contract questions

`docs/PHASE1_STEP1_CONTRACT_NOTES.md` records 12 exact discrepancies/decisions:

1. Approved docs name backend PR #24 `38cedbc` while remote `main` is `620f7a…`; PR #25 was docs-only.
2. H02 §3 HTTP status mappings: **resolved** with backend-source evidence — four stale statuses (`EDAM-3001`/`3004` → 422, `EDAM-5003` → 502, `EDAM-5001` → 409 or 503) and one earlier audit error (`EDAM-5005` → 400 is correct). The client still keys off `error.code`; see §18.
3. H08 theme-token naming differs from `PublicConfigurationService`; the frontend maps prefixed/camel/kebab/snake aliases.
4. H17 requires `X-Installation-Token` in CORS but `CorsConfig` omits it; same-origin proxy avoids a frontend workaround.
5. H10 lookup paths and permissions: **resolved** against the genuine pinned OpenAPI JSON and backend controllers; all five H10-only paths are absent, and nine canonical paths are locked in code and tests. Step 1 still calls no lookup endpoint; see §18.
6. H04/H09/Appendix A dashboard wording conflicts; the stricter route permission is used.
7. Required OpenAPI codegen: **resolved** — the genuine artifact from backend Actions run `44395699755` is pinned with a verified SHA-256, `src/api/generated/schema.d.ts` is generated from it, and CI fails on drift; see §18.
8. `PasswordPolicyView.requireSpecial` publishes no character class; no regex is invented.
9. H07 names `app/layout.tsx`; TanStack Router 1.160 requires `app/route.tsx`.
10. H09 places `/change-password` in the app shell; Step 1 uses the restricted public security layout before mandatory password change.
11. `PublicConfigurationResponse.activeThemeType` is Java `String`; TypeScript uses `string | null`.
12. `document:view` is docs-only, not one of the 60 backend permission codes.

Other limitations (unchanged): no live Spring Boot/PostgreSQL E2E run, no full WCAG/axe audit, no production deployment, no business modules, and no reporting/dashboard data. The strict H02/H07/H17 conformance residuals with explicit gates are tabulated in `docs/PHASE1_STEP1_ENGINEERING_AUDIT.md` §12.1 and §14. Section 13 of `docs/PHASE1_STEP1_CONTRACT_NOTES.md` classifies all 12 discrepancies; Category 1 (§7) and Category 2 (§2, §5) are now **cleared** with the genuine artifact and backend-source evidence, leaving Category 3/4 gates as recorded. PR #3 remains open and unmerged because the owner asked for review before any merge.

---

## 15. Feature branch, commit, push, and pull request

- Fixed feature branch: `arena/807bbe3c-edam-frontend`
- Branch status: `pr_open`
- Base commit: `37c0a02f79728ea4a95a88b3952b864fb81b7309`
- Implementation commit SHA: `bc60741812ac578ea917fb9fd1ea81ccd6eeef16`
- Implementation commit message: `feat: implement Phase 1 Step 1 foundation, auth, and RBAC`
- Changed in implementation commit: 112 files, 17,942 insertions
- Remote tracking branch: `origin/arena/807bbe3c-edam-frontend`
- Pull request: **#3** — <https://github.com/Jhamankhatri/edam-frontend/pull/3>
- PR title: `Phase 1 Step 1: foundation, authentication, and RBAC`
- PR state: open; not merged or closed
- Engineering audit code commit SHA: `c3d5186f053730e2f78d655115cc71a004d60041`
- CI finalization / report commit SHA: `5f579f95acb3f5940d4bbaed8a32bf63be0b1d82`
- Remote CI status: PASS — GitHub Actions `Frontend CI` concluded `success` on audit code commit `c3d5186` (push run `44374694217`, `pull_request` run `44374695685`) and on docs finalization commit `5f579f9` (push run `44375076663`, `pull_request` run `44375087451`); `gh pr checks 3` reports `Typecheck, lint, test and build` pass in 37s.
- No push to `main`, no merge, no backend commit/push, and no backend file modification.

This report is maintained by docs-only commits after the audit code commit is pushed and its CI status is observed; PR #3 head and `gh pr checks 3` are authoritative for the latest SHA and CI status.

---

## 16. Completion verdict and next-step boundary

**Phase 1 / Step 1 implementation is complete for review, and the strict engineering audit is complete.** All local quality gates were rerun after corrections: 47 tests, zero-warning lint/TypeScript, production build, 27/27 responsive checks on dev and preview, proxy 200s, and cookie-isolated login smoke on both servers. A lightweight CI workflow was added. The implementation intentionally stops here.

PR #3 remains open and unmerged. The strict Category 1 generated-OpenAPI-schema requirement and both Category 2 items were subsequently satisfied with the genuine checksum-verified artifact (see §18); no exception or downgrade was used. The owner still asked for review before any merge, so this report does not merge PR #3. Later-module and deployment/product decisions remain classified in the contract notes; no decision was silently resolved.

---

## 17. Strict engineering audit addendum (2026-11-18)

A separate `docs/PHASE1_STEP1_ENGINEERING_AUDIT.md` records the full strict audit: all 99 application `.ts/.tsx/.css` files read end to end as a regenerated 6,687-line / 233,328-byte corpus (seven contiguous chunks), covering inline-CSS and design-token results, architecture, TypeScript, performance, UI/UX, security/RBAC, CI, fixed/deferred issues, commands, and evidence. The review is static and source-level, not live-backend, production, full WCAG/axe, screen-reader, or OpenAPI-generated-schema verification; §12.1 tabulates the strict H02/H07/H17 residuals with explicit gates.

Audit highlights:

- **0** ordinary React inline `style={{...}}`; **4** `!important` only in the reduced-motion global override; **0** scattered palette utilities or hardcoded colors outside centralized tokens, isolated runtime branding, and test fixtures.
- Strict TypeScript: **0** explicit `any`, **0** `@ts-ignore`/`@ts-expect-error`, and **1** isolated network-boundary `result.data as T` cast. Runtime envelope, event-detail, and form field-path guards replaced unsafe assertions.
- Architecture/performance: centralized route/navigation permissions, one shell badge observer, shared sign-out hook, shared envelope validator, route-level code splitting, four unused runtime dependencies removed, and dead files/exports removed.
- Security/RBAC: session cookies only, CSRF before writes, `X-Installation-Token` only for bootstrap, no login `Idempotency-Key`, exactly eight idempotent business routes, backend authority, and no unauthorized content during initialization. All eight idempotent routes, privileged-header/storage restrictions, raw responses, and malformed envelopes now have tests.
- CI: `.github/workflows/frontend-ci.yml` runs `npm ci`, `npm run typecheck`, `npm run lint`, `npm test`, and `npm run build` on PRs and feature-branch pushes; §18 adds a second `openapi-contract` job (checksum + regeneration diff), still with no expensive backend/browser-matrix job. Remote CI status: PASS — GitHub Actions `Frontend CI` concluded `success` on audit code commit `c3d5186` (push run `44374694217`, `pull_request` run `44374695685`) and on docs finalization commit `5f579f9` (push run `44375076663`, `pull_request` run `44375087451`); `gh pr checks 3` reports `Typecheck, lint, test and build` pass in 37s.
- Final local results: `npm ci` 649 packages; typecheck/lint exit 0; 8 files / 47 tests; build 1893 modules / 4.63s / `dist` 705K; responsive 27/27 dev and 27/27 preview; proxy HTTP 200 on both; login smoke PASS on both; `git diff --check` exit 0.
- Audit code commit: `c3d5186f053730e2f78d655115cc71a004d60041`; CI finalization commit: `5f579f95acb3f5940d4bbaed8a32bf63be0b1d82`. PR #3: <https://github.com/Jhamankhatri/edam-frontend/pull/3> (open, not merged).
- Strict acceptance kept PR #3 unmerged until the Category 1 generated-OpenAPI-schema requirement was satisfied or separately approved as an exception. §18 records the genuine-artifact resolution that cleared it without an exception; PR #3 is still unmerged pending review. No live backend integration, production verification, or full axe/screen-reader WCAG audit is claimed.

Work stops after this audit. No Step 2 or business-module implementation was started.

---

## 18. Genuine OpenAPI artifact, Category 1/2 resolution, and final verification (2026-11-18)

This section is the final report for the resumed PR #3 task. The 19 approved
`docs/Frontend Handover/` Markdown documents remain byte-for-byte unchanged.

### 1. Artifact download and checksum evidence

The exact `gh run download 44395699755 --repo Jhamankhatri/edam --name
openapi-620f7a795cc67a16e905115131f561bbd986af85 --dir ./openapi-spec` failed from the sandbox with
Azure `EOF`/`SSL_ERROR_SYSCALL` (only GitHub/npm/PyPI hosts are allowlisted). It was executed
successfully inside a temporary GitHub-hosted workflow in the frontend repository, which verified
the checksum before committing the two files; that temporary workflow was then deleted.

- `openapi-spec/openapi-620f7a795cc67a16e905115131f561bbd986af85.json` — `229310` bytes
- SHA-256 `9533c5a5a9ce3044b2543cabaa7db09952b26c9e8581e08baf9889c33df2843d` — `sha256sum -c` **OK**
- `openapi-spec/openapi-620f7a795cc67a16e905115131f561bbd986af85.meta.txt` — `580` bytes, records
  backend commit, run id, HTTP 200, size, SHA-256, path/operation/schema counts
- Artifact id `14472210141`, ZIP `25622` bytes, war-smoke job/check-run `135126464210`

### 2. Backend commit associated with the spec

`620f7a795cc67a16e905115131f561bbd986af85`. The capture ran in backend Actions run `44395699755`
(`headSha` `a1414ba98e3722062859a59a4dc0424c8ec3fb27`) from a live Spring Boot WAR at
`http://localhost:18080/v3/api-docs`. Backend PR #26 is merged; backend `main` is
`2835eb55d6595a56d43cabb5eb83370b5ca2b2b2` and changed only `.github/workflows/ci.yml`, so the API
contract for this snapshot is unchanged.

### 3. Generated schema file and statistics

`src/api/generated/schema.d.ts` — `11377` lines / `340588` bytes, generated solely by
`npm run types:generate` (`openapi-typescript@7.13.0`) from the pinned JSON. The source spec has
OpenAPI 3.1.0, 164 paths, 208 operations, 299 schemas, 0 security schemes, 79 request bodies and
233 parameters. Every operation declares only HTTP 200; response DTO schemas have no `required` or
`nullable` metadata, so generated response fields are optional/non-nullable and the stricter
Step 1 cross-cutting contracts in `src/api/contracts.ts` remain separate. A second generation was
byte-identical; no definition was hand-written or simplified.

### 4. CI consistency-check implementation

- `scripts/verify-openapi-snapshot.mjs` + `npm run types:checksum`: verifies byte size, SHA-256 and
  metadata provenance without network access.
- `package.json` `types:generate`: checksum → `openapi-typescript` on the pinned JSON →
  `scripts/annotate-openapi-schema.mjs` (stable provenance header).
- `npm run types:check`: regenerate + `git diff --exit-code`; fails on any drift.
- `.github/workflows/frontend-ci.yml` `openapi-contract` job runs `npm ci`, `types:checksum` and
  `types:check` on every push/PR. No production backend, database, Docker, credentials, or secrets.
- `docs/PHASE1_STEP1_CONTRACT_NOTES.md` §14 documents how to update the pinned snapshot after a
  backend API change; filenames, metadata and the generated header all identify backend commit
  `620f7a795cc67a16e905115131f561bbd986af85`.

### 5. Category 2 resolution

**2A (H02 §3):** the pinned spec declares only 200 responses, so `GlobalExceptionHandler.statusFor`
and its persistence handlers at `620f7a7` are authoritative. `EDAM-3001`/`EDAM-3004` → 422,
`EDAM-5003` → 502, `EDAM-5001` → 409 or 503; `EDAM-5005` → 400 was an earlier audit error, not a
backend discrepancy. `src/api/error-status.ts` centralizes the source-derived table and the 403
permission codes; `src/api/errors.ts` now uses them, removing a duplicated inline set. H02 is
unchanged.

**2B (H10):** all five H10-only lookup paths are absent from the genuine spec. The nine canonical
paths (`/expense-configuration/{request-types,categories,natures}`, `/workflows`,
`/master-data/{currencies,vendors,tax-authorities}`, `/organization/{departments,branches,units/tree}`)
with their real query parameters, response shapes and distinct permission codes are recorded in
`CANONICAL_LOOKUP_ENDPOINTS` and proven by compile-time and runtime contract tests. H10's blanket
permission claims are also wrong (workflow lookups need `workflow:view`; vendors need `vendor:view`).
H10 and Appendix A are unchanged; no H10 path is encoded in any Step 1 screen.

### 6. Tests, typecheck, lint and build

`types:checksum` OK; `types:generate` OK and idempotent; `types:check` OK; `npm run typecheck` exit 0;
`npm run lint` exit 0 (zero warnings); `npm test` **9 files / 55 tests** (8 new contract tests);
`npm run build` exit 0 (1893 modules / 5.07s / 29 files / `dist` 705K); responsive 27/27 on dev and
preview with 201 controls / 15 forms; proxy HTTP 200 on both; Puppeteer login smoke PASS on both;
`git diff --check` exit 0. GitHub Actions results, changed files and commit SHAs are recorded in
§18.7/§18.8 below.

### 7. Changed files and commit SHA

_Recorded after the final push._

### 8. PR #3 status and CI

_Recorded after the remote CI runs complete._

### 9. Remaining blockers and engineering-audit classification

**No Category 1 or Category 2 blocker remains.** PR #3 is open, unmerged, and awaiting owner review
by instruction — not by an unresolved gate. Category 3 gates (H08 naming, password special-character
class, `activeThemeType`, `document:view`) and Category 4 decisions (baseline hash, CORS installation
token, dashboard permission conflict, Router layout filename, mandatory password-change layout)
remain exactly as classified in `docs/PHASE1_STEP1_CONTRACT_NOTES.md` §13 and
`docs/PHASE1_STEP1_ENGINEERING_AUDIT.md` §12/§14. No live frontend/backend integration, valid
sandbox `/v3/api-docs`, production verification, or full axe/screen-reader WCAG audit is claimed.
PR #3 is not merged; no Step 2/business modules, backend modification, `main` push, or new PR
occurred.
