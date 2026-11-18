import { useRef, useState } from 'react';
import { createFileRoute, Navigate, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import type { BootstrapResponse } from '@/api/contracts';
import { useAuth } from '@/auth/useAuth';
import { RequireAnonymous } from '@/auth/guards';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthSuccessCard } from '@/features/auth/AuthSuccessCard';
import { BootstrapForm } from '@/features/auth/BootstrapForm';

function BootstrapRouteComponent() {
  const { bootstrap, installationStatus, status } = useAuth();
  const navigate = useNavigate();
  const [created, setCreated] = useState<BootstrapResponse | null>(null);
  const bootstrappedOnEntry = useRef<boolean | null>(null);

  if (bootstrappedOnEntry.current === null && status !== 'initializing') {
    bootstrappedOnEntry.current = installationStatus?.bootstrapped === true;
  }
  if (bootstrappedOnEntry.current === true && !created) {
    return <Navigate to="/login" replace />;
  }

  return (
    <RequireAnonymous allowBootstrap>
      <PublicLayout
        eyebrow="Institution setup"
        title="Begin with a trusted administrator."
        description="Create the first administrator with the one-time installation token, then sign in explicitly."
      >
        {created ? (
          <AuthSuccessCard
            title="Administrator created"
            message="Installation is complete. Bootstrap did not establish a session; please sign in explicitly."
            detail={`${created.displayName} · ${created.username}`}
            actionLabel="Continue to sign in"
            onAction={() => void navigate({ to: '/login', replace: true })}
          />
        ) : (
          <BootstrapForm
            onSubmit={async (installationToken, payload) => {
              const result = await bootstrap(installationToken, payload);
              setCreated(result);
              toast.success('Administrator created — please sign in');
            }}
          />
        )}
      </PublicLayout>
    </RequireAnonymous>
  );
}

export const Route = createFileRoute('/bootstrap')({ component: BootstrapRouteComponent });
