# H13 — Testing Strategy

The frontend must be confidently shippable against a backend that evolves. Tests run in three
layers: unit, integration (with MSW mocking the network), and E2E (Playwright against a real
backend in Docker compose). A contract-testing step ensures generated types match the live
OpenAPI document.

## 1. Tools

| Layer | Tool | What it covers |
|-------|------|----------------|
| Unit test runner | Vitest | Pure functions, hooks, reducers, formatters, small components |
| Component testing | Vitest + RTL + `@testing-library/user-event` | UI components with mocked backends |
| HTTP mocking | MSW (Mock Service Worker) | Intercepts `fetch` at the Service Worker level (browser & node) |
| E2E | Playwright (Chromium + Firefox + WebKit) | Critical user flows against a real backend in Docker Compose |
| Visual regression | Playwright screenshots + Percy or Chromatic (Phase 2) | Design system stability |
| A11y | `axe-core` in Playwright + Storybook test runner | WCAG 2.1 AA |
| CI | GitHub Actions (or existing CI) | Lint, typecheck, unit, integration, build, E2E on PR; contract test nightly |
| Coverage | V8 / c8 | Target ≥ 80% lines on critical paths (auth, workflows, apiFetch wrapper) |

## 2. MSW handler contract

The same `openapi-typescript` types that power the app power MSW: every handler must return the
generated response type for the endpoint it mocks. Handler implementations must be realistic
(return same HTTP statuses the backend returns; honour the filter/sort parameters; paginate).

- Keep mocks colocated with feature code: `features/requests/mocks/handlers.ts`.
- Use `@mswjs/data` to build an in-memory fixture store for lists (requests, approvals, users).
- Always include handlers for: success, empty, validation error, 401, 403, 404, 5xx, slow
  (for loading-state tests).
- The dev server uses MSW in `development` mode only (behind a Vite `VITE_ENABLE_MOCKS` flag);
  production builds never include MSW.

## 3. Test pyramid (examples)

### Unit
- `lib/format/money` — currency formatting with edge cases (zero, negative, multi-currency).
- `lib/format/date` — timezone handling, invalid dates.
- `auth/guards` — route gate logic for permission combinations.
- `api/client` — error normalization: envelope shape, 401 redirect, CSRF header attachment.

### Integration
- Login form: submit with good creds → calls AUTH-006 → stores user; bad creds → shows error;
  locked account → 423 screen; mustChangePassword → redirect.
- Request wizard: client validation blocks submit; server validation renders fieldErrors from
  the envelope; successful create navigates to detail.
- Approval case file: availableActions drive button visibility; approve/reject/forward/revert
  call correct endpoint; comment-required enforced for reject/revert.
- Register page: pagination, sorting, filter state in URL, empty state, error retry.

### E2E (Playwright)
- W1: Bootstrap fresh instance.
- W2: Login, see dashboard, logout.
- W3: Forgot/reset password flow (with email captured via MailHog/Mailpit in compose).
- W4+W6: Create draft → submit → appears in approver's inbox.
- W8–W11: Approver approves / rejects / forwards / reverts; verify status transitions and
  timelines.
- W14: Export CSV and XLSX, verify download contents.
- W17: Upload document → poll scan status → download via signed URL.
- Admin: create role, assign permission, create user, see new user can see route.
- Session: idle timeout, CSRF rotation, expired-session redirect.

## 4. Contract / drift detection

CI nightly:
1. Start backend against an ephemeral DB.
2. Fetch `/v3/api-docs` to a temp file.
3. Run `npx openapi-typescript` into a temp location; diff against `src/api/generated/schema.d.ts`.
4. Fail if diff is non-empty — a PR must be opened to regenerate types before drifting code can merge.
5. Additionally run a lightweight endpoint liveness check: for every endpoint tagged as
  Phase-1 in H01, send a minimal authenticated request and confirm the response matches the
  generated schema (use `openapi-response-validator`).

## 5. Test data

- Maintain a Docker Compose fixture set (seed SQL) with:
  - 1 institution admin (`admin` / `Admin123!`)
  - 2 departments × 2 branches
  - 5 users (requester, approver, finance, auditor)
  - Sample requests in each state (DRAFT, SUBMITTED, APPROVED, REJECTED, RETURNED, CANCELLED)
  - Published workflow definitions for OPEX/CAPEX
  - Pre-set approval limits covering small/medium/large amounts
- Reset DB between E2E runs (Docker volume rm or Flyway clean + migrate).

## 6. Accessibility tests

- Every E2E flow ends with `await axe(page).check()` on the final screen.
- Focus-visible test: tab through every form and confirm focus ring moves predictably.
- Screen-reader labels: assert accessible names for icon buttons and status badges.
- Colour contrast in CI: render theme tokens (light and dark, if dark mode added later) and
  verify contrast ratios with `get-contrast`.

## 7. Performance budgets (enforced in CI via Lighthouse CI)

| Route | Lighthouse Performance | TTI | Bundle size |
|-------|------------------------|-----|-------------|
| Login | ≥ 95 | < 2 s 3G slow | initial JS < 200 KB gzipped |
| Dashboard | ≥ 90 | < 3 s 3G slow | initial JS < 350 KB gzipped |
| Requests register (100 rows) | ≥ 85 | < 3 s | route chunk < 80 KB gzipped |
| Approval case file | ≥ 85 | < 3 s | route chunk < 100 KB gzipped |

Charts and the table virtualizer are code-split so they do not inflate the initial bundle.
