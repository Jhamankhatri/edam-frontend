# H07 — Frontend Architecture

Phase 1 target stack (blueprint only — scaffolding begins after handover sign-off):

| Layer | Choice |
|-------|--------|
| Language | TypeScript 5 (strict) |
| Framework | React 18 + Vite 5 |
| Routing | TanStack Router (file-based: `src/routes/**`) |
| Data/cache | TanStack Query |
| Forms | react-hook-form + zod |
| UI primitives | shadcn/ui (Radix) + Tailwind CSS v3 |
| Tables | TanStack Table |
| Dates | date-fns |
| Decimals | decimal.js-light |
| Toasts | sonner |
| Charts | recharts (Phase 1 dashboard) |
| Testing | Vitest + RTL + MSW + Playwright |
| Codegen | openapi-typescript |

Route file conventions (TanStack Router):
- `src/routes/login.tsx`, `src/routes/bootstrap.tsx`, `src/routes/forgot-password.tsx`,
  `src/routes/reset-password.tsx`, `src/routes/change-password.tsx` (public).
- `src/routes/__root.tsx` (error boundary, providers).
- `src/routes/app/layout.tsx` (authenticated shell).
- `src/routes/app/dashboard.tsx`, `src/routes/app/requests/mine.tsx`, `src/routes/app/requests/all.tsx`,
  `src/routes/app/requests/new.tsx`, `src/routes/app/requests/$id/index.tsx`,
  `src/routes/app/requests/$id/edit.tsx`, `src/routes/app/approvals/index.tsx`,
  `src/routes/app/approvals/tasks.$taskId.tsx`, `src/routes/app/notifications/index.tsx`.

Folder layout: `api/` (client + hooks + generated/), `routes/`, `components/ui|forms|layout|domain|feedback`,
`features/` (optional groupings), `hooks/`, `auth/`, `lib/`, `styles/`, `config/`.

Data-flow:
- All server state through TanStack Query; hierarchical query keys; mutations invalidate affected keys.
- Preload on hover; prefetch shell loaders.
- Theme applied at boot from `GET /public/configuration` → CSS custom properties on `:root` (from `themeTokens` map).
- Auth boot: root route loader calls `/auth/me`; 401 → anonymous state.

Security checklist: `credentials:'include'`, `X-XSRF-TOKEN` on writes, `Idempotency-Key` on
annotated endpoints, no `dangerouslySetInnerHTML`, no token logging, CSP without `unsafe-eval`.
