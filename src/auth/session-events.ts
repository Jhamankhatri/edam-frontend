export const AUTH_EXPIRED_EVENT = 'auth:expired';

export interface AuthExpiredDetail {
  path: string;
  correlationId?: string;
}

export function publishAuthExpired(detail: AuthExpiredDetail): void {
  window.dispatchEvent(new CustomEvent<AuthExpiredDetail>(AUTH_EXPIRED_EVENT, { detail }));
}

export function subscribeToAuthExpired(listener: (detail: AuthExpiredDetail) => void): () => void {
  const handler = (event: Event): void => {
    const customEvent = event as CustomEvent<AuthExpiredDetail>;
    listener(customEvent.detail);
  };
  window.addEventListener(AUTH_EXPIRED_EVENT, handler);
  return () => window.removeEventListener(AUTH_EXPIRED_EVENT, handler);
}
