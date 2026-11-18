# H17 — Deployment & Local Setup

## 1. Backend (required for frontend dev)

1. Java 21, PostgreSQL 16 (or the version declared in `pom.xml`), Maven checked in.
2. Configure database and installation token via environment variables (see `application.yml`):
   - `SPRING_DATASOURCE_URL`, `SPRING_DATASOURCE_USERNAME`, `SPRING_DATASOURCE_PASSWORD`
   - `EDAM_INSTALLATION_TOKEN` (one-time bootstrap secret; must match the header the UI sends).
3. Run: `./mvnw spring-boot:run` — listens on `0.0.0.0:8080`.
4. Flyway runs on boot; V28 (`grant_view_own_to_wider_view_roles.sql`) is applied automatically.
5. Bootstrap once via the UI or:
   ```
   curl -X POST http://localhost:8080/api/v1/auth/bootstrap \
        -H "X-Installation-Token: $EDAM_INSTALLATION_TOKEN" \
        -H "Content-Type: application/json" \
        -d '{"username":"admin","firstName":"System","lastName":"Admin","email":"admin@example.com","password":"…"}'
   ```
   Expect HTTP 201 with `BootstrapResponse`. The admin must then explicitly log in.
6. Smoke-test: `curl -i http://localhost:8080/api/v1/public/configuration` → 200 JSON.

## 2. Frontend local dev

1. Node 20+; `corepack enable`; `pnpm install` (or package manager of choice).
2. `vite.config.ts` dev-server proxy:
   - `/api`, `/v3/api-docs`, `/swagger-ui`, `/actuator` → `http://localhost:8080` with
     `changeOrigin: true` and `credentials: 'include'` so cookies flow through.
3. `pnpm dev` → http://localhost:5173.
4. Regenerate TS types on backend pull:
   ```
   npx openapi-typescript http://localhost:8080/v3/api-docs -o src/api/generated/schema.d.ts
   ```

## 3. Production build

1. `pnpm build` → static assets in `dist/`.
2. Serve via Nginx behind TLS; Nginx reverse-proxies `/api`, `/actuator/health` to Spring Boot.
3. Nginx MUST NOT expose `/swagger-ui` or `/v3/api-docs` publicly; gate behind VPN or internal
   network.
4. Spring Boot bound to 127.0.0.1 when fronted by Nginx; same-origin by default.

## 4. CSP and CORS

- Same-origin deployment preferred (no CORS needed).
- If cross-origin is unavoidable, the backend CORS config must `allowCredentials(true)` and
  expose/allow request headers `Content-Type`, `X-XSRF-TOKEN`, `X-Installation-Token`,
  `Idempotency-Key`. Without those headers, CSRF/bootstrap/idempotency flows break.
- Recommended CSP:
  ```
  default-src 'self';
  script-src 'self';
  style-src 'self' 'unsafe-inline';        /* Tailwind runtime / shadcn */
  img-src 'self' data: blob:;
  connect-src 'self';                      /* expand for signed asset CDN when added */
  form-action 'self';
  frame-ancestors 'none';
  object-src 'none';
  base-uri 'self';
  ```
  When signed download URLs / CDN asset hosts are introduced for document preview (D-21),
  widen `img-src`/`connect-src` to those origins explicitly; do not use `*`.

## 5. Health, logs, correlation IDs

- `GET /actuator/health` (public) returns aggregate status; use for load-balancer probes.
- `correlationId` on every `ApiResponse` ties the response to server logs — surface it in
  the error toast for 5xx so users can quote it in support tickets.
- Configure production logging (JSON layout) and APM outside the scope of this frontend package.
