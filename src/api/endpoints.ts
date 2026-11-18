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
