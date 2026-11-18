# H15 — Open Decisions & Risks

Items that require a decision or that carry known risk. Each entry has an owner (backend or
frontend), impact, and recommended mitigation.

## Open decisions

| ID | Area | Decision needed | Owner | Recommended default | Notes |
|----|------|-----------------|-------|---------------------|-------|
| OD-1 | Export formats | When will PDF/print be added? | Backend + product | Phase 4 | XLSX and CSV are shipping (see H12); disable PDF/print buttons in UI until then. |
| OD-2 | Session idle timeout | What is the enforced idle timeout (server session TTL)? | Backend | Default 30 min with 5-min warning | Frontend must read TTL from server (or use a conservative 25 min default) for the warning dialog. |
| OD-3 | Real-time updates | Polling interval vs WebSocket/SSE for approval badges & notification counts | Both | Start with 60 s polling in Phase 1; upgrade to WebSocket in Phase 3 |
| OD-4 | Branding & white-label | How much theming is customer-configurable (fonts? radius? full palette)? | Product + backend | Primary/accent colour, logo, institution name (what `/public/configuration` currently provides) |
| OD-5 | File upload size cap | What is the max per-file size? | Backend | Default 25 MB (must align with `spring.servlet.multipart.max-file-size`). Client should enforce a lower soft cap. |
| OD-6 | Localization | First additional language (Urdu?) and RTL target? | Product | Start with `en-GB` LTR only in Phases 1–2 |
| OD-7 | Document preview | Client-side PDF.js preview vs signed URL redirecting to browser viewer? | Frontend | PDF.js modal preview for PDF; native browser for images; download for others. |
| OD-8 | Multi-currency display | Cross-currency dashboards vs always convert to base currency? | Product | Base-currency dashboard (current backend behaviour); show per-currency breakdown in register totals. |
| OD-9 | User management model | Self-service profile edits (avatar, display name, default currency)? | Product | No in Phase 1–2; admin-managed users. |
| OD-10 | SSO | SAML / OIDC timeline | Backend + product | Phase 4. |
| OD-11 | Mobile experience | Responsive web only vs native apps / PWA offline | Product | Responsive web through Phase 3; PWA in Phase 4. |
| OD-12 | Email verification | Email verification on signup? | Backend + product | None initially (admin-provisioned accounts); optional Phase 3. |

## Known risks

| Risk | Likelihood | Impact | Mitigation |
|------|------------|--------|------------|
| R-1 Contract drift between frontend and backend | Medium | High | OpenAPI codegen in CI; nightly contract test (H13 §4); never hand-write DTO types. |
| R-2 XSRF cookie rotation after login causing a spurious 403 on first post-login write | Medium | Medium | After login success, re-read CSRF token from cookie before any subsequent write; if 403, refetch `/auth/csrf` and retry once. |
| R-3 Large XLSX exports timing out through proxies | Low | Medium | Server uses SXSSF streaming and flushes headers early; use `fetch` streaming; show progress bar; configure reverse proxy with a generous read timeout. |
| R-4 Optimistic-lock conflicts on concurrent edits of drafts (two tabs, requester + delegate) | Medium | Medium | Send `If-Match` on updates; surface CONCURRENT_MODIFICATION dialog (H06 §4). |
| R-5 Session expiry mid-form loses unsaved data | Medium | Medium | Warn before navigation when form is dirty; warn with "Session about to expire" prompt; auto-save drafts where the backend supports (drafts are server-persisted already for expense requests). |
| R-6 Browser back/forward after action (e.g. Approve) re-submits | Low | Medium | After successful mutation, call `router.navigate()` with `replace: true` on the action route so back does not re-POST; also rely on idempotency keys to safely no-op retries. |
| R-7 CSP misconfiguration blocks styles or analytics | Low | Medium | Maintain a strict CSP in H17; test in staging with CSP-Report-Only before enforcing. |
| R-8 Installation token leak during bootstrap | Low | Critical (single-tenant takeover) | Bootstrap token is single-use and short-lived; frontend only sends it once; never persists it; warn operator in the UI not to paste it into non-bootstrap pages. |
| R-9 Data scope misunderstanding leads UI to show "no results" instead of prompting for scope grant | Medium | Medium | When register returns 0 rows AND the user is not an admin, show an additional callout: "Can't find what you're looking for? You may need a wider data scope — contact your administrator." |
| R-10 Monetary amount rounding errors in JS | High (if using `number`) | High | Always use `decimal.js-light`; never `Number()` on money fields; treat all money values as strings on the wire. |

## Out of scope for Phase 1 (do NOT build yet)

- Dark mode.
- Custom report builder.
- PDF export / print view.
- Global search across modules.
- WebSocket/SSE realtime (polling is fine).
- Web-push notifications.
- Offline support / PWA.
- Localization beyond en-GB.
- SSO/SAML.
- Two-factor authentication.
- Inline rich-text comments (plain-text only).
