import type { FieldErrorDetail } from '@/api/contracts';
import { ApiError } from '@/api/errors';
import type { FieldPath, FieldValues, UseFormSetError } from 'react-hook-form';

/**
 * Maps backend field errors only to form fields that the caller explicitly allows.
 * This avoids unsafe string-to-FieldPath conversions and ignores unexpected names.
 */
export function setServerFieldErrors<T extends FieldValues>(
  setError: UseFormSetError<T>,
  error: unknown,
  allowedFields: readonly FieldPath<T>[],
): boolean {
  if (!(error instanceof ApiError) || !error.fieldErrors || error.fieldErrors.length === 0) {
    return false;
  }
  let applied = false;
  for (const detail of error.fieldErrors satisfies readonly FieldErrorDetail[]) {
    const field = allowedFields.find((candidate) => candidate === detail.field);
    if (!field) continue;
    setError(field, {
      type: 'server',
      message: detail.message,
    });
    applied = true;
  }
  return applied;
}
