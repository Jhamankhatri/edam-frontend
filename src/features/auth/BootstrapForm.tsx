import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { KeyRound, UserPlus } from 'lucide-react';
import type { BootstrapRequest } from '@/api/contracts';
import { formatApiError } from '@/api/errors';
import { FormField } from '@/components/forms/FormField';
import { Alert, AlertDescription } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { PasswordInput } from '@/components/ui/password-input';
import { setServerFieldErrors } from '@/forms/server-errors';

const bootstrapSchema = z
  .object({
    installationToken: z.string().min(1, 'Enter the one-time installation token.').max(400),
    username: z.string().min(1, 'Enter a username.').max(100),
    firstName: z.string().min(1, 'Enter the first name.').max(100),
    lastName: z.string().min(1, 'Enter the last name.').max(100),
    email: z.string().min(1, 'Enter an email address.').email('Enter a valid email address.').max(255),
    employeeCode: z.string().max(50).optional(),
    password: z.string().min(1, 'Enter an initial password.').max(200),
    confirmPassword: z.string().min(1, 'Confirm the initial password.').max(200),
  })
  .refine((values) => values.password === values.confirmPassword, {
    path: ['confirmPassword'],
    message: 'Passwords do not match.',
  });

type BootstrapValues = z.infer<typeof bootstrapSchema>;

interface BootstrapFormProps {
  onSubmit: (installationToken: string, payload: BootstrapRequest) => Promise<void>;
}

export function BootstrapForm({ onSubmit }: BootstrapFormProps) {
  const [submitError, setSubmitError] = useState<string | null>(null);
  const {
    register,
    handleSubmit,
    setError,
    formState: { errors, isSubmitting },
  } = useForm<BootstrapValues>({
    resolver: zodResolver(bootstrapSchema),
    defaultValues: {
      installationToken: '',
      username: '',
      firstName: '',
      lastName: '',
      email: '',
      employeeCode: '',
      password: '',
      confirmPassword: '',
    },
  });

  const submit = handleSubmit(async (values) => {
    setSubmitError(null);
    const payload: BootstrapRequest = {
      username: values.username,
      firstName: values.firstName,
      lastName: values.lastName,
      email: values.email,
      employeeCode: values.employeeCode?.trim() ? values.employeeCode.trim() : undefined,
      password: values.password,
    };
    try {
      await onSubmit(values.installationToken, payload);
    } catch (error) {
      if (!setServerFieldErrors(setError, error)) setSubmitError(formatApiError(error));
      else setSubmitError('Please correct the highlighted fields.');
    }
  });

  return (
    <section className="glass-panel motion-safe:animate-fade-up rounded-2xl border border-white/70 p-5 shadow-elevated sm:p-7">
      <div className="mb-6">
        <p className="flex items-center gap-2 text-xs font-semibold uppercase tracking-[0.18em] text-primary">
          <KeyRound aria-hidden="true" className="h-4 w-4" />
          First-run setup
        </p>
        <h2 className="mt-2 font-display text-2xl font-semibold tracking-tight">Create the administrator</h2>
        <p className="mt-1.5 text-sm leading-relaxed text-muted-foreground">
          The installation token is sent only in the documented header. Bootstrap does not sign you in.
        </p>
      </div>

      <form className="space-y-4" onSubmit={submit} noValidate>
        {submitError && (
          <Alert variant="destructive">
            <AlertDescription>{submitError}</AlertDescription>
          </Alert>
        )}

        <FormField id="installationToken" label="Installation token" error={errors.installationToken?.message} hint="Provided out of band by the deployment operator.">
          <PasswordInput id="installationToken" autoComplete="off" spellCheck={false} invalid={Boolean(errors.installationToken)} {...register('installationToken')} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="firstName" label="First name" error={errors.firstName?.message}>
            <Input id="firstName" autoComplete="given-name" invalid={Boolean(errors.firstName)} {...register('firstName')} />
          </FormField>
          <FormField id="lastName" label="Last name" error={errors.lastName?.message}>
            <Input id="lastName" autoComplete="family-name" invalid={Boolean(errors.lastName)} {...register('lastName')} />
          </FormField>
        </div>

        <FormField id="username" label="Username" error={errors.username?.message}>
          <Input id="username" autoComplete="username" autoCapitalize="none" spellCheck={false} invalid={Boolean(errors.username)} {...register('username')} />
        </FormField>

        <FormField id="email" label="Work email" error={errors.email?.message}>
          <Input id="email" type="email" autoComplete="email" invalid={Boolean(errors.email)} {...register('email')} />
        </FormField>

        <FormField id="employeeCode" label="Employee code" error={errors.employeeCode?.message} hint="Optional">
          <Input id="employeeCode" autoComplete="off" invalid={Boolean(errors.employeeCode)} {...register('employeeCode')} />
        </FormField>

        <div className="grid gap-4 sm:grid-cols-2">
          <FormField id="password" label="Initial password" error={errors.password?.message}>
            <PasswordInput id="password" autoComplete="new-password" invalid={Boolean(errors.password)} {...register('password')} />
          </FormField>
          <FormField id="confirmPassword" label="Confirm password" error={errors.confirmPassword?.message}>
            <PasswordInput id="confirmPassword" autoComplete="new-password" invalid={Boolean(errors.confirmPassword)} {...register('confirmPassword')} />
          </FormField>
        </div>

        <Button type="submit" className="w-full" size="lg" loading={isSubmitting}>
          <UserPlus aria-hidden="true" className="h-4 w-4" />
          {isSubmitting ? 'Creating administrator…' : 'Complete installation'}
        </Button>
      </form>
    </section>
  );
}
