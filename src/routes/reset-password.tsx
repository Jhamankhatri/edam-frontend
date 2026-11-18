import { useState } from 'react';
import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { RequireAnonymous } from '@/auth/guards';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { AuthSuccessCard } from '@/features/auth/AuthSuccessCard';
import { ResetPasswordForm } from '@/features/auth/ResetPasswordForm';
import { resetPassword } from '@/api/services/auth';

interface ResetSearch {
  token: string;
}

const validateSearch = (search: Record<string, unknown>): ResetSearch => ({
  token: typeof search.token === 'string' ? search.token : '',
});

function ResetPasswordRouteComponent() {
  const { token } = Route.useSearch();
  const navigate = useNavigate();
  const [complete, setComplete] = useState(false);

  return (
    <RequireAnonymous>
      <PublicLayout
        eyebrow="Account recovery"
        title="Set a new institutional password."
        description="Use the token from your reset instructions. The backend validates expiry and policy."
      >
        {complete ? (
          <AuthSuccessCard
            title="Password updated"
            message="Your password has been updated. Sign in with the new password."
            actionLabel="Continue to sign in"
            onAction={() => void navigate({ to: '/login', replace: true })}
          />
        ) : (
          <ResetPasswordForm
            token={token}
            onSubmit={async (payload) => {
              await resetPassword(payload);
              setComplete(true);
            }}
          />
        )}
      </PublicLayout>
    </RequireAnonymous>
  );
}

export const Route = createFileRoute('/reset-password')({
  validateSearch,
  component: ResetPasswordRouteComponent,
});
