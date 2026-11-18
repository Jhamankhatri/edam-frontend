# H17 — Deployment & Local Setup

Documentation for running the frontend locally against the backend, and for deploying it to
production. Because Phase 0 of this handover is documentation only, the steps below are the
*plan*; Phase 1 implements the actual scaffolding.

## 1. Local development

### Prerequisites

| Tool | Version |
|------|---------|
| Node.js | 20 LTS (or newer) |
| pnpm (preferred) / npm / yarn | latest |
| Docker + Docker Compose | for backend dependencies (PostgreSQL, Redis if used, Mailpit) |
| JDK 21 | for running the backend (or use the published backend Docker image) |

### Backend (required for API)

1. Clone the backend repo (`Jhamankhatri/edam`).
2. `cd edam && cp .env.example .env` (adjust DB passwords, bootstrap token, etc.).
3. Start dependencies:
   ```bash
   docker compose up -d postgres redis mailpit
   ```
4. Run the backend:
   ```bash
   ./gradlew bootRun
   ```
   The backend starts on `http://localhost:8080`, serves its API at `/api/v1/**`, SpringDoc at
   `http://localhost:8080/v3/api-docs`, Swagger UI at `/swagger-ui.html`.
5. On first run the backend is unbootstrapped. The frontend `/bootstrap` flow creates the first
   admin (pass the one-time installation token via the `X-Installation-Token` header — the
   operator copies it from backend stdout/.env).

### Frontend (Phase 1 onward)

1. `cd edam-frontend && pnpm install` (after scaffolding is added in Phase 1).
2. Create `.env.local` with:
   ```
   VITE_API_BASE_URL=/api/v1
   VITE_APP_NAME=EDAM
   VITE_DEFAULT_LOCALE=en-GB
   VITE_IDLE_TIMEOUT_MINUTES=25
   ```
3. Vite dev server proxies `/api/*` → `http://localhost:8080` (configured in `vite.config.ts`).
4. `pnpm dev` → open `http://localhost:5173`.
5. **Regenerate types** whenever the backend changes:
   ```bash
   pnpm codegen    # runs openapi-typescript against http://localhost:8080/v3/api-docs
   pnpm typecheck  # tsc --noEmit
   ```

### Seed/demo data

- Use the backend's Flyway migrations plus a `src/test/resources/fixtures/` SQL script (provided
  by backend team) to seed demo users, departments, workflow definitions, approval limits, and
  sample requests. The E2E suite (H13) manages its own fixtures; do not rely on demo data for
  E2E.

## 2. Production deployment

### Build

```bash
pnpm install --frozen-lockfile
pnpm codegen       # generates types against the PROD backend's OpenAPI doc at build time, OR
                   # against a checked-in schema artifact produced in the backend pipeline
pnpm build         # Vite builds to dist/ (SPA, static assets)
```

The `dist/` directory is the entire deployable artifact. All paths are relative; the app is an
SPA with `index.html` as the entry.

### Serve

Any static file server works. Recommended:
- **Nginx** (most common): serve `dist/`, set `try_files $uri $uri/ /index.html;` to enable
  client-side routing.
- **CDN (Cloudflare/S3+CloudFront)** for static assets; the API must be same-origin or proxied
  to avoid CORS issues with cookies.

Reverse proxy must forward `/api/v1/**` to the backend with cookies preserved.

### Required environment (build-time)

As listed in H01 §3: `VITE_API_BASE_URL`, `VITE_APP_NAME`, `VITE_DEFAULT_LOCALE`,
`VITE_IDLE_TIMEOUT_MINUTES`, optional `VITE_SENTRY_DSN`, `VITE_ENABLE_PWA`.

### Runtime branding

The backend's `GET /api/v1/public/configuration` provides institution name, logo URL, and theme
tokens at runtime — no rebuild needed for rebranding.

### Cookie / session considerations for prod

- Ensure the reverse proxy serves the frontend over **HTTPS** (cookies have `Secure` when
  Spring is configured for secure cookies).
- Backend should set `SameSite=Lax` on the session cookie (current config); CSRF cookie is
  `SameSite=Lax` too.
- Frontend and backend **must** be same-site (eTLD+1) for cookies to be sent cross-subdomain.
  The simplest setup is same-origin (frontend and API both served from the same host, with
  `/api/` proxied to backend).
- If frontend and API are on different origins (e.g. `app.example.com` and `api.example.com`),
  backend CORS config must allow the frontend origin with `allowCredentials(true)` and
  `Access-Control-Allow-Headers` including `X-XSRF-TOKEN`, `X-Installation-Token`,
  `Idempotency-Key`, `Content-Type`.

### Reverse proxy timeouts

- Set longish read timeouts for the export endpoint (RPT-002) — SXSSF streams large Excel files
  and a 60 s proxy timeout can truncate big exports. Recommend 5 min for `/api/v1/reporting/**`.
- Disable request buffering for the export endpoint so XLSX/CSV flow to the client as the
  backend writes them.

### Content Security Policy

Recommended CSP for production (delivered as HTTP header by the reverse proxy):

```
Content-Security-Policy:
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';            # required for Tailwind
  img-src 'self' data: blob:;
  font-src 'self' data:;
  connect-src 'self' https://sentry.example.com;   # add Sentry/ingest if used
  frame-ancestors 'none';
  base-uri 'self';
  form-action 'self';
  object-src 'none';
  upgrade-insecure-requests;
```

Iterate from here; serve in `Report-Only` mode for one staging cycle before enforcing.

### CORS summary

If frontend and backend are same-origin (recommended), no CORS headers needed. If cross-origin,
backend must list the frontend origin in `application.yml` `cors.allowed-origins`. The frontend
must send `credentials: 'include'` on every request.

### Healthchecks & monitoring

- The frontend's static hosting returns 200 for `/` (served `index.html`); monitor that.
- Backend health at `/actuator/health` (publicly accessible per current `SecurityConfig`).
- Use `VITE_SENTRY_DSN` (or other RUM) for frontend error tracking; attach `correlationId` to
  error reports from API calls so frontend and backend traces can be correlated.

## 3. CI/CD pipeline (recommended)

1. PR → install, lint, typecheck, unit tests, MSW integration tests, Playwright smoke (light),
   OpenAPI codegen diff (fail if types drift).
2. Merge to main → build, Playwright full E2E against Docker Compose, publish docker/static
   artifact.
3. Deploy to staging → smoke tests against staging.
4. Promote to production.

## 4. Backend baseline alignment

- The frontend tracks a specific backend commit (documented in H01 §1). When the backend moves,
  re-run `docs/phase-4j/_generated/` introspection, regenerate this handover, regenerate
  OpenAPI types, and run the contract-test step (H13 §4).
- Do not deploy a frontend built against one backend baseline to an environment running a
  different baseline — contracts (especially enums and error codes) change, and the generated
  TS types will catch this if codegen is re-run.
