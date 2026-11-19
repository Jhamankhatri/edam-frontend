import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-pill border px-2.5 py-1 text-xs font-semibold transition-colors duration-150',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground shadow-soft',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-line-strong bg-surface text-foreground shadow-soft',
        success: 'border-status-success-border bg-status-success-surface text-success',
        warning: 'border-status-warning-border bg-status-warning-surface text-warning',
        destructive: 'border-status-destructive-border bg-status-destructive-surface text-destructive',
        info: 'border-status-info-border bg-status-info-surface text-info',
        muted: 'border-transparent bg-muted text-muted-foreground',
        preview: 'rounded-md border-dashed border-line-strong bg-surface-subtle font-numeric text-2xs uppercase tracking-eyebrow-wide text-muted-foreground',
      },
    },
    defaultVariants: { variant: 'default' },
  },
);

export interface BadgeProps
  extends HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {}

export function Badge({ className, variant, ...props }: BadgeProps) {
  return <span className={cn(badgeVariants({ variant }), className)} {...props} />;
}

/** Status is always a dot plus text, never colour alone. */
export function StatusBadge({ label, variant = 'muted' }: { label: string; variant?: BadgeProps['variant'] }) {
  const dotClass = cn('h-1.5 w-1.5 rounded-full', {
    'bg-primary-foreground': variant === 'default',
    'bg-secondary-foreground': variant === 'secondary',
    'bg-foreground': variant === 'outline' || variant === 'muted',
    'bg-success': variant === 'success',
    'bg-warning': variant === 'warning',
    'bg-destructive': variant === 'destructive',
    'bg-info': variant === 'info',
  });
  return (
    <Badge variant={variant}>
      <span aria-hidden="true" className={dotClass} />
      {label}
    </Badge>
  );
}
