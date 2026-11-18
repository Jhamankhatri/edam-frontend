import { cn } from '@/lib/utils';

/**
 * Static ambient depth for the institutional brand panel. It is deliberately
 * motionless: composition, grid and restrained glow only. No continuous
 * decorative movement, WebGL or heavy backdrop blur.
 */
export function AmbientCanvas({ className }: { className?: string }) {
  return (
    <div aria-hidden="true" className={cn('absolute inset-0 overflow-hidden', className)}>
      <div className="bank-grid absolute inset-0 opacity-60" />
      <div className="absolute -right-24 top-1/4 h-80 w-80 rounded-full border border-brand-panel-border" />
      <div className="absolute -right-8 top-1/3 h-56 w-56 rounded-full border border-brand-panel-gold-border" />
      <div className="absolute right-24 top-1/2 h-24 w-24 rounded-full bg-brand-panel-subtle" />
      <div className="absolute -bottom-32 -left-24 h-72 w-72 rounded-full bg-brand-panel-subtle" />
      <div className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-brand-panel-border-strong to-transparent" />
    </div>
  );
}
