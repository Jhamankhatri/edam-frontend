import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, KeyRound } from 'lucide-react';
import type { ResetPasswordRequest } from '@/api/contracts';
import { formatApiError } from '@/api/errors';
import { FormField } from '@/components/forms/FormField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { setServerFieldErrors } from '@/forms/server-errors';

const schema = z
  .object({
    newPassword: z.string().min(1, 'Enter a new password.').max(200),
    confirmPassword: z.string().min(1, 'Confirm the new password.').max(200),
  })
  .refine((values) => values.newPassword === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

type FormValues = z.infer<typeof schema>;

const serverFields = ['newPassword', 'confirmPassword'] satisfies readonly FieldPath<FormValues>[];

interface ResetPasswordFormProps {
  token: string;
  onSubmit: (values: ResetPasswordRequest) => Promise<void>;
}

export function ResetPasswordForm({ token, onSubmit }: ResetPasswordFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { newPassword: '', confirmPassword: '' },
  });

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await onSubmit({ token, newPassword: values.newPassword });
    } catch (error) {
      if (!setServerFieldErrors(setError, error, serverFields)) setSubmitError(formatApiError(error));
      else setSubmitError('Please correct the highlighted fields.');
    }
  });

  return (
    <section className="auth-card motion-safe:animate-fade-up">
      <header>
        <p className="auth-eyebrow"><KeyRound aria-hidden="true" className="h-3.5 w-3.5" />Choose a new password</p>
        <h2 className="auth-title">Set your password</h2>
        <p className="auth-description">
          The backend validates the reset token and password policy.
        </p>
      </header>

      <div className="ledger-rule my-6" />

      <form className="space-y-5" onSubmit={submit} noValidate>
        {submitError && (
          <Alert variant="destructive"><AlertDescription>{submitError}</AlertDescription></Alert>
        )}
        <FormField id="newPassword" label="New password" error={errors.newPassword?.message}>
          <PasswordInput id="newPassword" autoComplete="new-password" invalid={Boolean(errors.newPassword)} {...register('newPassword')} />
        </FormField>
        <FormField id="confirmPassword" label="Confirm new password" error={errors.confirmPassword?.message}>
          <PasswordInput id="confirmPassword" autoComplete="new-password" invalid={Boolean(errors.confirmPassword)} {...register('confirmPassword')} />
        </FormField>
        <Button type="submit" className="w-full" size="lg" loading={isSubmitting} disabled={!token || isSubmitting}>
          {isSubmitting ? 'Updating…' : 'Update password'}
        </Button>
        {!token && (
          <Alert variant="warning"><AlertDescription>The reset link is missing its token. Request a new link.</AlertDescription></Alert>
        )}
        <Button asChild variant="ghost" className="w-full">
          <Link to="/login"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Back to sign in</Link>
        </Button>
      </form>
    </section>
  );
}
