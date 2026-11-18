import { ArrowUpRight, LockKeyhole, ShieldCheck, Sparkles } from 'lucide-react';
import type { ReactNode } from 'react';
import { BrandMark } from '@/components/brand/BrandMark';
import { useBranding } from '@/hooks/useBranding';

interface PublicLayoutProps {
  children: ReactNode;
  eyebrow: string;
  title: string;
  description: string;
}

export function PublicLayout({ children, eyebrow, title, description }: PublicLayoutProps) {
  const branding = useBranding();

  return (
    <main className="auth-canvas min-h-screen w-full max-w-full overflow-x-hidden lg:grid lg:grid-cols-auth">
      <aside className="auth-brand-panel relative hidden min-h-screen overflow-hidden px-10 py-10 text-brand-panel-foreground lg:flex lg:flex-col lg:justify-between xl:px-14">
        <div aria-hidden="true" className="bank-grid absolute inset-0 opacity-60" />
        <div aria-hidden="true" className="absolute -right-20 top-1/3 h-80 w-80 rounded-full border border-brand-panel-border" />
        <div aria-hidden="true" className="absolute right-16 top-1/3 h-52 w-52 rounded-full border border-brand-panel-gold-border motion-safe:animate-soft-float" />
        <div className="relative z-10 flex items-center justify-between">
          <BrandMark className="text-brand-panel-foreground" />
          <span className="rounded-full border border-brand-panel-border-strong px-3 py-1 badge-label text-brand-panel-strong">
            Commercial banking
          </span>
        </div>

        <div className="relative z-10 max-w-xl py-10">
          <p className="flex items-center gap-2 eyebrow-wide text-brand-gold">
            <Sparkles aria-hidden="true" className="h-4 w-4" />
            {eyebrow}
          </p>
          <h1 className="mt-6 font-display text-4xl font-semibold leading-tight tracking-tight xl:text-5xl">
            {title}
          </h1>
          <p className="mt-5 max-w-lg text-base leading-relaxed text-brand-panel-quiet">{description}</p>

          <div className="mt-10 grid max-w-lg gap-3 sm:grid-cols-2">
            <div className="rounded-2xl border border-brand-panel-border-active bg-brand-panel-surface p-4 shadow-inset">
              <ShieldCheck aria-hidden="true" className="h-5 w-5 text-brand-gold" />
              <p className="mt-3 text-sm font-semibold">Session-protected access</p>
              <p className="mt-1 text-xs leading-relaxed text-brand-panel-soft">Server-side sessions and CSRF on every write.</p>
            </div>
            <div className="rounded-2xl border border-brand-panel-border-active bg-brand-panel-surface p-4 shadow-inset">
              <LockKeyhole aria-hidden="true" className="h-5 w-5 text-brand-gold" />
              <p className="mt-3 text-sm font-semibold">Permission-aware workspace</p>
              <p className="mt-1 text-xs leading-relaxed text-brand-panel-soft">Navigation follows effective backend permissions.</p>
            </div>
          </div>
        </div>

        <div className="relative z-10 flex flex-wrap items-center justify-between gap-3 text-xs text-brand-panel-muted">
          <span>© {new Date().getFullYear()} {branding.organizationName}</span>
          {branding.supportEmail && (
            <a className="inline-flex min-h-10 items-center gap-1 rounded-md hover:text-brand-panel-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-brand-gold" href={`mailto:${branding.supportEmail}`}>
              Support <ArrowUpRight aria-hidden="true" className="h-3.5 w-3.5" />
            </a>
          )}
        </div>
      </aside>

      <section className="relative flex min-h-screen w-full max-w-full items-center justify-center px-4 py-6 sm:px-8 lg:px-10 xl:px-16">
        <div className="w-full max-w-md">
          <div className="mb-7 flex items-center justify-between lg:hidden">
            <BrandMark className="text-brand-ink" compact />
            <span className="micro-label text-muted-foreground">{branding.appName}</span>
          </div>
          <div className="mb-6 lg:hidden">
            <p className="auth-eyebrow">{eyebrow}</p>
            <h1 className="mt-2 font-display text-3xl font-semibold tracking-tight">{title}</h1>
            <p className="mt-2 text-sm leading-relaxed text-muted-foreground">{description}</p>
          </div>
          {children}
          <p className="mt-6 text-center text-xs text-muted-foreground">
            Authorized use only. Your activity is governed by institution policy.
          </p>
        </div>
      </section>
    </main>
  );
}
