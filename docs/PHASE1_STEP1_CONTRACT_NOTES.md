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

## 13. Strict engineering audit classification (2026-11-18)

The 19 approved handover documents remain byte-for-byte unchanged. This section classifies every
discrepancy above using the requested gates:

1. **Must resolve before PR #3 merge.**
2. **Must resolve before Phase 1 Step 2.**
3. **Must resolve before the relevant later module.**
4. **Deployment or product decision.**

Categories are strict gates, not severity scores. No backend contract is invented or changed here.

| Note | Discrepancy | Category | Strict audit decision |
|---|---|---:|---|
| §1 | Documentation baseline still names backend PR #24 `38cedbc`; remote `main` is `620f7a7`. | 4 | Documentation-governance decision. It has no Step 1 runtime effect; the frontend used the exact current backend SHA and checked-in Java sources. Do not silently rewrite the approved baseline without an owner decision. |
| §2 | H02 HTTP status mapping differs from `GlobalExceptionHandler.statusFor` for `EDAM-3001`, `EDAM-3004`, `EDAM-5003`, `EDAM-5001`, and `EDAM-5005`. | 2 | Step 1 correctly keys conditional logic off `error.code`, not guessed statuses. Before Step 2 error/toast/retry handling, use the source-derived statuses or obtain an approved H02 correction. |
| §3 | H08 theme-token naming differs from `PublicConfigurationService` camelCase/kebab/snake/prefixed keys. | 3 | `src/lib/theme.ts` maps all documented aliases safely and retains H08 fallbacks. Choose a canonical naming convention before the later theming/branding module; no Step 1 behavior changes. |
| §4 | H17 requires `X-Installation-Token` in CORS; backend `CorsConfig` omits it. | 4 | Same-origin deployment and Vite proxy avoid preflight. Cross-origin bootstrap requires a backend CORS change; the backend is READ-ONLY in this audit and no frontend workaround was added. |
| §5 | H10 lookup paths differ from Appendix A/source (`/configuration/...` vs `/expense-configuration/...` and `/workflows`). | 2 | Step 1 calls no lookup endpoints. Before Step 2 lookup-backed screens, use Appendix A/source paths and verify against live `/v3/api-docs`; do not encode H10 paths. |
| §6 | H04/H09/Appendix A dashboard permission conflict. | 4 | Product/owner decision. Step 1 preserves H04 nav visibility to authenticated users and the stricter H09/Appendix A `report:view` route rule; it calls no dashboard API. If Step 2 implements dashboard widgets, this decision becomes a Step 2 implementation gate. |
| §7 | H02 §8 / H17 require generated OpenAPI types from live `/v3/api-docs`; `src/api/generated/schema.d.ts` is missing. | 1 | **Unresolved PR #3 merge blocker under a strict H02 reading.** No Spring Boot/PostgreSQL runtime is available in the frontend workspace, and the backend's own `Frontend Integration/20_OPENAPI_SPECIFICATION.md` says no static generated OpenAPI file is shipped and its checked-in skeleton has `paths: {}`. The lightweight CI intentionally does not fabricate codegen or run an expensive backend job. Before PR #3 merge, provide a live backend runtime, run `npm run types:generate`, commit the generated schema, and add a diff check. If stakeholders formally accept a frontend-only exception, reclassify this item to Category 2; the audit does not make that exception. |
| §8 | `PasswordPolicyView.requireSpecial` publishes no accepted character class. | 3 | Step 1 displays the policy and relies on server `EDAM-2008 WEAK_PASSWORD`; no regex was invented. Resolve before a later password-policy/validation module. |
| §9 | H07 names `src/routes/app/layout.tsx`; TanStack Router 1.160 uses `route.tsx`. | 4 | Framework-convention documentation decision. The generated route tree uses `route.tsx`; no runtime defect. Update H07 wording or formally accept the convention. |
| §10 | H09 places `/change-password` in the app Shell; Step 1 uses the restricted public security layout. | 4 | Product/security decision. The restricted layout avoids exposing permission-aware navigation before mandatory credential change and preserves H03's forced redirect. Approve either a documentation correction or an explicit layout change; no unauthorized content is exposed during initialization. |
| §11 | `PublicConfigurationResponse.activeThemeType` is Java `String`, while H08 says only LIGHT is used in Phase 1. | 3 | Step 1 uses `string | null` so future server values are not rejected. Decide whether to formalize an enum before the later theming module; do not constrain the DTO now. |
| §12 | `document:view` appears in docs but not in the backend 60-code permission catalogue. | 3 | The generated catalogue remains authoritative. Resolve docs/code naming before the document module; Step 1 includes no document tab or guard. |

### Classification summary

- **Category 1:** §7 only. PR #3 remains open and must not be merged until the strict H02
  generated-schema requirement is satisfied or a separately approved exception is recorded.
- **Category 2:** §2 and §5. These are hard gates before Step 2 work.
- **Category 3:** §3, §8, §11, and §12. These are gates before their respective later modules.
- **Category 4:** §1, §4, §6, §9, and §10. These require product, deployment, or documentation
  owner decisions; none changes a backend contract in this audit.

No ordinary React inline styles, scattered hardcoded colors, duplicated permission matrices, or
invented backend contracts were introduced by the audit corrections. The companion
`docs/PHASE1_STEP1_ENGINEERING_AUDIT.md` records the files reviewed, fixes, deferred items,
commands, results, commit SHA, and PR #3 URL.
