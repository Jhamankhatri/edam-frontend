# H07 — Frontend Architecture

This is the **target architecture** for the React + TypeScript frontend. It is documentation only
(Phase 0); scaffolding begins in Phase 1 after handover review. Source inspiration:
`docs/phase-4j/FRONTEND_ARCHITECTURE_BLUEPRINT.md`, tightened for production readiness and
incorporating the H01–H06 contracts.

## 1. Stack

| Layer | Choice | Rationale |
|-------|--------|-----------|
| Language | TypeScript 5.x strict mode | Type safety across generated API types |
| Framework | React 18 + Vite 5 | Fast HMR, modern build, small prod bundle |
| Routing | TanStack Router | Type-safe routes, loader/actions, nested layouts |
| Data fetching & cache | TanStack Query | Normalized server state, background refetch, optimistic invalidation |
| Forms | react-hook-form + zod | Minimal re-renders, schema-driven validation, good TS inference |
| UI primitive set | shadcn/ui (Radix) | Accessible, composable headless primitives, styleable with Tailwind |
| Styling | Tailwind CSS v3 + CSS custom properties for theming | Server-driven branding (see §4) |
| Tables | TanStack Table | Sorting, filtering, column reorder, virtualization for large registers |
| Dates | `date-fns` + `react-day-picker` | Lightweight, tree-shakable |
| Decimals | `decimal.js-light` | Safe arithmetic for monetary amounts |
| Toast | `sonner` | Accessible, unopinionated |
| Charts | `recharts` (Phase 2) | Out-of-the-box responsive dashboard charts |
| Testing | Vitest + React Testing Library + MSW + Playwright | See H13 |
| Codegen | `openapi-typescript` (+ optional `openapi-typescript-codegen` for fetch clients) | Type-safe API layer directly from SpringDoc (H02 §5) |

## 2. Folder layout

```
src/
├── api/
│   ├── client.ts                # apiFetch wrapper (H02 §6), interceptors, error normalization
│   ├── hooks/                   # per-resource hooks: useExpenseRequest(), useApprovalCaseFile()...
│   └── generated/               # OpenAPI-generated types/clients (DO NOT EDIT)
├── app/                         # TanStack Router route tree (one file per route, mirroring H09)
│   ├── __root.tsx
│   ├── login.tsx / bootstrap.tsx / forgot-password.tsx / reset-password.tsx
│   └── app/
│       ├── layout.tsx           # authenticated shell (sidebar, topbar, context providers)
│       ├── dashboard.tsx
│       ├── requests/
│       ├── approvals/
│       ├── documents/
│       ├── reports/
│       ├── notifications/
│       └── admin/
├── components/
│   ├── ui/                      # shadcn/ui primitives + our composed components (Button, Input, DataTable...)
│   ├── forms/                   # form-field primitives (FormField, FormSection, MoneyInput...)
│   ├── layout/                  # Shell, Sidebar, Topbar, Breadcrumbs
│   ├── domain/                  # Business components: RequestStatusBadge, ApprovalTimeline,
│   │                            #   AmountCell, UserSelect, ScopeAwareDepartmentPicker...
│   └── feedback/                # EmptyState, LoadingSkeleton, ErrorState, AccessDenied, NotFound
├── features/                    # Feature slices (optional coarser grouping): requests/, approvals/,
│   │                            #   documents/, reports/, admin/...
├── hooks/                       # Generic hooks (usePermissions, useDebounce, useInterval, useTheme)
├── auth/                        # Auth store (zustand), login/logout/refresh logic
├── lib/                         # Utilities (formatters, cn(), logger, id-gen, constants)
├── styles/                      # Tailwind entry, CSS custom properties for tokens, global resets
├── types/                       # Hand-written ambient types (module shims, env types)
└── config/                      # Feature flags (read from server config), routes constants
```

## 3. Data-flow rules

- **All server state goes through TanStack Query.** No `useEffect` + fetch pairs against the API.
- **Query keys** are hierarchical: `['requests', 'list', {page, size, sort, filter}]`,
  `['requests', id]`, `['approvals', 'count']`, `['approvals', 'task', taskId]`. Mutations
  invalidate the affected keys; they never patch local state directly except for synchronous UI
  (e.g. closing a modal).
- **Optimistic updates only for local/pure-UI state** (sidebar collapse, theme switch, form
  drafts not yet submitted). Do not optimistically update business state (status badges, totals).
- **Preload** on hover for fast navigation (e.g. preload request detail when the user hovers a
  row in a register).
- **Prefetch** dashboard widgets and counts in the authenticated layout loader so shells are
  hydrated immediately.

## 4. Theme & branding (server-driven)

On boot, `GET /api/v1/public/configuration` returns theme tokens (primary, accent, etc.),
institution name, and logo URL. The app applies these by setting CSS custom properties on
`:root` at runtime:

```ts
function applyTheme(cfg: PublicConfigurationResponse) {
  const r = document.documentElement;
  r.style.setProperty('--primary', cfg.theme.primary);
  r.style.setProperty('--accent', cfg.theme.accent);
  // etc.; Tailwind references var(--primary) etc.
}
```

Tailwind is configured to use `var(--primary)` etc., not hard-coded colors. Logo goes into the
topbar. This enables per-institution white-labelling without rebuilds.

## 5. Authentication wrapper

```ts
// auth/useAuth.ts
interface AuthState {
  user: CurrentUserResponse | null;
  status: 'loading' | 'authenticated' | 'anonymous' | 'must-change-password';
}
```

- On app load, the root route loader calls `/auth/me`.
- If 401 → status `anonymous` → render public layout.
- If authenticated and `mustChangePassword` → force route to `/change-password`.
- All `/app/*` routes use a beforeLoad guard that redirects to `/login` (or `/change-password`).

## 6. Error/loading boundaries

- The root route renders an `<ErrorBoundary>` that catches any React/thrown error, logs to
  Sentry with correlationId if available, and shows a friendly "Something broke" screen with a
  Retry button.
- Each route's loader handles its own 401/403/404 by rendering the appropriate feedback
  component in the outlet.
- Suspense boundaries per major section (dashboard, list, detail) allow progressive hydration.

## 7. Security checklist (frontend-specific)

- `credentials: 'include'` globally; never set `Authorization` header.
- All writes send `X-XSRF-TOKEN` (read from `XSRF-TOKEN` cookie).
- `Idempotency-Key` sent on the idempotency-annotated endpoints (listed in H02 §6).
- Sanitize any user-supplied rich text (none expected in Phase 1; if added later, use DOMPurify).
- No `dangerouslySetInnerHTML` with server data except for pre-sanitized/empty bodies.
- Do not log PII or auth tokens to console in production builds (strip via Vite define).
- CSP in deployment must disallow `unsafe-eval` (avoid `new Function()` and eval-based libs).

## 8. Codegen workflow (in CI)

1. Start backend (`./gradlew bootRun` or Docker compose).
2. `npx openapi-typescript <backend>/v3/api-docs -o src/api/generated/schema.d.ts`.
3. `tsc --noEmit` — type errors indicate contract drift; build fails.
4. Optionally run `openapi-typescript-codegen` to regenerate typed fetchers.

The generated directory is committed (so frontend devs don't need a running backend to build),
but CI re-runs codegen and fails on diff.
