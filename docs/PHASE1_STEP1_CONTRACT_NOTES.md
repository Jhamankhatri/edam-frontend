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

**Status: resolved (Category 2A) with backend source evidence.** The genuine OpenAPI 3.1 document
pinned in §14 declares **only HTTP 200** for all 208 operations and zero security schemes, so it
cannot adjudicate error statuses; several controllers also return HTTP 201 even though the spec
declares 200 (`AuthController#bootstrap`, `WorkflowConfigurationController#create`). Backend Java
source at `620f7a795cc67a16e905115131f561bbd986af85` is therefore authoritative:
`src/main/java/com/edam/common/exception/GlobalExceptionHandler.java`, `statusFor` lines 258-285 and
dedicated persistence handlers lines 213-228.

| Code | H02 §3 | Source status | Evidence |
|---|---:|---:|---|
| `EDAM-3001 BUSINESS_RULE_VIOLATION` | 409 | **422** | `statusFor`: `BUSINESS_RULE_VIOLATION, INVALID_STATE_TRANSITION -> UNPROCESSABLE_CONTENT` |
| `EDAM-3004 INVALID_STATE_TRANSITION` | 409 | **422** | same switch branch |
| `EDAM-5003 EXTERNAL_SERVICE_FAILURE` | 503 | **502** | `statusFor`: `EXTERNAL_SERVICE_FAILURE -> BAD_GATEWAY` |
| `EDAM-5001 PERSISTENCE_ERROR` | 409 | **409 or 503** | `statusFor`/`DataIntegrityViolationException` → 409; `DataAccessException` advice → 503 |
| `EDAM-5005 INVALID_CONFIGURATION` | 400 | **400** | `INVALID_CONFIGURATION` **is** in `statusFor`'s first `BAD_REQUEST` branch; the earlier audit note claiming a missing branch was incorrect |

So H02 §3 is stale for exactly four codes (`EDAM-3001`, `EDAM-3004`, `EDAM-5003`, `EDAM-5001`);
`EDAM-5005` was never a discrepancy. The 19 approved handover documents remain unchanged; the
source-derived table is recorded in `src/api/error-status.ts` and locked by
`src/api/openapi-contract.test.ts`. The client still keys conditional logic off `error.code`; the
only status-specific decisions are the source-derived 403 permission-code classification and the
`>= 500` correlation-ID hint, both now centralized in `error-status.ts`. No status-specific Step 2
behavior, toast, retry policy, or invented status is introduced.

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

**Status: resolved (Category 2B) with the genuine pinned OpenAPI document.** Every H10 lookup path
was checked against the SHA-256-verified artifact from backend Actions run 44395699755 and against
`ExpenseConfigurationController`, `WorkflowConfigurationController`, `MasterDataController` and
`OrganizationController` at backend commit `620f7a795cc67a16e905115131f561bbd986af85`. None of the
five H10-only paths exists in the spec: `/api/v1/configuration/request-types`,
`/api/v1/configuration/expense-categories`, `/api/v1/configuration/expense-natures`,
`/api/v1/configuration/workflows/active`, `/api/v1/organization/departments/tree`.

| H10 | Authoritative spec path | Method / shape | Permission (backend source) |
|---|---|---|---|
| `/configuration/request-types` | `/api/v1/expense-configuration/request-types` | GET → `ApiResponseListLookupResponse` | `expense-configuration:view` (CFG-009) |
| `/configuration/expense-categories` | `/api/v1/expense-configuration/categories` | GET, optional `includeInactive` → `ApiResponseListCategoryResponse` | `expense-configuration:view` (CFG-001) |
| `/configuration/expense-natures` | `/api/v1/expense-configuration/natures` | GET → `ApiResponseListLookupResponse` | `expense-configuration:view` (CFG-006) |
| `/configuration/workflows/active` | `/api/v1/workflows` | GET, optional `includeInactive` → `ApiResponseListDefinitionResponse` | `workflow:view` (WF-001), **not** `expense-configuration:view` |
| `/master-data/currencies?active=true` | `/api/v1/master-data/currencies` | GET, optional `includeInactive` (there is no `active` parameter) | `currency:view` |
| `/master-data/vendors?page=...` | `/api/v1/master-data/vendors` | GET, `search`/`page`/`size`/`sort` → `ApiResponsePageResponseVendorResponse` | `vendor:view` (**not** `currency:view`) |
| `/master-data/tax-authorities?page=...` | `/api/v1/master-data/tax-authorities` | GET, no pagination parameters, returns a plain list | `currency:view` |
| `/organization/departments/tree` | `/api/v1/organization/units/tree` | GET → `ApiResponseListOrganizationUnitNode`; `/organization/departments` has no `/tree` child | `organization:view` |
| `/organization/branches` | `/api/v1/organization/branches` | GET (H10 path correct) | `organization:view` |

H10's blanket permissions are also wrong: the four config/workflow lookups do not all require
`expense-configuration:view`, and the three master-data lookups do not all require `currency:view`.
The canonical paths are recorded in `src/api/endpoints.ts` as `CANONICAL_LOOKUP_ENDPOINTS`, proven
against the generated `paths` interface at compile time and against the pinned JSON at test time.
Step 1 calls no lookup endpoint, so no H10 path is encoded in any screen.

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

**Status: resolved (Category 1).** Backend PR #26 added a `war-package-smoke-test` step that starts
the real Spring Boot WAR and captures `/v3/api-docs`; Actions run
`https://github.com/Jhamankhatri/edam/actions/runs/44395699755` uploaded artifact
`openapi-620f7a795cc67a16e905115131f561bbd986af85` (id `14472210141`, ZIP `25622` bytes). The
genuine JSON is pinned at
`openapi-spec/openapi-620f7a795cc67a16e905115131f561bbd986af85.json` (`229310` bytes, SHA-256
`9533c5a5a9ce3044b2543cabaa7db09952b26c9e8581e08baf9889c33df2843d`) with its `.meta.txt`
provenance file. `npm run types:generate` now verifies that checksum, runs the pinned
`openapi-typescript@7.13.0` against the JSON, and writes
`src/api/generated/schema.d.ts` (`11377` lines, `340588` bytes, 164 paths / 208 operations / 299
schemas). CI regenerates it and fails on drift via `npm run types:check`. No live backend, database,
or credentials are needed in frontend CI. See §14 for the update procedure.

Inspection of the genuine spec: all 208 operations declare only HTTP 200 success responses, 79 have
request bodies, and there are 233 declared parameters. Response DTO schemas carry no `required`
array and no `nullable` markers, so generated response fields are optional and non-nullable; request
schemas such as `LoginRequest` do declare `required` fields. The cross-cutting Step-1 types in
`src/api/contracts.ts` therefore remain separate and deliberately stricter (`string | null` for
nullable Java record fields) rather than being replaced by weaker generated shapes. No DTO is
invented and no generated definition is hand-written or simplified.

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
| §2 | H02 §3 HTTP status mapping. | 2 | **Resolved.** Four stale statuses (`EDAM-3001`/`3004` → 422, `EDAM-5003` → 502, `EDAM-5001` → 409 or 503) are recorded from `GlobalExceptionHandler.statusFor`; `EDAM-5005` → 400 was an earlier audit error, not a backend discrepancy. The pinned spec declares only 200 responses, so source is authoritative. `src/api/error-status.ts` centralizes the 403 permission classification and is covered by tests. H02 itself is unchanged. |
| §3 | H08 theme-token naming differs from `PublicConfigurationService` camelCase/kebab/snake/prefixed keys. | 3 | `src/lib/theme.ts` maps all documented aliases safely and retains H08 fallbacks. Choose a canonical naming convention before the later theming/branding module; no Step 1 behavior changes. |
| §4 | H17 requires `X-Installation-Token` in CORS; backend `CorsConfig` omits it. | 4 | Same-origin deployment and Vite proxy avoid preflight. Cross-origin bootstrap requires a backend CORS change; the backend is READ-ONLY in this audit and no frontend workaround was added. |
| §5 | H10 lookup paths and permissions differ from Appendix A/source. | 2 | **Resolved.** All five H10-only paths are absent from the genuine spec; the nine canonical paths, real query parameters, response shapes and distinct permission codes are recorded in §5 and `CANONICAL_LOOKUP_ENDPOINTS`. Compile-time and runtime contract tests lock them. No H10 path is encoded in Step 1 screens; H10/Appendix A are unchanged. |
| §6 | H04/H09/Appendix A dashboard permission conflict. | 4 | Product/owner decision. Step 1 preserves H04 nav visibility to authenticated users and the stricter H09/Appendix A `report:view` route rule; it calls no dashboard API. If Step 2 implements dashboard widgets, this decision becomes a Step 2 implementation gate. |
| §7 | H02 §8 / H17 require generated OpenAPI types and a CI diff check. | 1 | **Resolved.** The genuine, checksum-verified artifact from backend run `44395699755` is pinned with provenance metadata; `npm run types:generate` produces `src/api/generated/schema.d.ts`; `npm run types:check` and the `openapi-contract` CI job regenerate and fail on drift. No production backend or credentials run in frontend CI. PR #3 remains open and unmerged awaiting review, but the Category 1 gate is cleared. |
| §8 | `PasswordPolicyView.requireSpecial` publishes no accepted character class. | 3 | Step 1 displays the policy and relies on server `EDAM-2008 WEAK_PASSWORD`; no regex was invented. Resolve before a later password-policy/validation module. |
| §9 | H07 names `src/routes/app/layout.tsx`; TanStack Router 1.160 uses `route.tsx`. | 4 | Framework-convention documentation decision. The generated route tree uses `route.tsx`; no runtime defect. Update H07 wording or formally accept the convention. |
| §10 | H09 places `/change-password` in the app Shell; Step 1 uses the restricted public security layout. | 4 | Product/security decision. The restricted layout avoids exposing permission-aware navigation before mandatory credential change and preserves H03's forced redirect. Approve either a documentation correction or an explicit layout change; no unauthorized content is exposed during initialization. |
| §11 | `PublicConfigurationResponse.activeThemeType` is Java `String`, while H08 says only LIGHT is used in Phase 1. | 3 | Step 1 uses `string | null` so future server values are not rejected. Decide whether to formalize an enum before the later theming module; do not constrain the DTO now. |
| §12 | `document:view` appears in docs but not in the backend 60-code permission catalogue. | 3 | The generated catalogue remains authoritative. Resolve docs/code naming before the document module; Step 1 includes no document tab or guard. |

### Classification summary

- **Category 1:** §7 — **cleared** with the genuine pinned artifact, generated schema and CI
  consistency check. PR #3 stays open and unmerged because the owner asked for review first; no
  exception or downgrade was used.
- **Category 2:** §2 and §5 — **cleared** with backend-source and genuine-spec evidence, code
  changes, and contract regression tests.
- **Category 3:** §3, §8, §11, and §12. These are gates before their respective later modules.
- **Category 4:** §1, §4, §6, §9, and §10. These require product, deployment, or documentation
  owner decisions; none changes a backend contract in this audit.

The backend `main` advanced to `2835eb55d6595a56d43cabb5eb83370b5ca2b2b2` (PR #26 merged); that
commit only changed `.github/workflows/ci.yml`, so the API contract for the pinned snapshot remains
backend commit `620f7a795cc67a16e905115131f561bbd986af85`.

No ordinary React inline styles, scattered hardcoded colors, duplicated permission matrices, or
invented backend contracts were introduced by the audit corrections. The companion
`docs/PHASE1_STEP1_ENGINEERING_AUDIT.md` records the files reviewed, fixes, deferred items,
commands, results, commit SHA, and PR #3 URL.

## 14. Updating the pinned OpenAPI snapshot for a backend API change

The frontend never starts Spring Boot, PostgreSQL, or uses production credentials. The snapshot is
a byte-exact JSON captured by the backend's own `war-package-smoke-test` job from a live WAR. To
update it after a backend API change:

1. In the **backend** repository, let the `war-package-smoke-test` job run. Its
   `Capture OpenAPI spec` step writes `/v3/api-docs` to an artifact named
   `openapi-<backend-commit-sha>` alongside a `.meta.txt` file containing
   `backend_commit_sha`, `workflow_run_id`, `http_status`, `size_bytes`, `sha256`, `paths`,
   `operations`, `component_schemas` and `security_schemes`.
2. Download the artifact into this repository with
   `gh run download <run-id> --repo Jhamankhatri/edam --name openapi-<sha> --dir ./openapi-spec`.
   Keep the `.meta.txt`. Do not hand-edit, reformat, or transcribe the JSON: its exact bytes are
   the checksum input.
3. Rename/`--dir` the files so the JSON filename is `openapi-<backend-commit-sha>.json` and the
   metadata file is `openapi-<backend-commit-sha>.meta.txt`. Update the filename, SHA and expected
   byte size in:
   - `scripts/verify-openapi-snapshot.mjs` (`expectedSha256`, `expectedSize`, backend commit,
     spec/meta paths, metadata assertions);
   - `scripts/annotate-openapi-schema.mjs` (provenance header);
   - `package.json` `types:generate` input path;
   - `src/api/openapi-contract.test.ts` (snapshot path, SHA, expected structural counts).
4. Run `npm run types:generate`. It refuses to proceed unless `npm run types:checksum` verifies
   the exact SHA-256, byte size and metadata. Commit both the JSON, `.meta.txt`, the regenerated
   `src/api/generated/schema.d.ts`, and the script/package/test updates together.
5. Run `npm run types:check`. It regenerates the definitions and fails if the committed
   `schema.d.ts` differs. CI runs the same two commands in the `openapi-contract` job on every
   push/PR, so a snapshot change without regenerated types cannot merge.

Provenance for the current snapshot:

| Field | Value |
|---|---|
| Backend commit | `620f7a795cc67a16e905115131f561bbd986af85` |
| Workflow run / head SHA | `44395699755` / `a1414ba98e3722062859a59a4dc0424c8ec3fb27` |
| War-smoke job / check-run | `135126464210` |
| Artifact name / id | `openapi-620f7a795cc67a16e905115131f561bbd986af85` / `14472210141` |
| Artifact ZIP size | `25622` bytes |
| JSON size | `229310` bytes |
| JSON SHA-256 | `9533c5a5a9ce3044b2543cabaa7db09952b26c9e8581e08baf9889c33df2843d` |
| Source URL in runner | `http://localhost:18080/v3/api-docs` (HTTP 200) |
| Generator | `openapi-typescript@7.13.0` |
