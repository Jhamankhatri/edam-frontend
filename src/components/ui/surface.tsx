import { cva, type VariantProps } from 'class-variance-authority';
import { forwardRef, type HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

/**
 * The single layered-surface primitive for the product. Every variant resolves
 * to tokens.css; `interactive` adds a restrained hover lift used only where a
 * surface itself is a link/card action. It never adds a nonfunctional control.
 */
export const surfaceVariants = cva(
  'relative border transition-[box-shadow,border-color,transform] duration-240 ease-standard',
  {
    variants: {
      variant: {
        raised: 'surface-layered',
        flat: 'rounded-2xl border-line bg-surface shadow-soft',
        inset: 'rounded-xl border-line-soft bg-surface-subtle',
        quiet: 'rounded-2xl border-line bg-surface-subtle',
        brand: 'rounded-2xl border-line-on-brand bg-brand-panel-surface text-on-brand',
      },
      padding: {
        none: '',
        sm: 'p-4',
        md: 'p-5 sm:p-6',
        lg: 'p-6 sm:p-8',
      },
      interactive: {
        true: 'hover:-translate-y-0.5 hover:border-line-strong hover:shadow-elevated',
        false: '',
      },
    },
    defaultVariants: { variant: 'raised', padding: 'md', interactive: false },
  },
);

export interface SurfaceProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof surfaceVariants> {}

export const Surface = forwardRef<HTMLDivElement, SurfaceProps>(
  ({ className, variant, padding, interactive, ...props }, ref) => (
    <div
      ref={ref}
      className={cn(surfaceVariants({ variant, padding, interactive }), className)}
      {...props}
    />
  ),
);
Surface.displayName = 'Surface';
