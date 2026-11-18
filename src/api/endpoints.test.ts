import { describe, expect, it } from 'vitest';
import { ENDPOINTS, IDEMPOTENT_ROUTES, isIdempotentEndpoint } from './endpoints';

describe('documented endpoint constants', () => {
  it('uses the exact Step 1 backend paths', () => {
    expect(ENDPOINTS.authLogin).toBe('/auth/login');
    expect(ENDPOINTS.authCsrf).toBe('/auth/csrf');
    expect(ENDPOINTS.authBootstrap).toBe('/auth/bootstrap');
    expect(ENDPOINTS.publicConfiguration).toBe('/public/configuration');
  });

  it('records exactly the eight H02 idempotent routes', () => {
    expect(IDEMPOTENT_ROUTES).toHaveLength(8);
    expect(isIdempotentEndpoint('POST', '/expense-requests')).toBe(true);
    expect(isIdempotentEndpoint('PUT', '/expense-requests/request-1')).toBe(true);
    expect(isIdempotentEndpoint('POST', '/approvals/tasks/task-1/approve')).toBe(true);
  });

  it('does not attach an idempotency key to login or profile reads', () => {
    expect(isIdempotentEndpoint('POST', ENDPOINTS.authLogin)).toBe(false);
    expect(isIdempotentEndpoint('GET', ENDPOINTS.authMe)).toBe(false);
  });
});
