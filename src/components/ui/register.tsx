import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

/**
 * Editorial "register" primitives. These replace generic rounded cards with a
 * ruled, numbered composition shared by the authority panel, forms, the
 * dashboard foundation and future modules.
 */
export function SectionLabel({
  index,
  children,
  className,
  tone = 'paper',
}: {
  index?: string;
  children: ReactNode;
  className?: string;
  tone?: 'paper' | 'onBrand';
}) {
  return (
    <div
      className={cn(
        'form-section-label',
        tone === 'onBrand' && '[&::after]:bg-line-on-brand text-on-brand-muted',
        className,
      )}
    >
      {index && <span className="text-accent-warm">{index}</span>}
      <span>{children}</span>
    </div>
  );
}

export function RegisterRow({
  index,
  title,
  description,
  tone = 'paper',
  className,
}: {
  index: string;
  title: string;
  description: string;
  tone?: 'paper' | 'onBrand';
  className?: string;
}) {
  return (
    <div
      className={cn(
        'flex gap-4 py-4',
        tone === 'paper'
          ? 'register-row'
          : 'border-b border-line-on-brand last:border-b-0',
        className,
      )}
    >
      <span className="shrink-0 font-numeric text-xs font-semibold text-accent-warm">{index}</span>
      <div className="min-w-0 flex-1">
        <h3 className={cn('text-sm font-semibold', tone === 'onBrand' ? 'text-on-brand' : 'text-foreground')}>
          {title}
        </h3>
        <p className={cn('mt-1 text-xs leading-relaxed sm:text-sm', tone === 'onBrand' ? 'text-on-brand-muted' : 'text-muted-foreground')}>
          {description}
        </p>
      </div>
    </div>
  );
}

export function EditorialPanel({
  eyebrow,
  title,
  description,
  aside,
  className,
}: {
  eyebrow: string;
  title: string;
  description: string;
  aside?: ReactNode;
  className?: string;
}) {
  return (
    <section className={cn('editorial-panel rounded-xl p-6 sm:p-8 lg:p-10', className)}>
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_auto] lg:items-end">
        <div className="min-w-0">
          <p className="micro-label text-on-brand-muted">{eyebrow}</p>
          <h2 className="mt-4 font-display text-3xl font-semibold tracking-display text-on-brand sm:text-4xl lg:text-5xl">
            {title}
          </h2>
          <p className="mt-4 max-w-xl text-sm leading-relaxed text-on-brand-muted sm:text-base">
            {description}
          </p>
        </div>
        {aside && <div className="lg:w-40 lg:text-right">{aside}</div>}
      </div>
      <div className="ledger-rule mt-8" />
      <div className="mt-4 flex flex-wrap items-center justify-between gap-3 font-numeric text-2xs uppercase tracking-micro text-on-brand-quiet">
        <span>EDAM / Institutional register</span>
        <span>No live data</span>
      </div>
    </section>
  );
}
