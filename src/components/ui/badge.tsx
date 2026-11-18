import { cva, type VariantProps } from 'class-variance-authority';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const badgeVariants = cva(
  'inline-flex items-center gap-1.5 rounded-full border px-2.5 py-1 text-xs font-semibold transition-colors',
  {
    variants: {
      variant: {
        default: 'border-transparent bg-primary text-primary-foreground',
        secondary: 'border-transparent bg-secondary text-secondary-foreground',
        outline: 'border-border bg-card text-foreground',
        success: 'border-transparent bg-status-success-surface text-success',
        warning: 'border-transparent bg-status-warning-surface text-warning',
        destructive: 'border-transparent bg-status-destructive-surface text-destructive',
        info: 'border-transparent bg-status-info-surface text-info',
        muted: 'border-transparent bg-muted text-muted-foreground',
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
