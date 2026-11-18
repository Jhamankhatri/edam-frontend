import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useAuth } from '@/auth/useAuth';
import { RequireAuth, RequirePasswordChange } from '@/auth/guards';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { ChangePasswordForm } from '@/features/auth/ChangePasswordForm';
import { changePassword } from '@/api/services/auth';

function ChangePasswordRouteComponent() {
  const { user, refresh } = useAuth();
  const navigate = useNavigate();
  if (!user) return null;

  return (
    <RequireAuth allowMustChangePassword>
      <RequirePasswordChange>
        <PublicLayout
          eyebrow="Security verification"
          title="One final step before your workspace."
          description="Update the temporary password to protect your institution account."
        >
          <ChangePasswordForm
            policy={user.passwordPolicy}
            onSubmit={async (payload) => {
              await changePassword(payload);
              await refresh();
              toast.success('Password updated');
              await navigate({ to: '/app/dashboard', replace: true });
            }}
          />
        </PublicLayout>
      </RequirePasswordChange>
    </RequireAuth>
  );
}

export const Route = createFileRoute('/change-password')({ component: ChangePasswordRouteComponent });
