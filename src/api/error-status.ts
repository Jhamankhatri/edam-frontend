/**
 * Backend HTTP-status semantics for the Step 1 error boundary.
 *
 * Evidence: checked-in Java source at
 * `Jhamankhatri/edam@620f7a795cc67a16e905115131f561bbd986af85`
 * (`src/main/java/com/edam/common/exception/GlobalExceptionHandler.java`,
 * `statusFor` at lines 258-285 and the dedicated persistence handlers at lines 213-228).
 *
 * The pinned OpenAPI 3.1 document from backend Actions run 44395699755 declares only
 * HTTP 200 for all 208 operations and zero security schemes. It therefore cannot
 * adjudicate H02 §3's error statuses, and it also omits the HTTP 201 creation
 * statuses used by several controllers. Error statuses below are source-derived,
 * not invented from the spec. See `docs/PHASE1_STEP1_CONTRACT_NOTES.md` §2.
 */

/** `HttpStatus.FORBIDDEN` branch of `statusFor`; also the Spring Security CSRF status. */
export const FORBIDDEN_STATUS = 403;

/** Server-side failures: 500 INTERNAL_ERROR, 502 BAD_GATEWAY, 503 SERVICE_UNAVAILABLE. */
export const SERVER_ERROR_STATUS_THRESHOLD = 500;

/** Exactly the codes that `statusFor` maps to 403, plus the security advice's ACCESS_DENIED. */
const PERMISSION_DENIED_CODES: ReadonlySet<string> = new Set([
  'EDAM-2002', // ACCESS_DENIED
  'EDAM-2005', // PERMISSION_DENIED
  'EDAM-2003', // INSTITUTION_REQUIRED
  'EDAM-2004', // INSTITUTION_ACCESS_DENIED
]);

export function isPermissionDeniedCode(code: string | undefined | null): boolean {
  return code !== undefined && code !== null && PERMISSION_DENIED_CODES.has(code);
}

/**
 * H02 §3 entries that disagree with the backend source. Values are the statuses the
 * source actually emits; `EDAM-5001` has two because `DataIntegrityViolationException`
 * yields 409 while the broader `DataAccessException` advice yields 503.
 *
 * `EDAM-5005` is included because the earlier audit incorrectly claimed `statusFor`
 * had no branch for it: it is in the BAD_REQUEST branch, so H02's 400 is correct.
 */
export const SOURCE_ERROR_STATUS_BY_CODE = {
  'EDAM-3001': [422], // BUSINESS_RULE_VIOLATION; H02 says 409
  'EDAM-3004': [422], // INVALID_STATE_TRANSITION; H02 says 409
  'EDAM-5003': [502], // EXTERNAL_SERVICE_FAILURE; H02 says 503
  'EDAM-5001': [409, 503], // PERSISTENCE_ERROR; H02 says 409 only
  'EDAM-5005': [400], // INVALID_CONFIGURATION; H02's 400 is correct (earlier audit error)
} as const satisfies Readonly<Record<string, readonly number[]>>;
