import { BrandMark } from '@/components/brand/BrandMark';
import { ErrorState } from './ErrorState';
import type { ApiError } from '@/api/errors';

interface InitializationErrorStateProps {
  error: ApiError | null;
  onRetry: () => void;
}

export function InitializationErrorState({ error, onRetry }: InitializationErrorStateProps) {
  return (
    <main className="auth-canvas flex min-h-screen items-center justify-center px-4 py-10">
      <section className="glass-card w-full max-w-xl p-6 sm:p-8">
        <BrandMark className="text-brand-ink" />
        <div className="mt-7">
          <ErrorState
            title="Unable to verify your session"
            description={
              error?.message ??
              'EDAM could not confirm whether your session is active. Protected content remains hidden until verification succeeds.'
            }
            correlationId={error?.correlationId}
            offline={error?.status === 0}
            onRetry={onRetry}
          />
        </div>
      </section>
    </main>
  );
}
