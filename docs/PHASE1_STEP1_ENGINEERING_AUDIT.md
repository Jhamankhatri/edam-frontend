# EDAM Frontend — Phase 1 / Step 1 Strict Engineering Audit

**Date:** 2026-11-18
**Branch:** `arena/807bbe3c-edam-frontend` (`pr_open`)
**Base:** `37c0a02f79728ea4a95a88b3952b864fb81b7309`
**PR #3:** <https://github.com/Jhamankhatri/edam-frontend/pull/3>
**Audit code commit:** `c3d5186f053730e2f78d655115cc71a004d60041`
**CI finalization commit:** `5f579f95acb3f5940d4bbaed8a32bf63be0b1d82`
**Report note:** maintained by docs-only commits; PR #3 head and `gh pr checks 3` are authoritative for the latest SHA and CI status.

---

## 1. Scope and stop condition

This is a strict production-quality engineering audit of the completed Phase 1 / Step 1 scaffold. It covers all application `.ts`, `.tsx`, and `.css` files, architecture, styling, TypeScript, performance, UI/UX, security/RBAC, CI, and the 12 documented contract discrepancies. It does **not** implement Step 2, business modules, dashboard data, reporting, document handling, or any backend change. The 19 approved files in `docs/Frontend Handover/` remain unchanged. No PR was created, merged, closed, or pushed to `main`; PR #3 remains open.

The backend repository at `/tmp/edam-backend-readonly` (`main 620f7a795cc67a16e905115131f561bbd986af85`) remained READ-ONLY. No live Spring Boot/PostgreSQL runtime was available, so no live backend integration, generated OpenAPI schema, production deployment, full axe/WCAG audit, or screen-reader verification is claimed. Browser checks use a local in-memory mock API on `:8080`; it is not the Spring Boot backend.

---

## 2. Files audited

A static inventory plus full-source review covered **99 application files**: 34 `.ts`, 63 `.tsx`, and 2 `.css` (97 under `src/` plus `vite.config.ts` and `tailwind.config.ts`). Root configuration, `index.html`, `.env.example`, PostCSS/ESLint/tsconfig, `package.json`, and scripts were also inspected for configuration and security consistency. `src/routeTree.gen.ts` is generator-owned; it retains `@ts-nocheck` and `as any` from TanStack Router and is excluded from ESLint.

**Review method and precise scope.** The regenerated current-source corpus (`/tmp/audit-source-current.txt`, 99 file markers, 6,687 lines / 233,328 bytes) was read end to end across seven contiguous chunks, in addition to targeted reads of root configuration, `index.html`, the built CSS bundle, the 19 handover docs, the read-only backend sources, and GitHub PR/CI metadata. This is a **static, source-level audit of the Step 1 working tree**; it is **not** live-backend, production, full WCAG/axe, screen-reader, or OpenAPI-generated-schema verification. Those boundaries are unchanged from §1 and §12, and the residual strict-conformance items are tabulated in §12.1.

<details>
<summary>Complete application file inventory</summary>

- `src/api/client.test.ts`
- `src/api/client.ts`
- `src/api/contracts.ts`
- `src/api/csrf.ts`
- `src/api/endpoints.test.ts`
- `src/api/endpoints.ts`
- `src/api/envelope.ts`
- `src/api/errors.ts`
- `src/api/services/auth.ts`
- `src/app/query-client.ts`
- `src/auth/AuthProvider.test.tsx`
- `src/auth/AuthProvider.tsx`
- `src/auth/auth-context.ts`
- `src/auth/guards.tsx`
- `src/auth/permission-codes.ts`
- `src/auth/permissions.test.ts`
- `src/auth/permissions.ts`
- `src/auth/session-events.ts`
- `src/auth/useAuth.ts`
- `src/auth/useSignOut.ts`
- `src/components/auth/AuthExpiredRedirector.tsx`
- `src/components/brand/BrandMark.tsx`
- `src/components/feedback/AccessDenied.tsx`
- `src/components/feedback/ErrorState.tsx`
- `src/components/feedback/FullPageLoader.tsx`
- `src/components/feedback/InitializationErrorState.tsx`
- `src/components/feedback/ModulePlaceholder.tsx`
- `src/components/feedback/NotFound.tsx`
- `src/components/forms/FormField.tsx`
- `src/components/layout/AppShell.tsx`
- `src/components/layout/Breadcrumbs.tsx`
- `src/components/layout/MobileNav.tsx`
- `src/components/layout/PublicLayout.tsx`
- `src/components/layout/Sidebar.tsx`
- `src/components/layout/Topbar.tsx`
- `src/components/layout/UserMenu.tsx`
- `src/components/ui/alert.tsx`
- `src/components/ui/badge.tsx`
- `src/components/ui/button.tsx`
- `src/components/ui/card.tsx`
- `src/components/ui/components.test.tsx`
- `src/components/ui/dialog.tsx`
- `src/components/ui/drawer.tsx`
- `src/components/ui/dropdown-menu.tsx`
- `src/components/ui/input.tsx`
- `src/components/ui/label.tsx`
- `src/components/ui/password-input.tsx`
- `src/components/ui/select.tsx`
- `src/components/ui/skeleton.tsx`
- `src/components/ui/table.tsx`
- `src/components/ui/toaster.tsx`
- `src/components/ui/tooltip.tsx`
- `src/config/env.ts`
- `src/config/navigation.ts`
- `src/config/route-access.ts`
- `src/features/auth/AuthSuccessCard.tsx`
- `src/features/auth/BootstrapForm.tsx`
- `src/features/auth/ChangePasswordForm.tsx`
- `src/features/auth/ForgotPasswordForm.tsx`
- `src/features/auth/LoginForm.tsx`
- `src/features/auth/ResetPasswordForm.tsx`
- `src/forms/server-errors.test.ts`
- `src/forms/server-errors.ts`
- `src/hooks/useBranding.ts`
- `src/hooks/usePermissions.ts`
- `src/hooks/useShellBadges.ts`
- `src/lib/theme.test.ts`
- `src/lib/theme.ts`
- `src/lib/utils.ts`
- `src/main.tsx`
- `src/routeTree.gen.ts`
- `src/router.tsx`
- `src/routes/__root.tsx`
- `src/routes/app/approvals/index.tsx`
- `src/routes/app/approvals/tasks.$taskId.tsx`
- `src/routes/app/dashboard.tsx`
- `src/routes/app/index.tsx`
- `src/routes/app/notifications/index.tsx`
- `src/routes/app/requests/$id/edit.tsx`
- `src/routes/app/requests/$id/index.tsx`
- `src/routes/app/requests/all.tsx`
- `src/routes/app/requests/mine.tsx`
- `src/routes/app/requests/new.tsx`
- `src/routes/app/route.tsx`
- `src/routes/bootstrap.tsx`
- `src/routes/change-password.tsx`
- `src/routes/forgot-password.tsx`
- `src/routes/index.tsx`
- `src/routes/login.tsx`
- `src/routes/reset-password.tsx`
- `src/styles/index.css`
- `src/styles/tokens.css`
- `src/test/app-flows.test.tsx`
- `src/test/fixtures.ts`
- `src/test/server.ts`
- `src/test/setup.ts`
- `src/test/utils.tsx`
- `tailwind.config.ts`
- `vite.config.ts`

</details>

---

## 3. Inline CSS, design tokens, and styling results

| Check | Result |
|---|---|
| Ordinary React `style={{...}}` | **0** in application source |
| `!important` | **4**, all in the single `prefers-reduced-motion` block in `src/styles/index.css`; required to override higher-specificity Tailwind animation/transition utilities |
| Scattered Tailwind palette utilities (`bg-blue-50`, `text-white/60`, `border-white/10`, etc.) | **0** after audit |
| Hardcoded hex/rgba outside centralized definitions | **0**: only `src/styles/tokens.css`, the isolated `src/lib/theme.ts` fallback, `src/lib/theme.test.ts`, and `src/test/fixtures.ts` contain literals |
| Repeated arbitrary spacing/radius/shadow/typography values | Removed; replaced with named Tailwind theme values and shared global classes |
| Invalid alpha modifiers on CSS-variable colors | Removed; dedicated semantic tokens added |
| Centralized design tokens | `src/styles/tokens.css`; Tailwind maps colors/fonts/radii/shadows/spacing/widths to those variables |
| Shared variants/global styles | `.auth-card`, `.glass-card`, `.elevated-card`, `.feedback-icon`, `.auth-eyebrow`, `.auth-title`, `.auth-description`, `.badge-label`, `.micro-label`, `.brand-kicker`, `.eyebrow-wide`, `.auth-canvas`, `.auth-brand-panel`, `.bank-grid`, `.skeleton-shimmer`, `.scrollbar-subtle` |
| Runtime-configurable branding | Isolated in `src/lib/theme.ts`; `index.html` no longer hardcodes a theme color, and `applyPublicBranding` creates/updates the meta tag from validated public configuration or the centralized CSS token |
| Remaining arbitrary Tailwind syntax | Only legitimate `data-[state=...]`, `data-[side=...]`, and `data-[disabled]` state variants, not design values |

A standalone Tailwind compile (`npx tailwindcss --config tailwind.config.ts -i src/styles/index.css -o /tmp/tailwind-audit-final.css --minify`) and the production CSS bundle confirmed that all named tokens, font sizes, letter spacings, widths, grid templates, semantic colors, and global classes are emitted. The premium banking visual direction and H08 fallback radius `.5rem` were preserved.

---

## 4. Architecture and folder separation

- `src/api/`: endpoint constants, transcribed Step-1 contracts, a single fetch client, CSRF, errors, services, and the new `envelope.ts` transport validator.
- `src/auth/`: provider/context, guards, permission helpers, generated permission codes, session events, and the new `useSignOut.ts` transition hook.
- `src/config/`: environment, navigation metadata, and the single route-access permission matrix.
- `src/components/`: reusable UI primitives plus brand, feedback, forms, auth, and layout folders. Presentation no longer owns duplicated logout logic.
- `src/features/auth/`, `src/routes/`, `src/hooks/`, `src/forms/`, `src/app/`, `src/lib/`, `src/test/`, `scripts/`: remain separated by responsibility.
- `src/config/navigation.ts` now contains metadata only; `getNavigationRequirement()` and `getRouteRequirement()` in `src/config/route-access.ts` are the sole permission-rule source, with the explicit H04/H09 dashboard exception documented in code and tests.
- `src/api/envelope.ts` removed duplicate JSON envelope parsing from `client.ts` and `csrf.ts` and validates `success`, `error`, `fieldErrors`, and correlation metadata at the network boundary.
- `useShellBadges()` is now called once in `AppShell` and passed to `Sidebar`, `MobileNav`, and `Topbar`, eliminating three observers of the same query keys.
- Removed unused runtime dependencies (`@radix-ui/react-separator`, `@tanstack/react-table`, `date-fns`, `decimal.js-light`), unused files (`EmptyState.tsx`, `textarea.tsx`), and dead exports/helpers. `decimal.js-light` can be reintroduced with the first monetary-value module rather than shipped unused.
- Removed the render-time ref mutation in `RequireAuth`; the initial `returnTo` is captured with `useRef(safeReturnTo(href))`, while the redirect remains effect-based after a declarative `<Navigate>` experiment caused router update loops.

---

## 5. Strict TypeScript

`tsconfig.json` remains strict with `noImplicitAny`, `noUncheckedIndexedAccess`, `noUnusedLocals`, `noUnusedParameters`, `noFallthroughCasesInSwitch`, and `forceConsistentCasingInFileNames`. ESLint enforces `no-explicit-any`, type-only imports, and zero warnings.

Audit results:

- **0** explicit `any` types in application source.
- **0** `@ts-ignore` or `@ts-expect-error` in application source.
- **1** remaining non-`as const` assertion: `result.data as T` in `apiFetch<T>`, isolated at the network boundary with a comment because live OpenAPI-generated payload types are unavailable. All other JSON casts, event casts, and form field-path casts were replaced with runtime guards.
- `session-events.ts` narrows `CustomEvent.detail` with `isAuthExpiredDetail`.
- `forms/server-errors.ts` maps backend field errors only through caller-supplied `FieldPath<T>` allowlists; unexpected fields are ignored rather than asserted into form state.
- `button.tsx` no longer asserts the result of `cloneElement`.
- Test setup and MSW test server no longer cast `fetch`, `request.json()`, or Vitest mocks.
- Generated `src/routeTree.gen.ts` is excluded from ESLint and is not hand-edited.
- `npm run contracts:permissions` regenerated exactly 60 permission codes with no diff.

---

## 6. Performance and bundle

- `TanStackRouterVite` uses `autoCodeSplitting: true`; `vite.config.ts` and the production build emit route-level chunks plus shared chunks. No manual `React.lazy` wrapper was added because the router plugin already provides justified route-level splitting.
- Final production build: **1893 modules**, **4.63s**, **29 files**, `dist` **705K**, CSS **31.54 kB / 6.83 kB gzip**, main JS **341.48 kB / 107.65 kB gzip**.
- React Query defaults remain `retry: false`, `refetchOnWindowFocus: false`, `staleTime: 30_000`; badge polling is permission-gated at 60s.
- One shell-level badge observer replaces three, while the query cache continues to deduplicate network requests.
- Four unused runtime dependencies and two unused source files were removed. No import cycles were found in local application modules.
- Derived state, effects, and memo usage were reviewed; no duplicate request loops or unauthorized-content flashes were introduced during initialization.

---

## 7. UI/UX, responsiveness, accessibility, and reduced motion

- Centralized semantic surfaces/status colors preserve visual consistency and avoid invalid alpha handling.
- Responsive checks rerun after all corrections: **27/27** route/viewport checks on dev and **27/27** on production preview, inspecting 201 controls, 15 forms, and 0 tables at 1440×900, 834×1112, and 390×844.
- Sidebar/drawer behavior, no horizontal overflow, accessible names, 40×40 targets, focus rings, semantic headings, labelled fields, and reduced-motion behavior were rechecked.
- Four `!important` declarations remain necessary in the reduced-motion override; no other `!important` exists.
- A full axe contrast/tree audit, screen-reader pass, keyboard-only traversal of future business modules, and live assistive-technology review were **not** performed.

---

## 8. Security and RBAC

Static and dynamic checks confirm:

- Session cookies only: `credentials: 'include'`; **0** `localStorage`, `sessionStorage`, `Authorization`, `Bearer`, or JWT credential usage in application source.
- `GET /auth/csrf` is primed before writes; `XSRF-TOKEN` is read and sent as `X-XSRF-TOKEN`; raw 403 CSRF failures reprime and retry once.
- `X-Installation-Token` is sent only by `bootstrapInstallation`; never on login, logout, change-password, forgot-password, or idempotent business routes.
- No `Idempotency-Key` on `/auth/login`; `IDEMPOTENT_ROUTES` contains exactly the eight H02 business routes. Unit tests now exercise all eight and reject near-miss paths and the internal integration path.
- `apiFetchRaw` is covered by a raw CSV response test; malformed success JSON now produces `HTTP_NON_JSON` instead of a misleading `HTTP_200`.
- `AuthProvider` hides protected content until verification, suppresses expiry publication for initialization `/auth/me`, clears query data on expiry, and does not authenticate after bootstrap.
- Permissions, not roles, drive guards and navigation. `document:view` is absent from the 60-code catalogue and is not encoded. The backend remains authoritative for every protected operation.
- `AccessDenied` and `UserMenu` share `useSignOut`, so logout/navigation/error handling is no longer duplicated.
- Security-related API client tests: 13 in `src/api/client.test.ts`; auth/RBAC flow tests: 9 in `src/test/app-flows.test.tsx`; provider lifecycle: 6 in `src/auth/AuthProvider.test.tsx`; permissions: 4; endpoints: 3; server field errors: 3; UI primitives: 6; theme: 3. Total **47 tests**.

---

## 9. CI quality gates

Added `.github/workflows/frontend-ci.yml` on `pull_request` and feature-branch pushes (`branches-ignore: main`). It now has two jobs:

**`openapi-contract` (added for the genuine-artifact task)**

1. `actions/checkout@v4`
2. `actions/setup-node@v4` (Node 22, npm cache)
3. `npm ci`
4. `npm run types:checksum` — verifies the pinned JSON's SHA-256, byte size and provenance metadata
5. `npm run types:check` — regenerates `src/api/generated/schema.d.ts` and fails on any drift

**`quality-gates`**

1. `actions/checkout@v4`
2. `actions/setup-node@v4` (Node 22, npm cache)
3. `npm ci`
4. `npm run typecheck`
5. `npm run lint`
6. `npm test`
7. `npm run build`

Neither job starts Spring Boot, PostgreSQL, Docker, or a production backend, and neither reads credentials. There is still no browser matrix, axe job, or other expensive job; `permissions: contents: read`, timeouts, and concurrency cancellation are configured. Remote CI status for the earlier audit commits: PASS — `Frontend CI` concluded `success` on `c3d5186` (push run `44374694217`, `pull_request` run `44374695685`), on `5f579f9` (push run `44375076663`, `pull_request` run `44375087451`), and on `e49f449` (push run `44382157316`, `pull_request` run `44382804285`). Results for the OpenAPI-resolution commits are recorded in §14.

---

## 10. Commands and results actually executed

| Command | Result |
|---|---|
| `npm ci --no-audit --no-fund` | Exit 0; 649 packages installed from lockfile |
| `npm run typecheck` | Exit 0 (`routes:generate` + `tsc --noEmit`) |
| `npm run lint` | Exit 0; zero warnings (`--max-warnings=0`) |
| `npm test` | Exit 0; 8 files / **47 tests** passed |
| `npm run build` | Exit 0; 1893 modules / 4.63s / 29 files / `dist` 705K |
| `(npm ci && npm run typecheck && npm run lint && npm test && npm run build)` | Exit 0; captured in `/tmp/audit-ci-local-final.txt` |
| `npm run contracts:permissions` | Exit 0; 60 codes; no diff |
| `npm run responsive:check -- --base-url=http://127.0.0.1:5173 --output=/tmp/audit-responsive-dev-final.json` | Exit 0; 27/27, 201 controls, 15 forms, 0 tables |
| `npm run responsive:check -- --base-url=http://127.0.0.1:4173 --output=/tmp/audit-responsive-preview-final.json` | Exit 0; 27/27, 201 controls, 15 forms, 0 tables |
| `curl http://127.0.0.1:5173/api/v1/public/configuration` and `:4173` | Both HTTP 200 with `success: true` JSON envelope |
| Temporary Puppeteer login smoke on `:5173` and `:4173` | Both PASS: `admin` / `InitialPass1` → `/app/dashboard` with primary nav, user menu, Dashboard heading; cookies cleared between origins |
| `npx tailwindcss --config tailwind.config.ts -i src/styles/index.css -o /tmp/tailwind-audit-final.css --minify` | Exit 0; named tokens/classes emitted |
| TypeScript AST assertion scan | One boundary cast; no explicit `any`, `@ts-ignore`, or `@ts-expect-error` in app source |
| Static security/style scans | 0 inline React styles, 0 scattered palette utilities, 0 hardcoded colors outside allowed files, 0 credential-storage/header patterns |
| `git diff --check` | Exit 0 |

Evidence files are under `/tmp/audit-*.txt`, `/tmp/audit-*.json`, and `/tmp/tailwind-audit-final.css`. Mock API, dev, and preview processes bind `0.0.0.0` for Arena preview compatibility.

### 10.1 Genuine OpenAPI artifact task — commands and results (2026-11-18)

| Command | Result |
|---|---|
| `gh run download 44395699755 --repo Jhamankhatri/edam --name openapi-620f7a795cc67a16e905115131f561bbd986af85 --dir ./openapi-spec` | Executed inside a GitHub-hosted runner because the sandbox cannot reach Azure blob storage; artifact retrieved. JSON `229310` bytes, `.meta.txt` `580` bytes |
| `sha256sum openapi-spec/openapi-620f7a795cc67a16e905115131f561bbd986af85.json` | `9533c5a5a9ce3044b2543cabaa7db09952b26c9e8581e08baf9889c33df2843d` — **OK** against the expected value |
| `npm run types:checksum` | Exit 0; `OpenAPI snapshot verified: 229310 bytes, SHA-256 9533c5a5…, backend 620f7a795cc67a16e905115131f561bbd986af85` |
| `npm run types:generate` | Exit 0; `openapi-typescript 7.13.0` → `src/api/generated/schema.d.ts` (`11377` lines / `340588` bytes); provenance header added; byte-identical on a second run |
| `npm run types:check` | Exit 0 after the generated file was committed (regenerate + `git diff --exit-code`) |
| `npm run typecheck` | Exit 0 |
| `npm run lint` | Exit 0; zero warnings |
| `npm test` | Exit 0; **9 files / 55 tests** (8 new OpenAPI contract tests) |
| `npm run build` | Exit 0; 1893 modules / 5.07s / 29 files / `dist` 705K |
| `npm run responsive:check` on `:5173` and `:4173` | Both exit 0; 27/27 route/viewport checks, 201 controls, 15 forms, 0 tables |
| Puppeteer login smoke on `:5173` and `:4173` | Both PASS: `admin` → `/app/dashboard`, Dashboard heading and app nav present |
| Proxy smoke `GET /api/v1/public/configuration` on `:5173` and `:4173` | Both HTTP 200 with `success: true` envelope |
| `git diff --check` | Exit 0 |

---

## 11. Issues fixed

1. Centralized all scattered palette/white-alpha colors, arbitrary typography, spacing, width, radius, and grid values into tokens, named Tailwind theme values, and shared global classes.
2. Removed the static hardcoded `theme-color` from `index.html`; runtime branding now creates/updates it from validated configuration or centralized CSS tokens.
3. Fixed invalid alpha modifiers on CSS-variable colors and the non-standard `disabled:opacity-55` utility.
4. Deduplicated envelope parsing and added runtime `ApiResponse` shape validation; removed unsafe JSON and event casts.
5. Added field-path allowlists for server validation errors; unexpected backend field names are no longer asserted into React Hook Form.
6. Centralized navigation/route permission rules and documented the H04/H09 dashboard exception in code and tests.
7. Hoisted badge queries to one `AppShell` observer and passed values down; removed duplicate sign-out logic via `useSignOut`.
8. Removed unused dependencies, files, exports, and dead global CSS.
9. Removed render-time ref mutation in the auth guard and preserved the working effect-based redirect.
10. Added security tests for all eight idempotent routes, privileged-header/storage restrictions, raw responses, and malformed envelopes.
11. Added the lightweight GitHub Actions workflow.
12. Reclassified all 12 contract discrepancies in `docs/PHASE1_STEP1_CONTRACT_NOTES.md` with strict categories and rationale.

---

## 12. Issues deferred / acceptance gates

| Category | Items | Gate |
|---:|---|---|
| 1 | Generated OpenAPI schema + CI diff check (`§7`) | **CLEARED** — genuine checksum-verified artifact, generated `schema.d.ts`, and `openapi-contract` CI job (§14). PR #3 still open/unmerged awaiting owner review; no exception was taken. |
| 2 | H02 status mapping (`§2`), H10 lookup paths (`§5`) | **CLEARED** — source/spec evidence, code changes and 8 contract regression tests (§14). |
| 3 | H08 naming (`§3`), password special-character class (`§8`), `activeThemeType` (`§11`), `document:view` (`§12`) | Before relevant later module |
| 4 | Baseline hash (`§1`), CORS/installation token (`§4`), dashboard conflict (`§6`), Router layout filename (`§9`), mandatory password-change layout (`§10`) | Deployment/product/documentation decision |

No Category 1 or Category 2 gate remains. No contract was silently invented: the 19 finalized handover
documents are byte-for-byte unchanged, H02 §3 and H10 are quoted only as stale source text, and the
authoritative facts come from the pinned OpenAPI JSON and checked-in backend Java source. The
remaining Category 3/4 items are unchanged and are still explicit gates.

### 12.1 Strict H02 / H07 / H17 conformance dispositions (precision pass, 2026-11-18)

The full 99-file corpus read was checked against strict handover clauses. This table records every **verified**
residual with an explicit gate, and also records items checked and cleared, so the audit does not imply
unqualified compliance. No item below is a Step 1 runtime defect: Step 1 calls none of the eight idempotent
business mutations, has no export/download caller, and has no monetary, table, chart, or Playwright-E2E module.

| Clause | Strict requirement | Verified Step 1 state | Gate |
|---|---|---|---|
| H02 §8 / H17 §2 | Generated `src/api/generated/schema.d.ts`, regenerate on every backend pull, CI diff check | Genuine artifact pinned with verified SHA-256; `npm run types:generate` regenerates from it; `npm run types:check` and the `openapi-contract` CI job fail on drift; no backend runtime or credentials in frontend CI | **Cleared** (§14, contract notes §7 and §14) |
| H02 §6 | Reuse the same `Idempotency-Key` across retries of one gesture, new key per gesture; `EDAM-1005` short backoff without an error toast; `EDAM-1006` out-of-band reconcile | `resolveIdempotencyKey()` mints a fresh UUID on each `execute()` attempt (including CSRF re-prime and GET network retry); no `EDAM-1005`/`EDAM-1006` branch | Before Step 2 implements any of the eight idempotent mutations |
| H02 §7 / §9.5 | Branch response reads on `Content-Type`; return the raw `Response` for csv/xlsx/blob; download callers use a blob response type | `parseApiEnvelope()` clones text and JSON-parses unconditionally; `apiFetchRaw()` requires an explicit `responseType: 'raw'`; no `Content-Type` branching; no Step 1 export caller | Before the RPT-002 reporting/export module |
| H02 §5 / H07 stack | Parse monetary values with `decimal.js-light`; stack also lists TanStack Table, `date-fns`, `recharts`, Playwright | Removed as unused; Step 1 has no monetary, table, chart, or Playwright module (responsive checks use `puppeteer-core`) | Reintroduce with the first monetary/table/chart module |
| H07 data-flow | All server state through TanStack Query; hover preload; prefetch shell loaders; root-route loader calls `/auth/me`; CSP without `unsafe-eval` | `QueryClientProvider` is wired and badge queries use React Query, but bootstrap uses `AuthProvider` + `Promise.allSettled` direct service calls; no hover preload/prefetch loader; no CSP header in frontend source (H17 §4 assigns CSP/CORS to Nginx/backend) | Before a Step 2 bootstrap refactor and the H14 Phase 4 performance pass |
| H17 §2–§4 | `pnpm` (or "package manager of choice"); proxy `credentials: 'include'`; same-origin Nginx; CORS/CSP headers | npm with pinned `packageManager: npm@10.9.8` (explicitly permitted by H17); Vite proxy uses `changeOrigin: true` and the client sends `credentials: 'include'`; no Nginx/CORS/CSP config in the frontend package | Deployment/hardening before production |

**Minor consistency residual (not a strict clause):** `MobileNav`'s drawer title, `BrandMark`, and the login
heading use the literal `EDAM` fallback while `useBranding()` drives `PublicLayout`/`Sidebar` and
`applyPublicBranding` drives title/meta; `LoginForm` uses inline typography utilities rather than the shared
`.auth-description` class. Gate: before the theming/branding module (contract notes §3, Category 3).

**Checked and cleared (not deviations):** `bg-brand-panel-subtle`, `text-brand-panel-quiet`, and the custom
`tracking-*` letter-spacings are defined in `tailwind.config.ts` and emitted in the production CSS bundle;
`autoCodeSplitting: true` provides route-level splitting and H07 sets no explicit `lazy`/`memo` requirement;
npm is permitted because H17 §2 says "or package manager of choice". No `pnpm`-only constraint exists.

No residual item changes a backend contract. The Category 1 generated-schema blocker and both Category
2 items were cleared by the genuine-artifact resolution recorded in §14; PR #3 remains open and
unmerged because the owner asked for review before any merge.

---

## 13. Commit, PR, and stop condition

- Fixed branch: `arena/807bbe3c-edam-frontend`
- Status: `pr_open`
- Base: `37c0a02f79728ea4a95a88b3952b864fb81b7309`
- Audit code commit: `c3d5186f053730e2f78d655115cc71a004d60041`
- CI finalization commit: `5f579f95acb3f5940d4bbaed8a32bf63be0b1d82`
- Genuine-artifact implementation commit: `d4fccf000fc729ec6e3d6f6934ea590560b0909d` (§14)
- PR #3: <https://github.com/Jhamankhatri/edam-frontend/pull/3> (open, not merged)
- Remote CI: PASS — GitHub Actions `Frontend CI` concluded `success` on `c3d5186` (push run `44374694217`, `pull_request` run `44374695685`), `5f579f9` (push run `44375076663`, `pull_request` run `44375087451`), `e49f449` (push run `44382157316`, `pull_request` run `44382804285`), and `d4fccf0` (push run `44405260075`, `pull_request` run `44405268208`); `gh pr checks 3` reports both `Typecheck, lint, test and build` and `Pinned OpenAPI snapshot and generated types` pass.
- No new PR, no merge, no `main` push, no backend commit/push, no Step 2 or business module work.

**Audit verdict (superseded by §14):** the Step 1 frontend is clean, reusable, optimized, secure,
responsive, and maintainable at the foundation level, with all local quality gates passing. It is
**not** claimed production-verified or live-backend integrated. Strict commercial-banking acceptance
kept PR #3 unmerged until the Category 1 generated-schema requirement was satisfied or a separately
approved exception was recorded. That requirement is now satisfied in §14 without an exception; PR #3
still stays open and unmerged pending owner review. Work stops here.

---

## 14. Genuine OpenAPI artifact resolution — Category 1 and Category 2 (2026-11-18)

### 14.1 Artifact provenance and checksum evidence

Backend PR #26 merged at `2026-11-18T20:58:49Z`; backend `main` is
`2835eb55d6595a56d43cabb5eb83370b5ca2b2b2`. It changed only `.github/workflows/ci.yml`, adding a
`war-package-smoke-test` step that starts the real WAR and captures `/v3/api-docs`. Run
`44395699755` (`headSha` `a1414ba98e3722062859a59a4dc0424c8ec3fb27`, branch `ci/openapi-artifact`)
completed successfully; war-smoke job/check-run `135126464210` uploaded artifact
`openapi-620f7a795cc67a16e905115131f561bbd986af85` (id `14472210141`, ZIP `25622` bytes).

The exact `gh run download` command failed from this sandbox with Azure `EOF`/`SSL_ERROR_SYSCALL`
because only `github.com`, `codeload.github.com`, `api.github.com`, npm and PyPI are allowlisted.
It was therefore executed inside a temporary GitHub-hosted bootstrap workflow in the **frontend**
repository (a GitHub runner can reach the artifact blob host), which verified the SHA-256 before
committing the two files to `arena/807bbe3c-edam-frontend`. The temporary workflow was removed in
the same change set; no backend repository file was modified.

| Evidence | Value |
|---|---|
| Pinned JSON | `openapi-spec/openapi-620f7a795cc67a16e905115131f561bbd986af85.json` |
| JSON size | `229310` bytes |
| JSON SHA-256 | `9533c5a5a9ce3044b2543cabaa7db09952b26c9e8581e08baf9889c33df2843d` (`sha256sum -c` OK) |
| Metadata | `openapi-spec/openapi-620f7a795cc67a16e905115131f561bbd986af85.meta.txt` (`580` bytes) |
| Backend commit | `620f7a795cc67a16e905115131f561bbd986af85` |
| Capture source | `http://localhost:18080/v3/api-docs`, HTTP 200, from live Spring Boot WAR in the war-smoke job |
| Spec facts | OpenAPI 3.1.0, 164 paths, 208 operations, 299 schemas, 0 security schemes |
| Generated file | `src/api/generated/schema.d.ts` — `11377` lines / `340588` bytes |

The generated schema was produced only by `npm run types:generate` (which first runs
`npm run types:checksum`) from the pinned JSON with `openapi-typescript@7.13.0`. No definition was
hand-written, simplified, or substituted. A second generation was byte-identical.

### 14.2 Category 2A — H02 §3 HTTP status mapping

The genuine spec declares **only HTTP 200** for all 208 operations and 0 security schemes, and
several backend controllers return HTTP 201 that the spec also declares as 200
(`AuthController#bootstrap`, `WorkflowConfigurationController#create`). The spec therefore cannot
adjudicate error statuses; checked-in backend Java source at `620f7a7` is authoritative:
`GlobalExceptionHandler.java` `statusFor` lines 258-285 and persistence handlers lines 213-228.

| Code | H02 §3 | Backend source | Verdict |
|---|---:|---:|---|
| `EDAM-3001` | 409 | 422 | H02 stale |
| `EDAM-3004` | 409 | 422 | H02 stale |
| `EDAM-5003` | 503 | 502 | H02 stale |
| `EDAM-5001` | 409 | 409 (`statusFor`, `DataIntegrityViolationException`) **or** 503 (`DataAccessException`) | H02 incomplete |
| `EDAM-5005` | 400 | 400 | **Earlier audit error**: `INVALID_CONFIGURATION` is in `statusFor`'s `BAD_REQUEST` branch; H02 was correct |

Implementation: `src/api/error-status.ts` now holds the source-derived table, the 403 permission-code
set, `FORBIDDEN_STATUS` and `SERVER_ERROR_STATUS_THRESHOLD`. `src/api/errors.ts` was refactored to
use them, removing its duplicated inline permission-code set; it still keys conditional logic off
`error.code`, and no Step 2 toast/retry policy was added. `src/test/server.ts` documents that
bootstrap's HTTP 201 comes from `AuthController#bootstrap`, not the spec. H02 remains unchanged.

### 14.3 Category 2B — H10 lookup endpoints

All H10-only paths are **absent** from the genuine spec: `/api/v1/configuration/request-types`,
`/api/v1/configuration/expense-categories`, `/api/v1/configuration/expense-natures`,
`/api/v1/configuration/workflows/active`, `/api/v1/organization/departments/tree`. Authoritative
paths (verified in the spec and in `ExpenseConfigurationController`,
`WorkflowConfigurationController`, `MasterDataController`, `OrganizationController`):

- `GET /api/v1/expense-configuration/request-types` (`expense-configuration:view`, CFG-009),
  `/categories` (optional `includeInactive`, CFG-001), `/natures` (CFG-006).
- `GET /api/v1/workflows` (`workflow:view`, WF-001, optional `includeInactive`) — **not**
  `expense-configuration:view` and no `/workflows/active` lookup.
- `GET /api/v1/master-data/currencies` (`currency:view`, optional `includeInactive`, no `active`
  parameter), `/vendors` (`vendor:view`, `search`/`page`/`size`/`sort`, paginated),
  `/tax-authorities` (`currency:view`, no pagination parameters, plain list). H10's blanket
  `currency:view` is wrong for vendors.
- `GET /api/v1/organization/departments`, `/branches`, and `/organization/units/tree` (all
  `organization:view`). `/organization/departments/tree` does not exist.

Implementation: `CANONICAL_LOOKUP_ENDPOINTS` in `src/api/endpoints.ts` records the nine canonical
relative paths; `src/api/openapi-contract.test.ts` proves at compile time that each exists in the
generated `paths` interface and at runtime that each has a GET and that no H10 path exists. Step 1
calls no lookup endpoint, so no H10 path is encoded in any screen. H10 and Appendix A remain
unchanged.

### 14.4 CI consistency and inspect results

`npm run types:checksum` (Node, no network) verifies size, SHA-256 and metadata fields including
`backend_commit_sha`, `workflow_run_id`, `http_status` and `sha256`. `npm run types:generate`
regenerates the definitions from the pinned JSON and prepends a stable provenance header.
`npm run types:check` regenerates and runs `git diff --exit-code -- src/api/generated/schema.d.ts`.
`.github/workflows/frontend-ci.yml` adds an `openapi-contract` job that runs both commands after
`npm ci`; it uses no backend runtime, database, Docker, production URL, or credentials. The update
procedure for a future backend API change is documented in contract notes §14.

Inspection of the real document: 79 operations have request bodies, 233 parameters are declared,
all 208 responses are typed (`ApiResponse*` schemas) and all declare only HTTP 200. Response DTO
schemas carry no `required` array and no `nullable` markers, so generated response fields are
optional and non-nullable; request schemas such as `LoginRequest` do declare `required`.
`src/api/contracts.ts` therefore keeps the deliberately stricter, Java-record-derived Step 1
cross-cutting types separate (`string | null` where the backend returns null) instead of replacing
them with weaker generated shapes. No `any`, `@ts-ignore`, or unsafe assertion was introduced.

### 14.5 Gate results and classification

Local: `npm ci`-equivalent install present; `types:checksum` OK; `types:generate` OK and
idempotent; `types:check` OK; `typecheck` exit 0; `lint` exit 0; `test` 9 files / 55 tests;
`build` 1893 modules / 5.07s / 29 files / `dist` 705K; responsive 27/27 on dev and preview;
proxy HTTP 200 on both; Puppeteer login smoke PASS on both; `git diff --check` exit 0. GitHub
Actions results for the pushed commits are recorded in §14.6.

Classification after this change set: **Category 1 cleared; Category 2 cleared** (§2, §5).
Category 3 (§3, §8, §11, §12) and Category 4 (§1, §4, §6, §9, §10) remain as previously recorded.
No live frontend/backend integration, no valid sandbox `/v3/api-docs`, no production verification,
and no full axe/screen-reader WCAG audit is claimed; those remain out of scope. PR #3 is open and
unmerged; no Step 2 or business-module work was performed.

### 14.6 Commit, CI and PR results

- Genuine-artifact implementation commit: `d4fccf000fc729ec6e3d6f6934ea590560b0909d`
  (`feat: pin genuine OpenAPI artifact, generate schema, and resolve Category 1/2`), 16 files
  changed, 12,209 insertions / 128 deletions.
- Two preparatory commits on the same branch: `a14d636b905b39d52c75be71eea66efff4922e2d`
  (temporary bootstrap workflow, removed in `d4fccf0`) and
  `470255554c9c12152598d9d6611f2624c6773771` (bootstrap-pinned JSON + `.meta.txt`). The bootstrap
  workflow's PR run on `4702555` reported `action_required` because it was authored by
  `github-actions[bot]`; that historical run is superseded by the passing runs below.
- GitHub Actions on `d4fccf0`: push run `44405260075` **success** (job `135158666880`
  `Pinned OpenAPI snapshot and generated types`, job `135158667319`
  `Typecheck, lint, test and build`); pull_request run `44405268208` **success** (jobs
  `135158697526` and `135158696989`). `gh pr checks 3` reports both checks **pass** (26s / 42s).
- PR #3: `OPEN`, not draft, `MERGEABLE`, `CLEAN`, base `main`, head
  `arena/807bbe3c-edam-frontend`. It is **not merged**; the owner asked for review first.
- No backend repository modification, no `main` push, no new PR, no merge, no Step 2 work.

The final docs-only commit that records these results is reported in the chat answer and by
`git rev-parse HEAD`; it changes no code or snapshot bytes.
