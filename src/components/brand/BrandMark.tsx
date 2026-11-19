import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
  compact?: boolean;
}

/**
 * EDAM signature: a brass-ruled monogram plate and a serif wordmark. The
 * monogram is deliberately typographic rather than a generic bank icon.
 */
export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="relative flex h-11 w-11 shrink-0 items-center justify-center rounded-lg border border-line-accent bg-surface-subtle text-brand-ink">
        <span aria-hidden="true" className="font-display text-2xl font-semibold leading-none tracking-display">E</span>
        <span aria-hidden="true" className="absolute -right-1 -top-1 h-2.5 w-2.5 rounded-full border border-brand-ink bg-brand-teal" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-2xl font-semibold tracking-display text-inherit">EDAM</span>
          <span className="block font-numeric text-2xs uppercase tracking-brand opacity-70">
            Expense Governance
          </span>
        </span>
      )}
    </div>
  );
}
