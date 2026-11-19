import { useState } from 'react';
import { Link } from '@tanstack/react-router';
import { useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ArrowLeft, Mail } from 'lucide-react';
import type { ForgotPasswordRequest } from '@/api/contracts';
import { formatApiError } from '@/api/errors';
import { FormField } from '@/components/forms/FormField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { setServerFieldErrors } from '@/forms/server-errors';

const schema = z.object({
  email: z.string().min(1, 'Enter your work email.').email('Enter a valid email address.').max(255),
});

type FormValues = z.infer<typeof schema>;

const serverFields = ['email'] satisfies readonly FieldPath<FormValues>[];

export function ForgotPasswordForm({ onSubmit }: { onSubmit: (values: ForgotPasswordRequest) => Promise<void> }) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({ resolver: zodResolver(schema), defaultValues: { email: '' } });

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await onSubmit(values);
    } catch (error) {
      if (!setServerFieldErrors(setError, error, serverFields)) setSubmitError(formatApiError(error));
      else setSubmitError('Please correct the highlighted field.');
    }
  });

  return (
    <section className="auth-card motion-safe:animate-fade-up">
      <header>
        <p className="auth-eyebrow"><Mail aria-hidden="true" className="h-3.5 w-3.5" />Account recovery</p>
        <h2 className="auth-title">Reset your password</h2>
        <p className="auth-description">
          EDAM returns the same response whether or not an address is registered.
        </p>
      </header>

      <div className="ledger-rule my-6" />

      <form className="space-y-5" onSubmit={submit} noValidate>
        {submitError && (
          <Alert variant="destructive"><AlertDescription>{submitError}</AlertDescription></Alert>
        )}
        <FormField id="email" label="Work email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" invalid={Boolean(errors.email)} {...register('email')} />
        </FormField>
        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Submitting…' : 'Send reset instructions'}
        </Button>
        <Button asChild variant="ghost" className="w-full">
          <Link to="/login"><ArrowLeft aria-hidden="true" className="h-4 w-4" />Back to sign in</Link>
        </Button>
      </form>
    </section>
  );
}
