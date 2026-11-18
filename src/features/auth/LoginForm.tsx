import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowRight, Building2, LockKeyhole } from 'lucide-react';
import type { LoginRequest } from '@/api/contracts';
import { formatApiError } from '@/api/errors';
import { FormField } from '@/components/forms/FormField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { setServerFieldErrors } from '@/forms/server-errors';

const loginSchema = z.object({
  username: z.string().min(1, 'Enter your username.').max(100),
  password: z.string().min(1, 'Enter your password.').max(200),
});

export type LoginValues = z.infer<typeof loginSchema>;

const serverFields = ['username', 'password'] satisfies readonly FieldPath<LoginValues>[];

interface LoginFormProps {
  onSubmit: (values: LoginRequest) => Promise<void>;
}

export function LoginForm({ onSubmit }: LoginFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<LoginValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: { username: '', password: '' },
  });

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      if (!setServerFieldErrors(setError, error, serverFields)) setSubmitError(formatApiError(error));
      else setSubmitError('Please correct the highlighted fields.');
    }
  });

  return (
    <section className="auth-card motion-safe:animate-fade-up">
      <div className="mb-6">
        <p className="auth-eyebrow">Welcome back</p>
        <h2 className="auth-title">Sign in to EDAM</h2>
        <p className="mt-1.5 text-sm text-muted-foreground">Use your institution credentials to continue.</p>
      </div>

      <form className="space-y-4" onSubmit={submit} noValidate>
        {submitError && (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <FormField id="username" label="Username" error={errors.username?.message}>
          <div className="relative">
            <Building2 aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <Input
              id="username"
              autoComplete="username"
              autoCapitalize="none"
              spellCheck={false}
              placeholder="your.username"
              invalid={Boolean(errors.username)}
              className="pl-10"
              {...register('username')}
            />
          </div>
        </FormField>

        <FormField id="password" label="Password" error={errors.password?.message}>
          <div className="relative">
            <LockKeyhole aria-hidden="true" className="pointer-events-none absolute left-3 top-1/2 z-10 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
            <PasswordInput
              id="password"
              autoComplete="current-password"
              placeholder="Enter your password"
              invalid={Boolean(errors.password)}
              className="pl-10"
              {...register('password')}
            />
          </div>
        </FormField>

        <div className="flex items-center justify-end">
          <Link to="/forgot-password" className="inline-flex min-h-10 items-center rounded-md text-sm font-medium text-primary hover:underline focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring">
            Forgot password?
          </Link>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Signing in…' : 'Sign in securely'}
          {!isSubmitting && <ArrowRight aria-hidden="true" className="h-4 w-4" />}
        </Button>
      </form>
    </section>
  );
}
