import { createFileRoute, useNavigate } from '@tanstack/react-router';
import { toast } from 'sonner';
import { useAuth } from '@/auth/useAuth';
import { RequireAnonymous } from '@/auth/guards';
import { PublicLayout } from '@/components/layout/PublicLayout';
import { LoginForm } from '@/features/auth/LoginForm';
import { safeReturnTo } from '@/lib/utils';

interface LoginSearch {
  returnTo?: string;
}

const validateSearch = (search: Record<string, unknown>): LoginSearch => ({
  returnTo: safeReturnTo(search.returnTo),
});

function LoginRouteComponent() {
  const search = Route.useSearch();
  const navigate = useNavigate();
  const { login } = useAuth();

  const onSubmit = async (credentials: { username: string; password: string }): Promise<void> => {
    const user = await login(credentials);
    toast.success(`Welcome back, ${user.displayName}`);
    if (user.mustChangePassword) {
      await navigate({ to: '/change-password', replace: true });
      return;
    }
    await navigate({
      href: search.returnTo ?? '/app/dashboard',
      replace: true,
    });
  };

  return (
    <RequireAnonymous>
      <PublicLayout
        eyebrow="Secure access"
        title="Expense governance, composed with confidence."
        description="A refined workspace for institutional expense delegation, review, and approval."
      >
        <LoginForm onSubmit={onSubmit} />
      </PublicLayout>
    </RequireAnonymous>
  );
}

export const Route = createFileRoute('/login')({
  validateSearch,
  component: LoginRouteComponent,
});
