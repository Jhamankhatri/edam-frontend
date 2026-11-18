# H03 — Authentication, Sessions, CSRF, Bootstrap

Session model: server-side Spring Security sessions, `JSESSIONID` HttpOnly cookie, CSRF
double-submit cookie. No JWT, no localStorage tokens.

## 1. Session lifecycle

| Event | API | Cookies | Frontend |
|-------|-----|---------|----------|
| App boot | `GET /auth/me` (AUTH-008). If 401 → anonymous state. | Reuses existing `JSESSIONID`. | Hydrate auth store; if 401 → treat as anonymous. |
| CSRF priming | `GET /auth/csrf` (AUTH-003) BEFORE first write. | Explicitly sets/rotates `XSRF-TOKEN` cookie. | Read cookie after response resolves. |
| Login | `POST /auth/login` (AUTH-006), body `{username, password}`. | Sets `JSESSIONID` (HttpOnly, SameSite=Lax) and rotates `XSRF-TOKEN`. | Store `CurrentUserResponse`, call `/auth/csrf` or re-read cookie. |
| Logout | `POST /auth/logout` (AUTH-007). No body. | Invalidates `JSESSIONID`; `XSRF-TOKEN` rotated. | Clear QueryClient and auth store; navigate `/login`. |
| Session expires | Any call returning 401 `EDAM-2001`. | Cookies may still be present. | Publish `auth:expired`, clear store, redirect `/login?returnTo=`. |
| Must-change-password | `GET /auth/me` returns `mustChangePassword:true`. | — | Force redirect `/change-password`. |
| Forgot password | `POST /auth/forgot-password` (AUTH-004). Always returns the same `NeutralResponse`. | — | Show constant message (no enumeration). |
| Reset password | `POST /auth/reset-password` (AUTH-009) with `{token, newPassword}`. | — | On success → `/login` with toast. |
| Change password | `POST /auth/change-password` (AUTH-002). | — | Return to previous screen. |
| Installation status | `GET /auth/installation` (AUTH-005). | None required. | If `!bootstrapped` → `/bootstrap`. |
| Bootstrap | `POST /auth/bootstrap` (AUTH-001) with `X-Installation-Token` header, body `BootstrapRequest`. | Does NOT set session cookie. | On 201, show "Administrator created — please sign in" → navigate `/login`. |

## 2. Bootstrap flow detail (D-23)

Bootstrap returns **201 Created** with `BootstrapResponse { userId, username, displayName, roles, bootstrappedAt }`.
Unlike login, the bootstrap endpoint does NOT call `securityContextRepository.saveContext(...)`,
so no session is established and no `JSESSIONID` is issued. The UI MUST prompt the administrator
to sign in explicitly after bootstrap. This separation is by design: the installation token is
a setup credential, not a user credential.

## 3. CSRF double-submit cookie

Source: `SecurityConfig.csrfTokenRepository()`:
```java
CookieCsrfTokenRepository.withHttpOnlyFalse()
```

- Cookie name: **`XSRF-TOKEN`**; readable by JS (not HttpOnly).
- Request header: **`X-XSRF-TOKEN`** on every POST/PUT/PATCH/DELETE.
- The cookie is set (persisted) by Spring's CsrfFilter on the first non-GET request OR when
  explicitly loaded and saved. **IMPORTANT:** because Spring 6 uses deferred CSRF tokens, a GET
  request alone does NOT necessarily materialise the cookie. The client MUST call
  `GET /auth/csrf` (which reads the `_csrf` attribute and calls `csrfTokenRepository.saveToken`)
  before its first write; this is the only way to guarantee the cookie is present.
- Cookie is rotated on login and logout. After login success, either re-call `/auth/csrf` or
  re-read `document.cookie` before the next write.
- If a write returns 403 without a permission-denied code (i.e. raw Spring CSRF failure),
  refetch `/auth/csrf` and retry the request once (stale token after rotation).

Cookie reader:
```ts
function readCsrfCookie(): string | null {
  const m = document.cookie.match(/(?:^|;\s*)XSRF-TOKEN=([^;]+)/);
  return m ? decodeURIComponent(m[1]) : null;
}
```

## 4. Bootstrap header

Header name: **`X-Installation-Token`** (one-time installation token). This is the ONLY place
the installation token is accepted; never put it in the URL body, localStorage, or logs.

## 5. Public vs. authenticated endpoints

Per `SecurityConfig.publicMatchers` at `securityFilterChain`:

Public (no session required):
- `POST /api/v1/auth/login`, `POST /api/v1/auth/logout`, `GET /api/v1/auth/csrf`,
  `GET /api/v1/auth/installation`, `POST /api/v1/auth/bootstrap`,
  `POST /api/v1/auth/forgot-password`, `POST /api/v1/auth/reset-password`,
  `GET /api/v1/public/configuration`,
  `/error`, `/v3/api-docs/**`, `/swagger-ui*`, `/actuator/health[/…]`, `/actuator/info`.

Authenticated (any logged-in user, no specific permission):
- `GET /api/v1/auth/me`, `POST /api/v1/auth/change-password`.

**`GET /api/v1/system/info` (SYS-001) is authenticated (deny-by-default at the filter chain).**
The method is annotated `@PublicEndpoint` but that annotation is documentation-only (enforced
by an architecture test, not by the filter chain); the SecurityConfig `publicMatchers` list
does not include `/api/v1/system/info`, so unauthenticated access receives 401.

## 6. Route auth matrix

| Route group | Required state | Redirect |
|-------------|----------------|----------|
| `/login`, `/forgot-password`, `/reset-password`, `/bootstrap` | anonymous | If logged in → `/` |
| `/change-password` | authenticated with `mustChangePassword=true` | `/` if flag false |
| `/app/*` | authenticated + `mustChangePassword=false` | `/login?returnTo=` or `/change-password` |
| Admin routes | authenticated + route permission | `<AccessDenied/>` in outlet (no silent redirect) |

## 7. Security hardening

- `credentials: 'include'` globally; no `Authorization` header.
- Never persist tokens in localStorage/sessionStorage.
- Same-origin deployment strongly recommended (Vite proxy dev, Nginx proxy prod); CORS needed
  only for cross-origin and must `allowCredentials(true)` (see H17).
- CSP (see H17) must block `unsafe-eval`; Tailwind requires `style-src 'self' 'unsafe-inline'`.
- The frontend must never echo stack traces, raw server error messages, or the installation
  token into the UI.
