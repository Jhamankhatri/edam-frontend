import { ChevronRight, Home } from 'lucide-react';
import type { PageMeta } from '@/config/route-access';
import { cn } from '@/lib/utils';

export function Breadcrumbs({ meta, className }: { meta: PageMeta; className?: string }) {
  return (
    <nav aria-label="Breadcrumb" className={cn('min-w-0', className)}>
      <ol className="flex min-w-0 items-center gap-1.5 font-numeric text-2xs uppercase tracking-micro text-muted-foreground">
        {meta.breadcrumbs.map((crumb, index) => (
          <li key={`${crumb}-${index}`} className="flex min-w-0 items-center gap-1.5">
            {index > 0 && <ChevronRight aria-hidden="true" className="h-3.5 w-3.5 shrink-0 opacity-60" />}
            {index === 0 ? <Home aria-hidden="true" className="hidden h-3.5 w-3.5 sm:block" /> : null}
            <span className={cn('truncate', index === meta.breadcrumbs.length - 1 && 'font-semibold text-foreground')}>
              {crumb}
            </span>
          </li>
        ))}
      </ol>
    </nav>
  );
}
