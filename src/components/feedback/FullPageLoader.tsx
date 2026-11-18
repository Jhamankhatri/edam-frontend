import { BrandMark } from '@/components/brand/BrandMark';
import { Skeleton } from '@/components/ui/skeleton';

export function FullPageLoader() {
  return (
    <main className="auth-canvas flex min-h-screen items-center justify-center px-4">
      <section className="glass-panel w-full max-w-sm rounded-2xl border border-white/70 p-7 shadow-elevated" aria-live="polite" aria-busy="true">
        <BrandMark className="text-brand-ink" />
        <p className="mt-6 text-sm font-medium text-muted-foreground">Verifying your secure session…</p>
        <div className="mt-5 space-y-3">
          <Skeleton className="h-3 w-4/5" />
          <Skeleton className="h-3 w-3/5" />
        </div>
      </section>
    </main>
  );
}
