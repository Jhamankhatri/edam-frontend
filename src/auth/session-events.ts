import { isRecord } from '@/api/envelope';

export const AUTH_EXPIRED_EVENT = 'auth:expired';

export interface AuthExpiredDetail {
  path: string;
  correlationId?: string;
}

function isAuthExpiredDetail(value: unknown): value is AuthExpiredDetail {
  return (
    isRecord(value) &&
    typeof value.path === 'string' &&
    (value.correlationId === undefined || typeof value.correlationId === 'string')
  );
}

export function publishAuthExpired(detail: AuthExpiredDetail): void {
  window.dispatchEvent(new CustomEvent<AuthExpiredDetail>(AUTH_EXPIRED_EVENT, { detail }));
}

export function subscribeToAuthExpired(listener: (detail: AuthExpiredDetail) => void): () => void {
  const handler = (event: Event): void => {
    if (!(event instanceof CustomEvent) || !isAuthExpiredDetail(event.detail)) return;
    listener(event.detail);
  };
  window.addEventListener(AUTH_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
}
