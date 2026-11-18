import { createFileRoute, Navigate } from '@tanstack/react-router';
import { useAuth } from '@/auth/useAuth';
import { FullPageLoader } from '@/components/feedback/FullPageLoader';
import { InitializationErrorState } from '@/components/feedback/InitializationErrorState';

function RootRedirect() {
  const { status, user, installationStatus, initializationError, retryInitialization } = useAuth();
  if (status === 'initializing') return <FullPageLoader />;
  if (status === 'error') {
    return <InitializationErrorState error={initializationError} onRetry={retryInitialization} />;
  }
  if (status === 'authenticated' && user) {
    return <Navigate to={user.mustChangePassword ? '/change-password' : '/app/dashboard'} replace />;
  }
  if (installationStatus?.bootstrapped === false) return <Navigate to="/bootstrap" replace />;
  return <Navigate to="/login" replace />;
}

export const Route = createFileRoute('/')({ component: RootRedirect });
