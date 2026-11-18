# H06 — Validation, Forms & Error Handling

## 1. Validation philosophy

EDAM's backend is the authority for data validity. The frontend performs **assistive** validation
to give immediate feedback, but every write goes through `@Valid` + `@EdamPermission` + service
rules on the server. Client-side validation errors must never be the only protection.

## 2. Client-side validation matrix

Mirror these Bean Validation annotations (from introspected DTOs) on the client for instant feedback:

| Annotation | Client rule |
|------------|-------------|
| `@NotBlank`, `@NotNull` | required field; trim before check |
| `@Size(max=N)` | max chars (text) / max items (arrays); show counter |
| `@Size(min=N, max=M)` | bounds |
| `@Email` | RFC 5322-ish email regex (use `validator.js` `isEmail`) |
| `@Pattern(regexp=…)` | regex match (e.g. employee codes, currencies) |
| `@Min`, `@Max`, `@Positive`, `@PositiveOrZero` | numeric bounds |
| `@Past`, `@PastOrPresent`, `@Future`, `@FutureOrPresent` | date bounds |
| `@Valid` on nested object/array | validate recursively |
| Monetary amounts | Accept digit + up to N decimal places (currency-specific); store as string (never `number`) |
| UUIDs | Accept hex-dash form; do not invent UUIDs client-side except `Idempotency-Key` |
| Enums | Restrict to the codegen'd union type; render as `<Select>` to avoid typos |

For password fields, additionally enforce `PasswordPolicyView` from `GET /auth/me` (min length,
require uppercase/digit/special). Do not hard-code these values — they come from server config.

## 3. Displaying server validation errors

When the envelope returns HTTP 400 with `error.code === "VALIDATION_FAILED"`:

```ts
// envelope.fieldErrors: Array<{ field: string; message: string }>
```

The `field` expression uses dot-path + bracket notation, e.g.:
- `allocations[2].amount`
- `email`
- `newPassword`

Use a `setServerFieldErrors(fieldErrors)` helper that walks the form schema (react-hook-form
`setError`) to place messages next to the correct inputs. For array items, target the correct
index. Fields that don't map to any input (e.g. an idempotency collision) render as a form-
level error banner.

Server `message` values are already human-readable and localized (the backend uses Spring
MessageSource); display them verbatim — do not re-map or wrap.

## 4. Non-validation error UX

| Error category | UX treatment |
|----------------|--------------|
| 401 `UNAUTHENTICATED` | Redirect to `/login?returnTo=`; show "Your session expired" toast once |
| 403 `PERMISSION_DENIED` / `ACCESS_DENIED` | `<AccessDenied/>` in route outlet (primary nav) or disabled-with-tooltip (row action) |
| 404 `NOT_FOUND` | `<NotFound/>` screen; for records outside data scope the server deliberately returns 404 to prevent existence leaks |
| 409 `CONCURRENT_MODIFICATION` | Modal "Record changed elsewhere" with two actions: **Reload latest** (discard edits) and **Merge** (if client can 3-way merge) |
| 409 `DUPLICATE_RESOURCE` | Map to field-level error on the offending input (e.g. username/email/code) if the error message identifies it; otherwise form-level |
| 409 `IDEMPOTENCY_*` | "Your request is already being processed" with a link to the affected record; reload the list |
| 422 `WEAK_PASSWORD` | Render password policy hints next to password field |
| 422 `INSTALLATION_*` | Redirect with explanatory message |
| 423 `ACCOUNT_LOCKED` | Lockout screen with retry timing |
| 5xx | "Something went wrong" with `correlationId` exposed so support can locate the trace; log to Sentry |
| Network failure (no response) | Offline banner; queue non-destructive actions? (Phase 3+) |

## 5. Form patterns

- **Forms use react-hook-form + zod** (or valibot): zod schemas for client validation, inferred
  TS types, and a `useApiForm` wrapper that wires server fieldErrors to `setError` automatically.
- **Debounce async lookups** (user search, category search) at 300 ms.
- **Dirty detection**: route guards must prompt "Discard unsaved changes?" before navigation.
- **Save draft** where supported (drafts are server-side, not local).
- **Disable submit** when: submitting in flight, client-validation failing, or no dirty fields.
- **Optimistic UI** is forbidden for state changes (submit/approve/reject/etc). Optimistic UI
  for ancillary actions (e.g. marking notifications read, toggling a UI-only sidebar preference
  that is later persisted) is acceptable.

## 6. Toasts vs. inline vs. modal

- **Inline:** per-field errors and confirmation text immediately below the input.
- **Toast:** global outcomes (record saved, export started, copy-to-clipboard). Auto-dismiss
  after 4 s except for errors (dismiss on click or navigation).
- **Modal:** destructive confirmations (cancel, reject, delete), comment-required actions
  (reject, revert), merge-on-conflict dialog.

## 7. Idempotency & retries

- Every write endpoint annotated `@IdempotentOperation` must send `Idempotency-Key: <uuidv4()>`
  (generated per user action, not per fetch attempt). The key persists across retries of the
  same action.
- On network failure **retry GETs once** with 1 s backoff; never retry non-GETs automatically —
  the user must explicitly retry (the idempotency key keeps the second attempt safe).
- The TanStack Query mutation `retry` config should be `0` for writes and `1` for reads.

## 8. Loading states

- **List/table:** skeleton rows matching the column layout (avoid spinners inside tables — they
  break rhythm).
- **Detail page:** skeleton card matching the final layout; never unmount the shell.
- **Buttons:** replace label with a small spinner and disable on submit.
- **Empty state:** specific (e.g. "You have no pending approvals") with a primary CTA (e.g.
  "View all requests").
- **Empty filters:** "No requests match your filters" with Clear-filters CTA.
