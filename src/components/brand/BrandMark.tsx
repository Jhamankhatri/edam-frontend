import { Landmark } from 'lucide-react';
import { cn } from '@/lib/utils';

interface BrandMarkProps {
  className?: string;
  compact?: boolean;
}

export function BrandMark({ className, compact = false }: BrandMarkProps) {
  return (
    <div className={cn('flex items-center gap-3', className)}>
      <span className="relative flex h-11 w-11 items-center justify-center rounded-2xl bg-brand-gold text-brand-ink shadow-inset">
        <Landmark aria-hidden="true" className="h-5 w-5" strokeWidth={2.2} />
        <span aria-hidden="true" className="absolute -right-1 -top-1 h-3 w-3 rounded-full border-2 border-brand-navy bg-brand-teal" />
      </span>
      {!compact && (
        <span className="leading-tight">
          <span className="block font-display text-xl font-semibold tracking-wide text-inherit">EDAM</span>
          <span className="block brand-kicker opacity-70">
            Expense Governance
          </span>
        </span>
      )}
    </div>
  );
}
