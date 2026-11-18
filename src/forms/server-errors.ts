import type { FieldErrorDetail } from '@/api/contracts';
import { ApiError } from '@/api/errors';
import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';

export function setServerFieldErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  error: unknown,
): boolean {
  if (!(error instanceof ApiError) || !error.fieldErrors || error.fieldErrors.length === 0) {
    return false;
  }
  for (const detail of error.fieldErrors satisfies readonly FieldErrorDetail[]) {
    setError(detail.field as FieldPath<T>, {
      type: 'server',
      message: detail.message,
    });
  }
  return true;
}
