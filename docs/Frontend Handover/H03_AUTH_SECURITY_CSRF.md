# H03 — Authentication, Sessions, CSRF, Bootstrap

EDAM uses **server-side Spring Security sessions with CSRF double-submit cookies**. No JWTs, no
local-storage tokens. The frontend is a pure cookie client.

## 1. Session lifecycle

| Event | API call | Cookies set / cleared | Frontend state |
|-------|----------|-----------------------|----------------|
| App boot | `GET /api/v1/auth/me` (AUTH-008) | Session & CSRF cookies already present if valid | Hydrate auth store; if 401 → anonymous state |
| Anonymous user visits app | `GET /api/v1/auth/installation` (AUTH-005) then `GET /api/v1/auth/csrf` (AUTH-003) | `XSRF-TOKEN` set; no `JSESSIONID` | Show login or bootstrap depending on `bootstrapped` flag |
| Login | `POST /api/v1/auth/login` (AUTH-006) | `JSESSIONID` + rotated `XSRF-TOKEN` (HttpOnly, SameSite=Lax) | Decode `CurrentUserResponse` → auth store |
| Logout | `POST /api/v1/auth/logout` (AUTH-007) | `JSESSIONID` cleared; `XSRF-TOKEN` rotated | Clear auth store → `/login` |
| Session expires | Any call returning 401 `UNAUTHENTICATED` | Browser still has stale cookies until next `/csrf` call | Publish `auth:expired`, clear store, redirect to `/login?returnTo=<path>` |
| Must-change-password | On `GET /auth/me`, `mustChangePassword: true` | — | Force redirect to `/change-password` until flag clears |
| Forgot password | `POST /api/v1/auth/forgot-password` (AUTH-004) | — | Always show "If that email exists…" to avoid enumeration |
| Reset password | `POST /api/v1/auth/reset-password` (AUTH-009) with `?token=` from email | — | On success → login screen with "Password updated" toast |

## 2. CSRF (double-submit cookie)

Configuration source: `com.edam.config.SecurityConfig` line 185:
```java
http.csrf(csrf -> csrf.csrfTokenRepository(CookieCsrfTokenRepository.withHttpOnlyFalse()));
```

This means:

- Cookie name: **`XSRF-TOKEN`** (set on every GET that hits the filter chain, including `/auth/csrf`).
- Request header name: **`X-XSRF-TOKEN`**.
- The cookie is **not** HttpOnly so JavaScript can read it; HttpOnly+SameSite protection lives
  on the `JSESSIONID` cookie.
- All state-changing requests (`POST`, `PUT`, `PATCH`, `DELETE`) MUST send the header.
- The cookie is **rotated** on login and logout. After login, re-read the cookie before issuing
  any further writes (the TanStack Query `onSuccess` of the login mutation should refetch
  `/auth/csrf` once, or simply re-read `document.cookie`).
- GET, HEAD, OPTIONS do not require CSRF.
- CSRF failure returns 403 `ACCESS_DENIED`. If the frontend sees a 403 that is not a genuine
  permission denial, the recovery is: refetch `GET /auth/csrf`, wait one tick, retry once.

Cookie parsing helper (TypeScript):
```ts
function readCsrfCookie(): string | null {
  const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
```

## 3. Bootstrap (one-time installation)

Before the first user exists, the backend exposes `GET /api/v1/auth/installation` (public) which returns `{ bootstrapped, bootstrappedAt }`.

- If `bootstrapped === false` on app boot → redirect to `/bootstrap`.
- The bootstrap form posts to `POST /api/v1/auth/bootstrap` and **must** send the one-time token
  provided by the server operator (via env/config) in the header:

  ```
  X-Installation-Token: <token>
  ```

  ⚠️ **The correct header name is `X-Installation-Token`** (source: `AuthController.java:196`).
  Earlier drafts used `X-EDAM-Bootstrap-Token` — that is wrong and will be rejected with 401.

- On success (200, `BootstrapResponse`), the user is logged in as the installation admin; route
  to `/` and continue normal boot.
- If the endpoint returns `INSTALLATION_ALREADY_COMPLETED` (422), the boot was raced or the
  token was used twice → redirect to `/login`.

## 4. `/api/v1/system/info` is NOT public

`GET /api/v1/system/info` (SYS-001) returns version/build metadata but is **deny-by-default** —
it requires an authenticated session. Do not call it from the public login/boot screens; call it
after the user is authenticated (e.g. on the post-login settings screen) or gate it with a
permission-appropriate admin page. Source: `SecurityConfig.publicMatchers()` does NOT include it.

## 5. `GET /api/v1/public/configuration` is the only public config source

Use it on the login screen to load branding, theme tokens, feature flags, and the password
policy preview. It does NOT require CSRF or a session. Response type: `PublicConfigurationResponse`.

## 6. Route-level auth matrix

| Route group | Required state | Redirect if unmet |
|-------------|----------------|-------------------|
| `/login`, `/forgot-password`, `/reset-password`, `/bootstrap` | anonymous | If logged in → `/` |
| `/change-password` | authenticated with `mustChangePassword=true` | `/` if flag false |
| `/app/*` (all app routes) | authenticated + `mustChangePassword=false` | `/login?returnTo=` (or `/change-password`) |
| Admin routes (`/app/admin/*`) | authenticated + relevant permission | `<AccessDenied/>` in-slot (do not redirect away) |

## 7. Security hardening for the frontend

- **Never** store the session token in localStorage/sessionStorage. Cookies are the only store.
- **Never** send credentials to third-party origins; enforce `VITE_API_BASE_URL` same-origin via
  proxy in dev and same-origin deployment in prod.
- Set `credentials: 'include'` on every fetch (TanStack Query `defaultOptions.credentials`).
- On logout, call `/auth/logout` AND clear in-memory caches (QueryClient.clear(), navigate away,
  wipe local non-sensitive UI state like open modals — but do NOT touch cookies).
- CSP (set by backend or reverse proxy): `default-src 'self'`; `img-src 'self' data:; script-src
  'self'; style-src 'self' 'unsafe-inline'` (required for Tailwind runtime or shadcn CSS-in-JS if
  any is used). Avoid `unsafe-eval`.
- The frontend must **never** echo the `correlationId` into UI except on 5xx errors; do not
  expose raw error stacks.
- The `/auth/csrf` endpoint can be called anonymously but is rate-limited; do not poll it.
