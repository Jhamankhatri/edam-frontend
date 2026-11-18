import { Slot } from '@radix-ui/react-slot';
import { cva, type VariantProps } from 'class-variance-authority';
import { Loader2 } from 'lucide-react';
import {
  cloneElement,
  forwardRef,
  isValidElement,
  type ButtonHTMLAttributes,
  type ReactElement,
  type ReactNode,
} from 'react';
import { cn } from '@/lib/utils';

export const buttonVariants = cva(
  'inline-flex min-h-10 items-center justify-center gap-2 whitespace-nowrap rounded-lg px-4 py-2 text-sm font-semibold transition-all duration-150 focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-60 active:translate-y-px',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground shadow-soft hover:brightness-95',
        secondary: 'bg-secondary text-secondary-foreground hover:brightness-95',
        outline: 'border border-border bg-card text-foreground hover:bg-muted',
        ghost: 'text-foreground hover:bg-muted',
        destructive: 'bg-destructive text-destructive-foreground hover:brightness-95',
        link: 'text-primary underline-offset-4 hover:underline',
        gold: 'bg-brand-gold text-brand-ink shadow-soft hover:brightness-95',
      },
      size: {
        default: 'h-10 px-4 py-2',
        sm: 'h-9 rounded-md px-3 text-sm',
        lg: 'h-11 rounded-xl px-6 text-base',
        icon: 'h-10 w-10 p-0',
      },
    },
    defaultVariants: { variant: 'default', size: 'default' },
  },
);

export interface ButtonProps
  extends ButtonHTMLAttributes<HTMLButtonElement>,
    VariantProps<typeof buttonVariants> {
  asChild?: boolean;
  loading?: boolean;
}

interface SlotChildProps {
  children?: ReactNode;
}

function createSlotChild(children: ReactNode, spinner: ReactNode): ReactElement<SlotChildProps> {
  if (isValidElement<SlotChildProps>(children)) {
    return cloneElement(
      children,
      undefined,
      <span className="inline-flex items-center gap-2">
        {spinner}
        {children.props.children}
      </span>,
    );
  }
  return (
    <span className="inline-flex items-center gap-2">
      {spinner}
      {children}
    </span>
  );
}

export const Button = forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, variant, size, asChild = false, loading = false, children, disabled, ...props }, ref) => {
    const Comp = asChild ? Slot : 'button';
    const spinner = loading ? <Loader2 aria-hidden="true" className="h-4 w-4 animate-spin" /> : null;
    const content = (
      <>
        {spinner}
        {children}
      </>
    );
    const slottedChild = asChild ? createSlotChild(children, spinner) : null;

    return (
      <Comp
        className={cn(buttonVariants({ variant, size, className }))}
        ref={ref}
        disabled={asChild ? undefined : disabled || loading}
        aria-disabled={asChild && (disabled || loading) ? true : undefined}
        aria-busy={loading || undefined}
        {...props}
      >
        {asChild ? slottedChild : content}
      </Comp>
    );
  },
);
Button.displayName = 'Button';
