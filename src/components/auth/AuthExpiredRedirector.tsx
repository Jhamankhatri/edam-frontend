import { useEffect } from 'react';
import { useNavigate, useRouterState } from '@tanstack/react-router';
import { safeReturnTo } from '@/lib/utils';
import { subscribeToAuthExpired } from '@/auth/session-events';

const publicAuthPaths = new Set([
  '/login',
  '/bootstrap',
  '/forgot-password',
  '/reset-password',
]);

export function AuthExpiredRedirector() {
  const navigate = useNavigate();
  const { pathname, href } = useRouterState({
    select: (state) => ({ pathname: state.location.pathname, href: state.location.href }),
  });

  useEffect(
    () =>
      subscribeToAuthExpired(() => {
        if (publicAuthPaths.has(pathname)) return;
        const returnTo = safeReturnTo(href);
        void navigate({
          to: '/login',
          search: returnTo ? { returnTo } : {},
          replace: true,
        });
      }),
    [navigate, pathname, href],
  );
  return null;
}
