import { describe, expect, it, vi } from 'vitest';
import type { UseFormSetError } from 'react-hook-form';
import { ApiError } from '@/api/errors';
import { setServerFieldErrors } from './server-errors';

interface TestValues {
  username: string;
  password: string;
}

describe('server field error mapping', () => {
  it('maps backend fieldErrors to React Hook Form without losing the envelope code', () => {
    const setError = vi.fn() as unknown as UseFormSetError<TestValues>;
    const error = new ApiError({
      code: 'EDAM-1001',
      message: 'Validation failed.',
      status: 400,
      fieldErrors: [{ field: 'username', message: 'Username is required.' }],
    });

    expect(setServerFieldErrors<TestValues>(setError, error)).toBe(true);
    expect(setError).toHaveBeenCalledWith('username', {
      type: 'server',
      message: 'Username is required.',
    });
  });

  it('returns false for non-envelope errors and empty field errors', () => {
    const setError = vi.fn() as unknown as UseFormSetError<TestValues>;
    expect(setServerFieldErrors(setError, new Error('network'))).toBe(false);
    expect(
      setServerFieldErrors(
        setError,
        new ApiError({ code: 'EDAM-2006', message: 'Invalid credentials.', status: 401 }),
      ),
    ).toBe(false);
    expect(setError).not.toHaveBeenCalled();
  });
});
