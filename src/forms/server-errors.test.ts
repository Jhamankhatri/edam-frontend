import { describe, expect, it, vi } from 'vitest';
import type { FieldPath, UseFormSetError } from 'react-hook-form';
import { ApiError } from '@/api/errors';
import { setServerFieldErrors } from './server-errors';

interface TestValues {
  username: string;
  password: string;
}

const allowedFields = ['username', 'password'] satisfies readonly FieldPath<TestValues>[];

describe('server field error mapping', () => {
  it('maps backend fieldErrors to React Hook Form without losing the envelope code', () => {
    const setError = vi.fn<UseFormSetError<TestValues>>();
    const error = new ApiError({
      code: 'EDAM-1001',
      message: 'Validation failed.',
      status: 400,
      fieldErrors: [{ field: 'username', message: 'Username is required.' }],
    });

    expect(setServerFieldErrors<TestValues>(setError, error, allowedFields)).toBe(true);
    expect(setError).toHaveBeenCalledWith('username', {
      type: 'server',
      message: 'Username is required.',
    });
  });

  it('ignores field names that are not allowed by the form', () => {
    const setError = vi.fn<UseFormSetError<TestValues>>();
    const error = new ApiError({
      code: 'EDAM-1001',
      message: 'Validation failed.',
      status: 400,
      fieldErrors: [{ field: 'unexpected', message: 'Unexpected field.' }],
    });

    expect(setServerFieldErrors<TestValues>(setError, error, allowedFields)).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });

  it('returns false for non-envelope errors and empty field errors', () => {
    const setError = vi.fn<UseFormSetError<TestValues>>();
    expect(setServerFieldErrors<TestValues>(setError, new Error('network'), allowedFields)).toBe(false);
    expect(
      setServerFieldErrors<TestValues>(
        setError,
        new ApiError({ code: 'EDAM-2006', message: 'Invalid credentials.', status: 401 }),
        allowedFields,
      ),
    ).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });
});
