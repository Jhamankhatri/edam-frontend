import { useState } from 'react';
import { useForm, type FieldPath } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { ShieldCheck } from 'lucide-react';
import type { ChangePasswordRequest, PasswordPolicyView } from '@/api/contracts';
import { formatApiError } from '@/api/errors';
import { FormField } from '@/components/forms/FormField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { PasswordInput } from '@/components/ui/password-input';
import { setServerFieldErrors } from '@/forms/server-errors';

function createSchema(policy: PasswordPolicyView) {
  return z
    .object({
      currentPassword: z.string().min(1, 'Enter your current password.').max(200),
      newPassword: z
        .string()
        .min(policy.minimumLength, `Use at least ${policy.minimumLength} characters.`)
        .max(policy.maximumLength, `Use no more than ${policy.maximumLength} characters.`)
        .superRefine((value, context) => {
          if (policy.requireUppercase && !/[A-Z]/.test(value)) {
            context.addIssue({ code: z.ZodIssueCode.custom, message: 'Include an uppercase letter.' });
          }
          if (policy.requireLowercase && !/[a-z]/.test(value)) {
            context.addIssue({ code: z.ZodIssueCode.custom, message: 'Include a lowercase letter.' });
          }
          if (policy.requireDigit && !/[0-9]/.test(value)) {
            context.addIssue({ code: z.ZodIssueCode.custom, message: 'Include a digit.' });
          }
          // requireSpecial is displayed as a hint only; the backend owns the exact character class.
        }),
      confirmPassword: z.string().min(1, 'Confirm the new password.'),
    })
    .refine((values) => values.newPassword === values.confirmPassword, {
      path: ['confirmPassword'],
      message: 'Passwords do not match.',
    });
}

interface ChangePasswordFormProps {
  policy: PasswordPolicyView;
  onSubmit: (values: ChangePasswordRequest) => Promise<void>;
}

export function ChangePasswordForm({ policy, onSubmit }: ChangePasswordFormProps) {
  const schema = createSchema(policy);
  type FormValues = z.infer<typeof schema>;
  const serverFields = ['currentPassword', 'newPassword', 'confirmPassword'] satisfies readonly FieldPath<FormValues>[];
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<FormValues>({
    resolver: zodResolver(schema),
    defaultValues: { currentPassword: '', newPassword: '', confirmPassword: '' },
  });

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    try {
      await onSubmit({ currentPassword: values.currentPassword, newPassword: values.newPassword });
    } catch (error) {
      if (!setServerFieldErrors(setError, error, serverFields)) setSubmitError(formatApiError(error));
      else setSubmitError('Please correct the highlighted fields.');
    }
  });

  const hints = [
    `${policy.minimumLength}–${policy.maximumLength} characters`,
    policy.requireUppercase ? 'uppercase letter' : null,
    policy.requireLowercase ? 'lowercase letter' : null,
    policy.requireDigit ? 'digit' : null,
    policy.requireSpecial ? 'special character (validated by the server)' : null,
  ].filter(Boolean);

  return (
    <section className="auth-card motion-safe:animate-fade-up">
      <header>
        <p className="auth-eyebrow"><ShieldCheck aria-hidden="true" className="h-3.5 w-3.5" />Security verification</p>
        <h2 className="auth-title">Change your password</h2>
        <p className="auth-description">
          A password change is required before the workspace can be accessed.
        </p>
      </header>

      <div className="ledger-rule my-6" />

      <form className="space-y-5" onSubmit={submit} noValidate>
        {submitError && (
          <Alert variant="destructive"><AlertDescription>{submitError}</AlertDescription></Alert>
        )}
        <FormField id="currentPassword" label="Current password" error={errors.currentPassword?.message}>
          <PasswordInput id="currentPassword" autoComplete="current-password" invalid={Boolean(errors.currentPassword)} {...register('currentPassword')} />
        </FormField>
        <FormField id="newPassword" label="New password" error={errors.newPassword?.message} hint={`Required: ${hints.join(', ')}.`}>
          <PasswordInput id="newPassword" autoComplete="new-password" invalid={Boolean(errors.newPassword)} {...register('newPassword')} />
        </FormField>
        <FormField id="confirmPassword" label="Confirm new password" error={errors.confirmPassword?.message}>
          <PasswordInput id="confirmPassword" autoComplete="new-password" invalid={Boolean(errors.confirmPassword)} {...register('confirmPassword')} />
        </FormField>
        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          {isSubmitting ? 'Updating…' : 'Update and continue'}
        </Button>
      </form>
    </section>
  );
}
