export const ENDPOINTS = {
  authBootstrap: '/auth/bootstrap',
  authChangePassword: '/auth/change-password',
  authCsrf: '/auth/csrf',
  authForgotPassword: '/auth/forgot-password',
  authInstallation: '/auth/installation',
  authLogin: '/auth/login',
  authLogout: '/auth/logout',
  authMe: '/auth/me',
  authResetPassword: '/auth/reset-password',
  publicConfiguration: '/public/configuration',
  approvalsCount: '/approvals/count',
  notificationsUnreadCount: '/notifications/unread-count',
} as const;

/**
 * Spec-verified canonical lookup paths for Step 2 form filters. H10's "Lookup
 * endpoints used by forms" section names `/configuration/*`, `/workflows/active`
 * and `/organization/departments/tree`; none of those paths exists in the pinned
 * OpenAPI document from backend commit 620f7a795cc67a16e905115131f561bbd986af85.
 *
 * These constants are deliberately relative to `/api/v1`, matching `ENDPOINTS`,
 * and are verified against the generated `paths` type and the pinned JSON in
 * `src/api/openapi-contract.test.ts`. No Step 1 screen calls them; they exist so
 * later modules cannot silently reintroduce the H10 paths.
 */
export const CANONICAL_LOOKUP_ENDPOINTS = {
  requestTypes: '/expense-configuration/request-types',
  expenseCategories: '/expense-configuration/categories',
  expenseNatures: '/expense-configuration/natures',
  workflowDefinitions: '/workflows',
  currencies: '/master-data/currencies',
  vendors: '/master-data/vendors',
  taxAuthorities: '/master-data/tax-authorities',
  departments: '/organization/departments',
  organizationUnitTree: '/organization/units/tree',
  branches: '/organization/branches',
} as const;

interface IdempotentRoute {
  method: 'POST' | 'PUT';
  pattern: RegExp;
}

/** H02 §6 / README canonical contract: exactly eight HTTP-exposed idempotent endpoints. */
export const IDEMPOTENT_ROUTES: readonly IdempotentRoute[] = [
  { method: 'POST', pattern: /^\/expense-requests\/?$/ },
  { method: 'PUT', pattern: /^\/expense-requests\/[^/]+\/?$/ },
  { method: 'POST', pattern: /^\/expense-requests\/[^/]+\/cancel\/?$/ },
  { method: 'POST', pattern: /^\/expense-requests\/[^/]+\/submit\/?$/ },
  { method: 'POST', pattern: /^\/approvals\/tasks\/[^/]+\/approve\/?$/ },
  { method: 'POST', pattern: /^\/approvals\/tasks\/[^/]+\/forward\/?$/ },
  { method: 'POST', pattern: /^\/approvals\/tasks\/[^/]+\/reject\/?$/ },
  { method: 'POST', pattern: /^\/approvals\/tasks\/[^/]+\/revert\/?$/ },
] as const;

export function isIdempotentEndpoint(method: string, path: string): boolean {
  return IDEMPOTENT_ROUTES.some(
    (route) => route.method === method.toUpperCase() && route.pattern.test(path),
  );
}
