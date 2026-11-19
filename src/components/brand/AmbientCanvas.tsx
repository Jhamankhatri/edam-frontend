import { cn } from '@/lib/utils';

/**
 * Static "ledger" depth for the institutional authority panel: ruled paper,
 * a brass margin rule and a corner register mark. Deliberately motionless —
 * no circles, glows, continuous movement, WebGL or heavy backdrop blur.
 */
export function AmbientCanvas({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="bank-grid absolute inset-0 opacity-70" />
      <div className="absolute inset-y-0 left-8 w-px bg-line-accent opacity-60" />
      <div className="absolute inset-x-0 top-1/3 h-px bg-line-accent opacity-25" />
      <div className="absolute inset-x-0 top-2/3 h-px bg-line-accent opacity-25" />
      <div className="absolute right-8 top-8 h-10 w-10 border-r border-t border-line-accent opacity-70" />
      <div className="absolute bottom-8 left-8 h-10 w-10 border-b border-l border-line-accent opacity-40" />
      <span className="absolute bottom-16 left-10 font-display text-6xl font-semibold tracking-display text-on-brand-faint opacity-20">01</span>
    </div>
  );
}
