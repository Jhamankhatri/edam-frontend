import {
  Children,
  Fragment,
  cloneElement,
  isValidElement,
  type ReactElement,
  type ReactNode,
} from 'react';
import { Label } from '@/components/ui/label';
import { cn } from '@/lib/utils';

interface FormFieldProps {
  id: string;
  label: string;
  error?: string;
  hint?: string;
  children: ReactNode;
  className?: string;
}

type AriaProps = Record<string, unknown>;

/**
 * Associates hint/error text with the actual control, including controls nested
 * inside icon wrappers. Keeps a single label/description contract for every
 * form without duplicating aria wiring in each feature.
 */
function decorate(node: ReactNode, describedBy: string, invalid: boolean): ReactNode {
  if (!isValidElement(node)) return node;
  const element = node as ReactElement<AriaProps>;
  const props = element.props;
  const existing = typeof props['aria-describedby'] === 'string' ? props['aria-describedby'] : '';
  const merged = [existing, describedBy].filter(Boolean).join(' ') || undefined;
  const aria = { 'aria-describedby': merged, 'aria-invalid': invalid || undefined } as AriaProps;

  if (typeof element.type === 'string') {
    if (['input', 'select', 'textarea'].includes(element.type)) {
      return cloneElement(element, aria);
    }
    if (props.children) {
      return cloneElement(
        element,
        undefined,
        Children.map(props.children as ReactNode, (child) => decorate(child, describedBy, invalid)),
      );
    }
    return node;
  }

  if (element.type === Fragment) {
    return cloneElement(
      element,
      undefined,
      Children.map(props.children as ReactNode, (child) => decorate(child, describedBy, invalid)),
    );
  }

  // Custom controls (Input, PasswordInput) forward native ARIA attributes to
  // their underlying DOM control.
  return cloneElement(element, aria);
}

export function FormField({ id, label, error, hint, children, className }: FormFieldProps) {
  const hintId = `${id}-hint`;
  const errorId = `${id}-error`;
  const describedBy = [hint ? hintId : null, error ? errorId : null].filter(Boolean).join(' ');
  const control = describedBy || error ? decorate(children, describedBy, Boolean(error)) : children;

  return (
    <div className={cn('space-y-2', className)}>
      <Label htmlFor={id}>{label}</Label>
      {control}
      {hint && !error && (
        <p id={hintId} className="text-xs leading-relaxed text-muted-foreground">{hint}</p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-xs font-medium text-destructive">
          {error}
        </p>
      )}
    </div>
  );
}
