import { cva, type VariantProps } from 'class-variance-authority';
import { AlertCircle, CheckCircle2, Info, TriangleAlert } from 'lucide-react';
import type { HTMLAttributes } from 'react';
import { cn } from '@/lib/utils';

const alertVariants = cva('relative flex w-full items-start gap-3 rounded-xl border p-4 text-sm', {
  variants: {
    variant: {
      default: 'border-border bg-card text-foreground',
      info: 'border-status-info-border bg-status-info-surface text-foreground',
      success: 'border-status-success-border bg-status-success-surface text-foreground',
      warning: 'border-status-warning-border bg-status-warning-surface text-foreground',
      destructive: 'border-status-destructive-border bg-status-destructive-surface text-foreground',
    },
  },
  defaultVariants: { variant: 'default' },
});

const icons = {
  default: Info,
  info: Info,
  success: CheckCircle2,
  warning: TriangleAlert,
  destructive: AlertCircle,
} as const;

export interface AlertProps
  extends HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof alertVariants> {}

export function Alert({ className, variant = 'default', children, ...props }: AlertProps) {
  const Icon = icons[variant ?? 'default'];
  return (
    <div role="alert" className={cn(alertVariants({ variant }), className)} {...props}>
      <Icon aria-hidden="true" className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="min-w-0">{children}</div>
    </div>
  );
}

export function AlertTitle({ className, children, ...props }: HTMLAttributes<HTMLHeadingElement>) {
  return (
    <h3 className={cn('font-semibold leading-none', className)} {...props}>
      {children}
    </h3>
  );
}

export function AlertDescription({ className, ...props }: HTMLAttributes<HTMLParagraphElement>) {
  return <p className={cn('mt-1 text-sm leading-relaxed text-muted-foreground', className)} {...props} />;
}
