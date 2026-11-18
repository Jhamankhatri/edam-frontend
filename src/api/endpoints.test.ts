import { describe, expect, it } from 'vitest';
import { ENDPOINTS, IDEMPOTENT_ROUTES, isIdempotentEndpoint } from './endpoints';

const IDEMPOTENT_CALLS: readonly [method: 'POST' | 'PUT', path: string][] = [
  ['POST', '/expense-requests'],
  ['PUT', '/expense-requests/request-1'],
  ['POST', '/expense-requests/request-1/cancel'],
  ['POST', '/expense-requests/request-1/submit'],
  ['POST', '/approvals/tasks/task-1/approve'],
  ['POST', '/approvals/tasks/task-1/forward'],
  ['POST', '/approvals/tasks/task-1/reject'],
  ['POST', '/approvals/tasks/task-1/revert'],
];

describe('documented endpoint constants', () => {
  it('uses the exact Step 1 backend paths', () => {
    expect(ENDPOINTS.authLogin).toBe('/auth/login');
    expect(ENDPOINTS.authCsrf).toBe('/auth/csrf');
    expect(ENDPOINTS.authBootstrap).toBe('/auth/bootstrap');
    expect(ENDPOINTS.publicConfiguration).toBe('/public/configuration');
  });

  it('records exactly the eight H02 idempotent routes', () => {
    expect(IDEMPOTENT_ROUTES).toHaveLength(8);
    for (const [method, path] of IDEMPOTENT_CALLS) {
      expect(isIdempotentEndpoint(method, path)).toBe(true);
    }
  });

  it('does not attach an idempotency key to auth, reads, or near-miss paths', () => {
    const nonIdempotentCalls: readonly [method: string, path: string][] = [
      ['POST', ENDPOINTS.authLogin],
      ['POST', ENDPOINTS.authBootstrap],
      ['POST', ENDPOINTS.authLogout],
      ['GET', ENDPOINTS.authMe],
      ['GET', '/expense-requests'],
      ['POST', '/expense-requests/request-1/attachments'],
      ['POST', '/approvals/tasks/task-1/approve/extra'],
      ['POST', '/internal/integrations/executions'],
    ];
    for (const [method, path] of nonIdempotentCalls) {
      expect(isIdempotentEndpoint(method, path)).toBe(false);
    }
    expect(isIdempotentEndpoint('post', '/expense-requests')).toBe(true);
  });
});
