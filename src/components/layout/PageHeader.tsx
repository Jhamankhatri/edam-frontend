import type { ReactNode } from 'react';
import { cn } from '@/lib/utils';

interface PageHeaderProps {
  title: string;
  eyebrow?: string;
  description?: string;
  status?: ReactNode;
  meta?: ReactNode;
  actions?: ReactNode;
  id?: string;
  className?: string;
}

/**
 * One page-title pattern for every current and future module. It owns the
 * heading hierarchy, the signature rule, status/metadata placement and the
 * responsive stacking; modules supply content, not layout.
 */
export function PageHeader({
  title,
  eyebrow,
  description,
  status,
  meta,
  actions,
  id = 'page-heading',
  className,
}: PageHeaderProps) {
  return (
    <header className={cn('mb-6 sm:mb-8', className)}>
      <div className="flex flex-col gap-4 lg:flex-row lg:items-end lg:justify-between">
        <div className="min-w-0">
          {eyebrow && (
            <p className="micro-label mb-3 flex items-center gap-2 text-primary">
              <span aria-hidden="true" className="h-px w-6 bg-accent-warm" />
              {eyebrow}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 id={id} className="font-display text-2xl font-semibold tracking-tight sm:text-3xl">
              {title}
            </h1>
            {status}
          </div>
          {description && (
            <p className="mt-2 max-w-2xl text-sm leading-relaxed text-muted-foreground">
              {description}
            </p>
          )}
        </div>
        {(meta || actions) && (
          <div className="flex shrink-0 flex-wrap items-center gap-2 lg:justify-end">
            {meta}
            {actions}
          </div>
        )}
      </div>
      <div aria-hidden="true" className="mt-6 h-px w-full bg-gradient-to-r from-line via-line-strong to-transparent" />
    </header>
  );
}
