import { Surface } from '@/components/ui/surface';

/** Skeleton rows for registers; no spinner is placed inside a data table. */
export function LoadingRows({ rows = 5, label }: { rows?: number; label: string }) {
  return (
    <Surface variant="flat" padding="md" aria-busy="true" aria-label={label}>
      <div className="space-y-3">
        {Array.from({ length: rows }, (_, index) => (
          <div key={index} className="flex items-center gap-4 py-2">
            <span className="skeleton-shimmer h-3 w-8 rounded-pill bg-skeleton" />
            <span className="skeleton-shimmer h-3 flex-1 rounded-pill bg-skeleton" />
            <span className="skeleton-shimmer hidden h-3 w-24 rounded-pill bg-skeleton sm:block" />
          </div>
        ))}
      </div>
    </Surface>
  );
}
