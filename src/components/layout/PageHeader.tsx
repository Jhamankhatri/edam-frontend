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
 * One editorial page-title pattern for every current and future module. Small
 * monospace references, a serif title and a brass-ledger rule — no generic
 * dashboard heading block.
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
            <p className="mb-3 flex items-center gap-2 font-numeric text-2xs font-semibold uppercase tracking-eyebrow-wide text-muted-foreground">
              <span aria-hidden="true" className="h-px w-8 bg-line-accent" />
              {eyebrow}
            </p>
          )}
          <div className="flex flex-wrap items-center gap-x-3 gap-y-2">
            <h1 id={id} className="font-display text-3xl font-semibold tracking-display sm:text-4xl">
              {title}
            </h1>
            {status}
          </div>
          {description && (
            <p className="mt-3 max-w-2xl text-sm leading-relaxed text-muted-foreground sm:text-base">
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
      <div aria-hidden="true" className="ledger-rule mt-6" />
    </header>
  );
}
