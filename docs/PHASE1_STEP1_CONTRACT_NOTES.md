# Phase 1, Step 1 — Contract Notes

These notes record exact discrepancies found while implementing the first frontend foundation.
They do **not** modify the 19 approved handover documents. The backend repository remained
read-only. Source references are from `Jhamankhatri/edam` at
`620f7a795cc67a16e905115131f561bbd986af85`.

## 1. Documentation baseline in `00_README.md` / H01 / H16

- Approved docs still state the canonical baseline as backend PR #24 merge `38cedbc`.
- Remote backend `main` is `620f7a795cc67a16e905115131f561bbd986af85` (PR #25,
  `Merge pull request #25 from Jhamankhatri/docs/frontend-handover-consistency-audit`).
- PR #25 is a documentation consistency audit with no code or contract changes. The frontend
  uses the exact current remote SHA and the checked-in backend Java source for contracts.

## 2. H02 HTTP status mapping vs `GlobalExceptionHandler.statusFor`

H02 §3 lists several codes with statuses that differ from source:

| Code | H02 status | Source status |
|---|---:|---:|
| `EDAM-3001 BUSINESS_RULE_VIOLATION` | 409 | 422 |
| `EDAM-3004 INVALID_STATE_TRANSITION` | 409 | 422 |
| `EDAM-5003 EXTERNAL_SERVICE_FAILURE` | 503 | 502 |
| `EDAM-5001 PERSISTENCE_ERROR` | 409 | 409 for `DataIntegrityViolationException`; 503 for `DataAccessException` |
| `EDAM-5005 INVALID_CONFIGURATION` | 400 | `ErrorCode` exists, but `statusFor` has no explicit branch for it |

The API client keys conditional logic off `error.code` and treats HTTP status as transport
metadata. No guessed status-specific behavior is introduced for Step 1.

## 3. H08 theme-token naming vs `PublicConfigurationService`

- H08 says keys use snake-cased names and examples use CSS-variable style names such as `--primary`.
- Source emits unprefixed camelCase keys such as `primary`, `navBg`, `buttonPrimary`, and
  `buttonPrimaryText`; persisted token keys allow letters, digits, `_`, and `-` but not a leading `--`.
- The frontend maps both `--primary`, `primary`, `nav_bg`, and `navBg` forms to CSS custom
  properties, then keeps the H08 fallback tokens when the server supplies no override.

## 4. H17 CORS guidance vs `CorsConfig`

- H17 says CORS must allow `X-Installation-Token`.
- `CorsConfig` allows `Authorization`, `Content-Type`, `Accept`, `X-XSRF-TOKEN`,
  `X-Requested-With`, `X-Correlation-ID`, `If-Match`, and `Idempotency-Key`; it does **not**
  allow `X-Installation-Token`.
- Step 1 uses same-origin `/api/v1` calls through the Vite proxy and production same-origin
  deployment, so browser CORS preflight is not required. Cross-origin bootstrap will fail until
  the backend CORS configuration is changed. No frontend workaround is introduced.

## 5. H10 lookup paths vs Appendix A

H10 names `/configuration/request-types`, `/configuration/expense-categories`,
`/configuration/expense-natures`, and `/configuration/workflows/active`. Appendix A and source
use `/expense-configuration/request-types`, `/expense-configuration/categories`,
`/expense-configuration/natures`, and `/workflows` respectively. Step 1 does not call lookup
endpoints, so no incorrect path is encoded.

## 6. Dashboard route wording

- H04 §3 says Dashboard navigation is always visible to authenticated users and widgets are shown
  only with `report:view`.
- H09 says `/app/dashboard` has required permission `report:view`; Appendix A says RPT-001 requires
  `report:view`.
- Step 1 shows the Dashboard nav item to every authenticated user per H04, but uses the stricter
  H09/Appendix A route-level `report:view` rule. Users without the code see the professional
  access-denied experience rather than guessed data. This is a documentation-internal conflict,
  not a backend contract change; it is recorded as an unresolved product decision in the final
  report. No dashboard API is called in Step 1.

## 7. Required OpenAPI codegen

H02 §8 / H17 require `openapi-typescript` generation from a live `/v3/api-docs`. No backend runtime,
Java/Maven toolchain, or PostgreSQL service is available in the frontend workspace, so the generated
`src/api/generated/schema.d.ts` cannot be produced here. Step 1 defines only the cross-cutting
Step-1 types in `src/api/contracts.ts`, transcribed from the exact Java records above, and provides
`npm run types:generate` for the documented backend runtime. This is a known limitation, not a
contract assumption.

## 8. Password policy special-character class

`PasswordPolicyView` publishes `requireSpecial` but not the accepted character class. The change
password form displays the policy hint and relies on server error `EDAM-2008 WEAK_PASSWORD`; it
does not invent a special-character regex.

## 9. TanStack Router layout filename

H07 names `src/routes/app/layout.tsx` for the authenticated shell. TanStack Router 1.160's
file-based route generator uses `src/routes/app/route.tsx` for a route layout at `/app`; a file named
`layout.tsx` would generate `/app/layout`. The implementation uses `route.tsx` and keeps the shell
component in `src/components/layout/AppShell.tsx`. This is a framework-convention discrepancy, not
a backend contract change.

## 10. `mustChangePassword` layout

H09 lists `/change-password` with the application Shell. Step 1 uses the restricted public security
layout for that route so permission-aware navigation is not exposed before the mandatory credential
change is complete. H03's forced redirect is preserved.

## 11. `PublicConfigurationResponse.activeThemeType`

The backend Java record declares `activeThemeType` as `String`, not a closed `LIGHT | DARK` enum.
The Step 1 TypeScript contract uses `string | null` so it does not reject a future server value.
H08 says only the LIGHT theme is used in Phase 1; that is a product-scope statement, not a DTO
constraint.

## 12. `document:view` permission in H04 / README / H16

`00_README.md`, H04 §2, and H16 mention `document:view` for reading per-request documents. The
backend `Permissions.java` constants and the generated `_generated/permissions.json` catalogue
contain `document:upload`, `document:download`, and `document:delete`, but **no `document:view`**.
Step 1 does not implement the document tab and does not encode that code in any guard. The
generated 60-code catalogue remains authoritative; no role or permission mapping is invented.
