import {
  Navigate,
  useNavigate,
  useRouterState,
} from '@tanstack/react-router';
import { useEffect, useRef, type ReactNode } from 'react';
import { useAuth } from './useAuth';
import { getRouteRequirement } from '@/config/route-access';
import { AccessDenied } from '@/components/feedback/AccessDenied';
import { FullPageLoader } from '@/components/feedback/FullPageLoader';
import { InitializationErrorState } from '@/components/feedback/InitializationErrorState';
import { safeReturnTo } from '@/lib/utils';

interface GuardProps {
  children: ReactNode;
}

function RedirectToLogin({ returnTo }: { returnTo?: string }) {
  const navigate = useNavigate();
  const navigated = useRef(false);

  useEffect(() => {
    if (navigated.current) return;
    navigated.current = true;
    void navigate({
      to: '/login',
      search: returnTo ? { returnTo } : {},
      replace: true,
    });
  }, [navigate, returnTo]);

  return null;
}

export function RequireAuth({ children, allowMustChangePassword = false }: GuardProps & { allowMustChangePassword?: boolean }) {
  const { status, user, initializationError, retryInitialization } = useAuth();
  const { pathname, href } = useRouterState({
    select: (state) => ({ pathname: state.location.pathname, href: state.location.href }),
  });
  // Capture the first protected href without mutating refs during render.
  const returnTo = useRef<string | undefined>(safeReturnTo(href));

  if (status === 'initializing') return <FullPageLoader />;
  if (status === 'error') {
    return <InitializationErrorState error={initializationError} onRetry={retryInitialization} />;
  }
  if (status === 'anonymous' || !user) {
    return <RedirectToLogin returnTo={returnTo.current} />;
  }
  if (user.mustChangePassword && !allowMustChangePassword && pathname !== '/change-password') {
    return <Navigate to="/change-password" replace />;
  }
  return <>{children}</>;
}

export function RequireAnonymous({ children, allowBootstrap = false }: GuardProps & { allowBootstrap?: boolean }) {
  const { status, user, initializationError, retryInitialization, installationStatus } = useAuth();
  if (status === 'initializing') return <FullPageLoader />;
  if (status === 'error') {
    return <InitializationErrorState error={initializationError} onRetry={retryInitialization} />;
  }
  if (status === 'authenticated' && user) {
    return <Navigate to={user.mustChangePassword ? '/change-password' : '/app/dashboard'} replace />;
  }
  if (!allowBootstrap && installationStatus?.bootstrapped === false) {
    return <Navigate to="/bootstrap" replace />;
  }
  return <>{children}</>;
}

export function RequirePermission({ children }: GuardProps) {
  const { user, satisfiesRequirement } = useAuth();
  const pathname = useRouterState({ select: (state) => state.location.pathname });
  const requirement = getRouteRequirement(pathname);
  if (!user) return null;
  if (!satisfiesRequirement(requirement)) return <AccessDenied />;
  return <>{children}</>;
}

export function RequirePasswordChange({ children }: GuardProps) {
  const { user } = useAuth();
  if (user && !user.mustChangePassword) return <Navigate to="/app/dashboard" replace />;
  return <>{children}</>;
}
