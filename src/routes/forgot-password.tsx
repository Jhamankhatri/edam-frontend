import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RequireAnonymous } from '@/auth/guards';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthSuccessCard } from '@/features/auth/AuthSuccessCard';
import { ForgotPasswordForm } from '@/features/auth/ForgotPasswordForm';
import { forgotPassword } from '@/api/services/auth';

function ForgotPasswordRouteComponent() {
  const navigate = useNavigate();
  const [message, setMessage] = useState<string | null>(null);

  return (
    <RequireAnonymous>
      <PublicLayout
        eyebrow="Account recovery"
        title="A discreet path back to your workspace."
        description="Request reset instructions without revealing whether an account exists."
      >
        {message ? (
          <AuthSuccessCard
            title="Request submitted"
            message={message}
            actionLabel="Return to sign in"
            onAction={() => void navigate({ to: '/login', replace: true })}
          />
        ) : (
          <ForgotPasswordForm
            onSubmit={async (payload) => {
              const response = await forgotPassword(payload);
              setMessage(response.message);
            }}
          />
        )}
      </PublicLayout>
    </RequireAnonymous>
  );
}

export const Route = createFileRoute('/forgot-password')({ component: ForgotPasswordRouteComponent });
