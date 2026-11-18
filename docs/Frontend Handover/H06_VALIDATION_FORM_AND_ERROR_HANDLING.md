# H06 — Validation, Forms & Error Handling

## Client validation
Mirror Bean Validation annotations: `@NotBlank/@NotNull`, `@Size(min/max)`, `@Email`, `@Pattern`,
`@Min/@Max/@Positive`, `@Digits`, `@Past/@Future`. For money use `decimal.js-light` and enforce
4-decimal precision. Passwords must honour `PasswordPolicyView` from `GET /auth/me` (min/max
length, required upper/lower/digit/special flags).

## Server validation parsing
On HTTP 400 with `error.code === "EDAM-1001"` use `fieldErrors[]`. Field expressions use dot-path
with bracket indices (`allocations[2].amount`). A helper `setServerFieldErrors(fieldErrors)` walks
react-hook-form via `setError`. Server `message` values are safe and localized — display verbatim.

## Error UX

| Category | Treatment |
|----------|-----------|
| 401 EDAM-2001 | Redirect `/login?returnTo=` |
| 403 EDAM-2002/2005 | `<AccessDenied/>` in outlet (primary nav) or disable-with-tooltip (row actions) |
| 404 EDAM-4001 | `<NotFound/>` |
| 409 EDAM-3002/3003 (concurrency / precondition) | Modal: "Record changed elsewhere" → reload |
| 409 EDAM-5002 (duplicate) | Field-level error on offending input |
| 409 IDEMPOTENCY_* | "Request already in progress"; link to record |
| 422 EDAM-2008 (weak password) | Password policy hints |
| 423 EDAM-2007 (account locked) | Lockout screen |
| 400 EDAM-5004 (invalid document) | Inline upload error (type/size/scan) |
| 5xx | "Something went wrong" + correlationId |
| Network failure | Offline banner; retry GETs once with backoff; never auto-retry writes |

## Forms
- react-hook-form + zod; `useApiForm` wires server fieldErrors to `setError`.
- Debounce async lookups (300 ms).
- Dirty guard: "Discard unsaved changes?" on navigation.
- Submit disabled when invalid, submitting, or no dirty fields.
- NO optimistic UI for state changes (optimistic only for pure client UI, e.g. sidebar).

## Loading states
- Lists: skeleton rows (not spinners in tables).
- Detail: skeleton card; never unmount the shell.
- Buttons: spinner + disabled while submitting.
- Empty states: context-specific ("No pending approvals — great job").
