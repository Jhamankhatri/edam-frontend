import type { ReactNode } from 'react';
import { Surface } from '@/components/ui/surface';
import { SectionLabel } from '@/components/ui/register';

interface EmptyStateProps {
  index?: string;
  title: string;
  description: string;
  action?: ReactNode;
}

/** A ruled empty state: no simulated rows, counters or illustrative data. */
export function EmptyState({ index, title, description, action }: EmptyStateProps) {
  return (
    <Surface variant="quiet" padding="lg" className="text-center">
      <SectionLabel index={index}>{title}</SectionLabel>
      <p className="mx-auto mt-4 max-w-xl text-sm leading-relaxed text-muted-foreground">
        {description}
      </p>
      {action && <div className="mt-5 flex justify-center">{action}</div>}
    </Surface>
  );
}
